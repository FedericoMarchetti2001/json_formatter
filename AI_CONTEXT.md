# Application Description and Context for AI

This document provides a detailed description of the Goth/Emo JSON Formatter application. It is intended to provide context for AI models.
ALWAYS Update this file if significant changes were performed.

## Application Overview

This application is a React-based web application that serves as a JSON formatter with a distinct "goth/emo" visual theme. It includes light gamification elements, such as achievements, to enhance the user experience. The application is built with React 18 and TypeScript, and it uses Material UI (MUI) for its component library. All logic is client-side, with no backend dependencies. The application leverages local storage for persistence and includes internationalization support for English and German.

---

## Current Features

- **JSON Formatting & Validation**: Core feature that formats JSON strings into readable format with real-time validation, detailed error reporting, and guidance for multiple top-level values
- **Multi-Page Interface**: Users can work with multiple JSON documents using a tabbed pagination system
- **Achievements System**: Gamification element that tracks user actions and unlocks achievements with import/export functionality
- **Goth/Emo Theme**: Dark, edgy aesthetic with custom CSS variables, gradients, and shadow effects
- **Selectable Viewer Theme**: Users can choose from multiple JSON viewer themes (monokai, apathy, bright, etc.)
- **Internationalization (i18n)**: Full support for English (en) and German (de) languages with react-i18next
- **Sound & Voice Controls**: Users can toggle sound effects and AI voice feedback using Web Speech API
- **Local Persistence**: All state (pages, preferences, achievements, theme selection) persisted in browser localStorage
- **Image Viewer**: Centered modal for displaying unlocked achievement images
- **Keyboard Shortcuts**: Alt+Enter for formatting, ESC for shortcuts overlay, Tab for indentation
- **Error Navigation**: Clicking validation issues jumps to the exact line and column in the editor
- **Analytics**: Integrated with Vercel Analytics and Nepcha Analytics for privacy-compliant tracking

---

## Project Structure

```
json_formatter/
├── public/
│   ├── index.html                    # Main HTML entry point with meta tags
│   ├── manifest.json                 # PWA manifest
│   ├── robots.txt                    # Search engine crawling rules
│   ├── mock_data.json                # Sample JSON data for initial load
│   ├── jg-favicon.svg                # Application favicon
│   ├── goth-girls/                   # Achievement unlock images
│   ├── images/                       # Other images
│   ├── sounds/                       # Success/failure audio effects
│   │   ├── success.mp3
│   │   └── fail.mp3
│   └── locales/                      # Translation files
│       ├── en/
│       │   └── translation.json
│       └── de/
│           └── translation.json
│
├── src/
│   ├── App.js                        # Root component with routing
│   ├── index.js                      # React DOM entry point
│   ├── i18n.js                       # i18next configuration
│   ├── setupTests.js                 # Jest testing configuration
│   │
│   ├── config/
│   │   └── achievements.ts           # Achievement definitions, triggers, and logic
│   │
│   ├── core/
│   │   └── json-validator.ts         # JSON validation engine with detailed error reporting
│   │
│   ├── pages/
│   │   └── Home/
│   │       ├── index.js              # Main application component with state management
│   │       ├── sentences.js          # Goth success/failure sentence collections
│   │       ├── components/
│   │       │   ├── PageHeader.tsx    # Top banner with title and subtitle
│   │       │   ├── PageFooter.tsx    # Footer with branding
│   │       │   ├── GothControlPanel.tsx      # Control panel with language, sound, voice, achievements
│   │       │   ├── GothShortcutsOverlay.js   # Keyboard shortcuts modal
│   │       │   ├── InputOutputSection.tsx    # JSON input/output editor section
│   │       │   ├── JsonEditor.tsx           # Custom JSON editor with line numbers
│   │       │   ├── JsonErrorPanel.tsx       # Validation error display
│   │       │   ├── GothAchievementsGallery.tsx  # Achievement image gallery
│   │       │   ├── SentenceDisplay.tsx      # Goth sentence display
│   │       │   ├── CenteredImageViewer.tsx  # Modal image viewer
│   │       │   ├── SoundAndVoiceControls.tsx   # Audio control toggles
│   │       │   ├── AchievementImportExport.tsx # Achievement file I/O
│   │       │   ├── FormatterActions/
│   │       │   │   └── FormatterActions.tsx # Format, copy, clear, upload buttons & controls
│   │       │   ├── Pagination/
│   │       │   │   └── index.tsx     # Multi-page pagination with tab controls
│   │       │   └── *.test.js/tsx     # Jest unit tests for components
│   │
│   ├── styles/
│   │   ├── globals.css               # Global CSS variables, resets, goth theme styling
│   │   └── sentences.md              # Goth sentence reference documentation
│   │
│   └── utils/
│       └── localStorageHandler.ts    # Centralized localStorage operations
│
├── .eslintrc.json                    # ESLint configuration
├── .prettierrc.json                  # Prettier code formatting rules
├── tsconfig.json                     # TypeScript compiler configuration
├── package.json                      # Dependencies and scripts
├── genezio.yaml                      # Genezio serverless framework config
├── README.md                         # User-facing documentation
├── AI_CONTEXT.md                     # This file - AI context
└── LICENSE                           # MIT license

```

