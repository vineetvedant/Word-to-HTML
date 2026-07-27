# Word HTML 1.0 Converter Benchmark

Reference compared: https://wordhtml.com/

Date: 2026-06-28

## Summary

This project now covers the core converter workflow:

- [x] Word/rich text input to HTML 1.0 output
- [x] HTML input to Word-compatible `.doc` download
- [x] HTML preview
- [x] Copy/download output
- [x] Basic cleanup options
- [x] Smart hyperlink creation
- [x] Selection reflection between editor/output/preview
- [x] Expanded Word-style toolbar
- [x] Table insert grid and table actions

The biggest missing areas are advanced document cleanup options, deeper table menus, source-code formatting tools, and full WordHTML-style menu depth.

## Conversion Core

- [x] Paste rich Word-like content into an editable document area
- [x] Convert rich text into simple HTML output
- [x] Generate full HTML page wrapper
- [x] Generate HTML fragment output
- [x] Keep output close to HTML 1.0-style tags
- [x] Strip styles/classes/modern attributes from output
- [x] Convert `<strong>` to `<b>`
- [x] Convert `<em>` to `<i>`
- [x] Preserve headings `h1` through `h6`
- [x] Preserve paragraphs
- [x] Preserve line breaks
- [x] Preserve lists
- [x] Optional list removal
- [x] Optional empty tag removal
- [x] HTML-to-Word-compatible `.doc` export
- [ ] True `.docx` parsing/import
- [ ] True `.docx` export
- [ ] Server-side Word document conversion

## Smart Links

- [x] Preserve existing `<a href>` links
- [x] Convert plain `https://...` URLs into links
- [x] Convert plain `www...` URLs into links
- [x] Convert email addresses into `mailto:` links
- [x] Toolbar link insertion for selected text
- [x] Toolbar link insertion when no text is selected
- [ ] Link editing dialog for an existing link
- [ ] Remove link command
- [ ] Target/window option

## Toolbar: Word To HTML

- [x] Menu row: File, Edit, Insert, View, Format, Table, Tools
- [x] Undo
- [x] Redo
- [x] Switch current HTML output into HTML input mode
- [x] Remove formatting
- [x] Format dropdown
- [x] Bold
- [x] Italic
- [x] Underline
- [x] Align left
- [x] Align center
- [x] Align right
- [x] Justify
- [x] Bulleted list
- [x] Numbered list
- [x] Indent
- [x] Outdent
- [x] Insert link
- [x] Insert image
- [x] Print
- [x] Focus preview
- [x] Text color editor helper
- [x] Emoji/smiley insertion
- [x] Table tool dropdown
- [ ] Full File menu actions
- [ ] Full Edit menu actions
- [ ] Full Insert menu actions
- [ ] Full View menu actions
- [ ] Full Format menu actions
- [ ] Full Tools menu actions
- [ ] Keyboard shortcut display
- [x] Toolbar active-state highlighting

## Toolbar: HTML To Word

- [x] Compact HTML toolbar
- [x] HTML undo
- [x] Open HTML/text file
- [x] Clean/format HTML into Word output
- [x] Live Word-style output render
- [x] Download Word-compatible `.doc`
- [x] Code beautify indentation
- [x] Code minify
- [ ] Syntax highlighting
- [x] HTML validation warnings
- [ ] Find/replace inside HTML source

## Table Tool

- [x] Single table toolbar button
- [x] Dropdown panel inspired by the reference UI
- [x] 10 x 10 hover grid
- [x] Live grid size display
- [x] Insert custom table size
- [x] Preserve `<table>`
- [x] Preserve `<tr>`
- [x] Preserve `<td>`
- [x] Preserve `<th>`
- [x] Preserve `border`
- [x] Preserve `cellpadding`
- [x] Preserve `cellspacing`
- [x] Preserve `width`
- [x] Preserve `align`
- [x] Add row
- [x] Remove row
- [x] Add column
- [x] Remove column
- [x] Delete table
- [x] Table properties: width and alignment
- [x] Cell alignment properties
- [x] Submenus that open visually beside Cell, Row, and Column
- [ ] Merge cells
- [ ] Split cells
- [ ] Cell padding editor
- [ ] Cell spacing editor
- [ ] Border style editor
- [ ] Header row/column toggle
- [ ] Drag table movement
- [ ] Drag table resize handles

## Preview And Selection Sync

- [x] Live preview iframe
- [x] Selection in Word editor reflects in HTML output/preview
- [x] Selection in HTML source reflects in Word output/preview
- [x] Selection in preview reflects back to source/editor
- [ ] Mapping exact HTML tokens to rendered text ranges
- [ ] Multi-match selection chooser
- [ ] Persistent side-by-side diff markers

## Cleanup Options

- [x] Remove empty tags
- [x] Smart hyperlinks checkbox
- [x] Keep/remove lists checkbox
- [x] Full document vs fragment output
- [x] Remove comments
- [x] Remove images
- [x] Remove tables
- [x] Remove links while keeping link text
- [x] Remove all formatting but keep structure
- [ ] Convert tables to plain text
- [ ] Convert headings to paragraphs
- [ ] Convert line breaks to paragraphs
- [ ] Custom allowed tag list

## File Actions

- [x] Open `.html`, `.htm`, and `.txt`
- [x] Download HTML output
- [x] Download Word-compatible `.doc`
- [x] Copy output
- [ ] Open `.doc`
- [ ] Open `.docx`
- [ ] Save project/session
- [ ] Import from URL
- [ ] Export plain text
- [ ] Export Markdown

## HTML 1.0 Compatibility

- [x] Full output uses `<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 1.0//EN">`
- [x] Uses classic tags such as `b`, `i`, `u`, `p`, `ul`, `ol`, `li`, headings
- [x] Avoids output CSS classes
- [x] Avoids output inline styles in most conversion paths
- [x] Uses old-style table attributes
- [ ] Strict validation against an HTML 1.0 DTD
- [ ] Automatic warning when unsupported modern tags are removed
- [ ] Report listing removed tags/attributes

## UI And Layout

- [x] Main converter-first page
- [x] Word-to-HTML and HTML-to-Word tabs
- [x] Responsive grid layout
- [x] Dense toolbar inspired by reference
- [x] Table dropdown inspired by reference
- [x] Preview panel
- [x] Stats: words, characters, tags
- [ ] More exact visual match to reference website
- [ ] Dark mode
- [ ] Resizable editor/output panes
- [ ] Collapsible side settings panel

## Automated Checks Run

- [x] JavaScript syntax check: `node --check app.js`
- [x] Local server route check: `/vedant/` returns HTTP 200
- [ ] Browser interaction test with Playwright
- [ ] Clipboard API test
- [ ] Download file content test
- [ ] Cross-browser test

## Priority Missing Work

- [x] Add visual Cell/Row/Column submenus instead of prompt-based actions
- [x] Add HTML beautify/minify/validate tools
- [x] Add better cleanup checkboxes: comments, images, tables, links, formatting
- [x] Add active-state toolbar feedback
- [ ] Add exact selection mapping between HTML source and rendered document
- [ ] Add browser automation tests for toolbar, table grid, links, and downloads
