# 🦇 JGoth Validator - Goth/Emo JSON Formatter

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-black.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-black.svg)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/MUI-5.x-purple.svg)](https://mui.com/)

A dark, goth/emo-themed JSON formatter and validator with gamification elements. Format your JSON with style while unlocking achievements and enjoying a unique aesthetic experience.

![JGoth Validator](public/goth-icon.jpg)

---

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Internationalization](#internationalization)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## 🌙 Overview

JGoth Validator is a single-page React application that transforms the mundane task of JSON formatting into an engaging experience. Built with a distinctive goth/emo aesthetic, this client-side tool offers JSON validation, formatting, and a gamified achievement system—all without requiring a backend.

**Who is this for?**
- Developers who want a stylish JSON formatter
- Teams looking for a fun, gamified development tool
- Anyone who appreciates dark-themed applications

---

## ✨ Features

- **🎨 JSON Formatting & Validation**: Format and validate JSON with clear, user-friendly error messages
- **📄 Multi-Page Interface**: Work with multiple JSON documents using a tabbed pagination system
- **🏆 Achievement System**: Unlock achievements as you use the application, with import/export functionality
- **🌓 Theme Selection**: Choose from multiple viewer themes for the JSON display
- **🌍 Internationalization**: Full support for English and German languages
- **🔊 Sound & Voice Controls**: Toggle sound effects and AI voice feedback
- **💾 Local Persistence**: All state persisted in browser local storage—no backend required
- **🖼️ Image Viewer**: View unlocked achievement images in a centered viewer
- **🦇 Goth/Emo Aesthetic**: Dark, edgy design throughout the application

---

## 📸 Screenshots

*Coming soon: Add screenshots of your application here*

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.x or higher)
- **npm** (v8.x or higher) or **yarn** (v1.22.x or higher)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/json_formatter.git
cd json_formatter
```

2. **Install dependencies:**

```bash
npm install
```

or if you prefer yarn:

```bash
yarn install
```

### Running Locally

1. **Start the development server:**

```bash
npm start
```

or with yarn:

```bash
yarn start
```

2. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

3. **Build for production:**

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

---

## 💻 Usage

### Basic JSON Formatting

1. **Enter JSON**: Paste or type your JSON into the input text area
2. **Format**: Click the "Format" button to beautify your JSON
3. **Validate**: The application automatically validates JSON and displays clear error messages for invalid syntax
4. **Copy**: Use the "Copy" button to copy formatted JSON to your clipboard

### Working with Multiple Documents

```javascript
// Use the pagination controls at the bottom to:
// - Add new JSON pages
// - Navigate between pages
// - Remove pages you no longer need
```

### Unlocking Achievements

Achievements are automatically unlocked as you use the application:
- Format your first JSON
- Work with large JSON files
- Use the application regularly
- And many more!

### Changing Language

Click the language flag selector in the control panel to switch between English and German.

### Exporting/Importing Progress

```javascript
// Export achievements
Click "Export Achievements" to download your progress as a JSON file

// Import achievements
Click "Import Achievements" and select a previously exported file
```

---

## 📁 Project Structure

```
json_formatter/
├── public/
│   ├── index.html
│   ├── locales/           # Translation files
│   │   ├── en/
│   │   └── de/
│   └── goth-girls/        # Achievement images
├── src/
│   ├── App.js             # Main application component
│   ├── i18n.js            # Internationalization setup
│   ├── config/
│   │   └── achievements.ts # Achievement definitions
│   ├── core/
│   │   └── json-validator.ts # JSON validation logic
│   ├── pages/
│   │   └── Home/          # Main application page
│   │       ├── index.js
│   │       └── components/
│   │           ├── FormatterActions/
│   │           ├── InputOutputSection.tsx
│   │           ├── GothSection.tsx
│   │           └── Pagination/
│   └── utils/
│       └── localStorageHandler.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Key Files

- **[`src/core/json-validator.ts`](src/core/json-validator.ts)**: JSON validation logic
- **[`src/pages/Home/index.js`](src/pages/Home/index.js)**: Main application component with state management
- **[`src/pages/Home/components/FormatterActions/FormatterActions.tsx`](src/pages/Home/components/FormatterActions/FormatterActions.tsx)**: User action buttons
- **[`src/config/achievements.ts`](src/config/achievements.ts)**: Achievement system configuration

---

## 🌍 Internationalization

The application uses `react-i18next` for internationalization. Translation files are located in:

```
public/locales/
├── en/
│   └── translation.json
└── de/
    └── translation.json
```

To add a new language:

1. Create a new folder in `public/locales/` (e.g., `fr/`)
2. Add a `translation.json` file with translated strings
3. Update the language selector in [`src/pages/Home/components/GothSection.tsx`](src/pages/Home/components/GothSection.tsx)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear description of the problem
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots if applicable

### Suggesting Features

Feature requests are appreciated! Please:
- Check existing issues first to avoid duplicates
- Clearly describe the feature and its use case
- Explain why it would be valuable

### Submitting Pull Requests

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** following the coding style:
   - Use TypeScript for new files where possible
   - Follow existing code formatting (Prettier config in [`.prettierrc.json`](.prettierrc.json))
   - Ensure ESLint passes ([`.eslintrc.json`](.eslintrc.json))
4. **Test your changes** thoroughly
5. **Commit your changes:**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your fork:**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request** with:
   - Clear description of changes
   - Reference to any related issues
   - Screenshots for UI changes

### Code Style

- Use meaningful variable and function names
- Add comments for complex logic
- Follow React best practices and hooks guidelines
- Maintain the goth/emo aesthetic in UI changes

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 JGoth Validator Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **[Material-UI](https://mui.com/)** - React component library
- **[react-i18next](https://react.i18next.com/)** - Internationalization framework
- **[react-toastify](https://fkhadra.github.io/react-toastify/)** - Toast notifications
- All the goth developers who inspired this project's aesthetic 🦇

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/json_formatter/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/json_formatter/discussions)

---

<div align="center">
  <p>Made with 🖤 by developers who appreciate the darkness</p>
  <p>⭐ Star this repo if you find it useful!</p>
</div>
