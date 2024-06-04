<script>
	import Posts from '$lib/components/posts.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>Joey Chilson</title>
</svelte:head>

<Posts posts={data.posts} />
