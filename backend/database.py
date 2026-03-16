import sqlite3
import json
from datetime import datetime

DB_PATH = "users.db"

def init_db():
    """Initialize database with users table"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            location TEXT NOT NULL,
            role TEXT DEFAULT 'Student',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create admin account if not exists
    cursor.execute('''
        INSERT OR IGNORE INTO users (name, email, password, location, role)
        VALUES (?, ?, ?, ?, ?)
    ''', ('Admin', 'admin@gmail.com', '123', 'Coimbatore, Tamil Nadu', 'Admin'))
    
    conn.commit()
    conn.close()
    print("[DB] Database initialized")

def register_user(name, email, password, location, role='Student'):
    """Register a new user"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO users (name, email, password, location, role)
            VALUES (?, ?, ?, ?, ?)
        ''', (name, email, password, location, role))
        conn.commit()
        return {"success": True, "message": "User registered successfully"}
    except sqlite3.IntegrityError:
        # Email already exists, update instead
        cursor.execute('''
            UPDATE users SET name=?, password=?, location=?, role=?
            WHERE email=?
        ''', (name, password, location, role, email))
        conn.commit()
        return {"success": True, "message": "User updated successfully"}
    except Exception as e:
        return {"success": False, "message": str(e)}
    finally:
        conn.close()

def login_user(email, password):
    """Authenticate user"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT name, email, location, role FROM users
        WHERE email=? AND password=?
    ''', (email, password))
    
    user = cursor.fetchone()
    conn.close()
    
    if user:
        return {
            "success": True,
            "user": {
                "name": user[0],
                "email": user[1],
                "location": user[2],
                "role": user[3]
            }
        }
    return {"success": False, "message": "Invalid credentials"}

def get_all_users():
    """Get all registered users"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT name, email, location, role FROM users')
    users = cursor.fetchall()
    conn.close()
    
    return [
        {"name": u[0], "email": u[1], "location": u[2], "role": u[3]}
        for u in users
    ]

def delete_user(email):
    """Delete a user by email"""
    if email == "admin@gmail.com":
        return {"success": False, "message": "Cannot delete admin account"}
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM users WHERE email=?', (email,))
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    
    if deleted:
        return {"success": True, "message": "User deleted"}
    return {"success": False, "message": "User not found"}

# Initialize database on import
init_db()
