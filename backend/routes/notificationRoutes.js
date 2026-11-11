const router = require('express').Router();
const { protect } = require('../middleware/auth');
const c = require('../controllers/notificationController');

router.get('/', protect, c.getMyNotifications);
router.put('/:id/read', protect, c.markRead);

module.exports = router;
