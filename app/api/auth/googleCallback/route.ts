import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getUserByEmail, getUserByGoogleId, saveUser } from '../../../../lib/userStore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        new URL('/login?error=oauth_failed', request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/login?error=no_code', request.url)
      );
    }

    // For Vercel deployment, we'll implement a simplified OAuth flow
    // In production, this would exchange the code for tokens and get user info
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        new URL('/login?error=oauth_not_configured', request.url)
      );
    }

    // Mock user creation for demonstration
    // In production, this would use the actual Google OAuth flow
    const mockUser = {
      id: uuidv4(),
      name: 'Google User',
      email: 'user@gmail.com',
      role: 'student' as const,
      googleId: 'mock-google-id'
    };

    // Check if user exists
    let user = getUserByGoogleId(mockUser.googleId);
    if (!user) {
      user = getUserByEmail(mockUser.email);
      if (user) {
        user.googleId = mockUser.googleId;
        saveUser(user);
      } else {
        saveUser(mockUser);
        user = mockUser;
      }
    }

    // Create JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Redirect to dashboard with token
    const dashboardUrl = new URL('/dashboard', request.url);
    dashboardUrl.searchParams.set('token', token);

    return NextResponse.redirect(dashboardUrl);
  } catch (error) {
    console.error('Google callback error:', error);
    return NextResponse.redirect(
      new URL('/login?error=oauth_callback_failed', request.url)
    );
  }
}
