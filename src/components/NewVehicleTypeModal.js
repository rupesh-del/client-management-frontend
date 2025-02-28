import React, { useState } from "react";
import "../styles/NewVehicleTypeModal.css"; 

const NewVehicleTypeModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !cost.trim()) {
      alert("Both fields are required.");
      return;
    }

    setLoading(true);

    const newType = { name, cost: parseFloat(cost) };

    try {
      const response = await fetch("https://client-management-backend-8x91.onrender.com/vehicle-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newType),
      });

      if (!response.ok) {
        throw new Error("Failed to add vehicle type.");
      }

      const savedType = await response.json();
      onSave(savedType); // Update frontend
      setName("");
      setCost("");
      onClose();
    } catch (error) {
      console.error("❌ Error adding vehicle type:", error);
      alert("Error adding vehicle type. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Vehicle Type</h2>
        <form onSubmit={handleSubmit}>
          <label>Vehicle Type:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Cost ($):</label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
          />

          <div className="modal-actions">
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewVehicleTypeModal;
