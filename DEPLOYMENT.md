# Vercel Deployment Guide for SurakshaSaathi

## Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bhanukumardev/SIH-2025-SurakshaSaathi)

## Manual Deployment Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Connect to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel --prod
```

### 4. Configure Environment Variables
After deployment, go to your Vercel dashboard and add these environment variables:

#### Required Environment Variables:
```
NODE_ENV=production
ADMIN_API_KEY=your-secure-admin-key-here
JWT_SECRET=your-secure-jwt-secret-here
SESSION_SECRET=your-secure-session-secret-here
USE_SQLITE=1
FLASK_BASE_URL=https://chatbot-j5aa.onrender.com
```

#### Optional (for Google OAuth):
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### Update after deployment:
```
NEXT_PUBLIC_API_URL=https://your-deployed-app.vercel.app
NEXT_PUBLIC_APP_URL=https://your-deployed-app.vercel.app
FRONTEND_BASE=https://your-deployed-app.vercel.app
```

### 5. Redeploy
After setting environment variables, redeploy:
```bash
vercel --prod
```

## Environment Variables Security

⚠️ **Important**: Generate strong, unique secrets for production:
- Use a password generator for JWT_SECRET, ADMIN_API_KEY, and SESSION_SECRET
- Each secret should be at least 32 characters long
- Never commit actual secrets to version control

## Post-Deployment Testing

Test these features after deployment:
- [ ] Home page loads correctly
- [ ] User registration and login
- [ ] Dashboard functionality
- [ ] API endpoints respond
- [ ] Chatbot integration
- [ ] Real-time alerts
- [ ] Google OAuth (if configured)

## Troubleshooting

### Build Errors:
- Ensure all environment variables are set in Vercel dashboard
- Check build logs for specific error messages
- Verify Next.js version compatibility

### Runtime Errors:
- Check function logs in Vercel dashboard
- Ensure database connections work
- Verify external API endpoints are accessible

### Performance Issues:
- Enable Vercel Analytics
- Check bundle size and optimize if needed
- Consider enabling ISR for static pages