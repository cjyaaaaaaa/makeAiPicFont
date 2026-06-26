<template>
	<div class="app-home">
		<AppHomeSidebar />
		<main class="app-home__main">
			<AppHomeSection :title="copy.modelsTitle" :cards="modelCards" variant="models" large />
			<AppHomeSection :title="copy.inspirationTitle" :view-all="copy.viewAll" :cards="inspirationCards" variant="rail" view-all-link="/explore" />
			<AppHomeSection :title="copy.templateTitle" :view-all="copy.viewAll" :cards="templateCards" variant="templates" view-all-link="/assets" />
			<AppHomeSection :title="copy.exploreTitle" :view-all="copy.viewAll" :cards="exploreCards" variant="rail" view-all-link="/explore" />
			<AppHomeSection :title="copy.historyTitle" :view-all="copy.viewAll" :cards="historyCards" variant="history" view-all-link="/history" />
		</main>
	</div>
</template>

<script setup lang="ts">
import AppHomeSection from '~/components/home/app/AppHomeSection.vue'
import AppHomeSidebar from '~/components/home/app/AppHomeSidebar.vue'

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

type AppHomeCopy = {
	modelsTitle: string
	inspirationTitle: string
	templateTitle: string
	exploreTitle: string
	historyTitle: string
	viewAll: string
	models: Array<Omit<AppHomeCardItem, 'image' | 'size' | 'play' | 'arrow'> & { imageKey?: string; placeholder?: boolean; play?: boolean; arrow?: boolean }>
	inspiration: Array<Omit<AppHomeCardItem, 'image' | 'size' | 'play' | 'arrow'> & { imageKey: string; play?: boolean }>
	templates: Array<Omit<AppHomeCardItem, 'image' | 'size' | 'play' | 'arrow'> & { imageKey: string }>
	explore: Array<Omit<AppHomeCardItem, 'image' | 'size' | 'play' | 'arrow'> & { imageKey: string }>
	history: Array<Omit<AppHomeCardItem, 'image' | 'size' | 'play' | 'arrow'> & { imageKey?: string; placeholder?: boolean }>
}

const { t } = useAppI18n()
const photo = (id: string, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=84`
const images: Record<string, string> = {
	cliff: photo('photo-1500530855697-b586d89ba3ee', 1100),
	market: photo('photo-1500534314209-a25ddb2bd429', 1100),
	watch: photo('photo-1523275335684-37898b6baf30', 1100),
	collage: photo('photo-1496747611176-843222e1e57c', 1100),
	tuxedo: photo('photo-1519085360753-af0119f7cbe7', 1100),
	warrior: photo('photo-1518837695005-2083093ee35b', 1100),
	boxing: photo('photo-1549719386-74dfcbf7dbed', 800),
	helicopter: photo('photo-1533591380348-14193f1de18f', 800),
	basketball: photo('photo-1546519638-68e109498ffc', 800),
	racing: photo('photo-1503376780353-7e6692767b70', 800),
	street: photo('photo-1496747611176-843222e1e57c', 800),
	fashion: photo('photo-1524504388940-b1c1722653e1', 800),
	ceiling: photo('photo-1548013146-72479768bada', 800),
	espresso: photo('photo-1517668808822-9ebb02f2a0e6', 800),
	portraitA: photo('photo-1500648767791-00dcc994a43e', 800),
	portraitB: photo('photo-1507003211169-0a1dd7228f2d', 800),
	travel: photo('photo-1500530855697-b586d89ba3ee', 800),
	poster: photo('photo-1500534314209-a25ddb2bd429', 800),
	reading: photo('photo-1517841905240-472988babdf9', 800),
}

const copy = computed(() => t('home.app') as AppHomeCopy)
const hydrate = (cards: AppHomeCopy['models'], size: AppHomeCardItem['size']): AppHomeCardItem[] => cards.map(card => ({
	...card,
	size,
	image: card.placeholder ? '' : images[card.imageKey || ''] || '',
}))
const modelCards = computed(() => hydrate(copy.value.models, 'model'))
const inspirationCards = computed(() => hydrate(copy.value.inspiration, 'wide'))
const templateCards = computed(() => hydrate(copy.value.templates, 'template'))
const exploreCards = computed(() => hydrate(copy.value.explore, 'wide'))
const historyCards = computed(() => hydrate(copy.value.history, 'history'))
</script>

<style scoped lang="scss">
.app-home {
	display: grid;
	grid-template-columns: 240px minmax(0, 1fr);
	min-height: 100vh;
	background: #000;
	color: #f5f5f5;
}

.app-home__main {
	min-width: 0;
	padding: 30px;
}

@media (max-width: 900px) {
	.app-home {
		grid-template-columns: 1fr;
	}

	.app-home__main {
		padding: 16px;
	}
}
</style>
