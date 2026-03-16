// API utility with proper error handling for Flask + ngrok

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * Safe fetch wrapper that handles ngrok warning pages and JSON parsing
 */
export async function safeFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  // Add ngrok bypass header
  const headers = {
    'ngrok-skip-browser-warning': 'true',
    'User-Agent': 'DisasterApp',
    ...options.headers
  };

  try {
    const response = await fetch(url, { ...options, headers });

    // Check if response is OK
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // Check content type before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 200));
      throw new Error('Server returned HTML instead of JSON');
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// Specific API functions
export const api = {
  getDisasterPrediction: (location) => 
    safeFetch(`/disaster-prediction?location=${encodeURIComponent(location)}`),
  
  getWeatherHistory: (location, days = 3) => 
    safeFetch(`/weather-history?location=${encodeURIComponent(location)}&days=${days}`),
  
  getLocationData: (location) => 
    safeFetch('/get_location_data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location })
    }),
  
  getModules: () => 
    safeFetch('/modules')
};
