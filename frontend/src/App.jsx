import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  // --- PRACTICE CHALLENGES ---
  const practiceSnippets = [
    {
      id: 'var-assignment',
      name: 'Variable Assignment Drill',
      category: 'Variables',
      summary: 'Type variable declarations using let and const.',
      code: `let age = 25;
let secondsPerMinute = 60;
const appName = "DevPulse";
console.log(age, secondsPerMinute, appName);`
    },
    {
      id: 'var-swap',
      name: 'Variable Swap Challenge',
      category: 'Variables',
      summary: 'Swap values between two variables without using extra storage.',
      code: `let x = 5;
let y = 10;
[x, y] = [y, x];
console.log(x, y);`
    },
    {
      id: 'const-vs-let',
      name: 'Const vs Let Practice',
      category: 'Variables',
      summary: 'Practice declaring mutable and immutable values clearly.',
      code: `let counter = 0;
const maxCount = 3;
counter += 1;
console.log(counter, maxCount);`
    },
    {
      id: 'var-reassign',
      name: 'Reassign Variables',
      category: 'Variables',
      summary: 'Update variables and print each intermediate result.',
      code: `let score = 10;
score = score + 5;
let bonus = 2;
score = score + bonus;
console.log(score);`
    },
    {
      id: 'var-template',
      name: 'Template Literal Output',
      category: 'Variables',
      summary: 'Build a text message using template literals and variables.',
      code: `const firstName = "Ava";
const lastName = "Lee";
const greeting = \`Welcome, \${firstName} \${lastName}!\`;
console.log(greeting);`
    },
    {
      id: 'var-math',
      name: 'Math with Variables',
      category: 'Variables',
      summary: 'Use variable values in arithmetic expressions.',
      code: `const width = 9;
const height = 7;
let area = width * height;
let perimeter = 2 * (width + height);
console.log(area, perimeter);`
    },
    {
      id: 'array-iteration',
      name: 'Array Iteration Drill',
      category: 'Loops',
      summary: 'Practice loops, array traversal, and basic arithmetic.',
      code: `const nums = [1, 2, 3, 4, 5];
let sum = 0;
for (let i = 0; i < nums.length; i++) {
  sum += nums[i];
}
console.log(sum);`
    },
    {
      id: 'string-reverse',
      name: 'String Reverse Exercise',
      category: 'Loops',
      summary: 'Type and debug a string reversal loop.',
      code: `const word = "devpulse";
let reversed = "";
for (let i = word.length - 1; i >= 0; i--) {
  reversed += word[i];
}
console.log(reversed);`
    },
    {
      id: 'for-range',
      name: 'For Loop Range Practice',
      category: 'Loops',
      summary: 'Iterate a numeric range and log each value.',
      code: `for (let i = 0; i < 6; i++) {
  console.log("count:", i);
}`
    },
    {
      id: 'while-count',
      name: 'While Loop Counter',
      category: 'Loops',
      summary: 'Use a while loop to count to a target number.',
      code: `let counter = 0;
while (counter < 5) {
  console.log("step", counter);
  counter++;
}`
    },
    {
      id: 'nested-loop',
      name: 'Nested Loop Pattern',
      category: 'Loops',
      summary: 'Practice nested loops by logging row and column values.',
      code: `for (let row = 1; row <= 3; row++) {
  for (let col = 1; col <= 3; col++) {
    console.log(row, col);
  }
}`
    },
    {
      id: 'array-map',
      name: 'Array Map Practice',
      category: 'Loops',
      summary: 'Transform an array using loop-style mapping.',
      code: `const names = ["Jay", "Nia", "Lee"];
const upperNames = [];
for (let i = 0; i < names.length; i++) {
  upperNames.push(names[i].toUpperCase());
}
console.log(upperNames);`
    },
    {
      id: 'conditional-logic',
      name: 'Conditional Logic Practice',
      category: 'Conditionals',
      summary: 'Use if/else logic to compare values and output the result.',
      code: `const score = 78;
if (score >= 90) {
  console.log("A grade");
} else if (score >= 75) {
  console.log("B grade");
} else {
  console.log("Needs improvement");
}`
    },
    {
      id: 'nested-condition',
      name: 'Nested Conditional Challenge',
      category: 'Conditionals',
      summary: 'Practice nested if statements with multi-step logic.',
      code: `const isMember = true;
const points = 85;
if (isMember) {
  if (points >= 80) {
    console.log("Premium member");
  } else {
    console.log("Standard member");
  }
} else {
  console.log("Guest checkout");
}`
    },
    {
      id: 'ternary-practice',
      name: 'Ternary Operator Quick Fix',
      category: 'Conditionals',
      summary: 'Rewrite a simple if/else block using the ternary operator.',
      code: `const temperature = 25;
const weather = temperature >= 20 ? "warm" : "cool";
console.log(weather);`
    },
    {
      id: 'switch-case',
      name: 'Switch Case Decision',
      category: 'Conditionals',
      summary: 'Use a switch statement to handle multiple values.',
      code: `const day = 3;
switch (day) {
  case 1:
    console.log("Monday");
    break;
  case 2:
    console.log("Tuesday");
    break;
  case 3:
    console.log("Wednesday");
    break;
  default:
    console.log("Other day");
}`
    },
    {
      id: 'logical-operators',
      name: 'Logical Operator Check',
      category: 'Conditionals',
      summary: 'Combine conditions with logical operators.',
      code: `const isAdmin = false;
const isOwner = true;
if (isAdmin || isOwner) {
  console.log("Access granted");
} else {
  console.log("Access denied");
}`
    },
    {
      id: 'comparison-practice',
      name: 'Comparison Practice',
      category: 'Conditionals',
      summary: 'Practice strict equality and inequality comparisons.',
      code: `const a = 5;
const b = "5";
console.log(a === b); // false
console.log(a !== b); // true`
    }
  ];

  // --- DATABASE & DATA STATE ---
  const [snippets, setSnippets] = useState(practiceSnippets);
  const [scores, setScores] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(practiceSnippets[0]?.category || 'Variables');
  const [categoryQuestionIndex, setCategoryQuestionIndex] = useState(0);

  // --- APPLICATION STATE ---
  const [theme, setTheme] = useState(localStorage.getItem('devpulse-theme') || 'one-dark');
  const [isTesting, setIsTesting] = useState(false);
  const [inputText, setInputText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [liveWpm, setLiveWpm] = useState(0);
  const [liveAccuracy, setLiveAccuracy] = useState(100);

  // --- UI CONTROLS ---
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalStats, setModalStats] = useState({ wpm: 0, accuracy: 100, elapsed: 0 });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [activePage, setActivePage] = useState('dashboard');
  const [selectedArticleId, setSelectedArticleId] = useState('js-concepts');

  // --- REFS ---
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Apply Theme to body tag
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('devpulse-theme', theme);
  }, [theme]);

  // Fetch initial snippets and scores from Backend API
  useEffect(() => {
    fetchSnippets();
    fetchScores();
  }, []);

  const fetchSnippets = async () => {
    try {
      const res = await fetch('/api/snippets');
      if (res.ok) {
        const data = await res.json();
        setSnippets(data.length ? data : practiceSnippets);
      } else {
        showToast("Failed to fetch snippets from database API.", "error");
        setSnippets(practiceSnippets);
      }
    } catch (err) {
      console.error(err);
      showToast("Backend offline. Make sure server is running.", "error");
      setSnippets(practiceSnippets);
    }
  };

  const fetchScores = async () => {
    try {
      const res = await fetch('/api/scores');
      if (res.ok) {
        const data = await res.json();
        setScores(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // --- TYPING CORE LOGIC ---

  const currentCategorySnippets = snippets.filter((snip) => snip.category === selectedCategory);
  const currentSnippet = currentCategorySnippets[categoryQuestionIndex] || {
    id: "loading",
    name: "Loading...",
    category: "System",
    code: "let loading = true;"
  };

  // Live statistics calculation during typing
  useEffect(() => {
    if (isTesting && startTime && inputText.length > 0) {
      const duration = (Date.now() - startTime) / 1000;
      setElapsedTime(duration);

      // WPM Math: (characters / 5) / elapsed minutes
      const elapsedMinutes = duration / 60;
      const calculatedWpm = Math.round((inputText.length / 5) / elapsedMinutes);
      setLiveWpm(calculatedWpm);

      // Accuracy Math: Correct typed chars / Total typed chars
      let correctCount = 0;
      for (let i = 0; i < inputText.length; i++) {
        if (inputText[i] === currentSnippet.code[i]) {
          correctCount++;
        }
      }
      const calculatedAcc = Math.round((correctCount / inputText.length) * 100);
      setLiveAccuracy(calculatedAcc);
    }
  }, [inputText, isTesting, startTime, currentSnippet.code]);

  // Timer updater interval
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const startTimestamp = Date.now();
    setStartTime(startTimestamp);
    setIsTesting(true);

    timerRef.current = setInterval(() => {
      const secs = (Date.now() - startTimestamp) / 1000;
      setElapsedTime(secs);
    }, 100);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTesting(false);
  };

  const handleTextInput = (e) => {
    const val = e.target.value;

    // Start timer on first character typed
    if (!isTesting && val.length === 1 && inputText.length === 0) {
      startTimer();
    }

    // Prevent typing further than the code snippet length
    if (val.length <= currentSnippet.code.length) {
      setInputText(val);
    }

    // Check completion condition (String Matching Logic)
    if (val === currentSnippet.code) {
      handleTestComplete(val);
    }
  };

  const handleTestComplete = async (typedVal) => {
    stopTimer();

    const endTime = Date.now();
    const finalDuration = Math.max((endTime - startTime) / 1000, 0.1);

    // Calculate final metrics
    let correctCount = 0;
    for (let i = 0; i < typedVal.length; i++) {
      if (typedVal[i] === currentSnippet.code[i]) {
        correctCount++;
      }
    }
    const finalAccuracy = Math.round((correctCount / currentSnippet.code.length) * 100);
    const finalWpm = Math.round((currentSnippet.code.length / 5) / (finalDuration / 60));

    // Prepare scores data
    const scoreItem = {
      wpm: finalWpm,
      accuracy: finalAccuracy,
      duration: Math.round(finalDuration * 10) / 10,
      snippetId: currentSnippet.id,
      snippetName: currentSnippet.name
    };

    // Save metrics to MongoDB API
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scoreItem)
      });
      if (res.ok) {
        showToast("Session synced with database!", "success");
        fetchScores();
      } else {
        showToast("Saved session locally, but sync failed.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Connection to backend lost. Result saved in session history.", "error");
      // Fallback: add score item locally to history state
      setScores(prev => [{ ...scoreItem, _id: Date.now().toString(), createdAt: new Date().toISOString() }, ...prev]);
    }

    // Trigger Success UI & Modal
    setModalStats({
      wpm: finalWpm,
      accuracy: finalAccuracy,
      elapsed: Math.round(finalDuration * 10) / 10
    });
    setShowModal(true);

    // Apply completion animation class temporarily
    const editor = document.querySelector('.editor-body');
    if (editor) {
      editor.classList.add('pulse-complete');
      setTimeout(() => editor.classList.remove('pulse-complete'), 1500);
    }
  };

  const handleReset = () => {
    stopTimer();
    setInputText('');
    setStartTime(null);
    setElapsedTime(0);
    setLiveWpm(0);
    setLiveAccuracy(100);
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
    showToast("Test reset. Start typing to begin!", "success");
  };

  const handleClearLogs = async () => {
    if (window.confirm("Are you sure you want to clear your analytics dashboard history? This cannot be undone.")) {
      try {
        const res = await fetch('/api/scores', { method: 'DELETE' });
        if (res.ok) {
          setScores([]);
          showToast("Dashboard analytics history cleared.", "success");
        } else {
          showToast("Failed to clear history from server.", "error");
        }
      } catch (err) {
        console.error(err);
        showToast("Error connecting to backend.", "error");
      }
    }
  };

  // Focus coding area
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // --- STATS CALCULATIONS ---
  const totalCompleted = scores.length;
  const avgWpm = totalCompleted > 0 ? Math.round(scores.reduce((sum, s) => sum + s.wpm, 0) / totalCompleted) : 0;
  const avgAccuracy = totalCompleted > 0 ? Math.round(scores.reduce((sum, s) => sum + s.accuracy, 0) / totalCompleted) : 100;
  const bestWpm = totalCompleted > 0 ? Math.max(...scores.map(s => s.wpm)) : 0;

  // Rating pill helper
  const getRatingPill = (wpm, accuracy) => {
    if (wpm >= 65 && accuracy >= 95) return <span className="performance-pill excellent">Elite Developer</span>;
    if (wpm >= 45 && accuracy >= 90) return <span className="performance-pill good">Senior Code</span>;
    if (wpm >= 25 && accuracy >= 80) return <span className="performance-pill avg">Junior Code</span>;
    return <span className="performance-pill poor">Debugging Required</span>;
  };

  const articles = [
    {
      id: 'react-state',
      title: 'Understanding React State',
      category: 'Frontend',
      summary: 'Learn how React state works, why it is important, and how to manage it in functional components.'
    },
    {
      id: 'typing-metrics',
      title: 'How Typing Metrics are Calculated',
      category: 'Analytics',
      summary: 'Explore the math behind WPM, accuracy, and how to build interactive performance dashboards.'
    },
    {
      id: 'js-concepts',
      title: 'Key JavaScript Concepts for Beginners',
      category: 'JavaScript',
      summary: 'A short guide to variables, loops, functions, and string comparisons used in coding challenges.'
    }
  ];

  const selectedArticle = articles.find((article) => article.id === selectedArticleId) || articles[0];

  const renderArticleContent = () => {
    switch (selectedArticle.id) {
      case 'react-state':
        return (
          <>
            <p>React state lets you keep track of values like typing input, timer state, and selected snippets.</p>
            <p>In DevPulse, state is used to update live WPM, accuracy, and which article is currently open.</p>
          </>
        );
      case 'typing-metrics':
        return (
          <>
            <p>Typing metrics are calculated by comparing typed characters to the target code and timing the session.</p>
            <p>WPM = (characters / 5) / minutes and accuracy is correct characters / total typed characters.</p>
          </>
        );
      case 'js-concepts':
      default:
        return (
          <>
            <p>This article covers key JavaScript concepts used in DevPulse:</p>
            <ul>
              <li>React state and hooks</li>
              <li>String comparison for typing accuracy</li>
              <li>Timer math for elapsed seconds</li>
            </ul>
          </>
        );
    }
  };

  // Helper to highlight typed characters
  const renderCodeSnippetCharacters = () => {
    const chars = currentSnippet.code.split('');
    return chars.map((char, index) => {
      let className = '';
      if (index < inputText.length) {
        className = inputText[index] === char ? 'char-correct' : 'char-incorrect';
      } else if (index === inputText.length) {
        className = 'char-current';
      } else {
        className = 'char-pending';
      }

      // Display spaces cleanly in error mode so they aren't hidden
      if (char === ' ' && className === 'char-incorrect') {
        return <span key={index} className={className}>_</span>;
      }
      if (char === '\n') {
        return <span key={index} className={className}>{char}</span>;
      }
      return <span key={index} className={className}>{char}</span>;
    });
  };

  // Chart data calculation: last 10 scores
  const last10Scores = [...scores].slice(0, 10).reverse();
  const maxWpmInChart = Math.max(...last10Scores.map(s => s.wpm), 60);

  return (
    <div className="app-container">
      {/* Toast Alert */}
      <div className={`toast ${toast.show ? 'show' : ''} ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
        <span>{toast.message}</span>
      </div>

      {/* Stats Completion Modal */}
      <div className={`modal-overlay ${showModal ? 'active' : ''}`}>
        <div className="modal-card">
          <h2 className="modal-title">Challenge Complete!</h2>
          <p className="modal-desc">Excellent work! Your performance has been synchronized with the database.</p>
          <div className="modal-stats">
            <div className="modal-stat">
              <div className="modal-stat-label">Coding Speed</div>
              <div className="modal-stat-value">{modalStats.wpm} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>WPM</span></div>
            </div>
            <div className="modal-stat">
              <div className="modal-stat-label">Accuracy</div>
              <div className="modal-stat-value">{modalStats.accuracy}%</div>
            </div>
            <div className="modal-stat" style={{ gridColumn: 'span 2' }}>
              <div className="modal-stat-label">Elapsed Time</div>
              <div className="modal-stat-value">{modalStats.elapsed} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Seconds</span></div>
            </div>
          </div>
          <button className="control-btn" style={{ margin: '0 auto' }} onClick={() => { setShowModal(false); handleReset(); }}>
            Start Next Challenge
          </button>
        </div>
      </div>

      {/* Header Panel */}
        <div className="logo-section">
          <div className="pulse-indicator"></div>
          <div>
            <h1>DevPulse</h1>
            <div className="subtitle">Coding Performance & Analytics Engine</div>
          </div>
        </div>

        <div className="controls-section">
          <button
            className="control-btn btn-secondary"
            type="button"
            onClick={() => {
              setActivePage('articles');
              setSelectedArticleId('js-concepts');
            }}
          >
            Open Articles
          </button>
        </div>

        {activePage === 'articles' ? (
          <section className="articles-page glass-panel">
            {/* SECTION 1: INTRO TO JAVASCRIPT */}
            <h3>1. Introduction to JavaScript</h3>
            <p>
              HTML gives structure and CSS gives styling, but neither can perform programming logic. 
              JavaScript is the brain that adds real-time interactivity and dynamic behavior to a webpage  . 
              It runs directly inside the browser using engines like V8  .
            </p>
            <pre className="concept-code">

{`// Your very first line of JavaScript code
console.log("Hello, Thunder Course!"); // Prints text to the browser console`}
            </pre>
<br/>
            {/* SECTION 2: VARIABLES & STATE */}
            <h3>2. Variables</h3>
            <p>
              Variables are named storage containers used to save data values securely in system memory  . 
              In modern JavaScript, we initialize mutable block-scoped variables using <code>let</code> and constants using <code>const</code>  .
            </p>
            <pre className="concept-code">
{`let userWpm = 65;       // Value can change later
const courseName = "Thunder"; // Value remains fixed forever`}
            </pre>
            {/* SECTION 3: DATA TYPES */}
<br/>
            <h3>3. Data Types</h3>
            <p>
              JavaScript is a dynamically typed programming language  . Variables don't have hardcoded classifications, but the values inside them do. 
              You can check the explicit data classification of any value using the <code>typeof</code> operator  .
            </p>
            <pre className="concept-code">
{`let isCoding = true; 
console.log(typeof isCoding); // Output: "boolean"`}
            </pre>
            {/* SECTION 4: STRINGS */}
<br/>
            <h3>4. Strings & Character Inspection</h3>
            <p>
              Strings are sequences of text characters wrapped inside quotes  . They possess an immutable <code>.length</code> property  . 
              We track individual letters by looking up their index indices to run character-by-character validation checks using strict equality operators (<code>===</code>)  .
            </p>
            <pre className="concept-code">
{`let snippet = "let x = 10!";
console.log(snippet.length); // Output: 11
console.log(snippet[0]);    // Output: "l"`}
            </pre>
<br/>
            {/* SECTION 5: NUMBERS & MATH OBJECT */}
            <h3>5. Numbers & The Math Object</h3>
            <p>
              Integers and decimal floating-point values are grouped under a single data type called <code>Number</code>  . 
              To run advanced math calculations, we deploy the global built-in <code>Math</code> object utility functions  .
            </p>
            <pre className="concept-code">
{`// Rounding fractional performance metrics cleanly to whole integers
let dynamicScore = Math.round(78.65); // Output: 79

// Generating random parameters on reset commands
let randomNum = Math.floor(Math.random() * 100); // Random integer between 0 and 99`}
            </pre>
<br/>

            <p>
              Click the button below to return to the dashboard and continue practicing with the typing challenges.
            </p>
<br/>

            <button className="control-btn" type="button" onClick={() => setActivePage('dashboard')}>
              Back to Dashboard
            </button>
          </section>
        ) : (
          <>
            {/* Stats Cards Overview Grid */}
            <section className="stats-grid">
              <div className="stat-card glass-panel">
                <div className="stat-label">Avg Speed</div>
                <div className="stat-value highlight">{avgWpm} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>WPM</span></div>
                <div className="stat-footer">
                  <span>Based on {totalCompleted} sessions</span>
                </div>
              </div>

              <div className="stat-card glass-panel">
                <div className="stat-label">Avg Accuracy</div>
                <div className="stat-value highlight">{avgAccuracy}%</div>
                <div className="stat-footer">
                  <span>Target is &gt;90% accuracy</span>
                </div>
              </div>

              <div className="stat-card glass-panel">
                <div className="stat-label">Sessions Completed</div>
                <div className="stat-value">{totalCompleted}</div>
                <div className="stat-footer">
                  <span>Tracked daily logs</span>
                </div>
              </div>

              <div className="stat-card glass-panel">
                <div className="stat-label">All-Time High</div>
                <div className="stat-value" style={{ color: 'var(--accent)' }}>{bestWpm} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>WPM</span></div>
                <div className="stat-footer">
                  <span>Peak typing rate</span>
                </div>
              </div>
            </section>

            {/* Main Coding Arena Grid */}
            <section className="arena-grid">
              {/* Visual Code Editor Card */}
              <div className="editor-container">
                <div className="glass-panel" style={{ padding: 0 }}>
                  <div className="editor-header">
                    <div className="editor-dots">
                      <div className="editor-dot dot-red"></div>
                      <div className="editor-dot dot-yellow"></div>
                      <div className="editor-dot dot-green"></div>
                    </div>
                    <div className="editor-tab">
                      <span className="editor-tab-active">{currentSnippet.name ? currentSnippet.name.toLowerCase().replace(/\s+/g, '_') : 'challenge'}.js</span>
                    </div>
                    <div style={{ width: 40 }}></div>
                  </div>

                  <div className="editor-body" onClick={focusInput}>
                    {/* Target Code Snippet to display with live highlighting */}
                    <div className="snippet-display">
                      {renderCodeSnippetCharacters()}
                    </div>

                    {/* Hidden text area that intercepts keystrokes */}
                    <textarea
                      ref={inputRef}
                      className="typing-input"
                      value={inputText}
                      onChange={handleTextInput}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      disabled={showModal}
                    />

                    {!isTesting && inputText.length === 0 && (
                      <div className="editor-placeholder-hint">
                        // Click editor & start typing to begin...
                      </div>
                    )}
                  </div>

                  {/* Live Session Metrics */}
                  <div className="arena-footer">
                    <div className="live-metrics">
                      <div className="live-metric">
                        <span className="live-label">Speed</span>
                        <span className="live-value" style={{ color: 'var(--primary)' }}>{liveWpm} WPM</span>
                      </div>
                      <div className="live-metric">
                        <span className="live-label">Accuracy</span>
                        <span className="live-value" style={{ color: liveAccuracy >= 90 ? 'var(--success)' : 'var(--accent)' }}>{liveAccuracy}%</span>
                      </div>
                      <div className="live-metric">
                        <span className="live-label">Time</span>
                        <span className="live-value">{elapsedTime.toFixed(1)}s</span>
                      </div>
                    </div>

                    {/* Progress Bar representation */}
                    <div className="progress-container">
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${(inputText.length / currentSnippet.code.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">
                        {Math.round((inputText.length / currentSnippet.code.length) * 100 || 0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Controls */}
              <div className="sidebar">
                <div className="glass-panel" style={{ flex: 1 }}>
                  <h3 className="panel-title">Console Controls</h3>

                  <div className="form-group">
                    <label>Select Challenge Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCategoryQuestionIndex(0);
                        handleReset();
                      }}
                    >
                      {snippets.length === 0 ? (
                        <option>Loading categories...</option>
                      ) : (
                        [...new Set(snippets.map((snip) => snip.category))].map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <button className="control-btn" onClick={handleReset}>
                      Reset Challenge
                    </button>

                    <button
                      className="control-btn btn-secondary"
                      onClick={() => {
                        if (currentCategorySnippets.length > 0) {
                          const nextIdx = (categoryQuestionIndex + 1) % currentCategorySnippets.length;
                          setCategoryQuestionIndex(nextIdx);
                          handleReset();
                        }
                      }}
                    >
                      Next Challenge
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* History Log Section with Chart Visualizations */}
            <section className="logs-section glass-panel">
              <div className="section-header">
                <h2 className="section-title">Session Productivity History</h2>
                {scores.length > 0 && (
                  <button className="control-btn btn-secondary" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={handleClearLogs}>
                    Clear History
                  </button>
                )}
              </div>

              {scores.length === 0 ? (
                <div className="empty-history-text">No productivity records found in the database. Finish a typing session to populate stats.</div>
              ) : (
                <>
                  {/* Speed Progression Bar Chart */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span className="stat-label" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>WPM Progression (Last 10 Sessions)</span>
                    <div className="history-chart-container">
                      {last10Scores.map((score, index) => {
                        const percentageHeight = (score.wpm / maxWpmInChart) * 90 + 10; // clamp height between 10% and 100%
                        const isPeak = score.wpm === bestWpm;
                        return (
                          <div key={score._id || index} className="history-bar-wrapper">
                            <div
                              className={`history-bar ${isPeak ? 'history-bar-fill-accent' : ''}`}
                              style={{ height: `${percentageHeight}%` }}
                            >
                              <div className="history-bar-tooltip">
                                {score.wpm} WPM | {score.accuracy}% Acc | {score.duration}s
                                <br />
                                {new Date(score.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Performance Data Grid Table */}
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Date & Time</th>
                          <th>Snippet Target</th>
                          <th>Coding Speed</th>
                          <th>Accuracy</th>
                          <th>Duration</th>
                          <th>Developer Tier</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scores.map((score) => (
                          <tr key={score._id}>
                            <td>{new Date(score.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{score.snippetName}</td>
                            <td style={{ fontWeight: '600' }}>{score.wpm} WPM</td>
                            <td>{score.accuracy}%</td>
                            <td>{score.duration}s</td>
                            <td>{getRatingPill(score.wpm, score.accuracy)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </section>

            {/* Educational Concept drawer explaining week 1 code concept implementations */}
            <section className="concept-drawer">
              <div className="concept-drawer-header" onClick={() => setIsDrawerCollapsed(!isDrawerCollapsed)}>
                <h3>
                  ⚙️ Interactive Week 1 JS Concepts Code Drawer
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {isDrawerCollapsed ? '▼ Expand Code Concepts' : '▲ Collapse Code Concepts'}
                </span>
              </div>

              <div className={`concept-drawer-body ${isDrawerCollapsed ? 'collapsed' : ''}`}>
                <div className="concept-card">
                  <h4>1. Variables & State Logic</h4>
                  <p>React handles developer state using primitives like strings and numbers, mirroring variables we study in class.</p>
                  <pre className="concept-code">
{`// App variables declaring mutable stats state
const [inputText, setInputText] = useState('');
const [startTime, setStartTime] = useState(null);
const [liveWpm, setLiveWpm] = useState(0);`}
                  </pre>
                </div>

                <div className="concept-card">
                  <h4>2. String Comparison Engine</h4>
                  <p>Uses index-based string slicing and character matching length tests to check correct vs. incorrect typing errors.</p>
                  <pre className="concept-code">
{`// Highlights characters by checking index matches
let correctCount = 0;
for (let i = 0; i < inputText.length; i++) {
  if (inputText[i] === targetCode[i]) {
    correctCount++;
  }
}
let accuracy = Math.round((correctCount / total) * 100);`}
                  </pre>
                </div>

                <div className="concept-card">
                  <h4>3. Math Calculations & WPM</h4>
                  <p>Calculating coding speed runs calculations through JS Math methods. WPM is defined as words typed per minute.</p>
                  <pre className="concept-code">
{`// Words Per Minute Formula:
// 1 Word = 5 characters.
const durationInMinutes = elapsedSeconds / 60;
const rawWpm = (inputText.length / 5) / durationInMinutes;

// Using Math.round to output clean integers
const finalWpm = Math.round(rawWpm);`}
                  </pre>
                </div>

                <div className="concept-card">
                  <h4>4. Operators & Duration</h4>
                  <p>Subtracts timestamps (Date milliseconds) and runs basic arithmetic operators to output decimal session durations.</p>
                  <pre className="concept-code">
{`// Subtraction operator to find total time
const elapsedMilliseconds = Date.now() - startTime;
const seconds = elapsedMilliseconds / 1000;

// division and rounding metrics
const displaySeconds = Math.round(seconds * 10) / 10;`}
                  </pre>
                </div>
              </div>
            </section>

          
        </>
      )}

      {/* Footer copyright */}
      <footer>
        <p>&copy; {new Date().getFullYear()} DevPulse Developer Analytics Dashboard. Designed for Coding Students.</p>
      </footer>
    </div>
  );
}
