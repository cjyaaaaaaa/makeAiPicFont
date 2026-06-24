<template>
	<section class="editing-cases">
		<div class="editing-cases__inner">
			<div class="editing-cases__header">
				<div>
					<p class="editing-cases__eyebrow">
						<span class="editing-cases__mark" aria-hidden="true">
							<span></span>
							<span></span>
							<span></span>
						</span>
						{{ t('home.editingCases.eyebrow') }}
					</p>
					<h2 class="editing-cases__title">{{ t('home.editingCases.title') }}</h2>
				</div>
				<p class="editing-cases__desc">{{ t('home.editingCases.desc') }}</p>
			</div>

			<div class="editing-cases__grid">
				<article v-for="item in caseItems" :key="item.id" class="case-card">
					<div class="case-card__media" :class="{ 'case-card__media--strip': item.layout === 'strip' }">
						<template v-if="item.layout === 'strip'">
							<img v-for="image in getDisplayImages(item)" :key="image" v-bind="getLazyImageAttrs(image, { alt: item.title })" />
						</template>
						<img v-else v-bind="getLazyImageAttrs(getActiveImage(item), { alt: item.title })" />
						<span class="case-card__badge" :class="{ 'case-card__badge--yellow': getActiveVariant(item).badgeTone === 'yellow' }">{{ getActiveLabel(item) }}</span>
					</div>

					<div class="case-card__variants">
						<div class="case-card__thumbs">
							<button v-for="(variant, index) in item.variants" :key="`${item.id}-${variant.image}`" type="button" class="case-card__thumb" :class="{ 'is-active': getActiveIndex(item.id) === index }" :aria-label="getVariantLabel(item, index)" @click="setActiveVariant(item.id, index)">
								<img v-bind="getLazyImageAttrs(variant.thumb, { alt: getVariantLabel(item, index) })" />
							</button>
						</div>
						<div class="case-card__tabs">
							<button v-for="(tab, index) in item.tabs" :key="tab" type="button" :class="{ 'is-active': getActiveIndex(item.id) === index }" @click="setActiveVariant(item.id, index)">{{ tab }}</button>
						</div>
					</div>

					<div class="case-card__body">
						<div class="case-card__meta">
							<span>{{ item.play }}</span>
							<div>
								<span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
							</div>
						</div>
						<h3>{{ item.title }}</h3>
						<p>{{ item.desc }}</p>
						<button type="button" class="case-card__cta">
							{{ item.cta }}
							<span aria-hidden="true">→</span>
						</button>
					</div>
				</article>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { getLazyImageAttrs } = useLazyImage()

type CaseCopy = {
	id: string
	badge: string
	badgeTone?: 'yellow' | 'dark'
	play: string
	title: string
	desc: string
	cta: string
	tabs: string[]
	tags: string[]
}

type CaseVisual = {
	layout?: 'single' | 'strip'
	mediaImages?: string[]
	variants: Array<{
		label: string
		image: string
		thumb: string
		badgeTone?: 'yellow' | 'dark'
	}>
	activeThumb: number
}

