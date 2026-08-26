# QA Testing Portfolio: PERN Stack Task Management System

This document serves as a portfolio piece demonstrating my QA Testing and API Automation skills. This project is a modular backend system built with **NestJS, PostgreSQL, Prisma ORM, and JWT Authentication**. 

My role in this project was to act as the primary **QA Engineer (SDET)** to ensure API reliability, data integrity, and secure access control.

---

## 📂 Live Testing Artifacts & Traceability
To build immediate transparency and trust, this repository contains real, production-ready QA artifacts:
*   📄 **[Traceable Test Case Sheet (Markdown)](TEST_CASES.md):** Structured like a QA test plan spreadsheet, tracking preconditions, execution steps, expected outcomes, and current status.
*   📬 **[Runnable Postman Collection (JSON)](PERN_Stack_Task_Management_System.postman_collection.json):** Exported collection for local API debugging, containing pre-configured environments and token extraction tests.

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

## 📋 Test Case Documentation Examples
As part of the QA process, I documented comprehensive test cases ensuring all Edge and Happy paths were covered.

**TC-001: Validate RBAC for Project Deletion**
*   **Precondition:** User A is an Admin. User B is a Standard User.
*   **Action:** User B sends `DELETE /project/:id`.
*   **Expected Result:** API returns `403 Forbidden`. The project remains in the database.

**TC-002: Validate Data Integrity on User Deletion (Cascade)**
*   **Precondition:** User has 1 associated Profile, 2 Projects, and 5 Tasks.
*   **Action:** System executes `DELETE /user/:id`.
*   **Expected Result:** API returns `200 OK`. Database verification confirms that the User, Profile, 2 Projects, and 5 Tasks were all successfully deleted via PostgreSQL `ON DELETE CASCADE`.

**TC-003: Validate Input Sanitization on Task Creation**
*   **Precondition:** User is authenticated.
*   **Action:** User sends `POST /task` with a SQL Injection payload in the name field: `{"name": "Task'; DROP TABLE tasks; --"}`.
*   **Expected Result:** API returns `201 Created` or `400 Bad Request`. The database safely stores or rejects the string without executing the SQL, preventing injection attacks.

**TC-004: Validate Rate Limiting on Authentication Endpoint**
*   **Precondition:** User is unauthenticated.
*   **Action:** Automated script sends 50 consecutive `POST /auth/login` requests within 5 seconds with incorrect passwords.
*   **Expected Result:** API returns `429 Too Many Requests` after the threshold is breached, mitigating brute-force attacks.

---

## 🐛 Bug Reports & Issue Tracking
During testing, I identified and resolved multiple critical issues affecting the application logic and database.

| Bug ID | Title | Priority | Status |
| :--- | :--- | :--- | :--- |
| **BUG-001** | `PrismaService` fails to compile due to missing `OnModuleDestroy` hook | **High** | ✅ **Closed** |
| **BUG-002** | ValidationPipe strips Payload data on `POST /project` causing DB 500 Error | **Critical** | ✅ **Closed** |
| **BUG-003** | Insecure Direct Object Reference (IDOR) allows cross-user task fetching | **Critical** | ✅ **Closed** |
| **BUG-004** | Missing pagination on `GET /task` leads to performance degradation (OOM risk) | **Medium** | ⏳ **Open** |
| **BUG-005** | Expired JWT returns `500 Internal Server Error` instead of `401 Unauthorized` | **Low** | ✅ **Closed** |
| **BUG-006** | User password stored in plain-text instead of bcrypt hashed | **Critical** | ✅ **Closed** |
| **BUG-007** | Prisma Connection Pool exhaustion during high-load API stress test | **High** | ⏳ **Open** |
| **BUG-008** | Orphaned records remain in DB upon User deletion (Missing Cascade) | **High** | ✅ **Closed** |
| **BUG-009** | Permissive CORS policy (`*`) allows unauthorized cross-origin requests | **Medium** | ✅ **Closed** |
| **BUG-010** | Mass Assignment vulnerability on `PATCH /task` allows changing `userId` | **High** | ✅ **Closed** |

### Detailed Bug Report: BUG-002
**Title:** ValidationPipe strips incoming payload data due to empty DTOs, causing Prisma Server Error (500).

**Steps to Reproduce:**
1. Authenticate and retrieve a valid JWT.
2. Send a `POST` request to `/project` with JSON body: `{"name": "QA Project"}`.
3. Observe the response and server logs.

