import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./IncidentReporting.css";

export default function IncidentReporting() {
  const [incidents, setIncidents] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [newReport, setNewReport] = useState({ type: "flood", description: "", location: "" });

  useEffect(() => {
    const mockIncidents = [
      { id: 1, type: "flood", location: "Main Street & 5th Ave", description: "Water level rising rapidly", reporter: "John D.", votes: 15, verified: true, time: "10 min ago", trustScore: 92 },
      { id: 2, type: "fire", location: "Forest Hills Park", description: "Smoke visible from residential area", reporter: "Sarah M.", votes: 8, verified: false, time: "25 min ago", trustScore: 78 },
      { id: 3, type: "road-closure", location: "Highway 101 North", description: "Tree fallen blocking both lanes", reporter: "Mike R.", votes: 23, verified: true, time: "1 hour ago", trustScore: 95 },
      { id: 4, type: "power-outage", location: "Downtown District", description: "Complete power failure affecting 200+ homes", reporter: "Lisa K.", votes: 31, verified: true, time: "2 hours ago", trustScore: 88 }
    ];
    setIncidents(mockIncidents);
  }, []);

  const submitReport = () => {
    if (!newReport.description || !newReport.location) return;
    const report = {
      id: Date.now(),
      ...newReport,
      reporter: "You",
      votes: 0,
      verified: false,
      time: "Just now",
      trustScore: 75
    };
    setIncidents([report, ...incidents]);
    setShowReportModal(false);
    setNewReport({ type: "flood", description: "", location: "" });
  };

  const upvoteIncident = (id) => {
    setIncidents(incidents.map(inc =>
      inc.id === id ? { ...inc, votes: inc.votes + 1 } : inc
    ));
  };

  const getTypeIcon = (type) => {
    const icons = {
      flood: "🌊",
      fire: "🔥",
      "road-closure": "🚧",
      "power-outage": "⚡",
      earthquake: "🏚️",
      other: "⚠️"
    };
    return icons[type] || "📍";
  };

  return (
    <div className="incident-reporting-page">
      <header className="page-header">
        <h1>📢 Community Incident Reports</h1>
        <button className="btn-report" onClick={() => setShowReportModal(true)}>
          + Report Incident
        </button>
      </header>

      <div className="heatmap-section">
        <div className="heatmap-placeholder">
          <h3>🗺️ Incident Heatmap</h3>
          <p>Showing {incidents.length} verified incidents in your area</p>
        </div>
      </div>

      <div className="incidents-grid">
        {incidents.map((incident, i) => (
          <motion.div
            key={incident.id}
            className="incident-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="incident-header">
              <span className="incident-icon">{getTypeIcon(incident.type)}</span>
              <div className="incident-info">
                <h3>{incident.type.replace("-", " ").toUpperCase()}</h3>
                <p className="incident-location">📍 {incident.location}</p>
              </div>
              {incident.verified && <span className="verified-badge">✓ Verified</span>}
            </div>
            <p className="incident-description">{incident.description}</p>
            <div className="incident-footer">
              <div className="incident-meta">
                <span>👤 {incident.reporter}</span>
                <span>🕒 {incident.time}</span>
                <span className="trust-score">Trust: {incident.trustScore}%</span>
              </div>
              <button className="btn-upvote" onClick={() => upvoteIncident(incident.id)}>
                👍 {incident.votes}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <motion.div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2>Report New Incident</h2>
            <select value={newReport.type} onChange={e => setNewReport({...newReport, type: e.target.value})}>
              <option value="flood">Flood</option>
              <option value="fire">Fire</option>
              <option value="road-closure">Road Closure</option>
              <option value="power-outage">Power Outage</option>
              <option value="earthquake">Earthquake</option>
              <option value="other">Other</option>
            </select>
            <input placeholder="Location" value={newReport.location} onChange={e => setNewReport({...newReport, location: e.target.value})} />
            <textarea placeholder="Description" value={newReport.description} onChange={e => setNewReport({...newReport, description: e.target.value})} rows="4" />
            <div className="modal-actions">
              <button className="btn-submit" onClick={submitReport}>Submit Report</button>
              <button className="btn-cancel" onClick={() => setShowReportModal(false)}>Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
