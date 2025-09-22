const express = require('express');
const router = express.Router();
const { getUsers } = require('../lib/userStore');
const { getUserProgress, getTotalScoreByUserId } = require('../lib/userProgressStore');

router.get('/', (req, res) => {
  const users = getUsers();
  const progress = getUserProgress();

  // Map users to their total scores
  const leaderboard = users.map(user => {
    const totalScore = getTotalScoreByUserId(user.id);
    return {
      userId: user.id,
      name: user.name,
      score: totalScore
    };
  });

  // Sort descending by score
  leaderboard.sort((a, b) => b.score - a.score);

  res.json(leaderboard);
});

module.exports = router;
