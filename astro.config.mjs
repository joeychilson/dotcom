import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://joeychilson.com',
  output: 'static',
  cacheDir: './.astro/cache',
  integrations: [
    sitemap({
      serialize(item) {
        const url = new URL(item.url);
        url.pathname = url.pathname
          .split('/')
          .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
          .join('/');
        return { ...item, url: url.href };
      },
    }),
  ],
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
