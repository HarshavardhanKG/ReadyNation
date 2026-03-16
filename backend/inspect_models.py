import pickle
import pandas as pd

try:
    le = pickle.load(open("models/location_encoder.pkl","rb"))
    print("Encoder classes sample (first 50):")
    print(list(le.classes_)[:50])
    print("Total classes:", len(le.classes_))
except Exception as e:
    print("Failed to load encoder:", e)

try:
    df = pickle.load(open("models/disaster_knowledge.pkl","rb"))
    print('\nKnowledge DF columns:', df.columns.tolist())
    if 'Location' in df.columns:
        uniq = pd.Series(df['Location'].unique())
        print('Sample Location values (first 50):')
        print(list(uniq[:50]))
        # check for Tamil Nadu presence
        matches = uniq[uniq.str.contains('Tamil', case=False, na=False)]
        print('\nLocations containing "Tamil":')
        print(list(matches[:20]))
    else:
        print('No Location column in df')
except Exception as e:
    print('Failed to load knowledge df:', e)
