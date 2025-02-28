import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PassengerTypesPage.css"; 
import NewPassengerTypeModal from "../components/NewPassengerTypeModal";

const PassengerTypesPage = () => {
  const navigate = useNavigate();
  const [passengerTypes, setPassengerTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch passenger types from API
  useEffect(() => {
    const fetchPassengerTypes = async () => {
      try {
        const response = await fetch("https://client-management-backend-8x91.onrender.com/passenger-types");
        if (!response.ok) throw new Error("Failed to fetch passenger types");
        const data = await response.json();
        setPassengerTypes(data);
      } catch (error) {
        console.error("❌ Error fetching passenger types:", error);
      }
    };

    fetchPassengerTypes();
  }, []);

  // ✅ Delete a passenger type using API
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this passenger type?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://client-management-backend-8x91.onrender.com/passenger-types/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete passenger type");
      }

      setPassengerTypes((prevTypes) => prevTypes.filter((type) => type.id !== id)); // Remove from UI
    } catch (error) {
      console.error("❌ Error deleting passenger type:", error);
      alert(error.message);
    }
  };

  // ✅ Add new passenger type to UI after saving to backend
  const handleNewPassengerTypeSave = (newType) => {
    setPassengerTypes((prevTypes) => [...prevTypes, newType]);
  };

  return (
    <div className="passenger-types-container">
      {/* 🔙 Back to FerryPass Button */}
      <button className="back-btn" onClick={() => navigate("/ferrypass")}>
        ⬅ Back to FerryPass
      </button>

      {/* 🔎 Search Bar & "New Passenger Type" Button */}
      <div className="header">
        <input
          type="text"
          placeholder="Search Passenger Types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="new-passenger-type-btn" onClick={() => setIsModalOpen(true)}>
          + New Passenger Type
        </button>
      </div>

      {/* 📋 Passenger Types Table */}
      <div className="passenger-types-table">
        <table>
          <thead>
            <tr>
              <th>Passenger Type</th>
              <th>Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {passengerTypes
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

      {/* 🆕 New Passenger Type Modal */}
      {isModalOpen && (
        <NewPassengerTypeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleNewPassengerTypeSave}
        />
      )}
    </div>
  );
};

export default PassengerTypesPage;
