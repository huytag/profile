# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static single-page personal portfolio website for Thang Ngo Huy (Full Stack Developer). The site is deployed directly via GitHub Pages at `profile.ngothang.tokyo`.

## Architecture

- **Single HTML file**: `index.html` contains the entire profile — structure, styles, and JavaScript are all inline.
- **Asset pipeline**: `assets-src/` contains SCSS source files compiled to `assets/css/custom.css` (which is referenced by the HTML). The `assets/` directory also contains pre-compiled vendor assets (Bootstrap 4, jQuery, themify-icons).
- **No build tools**: The site is pure static HTML. Any SCSS changes need to be compiled manually (e.g., via `sass` or VS Code extension).
- **Third-party CDN**: Ant Design 5.x CSS is loaded via cdnjs CDN links in the `<head>`. Custom CSS at `/assets/css/custom.css` overrides or extends these styles.
- **Multi-language support**: Built-in JS translation system supports `en`, `vi`, and `ja` via `data-i18n` attributes and a `translations` object in the `<script>` tag.

## Key Files

- `index.html` — Main profile page (all content, styles, translations, and JS logic)
- `assets/css/custom.css` — Compiled custom styles (minimal overrides)
- `assets/scss/` — SCSS source files (abstracts, base, components, layout, vendors)
- `CNAME` — Domain configuration for GitHub Pages custom domain

## Development Notes

- To test locally, simply open `index.html` in a browser or serve via any static server.
- CSS changes: either edit `assets/css/custom.css` directly, or modify SCSS files in `assets-src/` and recompile.
- JavaScript logic (theme toggle, language switching, accordion behavior) is embedded in a `<script>` tag at the bottom of `index.html`.