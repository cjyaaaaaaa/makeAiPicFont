<template>
	<section class="audience-section">
		<div class="audience-section__inner">
			<header class="audience-section__header">
				<h2>{{ t('home.audience.title') }}</h2>
				<p>{{ t('home.audience.desc') }}</p>
			</header>

			<div class="audience-section__grid">
				<article v-for="item in items" :key="item.id" class="audience-card">
					<div class="audience-card__icon" :class="{ 'is-accent': item.accent }" aria-hidden="true">
						<svg v-if="item.icon === 'palette'" viewBox="0 0 24 24" fill="none">
							<path d="M12 3.5a8.5 8.5 0 0 0 0 17h1.2a1.9 1.9 0 0 0 1.32-3.26 1.2 1.2 0 0 1 .84-2.04H17a5.5 5.5 0 0 0 0-11H12Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
							<path d="M7.6 10.2h.01M9.6 7.4h.01M13 7h.01M6.8 13.4h.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
						</svg>
						<svg v-else-if="item.icon === 'camera'" viewBox="0 0 24 24" fill="none">
							<path d="M4.8 8.2h3l1.25-2.1h5.9l1.25 2.1h3a1.8 1.8 0 0 1 1.8 1.8v7.2a1.8 1.8 0 0 1-1.8 1.8H4.8A1.8 1.8 0 0 1 3 17.2V10a1.8 1.8 0 0 1 1.8-1.8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
							<circle cx="12" cy="13.4" r="3.2" stroke="currentColor" stroke-width="1.8" />
						</svg>
						<svg v-else-if="item.icon === 'briefcase'" viewBox="0 0 24 24" fill="none">
							<path d="M8.4 7V5.8A1.8 1.8 0 0 1 10.2 4h3.6a1.8 1.8 0 0 1 1.8 1.8V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
							<path d="M4.5 7h15A1.5 1.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-9A1.5 1.5 0 0 1 4.5 7Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
							<path d="M8 11v2M16 11v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
						</svg>
						<svg v-else-if="item.icon === 'cart'" viewBox="0 0 24 24" fill="none">
							<path d="M4 5h2.1l1.75 9.6a1.8 1.8 0 0 0 1.78 1.48h7.74a1.8 1.8 0 0 0 1.75-1.38L20.3 9H7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
							<circle cx="10" cy="20" r="1" fill="currentColor" />
							<circle cx="17" cy="20" r="1" fill="currentColor" />
						</svg>
						<svg v-else-if="item.icon === 'share'" viewBox="0 0 24 24" fill="none">
							<circle cx="18" cy="5.5" r="2.5" stroke="currentColor" stroke-width="1.8" />
							<circle cx="6" cy="12" r="2.5" stroke="currentColor" stroke-width="1.8" />
							<circle cx="18" cy="18.5" r="2.5" stroke="currentColor" stroke-width="1.8" />
							<path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
						</svg>
						<svg v-else viewBox="0 0 24 24" fill="none">
							<path d="M4.8 5.8A2.8 2.8 0 0 1 7.6 3H20v15H7.6a2.8 2.8 0 0 0-2.8 2.8v-15Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
							<path d="M4.8 5.8A2.8 2.8 0 0 1 7.6 3H20M8 7h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
						</svg>
					</div>
					<h3>{{ item.title }}</h3>
					<p>{{ item.desc }}</p>
				</article>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
const { t } = useI18n()

type AudienceItem = {
	id: string
	icon: 'palette' | 'camera' | 'briefcase' | 'cart' | 'share' | 'book'
	title: string
	desc: string
	accent?: boolean
}

const fallbackItems: AudienceItem[] = [
	{ id: 'creators', icon: 'palette', title: 'For creators', desc: 'Turn ideas directly into visual work without design experience.', accent: true },
	{ id: 'designers', icon: 'camera', title: 'For designers', desc: 'Quickly generate moodboards, UI assets, and brand materials without leaving your workflow.' },
	{ id: 'marketing', icon: 'briefcase', title: 'For marketing teams', desc: 'Create ad visuals and campaign assets in seconds.' },
	{ id: 'commerce', icon: 'cart', title: 'For ecommerce', desc: 'Produce professional product images without a photoshoot, saving time and cost.' },
	{ id: 'social', icon: 'share', title: 'For social content', desc: 'Create eye-catching, easy-to-share content for any platform.' },
	{ id: 'storytelling', icon: 'book', title: 'For storytelling', desc: 'Rapidly build characters and scenes for your next story or project.' },
]

const items = computed(() => {
	const copy = t('home.audience.items') as AudienceItem[]
	return Array.isArray(copy) ? copy : fallbackItems
})
</script>

<style scoped lang="scss">
.audience-section {
	background: #15161a;
	padding: 96px 0 132px;
	color: #f8fafc;
}

.audience-section__inner {
	margin: 0 auto;
	max-width: 1720px;
	padding: 0 clamp(24px, 4vw, 72px);
}

.audience-section__header {
	max-width: 620px;

	h2 {
		margin: 0;
		color: #ffffff;
		font-size: clamp(54px, 5vw, 86px);
		font-weight: 850;
		line-height: 0.98;
		letter-spacing: 0;
	}

	p {
		margin: 22px 0 0;
		color: rgba(255, 255, 255, 0.58);
		font-size: 20px;
		font-weight: 650;
		line-height: 1.5;
	}
}

.audience-section__grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 32px;
	margin-top: 94px;
}

.audience-card {
	min-height: 210px;
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 14px;
	background: rgba(0, 0, 0, 0.16);
	padding: 34px 34px 30px;
	transition: border-color 220ms ease, background 220ms ease, box-shadow 220ms ease, transform 220ms ease;

	&:hover {
		border-color: rgba(239, 77, 44, 0.36);
		background: rgba(0, 0, 0, 0.22);
		box-shadow: 0 24px 54px rgba(0, 0, 0, 0.28);
		transform: translateY(-6px);
	}

	h3 {
		margin: 30px 0 0;
		color: #ffffff;
		font-size: 24px;
		font-weight: 850;
		letter-spacing: 0;
	}

	p {
		max-width: 460px;
		margin: 18px 0 0;
		color: rgba(255, 255, 255, 0.58);
		font-size: 17px;
		font-weight: 650;
		line-height: 1.58;
	}
}

.audience-card__icon {
	display: grid;
	place-items: center;
	width: 54px;
	height: 54px;
	border-radius: 15px;
	background: rgba(255, 255, 255, 0.06);
	color: #ffffff;

	&.is-accent {
		background: rgba(239, 77, 44, 0.1);
		color: #ef4d2c;
	}

	svg {
		width: 27px;
		height: 27px;
	}
}

@media (max-width: 1120px) {
	.audience-section__grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 760px) {
	.audience-section {
		padding: 72px 0 92px;
	}

	.audience-section__inner {
		padding: 0 16px;
	}

	.audience-section__header h2 {
		font-size: 46px;
	}

	.audience-section__header p {
		font-size: 17px;
	}

	.audience-section__grid {
		grid-template-columns: 1fr;
		gap: 18px;
		margin-top: 52px;
	}

	.audience-card {
		min-height: 190px;
		padding: 28px 24px;
	}
}
</style>
