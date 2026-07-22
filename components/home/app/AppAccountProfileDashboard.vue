<template>
	<div
		class="app-account"
		:class="{ 'is-sidebar-collapsed': sidebarCollapsed }"
	>
		<AppHomeSidebar
			:collapsed="sidebarCollapsed"
			@toggle-collapse="sidebarCollapsed = !sidebarCollapsed"
		/>

		<main class="app-account__main">
			<div class="app-account__shell">
				<aside class="app-account__aside" :aria-label="t('account.title')">
					<h1>{{ t('account.title') }}</h1>
					<nav class="app-account__nav">
						<NuxtLink
							v-for="item in navItems"
							:key="item.id"
							:to="item.to"
							class="app-account__nav-item"
							:class="{ 'is-active': item.active }"
						>
							<span class="app-account__nav-icon" v-html="item.icon" aria-hidden="true"></span>
							<span>{{ item.label }}</span>
						</NuxtLink>
					</nav>
				</aside>

				<section class="app-account__content" aria-labelledby="account-profile-title">
					<div class="app-account__panel">
						<h2 id="account-profile-title">{{ t('account.profile') }}</h2>

						<div class="app-account__fields">
							<div class="app-account__field">
								<label class="app-account__label">{{ t('account.avatar') }}</label>
								<div class="app-account__avatar-row">
									<span class="app-account__avatar">
										<img v-if="avatarPreview" :src="avatarPreview" alt="" />
										<span v-else>{{ avatarInitial }}</span>
									</span>
									<div class="app-account__avatar-actions">
										<button type="button" class="app-account__change" @click="triggerAvatarPick">
											{{ t('account.change') }}
										</button>
										<p>{{ t('account.avatarHint') }}</p>
									</div>
									<input
										ref="avatarInput"
										type="file"
										accept="image/png,image/jpeg,image/webp"
										class="sr-only"
										@change="onAvatarChange"
									/>
								</div>
							</div>

							<div class="app-account__field">
								<label class="app-account__label" for="account-username">{{ t('account.username') }}</label>
								<input
									id="account-username"
									v-model.trim="username"
									type="text"
									class="app-account__input"
									autocomplete="nickname"
									:placeholder="t('account.usernamePlaceholder')"
								/>
							</div>

							<div class="app-account__field">
								<label class="app-account__label" for="account-email">{{ t('account.email') }}</label>
								<input
									id="account-email"
									v-model.trim="email"
									type="email"
									class="app-account__input"
									autocomplete="email"
									:placeholder="t('account.emailPlaceholder')"
								/>
							</div>
						</div>

						<button type="button" class="app-account__save" :disabled="saving" @click="handleSave">
							{{ saving ? t('account.saving') : t('account.save') }}
						</button>
					</div>
				</section>
			</div>
		</main>

		<LoginModal :open="loginOpen" @close="loginOpen = false" />
	</div>
</template>

<script setup lang="ts">
import AppHomeSidebar from '~/components/home/app/AppHomeSidebar.vue'
import LoginModal from '~/components/auth/LoginModal.vue'

const { t } = useAppI18n()
const { user, token, initUser } = useUser()
const { showTipToast } = useTipToast()
const route = useRoute()

const sidebarCollapsed = ref(false)
const loginOpen = ref(false)
const saving = ref(false)
const username = ref('')
const email = ref('')
const avatarPreview = ref('')
const avatarFile = ref<File | null>(null)
const avatarInput = ref<HTMLInputElement | null>(null)
const accountPath = (name: 'profile' | 'billing' | 'subscription') => {
	const prefix = route.path.split('/').filter(Boolean)[0]
	return ['zh', 'de', 'es', 'ja'].includes(prefix)
		? `/${prefix}/account/${name}`
		: `/account/${name}`
}

