# Account Billing Design

## Goal

Add an authenticated `/account/billing` page that matches the existing `/account/profile` application-shell layout, lists the current user's payment orders with server pagination, and fetches full order details into an on-demand modal.

## Selected Approach

Create a focused billing dashboard and detail modal while retaining the current profile component. This avoids a broad account-layout refactor while the account worktree files are still being developed, and keeps the payment-order feature isolated. The new dashboard will deliberately mirror the existing account shell class structure and visual values.

Alternatives considered were refactoring profile and billing into a shared account-shell component, which introduces unnecessary risk to ongoing profile work, and rendering both tabs inside one route-driven component, which couples unrelated profile editing and billing-fetch state.

## Routes and Navigation

- Add `pages/account/billing.vue` backed by `AppAccountBillingDashboard`.
- Change the Billing item on the account profile page from `/pricing` to `/account/billing`.
- The billing page's Profile item links back to `/account/profile`, while Billing is active.
- Navigation paths preserve the active locale prefix. English uses `/account/...`; `zh`, `de`, `es`, and `ja` use `/<locale>/account/...`.
- The app-level sidebar and login handling remain the same as the profile page.

## API Contracts

### Order list

Add a typed `getPaymentOrders` function in `api/user/index.ts`:

- Method: `GET`
- Path: `/user/payment/orders`
- Query: `pageNum` and `pageSize`
- Actual response shape: `{ total: number, rows: CustomerPaymentOrder[], code: number | string, msg: string }`

The page uses `pageSize: 10`. The API result is normalized defensively: non-array `rows` becomes an empty list and invalid `total` becomes zero.

### Order detail

Add a typed `getPaymentOrderDetail(orderNo)` function:

- Method: `GET`
- Path: `/user/payment/order/{encoded orderNo}`
- Response shape: the existing `{ code, msg, data }` wrapper with one `CustomerPaymentOrder`.

Only an order selected from the authenticated user's list is requested. The order number is URL-encoded before being interpolated into the path.

### Shared order type

`CustomerPaymentOrder` contains `orderNo`, `planId`, `planName`, `billingType`, `amountCent`, `currency`, `creditAmount`, `orderStatus`, optional `subscriptionId`, `payTime`, `deliverTime`, and `createTime`. Time fields are nullable because pending and failed orders may not have payment or delivery timestamps.

## Billing Table

The right-side account panel contains:

- title, explanatory subtitle, and total order count;
- responsive table with order number, plan, amount, credits, status, created date, and Details action;
- server-backed pagination showing the visible range, numbered page buttons, and previous/next actions;
- first-load skeleton rows;
- centered empty state when there are no orders;
- retry state when loading fails.

Amounts are formatted from cents with `Intl.NumberFormat`, using the order currency. Dates use the current app locale and show `—` when absent. Long order numbers are shortened visually while the full value remains available as a title/accessible label.

Status badges map backend values as follows:

- `success`: green Completed badge;
- `created`: yellow Pending badge;
- `failed`: red Failed badge;
- unknown values: neutral badge using the raw status.

Changing pages triggers one new list request, scrolls the table panel into view, and disables pagination controls while loading. The current page is corrected if a response total makes it exceed the last page.

## Order Detail Modal

Clicking Details opens a modal loading state and calls the detail endpoint for that order. The final modal contains:

- plan name and complete order number;
- large formatted amount and status badge;
- credits, billing type, subscription ID, plan ID, created time, paid time, and delivery time;
- close icon and full-width Done action.

The modal uses the approved dark card, yellow accent, low-contrast borders, and grouped detail grid. It closes through the close icon, Done, backdrop click, or Escape. Focus moves into the modal when opened and returns to the triggering Details button when closed. Reduced-motion users receive no entrance animation.

If the detail request fails, the modal stays open and shows a compact retry state instead of stale list-row data. Rapid repeated clicks are ignored while a detail request is active.

## Authentication and Errors

- On mount, initialize the user exactly as the profile page does.
- If no token is available, show the existing LoginModal and do not request orders.
- A 401 response reopens LoginModal.
- Other request and business errors use the existing global request toast; the billing panel additionally exposes a retry action.
- A successful login/user initialization triggers the first list request.

## Responsive Behavior

- Desktop retains the application sidebar, account navigation column, and wide content panel.
- The billing content panel is wider than profile to accommodate the table while maintaining the same visual shell.
- Tablet narrows the account navigation and lets the table scroll horizontally.
- Mobile stacks the account navigation above the panel, keeps pagination touch targets large, and displays modal fields in one column.

## Testing and Verification

Automated tests cover pure payment-order presentation helpers:

- cents and currency formatting;
- status mapping, including unknown status;
- page-count/range calculation;
- absent date values.

Implementation verification includes a Node 22 production build and manual checks for authentication gating, first load, empty/error states, all status colors, page changes using `{ total, rows }`, detail request timing, modal retry/close/focus behavior, locale-preserving navigation, responsive table scrolling, and reduced motion.

