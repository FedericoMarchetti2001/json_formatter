# Application Description and Context for AI

This document provides a detailed description of the Goth/Emo JSON Formatter application. It is intended to provide context for AI models.

## Application Overview

This application is a React-based web application that serves as a JSON formatter with a distinct "goth/emo" visual theme. It includes light gamification elements, such as achievements, to enhance the user experience. The application is built with React and TypeScript, and it uses Material UI (MUI) for its component library. All logic is client-side, with no backend dependencies.

## Current Features

- **JSON Formatting:** The core feature of the application is to format JSON strings into a more readable format.
- **Multi-Page Interface:** Users can work with multiple JSON documents in a tabbed-like interface with pagination.
- **Achievements System:** The application tracks user actions and unlocks achievements. This includes an import/export feature for achievement data.
- **Goth/Emo Theme:** The application has a dark, goth/emo aesthetic.
- **Sound and Voice Controls:** Users can toggle sound effects and an AI voice.
- **Local Persistence:** Application state, such as page content and user preferences, is persisted in the browser's local storage.
- **Image Viewer:** A centered image viewer for displaying unlocked achievement images.

## Technical Details

- Built using React and TypeScript.
- Utilizes Material UI (MUI) for UI components.
- All state is managed on the client-side, using React hooks and local storage.
- No backend or network requests are made.
- The application is a single-page application (SPA).