import { createMarkdownParser } from "comark";
import footnotes from "comark/plugins/footnotes";
import punctuation from "comark/plugins/punctuation";
import rangi from "comark/plugins/rangi";
import type { ShjLanguages, ShjTheme } from "rangi";
import {
  bash,
  css,
  js,
  js_template_literals,
  jsdoc,
  json,
  plain,
  regex,
  svelte,
  todo,
  ts,
  yaml,
} from "rangi/languages";

export const parseMarkdown = createMarkdownParser({
  plugins: [
    punctuation(),
    rangi({
      theme: {
        name: "harbor",
        bg: "var(--code-background)",
        fg: "var(--code-foreground)",
        tokens: {
          kwd: "var(--code-token-keyword)",
          section: "var(--code-token-section)",
          class: "var(--code-token-section)",
          str: "var(--code-token-string)",
          esc: "var(--code-token-string)",
          num: "var(--code-token-number)",
          bool: "var(--code-token-number)",
          func: "var(--code-token-function)",
          type: "var(--code-token-type)",
          cmnt: "var(--code-token-comment)",
          oper: "var(--code-token-operator)",
          bracket: "var(--code-foreground)",
          var: "var(--code-token-variable)",
          err: "var(--code-token-error)",
          deleted: "var(--code-token-error)",
          insert: "var(--code-token-inserted)",
        },
      } satisfies ShjTheme,
      languages: {
        bash,
        sh: bash,
        shell: bash,
        zsh: bash,
        css,
        js,
        javascript: js,
        js_template_literals,
        jsdoc,
        json,
        jsonc: json,
        plain,
        text: plain,
        regex,
        svelte,
        todo,
        ts,
        typescript: ts,
        yaml,
        yml: yaml,
      } satisfies ShjLanguages,
      lineNumbers: true,
    }),
    footnotes(),
  ],
});
