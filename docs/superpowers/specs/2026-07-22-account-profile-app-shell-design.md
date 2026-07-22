# Account Profile App-Shell Alignment

**Date:** 2026-07-22  
**Status:** Approved direction (Approach 1)  
**Goal:** Make `/account/profile` visually consistent with `/ai-image-generator` by using the same app shell (sidebar only, no marketing header/footer, no outer max-width padding).

## Problem

`/account/profile` currently renders inside the marketing shell because `account` is not included in `app.vue`’s `isAppHome` check. That causes:

1. Top `AppHeader` and bottom `SiteFooterSection` appear together with `AppHomeSidebar`
2. Outer `main` uses `max-w-[1720px] px-4 md:px-6 lg:px-8`, nesting padding around an already full-bleed app layout
3. Left/right spacing looks uneven compared with `/ai-image-generator`

`/ai-image-generator` already uses the correct app shell: sidebar + full-width page content, background `#050505`, no header/footer.

## Approach

**Minimal fix (Approach 1):** treat `/account/*` as an app route in `isAppHome`. Keep the existing Profile internal layout (sidebar | Account nav column | form content). Do not redesign AI Image in this change.

## Scope

### In scope

- Update `app.vue` so routes under `account` use the app shell
- Confirm `/account/profile` matches `/ai-image-generator` shell behavior:
  - no `AppHeader`
  - no `SiteFooterSection`
  - `main` is `w-full` with no outer max-width/horizontal padding
- Keep `AppAccountProfileDashboard` structure:
  - `AppHomeSidebar` (288px / collapsed 84px)
  - Account aside (`#101012`, right border, `22px` horizontal padding)
  - Content area with profile form card

### Out of scope

- Redesigning AI Image / AI Video composer layouts
- Building a shared App Shell component abstraction
- Billing page implementation
- Profile save/upload API wiring
- Changing Profile form fields or copy

## Architecture

```text
app.vue
  isAppHome === true for account/*
    → hide AppHeader + SiteFooterSection
    → main: w-full (no max-w / px)

pages/account/profile.vue
  → AppAccountProfileDashboard

AppAccountProfileDashboard
  [AppHomeSidebar] | [Account aside] | [Profile content]
```

## Implementation Notes

1. In `app.vue`, extend `isAppHome` so `firstAppSegment === 'account'` returns true (locale-prefixed paths already handled by existing segment logic).
2. No change required to `pages/ai-image-generator.vue` for shell behavior.
3. Only adjust `AppAccountProfileDashboard` spacing if, after the shell fix, gutters still visibly diverge from AI Image; prefer matching existing tokens (`px-[22px]` aside, content `32px 28px`).

## Acceptance Criteria

- Visiting `/account/profile` (and locale variants like `/zh/account/profile`) shows no top marketing header and no site footer
- No double horizontal padding from `app.vue` around the dashboard
- Visual shell matches `/ai-image-generator`: left app sidebar, full-bleed dark workspace
- Existing Profile / Billing nav and form remain functional
- `/ai-image-generator` behavior unchanged

## Risks

- Other future `/account/*` pages will also enter the app shell; that is intentional and desirable for consistency
- If any account page was relying on the marketing header, it will lose it; currently only Profile exists and it already embeds `AppHomeSidebar`
