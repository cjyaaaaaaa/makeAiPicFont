# Payment Checkout Design

## Goal

Connect the paid subscription buttons on the pricing page to the payment checkout API, redirect the browser to the returned Stripe checkout URL, and present an appropriate result when Stripe redirects back to the localized pricing page.

## Scope

- Connect the Starter, Pro, and Ultra monthly subscription buttons.
- Send `planId: 1` for every paid plan until the backend plan mapping is finalized.
- Send `paymentProvider: "stripe"`.
- Build success and cancel URLs from the current browser origin and the current localized pricing route.
- Redirect to the API response's `checkoutUrl`.
- Show the approved “Celebration Burst” success experience for `flag=true`.
- Show a concise cancellation notice for `flag=false`.
- Leave credit-pack purchasing unchanged.

## Architecture

### Payment API module

Add typed checkout request and response definitions alongside the existing user API functions. The checkout function posts to `/user/payment/checkout` through the existing `useRequest()` client so authorization, site, locale, business-error handling, and global request-error feedback remain consistent.

The page consumes only a normalized checkout result. A successful API response must contain a non-empty HTTP or HTTPS `checkoutUrl`; otherwise the checkout attempt is treated as failed and the browser remains on the pricing page.

### Pricing page orchestration

The pricing page owns the user action because it already owns authentication gating and the plan cards. Each paid plan calls the same checkout handler with the clicked plan, while the temporary backend payload always uses `planId: 1`.

The page tracks the plan currently submitting. During submission, all paid subscription controls are protected from duplicate checkout creation, and the clicked plan visibly indicates loading. Login behavior remains unchanged: unauthenticated users see the existing login modal and no checkout request is made.

On a successful response, the page redirects with `window.location.assign(checkoutUrl)`. On request failure or invalid response data, it remains in place and relies on the established toast system for a concise error message.

### Dynamic redirect URLs

Both return URLs are derived in the browser from `window.location.origin` and the current localized pricing path. Existing query parameters and hashes are not copied into checkout return URLs.

Examples:

- `/zh/pricing` produces `<origin>/zh/pricing?flag=true` and `<origin>/zh/pricing?flag=false`.
- `/pricing` produces `<origin>/pricing?flag=true` and `<origin>/pricing?flag=false`.

This keeps development, preview, and production hosts correct without hard-coded domains and preserves the user's current locale.

## Payment Result Experience

### Success

When the pricing page mounts with `flag=true`, it displays a full-screen, accessible modal overlay in the approved “Celebration Burst” style:

- dark translucent backdrop consistent with the pricing page;
- yellow radial glow and expanding light rays;
- animated checkmark entrance;
- short-lived yellow, white, and accent-colored confetti;
- a clear success heading and confirmation message;
- an explicit close action.

The animation settles into a stable success card rather than disappearing automatically. Users with `prefers-reduced-motion: reduce` receive the same message as a static card without burst or confetti motion.

### Cancelled or incomplete

When the page mounts with `flag=false`, it shows a simple warning toast explaining that payment was cancelled or not completed. This state must not claim that the payment provider reported a technical failure.

### Query cleanup

After the result has been consumed, the page removes only the `flag` parameter with router replacement and preserves all unrelated query parameters. This prevents refreshes or later navigation from replaying the result. The success modal remains open through its own local state after cleanup until the user closes it.

## Data Flow

1. An authenticated user clicks a paid subscription button.
2. The page builds localized success and cancel URLs from the current URL.
3. The page posts the checkout payload with temporary `planId: 1` and provider `stripe`.
4. The API returns an order and `checkoutUrl`.
5. The browser navigates to the validated checkout URL.
6. Stripe redirects to the supplied pricing URL with `flag=true` or `flag=false`.
7. The pricing page displays the matching result and removes the consumed flag from the address bar.

## Error Handling and Safety

- Do not create checkout for unauthenticated users.
- Prevent repeated clicks while a checkout request is pending.
- Validate that `checkoutUrl` uses HTTP or HTTPS before navigation.
- Never redirect when response data is absent or malformed.
- Reset loading state when checkout creation fails.
- Use the existing request plugin and toast system so API and transport errors follow current application behavior.
- Do not treat a cancelled checkout as confirmed payment failure.

## Testing

Automated tests will cover pure checkout helpers where supported by the current project setup:

- localized success and cancel URL construction;
- rejection of missing or unsafe checkout URLs;
- result-flag interpretation and query cleanup behavior.

Project verification will include the Nuxt production build plus manual checks for authenticated/unauthenticated clicks, duplicate-click protection, checkout redirect, localized return paths, success animation, cancellation toast, responsive layout, and reduced-motion behavior.

