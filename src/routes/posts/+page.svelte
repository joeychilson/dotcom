<script>
	import Posts from '$lib/components/posts.svelte';
	let { data } = $props();
</script>

<section>
	<h1 class="mb-8 text-2xl font-semibold tracking-tighter">posts</h1>
</section>

<Posts posts={data.posts} />
