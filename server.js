const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { WebSocketServer } = require('ws');

// SSL/TLS Options
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/dubaimusic.com/privkey.pem'),  // Your private key
  cert: fs.readFileSync('/etc/letsencrypt/live/dubaimusic.com/fullchain.pem') // Your certificate
};

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Import routes
const userRoute = require('./routes/user');
const categoriesRoute = require('./routes/categories');
const artistsRoute = require('./routes/artists');
const venuesRoute = require('./routes/venues');
const musicStore = require('./routes/musicstore');
const weddingvip = require('./routes/weddingvip');

// Use routes
app.use('/api/categories', categoriesRoute);
app.use('/api/artists', artistsRoute);
app.use('/api/venues', venuesRoute);
app.use('/api/musicstore', musicStore);
app.use('/api/weddingvip', weddingvip);
app.use('/api', userRoute);

mongoose
  .connect('mongodb+srv://mansarim:4TCOflsMWdI9CCkt@cluster0.fawjsqk.mongodb.net/dubaimusic', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Serve static files
app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.woff2')) {
      res.setHeader('Content-Type', 'font/woff2');
    }
  },
}));

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Dubai Music API');
});

// Create HTTPS server
const server = https.createServer(options, app);

// Set up WebSocket Server
const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
  console.log('WebSocket connection established');
  ws.on('message', (message) => {
    console.log('Received:', message);
    ws.send('Echo: ' + message); // Example response
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start the HTTPS server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
