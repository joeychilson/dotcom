<script>
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} - Joey Chilson</title>
	<meta name="description" content="The personal website of Joey Chilson" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="error-page">
	<div class="content">
		<h1 class="mono">{page.status}</h1>
		<p>{page.error?.message || 'Something went wrong'}</p>
		<a href="/">Go home</a>
	</div>
</div>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		font-family:
			'Inter',
			-apple-system,
			system-ui,
			sans-serif;
		background: #fafafa;
		color: #0a0a0a;
		-webkit-font-smoothing: antialiased;
	}

	.mono {
		font-family: 'JetBrains Mono', monospace;
	}

	.error-page {
		min-height: 100vh;
		padding: 24px;
		position: relative;
	}

	.content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 200px;
		text-align: center;
		height: 132px;
	}

	h1 {
		font-size: 48px;
		font-weight: 400;
		margin: 0 0 12px 0;
		letter-spacing: 0;
		line-height: 48px;
		height: 48px;
	}

	p {
		font-size: 14px;
		color: #737373;
		margin: 0 0 32px 0;
		line-height: 20px;
		height: 20px;
	}

	a {
		display: block;
		font-size: 14px;
		color: #0a0a0a;
		text-decoration: none;
		line-height: 20px;
		height: 20px;
		transition: color 0.2s ease;
	}

	a:hover {
		color: #737373;
	}
</style>
