const Router = require('express').Router();
const { protect } = require('../middleware/auth');
const c = require('../controllers/notificationController');

Router.get('/', protect, c.getMyNotifications);
Router.put('/:id/read', protect, c.markRead);

module.exports = Router;
