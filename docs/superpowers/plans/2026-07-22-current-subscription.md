# Current Subscription Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a third locale-aware Current Subscription account tab that displays subscription lifecycle information and safely opens Stripe Customer Portal.

**Architecture:** Keep date/status/progress and safe-URL behavior in a pure tested utility, add typed current-subscription and portal endpoints to the existing user API module, and implement the feature as a focused account dashboard matching Profile and Billing. Reuse the existing authentication, request, toast, and application-sidebar patterns.

**Tech Stack:** Nuxt 3, Vue 3 Composition API, TypeScript, SCSS, Vitest.

---

### Task 1: Subscription Helpers with TDD

**Files:**
- Create: `tests/userSubscription.test.ts`
- Create: `utils/userSubscription.ts`

- [ ] **Step 1: Write failing tests**

Test known/unknown status tones, period progress at the midpoint, progress clamping before and after a period, invalid dates returning null progress, remaining days, and rejection of relative or non-HTTP portal URLs.

```ts
import { describe, expect, it } from 'vitest'
import { getSubscriptionStatus, getPeriodProgress, getRemainingDays, getSafePortalUrl } from '../utils/userSubscription'

describe('subscription status', () => {
  it('maps lifecycle statuses to visual tones', () => {
    expect(getSubscriptionStatus('active')).toEqual({ key: 'active', tone: 'active' })
    expect(getSubscriptionStatus('cancelled')).toEqual({ key: 'cancelled', tone: 'cancelled' })
    expect(getSubscriptionStatus('canceled')).toEqual({ key: 'cancelled', tone: 'cancelled' })
    expect(getSubscriptionStatus('expired')).toEqual({ key: 'expired', tone: 'expired' })
    expect(getSubscriptionStatus('paused')).toEqual({ key: 'paused', tone: 'neutral' })
  })
})

describe('subscription period', () => {
  it('calculates and clamps period progress', () => {
    expect(getPeriodProgress('2026-06-01 00:00:00', '2026-07-01 00:00:00', new Date('2026-06-16T00:00:00'))).toBe(50)
    expect(getPeriodProgress('2026-06-01 00:00:00', '2026-07-01 00:00:00', new Date('2026-05-01T00:00:00'))).toBe(0)
    expect(getPeriodProgress('2026-06-01 00:00:00', '2026-07-01 00:00:00', new Date('2026-08-01T00:00:00'))).toBe(100)
    expect(getPeriodProgress('bad', '2026-07-01 00:00:00')).toBeNull()
  })

  it('rounds remaining partial days up', () => {
    expect(getRemainingDays('2026-07-01 00:00:00', new Date('2026-06-29T12:00:00'))).toBe(2)
  })
})

describe('portal URL safety', () => {
  it('accepts only absolute HTTP and HTTPS URLs', () => {
    expect(getSafePortalUrl('https://billing.stripe.com/p/session/test')).toBe('https://billing.stripe.com/p/session/test')
    expect(getSafePortalUrl('/portal')).toBeNull()
    expect(getSafePortalUrl('javascript:alert(1)')).toBeNull()
  })
})
```

- [ ] **Step 2: Verify RED**

Run `pnpm test tests/userSubscription.test.ts`; expect module-not-found failure.

- [ ] **Step 3: Implement minimal helpers**

Create `utils/userSubscription.ts` with `getSubscriptionStatus`, a local backend-date parser, `getPeriodProgress` returning a rounded 0–100 number or null, `getRemainingDays` using `Math.ceil`, and `getSafePortalUrl` accepting only absolute HTTP/HTTPS URLs.

- [ ] **Step 4: Verify GREEN**

Run `pnpm test tests/userSubscription.test.ts`; expect 4 tests PASS.

### Task 2: Typed Subscription and Portal APIs

**Files:**
- Modify: `api/user/index.ts`

- [ ] **Step 1: Add response types**

