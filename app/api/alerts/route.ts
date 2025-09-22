import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { saveAlert } from '../../../server/alertStore';

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key');

    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { region, level, message } = await request.json();

    if (!region || !level || !message) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const alertObj = {
      id: uuidv4(),
      region,
      level,
      message,
      time: Date.now()
    };

    // Save to file/SQLite and broadcast to clients
    saveAlert(alertObj);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Alerts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
