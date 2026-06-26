<template>
	<section class="section-white">
		<div class="al-container">
			<div class="section-header">
				<div>
					<p class="eyebrow">{{ t('home.news.eyebrow') }}</p>
					<h2 class="section-heading">{{ t('home.news.title') }}</h2>
				</div>
				<p class="section-desc compact">{{ t('home.news.desc') }}</p>
			</div>
			<div class="news-layout">
				<div class="news-feature"></div>
				<ul class="news-list">
					<li v-for="(newsItem, index) in items" :key="newsItem.title">
						<span class="news-index">0{{ index + 1 }}</span>
						<div class="news-content">
							<h3>{{ newsItem.title }}</h3>
							<time>{{ newsItem.date }}</time>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
const { t } = useAppI18n()
const items = computed(() => t('home.news.items') as Array<{ title: string; date: string }>)
</script>

<style scoped lang="scss">
.section-white { padding: 84px 0; background: #0b0f19; color: #f8fafc; }
.section-header { display: flex; justify-content: space-between; gap: 24px; align-items: end; margin-bottom: 30px; }
.eyebrow { font-size: 12px; letter-spacing: .24em; text-transform: uppercase; color: #ef4d2c; margin-bottom: 16px; }
.section-heading { font-size: clamp(30px, 3vw, 48px); line-height: 1.05; margin: 0; }
.section-desc { color: #a8b3c7; margin-top: 18px; max-width: 560px; font-size: 16px; line-height: 1.7; }
.compact { max-width: 420px; }
.news-layout { display: grid; grid-template-columns: 1.1fr .9fr; gap: 28px; align-items: start; }
.news-feature { min-height: 340px; border-radius: 22px; background: linear-gradient(135deg,#4a160f,#ef4d2c); }
.news-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 18px; }
.news-list li { display: flex; gap: 14px; align-items: flex-start; padding-bottom: 18px; border-bottom: 1px solid rgba(255,255,255,.1); }
.news-index { display: inline-flex; min-width: 48px; justify-content: center; padding: 6px 10px; border-radius: 6px; background: #ef4d2c; color: #fff; font-weight: 700; }
.news-content h3 { margin: 0 0 8px; font-size: 18px; }
.news-content time { color: #7f8da5; font-size: 14px; }
@media (max-width: 1024px) { .section-header { grid-template-columns: 1fr; display: grid; } .news-layout { grid-template-columns: 1fr; } }
</style>
