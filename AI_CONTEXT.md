# Application Description and Context for AI

This document provides a detailed description of the application built upon the Material Kit 2 React template. It is intended to provide context for AI models.

## Application Overview

This application is a React-based web application focused on displaying quotes and incorporating gamification elements related to a "goth/emo" theme. It utilizes components and styling from the Material Kit 2 React library.

## Current Features

- **Quote Display:** Presents sentences or quotes to the user.
- **Gamified Quote Evaluation:** Allows users to evaluate whether a quote would be said by a goth/emo person via "Would say" / "Would not say" buttons.
- **Achievements System:** Tracks user progress and unlocks achievements based on their interactions, likely tied to the quote evaluation game.
- **Unlockable Content:** Provides special unlockable images (specifically "girl images" based on file names) tied to achievements.
- **Achievement Import/Export:** Functionality to import and export user achievement data.
- **Image Viewer:** A centered image viewer component, likely used to display the unlockable images.
- **Sound and Voice Controls:** Functionality to control sound and potentially voice output within the application.

## Potential Future Features (implementing a BE isn't being considered)

<!-- - **User Authentication and Profiles:** Implement user accounts to save progress, achievements, and settings across sessions and devices. NOT IMPLEMENTING BECAUSE THE IMPORT/EXPORT FEATURE ALREADY REPLACES IT-->
- **Quote Categories:** Introduce different categories for quotes (e.g., by theme, genre, or fictional characters).
<!-- - **User Quote Submissions:** Allow users to submit their own quotes for inclusion in the application. NOT IMPLEMENTING. SOUNDS DUMB -->
- **Social Sharing:** Integrate features to share achievements or quotes on social media platforms.
<!-- - **Expanded Gamification:** Add more complex gamification mechanics such as daily challenges, streaks, or leaderboards. CAN'T IMPLEMENT WITHOUT A BACKEND -->
- **Customization Options:** Provide options for users to customize the application's appearance (themes, fonts, background).
- **Advanced Sound/Voice Settings:** Offer more control over audio elements, including different voice options or background music selection.
- **Detailed Statistics:** Display comprehensive statistics on user performance in the quote evaluation game.
- **Onboarding Tutorial:** Create a guided tour or tutorial for new users to understand the application's features.
- **API Integration:** Potentially integrate with external APIs for fetching quotes or other relevant data.

## Technical Details

- Built using React and Material UI (MUI).
<!-- - Leverages the Material Kit 2 React template for UI components and structure. NOT ANYMORE -->
- Includes components for displaying text, handling user input (buttons), managing state (achievements), displaying images, and controlling audio.
- Uses local storage or a similar mechanism for achievement import/export.