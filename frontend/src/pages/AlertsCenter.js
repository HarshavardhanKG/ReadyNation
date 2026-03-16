import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import "./AlertsCenter.css";

export default function AlertsCenter() {
  const [alerts, setAlerts] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (u) {
      setUser(u);
      fetchAlerts(u.location || u.fullLocation || "Mumbai");
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAlerts = async (location) => {
    try {
      setLoading(true);
      setError("");
      
      const city = location.includes(",") ? location.split(",")[0].trim() : location;
      
      const response = await fetch(`http://localhost:5000/alerts?location=${encodeURIComponent(city)}`);
      const data = await response.json();
      
      if (response.ok) {
        setAlerts(data.alerts || []);
      } else {
        setError(data.message || "Failed to fetch alerts");
      }
    } catch (err) {
      console.error("Error fetching alerts:", err);
      setError("Unable to connect to alerts service");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: "#dc2626",
      severe: "#ea580c",
      warning: "#f59e0b",
      info: "#3b82f6"
    };
    return colors[severity] || "#6b7280";
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      critical: "🚨",
      severe: "⚠️",
      warning: "⚡",
      info: "ℹ️"
    };
    return icons[severity] || "📢";
  };

  const criticalCount = alerts.filter(a => a.severity === "critical").length;
  const severeCount = alerts.filter(a => a.severity === "severe").length;

  return (
    <>
      <Navbar />
      <div className="alerts-center-page">
        <BackButton />
        <header className="page-header">
          <h1>🚨 Alert Center - {user.fullLocation || user.location || "Your Area"}</h1>
        </header>

      {loading ? (
        <div className="loading-state">
          <p>Loading alerts...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>⚠️ {error}</p>
        </div>
      ) : (
        <>
      <div className="alert-stats">
        <div className="stat-box critical">
          <h3>{criticalCount}</h3>
          <p>Critical Alerts</p>
        </div>
        <div className="stat-box active">
          <h3>{alerts.length}</h3>
          <p>Active Alerts</p>
        </div>
        <div className="stat-box today">
          <h3>{criticalCount + severeCount}</h3>
          <p>High Priority</p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="no-alerts">
          <p>✅ No active weather alerts for your area</p>
        </div>
      ) : (
        <div className="alerts-feed">
          {alerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              className="alert-card"
              style={{ borderLeftColor: getSeverityColor(alert.severity) }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="alert-header">
                <span className="alert-icon">{getSeverityIcon(alert.severity)}</span>
                <div className="alert-title-section">
                  <h3>{alert.title}</h3>
                  <span className="alert-region">📍 {alert.region}</span>
                  <span className="alert-time">{alert.time}</span>
                </div>
                {alert.verified && <span className="verified-badge">✓ Verified</span>}
              </div>
              <div className="alert-type-badge">{alert.type.toUpperCase()}</div>
              <p className="alert-message">{alert.message}</p>
              <div className="alert-footer">
                <span className="alert-source">Source: {alert.source}</span>
                <div className="alert-actions">
                  <button className="btn-details">View Details</button>
                  <button className="btn-share">Share</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
        </>
      )}
      </div>
    </>
  );
}
