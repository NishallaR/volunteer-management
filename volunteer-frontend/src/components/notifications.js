import { useEffect, useState } from "react";
import api from "../api/api";
import { getUserType, getAuthHeader } from "../utils/auth";
import { Link } from "react-router-dom";

export default function Notifications() {
  const [notes, setNotes] = useState([]);
  const userType = getUserType(); 

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notifications/", { headers: getAuthHeader() });
      
      // Organizations see only pending application notifications
      if (userType === 'organization') {
        const activeNotes = res.data.filter(n => n.status === 'pending' && n.application_id);
        setNotes(activeNotes);
      } else {
        setNotes(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleDecision = async (applicationId, decisionValue) => {
    try {
      await api.post(`/applications/${applicationId}/decision/`, 
        { action: decisionValue }, 
        { headers: getAuthHeader() }
      );
      await fetchNotes(); 
    } catch (err) {
      alert("Action failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Notifications</h2>
        {userType === "organization" && (
          <Link to="/history" className="notifications-history-link">
            View All History
          </Link>
        )}
      </div>

      {notes.length === 0 ? (
        <p className="notifications-empty">No notifications at this time.</p>
      ) : (
        notes.map((n) => (
          <div key={n.id} className="notification-card">
            <p className="notification-message">{n.message}</p>
            
            {userType === "organization" && n.status === "pending" && (
              <div className="notification-actions">
                <button 
                  onClick={() => handleDecision(n.application_id, "approve")} 
                  className="btn-approve"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleDecision(n.application_id, "reject")} 
                  className="btn-reject"
                >
                  Reject
                </button>
              </div>
            )}

            {userType === "volunteer" && (
              <p className="notification-status">
                Status: <span className={`status-${n.status}`}>{n.status.toUpperCase()}</span>
              </p>
            )}

            <div className="notification-date">
              <small>
                Received: {new Date(n.created_at).toLocaleString()}
              </small>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
