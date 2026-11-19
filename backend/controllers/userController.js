const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, studentId, contactNumber } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password || '', 10);
    // role is always 'student' on public signup (prevents self-made admins)
    const user = await User.create({ name, email, password: hashed, studentId, contactNumber });
    res.status(201).json({ token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password || '', user.password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

exports.getMe = (req, res) => res.json(req.user);

exports.getUsers = async (req, res, next) => {
  try { res.json(await User.find().select('-password')); } catch (err) { next(err); }
};

exports.updateRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
};
