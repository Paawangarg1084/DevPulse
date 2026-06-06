const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'db.json');

// Ensure data folder exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Pre-seeded code snippets
const defaultSnippets = [
  {
    id: "js-variables",
    name: "Variables & Templating",
    category: "Variables",
    code: "let username = \"Developer\";\nconst score = 100;\nconsole.log(`Welcome, ${username}! Perfect Score: ${score}`);"
  },
  {
    id: "js-math",
    name: "Math Precision Rounding",
    category: "Math",
    code: "let rawVal = 87.6543;\nlet roundedVal = Math.round(rawVal * 100) / 100;\nlet maxVal = Math.max(roundedVal, 100);"
  },
  {
    id: "js-strings",
    name: "String Length & Trimming",
    category: "Strings",
    code: "let text = \"  Learn JavaScript Coding Arena  \";\nlet trimmed = text.trim().slice(0, 16);\nconsole.log(trimmed.length);"
  },
  {
    id: "js-operators",
    name: "Modulo & Division Operators",
    category: "Operators",
    code: "let totalSecs = 3665;\nlet hours = Math.floor(totalSecs / 3600);\nlet mins = Math.floor((totalSecs % 3600) / 60);"
  },
  {
    id: "js-loops",
    name: "Iterative Accumulator Loop",
    category: "Loops",
    code: "let sum = 0;\nfor (let i = 1; i <= 10; i++) {\n  sum += i;\n}\nconsole.log(`Sum of 1 to 10: ${sum}`);"
  }
];

// Seed initial db.json if not present
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ scores: [], snippets: defaultSnippets }, null, 2));
}

const dbFallback = {
  isUsingFallback: false,

  setFallbackActive(active) {
    this.isUsingFallback = active;
  },

  getScores() {
    try {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      return data.scores || [];
    } catch (err) {
      console.error("Error reading fallback scores database file:", err);
      return [];
    }
  },

  saveScore(score) {
    try {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      const newScore = {
        _id: Date.now().toString(),
        wpm: Number(score.wpm),
        accuracy: Number(score.accuracy),
        duration: Number(score.duration),
        snippetId: score.snippetId,
        snippetName: score.snippetName,
        createdAt: new Date().toISOString()
      };
      if (!data.scores) data.scores = [];
      data.scores.push(newScore);
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
      return newScore;
    } catch (err) {
      console.error("Error saving to fallback scores database file:", err);
      return null;
    }
  },

  clearScores() {
    try {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      data.scores = [];
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
      return true;
    } catch (err) {
      console.error("Error clearing fallback scores database file:", err);
      return false;
    }
  },

  getSnippets() {
    try {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      return data.snippets || defaultSnippets;
    } catch (err) {
      console.error("Error reading fallback snippets database file:", err);
      return defaultSnippets;
    }
  }
};

module.exports = { dbFallback, defaultSnippets };
