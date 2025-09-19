# Backend Setup for Local Development

## SQLite Setup
- [x] Check .env for DATABASE_URL="sqlite:./dev.db" and set if missing
- [x] Ensure folder for database file exists (e.g., ./server if needed)
- [x] Modify server/db.js to parse DATABASE_URL correctly (strip 'sqlite:' prefix)
- [x] Ensure database auto-creates if missing
- [x] Verify session store in server/index.js uses consistent path

## Nodemailer Setup
- [x] Fix server/email.js to use nodemailer.createTransport instead of createTransporter
- [x] Update transporter config to secure: true as per task
- [x] Confirm environment variables are used correctly

## Testing
- [x] Start backend with node server/index.js
- [x] Confirm no SQLite or nodemailer errors
- [x] Output "Setup complete" if successful, else provide manual instructions
