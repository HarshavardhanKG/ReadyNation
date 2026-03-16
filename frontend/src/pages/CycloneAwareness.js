import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import "./GamifiedLearning.css";

export default function CycloneAwareness() {
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
      title: "Introduction to Cyclone Safety",
      content: "Cyclones are powerful storms that can cause devastating damage. Learn how to prepare and stay safe during these extreme weather events.",
      icon: "🌀"
    },
    {
      id: 1,
      type: "video",
      title: "Watch: Cyclone Awareness",
      videoUrl: "https://www.youtube.com/embed/XK2pKDzNcHE",
      icon: "📹"
    },
    {
      id: 2,
      type: "content",
      title: "Before a Cyclone",
      content: [
        "Monitor weather forecasts and cyclone warnings",
        "Stock up on food, water, and emergency supplies",
        "Secure outdoor objects and board up windows",
        "Know your evacuation route and shelter location",
        "Charge all electronic devices and have backup power"
      ],
      icon: "⚠️"
    },
    {
      id: 3,
      type: "quiz",
      title: "Checkpoint Quiz: Preparation",
      questions: [
        {
          question: "How should you prepare windows for a cyclone?",
          options: ["Leave them open", "Board them up", "Just close them", "Remove them"],
          correct: 1
        },
        {
          question: "What should you do with outdoor furniture?",
          options: ["Leave it outside", "Secure or bring inside", "Tie it down lightly", "Nothing"],
          correct: 1
        },
        {
          question: "How much water should you store per person per day?",
          options: ["1 liter", "3 liters", "5 liters", "No need"],
          correct: 1
        },
        {
          question: "Should you know your evacuation route?",
          options: ["No, not necessary", "Yes, absolutely", "Only if near coast", "Maybe"],
          correct: 1
        },
        {
          question: "When should you start preparing for a cyclone?",
          options: ["When it arrives", "As soon as warning issued", "Day before", "After it passes"],
          correct: 1
        }
      ],
      icon: "✅"
    },
    {
      id: 4,
      type: "content",
      title: "During a Cyclone",
      content: [
        "Stay indoors away from windows and doors",
        "Listen to emergency radio for updates",
        "Do NOT go outside during the 'eye' of the cyclone",
        "Keep emergency kit and flashlight accessible",
        "Stay in the strongest part of the building"
      ],
      icon: "🚨"
    },
    {
      id: 5,
      type: "quiz",
      title: "Checkpoint Quiz: Response",
      questions: [
        {
          question: "Where should you stay during a cyclone?",
          options: ["Near windows", "Indoors away from windows", "Outside", "In a car"],
          correct: 1
        },
        {
          question: "What is the 'eye' of a cyclone?",
          options: ["The end", "Calm center - still dangerous", "Safest part", "Beginning"],
          correct: 1
        },
        {
          question: "Should you go outside during the eye?",
          options: ["Yes, it's safe", "No, never", "Only briefly", "Yes, to check damage"],
          correct: 1
        },
        {
          question: "What should you listen to for updates?",
          options: ["Nothing", "Emergency radio", "Only TV", "Social media only"],
          correct: 1
        },
        {
          question: "Where is the safest place in a building?",
          options: ["Near windows", "Strongest interior room", "Basement always", "Roof"],
          correct: 1
        }
      ],
      icon: "✅"
    },
    {
      id: 6,
      type: "content",
      title: "After a Cyclone",
      content: [
        "Wait for official all-clear before going outside",
        "Avoid damaged buildings and power lines",
        "Watch for flooding and landslides",
        "Report downed power lines immediately",
        "Help neighbors and check on vulnerable people"
      ],
      icon: "🏠"
    },
    {
      id: 7,
      type: "final-quiz",
      title: "Final Assessment",
      questions: [
        {
          question: "When is it safe to go outside after a cyclone?",
          options: ["Immediately", "When eye passes", "After official all-clear", "When rain stops"],
          correct: 2
        },
        {
          question: "What should you do if you see downed power lines?",
          options: ["Touch them", "Report immediately and stay away", "Drive over them", "Ignore them"],
          correct: 1
        },
        {
          question: "Can flooding occur after a cyclone?",
          options: ["No, never", "Yes, watch for it", "Only near coast", "Impossible"],
          correct: 1
        },
        {
          question: "Should you enter damaged buildings?",
          options: ["Yes, to check", "No, stay out", "Only quickly", "Yes, if careful"],
          correct: 1
        },
        {
          question: "What's the most dangerous part of a cyclone?",
          options: ["The eye", "Storm surge and winds", "The rain", "The clouds"],
          correct: 1
        }
      ],
      icon: "🏆"
    }
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const progressKey = user.email ? `${user.email}_cycloneProgress` : "cycloneProgress";
    const saved = JSON.parse(localStorage.getItem(progressKey) || "{}")
    if (saved.completedCheckpoints) {
      setCompletedCheckpoints(saved.completedCheckpoints);
      setCurrentCheckpoint(saved.currentCheckpoint || 0);
      setScore(saved.score || 0);
    }
  }, []);

  const saveProgress = (checkpoint, completed, newScore) => {
    localStorage.setItem("cycloneProgress", JSON.stringify({
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
      const progressKey = user.email ? `${user.email}_cycloneProgress` : "cycloneProgress";
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
    doc.text('Cyclone Awareness Course', 148.5, 135, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(`Score: ${score.toFixed(0)} points | Date: ${date}`, 148.5, 155, { align: 'center' });
    
    doc.save(`${userName}_CycloneAwareness_Certificate.pdf`);
  };

  const oldGenerateCertificate = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = user.name || "Student";
    const today = new Date();
    const date = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    
    alert(`Certificate Generated!\n\nThis certifies that ${userName} has successfully completed the Cyclone Awareness course on ${date}.\n\nScore: ${score.toFixed(0)} points\nCompletion: 100%`);
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
      const progressKey = user.email ? `${user.email}_cycloneProgress` : "cycloneProgress";
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
            <span className="module-icon-large">🌀</span>
            <h1>Cyclone Awareness Mastery</h1>
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
