<template>
	<div class="min-h-screen bg-[#15161a] text-[#a8b3c7]">
		<AppHeader />
		<main class="mx-auto w-full max-w-[1720px] px-4 md:px-6 lg:px-8">
			<NuxtPage />
		</main>
		<SiteFooterSection />
		<TipToast ref="tipToastRef" />
	</div>
</template>

<script setup lang="ts">
import SiteFooterSection from '~/components/home/SiteFooterSection.vue'

import TipToast from '~/components/TipToast.vue'

const tipToastRef = ref<{ show: (payload: { title: string; message?: string; type?: 'success' | 'error' | 'info'; duration?: number }) => void } | null>(null)
const { registerTipToast } = useTipToast()

onMounted(() => {
	registerTipToast(tipToastRef.value)
})

watch(tipToastRef, (instance) => {
	registerTipToast(instance)
})
</script>
