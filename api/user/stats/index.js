const { getUserById } = require('../../../lib/userStore');
const { getParticipationByUserId } = require('../../../lib/drillStore');

async function getUserStats(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const user = await getUserById(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Get drill participation data
  const drillParticipation = getParticipationByUserId(id);

  // Calculate drill analytics
  const drillsParticipated = drillParticipation.length;
  const lastDrillDate = drillParticipation.length > 0
    ? new Date(Math.max(...drillParticipation.map(d => new Date(d.timestamp)))).toISOString().split('T')[0]
    : null;

  res.json({
    loginStreak: user.loginStreak || 0,
    lastLoginDate: user.lastLoginDate || '',
    drillsParticipated: drillsParticipated,
    lastDrillDate: lastDrillDate
  });
}

module.exports = getUserStats;
