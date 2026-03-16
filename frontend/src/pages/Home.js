import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(true);
  const [predictionError, setPredictionError] = useState("");

  const [weatherHistory, setWeatherHistory] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState("");
  const [learningStats, setLearningStats] = useState({ completed: 0, total: 19, inProgress: null });

  const [currentWeather, setCurrentWeather] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (u) setUser(u);
    calculateLearningStats();
  }, []);

  useEffect(() => {
    if (!user?.location) return;
    let mounted = true;

    async function fetchPrediction() {
      setPredictionLoading(true);
      setPredictionError("");
      console.log(`[FRONTEND] Fetching prediction for location: ${user.location}`);
      try {
        const data = await api.getDisasterPrediction(user.location);
        console.log(`[FRONTEND] Prediction received:`, data);
        if (mounted) {
          setPrediction(data);
          setCurrentWeather(data.weather_data);
          // Update user with full location from backend
          if (data.weather_data?.city && data.weather_data?.state) {
            setUser(prev => ({
              ...prev,
              fullLocation: `${data.weather_data.city}, ${data.weather_data.state}`
            }));
          }
        }
      } catch (err) {
        console.error(`[FRONTEND] Prediction error:`, err);
        if (mounted) setPredictionError("Unable to load prediction");
      }
      if (mounted) setPredictionLoading(false);
    }

    fetchPrediction();
    return () => (mounted = false);
  }, [user?.location]);

  useEffect(() => {
    if (!user?.location) return;
    let mounted = true;

    async function fetchWeather() {
      setWeatherLoading(true);
      setWeatherError("");
      console.log(`[FRONTEND] Fetching weather history for location: ${user.location}`);
      try {
        const data = await api.getWeatherHistory(user.location, 3);
        console.log(`[FRONTEND] Weather history received:`, data);
        if (mounted) setWeatherHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(`[FRONTEND] Weather history error:`, err);
        if (mounted) setWeatherError("Unable to load weather");
      }
      if (mounted) setWeatherLoading(false);
    }

    fetchWeather();
    return () => (mounted = false);
  }, [user]);



  const getRiskIcon = (risk) => {
    const icons = { LOW: "✓", MEDIUM: "⚠", HIGH: "⚠", CRITICAL: "✕" };
    return icons[risk] || "•";
  };

  const calculateLearningStats = () => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    const userEmail = u.email || "";
    
    const modules = [
      { key: "floodSafetyProgress", route: "/learning/flood-safety", title: "Flood Safety" },
      { key: "earthquakeProgress", route: "/learning/earthquake", title: "Earthquake Preparedness" },
      { key: "cycloneProgress", route: "/learning/cyclone", title: "Cyclone Awareness" },
      { key: "fireProgress", route: "/learning/fire-quiz", title: "Fire Safety" },
      { key: "tsunamiProgress", route: "/learning/tsunami", title: "Tsunami Safety" },
      { key: "landslideProgress", route: "/learning/landslide", title: "Landslide Safety" },
      { key: "droughtProgress", route: "/learning/drought", title: "Drought Preparedness" },
      { key: "heatwaveProgress", route: "/learning/heatwave", title: "Heatwave Safety" },
      { key: "lightningProgress", route: "/learning/lightning", title: "Lightning Safety" },
      { key: "firstaidProgress", route: "/learning/first-aid", title: "First Aid Basics" },
      { key: "pandemicProgress", route: "/learning/pandemic", title: "Pandemic Preparedness" },
      { key: "chemicalProgress", route: "/learning/chemical-spill", title: "Chemical Spill Safety" },
      { key: "nuclearProgress", route: "/learning/nuclear", title: "Nuclear Emergency" },
      { key: "collapseProgress", route: "/learning/building-collapse", title: "Building Collapse" },
      { key: "commProgress", route: "/learning/emergency-comm", title: "Emergency Communication" },
      { key: "survivalProgress", route: "/learning/survival", title: "Survival Skills" },
      { key: "petProgress", route: "/learning/pet-safety", title: "Pet Safety" },
      { key: "techProgress", route: "/learning/emergency-tech", title: "Emergency Tech" },
      { key: "psychProgress", route: "/learning/psych-aid", title: "Psychological First Aid" }
    ];

    let completed = 0;
    let inProgressModule = null;
    let maxProgress = 0;

    modules.forEach(module => {
      const progressKey = userEmail ? `${userEmail}_${module.key}` : module.key;
      const progress = JSON.parse(localStorage.getItem(progressKey) || "{}");
      const isComplete = progress.completedCheckpoints?.length === 8;
      
      if (isComplete) {
        completed++;
      } else if (progress.completedCheckpoints && progress.completedCheckpoints.length > 0) {
        const progressPercent = (progress.completedCheckpoints.length / 8) * 100;
        if (progressPercent > maxProgress) {
          maxProgress = progressPercent;
          inProgressModule = { ...module, progress: progressPercent, checkpoint: progress.currentCheckpoint || 0 };
        }
      } else if (!inProgressModule && completed < 19) {
        inProgressModule = module;
      }
    });

    setLearningStats({ completed, total: 19, inProgress: inProgressModule });
  };

  return (
    <div className="dashboard-root dark">
      <Navbar />
      
      <div className="dashboard-layout">
        <main className="main-content">

          {/* Hero Section - Risk & Current Weather */}
          <div className="hero-section">
            <motion.div 
              className="hero-card risk-hero"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {predictionLoading ? (
                <div className="loading">Analyzing data...</div>
              ) : predictionError ? (
                <div className="error">{predictionError}</div>
              ) : prediction && (
                <>
                  <div className="hero-header">
                    <span className="badge badge-live">Live Risk Assessment</span>
                  </div>
                  <div className="hero-content">
                    <div className="hero-icon-large" style={{ background: prediction.color }}>
                      {getRiskIcon(prediction.risk)}
                    </div>
                    <div className="hero-info">
                      <div className="hero-label">Current Risk Level</div>
                      <div className="hero-value" style={{ color: prediction.color }}>
                        {prediction.risk}
                      </div>
                      <div className="hero-meta">
                        <span>🧠 {(prediction.confidence*100).toFixed(0)}% Confidence</span>
                        <span>•</span>
                        <span>🤖 {prediction.model || "XGBoost"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="hero-recommendation">
                    <strong>💡 Action Required:</strong> {prediction.recommendation}
                  </div>
                </>
              )}
            </motion.div>

            <motion.div 
              className="hero-card weather-hero"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="hero-header">
                <span className="badge badge-info">Current Conditions</span>
              </div>
              <div className="current-weather-grid">
                <div className="current-weather-item">
                  <div className="weather-icon-large">🌡️</div>
                  <div className="weather-value-large">{currentWeather?.temp?.toFixed(1) || "--"}°C</div>
                  <div className="weather-label-small">Temperature</div>
                </div>
                <div className="current-weather-item">
                  <div className="weather-icon-large">💧</div>
                  <div className="weather-value-large">{currentWeather?.humidity || "--"}%</div>
                  <div className="weather-label-small">Humidity</div>
                </div>
                <div className="current-weather-item">
                  <div className="weather-icon-large">💨</div>
                  <div className="weather-value-large">{currentWeather?.wind?.toFixed(1) || "--"}</div>
                  <div className="weather-label-small">Wind (m/s)</div>
                </div>
              </div>
              <div className="location-display">
                <span className="location-icon">📍</span>
                <span className="location-text">{user.location || "Unknown Location"}</span>
              </div>
            </motion.div>
          </div>

          {/* Learning Progress Section */}
          <motion.div 
            className="learning-progress-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">📚 Your Learning Journey</h2>
            <div className="learning-stats-grid">
              <div className="learning-stat-card">
                <div className="learning-stat-icon">✅</div>
                <div className="learning-stat-value">{learningStats.completed}</div>
                <div className="learning-stat-label">Modules Completed</div>
              </div>
              <div className="learning-stat-card">
                <div className="learning-stat-icon">📖</div>
                <div className="learning-stat-value">{learningStats.total}</div>
                <div className="learning-stat-label">Total Modules</div>
              </div>
              <div className="learning-stat-card">
                <div className="learning-stat-icon">🎯</div>
                <div className="learning-stat-value">{((learningStats.completed / learningStats.total) * 100).toFixed(0)}%</div>
                <div className="learning-stat-label">Progress</div>
              </div>
            </div>

            {learningStats.inProgress && (
              <div className="continue-learning-card">
                <div className="continue-header">
                  <h3>Continue Learning</h3>
                  <span className="continue-badge">{learningStats.inProgress.progress ? `${learningStats.inProgress.progress.toFixed(0)}% Complete` : 'Start Now'}</span>
                </div>
                <div className="continue-content">
                  <div className="continue-info">
                    <h4>{learningStats.inProgress.title}</h4>
                    {learningStats.inProgress.checkpoint > 0 && (
                      <p>Resume from Checkpoint {learningStats.inProgress.checkpoint + 1}</p>
                    )}
                  </div>
                  <button 
                    className="btn-continue-learning"
                    onClick={() => navigate(learningStats.inProgress.route)}
                  >
                    {learningStats.inProgress.progress ? 'Continue →' : 'Start →'}
                  </button>
                </div>
                {learningStats.inProgress.progress > 0 && (
                  <div className="continue-progress-bar">
                    <div className="continue-progress-fill" style={{ width: `${learningStats.inProgress.progress}%` }}></div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Admin/Teacher Dashboard Link */}
          {(user.email === "admin@gmail.com" || user.role === "Teacher") && (
            <motion.div 
              className="admin-dashboard-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => navigate('/student-dashboard')}
            >
              <div className="admin-card-icon">📊</div>
              <div className="admin-card-content">
                <h3>{user.email === "admin@gmail.com" ? "Admin Dashboard" : "Teacher Dashboard"}</h3>
                <p>View registered {user.email === "admin@gmail.com" ? "users" : "students"} and their module progress</p>
              </div>
              <button className="btn-admin-dashboard">View Dashboard →</button>
            </motion.div>
          )}

          {/* Weather Forecast Timeline */}
          {weatherLoading ? (
            <div className="loading">Loading forecast...</div>
          ) : weatherError ? (
            <div className="error">{weatherError}</div>
          ) : (
            <div className="timeline-container">
              {weatherHistory.map((w, i) => {
                const dayLabels = ['Today', 'Tomorrow', 'Day After'];
                
                return (
                <motion.div 
                  key={i} 
                  className="timeline-item"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="timeline-marker">{dayLabels[i]}</div>
                  <div className="timeline-content">
                    <div className="timeline-weather">
                      <div className="timeline-temp">{w.temp_min}°C  -  {w.temp_max}°C</div>
                      <div className="timeline-icon">☁️</div>
                    </div>
                    <div className="timeline-details">
                      <span className="timeline-detail">💧 {w.humidity}%</span>
                      <span className="timeline-detail">💨 {w.wind_speed} m/s</span>
                    </div>
                    <div className="timeline-desc">{w.description}</div>
                  </div>
                </motion.div>
              )})}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}