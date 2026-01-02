import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode"; 

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/token/", form);

      // Store tokens for API calls
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // Decode token to get user_type (organization or volunteer)
      const decoded = jwtDecode(res.data.access);
      localStorage.setItem("user_type", decoded.user_type);

      alert("Login successful!");
      
      // Redirect to opportunities after login
      navigate("/opportunities");
      window.location.reload(); // Refresh to update the Nav Bar links immediately
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed: Check your credentials.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2>Login</h2>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <button type="submit" style={btnStyle}>Login</button>
      </form>
    </div>
  );
}

const formStyle = { display: "flex", flexDirection: "column", gap: "10px" };
const inputStyle = { padding: "10px", borderRadius: "4px", border: "1px solid #ccc" };
const btnStyle = { padding: "10px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" };