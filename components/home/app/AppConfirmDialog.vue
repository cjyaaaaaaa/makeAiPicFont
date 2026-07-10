<template>
	<Teleport to="body">
		<Transition name="app-confirm">
			<div v-if="open" class="app-confirm-dialog" role="presentation" @click.self="emit('cancel')">
				<section class="app-confirm-dialog__panel" role="dialog" aria-modal="true" :aria-labelledby="titleId">
					<div class="app-confirm-dialog__icon" aria-hidden="true">
						<svg viewBox="0 0 20 20" fill="none">
							<path d="M7.5 4.5H12.5M4.5 6.5H15.5M6 6.5L6.6 15A1.5 1.5 0 0 0 8.1 16.4H11.9A1.5 1.5 0 0 0 13.4 15L14 6.5M8.6 9V14M11.4 9V14" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" />
						</svg>
					</div>
					<div class="app-confirm-dialog__content">
						<h2 :id="titleId">{{ title }}</h2>
						<p>{{ message }}</p>
					</div>
					<div class="app-confirm-dialog__actions">
						<button type="button" class="app-confirm-dialog__cancel" :disabled="loading" @click="emit('cancel')">
							{{ cancelLabel }}
						</button>
						<button type="button" class="app-confirm-dialog__confirm" :disabled="loading" @click="emit('confirm')">
							{{ loading ? loadingLabel : confirmLabel }}
						</button>
					</div>
				</section>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
defineProps<{
	open: boolean
	title: string
	message: string
	confirmLabel: string
	cancelLabel: string
	loadingLabel: string
	loading?: boolean
}>()

const emit = defineEmits<{
	cancel: []
	confirm: []
}>()

const titleId = 'app-confirm-dialog-title'
</script>

<style scoped lang="scss">
.app-confirm-enter-active,
.app-confirm-leave-active {
	transition: opacity 160ms ease;
}

.app-confirm-enter-from,
.app-confirm-leave-to {
	opacity: 0;
}

.app-confirm-dialog {
	position: fixed;
	inset: 0;
	z-index: 1000;
	display: grid;
	place-items: center;
	background: rgba(0, 0, 0, 0.68);
	padding: 20px;
}

.app-confirm-dialog__panel {
	display: grid;
	grid-template-columns: 38px minmax(0, 1fr);
	column-gap: 14px;
	row-gap: 14px;
	width: min(360px, 100%);
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 16px;
	background: #111113;
	box-shadow: 0 20px 64px rgba(0, 0, 0, 0.56);
	padding: 18px;
	color: #f5f5f5;
}

.app-confirm-dialog__icon {
	display: grid;
	place-items: center;
	width: 38px;
	height: 38px;
	border-radius: 12px;
	background: rgba(239, 68, 68, 0.15);
	color: #ff5b5b;

	svg {
		width: 19px;
		height: 19px;
	}
}

.app-confirm-dialog__content {
	min-width: 0;

	h2 {
		margin: 0;
		font-size: 15px;
		font-weight: 850;
		line-height: 1.25;
		letter-spacing: 0;
	}

	p {
		margin: 6px 0 0;
		color: rgba(255, 255, 255, 0.58);
		font-size: 12px;
		font-weight: 650;
		line-height: 1.45;
	}
}

.app-confirm-dialog__actions {
	grid-column: 1 / -1;
	display: flex;
	justify-content: flex-end;
	gap: 8px;
	margin-top: 2px;

	button {
		min-width: 78px;
		height: 34px;
		border: 0;
		border-radius: 9px;
		padding: 0 14px;
		font: inherit;
		font-size: 12.5px;
		font-weight: 850;
		cursor: pointer;
		transition:
			background 160ms ease,
			color 160ms ease,
			opacity 160ms ease;
	}

	button:disabled {
		cursor: not-allowed;
		opacity: 0.68;
	}
}

.app-confirm-dialog__cancel {
	background: rgba(255, 255, 255, 0.08);
	color: rgba(255, 255, 255, 0.78);

	&:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.13);
	}
}

.app-confirm-dialog__confirm {
	background: #ef4444;
	color: #fff;

	&:hover:not(:disabled) {
		background: #dc2626;
	}
}

@media (max-width: 420px) {
	.app-confirm-dialog {
		padding: 16px;
	}

	.app-confirm-dialog__panel {
		width: 100%;
	}

	.app-confirm-dialog__actions button {
		flex: 1 1 0;
		min-width: 0;
	}
}
</style>
