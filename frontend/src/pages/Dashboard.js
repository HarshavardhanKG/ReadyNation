import { useEffect, useState } from "react";
import "./Dashboard.css";

export default function Dashboard(){

  const [user, setUser] = useState({});
  
  // States for disaster prediction
  const [prediction, setPrediction] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(true);
  const [predictionError, setPredictionError] = useState('');
  
  // States for weather history
  const [weatherHistory, setWeatherHistory] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState('');
  
  // States for learning modules
  const [modules, setModules] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  
  // Theme
  const [dark, setDark] = useState(false);

  const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Load user from localStorage
  useEffect(()=>{
    const u = JSON.parse(localStorage.getItem("user"));
    if(u) setUser(u);
  }, []);

  // Fetch disaster prediction
  useEffect(() => {
    if(!user || !user.location) return;
    let mounted = true;
    async function fetchPrediction(){
      setPredictionLoading(true);
      setPredictionError('');
      try{
        const loc = encodeURIComponent(user.location);
        const res = await fetch(`${apiBase}/disaster-prediction?location=${loc}`, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'User-Agent': 'DisasterPreparednessApp'
          }
        });
        if(!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        if(mounted) setPrediction(data);
      }catch(err){
        console.error('Error fetching prediction:', err);
        if(mounted) setPredictionError(err.message || 'Failed to fetch prediction');
      }
      if(mounted) setPredictionLoading(false);
    }
    fetchPrediction();
    return ()=>{ mounted = false; };
  }, [user, apiBase]);

  // Fetch weather history
  useEffect(() => {
    if(!user || !user.location) return;
    let mounted = true;
    async function fetchWeather(){
      setWeatherLoading(true);
      setWeatherError('');
      try{
        const loc = encodeURIComponent(user.location);
        const res = await fetch(`${apiBase}/weather-history?location=${loc}&days=3`, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'User-Agent': 'DisasterPreparednessApp'
          }
        });
        if(!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        if(mounted) setWeatherHistory(Array.isArray(data) ? data : []);
      }catch(err){
        console.error('Error fetching weather history:', err);
        if(mounted) setWeatherError(err.message || 'Failed to fetch weather');
      }
      if(mounted) setWeatherLoading(false);
    }
    fetchWeather();
    return ()=>{ mounted = false; };
  }, [user, apiBase]);

  // Fetch learning modules
  useEffect(() => {
    const mockModules = [
      { id: 'm1', type: 'video', title: 'Flood Safety', icon: '🌊', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Learn how to stay safe during floods' },
      { id: 'm2', type: 'video', title: 'Earthquake Preparedness', icon: '🏚', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Earthquake safety and drill techniques' },
      { id: 'm3', type: 'video', title: 'Cyclone Safety', icon: '🌀', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'How to prepare for a cyclone' },
      { id: 'm4', type: 'quiz', title: 'Fire Safety Quiz', icon: '🔥', description: 'Test your fire safety knowledge' }
    ];
    setModules(mockModules);
    setActiveModule(mockModules[0]);
  }, []);

  return(
    <div className={dark ? "dark layout-root" : "layout-root"} style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh'}}>
      {/* TOP NAV */}
      <nav className="topbar" style={{background: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)', color: 'white'}}>
        <h3>🚨 Disaster Preparedness AI</h3>
        <div>
          <strong>{user.name || "Guest"}</strong> | {user.location || "---"}
          <button onClick={()=>setDark(!dark)} style={{marginLeft: '10px', background: 'rgba(255,255,255,0.3)', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>🌙</button>
        </div>
      </nav>

      <div className="layout">
        {/* SIDEBAR */}
        <aside className="sidebar" style={{background: 'linear-gradient(180deg, #4facfe 0%, #00f2fe 100%)'}}>
          <h4 style={{color: 'white'}}>📚 Learn Disaster Safety</h4>
          {modules.map(m=>(
            <div 
              key={m.id} 
              onClick={()=>setActiveModule(m)}
              style={{
                padding: '10px',
                margin: '5px 0',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: activeModule?.id === m.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                fontWeight: activeModule?.id === m.id ? 'bold' : 'normal'
              }}
            >
              {m.icon} {m.title}
            </div>
          ))}
        </aside>

        {/* MAIN CONTENT */}
        <main className="content">
          {/* DISASTER RISK ALERT */}
          <div className="box" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)'}}>
            <h4>🚨 AI Disaster Risk Assessment</h4>
            {predictionLoading ? (
              <p>Loading...</p>
            ) : predictionError ? (
              <p style={{color: '#ffeb3b'}}>{predictionError}</p>
            ) : prediction ? (
              <div>
                <h2 style={{margin: '10px 0', fontSize: '2.5em'}}>
                  {prediction.emoji} {prediction.risk}
                </h2>
                <p><strong>AI Confidence:</strong> {(prediction.confidence * 100).toFixed(0)}%</p>
                <p style={{padding: '15px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px', backdropFilter: 'blur(10px)'}}>
                  {prediction.recommendation}
                </p>
              </div>
            ) : null}
          </div>

          {/* HORIZONTAL SECTION: WEATHER + LEARNING MODULE */}
          <div style={{display: 'flex', gap: '30px'}}>
            {/* WEATHER HISTORY */}
            <div className="box" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', flex: 1}}>
              <h4>🌡 Weather Trend (Past 3 Days)</h4>
              {weatherLoading ? (
                <p>Loading...</p>
              ) : weatherError ? (
                <p style={{color: '#ffeb3b'}}>{weatherError}</p>
              ) : weatherHistory && weatherHistory.length > 0 ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                  {weatherHistory.map((w, idx) => (
                    <div key={idx} style={{padding: '15px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px', backdropFilter: 'blur(10px)'}}>
                      <p><strong>{w.date}</strong></p>
                      <p style={{fontSize: '1.2em'}}>🌡 {w.temp}°C</p>
                      <p>💧 {w.humidity}%</p>
                      <p>💨 {w.wind_speed} m/s</p>
                      <p style={{fontStyle: 'italic'}}>{w.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No weather data available</p>
              )}
            </div>

            {/* LEARNING MODULE */}
            <div className="box" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', flex: 1}}>
              <h4>📖 {activeModule?.title}</h4>
              {activeModule ? (
                <div>
                  <p>{activeModule.description}</p>
                  {activeModule.type === 'video' && activeModule.url && (
                    <iframe
                      src={activeModule.url}
                      width="100%"
                      height="300"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={activeModule.title}
                      style={{marginTop: '10px', borderRadius: '10px'}}
                    ></iframe>
                  )}
                  {activeModule.type === 'quiz' && (
                    <div style={{marginTop: '10px', padding: '15px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px', backdropFilter: 'blur(10px)'}}>
                      <p>Quiz: Coming Soon! Test your knowledge about {activeModule.title}</p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
