---
name: add-achievement
description: Add, change or remove a gamification achievement in JGoth Validator — definition, unlock trigger, image mapping, event dispatch from the UI, and tests. Use when the user mentions achievements, unlocks, badges, goth-girls images, or AchievementEvent.
---

# Add or change an achievement

All achievement logic lives in `src/config/achievements.ts`. Unlocks are dispatched from components that call `checkAchievements(event, unlockedIds, context)`.

## Before writing code — get from the user

1. **Image**: the user must supply the file (or explicitly name an existing image in `public/goth-girls/` to reuse). Never download, generate or rename images. If no image is given, stop and ask.
2. **Trigger**: which user action unlocks it, and any threshold (e.g. "10 formats").
3. **Name + description** (English). Optionally whether it is `isHidden`.

## Anatomy (all in `src/config/achievements.ts`)

| Piece | What to add |
|-------|-------------|
| `ACHIEVEMENTS` | `{ id: "snake_case_id", name, description, imageKey }` — keep the section comment grouping (Formatting / Customization / Interaction) |
| `ACHIEVEMENT_IMAGES` | `imageKey: "/goth-girls/<file>"` — the path must match the real filename and extension exactly (`.jpg` vs `.jpeg`) |
| `AchievementEvent` enum | Only if no existing event fits. Values are `UPPER_SNAKE = "UPPER_SNAKE"` |
| `ACHIEVEMENT_TRIGGERS` | `id: AchievementEvent.X` — without this the achievement can never unlock |
| `checkAchievements` switch | Add a `case`. Simple "did the action" achievements join the fall-through group that sets `unlocked = true`; conditional ones get their own case reading `context` |

If the condition needs new data, extend `AchievementContext` (all fields are read as `Partial`, so default with `?? 0` etc.).

## Dispatch from the UI

Existing call sites to copy from:
- `components/FormatterActions/FormatterActions.tsx` — format success/failure, language change
- `components/GothControlPanel.tsx` — import/export
- `components/Pagination/index.tsx` — add/delete page

A new event needs a `checkAchievements(...)` call where the action happens, then the same handling those sites use for `newlyUnlocked` (state update via props → toast → persisted through `localStorageHandler`). Don't add a second persistence path.

## Known quirks

- Achievement `name`/`description` are English literals, not i18n keys — keep it that way unless the user asks to translate achievements (then use the `i18n-sync` skill for both locales).
- `goth_page` and `goth_destroyer` reuse other images as placeholders; mention this if the user is supplying images anyway.
- Removing an achievement: unlocked ids persist in users' localStorage and exported files; make `checkAchievements` and the gallery tolerate unknown ids rather than crash.

## Tests

There is no `src/config/achievements.test.ts` yet; create it on first use. Test `checkAchievements` directly (pure function): unlocks on the right event, not on others, not when already unlocked, and threshold boundaries (`n-1` vs `n`). Also assert every `ACHIEVEMENTS[].imageKey` exists in `ACHIEVEMENT_IMAGES` and every id has a trigger.

## Finish

Run the `verify-and-document` skill (achievement list in `AI_CONTEXT.md` if one is described there).
