<script>
	import { getGitHubRepos } from '$lib/github.remote';

	const reposQuery = getGitHubRepos();
</script>

<svelte:head>
	<title>Joey Chilson</title>
	<meta name="description" content="The personal website of Joey Chilson" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="container">
	<header>
		<h1 class="mono">Joey Chilson</h1>
		<nav>
			<a href="https://twitter.com/joeychilson" target="_blank" rel="noopener">Twitter</a>
			<a href="https://github.com/joeychilson" target="_blank" rel="noopener">GitHub</a>
			<a href="mailto:joeychilson@outlook.com">Email</a>
		</nav>
	</header>

	<main>
		<h2>PROJECTS</h2>
		<div class="projects">
			{#await reposQuery}
				<p class="loading">Loading...</p>
			{:then repos}
				{#if repos.length === 0}
					<p class="loading">No projects yet</p>
				{:else}
					{#each repos as repo (repo.name)}
						<a href={repo.html_url} target="_blank" rel="noopener" class="project">
							<div class="project-header">
								<span class="project-name">{repo.name}</span>
								{#if repo.language}
									<span class="project-lang mono">{repo.language}</span>
								{/if}
							</div>
							{#if repo.description}
								<p class="project-desc">{repo.description}</p>
							{/if}
						</a>
					{/each}
				{/if}
			{:catch}
				<p class="error">Failed to load projects</p>
			{/await}
		</div>
	</main>
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
		line-height: 1.6;
		-webkit-font-smoothing: antialiased;
	}

	.mono {
		font-family: 'JetBrains Mono', monospace;
	}

	.container {
		max-width: 680px;
		margin: 0 auto;
		padding: 40px 24px 80px;
	}

	header {
		margin-bottom: 48px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 32px;
		flex-wrap: wrap;
	}

	h1 {
		font-size: 15px;
		font-weight: 400;
		letter-spacing: 0;
		margin: 0;
	}

	nav {
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
	}

	nav a {
		font-size: 14px;
		color: #0a0a0a;
		text-decoration: none;
		position: relative;
		transition: color 0.2s ease;
	}

	nav a::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 0;
		height: 1px;
		background: #0a0a0a;
		transition: width 0.2s ease;
	}

	nav a:hover {
		color: #737373;
	}

	nav a:hover::after {
		width: 100%;
	}

	h2 {
		font-size: 14px;
		font-weight: 500;
		color: #737373;
		margin-bottom: 32px;
		letter-spacing: 0.02em;
	}

	.projects {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.project {
		display: block;
		text-decoration: none;
		color: inherit;
		transition: transform 0.2s ease;
	}

	.project:hover {
		transform: translateX(4px);
	}

	.project:hover .project-name {
		text-decoration: underline;
	}

	.project-header {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin-bottom: 8px;
	}

	.project-name {
		font-size: 15px;
		font-weight: 500;
		letter-spacing: -0.01em;
		transition: text-decoration 0.2s ease;
	}

	.project-lang {
		font-size: 12px;
		color: #a3a3a3;
	}

	.project-desc {
		font-size: 14px;
		color: #525252;
		line-height: 1.5;
	}

	.loading {
		font-size: 14px;
		color: #a3a3a3;
	}

	.error {
		font-size: 14px;
		color: #dc2626;
	}
</style>
