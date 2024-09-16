const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  location: { type: String },
  category: { type: String },
  featuredImage: { type: String },
  gallery: { type: [String], default: [] }, // Array of strings for gallery images
});

module.exports = mongoose.model('Venue', VenueSchema);
