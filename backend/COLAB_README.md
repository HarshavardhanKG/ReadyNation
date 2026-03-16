# Run Disaster Preparedness AI Backend on Google Colab

## Quick Start (3 Steps)

### Step 1: Upload to Google Colab
1. Go to [Google Colab](https://colab.research.google.com/)
2. Click **File → Upload notebook**
3. Upload `colab_setup.ipynb`

### Step 2: Run All Cells
1. Click **Runtime → Run all** (or press Ctrl+F9)
2. Wait 2-3 minutes for setup and training
3. Server will start automatically

### Step 3: Get Public URL (Optional)
- For external access, get free ngrok token from: https://dashboard.ngrok.com/get-started/your-authtoken
- Enter token when prompted
- Use the public URL in your frontend

## API Endpoints

Once running, test these endpoints:

```
GET  /                                    # Health check
GET  /disaster                            # Sample disaster info
GET  /weather?location=Mumbai             # Current weather
GET  /disaster-prediction?location=Mumbai # AI prediction
```

## Features
✅ XGBoost AI model for disaster prediction
✅ Real-time weather data from OpenWeatherMap
✅ CORS enabled for frontend integration
✅ Fast startup (models cached)
✅ Public URL access via ngrok

## Troubleshooting

**Server not starting?**
- Make sure all cells run without errors
- Check if port 5000 is available

**API not responding?**
- Wait 30 seconds after "Flask server is running!" message
- Test with the test cell provided

**Need help?**
- Check cell outputs for error messages
- Ensure internet connection is stable
