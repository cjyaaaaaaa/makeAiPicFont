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
