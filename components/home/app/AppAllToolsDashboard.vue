<template>
	<div
		:class="[
			'grid min-h-screen bg-[#050505] text-[#f5f5f5] transition-[grid-template-columns] duration-200',
			sidebarCollapsed ? 'grid-cols-[84px_minmax(0,1fr)]' : 'grid-cols-[288px_minmax(0,1fr)]',
		]"
	>
		<AppHomeSidebar :collapsed="sidebarCollapsed" @toggle-collapse="sidebarCollapsed = !sidebarCollapsed" />

		<main class="app-tools__main h-dvh min-w-0 overflow-y-auto bg-[#050505] px-6 py-8 max-[1120px]:h-auto max-[1120px]:pt-6">
			<div class="app-tools__switcher" role="tablist" :aria-label="copy.tabsLabel">
				<button type="button" class="is-active" role="tab" aria-selected="true">
					<span class="app-tools__tab-icon" v-html="icons.image"></span>
					{{ copy.imageTools }}
				</button>
				<button type="button" class="is-disabled" role="tab" aria-selected="false" disabled>
					<span class="app-tools__tab-icon" v-html="icons.video"></span>
					{{ copy.videoTools }}
					<small>{{ copy.comingSoon }}</small>
				</button>
			</div>

			<section class="app-tools__grid" :aria-label="copy.imageTools">
				<NuxtLink
					v-for="tool in tools"
					:key="tool.id"
					class="app-tool-card"
					:to="tool.to"
					:aria-label="tool.title"
				>
					<div class="app-tool-card__preview" :class="`is-${tool.preview}`">
						<template v-if="tool.preview === 'upscaler'">
							<div class="app-tool-card__split">
								<img :src="portraitImage" :alt="copy.upscalerBeforeAlt" loading="lazy" decoding="async" />
							</div>
							<div class="app-tool-card__split is-sharp">
								<img :src="portraitImage" :alt="copy.upscalerAfterAlt" loading="lazy" decoding="async" />
							</div>
							<span class="app-tool-card__divider" aria-hidden="true"></span>
						</template>

						<template v-else>
							<div class="app-tool-card__split is-muted-bg">
								<img :src="objectImage" :alt="copy.backgroundBeforeAlt" loading="lazy" decoding="async" />
							</div>
							<div class="app-tool-card__split is-transparent-bg">
								<img :src="objectImage" :alt="copy.backgroundAfterAlt" loading="lazy" decoding="async" />
							</div>
							<span class="app-tool-card__divider" aria-hidden="true"></span>
						</template>
					</div>
					<strong>{{ tool.title }}</strong>
				</NuxtLink>
			</section>
		</main>
	</div>
</template>

<script setup lang="ts">
import AppHomeSidebar from '~/components/home/app/AppHomeSidebar.vue'

type AllToolsCopy = {
	tabsLabel: string
	imageTools: string
	videoTools: string
	comingSoon: string
	imageUpscaler: string
	backgroundRemover: string
	upscalerBeforeAlt: string
	upscalerAfterAlt: string
	backgroundBeforeAlt: string
	backgroundAfterAlt: string
}

type ToolPreview = 'upscaler' | 'background'

type ToolCard = {
	id: string
	title: string
	preview: ToolPreview
	to: string
}

const { t } = useAppI18n()
const sidebarCollapsed = ref(false)

