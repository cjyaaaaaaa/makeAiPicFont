<template>
	<section class="creation-section">
		<div class="creation-section__inner">
			<div class="creation-section__top">
				<div>
					<h2>{{ t('home.creation.startTitle') }}</h2>
					<p>{{ t('home.creation.startDesc') }}</p>
				</div>
				<div class="creation-section__actions">
					<button type="button" class="is-primary">{{ t('home.creation.primaryAction') }}</button>
					<button type="button">{{ t('home.creation.secondaryAction') }}</button>
				</div>
			</div>

			<header class="creation-section__header">
				<h3>{{ t('home.creation.title') }}</h3>
				<p>{{ t('home.creation.desc') }}</p>
			</header>

			<div class="creation-section__showcase">
				<div v-for="(item, index) in items" :key="item.id" class="creation-item" :class="[`creation-item--${item.layout}`, { 'is-reversed': index % 2 === 1 }]">
					<div class="creation-item__copy">
						<div class="creation-item__icon" aria-hidden="true">
							<svg viewBox="0 0 18 18" fill="none">
								<rect x="3" y="3" width="12" height="12" rx="3" stroke="currentColor" stroke-width="1.3" />
								<path d="M6 9h6M9 6v6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
							</svg>
						</div>
						<span>{{ t('home.creation.kicker') }}</span>
						<h4>{{ item.title }}</h4>
						<p>{{ item.desc }}</p>
						<button type="button">{{ t('home.creation.itemAction') }}</button>
					</div>

					<div class="creation-item__visual" :class="{ 'is-grid': item.images.length > 1 }">
						<NuxtImg v-for="image in item.images" :key="image.src" v-bind="getLazyImageAttrs(image.src, { alt: image.alt })" />
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { getLazyImageAttrs } = useLazyImage()

type CreationCopy = {
	id: string
	title: string
	desc: string
	imageAlts?: string[]
	layout: 'wide' | 'poster' | 'grid' | 'mosaic'
}

