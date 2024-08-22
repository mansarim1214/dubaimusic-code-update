const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  featuredImage: { type: String, required: true },
  gallery: { type: [String], default: [] }, // Array of strings for gallery images
});

module.exports = mongoose.model('Venue', VenueSchema);
