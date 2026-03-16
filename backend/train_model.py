import pandas as pd
from sklearn.preprocessing import LabelEncoder
import pickle

# Load cleaned data
df = pd.read_csv("dataset/clean_disaster_data.csv")

# Encode location (AI understanding)
le_location = LabelEncoder()
df["location_encoded"] = le_location.fit_transform(df["Location"])

# Save model folder if not exists
import os
os.makedirs("models", exist_ok=True)

# Save knowledge base
pickle.dump(df, open("models/disaster_knowledge.pkl", "wb"))
pickle.dump(le_location, open("models/location_encoder.pkl", "wb"))

print("✅ AI knowledge model trained")
