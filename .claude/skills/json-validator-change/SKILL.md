---
name: json-validator-change
description: Safely change the JSON validation engine in src/core/json-validator.ts — new diagnostics, issue codes, tolerant/JSONC options, error positions, or bug fixes in parsing. Test-first. Use when touching validateJson, JsonValidationResult/Issue, issue codes, line/column reporting, or error messages shown in the error panel.
---

# Changing the JSON validator

`src/core/json-validator.ts` (~1000 lines) is the core of the product. A regression here breaks every user, and the UI depends on its exact output shape.

## Architecture (read the relevant part before editing)

`validateJson(input, options)` → `PositionMapper` (index → 1-based line/column) → `Scanner` (tokens) → `JsonParser` (grammar) → `IssueCollector.addIssue({ message, index, length?, code?, severity?, offending? })` → `JsonValidationResult`.

Options: `tolerant` (turns on `allowComments` + `allowTrailingCommas` by default), `maxIssues`, `returnParsedValue`, `snippetRadius`.

Existing issue `code`s: `Comment, EmptyInput, InvalidEscape, InvalidNumber, InvalidNumberTrailing, InvalidString, InvalidUnicodeEscape, LeadingZero, MissingColon, MissingKey, TrailingComma, UnexpectedComma, UnexpectedEOF, UnexpectedToken, UnquotedIdentifier, UnquotedKey, UnterminatedArray, UnterminatedComment, UnterminatedObject, UnterminatedString`. Reuse one when it fits; new codes are PascalCase.

## Contract consumers — do not break

- `JsonValidationResult` fields (`valid`, `error`, `issues`, `issueCount`, `rowsWithErrors`, `totalRowsWithErrors`, `value`) are read by `pages/Home/index.tsx`, `pages/Home/pageState.ts` (`EMPTY_VALIDATION_RESULT`), `components/FormatterActions/FormatterActions.tsx`, and `components/JsonErrorPanel.tsx`.
- `line`/`column` are **1-based**; clicking an issue jumps the editor to that position, and `rowsWithErrors` drives the editor's red row highlighting. Off-by-one errors are the classic regression.
- `error` is the first error-severity issue (backward-compat field). Warnings must not make `valid` false.
- `JsonErrorPanel` searches on `issue.message` and `issue.code` text — renaming codes or rewording messages changes search behaviour.
- Messages are English literals (not i18n). Keep them short and actionable, matching existing phrasing.

## Workflow (test-first)

1. There is no `src/core/json-validator.test.ts` yet — create it on first use (pure function, no React needed).
2. Write the failing test(s) first: the input string, expected `valid`, `code`, `line`, `column`, and `severity`. For bugs, reproduce the user's exact input.
3. Add regression guards around the change: valid JSON still `valid: true` with no issues; multi-line input positions; `\r\n` line endings; the tolerant vs strict variant if relevant; `maxIssues` cap.
4. Make the minimal change in the scanner/parser. Don't restructure the file unless asked.
5. Run the single file: `CI=true npm test -- --watchAll=false src/core/json-validator.test.ts`.
6. Performance: the validator runs on every edit (debounced). Avoid quadratic work over the input — no repeated `input.slice`/`split` per token. Sanity-check with a ~1–5 MB generated JSON string if you touched a loop.

## Finish

Run the `verify-and-document` skill. If you added a code or option, record it in `AI_CONTEXT.md`.
