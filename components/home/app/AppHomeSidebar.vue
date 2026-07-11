<template>
	<aside class="app-home-sidebar" :class="{ 'is-collapsed': collapsed }">
		<div class="app-home-sidebar__brand">
			<NuxtLink :to="localizedHomePath" :aria-label="siteName">
				<img src="/gptpix-logo.svg" :alt="siteName" />
				<span class="app-home-sidebar__label">{{ siteName }}</span>
			</NuxtLink>
			<button type="button" :aria-label="t('home.app.sidebar.collapse')" :aria-expanded="!collapsed" @click="emit('toggle-collapse')">
				<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<path d="M12.5 5L8 10L12.5 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
					<rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.4" />
				</svg>
			</button>
		</div>

		<nav class="app-home-sidebar__nav" :aria-label="t('home.app.sidebar.navigation')">
			<NuxtLink v-for="item in primaryItems" :key="item.label" :to="item.to" :class="{ 'is-active': item.active }" :title="collapsed ? item.label : undefined">
				<span class="app-home-sidebar__icon" v-html="item.icon"></span>
				<span class="app-home-sidebar__label">{{ item.label }}</span>
			</NuxtLink>
			<p class="app-home-sidebar__label">{{ t('home.app.sidebar.creation') }}</p>
			<NuxtLink v-for="item in creationItems" :key="item.label" :to="item.to" :class="{ 'is-active': item.active }" :title="collapsed ? item.label : undefined">
				<span class="app-home-sidebar__icon" v-html="item.icon"></span>
				<span class="app-home-sidebar__label">{{ item.label }}</span>
			</NuxtLink>
		</nav>

		<div v-if="!hideFooter" class="app-home-sidebar__footer">
			<button type="button" class="app-home-sidebar__upgrade" :title="collapsed ? t('home.app.sidebar.upgrade') : undefined">
				<span class="app-home-sidebar__icon" v-html="icons.upgrade"></span>
				<span class="app-home-sidebar__label">{{ t('home.app.sidebar.upgrade') }}</span>
			</button>
			<div class="app-home-sidebar__language">
				<button type="button" :title="collapsed ? currentLanguageName : undefined" @click="languageOpen = !languageOpen">
					<span class="app-home-sidebar__icon" v-html="icons.language"></span>
					<span class="app-home-sidebar__label">{{ currentLanguageName }}</span>
				</button>
				<div v-if="languageOpen" class="app-home-sidebar__languages">
					<button v-for="language in languages" :key="language.code" type="button" :class="{ 'is-active': locale === language.code }" @click="switchLanguage(language.code)">
						{{ language.name }}
					</button>
				</div>
			</div>
			<div class="app-home-sidebar__account">
				<button
					type="button"
					class="app-home-sidebar__user"
					:class="{ 'is-open': userMenuOpen, 'is-guest': !isLoggedIn }"
					:title="collapsed ? displayUserName : undefined"
					:aria-label="isLoggedIn ? displayUserName : t('auth.login')"
					:aria-expanded="isLoggedIn ? userMenuOpen : undefined"
					:aria-haspopup="isLoggedIn ? 'menu' : undefined"
					@click="toggleUserMenu"
				>
					<span class="app-home-sidebar__avatar" :class="{ 'is-login': !isLoggedIn }">
						<img v-if="isLoggedIn && user?.avatar" :src="user.avatar" alt="" />
						<span v-else-if="isLoggedIn">{{ userInitial }}</span>
						<span v-else class="app-home-sidebar__login-icon" v-html="icons.login" aria-hidden="true"></span>
					</span>
					<strong class="app-home-sidebar__label">{{ displayUserName }}</strong>
				</button>

				<Teleport to="body">
					<div
						v-if="isLoggedIn && userMenuOpen"
						class="app-home-sidebar__menu-backdrop"
						@click="userMenuOpen = false"
					></div>
					<div
						v-if="isLoggedIn && userMenuOpen"
						class="app-home-sidebar__account-menu"
						:class="{ 'is-collapsed-anchor': collapsed }"
					>
						<div class="app-home-sidebar__account-email">
							{{ user?.email || displayUserName }}
						</div>
						<div class="app-home-sidebar__account-divider"></div>
						<div class="app-home-sidebar__account-items">
							<div class="app-home-sidebar__account-item">
								<svg class="is-credits" viewBox="0 0 24 24" fill="none" aria-hidden="true">
									<circle cx="9" cy="9" r="4" stroke="currentColor" stroke-width="1.8" />
									<path d="M14.5 13.5C16.7 13.5 18.5 11.7 18.5 9.5M18.5 9.5L20.5 9.5M18.5 9.5V7.5M13 17.5C15.8 17.5 18 15.3 18 12.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
								</svg>
								<span>{{ accountCreditsLabel }}</span>
							</div>
							<button type="button" class="app-home-sidebar__account-item" @click="userMenuOpen = false">
								<svg class="is-settings" viewBox="0 0 24 24" fill="none" aria-hidden="true">
									<path d="M12 12.5A3.5 3.5 0 1 0 12 5.5A3.5 3.5 0 0 0 12 12.5Z" stroke="currentColor" stroke-width="1.8" />
									<path d="M6.5 20C7.2 17.3 9.2 15.8 12 15.8C14.8 15.8 16.8 17.3 17.5 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
								</svg>
								<span>{{ t('account.settings') }}</span>
							</button>
							<button type="button" class="app-home-sidebar__account-item" @click="userMenuOpen = false">
								<svg class="is-subscription" viewBox="0 0 24 24" fill="none" aria-hidden="true">
									<rect x="4.5" y="7" width="15" height="10" rx="1.6" stroke="currentColor" stroke-width="1.8" />
									<path d="M4.5 10H19.5" stroke="currentColor" stroke-width="1.8" />
								</svg>
								<span>{{ t('account.subscription') }}</span>
							</button>
						</div>
						<div class="app-home-sidebar__account-divider"></div>
						<button type="button" class="app-home-sidebar__account-item is-sign-out" @click="handleLogout">
							<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path d="M10 6H6.5C5.7 6 5 6.7 5 7.5V16.5C5 17.3 5.7 18 6.5 18H10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
								<path d="M14 8L18 12L14 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
								<path d="M18 12H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
							</svg>
							<span>{{ t('account.signOut') }}</span>
						</button>
					</div>
				</Teleport>
			</div>
		</div>

		<LoginModal :open="loginOpen" @close="loginOpen = false" />
	</aside>
