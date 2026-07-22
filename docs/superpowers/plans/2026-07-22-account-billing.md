# Account Billing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a locale-aware account Billing page with server-paginated payment orders and an on-demand order-detail modal.

**Architecture:** Extend the existing user API module with typed order endpoints, keep formatting and pagination logic in a pure tested utility, and implement Billing as a focused dashboard matching the existing profile shell. Keep the detail experience in a standalone accessible modal so list fetching and modal behavior stay independently understandable.

**Tech Stack:** Nuxt 3, Vue 3 Composition API, TypeScript, SCSS, Vitest, existing `useRequest`, `useUser`, `useAppI18n`, and `useTipToast` composables.

---

## File Structure

- Create `utils/paymentOrders.ts`: pure currency, status, date, page-count, and visible-range helpers.
- Create `tests/paymentOrders.test.ts`: focused tests for presentation and pagination behavior.
- Modify `api/user/index.ts`: shared order type, actual `{ total, rows }` list response, list request, and detail request.
- Create `components/payment/PaymentOrderDetailModal.vue`: loading, error, and complete order-detail dialog.
- Create `components/home/app/AppAccountBillingDashboard.vue`: account shell, table states, pagination, authentication, and API orchestration.
- Create `pages/account/billing.vue`: route entry.
- Modify `components/home/app/AppAccountProfileDashboard.vue`: locale-aware Profile and Billing destinations.
- Modify `utils/locales/en.json` and `utils/locales/zh.json`: Billing UI copy; other app locales use the established English fallback.

### Task 1: Payment Order Presentation Helpers

**Files:**
- Create: `tests/paymentOrders.test.ts`
- Create: `utils/paymentOrders.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/paymentOrders.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  formatOrderAmount,
  formatOrderDate,
  getOrderStatus,
  getPageCount,
  getVisibleRange,
} from '../utils/paymentOrders'

describe('payment order presentation', () => {
  it('formats cents using the supplied currency', () => {
    expect(formatOrderAmount(1599, 'USD', 'en')).toBe('$15.99')
  })

  it('maps known and unknown statuses', () => {
    expect(getOrderStatus('success')).toEqual({ key: 'success', tone: 'success' })
    expect(getOrderStatus('created')).toEqual({ key: 'created', tone: 'pending' })
    expect(getOrderStatus('failed')).toEqual({ key: 'failed', tone: 'failed' })
    expect(getOrderStatus('refunded')).toEqual({ key: 'refunded', tone: 'neutral' })
  })

  it('formats missing dates as an em dash', () => {
    expect(formatOrderDate(null, 'en')).toBe('—')
    expect(formatOrderDate('', 'zh')).toBe('—')
  })
})

describe('payment order pagination', () => {
  it('calculates page count with at least one page', () => {
    expect(getPageCount(24, 10)).toBe(3)
    expect(getPageCount(0, 10)).toBe(1)
  })

  it('calculates the visible result range', () => {
    expect(getVisibleRange(2, 10, 24, 10)).toEqual({ start: 11, end: 20 })
    expect(getVisibleRange(1, 10, 0, 0)).toEqual({ start: 0, end: 0 })
  })
})
```

- [ ] **Step 2: Verify RED**

Run `pnpm test tests/paymentOrders.test.ts`.

Expected: FAIL because `utils/paymentOrders.ts` does not exist.

- [ ] **Step 3: Implement the helpers**

Create `utils/paymentOrders.ts`:

```ts
export type OrderStatusTone = 'success' | 'pending' | 'failed' | 'neutral'

export const formatOrderAmount = (amountCent: number, currency: string, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
  }).format((Number(amountCent) || 0) / 100)

export const formatOrderDate = (value: string | null | undefined, locale: string) => {
  if (!value) return '—'
  const normalized = value.includes('T') ? value : value.replace(' ', 'T')
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export const getOrderStatus = (status: string) => {
  const key = status || 'unknown'
  const tones: Record<string, OrderStatusTone> = {
    success: 'success',
    created: 'pending',
    failed: 'failed',
  }
  return { key, tone: tones[key] || 'neutral' }
}

export const getPageCount = (total: number, pageSize: number) =>
  Math.max(1, Math.ceil(Math.max(0, total) / pageSize))

export const getVisibleRange = (page: number, pageSize: number, total: number, rowCount: number) => {
  if (total <= 0 || rowCount <= 0) return { start: 0, end: 0 }
  const start = (page - 1) * pageSize + 1
  return { start, end: Math.min(total, start + rowCount - 1) }
}
```

