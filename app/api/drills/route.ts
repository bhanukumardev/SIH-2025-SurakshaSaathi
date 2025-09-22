import { NextRequest, NextResponse } from 'next/server';
import drillData from '../../../data/drillScenarios.json';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const id = searchParams.get('id');

    if (id) {
      const drill = drillData.find(d => d.id === id);
      if (!drill) {
        return NextResponse.json(
          { error: 'Drill not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(drill);
    }

    if (region) {
      const filtered = drillData.filter(d => d.region === region || d.region === 'all');
      return NextResponse.json(filtered);
    }

    return NextResponse.json(drillData);
  } catch (error) {
    console.error('Drills API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id, userId } = await request.json();

    const drill = drillData.find(d => d.id === id);
    if (!drill) {
      return NextResponse.json(
        { error: 'Drill not found' },
        { status: 404 }
      );
    }

    // For Vercel deployment, we'll return success without saving to JSON files
    // In production, this would connect to a proper database
    const response = {
      started: true,
      drillId: drill.id,
      message: 'Drill started successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Start drill error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
