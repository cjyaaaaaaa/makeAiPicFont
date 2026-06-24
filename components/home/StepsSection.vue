<template>
	<section class="bg-[#15161a] px-0 py-16 md:py-20 lg:py-24">
		<div class="al-container">
			<div class="mb-8 max-w-[640px]">
				<p class="mb-4 text-[12px] uppercase tracking-[0.24em] text-[#ef4d2c]">03</p>
				<h2 class="m-0 text-[34px] font-semibold leading-[1.02] tracking-[-0.04em] text-[#f8fafc] sm:text-[42px] md:text-[48px] lg:text-[56px]">{{ t('home.steps.title') }}</h2>
				<p class="mt-3 text-[16px] leading-7 text-[#a8b3c7]">{{ t('home.steps.desc') }}</p>
		</div>

			<div class="grid border-t border-white/10 md:grid-cols-3">
				<article v-for="step in steps" :key="step.no" class="min-h-[170px] border-b border-r border-white/10 p-6 last:border-r-0">
					<div class="mb-4 text-[32px] font-bold leading-none text-[#ef4d2c]">{{ step.no }}</div>
					<h3 class="mb-2 text-[18px] font-semibold text-[#f8fafc]">{{ step.title }}</h3>
					<p class="text-[15px] leading-7 text-[#a8b3c7]">{{ step.desc }}</p>
				</article>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
const { t } = useI18n()
const steps = computed(() => t('home.steps.items') as Array<{ no: string; title: string; desc: string }>)
</script>
