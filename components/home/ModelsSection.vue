<template>
	<section class="models-section">
		<div class="models-section__inner">
			<div class="models-section__header">
				<div>
					<h2>{{ t('home.models.title') }}</h2>
					<p>{{ t('home.models.desc') }}</p>
				</div>
				<button type="button" class="models-section__action">
					{{ t('home.models.action') }}
					<span aria-hidden="true">→</span>
				</button>
			</div>

			<div class="models-section__grid">
				<article v-for="model in modelItems" :key="model.id" class="model-card" tabindex="0" role="button" @click="selectedPreview = toPreviewItem(model)" @keydown.enter.prevent="selectedPreview = toPreviewItem(model)" @keydown.space.prevent="selectedPreview = toPreviewItem(model)">
					<img v-if="model.image" v-bind="getLazyImageAttrs(model.image, { alt: model.name })" />
					<div v-else class="model-card__placeholder"></div>
					<div class="model-card__content">
						<p class="model-card__type">
							<span class="model-card__type-icon" aria-hidden="true">
								<svg v-if="model.kind === 'video'" viewBox="0 0 16 16" fill="none">
									<rect x="2.5" y="5" width="7" height="6" rx="1.2" stroke="currentColor" stroke-width="1.4" />
									<path d="M9.5 7.1L13 5.4v5.2L9.5 8.9V7.1Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
								</svg>
								<svg v-else viewBox="0 0 16 16" fill="none">
									<path d="M8 2.5L9.1 5.7L12.5 6.8L9.1 7.9L8 11.5L6.9 7.9L3.5 6.8L6.9 5.7L8 2.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" />
									<path d="M12.4 1.8L12.8 3L14 3.4L12.8 3.8L12.4 5L12 3.8L10.8 3.4L12 3L12.4 1.8Z" fill="currentColor" />
								</svg>
							</span>
							{{ model.kindLabel }}
						</p>
						<h3>{{ model.name }}</h3>
					</div>
				</article>
			</div>

			<CreativePreviewModal :item="selectedPreview" @close="selectedPreview = null" />
		</div>
	</section>
</template>

<script setup lang="ts">
import CreativePreviewModal from '~/components/home/CreativePreviewModal.vue'

const { t } = useAppI18n()
const { getLazyImageAttrs } = useLazyImage()

type ModelCopy = {
	id: string
	name: string
	kind: 'image' | 'video'
	kindLabel: string
}

