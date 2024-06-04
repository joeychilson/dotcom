<script lang="ts">
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';

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
			<button
				on:click={toggleMode}
				class="relative flex items-center px-2 py-1 transition-all hover:text-neutral-800 dark:hover:text-neutral-200"
			>
				<Sun
					class="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<Moon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</button>
		</nav>
	</div>
</aside>