- [ ] **Step 4: Verify GREEN**

Run `pnpm test tests/paymentOrders.test.ts`.

Expected: 5 tests PASS.

### Task 2: Typed Payment Order APIs

**Files:**
- Modify: `api/user/index.ts`

- [ ] **Step 1: Add order contracts**

Add:

```ts
export interface CustomerPaymentOrder {
  orderNo: string
  planId: number
  planName: string
  billingType: string
  amountCent: number
  currency: string
  creditAmount: number
  orderStatus: string
  subscriptionId?: number | null
  payTime?: string | null
  deliverTime?: string | null
  createTime: string
}

export interface PaymentOrderListResponse {
  total: number
  rows: CustomerPaymentOrder[]
  code: number | string
  msg: string
}
```

- [ ] **Step 2: Add list and detail functions**

```ts
export const getPaymentOrders = (pageNum = 1, pageSize = 10) => {
  const request = useRequest()
  return request<PaymentOrderListResponse>('/user/payment/orders', {
    query: { pageNum, pageSize },
  })
}

export const getPaymentOrderDetail = (orderNo: string) => {
  const request = useRequest()
  return request<ApiResponse<CustomerPaymentOrder>>(
    `/user/payment/order/${encodeURIComponent(orderNo)}`,
  )
}
```

- [ ] **Step 3: Run helper tests**

Run `pnpm test tests/paymentOrders.test.ts tests/paymentCheckout.test.ts`.

Expected: all 10 tests PASS.

### Task 3: Localized Billing Copy and Detail Modal

**Files:**
- Modify: `utils/locales/en.json`
- Modify: `utils/locales/zh.json`
- Create: `components/payment/PaymentOrderDetailModal.vue`

- [ ] **Step 1: Add Billing strings**

Under `account`, add this English object:

```json
"billingPage": {
  "title": "Billing",
  "subtitle": "Review payments and credit delivery.",
  "orderCount": "{count} orders",
  "order": "Order",
  "plan": "Plan",
  "amount": "Amount",
  "credits": "Credits",
  "status": "Status",
  "date": "Date",
  "details": "Details",
  "emptyTitle": "No payment orders yet",
  "emptyMessage": "Your completed and pending checkouts will appear here.",
  "loadFailed": "We couldn't load your payment orders.",
  "retry": "Try again",
  "showing": "Showing {start}–{end} of {total}",
  "previous": "Previous page",
  "next": "Next page",
  "statusSuccess": "Completed",
  "statusCreated": "Pending",
  "statusFailed": "Failed",
  "detailTitle": "Payment details",
  "amountPaid": "Amount paid",
  "creditsDelivered": "Credits delivered",
  "billingType": "Billing type",
  "planId": "Plan ID",
  "subscriptionId": "Subscription ID",
  "createdAt": "Created at",
  "paidAt": "Paid at",
  "deliveredAt": "Delivered at",
  "done": "Done",
  "close": "Close details"
}
```

Add the same keys in Chinese with values `账单`, `查看付款记录和积分到账情况。`, `{count} 笔订单`, `订单号`, `套餐`, `金额`, `积分`, `状态`, `创建时间`, `详情`, `暂无支付订单`, `完成或待处理的结账订单会显示在这里。`, `无法加载支付订单。`, `重试`, `显示第 {start}–{end} 条，共 {total} 条`, `上一页`, `下一页`, `已完成`, `待支付`, `失败`, `支付详情`, `支付金额`, `到账积分`, `计费类型`, `套餐 ID`, `订阅 ID`, `创建时间`, `支付时间`, `到账时间`, `完成`, and `关闭详情` in the same order.

- [ ] **Step 2: Implement the modal public contract**

Create `PaymentOrderDetailModal.vue` with:

```ts
const props = defineProps<{
  open: boolean
  loading: boolean
  order: CustomerPaymentOrder | null
  error: boolean
}>()
const emit = defineEmits<{ close: []; retry: [] }>()
```