### Key Files by Functionality

**State Management & Logic:**
- [`src/pages/Home/index.js`](src/pages/Home/index.js): Main state container managing pages, achievements, preferences, validation
- [`src/utils/localStorageHandler.ts`](src/utils/localStorageHandler.ts): Centralized localStorage API
- [`src/config/achievements.ts`](src/config/achievements.ts): Achievement definitions and unlock logic

**Validation & Formatting:**
- [`src/core/json-validator.ts`](src/core/json-validator.ts): JSON validation engine with error collection and line reporting

**UI Components:**
- [`src/pages/Home/components/FormatterActions/FormatterActions.tsx`](src/pages/Home/components/FormatterActions/FormatterActions.tsx): Format/copy/clear/upload controls
- [`src/pages/Home/components/InputOutputSection.tsx`](src/pages/Home/components/InputOutputSection.tsx): Editor and output viewer
- [`src/pages/Home/components/GothControlPanel.tsx`](src/pages/Home/components/GothControlPanel.tsx): Language, sound, voice, achievements UI

**Styling:**
- [`src/styles/globals.css`](src/styles/globals.css): CSS variables, goth theme, component styles with !important overrides

---

## Business Logic & App Flow

### JSON Formatting & Validation Pipeline

1. **User Input** → Text entered in `InputOutputSection` textarea
2. **Validation** → `validateJson()` from `json-validator.ts` parses and analyzes structure
3. **Error Collection** → `IssueCollector` class gathers syntax errors with line numbers and snippets
4. **Display** → `JsonErrorPanel` renders validation issues; if valid, output displays formatted JSON
5. **Formatting** → `JSON.stringify(parsed, null, tabSpaces)` with user-selected indentation (2, 4, 6, 8)

**Achievement Trigger**: On successful format, `FORMAT_SUCCESS` event checked for achievement unlocks

### Multi-Page Document Management

- **State Arrays**: `textArray[]` and `formattedTextArray[]` store content per page
- **Pagination Control**: `currentPage` tracks active page; UI shows tab for each page
- **Add Page**: Creates new empty pages (triggers `ADD_PAGE` achievement)
- **Delete Page**: Removes pages (triggers `DELETE_PAGE` achievement); prevents deletion of last page
- **Persistence**: All arrays saved to localStorage under `jsonFormatterPageContent_textArray` and `jsonFormatterPageContent_formattedTextArray`

### Achievement System

**Achievement Types:**
1. **Format-based**: `format_novice` (1 format), `format_adept` (10 formats), `format_master` (100 formats)
2. **Action-based**: `syntax_demon` (fix invalid JSON), `indentation_cultist` (change indentation), `theme_changer`, `linguistic_nihilist`, `clear_vessel`, `data_courier`, `data_exporter`, `page_turner`, `page_destroyer`, `json_slayer`

