import { Plugin, MarkdownPostProcessorContext } from "obsidian";
import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";

// Define label and color maps for tags
const labelMap = [
	"todo",
	"planned",
	"in-progress",
	"doing",
	"done",
	"tip",
	"on-hold",
	"tbd",
	"proposed",
	"draft",
	"wip",
	"mvp",
	"blocked",
	"canceled",
	"error",
	"warning",
	"warn",
];
const colorMap = ["grey", "green", "yellow", "orange", "blue", "purple", "red"];

// Regular expression to match custom tag syntax like ((tag|label|bgcolor|fgcolor)) or ((tag/label/bgcolor/fgcolor))
// Supports both | and / as separators
const tagSyntaxRegex =
	/\(\(<?tag(?:[|/])(?<label>[^|/)]+)(?:[|/](?<bgcolor>[^|/)]*))?(?:[|/](?<fgcolor>[^|/)]*))?\)\)/g;

// A table row has a pipe outside of any tag, since the default tag syntax uses | itself as a separator.
// Uses its own regex instance because replace() resets lastIndex on a shared global regex.
const isTableRow = (text: string): boolean => text.replace(new RegExp(tagSyntaxRegex.source, "g"), "").includes("|");

const isValidHexColor = (color: string): boolean => /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);

const isValidColor = (color: string): boolean => isValidHexColor(color) || colorMap.includes(color.toLowerCase());

// Escapes text the way innerHTML serializes it (& < > only), so the escaped tag can be found in innerHTML
// and the label can be placed in element text. Quotes are left alone because they never appear in an attribute.
const escapeHtml = (str: string): string =>
	str.replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[char] || char);

// Single source of truth for a tag's classes and inline style, shared by edit mode, tables and reader view
const getTagRender = (label: string, bgcolor: string, fgcolor: string, arrow: boolean) => {
	const validBgColor = bgcolor && isValidColor(bgcolor) ? bgcolor : "";
	const validFgColor = fgcolor && isValidColor(fgcolor) ? fgcolor : "";

	const labelClass = labelMap.includes(label.toLowerCase()) ? label.toLowerCase() : "";
	const bgColorClass =
		validBgColor && colorMap.includes(validBgColor.toLowerCase()) ? validBgColor.toLowerCase() : "grey";
	const bgCustomColor = validBgColor && isValidHexColor(validBgColor) ? validBgColor : null;
	const fgCustomColor = validFgColor && isValidHexColor(validFgColor) ? validFgColor : null;

	return {
		className: `bn-tags ${labelClass} ${bgColorClass} ${arrow ? "bn-arrow-tags" : ""}`.trim(),
		style: `${bgCustomColor ? `background-color: ${bgCustomColor};` : ""}${fgCustomColor ? ` color: ${fgCustomColor};` : ""}`,
	};
};

const createTagElement = (label: string, bgcolor: string, fgcolor: string, arrow: boolean): HTMLElement => {
	const { className, style } = getTagRender(label, bgcolor, fgcolor, arrow);
	const span = document.createElement("span");
	span.className = className;
	span.setAttribute("style", style);
	// textContent does not interpret HTML, so the raw label must not be escaped here
	span.textContent = label;
	return span;
};

class TagWidget extends WidgetType {
	constructor(
		private label: string,
		private bgcolor: string,
		private fgcolor: string,
		private arrow: boolean,
	) {
		super();
	}

	toDOM(): HTMLElement {
		return createTagElement(this.label, this.bgcolor, this.fgcolor, this.arrow);
	}

	ignoreEvent(): boolean {
		return false;
	}
}

export default class tagsPlugin extends Plugin {
	private tableObserver: MutationObserver | null = null;
	private tableTimer: number | null = null;

	async onload() {
		// Register the CodeMirror plugin for the editor
		this.registerEditorExtension(this.editModeTagsHighlighter());

		// Register the MarkdownPostProcessor for reader view
		this.registerMarkdownPostProcessor(this.viewModeTagsHighlighter());

		// Set up table cell monitoring for edit mode
		this.setupTableCellObserver();
	}

	onunload() {
		if (this.tableObserver) {
			this.tableObserver.disconnect();
			this.tableObserver = null;
		}
		if (this.tableTimer !== null) {
			window.clearTimeout(this.tableTimer);
			this.tableTimer = null;
		}
	}

