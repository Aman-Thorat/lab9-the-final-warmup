# Lab 9 - The Final Warmup: Working a "Brown Field"

## Project Overview

This lab focuses on taking AI-generated "brownfield" code and turning it into professional and quality software 
through proper testing, documentation, refactoring, and deployment practices. The application is a Task Management 
Application.

## Deployed Application

The application is live and automatically deployed to Cloudflare Pages:

### **[https://lab9-the-final-warmup](https://lab9-the-final-warmup-cu5.pages.dev/)**

---
## ✨ Features

### Core Functionality
* **Create Tasks:** Add new tasks via an input form.
* **Edit Tasks:** Double-click or click 'Edit' to update task text.
* **Delete Tasks:** Remove tasks individually.
* **Toggle Completion:** Mark tasks as complete or incomplete.
* **Data Persistence:** All tasks are saved to `localStorage`, so your list is saved between sessions.

### Custom Features (Making it Mine)
* **Dark Mode Toggle:** A theme-switcher button to toggle between light and dark mode. Your preference is also saved to `localStorage`.
* **Export/Import Tasks:**
    * **Export:** Downloads all current tasks as a `todos-export.json` file.
    * **Import:** Allows uploading a valid JSON file to replace all tasks in the app

## Tech Stack

* **Framework:** [Lit](https://lit.dev/) 
* **Bundler:** [Vite](https://vitejs.dev/)
* **Unit Testing:** [Node.js Test Runner](https://nodejs.org/api/test.html)
* **E2E Testing:** [Playwright](https://playwright.dev/)
* **Linting:** [ESLint](https://eslint.org/)
* **Formatting:** [Prettier](https://prettier.io/)
* **Documentation:** [JSDoc](https://jsdoc.app/)
* **Hosting:** [Cloudflare Pages](https://pages.cloudflare.com/)

### Learning Objectives
- ✅ Refactor and improve AI-generated code
- ✅ Work with new technologies
- ✅ Implement comprehensive testing unit and E2E
- ✅ Set up CI/CD with GitHub Actions
- ✅ Generate documentation with JSDocs
- ✅ Use GitHub Issues for project management
- ✅ Add personal improvements and features

## Setup & Installation

```bash
git clone https://github.com/Aman-Thorat/lab9-the-final-warmup.git
cd lab9-the-final-warmup

npm install

npm run dev

npm run build

npm run preview
```

## Testing/Docs Instructions
```bash
npm run test

npm run test:e2e

npm run docs
```

## License

MIT License

---

## Author

**Aman Thorat**  

---

## 🔗 Links

- [Deployed Application](https://lab9-the-final-warmup-cu5.pages.dev/)
- [GitHub Repository](https://github.com/Aman-Thorat/lab9-the-final-warmup)
- [Project Issues](https://github.com/Aman-Thorat/lab9-the-final-warmup/issues)

---

**Last Updated:** 11/05/2025