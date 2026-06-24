<template>
	<section class="section-muted">
		<div class="al-container">
			<div class="section-header">
				<div>
					<p class="eyebrow">{{ t('home.products.eyebrow') }}</p>
					<h2 class="section-heading">{{ t('home.products.title') }}</h2>
				</div>
				<p class="section-desc compact">{{ t('home.products.desc') }}</p>
			</div>
			<div class="product-grid">
				<div v-for="item in cards" :key="item.title" class="product-card">
					<div class="product-thumb"></div>
					<h3>{{ item.title }}</h3>
					<p>{{ item.desc }}</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
const { t } = useI18n()
const cards = [
	{ title: 'AI 录音平台', desc: '支持录音、转写、检索和标签管理。' },
	{ title: '智能质检', desc: '面向服务话术、合规和客服质检场景。' },
	{ title: '会议转写', desc: '将会议语音快速沉淀为可搜索文本。' },
	{ title: '知识中心', desc: '汇聚业务内容，支持统一管理与复用。' }
]
</script>

<style scoped lang="scss">
.section-muted { padding: 84px 0; background: #070a12; color: #f8fafc; }
.section-header { display: flex; justify-content: space-between; gap: 24px; align-items: end; margin-bottom: 30px; }
.eyebrow { font-size: 12px; letter-spacing: .24em; text-transform: uppercase; color: #ef4d2c; margin-bottom: 16px; }
.section-heading { font-size: clamp(30px, 3vw, 48px); line-height: 1.05; margin: 0; }
.section-desc { color: #a8b3c7; margin-top: 18px; max-width: 560px; font-size: 16px; line-height: 1.7; }
.compact { max-width: 420px; }
.product-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 16px; }
.product-card { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 20px; padding: 22px; }
.product-card p { color: #a8b3c7; }
.product-thumb { aspect-ratio: 1.2; margin-bottom: 16px; border-radius: 18px; background: linear-gradient(135deg,#4a160f,#ef4d2c); }
@media (max-width: 1024px) { .section-header { grid-template-columns: 1fr; display: grid; } .product-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (max-width: 640px) { .product-grid { grid-template-columns: 1fr; } }
</style>
