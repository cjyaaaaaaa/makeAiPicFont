<template>
	<section class="inspiration-section">
		<div class="inspiration-section__inner">
			<div class="inspiration-section__header">
				<div>
					<p class="inspiration-section__eyebrow">
						<span aria-hidden="true"></span>
						{{ t('home.inspiration.eyebrow') }}
					</p>
					<h2>{{ t('home.inspiration.title') }}</h2>
				</div>
				<div class="inspiration-section__side">
					<p>{{ t('home.inspiration.desc') }}</p>
					<div class="inspiration-section__toggle" role="tablist" :aria-label="t('home.inspiration.toggleLabel')">
						<button v-for="mode in modes" :key="mode.id" type="button" :class="{ 'is-active': activeMode === mode.id }" role="tab" :aria-selected="activeMode === mode.id" @click="activeMode = mode.id">
							<span aria-hidden="true">
								<svg v-if="mode.id === 'images'" viewBox="0 0 16 16" fill="none">
									<rect x="3" y="3.5" width="10" height="9" rx="1.4" stroke="currentColor" stroke-width="1.3" />
									<path d="M4.8 10.7L7.1 8.3L8.6 9.7L9.9 8.4L12.2 10.7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
									<circle cx="10.6" cy="6.1" r="0.8" fill="currentColor" />
								</svg>
								<svg v-else viewBox="0 0 16 16" fill="none">
									<rect x="2.5" y="5" width="7" height="6" rx="1.2" stroke="currentColor" stroke-width="1.3" />
									<path d="M9.5 7.1L13 5.4v5.2L9.5 8.9V7.1Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
								</svg>
							</span>
							{{ mode.label }}
						</button>
					</div>
				</div>
			</div>

			<div class="inspiration-section__masonry">
				<div v-for="(column, columnIndex) in columns" :key="columnIndex" class="inspiration-section__column">
					<article v-for="item in column" :key="item.id" class="inspiration-card" :class="`inspiration-card--${item.size}`">
						<NuxtImg v-bind="getLazyImageAttrs(item.image, { alt: item.alt })" />
						<div class="inspiration-card__overlay">
							<span class="inspiration-card__code">{{ item.code }}</span>
							<h3>{{ item.title }}</h3>
							<p>{{ item.prompt }}</p>
							<button type="button">
								{{ promptActionLabel }}
								<span aria-hidden="true">↗</span>
							</button>
						</div>
					</article>
				</div>
			</div>

			<!-- <div class="inspiration-section__cta">
				<div>
					<h3>{{ t('home.inspiration.ctaTitle') }}</h3>
					<p>{{ t('home.inspiration.ctaDesc') }}</p>
				</div>
				<div class="inspiration-section__actions">
					<button type="button" class="is-primary">{{ t('home.inspiration.primaryAction') }}</button>
					<button type="button">{{ t('home.inspiration.secondaryAction') }}</button>
				</div>
			</div> -->
		</div>
	</section>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { getLazyImageAttrs } = useLazyImage()

type InspirationMode = 'images' | 'videos'
type InspirationCopy = {
	id: string
	alt: string
	code: string
	title: string
	prompt: string
	size: 'sm' | 'md' | 'lg' | 'xl'
}

