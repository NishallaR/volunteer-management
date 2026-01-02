import { useEffect, useState } from "react";
import api from "../api/api";
import { getUserType, getAuthHeader } from "../utils/auth";
import CreateOpportunity from "./createOpportunity";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Helper component to handle map focusing
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 14, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

export default function Opportunities() {
  const [opps, setOpps] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState(null);
  const [mapFocus, setMapFocus] = useState([51.505, -0.09]); // Default view
  
  const userType = getUserType();
  const navigate = useNavigate();

  const fetchOpps = async () => {
    try {
      const res = await api.get("/opportunities/", {
        headers: getAuthHeader(),
      });
      setOpps(res.data);
    } catch (err) {
      console.error("Failed to load opportunities", err);
    }
  };

  useEffect(() => {
    fetchOpps();
  }, []);

  const handleApply = async (id) => {
    try {
      await api.post("/applications/", { opportunity: id }, { headers: getAuthHeader() });
      alert("Application submitted!");
    } catch (err) {
      alert("Application failed.");
    }
  };

  // --- DELETE FUNCTION ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this opportunity? This action cannot be undone.")) return;
    try {
      await api.delete(`/opportunities/${id}/`, {
        headers: getAuthHeader(),
      });
      fetchOpps(); // Refresh list after delete
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.detail || err.message));
    }
  };

  const filteredOpps = opps.filter((opp) => {
    const term = searchTerm.toLowerCase();
    return (
      opp.title.toLowerCase().includes(term) ||
      opp.location.toLowerCase().includes(term)
    );
  });

  const focusOnLocation = (lat, lon) => {
    if (lat && lon) {
      setMapFocus([lat, lon]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert("Coordinates not available for this location.");
    }
  };

  if (editing) {
    return (
      <CreateOpportunity
        existingOpportunity={editing}
        onSuccess={() => {
          setEditing(null);
          fetchOpps();
        }}
      />
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Opportunities</h2>

      {/* Map Section */}
      <div style={{ height: "350px", marginBottom: "20px", borderRadius: "12px", overflow: "hidden", border: "2px solid #2196F3" }}>
        <MapContainer center={mapFocus} zoom={2} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <RecenterMap position={mapFocus} />
          {filteredOpps.map(opp => (
            opp.latitude && opp.longitude && (
              <Marker key={opp.id} position={[opp.latitude, opp.longitude]}>
                <Popup>
                  <strong>{opp.title}</strong><br/>{opp.location}
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Search opportunities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        {userType === "organization" && (
          <button onClick={() => navigate("/create-opportunity")} style={{ backgroundColor: "#4CAF50", color: "white" }}>
            ➕ Create Opportunity
          </button>
        )}
      </div>

      {filteredOpps.map((opp) => (
        <div key={opp.id} className="opportunity-card" style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "15px", borderRadius: "8px", backgroundColor: "#fff" }}>
          <h3>{opp.title}</h3>
          <p>{opp.description}</p>
          
          <p>
            <b>Location:</b>{" "}
            <span 
              onClick={() => focusOnLocation(opp.latitude, opp.longitude)}
              style={{ color: "#2196F3", cursor: "pointer", textDecoration: "underline" }}
            >
              {opp.location} 📍
            </span>
          </p>
          
          <p><b>Skills:</b> {opp.required_skills}</p>

          <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
            {userType === "volunteer" && (
              <button onClick={() => handleApply(opp.id)} className="btn-primary">Apply</button>
            )}
            
            {/* ORGANIZATION ACTIONS: EDIT & DELETE */}
            {userType === "organization" && (
              <>
                <button onClick={() => setEditing(opp)}>Edit</button>
                <button 
                  onClick={() => handleDelete(opp.id)} 
                  style={{ backgroundColor: "#f44336", color: "white" }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}