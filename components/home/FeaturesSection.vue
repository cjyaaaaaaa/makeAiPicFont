<template>
	<section class="border-b border-white/10 bg-[#15161a] px-0 pb-0">
		<div class="al-container max-w-[1720px] px-4 pb-16 md:px-6 lg:px-6">
			<p class="font-mono text-[12px] uppercase tracking-[0.2em] text-[#ef4d2c] md:tracking-[2.4px]">{{ t('home.features.eyebrow') }}</p>
			<h2 class="mt-6 max-w-[896px] text-[42px] font-medium leading-[0.98] tracking-[-0.045em] text-[#f8fafc] sm:text-[52px] md:text-[64px] lg:text-[72px]">
				<span class="block">{{ t('home.features.title1') }}</span>
				<span class="block text-[#ef4d2c]">{{ t('home.features.title2') }}</span>
			</h2>
			<p class="mt-6 max-w-[576px] text-[16px] leading-7 text-[#a8b3c7] md:text-[18px]">{{ t('home.features.desc') }}</p>

			<div class="mt-12">
				<AiCarousel
					:eyebrow="t('home.features.panelTypeLabel')"
					:title="t('home.features.panelTitle')"
					:prompt-label="t('home.features.promptLabel')"
					:prompt="t('home.features.prompt')"
					:create-label="t('home.features.create')"
					enhanced-label="Enhanced"
					:images="sampleImages"
				/>
			</div>

			<div class="mt-14 max-w-[672px]">
				<div class="border border-white/10 bg-[#0d121d] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
					<div class="space-y-3 border-b border-white/10 px-4 py-4 md:px-5">
						<label class="block text-[12px] font-mono uppercase tracking-[0.35em] text-[#7f8da5]">{{ t('home.features.inputLabel') }}</label>
						<textarea
							v-model="promptText"
							class="min-h-[104px] w-full resize-none border-0 bg-transparent p-0 text-[14px] leading-6 text-[#f8fafc] outline-none placeholder:text-[#64748b]"
							:placeholder="t('home.features.inputPlaceholder')"
						/>

						<div class="flex flex-wrap items-center justify-between gap-3">
							<div class="flex items-center gap-2">
								<button class="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-[13px] font-medium text-[#f8fafc] transition hover:border-white/20 hover:bg-white/10" type="button" @click="triggerUpload">
									<span class="text-[15px] leading-none">＋</span>
									<span>{{ t('home.features.uploadImages') }}</span>
								</button>
								<span class="text-[12px] text-[#7f8da5]">{{ uploadedImages.length }}/10</span>
							</div>
							<input ref="fileInputRef" type="file" accept="image/*" multiple class="hidden" @change="handleFiles" />
						</div>
					</div>

					<div class="flex flex-wrap gap-3 px-4 py-4 md:px-5">
						<div v-for="(image, index) in uploadedImages" :key="image.id" class="group relative h-[68px] w-[68px] overflow-hidden rounded-[14px] border border-white/10 bg-white/5">
							<img :src="image.src" :alt="image.name" class="h-full w-full object-cover" />
							<button type="button" class="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-[12px] text-white opacity-0 transition group-hover:opacity-100" @click="removeImage(index)">×</button>
						</div>
					</div>

					<div class="flex items-center justify-between border-t border-white/10 px-4 py-3 md:px-5">
						<span class="font-mono text-[12px] uppercase tracking-[0.35em] text-[#7f8da5]">{{ t('home.features.chooseModel') }}</span>
						<button class="inline-flex h-9 items-center rounded-full bg-[#ef4d2c] px-3 text-[14px] font-medium text-white transition hover:bg-[#ff6a45]" type="button" @click="generateNow">
							<span>{{ t('home.features.startGenerating') }}</span>
							<span class="ml-2 text-[16px] leading-none">→</span>
						</button>
					</div>
				</div>

				<div class="mt-3 grid gap-0 md:grid-cols-3">
					<button v-for="card in cards" :key="card.no" type="button" class="relative min-h-[174px] border border-white/10 bg-[#0d121d] p-[17px] text-left transition duration-200 md:-ml-px md:first:ml-0" :class="selectedModel?.no === card.no ? 'relative z-10 border-[#ef4d2c] shadow-[0_16px_34px_rgba(239,77,44,0.14)]' : 'hover:bg-[#111827]'" @click="selectedModel = card">
						<div class="flex items-center justify-between">
							<span class="text-[12px] font-medium text-[#7f8da5]">{{ card.no }}</span>
							<span class="font-mono text-[12px] uppercase tracking-[0.08em] text-[#ef4d2c]">{{ card.tag }}</span>
						</div>
						<div class="mt-3">
							<h4 class="text-[16px] font-medium text-[#f8fafc]">{{ card.title }}</h4>
							<p class="mt-1 text-[12px] text-[#7f8da5]">{{ card.subtitle }}</p>
							<p class="mt-2 text-[14px] leading-5 text-[#a8b3c7]">{{ card.desc }}</p>
						</div>
						<div v-if="selectedModel?.no === card.no" class="absolute left-0 top-0 h-full w-[2px] bg-[#ef4d2c]"></div>
					</button>
				</div>
			</div>

			<p class="mt-10 font-mono text-[12px] uppercase tracking-[0.05em] text-[#7f8da5]">{{ t('home.features.trusted') }}</p>
		</div>
	</section>
</template>

<script setup lang="ts">
import AiCarousel from '~/components/home/AiCarousel.vue'
const { t } = useAppI18n()

const sampleImages = [
	{ src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=640&q=80', alt: 'Sample 1' },
	{ src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=640&q=80', alt: 'Sample 2' },
	{ src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=640&q=80', alt: 'Sample 3' },
]

const promptText = ref(t('home.features.inputPlaceholder'))
const selectedModel = ref<{ no: string; tag: string; title: string; subtitle: string; desc: string } | null>(null)
const uploadedImages = ref<Array<{ id: string; name: string; src: string }>>([])
const fileInputRef = ref<HTMLInputElement | null>(null)

const cards = computed(() => t('home.features.models') as Array<{ no: string; tag: string; title: string; subtitle: string; desc: string }>)

selectedModel.value = cards.value[0]

const triggerUpload = () => fileInputRef.value?.click()

const handleFiles = (event: Event) => {
	const input = event.target as HTMLInputElement
	const files = Array.from(input.files ?? [])
	const remain = Math.max(0, 10 - uploadedImages.value.length)
	const picked = files.slice(0, remain)

	picked.forEach(file => {
		const src = URL.createObjectURL(file)
		uploadedImages.value.push({
			id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
			name: file.name,
			src,
		})
	})

	input.value = ''
}

const removeImage = (index: number) => {
	const target = uploadedImages.value[index]
	if (target) URL.revokeObjectURL(target.src)
	uploadedImages.value.splice(index, 1)
}

const generateNow = () => {
	if (!selectedModel.value) selectedModel.value = cards.value[0]
	promptText.value = promptText.value.trim() || t('home.features.inputPlaceholder')
}
</script>
