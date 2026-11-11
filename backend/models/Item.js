const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },          // e.g. "Black umbrella"
    description: { type: String, required: true, trim: true },
    type: { type: String, enum: ['lost', 'found'], required: true }, // was it lost or found?
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    location: { type: String, required: true, trim: true },        // e.g. "Library, 2nd floor"
    dateLostOrFound: { type: Date, required: true },
    imageUrl: { type: String },                                    // path/URL of uploaded photo
    status: {
      type: String,
      enum: ['open', 'pending_claim', 'returned', 'closed'],
      default: 'open'
    },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    returnedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // set once returned
    storedAt: { type: String, trim: true } // for found items, e.g. "Guard house / Registrar"
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);