<template>
	<section ref="sectionRef" class="particle-hero">
		<canvas ref="canvasRef" class="particle-hero__canvas" aria-hidden="true"></canvas>
		<div class="particle-hero__shade"></div>

		<div class="particle-hero__content">
			<div class="particle-hero__mark">▰</div>
			<h1>{{ title }}</h1>
			<p>{{ subtitle }}</p>

			<div class="generator-panel" :class="[`is-${activeMedia}`]">
				<div class="generator-panel__flow" aria-hidden="true"></div>

				<div class="generator-panel__rail" :aria-label="t('home.particleHero.generationType')">
					<button
						type="button"
						:class="{ 'is-active': activeMedia === 'video' }"
						:aria-label="t('home.particleHero.videoMode')"
						@click="setMedia('video')"
					>
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path d="M4.5 7.5h9a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-9a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Z" />
							<path d="m16.5 11 4-2.3v6.6l-4-2.3" />
						</svg>
					</button>
					<button
						type="button"
						:class="{ 'is-active': activeMedia === 'image' }"
						:aria-label="t('home.particleHero.imageMode')"
						@click="setMedia('image')"
					>
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<rect x="3.5" y="5" width="17" height="14" rx="2.5" />
							<path d="m6.5 16 4.1-4.1 3 3 1.9-1.9 2 3" />
							<circle cx="15.5" cy="9.5" r="1.2" />
						</svg>
					</button>
				</div>

				<button
					v-if="activeMedia === 'image'"
					type="button"
					class="generator-panel__drop"
					@click="fileInputRef?.click()"
				>
					<span>{{ t('home.particleHero.optional') }}</span>
					<strong>+</strong>
					<small>{{ uploadedImages.length }}/8</small>
					<input ref="fileInputRef" type="file" accept="image/*" multiple @change="handleFiles" />
				</button>

				<div v-if="uploadedImages.length" class="generator-panel__previews">
					<div v-for="(image, index) in uploadedImages" :key="image.id">
						<img :src="image.src" :alt="image.name" />
						<button type="button" :aria-label="t('home.particleHero.removeImage')" @click="removeImage(index)">x</button>
					</div>
				</div>

				<textarea v-model="promptText" :placeholder="currentPlaceholder"></textarea>

				<div class="generator-panel__footer">
					<div class="generator-panel__chips">
						<div class="control-chip-wrap">
							<button type="button" class="control-chip is-strong" @click="toggleMenu('model')">
								<span class="chip-google">{{ selectedModel.icon }}</span>
								<span>{{ selectedModel.name }}</span>
							</button>
							<div v-if="openMenu === 'model'" class="select-popover model-popover">
								<div class="popover-head">
									<strong>{{ t('home.particleHero.selectModel') }}</strong>
									<span>{{ activeMedia === 'video' ? t('home.particleHero.videoEngines') : t('home.particleHero.imageEngines') }}</span>
								</div>
								<div class="model-grid">
									<button
										v-for="model in currentModels"
										:key="model.id"
										type="button"
										:class="{ 'is-selected': model.id === selectedModel.id }"
										@click="selectModel(model.id)"
									>
										<i>{{ model.icon }}</i>
										<strong>{{ model.name }}</strong>
										<em v-if="model.badge">{{ model.badge }}</em>
										<p>{{ model.desc }}</p>
										<span v-for="tag in model.tags" :key="tag">{{ tag }}</span>
									</button>
								</div>
							</div>
						</div>

						<div class="control-chip-wrap">
							<button type="button" class="control-chip" @click="toggleMenu('mode')">
								<span>{{ selectedWorkMode.icon }}</span>
								<span>{{ selectedWorkMode.label }}</span>
							</button>
							<div v-if="openMenu === 'mode'" class="select-popover compact-popover mode-popover">
								<button
									v-for="mode in workModes"
									:key="mode.id"
									type="button"
									:class="{ 'is-selected': mode.id === selectedWorkMode.id }"
									@click="selectWorkMode(mode.id)"
								>
									<span>{{ mode.icon }}</span>
									<strong>{{ mode.label }}</strong>
								</button>
							</div>
						</div>

						<div class="control-chip-wrap">
							<button type="button" class="control-chip" @click="toggleMenu('ratio')">
								<span>▭</span>
								<span>{{ selectedRatio.label }}</span>
							</button>
							<div v-if="openMenu === 'ratio'" class="select-popover compact-popover ratio-popover">
								<button
									v-for="ratio in ratios"
									:key="ratio.id"
									type="button"
									:class="{ 'is-selected': ratio.id === selectedRatio.id }"
									@click="selectRatio(ratio.id)"
								>
									<i :class="`ratio-icon ratio-icon--${ratio.id}`"></i>
									<strong>{{ ratio.label }}</strong>
								</button>
							</div>
						</div>
					</div>

					<div class="generator-panel__actions">
						<label>
							<span>{{ t('home.particleHero.private') }}</span>
							<input v-model="isPrivate" type="checkbox" />
							<i></i>
						</label>
						<span>{{ t('home.particleHero.credits', { count: currentCredits }) }}</span>
						<button type="button" class="send-btn" :aria-label="t('home.particleHero.generate')">↑</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
