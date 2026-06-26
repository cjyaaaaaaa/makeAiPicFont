<template>
	<section class="app-home-section" :class="{ 'is-large': large }">
		<header class="app-home-section__header">
			<h2>{{ title }}</h2>
			<NuxtLink v-if="viewAll" :to="viewAllLink">{{ viewAll }} <span aria-hidden="true">→</span></NuxtLink>
		</header>
		<div class="app-home-section__grid" :class="`is-${variant}`">
			<AppHomeCard
				v-for="card in cards"
				:key="card.id"
				:title="card.title"
				:meta="card.meta"
				:eyebrow="card.eyebrow"
				:badge="card.badge"
				:image="card.image"
				:size="card.size"
				:play="card.play"
				:arrow="card.arrow"
			/>
		</div>
	</section>
</template>

<script setup lang="ts">
import AppHomeCard from '~/components/home/app/AppHomeCard.vue'

type AppHomeCardItem = {
	id: string
	title: string
	meta?: string
	eyebrow?: string
	badge?: string
	image?: string
	size?: 'model' | 'wide' | 'template' | 'history'
	play?: boolean
	arrow?: boolean
}

withDefaults(defineProps<{
	title: string
	cards: AppHomeCardItem[]
	variant?: 'models' | 'rail' | 'templates' | 'history'
	viewAll?: string
	viewAllLink?: string
	large?: boolean
}>(), {
	variant: 'rail',
	viewAll: '',
	viewAllLink: '/',
	large: false,
})
</script>

<style scoped lang="scss">
.app-home-section {
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 12px;
	background: #050505;
	padding: 22px;
}

.app-home-section + .app-home-section {
	margin-top: 24px;
}

.app-home-section__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 18px;
	margin-bottom: 18px;

	h2 {
		margin: 0;
		color: #f6f6f6;
		font-size: 20px;
		font-weight: 850;
		letter-spacing: 0;
	}

	a {
		color: rgba(255, 255, 255, 0.46);
		font-size: 13px;
		font-weight: 700;
		text-decoration: none;
		transition: color 160ms ease;
	}

	a:hover {
		color: rgba(255, 255, 255, 0.86);
	}
}

.app-home-section__grid {
	display: grid;
	gap: 16px;
}

.app-home-section__grid.is-models {
	grid-template-columns: repeat(3, minmax(0, 1fr));
}

.app-home-section__grid.is-rail {
	grid-template-columns: repeat(4, minmax(0, 1fr));
}

.app-home-section__grid.is-templates {
	grid-template-columns: repeat(4, minmax(0, 1fr));
}

.app-home-section__grid.is-history {
	grid-template-columns: repeat(4, minmax(0, 1fr));
	justify-content: start;

	:deep(.app-home-card) {
		max-width: 280px;
	}
}

@media (max-width: 1180px) {
	.app-home-section__grid.is-models,
	.app-home-section__grid.is-templates {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.app-home-section__grid.is-rail,
	.app-home-section__grid.is-history {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 760px) {
	.app-home-section {
		padding: 16px;
	}

	.app-home-section__grid.is-models,
	.app-home-section__grid.is-rail,
	.app-home-section__grid.is-templates,
	.app-home-section__grid.is-history {
		grid-template-columns: 1fr;
	}
}
</style>
