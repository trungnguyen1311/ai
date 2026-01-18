# Backend Design: Auth System (Step 1)

This design document adheres to `auth.skill.md` and `backend-development` constraints, focusing on a minimal MVP for the Auth system.

## 1. User Data Schema (Minimal)

We will use a single `User` entity.

**Table:** `users`

| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | Yes | `gen_random_uuid()` | Primary Key |
| `email` | String | Yes | - | Unique, Indexed. Used for login. |
| `passwordHash`| String | Yes | - | Hashed password (using bcrypt) |
| `role` | Enum | Yes | `'USER'` | Values: `'ADMIN'`, `'USER'` |
| `isActive` | Boolean | Yes | `true` | For soft disabling users |
| `createdAt` | DateTime | Yes | `now()` | Audit field |
| `updatedAt` | DateTime | Yes | `now()` | Audit field |

*Note: No other fields (like internal employee ID, phone, etc.) are included to keep strict MVP scope.*

---

## 2. Auth-related API Endpoints

All endpoints will be prefixed with `/api/auth` (or just `/auth` depending on global prefix).

### Public Endpoints

1.  **Register**
    *   **Method:** `POST /register`
    *   **Body:** `{ email: string, password: string }`
    *   **Behavior:**
        *   Validate email format.
        *   Check if email exists (throw ConflictException if yes).
        *   Hash password.
        *   Create User (role = 'USER').
    *   **Response:** `{ id: string, email: string }` (No token by default, require login, or can return token if auto-login desired. Workflow 5.1 says "Trả kết quả thành công").

2.  **Login**
    *   **Method:** `POST /login`
    *   **Body:** `{ email: string, password: string }`
    *   **Behavior:**
        *   Find user by email.
        *   Validate password hash.
        *   Generate JWT.
    *   **Response:** `{ accessToken: string, user: { id, email, role } }`

3.  **Forgot Password (Mock)**
    *   **Method:** `POST /forgot-password`
    *   **Body:** `{ email: string }`
    *   **Behavior:**
        *   Check if user exists.
        *   **Mock:** Log a "reset token" to the backend console.
    *   **Response:** `{ success: true, message: "Check server logs for mock token" }`

### Protected Endpoints (Requires `Bearer <token>`)

4.  **Get Profile (Me)**
    *   **Method:** `GET /me`
    *   **Headers:** `Authorization: Bearer <token>`
    *   **Behavior:** Returns current user info from token payload/db.
    *   **Response:** `{ id, email, role, isActive }`

5.  **Change Password**
    *   **Method:** `POST /change-password`
    *   **Body:** `{ oldPassword: string, newPassword: string }`
    *   **Behavior:**
        *   Verify `oldPassword`.
        *   Update with hash of `newPassword`.
    *   **Response:** `{ success: true }`

6.  **Logout**
    *   **Method:** `POST /logout`
    *   **Behavior:** Client-side action primarily. Server returns success.
    *   **Response:** `{ success: true }`

---

## 3. Token Strategy

We will use **Stateless JWT (JSON Web Tokens)** for simplicity and speed (MVP).

*   **Library:** `@nestjs/jwt`, `passport`, `passport-jwt`.
*   **Algorithm:** HS256 (HMAC SHA-256).
*   **Expiration:**
    *   `accessToken`: **1 day** (Simple for MVP, no refresh token flow required by constraints).
*   **Payload Structure:**
    ```json
    {
      "sub": "user-uuid",
      "email": "user@example.com",
      "role": "USER"
    }
    ```
*   **Security:**
    *   Secret key stored in environment variables (`JWT_SECRET`).
    *   Password hashing using `bcrypt` (salt rounds: 10).

---

## 4. Next Steps (Step 2 Implementation)

1.  Initialize NestJS resource `auth` and `users`.
2.  Setup TypeORM entity `User`.
3.  Install necessary packages (`@nestjs/jwt`, `passport-jwt`, `bcrypt`).
4.  Implement the endpoints defined above.
