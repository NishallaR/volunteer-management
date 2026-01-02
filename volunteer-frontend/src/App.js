import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Register from "./components/register";
import Login from "./components/login";
import Opportunities from "./components/opportunities";
import Notifications from "./components/notifications";
import CreateOpportunity from "./components/createOpportunity";
import History from "./components/history"; 
import Logout from "./components/logout"; 
import { getUserType } from "./utils/auth";

// New Home Component
function Home() {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Empower Your Community</h1>
        <p>Connecting passionate volunteers with impactful organizations.</p>
        <div className="hero-buttons">
          <Link to="/opportunities" className="btn-primary">View Opportunities</Link>
          <Link to="/register" className="btn-secondary">Join Us Today</Link>
        </div>
      </header>
    </div>
  );
}

function App() {
  const userType = getUserType(); 
  const isAuthenticated = !!localStorage.getItem("access");

  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="nav-logo">
          <Link to="/">VolunteerApp</Link>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          
          {isAuthenticated && (
            <>
              <Link to="/opportunities">Opportunities</Link>
              <Link to="/notifications">Notifications</Link>
            </>
          )}

          {/* STRICTLY ORGANISATION ONLY: Documentation and Admin Tools */}
          {isAuthenticated && userType === "organization" && (
            <>
              <Link to="/create-opportunity" className="admin-link">Create Opportunity</Link>
              <Link to="/history" className="admin-link">History</Link>
              <a 
                href="http://127.0.0.1:8000/api/docs/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="docs-link"
              >
                API Docs ↗
              </a>
            </>
          )}

          {!isAuthenticated ? (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login" className="login-btn">Login</Link>
            </>
          ) : (
            <Link to="/logout" className="logout-btn">Logout</Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/opportunities" element={isAuthenticated ? <Opportunities /> : <Navigate to="/login" replace />} />
        <Route path="/notifications" element={isAuthenticated ? <Notifications /> : <Navigate to="/login" replace />} />
        <Route path="/history" element={isAuthenticated && userType === "organization" ? <History /> : <Navigate to="/opportunities" replace />} />
        <Route path="/logout" element={<Logout />} />
        <Route 
          path="/create-opportunity" 
          element={isAuthenticated && userType === "organization" ? <CreateOpportunity /> : <Navigate to="/opportunities" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;