</template>

<script setup lang="ts">
import LoginModal from '~/components/auth/LoginModal.vue'

const props = withDefaults(defineProps<{
	collapsed?: boolean
	hideFooter?: boolean
}>(), {
	collapsed: false,
	hideFooter: false,
})
const emit = defineEmits<{
	(event: 'toggle-collapse'): void
}>()
const collapsed = computed(() => props.collapsed)
const hideFooter = computed(() => props.hideFooter)

const { t, locale, setLocale } = useAppI18n()
const route = useRoute()
const { user, token, logout } = useUser()

const languages = [
	{ code: 'zh', name: '简体中文' },
	{ code: 'en', name: 'English' },
	{ code: 'de', name: 'Deutsch' },
	{ code: 'es', name: 'Español' },
	{ code: 'ja', name: '日本語' },
] as const
type LocaleCode = (typeof languages)[number]['code']

const icons = {
	home: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3.5 8.4L10 3L16.5 8.4V16A1.5 1.5 0 0 1 15 17.5H5A1.5 1.5 0 0 1 3.5 16V8.4Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 17.5V11.5H12V17.5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
	explore: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M12.5 7.5L11 11L7.5 12.5L9 9L12.5 7.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
	assets: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 6.5H8L9.5 8H17V15.5A1.5 1.5 0 0 1 15.5 17H4.5A1.5 1.5 0 0 1 3 15.5V6.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
	image: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3.5" y="4" width="13" height="12" rx="1.6" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 13.5L8 10.8L10 12.6L11.7 10.8L14.5 13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
	video: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="6.5" width="9.5" height="7" rx="1.4" stroke="currentColor" stroke-width="1.5"/><path d="M12.5 8.5L17 6.5V13.5L12.5 11.5V8.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
	tools: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 4H8V8H4V4ZM12 4H16V8H12V4ZM4 12H8V16H4V12ZM12 12H16V16H12V12Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
	upgrade: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 14.5C9.5 14 13.5 10 14 5.5C9.5 6 5.5 10 5 14.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 12L4 16M12 8L14.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
	language: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.4"/><path d="M3.2 10H16.8M10 3C12 5 13 7.3 13 10C13 12.7 12 15 10 17M10 3C8 5 7 7.3 7 10C7 12.7 8 15 10 17" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
	login: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="7.2" r="3.1" stroke="currentColor" stroke-width="1.5"/><path d="M4.8 16.2C5.6 13.4 7.5 12 10 12C12.5 12 14.4 13.4 15.2 16.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
}

