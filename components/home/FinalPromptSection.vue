<template>
	<section class="final-prompt">
		<div class="final-prompt__stars" aria-hidden="true"></div>
		<div class="final-prompt__inner">
			<header class="final-prompt__header">
				<h2>{{ t('home.finalPrompt.title') }}</h2>
				<p>{{ t('home.finalPrompt.desc') }}</p>
			</header>

			<div class="final-prompt__tags" :aria-label="t('home.finalPrompt.tagsLabel')">
				<span v-for="tag in tags" :key="tag">{{ tag }}</span>
			</div>

			<form class="final-prompt__form" @submit.prevent="submitPrompt">
				<input v-model="prompt" type="text" :placeholder="t('home.finalPrompt.placeholder')" :aria-label="t('home.finalPrompt.inputLabel')" />
				<button type="submit">
					<span aria-hidden="true">→</span>
					{{ t('home.finalPrompt.action') }}
				</button>
			</form>
		</div>
	</section>
</template>

<script setup lang="ts">
const { t } = useAppI18n()

const prompt = ref('')
const fallbackTags = ['4K resolution', 'AI models', 'Ready templates', 'Image editing', 'Fast generation', 'All scenes', 'Product images', 'Video generation', 'Free credits', 'Commercial use', 'No design experience']

const tags = computed(() => {
	const copy = t('home.finalPrompt.tags') as string[]
	return Array.isArray(copy) ? copy : fallbackTags
})

const submitPrompt = () => {
	prompt.value = prompt.value.trim()
}
</script>

<style scoped lang="scss">
.final-prompt {
	position: relative;
	overflow: hidden;
	padding: 150px 0 168px;
	color: #f8fafc;
}

.final-prompt::before {
	content: '';
	position: absolute;
	inset: 0;
	background:
		radial-gradient(circle at 50% 44%, rgba(239, 77, 44, 0.12), transparent 24%),
		radial-gradient(circle at 50% 64%, rgba(255, 255, 255, 0.08), transparent 30%);
	opacity: 0.85;
	pointer-events: none;
}

.final-prompt__stars {
	position: absolute;
	inset: 0;
	background-image:
		radial-gradient(circle, rgba(255, 255, 255, 0.3) 0 1px, transparent 1px),
		radial-gradient(circle, rgba(239, 77, 44, 0.28) 0 1px, transparent 1px);
	background-position: 0 0, 54px 72px;
	background-size: 148px 148px, 212px 212px;
	opacity: 0.22;
	pointer-events: none;
}

.final-prompt__inner {
	position: relative;
	z-index: 1;
	margin: 0 auto;
	max-width: 1720px;
	padding: 0 clamp(24px, 4vw, 72px);
	text-align: center;
}

.final-prompt__header {
	margin: 0 auto;
	max-width: 980px;

	h2 {
		margin: 0;
		color: #ffffff;
		font-size: clamp(58px, 6vw, 112px);
		font-weight: 900;
		line-height: 1;
		letter-spacing: 0;
	}

	p {
		max-width: 650px;
		margin: 34px auto 0;
		color: rgba(255, 255, 255, 0.6);
		font-size: 21px;
		font-weight: 650;
		line-height: 1.55;
	}
}

.final-prompt__tags {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 14px;
	margin: 82px auto 0;
	max-width: 640px;

	span {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		border: 1px solid rgba(255, 255, 255, 0.16);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
		padding: 0 22px;
		color: rgba(255, 255, 255, 0.68);
		font-size: 15px;
		font-weight: 800;
		transition: border-color 180ms ease, background 180ms ease, color 180ms ease, transform 180ms ease;

		&:hover {
			border-color: rgba(239, 77, 44, 0.44);
			background: rgba(239, 77, 44, 0.13);
			color: #ffffff;
			transform: translateY(-2px);
		}
	}
}

.final-prompt__form {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	align-items: center;
	gap: 12px;
	margin: 86px auto 0;
	max-width: 750px;
	min-height: 70px;
	border: 1px solid rgba(255, 255, 255, 0.18);
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.09);
	padding: 8px;
	box-shadow: 0 28px 90px rgba(0, 0, 0, 0.32);

	input {
		width: 100%;
		min-width: 0;
		border: 0;
		background: transparent;
		padding: 0 26px;
		color: #ffffff;
		font-size: 17px;
		font-weight: 650;
		outline: none;

		&::placeholder {
			color: rgba(255, 255, 255, 0.46);
		}
	}

	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		min-width: 166px;
		height: 54px;
		border: 0;
		border-radius: 999px;
		background: #ef4d2c;
		padding: 0 28px;
		color: #ffffff;
		font-size: 16px;
		font-weight: 900;
		cursor: pointer;
		transition: background 180ms ease, transform 180ms ease, box-shadow 180ms ease;

		&:hover {
			background: #ff6a45;
			box-shadow: 0 14px 34px rgba(239, 77, 44, 0.28);
			transform: translateY(-2px);
		}
	}
}

@media (max-width: 760px) {
	.final-prompt {
		padding: 96px 0 112px;
	}

	.final-prompt__inner {
		padding: 0 16px;
	}

	.final-prompt__header h2 {
		font-size: 48px;
	}

	.final-prompt__header p {
		margin-top: 22px;
		font-size: 17px;
	}

	.final-prompt__tags {
		gap: 10px;
		margin-top: 52px;

		span {
			min-height: 38px;
			padding: 0 16px;
			font-size: 13px;
		}
	}

	.final-prompt__form {
		grid-template-columns: 1fr;
		border-radius: 28px;
		margin-top: 58px;
		padding: 10px;

		input {
			height: 52px;
			padding: 0 16px;
			text-align: center;
		}

		button {
			width: 100%;
		}
	}
}
</style>
