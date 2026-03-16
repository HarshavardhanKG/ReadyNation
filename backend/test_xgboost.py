"""
Test XGBoost model - Run this in Colab to diagnose issues
"""
import os
import sys

print("=" * 50)
print("XGBOOST DIAGNOSTIC TEST")
print("=" * 50)

# Test 1: Check if xgboost is installed
print("\n[1] Checking XGBoost installation...")
try:
    import xgboost as xgb
    print(f"✅ XGBoost installed: v{xgb.__version__}")
except ImportError as e:
    print(f"❌ XGBoost NOT installed: {e}")
    print("   Run: !pip install xgboost")
    sys.exit(1)

# Test 2: Check if model file exists
print("\n[2] Checking model file...")
MODEL_PATH = "models/xgboost_disaster.json"
if os.path.exists(MODEL_PATH):
    print(f"✅ Model file exists: {MODEL_PATH}")
    print(f"   Size: {os.path.getsize(MODEL_PATH)} bytes")
else:
    print(f"❌ Model file NOT found: {MODEL_PATH}")
    print("   Training new model...")

# Test 3: Train model if needed
if not os.path.exists(MODEL_PATH):
    print("\n[3] Training XGBoost model...")
    try:
        from xgboost_model import train_xgboost_model
        train_xgboost_model()
        print("✅ Model trained successfully")
    except Exception as e:
        print(f"❌ Training failed: {e}")
        sys.exit(1)

# Test 4: Load model
print("\n[4] Loading model...")
try:
    from xgboost_model import load_xgboost_model
    model = load_xgboost_model()
    if model:
        print("✅ Model loaded successfully")
    else:
        print("❌ Model is None")
        sys.exit(1)
except Exception as e:
    print(f"❌ Loading failed: {e}")
    sys.exit(1)

# Test 5: Test prediction
print("\n[5] Testing prediction...")
try:
    from xgboost_model import predict_with_xgboost
    
    test_cases = [
        {"temp": 25, "humidity": 60, "wind": 5, "desc": "Normal"},
        {"temp": 42, "humidity": 90, "wind": 20, "desc": "Extreme"},
    ]
    
    for case in test_cases:
        result = predict_with_xgboost(
            case["temp"], 
            case["humidity"], 
            case["wind"],
            model=model
        )
        if result:
            print(f"✅ {case['desc']}: {result['risk']} (confidence: {result['confidence']})")
        else:
            print(f"❌ {case['desc']}: Prediction returned None")
except Exception as e:
    print(f"❌ Prediction failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "=" * 50)
print("✅ ALL TESTS PASSED - XGBoost is working!")
print("=" * 50)
