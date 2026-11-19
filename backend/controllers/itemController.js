const Item = require('../models/Item');

const Notification = require('../models/Notification');

const populate = (q) => q.populate('category', 'name').populate('reportedBy', 'name email');

exports.getItems = async (req, res, next) => {
  try {
    const filter = {};
    ['type', 'status', 'category'].forEach((k) => { if (req.query[k]) filter[k] = req.query[k]; });
    if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };
    res.json(await populate(Item.find(filter).sort('-createdAt')));
  } catch (err) { next(err); }
};

exports.getItem = async (req, res, next) => {
  try {
    const item = await populate(Item.findById(req.params.id));
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) { next(err); }
};

exports.createItem = async (req, res, next) => {
  try {
    const item = await Item.create({ ...req.body, reportedBy: req.user._id });
    // simple matching: opposite type + same category -> notify the other reporters
    const matches = await Item.find({ _id: { $ne: item._id }, category: item.category, status: 'open',
      type: item.type === 'lost' ? 'found' : 'lost' });
    await Notification.insertMany(matches.map((m) => ({
      user: m.reportedBy, type: 'match', item: item._id,
      message: `A new ${item.type} item "${item.title}" may match your report "${m.title}".`
    })));
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.updateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    const isOwner = item.reportedBy.equals(req.user._id);
    if (!isOwner && req.user.role === 'student') return res.status(403).json({ message: 'Not allowed' });
    delete req.body.reportedBy;
    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  } catch (err) { next(err); }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (!item.reportedBy.equals(req.user._id) && req.user.role === 'student') return res.status(403).json({ message: 'Not allowed' });
    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (err) { next(err); }
};


