# Structure Roadmap — json_formatter

Audit against [ENGINEERING_STANDARDS.md](ENGINEERING_STANDARDS.md). Weekly routine implements the next 1-3 unchecked steps in small, behavior-preserving PRs.

**Divergence score = number of open items.**

| Week of | Score | Note |
|---------|-------|------|
| 2026-10-18 | 15 | Baseline audit; 3 items closed in this PR (18 → 15) |

Framework-forced divergences: CRA (`public/`, `src/index`), `react-scripts` toolchain. CRA → Vite belongs to the `claude/migration/` routine.

## Checklist (cheapest / highest value first)

- [x] 1. Add `.editorconfig`
- [x] 2. Add `.nvmrc` (Node 22)
- [x] 3. Replace `.prettierrc.json` with the shared config (`endOfLine: lf`)
- [ ] 4. Stop tracking `.env.development` (no secret-like key names found); add `.env.example`, ignore `.env*` except example
- [ ] 5. Add `.github/workflows/ci.yml` (npm ci, lint, typecheck, test, build with `CI=true`)
- [ ] 6. Unify scripts: add `lint:fix`, `format` (rename `prettify`), `typecheck`, `test:watch`; make `test` non-interactive
- [ ] 7. Stop ignoring `package-lock.json` in `.gitignore`, commit lockfile so `npm ci` works (coordinate with open `claude/*` PRs touching `package.json`)
- [ ] 8. Move `AI_CONTEXT.md` → `docs/ai-context/AI_CONTEXT.md`; update `CLAUDE.md`, skills and README references
- [ ] 9. Move root `TECH_DEBT.md`/`SEO_IMPLEMENTATION_SUMMARY.md` into `docs/`; dedupe with `docs/TECH_DEBT.md`
- [ ] 10. Add `docs/adr/0001-adopt-engineering-standards.md`
- [ ] 11. Complete `.gitignore` baseline
- [ ] 12. Migrate `.eslintrc.json` → `eslint.config.js` (flat), drop `eslintConfig` from `package.json`, add `import/no-cycle`
- [ ] 13. Convert JS → TS: `src/setupTests.js`, `src/i18n.js`, `src/index.js`, `src/App.js`
- [ ] 14. Convert JS → TS: `Home/index.js`, `sentences.js`, `GothShortcutsOverlay.js`, `InputOutputSection.test.js`
- [ ] 15. Enable `strict: true` in `tsconfig.json`; fix fallout
- [ ] 16. Typed Zod config module `src/config/env.ts`
- [ ] 17. Reorganize to `src/features/<feature>` + `src/shared`: move `Home/components/*` per feature (editor, pagination, achievements, controls), one feature per PR; `core/json-validator.ts` → feature `validation/services`; `utils/localStorageHandler.ts` → `shared/lib/local-storage.ts`
- [ ] 18. Rename non-component files to kebab-case, one component per file
