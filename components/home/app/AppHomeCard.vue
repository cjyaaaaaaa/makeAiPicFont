<template>
	<article class="app-home-card" :class="[`is-${size}`, { 'has-placeholder': !image }]">
		<NuxtImg v-if="image" :src="image" :alt="title" />
		<div v-else class="app-home-card__placeholder">
			<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<rect x="5" y="7" width="10" height="10" rx="1.6" stroke="currentColor" stroke-width="1.6" />
				<path d="M15 10.2L19 8.2V15.8L15 13.8V10.2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
			</svg>
		</div>
		<div v-if="badge" class="app-home-card__badge">{{ badge }}</div>
		<div v-if="play" class="app-home-card__play" aria-hidden="true">
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path d="M9 7.5v9l7-4.5-7-4.5Z" />
			</svg>
		</div>
		<div v-if="arrow" class="app-home-card__arrow" aria-hidden="true">→</div>
		<div class="app-home-card__copy">
			<p v-if="eyebrow">{{ eyebrow }}</p>
			<h3>{{ title }}</h3>
			<span v-if="meta">{{ meta }}</span>
		</div>
	</article>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
	title: string
	meta?: string
	eyebrow?: string
	badge?: string
	image?: string
	size?: 'model' | 'wide' | 'template' | 'history'
	play?: boolean
	arrow?: boolean
}>(), {
	meta: '',
	eyebrow: '',
	badge: '',
	image: '',
	size: 'wide',
	play: false,
	arrow: false,
})
</script>

<style scoped lang="scss">
.app-home-card {
	position: relative;
	min-height: 180px;
	overflow: hidden;
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 10px;
	background: #191919;
	color: #f7f7f7;
	isolation: isolate;

	&::after {
		content: "";
		position: absolute;
		inset: 0;
		z-index: 1;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0) 42%, rgba(0, 0, 0, 0.78) 100%);
		pointer-events: none;
	}

	img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 360ms ease, filter 360ms ease;
	}

	&:hover img {
		transform: scale(1.035);
		filter: saturate(1.05) contrast(1.04);
	}
}

.app-home-card.is-model {
	aspect-ratio: 16 / 9;
	min-height: 0;
}

.app-home-card.is-wide {
	aspect-ratio: 16 / 9;
	min-height: 0;
}

.app-home-card.is-template {
	aspect-ratio: 3 / 4;
	min-height: 0;
}

.app-home-card.is-history {
	aspect-ratio: 1.12 / 1;
	min-height: 0;
	background: #151515;
}

.app-home-card.has-placeholder::before {
	content: "";
	position: absolute;
	inset: 0;
	background: linear-gradient(150deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.015));
}

.app-home-card__placeholder {
	position: absolute;
	inset: 0;
	display: grid;
	place-items: center;
	color: rgba(255, 255, 255, 0.26);

	svg {
		width: 24px;
		height: 24px;
	}
}

.app-home-card__badge {
	position: absolute;
	top: 12px;
	left: 12px;
	z-index: 2;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.18);
	padding: 4px 10px;
	color: rgba(255, 255, 255, 0.78);
	font-size: 10px;
	font-weight: 800;
	letter-spacing: 0.04em;
	text-transform: uppercase;
}

.app-home-card__play {
	position: absolute;
	inset: 0;
	z-index: 2;
	display: grid;
	place-items: center;
	color: rgba(255, 255, 255, 0.86);

	svg {
		width: 46px;
		height: 46px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.26);
		padding: 12px;
		backdrop-filter: blur(8px);
	}
}

.app-home-card__arrow {
	position: absolute;
	right: 16px;
	bottom: 18px;
	z-index: 3;
	display: grid;
	place-items: center;
	width: 34px;
	height: 34px;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.13);
	color: #ffffff;
	font-size: 18px;
}

.app-home-card__copy {
	position: absolute;
	left: 16px;
	right: 16px;
	bottom: 13px;
	z-index: 2;
	display: grid;
	gap: 3px;
	text-align: left;

	p,
	span,
	h3 {
		margin: 0;
		letter-spacing: 0;
	}

	p,
	span {
		color: rgba(255, 255, 255, 0.45);
		font-size: 11px;
		font-weight: 750;
		text-transform: uppercase;
	}

	h3 {
		color: rgba(255, 255, 255, 0.9);
		font-size: 16px;
		font-weight: 800;
		line-height: 1.2;
	}
}

@media (max-width: 760px) {
	.app-home-card.is-template,
	.app-home-card.is-history {
		aspect-ratio: 16 / 10;
	}
}
</style>
