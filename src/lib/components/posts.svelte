<script lang="ts">
	import { formatDate, type Post } from '$lib/posts';

	let { posts }: { posts: Post[] } = $props();
</script>

{#each posts as post (post.slug)}
	<a class="mb-4 flex flex-col space-y-1" href={`/posts/${post.slug}`}>
		<div class="flex w-full flex-col space-x-0 md:flex-row md:space-x-2">
			<p class="w-[120px] tabular-nums text-neutral-600 dark:text-neutral-400">
				{formatDate(post.date)}
			</p>
			<p class="tracking-tight text-neutral-900 dark:text-neutral-100">
				{post.title}
			</p>
		</div>
	</a>
{/each}
