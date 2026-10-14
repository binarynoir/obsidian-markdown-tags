# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.4.3] - 2026-10-13

### Changed

- README: remove the binarynoir.github.io badge; the binarynoir.tech website badge remains

## [1.4.2] - 2026-10-13

### Changed

- README: add a Feedback and support section with links to report a bug, request a feature, or browse open issues
- README: add a More from BinaryNoir section with the BinaryNoir logo and links to the other plugins and command-line tools on [binarynoir.github.io](https://binarynoir.github.io)
- README: add a binarynoir.github.io badge

### Fixed

- README: the support section now links to the issue tracker

## [1.4.1] - 2026-10-08

### Changed

- Add a link to the documentation site in README

## [1.4.0] - 2026-10-01

### Fixed

- Labels containing `&`, `<` or `>` showed as HTML entities (for example `R&amp;D`) in edit mode and tables
- Labels containing quotes or apostrophes did not render in Reading view
- Tags in tables went back to plain text after the cursor left the table in Live Preview
- `((tag|label))` tags written in plain text were skipped by the editor in edit mode because of the `|` separator
- Console error `closest is not a function` while typing or scrolling in the editor
- Tags in tables not being processed in panes other than the one active when the plugin loaded

### Changed

- Tag classes and styles are now built in one shared place for edit mode, tables and Reading view
- Edit mode finds fenced code blocks in a single pass, which is faster in large notes
- Table processing is debounced and watches the whole workspace

### Development

- Added Prettier and an ESLint flat config, with `format`, `format:check` and `lint` scripts
- Upgraded dev dependencies, including TypeScript 6, esbuild 0.28 and typescript-eslint 8
- Rewrote and extended the notes in `examples/`, including a new table test note

## [1.3.0] - 2025-08-19

### Added

- Support for using either `|` or `/` as seperators

## [1.2.3] - 2024-12-13

### Fixed

- Extension name inconsistencies

## [1.2.2] - 2024-12-13

### Fixed

- Extension breaks other elemets in Preview Mode
- Some elements in Preview Mode and Edit mode did not support tags

## [1.2.1] - 2024-11-28

### Fixed

- Issues with callout box conflicts

## [1.2.0] - 2024-11-26

### Added

- Support for reader view
- Example markdown documents

### Changed

- Improved arrow tag styling

## [1.1.1] - 2024-11-15

### Fixed

- README.md had some arrow tags that were not opened correctly
- Code comments had the old tag format

## [1.1.0] - 2024-11-15

### Changed

- Tags are now formatted using `((tag|label|bgcolor|fgcolor))` format so as not to conflict with other common markdown
- CSS class is now bn-tags amd bn-arrow-tags so as not to conflict with other common classes
- README.md reflects new tag format

## [1.0.2] - 2024-11-11

### Changed

- Updated name to remove obsidian from prefix

## [1.0.1] - 2024-11-11

### Added

- Release prep and workflows

## [1.0.0] - 2024-11-08

### Added

- Initial release checkin
