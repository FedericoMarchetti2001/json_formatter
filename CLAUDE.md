# CLAUDE.md

JGoth Validator: client-side goth-themed JSON formatter (CRA 5, React 18, TypeScript + legacy JS, MUI 5, i18next en/de). Deployed by Vercel's Git integration: **every push to `main` goes live** at https://jgothvalidator.com.

Full architecture, features and data flow: @AI_CONTEXT.md
Known debt: [docs/TECH_DEBT.md](docs/TECH_DEBT.md)

## Commands

| Task | Bash | PowerShell |
|------|------|------------|
| Dev server | `npm start` | `npm start` |
| Lint | `npm run lint` | `npm run lint` |
| Tests (once) | `CI=true npm test -- --watchAll=false` | `$env:CI='true'; npm test -- --watchAll=false` |
| Single test file | `CI=true npm test -- --watchAll=false src/path/File.test.tsx` | same with `$env:CI='true';` |
| Production build | `CI=true npm run build` | `$env:CI='true'; npm run build` |

`CI=true` matters: Vercel builds with CI set, so CRA turns ESLint **warnings into build errors**. A local build without it can pass and still break production.

## Definition of done

A change is done only when all three pass, in this order: lint → tests → `CI=true` build. If something was already failing on `main` before your change, say so explicitly with the output; never skip, delete or `.skip` a test to get green. Then follow the `verify-and-document` skill.

## Agent boundaries

- Stop at a verified working-tree diff. **Never commit, push, or open PRs** unless the user asks in that conversation (pushing to `main` deploys).
- Never rename, add or fetch images/sounds in `public/` on your own: assets come from the user.
- Keep `public/locales/en` and `public/locales/de` in sync on every UI text change.
- Match surrounding code: small focused components in `src/pages/Home/components/`, props from `Home/index.tsx`, persistence only through `src/utils/localStorageHandler.ts`.

## Project skills (`.claude/skills/`)

| Skill | Use when |
|-------|----------|
| `add-achievement` | Adding or changing an achievement (definition, trigger, image, unlock call site) |
| `i18n-sync` | Adding/changing UI text, or auditing en/de key parity and unused keys |
| `json-validator-change` | Any change to `src/core/json-validator.ts` (new diagnostics, parsing rules, options) |
| `add-component` | Creating a new UI component under `src/pages/Home/components/` |
| `verify-and-document` | Finishing any change: run the gate, update `AI_CONTEXT.md` / `TECH_DEBT.md` |
| `tech-debt-triage` | Picking, fixing or re-auditing items in `docs/TECH_DEBT.md` |
| `deploy-check` | Before the user pushes to `main` (read-only pre-deploy checklist) |

## Working principles

- Think before coding: state assumptions, ask when ambiguous rather than guessing.
- Simplest change that solves the problem; no speculative abstractions or drive-by refactors.
- Turn each task into a verifiable goal (a failing test that then passes, a build that succeeds).
- Debug by finding the root cause first (reproduce → isolate → hypothesise → verify) before proposing a fix.

## Optional user-level tooling (not vendored in this repo)

- [obra/superpowers](https://github.com/obra/superpowers) plugin (`systematic-debugging`, TDD workflows).
- [Context7 MCP](https://github.com/upstash/context7) for up-to-date React / MUI / i18next docs.
