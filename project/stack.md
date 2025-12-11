## ⚙️ Tech Stack

This project is organized as a **monorepo** with separate frontend and backend packages.

---

### 🖥️ Backend (`wb_timetable`)

Built with **TypeScript + Node.js**, providing APIs and database management.

- **Runtime & Language**

  - Node.js
  - TypeScript
  - ts-node / ts-node-dev (development runtime)

- **Frameworks**

  - Express (v5 beta) – Web framework
  - express-async-handler – Async error handling middleware

- **Database**

  - PostgreSQL (`pg`)
  - Sequelize Core + Postgres dialect (ORM)
  - Umzug – Migration framework

- **Authentication & Security**

  - bcrypt – Password hashing
  - jsonwebtoken – JWT authentication
  - cookie-parser – Cookie handling
  - dotenv – Environment variable management

- **Utilities**

  - chalk – Terminal string styling
  - path – Node.js path utilities (built-in, dependency not required)

- **Testing**

  - Jest / ts-jest – Unit testing
  - Supertest – API integration testing

- **Linting & Tooling**
  - ESLint + TypeScript ESLint
  - cross-env – Cross-platform environment variables

---

### 🌐 Frontend (`frontend`)

Built with **React + TypeScript**, providing the timetable viewer and management UI.

- **Frameworks**

  - React 19
  - React DOM
  - React Router v7 – Routing
  - React Scripts (CRA tooling)

- **State Management**

  - Redux Toolkit
  - React Redux

- **UI & Styling**

  - MUI (Material UI) – Components
  - MUI Icons
  - MUI X Date Pickers
  - Emotion (react + styled) – CSS-in-JS styling

- **Forms & Validation**

  - Formik – Form handling
  - Yup – Schema validation

- **Utilities**

  - Day.js – Date/time formatting
  - Web Vitals – Performance metrics

- **Testing**
  - React Testing Library (DOM, React, user-event)
  - Jest DOM matchers

---

### 🛠 Development Notes

- Backend uses **Express v5** and **Sequelize v7 alpha**, which are in beta/alpha — consider stability before production deployment.
- Environment variables are managed via `.env` (document expected variables in `.env.example`).
- Frontend uses **Create React App (CRA)** tooling (`react-scripts`).
- Monorepo structure:
  - `/backend` → API + migrations
  - `/frontend` → React app (proxied to backend at `http://localhost:3001`)

---
