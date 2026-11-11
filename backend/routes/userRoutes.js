const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/userController');

router.post('/register', c.register);
router.post('/login', c.login);
router.get('/me', protect, c.getMe);
router.get('/', protect, authorize('admin'), c.getUsers);
router.put('/:id/role', protect, authorize('admin'), c.updateRole);

module.exports = router;