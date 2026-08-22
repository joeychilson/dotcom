<script lang="ts">
	import { mode, toggleMode } from 'mode-watcher';
	import IconButton from './IconButton.svelte';
</script>

<IconButton label="Toggle color theme" pressed={mode.current === 'dark'} onclick={toggleMode}>
	<svg
		aria-hidden="true"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.75"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="rotate-0 scale-100 transition-transform duration-500 motion-reduce:transition-none dark:-rotate-90 dark:scale-0"
	>
		<circle cx="12" cy="12" r="4" />
		<path
			d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"
		/>
	</svg>
	<svg
		aria-hidden="true"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.75"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="absolute rotate-90 scale-0 transition-transform duration-500 motion-reduce:transition-none dark:rotate-0 dark:scale-100"
	>
		<path d="M20.7 13.2A8.5 8.5 0 1 1 10.8 3.3a7 7 0 0 0 9.9 9.9Z" />
	</svg>
</IconButton>
