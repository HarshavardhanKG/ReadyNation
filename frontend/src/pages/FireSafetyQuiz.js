import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import "./GamifiedLearning.css";

export default function FireSafetyQuiz() {
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
    {
      id: 0,
      type: "intro",
      title: "Introduction to Fire Safety",
      content: "Fire can spread rapidly and cause devastating damage. Learn essential fire safety skills to protect yourself and your loved ones.",
      icon: "🔥"
    },
    {
      id: 1,
      type: "video",
      title: "Watch: Fire Safety Basics",
      videoUrl: "https://www.youtube.com/embed/cnn-yvszLXE",
      icon: "📹"
    },
    {
      id: 2,
      type: "content",
      title: "Fire Prevention at Home",
      content: [
        "Install smoke alarms on every floor and test monthly",
        "Keep fire extinguisher accessible and know how to use it",
        "Never leave cooking unattended",
        "Keep flammable materials away from heat sources",
        "Check electrical cords for damage regularly"
      ],
      icon: "⚠️"
    },
    {
      id: 3,
      type: "quiz",
      title: "Checkpoint Quiz: Prevention",
      questions: [
        {
          question: "How often should you test smoke alarms?",
          options: ["Never", "Once a year", "Once a month", "Only when battery dies"],
          correct: 2
        },
        {
          question: "Where should you keep a fire extinguisher?",
          options: ["In basement only", "Accessible location", "Hidden away", "Outside only"],
          correct: 1
        },
        {
          question: "Should you leave cooking unattended?",
          options: ["Yes, if quick", "No, never", "Only on low heat", "Yes, with timer"],
          correct: 1
        },
        {
          question: "What should you do with damaged electrical cords?",
          options: ["Use them anyway", "Replace immediately", "Tape them up", "Ignore if working"],
          correct: 1
        },
        {
          question: "Where should flammable materials be stored?",
          options: ["Near stove", "Away from heat sources", "Anywhere", "In oven"],
          correct: 1
        }
      ],
      icon: "✅"
    },
    {
      id: 4,
      type: "content",
      title: "Fire Escape Planning",
      content: [
        "Know two ways out of every room",
        "Designate a meeting point outside",
        "Practice your escape plan twice a year",
        "Never go back inside a burning building",
        "Close doors behind you to slow fire spread"
      ],
      icon: "🚪"
    },
    {
      id: 5,
      type: "quiz",
      title: "Checkpoint Quiz: Escape Plan",
      questions: [
        {
          question: "How many escape routes should each room have?",
          options: ["One", "Two", "Three", "None needed"],
          correct: 1
        },
        {
          question: "Where should your family meet after escaping?",
          options: ["Inside house", "Designated point outside", "Neighbor's house", "Anywhere"],
          correct: 1
        },
        {
          question: "How often should you practice fire drills?",
          options: ["Never", "Once a year", "Twice a year", "Every month"],
          correct: 2
        },
        {
          question: "Should you go back inside for belongings?",
          options: ["Yes, if quick", "No, never", "Only for valuables", "Yes, if safe"],
          correct: 1
        },
        {
          question: "Why close doors behind you during escape?",
          options: ["No reason", "Slows fire spread", "Looks better", "Saves energy"],
          correct: 1
        }
      ],
      icon: "✅"
    },
    {
      id: 6,
      type: "content",
      title: "If Your Clothes Catch Fire",
      content: [
        "STOP - Don't run, it makes fire worse",
        "DROP - Drop to the ground immediately",
        "ROLL - Roll back and forth to smother flames",
        "COOL - Cool burns with cool water for 10 minutes",
        "CALL - Call emergency services (101)"
      ],
      icon: "🚨"
    },
    {
      id: 7,
      type: "final-quiz",
      title: "Final Assessment",
      questions: [
        {
          question: "What is the emergency number for fire services in India?",
          options: ["100", "101", "102", "108"],
          correct: 1
        },
        {
          question: "If your clothes catch fire, what should you do?",
          options: ["Run for help", "Stop, Drop, and Roll", "Jump in pool", "Wave arms"],
          correct: 1
        },
        {
          question: "If there's smoke in a room, how should you move?",
          options: ["Stand and run", "Crawl low under smoke", "Walk normally", "Jump"],
          correct: 1
        },
        {
          question: "What should you do before opening a door during a fire?",
          options: ["Just open it", "Feel if it's hot", "Kick it down", "Wait"],
          correct: 1
        },
        {
          question: "Once you escape a fire, should you go back inside?",
          options: ["Yes, for pets", "No, never", "Only if quick", "Yes, for phone"],
          correct: 1
        }
      ],
      icon: "🏆"
    }
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const progressKey = user.email ? `${user.email}_fireProgress` : "fireProgress";
    const saved = JSON.parse(localStorage.getItem(progressKey) || "{}")
    if (saved.completedCheckpoints) {
      setCompletedCheckpoints(saved.completedCheckpoints);
      setCurrentCheckpoint(saved.currentCheckpoint || 0);
      setScore(saved.score || 0);
    }
  }, []);

  const saveProgress = (checkpoint, completed, newScore) => {
    localStorage.setItem("fireProgress", JSON.stringify({
      currentCheckpoint: checkpoint,
      completedCheckpoints: completed,
      score: newScore
    }));
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
      setScore(score + quizScore);
    }
  };

  const retakeModule = () => {
    if (window.confirm("Retake this module? Your current progress will be reset.")) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const progressKey = user.email ? `${user.email}_fireProgress` : "fireProgress";
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
    doc.text('Fire Safety Course', 148.5, 135, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(`Score: ${score.toFixed(0)} points | Date: ${date}`, 148.5, 155, { align: 'center' });
    
    doc.save(`${userName}_FireSafety_Certificate.pdf`);
  };

  const oldGenerateCertificate = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = user.name || "Student";
    const today = new Date();
    const date = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    
    alert(`Certificate Generated!\n\nThis certifies that ${userName} has successfully completed the Fire Safety course on ${date}.\n\nScore: ${score.toFixed(0)} points\nCompletion: 100%`);
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
      const progressKey = user.email ? `${user.email}_fireProgress` : "fireProgress";
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
            <span className="module-icon-large">🔥</span>
            <h1>Fire Safety Mastery</h1>
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
                <ul className="content-list">
                  {checkpoint.content.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
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
                        <button className="btn-retake" onClick={() => { setQuizAnswers({}); setQuizResult(null); }}>Retake Quiz</button>
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
