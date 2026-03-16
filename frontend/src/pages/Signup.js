import { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

export default function Signup(){
  const nav = useNavigate();

  const [user,setUser]=useState({
    name:"",
    email:"",
    password:"",
    location:"",
    role:"Student"
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    location: "",
    general: ""
  });

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!email) return "";
    if (!emailRegex.test(email)) {
      return "Please enter a valid Gmail address";
    }
    return "";
  };

  const validateLocation = async (location) => {
    if (!location) return "";
    try {
      const response = await fetch(`http://localhost:5000/validate-location?location=${encodeURIComponent(location)}`);
      const data = await response.json();
      if (!data.valid) {
        return "Location not found";
      }
      return "";
    } catch (error) {
      return "Location not found";
    }
  };

  const handleEmailBlur = () => {
    const error = validateEmail(user.email);
    setErrors(prev => ({ ...prev, email: error }));
  };

  const handleLocationBlur = async () => {
    const error = await validateLocation(user.location);
    setErrors(prev => ({ ...prev, location: error }));
  };

  const handleSignup = async () => {
    setErrors({ email: "", location: "", general: "" });

    const emailError = validateEmail(user.email);
    if (emailError) {
      setErrors(prev => ({ ...prev, email: emailError }));
      return;
    }
    if (!user.name || !user.password || !user.location) {
      setErrors(prev => ({ ...prev, general: "Please fill in all fields" }));
      return;
    }

    if (user.password.length < 3) {
      setErrors(prev => ({ ...prev, password: "Password must be at least 3 characters" }));
      return;
    }

    const locationError = await validateLocation(user.location);
    if (locationError) {
      setErrors(prev => ({ ...prev, location: locationError }));
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
      const data = await response.json();
      
      if (data.success) {
        alert("Registration successful!");
        nav("/login");
      } else {
        setErrors(prev => ({ ...prev, general: data.message }));
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, general: "Unable to connect to server" }));
    }
  };

  return(
    <div className="signup-page">
      <h1 className="page-title">ReadyNation</h1>
      <div className="card">
        <h2>Signup</h2>

        {errors.general && <div style={{color: "red", fontSize: "0.9rem", marginBottom: "10px"}}>{errors.general}</div>}

        <input placeholder="Name"
          onChange={e=>setUser({...user,name:e.target.value})}/>

        <input placeholder="Email"
          onChange={e=>setUser({...user,email:e.target.value})}
          onBlur={handleEmailBlur}/>
        {errors.email && <div style={{color: "red", fontSize: "0.85rem", marginTop: "-10px", marginBottom: "10px"}}>{errors.email}</div>}

        <input type="password" placeholder="Password"
          onChange={e=>setUser({...user,password:e.target.value})}/>
        {errors.password && <div style={{color: "red", fontSize: "0.85rem", marginTop: "-10px", marginBottom: "10px"}}>{errors.password}</div>}

        <select onChange={e=>setUser({...user,role:e.target.value})}>
          <option>Student</option>
          <option>Teacher</option>
        </select>

        <input placeholder="City/Town/Village"
          onChange={e=>setUser({...user,location:e.target.value})}
          onBlur={handleLocationBlur}/>
        {errors.location && <div style={{color: "red", fontSize: "0.85rem", marginTop: "-10px", marginBottom: "10px"}}>{errors.location}</div>}

        <button onClick={handleSignup}>Signup</button>

        <p>Already have an account? <span className="link" onClick={()=>nav("/login")}>Login</span></p>
      </div>
    </div>
  );
}
