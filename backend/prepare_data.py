import pandas as pd
from sklearn.preprocessing import LabelEncoder
import pickle
import os

# Load cleaned data
df = pd.read_csv("dataset/clean_disaster_data.csv")
print(f"Loaded {len(df)} records from CSV")
print(f"Columns: {df.columns.tolist()}")

# Check what location column exists
if 'Location' in df.columns:
    location_col = 'Location'
elif 'State' in df.columns:
    location_col = 'State'
else:
    print("Available columns:", df.columns.tolist())
    raise ValueError("No Location or State column found")

print(f"Using column: {location_col}")
print(f"Unique locations: {df[location_col].nunique()}")
print(f"Sample locations: {df[location_col].unique()[:10]}")

# Encode location (AI understanding)
le_location = LabelEncoder()
df["location_encoded"] = le_location.fit_transform(df[location_col])

# Save model folder if not exists
os.makedirs("models", exist_ok=True)

# Save knowledge base
pickle.dump(df, open("models/disaster_knowledge.pkl", "wb"))
pickle.dump(le_location, open("models/location_encoder.pkl", "wb"))

print("\nAI knowledge model trained")
print(f"   - {len(df)} disaster records")
print(f"   - {len(le_location.classes_)} unique locations")
print(f"   - Saved to models/")
