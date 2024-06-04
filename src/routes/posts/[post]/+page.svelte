<script lang="ts">
	import { formatDate } from '$lib/posts';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data?.meta?.title} by Joey Chilson</title>
</svelte:head>

<h1 class="title text-2xl font-semibold tracking-tighter">
	{data?.meta?.title}
</h1>
<div class="mb-8 mt-2 flex items-center justify-between text-sm">
	<p class="text-sm text-neutral-600 dark:text-neutral-400">
		{formatDate(data?.meta?.date)}
	</p>
</div>
<article class="prose">
	<svelte:component this={data.content} />
</article>
