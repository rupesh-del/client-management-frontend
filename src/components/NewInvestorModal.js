import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/NewInvestorModal.css";

const API_BASE_URL = "https://client-management-backend-8x91.onrender.com"; // ✅ Backend API

const NewInvestorModal = ({ onClose, refreshInvestors }) => {
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState("Investigrow");
  const [investmentTerm, setInvestmentTerm] = useState("6 WEEKS");
  const [roi, setRoi] = useState("");
  const [dateJoined, setDateJoined] = useState(new Date()); // ✅ Added state for date joined

  const handleSubmit = async () => {
    if (!name || !accountType || !investmentTerm || !roi || !dateJoined) {
      alert("All fields are required!");
      return;
    }

    const investorData = {
      name,
      account_type: accountType,
      investment_term: investmentTerm,
      roi: parseFloat(roi),
      date_joined: dateJoined, // ✅ Include date joined
    };

    try {
      const response = await fetch(`${API_BASE_URL}/investors/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(investorData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to add investor");
      }

      console.log("✅ Investor added:", await response.json());
      refreshInvestors();
      onClose();
    } catch (error) {
      console.error("❌ Error adding investor:", error);
      alert("Failed to add investor.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>New Investor</h3>

        <label>Investor Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Account Type:</label>
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
        >
          <option value="Investigrow">Investigrow</option>
          <option value="Piggybank">Piggybank</option>
        </select>

        <label>Investment Term:</label>
        <select
          value={investmentTerm}
          onChange={(e) => setInvestmentTerm(e.target.value)}
        >
          <option value="6 WEEKS">6 WEEKS</option>
          <option value="6 MONTHS">6 MONTHS</option>
          <option value="1 YEAR">1 YEAR</option>
        </select>

        <label>ROI (%):</label>
        <input
          type="number"
          value={roi}
          onChange={(e) => setRoi(e.target.value)}
        />

        <label>Date Joined:</label>
        <DatePicker
          selected={dateJoined}
          onChange={(date) => setDateJoined(date)}
          dateFormat="MM/dd/yyyy"
        />

        <div className="modal-buttons">
          <button className="save-btn" onClick={handleSubmit}>
            ✔ Save Investor
          </button>
          <button className="close-btn" onClick={onClose}>
            ❌ Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewInvestorModal;
