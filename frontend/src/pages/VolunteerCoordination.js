import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import "./VolunteerCoordination.css";

export default function VolunteerCoordination() {
  const [opportunities, setOpportunities] = useState([]);
  const [myShifts, setMyShifts] = useState([]);
  const [skills, setSkills] = useState(["First Aid", "Driving"]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [riskLevel, setRiskLevel] = useState("MEDIUM");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (u) setUser(u);
  }, []);

  useEffect(() => {
    if (!user?.location) return;

    async function fetchOpportunities() {
      setLoading(true);
      try {
        // Fetch current risk level
        const riskRes = await fetch(`http://localhost:5000/disaster-prediction?location=${encodeURIComponent(user.location)}`);
        const riskData = await riskRes.json();
        const currentRisk = riskData.risk || "MEDIUM";
        setRiskLevel(currentRisk);

        // Fetch opportunities based on location and risk
        const location = user.fullLocation ? user.fullLocation.split(",")[0].trim() : user.location;
        const oppRes = await fetch(`http://localhost:5000/volunteer-opportunities?location=${encodeURIComponent(location)}&risk_level=${currentRisk}`);
        const oppData = await oppRes.json();
        
        setOpportunities(oppData.opportunities || []);
      } catch (err) {
        console.error("Error fetching opportunities:", err);
      }
      setLoading(false);
    }

    fetchOpportunities();

    const savedShifts = JSON.parse(localStorage.getItem("volunteerShifts") || "[]");
    setMyShifts(savedShifts);
  }, [user]);

  const signUp = (opportunity) => {
    const updated = [...myShifts, opportunity];
    setMyShifts(updated);
    localStorage.setItem("volunteerShifts", JSON.stringify(updated));
    alert(`Signed up for: ${opportunity.title}`);
  };

  const getRiskColor = (risk) => {
    const colors = { CRITICAL: "#ef4444", HIGH: "#f59e0b", MEDIUM: "#3b82f6", LOW: "#22c55e" };
    return colors[risk] || "#6b7280";
  };

  const getUrgencyColor = (urgency) => {
    const colors = { critical: "#ef4444", high: "#f59e0b", medium: "#3b82f6", low: "#22c55e" };
    return colors[urgency] || "#6b7280";
  };

  return (
    <>
      <Navbar />
      <div className="volunteer-page">
        <BackButton />
        <header className="page-header">
          <h1>🤝 Volunteer Coordination</h1>
          <p style={{color: "#94a3b8", textAlign: "center", marginTop: "0.5rem"}}>
            Current Risk Level: <span style={{color: getRiskColor(riskLevel), fontWeight: "700"}}>{riskLevel}</span>
          </p>
        </header>

      {loading ? (
        <div style={{textAlign: "center", padding: "3rem", color: "#94a3b8"}}>Loading opportunities...</div>
      ) : (
        <>
      <div className="volunteer-stats">
        <div className="stat-card">
          <h3>24</h3>
          <p>Hours Volunteered</p>
        </div>
        <div className="stat-card">
          <h3>{myShifts.length}</h3>
          <p>Upcoming Shifts</p>
        </div>
        <div className="stat-card">
          <h3>{skills.length}</h3>
          <p>Verified Skills</p>
        </div>
      </div>

      <div className="content-layout">
        <div className="opportunities-section">
          <h2>Available Opportunities</h2>
          {opportunities.map((opp, i) => (
            <motion.div
              key={opp.id}
              className="opportunity-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="opp-header">
                <h3>{opp.title}</h3>
                <span className="urgency-badge" style={{ background: getUrgencyColor(opp.urgency) }}>
                  {opp.urgency.toUpperCase()}
                </span>
              </div>
              <div className="opp-details">
                <p>🏢 {opp.organization}</p>
                <p>📍 {opp.location}</p>
                <p>📅 {opp.date}</p>
                <p>🕒 {opp.time}</p>
                <p>👥 Slots: {opp.slots} ({opp.slots_available} available)</p>
                <p>📞 {opp.contact}</p>
              </div>
              <div className="opp-skills">
                <strong>Required Skills:</strong> {opp.skills.join(", ")}
              </div>
              <p style={{fontSize: "0.9rem", color: "#94a3b8", marginTop: "0.5rem"}}>{opp.description}</p>
              <button className="btn-signup" onClick={() => signUp(opp)}>
                Sign Up
              </button>
            </motion.div>
          ))}
        </div>

        <div className="my-shifts-section">
          <h2>My Upcoming Shifts</h2>
          {myShifts.length === 0 ? (
            <p className="empty-message">No shifts scheduled yet</p>
          ) : (
            myShifts.map((shift, i) => (
              <div key={i} className="shift-card">
                <h4>{shift.title}</h4>
                <p>{shift.date} at {shift.time}</p>
                <p>📍 {shift.location}</p>
                <p>🏢 {shift.organization}</p>
              </div>
            ))
          )}
        </div>
      </div>
        </>
      )}
      </div>
    </>
  );
}
