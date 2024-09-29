const mongoose = require('mongoose');

const MusicStoreSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Store name
  bio: { type: String }, // Description or bio of the store
  contact: { type: String }, // Contact information
  logo: { type: String }, // Logo image path
  featuredImage: { type: String }, // Featured image path
});

module.exports = mongoose.model('MusicStore', MusicStoreSchema);