type MediaType = 'image' | 'video'
type MenuType = 'model' | 'mode' | 'ratio' | null

type ModelOption = {
	id: string
	icon: string
	name: string
	desc: string
	badge?: string
	tags: string[]
}

type WorkMode = {
	id: string
	icon: string
	label: string
}

type RatioOption = {
	id: string
	label: string
}

const { t } = useAppI18n()

const fallbackText = (key: string, fallback: string) => {
	const value = t(key)
	return typeof value === 'string' && value !== key ? value : fallback
}

const title = computed(() => fallbackText('home.particleHero.title', 'Free gptpix.ai Image Generation'))
const subtitle = computed(() => fallbackText('home.particleHero.subtitle', 'Cinema-grade AI video & image studio - motion, light, detail in seconds.'))

const imagePlaceholder = computed(() => fallbackText('home.particleHero.imagePlaceholder', 'Describe the image you want to generate...'))
const videoPlaceholder = computed(() => fallbackText('home.particleHero.videoPlaceholder', 'Describe your video scene...'))

const imageModels = computed(() => t('home.particleHero.imageModels') as ModelOption[])
const videoModels = computed(() => t('home.particleHero.videoModels') as ModelOption[])
const workModes = computed(() => t('home.particleHero.workModes') as WorkMode[])

const videoRatios: RatioOption[] = [
	{ id: '16-9', label: '16:9' },
	{ id: '9-16', label: '9:16' },
	{ id: 'auto', label: 'Auto' },
]

const activeMedia = ref<MediaType>('image')
const openMenu = ref<MenuType>(null)
const selectedImageModelId = ref('gpt-image-2')
const selectedVideoModelId = ref('veo-fast')
const selectedWorkModeId = ref('text')
const selectedRatioId = ref('1-1')
const promptText = ref('')
const isPrivate = ref(false)
const uploadedImages = ref<Array<{ id: string; name: string; src: string }>>([])
const fileInputRef = ref<HTMLInputElement | null>(null)

const imageRatios: RatioOption[] = [
	{ id: '1-1', label: '1:1' },
	{ id: '4-5', label: '4:5' },
	{ id: '16-9', label: '16:9' },
]

const currentModels = computed(() => activeMedia.value === 'video' ? videoModels.value : imageModels.value)
const ratios = computed(() => activeMedia.value === 'video' ? videoRatios : imageRatios)
const selectedModel = computed(() => {
	const id = activeMedia.value === 'video' ? selectedVideoModelId.value : selectedImageModelId.value
	return currentModels.value.find(model => model.id === id) ?? currentModels.value[0]
})
const selectedWorkMode = computed(() => workModes.value.find(mode => mode.id === selectedWorkModeId.value) ?? workModes.value[0])
const selectedRatio = computed(() => ratios.value.find(ratio => ratio.id === selectedRatioId.value) ?? ratios.value[0])
const currentCredits = computed(() => activeMedia.value === 'video' ? 100 : 5)
const currentPlaceholder = computed(() => activeMedia.value === 'video' ? videoPlaceholder.value : imagePlaceholder.value)

