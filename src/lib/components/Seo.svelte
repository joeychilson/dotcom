<script lang="ts">
	import { site } from '#lib/site.js';

	let {
		title,
		description = site.description,
		path = '/',
		type = 'website',
		published
	}: {
		title: string;
		description?: string;
		path?: string;
		type?: 'website' | 'article';
		published?: string;
	} = $props();

	const url = $derived(site.url + path);
	const heading = $derived(title === site.name ? title : `${title} · ${site.name}`);
</script>

<svelte:head>
	<title>{heading}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={site.ogImage} />
	<meta property="og:image:alt" content={site.ogImageAlt} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	{#if published}
		<meta property="article:published_time" content={published} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={site.ogImage} />
	<meta name="twitter:image:alt" content={site.ogImageAlt} />
</svelte:head>
