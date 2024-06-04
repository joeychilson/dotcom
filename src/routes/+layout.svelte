<script>
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';

	import '../app.css';
</script>

<main class="mx-4 mt-8 max-w-3xl antialiased lg:mx-auto">
	<div class="mt-6 flex min-w-0 flex-auto flex-col px-2 md:px-0">
		<Header />
		<slot />
		<Footer />
	</div>
</main>
