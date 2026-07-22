<template>
	<Teleport to="body">
		<Transition name="order-detail">
			<div v-if="open" class="order-detail" @click.self="emit('close')">
				<section
					class="order-detail__panel"
					role="dialog"
					aria-modal="true"
					aria-labelledby="order-detail-title"
				>
					<header class="order-detail__header">
						<div>
							<p class="order-detail__eyebrow">{{ t('account.billingPage.detailTitle') }}</p>
							<h2 id="order-detail-title">{{ order?.planName || t('account.billingPage.detailTitle') }}</h2>
							<p v-if="order" class="order-detail__number">{{ order.orderNo }}</p>
						</div>
						<button ref="closeButton" type="button" class="order-detail__close" :aria-label="t('account.billingPage.close')" @click="emit('close')">
							<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
						</button>
					</header>

					<div v-if="loading" class="order-detail__state" aria-live="polite">
						<span class="order-detail__spinner" aria-hidden="true"></span>
						<p>{{ t('account.billingPage.loading') }}</p>
					</div>

					<div v-else-if="error" class="order-detail__state is-error" role="alert">
						<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" /><path d="M12 7.5V12.5M12 16.5V16.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
						<p>{{ t('account.billingPage.loadFailed') }}</p>
						<button type="button" @click="emit('retry')">{{ t('account.billingPage.retry') }}</button>
					</div>

					<template v-else-if="order">
						<div class="order-detail__amount-card">
							<div>
								<small>{{ t('account.billingPage.amountPaid') }}</small>
								<strong>{{ formatOrderAmount(order.amountCent, order.currency, locale) }}</strong>
								<span>{{ order.currency }}</span>
							</div>
							<span class="order-status" :class="`is-${status.tone}`">
								<i aria-hidden="true"></i>{{ statusLabel(status.key) }}
							</span>
						</div>

						<dl class="order-detail__grid">
							<div>
								<dt>{{ t('account.billingPage.creditsDelivered') }}</dt>
								<dd>{{ Number(order.creditAmount || 0).toLocaleString() }}</dd>
							</div>
							<div>
								<dt>{{ t('account.billingPage.billingType') }}</dt>
								<dd>
									<span class="billing-type" :class="`is-${billingTypeKey}`">{{ billingTypeLabel }}</span>
								</dd>
							</div>
							<div>
								<dt>{{ t('account.billingPage.createdAt') }}</dt>
								<dd>{{ formatOrderDate(order.createTime, locale) }}</dd>
							</div>
							<div>
								<dt>{{ t('account.billingPage.paidAt') }}</dt>
								<dd>{{ formatOrderDate(order.payTime, locale) }}</dd>
							</div>
							<div>
								<dt>{{ t('account.billingPage.deliveredAt') }}</dt>
								<dd>{{ formatOrderDate(order.deliverTime, locale) }}</dd>
							</div>
						</dl>

						<button type="button" class="order-detail__done" @click="emit('close')">{{ t('account.billingPage.done') }}</button>
					</template>
				</section>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
import type { CustomerPaymentOrder } from '~/api/user'
import { formatOrderAmount, formatOrderDate, getBillingTypeKey, getOrderStatus } from '~/utils/paymentOrders'

const props = defineProps<{
	open: boolean
	loading: boolean
	order: CustomerPaymentOrder | null
	error: boolean
}>()
const emit = defineEmits<{ close: []; retry: [] }>()
const { t, locale } = useAppI18n()
const closeButton = ref<HTMLButtonElement | null>(null)

const status = computed(() => getOrderStatus(props.order?.orderStatus || ''))
const statusLabel = (key: string) => {
	const labels: Record<string, string> = {
		success: t('account.billingPage.statusSuccess'),
		created: t('account.billingPage.statusCreated'),
		failed: t('account.billingPage.statusFailed'),
	}
	return labels[key] || key
}
const billingTypeKey = computed(() => getBillingTypeKey(props.order?.billingType))
const billingTypeLabel = computed(() => {
	if (billingTypeKey.value === 'one_time') return t('account.billingPage.billingTypeOneTime')
	if (billingTypeKey.value === 'subscription') return t('account.billingPage.billingTypeSubscription')
	return props.order?.billingType || '—'
})
const onKeydown = (event: KeyboardEvent) => {
	if (props.open && event.key === 'Escape') emit('close')
}

