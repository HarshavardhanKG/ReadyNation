import os

# All files that were modified
files = [
    "Home.js",
    "EmergencyContacts.js",
    "DisasterChecklist.js",
    "AlertsCenter.js",
    "RiskProfile.js",
    "VolunteerCoordination.js",
    "FloodSafety.js",
    "EarthquakePreparedness.js",
    "CycloneAwareness.js",
    "FireSafetyQuiz.js",
    "TsunamiSafety.js",
    "LandslideSafety.js",
    "DroughtPreparedness.js",
    "HeatwaveSafety.js",
    "LightningSafety.js",
    "FirstAidBasics.js",
    "PandemicPreparedness.js",
    "ChemicalSpillSafety.js",
    "NuclearEmergency.js",
    "BuildingCollapse.js",
    "EmergencyCommunication.js",
    "SurvivalSkills.js",
    "PetSafety.js",
    "EmergencyTech.js",
    "PsychologicalFirstAid.js"
]

for filename in files:
    if not os.path.exists(filename):
        continue
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Revert changes
    modified = False
    
    # Remove onSidebarToggle prop
    if 'onSidebarToggle={(isOpen) => document.body.classList.toggle(\'sidebar-active\', isOpen)}' in content:
        content = content.replace(
            '<Navbar onSidebarToggle={(isOpen) => document.body.classList.toggle(\'sidebar-active\', isOpen)} />',
            '<Navbar />'
        )
        modified = True
    
    # Remove page-content-wrapper class
    if 'page-content-wrapper' in content:
        content = content.replace(' page-content-wrapper', '')
        modified = True
    
    if modified:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Reverted {filename}")
    else:
        print(f"No changes needed: {filename}")

print("\nAll files reverted!")
