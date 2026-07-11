<template>
	<span
		:class="['app-overflow-tooltip', { 'is-overflowing': isOverflowing }]"
		:data-tooltip="displayText"
		:style="tooltipStyle"
		:tabindex="isOverflowing ? 0 : undefined"
	>
		<span ref="textRef" class="app-overflow-tooltip__text">{{ displayText }}</span>
	</span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
	text?: string | null
	lines?: number
}>(), {
	text: '',
	lines: 3,
})

const displayText = computed(() => props.text || '')
const tooltipStyle = computed(() => ({
	'--overflow-tooltip-lines': String(props.lines),
}))
const textRef = ref<HTMLElement | null>(null)
const isOverflowing = ref(false)
let resizeObserver: ResizeObserver | null = null

const measureOverflow = () => {
	const element = textRef.value
	if (!element) {
		isOverflowing.value = false
		return
	}
	isOverflowing.value = element.scrollHeight > element.clientHeight + 1 || element.scrollWidth > element.clientWidth + 1
}

const scheduleMeasure = async () => {
	await nextTick()
	if (import.meta.client) requestAnimationFrame(measureOverflow)
}

watch(() => [displayText.value, props.lines], () => {
	void scheduleMeasure()
})

onMounted(() => {
	measureOverflow()
	if ('ResizeObserver' in window && textRef.value) {
		resizeObserver = new ResizeObserver(measureOverflow)
		resizeObserver.observe(textRef.value)
	}
})

onBeforeUnmount(() => {
	resizeObserver?.disconnect()
	resizeObserver = null
})
</script>

<style scoped lang="scss">
.app-overflow-tooltip {
	position: relative;
	display: block;
	min-width: 0;
	max-width: 100%;
	overflow: visible;
	outline: none;

	&::before,
	&::after {
		position: absolute;
		left: 0;
		z-index: 80;
		opacity: 0;
		pointer-events: none;
		transition: opacity 140ms ease, transform 140ms ease;
	}

	&::before {
		content: "";
		top: calc(100% + 3px);
		width: 10px;
		height: 10px;
		margin-left: 18px;
		border-left: 1px solid rgba(255, 255, 255, 0.12);
		border-top: 1px solid rgba(255, 255, 255, 0.12);
		background: #18181a;
		transform: translateY(-4px) rotate(45deg);
	}

	&::after {
		content: attr(data-tooltip);
		top: calc(100% + 8px);
		width: max-content;
		max-width: min(420px, 100%);
		max-height: 240px;
		overflow: auto;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 10px;
		background: #18181a;
		box-shadow: 0 18px 48px rgba(0, 0, 0, 0.42);
		padding: 10px 12px;
		color: rgba(255, 255, 255, 0.84);
		font-size: 12px;
		font-weight: 650;
		line-height: 1.55;
		text-align: left;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		transform: translateY(-4px);
	}

	&.is-overflowing {
		cursor: help;
	}

	&.is-overflowing:hover::before,
	&.is-overflowing:hover::after,
	&.is-overflowing:focus-visible::before,
	&.is-overflowing:focus-visible::after {
		opacity: 1;
		transform: translateY(0);
	}
}

.app-overflow-tooltip__text {
	display: -webkit-box;
	overflow: hidden;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: var(--overflow-tooltip-lines);
	overflow-wrap: anywhere;
}
</style>
