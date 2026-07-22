# Payment Checkout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create Stripe checkout sessions from every paid pricing-plan button, redirect safely to Stripe, and show localized success or cancellation feedback when the user returns.

**Architecture:** Put deterministic URL/result helpers in a small utility, keep the typed HTTP call in the existing user API module, and let `pages/pricing.vue` orchestrate authentication, loading, redirect, and return-state handling. Isolate the approved Celebration Burst overlay in a focused Vue component so the already-large pricing page does not absorb its markup and animation styles.

**Tech Stack:** Nuxt 3, Vue 3 Composition API, TypeScript, Tailwind CSS, scoped CSS animations, Vitest.

---

## File Structure

- Create `utils/paymentCheckout.ts`: pure return-URL, checkout-URL, and result-flag helpers.
- Create `tests/paymentCheckout.test.ts`: behavior tests for the pure payment helpers.
- Modify `package.json`: add the Vitest test command and development dependency.
- Modify `api/user/index.ts`: checkout request/result types and the typed POST function.
- Create `components/payment/PaymentSuccessCelebration.vue`: accessible Celebration Burst result overlay.
- Modify `pages/pricing.vue`: checkout submission, loading UI, redirect, and return-result consumption; preserve the user's existing price edits.
- Modify `utils/locales/en.json`, `zh.json`, `de.json`, `es.json`, and `ja.json`: checkout loading, invalid response, success, close, and cancellation copy.

### Task 1: Payment URL and Result Helpers

**Files:**
- Create: `tests/paymentCheckout.test.ts`
- Create: `utils/paymentCheckout.ts`
- Modify: `package.json`

- [ ] **Step 1: Install the test runner and expose a test script**

Run:

```bash
pnpm add -D vitest
```

Add this script to `package.json`:

```json
"test": "vitest run"
```

Expected: `vitest` is recorded in `devDependencies`, `pnpm-lock.yaml` is updated, and `pnpm test` is a valid command.

- [ ] **Step 2: Write failing helper tests**

Create `tests/paymentCheckout.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  buildCheckoutReturnUrls,
  getPaymentReturnState,
  getSafeCheckoutUrl,
  withoutPaymentFlag,
} from '../utils/paymentCheckout'

describe('buildCheckoutReturnUrls', () => {
  it('uses the current origin and localized pricing path', () => {
    expect(buildCheckoutReturnUrls('https://gptpix.ai', '/zh/pricing')).toEqual({
      checkoutSuccessUrl: 'https://gptpix.ai/zh/pricing?flag=true',
      checkoutCancelUrl: 'https://gptpix.ai/zh/pricing?flag=false',
    })
  })

  it('drops existing query parameters and hashes', () => {
    expect(buildCheckoutReturnUrls('http://localhost:3000', '/pricing?tab=monthly#plans'))
      .toEqual({
        checkoutSuccessUrl: 'http://localhost:3000/pricing?flag=true',
        checkoutCancelUrl: 'http://localhost:3000/pricing?flag=false',
      })
  })
})

describe('getSafeCheckoutUrl', () => {
  it('accepts only absolute HTTP and HTTPS URLs', () => {
    expect(getSafeCheckoutUrl('https://checkout.stripe.com/c/pay/test')).toBe('https://checkout.stripe.com/c/pay/test')
    expect(getSafeCheckoutUrl('http://localhost:4242/checkout')).toBe('http://localhost:4242/checkout')
    expect(getSafeCheckoutUrl('javascript:alert(1)')).toBeNull()
    expect(getSafeCheckoutUrl('/relative-checkout')).toBeNull()
    expect(getSafeCheckoutUrl('')).toBeNull()
  })
})

describe('payment return query helpers', () => {
  it('maps only true and false flag values', () => {
    expect(getPaymentReturnState('true')).toBe('success')
    expect(getPaymentReturnState('false')).toBe('cancelled')
    expect(getPaymentReturnState('other')).toBeNull()
    expect(getPaymentReturnState(undefined)).toBeNull()
  })

  it('removes only flag and preserves unrelated query values', () => {
    expect(withoutPaymentFlag({ flag: 'true', campaign: 'summer', ref: ['a', 'b'] }))
      .toEqual({ campaign: 'summer', ref: ['a', 'b'] })
  })
})
```