	private setupTableCellObserver() {
		// Wait for workspace to be ready
		this.app.workspace.onLayoutReady(() => {
			this.tableObserver = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if (mutation.type === "childList" || mutation.type === "characterData") {
						// Check if the mutation affects table content
						// characterData mutations target a Text node, which has no closest()
						const target =
							mutation.target instanceof Element ? mutation.target : mutation.target.parentElement;
						if (target?.closest(".cm-editor")) {
							this.scheduleTableProcessing();
						}
					}
				});
			});

			// Observe the whole workspace so every pane is covered, not just the leaf active at load
			this.tableObserver.observe(this.app.workspace.containerEl, {
				childList: true,
				subtree: true,
				characterData: true,
			});

			// Also run initial processing
			this.scheduleTableProcessing(500);
		});
	}

	// Debounced so a burst of mutations triggers one pass, after Obsidian finishes its table updates
	private scheduleTableProcessing(delay = 100) {
		if (this.tableTimer !== null) window.clearTimeout(this.tableTimer);
		this.tableTimer = window.setTimeout(() => {
			this.tableTimer = null;
			this.processEditModeTableCells();
		}, delay);
	}

	private processEditModeTableCells() {
		// Find all CodeMirror editors in the workspace
		const editors = document.querySelectorAll(".cm-editor");

		editors.forEach((editor) => {
			// Find all lines that look like table rows
			const lines = editor.querySelectorAll(".cm-line");

			lines.forEach((line) => {
				const lineText = line.textContent || "";
				// Only process table rows; other tags are decorated by the editor extension
				if (!isTableRow(lineText)) return;

				// Check if this line contains our tag syntax
				tagSyntaxRegex.lastIndex = 0;
				if (tagSyntaxRegex.test(lineText)) {
					this.processTableLineForTags(line as HTMLElement);
				}
			});
		});

		// Live Preview rebuilds a table as plain rendered cells when the cursor leaves it. Those cells have no
		// .cm-line, so process them directly, skipping a cell that contains an editor (it is being edited).
		document.querySelectorAll(".cm-table-widget td, .cm-table-widget th").forEach((cell) => {
			if (cell.querySelector(".cm-editor")) return;
			this.processTableLineForTags(cell as HTMLElement);
		});
	}

	private processTableLineForTags(lineElement: HTMLElement) {
		// Find text nodes that contain our tag syntax
		const walker = document.createTreeWalker(lineElement, NodeFilter.SHOW_TEXT, null);

		const textNodes: Text[] = [];
		let node: Node | null;
		while ((node = walker.nextNode()) !== null) {
			const text = node.textContent || "";
			tagSyntaxRegex.lastIndex = 0;
			if (tagSyntaxRegex.test(text)) {
				textNodes.push(node as Text);
			}
		}

		// Process each text node that contains tags
		textNodes.forEach((textNode) => {
			this.replaceTagsInTextNode(textNode);
		});
	}

	private replaceTagsInTextNode(textNode: Text) {
		const text = textNode.textContent || "";
		const parent = textNode.parentNode;
		if (!parent) return;

		// Create a document fragment to hold the new content
		const fragment = document.createDocumentFragment();
		let lastIndex = 0;

		tagSyntaxRegex.lastIndex = 0;
		let match;

		while ((match = tagSyntaxRegex.exec(text)) !== null) {
			// Add text before the match
			if (match.index > lastIndex) {
				fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
			}

			// Create the styled span for the tag
			const { label = "", bgcolor = "", fgcolor = "" } = match.groups ?? {};
			fragment.appendChild(createTagElement(label, bgcolor, fgcolor, match[0].startsWith("((<")));

			lastIndex = match.index + match[0].length;
		}

		// Add remaining text after the last match
		if (lastIndex < text.length) {
			fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
		}

		// Only replace if we actually found matches
		if (lastIndex > 0) {
			parent.replaceChild(fragment, textNode);
		}
	}

	private editModeTagsHighlighter() {
		return ViewPlugin.fromClass(
			class {
				decorations: DecorationSet;

				constructor(view: EditorView) {
					this.decorations = this.buildDecorations(view);
				}

				update(update: ViewUpdate) {
					if (update.docChanged || update.viewportChanged || update.selectionSet) {
						this.decorations = this.buildDecorations(update.view);
					}
				}

				buildDecorations(view: EditorView): DecorationSet {
					const builder = new RangeSetBuilder<Decoration>();
					const cursorPos = view.state.selection.main.head;

					// Single pass over the document to find which lines sit inside fenced code blocks
					const codeLines = new Set<number>();
					let inCodeBlock = false;
					for (let i = 1; i <= view.state.doc.lines; i++) {
						if (view.state.doc.line(i).text.trim().startsWith("```")) {
							inCodeBlock = !inCodeBlock;
						}
						if (inCodeBlock) {
							codeLines.add(i);
						}
					}

					const fullText = view.state.doc.toString();
					let match;
					tagSyntaxRegex.lastIndex = 0;

					while ((match = tagSyntaxRegex.exec(fullText)) !== null) {
						const start = match.index ?? 0;
						const end = start + match[0].length;
						const tagLine = view.state.doc.lineAt(start);

						// Skip if in code block
						if (codeLines.has(tagLine.number)) {
							continue;
						}

						// Skip table lines - let DOM manipulation handle them
						if (isTableRow(tagLine.text) && !tagLine.text.trim().startsWith("```")) {
							continue;
						}

						// Skip if cursor is within the tag
						if (cursorPos >= start && cursorPos <= end) {
							continue;
						}

						const { label = "", bgcolor = "", fgcolor = "" } = match.groups ?? {};
						const widget = new TagWidget(label, bgcolor, fgcolor, match[0].startsWith("((<"));
						builder.add(start, end, Decoration.replace({ widget }));
					}

					return builder.finish() as DecorationSet;
				}
			},
			{ decorations: (v) => v.decorations },
		);
	}

	private viewModeTagsHighlighter() {
		return (el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
			const tags = Array.from(el.querySelectorAll("p, li, span, div, td, th"));

			tags.forEach((tagElement) => {
				const originalText = tagElement.textContent;
				if (!originalText) return;

				let match: RegExpExecArray | null;
				let updatedHTML = tagElement.innerHTML;
				let matchFound = false;

				tagSyntaxRegex.lastIndex = 0;

				while ((match = tagSyntaxRegex.exec(originalText)) !== null) {
					matchFound = true;
					const { label = "", bgcolor = "", fgcolor = "" } = match.groups ?? {};
					const { className, style } = getTagRender(label, bgcolor, fgcolor, match[0].startsWith("((<"));
					// innerHTML does interpret HTML, so the label is escaped here
					const replacement = `<span class="${className}" style="${style}">${escapeHtml(label)}</span>`;
					const escapedMatch = escapeHtml(match[0]);
					updatedHTML = updatedHTML.replace(escapedMatch, replacement);
				}

				if (matchFound) {
					tagElement.innerHTML = updatedHTML;
				}
			});
		};
	}
}
