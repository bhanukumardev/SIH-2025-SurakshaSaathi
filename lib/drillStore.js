const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const jsonFile = path.join(__dirname, '..', 'drillParticipation.json');

if (!fs.existsSync(jsonFile)) {
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
