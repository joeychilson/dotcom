---
title: Writing showcase
date: 2026-08-17
description: A living preview of every element available to a post.
draft: true
---

This post is the reference page for the writing system. It shows the type, spacing, colors, and Markdown features in one place, so changes can be judged against real content instead of a collection of isolated components.

## Type and inline details

Body copy uses a readable serif face, while controls and metadata stay in the site’s sans serif. A paragraph can contain **strong text**, _emphasis_, ~~a discarded thought~~, `inline code`, and [a normal link](https://comark.dev). [Attributes can add a restrained accent]{.accent-text} when the meaning calls for it.

"Straight quotes" become smart quotes, two hyphens mark a range -- like 2025--2026, three make a break --- like this, and three dots become an ellipsis... Symbols such as (c), (r), and +- are cleaned up too.

Use <kbd>Command</kbd> + <kbd>K</kbd> when a post needs to name a key.

> Good writing earns attention one clear sentence at a time.

![The daytime harbor illustration used by this site](/images/harbor-day.webp){width=2172 height=724}

### Lists and tasks

An unordered list can hold a short set of related ideas:

- Start with the useful path.
- Keep the language concrete.
  - Put supporting detail underneath the main idea.
- Stop when the point is made.

An ordered list is for an actual sequence:

1. Write the smallest complete version.
2. Read it once as a stranger.
3. Publish it.

Task lists work for progress that belongs in the post:

- [x] Parse Markdown on the server.
- [x] Prerender every known writing route.
- [ ] Add the next real essay.

### Tables

Tables are best kept small enough to scan.

| Element   | Purpose                | Tone           |
| :-------- | :--------------------- | :------------- |
| Heading   | Establish structure    | Direct         |
| Paragraph | Develop an idea        | Conversational |
| Code      | Make behavior concrete | Precise        |

## Callouts

Callouts are for information that deserves a different reading mode. The label and border carry the distinction without turning the post into a dashboard.

> [!NOTE]
> A note adds useful context without interrupting the main argument.

> [!TIP]
> A tip gives the reader a small action they can use immediately.

> [!IMPORTANT]
> Important information should affect how the reader understands the rest of the section.

> [!WARNING]
> A warning points out a likely mistake before it costs time.

> [!CAUTION]
> Caution is reserved for consequences that are difficult to undo.

## Code

Code blocks use a custom Rangi theme built from the same light and dark color tokens as the rest of the site. Filenames and selected lines are part of the Markdown, not hand-built markup.

### Svelte

```svelte {2,6-8} [Counter.svelte]
<script lang="ts">
  let count = $state(0)
</script>

<button onclick={() => count += 1}>
  Count: {count}
</button>
```

### TypeScript

```ts {6-8} [writing.ts]
interface Writing {
  title: string;
  date: string;
}

export function newestFirst(writings: Writing[]) {
  return writings.toSorted((a, b) => b.date.localeCompare(a.date));
}
```

### CSS

```css [theme.css]
:root {
  --ink: oklch(0.21 0.045 252);
}

.title {
  color: var(--ink);
  text-wrap: balance;
}
```

### Shell

```bash [terminal]
pnpm check
pnpm build
```

### JSON and YAML

```json [package.json]
{
  "scripts": {
    "check": "svelte-check",
    "build": "vite build"
  }
}
```

```yaml [post.yml]
title: Writing showcase
published: true
topics:
  - svelte
  - markdown
```

### Comark

```comark [example.md]
## A section

> [!TIP]
> Keep the example close to the idea it supports.

[Small details matter]{.accent-text}
```

## Footnotes and dividers

Footnotes keep an aside available without forcing it into the sentence.[^comark] The return link brings the reader back to the exact reference.

---

That is the complete baseline. New styles should earn their place by expressing something these elements cannot.

[^comark]: Comark turns the source into a serializable document that the Svelte renderer can render during prerendering.
