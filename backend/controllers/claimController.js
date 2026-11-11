const Claim = require('../models/Claim');
const Item = require('../models/Item');
const Notification = require('../models/Notification');

exports.createClaim = async (req, res, next) => {
  try {
    const item = await Item.findById(req.body.item);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (['returned', 'closed'].includes(item.status)) return res.status(400).json({ message: 'Item is no longer claimable' });
    const claim = await Claim.create({ item: item._id, claimant: req.user._id,
      proofDescription: req.body.proofDescription, proofImageUrl: req.body.proofImageUrl });
    item.status = 'pending_claim';
    await item.save();
    res.status(201).json(claim);
  } catch (err) { next(err); }
};

exports.getClaims = async (req, res, next) => {
  try {
    const filter = req.user.role === 'student' ? { claimant: req.user._id } : {};
    res.json(await Claim.find(filter).populate('item', 'title type status').populate('claimant', 'name email').sort('-createdAt'));
  } catch (err) { next(err); }
};

exports.reviewClaim = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: "status must be 'approved' or 'rejected'" });
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    Object.assign(claim, { status, remarks, reviewedBy: req.user._id, reviewedAt: new Date() });
    await claim.save();
    const item = await Item.findById(claim.item);
    if (item) {
      if (status === 'approved') { item.status = 'returned'; item.returnedTo = claim.claimant; }
      else item.status = 'open';
      await item.save();
    }
    await Notification.create({ user: claim.claimant, type: 'claim_update', item: claim.item,
      message: `Your claim was ${status}.${remarks ? ' Remarks: ' + remarks : ''}` });
    res.json(claim);
  } catch (err) { next(err); }
};