watch(() => props.open, async (open) => {
	if (!open) return
	await nextTick()
	closeButton.value?.focus()
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped lang="scss">
.order-detail { position: fixed; inset: 0; z-index: 1100; display: grid; place-items: center; overflow-y: auto; padding: 24px; background: rgba(3,3,4,.82); backdrop-filter: blur(12px); }
.order-detail__panel { width: min(600px,100%); border: 1px solid #37373a; border-radius: 24px; padding: 28px; color: #f5f5f5; background: radial-gradient(circle at 50% 0,rgba(240,212,36,.06),transparent 35%),#1b1b1d; box-shadow: 0 36px 110px rgba(0,0,0,.72); }
.order-detail__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; }.order-detail__eyebrow { margin: 0 0 7px; color: #f0d424; font-size: 10px; font-weight: 850; letter-spacing: .16em; text-transform: uppercase; }.order-detail__header h2 { margin: 0; font-size: 25px; line-height: 1.2; }.order-detail__number { margin: 8px 0 0; color: #77777d; font-family: ui-monospace,SFMono-Regular,Menlo,monospace; font-size: 11px; word-break: break-all; }.order-detail__close { display: grid; width: 36px; height: 36px; flex: none; place-items: center; border: 1px solid #3d3d41; border-radius: 50%; color: #a3a3a8; background: #252527; cursor: pointer; }.order-detail__close:hover { color: #fff; border-color: #55555b; }.order-detail__close svg { width: 17px; height: 17px; }
.order-detail__state { display: grid; min-height: 280px; place-items: center; align-content: center; gap: 14px; color: #99999e; text-align: center; }.order-detail__state p { margin: 0; }.order-detail__state.is-error svg { width: 42px; color: #ff7777; }.order-detail__state.is-error button { border: 0; border-radius: 999px; padding: 11px 20px; color: #171717; background: #f0d424; font-weight: 800; cursor: pointer; }.order-detail__spinner { width: 36px; height: 36px; border: 3px solid rgba(240,212,36,.18); border-top-color: #f0d424; border-radius: 50%; animation: spin .8s linear infinite; }
.order-detail__amount-card { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin: 25px 0 20px; border-radius: 15px; padding: 20px; background: #111113; }.order-detail__amount-card small { display: block; margin-bottom: 5px; color: #79797f; font-size: 10px; font-weight: 750; letter-spacing: .08em; text-transform: uppercase; }.order-detail__amount-card strong { font-size: 31px; line-height: 1; }.order-detail__amount-card div>span { margin-left: 5px; color: #77777c; font-size: 12px; }
.order-status { display: inline-flex; align-items: center; gap: 6px; border-radius: 999px; padding: 7px 10px; font-size: 11px; font-weight: 750; white-space: nowrap; }.order-status i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }.order-status.is-success { color: #68d495; background: rgba(65,197,122,.12); }.order-status.is-pending { color: #f0d424; background: rgba(240,212,36,.11); }.order-status.is-failed { color: #ff7777; background: rgba(255,89,89,.1); }.order-status.is-neutral { color: #b1b1b5; background: rgba(255,255,255,.07); }
.order-detail__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; overflow: hidden; margin: 0; border: 1px solid #303033; border-radius: 14px; background: #303033; }.order-detail__grid>div { min-width: 0; padding: 16px; background: #1b1b1d; }.order-detail__grid dt { margin-bottom: 5px; color: #77777d; font-size: 10px; }.order-detail__grid dd { overflow-wrap: anywhere; margin: 0; font-size: 13px; font-weight: 700; }.billing-type { display: inline-flex; align-items: center; border-radius: 999px; padding: 6px 9px; font-size: 11px; font-weight: 750; white-space: nowrap; }.billing-type.is-subscription { color: #9ec5ff; background: rgba(88,152,255,.12); }.billing-type.is-one_time { color: #d7c07a; background: rgba(215,192,122,.12); }.billing-type.is-unknown { color: #b1b1b5; background: rgba(255,255,255,.07); }.order-detail__done { width: 100%; min-height: 48px; margin-top: 22px; border: 0; border-radius: 999px; color: #171717; background: #f0d424; font-size: 13px; font-weight: 850; cursor: pointer; transition: transform .2s ease,background .2s ease; }.order-detail__done:hover { transform: translateY(-1px); background: #ffe43b; }
.order-detail-enter-active,.order-detail-leave-active { transition: opacity .24s ease; }.order-detail-enter-active .order-detail__panel,.order-detail-leave-active .order-detail__panel { transition: transform .28s ease,opacity .24s ease; }.order-detail-enter-from,.order-detail-leave-to { opacity: 0; }.order-detail-enter-from .order-detail__panel,.order-detail-leave-to .order-detail__panel { opacity: 0; transform: translateY(14px) scale(.97); }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width:560px) { .order-detail { align-items: end; padding: 12px; }.order-detail__panel { border-radius: 22px; padding: 22px 18px; }.order-detail__amount-card { align-items: flex-start; flex-direction: column; }.order-detail__grid { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion:reduce) { .order-detail-enter-active,.order-detail-leave-active,.order-detail-enter-active .order-detail__panel,.order-detail-leave-active .order-detail__panel,.order-detail__done { transition: none; }.order-detail__spinner { animation: none; } }
</style>
