<template>
	<div class="app-account" :class="{ 'is-sidebar-collapsed': sidebarCollapsed }">
		<AppHomeSidebar :collapsed="sidebarCollapsed" @toggle-collapse="sidebarCollapsed = !sidebarCollapsed" />

		<main class="app-account__main">
			<div class="app-account__shell">
				<aside class="app-account__aside" :aria-label="t('account.title')">
					<h1>{{ t('account.title') }}</h1>
					<nav class="app-account__nav">
						<NuxtLink v-for="item in navItems" :key="item.id" :to="item.to" class="app-account__nav-item" :class="{ 'is-active': item.active }">
							<span class="app-account__nav-icon" v-html="item.icon" aria-hidden="true"></span><span>{{ item.label }}</span>
						</NuxtLink>
					</nav>
				</aside>

				<section class="app-account__content" aria-labelledby="account-subscription-title">
					<div class="subscription-panel" :aria-busy="loading">
						<header class="subscription-panel__header">
							<div><h2 id="account-subscription-title">{{ t('account.subscriptionPage.title') }}</h2><p>{{ t('account.subscriptionPage.subtitle') }}</p></div>
							<span v-if="subscription" class="subscription-status" :class="`is-${status.tone}`"><i aria-hidden="true"></i>{{ statusLabel(status.key) }}</span>
						</header>

						<div v-if="loading" class="subscription-loading" aria-live="polite"><span></span><span></span><span></span><p>{{ t('account.subscriptionPage.loading') }}</p></div>
						<div v-else-if="loadError" class="subscription-state" role="alert">
							<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.5V12.5M12 16.5V16.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
							<h3>{{ t('account.subscriptionPage.loadFailed') }}</h3><button type="button" @click="fetchSubscription">{{ t('account.subscriptionPage.retry') }}</button>
						</div>
						<div v-else-if="!subscription" class="subscription-state">
							<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3L13.7 8.3L19 10L13.7 11.7L12 17L10.3 11.7L5 10L10.3 8.3L12 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
							<h3>{{ t('account.subscriptionPage.emptyTitle') }}</h3><p>{{ t('account.subscriptionPage.emptyMessage') }}</p><NuxtLink :to="pricingPath">{{ t('account.subscriptionPage.viewPlans') }}</NuxtLink>
						</div>

						<template v-else>
							<article class="plan-card">
								<p class="plan-card__eyebrow">{{ t('account.subscriptionPage.planLabel') }}</p>
								<div class="plan-card__summary"><div><h3>{{ subscription.planName || '—' }}</h3><p>{{ t('account.subscriptionPage.creditsPerPeriod', { count: Number(subscription.creditAmountPerPeriod || 0).toLocaleString() }) }}</p></div><dl><dt>{{ t('account.subscriptionPage.provider') }}</dt><dd>{{ providerLabel }}</dd></dl></div>
								<div v-if="periodProgress !== null" class="period-progress">
									<div class="period-progress__dates"><span>{{ formatOrderDate(subscription.currentPeriodStart, locale) }}</span><span>{{ formatOrderDate(subscription.currentPeriodEnd, locale) }}</span></div>
									<div class="period-progress__track" role="progressbar" :aria-label="t('account.subscriptionPage.progressLabel')" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="periodProgress"><span :style="{ width: `${periodProgress}%` }"></span></div>
									<p v-if="remainingDays !== null">{{ t('account.subscriptionPage.remainingDays', { count: remainingDays }) }}</p>
								</div>
							</article>

							<dl class="subscription-details">
								<div>
									<dt>{{ t('account.subscriptionPage.createdAt') }}</dt>
									<dd>{{ formatOrderDate(subscription.createTime, locale) }}</dd>
								</div>
								<div v-if="subscription.cancelledAt">
									<dt>{{ t('account.subscriptionPage.cancelledAt') }}</dt>
									<dd>{{ formatOrderDate(subscription.cancelledAt, locale) }}</dd>
								</div>
								<div v-if="subscription.expiredAt">
									<dt>{{ t('account.subscriptionPage.expiredAt') }}</dt>
									<dd>{{ formatOrderDate(subscription.expiredAt, locale) }}</dd>
								</div>
							</dl>

							<footer class="subscription-actions"><p>{{ t('account.subscriptionPage.stripeNote') }}</p><button type="button" :disabled="portalLoading" :aria-busy="portalLoading" @click="openStripePortal">{{ portalLoading ? t('account.subscriptionPage.managing') : t('account.subscriptionPage.manage') }}<span aria-hidden="true">→</span></button></footer>
						</template>
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
import { createStripePortalSession, getCurrentSubscription, type CustomerUserSubscription } from '~/api/user'
import { isUnauthorizedError } from '~/composables/useUnauthorizedError'
import { formatOrderDate } from '~/utils/paymentOrders'
import { getPeriodProgress, getRemainingDays, getSafePortalUrl, getSubscriptionStatus } from '~/utils/userSubscription'

