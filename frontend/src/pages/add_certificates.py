import os
import re

modules = [
    ("EarthquakePreparedness.js", "earthquakeProgress", "Earthquake Preparedness"),
    ("CycloneAwareness.js", "cycloneProgress", "Cyclone Awareness"),
    ("FireSafetyQuiz.js", "fireProgress", "Fire Safety"),
    ("TsunamiSafety.js", "tsunamiProgress", "Tsunami Safety"),
    ("LandslideSafety.js", "landslideProgress", "Landslide Safety"),
    ("DroughtPreparedness.js", "droughtProgress", "Drought Preparedness"),
    ("HeatwaveSafety.js", "heatwaveProgress", "Heatwave Safety"),
    ("LightningSafety.js", "lightningProgress", "Lightning Safety"),
    ("FirstAidBasics.js", "firstaidProgress", "First Aid Basics"),
    ("PandemicPreparedness.js", "pandemicProgress", "Pandemic Preparedness"),
    ("ChemicalSpillSafety.js", "chemicalProgress", "Chemical Spill Safety"),
    ("NuclearEmergency.js", "nuclearProgress", "Nuclear Emergency"),
    ("BuildingCollapse.js", "collapseProgress", "Building Collapse"),
    ("EmergencyCommunication.js", "commProgress", "Emergency Communication"),
    ("SurvivalSkills.js", "survivalProgress", "Survival Skills"),
    ("PetSafety.js", "petProgress", "Pet Safety"),
    ("EmergencyTech.js", "techProgress", "Emergency Tech"),
    ("PsychologicalFirstAid.js", "psychProgress", "Psychological First Aid")
]

for filename, progress_key, course_name in modules:
    if not os.path.exists(filename):
        print(f"Skipping {filename} - not found")
        continue
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already updated
    if 'isTeacherOrAdmin' in content:
        print(f"Already updated: {filename}")
        continue
    
    # Add isTeacherOrAdmin state
    content = re.sub(
        r'(const \[isAdmin, setIsAdmin\] = useState\(false\);)',
        r'\1\n  const [isTeacherOrAdmin, setIsTeacherOrAdmin] = useState(false);',
        content
    )
    
    # Update useEffect to set isTeacherOrAdmin
    content = re.sub(
        r'(setIsAdmin\(user\.email === "admin@gmail\.com"\);)',
        r'\1\n    setIsTeacherOrAdmin(user.role === "Teacher" || user.email === "admin@gmail.com");',
        content
    )
    
    # Add generateCertificate function before resetProgress
    cert_function = f'''  const generateCertificate = () => {{
    const user = JSON.parse(localStorage.getItem("user") || "{{}}");\n    const userName = user.name || "Student";
    const date = new Date().toLocaleDateString();
    
    alert(`Certificate Generated!\\\\n\\\\nThis certifies that ${{userName}} has successfully completed the {course_name} course on ${{date}}.\\\\n\\\\nScore: ${{score.toFixed(0)}} points\\\\nCompletion: 100%`);
  }};

'''
    content = re.sub(
        r'(  const resetProgress = \(\) => {)',
        cert_function + r'\1',
        content
    )
    
    # Add certificate button after "Back to Dashboard" button
    content = re.sub(
        r'(<button className="btn-continue" onClick=\{\(\) => navigate\(\'/home\'\)\}>\s*Back to Dashboard\s*</button>)',
        r'''\1
            {isTeacherOrAdmin && (
              <button className="btn-certificate" onClick={generateCertificate}>
                📜 Generate Certificate
              </button>
            )}''',
        content
    )
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated: {filename}")

print("\nAll modules updated!")
