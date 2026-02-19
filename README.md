# mini-library-api

Mini Library API is a small full‑stack project (Django REST backend + React frontend) for managing a simple library system. Users can register, log in, browse books, borrow and return them, while admins can manage books and users through an admin portal.

> **Demo video**  
> _Place demo video link or embed here_

---

## Tech Stack

- **Backend**: Django 6, Django REST Framework, Simple JWT, SQLite (default)
- **Frontend**: React (Create React App), Material UI
- **Auth**: JWT (access + refresh tokens)
- **Other**: CORS headers, python-dotenv

---

## Project Structure

- backend/
	- library_project/ – Django project settings and root URLs
	- books/ – Book model and CRUD API
	- borrows/ – Borrow/return logic and history
	- users/ – Registration, login, account management, admin user utilities
- frontend/
	- React single-page app consuming the REST API

---

## Prerequisites

- Python 3.11+ (compatible with Django 6)
- Node.js (LTS) + npm
- Git (optional, for cloning)

---

## Backend Setup (Django API)

Run these commands from the project root (`mini-library-api`). Paths assume Windows, but commands are the same on other OSs.

1. **Create and activate a virtual environment (recommended)**

	 ```bash
	 cd backend
	 python -m venv venv
	 venv\Scripts\activate
	 ```

2. **Install dependencies**

	 ```bash
	 pip install -r requirements.txt
	 ```

3. **Configure environment variables**

	 In `backend`, create a `.env` file (not committed) and set a secret key:

	 ```env
	 SECRET_KEY=your-very-secret-key
	 ```

4. **Apply migrations**

	 ```bash
	 python manage.py migrate
	 ```

5. **Create a superuser (admin)**

	 ```bash
	 python manage.py createsuperuser
	 ```

6. **Run the development server**

	 ```bash
	 python manage.py runserver
	 ```

By default the API will be available at:

- `http://127.0.0.1:8000/`

Admin panel:

- `http://127.0.0.1:8000/admin/`

---

## Frontend Setup (React app)

Run these commands from the project root (`mini-library-api`).

1. **Install dependencies**

	 ```bash
	 cd frontend
	 npm install
	 ```

2. **Start the frontend dev server**

	 ```bash
	 npm start
	 ```

By default, the React app runs at:

- `http://localhost:3000/`

Make sure the backend (`http://127.0.0.1:8000/`) is running so the frontend can talk to the API.

---

## Authentication Overview

Authentication uses JWT via `djangorestframework-simplejwt`.

- Register: `POST /api/auth/register/`
- Login: `POST /api/auth/login/` → returns `access` and `refresh` tokens with extra claims (`username`, `is_superuser`).
- Protected endpoints require:

	```http
	Authorization: Bearer <access_token>
	```

Access tokens are configured to last 1 day.

---

## API Reference

Base URLs:

- Auth & user management: `/api/auth/`
- Books & borrowing: `/api/`

All request bodies are JSON unless otherwise stated.

### 1. Auth & Users (`/api/auth/`)

#### 1.1 Register

- **URL**: `POST /api/auth/register/`
- **Auth**: Public
- **Body**:

	```json
	{
		"username": "johndoe",
		"email": "john@example.com",
		"password": "strongpassword",
		"first_name": "John",   // optional
		"last_name": "Doe"      // optional
	}
	```

- **Response**: 201 Created with created user data (as defined by `RegisterSerializer`).

#### 1.2 Login (JWT)

- **URL**: `POST /api/auth/login/`
- **Auth**: Public
- **Body**:

	```json
	{
		"username": "johndoe",
		"password": "strongpassword"
	}
	```

- **Response** (simplified):

	```json
	{
		"refresh": "<refresh_token>",
		"access": "<access_token>",
		"username": "johndoe",
		"is_superuser": false
	}
	```

Use the `access` token in the `Authorization` header for all protected endpoints.

#### 1.3 Forgot Password

- **URL**: `POST /api/auth/forgot-password/`
- **Auth**: Public
- **Body**:

	```json
	{
		"email": "john@example.com",
		"new_password": "newStrongPassword"
	}
	```

- **Behavior**:
	- If a user with the given email exists, their password is reset.
	- Returns 200 with a success message, or 404 if no user with this email.

#### 1.4 Delete Own Account

- **URL**: `POST /api/auth/delete-account/`
- **Auth**: Authenticated normal user (JWT)
- **Body**:

	```json
	{
		"password": "currentPassword"
	}
	```

- **Behavior**:
	- Verifies the password.
	- Ensures the user is **not** a superuser.
	- Ensures there are **no active borrows** (`is_returned=false`).
	- Deletes the account and returns a success message.