- [ ] **Step 3: Run the tests and verify RED**

Run:

```bash
pnpm test tests/paymentCheckout.test.ts
```

Expected: FAIL because `../utils/paymentCheckout` does not exist.

- [ ] **Step 4: Add the minimal helper implementation**

Create `utils/paymentCheckout.ts`:

```ts
export type PaymentReturnState = 'success' | 'cancelled'

export const buildCheckoutReturnUrls = (origin: string, routePath: string) => {
  const pathname = new URL(routePath, origin).pathname
  return {
    checkoutSuccessUrl: new URL(`${pathname}?flag=true`, origin).toString(),
    checkoutCancelUrl: new URL(`${pathname}?flag=false`, origin).toString(),
  }
}

export const getSafeCheckoutUrl = (value: unknown) => {
  if (typeof value !== 'string' || !value) return null
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null
  } catch {
    return null
  }
}

export const getPaymentReturnState = (flag: unknown): PaymentReturnState | null => {
  if (flag === 'true') return 'success'
  if (flag === 'false') return 'cancelled'
  return null
}

export const withoutPaymentFlag = <T extends Record<string, unknown>>(query: T) => {
  const { flag: _flag, ...rest } = query
  return rest
}
```

- [ ] **Step 5: Run the focused tests and verify GREEN**

Run:

```bash
pnpm test tests/paymentCheckout.test.ts
```

Expected: 5 tests PASS.

- [ ] **Step 6: Commit the helpers and tests**

```bash
git add package.json pnpm-lock.yaml tests/paymentCheckout.test.ts utils/paymentCheckout.ts
git commit -m "test: define payment checkout URL behavior"
```

### Task 2: Typed Checkout API

**Files:**
- Modify: `api/user/index.ts`

- [ ] **Step 1: Add checkout contracts**

Add after `LoginData` in `api/user/index.ts`:

```ts
export interface PaymentCheckoutRequest {
  planId: number
  paymentProvider: 'stripe'
  checkoutSuccessUrl: string
  checkoutCancelUrl: string
}

export interface PaymentCheckoutResult {
  orderNo: string
  paymentProvider: string
  paymentMode: string
  checkoutUrl: string
}
```

- [ ] **Step 2: Add the typed request function**

Add after `getUser`:

```ts
export const createPaymentCheckout = (data: PaymentCheckoutRequest) => {
  const request = useRequest()
  return request<ApiResponse<PaymentCheckoutResult>>('/user/payment/checkout', {
    method: 'POST',
    body: data,
  })
}
```

Do not catch errors here: the request plugin already presents transport and business errors, while the page must reset loading in `finally`.

- [ ] **Step 3: Verify type generation/build**

Run:

```bash
pnpm exec nuxt typecheck
```

Expected: exit 0. If Nuxt reports that `vue-tsc` or `typescript` is missing, install the exact requested development dependency and rerun the command.

- [ ] **Step 4: Commit the API contract**

```bash
git add api/user/index.ts package.json pnpm-lock.yaml
git commit -m "feat: add payment checkout API"
```

### Task 3: Celebration Burst Overlay

**Files:**
- Create: `components/payment/PaymentSuccessCelebration.vue`
- Modify: `utils/locales/en.json`
- Modify: `utils/locales/zh.json`
- Modify: `utils/locales/de.json`
- Modify: `utils/locales/es.json`
- Modify: `utils/locales/ja.json`

- [ ] **Step 1: Add localized payment-result strings**

Add this structure inside each locale's existing `pricing` object, translating values into that locale:

