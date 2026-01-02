import { useState } from "react";
import api from "../api/api";
import { getAuthHeader } from "../utils/auth";
import { useNavigate } from "react-router-dom"; // Added for redirection
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Helper to move map view when searching
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

export default function CreateOpportunity({ existingOpportunity, onSuccess }) {
  const navigate = useNavigate(); // Initialize navigation
  
  const [form, setForm] = useState({
    title: existingOpportunity?.title || "",
    description: existingOpportunity?.description || "",
    location: existingOpportunity?.location || "",
    required_skills: existingOpportunity?.required_skills || "",
    start_date: existingOpportunity?.start_date || "",
    end_date: existingOpportunity?.end_date || "",
    latitude: existingOpportunity?.latitude || 51.505, // Default to sensible value if new
    longitude: existingOpportunity?.longitude || -0.09,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState([form.latitude, form.longitude]);

  // Handle Search for Location
  const handleSearchLocation = async () => {
    if (!searchQuery) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newCoords = [parseFloat(lat), parseFloat(lon)];
        setMapCenter(newCoords);
        setForm({ 
          ...form, 
          latitude: parseFloat(lat), 
          longitude: parseFloat(lon), 
          location: display_name 
        });
      }
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  // Click on Map to select location
  function MapEvents() {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        try {
          // Reverse Geocoding to get address from clicks
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          
          setForm({ 
            ...form, 
            latitude: lat, 
            longitude: lng, 
            location: data.display_name || "Custom Point" 
          });
        } catch (err) {
          // Fallback if reverse geocoding fails
          setForm({ ...form, latitude: lat, longitude: lng });
        }
      },
    });
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { headers: getAuthHeader() };
      
      // Ensure we are sending the current form state (including coordinates)
      if (existingOpportunity) {
        await api.put(`/opportunities/${existingOpportunity.id}/`, form, headers);
        alert("Opportunity updated!");
      } else {
        await api.post("/opportunities/", form, headers);
        alert("Opportunity created!");
      }

      // 1. Run success callback (usually refreshes list if in modal)
      if (onSuccess) {
        onSuccess();
      } else {
        // 2. Otherwise, redirect to the opportunities list page
        navigate("/opportunities");
      }
    } catch (err) {
      console.error(err.response?.data);
      alert("Failed to save opportunity. Check console for details.");
    }
  };

  return (
    <div className="admin-form-container" style={{ padding: "20px" }}>
      <h2>{existingOpportunity ? "Edit Opportunity" : "Create Opportunity"}</h2>

      <form onSubmit={handleSubmit}>
        <input 
          name="title" 
          value={form.title} 
          onChange={handleChange} 
          placeholder="Title" 
          required 
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        
        <textarea 
          name="description" 
          value={form.description} 
          onChange={handleChange} 
          placeholder="Description" 
          style={{ width: "100%", marginBottom: "10px", padding: "8px", height: "80px" }}
        />
        
        <div className="map-search-box" style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
          <input 
            placeholder="Search address to find on map..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: "8px" }}
          />
          <button type="button" onClick={handleSearchLocation}>Search Map</button>
        </div>

        <div style={{ height: "300px", width: "100%", marginBottom: "15px", border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" }}>
          <MapContainer center={mapCenter} zoom={13} style={{ height: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ChangeView center={mapCenter} />
            <MapEvents />
            <Marker position={[form.latitude, form.longitude]} />
          </MapContainer>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Selected Address:</label>
          <input 
            name="location" 
            value={form.location} 
            readOnly 
            placeholder="Address (auto-filled from map)" 
            style={{ width: "100%", padding: "8px", backgroundColor: "#f9f9f9" }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <div style={{ flex: 1 }}>
            <label>Latitude:</label>
            <input name="latitude" value={form.latitude} readOnly style={{ width: "100%", padding: "8px", backgroundColor: "#f9f9f9" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Longitude:</label>
            <input name="longitude" value={form.longitude} readOnly style={{ width: "100%", padding: "8px", backgroundColor: "#f9f9f9" }} />
          </div>
        </div>

        <input 
          name="required_skills" 
          value={form.required_skills} 
          onChange={handleChange} 
          placeholder="Skills (comma separated)" 
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <div style={{ flex: 1 }}>
            <label>Start Date:</label>
            <input type="date" name="start_date" value={form.start_date} onChange={handleChange} style={{ width: "100%", padding: "8px" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>End Date:</label>
            <input type="date" name="end_date" value={form.end_date} onChange={handleChange} style={{ width: "100%", padding: "8px" }} />
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "10px", padding: "12px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          {existingOpportunity ? "Update Opportunity" : "Create Opportunity"}
        </button>
      </form>
    </div>
  );
}