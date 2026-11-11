const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 }, // store a bcrypt hash, never plain text
    role: { type: String, enum: ['student', 'staff', 'admin'], default: 'student' },
    studentId: { type: String, trim: true }, // optional school ID number
    contactNumber: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);