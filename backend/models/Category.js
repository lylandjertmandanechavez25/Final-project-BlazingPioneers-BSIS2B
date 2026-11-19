const mongoose = require('mongoose');

// Examples: Electronics, Books, Clothing, ID/Cards, Bags, Keys, Others
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true }
  },
  { timestamps: true }
);


module.exports = mongoose.model('Category', categorySchema);


