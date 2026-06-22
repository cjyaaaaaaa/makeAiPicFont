<template>
	<section class="section-white">
		<div class="al-container">
			<div class="section-header">
				<div>
					<p class="eyebrow">{{ t('home.solutions.eyebrow') }}</p>
					<h2 class="section-heading">{{ t('home.solutions.title') }}</h2>
				</div>
				<p class="section-desc compact">{{ t('home.solutions.desc') }}</p>
			</div>
			<div class="solution-grid">
				<article v-for="item in items" :key="item.title" class="solution-card">
					<div class="solution-icon"></div>
					<h3>{{ item.title }}</h3>
					<p>{{ item.desc }}</p>
				</article>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
const { t } = useI18n()
const items = computed(() => t('home.solutions.items') as Array<{ title: string; desc: string }>)
</script>

<style scoped lang="scss">
.section-white { padding: 84px 0; background: #fff; }
.section-header { display: flex; justify-content: space-between; gap: 24px; align-items: end; margin-bottom: 30px; }
.eyebrow { font-size: 12px; letter-spacing: .24em; text-transform: uppercase; color: #ff5a3d; margin-bottom: 16px; }
.section-heading { font-size: clamp(30px, 3vw, 48px); line-height: 1.05; margin: 0; }
.section-desc { color: #7b7f87; margin-top: 18px; max-width: 560px; font-size: 16px; line-height: 1.7; }
.compact { max-width: 420px; }
.solution-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 16px; }
.solution-card { background: rgba(255,255,255,.72); border: 1px solid rgba(20,23,31,.08); border-radius: 20px; padding: 22px; }
.solution-icon { width: 46px; height: 46px; margin-bottom: 18px; border-radius: 18px; background: linear-gradient(135deg,#f54a2a,#ffb98e); }
@media (max-width: 1024px) { .section-header { grid-template-columns: 1fr; display: grid; } .solution-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (max-width: 640px) { .solution-grid { grid-template-columns: 1fr; } }
</style>