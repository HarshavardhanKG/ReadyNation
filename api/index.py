import sys
import os

# Add backend directory to path so all imports work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app import app

# Vercel expects a variable named `app` or handler
handler = app
