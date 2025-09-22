import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '../../../../lib/userStore';
import { getParticipationByUserId } from '../../../../lib/drillStore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = getUserById(id);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Get drill participation data
    const drillParticipation = getParticipationByUserId(id);

    // Calculate drill analytics
    const drillsParticipated = drillParticipation.length;
    const lastDrillDate = drillParticipation.length > 0
      ? new Date(Math.max(...drillParticipation.map((d: any) => new Date(d.timestamp)))).toISOString().split('T')[0]
      : null;

    return NextResponse.json({
      loginStreak: user.loginStreak || 0,
      lastLoginDate: user.lastLoginDate || '',
      drillsParticipated: drillsParticipated,
      lastDrillDate: lastDrillDate
    });
  } catch (error) {
    console.error('User stats error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
