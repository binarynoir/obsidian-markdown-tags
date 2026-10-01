# Project Management

## Task Status

### Current Sprint

<!-- Status tags with default colors -->

((tag|todo)) ((tag|in-progress)) ((tag|done)) ((tag|blocked))

- **Task 1**: Implement user authentication ((tag|in-progress))
- **Task 2**: Design landing page ((tag|todo))
- **Task 3**: Fix login bug ((tag|blocked))
- **Task 4**: Write unit tests ((tag|done))

### Backlog

<!-- Tags with custom labels and default colors -->

((tag|planned)) ((tag|proposed)) ((tag|on-hold))

- **Feature 1**: Add user profile page ((tag|planned))
- **Feature 2**: Integrate payment gateway ((tag|proposed))
- **Feature 3**: Optimize database queries ((tag|on-hold))

## Milestones

### Upcoming Releases

<!-- Arrow-style tags with default colors -->

((<tag|planned)) ((<tag|in-progress)) ((<tag|done))

- **Release 1.0**: MVP launch ((<tag|planned))
- **Release 1.1**: Bug fixes and improvements ((<tag|in-progress))
- **Release 2.0**: New features ((<tag|done))

## Custom Tags

### Priority Levels

<!-- Tags with custom background and foreground colors -->

((tag|high-priority|#ff0000)) ((tag|medium-priority|#ffa500)) ((tag|low-priority|#008000))

- **Critical Bug**: Fix security vulnerability ((tag|high-priority|#ff0000))
- **Enhancement**: Improve UI/UX ((tag|medium-priority|#ffa500))
- **Minor Issue**: Update documentation ((tag|low-priority|#008000))

## Structure and Nesting

### Headings with Tags

<!-- Tags in headings should render and not break the outline -->

#### Heading level 4 ((tag|todo))

##### Heading level 5 ((<tag|done))

### Nested Lists

- Parent item ((tag|in-progress))
    - Child item ((tag|todo))
        - Grandchild item ((tag|blocked))
            - Great-grandchild item ((<tag|planned))
    - Another child ((tag|done))
- Second parent ((tag|on-hold))

1. First step ((tag|done))
2. Second step ((tag|in-progress))
    1. Sub-step A ((tag|done))
    2. Sub-step B ((tag|todo))
3. Third step ((tag|planned))

### Task Lists

- [ ] Open task ((tag|todo))
- [x] Completed task ((tag|done))
- [ ] Task with arrow ((<tag|in-progress))
- [ ] Task with custom color ((tag|review|#8a2be2))

### Blockquotes

> A quoted line with a tag ((tag|tip))
>
> > A nested quote with a tag ((tag|warning))

### Callouts

> [!note] Callout title ((tag|tip))
> Callout body with a tag ((tag|done)) and an arrow tag ((<tag|in-progress))

> [!warning]- Collapsed callout ((tag|blocked))
> Hidden body with a tag ((tag|todo))

### Inline Formatting Around Tags

**Bold text ((tag|done)) bold text**

_Italic text ((tag|todo)) italic text_

~~Struck text ((tag|canceled)) struck text~~

==Highlighted text ((tag|tip)) highlighted text==

[A link ((tag|done)) inside link text](https://example.com)

Text with a [link](https://example.com) then a tag ((tag|todo))

### Wikilinks and Embeds

A wikilink [[Some Note]] followed by a tag ((tag|todo))

A tag before a wikilink ((tag|done)) [[Another Note]]

### Footnotes

A sentence with a tag ((tag|todo)) and a footnote.[^1]

[^1]: Footnote text with a tag ((tag|done))

### Horizontal Rule and Paragraph Breaks

First paragraph ((tag|todo))

---

Second paragraph ((tag|done))

### Long Paragraph

This paragraph is long enough to wrap across several lines in the editor so that you can check how tags render when they sit in the middle of wrapped text ((tag|in-progress)) and again near the end of the paragraph where the line breaks fall somewhere else entirely ((<tag|done)) and then trailing text.
