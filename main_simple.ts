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
	/\(\(<?tag(?:[|/])(?<label>[^|/\)]+)(?:[|/](?<bgcolor>[^|/\)]*))?(?:[|/](?<fgcolor>[^|/\)]*))?\)\)/g;

const isValidHexColor = (color: string): boolean => /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);
const isValidColor = (color: string): boolean => isValidHexColor(color) || colorMap.includes(color.toLowerCase());
const escapeHtml = (str: string): string =>
	str.replace(
		/[&<>"']/g,
		(char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] || char,
	);

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
		const span = document.createElement("span");

		const labelClass = labelMap.includes(this.label.toLowerCase()) ? this.label.toLowerCase() : "";
		const bgColorClass =
			this.bgcolor && colorMap.includes(this.bgcolor.toLowerCase()) ? this.bgcolor.toLowerCase() : "grey";
		const bgCustomColor = this.bgcolor && isValidHexColor(this.bgcolor) ? this.bgcolor : null;
		const fgCustomColor = this.fgcolor && isValidHexColor(this.fgcolor) ? this.fgcolor : null;

		const combinedClasses = `bn-tags ${labelClass} ${bgColorClass} ${this.arrow ? "bn-arrow-tags" : ""}`.trim();
		const style = `${bgCustomColor ? `background-color: ${bgCustomColor};` : ""}${fgCustomColor ? ` color: ${fgCustomColor};` : ""}`;

		span.className = combinedClasses;
		span.setAttribute("style", style);
		span.textContent = this.label;

		return span;
	}

	ignoreEvent(): boolean {
		return false;
	}
}

export default class tagsPlugin extends Plugin {
	async onload() {
		// Register the CodeMirror plugin for the editor
		this.registerEditorExtension(this.editModeTagsHighlighter());

		// Register the MarkdownPostProcessor for reader view
		this.registerMarkdownPostProcessor(this.viewModeTagsHighlighter());

		// Simple approach: use interval to keep table cells updated
		this.registerInterval(
			window.setInterval(() => {
				this.processTableCells();
			}, 1000),
		);
	}

	private processTableCells() {
		// Find all table cells in the current editor
		const editors = document.querySelectorAll(".cm-editor .cm-content .cm-line");

		editors.forEach((line: Element) => {
			const lineText = line.textContent || "";

			// Only process table lines
			if (!lineText.includes("|") || lineText.trim().startsWith("```")) {
				return;
			}

			// Skip if we already have our spans
			if (line.querySelector(".bn-tags")) {
				return;
			}

			// Check if line contains our syntax
			tagSyntaxRegex.lastIndex = 0;
			if (!tagSyntaxRegex.test(lineText)) {
				return;
			}

			// Process this table line
			this.processLineForTags(line as HTMLElement);
		});
	}

	private processLineForTags(lineElement: HTMLElement) {
		// Find text nodes containing our pattern
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

		// Replace tags in each text node
		textNodes.forEach((textNode) => {
			this.replaceTagsInTextNode(textNode);
		});
	}

	private replaceTagsInTextNode(textNode: Text) {
		const text = textNode.textContent || "";
		const parent = textNode.parentNode;
		if (!parent) return;

		let lastIndex = 0;
		const fragment = document.createDocumentFragment();
		let hasChanges = false;

		tagSyntaxRegex.lastIndex = 0;
		let match;

		while ((match = tagSyntaxRegex.exec(text)) !== null) {
			hasChanges = true;

			// Add text before match
			if (match.index > lastIndex) {
				fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
			}

			// Create tag span
			const { label = "", bgcolor = "", fgcolor = "" } = match.groups ?? {};
			const arrow = match[0].startsWith("((<");
			const span = this.createTagSpan(label, bgcolor, fgcolor, arrow);
			fragment.appendChild(span);

			lastIndex = match.index + match[0].length;
		}

		// Add remaining text
		if (lastIndex < text.length) {
			fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
		}

		if (hasChanges) {
			parent.replaceChild(fragment, textNode);
		}
	}

