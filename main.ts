import { Plugin } from "obsidian";
import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";

// Define label and color maps for tags
const labelMap = [
	"todo", "planned", "in-progress", "doing", "done", "tip",
	"on-hold", "tbd", "proposed", "draft", "wip", "mvp",
	"blocked", "canceled", "error", "warning", "warn"
];
const colorMap = ["grey", "green", "yellow", "orange", "blue", "purple", "red"];

// Regular expression to match custom tag syntax like [[tag|label|bgcolor|fgcolor]]
const tagSyntaxRegex = /\[\[<?tag\|(?<label>[^\]|]+)(?:\|(?<bgcolor>[^\]|]*))?(?:\|(?<fgcolor>[^\]|]*))?\]\]/g;

const isValidHexColor = (color: string): boolean => /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);

const isValidColor = (color: string): boolean => isValidHexColor(color) || colorMap.includes(color.toLowerCase());

const escapeHtml = (str: string): string => str.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] || char));

function generateTagDecoration(label: string, bgcolor?: string, fgcolor?: string, arrow = false): Decoration {

	// Determine if the label is in the predefined label map
	const labelClass = labelMap.includes(label.toLowerCase()) ? label.toLowerCase() : '';
	// Determine the background color class from the color map, defaulting to 'grey'
	const bgColorClass = bgcolor && colorMap.includes(bgcolor.toLowerCase()) ? bgcolor.toLowerCase() : 'grey';
	// Check if a valid custom background color is provided
	const bgCustomColor = bgcolor && isValidHexColor(bgcolor) ? bgcolor : null;
	// Check if a valid custom foreground color is provided
	const fgCustomColor = fgcolor && isValidHexColor(fgcolor) ? fgcolor : null;

	// Combine classes, adding 'arrow-tags' if the arrow flag is true
	const combinedClasses = `tags ${labelClass} ${bgColorClass} ${arrow ? 'arrow-tags' : ''}`.trim();

	// Build inline style if custom background or foreground colors are provided
	const style = `${bgCustomColor ? `background-color: ${bgCustomColor};` : ''}${fgCustomColor ? ` color: ${fgCustomColor};` : ''}`;

	// Return the decoration with the combined classes and inline style attributes
	return Decoration.mark({
		class: combinedClasses,
		attributes: {
			style: style
		}
	});
}

export default class tagsPlugin extends Plugin {
	async onload() {
		// Register the CodeMirror plugin
		this.registerEditorExtension(this.tagsHighlighter());
	}

	onunload() {
	}

	private tagsHighlighter() {
		// Define the ViewPlugin
		return ViewPlugin.fromClass(class {
			decorations: DecorationSet;

			constructor(view: EditorView) {
				this.decorations = this.buildDecorations(view);
			}

			// Update decorations on document or viewport change
			update(update: ViewUpdate) {
				if (update.docChanged || update.viewportChanged || update.selectionSet) {
					this.decorations = this.buildDecorations(update.view);
				}
			}

			// Build decorations for tag syntax patterns
			buildDecorations(view: EditorView): DecorationSet {
				const builder = new RangeSetBuilder<Decoration>();
				const cursorPos = view.state.selection.main.head;

				for (const { from, to } of view.visibleRanges) {
					const text = view.state.doc.sliceString(from, to);
					let match;

					// Function to check if a position is inside a code block
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

					while ((match = tagSyntaxRegex.exec(text)) !== null) {
						const start = from + (match.index ?? 0); // Start of the match
						const end = start + match[0].length; // End of the match

						// Check if the cursor is within the match range or if the match is inside a code block
						if (cursorPos >= start && cursorPos <= end || isInCodeBlock(start)) {
							continue; // Skip adding decorations if the cursor is within the range or inside a code block
						}

						// Extract named groups with default values
						const { label = '', bgcolor = '', fgcolor = '' } = match.groups ?? {};

						const escapedLabel = escapeHtml(label);
						const validBgColor = bgcolor && isValidColor(bgcolor) ? bgcolor : '';
						const validFgColor = fgcolor && isValidColor(fgcolor) ? fgcolor : '';
						const arrow = match[0].startsWith("[[<");

						// Apply decoration to hide the leading part
						builder.add(start, start + match[0].indexOf(label), Decoration.mark({ class: "hidden" }));

						// Apply decoration to the inner text (label)
						builder.add(start + match[0].indexOf(label), start + match[0].indexOf(label) + label.length, generateTagDecoration(escapedLabel, validBgColor, validFgColor, arrow));

						// Apply decoration to hide the trailing part
						builder.add(start + match[0].indexOf(label) + label.length, end, Decoration.mark({ class: "hidden" }));
					}
				}

				return builder.finish() as DecorationSet;
			}
		}, { decorations: v => v.decorations });
	}
}