```ts
export interface CustomerUserSubscription {
  subscriptionId: number
  planId: number
  planName: string
  paymentProvider: string
  status: string
  currentPeriodStart?: string | null
  currentPeriodEnd?: string | null
  cancelledAt?: string | null
  expiredAt?: string | null
  creditAmountPerPeriod: number
  createTime: string
}

export interface CustomerPortalSession {
  paymentProvider: string
  portalUrl: string
}
```

- [ ] **Step 2: Add endpoint functions**

```ts
export const getCurrentSubscription = () => {
  const request = useRequest()
  return request<ApiResponse<CustomerUserSubscription | null>>('/user/subscription/current')
}

export const createStripePortalSession = () => {
  const request = useRequest()
  return request<ApiResponse<CustomerPortalSession>>('/user/payment/stripe/portal')
}
```

- [ ] **Step 3: Run all tests**

Run `pnpm test`; expect 14 tests PASS across three files.

### Task 3: Navigation and Localized Copy

**Files:**
- Modify: `components/home/app/AppAccountProfileDashboard.vue`
- Modify: `components/home/app/AppAccountBillingDashboard.vue`
- Modify: `utils/locales/en.json`
- Modify: `utils/locales/zh.json`

- [ ] **Step 1: Extend account path types and navigation**

Allow `'subscription'` in both `accountPath` helpers. Add a third navigation item after Billing using a sparkle/cycle icon, `account.subscriptionCurrent` label, locale-aware `accountPath('subscription')`, and active state only on the new page.

- [ ] **Step 2: Add exact localized keys**

Add `account.subscriptionCurrent` (`Current subscription` / `当前订阅`) and `account.subscriptionPage` values for title, subtitle, plan label, status labels, provider, credits per period, period dates, remaining days, IDs, created/cancelled/expired dates, manage action/loading, portal error, no-subscription title/message, view plans, Stripe explanation, load failure, retry, and progress label.

- [ ] **Step 3: Validate JSON**

Parse all locale JSON files with Node; expect exit 0.

### Task 4: Current Subscription Dashboard

**Files:**
- Create: `components/home/app/AppAccountSubscriptionDashboard.vue`
- Create: `pages/account/subscription.vue`

- [ ] **Step 1: Add route entry**

Create the route wrapper importing `AppAccountSubscriptionDashboard`.

- [ ] **Step 2: Build the account shell**

Mirror Billing's app/sidebar/account navigation shell, set Current Subscription active, and preserve locale-aware Profile/Billing/Subscription links.

- [ ] **Step 3: Implement authenticated subscription loading**

After `initUser`, call `getCurrentSubscription` only when a token exists. Render skeleton, inline retry error, no-subscription pricing CTA, or subscription card. Reopen LoginModal on 401.

- [ ] **Step 4: Render lifecycle details**

Use tested helpers for status tone, current-period progress, and remaining days. Render plan/provider/credits, current period, IDs, creation time, and conditional cancellation/expiration dates. Use progressbar semantics and hide progress when dates are invalid.

- [ ] **Step 5: Implement Stripe Portal redirect**

Disable the Manage subscription button while requesting, call `createStripePortalSession`, validate `response.data.portalUrl` with `getSafePortalUrl`, and use `window.location.assign`. Show localized toast for invalid URLs and LoginModal for 401.

- [ ] **Step 6: Add responsive styling**

Match the approved dark/yellow design, stack data and action footer on mobile, show status text plus color, and disable transitions under reduced motion.

### Task 5: Verification

**Files:**
- Verify all subscription and existing payment files.

- [ ] **Step 1: Run final automated checks**

Using Node 22, run full Vitest, Nuxt production build, locale JSON parsing, and `git diff --check`. Expect 14 tests, successful build, valid JSON, and no whitespace errors.

- [ ] **Step 2: Manual acceptance**

Verify all three account tabs preserve locale, subscription API runs only after authentication, null/error/active/cancelled/expired states render, portal calls cannot duplicate, only safe URLs redirect, mobile layout stacks correctly, and reduced-motion/keyboard behavior remains usable.

