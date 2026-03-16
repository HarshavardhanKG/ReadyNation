"""
LSTM Neural Network for Disaster Prediction
Predicts disaster risk based on 7-day weather patterns
"""
import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
import pickle
import os

MODEL_PATH = "models/lstm_disaster.h5"
SCALER_PATH = "models/weather_scaler.pkl"

def create_lstm_model():
    """Build LSTM model architecture"""
    model = Sequential([
        LSTM(64, return_sequences=True, input_shape=(7, 4)),  # 7 days, 4 features
        Dropout(0.3),
        LSTM(32, return_sequences=False),
        Dropout(0.3),
        Dense(16, activation='relu'),
        Dense(4, activation='softmax')  # 4 risk levels
    ])
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    return model

def prepare_training_data():
    """Prepare weather sequences for training"""
    # Load historical weather + disaster data
    # Format: [temp, humidity, wind, pressure] for 7 consecutive days
    # Label: 0=LOW, 1=MEDIUM, 2=HIGH, 3=CRITICAL
    
    # Example training data structure
    sequences = []
    labels = []
    
    # Simulate training data (replace with real historical data)
    for i in range(1000):
        # Normal weather -> LOW risk
        if i < 700:
            seq = np.random.normal([25, 60, 5, 1013], [5, 10, 2, 5], (7, 4))
            label = 0
        # Extreme weather -> HIGH/CRITICAL risk
        elif i < 900:
            seq = np.random.normal([35, 85, 15, 1000], [3, 5, 3, 10], (7, 4))
            label = 2
        else:
            seq = np.random.normal([40, 95, 25, 990], [2, 3, 5, 5], (7, 4))
            label = 3
        
        sequences.append(seq)
        labels.append(label)
    
    X = np.array(sequences)
    y = np.eye(4)[labels]  # One-hot encode
    
    return X, y

def train_lstm_model():
    """Train LSTM model on weather data"""
    print("🔄 Preparing training data...")
    X_train, y_train = prepare_training_data()
    
    # Normalize features
    scaler = MinMaxScaler()
    X_train_scaled = X_train.reshape(-1, 4)
    X_train_scaled = scaler.fit_transform(X_train_scaled)
    X_train_scaled = X_train_scaled.reshape(-1, 7, 4)
    
    print("🔄 Building LSTM model...")
    model = create_lstm_model()
    
    print("🔄 Training model...")
    model.fit(X_train_scaled, y_train, epochs=50, batch_size=32, validation_split=0.2, verbose=1)
    
    # Save model and scaler
    os.makedirs("models", exist_ok=True)
    model.save(MODEL_PATH)
    pickle.dump(scaler, open(SCALER_PATH, "wb"))
    
    print("✅ LSTM model trained and saved!")
    return model

def predict_with_lstm(weather_sequence):
    """
    Predict disaster risk using LSTM
    
    Args:
        weather_sequence: List of 7 days weather data
                         [[temp, humidity, wind, pressure], ...]
    
    Returns:
        dict: {risk, confidence, probabilities}
    """
    try:
        # Load model and scaler
        if not os.path.exists(MODEL_PATH):
            print("⚠ Model not found, training new model...")
            train_lstm_model()
        
        model = load_model(MODEL_PATH)
        scaler = pickle.load(open(SCALER_PATH, "rb"))
        
        # Prepare input
        X = np.array(weather_sequence).reshape(1, 7, 4)
        X_scaled = scaler.transform(X.reshape(-1, 4)).reshape(1, 7, 4)
        
        # Predict
        prediction = model.predict(X_scaled, verbose=0)[0]
        risk_class = np.argmax(prediction)
        confidence = float(prediction[risk_class])
        
        risk_levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
        colors = ['#4CAF50', '#FFC107', '#FF9800', '#F44336']
        emojis = ['✅', '⚠', '⚠⚠', '🚨']
        
        return {
            "risk": risk_levels[risk_class],
            "color": colors[risk_class],
            "emoji": emojis[risk_class],
            "confidence": round(confidence, 2),
            "probabilities": {
                "LOW": round(float(prediction[0]), 2),
                "MEDIUM": round(float(prediction[1]), 2),
                "HIGH": round(float(prediction[2]), 2),
                "CRITICAL": round(float(prediction[3]), 2)
            },
            "model": "LSTM Neural Network"
        }
    
    except Exception as e:
        print(f"Error in LSTM prediction: {e}")
        return None

if __name__ == "__main__":
    # Train model
    train_lstm_model()
    
    # Test prediction
    test_weather = [
        [30, 75, 10, 1010],
        [32, 78, 12, 1008],
        [35, 82, 15, 1005],
        [38, 88, 18, 1000],
        [40, 92, 22, 995],
        [42, 95, 25, 990],
        [45, 98, 30, 985]
    ]
    result = predict_with_lstm(test_weather)
    print(f"\n🎯 Prediction: {result}")
