# Flask + React + ngrok Debugging Guide

## Problem: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

### Root Cause
ngrok shows an HTML warning page on first visit instead of forwarding to your Flask API.

---

## ✅ SOLUTIONS IMPLEMENTED

### 1. **ngrok Bypass Header** (Primary Fix)
Added `'ngrok-skip-browser-warning': 'true'` header to all requests.

```javascript
fetch(url, {
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
})
```

### 2. **Response Type Checking**
Check Content-Type before calling `.json()`:

```javascript
const contentType = response.headers.get('content-type');
if (!contentType?.includes('application/json')) {
  throw new Error('Server returned HTML instead of JSON');
}
```

### 3. **Centralized API Utility**
Created `src/utils/api.js` with safe fetch wrapper.

---

## 🔍 STEP-BY-STEP DEBUGGING

### Step 1: Test Backend Directly
```bash
# In browser, visit:
https://your-ngrok-url.ngrok-free.dev/disaster-prediction?location=Mumbai

# Should return JSON like:
{"risk": "MEDIUM", "confidence": 0.75, ...}
```

### Step 2: Check Network Tab
1. Open Chrome DevTools → Network tab
2. Trigger API call in React
3. Click the request
4. Check **Response** tab:
   - ✅ JSON = Good
   - ❌ HTML with "ngrok" = Warning page issue

### Step 3: Verify Headers
In Network tab → Headers:
- Request Headers should include: `ngrok-skip-browser-warning: true`
- Response Headers should include: `content-type: application/json`

### Step 4: Check Console Errors
```javascript
// Look for:
"Non-JSON response: <!DOCTYPE html>..."  // = ngrok warning
"HTTP 404" // = Wrong endpoint
"Failed to fetch" // = CORS or network issue
```

---

## 🛠️ MANUAL TESTING

### Test 1: Direct Fetch (Browser Console)
```javascript
fetch('https://your-ngrok-url.ngrok-free.dev/disaster-prediction?location=Mumbai', {
  headers: { 'ngrok-skip-browser-warning': 'true' }
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

### Test 2: Check CORS
```javascript
// Should see these headers in response:
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
```

---

## 🚀 DEPLOYMENT ALTERNATIVES (Better than ngrok)

### For Student Projects:

1. **Render.com** (Recommended)
   - Free tier available
   - No warning pages
   - Persistent URL
   - Deploy: `git push` → auto-deploy

2. **Railway.app**
   - Free $5/month credit
   - Easy Flask deployment
   - Custom domains

3. **PythonAnywhere**
   - Free tier for Flask
   - No credit card needed
   - Good for learning

4. **Google Cloud Run**
   - Free tier: 2M requests/month
   - Scales automatically
   - Professional setup

### Quick Render Deployment:
```bash
# 1. Add to requirements.txt:
gunicorn==21.2.0

# 2. Create Procfile:
web: gunicorn app:app

# 3. Push to GitHub
# 4. Connect to Render.com
# 5. Deploy!
```

---

## 📋 CHECKLIST

Before asking for help:
- [ ] Backend works in browser directly
- [ ] ngrok URL is correct in `.env`
- [ ] Restarted React dev server after changing `.env`
- [ ] Network tab shows request being made
- [ ] Response is HTML (ngrok warning) or JSON
- [ ] CORS headers present in response
- [ ] Using `ngrok-skip-browser-warning` header

---

## 🔧 COMMON FIXES

### Fix 1: Restart React After .env Change
```bash
# Stop React (Ctrl+C)
# Start again:
npm start
```

### Fix 2: Clear Browser Cache
```
Ctrl+Shift+Delete → Clear cache
```

### Fix 3: Test Backend in Colab
```python
# In Colab cell:
import requests
r = requests.get('http://localhost:5000/disaster-prediction?location=Mumbai')
print(r.json())
```

### Fix 4: Verify ngrok Tunnel
```bash
# Visit ngrok dashboard:
http://localhost:4040

# Shows all requests/responses
```

---

## 📞 STILL NOT WORKING?

1. Share Network tab screenshot
2. Share Console errors
3. Share backend logs from Colab
4. Confirm ngrok URL format: `https://xxx-xxx-xxx.ngrok-free.dev`
