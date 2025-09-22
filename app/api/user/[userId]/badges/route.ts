import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '../../../../../lib/userStore';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const user = getUserById(params.userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ badges: user.badges || [] });
  } catch (error) {
    console.error('User badges error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
