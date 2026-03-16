import os
import datetime
from dotenv import load_dotenv
import requests

load_dotenv()

API_KEY = os.getenv("WEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

def get_weather(location: str) -> dict:
    """Fetch current weather for `location` from OpenWeatherMap.

    Requires `WEATHER_API_KEY` environment variable to be set.
    Returns the JSON response as a dict. Raises on network/HTTP errors.
    """
    if not API_KEY:
        raise RuntimeError("Missing WEATHER_API_KEY environment variable")

    print(f"[WEATHER] Fetching weather for: {location}")
    params = {"q": location, "appid": API_KEY, "units": "metric"}
    resp = requests.get(BASE_URL, params=params, timeout=10)
    resp.raise_for_status()
    data = resp.json()
    
    # Get coordinates for reverse geocoding to find state
    lat = data.get("coord", {}).get("lat")
    lon = data.get("coord", {}).get("lon")
    
    # Fetch state using reverse geocoding
    state = "Unknown"
    if lat and lon:
        try:
            geo_url = f"http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit=1&appid={API_KEY}"
            geo_resp = requests.get(geo_url, timeout=10)
            geo_data = geo_resp.json()
            if geo_data and len(geo_data) > 0:
                state = geo_data[0].get("state", "Unknown")
                print(f"[WEATHER] State identified: {state}")
        except Exception as e:
            print(f"[WEATHER] Could not fetch state: {e}")
    
    data["state"] = state
    print(f"[WEATHER] Got temp={data.get('main', {}).get('temp')}°C, humidity={data.get('main', {}).get('humidity')}%, wind={data.get('wind', {}).get('speed')}m/s")
    return data


def get_weather_history(location: str, days: int = 3) -> list:
    """Fetch historical weather for past N days.
    
    Note: OpenWeatherMap free tier doesn't offer historical data.
    This returns mock data based on current conditions for demo purposes.
    """
    print(f"[WEATHER HISTORY] Fetching {days}-day forecast for: {location}")
    # Get current weather as base
    current = get_weather(location)
    history = []
    
    base_temp = current.get("main", {}).get("temp", 25)
    base_humidity = current.get("main", {}).get("humidity", 50)
    base_wind = current.get("wind", {}).get("speed", 5)
    base_description = current.get("weather", [{}])[0].get("description", "clear sky")
    print(f"[WEATHER HISTORY] Base values: temp={base_temp}°C, humidity={base_humidity}%, wind={base_wind}m/s")
    
    def get_weather_description(temp, humidity, wind):
        """Generate realistic weather description based on conditions"""
        if humidity > 80 and wind > 10:
            return "Heavy rain expected"
        elif humidity > 70 and wind > 8:
            return "Rainy with strong winds"
        elif humidity > 70:
            return "Light rain"
        elif humidity > 60:
            return "Cloudy with possible showers"
        elif humidity > 40:
            return "Partly cloudy"
        elif wind > 12:
            return "Windy and clear"
        elif temp > 35:
            return "Hot and sunny"
        elif temp < 10:
            return "Cold and clear"
        else:
            return "Clear sky"
    
    for i in range(days):
        day_offset = days - i
        date = (datetime.datetime.now() - datetime.timedelta(days=day_offset)).strftime("%Y-%m-%d")
        temp = base_temp + (i * 0.5)
        temp_min = round(temp - 3, 1)
        temp_max = round(temp + 4, 1)
        humidity = max(30, min(90, base_humidity - (i * 3)))
        wind = base_wind + (i * 0.3)
        
        history.append({
            "date": date,
            "temp": round(temp, 1),
            "temp_min": temp_min,
            "temp_max": temp_max,
            "humidity": humidity,
            "wind_speed": round(wind, 1),
            "description": get_weather_description(temp, humidity, wind)
        })
    
    return history
