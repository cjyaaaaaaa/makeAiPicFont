<template>
	<div class="app-account" :class="{ 'is-sidebar-collapsed': sidebarCollapsed }">
		<AppHomeSidebar :collapsed="sidebarCollapsed" @toggle-collapse="sidebarCollapsed = !sidebarCollapsed" />

		<main class="app-account__main">
			<div class="app-account__shell">
				<aside class="app-account__aside" :aria-label="t('account.title')">
					<h1>{{ t('account.title') }}</h1>
					<nav class="app-account__nav">
						<NuxtLink v-for="item in navItems" :key="item.id" :to="item.to" class="app-account__nav-item" :class="{ 'is-active': item.active }">
							<span class="app-account__nav-icon" v-html="item.icon" aria-hidden="true"></span>
							<span>{{ item.label }}</span>
						</NuxtLink>
					</nav>
				</aside>

				<section ref="billingPanel" class="app-account__content" aria-labelledby="account-billing-title">
					<div class="billing-panel">
						<header class="billing-panel__header">
							<div>
								<h2 id="account-billing-title">{{ t('account.billingPage.title') }}</h2>
								<p>{{ t('account.billingPage.subtitle') }}</p>
							</div>
							<strong>{{ t('account.billingPage.orderCount', { count: total }) }}</strong>
						</header>

						<div v-if="listLoading && !orders.length" class="billing-skeleton" aria-live="polite" :aria-label="t('account.billingPage.loading')">
							<span v-for="index in 5" :key="index"></span>
						</div>

						<div v-else-if="listError && !orders.length" class="billing-state" role="alert">
							<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" /><path d="M12 7.5V12.5M12 16.5V16.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
							<h3>{{ t('account.billingPage.loadFailed') }}</h3>
							<button type="button" @click="fetchOrders">{{ t('account.billingPage.retry') }}</button>
						</div>

						<div v-else-if="!orders.length" class="billing-state">
							<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.6" /><path d="M4 10H20" stroke="currentColor" stroke-width="1.6" /></svg>
							<h3>{{ t('account.billingPage.emptyTitle') }}</h3>
							<p>{{ t('account.billingPage.emptyMessage') }}</p>
						</div>

						<template v-else>
							<div class="billing-table-wrap" :class="{ 'is-loading': listLoading }">
								<table>
									<thead>
										<tr>
											<th>{{ t('account.billingPage.order') }}</th>
											<th>{{ t('account.billingPage.plan') }}</th>
											<th>{{ t('account.billingPage.billingType') }}</th>
											<th>{{ t('account.billingPage.amount') }}</th>
											<th>{{ t('account.billingPage.credits') }}</th>
											<th>{{ t('account.billingPage.status') }}</th>
											<th>{{ t('account.billingPage.date') }}</th>
											<th><span class="sr-only">{{ t('account.billingPage.details') }}</span></th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="order in orders" :key="order.orderNo">
											<td><span class="order-number" :title="order.orderNo">{{ shortOrderNo(order.orderNo) }}</span></td>
											<td><strong>{{ order.planName || '—' }}</strong></td>
											<td>
												<span class="billing-type" :class="`is-${getBillingTypeKey(order.billingType)}`">
													{{ billingTypeLabel(order.billingType) }}
												</span>
											</td>
											<td>{{ formatOrderAmount(order.amountCent, order.currency, locale) }}</td>
											<td>{{ Number(order.creditAmount || 0).toLocaleString() }}</td>
											<td>
												<span class="order-status" :class="`is-${getOrderStatus(order.orderStatus).tone}`">
													<i aria-hidden="true"></i>{{ statusLabel(order.orderStatus) }}
												</span>
											</td>
											<td class="order-date">{{ formatOrderDate(order.createTime, locale) }}</td>
											<td>
												<button type="button" class="details-button" @click="openDetails(order.orderNo, $event)">
													{{ t('account.billingPage.details') }}
													<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 10H15M11.5 6.5L15 10L11.5 13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
												</button>
											</td>
										</tr>
									</tbody>
								</table>
							</div>

							<footer class="billing-pagination">
								<p>{{ t('account.billingPage.showing', { start: visibleRange.start, end: visibleRange.end, total }) }}</p>
								<nav :aria-label="t('account.billingPage.title')">
									<button type="button" :disabled="page <= 1 || listLoading" :aria-label="t('account.billingPage.previous')" @click="changePage(page - 1)">←</button>
									<button v-for="pageNumber in visiblePages" :key="pageNumber" type="button" :disabled="listLoading" :class="{ 'is-active': pageNumber === page }" :aria-current="pageNumber === page ? 'page' : undefined" @click="changePage(pageNumber)">{{ pageNumber }}</button>
									<button type="button" :disabled="page >= pageCount || listLoading" :aria-label="t('account.billingPage.next')" @click="changePage(page + 1)">→</button>
								</nav>
							</footer>
						</template>
					</div>
				</section>
			</div>
		</main>

		<PaymentOrderDetailModal :open="detailOpen" :loading="detailLoading" :order="selectedOrder" :error="detailError" @close="closeDetails" @retry="retryDetails" />
		<LoginModal :open="loginOpen" @close="loginOpen = false" />
	</div>
