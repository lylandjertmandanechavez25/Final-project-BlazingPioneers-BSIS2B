const Router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/userController');

Router.post('/register', c.register);
Router.post('/login', c.login);
Router.get('/me', protect, c.getMe);
Router.get('/', protect, authorize('admin'), c.getUsers);
Router.put('/:id/role', protect, authorize('admin'), c.updateRole);

module.exports = router;
const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/userController');

Router.post('/register', c.register);
Router.post('/login', c.login);
Router.get('/me', protect, c.getMe);
Router.get('/', protect, authorize('admin'), c.getUsers);
Router.put('/:id/role', protect, authorize('admin'), c.updateRole);

module.exports = Router;
