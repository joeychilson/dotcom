import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import markdown from './src/lib/markdown.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [markdown(), vitePreprocess()],
	kit: {
		adapter: adapter()
	}
};

export default config;
