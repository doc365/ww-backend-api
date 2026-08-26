# API Test Cases — PERN Stack Task Management System

This document catalogs the manual and automated test cases designed to validate key system behavior, security constraints, and data integrity.

---

## 🔑 Authentication & Authorization

| Test Case ID | Module | Title / Objective | Pre-conditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-AUTH-001** | Auth | Register a new user | Email is not already in use. | 1. Send `POST /auth/register` with valid email & password. | HTTP `201 Created` returned. User record created in database. | ✅ **Passed** |
| **TC-AUTH-002** | Auth | Login user & retrieve token | User is registered. | 1. Send `POST /auth/login` with correct email & password. | HTTP `201 Created` returned. Response payload includes `access_token`. | ✅ **Passed** |
| **TC-AUTH-003** | Auth | Reject requests without token | Endpoint requires authentication. | 1. Send `POST /project` without providing `Authorization` header. | HTTP `401 Unauthorized` returned. Access is blocked. | ✅ **Passed** |
| **TC-AUTH-004** | Auth | Fail login with malformed inputs | None. | 1. Send `POST /auth/login` with invalid email format. | HTTP `401 Unauthorized` returned (handled by Passport guard). | ✅ **Passed** |

---

## 📂 Project & Task Operations (CRUD)

| Test Case ID | Module | Title / Objective | Pre-conditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-CRUD-001** | Projects | Create new Project | User is authenticated. | 1. Send `POST /project` with valid project metadata. | HTTP `201 Created` returned. Project ID generated in database. | ✅ **Passed** |
| **TC-CRUD-002** | Tasks | Create Task linked to Project | Project and Category exist. | 1. Send `POST /task` containing `projectId` and `categoryId`. | HTTP `201 Created` returned. Database correctly establishes relations. | ✅ **Passed** |
| **TC-CRUD-003** | Tasks | Read task by ID | Task exists and belongs to user. | 1. Send `GET /task/:id` with matching credentials. | HTTP `200 OK` returned with exact task payload matching schema. | ✅ **Passed** |
| **TC-CRUD-004** | Tasks | Update task status | Task exists and belongs to user. | 1. Send `PATCH /task/:id` with updated completion status. | HTTP `200 OK` returned. Status flag updated on DB. | ✅ **Passed** |
| **TC-CRUD-005** | Tasks | Prevent cross-user data access (IDOR) | Task belongs to User A. User B is authenticated. | 1. Send `GET /task/:id` as User B. | HTTP `404 Not Found` or `403 Forbidden` returned. | ✅ **Passed** |

---

## 🧹 Cascading Database Teardowns

| Test Case ID | Module | Title / Objective | Pre-conditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-DB-001** | Database | User deletion cascades to Tasks | User exists and owns tasks. | 1. Send `DELETE /user/:id` (Admin operation). | HTTP `200 OK` returned. Cascading deletion successfully purges user's tasks. | ✅ **Passed** |
| **TC-DB-002** | Database | Project deletion nullifies Task project references | Task is associated with a Project. | 1. Send `DELETE /project/:id`. | HTTP `200 OK` returned. Task remains in DB, but its `projectId` is set to null. | ✅ **Passed** |
