import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/VehicleNumbers.css"; // Ensure this file exists

const API_BASE_URL = "https://client-management-backend-8x91.onrender.com";

const VehicleNumbers = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Search state added

  // Fetch vehicle numbers and types from the backend
  useEffect(() => {
    fetchVehicleNumbers();
  }, []);

  const fetchVehicleNumbers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vehicle-numbers`);
      setVehicles(response.data);
    } catch (error) {
      console.error("❌ Error fetching vehicle numbers:", error);
    }
  };

  // ✅ Filtering vehicles based on search input
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.vehicle_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="vehicle-numbers-container">
      {/* 🔍 Search Bar & Back Button */}
      <div className="search-back-container">
        <input
          type="text"
          placeholder="Search Vehicle Numbers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      <button className="back-btn" onClick={() => navigate("/ferrypass")}>
        ⬅ Back to FerryPass
      </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Vehicle Number</th>
            <th>Vehicle Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle, index) => (
              <tr key={index}>
                <td>{vehicle.vehicle_number || "N/A"}</td>
                <td>{vehicle.vehicle_type || "Unknown"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="no-data">No matching vehicles found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleNumbers;
