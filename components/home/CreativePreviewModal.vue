<template>
	<Teleport to="body">
		<Transition name="preview-fade">
			<div v-if="item" class="preview-modal" role="dialog" aria-modal="true" :aria-label="item.title" @click.self="emit('close')">
				<div class="preview-modal__shell">
					<section class="preview-modal__media" :class="{ 'is-long': isLongPreview }">
						<img v-if="item.image" :src="previewImage" :alt="item.alt || item.title" @load="handleImageLoad" />
						<div v-else class="preview-modal__placeholder"></div>
						<span class="preview-modal__zoom">100%</span>
					</section>

					<aside class="preview-modal__panel">
						<button type="button" class="preview-modal__close" :aria-label="t('common.close')" @click="emit('close')">
							<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
								<path d="M5.5 5.5L14.5 14.5M14.5 5.5L5.5 14.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
							</svg>
						</button>

						<button type="button" class="preview-modal__download" :aria-label="t('home.preview.download')">
							<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
								<path d="M10 3.5V11M6.8 8.2L10 11.4L13.2 8.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
								<path d="M5 14.5H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
							</svg>
						</button>

						<div class="preview-modal__block">
							<h3>{{ t('home.preview.prompt') }}</h3>
							<p :class="{ 'is-expanded': promptExpanded }">{{ item.prompt }}</p>
							<button v-if="item.prompt.length > 120" type="button" class="preview-modal__link" @click="promptExpanded = !promptExpanded">
								{{ promptExpanded ? t('home.preview.seeLess') : t('home.preview.seeMore') }}
							</button>
						</div>

						<div class="preview-modal__block">
							<h3>{{ t('home.preview.settings') }}</h3>
							<dl class="preview-modal__settings">
								<div>
									<dt>{{ t('home.preview.model') }}</dt>
									<dd>{{ item.model }}</dd>
								</div>
								<div>
									<dt>{{ t('home.preview.resolution') }}</dt>
									<dd>{{ item.resolution }}</dd>
								</div>
								<div>
									<dt>{{ t('home.preview.aspectRatio') }}</dt>
									<dd>{{ item.aspectRatio }}</dd>
								</div>
								<div>
									<dt>{{ t('home.preview.outputFormat') }}</dt>
									<dd>{{ item.outputFormat }}</dd>
								</div>
							</dl>
						</div>

						<button type="button" class="preview-modal__try">
							{{ t('home.preview.tryPrompt') }}
							<span aria-hidden="true">↗</span>
						</button>
					</aside>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
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

const props = defineProps<{
	item: CreativePreviewItem | null
}>()

const emit = defineEmits<{
	(e: 'close'): void
}>()

const { t } = useAppI18n()
const promptExpanded = ref(false)
const imageAspect = ref<number | null>(null)
const previewImage = computed(() => props.item?.image.replace('fit=crop', 'fit=max') || '')
const declaredAspect = computed(() => {
	const [width, height] = props.item?.aspectRatio.split(':').map(Number) || []
	return width > 0 && height > 0 ? width / height : null
})
const isLongPreview = computed(() => (imageAspect.value ?? declaredAspect.value ?? 1) < 0.78)

const handleImageLoad = (event: Event) => {
	const image = event.target as HTMLImageElement
	imageAspect.value = image.naturalWidth && image.naturalHeight ? image.naturalWidth / image.naturalHeight : null
}

const handleKeydown = (event: KeyboardEvent) => {
	if (event.key === 'Escape' && props.item) {
		emit('close')
	}
}

watch(
	() => props.item,
	(value) => {
		promptExpanded.value = false
		imageAspect.value = null
		if (!import.meta.client) return
		document.body.style.overflow = value ? 'hidden' : ''
	},
)

onMounted(() => {
	window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
	window.removeEventListener('keydown', handleKeydown)
	if (import.meta.client) {
		document.body.style.overflow = ''
	}
})
</script>

<style scoped lang="scss">
.preview-fade-enter-active,
.preview-fade-leave-active {
	transition: opacity 180ms ease;
}

.preview-fade-enter-from,
.preview-fade-leave-to {
	opacity: 0;
}

.preview-modal {
	position: fixed;
	inset: 0;
	z-index: 120;
	display: grid;
	place-items: center;
	background: rgba(0, 0, 0, 0.74);
	padding: 16px;
	backdrop-filter: blur(8px);
}

