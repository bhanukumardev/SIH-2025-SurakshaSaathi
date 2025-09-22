import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('X-API-Key: ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check API key
    const apiKey = authHeader.substring('X-API-Key: '.length);

    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Return mock metrics for now
    // In production, this would connect to a proper database
    const metrics = {
      totalUsers: 0,
      activeUsers: 0,
      totalDrills: 0,
      totalQuizzes: 0,
      alertsSent: 0,
      systemHealth: 'healthy'
    };

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error('Admin metrics error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
