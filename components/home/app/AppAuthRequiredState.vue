<template>
	<div class="app-auth-required" role="status">
		<div class="app-auth-required__art" aria-hidden="true">
			<span class="app-auth-required__glow"></span>
			<div class="app-auth-required__stack">
				<span class="app-auth-required__card is-back"></span>
				<span class="app-auth-required__card is-mid"></span>
				<span class="app-auth-required__card is-front">
					<span class="app-auth-required__shimmer"></span>
					<span class="app-auth-required__lock">
						<svg viewBox="0 0 24 24" fill="none">
							<rect x="5" y="10" width="14" height="11" rx="2.5" stroke="currentColor" stroke-width="1.7" />
							<path d="M8.5 10V7.5C8.5 5.01 10.01 3.5 12 3.5C13.99 3.5 15.5 5.01 15.5 7.5V10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
							<circle cx="12" cy="14.5" r="1.35" fill="currentColor" />
							<path d="M12 15.8V17.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
						</svg>
					</span>
				</span>
			</div>
		</div>

		<strong>{{ title }}</strong>
		<p>{{ message }}</p>
		<button type="button" @click="emit('login')">
			<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
				<circle cx="10" cy="7.2" r="3.1" stroke="currentColor" stroke-width="1.5" />
				<path d="M4.8 16.2C5.6 13.4 7.5 12 10 12C12.5 12 14.4 13.4 15.2 16.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
			</svg>
			{{ actionLabel }}
		</button>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	title: string
	message: string
	actionLabel: string
}>()

const emit = defineEmits<{
	(event: 'login'): void
}>()
</script>

<style scoped lang="scss">
.app-auth-required {
	display: grid;
	width: 100%;
	min-height: clamp(420px, 58vh, 680px);
	place-items: center;
	align-content: center;
	gap: 12px;
	border: 1px dashed rgba(255, 255, 255, 0.14);
	border-radius: 18px;
	background:
		radial-gradient(circle at 50% 28%, rgba(255, 255, 255, 0.08), transparent 36%),
		linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 48%),
		rgba(255, 255, 255, 0.02);
	padding: 48px 24px;
	text-align: center;

	strong {
		color: rgba(255, 255, 255, 0.9);
		font-size: 18px;
		font-weight: 850;
		line-height: 1.25;
	}

	p {
		max-width: 380px;
		margin: 0;
		color: rgba(255, 255, 255, 0.42);
		font-size: 13px;
		font-weight: 650;
		line-height: 1.65;
	}

	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 42px;
		margin-top: 6px;
		border: 0;
		border-radius: 999px;
		background: #fff;
		padding: 0 22px;
		color: #151515;
		font-size: 13.5px;
		font-weight: 850;
		cursor: pointer;
		transition: transform 160ms ease, background 160ms ease;

		svg {
			width: 16px;
			height: 16px;
		}
	}

	button:hover {
		background: rgba(255, 255, 255, 0.9);
		transform: translateY(-1px);
	}
}

.app-auth-required__art {
	position: relative;
	display: grid;
	place-items: center;
	width: 220px;
	height: 168px;
	margin-bottom: 8px;
}

.app-auth-required__glow {
	position: absolute;
	inset: 28% 18% 18%;
	border-radius: 999px;
	background: radial-gradient(circle, rgba(255, 255, 255, 0.16), transparent 70%);
	filter: blur(10px);
}

.app-auth-required__stack {
	position: relative;
	width: 148px;
	height: 128px;
}

.app-auth-required__card {
	position: absolute;
	left: 50%;
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 18px;
	background:
		linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 52%),
		#121214;
	box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
}

.app-auth-required__card.is-back {
	top: 8px;
	width: 104px;
	height: 92px;
	transform: translateX(-50%) rotate(-12deg);
	opacity: 0.45;
}

.app-auth-required__card.is-mid {
	top: 10px;
	width: 112px;
	height: 98px;
	transform: translateX(-50%) rotate(10deg);
	opacity: 0.62;
}

.app-auth-required__card.is-front {
	top: 18px;
	display: grid;
	place-items: center;
	width: 120px;
	height: 104px;
	transform: translateX(-50%);
	overflow: hidden;
}

.app-auth-required__shimmer {
	position: absolute;
	inset: 14px 14px auto;
	height: 46px;
	border-radius: 12px;
	background: linear-gradient(90deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.05));
}

.app-auth-required__lock {
	position: relative;
	z-index: 1;
	display: grid;
	place-items: center;
	width: 44px;
	height: 44px;
	margin-top: 18px;
	border-radius: 14px;
	background: rgba(255, 255, 255, 0.06);
	color: rgba(255, 255, 255, 0.78);
	box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);

	svg {
		width: 24px;
		height: 24px;
	}
}

@media (max-width: 720px) {
	.app-auth-required {
		min-height: 360px;
		padding: 36px 18px;

		strong {
			font-size: 16px;
		}
	}

	.app-auth-required__art {
		width: 180px;
		height: 140px;
	}
}
</style>
