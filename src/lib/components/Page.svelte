<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
	import { site } from '#lib/site.js';
	import type { Snippet } from 'svelte';

	let { children, header }: { children: Snippet; header?: Snippet } = $props();
</script>

<main
	class="relative z-10 mx-auto w-full max-w-2xl px-6 pt-12 pb-[calc(max(100vw,var(--harbor-min-width))*var(--harbor-ratio)*0.88)] sm:px-8 sm:pt-16"
>
	<header class="flex items-start justify-between gap-6">
		{#if header}
			{@render header()}
		{:else}
			<a
				href="/"
				class="group text-foreground inline-flex items-center gap-2 font-serif text-xl font-medium tracking-tight transition-colors duration-150 sm:text-2xl"
			>
				<svg
					aria-hidden="true"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-4.5 text-muted-foreground transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-foreground group-focus-visible:-translate-x-1 motion-reduce:transition-none"
				>
					<path d="m15 18-6-6 6-6" />
				</svg>
				<span class="group-hover:text-accent transition-colors duration-150">
					{site.name}
				</span>
			</a>
		{/if}
		<ThemeToggle />
	</header>

	{@render children()}
</main>