const { t, locale } = useAppI18n()
const { token, initUser } = useUser()
const { showTipToast } = useTipToast()
const route = useRoute()
const sidebarCollapsed = ref(false)
const loginOpen = ref(false)
const loading = ref(false)
const loadError = ref(false)
const portalLoading = ref(false)
const subscription = ref<CustomerUserSubscription | null>(null)
const mounted = ref(false)

const accountPath = (name: 'profile' | 'billing' | 'subscription') => {
	const prefix = route.path.split('/').filter(Boolean)[0]
	return ['zh','de','es','ja'].includes(prefix) ? `/${prefix}/account/${name}` : `/account/${name}`
}
const pricingPath = computed(() => {
	const prefix = route.path.split('/').filter(Boolean)[0]
	return ['zh','de','es','ja'].includes(prefix) ? `/${prefix}/pricing` : '/pricing'
})
const profileIcon = '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7.2" r="3.1" stroke="currentColor" stroke-width="1.5"/><path d="M4.8 16.2C5.6 13.4 7.5 12 10 12C12.5 12 14.4 13.4 15.2 16.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
const billingIcon = '<svg viewBox="0 0 20 20" fill="none"><rect x="3.5" y="5.5" width="13" height="9" rx="1.6" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 8.5H16.5" stroke="currentColor" stroke-width="1.5"/></svg>'
const subscriptionIcon = '<svg viewBox="0 0 20 20" fill="none"><path d="M10 2.8L11.5 7L15.7 8.5L11.5 10L10 14.2L8.5 10L4.3 8.5L8.5 7L10 2.8Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M15.5 13L16.2 15L18.2 15.7L16.2 16.4L15.5 18.4L14.8 16.4L12.8 15.7L14.8 15L15.5 13Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>'
const navItems = computed(() => [
	{ id:'profile',label:t('account.profile'),to:accountPath('profile'),active:false,icon:profileIcon },
	{ id:'billing',label:t('account.billing'),to:accountPath('billing'),active:false,icon:billingIcon },
	{ id:'subscription',label:t('account.subscriptionCurrent'),to:accountPath('subscription'),active:true,icon:subscriptionIcon },
])
const status = computed(() => getSubscriptionStatus(subscription.value?.status || ''))
const statusLabel = (key: string) => ({ active:t('account.subscriptionPage.statusActive'),cancelled:t('account.subscriptionPage.statusCancelled'),expired:t('account.subscriptionPage.statusExpired') } as Record<string,string>)[key] || key
const periodProgress = computed(() => getPeriodProgress(subscription.value?.currentPeriodStart, subscription.value?.currentPeriodEnd))
const remainingDays = computed(() => getRemainingDays(subscription.value?.currentPeriodEnd))
const providerLabel = computed(() => (subscription.value?.paymentProvider || '—').split('_').map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join(' '))

