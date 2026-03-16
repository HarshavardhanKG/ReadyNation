"""
Clean disaster dataset to extract state names only
"""
import pickle
import pandas as pd
from sklearn.preprocessing import LabelEncoder

# Load original data
df = pickle.load(open("models/disaster_knowledge.pkl", "rb"))
print(f"Original data: {len(df)} records")

# Extract state names from complex location strings
def extract_state(location_str):
    """Extract primary state from location string"""
    if pd.isna(location_str):
        return None
    
    # Common state names in India
    states = [
        'Tamil Nadu', 'Andhra Pradesh', 'Karnataka', 'Kerala', 'Maharashtra',
        'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Bihar',
        'West Bengal', 'Orissa', 'Punjab', 'Haryana', 'Delhi', 'Assam',
        'Jharkhand', 'Chhattisgarh', 'Himachal Pradesh', 'Uttarakhand',
        'Goa', 'Sikkim', 'Tripura', 'Meghalaya', 'Manipur', 'Nagaland',
        'Mizoram', 'Arunachal Pradesh', 'Jammu and Kashmir', 'Telangana'
    ]
    
    location_lower = location_str.lower()
    
    # Find first matching state
    for state in states:
        if state.lower() in location_lower:
            return state
    
    # If no state found, return first part before comma
    parts = location_str.split(',')
    return parts[0].strip() if parts else location_str

# Create new column with cleaned state names
df['State'] = df['Location'].apply(extract_state)

# Remove rows without state
df_clean = df[df['State'].notna()].copy()

print(f"Cleaned data: {len(df_clean)} records")
print(f"Unique states: {df_clean['State'].nunique()}")
print(f"States: {sorted(df_clean['State'].unique())}")

# Encode states
le_state = LabelEncoder()
df_clean['location_encoded'] = le_state.fit_transform(df_clean['State'])

# Drop original Location column, keep State
df_clean = df_clean.drop(columns=['Location'])

# Save cleaned data
pickle.dump(df_clean, open("models/disaster_knowledge_clean.pkl", "wb"))
pickle.dump(le_state, open("models/state_encoder.pkl", "wb"))

print("\n✅ Saved:")
print("  - models/disaster_knowledge_clean.pkl")
print("  - models/state_encoder.pkl")

# Show sample
print("\nSample records:")
print(df_clean[['State', 'Disaster Type', 'Start Year', 'Total Deaths']].head(10))
