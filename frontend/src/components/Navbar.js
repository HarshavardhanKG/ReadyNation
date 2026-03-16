import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const checkCompletedModules = (email) => {
    const modules = [
      { key: "floodSafety", route: "/learning/flood-safety" },
      { key: "earthquake", route: "/learning/earthquake" },
      { key: "cyclone", route: "/learning/cyclone" },
      { key: "fire", route: "/learning/fire-quiz" },
      { key: "tsunami", route: "/learning/tsunami" },
      { key: "landslide", route: "/learning/landslide" },
      { key: "drought", route: "/learning/drought" },
      { key: "heatwave", route: "/learning/heatwave" },
      { key: "lightning", route: "/learning/lightning" },
      { key: "firstaid", route: "/learning/first-aid" },
      { key: "pandemic", route: "/learning/pandemic" },
      { key: "chemical", route: "/learning/chemical-spill" },
      { key: "nuclear", route: "/learning/nuclear" },
      { key: "collapse", route: "/learning/building-collapse" },
      { key: "comm", route: "/learning/emergency-comm" },
      { key: "survival", route: "/learning/survival" },
      { key: "pet", route: "/learning/pet-safety" },
      { key: "tech", route: "/learning/emergency-tech" },
      { key: "psych", route: "/learning/psych-aid" }
    ];
    
    const completed = [];
    modules.forEach(module => {
      const progress = JSON.parse(localStorage.getItem(`${email}_${module.key}Progress`) || "{}");
      if (progress.completedCheckpoints?.length === 8) {
        completed.push({ module: module.key, route: module.route, time: "Recently" });
      }
    });
    
    setNotifications(completed);
    setUnreadCount(completed.length);
  };

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (u) {
      setUser(u);
      checkCompletedModules(u.email);
      const hasViewed = localStorage.getItem(`${u.email}_notificationsViewed`);
      if (hasViewed) {
        setUnreadCount(0);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileOpen && !event.target.closest('.profile-wrapper')) {
        setProfileOpen(false);
      }
      if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.menu-toggle')) {
        setSidebarOpen(false);
      }
      if (notificationOpen && !event.target.closest('.notification-wrapper')) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen, sidebarOpen, notificationOpen]);

  return (
    <>
      <header className="navbar">
        <div className="navbar-left">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <div className="logo">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 4C10.268 4 4 10.268 4 18C4 25.732 10.268 32 18 32C25.732 32 32 25.732 32 18C32 10.268 25.732 4 18 4Z" fill="#6366f1"/>
              <path d="M18 10C13.582 10 10 13.582 10 18C10 22.418 13.582 26 18 26C22.418 26 26 22.418 26 18C26 13.582 22.418 10 18 10Z" fill="white"/>
              <circle cx="18" cy="18" r="4" fill="#6366f1"/>
              <path d="M18 2L19 8L18 14" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
              <path d="M34 18L28 19L22 18" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
              <path d="M18 34L17 28L18 22" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
              <path d="M2 18L8 17L14 18" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="navbar-title" onClick={() => navigate('/home')} style={{cursor: 'pointer'}}>ReadyNation</h1>
        </div>
        <div className="navbar-right">
          {user.role !== "Admin" && user.role !== "Teacher" && (
            <div className="notification-wrapper">
              <button className="notification-btn" onClick={() => { 
                setNotificationOpen(!notificationOpen); 
                if (!notificationOpen) {
                  setUnreadCount(0);
                  localStorage.setItem(`${user.email}_notificationsViewed`, 'true');
                }
              }}>
                🔔
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>
              {notificationOpen && (
                <div className="notification-dropdown">
                  <div className="notification-header">Notifications</div>
                  {notifications.length > 0 ? (
                    <div className="notification-list">
                      {notifications.map((notif, idx) => (
                        <div key={idx} className="notification-item" onClick={() => { navigate(notif.route); setNotificationOpen(false); }} style={{cursor: 'pointer'}}>
                          <span className="notification-icon">📜</span>
                          <div className="notification-content">
                            <div className="notification-title">Certificate Ready</div>
                            <div className="notification-text">Your {notif.module} certificate is ready to download</div>
                            <div className="notification-time">{notif.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="notification-empty">No new notifications</div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="profile-wrapper">
            <button className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
              <span className="profile-icon">👤</span>
              <span>{user.name || "Guest"}</span>
            </button>
            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <div className="profile-avatar">👤</div>
                  <div className="profile-info">
                    <div className="profile-name">{user.name || "Guest"}</div>
                    <div className="profile-role">{user.role || "User"}</div>
                  </div>
                </div>
                <div className="profile-divider"></div>
                <div className="profile-details">
                  <div className="profile-item">
                    <span className="profile-label">📧 Email:</span>
                    <span className="profile-value profile-email">{user.email || "N/A"}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">📍 Location:</span>
                    <span className="profile-value profile-location">{user.fullLocation || user.location || "N/A"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={() => { localStorage.removeItem("user"); navigate("/login"); }}>
            Logout
          </button>
        </div>
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
