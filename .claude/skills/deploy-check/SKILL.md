---
name: deploy-check
description: Read-only pre-deploy checklist for JGoth Validator before the user pushes to main (Vercel Git integration auto-deploys main to jgothvalidator.com). Verifies the CI-mode build, assets, SEO files and secrets. Never deploys, pushes or commits. Use for "ready to ship?", "can I push?", "pre-deploy", "release check".
---

# Pre-deploy check (Vercel)

Production = Vercel's Git integration: **any push to `main` deploys** to https://jgothvalidator.com. There is no staging step in the repo, so this check is the last gate. `genezio.yaml` is a template leftover and is not used for deploys.

This skill is **read-only**: it never pushes, commits, runs `vercel deploy`, or changes Vercel project settings. If something needs fixing, report it and let the user decide.

## Checklist

Report each line as ✅ / ❌ / ⚠️ with evidence.

1. **Branch state**: `git status` (uncommitted files that won't ship / unintended files that will), `git log origin/main..HEAD --oneline` (what this push contains).
2. **Gate**: `npm run lint`, `CI=true npm test -- --watchAll=false`, `CI=true npm run build` — all pass. Vercel's build runs with CI set, so warnings fail it.
3. **Bundle sanity**: note the gzipped sizes printed by the build; flag main-bundle growth > ~10% vs the previous build if known.
4. **Assets**: every path in `ACHIEVEMENT_IMAGES` (`src/config/achievements.ts`) exists in `public/` with exactly that case and extension (Vercel's filesystem is case-sensitive, Windows isn't). Same for `public/sounds/*.mp3`, favicons and the files referenced in `public/manifest.json` and `public/index.html`.
5. **SEO / meta** (`public/index.html`, `public/sitemap.xml`, `public/robots.txt`): canonical/og/twitter URLs point to `https://jgothvalidator.com`; every referenced image exists (e.g. `og:image` → `/og/jgoth-validator.og.png` must be in `public/og/`); sitemap URLs are valid and `robots.txt` references the sitemap. See `SEO_IMPLEMENTATION_SUMMARY.md` for intent.
6. **Translations**: run the audit from the `i18n-sync` skill; en/de parity must be clean.
7. **Secrets & config**: nothing sensitive in tracked `.env*` files (`.env.development` should only hold `PORT`); no API keys or tokens in `src/` or `public/`; any `REACT_APP_*` var used in code is defined in Vercel's project env (ask the user — don't read Vercel secrets).
8. **Analytics**: `@vercel/analytics` / `@vercel/speed-insights` components still mounted (`src/App.js`).

## Output

A short go / no-go verdict, then the checklist. For ❌ items, give the fix but don't apply it unless the user asks. End by reminding the user that pushing to `main` deploys immediately; Vercel's dashboard "Instant Rollback" is the undo.
