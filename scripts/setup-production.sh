#!/bin/bash

# Suraksha Sathi - Production Environment Setup Script
# This script helps set up environment variables for production deployment

echo "🚀 Suraksha Sathi - Production Setup"
echo "===================================="

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Creating backup..."
    cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)
fi

# Create production environment file
cat > .env.local << EOL
# Suraksha Sathi Production Environment
NODE_ENV=production
USE_SQLITE=0

# Application URLs (update with your actual deployment URL)
NEXT_PUBLIC_APP_URL=https://sih-2025-suraksha-saathi-1u2m.vercel.app
NEXT_PUBLIC_API_URL=https://sih-2025-suraksha-saathi-1u2m.vercel.app/api

# Security (generate secure values for production)
JWT_SECRET=your-secure-jwt-secret-here
SESSION_SECRET=your-secure-session-secret-here

# Google OAuth (optional, for login functionality)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Admin API Key (for alert management)
ADMIN_API_KEY=your-admin-api-key
EOL

echo "✅ Created .env.local with production configuration"
echo ""
echo "📝 Next Steps:"
echo "1. Update the URLs in .env.local with your actual deployment URL"
echo "2. Generate secure values for JWT_SECRET and SESSION_SECRET"
echo "3. Configure Google OAuth credentials if needed"
echo "4. Set up these environment variables in your Vercel dashboard"
echo "5. Deploy to Vercel"
echo ""
echo "🔧 For development, use: npm run dev"
echo "🚀 For production build: npm run build"