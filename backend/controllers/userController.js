const User = require('../models/User');
const Item = require('../models/Item');
const Claim = require('../models/Claim');

exports.getUsers = async (req, res) => res.json(await User.find().select('-password').sort({ createdAt: -1 }));

exports.updateUser = async (req, res) => {
  const { name, role } = req.body;
  const updated = await User.findByIdAndUpdate(req.params.id, { name, role }, { new: true, runValidators: true }).select('-password');
  if (!updated) return res.status(404).json({ message: 'User not found' });
  res.json(updated);
};

exports.deleteUser = async (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ message: 'You cannot delete your own account' });
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await Claim.deleteMany({ claimant: user._id });
  await Item.deleteMany({ reportedBy: user._id });
  res.json({ message: 'User deleted' });
};
