import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Register from "./components/register";
import Login from "./components/login";
import Opportunities from "./components/opportunities";
import Notifications from "./components/notifications";
import CreateOpportunity from "./components/createOpportunity";
import History from "./components/history";
import Logout from "./components/logout";
import { getUserType } from "./utils/auth";

const API_BASE_URL = "https://volunteer-backend-00oq.onrender.com";

function Home() {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Empower Your Community</h1>
        <p>Connecting passionate volunteers with impactful organizations.</p>
        <div className="hero-buttons">
          <Link to="/opportunities" className="btn-primary">
            View Opportunities
          </Link>
          <Link to="/register" className="btn-secondary">
            Join Us Today
          </Link>
        </div>
      </header>
    </div>
  );
}

function App() {
  const userType = getUserType(); // 'volunteer' | 'organization' | null
  const isAuthenticated = Boolean(localStorage.getItem("access"));

  const isPrivilegedUser =
    isAuthenticated && (userType === "organization" || userType === "admin");

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

          {isPrivilegedUser && (
            <>
              <Link to="/create-opportunity" className="admin-link">
                Create Opportunity
              </Link>
              <Link to="/history" className="admin-link">
                History
              </Link>
              <a
                href={`${API_BASE_URL}/api/docs/`}
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
              <Link to="/login" className="login-btn">
                Login
              </Link>
            </>
          ) : (
            <Link to="/logout" className="logout-btn">
              Logout
            </Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/opportunities"
          element={
            isAuthenticated ? <Opportunities /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/notifications"
          element={
            isAuthenticated ? <Notifications /> : <Navigate to="/login" />
          }
        />

        {/* Organization / Admin Only */}
        <Route
          path="/create-opportunity"
          element={
            isPrivilegedUser ? (
              <CreateOpportunity />
            ) : (
              <Navigate to="/opportunities" />
            )
          }
        />

        <Route
          path="/history"
          element={
            isPrivilegedUser ? (
              <History />
            ) : (
              <Navigate to="/opportunities" />
            )
          }
        />

        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
