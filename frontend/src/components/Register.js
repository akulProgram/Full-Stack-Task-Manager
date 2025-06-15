import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", { username, password });
      navigate("/login");
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className="app-container">
      <div className="dashboard-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            placeholder="Username"
            value={username}
            autoFocus
            onChange={e => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <button type="submit">Register</button>
          {error && <div className="error-message">{error}</div>}
        </form>
        <p style={{marginTop:"18px", textAlign:"center", color:"#bfa642"}}>
          Already have an account?{" "}
          <Link to="/login" style={{color:"#ffd700"}}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
