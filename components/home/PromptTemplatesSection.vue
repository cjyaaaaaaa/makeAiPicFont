<template>
	<section class="prompt-templates">
		<div class="prompt-templates__inner">
			<header class="prompt-templates__header">
				<p>
					<span aria-hidden="true"></span>
					{{ t('home.promptTemplates.eyebrow') }}
				</p>
				<h2>{{ t('home.promptTemplates.title') }}</h2>
				<span>{{ t('home.promptTemplates.desc') }}</span>
			</header>

			<div class="prompt-templates__tabs" role="tablist" :aria-label="t('home.promptTemplates.tabsLabel')">
				<button v-for="tab in tabs" :key="tab.id" type="button" :class="{ 'is-active': activeTab === tab.id }" role="tab" :aria-selected="activeTab === tab.id" @click="activeTab = tab.id">
					{{ tab.label }}
				</button>
			</div>

			<div class="prompt-templates__rail">
				<article v-for="card in activeCards" :key="card.id" class="template-card">
					<div class="template-card__image">
						<NuxtImg v-bind="getLazyImageAttrs(card.image, { alt: card.alt })" />
						<button type="button">{{ t('home.promptTemplates.useAction') }}</button>
					</div>
					<p>{{ activeTabLabel }}</p>
					<h3>{{ card.title }}</h3>
				</article>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
const { t } = useAppI18n()
const { getLazyImageAttrs } = useLazyImage()

type TemplateTab = 'people' | 'fashion' | 'scenery' | 'product' | 'whimsical'
type TemplateCardCopy = {
	id: string
	title: string
	alt: string
}
type TemplateTabCopy = {
	id: TemplateTab
	label: string
	cards: TemplateCardCopy[]
}