const navItems = computed(() => [
	{
		id: 'profile',
		label: t('account.profile'),
		to: accountPath('profile'),
		active: true,
		icon: '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7.2" r="3.1" stroke="currentColor" stroke-width="1.5"/><path d="M4.8 16.2C5.6 13.4 7.5 12 10 12C12.5 12 14.4 13.4 15.2 16.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
	},
	{
		id: 'billing',
		label: t('account.billing'),
		to: accountPath('billing'),
		active: false,
		icon: '<svg viewBox="0 0 20 20" fill="none"><rect x="3.5" y="5.5" width="13" height="9" rx="1.6" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 8.5H16.5" stroke="currentColor" stroke-width="1.5"/></svg>',
	},
	{
		id: 'subscription',
		label: t('account.subscriptionCurrent'),
		to: accountPath('subscription'),
		active: false,
		icon: '<svg viewBox="0 0 20 20" fill="none"><path d="M10 2.8L11.5 7L15.7 8.5L11.5 10L10 14.2L8.5 10L4.3 8.5L8.5 7L10 2.8Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M15.5 13L16.2 15L18.2 15.7L16.2 16.4L15.5 18.4L14.8 16.4L12.8 15.7L14.8 15L15.5 13Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>',
	},
])

const avatarInitial = computed(() => {
	const name = username.value || user.value?.nickName || user.value?.userName || user.value?.email || ''
	return name.slice(0, 2) || 'U'
})

const syncFormFromUser = () => {
	username.value = user.value?.nickName || user.value?.userName || ''
	email.value = user.value?.email || ''
	if (!avatarFile.value) {
		avatarPreview.value = user.value?.avatar || ''
	}
}

const triggerAvatarPick = () => {
	avatarInput.value?.click()
}

const onAvatarChange = (event: Event) => {
	const input = event.target as HTMLInputElement
	const file = input.files?.[0]
	if (!file) return

	if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
		showTipToast({
			type: 'error',
			title: t('account.avatarInvalidTitle'),
			message: t('account.avatarHint'),
		})
		input.value = ''
		return
	}

	if (file.size > 2 * 1024 * 1024) {
		showTipToast({
			type: 'error',
			title: t('account.avatarInvalidTitle'),
			message: t('account.avatarTooLarge'),
		})
		input.value = ''
		return
	}

	avatarFile.value = file
	avatarPreview.value = URL.createObjectURL(file)
}

const handleSave = async () => {
	if (!token.value || !user.value) {
		loginOpen.value = true
		return
	}

	if (!username.value.trim()) {
		showTipToast({
			type: 'error',
			title: t('account.saveFailedTitle'),
			message: t('account.usernameRequired'),
		})
		return
	}

	saving.value = true
	try {
		user.value = {
			...user.value,
			nickName: username.value.trim(),
			email: email.value.trim() || user.value.email,
			avatar: avatarPreview.value || user.value.avatar,
		}
		showTipToast({
			type: 'success',
			title: t('account.saveSuccessTitle'),
			message: t('account.saveSuccessMessage'),
		})
	} finally {
		saving.value = false
	}
}

watch(
	() => user.value,
	() => syncFormFromUser(),
	{ immediate: true },
)

onMounted(async () => {
	await initUser()
	if (!token.value) {
		loginOpen.value = true
	}
	syncFormFromUser()
})

useHead({
	title: () => `${t('account.profile')} | ${t('common.siteName')}`,
})

watch(
	() => route.fullPath,
	() => {
		if (!token.value) loginOpen.value = true
	},
)
</script>

<style scoped lang="scss">
.app-account {
	display: grid;
	grid-template-columns: 288px minmax(0, 1fr);
	min-height: 100vh;
	background: #050505;
	color: #f5f5f5;
	transition: grid-template-columns 220ms ease;
}

.app-account.is-sidebar-collapsed {
	grid-template-columns: 84px minmax(0, 1fr);
}

.app-account__main {
	display: flex;
	justify-content: center;
	align-items: flex-start;
	min-width: 0;
	height: 100dvh;
	overflow-y: auto;
	padding: 48px 32px 56px;
	background: #050505;
}

.app-account__shell {
	display: grid;
	grid-template-columns: 168px minmax(0, 560px);
	gap: 28px;
	width: min(100%, 756px);
	align-items: start;
}

