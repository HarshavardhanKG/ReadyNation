#!/usr/bin/env python3
"""
Test script to verify location matching improvements
"""
import requests
import json

def test_location(location):
    """Test a location against the API"""
    url = "http://localhost:5000/get_location_data"
    data = {"location": location}
    
    try:
        response = requests.post(url, json=data, headers={'Content-Type': 'application/json'})
        print(f"\n🔍 Testing: '{location}'")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: Found {len(data)} disaster records")
            if data:
                print(f"   Sample: {data[0].get('Disaster Type', 'N/A')} in {data[0].get('Start Year', 'N/A')}")
        else:
            error_data = response.json()
            print(f"❌ Error: {error_data.get('message', 'Unknown error')}")
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Connection Error: Make sure the backend server is running on localhost:5000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🧪 Testing Location Matching Improvements")
    print("=" * 50)
    
    # Test cases
    test_locations = [
        "Coimbatore, Tamil Nadu",  # Original failing case
        "Tamil Nadu",              # Direct state match
        "Chennai",                 # City name
        "Andhra Pradesh",          # Another state
        "Uttar Pradesh",           # Another state
        "Mumbai",                  # Major city
        "Invalid Location",        # Should fail gracefully
        "Assam",                   # State that should work
        "West Bengal"              # State that should work
    ]
    
    for location in test_locations:
        test_location(location)
    
    print("\n" + "=" * 50)
    print("🏁 Testing completed!")
    print("\nTo run this test:")
    print("1. Start the backend server: python app.py")
    print("2. Run this script: python test_location_matching.py")