type ModelItem = ModelCopy & {
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

const photo = (id: string, width = 1100) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=84`

const modelImages: Record<string, string> = {
	gptImage2: photo('photo-1497215728101-856f4ea42174'),
	nanoBanana2: photo('photo-1524504388940-b1c1722653e1'),
	nanoBananaPro: photo('photo-1492144534655-ae79c964c9d7'),
	veo31: photo('photo-1517841905240-472988babdf9'),
	seedanceFast: photo('photo-1500530855697-b586d89ba3ee'),
	seedance2: photo('photo-1500534314209-a25ddb2bd429'),
}

const modelPromptMap: Record<string, string> = {
	gptImage2: 'A cinematic product scene with crisp studio lighting, premium materials, controlled reflections, and clean editorial composition.',
	nanoBanana2: 'A luxury fashion editorial runway video featuring the same female model walking confidently toward the camera in a single continuous shot.',
	nanoBananaPro: 'High-end automotive commercial shot at golden hour with smooth camera movement, glossy reflections, and cinematic depth.',
	veo31: 'Elegant portrait motion with natural facial detail, soft backlight, realistic skin texture, and slow camera push-in.',
	seedanceFast: 'Wide coastal scene with a camera drifting over architecture and ocean light, fast generation style with clean motion.',
	seedance2: 'Dreamlike travel film with layered foreground, consistent subject identity, soft daylight, and premium campaign pacing.',
}

const selectedPreview = ref<CreativePreviewItem | null>(null)

const modelItems = computed(() => {
	const items = t('home.models.items') as ModelCopy[]
	return items.map(item => ({
		...item,
		image: modelImages[item.id],
	}))
})

const toPreviewItem = (model: ModelItem): CreativePreviewItem => ({
	id: model.id,
	title: model.name,
	image: model.image,
	alt: model.name,
	prompt: modelPromptMap[model.id] || model.name,
	model: model.name,
	resolution: model.kind === 'video' ? '1080p' : '1K',
	aspectRatio: model.kind === 'video' ? '16:9' : '2:3',
	outputFormat: model.kind === 'video' ? 'MP4' : 'PNG',
})
</script>

<style scoped lang="scss">
.models-section {
	background: #15161a;
	padding: 112px 0 132px;
	color: #f8fafc;
}

.models-section__inner {
	margin: 0 auto;
	max-width: 1720px;
	padding: 0 clamp(24px, 4vw, 72px);
}

.models-section__header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 48px;
	margin-bottom: 64px;

	h2 {
		margin: 0;
		color: #ffffff;
		font-size: clamp(52px, 5.2vw, 88px);
		font-weight: 800;
		line-height: 0.94;
		letter-spacing: 0;
	}

	p {
		margin: 18px 0 0;
		color: rgba(255, 255, 255, 0.48);
		font-size: 18px;
		font-weight: 650;
		line-height: 1.55;
	}
}

.models-section__action {
	display: inline-flex;
	align-items: center;
	gap: 12px;
	margin-top: 10px;
	border: 0;
	background: transparent;
	padding: 0;
	color: rgba(255, 255, 255, 0.52);
	font-size: 12px;
	font-weight: 900;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	cursor: pointer;
	transition: color 180ms ease;

	&:hover {
		color: #ef4d2c;
	}
}

.models-section__grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 18px;
}

.model-card {
	position: relative;
	min-height: 740px;
	overflow: hidden;
	border: 1px solid rgba(255, 255, 255, 0.18);
	border-radius: 12px;
	background: #2e2f30;
	cursor: pointer;
	outline: none;
	transition:
		border-color 180ms ease,
		transform 180ms ease,
		box-shadow 180ms ease;

	&:hover,
	&:focus-visible {
		border-color: rgba(255, 255, 255, 0.36);
		box-shadow: 0 18px 52px rgba(0, 0, 0, 0.36);
		transform: translateY(-3px);
	}

	img,
	.model-card__placeholder {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	img {
		filter: saturate(0.9) contrast(1.02);
	}

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		background:
			linear-gradient(180deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.18) 48%, rgba(0, 0, 0, 0.94) 100%),
			linear-gradient(0deg, rgba(0, 0, 0, 0.42), transparent 45%);
		z-index: 1;
		pointer-events: none;
	}
}

.model-card__placeholder {
	background: linear-gradient(180deg, #464646 0%, #373737 28%, #171717 100%);
}

.model-card__content {
	position: absolute;
	left: 26px;
	right: 26px;
	bottom: 112px;
	z-index: 2;
}

.model-card__type {
	display: flex;
	align-items: center;
	gap: 8px;
	margin: 0 0 8px;
	color: rgba(255, 255, 255, 0.58);
	font-size: 11px;
	font-weight: 900;
	letter-spacing: 0.1em;
	text-transform: uppercase;
}

.model-card__type-icon {
	display: inline-flex;
	width: 14px;
	height: 14px;

	svg {
		width: 14px;
		height: 14px;
	}
}

.model-card h3 {
	margin: 0;
	color: #ffffff;
	font-size: 22px;
	font-weight: 800;
	line-height: 1.15;
	letter-spacing: 0;
}

@media (min-width: 1600px) {
	.model-card {
		min-height: 800px;
	}
}

@media (max-width: 1180px) {
	.models-section__grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.model-card {
		min-height: 640px;
	}
}

@media (max-width: 760px) {
	.models-section {
		padding: 76px 0 92px;
	}

	.models-section__inner {
		padding: 0 16px;
	}

	.models-section__header {
		flex-direction: column;
		gap: 22px;
		margin-bottom: 38px;
	}

	.models-section__header h2 {
		font-size: 48px;
	}

	.models-section__header p {
		font-size: 16px;
	}

	.models-section__grid {
		grid-template-columns: 1fr;
	}

	.model-card {
		min-height: 560px;
	}

	.model-card__content {
		bottom: 70px;
	}
}
</style>