const fetchSubscription = async () => {
	if (!token.value || loading.value) return
	loading.value = true; loadError.value = false
	try { const response = await getCurrentSubscription(); subscription.value = response.data || null }
	catch (error) { loadError.value = true; if (isUnauthorizedError(error)) loginOpen.value = true }
	finally { loading.value = false }
}
const openStripePortal = async () => {
	if (portalLoading.value || !import.meta.client) return
	portalLoading.value = true
	try {
		const response = await createStripePortalSession()
		const portalUrl = getSafePortalUrl(response.data?.portalUrl)
		if (!portalUrl) { showTipToast({ type:'error',title:t('account.subscriptionPage.portalErrorTitle'),message:t('account.subscriptionPage.portalErrorMessage') }); return }
		window.location.assign(portalUrl)
	} catch (error) { if (isUnauthorizedError(error)) loginOpen.value = true }
	finally { portalLoading.value = false }
}
onMounted(async () => { mounted.value = true; await initUser(); if (!token.value) loginOpen.value = true; else await fetchSubscription() })
watch(token, async value => { if (!mounted.value || !value || loading.value || subscription.value) return; loginOpen.value = false; await fetchSubscription() })
useHead({ title: () => `${t('account.subscriptionPage.title')} | ${t('common.siteName')}` })
</script>

