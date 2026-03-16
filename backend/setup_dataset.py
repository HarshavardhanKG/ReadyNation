"""
Prepare disaster dataset for historical data display
Run this once to create the pickle files
"""
import pandas as pd
import pickle
import os
from sklearn.preprocessing import LabelEncoder

# Create models directory
os.makedirs("models", exist_ok=True)

# Load the dataset
print("[1/4] Loading disaster dataset...")
try:
    # Try clean_disaster_data.csv first
    df = pd.read_csv("dataset/clean_disaster_data.csv")
    print(f"✓ Loaded clean_disaster_data.csv: {len(df)} records")
except:
    try:
        # Fallback to disasterIND.csv
        df = pd.read_csv("dataset/disasterIND.csv")
        print(f"✓ Loaded disasterIND.csv: {len(df)} records")
    except Exception as e:
        print(f"✗ Error loading dataset: {e}")
        exit(1)

# Display columns
print(f"\nColumns in dataset: {list(df.columns)}")

# Identify location column (try common names)
location_col = None
for col in ['Location', 'Admin1', 'location', 'admin1', 'State', 'state']:
    if col in df.columns:
        location_col = col
        break

if not location_col:
    print("✗ Could not find location column. Please specify manually.")
    exit(1)

print(f"✓ Using location column: {location_col}")

# Clean and prepare data
print("\n[2/4] Cleaning data...")

# Standardize location names (title case, strip whitespace)
df[location_col] = df[location_col].astype(str).str.strip().str.title()

# Keep only necessary columns
required_cols = [location_col, 'Start Year', 'Disaster Type', 'Disaster Subtype', 'Total Deaths']
available_cols = [col for col in required_cols if col in df.columns]

if len(available_cols) < 3:
    print(f"✗ Missing required columns. Available: {list(df.columns)}")
    exit(1)

df_clean = df[available_cols].copy()

# Fill missing values
df_clean['Total Deaths'] = df_clean['Total Deaths'].fillna(0)
df_clean = df_clean.dropna(subset=[location_col, 'Start Year', 'Disaster Type'])

print(f"✓ Cleaned data: {len(df_clean)} records")
print(f"✓ Unique locations: {df_clean[location_col].nunique()}")

# Create location encoder
print("\n[3/4] Creating location encoder...")
le_location = LabelEncoder()
df_clean['location_encoded'] = le_location.fit_transform(df_clean[location_col])

print(f"✓ Encoded {len(le_location.classes_)} unique locations")
print(f"Sample locations: {list(le_location.classes_[:10])}")

# Save pickle files
print("\n[4/4] Saving pickle files...")

# Save dataframe
with open("models/disaster_knowledge.pkl", "wb") as f:
    pickle.dump(df_clean, f)
print("✓ Saved models/disaster_knowledge.pkl")

# Save encoder
with open("models/location_encoder.pkl", "wb") as f:
    pickle.dump(le_location, f)
print("✓ Saved models/location_encoder.pkl")

# Test the setup
print("\n[TEST] Testing data retrieval...")
test_location = le_location.classes_[0]  # First location
encoded = le_location.transform([test_location])[0]
result = df_clean[df_clean['location_encoded'] == encoded]
print(f"✓ Test query for '{test_location}': {len(result)} records found")

print("\n✅ Setup complete! Your Flask backend can now display historical disasters.")
print(f"\nAvailable locations ({len(le_location.classes_)}):")
for i, loc in enumerate(le_location.classes_[:20]):
    print(f"  - {loc}")
if len(le_location.classes_) > 20:
    print(f"  ... and {len(le_location.classes_) - 20} more")
