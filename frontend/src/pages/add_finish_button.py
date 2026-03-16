import os
import re

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

for filename in modules:
    if not os.path.exists(filename):
        print(f"Skipping {filename}")
        continue
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already updated
    if 'instantFinish' in content:
        print(f"Already updated: {filename}")
        continue
    
    # Add instantFinish function after generateCertificate
    instant_finish = '''
  const instantFinish = () => {
    if (window.confirm("Complete this module instantly? This will mark all checkpoints as completed.")) {
      const allCompleted = checkpoints.map((_, i) => i);
      setCompletedCheckpoints(allCompleted);
      setCurrentCheckpoint(checkpoints.length - 1);
      setScore(800);
      setModuleComplete(true);
      saveProgress(checkpoints.length - 1, allCompleted, 800);
    }
  };
'''
    
    content = re.sub(
        r'(  const resetProgress = \(\) => {)',
        instant_finish + r'\1',
        content
    )
    
    # Update the admin buttons section
    content = re.sub(
        r'(\s+{isAdmin && \(\s+<button className="btn-reset-admin")',
        r'''              {isAdmin && (
                <>
                  <button className="btn-finish-admin" onClick={instantFinish} title="Instantly Complete Module (Admin Only)">
                    ⚡ Finish
                  </button>
                  <button className="btn-reset-admin"''',
        content
    )
    
    content = re.sub(
        r'(Reset\s*</button>\s+)\)',
        r'''\1
                </>
              )}''',
        content
    )
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated: {filename}")

print("\nAll modules updated!")
