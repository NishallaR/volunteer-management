import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Clear all stored auth data
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user_type");

    // 2. Alert the user (optional)
    alert("You have been logged out.");

    // 3. Redirect to login
    navigate("/login");
    
    // 4. Force a refresh to clear any cached user state in the Nav bar
    window.location.reload();
  }, [navigate]);

  return null; 
}