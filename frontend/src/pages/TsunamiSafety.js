import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import "./GamifiedLearning.css";

export default function TsunamiSafety() {
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
    setIsAdmin(user.email === "admin@gmail.com");
  }, []);

  const checkpoints = [
    {
      id: 0,
      type: "intro",
      title: "Introduction to Tsunami Safety",
      content: "Tsunamis are powerful ocean waves caused by underwater earthquakes. Learn how to recognize warning signs and stay safe!",
      icon: "🌊"
    },
    {
      id: 1,
      type: "video",
      title: "Watch: Tsunami Awareness",
      videoUrl: "https://www.youtube.com/embed/Wx9vPv-T51I",
      icon: "📹"
    },
    {
      id: 2,
      type: "content",
      title: "Before a Tsunami",
      content: [
        "Know if you're in a tsunami hazard zone",
        "Learn evacuation routes to higher ground",
        "Prepare an emergency kit and evacuation plan",
        "Identify natural warning signs",
        "Practice evacuation drills regularly"
      ],
      icon: "⚠️"
    },
    {
      id: 3,
      type: "quiz",
      title: "Checkpoint Quiz: Preparation",
      questions: [
        {
          question: "What causes most tsunamis?",
          options: ["Underwater earthquakes", "Strong winds", "Heavy rain", "Tides"],
          correct: 0
        },
        {
          question: "Where should you evacuate during a tsunami?",
          options: ["Beach", "Higher ground", "Basement", "Car"],
          correct: 1
        },
        {
          question: "How far inland can tsunamis reach?",
          options: ["10 meters", "100 meters", "Several kilometers", "Only coastline"],
          correct: 2
        },
        {
          question: "What is a natural tsunami warning sign?",
          options: ["Rain", "Ocean receding rapidly", "Clouds", "Wind"],
          correct: 1
        },
        {
          question: "Should you wait for official warning before evacuating?",
          options: ["Yes, always", "No, evacuate if you feel earthquake near coast", "Only at night", "Wait 10 minutes"],
          correct: 1
        }
      ],
      icon: "✅"
    },
    {
      id: 4,
      type: "content",
      title: "During a Tsunami",
      content: [
        "Move inland and to higher ground immediately",
        "Drop, Cover, Hold if earthquake occurs",
        "Don't wait for official warning if near coast",
        "Stay away from the beach and harbors",
        "Climb to upper floors or roof if trapped"
      ],
      icon: "🚨"
    },
    {
      id: 5,
      type: "quiz",
      title: "Checkpoint Quiz: Response",
      questions: [
        {
          question: "If you feel an earthquake at the coast, what should you do?",
          options: ["Wait for warning", "Evacuate immediately", "Go to beach", "Call someone"],
          correct: 1
        },
        {
          question: "How many waves can a tsunami have?",
          options: ["Only one", "Two", "Multiple waves over hours", "Three"],
          correct: 2
        },
        {
          question: "Should you return after the first wave?",
          options: ["Yes, it's safe", "No, more waves may follow", "Only if sunny", "After 10 minutes"],
          correct: 1
        },
        {
          question: "If trapped in a building, where should you go?",
          options: ["Basement", "Ground floor", "Upper floors or roof", "Outside"],
          correct: 2
        },
        {
          question: "Can you outrun a tsunami?",
          options: ["Yes, easily", "No, they move very fast", "Only if you're fast", "In a car, yes"],
          correct: 1
        }
      ],
      icon: "✅"
    },
    {
      id: 6,
      type: "content",
      title: "After a Tsunami",
      content: [
        "Stay away from affected areas until cleared",
        "Listen to authorities for return instructions",
        "Avoid floodwater - may be contaminated",
        "Check for structural damage before entering",
        "Help injured or trapped persons if safe"
      ],
      icon: "🏠"
    },
    {
      id: 7,
      type: "final-quiz",
      title: "Final Assessment",
      questions: [
        {
          question: "What is the best protection from a tsunami?",
          options: ["Strong building", "Evacuation to high ground", "Staying in car", "Swimming"],
          correct: 1
        },
        {
          question: "How fast can tsunami waves travel in deep ocean?",
          options: ["10 km/h", "50 km/h", "500+ km/h", "100 km/h"],
          correct: 2
        },
        {
          question: "When is it safe to return after a tsunami?",
          options: ["After first wave", "When authorities say so", "Next day", "After 1 hour"],
          correct: 1
        },
        {
          question: "What should you do if you see the ocean receding?",
          options: ["Collect shells", "Evacuate immediately", "Take photos", "Wait and watch"],
          correct: 1
        },
        {
          question: "Can small earthquakes cause tsunamis?",
          options: ["No, never", "Yes, if underwater and shallow", "Only large ones", "Impossible"],
          correct: 1
        }
      ],
      icon: "🏆"
    }
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const progressKey = user.email ? `${user.email}_tsunamiProgress` : "tsunamiProgress";
    const saved = JSON.parse(localStorage.getItem(progressKey) || "{}")
    if (saved.completedCheckpoints) {
      setCompletedCheckpoints(saved.completedCheckpoints);
      setCurrentCheckpoint(saved.currentCheckpoint || 0);
      setScore(saved.score || 0);
    }
  }, []);

  const saveProgress = (checkpoint, completed, newScore) => {
    const progress = {
      currentCheckpoint: checkpoint,
      completedCheckpoints: completed,
      score: newScore
    };
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const progressKey = user.email ? `${user.email}_tsunamiProgress` : "tsunamiProgress";
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
      const progressKey = user.email ? `${user.email}_tsunamiProgress` : "tsunamiProgress";
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
    doc.text('Tsunami Safety Course', 148.5, 135, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(`Score: ${score.toFixed(0)} points | Date: ${date}`, 148.5, 155, { align: 'center' });
    
    doc.save(`${userName}_TsunamiSafety_Certificate.pdf`);
  };

  const oldGenerateCertificate = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = user.name || "Student";
    const today = new Date();
    const date = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    
    alert(`Certificate Generated!\n\nThis certifies that ${userName} has successfully completed the Tsunami Safety course on ${date}.\n\nScore: ${score.toFixed(0)} points\nCompletion: 100%`);
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
      const progressKey = user.email ? `${user.email}_tsunamiProgress` : "tsunamiProgress";
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
            <h1>Tsunami Safety Mastery</h1>
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
              className={`checkpoint-node ${completedCheckpoints.includes(i) ? 'completed' : ''} ${i === currentCheckpoint ? 'active' : ''} ${i > currentCheckpoint ? 'locked' : ''}`}
              onClick={() => jumpToCheckpoint(i)}
              style={{ cursor: isAdmin ? "pointer" : "default" }}
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
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
