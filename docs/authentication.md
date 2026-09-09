# Authentication

## Strategy

The admin panel uses a cookie-based JWT flow:

- A short-lived access token is stored in an `HttpOnly` cookie.
- A longer-lived refresh token is stored in a separate `HttpOnly` cookie.
- The refresh token embeds the admin user's `token_version`, which allows server-side invalidation on logout.

## Why This Approach

- Tokens are not stored in `localStorage`.
- The FastAPI API remains the single source of truth for protected access.
- Next.js pages can still read the cookies on the server and redirect early for better UX.

## Security Notes

- Passwords are hashed with a strong adaptive hash.
- Authentication errors do not disclose whether an email exists.
- Cookies use `Secure` in production and `SameSite=Lax` by default.
- Login attempts are rate-limited in memory for the MVP.

