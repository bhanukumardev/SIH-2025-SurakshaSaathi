const express = require('express');
const router = express.Router();
const modulesData = require('../data/modules.json');
const { getUserById, saveUser } = require('../lib/userStore');
const { saveQuizAttempt, getTotalScoreByUserId, getUserProgress } = require('../lib/userProgressStore');
const { getDrillParticipation } = require('../lib/drillStore');
const { checkAndAwardBadges } = require('../lib/badges');

router.post('/grade', (req, res) => {
  const { moduleId, userId, answers } = req.body;

  if (!moduleId || !userId || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'moduleId, userId, and answers are required' });
  }

  const user = getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const module = modulesData.find(m => m.id === moduleId);
  if (!module) {
    return res.status(404).json({ error: 'Module not found' });
  }

  const quiz = module.quiz;
  if (quiz.length !== answers.length) {
    return res.status(400).json({ error: 'Answers length does not match quiz length' });
  }

  let score = 0;
  quiz.forEach((q, index) => {
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

  res.json({
    score,
    total: quiz.length,
    passed,
    totalScore,
    newBadges
  });
});

module.exports = router;