const setMedia = (media: MediaType) => {
	activeMedia.value = media
	openMenu.value = null
	selectedRatioId.value = media === 'video' ? '16-9' : '1-1'
}

const toggleMenu = (menu: Exclude<MenuType, null>) => {
	openMenu.value = openMenu.value === menu ? null : menu
}

const selectModel = (id: string) => {
	if (activeMedia.value === 'video') selectedVideoModelId.value = id
	else selectedImageModelId.value = id
	openMenu.value = null
}

const selectWorkMode = (id: string) => {
	selectedWorkModeId.value = id
	openMenu.value = null
}

const selectRatio = (id: string) => {
	selectedRatioId.value = id
	openMenu.value = null
}

const handleFiles = (event: Event) => {
	const input = event.target as HTMLInputElement
	const files = Array.from(input.files ?? [])
	const remain = Math.max(0, 8 - uploadedImages.value.length)
	files.slice(0, remain).forEach(file => {
		uploadedImages.value.push({
			id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
			name: file.name,
			src: URL.createObjectURL(file),
		})
	})
	input.value = ''
}

const removeImage = (index: number) => {
	const target = uploadedImages.value[index]
	if (target) URL.revokeObjectURL(target.src)
	uploadedImages.value.splice(index, 1)
}

const sectionRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

type Particle = {
	x: number
	y: number
	baseX: number
	baseY: number
	vx: number
	vy: number
	size: number
	alpha: number
	phase: number
	warmth: number
}

let particles: Particle[] = []
let frame = 0
let animationId = 0
let width = 0
let height = 0
let dpr = 1

const pointer = {
	x: 0,
	y: 0,
	active: false,
}

const rand = (min: number, max: number) => min + Math.random() * (max - min)

const createParticles = () => {
	const count = Math.min(2800, Math.max(900, Math.floor((width * height) / 520)))
	particles = Array.from({ length: count }, () => {
		const cluster = Math.random() < 0.74
		const cx = width * rand(0.55, 0.86)
		const cy = height * rand(0.14, 0.76)
		const x = cluster ? cx + rand(-width * 0.22, width * 0.22) : rand(0, width)
		const y = cluster ? cy + rand(-height * 0.36, height * 0.36) : rand(0, height)

		return {
			x,
			y,
			baseX: x,
			baseY: y,
			vx: rand(-0.12, 0.12),
			vy: rand(-0.1, 0.1),
			size: rand(0.45, 1.35),
			alpha: rand(0.24, 0.9),
			phase: rand(0, Math.PI * 2),
			warmth: rand(96, 166),
		}
	})
}

const resizeCanvas = () => {
	const canvas = canvasRef.value
	const section = sectionRef.value
	if (!canvas || !section) return

	const rect = section.getBoundingClientRect()
	width = Math.max(1, rect.width)
	height = Math.max(1, rect.height)
	dpr = Math.min(window.devicePixelRatio || 1, 2)
	canvas.width = Math.floor(width * dpr)
	canvas.height = Math.floor(height * dpr)
	canvas.style.width = `${width}px`
	canvas.style.height = `${height}px`

	const ctx = canvas.getContext('2d')
	ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
	createParticles()
}

