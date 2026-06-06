const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  wpm: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  snippetId: {
    type: String,
    required: true
  },
  snippetName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Score', ScoreSchema);
