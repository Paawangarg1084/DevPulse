const express = require('express');
const router = express.Router();
const { dbFallback } = require('../dbFallback');

// @route   GET /api/snippets
// @desc    Get all typing code snippets
// @access  Public
router.get('/', (req, res) => {
  try {
    const snippets = dbFallback.getSnippets();
    return res.json(snippets);
  } catch (err) {
    console.error("Error retrieving snippets:", err);
    return res.status(500).json({ error: "Failed to load snippets" });
  }
});

module.exports = router;
