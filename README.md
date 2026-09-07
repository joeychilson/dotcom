# dotcom

[![CI](https://github.com/joeychilson/dotcom/actions/workflows/ci.yml/badge.svg)](https://github.com/joeychilson/dotcom/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

My personal site at [joeychilson.com](https://joeychilson.com), built with Astro, TypeScript, and Markdown.

Requires Node.js 22.12 or later. CI and Cloudflare builds use Node.js 24.

## Development

```sh
npm ci
npm run dev
```

No environment variables are needed. Open the local URL printed in the terminal.

## Content

- `src/site.ts` — name, tagline, bio, links, and projects.
- `writings/` — Markdown posts.
- `src/styles/global.css` — styles and responsive layout.
- `src/scripts/sea.ts` — sailboat and sun/moon animation.
- `astro.config.mjs` — domain and build configuration.
- `public/` — icons, fonts, and the 1200 × 630 sharing image.

The sharing image is a static PNG; update it when changing the tagline.

### Writing

Create a file such as `writings/first-post.md`:

```md
---
title: A small observation
description: A short summary for search results and RSS.
date: 2026-09-07
draft: true
---

Write here.
```

The filename determines the URL: `/writing/first-post/`. Posts default to drafts; set `draft: false` to publish. Drafts and future-dated posts appear locally but are excluded from production pages, RSS, and the sitemap. Future-dated posts require a rebuild after their date.

An optional `updated` date marks revisions and must not precede `date`. An empty writing folder is supported, though Astro prints a warning until the first post is added.

## Checks

```sh
npm run format:check
npm test
npm run build
```

The build includes type checking. [CI](.github/workflows/ci.yml) runs these checks on pull requests and pushes to `main`. Use `npm run format` to apply formatting.

## Build

`npm run build` generates `dist/`. Run `npm run preview` to check the production output locally.

## Cloudflare

The site uses Workers Static Assets. `wrangler.jsonc` serves `dist/`, uses the custom `404.html` for missing pages, and initially deploys to a `workers.dev` URL.

Connect the repository in Cloudflare Workers Builds with:

| Setting           | Value                                               |
| ----------------- | --------------------------------------------------- |
| Production branch | `main`                                              |
| Build command     | `npm run format:check && npm test && npm run build` |
| Deploy command    | `npx wrangler deploy`                               |
| Node.js           | `24` (from `.node-version`)                         |

Verify the initial deployment before attaching `joeychilson.com` as a Custom Domain in Cloudflare. This keeps the existing site live until the new one is ready. No Astro adapter or Worker script is needed. The GitHub CI workflow only checks the site; Cloudflare handles deployment.

See the [Cloudflare Astro guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/) for setup details.

## License

[MIT](LICENSE). Inter is included under the [SIL Open Font License](public/fonts/LICENSE.txt).
