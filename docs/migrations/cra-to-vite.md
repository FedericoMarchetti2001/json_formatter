# Migration track: Create React App -> Vite (+ Vitest)

Status: **in progress** (1/9 steps) | Last updated: 2026-10-23

## Goal
Replace `react-scripts` 5 (unmaintained) with Vite + Vitest, keeping all features, env vars (`REACT_APP_*` -> `VITE_*`),
i18n HTTP loading from `/locales`, the PWA manifest, Vercel/Nepcha analytics and every existing test.

## Baseline (2026-10-23, `main`)
- No `package-lock.json` is committed (gitignored: `.gitignore:24`), so `npm ci` fails on a clean checkout; Vercel runs `npm install`.
  Recorded, not changed here. A lockfile decision is step 2.
- `src/` has no `REACT_APP_*` / `process.env` usage (grep), so env var renaming is mostly a no-op today; `%PUBLIC_URL%` is used in `public/index.html` (icon, apple-touch-icon, manifest).
- Tests: Jest via `react-scripts test` with `src/setupTests.js`; CRA `resetMocks` is on, test mocks use plain functions. Stable green requires open PR #2 (test/lint/build fixes).
- `tsconfig.json`: `baseUrl: src`, `jsx: react`, `rootDir: ./src`, `allowJs`. Mixed JS (`App.js`, `index.js`, `i18n.js`, `sentences.js`, a few components) and TS.
- CRA-specific: `CI=true` turns warnings into build errors (Vercel). Vite has no such behavior; lint must stay a separate gate.
- Open PRs: #2 (src tests/lint, tsconfig.json, .eslintrc.json, AI_CONTEXT.md), #4 (docs, .prettierrc.json, .editorconfig, .nvmrc).
  Steps touching those files wait for #2 to merge.

## Decision record
- Vite + `@vitejs/plugin-react`; Vitest with `jsdom` and `globals: true` to keep Jest-style tests (`describe/it/expect`, `jest.fn` -> `vi.fn`).
- Output dir stays `build` (Vercel config unchanged); `base` stays `/`.
- Stay on React 18 / MUI 5 / react-router 6 (no dependency upgrades mixed in).
- Migrate in this order: add Vite alongside CRA, switch, then remove CRA, so each PR leaves `npm start`/`build` working.

## Checklist
- [x] 1. Write plan and baseline (docs only).
- [ ] 2. Decide lockfile policy (commit `package-lock.json`, drop gitignore line) so `npm ci` is reproducible. Needs user ack (affects Vercel install).
- [ ] 3. Add `vite`, `@vitejs/plugin-react`, `vite.config.ts` (outDir `build`, port 3000, public dir) and a root `index.html` copy; scripts `dev:vite`/`build:vite` next to CRA scripts. Needs #2 merged for stable baseline.
- [ ] 4. Rename entry/JSX: `src/index.js` -> `.jsx`/`.tsx` entry module for Vite, `%PUBLIC_URL%` -> `/` in the new `index.html`; add `vite-env.d.ts`; set `tsconfig` `jsx: react-jsx`, `moduleResolution: bundler`.
- [ ] 5. Add Vitest + jsdom config; port `setupTests.js`; convert `jest.*` calls to `vi.*` (batch 1: utils/core tests).
- [ ] 6. Port component tests (batch 2) and confirm test count matches Jest (29 tests / 8 suites per PR #2).
- [ ] 7. Switch scripts: `start`/`dev` -> vite, `build` -> `tsc --noEmit && vite build`, `test` -> `vitest run`; ensure Vercel analytics/Speed Insights + Nepcha script still load; compare `build/` output tree with CRA's.
- [ ] 8. Remove `react-scripts`, `eject`, `eslintConfig` CRA block, `react-app` ESLint presets (replace with explicit config), CRA-only types.
- [ ] 9. Docs: `AI_CONTEXT.md`, `CLAUDE.md` (commands/CI=true note), README, deploy-check skill.

## Verification gate per step
`npm install` (no lockfile yet), `npm run lint`, `CI=true npm test -- --watchAll=false`, `CI=true npm run build`; from step 3 also `vite build` and a browser smoke test.

## Manual checks for a human
Format valid/invalid JSON, switch en/de (translations load from `/locales`), change viewer theme, add/delete pages, reload (localStorage persistence),
achievement unlock + image viewer, sounds/voice toggles, manifest + favicon in the built site, Vercel preview deploy.

## Notes for next run
- If PR #2 merged: rebase, then do step 2 (needs the user's decision on committing a lockfile; if unanswered, skip to step 3 using `npm install`).