const draw = () => {
	const canvas = canvasRef.value
	const ctx = canvas?.getContext('2d')
	if (!canvas || !ctx) return

	frame += 0.01
	ctx.clearRect(0, 0, width, height)
	ctx.fillStyle = '#15161a'
	ctx.fillRect(0, 0, width, height)

	const warmGlow = ctx.createRadialGradient(width * 0.72, height * 0.3, 0, width * 0.72, height * 0.3, width * 0.44)
	warmGlow.addColorStop(0, 'rgba(239, 77, 44, 0.11)')
	warmGlow.addColorStop(0.36, 'rgba(245, 158, 11, 0.055)')
	warmGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
	ctx.fillStyle = warmGlow
	ctx.fillRect(0, 0, width, height)
	ctx.globalCompositeOperation = 'lighter'

	particles.forEach((particle) => {
		const orbitX = width * 0.68
		const orbitY = height * 0.38
		const dxOrbit = particle.x - orbitX
		const dyOrbit = particle.y - orbitY
		const orbitDistance = Math.max(Math.sqrt(dxOrbit * dxOrbit + dyOrbit * dyOrbit), 1)
		const orbitStrength = Math.max(0.012, 1 - orbitDistance / (width * 0.55)) * 0.006
		const driftX = Math.cos(frame * 1.2 + particle.phase) * 0.26
		const driftY = Math.sin(frame * 0.9 + particle.phase) * 0.2
		const wave = Math.sin(frame * 1.2 + particle.baseX * 0.012 + particle.baseY * 0.006) * 0.01

		particle.vx += (-dyOrbit / orbitDistance) * orbitStrength + driftX * 0.008 + wave
		particle.vy += (dxOrbit / orbitDistance) * orbitStrength + driftY * 0.006

		if (pointer.active) {
			const dx = particle.x - pointer.x
			const dy = particle.y - pointer.y
			const distSq = dx * dx + dy * dy
			const radius = 190
			if (distSq < radius * radius) {
				const dist = Math.max(Math.sqrt(distSq), 1)
				const force = (1 - dist / radius) * 0.58
				particle.vx += (dx / dist) * force
				particle.vy += (dy / dist) * force
			}
		}

		particle.vx += (particle.baseX - particle.x) * 0.00045
		particle.vy += (particle.baseY - particle.y) * 0.00045
		particle.vx *= 0.94
		particle.vy *= 0.94
		particle.x += particle.vx
		particle.y += particle.vy

		const twinkle = 0.5 + Math.sin(frame * 2 + particle.phase) * 0.5
		const size = particle.size * (1 + twinkle * 0.22)
		ctx.beginPath()
		ctx.fillStyle = `rgba(239, ${Math.floor(particle.warmth)}, 44, ${particle.alpha * (0.34 + twinkle * 0.38)})`
		ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2)
		ctx.fill()
	})

	if (pointer.active) {
		const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 220)
		glow.addColorStop(0, 'rgba(239, 77, 44, 0.22)')
		glow.addColorStop(0.28, 'rgba(245, 158, 11, 0.08)')
		glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
		ctx.fillStyle = glow
		ctx.fillRect(pointer.x - 230, pointer.y - 230, 460, 460)
	}

	ctx.globalCompositeOperation = 'source-over'
	animationId = requestAnimationFrame(draw)
}

const onPointerMove = (event: PointerEvent) => {
	const rect = sectionRef.value?.getBoundingClientRect()
	if (!rect) return
	pointer.x = event.clientX - rect.left
	pointer.y = event.clientY - rect.top
	pointer.active = true
}

const onPointerLeave = () => {
	pointer.active = false
}

const onDocumentPointerDown = (event: PointerEvent) => {
	const target = event.target as Element | null
	if (target?.closest('.control-chip-wrap')) return
	openMenu.value = null
}

onMounted(() => {
	resizeCanvas()
	draw()
	window.addEventListener('resize', resizeCanvas)
	document.addEventListener('pointerdown', onDocumentPointerDown)
	sectionRef.value?.addEventListener('pointermove', onPointerMove)
	sectionRef.value?.addEventListener('pointerleave', onPointerLeave)
})

onBeforeUnmount(() => {
	cancelAnimationFrame(animationId)
	window.removeEventListener('resize', resizeCanvas)
	document.removeEventListener('pointerdown', onDocumentPointerDown)
	sectionRef.value?.removeEventListener('pointermove', onPointerMove)
	sectionRef.value?.removeEventListener('pointerleave', onPointerLeave)
	uploadedImages.value.forEach(image => URL.revokeObjectURL(image.src))
})
</script>

<style scoped lang="scss">
@property --panel-angle {
	syntax: "<angle>";
	initial-value: 0deg;
	inherits: false;
}

.particle-hero {
	position: relative;
	min-height: max(924px, 100vh);
	overflow: hidden;
	background: #15161a;
	margin-inline: calc(50% - 50vw);
}

.particle-hero__canvas,
.particle-hero__shade {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
}

