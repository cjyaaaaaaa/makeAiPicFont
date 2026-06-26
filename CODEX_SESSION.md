# Codex Session Notes

## Workflow Preference

- Before making future project changes, read this file first.
- Keep implementation notes concise and focused on files changed, verification, and remaining limits.

## Current Homepage Direction

- Overall theme is dark, using `#15161a` as the shared page/header background.
- Primary accent/button color should stay orange/red (`#ef4d2c` family), not blue.
- Homepage hero uses particle motion and a dark AI generation panel.
- The editing cases section sits directly below the homepage hero.
- Homepage sections should use the existing `useI18n()` / `utils/locales/*.json` logic; avoid hard-coded user-facing labels when possible.
- Page images should use the shared `useLazyImage()` composable for `loading`, `decoding`, `src`, and `alt` bindings where practical.

## Current Requested Changes

- Header should not be fully transparent; it should use the same background color as the homepage.
- `EditingCasesSection` cards should support clicking thumbnails to switch the displayed image/active state.
- Large desktop layouts should be wider so more content is visible.
- Overall page/container width has been widened to `1720px`; keep future homepage sections aligned with that width unless there is a specific reason not to.
- Editing case labels, CTA text, tabs, tags, and accessible thumbnail labels should be multilingual.
- `ModelsSection` is added below `EditingCasesSection`, uses multilingual model data, and follows the wide `1720px` homepage layout.
- `InspirationSection` is added below `ModelsSection`; it uses `useLazyImage()`, multilingual text/alt data, a dark masonry gallery, image/video tabs, and bottom CTA.
- `InspirationSection` image cards use `<NuxtImg>` plus a local compatibility wrapper at `components/NuxtImg.vue` because `@nuxt/image` is not installed in this Nuxt 3 project.
- For `InspirationSection`, large cards show richer prompt text; small cards keep the overlay compact. `promptAction` has explicit DE/ES/JA keys to avoid rendering raw translation keys.
- `CreationPossibilitiesSection` is added below `InspirationSection`; it uses `<NuxtImg>`, `useLazyImage()`, multilingual `home.creation` content, wide `1720px` layout, and an English fallback array for legacy locales.
- `PromptTemplatesSection` is added below `CreationPossibilitiesSection`; it uses `<NuxtImg>`, `useLazyImage()`, multilingual `home.promptTemplates` content, category tabs, horizontal card rail, and template hover action.
- `AudienceSection` is added below `PromptTemplatesSection`; it uses multilingual `home.audience` content, a dark 3-column card grid, inline SVG icons, orange/red accent styling, wide `1720px` layout, and an English fallback array for legacy locales.
- `FinalPromptSection` is added below `AudienceSection`; it uses multilingual `home.finalPrompt` content for ZH/EN/DE/ES/JA, a dark star-field CTA layout, capability tags, and a prompt input with orange/red action button.
- `SiteFooterSection` is added below `FinalPromptSection`; it uses multilingual `home.footer` content for ZH/EN/DE/ES/JA, a dark 1720px footer layout, brand copy, company/product/resource links, locale switching for supported languages, copyright, and slogan text.
- API requests are centralized in `plugins/request.ts`; every request should include `X-site: gptpix.ai`, `Accept-Language` from `useI18n().locale`, and `Authorization: Bearer <token>` when a token exists. Login stores the token, then loads `/user/profile` into the shared `useUser()` state.
- `LoginModal` register flow sends email verification codes through `sendEmailCodeController` at `/user/auth/email/code` with `purpose: "user_register"`; reset password uses `purpose: "user_reset_password"`; the resend countdown starts only after a successful API response and shows localized success/error toasts.
- `LoginModal` now has three auth states: email login (`/user/auth/email/login`), email registration (`/user/auth/email/register` with `email`, `code`, `password`, `nickName`), and password reset (`/user/auth/email/reset-password` with `email`, `code`, `newPassword`).
- Auth API wrappers should absorb backend failures where possible and expose simple results to the page layer; backend `msg` should be surfaced via the global request toast in `plugins/request.ts`.
- Fixed the login modal register switch: the “no account, register” action should call `switchToRegister`, and the register email-code button should call `sendEmailCode('user_register')`.
- `useUser()` stores `/user/profile` data in global `user.profile`; `AppHeader` now reads that state to show a user dropdown with email, credits, account settings, subscription, and a frontend-only sign out that clears token/user state.
- The product brand is now `gptpix.ai` globally. Header uses `/gptpix-logo.svg`, `common.siteName` is `gptpix.ai`, and `auth.login` is defined for supported locales so the header never renders the raw translation key.
- Login now uses `useUser().loginWithToken(token)` for email, register, and Google flows: token is saved, `/user/profile` must load successfully, and only then is the user considered signed in. Logout clears token-related localStorage/sessionStorage/cookie entries and resets user state.
- API success checks now coerce backend `code` with `Number(code) === 200`, so string/number `200` responses are both accepted. Auth token extraction supports `{ data: { token } }`, direct token fields, and direct string token payloads.
- `LoginModal` must not destructure `loginWithEmailController()` as `{ token }` because that wrapper returns a token string. The modal now resolves auth token shapes defensively before calling `loginWithToken`.
- Profile loading after login now uses the in-memory `user.token` state as well as storage/cookie, so `/user/profile` receives the freshly written token immediately. `fetchUser` also safely handles unexpected response shapes before storing `user.profile`.
- Google login now stays on the current page using Google Identity Services OAuth popup (`google.accounts.oauth2.initTokenClient`). `AppHeader` requests a Google access token from the custom Google button, sends it as `credential` to `/user/auth/third-party/login`, then calls `useUser().loginWithToken()` to store the token and load `/user/profile`. If the backend rejects the token, the global request toast should show the backend `msg` instead of an extra generic login failure toast.
- Language switching now uses a globe icon in the header and is backed by `@nuxtjs/i18n` with `strategy: "prefix_except_default"`; English is the default root route and non-default locales use paths like `/zh`, `/de`, `/es`, and `/ja`. Business copy still comes from `useAppI18n()` / `utils/locales/*.json`, synchronized to the Nuxt i18n route locale.
- Model cards and creation showcase visuals now open `CreativePreviewModal`, a dark preview dialog with large media, close/download buttons, prompt expand/collapse, settings rows, zoom pill, and a try-prompt action.
