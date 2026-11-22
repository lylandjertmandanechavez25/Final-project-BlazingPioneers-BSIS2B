const Claim = require('../models/Claim');
const Item = require('../models/Item');

const populate = q => q.populate('item', 'title type status reportedBy').populate('claimant', 'name email');

exports.getClaims = async (req, res) => {
  let filter = {};
  if (req.user.role !== 'admin') {
    const mine = await Item.find({ reportedBy: req.user.id }).select('_id');
    filter = { $or: [{ claimant: req.user.id }, { item: { $in: mine.map(i => i._id) } }] };
  }
  res.json(await populate(Claim.find(filter).sort({ createdAt: -1 })));
};

exports.createClaim = async (req, res) => {
  const { item: itemId, message } = req.body;
  if (!itemId || !message) return res.status(400).json({ message: 'Item and message are required' });
  const item = await Item.findById(itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (item.status !== 'open') return res.status(400).json({ message: 'This item is no longer open' });
  if (item.reportedBy.toString() === req.user.id) return res.status(400).json({ message: 'You cannot claim your own report' });
  if (await Claim.findOne({ item: itemId, claimant: req.user.id, status: 'pending' }))
    return res.status(409).json({ message: 'You already have a pending claim on this item' });
  const claim = await Claim.create({ item: itemId, claimant: req.user.id, message });
  res.status(201).json(claim);
};

exports.updateClaimStatus = async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Status must be approved or rejected' });
  const claim = await Claim.findById(req.params.id).populate('item');
  if (!claim) return res.status(404).json({ message: 'Claim not found' });
  const owner = claim.item.reportedBy.toString() === req.user.id;
  if (!owner && req.user.role !== 'admin') return res.status(403).json({ message: 'Not allowed' });
  claim.status = status;
  await claim.save();
  if (status === 'approved') { claim.item.status = 'claimed'; await claim.item.save(); }
  res.json(await populate(Claim.findById(claim._id)));
};

exports.deleteClaim = async (req, res) => {
  const claim = await Claim.findById(req.params.id);
  if (!claim) return res.status(404).json({ message: 'Claim not found' });
  if (claim.claimant.toString() !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not allowed' });
  await claim.deleteOne();
  res.json({ message: 'Claim deleted' });
};
