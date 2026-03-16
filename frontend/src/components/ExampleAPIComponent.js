import { useState, useEffect } from 'react';
import { safeFetch } from '../utils/api';

/**
 * Example component showing proper error handling for Flask + ngrok
 */
export default function ExampleAPIComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pattern 1: Simple GET request
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await safeFetch('/disaster-prediction?location=Mumbai');
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Pattern 2: POST request with body
  const postData = async (location) => {
    try {
      const result = await safeFetch('/get_location_data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location })
      });
      return result;
    } catch (err) {
      console.error('POST failed:', err);
      throw err;
    }
  };

  // Pattern 3: Using native fetch with manual checks
  const manualFetch = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/disaster`,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true' // CRITICAL for ngrok
          }
        }
      );

      // Check HTTP status
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Check content type BEFORE parsing
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        console.error('Got HTML:', text.substring(0, 100));
        throw new Error('Expected JSON but got HTML');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Fetch error:', err);
      throw err;
    }
  };

  return (
    <div>
      <h3>API Test Component</h3>
      
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>

      {error && (
        <div style={{ color: 'red', padding: '10px', backgroundColor: '#fee' }}>
          Error: {error}
        </div>
      )}

      {data && (
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

// Pattern 4: useEffect with cleanup
export function DataFetcher({ location }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const result = await safeFetch(
          `/disaster-prediction?location=${encodeURIComponent(location)}`
        );
        if (mounted) setData(result);
      } catch (err) {
        if (mounted) console.error(err);
      }
    }

    if (location) load();

    return () => { mounted = false; }; // Cleanup
  }, [location]);

  return data ? <div>{JSON.stringify(data)}</div> : <div>Loading...</div>;
}
