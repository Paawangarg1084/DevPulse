import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  // --- DATABASE & DATA STATE ---
  const [snippets, setSnippets] = useState([]);
  const [scores, setScores] = useState([]);
  const [selectedSnippetIndex, setSelectedSnippetIndex] = useState(0);

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
        setSnippets(data);
      } else {
        showToast("Failed to fetch snippets from database API.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Backend offline. Make sure server is running.", "error");
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

  const currentSnippet = snippets[selectedSnippetIndex] || {
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
      <header>
        <div className="logo-section">
          <div className="pulse-indicator"></div>
          <div>
            <h1>DevPulse</h1>
            <div className="subtitle">Coding Performance & Analytics Engine</div>
          </div>
        </div>

        <div className="controls-section">
          <div className="theme-selector-container">
            <span>Theme:</span>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="one-dark">One Dark Pro</option>
              <option value="cyberpunk">Cyberpunk Neon</option>
              <option value="monokai">Monokai Dark</option>
              <option value="matrix">Matrix Code</option>
            </select>
          </div>
        </div>
      </header>

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
              <label>Select Snippet Category</label>
              <select
                value={selectedSnippetIndex}
                onChange={(e) => {
                  setSelectedSnippetIndex(Number(e.target.value));
                  handleReset();
                }}
              >
                {snippets.length === 0 ? (
                  <option>Loading categories...</option>
                ) : (
                  snippets.map((snip, idx) => (
                    <option key={snip.id} value={idx}>
                      [{snip.category}] {snip.name}
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
                  if (snippets.length > 0) {
                    const nextIdx = (selectedSnippetIndex + 1) % snippets.length;
                    setSelectedSnippetIndex(nextIdx);
                    setInputText('');
                    setStartTime(null);
                    setElapsedTime(0);
                    setLiveWpm(0);
                    setLiveAccuracy(100);
                    setTimeout(focusInput, 50);
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

      {/* Footer copyright */}
      <footer>
        <p>&copy; {new Date().getFullYear()} DevPulse Developer Analytics Dashboard. Designed for Coding Students.</p>
      </footer>
    </div>
  );
}