.preview-modal__shell {
	display: grid;
	grid-template-columns: minmax(0, 1fr) 320px;
	width: min(1280px, calc(100vw - 32px));
	height: min(774px, calc(100vh - 32px));
	overflow: hidden;
	border: 1px solid rgba(255, 255, 255, 0.14);
	border-radius: 14px;
	background: #080808;
	box-shadow: 0 36px 120px rgba(0, 0, 0, 0.66);
}

.preview-modal__media {
	position: relative;
	display: grid;
	place-items: center;
	min-height: 0;
	min-width: 0;
	overflow: hidden;
	background: #070707;
	padding: clamp(20px, 3vw, 34px) clamp(20px, 3vw, 34px) clamp(58px, 5vw, 72px);

	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	&.is-long img {
		width: auto;
		height: auto;
		max-width: min(100%, 620px);
		max-height: 100%;
		object-fit: contain;
	}

	.preview-modal__placeholder {
		display: block;
		width: 100%;
		max-height: 100%;
	}
}

.preview-modal__placeholder {
	aspect-ratio: 16 / 9;
	border-radius: 8px;
	background: linear-gradient(135deg, #25262b, #0f1014);
}

.preview-modal__zoom {
	position: absolute;
	left: 50%;
	bottom: 18px;
	transform: translateX(-50%);
	border-radius: 999px;
	background: rgba(0, 0, 0, 0.72);
	padding: 6px 13px;
	color: rgba(255, 255, 255, 0.72);
	font-size: 13px;
	line-height: 1;
}

.preview-modal__panel {
	position: relative;
	border-left: 1px solid rgba(255, 255, 255, 0.12);
	background: #19191b;
	padding: 36px 20px 24px;
	color: #ffffff;
}

.preview-modal__close,
.preview-modal__download {
	display: grid;
	place-items: center;
	width: 32px;
	height: 32px;
	border: 0;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.08);
	color: rgba(255, 255, 255, 0.78);
	cursor: pointer;
	transition: background 180ms ease, color 180ms ease;

	svg {
		width: 18px;
		height: 18px;
	}

	&:hover {
		background: rgba(255, 255, 255, 0.16);
		color: #ffffff;
	}
}

.preview-modal__close {
	position: absolute;
	right: 12px;
	top: 12px;
	box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
}

.preview-modal__download {
	margin-bottom: 22px;
	border-radius: 10px;
}

.preview-modal__block {
	margin-bottom: 28px;

	h3 {
		margin: 0 0 10px;
		color: rgba(255, 255, 255, 0.44);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0;
	}

	p {
		display: -webkit-box;
		margin: 0;
		overflow: hidden;
		color: rgba(255, 255, 255, 0.78);
		font-size: 14px;
		font-weight: 500;
		line-height: 1.48;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
	}

	p.is-expanded {
		display: block;
		overflow: visible;
	}
}

.preview-modal__link {
	margin-top: 8px;
	border: 0;
	background: transparent;
	padding: 0;
	color: #c084fc;
	font-size: 12px;
	font-weight: 700;
	cursor: pointer;
}

.preview-modal__settings {
	display: grid;
	gap: 13px;
	margin: 0;

	div {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	dt,
	dd {
		margin: 0;
		font-size: 13px;
	}

	dt {
		color: rgba(255, 255, 255, 0.36);
	}

	dd {
		color: rgba(255, 255, 255, 0.76);
		text-align: right;
	}
}

.preview-modal__try {
	display: inline-flex;
	align-items: center;
	gap: 9px;
	border: 0;
	background: transparent;
	padding: 0;
	color: rgba(255, 255, 255, 0.58);
	font-size: 11px;
	font-weight: 900;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	cursor: pointer;
	transition: color 180ms ease;

	&:hover {
		color: #ef4d2c;
	}
}

@media (max-width: 900px) {
	.preview-modal {
		align-items: start;
		overflow-y: auto;
		padding: 12px;
	}

	.preview-modal__shell {
		grid-template-columns: 1fr;
		width: 100%;
		height: auto;
		min-height: calc(100vh - 24px);
	}

	.preview-modal__media {
		min-height: 48vh;
	}

	.preview-modal__panel {
		border-left: 0;
		border-top: 1px solid rgba(255, 255, 255, 0.12);
	}
}
</style>
