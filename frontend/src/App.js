import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import EmergencyContacts from "./pages/EmergencyContacts";
import DisasterChecklist from "./pages/DisasterChecklist";
import AlertsCenter from "./pages/AlertsCenter";
import VolunteerCoordination from "./pages/VolunteerCoordination";
import RiskProfile from "./pages/RiskProfile";
import FloodSafety from "./pages/FloodSafety";
import EarthquakePreparedness from "./pages/EarthquakePreparedness";
import CycloneAwareness from "./pages/CycloneAwareness";
import FireSafetyQuiz from "./pages/FireSafetyQuiz";
import TsunamiSafety from "./pages/TsunamiSafety";
import LandslideSafety from "./pages/LandslideSafety";
import DroughtPreparedness from "./pages/DroughtPreparedness";
import HeatwaveSafety from "./pages/HeatwaveSafety";
import LightningSafety from "./pages/LightningSafety";
import FirstAidBasics from "./pages/FirstAidBasics";
import PandemicPreparedness from "./pages/PandemicPreparedness";
import ChemicalSpillSafety from "./pages/ChemicalSpillSafety";
import NuclearEmergency from "./pages/NuclearEmergency";
import BuildingCollapse from "./pages/BuildingCollapse";
import EmergencyCommunication from "./pages/EmergencyCommunication";
import SurvivalSkills from "./pages/SurvivalSkills";
import PetSafety from "./pages/PetSafety";
import EmergencyTech from "./pages/EmergencyTech";
import PsychologicalFirstAid from "./pages/PsychologicalFirstAid";
import StudentDashboard from "./pages/StudentDashboard";
import Footer from "./components/Footer";

export default function App(){
  return(
    <BrowserRouter>
      <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
        <div style={{flex: 1}}>
          <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/emergency-contacts" element={<EmergencyContacts/>}/>
            <Route path="/checklist" element={<DisasterChecklist/>}/>
            <Route path="/alerts" element={<AlertsCenter/>}/>
            <Route path="/volunteer" element={<VolunteerCoordination/>}/>
            <Route path="/risk-profile" element={<RiskProfile/>}/>
            <Route path="/learning/flood-safety" element={<FloodSafety/>}/>
            <Route path="/learning/earthquake" element={<EarthquakePreparedness/>}/>
            <Route path="/learning/cyclone" element={<CycloneAwareness/>}/>
            <Route path="/learning/fire-quiz" element={<FireSafetyQuiz/>}/>
            <Route path="/learning/tsunami" element={<TsunamiSafety/>}/>
            <Route path="/learning/landslide" element={<LandslideSafety/>}/>
            <Route path="/learning/drought" element={<DroughtPreparedness/>}/>
            <Route path="/learning/heatwave" element={<HeatwaveSafety/>}/>
            <Route path="/learning/lightning" element={<LightningSafety/>}/>
            <Route path="/learning/first-aid" element={<FirstAidBasics/>}/>
            <Route path="/learning/pandemic" element={<PandemicPreparedness/>}/>
            <Route path="/learning/chemical-spill" element={<ChemicalSpillSafety/>}/>
            <Route path="/learning/nuclear" element={<NuclearEmergency/>}/>
            <Route path="/learning/building-collapse" element={<BuildingCollapse/>}/>
            <Route path="/learning/emergency-comm" element={<EmergencyCommunication/>}/>
            <Route path="/learning/survival" element={<SurvivalSkills/>}/>
            <Route path="/learning/pet-safety" element={<PetSafety/>}/>
            <Route path="/learning/emergency-tech" element={<EmergencyTech/>}/>
            <Route path="/learning/psych-aid" element={<PsychologicalFirstAid/>}/>
            <Route path="/student-dashboard" element={<StudentDashboard/>}/>
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
