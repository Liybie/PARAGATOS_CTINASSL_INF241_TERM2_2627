const ActivityLog = require('../models/ActivityLog');

const writeLog = async (req, { action, entity, entityId = '', summary }) => {
  try {
    await ActivityLog.create({
      action,
      entity,
      entityId: entityId ? String(entityId) : '',
      summary,
      adminId: req.admin?._id,
      adminUsername: req.admin?.username || 'system',
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Activity log write failed:', err.message);
    }
  }
};

module.exports = { writeLog };