# Tech debt

## Inventory
| # | Item | Severity | Effort |
|---|------|----------|--------|
| 1 | `genezio.yaml` still named `material-kit-react` (template leftover; renaming changes the Genezio project identity, so do it deliberately) | low | S |
| 2 | Duplicate `src/pages/Home/index.js` (re-export) next to `index.tsx` (704 lines); `components/JsonEditor.tsx` re-exports `JsonEditor/index.tsx` | med | S |
| 3 | `Home/index.tsx` is a 700-line component; split by responsibility | med | L |
| 4 | `any` in `src/utils/localStorageHandler.ts` | low | S |
| 6 | Possibly unused: `@emotion/cache`, `@mui/styled-engine`, `@testing-library/user-event`, `prop-types` (verify before removal) | low | S |
| 7 | `public/index.html` `og:image`/`twitter:image` point to `/og/jgoth-validator.og.png`, but `public/og/` does not exist (broken social previews) | med | S |
| 8 | No tests for core modules: `src/core/json-validator.ts`, `src/config/achievements.ts`, `src/utils/localStorageHandler.ts` | med | M |

## Log
- 2026-10-13: removed unused dependencies chroma-js, flatpickr, react-flatpickr, react-copy-to-clipboard, react-countup, react-syntax-highlighter, toastify, web-vitals (no imports in `src`).
- 2026-10-13: renamed `public/goth-girls/gpth5.jpg` to `goth5.jpg` (and its `imageKey`/path in `src/config/achievements.ts`).
- 2026-10-13: added `CLAUDE.md` and project skills in `.claude/skills/`; re-checked inventory (item 5 now a single empty suite; added items 7 and 8).
- 2026-10-28: rewrote stale `GothControlPanel.test.tsx` as a real suite (item 5 resolved; `npm test` green).
