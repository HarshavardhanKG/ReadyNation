import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import "./StudentDashboard.css";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterRole, setFilterRole] = useState("all");

  const loadUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/users");
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const modules = [
    { key: "floodSafety", title: "Flood Safety" },
    { key: "earthquake", title: "Earthquake" },
    { key: "cyclone", title: "Cyclone" },
    { key: "fire", title: "Fire Safety" },
    { key: "tsunami", title: "Tsunami" },
    { key: "landslide", title: "Landslide" },
    { key: "drought", title: "Drought" },
    { key: "heatwave", title: "Heatwave" },
    { key: "lightning", title: "Lightning" },
    { key: "firstaid", title: "First Aid" },
    { key: "pandemic", title: "Pandemic" },
    { key: "chemical", title: "Chemical Spill" },
    { key: "nuclear", title: "Nuclear" },
    { key: "collapse", title: "Building Collapse" },
    { key: "comm", title: "Emergency Comm" },
    { key: "survival", title: "Survival" },
    { key: "pet", title: "Pet Safety" },
    { key: "tech", title: "Emergency Tech" },
    { key: "psych", title: "Psych First Aid" }
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUser(user);

    // Check if user is admin or teacher
    if (user.email !== "admin@gmail.com" && user.role !== "Teacher") {
      alert("Access denied. This page is only for Admin and Teachers.");
      navigate("/home");
      return;
    }

    // Load all registered users from localStorage
    loadUsers();
  }, [navigate]);

  const refreshData = async () => {
    await loadUsers();
    if (selectedUser) {
      const response = await fetch("http://localhost:5000/users");
      const data = await response.json();
      const updatedUser = data.users.find(u => u.email === selectedUser.email);
      if (updatedUser) {
        setSelectedUser(updatedUser);
      }
    }
  };

  const getUserProgress = (userEmail) => {
    const progressData = {};
    modules.forEach(module => {
      const progress = JSON.parse(localStorage.getItem(`${userEmail}_${module.key}Progress`) || "{}");
      const completed = progress.completedCheckpoints?.length === 8;
      const percentage = progress.completedCheckpoints ? 
        ((progress.completedCheckpoints.length / 8) * 100).toFixed(0) : 0;
      progressData[module.key] = { completed, percentage, score: progress.score || 0 };
    });
    return progressData;
  };

  const filteredUsers = users.filter(user => {
    if (user.email === "admin@gmail.com") return false;
    if (currentUser.role === "Teacher" && user.role !== "Student") return false;
    if (filterRole === "all") return true;
    return user.role === filterRole;
  });

  const getCompletionStats = (userEmail) => {
    const progress = getUserProgress(userEmail);
    const completed = Object.values(progress).filter(p => p.completed).length;
    return { completed, total: 19, percentage: ((completed / 19) * 100).toFixed(0) };
  };

  const deleteUser = async (userEmail, e) => {
    e.stopPropagation();
    if (userEmail === "admin@gmail.com") {
      alert("Cannot delete admin account!");
      return;
    }
    if (window.confirm(`Delete user ${userEmail}? This will remove their account and all progress.`)) {
      try {
        const response = await fetch(`http://localhost:5000/users/${userEmail}`, {
          method: "DELETE"
        });
        const data = await response.json();
        
        if (data.success) {
          // Delete user's progress for all modules
          modules.forEach(module => {
            localStorage.removeItem(`${userEmail}_${module.key}Progress`);
          });
          
          loadUsers();
          if (selectedUser?.email === userEmail) {
            setSelectedUser(null);
          }
        } else {
          alert(data.message);
        }
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  const generateCertificate = (user, moduleName) => {
    alert(`Certificate generation is enabled\n\nIssued by: ${currentUser.name}\nRole: ${currentUser.role || "Admin"}`);
  };

  return (
    <>
      <Navbar />
      <div className="student-dashboard-page">
        <BackButton />
        <header className="page-header">
          <h1>📊 {currentUser.email === "admin@gmail.com" ? "Admin" : "Teacher"} Dashboard</h1>
          <p>View registered users and their learning progress</p>
        </header>

        <div className="dashboard-filters">
          <label>Filter by Role:</label>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">All Users</option>
            <option value="Student">Students Only</option>
            {currentUser.email === "admin@gmail.com" && <option value="Teacher">Teachers Only</option>}
          </select>
          <span className="user-count">{filteredUsers.length} users found</span>
          <button className="btn-refresh" onClick={refreshData} title="Refresh Data">
            🔄 Refresh
          </button>
        </div>

        <div className="users-grid">
          {filteredUsers.map((user, index) => {
            const stats = getCompletionStats(user.email);
            return (
              <div key={index} className="user-card" onClick={() => setSelectedUser(user)}>
                <div className="user-header">
                  <div className="user-avatar">{user.name?.charAt(0) || "U"}</div>
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <span className="user-role">{user.role || "Student"}</span>
                  </div>
                </div>
                <div className="user-details">
                  <p>📧 {user.email}</p>
                  <p>📍 {user.location}</p>
                </div>
                <div className="user-progress">
                  <div className="progress-label">
                    <span>Modules Completed</span>
                    <span className="progress-value">{stats.completed}/{stats.total}</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${stats.percentage}%` }}></div>
                  </div>
                  <div className="progress-percentage">{stats.percentage}%</div>
                </div>
                <button className="btn-view-details">View Details →</button>
                {currentUser.email === "admin@gmail.com" && user.email !== "admin@gmail.com" && (
                  <button className="btn-delete-user" onClick={(e) => deleteUser(user.email, e)} title="Delete User">
                    🗑️ Delete
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {filteredUsers.length === 0 && (
          <div className="empty-state">
            <p>No users found</p>
          </div>
        )}

        {selectedUser && (
          <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedUser(null)}>✕</button>
              <h2>{selectedUser.name}'s Progress</h2>
              <div className="modal-user-info">
                <p>📧 {selectedUser.email}</p>
                <p>👤 {selectedUser.role || "Student"}</p>
                <p>📍 {selectedUser.location}</p>
              </div>
              <div className="modules-progress">
                {modules.map(module => {
                  const progress = getUserProgress(selectedUser.email)[module.key];
                  return (
                    <div key={module.key} className={`module-progress-item ${progress.completed ? 'completed' : ''}`}>
                      <div className="module-name">
                        {progress.completed ? '✅' : '⏳'} {module.title}
                      </div>
                      <div className="module-stats">
                        <span>{progress.percentage}%</span>
                        <span>{progress.score?.toFixed(0) || 0} pts</span>
                      </div>
                      {progress.completed && (
                        <button 
                          className="btn-generate-cert"
                          onClick={(e) => {
                            e.stopPropagation();
                            generateCertificate(selectedUser, module.title);
                          }}
                        >
                          📜 Certificate
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
