<template>
	<div class="app-explore" :class="{ 'is-sidebar-collapsed': sidebarCollapsed }">
		<AppHomeSidebar :collapsed="sidebarCollapsed" @toggle-collapse="sidebarCollapsed = !sidebarCollapsed" />
		<main class="app-explore__main">
			<div class="app-explore__filters" role="tablist" aria-label="Explore filters">
				<button
					v-for="filter in filters"
					:key="filter.value"
					type="button"
					:class="{ 'is-active': activeFilter === filter.value }"
					@click="activeFilter = filter.value"
				>
					{{ filter.label }}
				</button>
			</div>

			<section class="app-explore__masonry" aria-label="Explore gallery">
				<article
					v-for="item in filteredItems"
					:key="item.id"
					class="app-explore-card"
					:class="[`is-${item.size}`, { 'is-video': item.type === 'video' }]"
					tabindex="0"
					role="button"
					:aria-label="item.title"
					@click="selectedPreview = toPreviewItem(item)"
					@keydown.enter.prevent="selectedPreview = toPreviewItem(item)"
					@keydown.space.prevent="selectedPreview = toPreviewItem(item)"
				>
					<NuxtImg :src="item.image" :alt="item.title" />
					<div v-if="item.type === 'video'" class="app-explore-card__play" aria-hidden="true">
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M9 7.5v9l7-4.5-7-4.5Z" />
						</svg>
					</div>
					<footer>
						<span class="app-explore-card__avatar" :style="{ background: item.color }">{{ item.initial }}</span>
						<strong>{{ item.title }}</strong>
					</footer>
				</article>
			</section>

			<CreativePreviewModal :item="selectedPreview" @close="selectedPreview = null" />
		</main>
	</div>
</template>

<script setup lang="ts">
import CreativePreviewModal from '~/components/home/CreativePreviewModal.vue'
import AppHomeSidebar from '~/components/home/app/AppHomeSidebar.vue'

type ExploreFilter = 'all' | 'video' | 'image'

type ExploreItem = {
	id: string
	title: string
	initial: string
	color: string
	type: Exclude<ExploreFilter, 'all'>
	size: 'tall' | 'square' | 'wide'
	image: string
}

type CreativePreviewItem = {
	id: string
	title: string
	image: string
	alt?: string
	prompt: string
	model: string
	resolution: string
	aspectRatio: string
	outputFormat: string
}

const sidebarCollapsed = ref(false)
const activeFilter = ref<ExploreFilter>('all')
const selectedPreview = ref<CreativePreviewItem | null>(null)

const filters: Array<{ label: string; value: ExploreFilter }> = [
	{ label: 'All', value: 'all' },
	{ label: 'AI Video', value: 'video' },
	{ label: 'AI Image', value: 'image' },
]

