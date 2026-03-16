import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import "./GamifiedLearning.css";

export default function DroughtPreparedness() {
  const navigate = useNavigate();
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0);
  const [completedCheckpoints, setCompletedCheckpoints] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [moduleComplete, setModuleComplete] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const jumpToCheckpoint = (index) => {
    if (isAdmin) {
      setCurrentCheckpoint(index);
      setQuizAnswers({});
      setQuizResult(null);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAdmin(user.email === "admin@gmail.com");
  }, []);

  const checkpoints = [
    { id: 0, type: "intro", title: "Introduction to Drought Preparedness", content: "Droughts develop slowly but have severe impacts. Learn water conservation and survival strategies!", icon: "🏜️" },
    { id: 1, type: "video", title: "Watch: Drought Management", videoUrl: "https://www.youtube.com/embed/wnnr7ZKETXc", icon: "📹" },
    { id: 2, type: "content", title: "Before a Drought", content: ["Install water-efficient fixtures", "Collect and store rainwater", "Plant drought-resistant vegetation", "Fix all water leaks promptly", "Create water conservation plan"], icon: "⚠️" },
    { id: 3, type: "quiz", title: "Checkpoint Quiz: Preparation", questions: [
      { question: "What is the best way to prepare for drought?", options: ["Ignore it", "Conserve water daily", "Use more water", "Wait for rain"], correct: 1 },
      { question: "Which plants are best during drought?", options: ["Water-loving plants", "Drought-resistant plants", "Tropical plants", "Any plants"], correct: 1 },
      { question: "Should you fix water leaks?", options: ["No, too expensive", "Yes, immediately", "Only big leaks", "Never"], correct: 1 },
      { question: "What is rainwater harvesting?", options: ["Buying water", "Collecting and storing rain", "Wasting water", "Ignoring rain"], correct: 1 },
      { question: "How much water should you store?", options: ["None", "1 gallon per person per day", "Unlimited", "Just a cup"], correct: 1 }
    ], icon: "✅" },
    { id: 4, type: "content", title: "During a Drought", content: ["Limit water use to essentials", "Take shorter showers", "Reuse water when possible", "Don't water lawns", "Follow water restrictions"], icon: "🚨" },
    { id: 5, type: "quiz", title: "Checkpoint Quiz: Response", questions: [
      { question: "During drought, should you water lawn?", options: ["Yes, daily", "No, avoid it", "Twice daily", "Only at noon"], correct: 1 },
      { question: "How can you reuse water?", options: ["Can't reuse", "Use cooking water for plants", "Throw it away", "Never reuse"], correct: 1 },
      { question: "What time is best to water plants if needed?", options: ["Noon", "Early morning or evening", "Afternoon", "Anytime"], correct: 1 },
      { question: "Should you run dishwasher half-full?", options: ["Yes, always", "No, wait until full", "Doesn't matter", "Run empty"], correct: 1 },
      { question: "Can you wash car during drought?", options: ["Yes, daily", "Avoid or use bucket", "Use hose freely", "Wash twice daily"], correct: 1 }
    ], icon: "✅" },
    { id: 6, type: "content", title: "After a Drought", content: ["Gradually resume normal water use", "Maintain conservation habits", "Repair drought damage to property", "Replant damaged vegetation", "Review and improve water systems"], icon: "🏠" },
    { id: 7, type: "final-quiz", title: "Final Assessment", questions: [
      { question: "What causes droughts?", options: ["Too much rain", "Lack of precipitation over time", "Cold weather", "Wind"], correct: 1 },
      { question: "Can droughts last years?", options: ["No, only days", "Yes, can be prolonged", "Only weeks", "Never"], correct: 1 },
      { question: "What is the most important resource during drought?", options: ["Electricity", "Water", "Food", "Money"], correct: 1 },
      { question: "Should you continue conservation after drought?", options: ["No, waste freely", "Yes, maintain good habits", "Only during drought", "Never conserve"], correct: 1 },
      { question: "Who should conserve water?", options: ["Only farmers", "Everyone", "Only cities", "Nobody"], correct: 1 }
    ], icon: "🏆" }
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const progressKey = user.email ? `${user.email}_droughtProgress` : "droughtProgress";
    const saved = JSON.parse(localStorage.getItem(progressKey) || "{}")
    if (saved.completedCheckpoints) {
      setCompletedCheckpoints(saved.completedCheckpoints);
      setCurrentCheckpoint(saved.currentCheckpoint || 0);
      setScore(saved.score || 0);
    }
  }, []);

  const saveProgress = (checkpoint, completed, newScore) => {
    localStorage.setItem("droughtProgress", JSON.stringify({ currentCheckpoint: checkpoint, completedCheckpoints: completed, score: newScore }));
  };

  const completeCheckpoint = () => {
    const newCompleted = [...completedCheckpoints, currentCheckpoint];
    setCompletedCheckpoints(newCompleted);
    if (currentCheckpoint === checkpoints.length - 1) {
      setModuleComplete(true);
      saveProgress(currentCheckpoint, newCompleted, score);
    } else {
      const nextCheckpoint = currentCheckpoint + 1;
      setCurrentCheckpoint(nextCheckpoint);
      saveProgress(nextCheckpoint, newCompleted, score);
    }
    setQuizAnswers({});
    setQuizResult(null);
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers({ ...quizAnswers, [questionIndex]: answerIndex });
  };

  const submitQuiz = () => {
    const checkpoint = checkpoints[currentCheckpoint];
    let correct = 0;
    checkpoint.questions.forEach((q, i) => { if (quizAnswers[i] === q.correct) correct++; });
    const quizScore = (correct / checkpoint.questions.length) * 100;
    const passed = quizScore >= 80;
    setQuizResult({ score: quizScore, correct: correct, total: checkpoint.questions.length, passed: passed });
    if (passed) setScore(score + quizScore);
  };

  const retakeQuiz = () => { setQuizAnswers({}); setQuizResult(null); };

  const generateCertificate = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = user.name || "Student";
    const today = new Date();
    const date = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Border
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);
    
    // Title
    doc.setFontSize(32);
    doc.setFont(undefined, 'bold');
    doc.text('Certificate of Completion', 148.5, 50, { align: 'center' });
    
    // Body
    doc.setFontSize(16);
    doc.setFont(undefined, 'normal');
    doc.text('This certifies that', 148.5, 80, { align: 'center' });
    
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text(userName, 148.5, 100, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'normal');
    doc.text('has successfully completed the', 148.5, 120, { align: 'center' });
    
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Drought Preparedness Course', 148.5, 135, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(`Score: ${score.toFixed(0)} points | Date: ${date}`, 148.5, 155, { align: 'center' });
    
    doc.save(`${userName}_DroughtPreparedness_Certificate.pdf`);
  };

  const oldGenerateCertificate = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = user.name || "Student";
    const today = new Date();
    const date = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    
    alert(`Certificate Generated!\n\nThis certifies that ${userName} has successfully completed the Drought Preparedness course on ${date}.\n\nScore: ${score.toFixed(0)} points\nCompletion: 100%`);
  };


  const instantFinish = () => {
    if (window.confirm("Complete this module instantly? This will mark all checkpoints as completed.")) {
      const allCompleted = checkpoints.map((_, i) => i);
      setCompletedCheckpoints(allCompleted);
      setCurrentCheckpoint(checkpoints.length - 1);
      setScore(800);
      setModuleComplete(true);
      saveProgress(checkpoints.length - 1, allCompleted, 800);
    }
  };
  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset all progress for this module?")) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const progressKey = user.email ? `${user.email}_droughtProgress` : "droughtProgress";
      localStorage.removeItem(progressKey);
      setCurrentCheckpoint(0);
      setCompletedCheckpoints([]);
      setScore(0);
      setModuleComplete(false);
      setQuizAnswers({});
      setQuizResult(null);
    }
  };

  const checkpoint = checkpoints[currentCheckpoint];
  const progress = ((completedCheckpoints.length / checkpoints.length) * 100).toFixed(0);

  return (
    <>
      <Navbar />
      <div className="gamified-learning-page">
        <BackButton />
        <div className="learning-header">
          <div className="module-title-section">
            <span className="module-icon-large">🏜️</span>
            <h1>Drought Preparedness Mastery</h1>
          </div>
          <div className="progress-section">
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-stats">
              <span>Progress: {progress}%</span>
              <span>Score: {score.toFixed(0)} pts</span>
              <span>Checkpoint: {currentCheckpoint + 1}/{checkpoints.length}</span>              {isAdmin && (
                <>
                  <button className="btn-finish-admin" onClick={instantFinish} title="Instantly Complete Module (Admin Only)">
                    ⚡ Finish
                  </button>
                  <button className="btn-reset-admin" onClick={resetProgress} title="Reset Progress (Admin Only)">
                  🔄 Reset
                </button>
              
                </>
              )}}
              </div>
          </div>
        </div>
        <div className="checkpoint-map">
          {checkpoints.map((cp, i) => (
            <div
              key={cp.id}
              className={`checkpoint-node ${completedCheckpoints.includes(i) ? 'completed' : ''} ${i === currentCheckpoint ? 'active' : ''} ${!isAdmin && i > currentCheckpoint ? 'locked' : ''}`}
              onClick={() => jumpToCheckpoint(i)}
              style={{ cursor: isAdmin ? 'pointer' : 'default' }}
            >
              <span className="checkpoint-icon">{cp.icon}</span>
              <span className="checkpoint-label">{cp.title}</span>
            </div>
          ))}
        </div>
        {moduleComplete ? (
          <div className="completion-card">
            <h2>🎉 Module Complete!</h2>
            <div className="completion-stats">
              <div className="stat"><span className="stat-value">{score.toFixed(0)}</span><span className="stat-label">Total Points</span></div>
              <div className="stat"><span className="stat-value">{checkpoints.length}</span><span className="stat-label">Checkpoints</span></div>
              <div className="stat"><span className="stat-value">🏆</span><span className="stat-label">Badge Earned</span></div>
            </div>
            <button className="btn-continue" onClick={() => navigate('/home')}>Back to Dashboard</button>
          </div>
        ) : (
          <div className="checkpoint-content">
            <div className="checkpoint-header">
              <span className="checkpoint-number">Checkpoint {currentCheckpoint + 1}</span>
              <h2>{checkpoint.title}</h2>
            </div>
            {checkpoint.type === "intro" && (
              <div className="intro-content">
                <p>{checkpoint.content}</p>
                <button className="btn-next" onClick={completeCheckpoint}>Start Learning →</button>
              </div>
            )}
            {checkpoint.type === "video" && (
              <div className="video-content">
                <iframe src={checkpoint.videoUrl} className="checkpoint-video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                <button className="btn-next" onClick={completeCheckpoint}>Continue →</button>
              </div>
            )}
            {checkpoint.type === "content" && (
              <div className="content-section">
                <ul className="content-list">{checkpoint.content.map((item, i) => <li key={i}>{item}</li>)}</ul>
                <button className="btn-next" onClick={completeCheckpoint}>Continue →</button>
              </div>
            )}
            {(checkpoint.type === "quiz" || checkpoint.type === "final-quiz") && (
              <div className="quiz-section">
                {!quizResult ? (
                  <>
                    {checkpoint.questions.map((q, qIndex) => (
                      <div key={qIndex} className="quiz-question">
                        <h3>Question {qIndex + 1}: {q.question}</h3>
                        <div className="quiz-options">
                          {q.options.map((option, oIndex) => (
                            <button key={oIndex} className={`quiz-option ${quizAnswers[qIndex] === oIndex ? 'selected' : ''}`} onClick={() => handleQuizAnswer(qIndex, oIndex)}>{option}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button className="btn-submit" onClick={submitQuiz} disabled={Object.keys(quizAnswers).length !== checkpoint.questions.length}>Submit Quiz</button>
                  </>
                ) : (
                  <div className="quiz-result-card">
                    <h2>{quizResult.passed ? '🎉 Quiz Passed!' : '❌ Quiz Failed'}</h2>
                    <div className="result-score">
                      <span className="score-large">{quizResult.score.toFixed(0)}%</span>
                      <span className="score-detail">{quizResult.correct} / {quizResult.total} correct</span>
                    </div>
                    <div className="question-review">
                      <h3>Question Review:</h3>
                      {checkpoint.questions.map((q, qIndex) => {
                        const userAnswer = quizAnswers[qIndex];
                        const isCorrect = userAnswer === q.correct;
                        return (
                          <div key={qIndex} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                            <div className="review-header">
                              <span className="review-icon">{isCorrect ? '✓' : '✗'}</span>
                              <span className="review-status">{isCorrect ? 'Correct' : 'Incorrect'}</span>
                            </div>
                            <p className="review-question">Q{qIndex + 1}: {q.question}</p>
                            <p className="review-answer">Your answer: {q.options[userAnswer]}</p>
                            {!isCorrect && <p className="review-correct">Correct answer: {q.options[q.correct]}</p>}
                          </div>
                        );
                      })}
                    </div>
                    <p className="result-message">{quizResult.passed ? 'Great job! You can proceed to the next checkpoint.' : 'You need 80% to pass. Review the material and try again.'}</p>
                    <div className="result-actions">
                      {quizResult.passed ? (
                        <button className="btn-next" onClick={completeCheckpoint}>Continue to Next Checkpoint →</button>
                      ) : (
                        <button className="btn-retake" onClick={retakeQuiz}>Retake Quiz</button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
