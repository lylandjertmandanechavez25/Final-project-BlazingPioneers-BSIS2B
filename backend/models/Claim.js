const mongoose = require('mongoose');

// A user says "this item is mine" and gives proof; admin/staff approves or rejects.
const claimSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    claimant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    proofDescription: { type: String, required: true, trim: true }, // unique marks, contents, etc.
    proofImageUrl: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    remarks: { type: String, trim: true },
    reviewedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Claim', claimSchema);