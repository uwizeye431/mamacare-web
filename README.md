# MamaCare Web

MamaCare is a maternal-health web application. This repository contains a Next.js web client, an Express API, and a PostgreSQL database.

## How It Works

```mermaid
flowchart LR
    Browser[Browser] --> Web[Next.js UI\nlocalhost:3000]
    Web --> API[Express API\nlocalhost:5000]
    API --> DB[(PostgreSQL\nlocalhost:5432)]
    API --> Services[Email, AI, maps, storage\noptional integrations]
```

The normal request flow is:

1. The user opens the Next.js interface.
2. A page or form calls an endpoint on the Express API.
3. Express validates the request and checks authentication when required.
4. The relevant backend module reads or writes PostgreSQL.
5. The API returns JSON and the UI updates.

Optional services such as email, AI, maps, file storage, and SMS are used only by features that need them.

## Quick Start

### Prerequisites

- Node.js 20 or newer
- npm
- Docker Desktop for the local PostgreSQL database

Install dependencies from the repository root:

```powershell
npm install
```

### 1. Start the database

```powershell
docker compose up -d db
```

The local database uses these defaults:

| Setting | Value |
| --- | --- |
| Host | `localhost` |
| Port | `5432` |
| Database | `mamacare` |
| User | `postgres` |
| Password | `kevin123` |

The backend reads its connection from `server/.env` through `DATABASE_URL`.

### 2. Create the database schema

```powershell
npm run migrate
```

This applies the migration in `server/migrations/` and creates the application tables, enums, indexes, and extensions.

### 3. Start the backend

In a new terminal:

```powershell
npm run server
```

The Express API runs at `http://localhost:5000`. Check it with `http://localhost:5000/health`.

### 4. Start the frontend

In another terminal:

```powershell
npm run dev
```

Open `http://localhost:3000`. If port 3000 is occupied, Next.js prints the alternate port it selected.

## Three-Terminal Workflow

Keep these processes running during development:

```text
Terminal 1: docker compose up -d db
Terminal 2: npm run server
Terminal 3: npm run dev
```

When finished, stop the database with:

```powershell
docker compose down
```

Use `docker compose down -v` only for an intentional local database reset. It deletes the database volume and its data.

## Environment Configuration

Backend variables belong in `server/.env`. Keep real passwords, tokens, and API keys out of Git. A basic local configuration looks like this:

```dotenv
DATABASE_URL=postgresql://postgres:kevin123@localhost:5432/mamacare
JWT_SECRET=replace-with-a-local-secret
JWT_REFRESH_SECRET=replace-with-a-local-refresh-secret
PORT=5000
CORS_ORIGINS=http://localhost:3000
NODE_ENV=development
```

External integrations are optional for basic startup. Configure variables such as `ANTHROPIC_API_KEY`, SMTP settings, `GOOGLE_MAPS_API_KEY`, storage credentials, or Twilio credentials when working on those features.

## Folder Guide

| Location | Responsibility |
| --- | --- |
| `app/` | Next.js pages, layouts, and API routes |
| `components/` | Reusable frontend components |
| `store/` | Client-side state, including authentication |
| `server/src/index.ts` | Express application entry point |
| `server/src/modules/` | Backend feature modules, controllers, models, and routes |
| `server/src/middleware/` | Authentication and request middleware |
| `server/src/services/` | Shared backend services and integrations |
| `server/src/db/` | PostgreSQL connection and startup checks |
| `server/migrations/` | Versioned database schema changes |
| `public/` | Static browser assets |

## API Map

- `/api/auth` - registration, login, logout, OTP verification, and current user
- `/api/symptoms` - authenticated symptom logging and history
- `/api/profile` - authenticated profile operations
- `/api/visits` - authenticated antenatal visit operations
- `/health` - backend health check

Protected routes use the authentication middleware and the configured cookie flow.

## Useful Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run server` | Start the Express API with `tsx` |
| `npm run migrate` | Apply pending PostgreSQL migrations |
| `npm run build` | Create a production frontend build |
| `npm run start` | Serve the production frontend build |
| `docker compose ps` | Check the database container |
| `docker compose logs db` | View database logs |

## Troubleshooting

**Database connection fails**

Make sure Docker Desktop is running, the `db` container is up, and `DATABASE_URL` in `server/.env` matches the Compose values.

**Port 3000 or 5000 is already in use**

Next.js automatically chooses another frontend port. For the backend, stop the process using the port or set a different `PORT` in `server/.env`.

**Migration fails on an existing database**

Do not delete the volume if its data matters. Inspect the database first; `docker compose down -v` is a destructive local reset.

**Authentication or email features fail**

Check the JWT and SMTP variables in `server/.env`. The UI and basic API can start without every optional integration configured.
