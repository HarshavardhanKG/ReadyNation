import os

modules = [
    "EarthquakePreparedness.js",
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

for module_file in modules:
    if not os.path.exists(module_file):
        continue
    
    with open(module_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Try different patterns
    patterns = [
        ('<Navbar />', '<Navbar onSidebarToggle={(isOpen) => document.body.classList.toggle(\'sidebar-active\', isOpen)} />'),
        ('<div className="gamified-learning-page">', '<div className="gamified-learning-page page-content-wrapper">')
    ]
    
    modified = False
    for old, new in patterns:
        if old in content and new not in content:
            content = content.replace(old, new)
            modified = True
    
    if modified:
        with open(module_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {module_file}")
    else:
        print(f"Already updated or pattern not found: {module_file}")

print("\nDone!")
