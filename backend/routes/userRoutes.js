const Router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

Router.post('/register', authController.register);
Router.post('/login', authController.login);

Router.get('/me', protect, authController.me);

Router.get('/', protect, adminOnly, userController.getUsers);

Router.put('/:id/role',
  protect,
  adminOnly,
  userController.updateUser
);

module.exports = Router;
