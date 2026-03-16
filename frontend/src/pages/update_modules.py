import os
import re

modules = [
    ("EarthquakePreparedness", "earthquakeProgress"),
    ("CycloneAwareness", "cycloneProgress"),
    ("FireSafetyQuiz", "fireProgress"),
    ("TsunamiSafety", "tsunamiProgress"),
    ("LandslideSafety", "landslideProgress"),
    ("DroughtPreparedness", "droughtProgress"),
    ("HeatwaveSafety", "heatwaveProgress"),
    ("LightningSafety", "lightningProgress"),
    ("FirstAidBasics", "firstaidProgress"),
    ("PandemicPreparedness", "pandemicProgress"),
    ("ChemicalSpillSafety", "chemicalProgress"),
    ("NuclearEmergency", "nuclearProgress"),
    ("BuildingCollapse", "collapseProgress"),
    ("EmergencyCommunication", "commProgress"),
    ("SurvivalSkills", "survivalProgress"),
    ("PetSafety", "petProgress"),
    ("EmergencyTech", "techProgress"),
    ("PsychologicalFirstAid", "psychProgress")
]

for module_name, storage_key in modules:
    filename = f"{module_name}.js"
    if not os.path.exists(filename):
        print(f"Skipping {filename} - not found")
        continue
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add isAdmin state
    if '[isAdmin, setIsAdmin] = useState(false);' not in content:
        content = content.replace(
            'const [quizResult, setQuizResult] = useState(null);',
            'const [quizResult, setQuizResult] = useState(null);\n  const [isAdmin, setIsAdmin] = useState(false);\n\n  useEffect(() => {\n    const user = JSON.parse(localStorage.getItem("user") || "{}");\n    setIsAdmin(user.email === "admin@gmail.com");\n  }, []);'
        )
    
    # Add resetProgress function
    if 'const resetProgress = () =>' not in content:
        reset_func = f'''
  const resetProgress = () => {{
    if (window.confirm("Are you sure you want to reset all progress for this module?")) {{
      localStorage.removeItem("{storage_key}");
      setCurrentCheckpoint(0);
      setCompletedCheckpoints([]);
      setScore(0);
      setModuleComplete(false);
      setQuizAnswers({{}});
      setQuizResult(null);
    }}
  }};'''
        content = content.replace(
            '  const retakeQuiz = () => {\n    setQuizAnswers({});\n    setQuizResult(null);\n  };',
            f'  const retakeQuiz = () => {{\n    setQuizAnswers({{}});\n    setQuizResult(null);\n  }};{reset_func}'
        )
    
    # Add reset button to progress stats
    if 'btn-reset-admin' not in content:
        # Find the progress-stats section and add button
        pattern = r'(<span>Checkpoint: \{currentCheckpoint \+ 1\}/\{checkpoints\.length\}</span>\s*)'
        replacement = r'\1{isAdmin && (\n                <button className="btn-reset-admin" onClick={resetProgress} title="Reset Progress (Admin Only)">\n                  🔄 Reset\n                </button>\n              )}\n              '
        content = re.sub(pattern, replacement, content)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated {filename}")

print("\nAll modules updated!")
