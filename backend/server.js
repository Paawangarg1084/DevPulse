const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const { dbFallback } = require('./dbFallback');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Register API Routes
app.use('/api/snippets', require('./routes/snippets'));
app.use('/api/scores', require('./routes/scores'));

// MongoDB database connection URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/devpulse';

console.log("Attempting to connect to MongoDB...");
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 2500 // Quick timeout to switch to local fallback database
})
.then(() => {
  console.log("Successfully connected to MongoDB database!");
  dbFallback.setFallbackActive(false);
})
.catch((err) => {
  console.warn("\n==================================================================");
  console.warn("WARNING: MongoDB is not running or could not be reached.");
  console.warn("DevPulse will run in fallback mode using a local JSON database (data/db.json).");
  console.warn("All features (adding, listing, and clearing stats) will work perfectly.");
  console.warn("==================================================================\n");
  dbFallback.setFallbackActive(true);
});

// Serve frontend build static files in production environment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`DevPulse Backend API running on port ${PORT}`);
});
