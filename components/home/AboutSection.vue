<template>
	<section class="section-light">
		<div class="al-container split-section">
			<div>
				<p class="eyebrow">{{ t('home.about.eyebrow') }}</p>
				<h2 class="section-heading">{{ t('home.about.title') }}</h2>
				<p class="section-desc">{{ t('home.about.desc') }}</p>
			</div>
			<div class="stats-grid">
				<div v-for="stat in stats" :key="stat.label" class="stat-card">
					<strong>{{ stat.value }}</strong>
					<span>{{ stat.label }}</span>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
const { t } = useI18n()
const stats = computed(() => t('home.about.stats') as Array<{ value: string; label: string }>)
</script>

<style scoped lang="scss">
.section-light { padding: 84px 0; background: #070a12; color: #f8fafc; }
.split-section { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: center; }
.eyebrow { font-size: 12px; letter-spacing: .24em; text-transform: uppercase; color: #ef4d2c; margin-bottom: 16px; }
.section-heading { font-size: clamp(30px, 3vw, 48px); line-height: 1.05; margin: 0; }
.section-desc { color: #a8b3c7; margin-top: 18px; max-width: 560px; font-size: 16px; line-height: 1.7; }
.stats-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 16px; }
.stat-card { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 20px; padding: 22px; }
.stat-card strong { display: block; font-size: 36px; line-height: 1; margin-bottom: 10px; }
.stat-card span { color: #a8b3c7; }
@media (max-width: 1024px) { .split-section { grid-template-columns: 1fr; } }
@media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr; } }
</style>
