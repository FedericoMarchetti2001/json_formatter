# Application Description and Context for AI

This document provides a detailed description of the Goth/Emo JSON Formatter application. It is intended to provide context for AI models.

## Application Overview

This application is a React-based web application that serves as a JSON formatter with a distinct "goth/emo" visual theme. It includes light gamification elements, such as achievements, to enhance the user experience. The application is built with React and TypeScript, and it uses Material UI (MUI) for its component library. All logic is client-side, with no backend dependencies.

## Current Features

- **JSON Formatting:** The core feature of the application is to format JSON strings into a more readable format.
- **JSON Validation:** The application validates JSON input and displays clear, user-friendly errors for invalid JSON.
- **Multi-Page Interface:** Users can work with multiple JSON documents in a tabbed-like interface with pagination.
- **Achievements System:** The application tracks user actions and unlocks achievements. This includes an import/export feature for achievement data.
- **Goth/Emo Theme:** The application has a dark, goth/emo aesthetic.
- **Selectable Viewer Theme:** Users can choose from multiple themes for the JSON viewer.
- **Internationalization:** The application supports English and German languages.
- **Sound and Voice Controls:** Users can toggle sound effects and an AI voice.
- **Local Persistence:** Application state, such as page content and user preferences, is persisted in the browser's local storage.
- **Image Viewer:** A centered image viewer for displaying unlocked achievement images.

## Project Structure

- `src/core/json-validator.ts`: Contains the logic for JSON validation.
- `src/pages/Home/`: The main directory for the application's components.
- `src/pages/Home/index.js`: The main component that manages the application's state.
- `src/pages/Home/components/FormatterActions/FormatterActions.tsx`: The component that contains the main user actions, such as formatting, copying, and clearing.
- `src/pages/Home/components/InputOutputSection.tsx`: The component that contains the input and output text areas for the JSON.
- `src/pages/Home/components/GothControlPanel.tsx`: The component that contains the goth-themed controls, such as sound and voice toggles, and the language switcher.
- `src/pages/Home/components/Pagination/index.tsx`: The component that handles the pagination for multiple JSON documents.
- `public/locales/`: Contains the translation files for internationalization.

## Technical Details

- Built using React and TypeScript.
- Utilizes Material UI (MUI) for UI components.
- Uses `react-i18next` for internationalization.
- Uses `react-flags-select` for the language switcher.
- All state is managed on the client-side, using React hooks and local storage.
- No backend or network requests are made.
- The application is a single-page application (SPA).