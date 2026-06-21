# HeartPlan Backend

## Overview

Django 5.2 + Django REST Framework + SimpleJWT backend for HeartPlan. Runs locally on SQLite with a single-user dev setup.

## Local Development Setup

### Prerequisites

- Python 3.13 (the project virtualenv at `../.venv/` is Python 3.13)
- The virtualenv is at the repo root: `HeartPlan/.venv/`

### 1. Copy `.env` from example and generate a SECRET_KEY

```bash
cd backend/
cp .env.example .env
```

Then replace the placeholder `SECRET_KEY` in `.env` with a real value:

```bash
../.venv/bin/python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
# Paste the output into backend/.env as: SECRET_KEY=<generated_value>
```

### 2. Install dependencies

```bash
../.venv/bin/python -m pip install -r requirements.txt
```

Prod-only pins (`psycopg2-binary`, `gunicorn`, `whitenoise`) are commented out — local dev uses SQLite and `runserver`.

### 3. Run migrations

```bash
cd backend/
../.venv/bin/python manage.py makemigrations
../.venv/bin/python manage.py migrate
```

### 4. Seed the dev admin user

```bash
../.venv/bin/python manage.py seed_admin
# Creates superuser admin / admin123 (idempotent — safe to re-run)
```

### 5. Start the development server

```bash
../.venv/bin/python manage.py runserver
# Listening at http://127.0.0.1:8000/
```

## Auth Endpoints

### Register a new user

```bash
curl -X POST http://127.0.0.1:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com","password":"mypassword"}'
# Returns: 201 {"id": 2, "username": "alice", "email": "alice@example.com"}
# Email is optional. Password is hashed (PBKDF2) and never returned.
```

### Log in and get JWT tokens

```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"mypassword"}'
# Returns: {"access":"eyJ...", "refresh":"eyJ..."}
```

### Refresh an access token

```bash
curl -X POST http://127.0.0.1:8000/api/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh":"<refresh_token>"}'
```

### Use a protected endpoint

```bash
curl http://127.0.0.1:8000/api/events/ \
  -H "Authorization: Bearer <access_token>"
```

## Django Admin

Once seeded, the admin UI is available at http://127.0.0.1:8000/admin/ — log in with `admin` / `admin123`.

## Project Structure

- `backend/` — Django project package (settings, root URLs, WSGI/ASGI)
- `core/` — Main app (models, serializers, views, URLs, management commands)
- `core/management/commands/seed_admin.py` — Idempotent dev superuser seed
- `core/migrations/` — Database migration files
- `.env` — Local environment variables (gitignored — never commit)
- `.env.example` — Template for `.env` (committed — no real secrets)
- `requirements.txt` — Pinned Python dependencies (prod-only pins commented out)
