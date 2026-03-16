import { useEffect, useState } from "react";
import { safeFetch } from "../utils/api";

export default function DisasterWarningMap({ location, apiBase }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!location) return;
    let mounted = true;

    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const [prediction, weather] = await Promise.all([
          safeFetch(`/disaster-prediction?location=${encodeURIComponent(location)}`),
          safeFetch(`/weather?location=${encodeURIComponent(location)}`)
        ]);

        if (mounted) {
          setData({ prediction, weather });
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load data');
      }
      if (mounted) setLoading(false);
    }

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [location, apiBase]);

  if (loading) return <div style={styles.loading}>Loading map data...</div>;
  if (error) return <div style={styles.error}>⚠️ {error}</div>;
  if (!data) return null;

  const { prediction, weather } = data;
  const riskColor = prediction?.color || '#ccc';
  const riskLevel = prediction?.risk || 'UNKNOWN';

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h4 style={styles.title}>🗺️ Disaster Early Warning Map</h4>
        <span style={styles.location}>📍 {location}</span>
      </div>

      <div style={{ ...styles.mapView, borderColor: riskColor }}>
        {/* Risk Status Badge */}
        <div style={{ ...styles.badge, backgroundColor: riskColor }}>
          <span style={styles.badgeText}>{prediction?.emoji} {riskLevel}</span>
          <span style={styles.confidence}>{(prediction?.confidence * 100).toFixed(0)}%</span>
        </div>

        {/* Weather Grid */}
        <div style={styles.weatherGrid}>
          <div style={styles.weatherCard}>
            <div style={styles.weatherIcon}>🌡️</div>
            <div style={styles.weatherValue}>{weather?.main?.temp?.toFixed(1) || '--'}°C</div>
            <div style={styles.weatherLabel}>Temperature</div>
          </div>
          <div style={styles.weatherCard}>
            <div style={styles.weatherIcon}>💧</div>
            <div style={styles.weatherValue}>{weather?.main?.humidity || '--'}%</div>
            <div style={styles.weatherLabel}>Humidity</div>
          </div>
          <div style={styles.weatherCard}>
            <div style={styles.weatherIcon}>💨</div>
            <div style={styles.weatherValue}>{weather?.wind?.speed?.toFixed(1) || '--'} m/s</div>
            <div style={styles.weatherLabel}>Wind Speed</div>
          </div>
          <div style={styles.weatherCard}>
            <div style={styles.weatherIcon}>☁️</div>
            <div style={styles.weatherValue}>{weather?.weather?.[0]?.main || '--'}</div>
            <div style={styles.weatherLabel}>Conditions</div>
          </div>
        </div>

        {/* Recommendation */}
        <div style={styles.recommendation}>
          <strong>⚠️ Recommendation:</strong>
          <p>{prediction?.recommendation || 'Stay alert and monitor conditions.'}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold'
  },
  location: {
    fontSize: '14px',
    color: '#666'
  },
  mapView: {
    border: '3px solid',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    position: 'relative'
  },
  badge: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    padding: '10px 20px',
    borderRadius: '20px',
    color: 'white',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
  },
  badgeText: {
    fontSize: '16px'
  },
  confidence: {
    fontSize: '12px',
    marginTop: '4px',
    opacity: 0.9
  },
  weatherGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '15px',
    marginTop: '20px'
  },
  weatherCard: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
  },
  weatherIcon: {
    fontSize: '32px',
    marginBottom: '8px'
  },
  weatherValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '4px'
  },
  weatherLabel: {
    fontSize: '12px',
    color: '#666'
  },
  recommendation: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#fff3cd',
    borderLeft: '4px solid #ffc107',
    borderRadius: '4px'
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    color: '#666'
  },
  error: {
    padding: '20px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '8px',
    textAlign: 'center'
  }
};
