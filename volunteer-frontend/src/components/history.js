import { useEffect, useState } from "react";
import api from "../api/api";
import { getUserType, getAuthHeader } from "../utils/auth";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const userType = getUserType(); // 'organization' or 'volunteer'

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/notifications/", { headers: getAuthHeader() });

        let filteredHistory = [];

        if (userType === "organization") {
          // Show all notifications for all volunteers, one row per application
          const appMap = new Map();
          res.data.forEach((n) => {
            if (n.application_id && !appMap.has(n.application_id)) {
              appMap.set(n.application_id, n);
            }
          });
          filteredHistory = Array.from(appMap.values());
        } else {
          // Volunteers see only their own processed requests
          filteredHistory = res.data.filter(n => n.status !== "pending");
        }

        setHistory(filteredHistory);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userType]);

  if (loading) return <div className="history-loading">Loading history...</div>;

  return (
    <div className="history-container">
      <h2 className="history-title">Volunteer Application History</h2>
      <p className="history-subtitle">
        {userType === "organization"
          ? "Admin view: all volunteers' applications (pending, approved, rejected)."
          : "Your processed volunteer applications."}
      </p>

      {history.length === 0 ? (
        <p className="history-empty">No records found.</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              {userType === "organization" && <th>Volunteer</th>}
              <th>Opportunity</th>
              <th>Status</th>
              <th>Date Processed</th>
            </tr>
          </thead>
          <tbody>
            {history.map((n) => (
              <tr key={n.id}>
                {userType === "organization" && <td>{n.volunteer_name || "Unknown Volunteer"}</td>}
                <td>{n.opportunity_title || "General Request"}</td>
                <td className={`status-${n.status}`}>{n.status}</td>
                <td>{new Date(n.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