**Unlock Logic** (`src/config/achievements.ts`):
- `checkAchievements(event, unlockedIds, context)` evaluates if conditions met
- Events: `FORMAT_SUCCESS`, `FORMAT_FAILURE`, `FIXED_SYNTAX`, `CHANGE_INDENTATION`, `CHANGE_THEME`, `CHANGE_LANGUAGE`, `CLEAR_TEXT`, `IMPORT_ACHIEVEMENTS`, `EXPORT_ACHIEVEMENTS`, `ADD_PAGE`, `DELETE_PAGE`
- Newly unlocked achievements trigger toast notifications and unlock associated goth girl images

**Persistence**: Stored as `{ unlocked: string[], images: string[] }` in localStorage under `jsonFormatterAchievements`

**Import/Export**: Users can download/upload achievements JSON file for sharing or backup

### Goth/Emo Aesthetic System

**Theme Colors** (`globals.css`):
- Background: `#18141a` (deep goth)
- Primary: `#a8326e` (magenta)
- Accent: `#ff69b4` (hot pink)
- Text: `#f0e6f6` (pale lavender)

**Visual Effects**:
- Vignette overlay (`body::after` radial gradient)
- Linear gradients for buttons and panels
- Text shadows for gothic mood
- Smooth transitions on hover

**Success/Failure Feedback**:
- **Success**: Green/magenta gradient toast, "goth success" sentences, success.mp3 sound
- **Failure**: Purple/magenta gradient toast, "goth failure" sentences, fail.mp3 sound
- Optional AI voice narration using Web Speech API with female voice preference and lower pitch

### User Preferences & Settings

**Stored in localStorage** (`jsonFormatterPreferences`):
- `tabSpaces`: Indentation level (2, 4, 6, 8)
- `enablePlaySound`: Toggle sound effects
- `enableAIVoice`: Toggle AI voice feedback
- `jsonTheme`: Selected JSON viewer theme

**Language Selection**:
- Dropdown with flag emojis (English 🇬🇧, German 🇩🇪)
- Changes via `i18n.changeLanguage()` and persisted in localStorage
- Triggers `CHANGE_LANGUAGE` achievement event

---

## Technologies & Dependencies

### Core Framework
- **React 18**: UI library with hooks (useState, useEffect, useRef, useContext, useMemo)
- **TypeScript 5**: Static typing for components and utilities
- **React Router 6**: Client-side routing (currently single route, extensible)

### UI & Styling
- **Material-UI (MUI) 5**: Component library (Button, Box, Grid2, Dialog, Menu, Select, Tabs, TextField)
- **CSS3**: Custom properties, gradients, flexbox, grid, media queries
- **React JSON View**: JSON object visualization with expand/collapse
- **React Flags Select**: Country flag icons for language selector

### Internationalization
- **react-i18next**: i18n framework with `useTranslation()` hook
- **i18next-http-backend**: Loads translation JSON files from `/public/locales/`
- **Supports**: English (en), German (de); fallback to English

### State Management & Persistence
- **React Hooks**: Custom hook pattern via `localStorageHandler.ts`
- **localStorage API**: Client-side persistence (no backend)
- **Local Storage Keys**:
  - `jsonFormatterAchievements`
  - `jsonFormatterPreferences`
  - `jsonFormatterPageContent_textArray`
  - `jsonFormatterPageContent_formattedTextArray`

### Audio & Voice
- **Web Audio API**: Native audio playback for sound effects
- **Web Speech API**: Text-to-speech with `SpeechSynthesisUtterance`
- Audio files: `success.mp3`, `fail.mp3` (user-provided in `public/sounds/`)

### Notifications & Feedback
- **React Toastify**: Toast notifications for achievements, errors, and feedback
- **Custom CSS**: Goth-styled toast container with gradient backgrounds

### Analytics
- **Vercel Analytics**: Performance monitoring and user analytics
- **Nepcha Analytics**: Privacy-compliant alternative analytics (GDPR/CCPA compliant)

