<script lang="ts">
	import Page from '#lib/components/Page.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { getWriting } from '#lib/writing.remote.js';
	import { MarkdownDocument } from '@comark/svelte';
	import type { PageProps } from './$types';

	let { params }: PageProps = $props();

	const writing = $derived(await getWriting(params.slug));
</script>

<Seo
	title={writing.frontmatter.title}
	description={writing.frontmatter.description}
	path={`/writing/${writing.slug}`}
	type="article"
	published={writing.frontmatter.date}
/>

<Page>
	<article class="mt-10 sm:mt-12">
		<header>
			<h1
				class="text-foreground font-serif text-[2.25rem] leading-[1.15] font-medium tracking-tight text-balance sm:text-[2.625rem]"
			>
				{writing.frontmatter.title}
			</h1>
			<p class="text-muted-foreground mt-3 text-sm tabular-nums">
				{#if writing.frontmatter.draft}
					<span class="font-medium tracking-[0.08em] uppercase">Draft</span>
					<span aria-hidden="true"> · </span>
				{/if}
				<time datetime={writing.frontmatter.date}>{writing.formattedDate}</time>
				<span aria-hidden="true"> · </span>
				<span>{writing.minutes} min read</span>
			</p>
		</header>

		<div class="mt-8 sm:mt-10">
			<MarkdownDocument value={writing} class="writing-content" />
		</div>
	</article>
</Page>