	private createTagSpan(label: string, bgcolor: string, fgcolor: string, arrow: boolean): HTMLSpanElement {
		const span = document.createElement("span");
		const escapedLabel = escapeHtml(label);
		const validBgColor = bgcolor && isValidColor(bgcolor) ? bgcolor : "";
		const validFgColor = fgcolor && isValidColor(fgcolor) ? fgcolor : "";

		const labelClass = labelMap.includes(escapedLabel.toLowerCase()) ? escapedLabel.toLowerCase() : "";
		const bgColorClass =
			validBgColor && colorMap.includes(validBgColor.toLowerCase()) ? validBgColor.toLowerCase() : "grey";
		const bgCustomColor = validBgColor && isValidHexColor(validBgColor) ? validBgColor : null;
		const fgCustomColor = validFgColor && isValidHexColor(validFgColor) ? validFgColor : null;

		const combinedClasses = `bn-tags ${labelClass} ${bgColorClass} ${arrow ? "bn-arrow-tags" : ""}`.trim();
		const style = `${bgCustomColor ? `background-color: ${bgCustomColor};` : ""}${fgCustomColor ? ` color: ${fgCustomColor};` : ""}`;

		span.className = combinedClasses;
		span.setAttribute("style", style);
		span.textContent = escapedLabel;

		return span;
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

					const isInCodeBlock = (pos: number): boolean => {
						const line = view.state.doc.lineAt(pos);
						let inCodeBlock = false;
						for (let i = 1; i <= view.state.doc.lines; i++) {
							const currentLine = view.state.doc.line(i).text.trim();
							if (currentLine.startsWith("```")) {
								inCodeBlock = !inCodeBlock;
							}
							if (i === line.number) {
								return inCodeBlock;
							}
						}
						return false;
					};

					const fullText = view.state.doc.toString();
					let match;
					tagSyntaxRegex.lastIndex = 0;

					while ((match = tagSyntaxRegex.exec(fullText)) !== null) {
						const start = match.index ?? 0;
						const end = start + match[0].length;
						const tagLine = view.state.doc.lineAt(start);

						// Skip if in code block
						if (isInCodeBlock(start)) {
							continue;
						}

						// Skip table lines - let interval processing handle them
						if (tagLine.text.includes("|") && !tagLine.text.trim().startsWith("```")) {
							continue;
						}

						// Skip if cursor is within the tag
						if (cursorPos >= start && cursorPos <= end) {
							continue;
						}

						const { label = "", bgcolor = "", fgcolor = "" } = match.groups ?? {};
						const escapedLabel = escapeHtml(label);
						const validBgColor = bgcolor && isValidColor(bgcolor) ? bgcolor : "";
						const validFgColor = fgcolor && isValidColor(fgcolor) ? fgcolor : "";
						const arrow = match[0].startsWith("((<");

						const widget = new TagWidget(escapedLabel, validBgColor, validFgColor, arrow);
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
					const escapedLabel = escapeHtml(label);
					const validBgColor = bgcolor && isValidColor(bgcolor) ? bgcolor : "";
					const validFgColor = fgcolor && isValidColor(fgcolor) ? fgcolor : "";
					const arrow = match[0].startsWith("((<");

					const labelClass = labelMap.includes(escapedLabel.toLowerCase()) ? escapedLabel.toLowerCase() : "";
					const bgColorClass =
						validBgColor && colorMap.includes(validBgColor.toLowerCase())
							? validBgColor.toLowerCase()
							: "grey";
					const bgCustomColor = validBgColor && isValidHexColor(validBgColor) ? validBgColor : null;
					const fgCustomColor = validFgColor && isValidHexColor(validFgColor) ? validFgColor : null;

					const combinedClasses =
						`bn-tags ${labelClass} ${bgColorClass} ${arrow ? "bn-arrow-tags" : ""}`.trim();
					const style = `${bgCustomColor ? `background-color: ${bgCustomColor};` : ""}${fgCustomColor ? ` color: ${fgCustomColor};` : ""}`;

					const replacement = `<span class="${combinedClasses}" style="${style}">${escapedLabel}</span>`;
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
