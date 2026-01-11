# Auth Feature Documentation

## Overview
This folder contains the authentication related components and logic. The auth flow is designed to be modular and scalable.

## File Responsibilities

### `layout/AuthLayout.jsx`
- Wrap all authentication forms (Login, Signup, Forgot Password).
- Handles the responsive layout:
  - **Desktop**: Split screen with form on left, visual/promo on right.
  - **Mobile**: Single column, hides the visual container.
- **Styling**: Uses `auth.css`.

### `forms/`
- **`LoginForm.jsx`**: Handles user sign-in.
- **`SignupForm.jsx`**: Handles user registration.
- **Responsibilities**:
  - Manage local form state (controlled inputs).
  - Validate inputs (basic).
  - Call API endpoints (placeholders currently).
  - Use UI components (`Input`, `Button`) from `src/components/ui`.

## Auth Flow
1. **Unauthenticated User** visits `/` -> Redirected to `/login` by `ProtectedRoute`.
2. **Login**: User enters credentials -> `LoginForm` handles submit -> On success, store token (TODO) & Redirect to `/`.
3. **Signup**: User enters details -> `SignupForm` handles submit -> On success, redirect to `/login` or auto-login.

## Styling
- **`variables.css`**: Design tokens (colors, spacing).
- **`globals.css`**: Reset and base styles (focus states).
- **`auth.css`**: specific layout styles for auth pages.
