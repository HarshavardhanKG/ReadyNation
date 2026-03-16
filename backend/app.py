from flask import Flask, request, jsonify
import pickle
import pandas as pd
import os
from flask_cors import CORS
from weather import get_weather, get_weather_history
from prediction import predict_disaster_risk
from volunteer_opportunities import generate_volunteer_opportunities, get_organization_contacts
from database import register_user, login_user, get_all_users, delete_user

app = Flask(__name__)
CORS(app)

# Load AI knowledge for historical data only
try:
    df = pickle.load(open("models/disaster_knowledge_clean.pkl", "rb"))
    print(f"[OK] Loaded {len(df)} disaster records")
except Exception as e:
    print(f"[WARNING] Could not load clean data: {e}")
    try:
        df = pickle.load(open("models/disaster_knowledge.pkl", "rb"))
        print(f"[OK] Loaded original data: {len(df)} records")
    except:
        df = pd.DataFrame()

try:
    le_location = pickle.load(open("models/state_encoder.pkl", "rb"))
    print(f"[OK] Loaded state encoder with {len(le_location.classes_)} states")
    print(f"[INFO] Available states: {list(le_location.classes_)[:10]}...")
except Exception as e:
    print(f"[WARNING] Could not load state encoder: {e}")
    try:
        le_location = pickle.load(open("models/location_encoder.pkl", "rb"))
        print(f"[OK] Loaded location encoder")
    except:
        le_location = None


@app.route("/register", methods=["POST"])
def register():
    """Register a new user"""
    data = request.json
    if not data:
        return jsonify({"success": False, "message": "No data provided"}), 400
    
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    location = data.get("location")
    role = data.get("role", "Student")
    
    if not all([name, email, password, location]):
        return jsonify({"success": False, "message": "All fields required"}), 400
    
    result = register_user(name, email, password, location, role)
    return jsonify(result)


@app.route("/login", methods=["POST"])
def login():
    """Login user"""
    data = request.json
    if not data:
        return jsonify({"success": False, "message": "No data provided"}), 400
    
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"success": False, "message": "Email and password required"}), 400
    
    result = login_user(email, password)
    return jsonify(result)


@app.route("/users", methods=["GET"])
def users():
    """Get all registered users"""
    users_list = get_all_users()
    return jsonify({"users": users_list, "count": len(users_list)})


@app.route("/users/<email>", methods=["DELETE"])
def delete_user_route(email):
    """Delete a user"""
    result = delete_user(email)
    return jsonify(result)


@app.route("/", methods=["GET"])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "running",
        "message": "Disaster Preparedness API",
        "endpoints": [
            "/disaster-prediction?location=Mumbai",
            "/weather?location=Mumbai",
            "/weather-history?location=Mumbai&days=3",
            "/disaster",
            "/modules"
        ]
    })


@app.route("/get_location_data", methods=["POST"])
def get_location_data():
    try:
        data = request.json
        if not data:
            return jsonify({"message": "No data provided"}), 400
        
        location = data.get("location", "").strip()
        if not location:
            return jsonify({"message": "Location required"}), 400

        if le_location is None or df.empty:
            return jsonify({"message": "Historical data not available"}), 503
        
        print(f"Searching for location: '{location}'")
        
        # Try exact match first (case-insensitive)
        try:
            encoded = le_location.transform([location])[0]
            matched_location = location
        except:
            # Fuzzy match - find states containing the search term
            matching_locations = [loc for loc in le_location.classes_ if location.lower() in loc.lower()]
            
            if not matching_locations:
                available = ", ".join(list(le_location.classes_)[:5])
                return jsonify({"message": f"No data for '{location}'. Try: {available}, etc."}), 404
            
            matched_location = matching_locations[0]
            encoded = le_location.transform([matched_location])[0]
        
        print(f"Matched '{location}' to '{matched_location}'")
        
        # Get data using State column if available, otherwise location_encoded
        if 'State' in df.columns:
            result = df[df['State'] == matched_location]
        else:
            result = df[df["location_encoded"] == encoded]
        
        if result.empty:
            return jsonify({"message": f"No historical disasters for '{location}'"}), 404
        
        # Drop encoded column if exists
        if 'location_encoded' in result.columns:
            result = result.drop(columns=["location_encoded"])
        
        # Convert to records and clean NaN values
        raw = result.to_dict(orient="records")
        cleaned = []
        for rec in raw:
            cleaned_rec = {}
            for k, v in rec.items():
                if pd.isna(v):
                    cleaned_rec[k] = None
                else:
                    cleaned_rec[k] = int(v) if isinstance(v, (int, float)) and k in ["Start Year", "Total Deaths"] else v
            cleaned.append(cleaned_rec)
        
        print(f"Returning {len(cleaned)} disaster records for '{matched_location}'")
        return jsonify(cleaned)

    except Exception as e:
        print(f"Error in get_location_data: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Internal server error"}), 500


