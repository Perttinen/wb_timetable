## 📚 Tech Stack & Dependencies

This project uses a modern TypeScript + Node.js stack with the following frameworks, libraries, and tools:

### Core

- **Node.js / TypeScript** – Runtime and language for type‑safe backend development.
- **Express** – Web framework for building APIs.
- **Sequelize (Core + Postgres)** – ORM for database access and migrations.
- **pg** – PostgreSQL driver.

### Authentication & Security

- **bcrypt** – Password hashing.
- **jsonwebtoken** – JWT authentication.
- **cookie-parser** – Middleware for handling cookies.
- **dotenv** – Environment variable management.

### Utilities

- **chalk** – Terminal string styling.
- **umzug** – Migration framework for Sequelize.

### Development & Tooling

- **ts-node / ts-node-dev** – Run TypeScript directly in Node.js with hot reload.
- **typescript-eslint** – ESLint integration for TypeScript.
- **eslint** – Linting for code quality.
- **cross-env** – Cross‑platform environment variable support.

### Testing

- **jest / ts-jest** – Unit testing framework with TypeScript support.
- **supertest** – HTTP assertions for API testing.
- **@types/** packages – TypeScript type definitions for libraries (Express, Jest, bcrypt, etc.).