.particle-hero__shade {
	background:
		radial-gradient(circle at 72% 28%, rgba(239, 77, 44, 0.14), transparent 26%),
		linear-gradient(115deg, transparent 0%, rgba(246, 210, 61, 0.045) 36%, transparent 58%),
		linear-gradient(90deg, rgba(21, 22, 26, 0.96) 0%, rgba(21, 22, 26, 0.78) 28%, rgba(21, 22, 26, 0.2) 58%, rgba(21, 22, 26, 0.78) 100%),
		linear-gradient(180deg, rgba(7, 10, 18, 0.1) 0%, rgba(7, 10, 18, 0) 48%, rgba(7, 10, 18, 0.72) 100%);
	background-size: 100% 100%, 180% 180%, 100% 100%, 100% 100%;
	animation: hero-shade-drift 28s linear infinite;
	pointer-events: none;
}

.particle-hero__content {
	position: relative;
	z-index: 1;
	display: grid;
	justify-items: center;
	width: min(1060px, calc(100% - 32px));
	margin: 0 auto;
	padding: calc(18vh + 64px) 0 96px;
	text-align: center;
}

.particle-hero__mark {
	margin-bottom: 22px;
	color: #f6d23d;
	font-size: 34px;
	line-height: 1;
	text-shadow: 0 0 22px rgba(246, 210, 61, 0.55);
	transform: rotate(16deg);
}

.particle-hero h1 {
	margin: 0;
	color: #f8fafc;
	font-size: clamp(36px, 5.4vw, 58px);
	font-weight: 800;
	line-height: 1.04;
}

.particle-hero p {
	margin: 14px 0 0;
	color: rgba(248, 250, 252, 0.52);
	font-size: 15px;
	letter-spacing: 0;
}

.generator-panel {
	position: relative;
	display: grid;
	grid-template-columns: auto 72px minmax(0, 1fr);
	gap: 10px;
	width: min(1024px, 100%);
	min-height: 280px;
	margin-top: 42px;
	padding: 28px 28px 22px;
	border: 1px solid transparent;
	border-radius: 24px;
	background:
		linear-gradient(rgba(5, 6, 10, 0.88), rgba(5, 6, 10, 0.88)) padding-box,
		conic-gradient(
			from var(--panel-angle),
			rgba(255, 255, 255, 0.18),
			rgba(246, 210, 61, 0.38),
			rgba(239, 77, 44, 0.34),
			rgba(124, 58, 237, 0.2),
			rgba(255, 255, 255, 0.18)
		) border-box;
	box-shadow:
		0 30px 90px rgba(0, 0, 0, 0.42),
		inset 0 1px 0 rgba(255, 255, 255, 0.08),
		34px 18px 58px rgba(239, 77, 44, 0.08),
		-18px 24px 56px rgba(246, 210, 61, 0.045);
	backdrop-filter: blur(18px);
	animation: panel-border-spin 22s linear infinite;
}

.generator-panel.is-video {
	grid-template-columns: auto minmax(0, 1fr);
}

.generator-panel__flow {
	position: absolute;
	inset: 1px;
	overflow: hidden;
	border-radius: inherit;
	pointer-events: none;
}

.generator-panel__flow {
	background: transparent;
}

.generator-panel__rail,
.generator-panel__drop,
.generator-panel textarea,
.generator-panel__footer,
.generator-panel__previews {
	position: relative;
	z-index: 1;
}

.generator-panel__rail {
	align-self: center;
	display: grid;
	gap: 8px;
	padding: 8px;
	border: 1px solid rgba(255, 255, 255, 0.18);
	border-radius: 18px;
	background: rgba(255, 255, 255, 0.04);
	box-shadow: 0 16px 42px rgba(0, 0, 0, 0.28);
}

button {
	font: inherit;
}

.generator-panel__rail button,
.generator-panel__chips button,
.send-btn,
.generator-panel__drop,
.select-popover button {
	border: 0;
	cursor: pointer;
}

.generator-panel__rail button {
	display: grid;
	place-items: center;
	width: 36px;
	height: 36px;
	border-radius: 14px;
	background: transparent;
	color: rgba(248, 250, 252, 0.52);
}