@app.route("/locations", methods=["GET"])
def get_locations():
    """List all available locations in the dataset"""
    if le_location is None:
        return jsonify({"message": "No locations available"}), 503
    return jsonify({"locations": sorted(list(le_location.classes_))})


@app.route("/validate-location", methods=["GET"])
def validate_location():
    """Validate if a location exists in weather API and is in India"""
    loc = request.args.get("location")
    if not loc:
        return jsonify({"valid": False, "message": "Location required"}), 400
    
    # Minimum length check
    if len(loc.strip()) < 3:
        return jsonify({"valid": False, "message": "Location not found"}), 400
    
    try:
        # Try to fetch weather for this location
        weather_data = get_weather(loc)
        city_name = weather_data.get("name", loc)
        state = weather_data.get("state", "")
        country = weather_data.get("sys", {}).get("country", "")
        
        # Restrict to Indian locations only
        if country != "IN":
            print(f"[VALIDATION] Location '{loc}' found but not in India (country: {country})")
            return jsonify({"valid": False, "message": "Location not found"}), 400
        
        # Check if the returned city name is similar to input (fuzzy match)
        if city_name.lower() != loc.lower():
            print(f"[VALIDATION] Warning: Input '{loc}' matched to '{city_name}'")
            return jsonify({"valid": False, "message": "Location not found"}), 400
        
        # If successful and in India, location is valid
        return jsonify({
            "valid": True,
            "location": city_name,
            "state": state,
            "country": country
        })
    except Exception as e:
        print(f"[VALIDATION] Location '{loc}' not found: {e}")
        return jsonify({"valid": False, "message": "Location not found"}), 404


# Frontend expects /disaster and /modules — provide simple endpoints
@app.route("/alerts", methods=["GET"])
def get_alerts():
    """Get weather alerts for a location using OpenWeatherMap API"""
    loc = request.args.get("location")
    if not loc:
        return jsonify({"message": "location required"}), 400
    
    try:
        import requests
        from dotenv import load_dotenv
        load_dotenv()
        
        API_KEY = os.getenv("OPENWEATHER_API_KEY")
        
        # Get coordinates for the location
        weather_data = get_weather(loc)
        lat = weather_data.get("coord", {}).get("lat")
        lon = weather_data.get("coord", {}).get("lon")
        city_name = weather_data.get("name", loc)
        
        # Fetch alerts using One Call API
        url = f"https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&appid={API_KEY}"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            alerts = data.get("alerts", [])
            
            # Format alerts for frontend
            formatted_alerts = []
            for idx, alert in enumerate(alerts):
                formatted_alerts.append({
                    "id": idx + 1,
                    "region": city_name,
                    "type": alert.get("event", "weather").lower(),
                    "severity": "critical" if "warning" in alert.get("event", "").lower() else "severe",
                    "title": alert.get("event", "Weather Alert"),
                    "message": alert.get("description", "No details available"),
                    "source": alert.get("sender_name", "Weather Service"),
                    "verified": True,
                    "time": "Live",
                    "start": alert.get("start"),
                    "end": alert.get("end")
                })
            
            return jsonify({
                "location": city_name,
                "alerts": formatted_alerts,
                "count": len(formatted_alerts)
            })
        else:
            # No alerts available, return empty
            return jsonify({
                "location": city_name,
                "alerts": [],
                "count": 0
            })
    except Exception as e:
        print(f"[ERROR] get_alerts: {e}")
        return jsonify({"message": str(e)}), 500


@app.route("/volunteer-opportunities", methods=["GET"])
def volunteer_opportunities():
    """Get volunteer opportunities based on location and risk level"""
    location = request.args.get("location")
    risk_level = request.args.get("risk_level", "MEDIUM")
    
    if not location:
        return jsonify({"message": "location required"}), 400
    
    try:
        opportunities = generate_volunteer_opportunities(location, risk_level, count=6)
        return jsonify({
            "location": location,
            "risk_level": risk_level,
            "opportunities": opportunities,
            "count": len(opportunities)
        })
    except Exception as e:
        print(f"[ERROR] volunteer_opportunities: {e}")
        return jsonify({"message": str(e)}), 500


