# Current Subscription Design

## Goal

Add a third account navigation tab named Current Subscription. The new `/account/subscription` page retrieves the signed-in user's current subscription and lets the user open Stripe Customer Portal to manage or cancel it.

## Selected Approach

Use a dedicated account route alongside Profile and Billing. This matches the navigation requested by the user and keeps subscription lifecycle state separate from payment-order history. Alternatives considered were an inner Billing tab, which conflicts with the requested left navigation, and a modal launched from Billing, which makes current subscription information harder to revisit or link to directly.

## Navigation and Route

- Add Current Subscription after Billing in the left account navigation on Profile, Billing, and Subscription pages.
- Add `pages/account/subscription.vue` backed by `AppAccountSubscriptionDashboard`.
- English path is `/account/subscription`; supported non-English locales use `/<locale>/account/subscription`.
- Profile and Billing links remain locale-aware.
- The global application sidebar and account authentication behavior remain unchanged.

## Current Subscription API

Add `getCurrentSubscription()` to `api/user/index.ts`:

- Method: `GET`
- Path: `/user/subscription/current`
- Response: existing `ApiResponse<CustomerUserSubscription | null>` wrapper.

`CustomerUserSubscription` contains subscription and plan IDs, plan name, payment provider, status, current-period start/end, cancellation and expiration timestamps, credits per period, and creation time. All timestamps except `createTime` are treated as nullable because their availability depends on lifecycle status. A null `data` value represents no current subscription.

The page requests this endpoint only after authentication. It includes first-load skeleton, error with retry, and no-subscription states. A 401 opens the existing LoginModal; other errors continue through the global request error handling and also expose an inline retry.

## Subscription Presentation

The page mirrors the Account Profile and Billing shell and contains:

- title, subtitle, and status badge;
- highlighted plan card with plan name, payment provider, and credits per period;
- current-period start and end dates;
- period progress bar and remaining-days text when both dates are valid;
- subscription ID, plan ID, creation date, cancellation date, and expiration date as applicable;
- management footer explaining that cancellation and payment methods are handled by Stripe.

Status presentation:

- `active`: green Active badge and normal period progress;
- `cancelled` or `canceled`: amber Cancelled badge plus cancellation/period-end information;
- `expired`: neutral/red Expired badge plus expiration date;
- other values: neutral badge showing the backend status.

The period progress is clamped from 0% to 100%. Invalid or absent dates render an em dash and hide the progress calculation instead of throwing.

## No Subscription State

When `data` is null, the page shows a centered, calm empty state explaining that there is no active subscription. A View plans button routes to the locale-aware pricing page. The Stripe Portal button is not shown because a customer portal session may not exist without a subscription/customer record.

## Stripe Customer Portal

Add `createStripePortalSession()`:

- Method: `GET`
- Path: `/user/payment/stripe/portal`
- Response: `ApiResponse<CustomerPortalSession>` containing `paymentProvider` and `portalUrl`.

The Manage subscription button:

1. prevents duplicate clicks and displays a loading label;
2. calls the portal endpoint;
3. accepts only an absolute HTTP or HTTPS `portalUrl`;
4. redirects with `window.location.assign(portalUrl)` when valid;
5. stays on-page and displays an error toast when absent or unsafe;
6. reopens LoginModal on 401.

The button remains available for active, cancelled, and expired subscriptions so the user can inspect Stripe billing information. The frontend does not claim that clicking the button directly cancels a subscription; cancellation is completed in Stripe Portal.

## Responsive and Accessible Behavior

- Desktop preserves the app sidebar, three-item account navigation, and centered subscription panel.
- Tablet stacks account navigation above the panel.
- Mobile stacks summary fields and management footer, and makes action buttons full-width.
- Status is communicated by text and color.
- Loading states use `aria-busy`; errors use alert semantics.
- Progress uses a labeled progress element or equivalent progressbar semantics.
- Reduced-motion mode disables card and progress transitions.

## Testing and Verification

Automated tests cover pure subscription helpers:

- status-to-tone mapping;
- valid and invalid period progress;
- progress clamping before/after the current period;
- remaining-day calculation;
- safe Stripe Portal URL validation.

Verification includes the complete existing payment test suite, Node 22 production build, and manual checks for authentication, API loading/error/null states, each subscription status, locale-aware navigation, duplicate portal protection, safe redirect behavior, responsive layout, keyboard navigation, and reduced motion.

