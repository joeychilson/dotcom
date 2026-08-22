<script lang="ts">
	import Page from '#lib/components/Page.svelte';
	import { page } from '$app/state';
	import { site } from '#lib/site.js';

	const heading = $derived(page.status === 404 ? 'Not found' : 'Something went wrong');
	const detail = $derived(
		page.status === 404
			? "There's nothing here."
			: 'Try again in a moment, or go back home.'
	);
</script>

<svelte:head>
	<title>{heading} · {site.name}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<Page>
	<section class="mt-10 sm:mt-12" aria-labelledby="error-heading">
		<p class="text-muted-foreground font-serif text-lg font-[480] tracking-[0.01em] italic tabular-nums">
			{page.status}
		</p>
		<h1
			id="error-heading"
			class="text-foreground mt-3 font-serif text-[2.25rem] leading-[1.15] font-medium tracking-tight text-balance sm:text-[2.625rem]"
		>
			{heading}
		</h1>
		<p class="text-muted-foreground mt-4 max-w-md text-[1.0625rem] leading-relaxed">
			{detail}
		</p>
		<a
			href="/"
			class="text-foreground decoration-foreground/30 hover:decoration-foreground focus-visible:decoration-foreground mt-6 inline-block text-[0.9375rem] underline decoration-1 underline-offset-[0.19em] transition-[text-decoration-color] duration-150"
		>
			Home
		</a>
	</section>
</Page>