</template>

<script setup lang="ts">
import AppHomeSidebar from '~/components/home/app/AppHomeSidebar.vue'
import LoginModal from '~/components/auth/LoginModal.vue'
import PaymentOrderDetailModal from '~/components/payment/PaymentOrderDetailModal.vue'
import { getPaymentOrderDetail, getPaymentOrders, type CustomerPaymentOrder } from '~/api/user'
import { isUnauthorizedError } from '~/composables/useUnauthorizedError'
import { formatOrderAmount, formatOrderDate, getBillingTypeKey, getOrderStatus, getPageCount, getVisibleRange } from '~/utils/paymentOrders'

const { t, locale } = useAppI18n()
const { token, initUser } = useUser()
const route = useRoute()

const sidebarCollapsed = ref(false)
const loginOpen = ref(false)
const billingPanel = ref<HTMLElement | null>(null)
const page = ref(1)
const pageSize = 10
const total = ref(0)
const orders = ref<CustomerPaymentOrder[]>([])
const listLoading = ref(false)
const listError = ref(false)
const detailOpen = ref(false)
const detailLoading = ref(false)
const detailError = ref(false)
const selectedOrder = ref<CustomerPaymentOrder | null>(null)
const selectedOrderNo = ref('')
const detailTrigger = ref<HTMLElement | null>(null)
const mounted = ref(false)

