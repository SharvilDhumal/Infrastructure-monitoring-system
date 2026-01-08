# Backend - Login/Signup

This is the backend server for the React Login/Signup application.

## Setup

1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    - Ensure `.env` exists in `backend/` with correct credentials.
    - `MONGO_URI`: MongoDB connection string.
    - `JWT_SECRET`: Secret key for JWT.
    - `EMAIL_USER`/`EMAIL_PASS`: For sending emails.

## Run

-   **Development Mode** (with nodemon):
    ```bash
    npm run dev
    ```
-   **Production Start**:
    ```bash
    npm start
    ```

## API Endpoints

-   `POST /api/auth/signup` - Register a new user
-   `POST /api/auth/login` - Login user
-   `GET /api/auth/verify-email?token=...` - Verify email
-   `POST /api/auth/forgot-password` - Request password reset
-   `POST /api/auth/reset-password` - Reset password
