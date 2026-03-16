import os
import re

modules = [
    ("EarthquakePreparedness.js", "earthquakeProgress"),
    ("CycloneAwareness.js", "cycloneProgress"),
    ("FireSafetyQuiz.js", "fireProgress"),
    ("TsunamiSafety.js", "tsunamiProgress"),
    ("LandslideSafety.js", "landslideProgress"),
    ("DroughtPreparedness.js", "droughtProgress"),
    ("HeatwaveSafety.js", "heatwaveProgress"),
    ("LightningSafety.js", "lightningProgress"),
    ("FirstAidBasics.js", "firstaidProgress"),
    ("PandemicPreparedness.js", "pandemicProgress"),
    ("ChemicalSpillSafety.js", "chemicalProgress"),
    ("NuclearEmergency.js", "nuclearProgress"),
    ("BuildingCollapse.js", "collapseProgress"),
    ("EmergencyCommunication.js", "commProgress"),
    ("SurvivalSkills.js", "survivalProgress"),
    ("PetSafety.js", "petProgress"),
    ("EmergencyTech.js", "techProgress"),
    ("PsychologicalFirstAid.js", "psychProgress")
]

for filename, progress_key in modules:
    if not os.path.exists(filename):
        continue
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update the first useEffect to load progress with email prefix
    old_pattern = f'const saved = JSON.parse\\(localStorage.getItem\\("{progress_key}"\\) \\|\\| "\\{{\\}}"\\);'
    new_code = f'''const user = JSON.parse(localStorage.getItem("user") || "{{}}");\n    const progressKey = user.email ? `${{user.email}}_{progress_key}` : "{progress_key}";\n    const saved = JSON.parse(localStorage.getItem(progressKey) || "{{}}")'''
    
    content = re.sub(old_pattern, new_code, content)
    
    # Update saveProgress function
    old_save = f'localStorage.setItem\\("{progress_key}", JSON.stringify\\(progress\\)\\);'
    new_save = f'''const user = JSON.parse(localStorage.getItem("user") || "{{}}");\n    const progressKey = user.email ? `${{user.email}}_{progress_key}` : "{progress_key}";\n    localStorage.setItem(progressKey, JSON.stringify(progress));'''
    
    content = re.sub(old_save, new_save, content)
    
    # Update resetProgress function
    old_reset = f'localStorage.removeItem\\("{progress_key}"\\);'
    new_reset = f'''const user = JSON.parse(localStorage.getItem("user") || "{{}}");\n      const progressKey = user.email ? `${{user.email}}_{progress_key}` : "{progress_key}";\n      localStorage.removeItem(progressKey);'''
    
    content = re.sub(old_reset, new_reset, content)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated: {filename}")

print("\nAll modules updated!")
