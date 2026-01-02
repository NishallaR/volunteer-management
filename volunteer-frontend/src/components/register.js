import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom"; 

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    user_type: "volunteer",
    location: "",
    skills: "",
    organization_name: "",
  });

  const navigate = useNavigate(); // 2. Initialize navigate

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/accounts/register/", form);
      if (res && res.data) {
        alert("Registered successfully!");
        navigate("/login"); // 3. Redirect to login page
      }
    } catch (err) {
      if (err.response && err.response.data) {
        alert("Error: " + JSON.stringify(err.response.data));
      } else {
        alert("Error: " + err.message);
      }
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p className="subtitle">Join our volunteer network</p>
        
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          required
        />
        
        <label>Account Type</label>
        <select name="user_type" onChange={handleChange}>
          <option value="volunteer">Volunteer</option>
          <option value="organization">Organization</option>
        </select>

        <input name="location" placeholder="Location" onChange={handleChange} />
        
        <input name="skills" placeholder="Skills (Volunteers only)" onChange={handleChange} />
        <input
          name="organization_name"
          placeholder="Organization Name (Admins only)"
          onChange={handleChange}
        />
        
        <button type="submit" className="btn-submit">Register</button>
      </form>
    </div>
  );
}