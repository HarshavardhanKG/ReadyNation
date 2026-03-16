import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import "./GamifiedLearning.css";

export default function FloodSafety() {
  const navigate = useNavigate();
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0);
  const [completedCheckpoints, setCompletedCheckpoints] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
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
    const adminCheck = user.email === "admin@gmail.com" || user.role === "Admin";
    setIsAdmin(adminCheck);
    console.log("Admin status:", adminCheck, "User:", user);
    
    // Load progress with user email prefix
    const progressKey = user.email ? `${user.email}_floodSafetyProgress` : "floodSafetyProgress";
    const saved = JSON.parse(localStorage.getItem(progressKey) || "{}");
    if (saved.completedCheckpoints) {
      setCompletedCheckpoints(saved.completedCheckpoints);
      setCurrentCheckpoint(saved.currentCheckpoint || 0);
      setScore(saved.score || 0);
      if (saved.completedCheckpoints.length === 8) {
        setModuleComplete(true);
      }
    }
  }, []);

  const checkpoints = [
    {
      id: 0,
      type: "intro",
      title: "Introduction to Flood Safety",
      content: "Floods are one of the most common natural disasters. Understanding flood safety can save lives. Let's learn the essentials!",
      icon: "🌊"
    },
    {
      id: 1,
      type: "video",
      title: "Watch: Flood Safety Basics",
      videoUrl: "https://www.youtube.com/embed/pi_nUPcQz_A",
      icon: "📹"
    },
    {
      id: 2,
      type: "content",
      title: "Before a Flood",
      content: [
        "Know your area's flood risk and evacuation routes",
        "Prepare an emergency kit with essentials",
        "Keep important documents in waterproof containers",
        "Install check valves in plumbing",
        "Consider flood insurance"
      ],
      icon: "⚠️"
    },
    {
      id: 3,
      type: "quiz",
      title: "Checkpoint Quiz: Preparation",
      questions: [
        {
          question: "What should be in your emergency kit?",
          options: ["Food and water for 3 days", "Only medicines", "Just flashlight", "Nothing needed"],
          correct: 0
        },
        {
          question: "Where should you keep important documents?",
          options: ["In a drawer", "Waterproof container", "On the table", "In the basement"],
          correct: 1
        },
        {
          question: "How many days of supplies should you have?",
          options: ["1 day", "2 days", "3 days", "1 week"],
          correct: 2
        },
        {
          question: "What should you do with outdoor furniture before a flood?",
          options: ["Leave it outside", "Secure or bring inside", "Cover with plastic", "Nothing"],
          correct: 1
        },
        {
          question: "Should you have flood insurance?",
          options: ["No, never needed", "Only if near water", "Yes, consider it", "Only for rich people"],
          correct: 2
        }
      ],
      icon: "✅"
    },
    {
      id: 4,
      type: "content",
      title: "During a Flood",
      content: [
        "Move to higher ground immediately",
        "Never walk or drive through floodwater",
        "Stay away from power lines and electrical wires",
        "Listen to emergency broadcasts",
        "If trapped, go to the highest level"
      ],
      icon: "🚨"
    },
    {
      id: 5,
      type: "quiz",
      title: "Checkpoint Quiz: Response",
      questions: [
        {
          question: "What should you do if you see floodwater?",
          options: ["Drive through it", "Move to higher ground", "Stay where you are", "Go swimming"],
          correct: 1
        },
        {
          question: "How deep does water need to be to sweep away a car?",
          options: ["5 feet", "3 feet", "1 foot", "6 inches"],
          correct: 3
        },
        {
          question: "Should you walk through moving floodwater?",
          options: ["Yes, if careful", "No, never", "Only with boots", "Yes, if shallow"],
          correct: 1
        },
        {
          question: "What should you do if trapped in a building?",
          options: ["Go to basement", "Stay on ground floor", "Go to highest level", "Break windows"],
          correct: 2
        },
        {
          question: "Should you touch electrical equipment during a flood?",
          options: ["Yes, if dry", "No, never", "Only if necessary", "Yes, with gloves"],
          correct: 1
        }
      ],
      icon: "✅"
    },
    {
      id: 6,
      type: "content",
      title: "After a Flood",
      content: [
        "Return home only when authorities say it's safe",
        "Avoid floodwater - it may be contaminated",
        "Document damage with photos for insurance",
        "Clean and disinfect everything that got wet",
        "Watch for structural damage"
      ],
      icon: "🏠"
    },
    {
      id: 7,
      type: "final-quiz",
      title: "Final Assessment",
      questions: [
        {
          question: "What is the first thing to do when flood warning is issued?",
          options: ["Pack valuables", "Move to higher ground", "Call friends", "Take photos"],
          correct: 1
        },
        {
          question: "Can you walk through 6 inches of moving water safely?",
          options: ["Yes, always", "No, it can knock you down", "Only if you're strong", "Yes, with shoes"],
          correct: 1
        },
        {
          question: "When should you return home after a flood?",
          options: ["Immediately", "When water recedes", "When authorities say it's safe", "Next day"],
          correct: 2
        },
        {
          question: "What should you do with floodwater in your home?",
          options: ["Drink it if boiled", "Avoid contact, it's contaminated", "Use for cleaning", "It's safe"],
          correct: 1
        },
        {
          question: "How should you document flood damage?",
          options: ["Don't bother", "Take photos for insurance", "Just remember it", "Tell neighbors"],
          correct: 1
        }
      ],
      icon: "🏆"
    }
  ];

  const saveProgress = (checkpoint, completed, newScore) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const progress = {
      currentCheckpoint: checkpoint,
      completedCheckpoints: completed,
      score: newScore
    };
    const progressKey = user.email ? `${user.email}_floodSafetyProgress` : "floodSafetyProgress";
    localStorage.setItem(progressKey, JSON.stringify(progress));
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
    setShowQuiz(false);
    setQuizAnswers({});
    setQuizResult(null);
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers({ ...quizAnswers, [questionIndex]: answerIndex });
  };

  const submitQuiz = () => {
    const checkpoint = checkpoints[currentCheckpoint];
    let correct = 0;
    checkpoint.questions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) correct++;
    });
    
    const quizScore = (correct / checkpoint.questions.length) * 100;
    const passed = quizScore >= 80;
    
    setQuizResult({
      score: quizScore,
      correct: correct,
      total: checkpoint.questions.length,
      passed: passed
    });
    
    if (passed) {
      const newScore = score + quizScore;
      setScore(newScore);
    }
  };

  const retakeModule = () => {
    if (window.confirm("Retake this module? Your current progress will be reset.")) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const progressKey = user.email ? `${user.email}_floodSafetyProgress` : "floodSafetyProgress";
      localStorage.removeItem(progressKey);
      setCurrentCheckpoint(0);
      setCompletedCheckpoints([]);
      setScore(0);
      setModuleComplete(false);
      setQuizAnswers({});
      setQuizResult(null);
    }
  };

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
    doc.text('Flood Safety Mastery Course', 148.5, 135, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(`Score: ${score.toFixed(0)} points | Date: ${date}`, 148.5, 155, { align: 'center' });
    
    doc.save(`${userName}_FloodSafety_Certificate.pdf`);
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
      const progressKey = user.email ? `${user.email}_floodSafetyProgress` : "floodSafetyProgress";
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
            <span className="module-icon-large">🌊</span>
            <h1>Flood Safety Mastery</h1>
          </div>
          
          <div className="progress-section">
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-stats">
              <span>Progress: {progress}%</span>
              <span>Score: {score.toFixed(0)} pts</span>
              <span>Checkpoint: {currentCheckpoint + 1}/{checkpoints.length}</span>
              {isAdmin && (
                <>
                  <button className="btn-finish-admin" onClick={instantFinish} title="Instantly Complete Module (Admin Only)">
                    ⚡ Finish
                  </button>
                  <button className="btn-reset-admin" onClick={resetProgress} title="Reset Progress (Admin Only)">
                    🔄 Reset
                  </button>
                </>
              )}
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
              <div className="stat">
                <span className="stat-value">{score.toFixed(0)}</span>
                <span className="stat-label">Total Points</span>
              </div>
              <div className="stat">
                <span className="stat-value">{checkpoints.length}</span>
                <span className="stat-label">Checkpoints</span>
              </div>
              <div className="stat">
                <span className="stat-value">✅</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
            <div className="result-actions">
              <button className="btn-certificate" onClick={generateCertificate}>
                📜 Download Certificate
              </button>
              <button className="btn-retake" onClick={retakeModule}>
                🔄 Retake Module
              </button>
              <button className="btn-continue" onClick={() => navigate('/home')}>
                Back to Dashboard
              </button>
            </div>
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
                <button className="btn-next" onClick={completeCheckpoint}>
                  Start Learning →
                </button>
              </div>
            )}

            {checkpoint.type === "video" && (
              <div className="video-content">
                <iframe
                  src={checkpoint.videoUrl}
                  className="checkpoint-video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <button className="btn-next" onClick={completeCheckpoint}>
                  Continue →
                </button>
              </div>
            )}

            {checkpoint.type === "content" && (
              <div className="content-section">
                <ul className="content-list">
                  {checkpoint.content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <button className="btn-next" onClick={completeCheckpoint}>
                  Continue →
                </button>
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
                            <button
                              key={oIndex}
                              className={`quiz-option ${quizAnswers[qIndex] === oIndex ? 'selected' : ''}`}
                              onClick={() => handleQuizAnswer(qIndex, oIndex)}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      className="btn-submit"
                      onClick={submitQuiz}
                      disabled={Object.keys(quizAnswers).length !== checkpoint.questions.length}
                    >
                      Submit Quiz
                    </button>
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
                            {!isCorrect && (
                              <p className="review-correct">Correct answer: {q.options[q.correct]}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    <p className="result-message">
                      {quizResult.passed 
                        ? 'Great job! You can proceed to the next checkpoint.' 
                        : 'You need 80% to pass. Review the material and try again.'}
                    </p>
                    <div className="result-actions">
                      {quizResult.passed ? (
                        <button className="btn-next" onClick={completeCheckpoint}>
                          Continue to Next Checkpoint →
                        </button>
                      ) : (
                        <button className="btn-retake" onClick={() => { setQuizAnswers({}); setQuizResult(null); }}>
                          Retake Quiz
                        </button>
                      )}
                    </div>
                  </div>
                )}}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
