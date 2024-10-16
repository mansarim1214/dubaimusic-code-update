const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  category: { type: String },
  featuredImage: { type: String },
  gallery: { type: [String], default: [] },
  status: { type: String, default: 'published' },
}, { Timestamp: true }); // This enables the `createdAt` and `updatedAt` fields

module.exports = mongoose.model('Venue', VenueSchema);
