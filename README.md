# dotcom

[![CI](https://github.com/joeychilson/dotcom/actions/workflows/ci.yml/badge.svg)](https://github.com/joeychilson/dotcom/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

The source for [joeychilson.com](https://joeychilson.com), my personal website and writing archive.

Requires [Vite+](https://viteplus.dev).

## Development

```text
vp install
vp dev
```

Run Vite+ checks, Svelte diagnostics, and a production build with:

```text
vp check
vp run check
vp build
```

## Writing

Writing is stored as Markdown in [`src/writings`](src/writings). Add `draft: true`
to a post's frontmatter to show it locally without publishing it.

## License

[MIT](LICENSE)
