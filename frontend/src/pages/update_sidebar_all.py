import os
import re

# List of all learning module files
modules = [
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

for module_file in modules:
    file_path = module_file
    
    if not os.path.exists(file_path):
        print(f"Skipping {module_file} - file not found")
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the return statement
    old_pattern = r'  return \(\s*<>\s*<Navbar />\s*<div className="gamified-learning-page">'
    new_pattern = '  return (\n    <>\n      <Navbar onSidebarToggle={(isOpen) => document.body.classList.toggle(\'sidebar-active\', isOpen)} />\n      <div className="gamified-learning-page page-content-wrapper">'
    
    if re.search(old_pattern, content):
        content = re.sub(old_pattern, new_pattern, content)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Updated {module_file}")
    else:
        print(f"Pattern not found in {module_file}")

print("\nAll modules updated!")