**Expected Result:**
The API should return `201 Created` and successfully insert the project into the database.

**Actual Result:**
The API returns a `500 Internal Server Error`. The server log shows: 
`PrismaClientValidationError: Argument name is missing`.

**Root Cause & Resolution:**
The global NestJS `ValidationPipe` was configured with `whitelist: true`. However, the generated `CreateProjectDto` class had no properties explicitly defined with decorators. Therefore, the ValidationPipe considered all incoming fields as "unauthorized" and stripped them out, sending an empty object `{}` to Prisma. 
*Fix:* I added the proper TypeScript types and class-validator decorators (e.g. `@IsString() name: string;`) to the DTOs across all 5 modules.

### Detailed Bug Report: BUG-003
**Title:** Insecure Direct Object Reference (IDOR) on Task retrieval endpoint.

**Steps to Reproduce:**
1. Log in as **User A** and create a Task. Note the `taskId`.
2. Log in as **User B** (a completely different user).
3. Send a `GET` request to `/task/{taskId}` using User B's authentication token.

**Expected Result:**
The API should return `403 Forbidden` or `404 Not Found` because the task does not belong to User B.

**Actual Result:**
The API returns `200 OK` along with User A's private task data.

**Root Cause & Resolution:**
The `TaskService.findOne(id)` method was querying the database solely by the `id` parameter provided in the URL, without verifying that the `userId` attached to the task matches the `userId` from the JWT token.
*Fix:* Modified the Prisma query to include the user context: `this.prisma.task.findUnique({ where: { id: id, userId: user.userId } })`.

### Detailed Bug Report: BUG-006
**Title:** Security: User passwords are saved in plain-text during registration.

**Steps to Reproduce:**
1. Send a `POST` request to `/auth/register` with a username and password.
2. Open Prisma Studio or directly query the PostgreSQL database.
3. Inspect the `User` table for the newly created user record.

**Expected Result:**
The password field should contain a cryptographic hash (e.g., bcrypt hash starting with `$2b$`).

**Actual Result:**
The password field contains the exact plain-text password submitted by the user.

**Root Cause & Resolution:**
The `AuthService.register()` method was passing the DTO directly to the Prisma `create` function without invoking a hashing utility.
*Fix:* Integrated the `bcrypt` library to securely hash the password with a salt round of 10 prior to inserting the record into the database.

### Detailed Bug Report: BUG-010
**Title:** Mass Assignment vulnerability allows users to re-assign tasks to other users.

**Steps to Reproduce:**
1. Log in as **User A**.
2. Identify a task belonging to User A (e.g. `taskId: 5`).
3. Send a `PATCH /task/5` request with the payload: `{"isCompleted": true, "userId": 99}`.
4. Attempt to fetch `GET /task/5` as User A.

**Expected Result:**
The `userId` field should be ignored by the update controller, and the task should remain owned by User A.

**Actual Result:**
The task is successfully re-assigned to `userId: 99` and disappears from User A's dashboard.

**Root Cause & Resolution:**
The `UpdateTaskDto` implicitly allowed all fields from the Prisma schema to be passed directly into the `update` query without filtering.
*Fix:* Excluded sensitive relational fields (`userId`) from the DTO, ensuring that only specific user-modifiable fields (like `name`, `description`, `isCompleted`) can be updated.

---

## 🤖 Automated End-to-End (E2E) Testing Pipeline
To ensure regression stability, I engineered a massive **17-step End-to-End Automation Suite** using **Jest and Supertest**.

### Suite Capabilities:
*   **Simulated User Journeys:** The suite autonomously registers a QA user, logs them in, extracts the JWT token, and passes it as a Bearer token to subsequent requests.
*   **Relational Database Validation:** Creates a Project, creates a Category, and then creates a Task linked to both. It validates that the SQL foreign keys map correctly in the response.
*   **Automated Teardown:** Implemented a rigorous cleanup flow that autonomously sends `DELETE` requests to remove the generated Comment, Task, Category, Project, and Profile, verifying `200 OK` responses and ensuring zero database bloat.

### Continuous Integration (CI/CD)
I integrated this test suite into a **GitHub Actions CI/CD Pipeline**. 
On every `git push` or pull request, a remote Ubuntu server spins up a PostgreSQL container, applies migrations, and executes the Jest E2E suite—guaranteeing that no breaking changes are merged into production.

---
*Developed & Tested by a passionate QA Professional.*