const photo = (id: string, width = 760) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=84`

const activeMode = ref<InspirationMode>('images')
const modes = computed(() => [
	{ id: 'images' as const, label: t('home.inspiration.imagesTab') },
	{ id: 'videos' as const, label: t('home.inspiration.videosTab') },
])
const promptActionLabel = computed(() => {
	const value = t('home.inspiration.promptAction')
	return typeof value === 'string' && value !== 'home.inspiration.promptAction' ? value : 'Try this prompt'
})

const imageMap: Record<string, string> = {
	veilPortrait: photo('photo-1524504388940-b1c1722653e1'),
	mirrorMakeup: photo('photo-1522335789203-aabd1fc54bc9'),
	breakfastStill: photo('photo-1512621776951-a57141f2eefd'),
	stoneFashion: photo('photo-1515886657613-9f3515b0c78f'),
	runwayFace: photo('photo-1487412720507-e7ab37603c6f'),
	streetFashion: photo('photo-1496747611176-843222e1e57c'),
	flowerPortrait: photo('photo-1517841905240-472988babdf9'),
	blueDoor: photo('photo-1500530855697-b586d89ba3ee'),
	limeJewelry: photo('photo-1528825871115-3581a5387919'),
	poodleStyle: photo('photo-1518717758536-85ae29035b6d'),
	martiniHand: photo('photo-1470337458703-46ad1756a187'),
	poppyMacro: photo('photo-1490750967868-88aa4486c946'),
	jellyfishLamp: photo('photo-1518005020951-eccb494ad742'),
	winterFriends: photo('photo-1524503033411-c9566986fc8f'),
	neonCocktail: photo('photo-1544145945-f90425340c7e'),
	gardenBike: photo('photo-1500534314209-a25ddb2bd429'),
	botanicalFace: photo('photo-1508214751196-bcfd4ca60f91'),
	forestPanther: photo('photo-1518837695005-2083093ee35b'),
	lipstickStill: photo('photo-1522335789203-aabd1fc54bc9'),
	sidewalkScene: photo('photo-1449824913935-59a10b8d2000'),
}

const allItems = computed(() => {
	const copy = t(`home.inspiration.${activeMode.value}`) as InspirationCopy[]
	return copy.map(item => ({
		...item,
		prompt: item.prompt || item.alt,
		image: imageMap[item.id],
	}))
})

const columns = computed(() => {
	const bucketCount = 4
	const buckets = Array.from({ length: bucketCount }, () => [] as Array<InspirationCopy & { image: string }>)
	allItems.value.forEach((item, index) => {
		buckets[index % bucketCount].push(item)
	})
	return buckets
})
</script>

<style scoped lang="scss">
.inspiration-section {
	background: #15161a;
	padding: 120px 0 136px;
	color: #f8fafc;
}

.inspiration-section__inner {
	margin: 0 auto;
	max-width: 1720px;
	padding: 0 clamp(24px, 4vw, 72px);
}

.inspiration-section__header {
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(340px, 0.5fr);
	gap: 80px;
	margin-bottom: 84px;
}

.inspiration-section__eyebrow {
	display: flex;
	align-items: center;
	gap: 14px;
	margin: 0 0 22px;
	color: rgba(255, 255, 255, 0.5);
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	font-size: 12px;
	font-weight: 800;
	letter-spacing: 0.42em;
	text-transform: uppercase;

	span {
		width: 48px;
		height: 1px;
		background: rgba(255, 255, 255, 0.18);
	}
}

.inspiration-section h2 {
	max-width: 850px;
	margin: 0;
	color: #ffffff;
	font-size: clamp(58px, 6vw, 104px);
	font-weight: 850;
	line-height: 0.9;
	letter-spacing: 0;
}

.inspiration-section__side {
	border-left: 1px solid rgba(255, 255, 255, 0.08);
	padding-left: 36px;
	padding-top: 82px;

	p {
		margin: 0 0 26px;
		color: rgba(255, 255, 255, 0.54);
		font-size: 17px;
		font-weight: 650;
		line-height: 1.55;
	}
}

.inspiration-section__toggle {
	display: inline-flex;
	gap: 4px;
	border: 1px solid rgba(255, 255, 255, 0.09);
	border-radius: 10px;
	background: rgba(255, 255, 255, 0.04);
	padding: 4px;

	button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 34px;
		border: 0;
		border-radius: 7px;
		background: transparent;
		padding: 0 13px;
		color: rgba(255, 255, 255, 0.52);
		font-size: 12px;
		font-weight: 800;
		cursor: pointer;
		transition: background 180ms ease, color 180ms ease;
	}

	button.is-active {
		background: rgba(255, 255, 255, 0.12);
		color: #ffffff;
	}

	svg {
		width: 14px;
		height: 14px;
	}
}

.inspiration-section__masonry {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 16px;
}

.inspiration-section__column {
	display: grid;
	align-content: start;
	gap: 16px;
}

.inspiration-card {
	position: relative;
	overflow: hidden;
	border: 1px solid rgba(255, 255, 255, 0.16);
	border-radius: 10px;
	background: #222;
	isolation: isolate;

	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(0.96) contrast(1.02);
		transition: transform 420ms ease, filter 420ms ease;
	}

	&::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
		background: linear-gradient(180deg, transparent 34%, rgba(0, 0, 0, 0.32) 62%, rgba(0, 0, 0, 0.86) 100%);
		opacity: 0.92;
		pointer-events: none;
	}

	&:hover img {
		transform: scale(1.035);
		filter: saturate(1.05) contrast(1.04);
	}

	&:hover .inspiration-card__overlay {
		transform: translateY(0);
		opacity: 1;
	}
}

.inspiration-card__overlay {
	position: absolute;
	left: 28px;
	right: 28px;
	bottom: 28px;
	z-index: 2;
	display: grid;
	gap: 8px;
	transform: translateY(8px);
	opacity: 0;
	transition: transform 220ms ease, opacity 220ms ease;
}

.inspiration-card__code {
	justify-self: start;
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.16);
	padding: 3px 9px;
	color: rgba(255, 255, 255, 0.78);
	font-size: 12px;
	font-weight: 800;
	line-height: 1.2;
}

.inspiration-card__overlay h3 {
	margin: 4px 0 0;
	color: #ffffff;
	font-size: 22px;
	font-weight: 850;
	line-height: 1.12;
	letter-spacing: 0;
}

.inspiration-card__overlay p {
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
	margin: 0;
	color: rgba(255, 255, 255, 0.78);
	font-size: 14px;
	font-weight: 550;
	line-height: 1.55;
}

.inspiration-card__overlay button {
	justify-self: start;
	display: inline-flex;
	align-items: center;
	gap: 8px;
	margin-top: 10px;
	border: 0;
	background: transparent;
	padding: 0;
	color: rgba(255, 255, 255, 0.86);
	font-size: 12px;
	font-weight: 900;
	letter-spacing: 0.16em;
	text-align: left;
	text-transform: uppercase;
	cursor: pointer;
}

.inspiration-card--sm {
	height: 230px;

	.inspiration-card__overlay {
		left: 22px;
		right: 22px;
		bottom: 24px;
		gap: 0;
	}

	.inspiration-card__overlay h3,
	.inspiration-card__overlay p {
		display: none;
	}
}

.inspiration-card--md {
	height: 340px;

	.inspiration-card__overlay p {
		-webkit-line-clamp: 2;
	}
}

.inspiration-card--lg {
	height: 460px;
}

.inspiration-card--xl {
	height: 560px;
}

.inspiration-card--lg,
.inspiration-card--xl {
	.inspiration-card__overlay {
		transform: translateY(0);
		opacity: 1;
	}
}

.inspiration-section__cta {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 32px;
	margin-top: 132px;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
	padding-top: 68px;

	h3 {
		margin: 0;
		color: #ffffff;
		font-size: 30px;
		font-weight: 850;
		letter-spacing: 0;
	}

	p {
		margin: 10px 0 0;
		color: rgba(255, 255, 255, 0.48);
		font-size: 14px;
		font-weight: 650;
	}
}

.inspiration-section__actions {
	display: flex;
	align-items: center;
	gap: 14px;

	button {
		min-width: 142px;
		height: 52px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.08);
		color: #ffffff;
		font-size: 13px;
		font-weight: 850;
		cursor: pointer;
		transition: background 180ms ease, border-color 180ms ease, color 180ms ease;
	}

	button:hover {
		border-color: rgba(255, 255, 255, 0.28);
		background: rgba(255, 255, 255, 0.12);
	}

	button.is-primary {
		border-color: #ffffff;
		background: #ffffff;
		color: #101010;
	}
}

@media (max-width: 1180px) {
	.inspiration-section__header {
		grid-template-columns: 1fr;
		gap: 28px;
		margin-bottom: 56px;
	}

	.inspiration-section__side {
		border-left: 0;
		padding-left: 0;
		padding-top: 0;
	}

	.inspiration-section__masonry {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}

@media (max-width: 760px) {
	.inspiration-section {
		padding: 78px 0 92px;
	}

	.inspiration-section__inner {
		padding: 0 16px;
	}

	.inspiration-section h2 {
		font-size: 50px;
	}

	.inspiration-section__masonry {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}

	.inspiration-section__column {
		gap: 10px;
	}

	.inspiration-card--sm {
		height: 150px;
	}

	.inspiration-card--md {
		height: 220px;
	}

	.inspiration-card--lg,
	.inspiration-card--xl {
		height: 300px;
	}

	.inspiration-section__cta {
		align-items: flex-start;
		flex-direction: column;
		margin-top: 68px;
		padding-top: 40px;
	}

	.inspiration-section__actions {
		width: 100%;

		button {
			flex: 1;
			min-width: 0;
		}
	}
}
</style>
