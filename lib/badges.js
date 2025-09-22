const modulesData = require('../data/modules.json');

const BADGE_CRITERIA = {
  'module-master-all': { type: 'modules', count: 6, passed: true },
  'drill-champion-5': { type: 'drills', count: 5 },
  'drill-champion-10': { type: 'drills', count: 10 },
  'drill-champion-25': { type: 'drills', count: 25 },
  'streak-star-5': { type: 'streak', count: 5 },
  'streak-star-10': { type: 'streak', count: 10 },
  'streak-star-30': { type: 'streak', count: 30 },
  'top-scorer': { type: 'average', threshold: 0.9 },
  'chatbot-helper-5': { type: 'chatbot', count: 5 },
  'chatbot-helper-10': { type: 'chatbot', count: 10 },
  'chatbot-helper-25': { type: 'chatbot', count: 25 },
  'chatbot-expert-50': { type: 'chatbot', count: 50 },
  'safety-explorer': { type: 'chatbot_topics', topics: ['earthquake', 'flood', 'fire', 'preparedness'] },
  'punjab-safety-expert': { type: 'chatbot_topics', topics: ['punjab_earthquake', 'punjab_flood', 'punjab_fire'] }
};

function getBestScoresByModule(userProgress, userId) {
  const scores = {};
  userProgress.filter(p => p.userId === userId).forEach(p => {
    if (!scores[p.moduleId] || p.score > scores[p.moduleId]) {
      scores[p.moduleId] = p.score;
    }
  });
  return scores;
}

function checkAndAwardBadges(user, userProgress, drillParticipation) {
  const newBadges = [];
  const currentBadges = user.badges || [];

  // Module Master
  const bestScores = getBestScoresByModule(userProgress, user.id);
  const allModules = modulesData.map(m => m.id);
  const allPassed = allModules.every(moduleId => {
    const score = bestScores[moduleId] || 0;
    const quizLength = modulesData.find(m => m.id === moduleId).quiz.length;
    return score >= Math.ceil(quizLength / 2);
  });
  if (allPassed && !currentBadges.includes('module-master-all')) {
    newBadges.push('module-master-all');
  }

  // Drill Champions
  const drillCount = drillParticipation.filter(p => p.userId === user.id).length;
  ['drill-champion-5', 'drill-champion-10', 'drill-champion-25'].forEach(badge => {
    const count = BADGE_CRITERIA[badge].count;
    if (drillCount >= count && !currentBadges.includes(badge)) {
      newBadges.push(badge);
    }
  });

  // Streak Stars
  const streak = user.loginStreak || 0;
  ['streak-star-5', 'streak-star-10', 'streak-star-30'].forEach(badge => {
    const count = BADGE_CRITERIA[badge].count;
    if (streak >= count && !currentBadges.includes(badge)) {
      newBadges.push(badge);
    }
  });

  // Top Scorer
  const totalAttempts = Object.values(bestScores).length;
  if (totalAttempts > 0) {
    const average = Object.values(bestScores).reduce((sum, score) => sum + score, 0) / totalAttempts;
    if (average >= 0.9 && !currentBadges.includes('top-scorer')) {
      newBadges.push('top-scorer');
    }
  }

  // Update user badges
  user.badges = [...currentBadges, ...newBadges];

  return newBadges;
}

module.exports = {
  checkAndAwardBadges
};
