<template>
	<section class="bg-[#17171a] px-0 py-16 text-center text-white md:py-20 lg:py-24">
		<div class="al-container grid justify-items-center gap-4">
			<h2 class="m-0 text-[30px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[36px] md:text-[42px] lg:text-[46px]">{{ t('home.cta.title') }}</h2>
			<p class="m-0 max-w-[640px] text-[16px] leading-7 text-[#b3b7c2]">{{ t('home.cta.desc') }}</p>
			<NuxtLink class="mt-2 inline-flex items-center justify-center rounded-full bg-[#f54a2a] px-6 py-3.5 text-[14px] font-semibold text-white" to="/about">{{ t('home.cta.action') }}</NuxtLink>
		</div>
	</section>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>