<style scoped lang="scss">
.app-account{display:grid;grid-template-columns:288px minmax(0,1fr);min-height:100vh;background:#050505;color:#f5f5f5;transition:grid-template-columns 220ms ease}.app-account.is-sidebar-collapsed{grid-template-columns:84px minmax(0,1fr)}.app-account__main{display:flex;justify-content:center;align-items:flex-start;min-width:0;height:100dvh;overflow-y:auto;padding:48px 32px 56px;background:#050505}.app-account__shell{display:grid;grid-template-columns:190px minmax(0,720px);gap:28px;width:min(100%,938px);align-items:start}.app-account__aside{display:flex;flex-direction:column;gap:20px;padding-top:4px}.app-account__aside h1{margin:0;font-size:28px;font-weight:700;letter-spacing:-.03em}.app-account__nav{display:grid;gap:6px}.app-account__nav-item{display:flex;align-items:center;gap:10px;min-height:40px;padding:0 12px;border-radius:10px;color:rgba(255,255,255,.72);font-size:14px;font-weight:500;text-decoration:none;transition:background 160ms ease,color 160ms ease}.app-account__nav-item:hover{background:rgba(255,255,255,.05);color:#fff}.app-account__nav-item.is-active{background:#2a2a2c;color:#fff}.app-account__nav-icon{display:grid;place-items:center;width:16px;height:16px;flex:none}.app-account__nav-icon :deep(svg){width:16px;height:16px}.app-account__content{min-width:0}.subscription-panel{min-height:520px;border:1px solid rgba(255,255,255,.09);border-radius:16px;padding:24px;background:#1a1a1c}.subscription-panel__header{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;padding-bottom:19px;border-bottom:1px solid rgba(255,255,255,.08)}.subscription-panel__header h2{margin:0;font-size:21px}.subscription-panel__header p{margin:7px 0 0;color:#7d7d82;font-size:12px}.subscription-status{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:7px 10px;font-size:10px;font-weight:800}.subscription-status i{width:6px;height:6px;border-radius:50%;background:currentColor}.subscription-status.is-active{color:#68d495;background:rgba(65,197,122,.12)}.subscription-status.is-cancelled{color:#f0d424;background:rgba(240,212,36,.11)}.subscription-status.is-expired{color:#ff7777;background:rgba(255,89,89,.1)}.subscription-status.is-neutral{color:#b1b1b5;background:rgba(255,255,255,.07)}
.plan-card{position:relative;overflow:hidden;margin-top:22px;border:1px solid rgba(240,212,36,.28);border-radius:18px;padding:24px;background:radial-gradient(circle at 90% 0,rgba(240,212,36,.13),transparent 42%),#141416}.plan-card__eyebrow{margin:0;color:#f0d424;font-size:9px;font-weight:850;letter-spacing:.16em;text-transform:uppercase}.plan-card__summary{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-top:10px}.plan-card__summary h3{margin:0;font-size:30px}.plan-card__summary div>p{margin:8px 0 0;color:#85858a;font-size:12px}.plan-card__summary dl{margin:0;text-align:right}.plan-card__summary dt{color:#777;font-size:9px}.plan-card__summary dd{margin:4px 0 0;font-size:12px;font-weight:750}.period-progress{margin-top:27px}.period-progress__dates{display:flex;justify-content:space-between;color:#838388;font-size:10px}.period-progress__track{height:7px;overflow:hidden;margin-top:9px;border-radius:99px;background:#303033}.period-progress__track span{display:block;height:100%;border-radius:inherit;background:#f0d424;box-shadow:0 0 16px rgba(240,212,36,.28);transition:width .5s ease}.period-progress>p{margin:9px 0 0;color:#a6a6aa;font-size:10px}.subscription-details{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:11px;margin:15px 0 0}.subscription-details>div{min-width:0;border:1px solid #2e2e31;border-radius:13px;padding:15px;background:#151517}.subscription-details dt{color:#777;font-size:9px}.subscription-details dd{margin:5px 0 0;font-size:12px;font-weight:700}.subscription-actions{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:23px;padding-top:20px;border-top:1px solid #2c2c2f}.subscription-actions p{max-width:360px;margin:0;color:#777;font-size:10px;line-height:1.55}.subscription-actions button{display:inline-flex;align-items:center;gap:8px;min-height:42px;border:0;border-radius:999px;padding:0 18px;color:#171717;background:#f0d424;font-size:11px;font-weight:850;cursor:pointer;white-space:nowrap}.subscription-actions button:hover:not(:disabled){background:#ffe43b}.subscription-actions button:disabled{opacity:.58;cursor:wait}
.subscription-state,.subscription-loading{display:grid;min-height:390px;place-items:center;align-content:center;text-align:center}.subscription-state svg{width:44px;margin-bottom:14px;color:#5d5d63}.subscription-state h3{margin:0;font-size:16px}.subscription-state p{max-width:330px;margin:9px 0 0;color:#777;font-size:11px;line-height:1.6}.subscription-state button,.subscription-state a{margin-top:17px;border:0;border-radius:999px;padding:11px 19px;color:#171717;background:#f0d424;font-size:11px;font-weight:800;text-decoration:none;cursor:pointer}.subscription-loading{grid-template-columns:repeat(3,80px);justify-content:center;gap:10px}.subscription-loading span{height:70px;border-radius:12px;background:linear-gradient(90deg,#1d1d1f 25%,#29292c 50%,#1d1d1f 75%);background-size:200%;animation:shimmer 1.3s infinite}.subscription-loading p{grid-column:1/-1;margin:5px 0;color:#777;font-size:11px}@keyframes shimmer{to{background-position:-200%}}
@media(max-width:1120px){.app-account__main{height:auto;padding:24px 16px 40px}.app-account__shell{grid-template-columns:1fr;gap:18px;width:100%}.app-account__nav{grid-auto-flow:column;grid-auto-columns:max-content;overflow-x:auto}.subscription-panel{padding:18px 16px}}@media(max-width:900px){.app-account,.app-account.is-sidebar-collapsed{grid-template-columns:1fr}}@media(max-width:560px){.subscription-panel__header,.plan-card__summary,.subscription-actions{align-items:flex-start;flex-direction:column}.plan-card__summary dl{text-align:left}.subscription-details{grid-template-columns:1fr}.subscription-actions button{width:100%;justify-content:center}.subscription-loading{grid-template-columns:repeat(3,1fr)}}@media(prefers-reduced-motion:reduce){.app-account,.app-account__nav-item,.period-progress__track span{transition:none}.subscription-loading span{animation:none}}
</style>
