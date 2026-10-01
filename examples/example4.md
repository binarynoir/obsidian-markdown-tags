# Table Test

Use this note to check tags in tables in Live Preview, Source mode and Reading view. In Live Preview, also click into a cell and back out again: the tag should show raw text while the cursor is inside it and render again once the cursor leaves the table.

> **Note:** Inside a table, use `/` as the tag separator. A `|` would be read as a column break, so `((tag|done))` cannot be used in a table cell.

## Status Tags in Cells

<!-- Predefined labels with default colors -->

| Task            | Status              |
| --------------- | ------------------- |
| Write spec      | ((tag/done))        |
| Build prototype | ((tag/in-progress)) |
| Review feedback | ((tag/todo))        |
| Release         | ((tag/blocked))     |

## Every Predefined Label

| Labels                                                                                  |
| --------------------------------------------------------------------------------------- |
| ((tag/todo)) ((tag/planned)) ((tag/in-progress)) ((tag/doing)) ((tag/done)) ((tag/tip)) |
| ((tag/on-hold)) ((tag/tbd)) ((tag/proposed)) ((tag/draft)) ((tag/wip)) ((tag/mvp))      |
| ((tag/blocked)) ((tag/canceled)) ((tag/error)) ((tag/warning)) ((tag/warn))             |

## Arrow Tags in Cells

| Step   | Status                 |
| ------ | ---------------------- |
| Design | ((<tag/done))          |
| Build  | ((<tag/doing))         |
| Test   | ((<tag/planned))       |
| Ship   | ((<tag/custom/purple)) |

## Custom Colors

<!-- Named colors, hex colors, foreground-only and invalid colors -->

| Case                    | Tag                            |
| ----------------------- | ------------------------------ |
| Named background        | ((tag/custom/orange))          |
| Hex background          | ((tag/custom/#008000))         |
| Hex background and text | ((tag/custom/#008000/#90ee90)) |
| Foreground only         | ((tag/custom//#ff1493))        |
| Invalid color (grey)    | ((tag/custom/notacolor))       |

## Multiple Tags in One Cell

| Item    | Labels                                  |
| ------- | --------------------------------------- |
| Feature | ((tag/mvp)) ((tag/wip)) ((tag/blocked)) |
| Bug     | ((tag/error)) ((<tag/in-progress))      |
| Idea    | ((tag/draft)) ((tag/tbd/purple))        |

## Tags Mixed with Text

| Item  | Notes                                                 |
| ----- | ----------------------------------------------------- |
| One   | Before ((tag/todo)) after                             |
| Two   | **Bold** ((tag/done)) and _italic_                    |
| Three | ((tag/tip)), then punctuation.                        |
| Four  | A [example site](https://example.com) ((tag/warning)) |

## Tags in Header Cells

| ((tag/todo)) | ((tag/doing)) | ((tag/done)) |
| ------------ | ------------- | ------------ |
| Backlog      | In flight     | Finished     |
| Item A       | Item B        | Item C       |

## Alignment

| Left             |    Center     |        Right |
| :--------------- | :-----------: | -----------: |
| ((tag/todo))     | ((tag/doing)) | ((tag/done)) |
| ((<tag/planned)) | ((<tag/wip))  | ((<tag/mvp)) |

## Special Characters in Labels

<!-- Labels containing & and quotes should show exactly as typed, not as HTML entities -->

| Case       | Tag               |
| ---------- | ----------------- |
| Ampersand  | ((tag/R&D))       |
| Quotes     | ((tag/"quoted"))  |
| Apostrophe | ((tag/it's done)) |

## Not Tags (Should Stay Plain)

<!-- Malformed or fenced syntax that must not be converted -->

| Case          | Text           |
| ------------- | -------------- |
| Missing close | ((tag/todo)    |
| Wrong keyword | ((label/todo)) |
| Inline code   | `((tag/todo))` |

## Tags Next to a Table

A paragraph with a tag outside a table: ((tag/done)) ((tag|done))

| Column A | Column B     |
| -------- | ------------ |
| Cell     | ((tag/done)) |

Another paragraph after the table: ((tag/todo)) ((tag|todo))
