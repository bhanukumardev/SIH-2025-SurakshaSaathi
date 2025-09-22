const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Use /tmp directory for serverless environments like Vercel
const jsonFile = process.env.NODE_ENV === 'production' 
  ? '/tmp/drillParticipation.json' 
  : path.join(__dirname, '..', 'drillParticipation.json');

// Ensure the directory exists and initialize the file
if (!fs.existsSync(jsonFile)) {
  const dir = path.dirname(jsonFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(jsonFile, JSON.stringify([]));
}

function getDrillParticipation() {
  return JSON.parse(fs.readFileSync(jsonFile));
}

function saveDrillParticipation(participation) {
  fs.writeFileSync(jsonFile, JSON.stringify(participation, null, 2));
}

function getParticipationByUserId(userId) {
  const participation = getDrillParticipation();
  return participation.filter(p => p.userId === userId);
}

function getTotalDrillsByUserId(userId) {
  const participation = getDrillParticipation();
  return participation.filter(p => p.userId === userId).length;
}

function saveDrillParticipationRecord(userId, drillId) {
  const participation = getDrillParticipation();
  const record = {
    id: uuidv4(),
    userId,
    drillId,
    timestamp: new Date().toISOString()
  };
  participation.push(record);
  saveDrillParticipation(participation);
}

module.exports = {
  getDrillParticipation,
  saveDrillParticipation,
  getParticipationByUserId,
  getTotalDrillsByUserId,
  saveDrillParticipationRecord
};
