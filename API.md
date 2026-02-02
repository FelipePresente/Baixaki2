# System & API Documentation

This document provides a comprehensive overview of the **Baixaki2** system architecture, including its backend components, data models, middleware pipeline, and API endpoints.

---

## System Architecture

The application is a **Node.js** web server built with **Express**, following a Modular Monolithic architecture. It connects to a **MongoDB** database using **Mongoose** as the ODM (Object Data Modeling) library.

### Core Components

#### 1. Server Entry Point (`server.js`)
The `server.js` file is the backbone of the application. It initializes the Express app and configures:
- **Database Connection:** Connects to MongoDB Atlas via `mongoose.connect()`.
- **Global Middleware:** Applies parsing and sanitization layers to every request.
- **Route Mounting:** Defines the base paths for `/games` and `/users`.
- **Static Assets:** Serves frontend files from the `public/` directory.
- **Admin Security:** Protects the `/admin` route with the `auth` middleware and strict Cache-Control headers to prevent sensitive data caching.

### 2. Database Models (`models/`)
All data schemas are strict and managed via Mongoose.

- **User Model (`User.js`)**
    - `username`: String (Unique, Required)
    - `password`: String (Required, Hashed)
    - `role`: String (Default: 'user') - Controls access levels.

- **Game Model (`Game.js`)**
    - `name`: String (Required)
    - `genre`: String (Required)
    - `size`: String (Required)
    - `cover`: String (Required, URL)

---

## Middleware Pipeline

Middlewares intercept requests to process data, handle security, or manage flow before reaching the route handlers.

### Global Middlewares (Applied to all routes)

| Middleware | File | Description |
| :--- | :--- | :--- |
| **Trimmer** | `middlewares/trimmer.js` | Removes leading/trailing whitespace from **all** string fields in `req.body`. |
| **LowerCase** | `middlewares/lowerCase.js` | Converts the `username` and `email` fields to lowercase to ensure consistency. |
| **UpperCase** | `middlewares/upperCase.js` | Converts the `size` field (e.g., "12gb" -> "12GB") to uppercase for standardization. |

### Security & Utility Middlewares

| Middleware/Utility | File | Description |
| :--- | :--- | :--- |
| **Auth (Admin Guard)** | `middlewares/auth.js` | Verifies JWT tokens from `userCookie`. Checks if the user exists in DB and ensures the user has the `'admin'` role. If valid, allows access; otherwise, denies it (401) or redirects. |
| **Hash Password** | `middlewares/hashPassword.js` | Uses `bcrypt` to securely hash passwords (salt rounds: 12) before saving to the DB. |
| **Compare Password** | `middlewares/comparePassword.js` | Uses `bcrypt` to compare a plaintext password with the stored hash during login. |

---

## API Endpoints

### Authentication & Authorization

- **Authentication Method:** JWT (JSON Web Tokens) stored in HttpOnly Cookies (`userCookie`).
- **Authorization:** 
    - **Protected Routes:** Require a valid JWT.
    - **Admin Routes:** Require role `'admin'`.
- **Client-Side:** Public user information is stored in a non-HttpOnly cookie (`userInfo`) for UI logic.

### Users (`/users`)

#### 1. Register User
Creates a new user account.

- **URL:** `/users/signup`
- **Method:** `POST`
- **Sanitization:** Auto-trims inputs; `username` converts to lowercase.
- **Body:**
    - `username`: 4-12 chars.
    - `password`: 8-35 chars, no spaces.
    - `confirmPassword`: Must match.

#### 2. User Login
Authenticates a user.

- **URL:** `/users/login`
- **Method:** `POST`
- **Body:** `username`, `password`
- **Response:** Sets `userCookie` (HttpOnly) and `userInfo`. Redirects based on role (`/admin` or `/`).

#### 3. User Logout
Invalidates the session.

- **URL:** `/users/logout`
- **Method:** `GET`
- **Response:** Clears cookies and redirects to `/`.

### Games (`/games`)

#### 1. List All Games
Retrieves the full catalog.

- **URL:** `/games`
- **Method:** `GET`
- **Access:** Public
- **Response:** JSON array of game objects.

#### 2. Create Game
Adds a new game.

- **URL:** `/games`
- **Method:** `POST`
- **Access:** Protected (Admin Only)
- **Sanitization:** `size` converts to uppercase.
- **Body:** `name` (unique), `genre`, `size`, `cover` (URL).

#### 3. Update Game
Updates an existing game.

- **URL:** `/games/:id`
- **Method:** `PATCH`
- **Access:** Protected (Admin Only)
- **Body:** `name`, `genre`, `size`, `cover`.

#### 4. Delete Game
Removes a game.

- **URL:** `/games/:id`
- **Method:** `DELETE`
- **Access:** Protected (Admin Only)