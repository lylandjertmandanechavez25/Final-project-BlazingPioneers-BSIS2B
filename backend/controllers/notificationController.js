const Notification = require('../models/Notification');

exports.getMyNotifications = async (req, res, next) => {
  try { res.json(await Notification.find({ user: req.user._id }).sort('-createdAt')); } catch (err) { next(err); }
};
exports.markRead = async (req, res, next) => {
  try {
    const n = await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { isRead: true }, { new: true });
    if (!n) return res.status(404).json({ message: 'Notification not found' });
    res.json(n);
  } catch (err) { next(err); }
};
