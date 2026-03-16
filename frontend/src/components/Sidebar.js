import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Sidebar.css";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [modules] = useState([
    { id: "1", title: "Flood Safety", type: "video", icon: "🌊", color: "#3b82f6", route: "/learning/flood-safety" },
    { id: "2", title: "Earthquake Preparedness", type: "video", icon: "🏚️", color: "#f59e0b", route: "/learning/earthquake" },
    { id: "3", title: "Cyclone Awareness", type: "video", icon: "🌀", color: "#8b5cf6", route: "/learning/cyclone" },
    { id: "4", title: "Fire Safety Quiz", type: "quiz", icon: "🔥", color: "#ef4444", route: "/learning/fire-quiz" },
    { id: "5", title: "Tsunami Awareness", type: "video", icon: "🌊", color: "#0ea5e9", route: "/learning/tsunami" },
    { id: "6", title: "Landslide Safety", type: "video", icon: "⛰️", color: "#78350f", route: "/learning/landslide" },
    { id: "7", title: "Drought Preparedness", type: "video", icon: "☀️", color: "#fbbf24", route: "/learning/drought" },
    { id: "8", title: "Heatwave Safety", type: "video", icon: "🌡️", color: "#dc2626", route: "/learning/heatwave" },
    { id: "9", title: "Lightning Safety", type: "video", icon: "⚡", color: "#eab308", route: "/learning/lightning" },
    { id: "10", title: "First Aid Basics", type: "video", icon: "🩹", color: "#ec4899", route: "/learning/first-aid" },
    { id: "11", title: "Pandemic Preparedness", type: "video", icon: "😷", color: "#06b6d4", route: "/learning/pandemic" },
    { id: "12", title: "Chemical Spill Response", type: "video", icon: "☣️", color: "#84cc16", route: "/learning/chemical-spill" },
    { id: "13", title: "Nuclear Emergency", type: "video", icon: "☢️", color: "#a855f7", route: "/learning/nuclear" },
    { id: "14", title: "Building Collapse", type: "video", icon: "🏢", color: "#64748b", route: "/learning/building-collapse" },
    { id: "15", title: "Emergency Communication", type: "video", icon: "📡", color: "#14b8a6", route: "/learning/emergency-comm" },
    { id: "16", title: "Survival Skills", type: "video", icon: "🏕️", color: "#22c55e", route: "/learning/survival" },
    { id: "17", title: "Pet Safety", type: "video", icon: "🐕", color: "#f97316", route: "/learning/pet-safety" },
    { id: "18", title: "Emergency Apps & Tech", type: "video", icon: "📱", color: "#3b82f6", route: "/learning/emergency-tech" },
    { id: "19", title: "Psychological First Aid", type: "video", icon: "🧠", color: "#8b5cf6", route: "/learning/psych-aid" }
  ]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(u);
  }, []);

  return (
    <aside className={isOpen ? "sidebar sidebar-open" : "sidebar"}>
      <div className="sidebar-header">
        <h3 className="sidebar-title">🧭 Quick Access</h3>
      </div>
      <motion.div className="module-item" onClick={() => navigate('/emergency-contacts')} whileHover={{ scale: 1.02, x: 4 }}>
        <span className="module-icon">🚨</span>
        <span className="module-title">Emergency Contacts</span>
      </motion.div>
      <motion.div className="module-item" onClick={() => navigate('/checklist')} whileHover={{ scale: 1.02, x: 4 }}>
        <span className="module-icon">📋</span>
        <span className="module-title">Disaster Checklist</span>
      </motion.div>
      <motion.div className="module-item" onClick={() => navigate('/alerts')} whileHover={{ scale: 1.02, x: 4 }}>
        <span className="module-icon">🔔</span>
        <span className="module-title">Alerts Center</span>
      </motion.div>
      <motion.div className="module-item" onClick={() => navigate('/risk-profile')} whileHover={{ scale: 1.02, x: 4 }}>
        <span className="module-icon">📊</span>
        <span className="module-title">Risk Profile</span>
      </motion.div>
      <motion.div className="module-item" onClick={() => navigate('/volunteer')} whileHover={{ scale: 1.02, x: 4 }}>
        <span className="module-icon">🤝</span>
        <span className="module-title">Volunteer</span>
      </motion.div>
      {(user.email === "admin@gmail.com" || user.role === "Teacher") && (
        <motion.div className="module-item" onClick={() => navigate('/student-dashboard')} whileHover={{ scale: 1.02, x: 4 }}>
          <span className="module-icon">📊</span>
          <span className="module-title">Student Dashboard</span>
        </motion.div>
      )}
      
      <div className="sidebar-divider"></div>
      
      <div className="sidebar-header">
        <h3 className="sidebar-title">📚 Learning Center</h3>
      </div>
      {modules.map(m => (
        <motion.div key={m.id} className="module-item" onClick={() => navigate(m.route)} whileHover={{ scale: 1.02, x: 4 }}>
          <span className="module-icon">{m.icon}</span>
          <span className="module-title">{m.title}</span>
        </motion.div>
      ))}
    </aside>
  );
}
