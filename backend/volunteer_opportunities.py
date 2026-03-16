"""
Generate volunteer opportunities based on location, risk level, and curated organizations
"""
from datetime import datetime, timedelta
import random

# Curated disaster relief organizations in India
ORGANIZATIONS = {
    "Red Cross India": {
        "contact": "1800-111-911",
        "website": "https://indianredcross.org",
        "types": ["medical", "shelter", "food"]
    },
    "NDRF": {
        "contact": "011-26105908",
        "website": "https://ndrf.gov.in",
        "types": ["rescue", "evacuation", "medical"]
    },
    "Goonj": {
        "contact": "011-26972351",
        "website": "https://goonj.org",
        "types": ["relief", "food", "supplies"]
    },
    "Rapid Response": {
        "contact": "1800-180-1551",
        "website": "https://rapidresponse.org.in",
        "types": ["rescue", "medical", "transport"]
    }
}

# Opportunity templates based on disaster risk
OPPORTUNITY_TEMPLATES = {
    "CRITICAL": [
        {"title": "Emergency Rescue Support", "skills": ["First Aid", "Physical Fitness"], "duration": "12 hours"},
        {"title": "Medical Triage Assistant", "skills": ["Medical Training"], "duration": "8 hours"},
        {"title": "Evacuation Coordinator", "skills": ["Communication", "Leadership"], "duration": "10 hours"},
        {"title": "Emergency Shelter Setup", "skills": ["Physical Labor"], "duration": "6 hours"}
    ],
    "HIGH": [
        {"title": "Relief Supply Distribution", "skills": ["Driving", "Organization"], "duration": "6 hours"},
        {"title": "Community Alert Coordinator", "skills": ["Communication"], "duration": "4 hours"},
        {"title": "Emergency Hotline Support", "skills": ["Communication"], "duration": "8 hours"},
        {"title": "Shelter Staff Support", "skills": ["First Aid"], "duration": "8 hours"}
    ],
    "MEDIUM": [
        {"title": "Preparedness Training Assistant", "skills": ["Teaching"], "duration": "4 hours"},
        {"title": "Supply Inventory Management", "skills": ["Organization"], "duration": "4 hours"},
        {"title": "Community Awareness Drive", "skills": ["Communication"], "duration": "3 hours"},
        {"title": "Food Distribution Support", "skills": ["None"], "duration": "4 hours"}
    ],
    "LOW": [
        {"title": "Disaster Preparedness Workshop", "skills": ["Teaching"], "duration": "3 hours"},
        {"title": "Community Survey Volunteer", "skills": ["Communication"], "duration": "2 hours"},
        {"title": "Supply Kit Assembly", "skills": ["None"], "duration": "3 hours"},
        {"title": "Awareness Material Distribution", "skills": ["None"], "duration": "2 hours"}
    ]
}

def generate_volunteer_opportunities(location, risk_level="MEDIUM", count=6):
    """Generate location-aware volunteer opportunities based on risk level"""
    
    opportunities = []
    templates = OPPORTUNITY_TEMPLATES.get(risk_level, OPPORTUNITY_TEMPLATES["MEDIUM"])
    
    # Select random templates
    selected = random.sample(templates, min(count, len(templates)))
    
    # Generate opportunities with realistic data
    for i, template in enumerate(selected):
        org_name = random.choice(list(ORGANIZATIONS.keys()))
        org = ORGANIZATIONS[org_name]
        
        # Generate date (next 7 days)
        days_ahead = random.randint(0, 6)
        opp_date = datetime.now() + timedelta(days=days_ahead)
        
        # Generate time slots
        hour = random.randint(7, 18)
        duration_hours = int(template["duration"].split()[0])
        time_str = f"{hour:02d}:00 - {(hour + duration_hours) % 24:02d}:00"
        
        # Calculate slots (more urgent = more slots needed)
        if risk_level == "CRITICAL":
            total_slots = random.randint(15, 30)
            filled_slots = random.randint(2, 8)
        elif risk_level == "HIGH":
            total_slots = random.randint(10, 20)
            filled_slots = random.randint(3, 10)
        else:
            total_slots = random.randint(5, 15)
            filled_slots = random.randint(2, 8)
        
        # Determine urgency
        urgency_map = {
            "CRITICAL": "critical",
            "HIGH": "high",
            "MEDIUM": "medium",
            "LOW": "low"
        }
        
        opportunities.append({
            "id": i + 1,
            "title": template["title"],
            "organization": org_name,
            "contact": org["contact"],
            "location": location,
            "date": opp_date.strftime("%Y-%m-%d"),
            "time": time_str,
            "duration": template["duration"],
            "slots": f"{filled_slots}/{total_slots}",
            "slots_available": total_slots - filled_slots,
            "skills": template["skills"],
            "urgency": urgency_map.get(risk_level, "medium"),
            "description": f"Support {org_name} in {template['title'].lower()} operations in {location}."
        })
    
    return opportunities


def get_organization_contacts():
    """Return curated list of disaster relief organizations"""
    return [
        {
            "name": name,
            "contact": info["contact"],
            "website": info["website"],
            "services": ", ".join(info["types"])
        }
        for name, info in ORGANIZATIONS.items()
    ]
