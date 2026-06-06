const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const { dbFallback } = require('../dbFallback');

// @route   GET /api/scores
// @desc    Get all score logs sorted by date descending
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (dbFallback.isUsingFallback) {
      const scores = dbFallback.getScores();
      // Sort in descending order of createdAt
      scores.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(scores);
    } else {
      const scores = await Score.find().sort({ createdAt: -1 });
      return res.json(scores);
    }
  } catch (err) {
    console.error("Error fetching score logs:", err);
    return res.status(500).json({ error: "Failed to fetch logs" });
  }
});

// @route   POST /api/scores
// @desc    Save a new performance score
// @access  Public
router.post('/', async (req, res) => {
  const { wpm, accuracy, duration, snippetId, snippetName } = req.body;

  if (wpm === undefined || accuracy === undefined || duration === undefined || !snippetId || !snippetName) {
    return res.status(400).json({ error: "Missing required performance metric fields" });
  }

  try {
    if (dbFallback.isUsingFallback) {
      const newScore = dbFallback.saveScore({ wpm, accuracy, duration, snippetId, snippetName });
      return res.status(201).json(newScore);
    } else {
      const newScore = await Score.create({ wpm, accuracy, duration, snippetId, snippetName });
      return res.status(201).json(newScore);
    }
  } catch (err) {
    console.error("Error creating score log:", err);
    return res.status(500).json({ error: "Failed to save metrics" });
  }
});

// @route   DELETE /api/scores
// @desc    Clear all logs
// @access  Public
router.delete('/', async (req, res) => {
  try {
    if (dbFallback.isUsingFallback) {
      dbFallback.clearScores();
      return res.json({ success: true, message: "Fallback scores database cleared" });
    } else {
      await Score.deleteMany({});
      return res.json({ success: true, message: "MongoDB scores collection cleared" });
    }
  } catch (err) {
    console.error("Error clearing scores:", err);
    return res.status(500).json({ error: "Failed to clear metrics history" });
  }
});

module.exports = router;