```json
"checkout": {
  "loading": "Opening secure checkout…",
  "invalidUrlTitle": "Checkout unavailable",
  "invalidUrlMessage": "The payment provider did not return a valid checkout link. Please try again.",
  "successTitle": "Payment successful!",
  "successMessage": "Your subscription is ready. Thanks for choosing GPTPix.",
  "close": "Continue",
  "cancelledTitle": "Payment not completed",
  "cancelledMessage": "Checkout was cancelled. You have not been charged."
}
```

- [ ] **Step 2: Create the success component**

Create `components/payment/PaymentSuccessCelebration.vue` with this public contract and structure:

```vue
<script setup lang="ts">
defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
const { t } = useAppI18n()
const confetti = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  x: `${8 + ((index * 37) % 84)}%`,
  delay: `${(index % 7) * 70}ms`,
  duration: `${1100 + (index % 5) * 130}ms`,
  rotate: `${(index * 47) % 180}deg`,
}))

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && open) emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="payment-celebration">
      <div v-if="open" class="celebration-backdrop" role="dialog" aria-modal="true" :aria-labelledby="'payment-success-title'">
        <div class="celebration-rays" aria-hidden="true" />
        <span
          v-for="piece in confetti"
          :key="piece.id"
          class="confetti"
          :style="{ left: piece.x, animationDelay: piece.delay, animationDuration: piece.duration, transform: `rotate(${piece.rotate})` }"
          aria-hidden="true"
        />
        <section class="success-card">
          <div class="success-check" aria-hidden="true">✓</div>
          <h2 id="payment-success-title">{{ t('pricing.checkout.successTitle') }}</h2>
          <p>{{ t('pricing.checkout.successMessage') }}</p>
          <button type="button" autofocus @click="emit('close')">{{ t('pricing.checkout.close') }}</button>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
```

Complete the scoped CSS using the approved A visual: fixed dark backdrop, centered dark card, yellow radial glow, rotating/expanding rays, spring checkmark entrance, and falling confetti. Add `@media (prefers-reduced-motion: reduce)` that disables every animation and transition while retaining all content and controls.

- [ ] **Step 3: Run locale parsing and production compilation**

Run:

```bash
node -e "for (const file of ['en','zh','de','es','ja']) JSON.parse(require('fs').readFileSync('utils/locales/'+file+'.json','utf8'))"
pnpm build
```

Expected: both commands exit 0 with no invalid JSON or Vue compilation errors.

- [ ] **Step 4: Commit the result UI**

```bash
git add components/payment/PaymentSuccessCelebration.vue utils/locales/en.json utils/locales/zh.json utils/locales/de.json utils/locales/es.json utils/locales/ja.json
git commit -m "feat: add payment success celebration"
```

### Task 4: Pricing Page Checkout Orchestration

**Files:**
- Modify: `pages/pricing.vue`
- Test: `tests/paymentCheckout.test.ts`

- [ ] **Step 1: Add imports and state without replacing existing price edits**

Import the API, helpers, and overlay:

```ts
import PaymentSuccessCelebration from '~/components/payment/PaymentSuccessCelebration.vue'
import { createPaymentCheckout } from '~/api/user'
import {
  buildCheckoutReturnUrls,
  getPaymentReturnState,
  getSafeCheckoutUrl,
  withoutPaymentFlag,
} from '~/utils/paymentCheckout'
```

Add state near the existing modal state:

```ts
const checkoutPlanId = ref<Plan['id'] | null>(null)
const paymentSuccessOpen = ref(false)
```

- [ ] **Step 2: Replace the placeholder subscription handler**

Replace `handleSubscribe` with:

