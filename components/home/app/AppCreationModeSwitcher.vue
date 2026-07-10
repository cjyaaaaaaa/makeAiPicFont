<template>
	<div class="grid grid-cols-2 rounded-[11px] border border-white/10 bg-[#151515] p-[3px]" role="tablist" :aria-label="creationModeLabel">
		<NuxtLink
			to="/ai-image-generator"
			:class="[
				'inline-flex h-[34px] items-center justify-center gap-2 rounded-lg text-[12.5px] font-extrabold transition-colors',
				activeMode === 'image'
					? 'bg-[#3b3b3d] text-white/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
					: 'text-white/40 hover:text-white/60',
			]"
			role="tab"
			:aria-selected="activeMode === 'image'"
		>
			<svg class="h-[15px] w-[15px]" viewBox="0 0 20 20" fill="none" aria-hidden="true">
				<rect x="3.5" y="4" width="13" height="12" rx="1.6" stroke="currentColor" stroke-width="1.5" />
				<path d="M5.5 13.5L8 10.8L10 12.6L11.7 10.8L14.5 13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
			{{ aiImageLabel }}
		</NuxtLink>
		<NuxtLink
			to="/ai-video-generator"
			:class="[
				'inline-flex h-[34px] items-center justify-center gap-2 rounded-lg text-[12.5px] font-extrabold transition-colors',
				activeMode === 'video'
					? 'bg-[#3b3b3d] text-white/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
					: 'text-white/40 hover:text-white/60',
			]"
			role="tab"
			:aria-selected="activeMode === 'video'"
		>
			<svg class="h-[15px] w-[15px]" viewBox="0 0 20 20" fill="none" aria-hidden="true">
				<rect x="3" y="6.5" width="9.5" height="7" rx="1.4" stroke="currentColor" stroke-width="1.5" />
				<path d="M12.5 8.5L17 6.5V13.5L12.5 11.5V8.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
			</svg>
			{{ aiVideoLabel }}
		</NuxtLink>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	activeMode: 'image' | 'video'
	creationModeLabel: string
	aiImageLabel: string
	aiVideoLabel: string
}>()
</script>