const copy = computed(() => t('allTools') as AllToolsCopy)
const photo = (id: string, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=86`
const portraitImage = photo('photo-1544005313-94ddf0286df2', 900)
const objectImage = photo('photo-1526170375885-4d8ecf77b99f', 900)

const icons = {
	image: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3.5" y="4" width="13" height="12" rx="1.6" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 13.5L8 10.8L10 12.6L11.7 10.8L14.5 13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
	video: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="6.5" width="9.5" height="7" rx="1.4" stroke="currentColor" stroke-width="1.5"/><path d="M12.5 8.5L17 6.5V13.5L12.5 11.5V8.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
}

const tools = computed<ToolCard[]>(() => [
	{
		id: 'image-upscaler',
		title: copy.value.imageUpscaler,
		preview: 'upscaler',
		to: '/ai-image-generator',
	},
	{
		id: 'background-remover',
		title: copy.value.backgroundRemover,
		preview: 'background',
		to: '/ai-image-generator',
	},
])
</script>

<style scoped lang="scss">
.app-tools__main {
	display: block;
}

.app-tools__switcher {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	min-height: 88px;
	margin-bottom: 46px;
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 24px;
	background: #111113;
	padding: 8px;

	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		min-height: 66px;
		border: 0;
		border-radius: 18px;
		padding: 0 30px;
		background: transparent;
		color: rgba(255, 255, 255, 0.32);
		font-size: 28px;
		font-weight: 780;
		letter-spacing: 0;
		white-space: nowrap;
	}

	button.is-active {
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: #404042;
		color: rgba(255, 255, 255, 0.92);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	button.is-disabled {
		cursor: not-allowed;
	}

	small {
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.08);
		padding: 4px 12px;
		color: rgba(255, 255, 255, 0.34);
		font-size: 20px;
		font-weight: 800;
		line-height: 1;
	}
}

.app-tools__tab-icon {
	display: grid;
	place-items: center;
	width: 27px;
	height: 27px;

	:deep(svg) {
		width: 100%;
		height: 100%;
	}
}

.app-tools__grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(280px, 536px));
	gap: 32px;
	align-items: start;
}

.app-tool-card {
	display: grid;
	grid-template-rows: 300px 92px;
	overflow: hidden;
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 32px;
	background: #141416;
	color: #fff;
	text-align: center;
	outline: none;
	transition: border-color 180ms ease, transform 180ms ease, background 180ms ease;

	&:hover {
		border-color: rgba(255, 255, 255, 0.22);
		background: #18181a;
		transform: translateY(-2px);
	}

	&:focus-visible {
		box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8), 0 0 0 6px rgba(255, 255, 255, 0.12);
	}

	strong {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
		padding: 0 22px;
		color: rgba(255, 255, 255, 0.92);
		font-size: 28px;
		font-weight: 860;
		line-height: 1.15;
	}
}

.app-tool-card__preview {
	position: relative;
	display: grid;
	grid-template-columns: 1fr 1fr;
	min-width: 0;
	overflow: hidden;
	background: #1a1a1c;
	isolation: isolate;
}

.app-tool-card__split {
	position: relative;
	min-width: 0;
	overflow: hidden;

	img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
}

.app-tool-card__preview.is-upscaler {
	.app-tool-card__split:first-child img {
		filter: blur(2px) saturate(0.86) contrast(0.9);
		transform: scale(1.035);
	}

	.app-tool-card__split.is-sharp img {
		filter: saturate(1.06) contrast(1.06);
	}
}

.app-tool-card__preview.is-background {
	.app-tool-card__split img {
		inset: 20px 18px 0;
		width: calc(100% - 36px);
		height: calc(100% - 20px);
		object-fit: contain;
		filter: saturate(1.02) contrast(1.05);
	}
}

.app-tool-card__split.is-muted-bg {
	background: linear-gradient(135deg, #78817e, #262729 62%);
}

.app-tool-card__split.is-transparent-bg {
	background-color: #151517;
	background-image:
		linear-gradient(45deg, rgba(255, 255, 255, 0.09) 25%, transparent 25%),
		linear-gradient(-45deg, rgba(255, 255, 255, 0.09) 25%, transparent 25%),
		linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.09) 75%),
		linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.09) 75%);
	background-position: 0 0, 0 12px, 12px -12px, -12px 0;
	background-size: 24px 24px;
}

.app-tool-card__divider {
	position: absolute;
	inset: 0 auto 0 50%;
	z-index: 2;
	width: 1px;
	background: rgba(255, 255, 255, 0.16);
}

@media (max-width: 1180px) {
	.app-tools__switcher {
		margin-bottom: 34px;

		button {
			font-size: 22px;
		}

		small {
			font-size: 16px;
		}
	}

	.app-tools__grid {
		grid-template-columns: repeat(2, minmax(250px, 1fr));
		gap: 24px;
	}

	.app-tool-card {
		grid-template-rows: 250px 82px;
		border-radius: 24px;

		strong {
			font-size: 23px;
		}
	}
}

@media (max-width: 900px) {
	.app-tools__switcher {
		max-width: 100%;
		min-height: 68px;
		overflow-x: auto;
		border-radius: 18px;
		margin-bottom: 24px;
		padding: 6px;

		button {
			min-height: 52px;
			border-radius: 14px;
			padding: 0 18px;
			font-size: 17px;
		}

		small {
			font-size: 12px;
		}
	}

	.app-tools__tab-icon {
		width: 20px;
		height: 20px;
	}

	.app-tools__grid {
		grid-template-columns: 1fr;
	}
}

@media (max-width: 560px) {
	.app-tool-card {
		grid-template-rows: 210px 72px;
		border-radius: 20px;

		strong {
			font-size: 20px;
		}
	}
}
</style>