const photo = (id: string, width = 980) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=84`
const fallbackItems: CreationCopy[] = [
	{ id: 'scenes', title: 'Panoramic Scenes', desc: 'Create 4:1 and 8:1 wide scenes for landscapes, architecture, interiors, and cinematic storyboards.', layout: 'wide' },
	{ id: 'portraits', title: 'Fashion & Portraits', desc: 'Generate natural skin, styling, poses, and atmosphere for fashion editorials, character concepts, and portrait shoots.', layout: 'poster' },
	{ id: 'products', title: 'Product Visuals', desc: 'Build clean product imagery with realistic materials, controlled light, and premium compositions for commerce and campaigns.', layout: 'grid' },
	{ id: 'consistency', title: 'Visual Consistency', desc: 'Keep style, identity, color, and story consistent across multiple images so every output feels like one coherent series.', layout: 'mosaic' },
]

const visualMap: Record<string, Array<{ src: string; alt: string }>> = {
	scenes: [
		{ src: photo('photo-1500530855697-b586d89ba3ee'), alt: 'Ocean coastline at sunset' },
		{ src: photo('photo-1500534314209-a25ddb2bd429'), alt: 'City skyline at sunset' },
		{ src: photo('photo-1600566753190-17f0baa2a6c3'), alt: 'Modern interior lobby' },
	],
	portraits: [
		{ src: photo('photo-1515886657613-9f3515b0c78f'), alt: 'Editorial collage artwork' },
	],
	products: [
		{ src: photo('photo-1523275335684-37898b6baf30'), alt: 'Minimal product speaker' },
		{ src: photo('photo-1494438639946-1ebd1d20bf85'), alt: 'Minimal product block in light' },
		{ src: photo('photo-1526170375885-4d8ecf77b99f'), alt: 'Product detail on dark table' },
		{ src: photo('photo-1518005020951-eccb494ad742'), alt: 'Object display on plinth' },
	],
	consistency: [
		{ src: photo('photo-1500530855697-b586d89ba3ee'), alt: 'Social travel collage' },
	],
}

const items = computed(() => {
	const copy = t('home.creation.items') as CreationCopy[]
	const source = Array.isArray(copy) ? copy : fallbackItems
	return source.map(item => ({
		...item,
		images: visualMap[item.id].map((image, index) => ({
			...image,
			alt: item.imageAlts?.[index] ?? image.alt,
		})),
	}))
})
</script>

<style scoped lang="scss">
.creation-section {
	background: #15161a;
	padding: 88px 0 132px;
	color: #f8fafc;
}

.creation-section__inner {
	margin: 0 auto;
	max-width: 1720px;
	padding: 0 clamp(24px, 4vw, 72px);
}

.creation-section__top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 40px;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
	padding-top: 68px;

	h2 {
		margin: 0;
		color: #ffffff;
		font-size: 32px;
		font-weight: 850;
		letter-spacing: 0;
	}

	p {
		margin: 9px 0 0;
		color: rgba(255, 255, 255, 0.48);
		font-size: 15px;
		font-weight: 650;
	}
}

.creation-section__actions {
	display: flex;
	gap: 14px;

	button {
		min-width: 132px;
		height: 52px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.08);
		color: #ffffff;
		font-size: 13px;
		font-weight: 850;
		cursor: pointer;
	}

	button.is-primary {
		border-color: #ffffff;
		background: #ffffff;
		color: #101010;
	}
}

.creation-section__header {
	margin-top: 232px;

	h3 {
		margin: 0;
		color: #ffffff;
		font-size: clamp(52px, 5vw, 82px);
		font-weight: 850;
		line-height: 0.98;
		letter-spacing: 0;
	}

	p {
		margin: 18px 0 0;
		color: rgba(255, 255, 255, 0.48);
		font-size: 18px;
		font-weight: 650;
	}
}

.creation-section__showcase {
	display: grid;
	gap: 76px 44px;
	margin-top: 90px;
}

.creation-item {
	display: grid;
	grid-template-columns: minmax(320px, 0.8fr) minmax(0, 1fr);
	align-items: center;
	gap: 64px;

	&.is-reversed {
		grid-template-columns: minmax(0, 1fr) minmax(320px, 0.8fr);

		.creation-item__copy {
			order: 2;
		}

		.creation-item__visual {
			order: 1;
		}
	}
}

.creation-item__copy {
	max-width: 520px;

	span {
		display: block;
		margin-top: 10px;
		color: rgba(255, 255, 255, 0.38);
		font-size: 11px;
		font-weight: 900;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	h4 {
		margin: 8px 0 0;
		color: #ffffff;
		font-size: 34px;
		font-weight: 850;
		letter-spacing: 0;
	}

	p {
		margin: 16px 0 30px;
		color: rgba(255, 255, 255, 0.54);
		font-size: 17px;
		font-weight: 650;
		line-height: 1.65;
	}

	button {
		height: 46px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.06);
		padding: 0 24px;
		color: #ffffff;
		font-size: 13px;
		font-weight: 850;
		cursor: pointer;
	}
}

.creation-item__icon {
	display: grid;
	place-items: center;
	width: 34px;
	height: 34px;
	border: 1px solid rgba(239, 77, 44, 0.28);
	border-radius: 10px;
	background: rgba(239, 77, 44, 0.08);
	color: #ef4d2c;

	svg {
		width: 18px;
		height: 18px;
	}
}

.creation-item__visual {
	overflow: hidden;
	border: 1px solid rgba(255, 255, 255, 0.14);
	border-radius: 12px;
	background: #202020;

	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
}

.creation-item--wide .creation-item__visual {
	display: grid;
	height: 480px;

	img {
		height: 160px;
	}
}

.creation-item--poster .creation-item__visual,
.creation-item--mosaic .creation-item__visual {
	height: 480px;
}

.creation-item--grid .creation-item__visual {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	height: 500px;

	img {
		min-width: 0;
		min-height: 0;
		border: 1px solid rgba(255, 255, 255, 0.04);
	}
}

@media (max-width: 1024px) {
	.creation-section__header {
		margin-top: 132px;
	}

	.creation-item,
	.creation-item.is-reversed {
		grid-template-columns: 1fr;
		gap: 28px;
	}

	.creation-item.is-reversed .creation-item__copy,
	.creation-item.is-reversed .creation-item__visual {
		order: initial;
	}
}

@media (max-width: 760px) {
	.creation-section {
		padding: 72px 0 88px;
	}

	.creation-section__inner {
		padding: 0 16px;
	}

	.creation-section__top,
	.creation-section__actions {
		align-items: flex-start;
		flex-direction: column;
	}

	.creation-section__actions {
		width: 100%;

		button {
			width: 100%;
		}
	}

	.creation-section__header h3 {
		font-size: 44px;
	}

	.creation-item__copy h4 {
		font-size: 28px;
	}

	.creation-item--wide .creation-item__visual,
	.creation-item--poster .creation-item__visual,
	.creation-item--mosaic .creation-item__visual,
	.creation-item--grid .creation-item__visual {
		height: 320px;
	}

	.creation-item--wide .creation-item__visual img {
		height: 106.66px;
	}
}
</style>
