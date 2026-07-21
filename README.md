WW Backend API is a modular backend system built with NestJS following clean architecture principles.

It provides:

JWT-based authentication

Role-based authorization

PostgreSQL integration via Prisma ORM

Secure password hashing

Modular and scalable structure

This project serves as a production-ready backend foundation for full-stack applications.

Tech Stack

Framework

NestJS

TypeScript

Authentication

Passport.js

JWT

bcrypt

Database

PostgreSQL

Prisma ORM

Configuration

@nestjs/config

dotenv

Testing & Tools

Postman

Git

Project Setup
$ npm install

Environment Variables

Create a .env file in the root directory:

DATABASE_URL="postgresql://user:password@localhost:5432/ww_db"
JWT_SECRET="your-secret-key"

Database Setup

Run Prisma migration:

$ npx prisma migrate dev


Generate Prisma client:

$ npx prisma generate

Compile and Run the Project
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod


Server runs at:

http://localhost:3000

API Endpoints
Authentication
Method	Endpoint	Description
POST	/auth/register	Register new user
POST	/auth/login	Login and receive JWT
GET	/auth/me	Get current user (Protected)
Authentication Flow

User registers → password hashed with bcrypt

User logs in → JWT token issued

Client sends token via Authorization: Bearer <token>

JwtStrategy validates token

Protected route accessed via JwtAuthGuard

Features

Modular architecture (AuthModule, UserModule)

JWT Strategy + AuthGuard

Role-based authorization ready

Prisma schema with unique email constraint

Centralized error handling

Environment-based configuration

Type-safe database queries

Run Tests
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

Deployment

For production:

$ npm run build
$ npm run start:prod


Recommended improvements before production:

Add refresh tokens

Add request validation (DTO)

Add logging system

Dockerize application

Setup CI/CD pipeline

Project Structure
src/
 ├── auth/
 │   ├── auth.controller.ts
 │   ├── auth.service.ts
 │   ├── jwt.strategy.ts
 │   ├── guards/
 │   ├── decorators/
 │   └── interfaces/
 │
 ├── user/
 │   ├── user.controller.ts
 │   ├── user.service.ts
 │   └── user.module.ts
 │
 ├── prisma/
 ├── app.module.ts
 └── main.ts

Author

Backend Developer
Node.js | NestJS | PostgreSQL | Prisma | JWT

License

This project is licensed under the MIT License.