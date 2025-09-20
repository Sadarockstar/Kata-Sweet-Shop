# Kata Sweet Shop - Backend

Quick start
-----------
1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file (use `.env.example` as a template) and set your MongoDB URI and JWT secret.

3. Run the server in development:

```bash
npm run dev
```

Overview
--------
This repository contains an Express + MongoDB backend for a simple Sweet Shop API. It supports user authentication (JWT), role-based access control (admin) and CRUD operations on sweets plus inventory management.

AI attribution
----------------------
AI contribution was limited to generating starter code and fixing a few errors.

API Routes
----------
Auth
- POST /api/auth/register
  - Registers a new user. Accepts: `username`, `email`, `password`, optional `role` (defaults to `user`). Returns a JWT.
- POST /api/auth/login
  - Logs in a user. Accepts: `email`, `password`. Returns a JWT.

Sweets (Protected - require Authorization header `Bearer <token>`)
- POST /api/sweets
  - Create a new sweet. Admin only. Body: `name`, `description`, `category`, `price`, `quantity`, `image` (optional).
- GET /api/sweets
  - Get a list of all sweets.
- GET /api/sweets/search?query=&category=&minPrice=&maxPrice=
  - Search sweets by name/description, category, and price range.
- PUT /api/sweets/:id
  - Update a sweet (Admin only).
- DELETE /api/sweets/:id
  - Delete a sweet (Admin only).
- POST /api/sweets/:id/purchase
  - Purchase a sweet (decreases quantity). Body: `quantity`.
- POST /api/sweets/:id/restock
  - Restock a sweet (Admin only). Body: `quantity`.

Notes & Troubleshooting
-----------------------
- Protected routes require a valid JWT in the `Authorization` header, format: `Bearer <token>`.
- To create an admin user, pass `"role": "admin"` during registration, or update the user's `role` directly in the database.
- Search parameters are sent as query parameters on the URL (not in the request body): e.g. `/api/sweets/search?query=rosha`.

Project structure
-----------------
- `src/`
  - `config/` - database connection
  - `controllers/` - route handlers
  - `middleware/` - auth middleware
  - `models/` - Mongoose schemas
  - `routes/` - Express route definitions