### Development & Testing
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities (render, fireEvent, screen)
- **ESLint**: Code quality linting (`.eslintrc.json`)
- **Prettier**: Code formatting (`.prettierrc.json`)

### Deployment & Configuration
- **Vercel**: Deployment platform with built-in analytics
- **Genezio**: Serverless framework config (optional, for backend if needed)
- **Environment**: Node.js 16+ (as per README), npm/yarn

### Build Tools (Implicit via React Scripts)
- **Webpack**: Module bundling
- **Babel**: JavaScript transpilation
- **CSS Loader**: CSS module resolution

---

## Data Flow Diagram

```
User Input
    ↓
InputOutputSection (textarea)
    ↓
validateJson() → IssueCollector → JsonValidationResult
    ↓
    ├─→ Valid JSON → JSON.stringify() → formattedText → JsonView + JsonEditor
    └─→ Invalid JSON → JsonErrorPanel displays errors
    ↓
FormatterAction (button click)
    ↓
checkAchievements(event, unlockedIds, context)
    ↓
New achievements? → Update state → Toast notification → localStorage save
    ↓
GothControlPanel (on conversion)
    ├─→ Select random goth sentence → SentenceDisplay
    ├─→ Play sound (optional)
    ├─→ Speak sentence (optional, Web Speech API)
    └─→ Show achievement images
    ↓
localStorage persists:
├─ Achievement state
├─ Page content arrays
├─ User preferences
└─ Theme selection
```

---

## Key Design Patterns

1. **Centralized State**: Parent component (`Home/index.js`) manages global state; children receive via props
2. **Custom Hook**: `localStorageHandler` provides reusable localStorage interface
3. **Error Handling**: `JsonValidationResult` object with `valid`, `issues`, `error`, `rowsWithErrors` properties
4. **Achievement Event System**: Enum-based events trigger conditional achievement unlocks
5. **Responsive Design**: MUI Grid2 + media queries for mobile/tablet/desktop
6. **Theme Variables**: CSS custom properties for easy theme switching
7. **Composition**: Small, focused components (SoundAndVoiceControls, AchievementImportExport, etc.)

---

## Browser Compatibility

- **Modern browsers**: Chrome, Firefox, Safari, Edge (ES2020+)
- **Requires**: localStorage, Fetch API, Web Speech API (voice), Web Audio API (sounds)
- **Not compatible**: IE11 (no ES6 support)

---

## Performance Considerations

- **Client-side only**: No network latency for core features
- **localStorage limits**: ~5-10MB per domain (achievements + page content unlikely to exceed)
- **React memoization**: `useMemo()` for validation issues, error lines
- **Lazy loading**: Goth girl images only loaded on unlock
- **Minimal re-renders**: Refs used for editor/viewer scrolling without state updates

---

## Security Notes

- **Input**: JSON parsing via native `JSON.parse()` is safe (no eval)
- **XSS**: i18next escapeValue disabled only where explicitly allowed
- **localStorage**: No sensitive data stored; achievements are non-critical
- **CORS**: No backend API calls; all cross-origin resources are read-only (images, fonts, translations)
- **Analytics**: Nepcha is privacy-first (no cookies, GDPR compliant)

---

## Future Enhancement Opportunities

1. **Dark/Light Theme Toggle**: Currently dark-only; could add light theme variant
2. **Additional Languages**: Extend i18n support (French, Spanish, Japanese, etc.)
3. **Advanced Validation**: JSON Schema validation, custom rule sets
4. **Backend Integration**: Optional user accounts, cloud achievement sync
5. **Code Sharing**: Generate shareable links for formatted JSON
6. **Performance Metrics**: Track format speed, JSON size analytics
7. **Custom Themes**: User-created color schemes
8. **Keyboard Macro Recording**: Record and playback custom key sequences
9. **Accessibility**: Enhanced ARIA labels, keyboard navigation improvements
10. **PWA Enhancement**: Offline support, background sync for achievements

---

**Last Updated**: 29-12-2025
**Version**: 0.1.0
**Maintainer**: Federico Marchetti
