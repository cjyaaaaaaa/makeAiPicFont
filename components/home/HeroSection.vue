<template>
	<section class="bg-gradient-to-b from-[#fbf6ef] to-[#f6f2ea] px-0 py-16 md:py-20 lg:py-24">
		<div class="al-container grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-9">
			<div>
				<p class="mb-4 text-[12px] uppercase tracking-[0.24em] text-[#ff5a3d]">{{ t('home.hero.eyebrow') }}</p>
				<h1 class="m-0 grid max-w-[760px] gap-2 text-[42px] font-bold leading-[0.95] tracking-[-0.04em] text-[#14171f] sm:text-[56px] md:text-[64px] lg:text-[76px]">
					<span>{{ t('home.hero.title1') }}</span>
					<span class="text-[#f54a2a]">{{ t('home.hero.title2') }}</span>
				</h1>
				<p class="mt-5 max-w-[560px] text-[16px] leading-7 text-[#7b7f87]">{{ t('home.hero.desc') }}</p>
				<div class="mt-7 flex flex-wrap gap-3">
					<NuxtLink class="inline-flex items-center justify-center rounded-full bg-[#f54a2a] px-6 py-3.5 text-[14px] font-semibold text-white" to="/product">{{ t('home.hero.primaryAction') }}</NuxtLink>
					<NuxtLink class="inline-flex items-center justify-center rounded-full border border-[#d9d5cc] bg-white px-6 py-3.5 text-[14px] font-semibold text-[#14171f]" to="/solution">{{ t('home.hero.secondaryAction') }}</NuxtLink>
				</div>
			</div>

			<div class="rounded-[24px] bg-[#111318] p-6 text-white shadow-[0_18px_60px_rgba(17,19,24,0.16)]">
				<div class="flex items-center justify-between text-[13px] text-[#b5bac4]">
					<span>VAA</span>
					<span>AI Audio</span>
				</div>
				<div class="flex min-h-[280px] items-center justify-center gap-5 py-8 md:min-h-[310px]">
					<div class="h-[140px] w-[90px] rounded-[18px] bg-gradient-to-b from-white to-[#cfd4df]"></div>
					<div class="h-[220px] w-[160px] rounded-[18px] bg-gradient-to-b from-[#6846ff] to-[#f2d4d0]"></div>
					<div class="h-[140px] w-[90px] rounded-[18px] bg-gradient-to-b from-white to-[#cfd4df]"></div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>