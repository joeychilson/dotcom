<script lang="ts">
	import { formatDate, type Post } from '$lib/posts';

	let { posts }: { posts: Post[] } = $props();
</script>

{#each posts as post (post.slug)}
	<a class="flex flex-col space-y-1 mb-4" href={`/posts/${post.slug}`}>
		<div class="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
			<p class="text-neutral-600 dark:text-neutral-400 w-[120px] tabular-nums">
				{formatDate(post.date)}
			</p>
			<p class="text-neutral-900 dark:text-neutral-100 tracking-tight">
				{post.title}
			</p>
		</div>
	</a>
{/each}
