# Tech debt

## Inventory
| # | Item | Severity | Effort |
|---|------|----------|--------|
| 1 | `genezio.yaml` still named `material-kit-react` (template leftover; renaming changes the Genezio project identity, so do it deliberately) | low | S |
| 2 | Duplicate `src/pages/Home/index.js` (re-export) next to `index.tsx` (704 lines); `components/JsonEditor.tsx` re-exports `JsonEditor/index.tsx` | med | S |
| 3 | `Home/index.tsx` is a 700-line component; split by responsibility | med | L |
| 4 | `any` in `src/utils/localStorageHandler.ts` | low | S |
| 5 | Six failing test suites on main; CI build fails on lint warnings (see health PRs) | high | M |
| 6 | Possibly unused: `@emotion/cache`, `@mui/styled-engine`, `@testing-library/user-event`, `prop-types` (verify before removal) | low | S |

## Log
- 2026-10-13: removed unused dependencies chroma-js, flatpickr, react-flatpickr, react-copy-to-clipboard, react-countup, react-syntax-highlighter, toastify, web-vitals (no imports in `src`).
