<template>
	<div class="relative overflow-hidden rounded-[16px] border border-white/10 bg-[#0b0e15] p-px shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
		<div class="px-4 py-10 md:px-10 md:py-12">
			<p v-if="eyebrow" class="text-center font-mono text-[12px] uppercase tracking-[0.08em] text-[#5fb8ff]">{{ eyebrow }}</p>
			<h3 class="mt-2 text-center text-[28px] font-medium tracking-[-0.04em] text-white md:text-[36px]">{{ title }}</h3>

			<div class="relative mt-8 h-[280px] w-full">
				<div class="absolute left-0 top-1/2 hidden -translate-y-1/2 gap-4 lg:flex">
					<div class="h-[140px] w-[112px] overflow-hidden rounded-[4px] border border-white/10 bg-black/40 p-px">
						<div class="relative h-full w-full overflow-hidden rounded-[inherit]">
							<img :src="leftImage" alt="AI sample left" class="h-full w-full object-cover" />
							<span class="absolute left-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-[4px] bg-black/55 text-[10px] font-medium text-white/80">1</span>
						</div>
					</div>
					<div class="grid h-5 w-5 place-items-center self-center text-[#5fb8ff]">+</div>
					<div class="h-[140px] w-[112px] overflow-hidden rounded-[4px] border border-white/10 bg-black/40 p-px">
						<div class="relative h-full w-full overflow-hidden rounded-[inherit]">
							<img :src="middleImage" alt="AI sample middle" class="h-full w-full object-cover" />
							<span class="absolute left-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-[4px] bg-black/55 text-[10px] font-medium text-white/80">2</span>
						</div>
					</div>
				</div>

				<div class="absolute left-1/2 top-[122px] hidden h-9 w-9 -translate-x-1/2 place-items-center text-[#2f8fff] lg:grid">
					<span class="text-[32px] leading-none">›</span>
				</div>

				<div class="absolute right-0 top-0 h-[280px] w-[224px] overflow-hidden rounded-[8px] border border-[#5fb8ff]/40 bg-black/40 p-px shadow-[0px_0px_40px_-8px_rgba(95,184,255,0.5)] md:right-[calc(50%-512px+40px)]">
					<div class="relative h-full w-full overflow-hidden rounded-[inherit]">
						<img :src="activeImage" alt="AI enhanced sample" class="h-full w-full object-cover transition duration-700" />
						<span class="absolute right-2 top-2 rounded-[4px] bg-[rgba(47,143,255,0.85)] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.05em] text-white">
							{{ enhancedLabel }}
						</span>
					</div>
				</div>
			</div>

			<p class="mx-auto mt-6 max-w-[576px] text-center text-[14px] leading-5 text-white/40 md:mt-8">
				<span class="text-white/45">{{ promptLabel }}</span>
				{{ prompt }}
			</p>

			<div class="mt-8 flex items-center justify-center gap-4">
				<div class="flex items-center gap-2">
					<span v-for="(item, index) in images" :key="item.src" :class="index === activeIndex ? 'h-1.5 w-6 rounded-full bg-[#5fb8ff]' : 'h-1.5 w-1.5 rounded-full bg-white/25'"></span>
				</div>
				<button class="inline-flex items-center gap-2 rounded-full bg-[#2f8fff] px-4 py-2 text-[14px] font-medium text-white shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)]" @click="nextSlide">
					<span class="text-[15px] leading-none">✦</span>
					<span>{{ createLabel }}</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
type ImageItem = { src: string; alt: string }

const props = defineProps<{
	eyebrow?: string
	title: string
	promptLabel: string
	prompt: string
	createLabel: string
	enhancedLabel: string
	images: ImageItem[]
	interval?: number
}>()

const activeIndex = ref(0)
const activeImage = computed(() => props.images[activeIndex.value]?.src ?? props.images[0].src)
const leftImage = computed(() => props.images[(activeIndex.value + 1) % props.images.length]?.src ?? props.images[0].src)
const middleImage = computed(() => props.images[(activeIndex.value + 2) % props.images.length]?.src ?? props.images[0].src)

const nextSlide = () => {
	activeIndex.value = (activeIndex.value + 1) % props.images.length
}

let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
	timer = setInterval(() => {
		nextSlide()
	}, props.interval ?? 3000)
})

onBeforeUnmount(() => {
	if (timer) clearInterval(timer)
})
</script>