const languageOpen = ref(false)
const userMenuOpen = ref(false)
const loginOpen = ref(false)
const siteName = computed(() => t('common.siteName'))
const localizedHomePath = computed(() => locale.value === 'en' ? '/home' : `/${locale.value}/home`)
const currentLanguageName = computed(() => languages.find(language => language.code === locale.value)?.name ?? 'English')
const isLoggedIn = computed(() => Boolean(token.value && user.value))
const displayUserName = computed(() => {
	if (!isLoggedIn.value) return t('auth.login')
	return user.value?.nickName || user.value?.userName || user.value?.email || t('home.app.sidebar.guestName')
})
const userInitial = computed(() => {
	const name = user.value?.nickName || user.value?.userName || user.value?.email || ''
	return name.slice(0, 1).toUpperCase() || 'U'
})
const userCredits = computed(() => user.value?.creditBalance ?? 0)
const accountCreditsLabel = computed(() => `${userCredits.value} credits`)
const normalizedRoutePath = computed(() => stripLocalePrefix(route.path))
const isActivePath = (path: string) => normalizedRoutePath.value === path

const primaryItems = computed(() => [
	{ label: t('nav.home'), to: localizedHomePath.value, icon: icons.home, active: isActivePath('/home') },
	{ label: t('nav.explore'), to: '/explore', icon: icons.explore, active: isActivePath('/explore') },
	{ label: t('nav.assets'), to: '/assets', icon: icons.assets, active: isActivePath('/assets') },
])
const creationItems = computed(() => [
	{ label: t('nav.aiImage'), to: '/ai-image-generator', icon: icons.image, active: isActivePath('/ai-image-generator') },
	{ label: t('nav.aiVideo'), to: '/ai-video-generator', icon: icons.video, active: isActivePath('/ai-video-generator') },
	{ label: t('home.app.sidebar.allTools'), to: '/tools', icon: icons.tools, active: isActivePath('/tools') },
])

const getPathLocale = (path: string) => {
	const firstSegment = path.split('/').filter(Boolean)[0]
	return languages.some(language => language.code === firstSegment) ? firstSegment as LocaleCode : null
}
const stripLocalePrefix = (path: string) => {
	const currentPathLocale = getPathLocale(path)
	if (!currentPathLocale) return path || '/'
	const stripped = path.replace(new RegExp(`^/${currentPathLocale}(?=/|$)`), '')
	return stripped || '/'
}
const buildLocalePath = (code: LocaleCode, fullPath: string) => {
	const [pathWithQuery, hash = ''] = fullPath.split('#')
	const [pathOnly, query = ''] = pathWithQuery.split('?')
	const strippedPath = stripLocalePrefix(pathOnly)
	const localizedPath = code === 'en' ? strippedPath : `/${code}${strippedPath === '/' ? '' : strippedPath}`
	return `${localizedPath}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`
}
const switchLanguage = async (code: LocaleCode) => {
	setLocale(code)
	languageOpen.value = false
	userMenuOpen.value = false
	await navigateTo(buildLocalePath(code, route.fullPath))
}
const toggleUserMenu = () => {
	languageOpen.value = false
	if (!isLoggedIn.value) {
		userMenuOpen.value = false
		loginOpen.value = true
		return
	}
	userMenuOpen.value = !userMenuOpen.value
}
const handleLogout = () => {
	logout()
	userMenuOpen.value = false
}

watch(isLoggedIn, (loggedIn) => {
	if (loggedIn) {
		loginOpen.value = false
	} else {
		userMenuOpen.value = false
	}
})

watch(() => props.collapsed, (collapsed) => {
	if (collapsed) {
		languageOpen.value = false
		userMenuOpen.value = false
	}
})
</script>

<style scoped lang="scss">
.app-home-sidebar {
	position: sticky;
	top: 0;
	display: grid;
	grid-template-rows: auto 1fr auto;
	width: 288px;
	height: 100vh;
	overflow: hidden;
	border-right: 1px solid rgba(255, 255, 255, 0.08);
	background: #191919;
	color: rgba(255, 255, 255, 0.72);
	transition: width 220ms ease;
}

.app-home-sidebar.is-collapsed {
	width: 84px;
}

.app-home-sidebar__brand {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	height: 60px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	padding: 0 20px;

	a {
		display: inline-flex;
		align-items: center;
		gap: 11px;
		min-width: 0;
		color: #f8f8f8;
		font-size: 16px;
		font-weight: 850;
		text-decoration: none;
		letter-spacing: 0;
	}

	img {
		width: 24px;
		height: 24px;
		border-radius: 6px;
	}

	button {
		display: grid;
		place-items: center;
		width: 24px;
		height: 24px;
		border: 0;
		background: transparent;
		color: rgba(255, 255, 255, 0.55);
		cursor: pointer;
		transition: color 160ms ease, transform 160ms ease;
	}

	button:hover {
		color: rgba(255, 255, 255, 0.85);
	}

	svg {
		width: 18px;
		height: 18px;
		transition: transform 180ms ease;
	}
}

