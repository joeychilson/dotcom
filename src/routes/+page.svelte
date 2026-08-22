<script lang="ts">
	import IconButton from '#lib/components/IconButton.svelte';
	import Page from '#lib/components/Page.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { site } from '#lib/site.js';
	import { listWritings } from '#lib/writing.remote.js';

	const writings = $derived(await listWritings());
</script>

<Seo title={site.name} />

<Page>
	{#snippet header()}
		<div class="min-w-0">
			<h1 class="text-foreground font-serif text-4xl font-medium tracking-tight text-balance sm:text-5xl">
				{site.name}
			</h1>
			<p class="text-muted-foreground mt-3.5 max-w-lg text-[1.0625rem] leading-relaxed text-pretty">
				{site.description}
			</p>
			<nav
				class="mt-4 -ml-1.5 flex items-center gap-1"
				aria-label="Social and subscription links"
			>
				<IconButton href={site.github} label="GitHub">
					<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.523 2 12 2Z"
						/>
					</svg>
				</IconButton>
				<IconButton href={site.x} label="X">
					<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"
						/>
					</svg>
				</IconButton>
				<IconButton href={site.email} label="Email">
					<svg
						aria-hidden="true"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.75"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect width="20" height="16" x="2" y="4" rx="2" />
						<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
					</svg>
				</IconButton>
				<IconButton href="/rss.xml" label="RSS feed">
					<svg
						aria-hidden="true"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					>
						<path d="M4 11a9 9 0 0 1 9 9" />
						<path d="M4 4a16 16 0 0 1 16 16" />
						<circle cx="5" cy="19" r="1" fill="currentColor" stroke="none" />
					</svg>
				</IconButton>
			</nav>
		</div>
	{/snippet}

	<div class="mt-10 space-y-12 sm:mt-12 sm:space-y-14">
		<section aria-labelledby="built-heading">
			<h2
				id="built-heading"
				class="text-muted-foreground font-serif text-lg font-medium tracking-tight"
			>
				Built
			</h2>
			<ul class="mt-2 space-y-1">
				{#each site.projects as project (project.name)}
					<li>
						<a
							href={project.url}
							target="_blank"
							rel="noreferrer"
							class="group -mx-3 block rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-foreground/4 focus-visible:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
						>
							<div class="flex items-center justify-between gap-4">
								<span class="text-foreground inline-flex items-center gap-1.5 font-medium text-[1.0625rem]">
									<span class="font-serif text-[1.125rem] italic group-hover:text-accent transition-colors duration-150">
										{project.name}
									</span>
									<svg
										aria-hidden="true"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.75"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="text-muted-foreground/45 size-4 shrink-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none"
									>
										<path d="M7 17 17 7" />
										<path d="M7 7h10v10" />
									</svg>
								</span>
								{#if project.tag}
									<span
										class="bg-foreground/[0.07] text-muted-foreground text-[0.6875rem] font-medium tracking-wider uppercase px-1.5 py-0.5 rounded-sm shrink-0"
									>
										{project.tag}
									</span>
								{/if}
							</div>
							<p class="text-muted-foreground mt-1 max-w-lg text-[0.9375rem] leading-relaxed text-pretty">
								{project.description}
							</p>
						</a>
					</li>
				{/each}
			</ul>
		</section>

		{#if writings.length > 0}
			<section aria-labelledby="writing-heading">
				<h2
					id="writing-heading"
					class="text-muted-foreground font-serif text-lg font-medium tracking-tight"
				>
					Writing
				</h2>
				<ul class="mt-2 space-y-1">
					{#each writings as writing (writing.slug)}
						<li>
							<a
								href={`/writing/${writing.slug}`}
								class="group -mx-3 flex flex-col gap-1 rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-foreground/4 focus-visible:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
							>
								<span class="inline-flex min-w-0 items-baseline gap-2.5">
									<span
										class="text-foreground min-w-0 font-serif text-[1.125rem] italic tracking-tight group-hover:text-accent transition-colors duration-150"
									>
										{writing.frontmatter.title}
									</span>
									{#if writing.frontmatter.draft}
										<span
											class="bg-foreground/[0.07] text-muted-foreground text-[0.6875rem] font-medium tracking-wider uppercase px-1.5 py-0.5 rounded-sm"
										>
											Draft
										</span>
									{/if}
								</span>
								<time
									datetime={writing.frontmatter.date}
									class="text-muted-foreground/75 text-sm tabular-nums shrink-0 font-sans"
								>
									{writing.formattedDate}
								</time>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	</div>
</Page>