Use Teleport and Transition. Render a spinner while loading, a retry panel on error, and the approved amount/status/detail grid when data exists. Close on backdrop, close icon, Done, and Escape; focus the close button when opened. Add responsive one-column fields and a reduced-motion media query.

- [ ] **Step 3: Validate locale JSON and compile the component**

Run:

```bash
node -e "for (const file of ['en','zh']) JSON.parse(require('fs').readFileSync('utils/locales/'+file+'.json','utf8'))"
pnpm test tests/paymentOrders.test.ts
```

Expected: JSON parses and tests pass.

### Task 4: Billing Dashboard and Route

**Files:**
- Create: `components/home/app/AppAccountBillingDashboard.vue`
- Create: `pages/account/billing.vue`
- Modify: `components/home/app/AppAccountProfileDashboard.vue`

- [ ] **Step 1: Make account navigation locale-aware**

In the profile dashboard, derive `accountLocalePrefix` from `route.path` and create `accountPath(name)` returning `/account/<name>` for English or `/<locale>/account/<name>` otherwise. Use it for Profile and Billing; change Billing from `/pricing` to `accountPath('billing')`.

- [ ] **Step 2: Create the route entry**

Create `pages/account/billing.vue`:

```vue
<template><AppAccountBillingDashboard /></template>
<script setup lang="ts">
import AppAccountBillingDashboard from '~/components/home/app/AppAccountBillingDashboard.vue'
</script>
```

- [ ] **Step 3: Build the dashboard shell and table**

Mirror the existing profile shell and sidebar interaction. Use a wider content panel, active Billing navigation, accessible table markup, horizontally scrollable table wrapper, status-tone classes, skeleton/empty/error states, and numbered pagination computed from `total` and `pageSize`.

State and fetching contract:

```ts
const page = ref(1)
const pageSize = 10
const total = ref(0)
const orders = ref<CustomerPaymentOrder[]>([])
const listLoading = ref(false)
const listError = ref(false)

const fetchOrders = async () => {
  if (!token.value || listLoading.value) return
  listLoading.value = true
  listError.value = false
  try {
    const response = await getPaymentOrders(page.value, pageSize)
    orders.value = Array.isArray(response.rows) ? response.rows : []
    total.value = Number.isFinite(Number(response.total)) ? Math.max(0, Number(response.total)) : 0
  } catch (error) {
    listError.value = true
    if (isUnauthorizedError(error)) loginOpen.value = true
  } finally {
    listLoading.value = false
  }
}
```

Correct an out-of-range page after each response, and fetch again only when correction changes the page.

- [ ] **Step 4: Wire on-demand detail loading**

Track `detailOpen`, `detailLoading`, `detailError`, `selectedOrder`, and `selectedOrderNo`. `openDetails(orderNo)` opens the modal, clears old data, records the trigger element for focus restoration, and calls `getPaymentOrderDetail(orderNo)`. Retry calls the same function. Close clears visible modal state and restores focus.

- [ ] **Step 5: Add authentication initialization**

On mount call `initUser()`. If no token, open LoginModal; otherwise fetch page one. Watch token changes so a newly authenticated user triggers the list exactly once. Keep the existing global application sidebar behavior.

- [ ] **Step 6: Run focused tests and production build**

Run with Node 22:

```bash
pnpm test
pnpm build
git diff --check
```

Expected: 10 tests pass, production build exits 0, and no whitespace errors are reported. Existing repository-wide `nuxt typecheck` errors are documented separately and are not the acceptance gate.

### Task 5: Manual Acceptance

**Files:**
- Verify the completed Billing feature.

- [ ] **Step 1: Verify list behavior**

Confirm `/account/billing` preserves locale, calls `/user/payment/orders?pageNum=1&pageSize=10`, renders `rows`, uses `total` for page count, displays all loading/empty/error states, and never requests orders before authentication.

- [ ] **Step 2: Verify detail behavior**

Confirm Details calls only `/user/payment/order/{orderNo}`, opens the approved modal, renders all fields, supports error retry, ignores duplicate requests, closes by every specified method, and restores focus.

- [ ] **Step 3: Verify responsive and accessibility behavior**

Confirm desktop alignment matches Profile, mobile table scrolls without breaking the shell, modal fields stack, buttons are keyboard reachable, status is not communicated by color alone, and reduced-motion mode disables transitions.
