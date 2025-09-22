import { NextRequest, NextResponse } from 'next/server';
import { getUsers } from '../../../lib/userStore';
import { getUserProgress, getTotalScoreByUserId } from '../../../lib/userProgressStore';

interface LeaderboardEntry {
  userId: string;
  name: string;
  score: number;
}

export async function GET(request: NextRequest) {
  try {
    const users = getUsers();
    const progress = getUserProgress();

    // Map users to their total scores
    const leaderboard: LeaderboardEntry[] = users.map((user: any) => {
      const totalScore = getTotalScoreByUserId(user.id);
      return {
        userId: user.id,
        name: user.name,
        score: totalScore
      };
    });

    // Sort descending by score
    leaderboard.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score);

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
