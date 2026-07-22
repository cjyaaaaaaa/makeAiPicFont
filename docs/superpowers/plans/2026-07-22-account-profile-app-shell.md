# Account Profile App-Shell Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/account/profile` use the same app shell as `/ai-image-generator` (no marketing header/footer, no outer max-width padding).

**Architecture:** Extend `app.vue` `isAppHome` so the first app path segment `account` is treated like other app routes. Profile dashboard layout stays as-is.

**Tech Stack:** Nuxt 3, Vue 3, existing `app.vue` route shell gating

## Global Constraints

- Match `/ai-image-generator` shell behavior exactly for `/account/*`
- Do not redesign AI Image / AI Video layouts
- Do not change Profile form fields, APIs, or Billing page
- Keep locale-prefixed routes working (`/zh/account/profile`, etc.)

---

## File Map

| File | Responsibility |
|------|----------------|
| `app.vue` | Decide marketing vs app shell via `isAppHome` |
| `docs/superpowers/specs/2026-07-22-account-profile-app-shell-design.md` | Approved design source |

---

### Task 1: Include `account` in app shell

**Files:**
- Modify: `app.vue` (`isAppHome` computed)
- Manual Test: `/account/profile`, `/ai-image-generator`, `/pricing`

**Interfaces:**
- Consumes: existing `route.path` segment parsing and `homeLocaleCodes`
- Produces: `isAppHome === true` when `firstAppSegment === 'account'`

- [ ] **Step 1: Update `isAppHome`**

In `app.vue`, add `account` to the app-shell segment check:

```ts
return (
  firstAppSegment === 'home' ||
  firstAppSegment === 'explore' ||
  firstAppSegment === 'assets' ||
  firstAppSegment === 'ai-image-generator' ||
  firstAppSegment === 'ai-video-generator' ||
  firstAppSegment === 'tools' ||
  firstAppSegment === 'account'
)
```

- [ ] **Step 2: Manual verify**

1. Open `/account/profile` — no top header, no footer, no outer page padding; sidebar full-bleed
2. Open `/ai-image-generator` — unchanged
3. Open `/pricing` — still has header/footer (marketing shell)

- [ ] **Step 3: Commit**

```bash
git add app.vue
git commit -m "$(cat <<'EOF'
fix: use app shell for account routes

EOF
)"
```
