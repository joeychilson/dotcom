<script>
	import { getGitHubRepos } from '$lib/github.remote';
	import caloriesLogo from '$lib/assets/calories.webp';
	import explainimfive from '$lib/assets/explainimfive.webp';

	const reposQuery = getGitHubRepos();

	const applications = [
		{
			name: "explain i'm five",
			description: 'Make anything understandable.',
			url: 'https://explainimfive.com',
			logo: explainimfive
		}
	];
</script>

<svelte:head>
	<title>Joey Chilson</title>
	<meta name="description" content="The personal website of Joey Chilson" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="layout">
	<header>
		<div class="logo mono">Joey Chilson</div>
		<nav>
			<a href="https://twitter.com/joeychilson" target="_blank" rel="noopener">Twitter</a>
			<a href="https://github.com/joeychilson" target="_blank" rel="noopener">GitHub</a>
			<a href="mailto:joeychilson@outlook.com">Email</a>
		</nav>
	</header>

	<main>
		<section class="applications">
			<div class="label mono">APPLICATIONS</div>

			<div class="app-list">
				{#each applications as app (app.name)}
					<a href={app.url} target="_blank" rel="noopener" class="app-row">
						<img src={app.logo} alt="{app.name} logo" class="app-logo" />
						<div class="app-main">
							<span class="app-name">{app.name}</span>
							<span class="app-desc">{app.description}</span>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<section class="projects">
			<div class="label mono">PROJECTS</div>

			<div class="project-list">
				{#await reposQuery}
					<p class="loading">Loading...</p>
				{:then repos}
					{#if repos.length === 0}
						<p class="loading">No projects found.</p>
					{:else}
						{#each repos as repo (repo.name)}
							<a href={repo.html_url} target="_blank" rel="noopener" class="project-row">
								<div class="project-main">
									<div class="project-title">
										<span class="project-name">{repo.name}</span>
										{#if repo.stars > 0}
											<span class="project-stars mono">{repo.stars} ★</span>
										{/if}
									</div>
									<span class="project-desc">{repo.description || 'No description'}</span>
								</div>
								<div class="project-meta mono">
									{#if repo.language}
										<span>{repo.language}</span>
									{/if}
								</div>
							</a>
						{/each}
					{/if}
				{:catch}
					<p class="error">Failed to load projects</p>
				{/await}
			</div>
		</section>
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
			BlinkMacSystemFont,
			sans-serif;
		background-color: #ffffff;
		color: #111;
		line-height: 1.5;
		-webkit-font-smoothing: antialiased;
	}

	.mono {
		font-family: 'JetBrains Mono', monospace;
	}

	.layout {
		max-width: 640px;
		margin: 0 auto;
		padding: 40px 24px;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 48px;
	}

	.logo {
		font-size: 14px;
		font-weight: 500;
	}

	nav {
		display: flex;
		gap: 20px;
	}

	nav a {
		color: #666;
		text-decoration: none;
		font-size: 14px;
		transition: color 0.2s;
	}

	nav a:hover {
		color: #000;
	}

	.label {
		font-size: 12px;
		color: #999;
		margin-bottom: 24px;
	}

	.project-list {
		display: flex;
		flex-direction: column;
	}

	.project-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		text-decoration: none;
		color: inherit;
		padding: 16px 0;
		transition: opacity 0.2s;
		gap: 24px;
	}

	.project-row:hover {
		opacity: 0.6;
	}

	.project-main {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.project-title {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.project-name {
		font-weight: 500;
		font-size: 15px;
	}

	.project-stars {
		font-size: 12px;
		color: #666;
	}

	.project-desc {
		font-size: 14px;
		color: #666;
		max-width: 400px;
	}

	.project-meta {
		font-size: 12px;
		color: #999;
		text-align: right;
		flex-shrink: 0;
		display: flex;
		gap: 12px;
	}

	.loading,
	.error {
		color: #999;
		font-size: 14px;
		padding: 20px 0;
	}

	.applications {
		margin-bottom: 32px;
	}

	.app-list {
		display: flex;
		flex-direction: column;
	}

	.app-row {
		display: flex;
		align-items: center;
		gap: 16px;
		text-decoration: none;
		color: inherit;
		padding: 8px 0;
		transition: opacity 0.2s;
	}

	.app-row:hover {
		opacity: 0.6;
	}

	.app-logo {
		width: 48px;
		height: 48px;
		border-radius: 10px;
		flex-shrink: 0;
	}

	.app-main {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.app-name {
		font-weight: 500;
		font-size: 15px;
	}

	.app-desc {
		font-size: 14px;
		color: #666;
	}

	@media (max-width: 500px) {
		.project-row {
			flex-direction: column;
			gap: 8px;
		}

		.project-meta {
			text-align: left;
		}
	}
</style>
