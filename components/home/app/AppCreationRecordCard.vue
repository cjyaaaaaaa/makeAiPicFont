<template>
	<article class="creation-record-card">
		<header class="creation-record-card__header">
			<div class="creation-record-card__meta">
				<strong>{{ model }}</strong>
				<span>{{ typeLabel }}</span>
				<time>{{ time }}</time>
			</div>
			<div v-if="status === 'success'" class="creation-record-card__actions">
				<button
					v-if="showOpen"
					type="button"
					class="creation-record-card__icon-btn is-open"
					:aria-label="openLabel"
					@click="emit('open')"
				>
					<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
						<path d="M5.5 4.5H10L11.4 6H15A1.5 1.5 0 0 1 16.5 7.5V14A1.5 1.5 0 0 1 15 15.5H5A1.5 1.5 0 0 1 3.5 14V6A1.5 1.5 0 0 1 5 4.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
					</svg>
				</button>
				<button
					v-if="showDelete"
					type="button"
					class="creation-record-card__icon-btn is-delete"
					:aria-label="deleteLabel"
					:disabled="deleting"
					@click="emit('delete')"
				>
					<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
						<path d="M7.5 4.5H12.5M4.5 6.5H15.5M6 6.5L6.6 15A1.5 1.5 0 0 0 8.1 16.4H11.9A1.5 1.5 0 0 0 13.4 15L14 6.5M8.6 9V14M11.4 9V14" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" />
					</svg>
				</button>
			</div>
		</header>

		<AppOverflowTooltip :text="prompt" class="creation-record-card__prompt" />

		<div v-if="status === 'processing'" class="creation-record-card__processing">
			<div class="creation-record-card__processing-top">
				<strong>{{ processingLabel }}</strong>
				<span>{{ progressLabel }}</span>
			</div>
			<div class="creation-record-card__progress" aria-hidden="true">
				<span v-if="progress !== undefined" :style="{ width: `${progress}%` }"></span>
				<span v-else class="is-indeterminate"></span>
			</div>
			<small v-if="traceLabel">{{ traceLabel }}</small>
		</div>

		<div v-else-if="status === 'failed'" class="creation-record-card__failure">
			<strong>
				<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.6" />
					<path d="M10 5.8V10.5M10 14.2H10.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
				</svg>
				{{ failedTitle }}
			</strong>
			<AppOverflowTooltip :text="errorInfo || failedMessage" class="creation-record-card__failure-message" />
			<small>{{ refundedMessage }}</small>
			<div class="creation-record-card__failure-actions">
				<button type="button" @click="emit('retry')">
					<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
						<path d="M15.5 9.5A5.5 5.5 0 1 1 14 5.7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
						<path d="M14.4 3.2V6.3H11.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
					{{ retryLabel }}
				</button>
				<button
					type="button"
					class="is-danger"
					:aria-label="deleteLabel"
					:disabled="deleting"
					@click="emit('delete')"
				>
					<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
						<path d="M7.5 4.5H12.5M4.5 6.5H15.5M6 6.5L6.6 15A1.5 1.5 0 0 0 8.1 16.4H11.9A1.5 1.5 0 0 0 13.4 15L14 6.5M8.6 9V14M11.4 9V14" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" />
					</svg>
				</button>
			</div>
		</div>

		<button
			v-else-if="mediaType === 'image' && mediaSrc"
			type="button"
			class="creation-record-card__media"
			@click="emit('open')"
		>
			<NuxtImg :src="mediaSrc" :alt="prompt" />
		</button>

		<div v-else-if="mediaType === 'video' && mediaSrc" class="creation-record-card__media is-video">
			<video :src="mediaSrc" controls playsinline preload="metadata" />
		</div>
	</article>
</template>

<script setup lang="ts">
import AppOverflowTooltip from '~/components/home/app/AppOverflowTooltip.vue'

withDefaults(defineProps<{
	model: string
	typeLabel: string
	time: string
	prompt: string
	status: 'failed' | 'processing' | 'success'
	mediaSrc?: string
	mediaType?: 'image' | 'video'
	progress?: number
	processingLabel?: string
	progressLabel?: string
	traceLabel?: string
	failedTitle: string
	failedMessage: string
	errorInfo?: string
	refundedMessage: string
	retryLabel: string
	deleteLabel: string
	openLabel: string
	deleting?: boolean
	showOpen?: boolean
	showDelete?: boolean
}>(), {
	mediaSrc: '',
	mediaType: 'image',
	processingLabel: '',
	progressLabel: '',
	traceLabel: '',
	errorInfo: '',
	deleting: false,
	showOpen: true,
	showDelete: true,
})

