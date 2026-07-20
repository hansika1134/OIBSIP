# Login Authentication System — OIBSIP Web Development Level 2, Task 4

Front-end authentication system (Approach A: HTML/CSS/JS with browser storage).

## Features
- Registration page with username/email + password, "Register" button
- Password validation: minimum 8 characters, at least 1 number
- Duplicate username/email check on registration
- Login page with clear, non-revealing error messages on bad credentials
- Protected Dashboard page — redirects to login.html if no active session
- Logout button clears the session and redirects to login
- Passwords hashed client-side with SHA-256 (Web Crypto API) — never stored in plain text
- Basic form validation (no empty submissions) via `required` + JS checks

## Tech Stack
HTML5, CSS3, vanilla JavaScript. User accounts persist in `localStorage`; the active session lives in `sessionStorage` (cleared when the tab closes or on logout).

## How to Run
1. Open `register.html` and create an account.
2. You'll be redirected to `dashboard.html` automatically.
3. Try opening `dashboard.html` directly in a new private/incognito tab — it redirects to `login.html` since there's no session.
4. Log out from the dashboard to clear the session.

## Note on Security
This is a client-side demo for learning purposes. `localStorage` is not a secure credential store for production apps — a real system would use a backend with server-side sessions/JWTs and a proper password hashing algorithm like bcrypt or Argon2 (salted, not just SHA-256).

## Files
- `register.html`
- `login.html`
- `dashboard.html`
- `style.css`
- `script.js`
