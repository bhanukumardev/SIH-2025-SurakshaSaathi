import { NextRequest, NextResponse } from 'next/server';
import modulesData from '../../../data/modules.json';
import { getUserById, saveUser } from '../../../lib/userStore';
import { saveQuizAttempt, getTotalScoreByUserId, getUserProgress } from '../../../lib/userProgressStore';
import { getDrillParticipation } from '../../../lib/drillStore';
import { checkAndAwardBadges } from '../../../lib/badges';

export async function POST(request: NextRequest) {
  try {
    const { moduleId, userId, answers } = await request.json();

    if (!moduleId || !userId || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'moduleId, userId, and answers are required' },
        { status: 400 }
      );
    }

    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const module = modulesData.find(m => m.id === moduleId);
    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    const quiz = module.quiz;
    if (quiz.length !== answers.length) {
      return NextResponse.json(
        { error: 'Answers length does not match quiz length' },
        { status: 400 }
      );
    }

    let score = 0;
    quiz.forEach((q: any, index: number) => {
      if (q.answer === answers[index]) {
        score++;
      }
    });

    // Save the quiz attempt
    saveQuizAttempt(userId, moduleId, score);

    // Check for new badges
    const userProgress = getUserProgress();
    const drillParticipation = getDrillParticipation();
    const newBadges = checkAndAwardBadges(user, userProgress, drillParticipation);
    if (newBadges.length > 0) {
      saveUser(user);
    }

    // Calculate total score for leaderboard
    const totalScore = getTotalScoreByUserId(userId);

    // Determine pass/fail (e.g., pass if score >= 50%)
    const passed = score >= quiz.length / 2;

    return NextResponse.json({
      score,
      total: quiz.length,
      passed,
      totalScore,
      newBadges
    });
  } catch (error) {
    console.error('Quiz grading error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
