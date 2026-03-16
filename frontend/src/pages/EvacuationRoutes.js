import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./EvacuationRoutes.css";

export default function EvacuationRoutes() {
  const [user, setUser] = useState({});
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [hazards, setHazards] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (u) setUser(u);
    
    // Mock shelters data
    setShelters([
      { id: 1, name: "City Community Center", distance: "2.3 km", capacity: "500/800", amenities: ["Medical", "Food", "Water"] },
      { id: 2, name: "Central High School", distance: "3.7 km", capacity: "300/600", amenities: ["Food", "Water", "Power"] },
      { id: 3, name: "Sports Complex Arena", distance: "5.1 km", capacity: "150/1000", amenities: ["Medical", "Food", "Water", "Power"] }
    ]);

    // Mock hazards
    setHazards([
      { type: "Flood Zone", location: "Downtown Area", severity: "HIGH" },
      { type: "Road Closure", location: "Highway 101", severity: "CRITICAL" },
      { type: "Fire Perimeter", location: "Forest Hills", severity: "MEDIUM" }
    ]);
  }, []);

  const calculateRoutes = () => {
    if (!destination) return;
    
    // Mock AI-optimized routes
    const mockRoutes = [
      {
        id: 1,
        name: "Safest Route",
        distance: "8.5 km",
        eta: "15 min",
        riskScore: 2.1,
        hazardsAvoided: ["Flood Zone", "Road Closure"],
        description: "Avoids all major hazards, slightly longer but safest option"
      },
      {
        id: 2,
        name: "Fastest Route",
        distance: "6.2 km",
        eta: "10 min",
        riskScore: 5.8,
        hazardsAvoided: ["Fire Perimeter"],
        description: "Quickest path but passes near flood zone"
      },
      {
        id: 3,
        name: "Balanced Route",
        distance: "7.1 km",
        eta: "12 min",
        riskScore: 3.5,
        hazardsAvoided: ["Road Closure"],
        description: "Good balance between safety and speed"
      }
    ];
    
    setRoutes(mockRoutes);
    setSelectedRoute(mockRoutes[0]);
  };

  const getRiskColor = (score) => {
    if (score < 3) return "#4ade80";
    if (score < 6) return "#fbbf24";
    return "#ef4444";
  };

  return (
    <div className="evacuation-routes-page">
      <header className="page-header">
        <h1>🗺️ Evacuation Routes & Safe Zones</h1>
      </header>

      <div className="route-planner">
        <div className="planner-card">
          <h2>Plan Your Evacuation Route</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter destination or select shelter"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <button className="btn-calculate" onClick={calculateRoutes}>
              🧭 Calculate Routes
            </button>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="left-panel">
          <div className="hazards-section">
            <h3>⚠️ Active Hazards</h3>
            {hazards.map((hazard, i) => (
              <motion.div
                key={i}
                className={`hazard-card severity-${hazard.severity.toLowerCase()}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="hazard-type">{hazard.type}</div>
                <div className="hazard-location">{hazard.location}</div>
                <span className="severity-badge">{hazard.severity}</span>
              </motion.div>
            ))}
          </div>

          <div className="shelters-section">
            <h3>🏠 Nearest Shelters</h3>
            {shelters.map((shelter, i) => (
              <motion.div
                key={shelter.id}
                className="shelter-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setDestination(shelter.name)}
              >
                <div className="shelter-header">
                  <h4>{shelter.name}</h4>
                  <span className="distance-badge">{shelter.distance}</span>
                </div>
                <div className="shelter-capacity">Capacity: {shelter.capacity}</div>
                <div className="shelter-amenities">
                  {shelter.amenities.map((a, idx) => (
                    <span key={idx} className="amenity-tag">{a}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="right-panel">
          <div className="map-container">
            <div className="map-placeholder">
              <p>🗺️ Interactive Map</p>
              <p className="map-info">Showing: {user.location || "Your Location"}</p>
              {selectedRoute && (
                <div className="route-overlay">
                  <h4>{selectedRoute.name}</h4>
                  <p>Distance: {selectedRoute.distance} | ETA: {selectedRoute.eta}</p>
                </div>
              )}
            </div>
          </div>

          {routes.length > 0 && (
            <div className="routes-list">
              <h3>Available Routes</h3>
              {routes.map((route, i) => (
                <motion.div
                  key={route.id}
                  className={`route-card ${selectedRoute?.id === route.id ? 'selected' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedRoute(route)}
                >
                  <div className="route-header">
                    <h4>{route.name}</h4>
                    <div className="route-risk" style={{ background: getRiskColor(route.riskScore) }}>
                      Risk: {route.riskScore}/10
                    </div>
                  </div>
                  <div className="route-stats">
                    <span>📏 {route.distance}</span>
                    <span>⏱️ {route.eta}</span>
                  </div>
                  <p className="route-description">{route.description}</p>
                  <div className="hazards-avoided">
                    <strong>Avoids:</strong> {route.hazardsAvoided.join(", ")}
                  </div>
                  <button className="btn-start-navigation">Start Navigation →</button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
