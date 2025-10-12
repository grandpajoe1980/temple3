# Temple3 Environment Reference

This document captures the minimum local environment needed to run the Temple3 backend API and React frontend for development or manual testing.

## Core Technology Stack
- **Backend:** Node.js/Express server launched from `src/server.js` on port 3000 by default. 【F:QUICKSTART.md†L43-L49】【F:.env.example†L13-L17】
- **Frontend:** React + Vite single-page app served on port 3001 by default, proxying API calls to the backend. 【F:STARTUP_SCRIPTS.md†L47-L58】【F:frontend/src/utils/constants.js†L1-L3】
- **Database:** PostgreSQL instance accessible on port 5432. 【F:QUICKSTART.md†L30-L40】【F:STARTUP_SCRIPTS.md†L53-L61】

## System Prerequisites
- **Node.js 14 or newer** (docs demonstrate installing Node 18 on Linux servers; matching that version locally is recommended). 【F:QUICKSTART.md†L5-L8】【F:DEPLOYMENT.md†L94-L113】
- **npm** (bundled with Node.js) for dependency management. 【F:QUICKSTART.md†L10-L16】【F:STARTUP_SCRIPTS.md†L87-L93】
- **PostgreSQL 12 or newer** with access to the `createdb` and `psql` CLI tools. 【F:QUICKSTART.md†L5-L40】【F:DEPLOYMENT.md†L63-L74】
- **PowerShell (Windows only)** if you plan to use the provided automation scripts. 【F:STARTUP_SCRIPTS.md†L7-L37】

## Repository Setup
1. **Clone the repository and install backend dependencies.** 【F:QUICKSTART.md†L10-L16】
   ```bash
   git clone https://github.com/grandpajoe1980/temple3.git
   cd temple3
   npm install
   ```
2. **Install frontend dependencies.** 【F:STARTUP_SCRIPTS.md†L87-L93】
   ```bash
   cd frontend
   npm install
   ```
   Return to the project root after installing.

## Environment Variables
1. **Backend `.env` file** (create from example, then customize). 【F:QUICKSTART.md†L18-L28】【F:.env.example†L1-L17】
   ```bash
   cp .env.example .env
   ```
   Required keys:
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
   - `JWT_SECRET` (use a strong 32+ character value) and `JWT_EXPIRES_IN`
   - `PORT` (defaults to 3000) and `NODE_ENV`
   - `CORS_ORIGIN` (defaults to `http://localhost:3001` for local frontend)
2. **Frontend `.env` file** (optional but recommended when the API base URL differs from default). 【F:frontend/src/utils/constants.js†L1-L3】
   ```bash
   cd frontend
   touch .env
   echo "VITE_API_BASE_URL=http://localhost:3000/api" >> .env
   ```

## Database Preparation
1. Ensure PostgreSQL is running locally and accessible with the credentials in `.env`.
2. Create the development database and load the schema. 【F:QUICKSTART.md†L30-L40】
   ```bash
   createdb temple3
   npm run setup-db
   ```
3. (Optional) Seed sample data for testing. 【F:QUICKSTART.md†L30-L40】
   ```bash
   npm run seed-db
   ```

## Running the Application Locally
- **Backend API:** from the project root run `npm run dev`. 【F:QUICKSTART.md†L43-L47】
- **Frontend UI:** in a separate terminal run `npm run dev` from the `frontend` directory. 【F:STARTUP_SCRIPTS.md†L38-L51】
- Once both services are running you can access:
  - Frontend at `http://localhost:3001`
  - Backend API at `http://localhost:3000`
  - Backend health check at `http://localhost:3000/health`
  - PostgreSQL on `localhost:5432`
  【F:STARTUP_SCRIPTS.md†L53-L61】

## Helpful Utilities and Checks
- Validate PostgreSQL availability: `pg_isready` (Linux/macOS) or `Get-Service -Name "*postgresql*"` (Windows). 【F:QUICKSTART.md†L96-L101】【F:STARTUP_SCRIPTS.md†L68-L83】
- If port 3000/3001 conflicts occur, adjust `PORT` in `.env` or let Vite choose a new frontend port automatically. 【F:QUICKSTART.md†L103-L105】【F:STARTUP_SCRIPTS.md†L76-L78】
- For production-style smoke tests use `npm start` after building dependencies. 【F:DEPLOYMENT.md†L82-L88】

Following the steps above ensures a consistent local environment for ongoing development, manual QA, or future automation work.
