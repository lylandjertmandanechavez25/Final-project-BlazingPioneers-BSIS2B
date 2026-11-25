const router = require('express').Router();
const c = require('../controllers/authController');
const { protect, wrap } = require('../middleware/auth');

router.post('/register', wrap(c.register));
router.post('/login', wrap(c.login));
router.get('/me', protect, c.me);
router.put('/me', protect, wrap(c.updateMe));

module.exports = router;
