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
						<button type="button" class="case-card__cta" @click="tryCase(item)">
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
import { writeCreationHandoff } from '~/utils/creationHandoff'

const { t } = useAppI18n()
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
		prompt: string
		badgeTone?: 'yellow' | 'dark'
	}>
	activeThumb: number
}

const photo = (id: string, width = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`

const visuals: Record<string, CaseVisual> = {
	sceneSwap: {
		variants: [
			{ label: 'Original', image: '/images/editing-cases/scene-original.jpg', thumb: '/images/editing-cases/scene-original.jpg', prompt: 'Use this image as the identity reference. Keep the exact same woman, face, skin tone, hairstyle with the same loose strand, expression, gaze, black crew-neck top, body proportions, and chest-up composition. Change only the scene requested by the user, and match the new environmental light naturally on her. Photorealistic editorial photography; no additional people, text, logo, jewelry, wardrobe changes, facial changes, or pose changes.' },
			{ label: 'Future Architecture', image: '/images/editing-cases/scene-future-architecture.webp', thumb: '/images/editing-cases/scene-future-architecture.webp', prompt: 'Keep the exact same woman, face, hairstyle, expression, black crew-neck top, chest-up composition, and camera angle. Change only the background to a monumental futuristic gallery with pale geometric concrete and glass architecture, sculptural lines, soft skylight, and cool reflections. Match the environmental light naturally on her. Photorealistic premium fashion editorial; no additional people, text, logo, wardrobe changes, facial changes, or pose changes.' },
			{ label: 'Desert Horizon', image: '/images/editing-cases/scene-desert-horizon.webp', thumb: '/images/editing-cases/scene-desert-horizon.webp', prompt: 'Keep the exact same woman, face, hairstyle, expression, black crew-neck top, chest-up composition, and camera angle. Change only the background to a vast desert with warm sand dunes, distant red sandstone formations, a clean horizon, and golden-hour light. Match the warm environmental light naturally on her. Photorealistic premium fashion editorial; no additional people, text, logo, wardrobe changes, facial changes, or pose changes.' },
			{ label: 'Mountain Summit', image: '/images/editing-cases/scene-mountain-summit.webp', thumb: '/images/editing-cases/scene-mountain-summit.webp', prompt: 'Keep the exact same woman, face, hairstyle, expression, black crew-neck top, and identity. Change only the background to a dramatic high mountain summit with dark sculptural rock, layered green peaks, mist-filled valleys, and a vast horizon. Match the cool mountain light naturally on her. Photorealistic premium outdoor fashion editorial; no additional people, text, logo, wardrobe changes, or facial changes.' },
		],
		activeThumb: 1,
	},
	adRemix: {
		variants: [
			{ label: 'Original', image: photo('photo-1522312346375-d1a52e2b99b3'), thumb: photo('photo-1522312346375-d1a52e2b99b3', 180), prompt: 'Retouch this product into a premium modern catalog image. Preserve the exact product design, logo, materials, proportions, and colors. Clean studio lighting, precise edges, realistic metal and glass, subtle shadow, high-end commercial photography.' },
			{ label: 'Wrist Detail', image: photo('photo-1524805444758-089113d48a6d'), thumb: photo('photo-1524805444758-089113d48a6d', 180), prompt: 'Create an extreme macro luxury campaign focused on the product dial, crown, and brushed metal texture. Preserve every product detail and marking exactly. Razor-sharp focal plane, liquid-chrome highlights, deep black background, controlled specular light, premium watch editorial.' },
			{ label: 'Boutique Display', image: photo('photo-1547996160-81dfa63595aa'), thumb: photo('photo-1547996160-81dfa63595aa', 180), prompt: 'Stage the exact product in a minimalist futuristic boutique display made of smoked glass, brushed aluminum, and soft white light panels. Preserve all design details and branding. Quiet-luxury retail campaign, balanced composition, realistic reflections, photorealistic.' },
			{ label: 'Craftsmanship', image: photo('photo-1526045431048-f857369baa09'), thumb: photo('photo-1526045431048-f857369baa09', 180), prompt: 'Turn this into a contemporary craftsmanship campaign: the exact product on a dark precision workbench with subtle tools and metal components in soft focus. Preserve all markings and geometry. Dramatic rim light, tactile material detail, cinematic macro photography.' },
		],
		activeThumb: 3,
	},
	moodLight: {
		variants: [
			{ label: 'Day', badgeTone: 'yellow', image: photo('photo-1477959858617-67f85cf4f1df'), thumb: photo('photo-1477959858617-67f85cf4f1df', 180), prompt: 'Transform only the lighting into a bright contemporary daytime scene. Keep the architecture, camera angle, objects, and geography unchanged. Clear atmospheric depth, soft white sunlight, clean sky, realistic reflections, premium travel editorial color.' },
			{ label: 'Night', image: photo('photo-1519608487953-e999c86e7455'), thumb: photo('photo-1519608487953-e999c86e7455', 180), prompt: 'Transform this exact scene into cinematic blue hour at night. Preserve all structures and composition. Add tasteful warm window lights, deep cobalt sky, subtle wet reflections, crisp city detail, modern teal-and-amber film grade, photorealistic.' },
			{ label: 'Sunset', image: photo('photo-1495616811223-4d98c6e9c869'), thumb: photo('photo-1495616811223-4d98c6e9c869', 180), prompt: 'Transform this exact lakeside scene into a vivid late-sunset atmosphere. Keep the pier, water, distant forest, boat, and camera position unchanged. Deep orange horizon, lavender shadows, golden water reflections, soft mist, cinematic color grade, realistic detail.' },
			{ label: 'Snowy Winter', image: photo('photo-1483664852095-d6cc6870702d'), thumb: photo('photo-1483664852095-d6cc6870702d', 180), prompt: 'Transform this exact location into an elegant snowy winter day. Preserve architecture and composition. Fresh snow on surfaces, light snowfall, cool pearl-gray sky, warm interior accents, crisp air, realistic material response, cinematic travel photography.' },
		],
		activeThumb: 0,
	},
	portraitStyles: {
		layout: 'strip',
		mediaImages: [
			photo('photo-1506794778202-cad84cf45f1d', 520),
			photo('photo-1544005313-94ddf0286df2', 520),
			photo('photo-1534528741775-53994a69daeb', 520),
			photo('photo-1488426862026-3ee34a7d66df', 520),
			photo('photo-1524504388940-b1c1722653e1', 520),
		],
		variants: [
			{ label: 'Luxury Dark', image: photo('photo-1506794778202-cad84cf45f1d'), thumb: photo('photo-1506794778202-cad84cf45f1d', 180), prompt: 'Refine this exact dark portrait as a quiet-luxury fashion editorial. Preserve the face, identity, expression, hair, knit wardrobe, and black background exactly. Soft chiaroscuro, charcoal and silver palette, rich fabric texture, medium-format photography, natural skin.' },
			{ label: 'Vintage Film', image: photo('photo-1544005313-94ddf0286df2'), thumb: photo('photo-1544005313-94ddf0286df2', 180), prompt: 'Restyle this exact person as a 1990s editorial film portrait. Preserve identity, facial features, expression, and pose. Direct flash balanced with window light, fine 35mm grain, slightly faded color, candid framing, authentic skin texture, no beauty-filter effect.' },
			{ label: 'Bold Fashion Color', image: photo('photo-1534528741775-53994a69daeb'), thumb: photo('photo-1534528741775-53994a69daeb', 180), prompt: 'Create a bold contemporary fashion portrait using saturated cherry red and electric cyan color blocking. Preserve the person and face exactly. Graphic studio set, sharp confident styling, glossy magazine lighting, clean geometry, natural skin texture, high-fashion campaign.' },
			{ label: 'Romantic Soft Light', image: photo('photo-1488426862026-3ee34a7d66df'), thumb: photo('photo-1488426862026-3ee34a7d66df', 180), prompt: 'Refine this exact portrait into a modern romantic soft-light editorial while preserving the face, identity, pose, loose hair, denim styling, and blush background. Diffused window light, soft rose tones, natural skin texture, gentle film grain, elegant contemporary composition.' },
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

const tryCase = async (item: CaseCopy & CaseVisual) => {
	const variantIndex = getActiveIndex(item.id)
	const variant = getActiveVariant(item)
	const ratio = '16:9'

	writeCreationHandoff({
		version: 1,
		media: 'image',
		intent: 'template',
		traceId: `editing-case-${item.id}-${Date.now()}`,
		prompt: variant.prompt,
		modelName: 'GPT Image 2',
		createdAt: Date.now(),
		params: {
			modelId: 'gpt-image-2',
			platformCode: 2,
			modelCode: 4,
			prompt: variant.prompt,
			ratio,
			resolution: '2k',
			quality: 'high',
			imageCount: 1,
			userImages: [variant.image],
		},
	})

	await navigateTo({
		path: '/ai-image-generator',
		query: {
			source: 'editing-cases',
			case: item.id,
			variant: String(variantIndex),
			model: 'gpt-image-2',
			ratio,
			resolution: '2K',
			quality: 'high',
			n: '1',
		},
	})
}

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
