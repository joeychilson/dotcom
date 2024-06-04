<script lang="ts">
	import { formatDate } from '$lib/posts';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data?.meta?.title}</title>
</svelte:head>

<h1 class="title font-semibold text-2xl tracking-tighter">
	{data?.meta?.title}
</h1>
<div class="flex justify-between items-center mt-2 mb-8 text-sm">
	<p class="text-sm text-neutral-600 dark:text-neutral-400">
		{formatDate(data?.meta?.date)}
	</p>
</div>
<article class="prose">
	<svelte:component this={data.content} />
</article>
