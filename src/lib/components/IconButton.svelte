<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		href,
		label,
		pressed,
		onclick,
		children
	}: {
		href?: string;
		label: string;
		pressed?: boolean;
		onclick?: (event: MouseEvent) => void;
		children: Snippet;
	} = $props();

	const external = $derived(href?.startsWith('http') ?? false);
	const className =
		'text-foreground/70 hover:text-foreground hover:bg-foreground/[0.06] active:bg-foreground/[0.1] focus-visible:bg-foreground/[0.08] focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent relative inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors duration-150 motion-reduce:transition-none [&_svg]:size-[1.125rem]';
</script>

{#if href}
	<a
		{href}
		aria-label={external ? `${label} (opens in a new tab)` : label}
		title={label}
		class={className}
		target={external ? '_blank' : undefined}
		rel={external ? 'noreferrer' : undefined}
	>
		{@render children()}
	</a>
{:else}
	<button type="button" aria-label={label} aria-pressed={pressed} class={className} {onclick}>
		{@render children()}
	</button>
{/if}
