---
name: add-component
description: Create or substantially rework a React UI component in JGoth Validator following project conventions — TSX, MUI 5, goth CSS variables, i18n with defaults, props from the Home container, and a React Testing Library test. Use when adding a panel, button group, dialog, overlay or any new piece of UI.
---

# Add a UI component

## Where things go

- New components: `src/pages/Home/components/<Name>.tsx`, or a folder `<Name>/index.tsx` (+ subparts) when it has several pieces (see `JsonEditor/`, `Pagination/`, `FormatterActions/`).
- **TypeScript only** for new files. Legacy `.js` files (`GothShortcutsOverlay.js`, `sentences.js`) are not a pattern to copy.
- State lives in the container `src/pages/Home/index.tsx` (already ~700 lines, see TECH_DEBT #3). Pass state/setters in via typed props. Don't grow the container more than necessary: put derived logic in a pure helper (like `pageState.ts`) or a small hook next to the component.
- Persistence only through `src/utils/localStorageHandler.ts`, never `localStorage` directly.

## Conventions

- Define a `Props` interface; default export the component (match neighbours).
- UI from `@mui/material` / `@mui/icons-material`. Styling via the `sx` prop and the CSS custom properties in `src/styles/globals.css` (goth palette, gradients, shadows). Don't hard-code new colours — add a variable to `globals.css` if needed.
- Every visible string: `t("<Name>.<key>", "English default")` + both locale files (follow the `i18n-sync` skill).
- Accessibility: icon-only buttons need `aria-label` (translated); form controls need labels (tests query by label); keyboard reachable; don't hijack existing shortcuts (Alt+Enter format, Esc overlay, Tab indent in editor).
- Responsive: check narrow widths; existing layout uses MUI Grid2 + media queries.
- Toasts: `react-toastify`, reuse the existing goth toast styling.

## Test (required)

Create `<Name>.test.tsx` next to the component. Pattern (see `SoundAndVoiceControls.test.tsx`):

```tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Name from "./Name";

test("renders and calls handler", () => {
  const onAction = jest.fn();
  render(<Name onAction={onAction} />);
  fireEvent.click(screen.getByRole("button", { name: "English default" }));
  expect(onAction).toHaveBeenCalledTimes(1);
});
```

Test gotchas specific to this repo:
- `src/setupTests.js` provides an i18n instance with no resources → assert on the **English default strings**.
- CRA enables `resetMocks`: inside `jest.mock(...)` factories use plain functions, not `jest.fn(impl)` (the implementation is wiped before each test).
- Controlled components: after a click, `rerender` with the new prop value before asserting the next toggle.
- Web Speech / Audio APIs are not in jsdom — stub `window.speechSynthesis` / `HTMLMediaElement.prototype.play` when the component touches them.

## Finish

Run the `verify-and-document` skill; add the component to the structure tree in `AI_CONTEXT.md`.
