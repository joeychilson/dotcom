<script lang="ts">
	import { asset } from '$app/paths';
</script>

<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none" aria-hidden="true">
	<div
		class="bg-linear-[to_bottom,#f3f6f9_0%,#f3f6f9_42%,#eff4f9_56%,#e2edf6_70%,#cadff0_84%,#98cce4_100%] absolute inset-0 opacity-100 transition-opacity duration-700 ease-out motion-reduce:transition-none dark:opacity-0"
	>
		<img
			src={asset('images/harbor-day.webp')}
			alt=""
			width="2172"
			height="724"
			fetchpriority="high"
			decoding="async"
			class="mask-linear-[to_bottom,transparent_0%,transparent_6%,rgb(0_0_0/10%)_18%,rgb(0_0_0/32%)_34%,rgb(0_0_0/65%)_55%,rgb(0_0_0/90%)_75%,black_90%] absolute -bottom-px left-1/2 h-auto w-[max(100vw,var(--harbor-min-width))] max-w-none -translate-x-1/2"
		/>
	</div>
	<div
		class="bg-linear-[to_bottom,#070c16_0%,#070c16_42%,#08101e_56%,#0a172c_70%,#0a1f3c_84%,#0a2a52_100%] absolute inset-0 opacity-0 transition-opacity duration-700 ease-out motion-reduce:transition-none dark:opacity-100"
	>
		<img
			src={asset('images/harbor-night.webp')}
			alt=""
			width="2172"
			height="724"
			decoding="async"
			class="mask-linear-[to_bottom,transparent_0%,transparent_6%,rgb(0_0_0/10%)_18%,rgb(0_0_0/32%)_34%,rgb(0_0_0/65%)_55%,rgb(0_0_0/90%)_75%,black_90%] absolute -bottom-px left-1/2 h-auto w-[max(100vw,var(--harbor-min-width))] max-w-none -translate-x-1/2"
		/>
	</div>
</div>
