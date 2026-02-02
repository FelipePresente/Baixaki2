# API Documentation

This documentation details the endpoints available in the Baixaki2 application.

## Authentication & Authorization

- **Authentication Method:** JWT (JSON Web Tokens) stored in HttpOnly Cookies (`userCookie`).
- **Authorization:** Protected routes require a valid JWT token. Admin routes additionally verify the user role.
- **Client-Side:** Public user information is stored in a non-HttpOnly cookie (`userInfo`) for UI checks.

---

## Users

### 1. User Registration
Creates a new user account.

- **URL:** `/users/signup`
- **Method:** `POST`
- **Content-Type:** `application/x-www-form-urlencoded` or `application/json`

**Request Body Parameters:**

| Parameter | Type | Required | constraints |
| :--- | :--- | :--- | :--- |
| `username` | String | Yes | 4 to 12 characters |
| `password` | String | Yes | 8 to 35 characters, no spaces |
| `confirmPassword` | String | Yes | Must match `password` |

**Responses:**

- **Success (302):** Redirects to `/` (Home).
- **Client Error (400):** 
    - "All fields are required"
    - "Username must be at least 4 characters long"
    - "Username maximum number of characters is 12"
    - "Password must be at least 8 characters long"
    - "Password maximum number of characters is 35"
    - "Passwords do not match"
    - "Password must not contain spaces"
    - "Username already exists"
- **Server Error (500):** "Error creating user"

---

### 2. User Login
Authenticates a user and establishes a session via cookies.

- **URL:** `/users/login`
- **Method:** `POST`
- **Content-Type:** `application/x-www-form-urlencoded` or `application/json`

**Request Body Parameters:**

| Parameter | Type | Required | constraints |
| :--- | :--- | :--- | :--- |
| `username` | String | Yes | Max 12 characters |
| `password` | String | Yes | Max 35 characters, no spaces |

**Responses:**

- **Success (302):** 
    - Redirects to `/admin` if the user has `admin` role.
    - Redirects to `/` for standard users.
- **Client Error (400):** Validation errors (missing fields, length limits).
- **Unauthorized (401):** "Invalid credentials" (User not found or password mismatch).
- **Server Error (500):** "Error logging in"

---

### 3. User Logout
Invalidates the user session by clearing authentication cookies.

- **URL:** `/users/logout`
- **Method:** `GET`

**Responses:**

- **Success (302):**  Clears `userCookie` and `userInfo` cookies and redirects to `/`.

---

## Games

### 1. List All Games
Retrieves the full catalog of games.

- **URL:** `/games`
- **Method:** `GET`
- **Access:** Public

**Responses:**

- **Success (200):** Returns an array of game objects (JSON).

---

### 2. Create Game
Adds a new game to the catalog.

- **URL:** `/games`
- **Method:** `POST`
- **Access:** Protected (Requires valid Auth Token)

**Request Body Parameters:**

| Parameter | Type | Required | constraints |
| :--- | :--- | :--- | :--- |
| `name` | String | Yes | Max 20 characters, unique |
| `genre` | String | Yes | Max 20 characters |
| `size` | String | Yes | Max 7 characters |
| `cover` | String | Yes | Max 200 characters (URL) |

**Responses:**

- **Success (200):** `{ "message": "Game created succesfully" }`
- **Client Error (400):** Validation errors (missing fields, length limits).
- **Conflict (409):** "There is already a game with that name"
- **Server Error (500):** "Error trying to add game"

---

### 3. Update Game
Updates an existing game's details.

- **URL:** `/games/:id`
- **Method:** `PATCH`
- **Access:** Protected (Requires valid Auth Token)

**URL Parameters:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | String | The unique MongoDB Object ID of the game |

**Request Body Parameters:**

| Parameter | Type | Required | constraints |
| :--- | :--- | :--- | :--- |
| `name` | String | Yes | Max 20 characters |
| `genre` | String | Yes | Max 20 characters |
| `size` | String | Yes | Max 7 characters |
| `cover` | String | Yes | Max 200 characters (URL) |

**Responses:**

- **Success (200):** `{ "message": "Game updated successfully!" }`
- **Client Error (400):** Validation errors (missing fields, length limits).
- **Not Found (404):** "Game not found"
- **Server Error (500):** "Error trying to edit game"

---

### 4. Delete Game
Removes a game from the catalog.

- **URL:** `/games/:id`
- **Method:** `DELETE`
- **Access:** Protected (Requires valid Auth Token)

**URL Parameters:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | String | The unique MongoDB Object ID of the game |

**Responses:**

- **Success (200):** `{ "message": "Game was succesfully deleted" }`
- **Client Error (400):** "Invalid ID"
- **Not Found (404):** "No game was found"
- **Server Error (500):** "Error trying to delete game"