const photo = (id: string, width = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`

const visuals: Record<string, CaseVisual> = {
	sceneSwap: {
		variants: [
			{ label: 'Original', image: photo('photo-1524504388940-b1c1722653e1'), thumb: photo('photo-1524504388940-b1c1722653e1', 180) },
			{ label: 'Stone Hall', image: photo('photo-1518005020951-eccb494ad742'), thumb: photo('photo-1518005020951-eccb494ad742', 180) },
			{ label: 'Desert Horizon', image: photo('photo-1500534314209-a25ddb2bd429'), thumb: photo('photo-1500534314209-a25ddb2bd429', 180) },
			{ label: 'Coastal Cliff', image: photo('photo-1500530855697-b586d89ba3ee'), thumb: photo('photo-1500530855697-b586d89ba3ee', 180) },
		],
		activeThumb: 1,
	},
	adRemix: {
		variants: [
			{ label: 'Original', image: photo('photo-1523275335684-37898b6baf30'), thumb: photo('photo-1523275335684-37898b6baf30', 180) },
			{ label: 'Wrist Detail', image: photo('photo-1523170335258-f5ed11844a49'), thumb: photo('photo-1523170335258-f5ed11844a49', 180) },
			{ label: 'Boutique Display', image: photo('photo-1517430816045-df4b7de11d1d'), thumb: photo('photo-1517430816045-df4b7de11d1d', 180) },
			{ label: 'Craftsmanship', image: photo('photo-1523170335258-f5ed11844a49'), thumb: photo('photo-1523170335258-f5ed11844a49', 180) },
		],
		activeThumb: 3,
	},
	moodLight: {
		variants: [
			{ label: 'Day', badgeTone: 'yellow', image: photo('photo-1506973035872-a4ec16b8e8d9'), thumb: photo('photo-1506973035872-a4ec16b8e8d9', 180) },
			{ label: 'Night', image: photo('photo-1449824913935-59a10b8d2000'), thumb: photo('photo-1449824913935-59a10b8d2000', 180) },
			{ label: 'Sunset', image: photo('photo-1500534314209-a25ddb2bd429'), thumb: photo('photo-1500534314209-a25ddb2bd429', 180) },
			{ label: 'Snowy Winter', image: photo('photo-1519681393784-d120267933ba'), thumb: photo('photo-1519681393784-d120267933ba', 180) },
		],
		activeThumb: 0,
	},
	portraitStyles: {
		layout: 'strip',
		mediaImages: [
			photo('photo-1524504388940-b1c1722653e1', 520),
			photo('photo-1494790108377-be9c29b29330', 520),
			photo('photo-1517841905240-472988babdf9', 520),
			photo('photo-1522335789203-aabd1fc54bc9', 520),
			photo('photo-1508214751196-bcfd4ca60f91', 520),
		],
		variants: [
			{ label: 'Luxury Dark', image: photo('photo-1524504388940-b1c1722653e1'), thumb: photo('photo-1524504388940-b1c1722653e1', 180) },
			{ label: 'Vintage Film', image: photo('photo-1494790108377-be9c29b29330'), thumb: photo('photo-1494790108377-be9c29b29330', 180) },
			{ label: 'Bold Fashion Color', image: photo('photo-1517841905240-472988babdf9'), thumb: photo('photo-1517841905240-472988babdf9', 180) },
			{ label: 'Romantic Painterly', image: photo('photo-1522335789203-aabd1fc54bc9'), thumb: photo('photo-1522335789203-aabd1fc54bc9', 180) },
		],
		activeThumb: 3,
	},
}

const activeVariants = reactive<Record<string, number>>({})

const caseItems = computed(() => {
	const copy = t('home.editingCases.items') as CaseCopy[]
	return copy.map(item => ({
		...item,
		...visuals[item.id],
	}))
})

const getActiveIndex = (id: string) => activeVariants[id] ?? visuals[id]?.activeThumb ?? 0

const setActiveVariant = (id: string, index: number) => {
	activeVariants[id] = index
}

const getActiveVariant = (item: CaseCopy & CaseVisual) => item.variants[getActiveIndex(item.id)] ?? item.variants[0]

const getVariantLabel = (item: CaseCopy & CaseVisual, index: number) => item.tabs[index] ?? item.variants[index]?.label ?? item.badge

const getActiveLabel = (item: CaseCopy & CaseVisual) => getVariantLabel(item, getActiveIndex(item.id))

const getActiveImage = (item: CaseCopy & CaseVisual) => getActiveVariant(item).image

const getDisplayImages = (item: CaseCopy & CaseVisual) => {
	if (item.layout !== 'strip') return [getActiveImage(item)]
	const active = getActiveIndex(item.id)
	const images = [...(item.mediaImages ?? item.variants.map(variant => variant.image))]
	if (item.variants[active]?.image) images[3] = item.variants[active].image
	return images
}
</script>

<style scoped lang="scss">
.editing-cases {
	background: #15161a;
	padding: 112px 0 128px;
	color: #f8fafc;
}

.editing-cases__inner {
	margin: 0 auto;
	max-width: 1720px;
	padding: 0 clamp(24px, 4vw, 72px);
}

.editing-cases__header {
	display: grid;
	grid-template-columns: minmax(0, 0.9fr) minmax(280px, 0.55fr);
	align-items: end;
	gap: 64px;
	margin-bottom: 70px;
}

.editing-cases__eyebrow {
	display: inline-flex;
	align-items: center;
	gap: 12px;
	margin: 0 0 18px;
	color: rgba(255, 255, 255, 0.52);
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	font-size: 12px;
	font-weight: 700;
	letter-spacing: 0.42em;
	text-transform: uppercase;
}

.editing-cases__mark {
	position: relative;
	display: grid;
	gap: 2px;
	width: 14px;

	span {
		display: block;
		height: 3px;
		border: 1px solid #d8c716;
		transform: skewY(-22deg);
	}
}

.editing-cases__title {
	max-width: 650px;
	margin: 0;
	font-size: clamp(48px, 5vw, 84px);
	font-weight: 800;
	line-height: 0.92;
	letter-spacing: 0;
}

.editing-cases__desc {
	max-width: 500px;
	margin: 0 0 16px;
	color: rgba(255, 255, 255, 0.48);
	font-size: 20px;
	font-weight: 600;
	line-height: 1.55;
}

.editing-cases__grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 22px;
}

.case-card {
	overflow: hidden;
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 14px;
	background: #101111;
	box-shadow: 0 28px 80px rgba(0, 0, 0, 0.24);
}

.case-card__media {
	position: relative;
	display: grid;
	aspect-ratio: 16 / 10;
	overflow: hidden;
	background: #0b0c0e;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(0.94) contrast(1.04);
	}

	&::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.08), transparent 54%, rgba(0, 0, 0, 0.16));
		pointer-events: none;
	}
}

.case-card__media--strip {
	grid-template-columns: repeat(5, minmax(0, 1fr));

	img {
		min-width: 0;
		border-right: 1px solid rgba(255, 255, 255, 0.08);
	}
}

.case-card__badge {
	position: absolute;
	top: 16px;
	left: 16px;
	z-index: 2;
	border-radius: 6px;
	background: rgba(72, 76, 82, 0.86);
	padding: 6px 10px;
	color: #ffffff;
	font-size: 11px;
	font-weight: 800;
	letter-spacing: 0.12em;
	text-transform: uppercase;
}

.case-card__badge--yellow {
	background: #f2da23;
	color: #141414;
}

.case-card__variants {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	background: #0f1010;
	padding: 14px 18px;
}

.case-card__thumbs {
	display: flex;
	align-items: center;
	gap: 8px;
	min-width: 0;
}

.case-card__thumb {
	display: block;
	width: 44px;
	height: 44px;
	overflow: hidden;
	border: 1px solid rgba(255, 255, 255, 0.09);
	border-radius: 8px;
	background: rgba(255, 255, 255, 0.04);
	padding: 2px;
	cursor: pointer;
	transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;

	&:hover {
		transform: translateY(-1px);
		border-color: rgba(255, 255, 255, 0.26);
	}

	&:focus-visible {
		outline: 2px solid rgba(240, 213, 29, 0.72);
		outline-offset: 2px;
	}

	img {
		width: 100%;
		height: 100%;
		border-radius: 5px;
		object-fit: cover;
		opacity: 0.72;
	}

	&.is-active {
		border-color: #f0d51d;
		box-shadow: 0 0 0 2px rgba(240, 213, 29, 0.45);

		img {
			opacity: 1;
		}
	}
}

.case-card__tabs {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	gap: 16px;
	color: rgba(255, 255, 255, 0.28);
	font-size: 11px;
	font-weight: 700;
	white-space: nowrap;

	button {
		border-radius: 7px;
		border: 0;
		background: transparent;
		padding: 6px 8px;
		color: inherit;
		font: inherit;
		cursor: pointer;
		transition: background 180ms ease, color 180ms ease;
	}

	button:hover {
		color: rgba(255, 255, 255, 0.58);
	}

	.is-active {
		background: rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.7);
	}
}

.case-card__body {
	padding: 28px 22px 30px;
}

.case-card__meta {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	margin-bottom: 14px;
	color: #b1a30b;
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	font-size: 12px;
	font-weight: 800;
	letter-spacing: 0.18em;
	text-transform: uppercase;

	div {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 8px;
	}

	div span {
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.06);
		padding: 5px 9px;
		color: rgba(255, 255, 255, 0.32);
		font-family: Inter, ui-sans-serif, system-ui, sans-serif;
		font-size: 10px;
		letter-spacing: 0;
		text-transform: none;
	}
}

.case-card h3 {
	margin: 0;
	color: #f7f7f7;
	font-size: 22px;
	font-weight: 800;
	letter-spacing: 0;
}

.case-card p {
	margin: 10px 0 22px;
	color: rgba(255, 255, 255, 0.42);
	font-size: 14px;
	font-weight: 600;
	line-height: 1.55;
}

.case-card__cta {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	border: 0;
	background: transparent;
	padding: 0;
	color: rgba(255, 255, 255, 0.66);
	font-size: 12px;
	font-weight: 900;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	cursor: pointer;
	transition: color 180ms ease;

	&:hover {
		color: #f0d51d;
	}
}

@media (max-width: 1024px) {
	.editing-cases {
		padding: 88px 0 104px;
	}

	.editing-cases__inner {
		padding: 0 24px;
	}

	.editing-cases__header {
		grid-template-columns: 1fr;
		gap: 26px;
		margin-bottom: 44px;
	}

	.editing-cases__desc {
		margin: 0;
	}

	.case-card__tabs {
		gap: 8px;
	}
}

@media (max-width: 760px) {
	.editing-cases {
		padding: 72px 0 88px;
	}

	.editing-cases__inner {
		padding: 0 16px;
	}

	.editing-cases__grid {
		grid-template-columns: 1fr;
	}

	.editing-cases__title {
		font-size: 46px;
	}

	.editing-cases__desc {
		font-size: 16px;
	}

	.case-card__variants {
		align-items: flex-start;
		flex-direction: column;
	}

	.case-card__tabs {
		justify-content: flex-start;
		white-space: normal;
	}

	.case-card__meta {
		align-items: flex-start;
		flex-direction: column;
	}
}
</style>
