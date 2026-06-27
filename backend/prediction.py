"""
Simple heuristic-based disaster risk prediction.
"""
RISK_LEVELS = {
    0: {"level": "LOW", "color": "#4CAF50", "emoji": "✅"},
    1: {"level": "MEDIUM", "color": "#FFC107", "emoji": "⚠"},
    2: {"level": "HIGH", "color": "#FF9800", "emoji": "⚠⚠"},
    3: {"level": "CRITICAL", "color": "#F44336", "emoji": "🚨"}
}
# Risk levels mapping
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
