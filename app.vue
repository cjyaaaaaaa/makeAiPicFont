<template>
	<div class="min-h-screen bg-[#15161a] text-[#a8b3c7]">
		<AppHeader v-if="!isAppHome" />
		<main :class="isAppHome ? 'w-full' : 'mx-auto w-full max-w-[1720px] px-4 md:px-6 lg:px-8'">
			<NuxtPage />
		</main>
		<SiteFooterSection v-if="!isAppHome" />
		<TipToast ref="tipToastRef" />
	</div>
</template>

<script setup lang="ts">
import SiteFooterSection from '~/components/home/SiteFooterSection.vue'

import TipToast from '~/components/TipToast.vue'

const tipToastRef = ref<{ show: (payload: { title: string; message?: string; type?: 'success' | 'error' | 'info'; duration?: number }) => void } | null>(null)
const { registerTipToast } = useTipToast()
const route = useRoute()
const homeLocaleCodes = ['zh', 'en', 'de', 'es', 'ja']
const isAppHome = computed(() => {
	const segments = route.path.split('/').filter(Boolean)
	const firstAppSegment = homeLocaleCodes.includes(segments[0]) ? segments[1] : segments[0]
	return firstAppSegment === 'home' || firstAppSegment === 'explore' || firstAppSegment === 'assets' || firstAppSegment === 'ai-image-generator' || firstAppSegment === 'ai-video-generator' || firstAppSegment === 'tools'
})

onMounted(() => {
	registerTipToast(tipToastRef.value)
})

watch(tipToastRef, (instance) => {
	registerTipToast(instance)
})
</script>
