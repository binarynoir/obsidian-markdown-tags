# Research Notes

## Project Overview

### Research Topics

<!-- Status tags with default colors -->

((tag|todo)) ((tag|in-progress)) ((tag|done))

- **Topic 1**: Literature review on AI ethics ((tag|in-progress))
- **Topic 2**: Data collection methods ((tag|todo))
- **Topic 3**: Analysis of survey results ((tag|done))

### Reading List

<!-- Tags with custom labels and default colors -->

((tag|to-read)) ((tag|reading)) ((tag|read))

- **Book 1**: "Artificial Intelligence: A Modern Approach" ((tag|to-read))
- **Book 2**: "Data Science for Business" ((tag|reading))
- **Book 3**: "Deep Learning" ((tag|read))

## Research Plan

### Phases

<!-- Arrow-style tags with default colors -->

((<tag|planned)) ((<tag|in-progress)) ((<tag|completed))

- **Phase 1**: Define research questions ((<tag|planned))
- **Phase 2**: Conduct experiments ((<tag|in-progress))
- **Phase 3**: Write thesis ((<tag|completed))

## Custom Tags

### Importance Levels

<!-- Tags with custom background and foreground colors -->

((tag|high-importance|#ff4500)) ((tag|medium-importance|#ffd700)) ((tag|low-importance|#32cd32))

- **Urgent Task**: Submit research proposal ((tag|high-importance|#ff4500))
- **Regular Task**: Schedule meetings with advisor ((tag|medium-importance|#ffd700))
- **Optional Task**: Attend AI conference ((tag|low-importance|#32cd32))

## Code and Exclusions

### Fenced Code Blocks

<!-- Tags inside code must stay as plain text in every mode -->

```
((tag|todo))
((tag/done))
((<tag|in-progress))
```

```markdown
- A task ((tag|todo))
```

```
((tag|tilde fence))
```

A tag directly after a code block ((tag|done))

### Inline Code

Inline code stays plain: `((tag|todo))` and `((<tag/done))`

A real tag next to inline code ((tag|done)) `code`

### Indented Code

    ((tag|indented code))

### Comments and HTML

<!-- ((tag|inside html comment)) -->

%% ((tag|inside obsidian comment)) %%

## Escaping and Special Characters

### Labels That Need Escaping

<!-- Must show exactly as typed, with no HTML entities visible -->

((tag|R&D)) ((tag|a < b)) ((tag|"quoted")) ((tag|it's done)) ((tag|50% done))

### Unicode

((tag|café)) ((tag|日本語)) ((tag|✅ shipped))

## Editing Behaviour

Use this section in Live Preview. Each step checks one thing.

### Cursor Reveal

Click inside this tag and the raw text should appear: ((tag|todo))

Arrow keys through this line should reveal and re-render the tag as the cursor passes: ((<tag|in-progress))

### Typing a New Tag

Type a new tag at the end of this line, ending with the closing parentheses, and it should render when the cursor leaves it:

### Breaking and Repairing a Tag

Delete the final `)` of this tag and it should revert to plain text, then type it back: ((tag|done))

### Undo and Redo

Edit this tag, then undo and redo with Cmd+Z and Cmd+Shift+Z: ((tag|planned))

### Select and Delete

Select this whole tag with the mouse and press delete: ((tag|blocked))

### Copy and Paste

Copy this tag, paste it elsewhere in the note, and the copy should render: ((tag|tip))

## Many Tags

### One Tag per Line

((tag|todo))
((tag|planned))
((tag|in-progress))
((tag|doing))
((tag|done))
((tag|blocked))
((tag|canceled))

### Many on One Line

((tag|todo)) ((tag|planned)) ((tag|in-progress)) ((tag|doing)) ((tag|done)) ((tag|tip)) ((tag|on-hold)) ((tag|tbd)) ((tag|proposed)) ((tag|draft)) ((tag|wip)) ((tag|mvp)) ((tag|blocked)) ((tag|canceled)) ((tag|error)) ((tag|warning)) ((tag|warn)) ((<tag|todo)) ((<tag|planned)) ((<tag|in-progress)) ((<tag|doing)) ((<tag|done)) ((<tag|tip)) ((<tag|on-hold)) ((<tag|tbd))

### Repeated Identical Tags

((tag|done)) and ((tag|done)) and ((tag|done)) on one line

## Plain Text Neighbours

These look like tags but are not, and must stay as typed:

((tag|todo) missing a closing parenthesis
((label|todo)) wrong keyword
(tag|todo) single parentheses
((tag)) no separator
((tag|)) empty label

## Performance

For a large-note check, copy the "Many Tags" section 50 or more times into a scratch note and confirm typing stays responsive in Live Preview.
