<template>
	<article class="legal-page">
		<header class="legal-page__header">
			<p class="legal-page__eyebrow">{{ company }}</p>
			<h1>{{ title }}</h1>
			<p class="legal-page__meta">{{ updatedLabel }} · {{ contactEmail }}</p>
		</header>

		<p v-if="intro" class="legal-page__intro">{{ intro }}</p>

		<section v-for="(section, index) in sections" :key="`${section.title}-${index}`" class="legal-page__section">
			<h2>{{ section.title }}</h2>
			<p v-for="(paragraph, paragraphIndex) in section.paragraphs" :key="paragraphIndex">
				{{ paragraph }}
			</p>
		</section>

		<footer class="legal-page__footer">
			<p>{{ contactLabel }}: <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a></p>
			<p>{{ company }}</p>
		</footer>
	</article>
</template>

<script setup lang="ts">
export type LegalSection = {
	title: string
	paragraphs: string[]
}

defineProps<{
	title: string
	intro?: string
	updatedLabel: string
	company: string
	contactEmail: string
	contactLabel: string
	sections: LegalSection[]
}>()
</script>

<style scoped lang="scss">
.legal-page {
	width: min(820px, 100%);
	margin: 0 auto;
	padding: 112px 0 88px;
	color: #d5dbe7;
}

.legal-page__header {
	margin-bottom: 28px;
	padding-bottom: 24px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.legal-page__eyebrow {
	margin: 0 0 10px;
	color: rgba(248, 250, 252, 0.45);
	font-size: 13px;
	font-weight: 600;
	letter-spacing: 0.04em;
	text-transform: uppercase;
}

.legal-page__header h1 {
	margin: 0;
	color: #f8fafc;
	font-size: clamp(28px, 4vw, 40px);
	font-weight: 750;
	letter-spacing: -0.03em;
	line-height: 1.15;
}

.legal-page__meta {
	margin: 14px 0 0;
	color: rgba(168, 179, 199, 0.78);
	font-size: 14px;
}

.legal-page__intro {
	margin: 0 0 28px;
	color: rgba(213, 219, 231, 0.88);
	font-size: 15px;
	line-height: 1.75;
}

.legal-page__section {
	margin-bottom: 28px;

	h2 {
		margin: 0 0 12px;
		color: #f8fafc;
		font-size: 18px;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	p {
		margin: 0 0 10px;
		color: rgba(213, 219, 231, 0.86);
		font-size: 14.5px;
		line-height: 1.75;
	}
}

.legal-page__footer {
	margin-top: 36px;
	padding-top: 22px;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
	color: rgba(168, 179, 199, 0.78);
	font-size: 14px;
	line-height: 1.7;

	p {
		margin: 0 0 6px;
	}

	a {
		color: #f8fafc;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
}

@media (max-width: 768px) {
	.legal-page {
		padding: 96px 0 64px;
	}
}
</style>
