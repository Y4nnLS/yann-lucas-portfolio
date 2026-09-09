# Architecture

## Overview

This repository is a small monorepo split between:

- `frontend/`: a Next.js application responsible for public pages and the private admin UI.
- `backend/`: a FastAPI application responsible for persistence, authentication, uploads, GitHub integration, and REST APIs.

## Key Decisions

- Public content is fetched from the FastAPI application so the portfolio remains editable from the admin panel.
- Public pages use Server Components whenever possible to keep the client bundle lighter.
- Administrative authentication is enforced on the API. Front-end route protection improves UX only.
- Local upload storage is wrapped behind a storage service so it can be replaced by external object storage later.
- The initial schema uses UUID identifiers and UTC timestamps.

## Runtime Flow

1. The browser loads public or admin pages from Next.js.
2. Next.js reads public data from the API using `fetch`.
3. Admin actions call the FastAPI API with credentials included.
4. FastAPI persists data in PostgreSQL and stores media files in the local media directory.

