---
name: verify-and-document
description: Final step for every code change in JGoth Validator — run lint, tests and a CI-mode production build, report results honestly, then update AI_CONTEXT.md and docs/TECH_DEBT.md. Use before declaring any task done, or when the user asks to verify, check, or "make sure it works".
---

# Verify and document

## 1. Run the gate (in order, stop at the first failure and fix it)

Bash:
```bash
npm run lint
CI=true npm test -- --watchAll=false
CI=true npm run build
```
PowerShell: prefix the last two with `$env:CI='true';`.

- `CI=true` on the build is mandatory: Vercel builds with CI set, which makes CRA treat ESLint warnings as errors. A warning-free lint is therefore required, not optional.
- Tests must run once (`--watchAll=false`), never in watch mode.

## 2. If something fails

- Determine whether it was caused by this change: `git stash`, rerun just the failing command, `git stash pop`. Pre-existing failures are reported as such, with output, and logged in `docs/TECH_DEBT.md` — not silently fixed out of scope, and never hidden.
- Forbidden ways to get green: `.skip`/`.only`, deleting tests, weakening assertions, `// eslint-disable` without a one-line justification, `@ts-ignore`, loosening `tsconfig`/ESLint config.
- Debug root-cause first: reproduce → isolate → hypothesise → verify. Don't stack speculative fixes.

## 3. Optional manual check

For visible UI changes, offer to run `npm start` (port from `.env.development`) and check the behaviour; say explicitly if you did not do a manual check.

## 4. Update docs (only what the change affected)

- `AI_CONTEXT.md` (the file itself says "ALWAYS update"): features list, project-structure tree, key files, data flow, test-setup notes. Bump the **Last Updated** date at the bottom (format `DD-MM-YYYY`).
- `docs/TECH_DEBT.md`: remove/strike items you resolved and add a dated line to **Log**; add new debt you noticed (with severity/effort) rather than fixing it out of scope.
- `README.md`: only for user-facing feature changes or changed commands.
- `CLAUDE.md`: only if commands, boundaries or the skill list changed.

## 5. Report and stop

Summarise: files changed, gate results (pass/fail per step, with the failing output if any), docs updated, anything not verified. **Do not commit or push** — pushing to `main` deploys to production. Leave the verified diff for the user.
