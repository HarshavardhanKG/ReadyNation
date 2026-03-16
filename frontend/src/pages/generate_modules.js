const fs = require('fs');

const modules = [
  { name: 'FirstAidBasics', title: 'First Aid Basics', icon: '🏥', storage: 'firstaidProgress', video: 'https://www.youtube.com/embed/C_Ux1k9_IuQ', route: 'first-aid',
    before: ['Learn CPR and basic life support', 'Keep first aid kit stocked', 'Take first aid training course', 'Know emergency numbers', 'Identify nearest hospital'],
    during: ['Stay calm and assess situation', 'Call for help immediately', 'Apply appropriate first aid', 'Monitor victim continuously', 'Do not move seriously injured'],
    after: ['Seek professional medical care', 'Document what happened', 'Restock first aid supplies', 'Review response effectiveness', 'Update training if needed']
  },
  { name: 'PandemicPreparedness', title: 'Pandemic Preparedness', icon: '🦠', storage: 'pandemicProgress', video: 'https://www.youtube.com/embed/BtN-goy9VOY', route: 'pandemic',
    before: ['Stock essential supplies', 'Get recommended vaccinations', 'Plan for remote work/school', 'Identify vulnerable family members', 'Learn about disease transmission'],
    during: ['Follow health guidelines', 'Practice social distancing', 'Wear masks when required', 'Maintain hygiene practices', 'Monitor health symptoms'],
    after: ['Continue preventive measures', 'Get medical checkups', 'Support community recovery', 'Maintain emergency supplies', 'Stay informed on updates']
  },
  { name: 'ChemicalSpillSafety', title: 'Chemical Spill Safety', icon: '☣️', storage: 'chemicalProgress', video: 'https://www.youtube.com/embed/7VL8Jqw3Vy8', route: 'chemical-spill',
    before: ['Know chemicals in your area', 'Understand evacuation routes', 'Prepare shelter-in-place supplies', 'Learn warning signals', 'Have emergency contacts ready'],
    during: ['Evacuate or shelter as directed', 'Seal windows and doors if sheltering', 'Turn off ventilation systems', 'Listen to emergency broadcasts', 'Avoid contaminated areas'],
    after: ['Follow decontamination procedures', 'Seek medical attention if exposed', 'Report health symptoms', 'Clean affected areas properly', 'Dispose of contaminated items']
  },
  { name: 'NuclearEmergency', title: 'Nuclear Emergency', icon: '☢️', storage: 'nuclearProgress', video: 'https://www.youtube.com/embed/Qj8AHwmDVQE', route: 'nuclear',
    before: ['Know nearest shelter locations', 'Prepare emergency kit', 'Understand radiation basics', 'Have battery-powered radio', 'Plan family communication'],
    during: ['Get inside immediately', 'Go to basement or center of building', 'Remove contaminated clothing', 'Seal windows and doors', 'Listen for official instructions'],
    after: ['Stay sheltered until cleared', 'Avoid contaminated areas', 'Follow decontamination procedures', 'Seek medical screening', 'Dispose of exposed items safely']
  },
  { name: 'BuildingCollapse', title: 'Building Collapse', icon: '🏗️', storage: 'collapseProgress', video: 'https://www.youtube.com/embed/Zy8ZcOhXpjE', route: 'building-collapse',
    before: ['Know building evacuation routes', 'Identify safe spots (doorways, desks)', 'Keep emergency supplies accessible', 'Report structural concerns', 'Participate in drills'],
    during: ['Drop, Cover, and Hold On', 'Protect head and neck', 'Stay away from windows', 'Do not use elevators', 'Exit carefully if safe'],
    after: ['Check for injuries', 'Evacuate if building damaged', 'Do not re-enter until cleared', 'Document damage', 'Report trapped persons']
  },
  { name: 'EmergencyCommunication', title: 'Emergency Communication', icon: '📡', storage: 'commProgress', video: 'https://www.youtube.com/embed/Zy8ZcOhXpjE', route: 'emergency-comm',
    before: ['Create family communication plan', 'Designate out-of-area contact', 'Learn multiple communication methods', 'Keep phone charged', 'Save emergency numbers'],
    during: ['Use text instead of calls', 'Keep messages brief', 'Follow official channels', 'Conserve phone battery', 'Check on vulnerable people'],
    after: ['Notify contacts you are safe', 'Report your status', 'Help others communicate', 'Document important information', 'Update contact lists']
  },
  { name: 'SurvivalSkills', title: 'Survival Skills', icon: '🎒', storage: 'survivalProgress', video: 'https://www.youtube.com/embed/Zy8ZcOhXpjE', route: 'survival',
    before: ['Learn basic survival skills', 'Pack survival kit', 'Know water purification methods', 'Practice fire starting', 'Learn shelter building'],
    during: ['Find or create shelter', 'Locate water source', 'Signal for help', 'Stay calm and conserve energy', 'Ration supplies wisely'],
    after: ['Seek medical attention', 'Rehydrate and rest', 'Replace used supplies', 'Share lessons learned', 'Update survival kit']
  },
  { name: 'PetSafety', title: 'Pet Safety', icon: '🐾', storage: 'petProgress', video: 'https://www.youtube.com/embed/Zy8ZcOhXpjE', route: 'pet-safety',
    before: ['Prepare pet emergency kit', 'Have pet carrier ready', 'Keep ID tags updated', 'Know pet-friendly shelters', 'Have recent pet photos'],
    during: ['Keep pets calm and secure', 'Bring pets indoors', 'Have leash/carrier ready', 'Keep pets with you', 'Monitor pet behavior'],
    after: ['Check pets for injuries', 'Maintain routine if possible', 'Watch for stress signs', 'Update pet records', 'Restock pet supplies']
  },
  { name: 'EmergencyTech', title: 'Emergency Tech', icon: '📱', storage: 'techProgress', video: 'https://www.youtube.com/embed/Zy8ZcOhXpjE', route: 'emergency-tech',
    before: ['Download emergency apps', 'Set up emergency alerts', 'Backup important data', 'Have portable chargers', 'Learn offline features'],
    during: ['Use emergency apps', 'Enable location services', 'Share location with family', 'Monitor official alerts', 'Conserve battery'],
    after: ['Charge all devices', 'Update emergency contacts', 'Review app effectiveness', 'Backup new data', 'Update software']
  },
  { name: 'PsychologicalFirstAid', title: 'Psychological First Aid', icon: '🧠', storage: 'psychProgress', video: 'https://www.youtube.com/embed/Zy8ZcOhXpjE', route: 'psych-aid',
    before: ['Learn stress management', 'Know mental health resources', 'Build support network', 'Practice self-care', 'Understand trauma responses'],
    during: ['Stay calm and present', 'Listen without judgment', 'Provide comfort and safety', 'Connect people to support', 'Respect individual needs'],
    after: ['Monitor for trauma signs', 'Seek professional help if needed', 'Maintain social connections', 'Practice self-care', 'Support community healing']
  }
];

console.log(JSON.stringify(modules, null, 2));
