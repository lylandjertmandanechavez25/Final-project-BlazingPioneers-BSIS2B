const mongoose = require('mongoose');
const Category = require('../models/Category');

const DEFAULT_CATEGORIES = ['Electronics', 'Wallets & Bags', 'IDs & Cards', 'Keys', 'Clothing', 'Books & School Supplies', 'Jewelry', 'Others'];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
    if ((await Category.countDocuments()) === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES.map(name => ({ name })));
      console.log('Default categories seeded');
    }
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
