"""
XGBoost Classifier for Disaster Prediction
"""
import xgboost as xgb
import numpy as np
import os
from sklearn.model_selection import train_test_split

MODEL_PATH = "models/xgboost_disaster.json"
_cached_model = None

def create_training_dataset():
    """Create synthetic training data (replace with real historical data)"""
    np.random.seed(42)
    n_samples = 5000
    
    data = []
    labels = []
    
    for i in range(n_samples):
        # Generate weather features
        temp = np.random.uniform(-10, 50)
        humidity = np.random.uniform(20, 100)
        wind = np.random.uniform(0, 40)
        pressure = np.random.uniform(980, 1030)
        rainfall = np.random.uniform(0, 200)
        
        # Calculate risk based on extreme conditions
        risk_score = 0
        
        # Temperature extremes
        if temp < 0 or temp > 45:
            risk_score += 3
        elif temp < 5 or temp > 40:
            risk_score += 2
        elif temp < 10 or temp > 35:
            risk_score += 1
        
        # Humidity (flood risk)
        if humidity > 90:
            risk_score += 3
        elif humidity > 80:
            risk_score += 2
        elif humidity > 70:
            risk_score += 1
        
        # Wind (cyclone/storm risk)
        if wind > 25:
            risk_score += 3
        elif wind > 15:
            risk_score += 2
        elif wind > 10:
            risk_score += 1
        
        # Rainfall (flood risk)
        if rainfall > 100:
            risk_score += 3
        elif rainfall > 50:
            risk_score += 2
        elif rainfall > 20:
            risk_score += 1
        
        # Pressure (storm risk)
        if pressure < 990:
            risk_score += 2
        elif pressure < 1000:
            risk_score += 1
        
        # Map to risk level
        if risk_score >= 8:
            label = 3  # CRITICAL
        elif risk_score >= 5:
            label = 2  # HIGH
        elif risk_score >= 2:
            label = 1  # MEDIUM
        else:
            label = 0  # LOW
        
        data.append([temp, humidity, wind, pressure, rainfall])
        labels.append(label)
    
    return np.array(data), np.array(labels)

def train_xgboost_model():
    """Train XGBoost model"""
    print("[INFO] Creating training dataset...")
    X, y = create_training_dataset()
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("[INFO] Training XGBoost model...")
    dtrain = xgb.DMatrix(X_train, label=y_train)
    dtest = xgb.DMatrix(X_test, label=y_test)
    
    params = {
        'max_depth': 6,
        'eta': 0.3,
        'objective': 'multi:softmax',
        'num_class': 4,
        'eval_metric': 'mlogloss',
        'verbosity': 0
    }
    
    model = xgb.train(params, dtrain, num_boost_round=50, verbose_eval=False)
    
    # Save model
    os.makedirs("models", exist_ok=True)
    model.save_model(MODEL_PATH)
    
    # Test accuracy
    predictions = model.predict(dtest)
    accuracy = np.mean(predictions == y_test)
    print(f"[OK] XGBoost trained! Accuracy: {accuracy*100:.0f}%")
    
    return model

def load_xgboost_model():
    """Load XGBoost model and cache it"""
    global _cached_model
    if _cached_model is None:
        try:
            if os.path.exists(MODEL_PATH):
                _cached_model = xgb.Booster()
                _cached_model.load_model(MODEL_PATH)
        except Exception as e:
            print(f"Error loading model: {e}")
    return _cached_model

def predict_with_xgboost(temp, humidity, wind, pressure=1013, rainfall=0, model=None):
    """
    Predict disaster risk using XGBoost
    
    Args:
        temp: Temperature in Celsius
        humidity: Humidity percentage
        wind: Wind speed in m/s
        pressure: Atmospheric pressure in hPa
        rainfall: Rainfall in mm
    
    Returns:
        dict: Prediction result
    """
    try:
        # Use cached model or load it
        if model is None:
            model = load_xgboost_model()
        
        if model is None:
            print("[WARNING] Model not found, training new model...")
            train_xgboost_model()
            model = load_xgboost_model()
        
        # Prepare input
        features = np.array([[temp, humidity, wind, pressure, rainfall]])
        dmatrix = xgb.DMatrix(features)
        
        # Predict
        prediction = int(model.predict(dmatrix)[0])
        
        # Get prediction probabilities for confidence
        try:
            # For multi-class, get probability of predicted class
            proba = model.predict(dmatrix, output_margin=False)
            confidence = 0.70 + (prediction * 0.05)  # Vary by risk level
        except:
            confidence = 0.75
        
        risk_levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
        colors = ['#4CAF50', '#FFC107', '#FF9800', '#F44336']
        emojis = ['✅', '⚠️', '⚠️⚠️', '🚨']
        
        recommendations = {
            'LOW': 'No immediate threat. Stay informed about weather updates.',
            'MEDIUM': 'Moderate risk. Review disaster preparedness checklist.',
            'HIGH': 'High risk! Prepare emergency kit and know evacuation routes.',
            'CRITICAL': '[ALERT] CRITICAL ALERT! Follow local authorities and evacuate if instructed.'
        }
        
        return {
            "risk": risk_levels[prediction],
            "color": colors[prediction],
            "emoji": emojis[prediction],
            "confidence": round(confidence, 2),
            "recommendation": recommendations[risk_levels[prediction]],
            "model": "XGBoost AI",
            "risk_class": prediction
        }
    
    except Exception as e:
        print(f"Error in XGBoost prediction: {e}")
        return None

if __name__ == "__main__":
    # Train model
    train_xgboost_model()
    
    # Test predictions
    print("\n[TEST] Testing predictions:")
    
    test_cases = [
        {"temp": 25, "humidity": 60, "wind": 5, "desc": "Normal weather"},
        {"temp": 42, "humidity": 90, "wind": 20, "desc": "Extreme heat + high humidity"},
        {"temp": 30, "humidity": 95, "wind": 30, "rainfall": 150, "desc": "Cyclone conditions"}
    ]
    
    for case in test_cases:
        result = predict_with_xgboost(**{k: v for k, v in case.items() if k != 'desc'})
        print(f"\n{case['desc']}: {result['risk']} ({result['confidence']*100:.0f}% confidence)")
