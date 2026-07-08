# Playwright Automation Framework

This project provides an automated end-to-end testing suite for the [Practice Notes Application](https://practice.expandtesting.com/notes/app). It utilizes Playwright with TypeScript and the Page Object Model (POM) pattern to ensure robust, maintainable UI and API tests.

---

## Prerequisites

1. **Node.js**: Ensure you have Node.js installed on your system. You can download it from [Node.js Official Website](https://nodejs.org/)

- **npm**: Installed automatically with Node.js

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder>

   ```

2. Install the required dependencies:
   npm install

3. Install the required Playwright browsers:
   npx playwright install

4. Create a .env file in the root directory and add your test credentials:

USER_EMAIL=your_email@example.com
USER_PASSWORD=your_password

Run All Tests (Headless Mode)
npx playwright test

Run Tests in Headed Mode (to see the browser)
npx playwright test --headed
