import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import "./DisasterChecklist.css";

export default function DisasterChecklist() {
  const [selectedType, setSelectedType] = useState("");
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("checklistProgress") || "{}");
    setCheckedItems(saved);
  }, []);

  const toggleItem = (type, index) => {
    const key = `${type}-${index}`;
    const newChecked = { ...checkedItems, [key]: !checkedItems[key] };
    setCheckedItems(newChecked);
    localStorage.setItem("checklistProgress", JSON.stringify(newChecked));
  };

  const getProgress = (type) => {
    const items = disasterChecklists[type];
    const completed = items.filter((_, i) => checkedItems[`${type}-${i}`]).length;
    return { completed, total: items.length, percentage: ((completed / items.length) * 100).toFixed(0) };
  };

  const disasterChecklists = {
    earthquake: [
      { item: "Emergency water supply", detail: "1 gallon per person per day for at least 3 days", priority: "high" },
      { item: "Non-perishable food", detail: "3-day supply for each family member", priority: "high" },
      { item: "First aid kit", detail: "Include bandages, antiseptic, medications, scissors", priority: "high" },
      { item: "Flashlight and batteries", detail: "LED flashlight with extra batteries or hand-crank option", priority: "high" },
      { item: "Battery-powered radio", detail: "NOAA Weather Radio with tone alert", priority: "medium" },
      { item: "Whistle", detail: "To signal for help if trapped", priority: "medium" },
      { item: "Dust masks", detail: "N95 masks to filter contaminated air", priority: "medium" },
      { item: "Plastic sheeting and duct tape", detail: "To shelter in place and seal windows/doors", priority: "medium" },
      { item: "Wrench or pliers", detail: "To turn off utilities (gas, water)", priority: "high" },
      { item: "Manual can opener", detail: "For canned food", priority: "medium" },
      { item: "Local maps", detail: "In case GPS is unavailable", priority: "low" },
      { item: "Cell phone with chargers", detail: "Include solar or battery backup charger", priority: "high" }
    ],
    flood: [
      { item: "Waterproof containers", detail: "For important documents, photos, valuables", priority: "high" },
      { item: "Life jackets", detail: "One for each family member", priority: "high" },
      { item: "Rubber boots", detail: "Waterproof boots for wading through water", priority: "medium" },
      { item: "Emergency water supply", detail: "1 gallon per person per day for 3 days", priority: "high" },
      { item: "Sandbags", detail: "To divert water away from home", priority: "medium" },
      { item: "Battery-powered sump pump", detail: "Backup if power fails", priority: "medium" },
      { item: "Waterproof flashlight", detail: "LED with extra batteries", priority: "high" },
      { item: "Emergency food supply", detail: "Non-perishable, 3-day supply", priority: "high" },
      { item: "First aid kit", detail: "Waterproof container with medical supplies", priority: "high" },
      { item: "Battery-powered radio", detail: "For weather updates and emergency alerts", priority: "high" },
      { item: "Rope", detail: "50 feet of strong rope for rescue", priority: "medium" },
      { item: "Whistle", detail: "To signal for help", priority: "medium" }
    ],
    fire: [
      { item: "Fire extinguisher", detail: "ABC-type, check pressure monthly", priority: "high" },
      { item: "N95 masks", detail: "For smoke protection", priority: "high" },
      { item: "Emergency ladder", detail: "For multi-story homes, practice using it", priority: "high" },
      { item: "Fireproof safe", detail: "For important documents, hard drives, valuables", priority: "medium" },
      { item: "Emergency contact list", detail: "Printed list with phone numbers", priority: "high" },
      { item: "Flashlight", detail: "One per person with extra batteries", priority: "high" },
      { item: "Battery-powered radio", detail: "For emergency broadcasts", priority: "medium" },
      { item: "First aid kit", detail: "Include burn treatment supplies", priority: "high" },
      { item: "Emergency water and food", detail: "3-day supply, stored away from kitchen", priority: "high" },
      { item: "Escape route map", detail: "Two exits from each room, practice regularly", priority: "high" },
      { item: "Smoke detectors", detail: "Test monthly, replace batteries yearly", priority: "high" },
      { item: "Fire blanket", detail: "To smother small fires or wrap around person", priority: "medium" }
    ],
    cyclone: [
      { item: "Plywood sheets", detail: "5/8 inch thick to board up windows", priority: "high" },
      { item: "Generator", detail: "Portable, keep outdoors, 20+ feet from home", priority: "medium" },
      { item: "Fuel for generator", detail: "Store safely, rotate stock regularly", priority: "medium" },
      { item: "Weather radio", detail: "Battery-powered NOAA radio with alerts", priority: "high" },
      { item: "Emergency water and food", detail: "1 week supply for all family members", priority: "high" },
      { item: "Flashlights and batteries", detail: "Multiple flashlights, LED preferred", priority: "high" },
      { item: "First aid kit", detail: "Comprehensive kit with prescription medications", priority: "high" },
      { item: "Plastic sheeting and duct tape", detail: "Heavy-duty plastic for emergency repairs", priority: "medium" },
      { item: "Manual can opener", detail: "For canned food", priority: "medium" },
      { item: "Important documents", detail: "In waterproof container: IDs, insurance, deeds", priority: "high" },
      { item: "Cash", detail: "ATMs may not work, small bills preferred", priority: "medium" },
      { item: "Chainsaw", detail: "For clearing debris, include safety gear", priority: "low" }
    ],
    tsunami: [
      { item: "Evacuation plan", detail: "Know routes to high ground, practice regularly", priority: "high" },
      { item: "Waterproof emergency kit", detail: "Go-bag with essentials, easy to grab", priority: "high" },
      { item: "Life jackets", detail: "Coast Guard approved, one per person", priority: "high" },
      { item: "Emergency whistle", detail: "Loud whistle to signal location", priority: "high" },
      { item: "Battery-powered radio", detail: "For tsunami warnings and updates", priority: "high" },
      { item: "Flashlight and batteries", detail: "Waterproof LED flashlight", priority: "high" },
      { item: "First aid kit", detail: "Waterproof container with supplies", priority: "high" },
      { item: "Emergency food and water", detail: "3-day supply in waterproof containers", priority: "high" },
      { item: "Important documents", detail: "Waterproof bag: IDs, insurance, medical records", priority: "high" },
      { item: "Emergency contacts", detail: "Laminated card with phone numbers", priority: "high" },
      { item: "Sturdy shoes", detail: "Closed-toe shoes for walking through debris", priority: "medium" },
      { item: "Rope", detail: "50+ feet for rescue or securing items", priority: "medium" }
    ],
    drought: [
      { item: "Water storage containers", detail: "Food-grade containers, 55+ gallons total", priority: "high" },
      { item: "Water purification tablets", detail: "Or portable water filter system", priority: "high" },
      { item: "Non-perishable food", detail: "2-week supply, low-water preparation", priority: "high" },
      { item: "First aid kit", detail: "Include rehydration salts", priority: "medium" },
      { item: "Sun protection", detail: "Hats, sunscreen SPF 30+, sunglasses", priority: "medium" },
      { item: "Emergency cash", detail: "Small bills, $200+ recommended", priority: "medium" },
      { item: "Battery-powered radio", detail: "For water restriction updates", priority: "medium" },
      { item: "Flashlight and batteries", detail: "In case of power outages", priority: "medium" },
      { item: "Important documents", detail: "Copies of IDs, insurance, property deeds", priority: "high" },
      { item: "Emergency contact list", detail: "Local and out-of-area contacts", priority: "medium" },
      { item: "Hygiene supplies", detail: "Hand sanitizer, wet wipes, minimal water use", priority: "medium" },
      { item: "Drought-resistant seeds", detail: "For growing food with minimal water", priority: "low" }
    ],
    landslide: [
      { item: "Evacuation plan", detail: "Know escape routes, practice with family", priority: "high" },
      { item: "Emergency alert system", detail: "Sign up for local geological warnings", priority: "high" },
      { item: "Sturdy shoes", detail: "Closed-toe boots for debris navigation", priority: "high" },
      { item: "Emergency supplies", detail: "Water, food, first aid for 3 days", priority: "high" },
      { item: "Flashlight and batteries", detail: "LED flashlight with backup power", priority: "high" },
      { item: "Battery-powered radio", detail: "For emergency updates", priority: "high" },
      { item: "Whistle", detail: "To signal for help if trapped", priority: "medium" },
      { item: "Dust masks", detail: "N95 masks for dust protection", priority: "medium" },
      { item: "Important documents", detail: "Waterproof container with IDs, insurance", priority: "high" },
      { item: "Emergency contacts", detail: "List of family and emergency services", priority: "high" },
      { item: "Rope", detail: "50+ feet for rescue operations", priority: "medium" },
      { item: "Tarp and plastic sheeting", detail: "For emergency shelter", priority: "medium" }
    ],
    heatwave: [
      { item: "Cooling supplies", detail: "Fans, ice packs, cooling towels", priority: "high" },
      { item: "Extra water supply", detail: "2 gallons per person per day", priority: "high" },
      { item: "Electrolyte drinks", detail: "Sports drinks or rehydration salts", priority: "high" },
      { item: "Sun protection", detail: "SPF 50+ sunscreen, wide-brim hats, UV sunglasses", priority: "high" },
      { item: "Light-colored clothing", detail: "Loose, breathable fabrics", priority: "medium" },
      { item: "First aid kit", detail: "Include heat exhaustion treatment supplies", priority: "high" },
      { item: "Thermometer", detail: "To monitor body temperature", priority: "medium" },
      { item: "Battery-powered fan", detail: "Backup if power fails", priority: "medium" },
      { item: "Window coverings", detail: "Reflective blinds or blackout curtains", priority: "medium" },
      { item: "Emergency contacts", detail: "Doctor, cooling centers, emergency services", priority: "high" },
      { item: "Medications", detail: "Extra supply, store in cool place", priority: "high" },
      { item: "Misting bottle", detail: "For cooling skin surface", priority: "low" }
    ],
    lightning: [
      { item: "Surge protectors", detail: "For all electronics and appliances", priority: "high" },
      { item: "Lightning rods", detail: "Professional installation on home", priority: "medium" },
      { item: "Battery backup", detail: "UPS for critical devices", priority: "medium" },
      { item: "Weather radio", detail: "NOAA radio with storm alerts", priority: "high" },
      { item: "First aid kit", detail: "Include burn treatment supplies", priority: "high" },
      { item: "Flashlights", detail: "LED with extra batteries", priority: "high" },
      { item: "Emergency plan", detail: "Know safe locations in home", priority: "high" },
      { item: "Unplugged device list", detail: "Checklist of items to unplug during storms", priority: "medium" },
      { item: "Emergency contacts", detail: "Electrician, insurance, emergency services", priority: "medium" },
      { item: "Fire extinguisher", detail: "ABC-type for electrical fires", priority: "high" },
      { item: "Battery-powered devices", detail: "Backup communication devices", priority: "medium" },
      { item: "Grounding equipment", detail: "Ensure proper home grounding", priority: "medium" }
    ],
    firstaid: [
      { item: "Comprehensive first aid kit", detail: "100+ pieces, FDA approved", priority: "high" },
      { item: "CPR mask", detail: "One-way valve for safe resuscitation", priority: "high" },
      { item: "AED device", detail: "Automated External Defibrillator", priority: "medium" },
      { item: "Trauma shears", detail: "For cutting clothing and bandages", priority: "high" },
      { item: "Tourniquet", detail: "CAT or SOFT-T tourniquet", priority: "high" },
      { item: "Hemostatic gauze", detail: "QuikClot or similar for severe bleeding", priority: "high" },
      { item: "Splinting materials", detail: "SAM splint and elastic bandages", priority: "medium" },
      { item: "Burn treatment", detail: "Burn gel, non-stick dressings", priority: "high" },
      { item: "Emergency medications", detail: "EpiPen, aspirin, antihistamines", priority: "high" },
      { item: "Medical gloves", detail: "Nitrile gloves, multiple sizes", priority: "high" },
      { item: "First aid manual", detail: "Current Red Cross or equivalent guide", priority: "high" },
      { item: "Emergency blanket", detail: "Mylar thermal blanket for shock", priority: "medium" }
    ],
    pandemic: [
      { item: "Face masks", detail: "N95/KN95 masks, 30+ day supply", priority: "high" },
      { item: "Hand sanitizer", detail: "70%+ alcohol, multiple bottles", priority: "high" },
      { item: "Disinfecting supplies", detail: "EPA-approved disinfectants, wipes", priority: "high" },
      { item: "Thermometer", detail: "Digital, no-contact preferred", priority: "high" },
      { item: "Medications", detail: "90-day supply of prescriptions", priority: "high" },
      { item: "Food supply", detail: "2-week non-perishable food stock", priority: "high" },
      { item: "Water supply", detail: "1 gallon per person per day, 2 weeks", priority: "high" },
      { item: "Cleaning supplies", detail: "Soap, bleach, paper towels", priority: "high" },
      { item: "Medical supplies", detail: "Pain relievers, cough medicine, vitamins", priority: "medium" },
      { item: "Isolation supplies", detail: "Separate room supplies for sick family member", priority: "medium" },
      { item: "Communication devices", detail: "Phone, internet backup options", priority: "high" },
      { item: "Entertainment", detail: "Books, games for extended isolation", priority: "low" }
    ],
    chemical: [
      { item: "Gas masks", detail: "Full-face respirator with filters", priority: "high" },
      { item: "Protective clothing", detail: "Tyvek suits, gloves, boots", priority: "high" },
      { item: "Duct tape and plastic", detail: "To seal room for shelter-in-place", priority: "high" },
      { item: "Emergency water", detail: "Sealed bottled water, 3-day supply", priority: "high" },
      { item: "Battery-powered radio", detail: "For evacuation orders", priority: "high" },
      { item: "Evacuation kit", detail: "Ready-to-go bag with essentials", priority: "high" },
      { item: "First aid kit", detail: "Include eye wash, burn treatment", priority: "high" },
      { item: "Flashlight", detail: "Explosion-proof if possible", priority: "high" },
      { item: "Emergency contacts", detail: "HAZMAT team, poison control, hospital", priority: "high" },
      { item: "Decontamination supplies", detail: "Soap, water containers, towels", priority: "medium" },
      { item: "Important documents", detail: "In sealed waterproof container", priority: "medium" },
      { item: "Vehicle fuel", detail: "Keep tank at least half full", priority: "medium" }
    ],
    nuclear: [
      { item: "Potassium iodide tablets", detail: "FDA-approved, check expiration", priority: "high" },
      { item: "Radiation detector", detail: "Geiger counter or dosimeter", priority: "medium" },
      { item: "Shelter supplies", detail: "Food, water for 2+ weeks", priority: "high" },
      { item: "Plastic sheeting and duct tape", detail: "Heavy-duty, to seal shelter", priority: "high" },
      { item: "Battery-powered radio", detail: "For emergency broadcasts", priority: "high" },
      { item: "Protective clothing", detail: "Full-body coverage, disposable", priority: "high" },
      { item: "Dust masks", detail: "N95 or better, multiple per person", priority: "high" },
      { item: "Decontamination supplies", detail: "Soap, shampoo, plastic bags for contaminated items", priority: "high" },
      { item: "First aid kit", detail: "Comprehensive with radiation burn treatment", priority: "high" },
      { item: "Flashlights and batteries", detail: "Multiple, long-lasting LED", priority: "high" },
      { item: "Emergency contacts", detail: "Nuclear facility, emergency services", priority: "high" },
      { item: "Evacuation plan", detail: "Multiple routes, meeting points", priority: "high" }
    ],
    collapse: [
      { item: "Emergency whistle", detail: "Loud, durable whistle for signaling", priority: "high" },
      { item: "Flashlight", detail: "Small, bright LED with extra batteries", priority: "high" },
      { item: "Dust mask", detail: "N95 for debris and dust", priority: "high" },
      { item: "Crowbar or pry bar", detail: "For moving debris", priority: "high" },
      { item: "Work gloves", detail: "Heavy-duty leather gloves", priority: "high" },
      { item: "First aid kit", detail: "Trauma supplies, tourniquets", priority: "high" },
      { item: "Water and food", detail: "3-day emergency supply", priority: "high" },
      { item: "Emergency blanket", detail: "Mylar thermal blanket", priority: "medium" },
      { item: "Battery-powered radio", detail: "For rescue coordination", priority: "high" },
      { item: "Rope", detail: "100+ feet, high strength", priority: "medium" },
      { item: "Hard hat", detail: "ANSI-approved safety helmet", priority: "medium" },
      { item: "Emergency contacts", detail: "Laminated card with numbers", priority: "high" }
    ],
    communication: [
      { item: "Cell phone with chargers", detail: "Wall, car, and solar chargers", priority: "high" },
      { item: "Portable power bank", detail: "20,000+ mAh capacity", priority: "high" },
      { item: "Battery-powered radio", detail: "NOAA Weather Radio", priority: "high" },
      { item: "Two-way radios", detail: "FRS/GMRS radios, one per family member", priority: "medium" },
      { item: "Emergency contact list", detail: "Printed and laminated", priority: "high" },
      { item: "Whistle", detail: "For non-electronic signaling", priority: "medium" },
      { item: "Signal mirror", detail: "For long-distance signaling", priority: "low" },
      { item: "Flares or glow sticks", detail: "For nighttime signaling", priority: "medium" },
      { item: "Satellite phone", detail: "For areas without cell coverage", priority: "low" },
      { item: "Ham radio", detail: "Amateur radio with license", priority: "low" },
      { item: "Emergency beacon", detail: "Personal locator beacon (PLB)", priority: "medium" },
      { item: "Social media plan", detail: "Designated check-in person/platform", priority: "medium" }
    ],
    survival: [
      { item: "Water purification", detail: "Tablets, filter, or UV purifier", priority: "high" },
      { item: "Fire starting kit", detail: "Matches, lighter, ferro rod", priority: "high" },
      { item: "Multi-tool", detail: "Leatherman or similar with knife", priority: "high" },
      { item: "Emergency shelter", detail: "Tent or tarp with paracord", priority: "high" },
      { item: "Sleeping bag", detail: "Rated for local climate", priority: "high" },
      { item: "Navigation tools", detail: "Compass and local maps", priority: "high" },
      { item: "Emergency food", detail: "High-calorie bars, freeze-dried meals", priority: "high" },
      { item: "First aid kit", detail: "Wilderness-specific supplies", priority: "high" },
      { item: "Cordage", detail: "550 paracord, 100+ feet", priority: "medium" },
      { item: "Signaling devices", detail: "Whistle, mirror, flares", priority: "medium" },
      { item: "Knife", detail: "Fixed blade, full tang", priority: "high" },
      { item: "Emergency blanket", detail: "Mylar space blanket", priority: "medium" }
    ],
    pet: [
      { item: "Pet carrier", detail: "Sturdy, well-ventilated for each pet", priority: "high" },
      { item: "Pet food and water", detail: "2-week supply", priority: "high" },
      { item: "Medications", detail: "30-day supply with instructions", priority: "high" },
      { item: "Medical records", detail: "Vaccination records, vet contact", priority: "high" },
      { item: "Pet first aid kit", detail: "Bandages, antiseptic, tweezers", priority: "high" },
      { item: "Leash and collar", detail: "With ID tags and microchip info", priority: "high" },
      { item: "Recent photos", detail: "For identification if separated", priority: "medium" },
      { item: "Litter box and litter", detail: "For cats, 2-week supply", priority: "medium" },
      { item: "Comfort items", detail: "Favorite toys, blanket", priority: "low" },
      { item: "Pet-friendly shelter list", detail: "Pre-identified evacuation locations", priority: "high" },
      { item: "Muzzle", detail: "Even friendly pets may bite when scared", priority: "medium" },
      { item: "Sanitation supplies", detail: "Waste bags, paper towels, disinfectant", priority: "medium" }
    ],
    tech: [
      { item: "Portable power bank", detail: "20,000+ mAh, multiple ports", priority: "high" },
      { item: "Solar charger", detail: "Foldable panel, 20W+ output", priority: "high" },
      { item: "USB cables", detail: "Multiple types: USB-C, Lightning, Micro-USB", priority: "high" },
      { item: "Battery-powered radio", detail: "With USB charging port", priority: "high" },
      { item: "Flashlight with USB", detail: "Rechargeable LED flashlight", priority: "high" },
      { item: "Backup hard drive", detail: "With important documents and photos", priority: "high" },
      { item: "Waterproof cases", detail: "For phones and electronics", priority: "medium" },
      { item: "Hand-crank charger", detail: "Manual power generation", priority: "medium" },
      { item: "Surge protectors", detail: "For all critical devices", priority: "medium" },
      { item: "Offline maps", detail: "Downloaded to phone/GPS device", priority: "high" },
      { item: "Emergency apps", detail: "Red Cross, FEMA, weather apps", priority: "high" },
      { item: "Backup batteries", detail: "AA, AAA, various sizes", priority: "high" }
    ],
    psychological: [
      { item: "Emergency contact list", detail: "Mental health hotlines, therapists", priority: "high" },
      { item: "Comfort items", detail: "Photos, journals, stress balls", priority: "medium" },
      { item: "Medications", detail: "30-day supply of mental health meds", priority: "high" },
      { item: "Self-care supplies", detail: "Hygiene items, comfort foods", priority: "medium" },
      { item: "Entertainment", detail: "Books, games, music for distraction", priority: "medium" },
      { item: "Breathing exercise guide", detail: "Printed instructions for anxiety", priority: "medium" },
      { item: "Support network list", detail: "Friends, family, support groups", priority: "high" },
      { item: "Routine checklist", detail: "Daily activities to maintain normalcy", priority: "medium" },
      { item: "Crisis plan", detail: "Steps to take during mental health crisis", priority: "high" },
      { item: "Grounding objects", detail: "Items for sensory grounding techniques", priority: "low" },
      { item: "Emergency therapy info", detail: "Telehealth options, crisis centers", priority: "high" },
      { item: "Positive affirmations", detail: "Written reminders and coping statements", priority: "low" }
    ]
  };

  return (
    <>
      <Navbar />
      <div className="checklist-page">
        <BackButton />
        <header className="page-header">
          <h1>📋 Disaster Preparedness Checklist</h1>
        </header>

      <div className="selector-section">
        <label htmlFor="disaster-select">Select Disaster Type:</label>
        <select 
          id="disaster-select"
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
          className="disaster-dropdown"
        >
          <option value="">-- Choose a disaster type --</option>
          <option value="earthquake">🏚️ Earthquake</option>
          <option value="flood">🌊 Flood</option>
          <option value="fire">🔥 Fire</option>
          <option value="cyclone">🌀 Cyclone</option>
          <option value="tsunami">🌊 Tsunami</option>
          <option value="drought">☀️ Drought</option>
          <option value="landslide">⛰️ Landslide</option>
          <option value="heatwave">🌡️ Heatwave</option>
          <option value="lightning">⚡ Lightning</option>
          <option value="firstaid">🩹 First Aid</option>
          <option value="pandemic">🦠 Pandemic</option>
          <option value="chemical">☣️ Chemical Spill</option>
          <option value="nuclear">☢️ Nuclear Emergency</option>
          <option value="collapse">🏗️ Building Collapse</option>
          <option value="communication">📡 Emergency Communication</option>
          <option value="survival">🏕️ Survival Skills</option>
          <option value="pet">🐾 Pet Safety</option>
          <option value="tech">💻 Emergency Tech</option>
          <option value="psychological">🧠 Psychological First Aid</option>
        </select>
      </div>

      {selectedType && (
        <motion.div 
          className="checklist-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="checklist-header">
            <h2>{selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Preparedness Checklist</h2>
            <div className="progress-indicator">
              <div className="progress-text">
                {getProgress(selectedType).completed} of {getProgress(selectedType).total} completed
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${getProgress(selectedType).percentage}%` }}></div>
              </div>
              <div className="progress-percentage">{getProgress(selectedType).percentage}%</div>
            </div>
          </div>
          <div className="items-list">
            {disasterChecklists[selectedType].map((itemObj, index) => {
              const key = `${selectedType}-${index}`;
              const isChecked = checkedItems[key] || false;
              return (
                <motion.div
                  key={index}
                  className={`checklist-item ${isChecked ? 'checked' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className={`priority-indicator priority-${itemObj.priority}`}></div>
                  <div className="item-content">
                    <div className="item-header">
                      <span className="item-text">{itemObj.item}</span>
                    </div>
                    <span className="item-detail">{itemObj.detail}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    id={key}
                    checked={isChecked}
                    onChange={() => toggleItem(selectedType, index)}
                    className="checkbox-input"
                  />
                  <label htmlFor={key} className="checkbox-label">
                    <span className="checkbox-custom"></span>
                  </label>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {!selectedType && (
        <div className="empty-state">
          <p>👆 Please select a disaster type from the dropdown above to view the checklist</p>
        </div>
      )}
      </div>
    </>
  );
}
