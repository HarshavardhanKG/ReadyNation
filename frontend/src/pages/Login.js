import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

export default function Login(){
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", general: "" });

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!email) return "";
    if (!emailRegex.test(email)) {
      return "Please enter a valid Gmail address";
    }
    return "";
  };

  const handleEmailBlur = () => {
    const error = validateEmail(email);
    setErrors(prev => ({ ...prev, email: error }));
  };

  const handleLogin = async () => {
    setErrors({ email: "", general: "" });

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors(prev => ({ ...prev, email: emailError }));
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        nav("/home");
      } else {
        setErrors(prev => ({ ...prev, general: data.message || "Invalid credentials" }));
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, general: "Unable to connect to server" }));
    }
  };

  return(
    <div className="login-page">
      <h1 className="page-title">ReadyNation</h1>
      <div className="card">
        <h2>Login</h2>

        {errors.general && <div style={{color: "red", fontSize: "0.9rem", marginBottom: "10px"}}>{errors.general}</div>}

        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} onBlur={handleEmailBlur}/>
        {errors.email && <div style={{color: "red", fontSize: "0.85rem", marginTop: "-10px", marginBottom: "10px"}}>{errors.email}</div>}
        
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>

        <button onClick={handleLogin}>Login</button>

        <p>Don't have an account? <span className="link" onClick={()=>nav("/signup")}>Signup</span></p>
      </div>
    </div>
  );
}