const photo = (id: string, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=84`
const items: ExploreItem[] = [
	{
		id: 'red-portrait',
		title: 'dare ortiva',
		initial: 'd',
		color: '#d83b13',
		type: 'image',
		size: 'tall',
		image: photo('photo-1529139574466-a303027c1d8b', 900),
	},
	{
		id: 'cream-poster',
		title: 'Signa Design',
		initial: 'S',
		color: '#0f9b8e',
		type: 'image',
		size: 'square',
		image: photo('photo-1500530855697-b586d89ba3ee', 900),
	},
	{
		id: 'cinematic-detective',
		title: 'Ghost07 Jjdu07',
		initial: 'G',
		color: '#ff4c1d',
		type: 'video',
		size: 'square',
		image: photo('photo-1517841905240-472988babdf9', 900),
	},
	{
		id: 'laser-football',
		title: 'Corina Cardozo',
		initial: 'C',
		color: '#171717',
		type: 'video',
		size: 'square',
		image: photo('photo-1517466787929-bc90951d0974', 900),
	},
	{
		id: 'soft-bedroom',
		title: '锦沅 陈锦沅',
		initial: '锦',
		color: '#ff4b1f',
		type: 'image',
		size: 'square',
		image: photo('photo-1517841905240-472988babdf9', 900),
	},
	{
		id: 'heritage-guide',
		title: 'Anonymous',
		initial: 'A',
		color: '#ff8500',
		type: 'image',
		size: 'tall',
		image: photo('photo-1524230572899-a752b3835840', 900),
	},
	{
		id: 'cartoon-dogs',
		title: 'Anonymous',
		initial: 'A',
		color: '#ff8500',
		type: 'image',
		size: 'square',
		image: photo('photo-1450778869180-41d0601e046e', 900),
	},
	{
		id: 'embroidered-jacket',
		title: 'Anonymous',
		initial: 'A',
		color: '#ff8500',
		type: 'image',
		size: 'square',
		image: photo('photo-1523381210434-271e8be1f52b', 900),
	},
	{
		id: 'pilot-color',
		title: 'Mika Studio',
		initial: 'M',
		color: '#0ea5e9',
		type: 'video',
		size: 'wide',
		image: photo('photo-1544005313-94ddf0286df2', 900),
	},
	{
		id: 'minimal-home',
		title: 'Aria Builds',
		initial: 'A',
		color: '#ef4444',
		type: 'image',
		size: 'wide',
		image: photo('photo-1600585154340-be6161a56a0c', 900),
	},
	{
		id: 'street-style',
		title: 'ZeeZou',
		initial: 'Z',
		color: '#6d28d9',
		type: 'image',
		size: 'square',
		image: photo('photo-1496747611176-843222e1e57c', 900),
	},
	{
		id: 'travel-canyon',
		title: 'Nolwenn Guilloux',
		initial: 'N',
		color: '#0891b2',
		type: 'video',
		size: 'square',
		image: photo('photo-1500530855697-b586d89ba3ee', 900),
	},
]

const filteredItems = computed(() => {
	if (activeFilter.value === 'all') return items
	return items.filter(item => item.type === activeFilter.value)
})

const toPreviewItem = (item: ExploreItem): CreativePreviewItem => ({
	id: item.id,
	title: item.title,
	image: item.image,
	alt: item.title,
	prompt: `${item.title} ${item.type === 'video' ? 'AI video' : 'AI image'} creative reference from Explore.`,
	model: item.type === 'video' ? 'Nano Banana 2' : 'GPT Image 2',
	resolution: item.type === 'video' ? '1080p' : '1K',
	aspectRatio: item.size === 'wide' ? '16:9' : item.size === 'tall' ? '2:3' : '1:1',
	outputFormat: item.type === 'video' ? 'MP4' : 'PNG',
})
</script>

<style scoped lang="scss">
.app-explore {
	display: grid;
	grid-template-columns: 288px minmax(0, 1fr);
	min-height: 100vh;
	background: #000;
	color: #f5f5f5;
	transition: grid-template-columns 220ms ease;
}

.app-explore.is-sidebar-collapsed {
	grid-template-columns: 84px minmax(0, 1fr);
}

.app-explore__main {
	min-width: 0;
	padding: 26px 30px 42px;
}

.app-explore__filters {
	position: sticky;
	top: 0;
	z-index: 4;
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 24px;
	background: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.88) 72%, rgba(0, 0, 0, 0) 100%);
	padding: 0 0 14px;

	button {
		min-width: 70px;
		min-height: 42px;
		border: 0;
		border-radius: 999px;
		background: #181818;
		padding: 0 24px;
		color: rgba(255, 255, 255, 0.62);
		font-size: 15px;
		font-weight: 800;
		letter-spacing: 0;
		cursor: pointer;
		transition: background 160ms ease, color 160ms ease;
	}

	button:hover {
		background: #242424;
		color: rgba(255, 255, 255, 0.86);
	}

	button.is-active {
		background: #fff;
		color: #151515;
	}
}

.app-explore__masonry {
	column-count: 4;
	column-gap: 18px;
}

.app-explore-card {
	position: relative;
	display: inline-block;
	width: 100%;
	height: 300px;
	margin: 0 0 18px;
	overflow: hidden;
	border-radius: 10px;
	background: #161616;
	color: #fff;
	break-inside: avoid;
	cursor: pointer;
	isolation: isolate;
	outline: none;

	&::after {
		content: "";
		position: absolute;
		inset: 0;
		z-index: 1;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0) 48%, rgba(0, 0, 0, 0.72) 100%);
		pointer-events: none;
	}

	img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 360ms ease, filter 360ms ease;
	}

	&:hover img {
		transform: scale(1.035);
		filter: saturate(1.04) contrast(1.04);
	}

	&:focus-visible {
		box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.72), 0 0 0 5px rgba(255, 255, 255, 0.14);
	}

	footer {
		position: absolute;
		left: 16px;
		right: 16px;
		bottom: 14px;
		z-index: 2;
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 0;
	}

	strong {
		min-width: 0;
		overflow: hidden;
		color: rgba(255, 255, 255, 0.9);
		font-size: 15px;
		font-weight: 800;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

.app-explore-card.is-tall {
	height: 540px;
}

.app-explore-card.is-wide {
	height: 260px;
}

.app-explore-card__avatar {
	flex: 0 0 auto;
	display: grid;
	place-items: center;
	width: 30px;
	height: 30px;
	border-radius: 999px;
	color: #fff;
	font-size: 12px;
	font-weight: 900;
}

.app-explore-card__play {
	position: absolute;
	inset: 0;
	z-index: 2;
	display: grid;
	place-items: center;
	color: rgba(255, 255, 255, 0.9);
	opacity: 0;
	transition: opacity 160ms ease;

	svg {
		width: 52px;
		height: 52px;
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.36);
		padding: 13px;
		backdrop-filter: blur(10px);
	}
}

.app-explore-card.is-video:hover .app-explore-card__play {
	opacity: 1;
}

@media (max-width: 1360px) {
	.app-explore__masonry {
		column-count: 3;
	}
}

@media (max-width: 1040px) {
	.app-explore__masonry {
		column-count: 2;
	}
}

@media (max-width: 900px) {
	.app-explore,
	.app-explore.is-sidebar-collapsed {
		grid-template-columns: 1fr;
	}

	.app-explore__main {
		padding: 18px 16px 28px;
	}

	.app-explore__filters {
		top: 0;
		overflow-x: auto;
		margin-bottom: 16px;
		padding-bottom: 12px;
	}
}

@media (max-width: 640px) {
	.app-explore__masonry {
		column-count: 1;
	}

	.app-explore-card,
	.app-explore-card.is-tall,
	.app-explore-card.is-wide {
		height: 360px;
	}
}
</style>
