<script>
	import Posts from '$lib/components/posts.svelte';
	let { data } = $props();
</script>

<Posts posts={data.posts} />