.app-account__aside {
	display: flex;
	flex-direction: column;
	gap: 20px;
	min-width: 0;
	padding-top: 4px;

	h1 {
		margin: 0;
		font-size: 28px;
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1.1;
	}
}

.app-account__nav {
	display: grid;
	gap: 6px;
}

.app-account__nav-item {
	display: flex;
	align-items: center;
	gap: 10px;
	min-height: 40px;
	padding: 0 12px;
	border-radius: 10px;
	color: rgba(255, 255, 255, 0.72);
	font-size: 14px;
	font-weight: 500;
	text-decoration: none;
	transition: background 160ms ease, color 160ms ease;

	&:hover {
		background: rgba(255, 255, 255, 0.05);
		color: #fff;
	}

	&.is-active {
		background: #2a2a2c;
		color: #fff;
	}
}

.app-account__nav-icon {
	display: grid;
	place-items: center;
	width: 16px;
	height: 16px;
	color: inherit;

	:deep(svg) {
		width: 16px;
		height: 16px;
	}
}

.app-account__content {
	min-width: 0;
}

.app-account__panel {
	width: 100%;
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 14px;
	background: #1a1a1c;
	padding: 20px 22px 22px;

	h2 {
		margin: 0 0 18px;
		padding-bottom: 14px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		font-size: 18px;
		font-weight: 700;
	}
}

.app-account__fields {
	display: grid;
	gap: 18px;
}

.app-account__field {
	margin: 0;
}

.app-account__label {
	display: block;
	margin-bottom: 8px;
	color: rgba(255, 255, 255, 0.4);
	font-size: 10px;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
}

.app-account__avatar-row {
	display: flex;
	align-items: center;
	gap: 14px;
}

.app-account__avatar {
	display: grid;
	place-items: center;
	width: 56px;
	height: 56px;
	overflow: hidden;
	border-radius: 999px;
	background: #ef4d2c;
	color: #fff;
	font-size: 18px;
	font-weight: 700;
	flex-shrink: 0;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
}

.app-account__avatar-actions {
	display: grid;
	gap: 6px;

	p {
		margin: 0;
		color: rgba(255, 255, 255, 0.38);
		font-size: 11px;
	}
}

.app-account__change {
	width: fit-content;
	border: 0;
	border-radius: 8px;
	background: #2f2f32;
	padding: 6px 12px;
	color: #fff;
	font-size: 12px;
	font-weight: 600;
	cursor: pointer;
	transition: background 160ms ease;

	&:hover {
		background: #3a3a3e;
	}
}

.app-account__input {
	width: 100%;
	min-height: 42px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 10px;
	background: #111113;
	padding: 0 12px;
	color: #fff;
	font-size: 14px;
	outline: none;
	transition: border-color 160ms ease;

	&:focus {
		border-color: rgba(255, 255, 255, 0.26);
	}

	&::placeholder {
		color: rgba(255, 255, 255, 0.32);
	}
}

.app-account__save {
	margin-top: 20px;
	min-height: 40px;
	border: 0;
	border-radius: 10px;
	background: #fff;
	padding: 0 18px;
	color: #111;
	font-size: 13px;
	font-weight: 700;
	cursor: pointer;
	transition: opacity 160ms ease, transform 160ms ease;

	&:hover:not(:disabled) {
		transform: translateY(-1px);
	}

	&:disabled {
		opacity: 0.6;
		cursor: wait;
	}
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}

@media (max-width: 1120px) {
	.app-account__main {
		height: auto;
		padding: 24px 16px 40px;
	}

	.app-account__shell {
		grid-template-columns: 1fr;
		gap: 18px;
		width: 100%;
	}

	.app-account__aside {
		h1 {
			font-size: 24px;
		}
	}

	.app-account__nav {
		grid-auto-flow: column;
		grid-auto-columns: max-content;
		overflow-x: auto;
	}

	.app-account__panel {
		padding: 18px 16px;
	}
}

@media (max-width: 900px) {
	.app-account {
		grid-template-columns: 1fr;
	}

	.app-account.is-sidebar-collapsed {
		grid-template-columns: 1fr;
	}
}
</style>
