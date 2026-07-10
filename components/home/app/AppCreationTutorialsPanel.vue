<template>
	<div class="mx-auto grid w-full max-w-[min(920px,100%)] gap-5 py-2">
		<header class="grid gap-2 text-center">
			<h2 class="m-0 text-[clamp(28px,3.2vw,40px)] font-[850] leading-tight tracking-[-0.02em] text-white">
				{{ title }}
			</h2>
			<p class="m-0 text-[13px] font-semibold leading-relaxed text-white/40">
				{{ description }}
			</p>
		</header>

		<div class="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0b] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
			<video
				class="block aspect-video w-full bg-black object-contain"
				:src="videoSrc"
				:aria-label="videoLabel"
				controls
				playsinline
				preload="metadata"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	title: string
	description: string
	videoSrc: string
	videoLabel: string
}>()
</script>