const accountPath = (name: 'profile' | 'billing' | 'subscription') => {
	const prefix = route.path.split('/').filter(Boolean)[0]
	return ['zh', 'de', 'es', 'ja'].includes(prefix) ? `/${prefix}/account/${name}` : `/account/${name}`
}
const navItems = computed(() => [
	{ id: 'profile', label: t('account.profile'), to: accountPath('profile'), active: false, icon: '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7.2" r="3.1" stroke="currentColor" stroke-width="1.5"/><path d="M4.8 16.2C5.6 13.4 7.5 12 10 12C12.5 12 14.4 13.4 15.2 16.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' },
	{ id: 'billing', label: t('account.billing'), to: accountPath('billing'), active: true, icon: '<svg viewBox="0 0 20 20" fill="none"><rect x="3.5" y="5.5" width="13" height="9" rx="1.6" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 8.5H16.5" stroke="currentColor" stroke-width="1.5"/></svg>' },
	{ id: 'subscription', label: t('account.subscriptionCurrent'), to: accountPath('subscription'), active: false, icon: '<svg viewBox="0 0 20 20" fill="none"><path d="M10 2.8L11.5 7L15.7 8.5L11.5 10L10 14.2L8.5 10L4.3 8.5L8.5 7L10 2.8Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M15.5 13L16.2 15L18.2 15.7L16.2 16.4L15.5 18.4L14.8 16.4L12.8 15.7L14.8 15L15.5 13Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>' },
])
const pageCount = computed(() => getPageCount(total.value, pageSize))
const visibleRange = computed(() => getVisibleRange(page.value, pageSize, total.value, orders.value.length))
const visiblePages = computed(() => {
	const start = Math.max(1, Math.min(page.value - 2, pageCount.value - 4))
	return Array.from({ length: Math.min(5, pageCount.value) }, (_, index) => start + index)
})
const shortOrderNo = (value: string) => value.length > 12 ? `…${value.slice(-10)}` : value
const statusLabel = (value: string) => ({
	success: t('account.billingPage.statusSuccess'),
	created: t('account.billingPage.statusCreated'),
	failed: t('account.billingPage.statusFailed'),
} as Record<string, string>)[value] || value || '—'
const billingTypeLabel = (value: string) => {
	const key = getBillingTypeKey(value)
	if (key === 'one_time') return t('account.billingPage.billingTypeOneTime')
	if (key === 'subscription') return t('account.billingPage.billingTypeSubscription')
	return value || '—'
}
const fetchOrders = async () => {
	if (!token.value || listLoading.value) return
	listLoading.value = true
	listError.value = false
	let correctedPage = false
	try {
		const response = await getPaymentOrders(page.value, pageSize)
		orders.value = Array.isArray(response.rows) ? response.rows : []
		total.value = Number.isFinite(Number(response.total)) ? Math.max(0, Number(response.total)) : 0
		if (page.value > pageCount.value) {
			page.value = pageCount.value
			orders.value = []
			correctedPage = true
		}
	} catch (error) {
		listError.value = true
		if (isUnauthorizedError(error)) loginOpen.value = true
	} finally {
		listLoading.value = false
	}
	if (correctedPage) await fetchOrders()
}
const changePage = async (nextPage: number) => {
	if (nextPage === page.value || nextPage < 1 || nextPage > pageCount.value || listLoading.value) return
	page.value = nextPage
	await fetchOrders()
	billingPanel.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
const loadDetails = async () => {
	if (!selectedOrderNo.value || detailLoading.value) return
	detailLoading.value = true
	detailError.value = false
	selectedOrder.value = null
	try {
		const response = await getPaymentOrderDetail(selectedOrderNo.value)
		selectedOrder.value = response.data || null
		if (!selectedOrder.value) detailError.value = true
	} catch (error) {
		detailError.value = true
		if (isUnauthorizedError(error)) loginOpen.value = true
	} finally {
		detailLoading.value = false
	}
}
const openDetails = (orderNo: string, event: MouseEvent) => {
	if (detailLoading.value) return
	detailTrigger.value = event.currentTarget as HTMLElement
	selectedOrderNo.value = orderNo
	detailOpen.value = true
	void loadDetails()
}
const retryDetails = () => void loadDetails()
const closeDetails = async () => {
	detailOpen.value = false
	selectedOrder.value = null
	detailError.value = false
	await nextTick()
	detailTrigger.value?.focus()
}

onMounted(async () => {
	mounted.value = true
	await initUser()
	if (!token.value) loginOpen.value = true
	else await fetchOrders()
})
watch(token, async value => {
	if (!mounted.value || !value || orders.value.length || listLoading.value) return
	loginOpen.value = false
	await fetchOrders()
})
useHead({ title: () => `${t('account.billingPage.title')} | ${t('common.siteName')}` })
</script>

<style scoped lang="scss">
.app-account { display:grid;grid-template-columns:288px minmax(0,1fr);min-height:100vh;background:#050505;color:#f5f5f5;transition:grid-template-columns 220ms ease }.app-account.is-sidebar-collapsed{grid-template-columns:84px minmax(0,1fr)}
.app-account__main{display:flex;justify-content:center;align-items:flex-start;min-width:0;height:100dvh;overflow-y:auto;padding:48px 32px 56px;background:#050505}.app-account__shell{display:grid;grid-template-columns:168px minmax(0,920px);gap:28px;width:min(100%,1116px);align-items:start}.app-account__aside{display:flex;flex-direction:column;gap:20px;min-width:0;padding-top:4px}.app-account__aside h1{margin:0;font-size:28px;font-weight:700;letter-spacing:-.03em;line-height:1.1}.app-account__nav{display:grid;gap:6px}.app-account__nav-item{display:flex;align-items:center;gap:10px;min-height:40px;padding:0 12px;border-radius:10px;color:rgba(255,255,255,.72);font-size:14px;font-weight:500;text-decoration:none;transition:background 160ms ease,color 160ms ease}.app-account__nav-item:hover{background:rgba(255,255,255,.05);color:#fff}.app-account__nav-item.is-active{background:#2a2a2c;color:#fff}.app-account__nav-icon{display:grid;place-items:center;width:16px;height:16px}.app-account__nav-icon :deep(svg){width:16px;height:16px}.app-account__content{min-width:0;scroll-margin-top:24px}
.billing-panel{width:100%;min-height:480px;border:1px solid rgba(255,255,255,.09);border-radius:16px;background:#1a1a1c;padding:24px}.billing-panel__header{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:22px;padding-bottom:18px;border-bottom:1px solid rgba(255,255,255,.08)}.billing-panel__header h2{margin:0;font-size:21px}.billing-panel__header p{margin:7px 0 0;color:#7d7d82;font-size:12px}.billing-panel__header>strong{color:#f0d424;font-size:12px;white-space:nowrap}
.billing-table-wrap{overflow-x:auto;border:1px solid #303033;border-radius:13px;transition:opacity .2s ease}.billing-table-wrap.is-loading{opacity:.48;pointer-events:none}table{width:100%;min-width:860px;border-collapse:collapse;font-size:12px;text-align:left;table-layout:fixed}thead{background:#111113;color:#74747a;font-size:9px;letter-spacing:.08em;text-transform:uppercase}th{padding:13px 12px;font-weight:750}th:nth-child(1){width:12%}th:nth-child(2){width:16%}th:nth-child(3){width:12%}th:nth-child(4){width:10%}th:nth-child(5){width:10%}th:nth-child(6){width:12%}th:nth-child(7){width:16%}th:nth-child(8){width:12%}td{padding:15px 12px;border-top:1px solid #2b2b2e;color:#c5c5c8;vertical-align:middle}tbody tr{transition:background .15s ease}tbody tr:hover{background:rgba(255,255,255,.02)}td strong{color:#f3f3f4;font-weight:700}.order-number{color:#a8a8ad;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.order-date{color:#89898e;white-space:nowrap}.billing-type{display:inline-flex;align-items:center;border-radius:999px;padding:6px 9px;font-size:10px;font-weight:750;white-space:nowrap}.billing-type.is-subscription{color:#9ec5ff;background:rgba(88,152,255,.12)}.billing-type.is-one_time{color:#d7c07a;background:rgba(215,192,122,.12)}.billing-type.is-unknown{color:#b1b1b5;background:rgba(255,255,255,.07)}.order-status{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:6px 9px;font-size:10px;font-weight:750;white-space:nowrap}.order-status i{width:5px;height:5px;border-radius:50%;background:currentColor}.order-status.is-success{color:#68d495;background:rgba(65,197,122,.12)}.order-status.is-pending{color:#f0d424;background:rgba(240,212,36,.11)}.order-status.is-failed{color:#ff7777;background:rgba(255,89,89,.1)}.order-status.is-neutral{color:#b1b1b5;background:rgba(255,255,255,.07)}.details-button{display:inline-flex;align-items:center;gap:5px;border:1px solid #3b3b3f;border-radius:8px;padding:7px 10px;color:#eee;background:#252527;font-size:10px;font-weight:750;cursor:pointer;white-space:nowrap}.details-button:hover{border-color:#5a5a60;background:#303033}.details-button svg{width:13px;height:13px}
.billing-pagination{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:17px}.billing-pagination p{margin:0;color:#77777d;font-size:10px}.billing-pagination nav{display:flex;gap:6px}.billing-pagination button{display:grid;min-width:32px;height:32px;place-items:center;border:1px solid #37373a;border-radius:8px;color:#aaa;background:#222224;font-size:11px;cursor:pointer}.billing-pagination button:hover:not(:disabled){border-color:#58585d;color:#fff}.billing-pagination button.is-active{border-color:#f0d424;color:#171717;background:#f0d424;font-weight:850}.billing-pagination button:disabled{opacity:.38;cursor:not-allowed}
.billing-state{display:grid;min-height:340px;place-items:center;align-content:center;text-align:center}.billing-state svg{width:42px;margin-bottom:14px;color:#5d5d63}.billing-state h3{margin:0;font-size:15px}.billing-state p{max-width:320px;margin:9px 0 0;color:#77777c;font-size:11px;line-height:1.6}.billing-state button{margin-top:16px;border:0;border-radius:999px;padding:10px 18px;color:#171717;background:#f0d424;font-size:11px;font-weight:800;cursor:pointer}.billing-skeleton{display:grid;gap:1px;overflow:hidden;border:1px solid #303033;border-radius:13px;background:#303033}.billing-skeleton span{height:58px;background:linear-gradient(90deg,#1d1d1f 25%,#272729 50%,#1d1d1f 75%);background-size:200% 100%;animation:shimmer 1.4s infinite}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}@keyframes shimmer{to{background-position:-200% 0}}
@media(max-width:1120px){.app-account__main{height:auto;padding:24px 16px 40px}.app-account__shell{grid-template-columns:1fr;gap:18px;width:100%}.app-account__aside h1{font-size:24px}.app-account__nav{grid-auto-flow:column;grid-auto-columns:max-content;overflow-x:auto}.billing-panel{padding:18px 16px}}
@media(max-width:900px){.app-account,.app-account.is-sidebar-collapsed{grid-template-columns:1fr}}
@media(max-width:600px){.billing-panel__header,.billing-pagination{align-items:flex-start;flex-direction:column}.billing-pagination nav{width:100%;justify-content:flex-end}.billing-pagination p{order:2}.billing-panel{border-radius:13px;padding:16px 12px}}
@media(prefers-reduced-motion:reduce){.app-account,.app-account__nav-item,.billing-table-wrap,tbody tr{transition:none}.billing-skeleton span{animation:none}}
</style>
