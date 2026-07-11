<template>
	<span :class="['model-brand-icon', `is-${name}`, className]" aria-hidden="true">
		<svg v-if="name === 'openai'" class="model-brand-icon__svg" viewBox="0 0 24 24" fill="currentColor">
			<path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.182a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zm-9.022 12.608a4.476 4.476 0 0 1-2.876-1.041l.142-.08 4.778-2.758a.795.795 0 0 0 .393-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.495 4.494zM3.6 18.304a4.471 4.471 0 0 1-.535-3.014l.142.085 4.783 2.758a.771.771 0 0 0 .78 0l5.843-3.368v2.332a.08.08 0 0 1-.033.061L9.74 19.95a4.499 4.499 0 0 1-6.14-1.646zM2.341 7.896a4.485 4.485 0 0 1 2.365-1.973V11.6a.766.766 0 0 0 .389.676l5.814 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.787A4.504 4.504 0 0 1 2.34 7.872zm16.596 3.856-5.833-3.388L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.011-3.023-.142-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.499 4.499 0 0 1 6.68 4.66zM8.307 12.863l-2.02-1.164a.08.08 0 0 1-.038-.057V6.074a4.499 4.499 0 0 1 7.376-3.454l-.142.081L8.704 5.459a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
		</svg>
		<svg v-else-if="name === 'google'" class="model-brand-icon__svg" viewBox="0 0 24 24">
			<path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4c-.2 1.2-.9 2.2-2 2.9v2.4h3.2c1.9-1.7 3-4.2 3-7Z" />
			<path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.4c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.7-5.5-4.1H3.2v2.5C4.8 19.7 8.1 22 12 22Z" />
			<path fill="#FBBC05" d="M6.5 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.6H3.2C2.4 8.9 2 10.4 2 12s.4 3.1 1.2 4.4l3.3-2.5Z" />
			<path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.9 1.5l2.8-2.8C17 3 14.7 2 12 2 8.1 2 4.8 4.3 3.2 7.6l3.3 2.5C7.2 7.7 9.4 6 12 6Z" />
		</svg>
		<svg v-else-if="name === 'seedream' || name === 'seedance'" class="model-brand-icon__svg" viewBox="0 0 24 24" fill="none">
			<path d="M12 3.2 18.8 7.1V16.9L12 20.8 5.2 16.9V7.1L12 3.2Z" :stroke="`url(#${strokeId})`" stroke-width="1.5" stroke-linejoin="round" />
			<path d="M12 7.2 15.8 9.4V14.6L12 16.8 8.2 14.6V9.4L12 7.2Z" :fill="`url(#${fillId})`" />
			<path d="M8.2 9.4 12 11.5 15.8 9.4M12 11.5V16.8" stroke="rgba(255,255,255,0.55)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
			<defs>
				<linearGradient :id="strokeId" x1="5" y1="4" x2="19" y2="20" gradientUnits="userSpaceOnUse">
					<stop stop-color="#7DD3FC" />
					<stop offset="1" stop-color="#38BDF8" />
				</linearGradient>
				<linearGradient :id="fillId" x1="8" y1="7" x2="16" y2="17" gradientUnits="userSpaceOnUse">
					<stop stop-color="#67E8F9" />
					<stop offset="1" stop-color="#0EA5E9" />
				</linearGradient>
			</defs>
		</svg>
	</span>
</template>

<script setup lang="ts">
export type ModelBrandIconName = 'openai' | 'google' | 'seedream' | 'seedance'

withDefaults(defineProps<{
	name: ModelBrandIconName
	className?: string
}>(), {
	className: '',
})

const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const strokeId = `seed-stroke-${uid}`
const fillId = `seed-fill-${uid}`
</script>

<style scoped lang="scss">
.model-brand-icon {
	display: grid;
	place-items: center;
	width: 36px;
	height: 36px;
	border-radius: 10px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	background: #242426;
	color: rgba(255, 255, 255, 0.88);
	flex-shrink: 0;
}

.model-brand-icon.is-seedream,
.model-brand-icon.is-seedance {
	background: linear-gradient(135deg, #26262a, #1e293b);
}

.model-brand-icon.is-google {
	background: #242426;
}

.model-brand-icon__svg {
	width: 22px;
	height: 22px;
}

.model-brand-icon.is-compact {
	width: 22px;
	height: 22px;
	border-radius: 7px;
	border: 0;
	background: transparent;
}

.model-brand-icon.is-compact .model-brand-icon__svg {
	width: 16px;
	height: 16px;
}
</style>
