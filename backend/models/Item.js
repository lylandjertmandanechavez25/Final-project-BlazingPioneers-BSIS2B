const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  type: { type: String, enum: ['lost', 'found'], required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  location: { type: String, required: true },
  dateOccurred: { type: Date, required: true },
  imageUrl: { type: String, default: '' },
  contact: { type: String, default: '' },
  status: { type: String, enum: ['open', 'claimed', 'returned'], default: 'open' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
