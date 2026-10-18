# Engineering Standards

Single source of truth for repository structure and patterns across `biblion`, `json_formatter`
and `personal_website`. This file is **byte-identical in all three repos**; change it in all three
in the same run and add a line to the changelog below. Repos diverge only where a framework forces
it (Next.js `app/`, Expo app layout, Azure Functions layout, CRA `public/`).

Progress against this standard is tracked per repo in `docs/STRUCTURE_ROADMAP.md`.

## 1. Root files

| Path | Rule |
|------|------|
| `README.md` | What the project is, how to run it, scripts table, link to this file |
| `docs/` | `ai-context/` for AI context docs, `adr/` for architecture decision records (`NNNN-title.md`), `ENGINEERING_STANDARDS.md`, `STRUCTURE_ROADMAP.md` |
| `.editorconfig` | UTF-8, LF, 2-space indent, final newline, trim trailing whitespace |
| `.nvmrc` | Same Node LTS in every repo (currently `22`); `engines.node` in `package.json` must agree |
| `.prettierrc.json` | One shared config (see section 8), never overridden per repo |
| `eslint.config.js` | ESLint flat config; no `.eslintrc*`, no `eslintConfig` in `package.json` |
| `.gitignore` | Baseline: `node_modules`, build output, `coverage`, `.env*` (except `.env.example`), `*.log`, `.DS_Store`, `*.tsbuildinfo`, IDE folders other than shared settings |
| `.env.example` | The only committed env file; lists every variable with a placeholder, never a real value |
| `.github/workflows/ci.yml` | On push to `main` and on PRs: install (`npm ci`), `lint`, `typecheck`, `test`, `build` |

Real env files (`.env`, `.env.local`, `.env.dev`, `.env.prod`, `local.settings.json`) are never committed.
Secrets that were committed must be rotated and purged from history.

## 2. npm scripts

Identical names everywhere. In a monorepo the root defines the same names and delegates to workspaces
(`npm run build --workspaces --if-present`).

| Script | Purpose |
|--------|---------|
| `dev` | Start the local development server |
| `build` | Production build |
| `start` | Run the production build (or the dev entry where there is no separate prod server) |
| `lint` | ESLint, zero warnings |
| `lint:fix` | ESLint with `--fix` |
| `format` | Prettier `--write` |
| `typecheck` | `tsc --noEmit` |
| `test` | Run tests once, non-interactive (CI-safe) |
| `test:watch` | Watch mode |

Extra scripts (e.g. `refresh`, `smoke`, `dev:mobile`) are allowed in addition, never instead.

## 3. Language

- TypeScript everywhere with `"strict": true`. No new `.js`/`.jsx` source files; existing ones are converted one at a time.
- Tool config files (`*.config.js`) may stay JavaScript only if the tool cannot load TypeScript.

## 4. Source layout

```
src/
  features/<feature>/
    components/   hooks/   services/   types/   index.ts
  shared/
    components/   hooks/   lib/   utils/   types/
  config/         # typed env/config module(s)
```

- Framework entry folders (`src/app` for Next.js, `app/` for Expo Router, `src/functions` for Azure Functions, CRA `src/index.tsx`) stay where the framework requires them and stay thin: they compose features, they hold no business logic.
- Monorepos apply the same `src/` layout inside each app/package; cross-app code lives in `packages/*`.
- Tests are colocated: `Foo.test.tsx` next to `Foo.tsx`. Test-only helpers live in `src/shared/test/` or the feature's folder.

## 5. Naming

- Components: `PascalCase.tsx`, one component per file, named export matching the file name.
- Functions and variables: `camelCase`. Hooks: `useX`. Types/interfaces: `PascalCase`. Constants: `SCREAMING_SNAKE_CASE` only for true module-level constants.
- All other files: `kebab-case.ts` (`json-validator.ts`, `local-storage.ts`).
- Barrel `index.ts` only at the feature root (the feature's public API). No barrels in `shared/` subfolders or inside `components/`.

## 6. Patterns

1. **Config**: environment variables are read in exactly one typed module under `src/config/` and validated with Zod at startup. The rest of the code imports that module, never `process.env` / `import.meta.env`.
2. **No business logic in UI components**: components render and wire events; logic lives in `hooks/`, `services/` or pure functions in `utils/`.
3. **Errors are handled at boundaries** (route handlers, event handlers, error boundaries, API entry points) and converted into typed results or user-facing messages. Inner code throws or returns typed errors; it does not swallow them.
4. **Small pure functions** with explicit inputs/outputs; side effects pushed to the edges.
5. **Dependency direction**: `features -> shared`, never the reverse. A feature does not import another feature's internals, only its `index.ts`. `config` is importable from anywhere.
6. **No circular imports** (enforced by `import/no-cycle` in ESLint).
7. **Persistence** (localStorage, secure storage, DB) goes through one service per concern.

## 7. Documentation and decisions

- AI context docs live in `docs/ai-context/`; update them in the same change that alters structure.
- Significant decisions are recorded as ADRs in `docs/adr/`.
- Known debt is tracked in `docs/TECH_DEBT.md`.

## 8. Shared tooling configs

`.prettierrc.json` (identical in all repos):

```json
{
  "printWidth": 100,
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": false,
  "endOfLine": "lf"
}
```

`.editorconfig` (identical in all repos):

```
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

## 9. Commits and PRs

Conventional commits. Never push to `main`; work lands through PRs with What / Why / How verified / Risk & rollback.

## Changelog

| Date | Change |
|------|--------|
| 2026-10-18 | Initial version |
