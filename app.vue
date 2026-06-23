<template>
	<div>
		<AppHeader />
		<main class="mx-auto w-full max-w-[1152px] px-4 md:px-6 lg:px-8">
			<NuxtPage />
		</main>
		<TipToast ref="tipToastRef" />
	</div>
</template>

<script setup lang="ts">
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