@app.route("/organizations", methods=["GET"])
def organizations():
    """Get curated list of disaster relief organizations"""
    try:
        orgs = get_organization_contacts()
        return jsonify({
            "organizations": orgs,
            "count": len(orgs)
        })
    except Exception as e:
        print(f"[ERROR] organizations: {e}")
        return jsonify({"message": str(e)}), 500


@app.route("/disaster", methods=["GET"])
def disaster():
    # Return live or sample disaster info
    sample = {
        "type": "Flood",
        "weather": "Heavy Rain",
        "risk": "HIGH",
        "tip": "Move to higher ground and avoid water crossings."
    }
    return jsonify(sample)


@app.route("/modules", methods=["GET"])
def modules():
    # Return a simple modules list usable by the frontend
    modules_list = [
        {"id": "m1", "type": "video", "title": "Flood Safety", "description": "Flood tips"},
        {"id": "m2", "type": "quiz", "title": "Fire Quiz", "description": "Test yourself"}
    ]
    return jsonify(modules_list)


@app.route("/weather", methods=["GET"])
def weather():
    # Accept ?location=... or JSON {"location": "..."}
    loc = request.args.get("location") or (request.json or {}).get("location")
    if not loc:
        return jsonify({"message": "location required"}), 400
    try:
        data = get_weather(loc)
        return jsonify(data)
    except Exception as e:
        return jsonify({"message": str(e)}), 502


@app.route("/weather-history", methods=["GET"])
def weather_history():
    """Fetch past N days of weather for a location."""
    loc = request.args.get("location") or (request.json or {}).get("location")
    days = request.args.get("days", 3, type=int)
    if not loc:
        return jsonify({"message": "location required"}), 400
    try:
        data = get_weather_history(loc, days=min(days, 7))  # Max 7 days
        return jsonify(data)
    except Exception as e:
        return jsonify({"message": str(e)}), 502


@app.route("/disaster-prediction", methods=["GET", "POST"])
def disaster_prediction():
    """Predict disaster risk based on location and weather."""
    try:
        # Get location from query or JSON
        if request.method == "POST":
            data = request.json or {}
            loc = data.get("location")
            temp = data.get("temp")
            humidity = data.get("humidity")
            wind = data.get("wind")
        else:
            loc = request.args.get("location")
            temp = request.args.get("temp")
            humidity = request.args.get("humidity")
            wind = request.args.get("wind")
        
        if not loc:
            return jsonify({"message": "location required"}), 400
        
        print(f"\n[PREDICTION] Request for location: {loc}")
        
        # Fetch real-time weather if not provided
        if temp is None or humidity is None or wind is None:
            print(f"[PREDICTION] Fetching live weather data...")
            weather_data = get_weather(loc)
            temp = weather_data.get("main", {}).get("temp", 25)
            humidity = weather_data.get("main", {}).get("humidity", 50)
            wind = weather_data.get("wind", {}).get("speed", 5)
            
            # Extract city and state from weather API
            city_name = weather_data.get("name", loc)
            state = weather_data.get("state", "")
            
            print(f"[PREDICTION] Weather fetched: temp={temp}°C, humidity={humidity}%, wind={wind}m/s")
            print(f"[PREDICTION] Location details: city={city_name}, state={state}")
        else:
            temp = float(temp)
            humidity = int(humidity)
            wind = float(wind)
            city_name = loc
            state = ""
        
        # Use heuristic prediction
        location_encoded = 0
        if le_location is not None:
            try:
                location_encoded = le_location.transform([loc])[0]
            except:
                location_encoded = 0
        
        prediction = predict_disaster_risk(location_encoded, temp, humidity, wind)
        print(f"[PREDICTION] Risk level: {prediction['risk']} (score: {prediction.get('risk_class', 'N/A')})")
        
        # Add weather data and location details to response
        prediction["weather_data"] = {
            "temp": temp,
            "humidity": humidity,
            "wind": wind,
            "location": loc,
            "city": city_name,
            "state": state
        }
        
        return jsonify(prediction)
    except Exception as e:
        print(f"[ERROR] disaster_prediction: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"message": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
