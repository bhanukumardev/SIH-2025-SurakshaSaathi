const fs = require('fs');
const path = require('path');

const jsonFile = path.join(__dirname, '..', 'userProgress.json');

if (!fs.existsSync(jsonFile)) {
  fs.writeFileSync(jsonFile, JSON.stringify([]));
}

function getUserProgress() {
  return JSON.parse(fs.readFileSync(jsonFile));
}

function saveUserProgress(progress) {
  fs.writeFileSync(jsonFile, JSON.stringify(progress, null, 2));
}

function getProgressByUserId(userId) {
  const progress = getUserProgress();
  return progress.filter(p => p.userId === userId);
}

function getTotalScoreByUserId(userId) {
  const progress = getUserProgress();
  return progress
    .filter(p => p.userId === userId)
    .reduce((acc, curr) => acc + (curr.score || 0), 0);
}

function saveQuizAttempt(userId, moduleId, score) {
  const progress = getUserProgress();
  const attempt = {
    id: `${userId}-${moduleId}-${Date.now()}`,
    userId,
    moduleId,
    score,
    timestamp: new Date().toISOString()
  };
  progress.push(attempt);
  saveUserProgress(progress);
}

module.exports = {
  getUserProgress,
  saveUserProgress,
  getProgressByUserId,
  getTotalScoreByUserId,
  saveQuizAttempt
};