#### 1.5 List Users (Admin)

- **URL**: `GET /api/auth/users/`
- **Auth**: Admin only (`is_staff`/superuser)
- **Response** (array of users, excluding superusers):

	```json
	[
		{
			"id": 1,
			"username": "user1",
			"email": "user1@example.com",
			"first_name": "User",
			"last_name": "One"
		}
	]
	```

#### 1.6 Delete User (Admin)

- **URL**: `DELETE /api/auth/users/<user_id>/`
- **Auth**: Admin only
- **Behavior**:
	- Cannot delete superusers.
	- Admin cannot delete their **own** account via this endpoint.
	- Automatically handles any active borrows for the user:
		- Restores `available_copies` for each borrowed book.
		- Marks borrows as returned.

---

### 2. Books (`/api/books/`)

`BookViewSet` is registered with DRF’s `DefaultRouter` under `/api/books/`.

- **Model fields**:
	- `title` (string)
	- `author` (string)
	- `isbn` (string, unique)
	- `total_copies` (integer)
	- `available_copies` (integer)

Permissions:

- Any **authenticated** user can `GET`.
- Only **staff/admin** users can `POST`, `PUT`, `PATCH`, `DELETE`.

#### 2.1 List Books

- **URL**: `GET /api/books/`
- **Auth**: Authenticated
- **Response**: List of book objects.

#### 2.2 Retrieve a Book

- **URL**: `GET /api/books/<id>/`
- **Auth**: Authenticated

#### 2.3 Create a Book (Admin)

- **URL**: `POST /api/books/`
- **Auth**: Admin
- **Body**:

	```json
	{
		"title": "Book Title",
		"author": "Author Name",
		"isbn": "123-456-789",
		"total_copies": 10,
		"available_copies": 10
	}
	```

- **Validation rules** (from `BookSerializer`):
	- `title` and `author` must be non-empty.
	- `total_copies` must be greater than 0.
	- `available_copies` cannot exceed `total_copies`.

#### 2.4 Update/Delete a Book (Admin)

- **URL**: `PUT/PATCH/DELETE /api/books/<id>/`
- **Auth**: Admin

---

### 3. Borrowing (`/api/`)

Borrowing endpoints live under `/api/` via `borrows.urls`.

`Borrow` model fields (simplified):

- `user` – FK to `auth.User`
- `book` – FK to `Book`
- `borrow_date` – auto now
- `return_date` – nullable datetime
- `is_returned` – boolean

The `BorrowSerializer` exposes:

- `id`, `book`, `book_title`, `borrow_date`, `return_date`, `is_returned`

#### 3.1 Borrow a Book

- **URL**: `POST /api/borrow/<book_id>/`
- **Auth**: Authenticated
- **Behavior**:
	- Fails with 404 if book does not exist.
	- Fails with 400 if `available_copies <= 0`.
	- Fails with 400 if the user already has an active borrow for that book (`is_returned=false`).
	- On success:
		- Creates a `Borrow` record.
		- Decrements `book.available_copies`.
		- Returns the created borrow record.

#### 3.2 Return a Book

- **URL**: `POST /api/return/<book_id>/`
- **Auth**: Authenticated
- **Behavior**:
	- Looks for an active borrow for (`user`, `book_id`, `is_returned=False`).
	- If none found → 400 with an error.
	- If found:
		- Sets `is_returned = True` and `return_date = now`.
		- Increments `book.available_copies`.
		- Returns a success message.

#### 3.3 List My Borrows

- **URL**: `GET /api/my-borrows/`
- **Auth**: Authenticated
- **Response**: List of all borrows for the current user (past and present).

---

## Running Tests

From `backend`:

```bash
python manage.py test
```

---

## Development Notes

- CORS is fully open in development (`CORS_ALLOW_ALL_ORIGINS = True`) to allow the React app to talk to the Django API.
- Default database is SQLite; you can switch to PostgreSQL by configuring `DATABASES` and using `dj-database-url` / `psycopg2-binary` if you deploy.
- JWT access tokens currently last 1 day (see `SIMPLE_JWT` in settings).

---

## Possible Improvements

- Add pagination and search filters to the books list.
- Add borrow limits per user or per book.
- Implement refresh token rotation and blacklisting for better security.
- Add email-based password reset instead of direct password change via API.

---

## Demo Video Placeholder

When you have your demo ready, you can link it here:

- YouTube: `https://youtu.be/your-demo-link`
- Or a local/hosted video file reference.