.generator-panel__rail svg {
	width: 18px;
	height: 18px;
	fill: none;
	stroke: currentColor;
	stroke-linecap: round;
	stroke-linejoin: round;
	stroke-width: 2;
}

.generator-panel__rail button.is-active {
	background: rgba(255, 255, 255, 0.12);
	color: #f8fafc;
	box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.generator-panel__drop {
	display: grid;
	place-items: center;
	align-content: center;
	gap: 20px;
	min-height: 168px;
	border: 1px dashed rgba(255, 255, 255, 0.18);
	border-radius: 18px;
	background: transparent;
	color: rgba(248, 250, 252, 0.42);
}

.generator-panel__drop input {
	display: none;
}

.generator-panel__drop span,
.generator-panel__drop small {
	font-size: 11px;
}

.generator-panel__drop strong {
	color: rgba(248, 250, 252, 0.48);
	font-size: 24px;
	font-weight: 300;
}

.generator-panel__previews {
	position: absolute;
	left: 142px;
	top: 40px;
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	max-width: 230px;
}

.generator-panel__previews div {
	position: relative;
	width: 46px;
	height: 46px;
	overflow: hidden;
	border-radius: 12px;
	border: 1px solid rgba(255, 255, 255, 0.16);
}

.generator-panel__previews img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.generator-panel__previews button {
	position: absolute;
	right: 2px;
	top: 2px;
	display: grid;
	place-items: center;
	width: 16px;
	height: 16px;
	border: 0;
	border-radius: 999px;
	background: rgba(0, 0, 0, 0.68);
	color: #fff;
	font-size: 10px;
}

.generator-panel textarea {
	min-height: 168px;
	border: 0;
	outline: none;
	resize: none;
	background: transparent;
	color: #f8fafc;
	font-size: 18px;
	line-height: 1.55;
}

.generator-panel textarea::placeholder {
	color: rgba(248, 250, 252, 0.22);
}

.generator-panel__footer {
	grid-column: 2 / -1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 18px;
	margin-top: 6px;
}

.is-video .generator-panel__footer {
	grid-column: 2 / -1;
}

.generator-panel__chips,
.generator-panel__actions {
	display: flex;
	align-items: center;
	gap: 10px;
}

.control-chip-wrap {
	position: relative;
}

.control-chip {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	min-height: 32px;
	padding: 0 18px;
	border: 1px solid rgba(255, 255, 255, 0.18);
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.08);
	color: #f8fafc;
	box-shadow: inset 0 0 16px rgba(239, 77, 44, 0.08);
}

.control-chip.is-strong {
	border-color: rgba(246, 210, 61, 0.44);
	background: linear-gradient(90deg, rgba(239, 77, 44, 0.18), rgba(255, 255, 255, 0.08));
}

.chip-google {
	color: #ef4d2c;
	font-weight: 800;
}

.generator-panel__actions {
	color: rgba(248, 250, 252, 0.45);
	font-size: 12px;
}

.generator-panel__actions label {
	display: inline-flex;
	align-items: center;
	gap: 8px;
}

.generator-panel__actions input {
	position: absolute;
	opacity: 0;
}

.generator-panel__actions i {
	position: relative;
	width: 32px;
	height: 18px;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.12);
}

.generator-panel__actions i::after {
	content: "";
	position: absolute;
	top: 2px;
	left: 2px;
	width: 14px;
	height: 14px;
	border-radius: 999px;
	background: #f8fafc;
	transition: transform 160ms ease;
}

.generator-panel__actions input:checked + i::after {
	transform: translateX(14px);
}

.send-btn {
	display: grid;
	place-items: center;
	width: 38px;
	height: 38px;
	border-radius: 999px;
	background:
		radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.5), transparent 28%),
		linear-gradient(135deg, #ef4d2c, #111827 68%);
	color: #f8fafc;
	font-size: 20px;
	box-shadow: 0 0 28px rgba(239, 77, 44, 0.3);
}

.select-popover {
	position: absolute;
	left: 0;
	bottom: calc(100% + 14px);
	z-index: 5;
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 22px;
	background: rgba(6, 7, 10, 0.94);
	box-shadow: 0 24px 80px rgba(0, 0, 0, 0.46);
	backdrop-filter: blur(18px);
}

