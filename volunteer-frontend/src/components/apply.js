import { useState } from "react";
import api from "../api/api";

export default function Apply({ opportunityId }) {
  const [message, setMessage] = useState("");

  const handleApply = async () => {
    try {
      const res = await api.post("/applications/", { opportunity: opportunityId });
      if (res && res.data) {
        setMessage("Applied successfully!");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage("Failed: " + JSON.stringify(err.response.data));
      } else {
        setMessage("Failed: " + err.message);
      }
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={handleApply}>Apply</button>
      {message && <p>{message}</p>}
    </div>
  );
}
