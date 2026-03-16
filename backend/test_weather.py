"""Test script to verify weather API returns different data for different locations"""
from weather import get_weather

locations = ["Mumbai", "Delhi", "Chennai", "Kolkata", "Bangalore"]

print("Testing Weather API with different locations:\n")
print("=" * 70)

for loc in locations:
    try:
        data = get_weather(loc)
        temp = data.get("main", {}).get("temp")
        humidity = data.get("main", {}).get("humidity")
        wind = data.get("wind", {}).get("speed")
        
        print(f"\n{loc}:")
        print(f"  Temperature: {temp}°C")
        print(f"  Humidity: {humidity}%")
        print(f"  Wind Speed: {wind} m/s")
        print(f"  Weather: {data.get('weather', [{}])[0].get('description', 'N/A')}")
    except Exception as e:
        print(f"\n{loc}: ERROR - {e}")

print("\n" + "=" * 70)
print("\nIf all locations show DIFFERENT values, the API is working correctly.")
print("If all locations show SAME values, there's a caching or API issue.")
