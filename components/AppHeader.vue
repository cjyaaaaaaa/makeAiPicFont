<template>
	<header class="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#15161a]">
		<div class="mx-auto flex h-[64px] max-w-[1440px] items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
			<NuxtLink to="/" class="flex items-center gap-1 text-[#f8fafc]">
				<span class="text-[20px] font-semibold tracking-[-0.04em]">LUMINA</span>
				<span class="mt-[10px] h-[6px] w-[6px] rounded-full bg-[#ef4d2c]"></span>
			</NuxtLink>

			<nav class="hidden items-center gap-8 lg:flex" aria-label="Primary">
				<NuxtLink v-for="item in navItems" :key="item.link" :to="item.link" class="flex items-center gap-2 text-[14px] leading-5 text-[#a8b3c7] transition hover:text-[#f8fafc]">
					<span class="font-mono text-[12px] text-[#ef4d2c]">{{ item.index }}</span>
					<span>{{ item.label }}</span>
				</NuxtLink>
			</nav>

			<div class="flex items-center gap-2 md:gap-3">
				<button type="button" class="inline-flex h-8 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-[14px] font-medium text-[#f8fafc] transition hover:border-white/20 hover:bg-white/10" @click="openLang = true">
					<img class="h-4 w-4" :src="langIcon" alt="" aria-hidden="true" />
					<span class="hidden sm:inline">{{ currentLabel }}</span>
				</button>
				<button type="button" class="hidden h-8 items-center rounded-full bg-[#ef4d2c] px-3 text-[14px] font-medium text-white shadow-[0_10px_28px_rgba(239,77,44,0.24)] transition hover:bg-[#ff6a45] sm:inline-flex" @click="openLogin = true">{{ t('auth.login') ?? 'Login' }}</button>
			</div>
		</div>

		<div v-if="openLang" class="fixed inset-0 z-[70] bg-black/55 px-3 py-4 backdrop-blur-[2px] md:px-4" @click.self="openLang = false">
			<div class="ml-auto mt-0 w-full max-w-[340px] rounded-[24px] border border-white/10 bg-[#101622] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.42)] sm:w-[340px] sm:p-4">
				<div class="mb-3 flex items-center justify-between px-1">
					<h3 class="text-[18px] font-semibold text-[#f8fafc]">{{ t('common.language') }}</h3>
					<button type="button" class="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-[28px] leading-none text-[#a8b3c7] transition hover:bg-white/10 hover:text-white" @click="openLang = false">×</button>
				</div>
				<div class="grid gap-3">
					<button v-for="item in languages" :key="item.code" type="button" class="flex items-center justify-between rounded-[18px] border px-4 py-4 text-left transition duration-200" :class="locale === item.code ? 'border-[#ef4d2c] bg-[#2a1511] shadow-[0_8px_28px_rgba(239,77,44,0.16)]' : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'" @click="switchLanguage(item.code)">
						<span class="text-[18px] font-semibold text-[#f8fafc]">{{ item.name }}</span>
						<small class="text-[13px] font-medium tracking-[0.16em] text-[#7f8da5]">{{ item.code.toUpperCase() }}</small>
					</button>
				</div>
			</div>
		</div>

		<LoginModal :open="openLogin" @close="openLogin = false" @google="handleGoogleLogin" @email="handleEmailLogin" />
	</header>
</template>

<script setup lang="ts">
import LoginModal from '~/components/auth/LoginModal.vue'
import { thirdPartyLoginController } from '~/api/user/index'

const { t, locale, setLocale } = useI18n()
const { showTipToast } = useTipToast()
const { setToken, loadUser, initUser } = useUser()
const openLang = ref(false)
const openLogin = ref(false)
const langIcon = 'https://www.figma.com/api/mcp/asset/9c05c4e0-221b-4086-b844-b3abcd3e742e'

const navItems = computed(() => [
	{ index: '01', label: t('nav.workspace'), link: '/' },
	{ index: '02', label: t('nav.pricing'), link: '/product' },
	{ index: '03', label: t('nav.dashboard'), link: '/solution' },
])
const languages = [
	{ code: 'zh', name: '简体中文' },
	{ code: 'en', name: 'English' },
	{ code: 'de', name: 'Deutsch' },
	{ code: 'es', name: 'Español' },
	{ code: 'ja', name: '日本語' },
] as const
const currentLabel = computed(() => languages.find(item => item.code === locale.value)?.name ?? 'English')
const switchLanguage = (code: 'zh' | 'en' | 'de' | 'es' | 'ja') => { setLocale(code); openLang.value = false }
const resolveLoginToken = (response: unknown) => {
	if (typeof response === 'string') return response
	if (!response || typeof response !== 'object') return ''

	const payload = response as {
		data?: string | {
			token?: string
			accessToken?: string
			access_token?: string
		}
		token?: string
		accessToken?: string
		access_token?: string
	}

	if (typeof payload.data === 'string') return payload.data
	return payload.data?.token ?? payload.data?.accessToken ?? payload.data?.access_token ?? payload.token ?? payload.accessToken ?? payload.access_token ?? ''
}

const handleGoogleLogin = async (payload: { credential: string }) => {
	try {
		const loginResponse = await thirdPartyLoginController({
			provider: 'google',
			credential: payload.credential,
		})
		const token = resolveLoginToken(loginResponse)
		if (token) {
			setToken(token)
			await loadUser()
		}
		openLogin.value = false
		showTipToast({
			type: 'success',
			title: t('auth.loginSuccessTitle'),
			message: t('auth.loginSuccessMessage'),
		})
	} catch {
		showTipToast({
			type: 'error',
			title: t('auth.loginFailureTitle'),
			message: t('auth.loginFailureMessage'),
		})
	}
}

const handleEmailLogin = (payload: { email: string }) => {
	console.log('email login:', payload)
}

onMounted(() => {
	if (process.client) {
		void initUser()
	}
})
</script>