const emit = defineEmits<{
	(event: 'open'): void
	(event: 'delete'): void
	(event: 'retry'): void
}>()
</script>

<style scoped lang="scss">
.creation-record-card {
	display: grid;
	align-content: start;
	gap: 12px;
	overflow: visible;
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 12px;
	background: #0a0a0b;
	padding: 14px;
	box-shadow: 0 16px 48px rgba(0, 0, 0, 0.24);
}

.creation-record-card__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	min-height: 24px;
}

.creation-record-card__meta {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 8px;
	color: rgba(255, 255, 255, 0.35);
	font-size: 11.5px;
	font-weight: 700;

	strong {
		color: rgba(255, 255, 255, 0.55);
		font-weight: 820;
	}

	span {
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.1);
		padding: 2px 6px;
		color: rgba(255, 255, 255, 0.45);
		font-size: 9.5px;
		font-weight: 900;
	}
}

.creation-record-card__actions {
	display: flex;
	align-items: center;
	gap: 6px;
	margin-left: auto;
}

.creation-record-card__icon-btn {
	display: grid;
	place-items: center;
	width: 24px;
	height: 24px;
	border: 0;
	border-radius: 999px;
	cursor: pointer;

	svg {
		width: 14px;
		height: 14px;
	}

	&.is-open {
		background: rgba(255, 214, 10, 0.1);
		color: #f6c400;
	}

	&.is-delete {
		background: rgba(239, 68, 68, 0.15);
		color: #ef4444;
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
}

.creation-record-card__prompt {
	min-height: 3rem;
	color: rgba(255, 255, 255, 0.5);
	font-size: 12px;
	font-weight: 600;
	line-height: 1.5;
}

.creation-record-card__processing {
	display: grid;
	gap: 10px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 10px;
	background: rgba(255, 255, 255, 0.045);
	padding: 12px;

	small {
		overflow: hidden;
		color: rgba(255, 255, 255, 0.35);
		font-size: 10.5px;
		font-weight: 600;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

.creation-record-card__processing-top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	color: rgba(255, 255, 255, 0.8);
	font-size: 12px;
	font-weight: 850;

	span {
		color: rgba(255, 255, 255, 0.5);
	}
}

.creation-record-card__progress {
	height: 8px;
	overflow: hidden;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.1);

	span {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: linear-gradient(90deg, #5b5b60, #f5f5f5);
		transition: width 500ms ease;
	}

	span.is-indeterminate {
		width: 33%;
		animation: creation-record-pulse 1.2s ease-in-out infinite;
	}
}

.creation-record-card__failure {
	border: 1px solid rgba(239, 68, 68, 0.35);
	border-radius: 10px;
	background: rgba(69, 10, 10, 0.2);
	padding: 12px;
	color: rgba(255, 255, 255, 0.5);

	strong {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: #ff5b5b;
		font-size: 11.5px;
		font-weight: 850;

		svg {
			width: 15px;
			height: 15px;
		}
	}

	small {
		display: block;
		margin-top: 8px;
		color: rgba(255, 255, 255, 0.3);
		font-size: 10.5px;
		font-weight: 600;
	}
}

.creation-record-card__failure-message {
	margin: 10px 0;
	font-size: 11.5px;
	font-weight: 600;
	line-height: 1.5;
}

.creation-record-card__failure-actions {
	display: grid;
	grid-template-columns: minmax(0, 1fr) 34px;
	gap: 8px;
	margin-top: 12px;

	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		height: 30px;
		border: 0;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.55);
		font-size: 11.5px;
		font-weight: 700;
		cursor: pointer;

		svg {
			width: 15px;
			height: 15px;
		}

		&.is-danger {
			background: rgba(239, 68, 68, 0.15);
			color: #ef4444;
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}
	}
}

.creation-record-card__media {
	display: block;
	width: 100%;
	overflow: hidden;
	border: 0;
	border-radius: 10px;
	background: #141414;
	padding: 0;
	box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
	cursor: pointer;
	transition: transform 150ms ease;

	&:hover {
		transform: translateY(-2px);
	}

	:deep(img),
	video {
		display: block;
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
		transition: transform 300ms ease;
	}

	&:hover :deep(img) {
		transform: scale(1.025);
	}

	&.is-video {
		cursor: default;

		&:hover {
			transform: none;
		}

		video {
			aspect-ratio: 16 / 9;
			object-fit: contain;
			background: #000;
		}
	}
}

@keyframes creation-record-pulse {
	0%,
	100% {
		opacity: 0.55;
	}

	50% {
		opacity: 1;
	}
}
</style>
