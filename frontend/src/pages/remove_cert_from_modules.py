import os
import re

modules = [
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

for filename in modules:
    if not os.path.exists(filename):
        print(f"Skipping {filename}")
        continue
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove isTeacherOrAdmin state
    content = re.sub(
        r'\s*const \[isTeacherOrAdmin, setIsTeacherOrAdmin\] = useState\(false\);',
        '',
        content
    )
    
    # Remove setIsTeacherOrAdmin line
    content = re.sub(
        r'\s*setIsTeacherOrAdmin\(user\.role === "Teacher" \|\| user\.email === "admin@gmail\.com"\);',
        '',
        content
    )
    
    # Remove generateCertificate function
    content = re.sub(
        r'  const generateCertificate = \(\) => \{[^}]+\};\s*\n',
        '',
        content,
        flags=re.DOTALL
    )
    
    # Remove certificate button from completion card
    content = re.sub(
        r'\s*\{isTeacherOrAdmin && \(\s*<button className="btn-certificate"[^>]+>[^<]+</button>\s*\)\}',
        '',
        content
    )
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated: {filename}")

print("\nAll modules updated!")
