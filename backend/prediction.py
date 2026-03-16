"""
Simple ML-based disaster prediction model.
Uses location, temperature, humidity, wind to predict disaster risk.
"""
import pickle
import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import numpy as np

MODEL_PATH = "models/disaster_predictor.pkl"
SCALER_PATH = "models/disaster_scaler.pkl"

# Risk levels mapping
RISK_LEVELS = {
    0: {"level": "LOW", "color": "#4CAF50", "emoji": "✅"},
    1: {"level": "MEDIUM", "color": "#FFC107", "emoji": "⚠"},
    2: {"level": "HIGH", "color": "#FF9800", "emoji": "⚠⚠"},
    3: {"level": "CRITICAL", "color": "#F44336", "emoji": "🚨"}
}


def train_prediction_model(df):
    """Train disaster prediction model from disaster dataset."""
    try:
        # Features: extract weather-like patterns from disaster data
        # For demo: we'll use location + year-based trend
        
        X = []
        y = []
        
        for idx, row in df.iterrows():
            # Mock features (in production: use actual weather data)
            # Feature 1: location_encoded, Feature 2: start_year trend, Feature 3: death count indicator
            location_encoded = row.get("location_encoded", 0)
            year = row.get("Start Year", 2000)
            deaths = row.get("Total Deaths", 0)
            
            X.append([location_encoded, year, deaths])
            # Risk: 0=LOW, 1=MEDIUM, 2=HIGH, 3=CRITICAL
            # Simple heuristic: higher deaths = higher risk
            if deaths < 20:
                y.append(0)
            elif deaths < 60:
                y.append(1)
            elif deaths < 100:
                y.append(2)
            else:
                y.append(3)
        
        X = np.array(X)
        y = np.array(y)
        
        # Train classifier
        model = RandomForestClassifier(n_estimators=10, random_state=42, max_depth=5)
        model.fit(X, y)
        
        os.makedirs("models", exist_ok=True)
        pickle.dump(model, open(MODEL_PATH, "wb"))
        return model
    except Exception as e:
        print(f"Error training model: {e}")
        return None


def load_prediction_model():
    """Load trained model from disk."""
    try:
        if os.path.exists(MODEL_PATH):
            return pickle.load(open(MODEL_PATH, "rb"))
    except Exception as e:
        print(f"Error loading model: {e}")
    return None


def predict_disaster_risk(location_encoded: int, temp: float, humidity: int, wind: float) -> dict:
    """Predict disaster risk based on weather and location.
    
    Args:
        location_encoded: encoded location ID
        temp: temperature in Celsius
        humidity: humidity percentage
        wind: wind speed m/s
    
    Returns:
        {
            "risk": "HIGH",
            "color": "#FF9800",
            "confidence": 0.85,
            "recommendation": "Stay alert and prepare..."
        }
    """
    # Use heuristic-based prediction for accurate weather analysis
    return predict_heuristic(temp, humidity, wind)


def predict_heuristic(temp: float, humidity: int, wind: float) -> dict:
    """Simple heuristic prediction when ML model unavailable."""
    risk_score = 0
    confidence_factors = []
    
    # Temperature risk (extreme temps increase disaster risk)
    if temp < 0 or temp > 45:
        risk_score += 3
        confidence_factors.append(0.95)  # Very confident about extreme temps
    elif temp < 5 or temp > 40:
        risk_score += 2
        confidence_factors.append(0.85)
    elif temp < 10 or temp > 35:
        risk_score += 1
        confidence_factors.append(0.75)
    else:
        confidence_factors.append(0.70)  # Normal temps = lower confidence in risk
    
    # Humidity risk (very high humidity = flood risk)
    if humidity > 90:
        risk_score += 3
        confidence_factors.append(0.90)
    elif humidity > 80:
        risk_score += 2
        confidence_factors.append(0.80)
    elif humidity > 70:
        risk_score += 1
        confidence_factors.append(0.70)
    else:
        confidence_factors.append(0.65)
    
    # Wind risk (high wind = storm/cyclone risk)
    if wind > 20:
        risk_score += 3
        confidence_factors.append(0.95)
    elif wind > 15:
        risk_score += 2
        confidence_factors.append(0.85)
    elif wind > 10:
        risk_score += 1
        confidence_factors.append(0.75)
    else:
        confidence_factors.append(0.65)
    
    # Calculate dynamic confidence based on risk factors
    # Higher risk scores = more confident in prediction
    avg_confidence = sum(confidence_factors) / len(confidence_factors)
    
    # Boost confidence if multiple factors align
    if risk_score >= 6:
        confidence = min(0.98, avg_confidence + 0.15)
    elif risk_score >= 4:
        confidence = min(0.92, avg_confidence + 0.10)
    elif risk_score >= 2:
        confidence = min(0.85, avg_confidence + 0.05)
    else:
        confidence = avg_confidence
    
    # Map score to risk level
    if risk_score >= 6:
        risk_class = 3  # CRITICAL
    elif risk_score >= 4:
        risk_class = 2  # HIGH
    elif risk_score >= 2:
        risk_class = 1  # MEDIUM
    else:
        risk_class = 0  # LOW
    
    risk_info = RISK_LEVELS[risk_class]
    
    recommendations = {
        "LOW": "No immediate threat. Stay informed about weather updates.",
        "MEDIUM": "Moderate risk. Review disaster preparedness checklist.",
        "HIGH": "High risk! Prepare emergency kit and know evacuation routes.",
        "CRITICAL": "🚨 CRITICAL ALERT! Follow local authorities and evacuate if instructed."
    }
    
    return {
        "risk": risk_info["level"],
        "color": risk_info["color"],
        "emoji": risk_info["emoji"],
        "confidence": round(confidence, 2),
        "recommendation": recommendations.get(risk_info["level"], "Unknown risk"),
        "risk_class": int(risk_class)
    }
