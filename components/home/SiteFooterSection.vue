<template>
	<footer class="site-footer">
		<div class="site-footer__inner">
			<div class="site-footer__top">
				<section class="site-footer__brand" :aria-label="t('home.footer.brandName')">
					<h2>{{ t('home.footer.brandName') }}</h2>
					<p>{{ t('home.footer.desc') }}</p>
				</section>

				<nav v-for="group in linkGroups" :key="group.title" class="site-footer__nav" :aria-label="group.title">
					<h3>{{ group.title }}</h3>
					<NuxtLink v-for="link in group.links" :key="link.label" :to="link.to">{{ link.label }}</NuxtLink>
				</nav>
			</div>

			<div class="site-footer__languages" :aria-label="t('home.footer.languageLabel')">
				<button v-for="language in languages" :key="language.code" type="button" :class="{ 'is-active': locale === language.code }" @click="setLocale(language.code)">
					{{ language.label }}
				</button>
			</div>

			<div class="site-footer__bottom">
				<p>{{ t('home.footer.copyright', { year }) }}</p>
				<span>{{ t('home.footer.slogan') }}</span>
			</div>
		</div>
	</footer>
</template>

<script setup lang="ts">
type LocaleCode = 'zh' | 'en' | 'de' | 'es' | 'ja'

const { t, locale, setLocale } = useI18n()
const year = new Date().getFullYear()

const languages: Array<{ code: LocaleCode; label: string }> = [
	{ code: 'en', label: 'English' },
	{ code: 'de', label: 'Deutsch' },
	{ code: 'es', label: 'Español' },
	{ code: 'ja', label: '日本語' },
	{ code: 'zh', label: '中文' },
]

const linkGroups = computed(() => [
	{
		title: t('home.footer.companyTitle'),
		links: [
			{ label: t('home.footer.contact'), to: '/contact' },
		],
	},
	{
		title: t('home.footer.productsTitle'),
		links: [
			{ label: t('home.footer.home'), to: '/' },
			{ label: t('home.footer.pricing'), to: '/pricing' },
		],
	},
	{
		title: t('home.footer.resourcesTitle'),
		links: [
			{ label: t('home.footer.terms'), to: '/terms' },
			{ label: t('home.footer.privacy'), to: '/privacy' },
			{ label: t('home.footer.refund'), to: '/refund' },
		],
	},
])
</script>

<style scoped lang="scss">
.site-footer {
	background: #10110f;
	color: #f8fafc;
	padding: 58px 0 46px;
}

.site-footer__inner {
	margin: 0 auto;
	max-width: 1720px;
	padding: 0 clamp(24px, 4vw, 72px);
}

.site-footer__top {
	display: grid;
	grid-template-columns: minmax(260px, 1.4fr) repeat(3, minmax(160px, 0.7fr));
	gap: 70px;
	padding-bottom: 74px;
}

.site-footer__brand {
	max-width: 360px;

	h2 {
		margin: 0;
		color: #ffffff;
		font-size: 28px;
		font-weight: 900;
		letter-spacing: 0;
	}

	p {
		margin: 34px 0 0;
		color: rgba(255, 255, 255, 0.44);
		font-size: 17px;
		font-weight: 650;
		line-height: 1.62;
	}
}

.site-footer__nav {
	display: grid;
	align-content: start;
	gap: 28px;

	h3 {
		margin: 0 0 12px;
		color: #ffffff;
		font-size: 20px;
		font-weight: 850;
		letter-spacing: 0;
	}

	a {
		width: fit-content;
		color: rgba(255, 255, 255, 0.44);
		font-size: 16px;
		font-weight: 650;
		text-decoration: none;
		transition: color 180ms ease, transform 180ms ease;

		&:hover {
			color: #ef4d2c;
			transform: translateX(2px);
		}
	}
}

.site-footer__languages {
	display: flex;
	flex-wrap: wrap;
	gap: 18px;
	border-top: 1px solid rgba(255, 255, 255, 0.08);
	padding: 38px 0 76px;

	button {
		border: 0;
		background: transparent;
		padding: 0;
		color: rgba(255, 255, 255, 0.46);
		font-size: 16px;
		font-weight: 700;
		cursor: pointer;
		transition: color 180ms ease;

		&:hover,
		&.is-active {
			color: #ffffff;
		}
	}
}

.site-footer__bottom {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 28px;
	border-top: 1px solid rgba(255, 255, 255, 0.08);
	padding-top: 38px;
	color: rgba(255, 255, 255, 0.46);
	font-size: 16px;
	font-weight: 650;

	p {
		margin: 0;
	}
}

@media (max-width: 1024px) {
	.site-footer__top {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 48px;
	}
}

@media (max-width: 760px) {
	.site-footer {
		padding: 46px 0 36px;
	}

	.site-footer__inner {
		padding: 0 16px;
	}

	.site-footer__top {
		grid-template-columns: 1fr;
		gap: 40px;
		padding-bottom: 48px;
	}

	.site-footer__brand p {
		margin-top: 22px;
	}

	.site-footer__languages {
		gap: 14px;
		padding: 30px 0 48px;
	}

	.site-footer__bottom {
		align-items: flex-start;
		flex-direction: column;
		padding-top: 30px;
	}
}
</style>
