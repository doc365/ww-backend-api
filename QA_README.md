# QA Testing Portfolio: WW Backend API

This document serves as a portfolio piece demonstrating my QA Testing and API Automation skills. This project is a modular backend system built with **NestJS, PostgreSQL, Prisma ORM, and JWT Authentication**. 

My role in this project was to act as the primary **QA Engineer (SDET)** to ensure API reliability, data integrity, and secure access control.

---

## 🎯 Test Strategy & Scope
The testing scope for this project focused heavily on Backend API validation, Security (RBAC), and Database integrity. 
*   **Test Types Executed:** Functional Testing, API Automation, Security (Auth) Testing, Regression Testing.
*   **Tools Used:** Postman (Collections & Scripts), Jest (E2E testing framework), Prisma Studio (Database verification).

---

## 🧪 Postman API Automation
I utilized Postman's native version-controlled folder structure (`/postman` directory) to maintain a complete suite of API tests. 

### Key Features Tested:
1. **Authentication Flow:**
   *   Verified successful token generation on `POST /auth/login`.
   *   Implemented automated Postman scripts to capture and inject the `JWT Token` as a Bearer Token for all subsequent protected requests.
2. **Role-Based Access Control (RBAC):**
   *   Verified that standard users receive a `403 Forbidden` when attempting to delete a user (`DELETE /user/:id`).
   *   Verified that Admins have full access.
3. **Tasks CRUD Operations:**
   *   Validated `201 Created` status for successful task creation.
   *   Verified that users can only retrieve and modify tasks associated with their own `userId`.

---

## 🐛 Bug Report Example
During testing, I identified and resolved a critical compilation failure affecting the database connection.

| Bug ID | Title | Priority | Status |
| :--- | :--- | :--- | :--- |
| **BUG-001** | `PrismaService` fails to compile due to missing `OnModuleDestroy` hook | **High** | ✅ **Closed** |

**Steps to Reproduce:**
1. Clone repository and run `npm install`.
2. Start the development server using `npm run start:dev`.
3. Observe the console output.

**Expected Result:**
The NestJS server compiles and starts on port 3000 without errors.

**Actual Result:**
The server crashes on startup with: `error TS2420: Class 'PrismaService' incorrectly implements interface 'OnModuleDestroy'`.

**Root Cause & Resolution:**
The Prisma service was utilizing an outdated lifecycle method (`enableShutdownHooks()`). I reported the issue and corrected the implementation by replacing it with standard NestJS `async onModuleDestroy()` logic, restoring full database connectivity.

---

## 🤖 Automated End-to-End (E2E) Testing
*(Note for CV: You can expand this section once you push E2E tests to the `test/` folder)*
- Integrated automated tests using **Jest and Supertest**.
- Tests automatically spin up an instance of the NestJS application and execute HTTP requests against the database.
- Used to catch regressions before deployments.

---
*Created for QA Portfolio purposes to demonstrate proficiency in modern backend testing workflows.*