const photo = (id: string, width = 720) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=84`
const activeTab = ref<TemplateTab>('people')

const fallbackTabs: TemplateTabCopy[] = [
	{
		id: 'people',
		label: 'People',
		cards: [
			{ id: 'monoPortrait', title: 'Monochrome Portrait', alt: 'Black and white portrait in a car' },
			{ id: 'groupPortrait', title: 'Group Portrait', alt: 'Three people standing in a city street' },
			{ id: 'beautyCloseup', title: 'Beauty Close-up', alt: 'Close-up glitter makeup portrait' },
			{ id: 'candidShot', title: 'Candid Shot', alt: 'Two friends laughing at a cafe table' },
			{ id: 'streetStyle', title: 'Street Style Portrait', alt: 'Street style portrait with yellow sunglasses' },
		],
	},
	{
		id: 'fashion',
		label: 'Fashion',
		cards: [
			{ id: 'editorialCoat', title: 'Editorial Coat', alt: 'Editorial fashion coat portrait' },
			{ id: 'runwayFrame', title: 'Runway Frame', alt: 'Runway fashion detail' },
			{ id: 'urbanLook', title: 'Urban Lookbook', alt: 'Urban fashion lookbook' },
			{ id: 'silkPortrait', title: 'Silk Portrait', alt: 'Soft silk fashion portrait' },
			{ id: 'studioPose', title: 'Studio Pose', alt: 'Studio fashion pose' },
		],
	},
	{
		id: 'scenery',
		label: 'Scenery',
		cards: [
			{ id: 'coastalDream', title: 'Coastal Dream', alt: 'Coastal sunset landscape' },
			{ id: 'cityTerrace', title: 'City Terrace', alt: 'City terrace at sunset' },
			{ id: 'desertLight', title: 'Desert Light', alt: 'Desert landscape light' },
			{ id: 'forestPath', title: 'Forest Path', alt: 'Forest path scenery' },
			{ id: 'blueDoor', title: 'Pastel Door', alt: 'Pastel wall with blue door' },
		],
	},
	{
		id: 'product',
		label: 'Product',
		cards: [
			{ id: 'watchStill', title: 'Watch Still Life', alt: 'Watch product still life' },
			{ id: 'minimalSpeaker', title: 'Minimal Speaker', alt: 'Minimal speaker product' },
			{ id: 'cosmeticSet', title: 'Cosmetic Set', alt: 'Cosmetic product set' },
			{ id: 'drinkAd', title: 'Drink Campaign', alt: 'Cocktail product ad' },
			{ id: 'deskObject', title: 'Desk Object', alt: 'Desk product object' },
		],
	},
	{
		id: 'whimsical',
		label: 'Whimsical',
		cards: [
			{ id: 'poodleStyle', title: 'Pearl Poodle', alt: 'Stylish poodle portrait' },
			{ id: 'jellyfishLamp', title: 'Jellyfish Lamp', alt: 'Jellyfish lamp artwork' },
			{ id: 'limeJewelry', title: 'Citrus Jewel', alt: 'Jewelry on lime slices' },
			{ id: 'flowerFace', title: 'Pressed Flowers', alt: 'Portrait with flowers' },
			{ id: 'neonGlass', title: 'Neon Glass', alt: 'Neon cocktail glass' },
		],
	},
]

const imageMap: Record<string, string> = {
	monoPortrait: photo('photo-1524504388940-b1c1722653e1'),
	groupPortrait: photo('photo-1524503033411-c9566986fc8f'),
	beautyCloseup: photo('photo-1522335789203-aabd1fc54bc9'),
	candidShot: photo('photo-1529156069898-49953e39b3ac'),
	streetStyle: photo('photo-1496747611176-843222e1e57c'),
	editorialCoat: photo('photo-1515886657613-9f3515b0c78f'),
	runwayFrame: photo('photo-1487412720507-e7ab37603c6f'),
	urbanLook: photo('photo-1524503033411-c9566986fc8f'),
	silkPortrait: photo('photo-1517841905240-472988babdf9'),
	studioPose: photo('photo-1508214751196-bcfd4ca60f91'),
	coastalDream: photo('photo-1500530855697-b586d89ba3ee'),
	cityTerrace: photo('photo-1500534314209-a25ddb2bd429'),
	desertLight: photo('photo-1500534314209-a25ddb2bd429'),
	forestPath: photo('photo-1518837695005-2083093ee35b'),
	blueDoor: photo('photo-1506973035872-a4ec16b8e8d9'),
	watchStill: photo('photo-1523170335258-f5ed11844a49'),
	minimalSpeaker: photo('photo-1523275335684-37898b6baf30'),
	cosmeticSet: photo('photo-1522335789203-aabd1fc54bc9'),
	drinkAd: photo('photo-1544145945-f90425340c7e'),
	deskObject: photo('photo-1518005020951-eccb494ad742'),
	poodleStyle: photo('photo-1518717758536-85ae29035b6d'),
	jellyfishLamp: photo('photo-1518005020951-eccb494ad742'),
	limeJewelry: photo('photo-1528825871115-3581a5387919'),
	flowerFace: photo('photo-1508214751196-bcfd4ca60f91'),
	neonGlass: photo('photo-1544145945-f90425340c7e'),
}

const tabs = computed(() => {
	const copy = t('home.promptTemplates.tabs') as TemplateTabCopy[]
	const source = Array.isArray(copy) ? copy : fallbackTabs
	return source.map(tab => ({
		...tab,
		cards: tab.cards.map(card => ({
			...card,
			image: imageMap[card.id],
		})),
	}))
})

const activeCards = computed(() => tabs.value.find(tab => tab.id === activeTab.value)?.cards ?? tabs.value[0]?.cards ?? [])
const activeTabLabel = computed(() => tabs.value.find(tab => tab.id === activeTab.value)?.label ?? 'People')
</script>

<style scoped lang="scss">
.prompt-templates {
	background: #15161a;
	padding: 88px 0 132px;
	color: #f8fafc;
}

@keyframes template-card-bounce {
	0% {
		transform: translateY(0) scale(1);
	}

	58% {
		transform: translateY(-14px) scale(1.012);
	}

	100% {
		transform: translateY(-8px) scale(1.006);
	}
}

@keyframes template-button-bounce {
	0% {
		transform: translate(-50%, -50%) scale(0.92);
	}

	58% {
		transform: translate(-50%, calc(-50% - 5px)) scale(1.04);
	}

	100% {
		transform: translate(-50%, -50%) scale(1);
	}
}

.prompt-templates__inner {
	margin: 0 auto;
	max-width: 1720px;
	padding: 0 clamp(24px, 4vw, 72px);
}

.prompt-templates__header p {
	display: flex;
	align-items: center;
	gap: 12px;
	margin: 0 0 18px;
	color: #4aa0ff;
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	font-size: 12px;
	font-weight: 850;
	letter-spacing: 0.24em;
	text-transform: uppercase;
}

.prompt-templates__header p span {
	width: 16px;
	height: 16px;
	border: 2px solid currentColor;
	border-radius: 3px;
}

.prompt-templates__header h2 {
	margin: 0;
	color: #ffffff;
	font-size: clamp(54px, 5vw, 86px);
	font-weight: 850;
	line-height: 0.98;
	letter-spacing: 0;
}

.prompt-templates__header > span {
	display: block;
	margin-top: 18px;
	color: rgba(255, 255, 255, 0.48);
	font-size: 18px;
	font-weight: 650;
}

.prompt-templates__tabs {
	display: flex;
	flex-wrap: wrap;
	gap: 14px;
	margin-top: 96px;
}

.prompt-templates__tabs button {
	min-width: 120px;
	height: 54px;
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.06);
	padding: 0 26px;
	color: rgba(255, 255, 255, 0.62);
	font-size: 16px;
	font-weight: 700;
	cursor: pointer;
	transition: background 180ms ease, border-color 180ms ease, color 180ms ease;
}

.prompt-templates__tabs button.is-active {
	border-color: #ffffff;
	background: #ffffff;
	color: #111111;
}

.prompt-templates__rail {
	display: grid;
	grid-auto-columns: minmax(290px, 1fr);
	grid-auto-flow: column;
	gap: 26px;
	margin-top: 76px;
	overflow-x: auto;
	padding-bottom: 16px;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}
}

.template-card {
	min-width: 0;
}

.template-card__image {
	position: relative;
	overflow: hidden;
	height: 420px;
	border: 1px solid rgba(255, 255, 255, 0.16);
	border-radius: 14px;
	background: #202020;
	transform: translateY(0) scale(1);
	transform-origin: center;
	transition: border-color 220ms ease, box-shadow 220ms ease, transform 260ms ease;
	will-change: transform;

	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 360ms ease, filter 360ms ease;
	}

	button {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 2;
		height: 44px;
		border: 0;
		border-radius: 999px;
		background: #ffffff;
		padding: 0 24px;
		color: #111111;
		font-size: 13px;
		font-weight: 850;
		opacity: 0;
		transform: translate(-50%, -50%) scale(0.96);
		cursor: pointer;
		transition: opacity 180ms ease, transform 180ms ease;
		white-space: nowrap;
	}

	&::after {
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.18);
		opacity: 0;
		transition: opacity 180ms ease;
		pointer-events: none;
	}

	&:hover img {
		transform: scale(1.04);
		filter: saturate(1.06) contrast(1.04);
	}

	&:hover {
		border-color: rgba(74, 160, 255, 0.42);
		box-shadow: 0 26px 70px rgba(0, 0, 0, 0.36);
		animation: template-card-bounce 560ms cubic-bezier(0.2, 0.82, 0.18, 1) both;
	}

	&:hover button,
	&:hover::after {
		opacity: 1;
	}

	&:hover button {
		animation: template-button-bounce 480ms cubic-bezier(0.2, 0.82, 0.18, 1) both;
	}
}

.template-card p {
	margin: 26px 0 8px;
	color: #4aa0ff;
	font-size: 12px;
	font-weight: 900;
	letter-spacing: 0.12em;
	text-transform: uppercase;
}

.template-card h3 {
	margin: 0;
	color: #ffffff;
	font-size: 22px;
	font-weight: 850;
	letter-spacing: 0;
}

@media (min-width: 1440px) {
	.prompt-templates__rail {
		grid-auto-columns: calc((100% - 104px) / 5);
	}
}

@media (max-width: 760px) {
	.prompt-templates {
		padding: 72px 0 92px;
	}

	.prompt-templates__inner {
		padding: 0 16px;
	}

	.prompt-templates__header h2 {
		font-size: 46px;
	}

	.prompt-templates__tabs {
		gap: 10px;
		margin-top: 52px;
	}

	.prompt-templates__tabs button {
		min-width: auto;
		height: 44px;
		padding: 0 18px;
		font-size: 14px;
	}

	.prompt-templates__rail {
		grid-auto-columns: 78%;
		margin-top: 48px;
	}

	.template-card__image {
		height: 360px;
	}
}
</style>
