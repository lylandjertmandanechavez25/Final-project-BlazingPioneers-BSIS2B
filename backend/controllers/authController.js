const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sign = user => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const pub = u => ({ id: u._id, name: u.name, email: u.email, role: u.role });

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'Email already registered' });
  // The very first account becomes the admin (handy for demos)
  const role = (await User.countDocuments()) === 0 ? 'admin' : 'user';
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10), role });
  res.status(201).json({ token: sign(user), user: pub(user) });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });
  if (!user || !(await bcrypt.compare(password || '', user.password)))
    return res.status(401).json({ message: 'Invalid email or password' });
  res.json({ token: sign(user), user: pub(user) });
};

exports.me = (req, res) => res.json(pub(req.user));

exports.updateMe = async (req, res) => {
  const { name, password } = req.body;
  if (name) req.user.name = name;
  if (password) {
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    req.user.password = await bcrypt.hash(password, 10);
  }
  await req.user.save();
  res.json(pub(req.user));
};
