#!/usr/bin/env python3
"""
Location Lookup Helper
Helps users find the correct location format for disaster risk profile queries
"""
import pickle
import sys

def load_locations():
    """Load available locations from the encoder"""
    try:
        le = pickle.load(open("models/location_encoder.pkl", "rb"))
        return list(le.classes_)
    except Exception as e:
        print(f"Error loading locations: {e}")
        return []

def search_locations(query, locations):
    """Search for locations matching the query"""
    query_lower = query.lower()
    matches = []
    
    # Exact matches first
    exact_matches = [loc for loc in locations if query_lower == loc.lower()]
    matches.extend(exact_matches)
    
    # Partial matches
    partial_matches = [loc for loc in locations if query_lower in loc.lower() and loc not in exact_matches]
    matches.extend(partial_matches)
    
    # Word matches
    query_words = query_lower.split()
    word_matches = []
    for loc in locations:
        if loc not in matches:
            loc_words = loc.lower().split()
            if any(word in loc_words for word in query_words):
                word_matches.append(loc)
    matches.extend(word_matches)
    
    return matches

def main():
    print("🔍 Disaster Risk Profile - Location Lookup Helper")
    print("=" * 60)
    
    locations = load_locations()
    if not locations:
        print("❌ Could not load location data. Make sure you're in the backend directory.")
        return
    
    print(f"📍 Loaded {len(locations)} available locations")
    print("\nType a location name to search (or 'quit' to exit)")
    print("Examples: Tamil Nadu, Coimbatore, Andhra Pradesh, Mumbai")
    print("-" * 60)
    
    while True:
        try:
            query = input("\n🔍 Search: ").strip()
            
            if query.lower() in ['quit', 'exit', 'q']:
                print("👋 Goodbye!")
                break
                
            if not query:
                continue
                
            matches = search_locations(query, locations)
            
            if matches:
                print(f"\n✅ Found {len(matches)} matching locations:")
                print("-" * 40)
                for i, match in enumerate(matches[:10], 1):  # Show top 10 matches
                    print(f"{i:2d}. {match}")
                
                if len(matches) > 10:
                    print(f"    ... and {len(matches) - 10} more matches")
                    
                print(f"\n💡 Copy and paste the exact text above into your location search")
                
            else:
                print(f"\n❌ No matches found for '{query}'")
                print("\n💡 Try searching for:")
                print("   • State names: Tamil Nadu, Andhra Pradesh, Uttar Pradesh")
                print("   • City names: Chennai, Mumbai, Kolkata")
                print("   • Partial names: Tamil, Andhra, Bengal")
                
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    main()