const Item = require('../models/Item');
const Claim = require('../models/Claim');

const populate = q => q.populate('category', 'name').populate('reportedBy', 'name');
const canModify = (item, user) => user.role === 'admin' || item.reportedBy.toString() === user.id;
const escapeRx = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/items?type=&category=&status=&q=&reportedBy=&page=&limit=
exports.getItems = async (req, res) => {
  const { type, category, status, q, reportedBy } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 6, 50);
  const filter = {};
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (reportedBy) filter.reportedBy = reportedBy;
  if (q) {
    const rx = new RegExp(escapeRx(q), 'i');
    filter.$or = [{ title: rx }, { description: rx }, { location: rx }];
  }
  const total = await Item.countDocuments(filter);
  const items = await populate(Item.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit));
  res.json({ items, total, page, pages: Math.ceil(total / limit) || 1 });
};

exports.getStats = async (req, res) => {
  const [lost, found, resolved] = await Promise.all([
    Item.countDocuments({ type: 'lost' }),
    Item.countDocuments({ type: 'found' }),
    Item.countDocuments({ status: { $in: ['claimed', 'returned'] } })
  ]);
  res.json({ lost, found, resolved });
};

exports.getItem = async (req, res) => {
  const item = await populate(Item.findById(req.params.id));
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
};

exports.createItem = async (req, res) => {
  const { title, type, category, location, dateOccurred } = req.body;
  if (!title || !type || !category || !location || !dateOccurred)
    return res.status(400).json({ message: 'Title, type, category, location and date are required' });
  const item = await Item.create({ ...req.body, status: 'open', reportedBy: req.user.id });
  res.status(201).json(await populate(Item.findById(item._id)));
};

exports.updateItem = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (!canModify(item, req.user)) return res.status(403).json({ message: 'Not allowed to edit this item' });
  ['title', 'description', 'type', 'category', 'location', 'dateOccurred', 'imageUrl', 'contact', 'status']
    .forEach(k => { if (req.body[k] !== undefined) item[k] = req.body[k]; });
  await item.save();
  res.json(await populate(Item.findById(item._id)));
};

exports.deleteItem = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (!canModify(item, req.user)) return res.status(403).json({ message: 'Not allowed to delete this item' });
  await Claim.deleteMany({ item: item._id });
  await item.deleteOne();
  res.json({ message: 'Item deleted' });
};