.model-popover {
	width: min(760px, calc(100vw - 40px));
	padding: 18px;
}

.popover-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16px;
	color: rgba(248, 250, 252, 0.42);
	font-size: 12px;
	text-transform: uppercase;
	letter-spacing: 0.12em;
}

.popover-head strong {
	color: rgba(248, 250, 252, 0.56);
}

.model-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 12px;
}

.model-grid button {
	position: relative;
	display: grid;
	grid-template-columns: auto 1fr auto;
	align-items: start;
	gap: 8px;
	min-height: 112px;
	padding: 14px;
	border: 1px solid rgba(255, 255, 255, 0.06);
	border-radius: 14px;
	background: rgba(255, 255, 255, 0.055);
	color: #f8fafc;
	text-align: left;
}

.model-grid button.is-selected {
	border-color: rgba(255, 255, 255, 0.22);
	background: rgba(255, 255, 255, 0.1);
}

.model-grid i {
	color: #ef4d2c;
	font-style: normal;
	font-weight: 800;
}

.model-grid strong {
	font-size: 14px;
}

.model-grid em {
	align-self: start;
	padding: 2px 6px;
	border-radius: 999px;
	background: #ffe000;
	color: #08090d;
	font-size: 9px;
	font-style: normal;
	font-weight: 800;
	text-transform: uppercase;
}

.model-grid p {
	grid-column: 1 / -1;
	margin: 2px 0 16px;
	color: rgba(248, 250, 252, 0.42);
	font-size: 11px;
	line-height: 1.5;
}

.model-grid span {
	margin-right: 4px;
	padding: 4px 7px;
	border-radius: 5px;
	background: rgba(255, 255, 255, 0.06);
	color: rgba(248, 250, 252, 0.44);
	font-size: 10px;
}

.compact-popover {
	display: grid;
	grid-template-columns: repeat(3, 96px);
	gap: 8px;
	padding: 16px;
}

.compact-popover button {
	display: grid;
	place-items: center;
	gap: 8px;
	min-height: 72px;
	border-radius: 14px;
	background: transparent;
	color: rgba(248, 250, 252, 0.46);
}

.compact-popover button.is-selected {
	background: rgba(255, 255, 255, 0.12);
	color: #f8fafc;
}

.compact-popover button span {
	font-size: 20px;
}

.compact-popover button strong {
	font-size: 12px;
}

.ratio-icon {
	display: block;
	border: 2px solid currentColor;
	border-radius: 3px;
}

.ratio-icon--16-9 {
	width: 24px;
	height: 14px;
}

.ratio-icon--9-16 {
	width: 14px;
	height: 24px;
}

.ratio-icon--auto,
.ratio-icon--1-1,
.ratio-icon--4-5 {
	width: 18px;
	height: 18px;
}

@keyframes panel-border-spin {
	to {
		--panel-angle: 360deg;
	}
}

@keyframes hero-shade-drift {
	0% {
		background-position: 0 0, 0% 50%, 0 0, 0 0;
	}
	100% {
		background-position: 0 0, 180% 50%, 0 0, 0 0;
	}
}

@media (max-width: 900px) {
	.model-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 768px) {
	.particle-hero {
		min-height: 840px;
	}

	.particle-hero__content {
		padding-top: 72px;
	}

	.generator-panel,
	.generator-panel.is-video {
		grid-template-columns: 1fr;
		padding: 20px;
	}

	.generator-panel__rail {
		display: flex;
		justify-self: start;
	}

	.generator-panel__footer,
	.is-video .generator-panel__footer {
		grid-column: 1;
		flex-direction: column;
		align-items: stretch;
	}

	.generator-panel__chips,
	.generator-panel__actions {
		flex-wrap: wrap;
	}

	.model-popover {
		left: 50%;
		width: min(94vw, 560px);
		transform: translateX(-50%);
	}

	.model-grid {
		grid-template-columns: 1fr;
	}

	.compact-popover {
		grid-template-columns: repeat(3, 82px);
	}
}
</style>
