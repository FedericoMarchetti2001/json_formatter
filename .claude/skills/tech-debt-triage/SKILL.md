---
name: tech-debt-triage
description: Audit, prioritise and pay down technical debt in JGoth Validator using docs/TECH_DEBT.md as the backlog — re-check existing items, find new ones, and fix one item at a time with a verified, minimal diff. Use for "tech debt", "refactor", "cleanup", "code health", "what should we fix next", or splitting the Home container.
---

# Tech-debt triage

`docs/TECH_DEBT.md` is the single backlog: an **Inventory** table (`# | Item | Severity | Effort`) and a dated **Log**. Keep that format.

## Mode A — Audit (read-only, when asked "what should we fix?")

1. Re-verify every inventory item still exists (grep / open the file). Mark stale ones for removal.
2. Scan for new debt, checking concretely:
   - Size: files > ~400 lines under `src/` (`wc -l`); `src/pages/Home/index.tsx` is the known hotspot.
   - Type holes: `any`, `@ts-ignore`, `as unknown as`, `eslint-disable` in `src/`.
   - Legacy JS: `.js` files under `src/` that could become `.tsx/.ts`.
   - Re-export shims / duplicates (e.g. `components/JsonEditor.tsx` → `JsonEditor/index.tsx`).
   - Dependencies: for each `dependencies` entry in `package.json`, `grep -r "from \"<pkg>" src` — note candidates, but CRA/jest/types packages are used implicitly; verify before listing.
   - Tests: core modules without tests (`src/core/json-validator.ts`, `src/config/achievements.ts`, `src/utils/localStorageHandler.ts`); commented-out test files (`GothControlPanel.test.tsx`).
   - Template leftovers: `genezio.yaml` name `material-kit-react` (production is Vercel; changing it is a deliberate decision for the user).
3. Score each: severity (high = breaks CI/users, med = slows changes, low = cosmetic) × effort (S < 1h, M < half day, L > half day). Recommend the top 3 by value/effort, with reasons.
4. Propose the updated inventory table; write it only after the user agrees.

## Mode B — Fix one item

1. Confirm which item, and the expected outcome, with the user.
2. Lock behaviour first: if the target lacks tests, add characterisation tests that pass **before** refactoring.
3. Smallest change that resolves the item. One item per change; no drive-by edits.
4. Refactoring `Home/index.tsx`: extract by responsibility (e.g. page management, achievements state, preferences/persistence) into hooks or helpers beside it, like `pageState.ts`. Keep the props passed to children identical so component tests keep passing.
5. Dependency removal: grep `src/` and `public/index.html`, remove, reinstall, then lint + test + build. Note `package-lock.json` is gitignored, so only `package.json` changes are committed.
6. Run the `verify-and-document` skill; move the item from the Inventory into the Log with today's date (`YYYY-MM-DD`).
