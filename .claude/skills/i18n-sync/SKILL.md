---
name: i18n-sync
description: Add or change user-visible text in JGoth Validator and keep the English and German translation files in sync; also audits missing, extra and unused translation keys. Use for any UI copy change, new t() call, translation, German text, or "i18n"/"locales".
---

# i18n sync (en / de)

## How i18n works here

- Runtime: `src/i18n.js` loads `/locales/{{lng}}/translation.json` over HTTP (`i18next-http-backend`). Files: `public/locales/en/translation.json`, `public/locales/de/translation.json`.
- Keys are namespaced by component: `ComponentName.key` (e.g. `FormatterActions.format`, `JsonErrorPanel.emptyState`). Top-level groups today: `header`, `features`, `FormatterActions`, `EditorTypography`, `InputOutputSection`, `Pagination`, `GothAchievementsGallery`, `AchievementImportExport`, `SoundAndVoiceControls`, `CenteredImageViewer`, `GothShortcutsOverlay`, `JsonErrorPanel`, `toast`.
- Calls pass an English default: `t("Component.key", "English default")`. Tests rely on this — `src/setupTests.js` creates an i18n instance with **no resources**, so tests see the default string. Always include the default.

## Adding / changing text

1. Use `t("<Component>.<camelCaseKey>", "<English default>")` in the component (`useTranslation()` from `react-i18next`).
2. Add the key to **both** JSON files at the same nested path, same key order as neighbours.
3. German: write natural German in the app's dark/goth tone (not literal word-for-word). If unsure of nuance, flag the string to the user for review rather than silently guessing.
4. Interpolation uses `{{name}}` and must be identical in both languages. `escapeValue` is off — never interpolate unsanitised user input into HTML.
5. Changing English text changes test-visible defaults: update tests that query by that text.

## Audit (run after edits, or when asked)

Run from the repo root (Bash):

```bash
node -e '
const en=require("./public/locales/en/translation.json"),de=require("./public/locales/de/translation.json");
const flat=(o,p="")=>Object.entries(o).flatMap(([k,v])=>v&&typeof v=="object"?flat(v,p+k+"."):[p+k]);
const a=flat(en),b=flat(de);
console.log("en:",a.length,"de:",b.length);
console.log("missing in de:",a.filter(k=>!b.includes(k)));
console.log("missing in en:",b.filter(k=>!a.includes(k)));
const fs=require("fs"),path=require("path");
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const src=walk("src").filter(f=>/\.(t|j)sx?$/.test(f)).map(f=>fs.readFileSync(f,"utf8")).join("\n");
const used=new Set([...src.matchAll(/t\(\s*["\x27`]([\w.]+)["\x27`]/g)].map(m=>m[1]));
console.log("unused (verify — keys may be built dynamically):",a.filter(k=>!used.has(k)));
console.log("used but missing in en:",[...used].filter(k=>k.includes(".")&&!a.includes(k)));
'
```

Report all four lists. "Unused" is a hint only: some keys are built dynamically (e.g. ternaries choosing `"JsonErrorPanel.close"` vs `"JsonErrorPanel.expand"`) — grep before deleting anything, and ask before removing keys.

## Adding a language

Requires: new `public/locales/<lng>/translation.json` with every key, `supportedLngs` in `src/i18n.js`, the flag selector options (`react-flags-select`, in the control panel), and the README/AI_CONTEXT language lists. Confirm scope with the user first.

## Finish

Run the `verify-and-document` skill.