.app-home-sidebar__nav {
	padding: 20px 12px;

	a {
		display: flex;
		align-items: center;
		gap: 13px;
		min-height: 42px;
		border-radius: 10px;
		padding: 0 15px;
		color: rgba(255, 255, 255, 0.66);
		font-size: 15px;
		font-weight: 800;
		text-decoration: none;
		transition: background 160ms ease, color 160ms ease;
	}

	a:hover,
	a.is-active {
		background: rgba(255, 255, 255, 0.08);
		color: #ffffff;
	}
}

.app-home-sidebar__icon {
	flex: 0 0 auto;
	display: grid;
	place-items: center;
	width: 18px;
	height: 18px;
}

.app-home-sidebar__label {
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	transition: opacity 160ms ease, transform 160ms ease;
}

.app-home-sidebar__nav {
	.app-home-sidebar__icon {
		display: grid;
		place-items: center;
		width: 18px;
		height: 18px;
	}

	:deep(svg) {
		width: 18px;
		height: 18px;
	}

	p {
		margin: 24px 8px 12px;
		color: rgba(255, 255, 255, 0.38);
		font-size: 12px;
		font-weight: 900;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
}

.app-home-sidebar.is-collapsed {
	.app-home-sidebar__brand {
		justify-content: space-between;
		padding: 0 12px;

		a {
			flex: 0 0 auto;
			gap: 0;
		}

		button svg {
			transform: rotate(180deg);
		}
	}

	.app-home-sidebar__label {
		width: 0;
		opacity: 0;
		pointer-events: none;
		transform: translateX(-6px);
	}

	.app-home-sidebar__nav {
		padding: 20px 12px;

		a {
			justify-content: center;
			gap: 0;
			padding: 0;
		}

		p {
			height: 1px;
			margin: 14px 0;
			overflow: hidden;
		}
	}
}

.app-home-sidebar__footer {
	display: grid;
	gap: 12px;
	border-top: 1px solid rgba(255, 255, 255, 0.06);
	padding: 16px 14px;
}

.app-home-sidebar__upgrade,
.app-home-sidebar__language button {
	display: flex;
	align-items: center;
	gap: 12px;
	width: 100%;
	border: 0;
	background: transparent;
	color: rgba(255, 255, 255, 0.68);
	font: inherit;
	font-size: 14px;
	font-weight: 800;
	cursor: pointer;
}

.app-home-sidebar__upgrade {
	justify-content: center;
	min-height: 44px;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.12);
	color: rgba(255, 255, 255, 0.82);
}

.app-home-sidebar__language {
	position: relative;

	button {
		min-height: 34px;
		padding: 0 10px;
	}

	:deep(svg) {
		width: 18px;
		height: 18px;
	}
}

.app-home-sidebar.is-collapsed {
	.app-home-sidebar__footer {
		padding: 14px 12px;
	}

	.app-home-sidebar__upgrade,
	.app-home-sidebar__language button {
		justify-content: center;
		gap: 0;
		width: 44px;
		margin: 0 auto;
		padding: 0;
	}

	.app-home-sidebar__upgrade {
		border-radius: 12px;
	}

	.app-home-sidebar__languages {
		left: calc(100% + 8px);
		right: auto;
		bottom: 0;
		width: 168px;
	}

	.app-home-sidebar__user {
		justify-content: center;
		gap: 0;
		width: 44px;
		margin: 0 auto;
		padding: 0;
	}
}

.app-home-sidebar__languages {
	position: absolute;
	left: 0;
	right: 0;
	bottom: calc(100% + 8px);
	z-index: 5;
	display: grid;
	gap: 4px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 12px;
	background: #101010;
	padding: 6px;
	box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);

	button {
		border-radius: 8px;
		color: rgba(255, 255, 255, 0.68);
	}

	button.is-active {
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
	}
}

.app-home-sidebar__account {
	position: relative;
}

