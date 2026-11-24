const ActivityLog = require('../models/ActivityLog');

exports.getLogs = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(limit);
    res.json(logs);
  } catch (err) {
    next(err);
  }
};