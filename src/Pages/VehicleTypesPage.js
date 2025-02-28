import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/VehicleTypesPage.css"; 
import NewVehicleTypeModal from "../components/NewVehicleTypeModal";

const VehicleTypesPage = () => {
  const navigate = useNavigate();
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch vehicle types from API
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const response = await fetch("https://client-management-backend-8x91.onrender.com/vehicle-types");
        if (!response.ok) throw new Error("Failed to fetch vehicle types");
        const data = await response.json();
        setVehicleTypes(data);
      } catch (error) {
        console.error("❌ Error fetching vehicle types:", error);
      }
    };

    fetchVehicleTypes();
  }, []);

  // ✅ Delete a vehicle type
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this vehicle type?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://client-management-backend-8x91.onrender.com/vehicle-types/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete vehicle type");

      setVehicleTypes(vehicleTypes.filter((type) => type.id !== id)); // Remove from UI
    } catch (error) {
      console.error("❌ Error deleting vehicle type:", error);
    }
  };

  const handleNewVehicleTypeSave = (newType) => {
    setVehicleTypes([...vehicleTypes, newType]); // Add new vehicle type to UI
  };

  return (
    <div className="vehicle-types-container">
      {/* 🔙 Back to FerryPass Button */}
      <button className="back-btn" onClick={() => navigate("/ferrypass")}>
        ⬅ Back to FerryPass
      </button>

      {/* 🔎 Search Bar & "New Vehicle Type" Button */}
      <div className="header">
        <input
          type="text"
          placeholder="Search Vehicle Types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="new-vehicle-type-btn" onClick={() => setIsModalOpen(true)}>
          + New Vehicle Type
        </button>
      </div>

      {/* 📋 Vehicle Types Table */}
      <div className="vehicle-types-table">
        <table>
          <thead>
            <tr>
              <th>Vehicle Type</th>
              <th>Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicleTypes
              .filter((type) => 
                type.name.toLowerCase().includes(searchQuery.toLowerCase()) // ✅ Search Filter Applied
              )
              .map((type, index) => (
                <tr key={type.id || `type-${index}`}>
                  <td>{type.name}</td>
                  <td>${isNaN(type.cost) ? "N/A" : Number(type.cost).toFixed(2)}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(type.id)}>Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* 🆕 New Vehicle Type Modal */}
      {isModalOpen && (
        <NewVehicleTypeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleNewVehicleTypeSave}
        />
      )}
    </div>
  );
};

export default VehicleTypesPage;
