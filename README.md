# PERN Stack Task Management System - QA Automation Portfolio 🚀

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

Welcome to the **PERN Stack Task Management System** repository. This project is a fully functional, highly secure Task Management API built to demonstrate advanced **QA Testing**, **API Automation**, and **Backend Architecture**.

This project serves as a technical portfolio piece for QA Tester / SDET roles.

## 🎯 Key QA & Testing Highlights

- **Automated E2E Testing Pipeline:** Contains a comprehensive automated testing suite (`test/qa-flow.e2e-spec.ts`) that executes a full simulated user journey.
- **Security Validation:** Tests validate JWT Authentication, RBAC (Role-Based Access Control), and Unauthorized Access prevention.
- **Database Cleanup Strategy:** E2E tests are designed to execute teardown operations (`DELETE`) automatically, ensuring test isolation and zero database bloat.
- **CI/CD Integration:** Configured with **GitHub Actions**. Every single push or pull request triggers a fresh Ubuntu environment, spins up a PostgreSQL service container, runs database migrations, and executes the Jest E2E tests automatically.

## 📂 Testing Artifacts & Assets

To demonstrate professional QA practices, this repository hosts real-world testing artifacts:
*   📄 **[Markdown Test Case Sheet](TEST_CASES.md):** A detailed, traceability-mapped registry of manual and automated test cases covering authentication guards, relational constraints, IDOR blocks, and database cascade operations.
*   📬 **[Postman Collection Export](PERN_Stack_Task_Management_System.postman_collection.json):** A pre-configured, runnable API test suite with environmental variables and script assertions to evaluate live APIs.

## 🛠️ Tech Stack & Architecture

- **Framework:** NestJS (Node.js)
- **Database:** PostgreSQL
- **ORM:** Prisma ORM
- **Authentication:** JWT (JSON Web Tokens) & Passport
- **API Docs:** Swagger (OpenAPI)
- **Test Runner:** Jest + Supertest

## 📦 Core Modules

The API features a fully normalized relational database schema with cascading deletions:

1.  **Auth & Users:** Registration, Login, Profile generation.
2.  **Projects:** Group tasks logically.
3.  **Categories:** Labeling tasks (e.g., "Bug", "Feature").
4.  **Tasks:** The core entity, securely tied to Users, Projects, and Categories.
5.  **Comments:** Collaboration thread on Tasks.

## 🚀 Running the Project Locally

### 1. Database Setup

Ensure you have PostgreSQL running. Set your database URL in a `.env` file:
\`\`\`env
DATABASE_URL="postgresql://username:password@localhost:5432/task_management_db?schema=public"
JWT_SECRET="your_secret_key"
\`\`\`

### 2. Install & Start

\`\`\`bash

# Install dependencies

pnpm install

# Run database migrations and generate client

npx prisma migrate dev
npx prisma generate

# Start the application in development mode

npm run start:dev
\`\`\`

### 3. Interactive API Documentation

Once the server is running, navigate to the **Swagger UI** to easily test all endpoints directly from your browser:
👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

## 🤖 Running the Automated QA Suite

To execute the End-to-End API Automation tests locally:
\`\`\`bash
npm run test:e2e
\`\`\`
_The test runner will autonomously register a QA user, retrieve the JWT Token, and execute operations across every module while verifying the SQL relational logic._

---

_Developed & Tested by a passionate QA Fresher._
