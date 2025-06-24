import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import api from "./api/axios";

function App() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await api.post("/auth/refresh", { refreshToken });
          localStorage.setItem("accessToken", res.data.accessToken);
          console.log("NEW ACCESS TOKEN:", res.data.accessToken);
        } catch (err) {
          console.log("Failed to refresh access token! Logging out…", err);
          // Remove tokens and redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          localStorage.getItem("accessToken") ? (
            <Dashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