.app-home-sidebar__user {
	display: flex;
	align-items: center;
	gap: 11px;
	width: 100%;
	min-height: 34px;
	border: 0;
	border-radius: 12px;
	background: transparent;
	padding: 0 10px;
	color: inherit;
	font: inherit;
	text-align: left;
	cursor: pointer;
	transition: background 160ms ease, color 160ms ease;

	&:hover,
	&.is-open {
		background: rgba(255, 255, 255, 0.08);
	}

	.app-home-sidebar__avatar {
		flex: 0 0 auto;
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		overflow: hidden;
		border-radius: 999px;
		background: #ef4d2c;
		color: #fff;
		font-size: 12px;
		font-weight: 900;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		&.is-login {
			border: 1px solid rgba(255, 255, 255, 0.16);
			background: rgba(255, 255, 255, 0.08);
			color: rgba(255, 255, 255, 0.82);
		}
	}

	.app-home-sidebar__login-icon {
		display: grid;
		place-items: center;
		width: 16px;
		height: 16px;

		:deep(svg) {
			width: 100%;
			height: 100%;
		}
	}

	&.is-guest {
		strong {
			color: rgba(255, 255, 255, 0.88);
		}

		&:hover .app-home-sidebar__avatar.is-login {
			border-color: rgba(255, 255, 255, 0.28);
			background: rgba(255, 255, 255, 0.14);
			color: #fff;
		}
	}

	strong {
		min-width: 0;
		overflow: hidden;
		color: rgba(255, 255, 255, 0.78);
		font-size: 14px;
		font-weight: 800;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

.app-home-sidebar__menu-backdrop {
	position: fixed;
	inset: 0;
	z-index: 75;
	background: transparent;
}

.app-home-sidebar__account-menu {
	position: fixed;
	left: 24px;
	bottom: 72px;
	z-index: 80;
	width: min(260px, calc(100vw - 48px));
	overflow: hidden;
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 14px;
	background: #050505;
	color: #ffffff;
	box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
}

.app-home-sidebar__account-menu.is-collapsed-anchor {
	left: 96px;
	width: min(250px, calc(100vw - 116px));
}

.app-home-sidebar__account-email {
	padding: 14px 18px 12px;
	overflow: hidden;
	color: rgba(255, 255, 255, 0.62);
	font-size: 13px;
	font-weight: 500;
	line-height: 1.25;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.app-home-sidebar__account-divider {
	height: 1px;
	background: rgba(255, 255, 255, 0.14);
}

.app-home-sidebar__account-items {
	padding: 5px 0;
}

.app-home-sidebar__account-item {
	display: flex;
	align-items: center;
	gap: 13px;
	width: 100%;
	min-height: 34px;
	border: 0;
	background: transparent;
	padding: 0 20px;
	color: #ffffff;
	font: inherit;
	font-size: 14px;
	font-weight: 500;
	text-align: left;
	cursor: default;

	svg {
		flex: 0 0 auto;
		width: 17px;
		height: 17px;
		color: rgba(255, 255, 255, 0.48);
	}

	.is-credits {
		color: #ffd400;
	}

	.is-settings {
		color: #267dff;
	}

	.is-subscription {
		color: #b331ff;
	}
}

button.app-home-sidebar__account-item {
	cursor: pointer;
	transition: background 160ms ease;

	&:hover {
		background: rgba(255, 255, 255, 0.07);
	}
}

.app-home-sidebar__account-item.is-sign-out {
	min-height: 40px;
	color: #ff5656;
}

@media (max-width: 900px) {
	.app-home-sidebar {
		position: relative;
		width: 100%;
		height: auto;
	}

	.app-home-sidebar.is-collapsed {
		width: 100%;

		.app-home-sidebar__brand {
			justify-content: space-between;
			padding: 0 20px;

			a {
				gap: 11px;
			}
		}

		.app-home-sidebar__label {
			width: auto;
			opacity: 1;
			pointer-events: auto;
			transform: none;
		}
	}

	.app-home-sidebar__nav {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
		padding: 12px;

		p {
			grid-column: 1 / -1;
			margin: 8px 4px 0;
		}
	}

	.app-home-sidebar.is-collapsed .app-home-sidebar__nav {
		a {
			justify-content: flex-start;
			gap: 13px;
			padding: 0 15px;
		}

		p {
			height: auto;
			margin: 8px 4px 0;
		}
	}

	.app-home-sidebar__footer {
		display: none;
	}

	.app-home-sidebar__account-menu,
	.app-home-sidebar__account-menu.is-collapsed-anchor {
		left: 16px;
		right: 16px;
		bottom: 16px;
		width: auto;
		min-width: 0;
	}

	.app-home-sidebar__account-email {
		padding: 22px 24px 20px;
		font-size: 18px;
	}

	.app-home-sidebar__account-item {
		min-height: 58px;
		gap: 20px;
		padding: 0 26px;
		font-size: 20px;
	}
}

@media (max-width: 560px) {
	.app-home-sidebar__nav {
		grid-template-columns: 1fr 1fr;
	}
}
</style>
