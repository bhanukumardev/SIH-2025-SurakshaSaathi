const fs = require('fs');
const path = require('path');

// Use /tmp directory for serverless environments like Vercel
const jsonFile = process.env.NODE_ENV === 'production' 
  ? '/tmp/userProgress.json' 
  : path.join(__dirname, '..', 'userProgress.json');

// Ensure the directory exists and initialize the file
if (!fs.existsSync(jsonFile)) {
  const dir = path.dirname(jsonFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
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
