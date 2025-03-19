import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewInvestorModal from "../components/NewInvestorModal";
import TransactionModal from "../components/TransactionModal";
import "../styles/investors.css";

const API_BASE_URL = "https://client-management-backend-8x91.onrender.com";

const Investors = () => {
  const [isNewInvestorModalOpen, setIsNewInvestorModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [investors, setInvestors] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch investors from the backend
  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/investors`);
        if (!response.ok) throw new Error("Failed to fetch investors");
        const data = await response.json();
        setInvestors(data);
      } catch (error) {
        console.error("Error fetching investors:", error);
      }
    };
    fetchInvestors();
  }, []);

  // ✅ Refresh investors after transactions
  const refreshInvestors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/investors`);
      if (!response.ok) throw new Error("Failed to fetch investors");
      const data = await response.json();
      setInvestors(data);
    } catch (error) {
      console.error("Error refreshing investors:", error);
    }
  };

  // ✅ Filter Investors Based on Search
  const filteredInvestors = investors.filter((investor) =>
    investor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="investors">
      {/* SEARCH BAR & ADD INVESTOR BUTTON */}
      <div className="top-bar">
        <input
          type="text"
          placeholder="🔍 Search by Investor Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="new-investor-btn" onClick={() => setIsNewInvestorModalOpen(true)}>
          ➕ New Investor
        </button>
        <button className="process-transaction-btn" onClick={() => setIsTransactionModalOpen(true)}>
          💰 Process Transaction
        </button>
      </div>

      {/* NEW INVESTOR MODAL */}
      {isNewInvestorModalOpen && (
        <NewInvestorModal onClose={() => setIsNewInvestorModalOpen(false)} refreshInvestors={refreshInvestors} />
      )}

      {/* TRANSACTION MODAL */}
      {isTransactionModalOpen && (
        <TransactionModal onClose={() => setIsTransactionModalOpen(false)} refreshInvestors={refreshInvestors} />
      )}

      {/* SCROLLABLE TABLE CONTAINER */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Investor</th>
              <th>Account Type</th>
              <th>Status</th>
              <th>Investment Term</th>
              <th>ROI (%)</th> 
              <th>Current Balance</th>
              <th>Account Balance</th>
              <th>Date Joined</th>
              <th>Date Payable</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvestors.length > 0 ? (
              filteredInvestors.map((investor) => (
                <tr
                  key={investor?.id}
                  onClick={() => investor?.id && navigate(`/investor/${investor.id}`)}
                  style={{ cursor: investor?.id ? "pointer" : "default" }}
                >
                  <td>{investor?.name || "N/A"}</td>
                  <td>{investor?.account_type || "N/A"}</td>
                  <td>{investor?.status || "N/A"}</td>
                  <td>{investor?.investment_term || "N/A"}</td>
                  <td>{parseFloat(investor?.roi || 0).toFixed(2)}%</td>
                  <td>${parseFloat(investor?.current_balance || 0).toFixed(2)}</td>
                  <td>${parseFloat(investor?.account_balance || 0).toFixed(2)}</td>
                  <td>{investor?.date_joined || "N/A"}</td>
                  <td>{investor?.date_payable || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>No investors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Investors;
