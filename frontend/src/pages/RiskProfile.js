import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import "./RiskProfile.css";

export default function RiskProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [disasterHistory, setDisasterHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ total: 0, deaths: 0, affected: 0, types: {} });

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (u) setUser(u);
  }, []);

  useEffect(() => {
    if (!user?.location) return;
    
    async function fetchDisasterHistory() {
      setLoading(true);
      setError("");
      try {
        const location = user.fullLocation ? user.fullLocation.split(",")[1].trim() : user.location;
        const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiBase}/get_location_data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            'User-Agent': 'DisasterPreparednessApp'
          },
          body: JSON.stringify({ location })
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to fetch data');
        }
        const data = await res.json();
        const disasters = Array.isArray(data) ? data : [];
        
        // Calculate statistics
        const totalDeaths = disasters.reduce((sum, d) => sum + (d["Total Deaths"] || 0), 0);
        const totalAffected = disasters.reduce((sum, d) => sum + (d["No Affected"] || 0), 0);
        const disasterTypes = {};
        disasters.forEach(d => {
          const type = d["Disaster Type"] || "Unknown";
          disasterTypes[type] = (disasterTypes[type] || 0) + 1;
        });
        
        setStats({
          total: disasters.length,
          deaths: totalDeaths,
          affected: totalAffected,
          types: disasterTypes
        });
        
        // Sort by year descending
        disasters.sort((a, b) => (b["Start Year"] || 0) - (a["Start Year"] || 0));
        setDisasterHistory(disasters);
      } catch (err) {
        setError(err.message || "Unable to load disaster history");
      }
      setLoading(false);
    }

    fetchDisasterHistory();
  }, [user]);

  const getDisasterIcon = (type) => {
    const icons = {
      "Flood": "🌊",
      "Earthquake": "🏚️",
      "Cyclone": "🌀",
      "Drought": "☀️",
      "Landslide": "⛰️",
      "Fire": "🔥",
      "Storm": "⛈️"
    };
    return icons[type] || "🌪️";
  };

  return (
    <>
      <Navbar />
      <div className="risk-profile-page">
        <BackButton />

      <main className="risk-profile-content">
        <div className="profile-header">
          <h2>📊 Disaster Risk Profile</h2>
          <p>Historical Analysis: {user.fullLocation || user.location || "Unknown"}</p>
          <p className="time-range">Past 5 Decades (1970-2020)</p>
        </div>

        {loading ? (
          <div className="loading-card">Loading disaster history...</div>
        ) : error ? (
          <div className="error-card">{error}</div>
        ) : disasterHistory.length === 0 ? (
          <div className="no-data-card">No disaster history found for this location</div>
        ) : (
          <>
            <div className="stats-overview">
              <div className="stat-card">
                <h3>{stats.total}</h3>
                <p>Total Disasters</p>
              </div>
              <div className="stat-card">
                <h3>{stats.deaths.toLocaleString()}</h3>
                <p>Total Deaths</p>
              </div>
              <div className="stat-card">
                <h3>{stats.affected.toLocaleString()}</h3>
                <p>People Affected</p>
              </div>
              <div className="stat-card">
                <h3>{Object.keys(stats.types).length}</h3>
                <p>Disaster Types</p>
              </div>
            </div>

            <div className="disaster-types-summary">
              <h3>Disaster Breakdown</h3>
              <div className="types-grid">
                {Object.entries(stats.types).map(([type, count]) => (
                  <div key={type} className="type-badge">
                    <span className="type-icon">{getDisasterIcon(type)}</span>
                    <span className="type-name">{type}</span>
                    <span className="type-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="timeline-section">
              <h3>Detailed Timeline</h3>
              <div className="history-grid">
            {disasterHistory.map((disaster, idx) => (
              <div key={idx} className="disaster-card">
                <div className="disaster-header">
                  <span className="disaster-icon">{getDisasterIcon(disaster["Disaster Type"])}</span>
                  <div>
                    <h3>{disaster["Disaster Type"] || "Unknown"}</h3>
                    <span className="disaster-subtype">{disaster["Disaster Subtype"] || ""}</span>
                  </div>
                  <span className="disaster-year">{disaster["Start Year"]}</span>
                </div>
                <div className="disaster-details">
                  <div className="detail-row">
                    <span className="detail-label">💀 Deaths:</span>
                    <span className="detail-value">{(disaster["Total Deaths"] || 0).toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🏥 Injured:</span>
                    <span className="detail-value">{(disaster["No Injured"] || 0).toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🏠 Affected:</span>
                    <span className="detail-value">{(disaster["No Affected"] || 0).toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🏚️ Homeless:</span>
                    <span className="detail-value">{(disaster["No Homeless"] || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
              </div>
            </div>
          </>
        )}
      </main>
      </div>
    </>
  );
}
