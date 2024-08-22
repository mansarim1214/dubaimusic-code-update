const express = require('express');
const router = express.Router();
const multer = require('multer');
const Venue = require('../models/Venue'); // Ensure the correct path

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// POST route to add a new artist
router.post('/', upload.fields([{ name: 'image' }, { name: 'galleryImages' }]), async (req, res) => {
  const { title, category, speciality, description, videoUrl } = req.body;
  const imageUrl = `uploads/${req.files['image'][0].filename}`;
  const galleryImages = req.files['galleryImages']?.map(file => `uploads/${file.filename}`) || [];

  try {
    const newArtist = new Artist({ title, category, speciality, description, videoUrl, imageUrl, galleryImages });
    await newArtist.save();
    res.status(201).json(newArtist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// GET route to fetch all venues
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find();
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT route to update a venue by id

router.put('/:id', upload.fields([{ name: 'image' }, { name: 'galleryImages' }]), async (req, res) => {
  const { title, category, speciality, description, videoUrl } = req.body;
  const updateData = { title, category, speciality, description, videoUrl };

  if (req.files['image']) {
    updateData.imageUrl = `uploads/${req.files['image'][0].filename}`;
  }
  if (req.files['galleryImages']) {
    updateData.galleryImages = req.files['galleryImages'].map(file => `uploads/${file.filename}`);
  }

  try {
    const updatedArtist = await Artist.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (updatedArtist) {
      res.json(updatedArtist);
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




// GET route to fetch a single venue by ID
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id); // Find artist by ID
    if (venue) {
      res.json(venue); // Respond with the artist object if found
    } else {
      res.status(404).json({ message: 'Venue not found' }); // Handle case where Venue ID is not found
    }
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle server or database errors
  }
});

// DELETE route to delete a venue by id
router.delete('/:id', async (req, res) => {
  try {
    const venueId = req.params.id;
    const venue = await Venue.findOne({ _id: venueId });
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    await Venue.deleteOne({ _id: venueId });
    res.status(200).json({ message: 'Venue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
