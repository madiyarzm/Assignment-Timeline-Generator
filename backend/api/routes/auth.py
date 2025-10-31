"""
Authentication API routes.

Handles user registration, login, and session management:

- POST /auth/signup → register a new user
- POST /auth/login  → log in and receive a token/session
- GET /auth/me     → get info about the currently logged-in user
- POST /auth/logout → (optional) log out user / invalidate token

All routes should:
- Validate input using schemas (e.g., email, password)
- Hash passwords before saving to the database
- Issue a token (JWT) or session cookie for authentication
"""
