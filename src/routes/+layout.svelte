<script>
	import Header from '$lib/components/header.svelte';
	import '../app.css';
</script>

<main class="antialiased max-w-3xl mx-4 mt-8 lg:mx-auto">
	<div class="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
		<Header />
		<slot />
	</div>
</main>
