<script lang="ts">
	const navItems = {
		'/': {
			name: 'joeychilson.com'
		},
		'/posts': {
			name: 'posts'
		},
		'https://github.com/joeychilson': {
			name: 'github'
		},
		'https://x.com/joeychilson': {
			name: 'x'
		}
	};
</script>

<aside class="-ml-[8px] mb-16 tracking-tight">
	<div class="lg:sticky lg:top-20">
		<nav class="fade relative flex flex-row items-center justify-between px-0 pb-0" id="nav">
			<div class="flex flex-row items-center space-x-4">
				{#each Object.entries(navItems) as [path, { name }]}
					<a
						href={path}
						class="relative flex px-2 py-1 align-middle transition-all hover:text-neutral-800 dark:hover:text-neutral-200"
					>
						{name}
					</a>
				{/each}
			</div>
		</nav>
	</div>
</aside>
