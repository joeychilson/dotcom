<script lang="ts">
	import favicon from '#lib/assets/favicon.svg';
	import HarborBackdrop from '#lib/components/HarborBackdrop.svelte';
	import { site } from '#lib/site.js';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="alternate" type="application/rss+xml" title={`${site.name} RSS`} href="/rss.xml" />
</svelte:head>

<ModeWatcher
	disableTransitions={false}
	modeStorageKey="theme"
	themeColors={{ light: '#f3f6f9', dark: '#070c16' }}
/>

<div
	class="bg-background relative isolate min-h-svh overflow-x-clip [--harbor-min-width:54rem] [--harbor-ratio:0.3333333333]"
>
	<HarborBackdrop />
	{@render children()}
</div>