```ts
const handleSubscribe = async (plan: Plan) => {
  if (!user.value) { loginOpen.value = true; return }
  if (checkoutPlanId.value || !import.meta.client) return

  checkoutPlanId.value = plan.id
  try {
    const returnUrls = buildCheckoutReturnUrls(window.location.origin, route.fullPath)
    const response = await createPaymentCheckout({
      planId: 1,
      paymentProvider: 'stripe',
      ...returnUrls,
    })
    const checkoutUrl = getSafeCheckoutUrl(response.data?.checkoutUrl)
    if (!checkoutUrl) {
      showTipToast({
        type: 'error',
        title: t('pricing.checkout.invalidUrlTitle'),
        message: t('pricing.checkout.invalidUrlMessage'),
      })
      return
    }
    window.location.assign(checkoutUrl)
  } finally {
    checkoutPlanId.value = null
  }
}
```

- [ ] **Step 3: Add result consumption on mount**

Add:

```ts
const consumePaymentReturn = async () => {
  const state = getPaymentReturnState(route.query.flag)
  if (!state) return

  if (state === 'success') paymentSuccessOpen.value = true
  else {
    showTipToast({
      type: 'info',
      title: t('pricing.checkout.cancelledTitle'),
      message: t('pricing.checkout.cancelledMessage'),
    })
  }

  await navigateTo({ path: route.path, query: withoutPaymentFlag(route.query) }, { replace: true })
}

onMounted(() => {
  syncCheckInState()
  void consumePaymentReturn()
})
```

Replace the existing single `onMounted(syncCheckInState)` registration so check-in synchronization runs only once.

- [ ] **Step 4: Wire loading and duplicate-click protection into both paid-plan button locations**

For the plan-card button and comparison-table button:

- disable paid buttons while `checkoutPlanId !== null`;
- keep existing free-plan disabled behavior intact;
- set `aria-busy="true"` only on the clicked paid plan;
- render `t('pricing.checkout.loading')` instead of the normal label only for the clicked plan;
- do not change Credit Packs behavior;
- preserve all price values already modified in the worktree.

Add the overlay before the existing `LoginModal`:

```vue
<PaymentSuccessCelebration :open="paymentSuccessOpen" @close="paymentSuccessOpen = false" />
```

- [ ] **Step 5: Run focused tests and build**

Run:

```bash
pnpm test tests/paymentCheckout.test.ts
pnpm build
git diff --check
```

Expected: helper tests pass, Nuxt builds successfully, and diff check reports no whitespace errors.

- [ ] **Step 6: Manually verify the browser flow**

Run:

```bash
pnpm dev
```

Verify:

1. Logged-out paid-plan click opens the login modal and sends no checkout request.
2. Logged-in click sends `planId: 1`, `paymentProvider: "stripe"`, and current-origin localized return URLs.
3. Repeated clicks during the request create only one checkout.
4. A valid `checkoutUrl` redirects; an invalid URL stays on-page and shows an error.
5. `/zh/pricing?flag=true` plays Celebration Burst, cleans `flag`, and closes by button or Escape.
6. `/pricing?flag=false` shows only the cancellation toast and cleans `flag`.
7. Other query values survive cleanup.
8. Mobile layout and reduced-motion mode remain usable.

- [ ] **Step 7: Commit the integration without absorbing unrelated pricing edits**

Review `git diff pages/pricing.vue` and stage the complete file only after confirming the user's pre-existing price changes remain intact and are not reverted. Then commit:

```bash
git add pages/pricing.vue
git commit -m "feat: connect pricing plans to checkout"
```

### Task 5: Final Verification

**Files:**
- Verify all changed files.

- [ ] **Step 1: Run the full verification suite from a clean command invocation**

```bash
pnpm test
pnpm build
git diff --check HEAD
git status --short
```

Expected: all tests pass, the production build exits 0, no whitespace errors appear, and status contains only intentionally untracked visual-companion artifacts or the user's unrelated changes.

- [ ] **Step 2: Review the final diff against the design**

Confirm the final implementation includes all of the following: temporary `planId: 1`, Stripe provider, dynamic current-origin/localized return URLs, safe redirect validation, per-request loading protection, Celebration Burst success overlay, concise cancellation feedback, flag-only query cleanup, reduced-motion support, and no Credit Packs checkout changes.

