import React, { useState, useEffect } from "react";
import "../styles/TransactionModal.css";
import TransactionSuccessModal from "../components/TransactionSuccessModal";

const API_BASE_URL = "https://client-management-backend-8x91.onrender.com"; // ✅ Backend API

const TransactionModal = ({ onClose, refreshInvestors }) => {
  const [investors, setInvestors] = useState([]);
  const [selectedInvestor, setSelectedInvestor] = useState("");
  const [selectedInvestorName, setSelectedInvestorName] = useState("");
  const [transactionType, setTransactionType] = useState("Deposit");
  const [amount, setAmount] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [latestTransaction, setLatestTransaction] = useState(null);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/investors`);
        const data = await response.json();
        setInvestors(data);
      } catch (error) {
        console.error("Error fetching investors:", error);
      }
    };

    fetchInvestors();
  }, []);

  const handleTransaction = async () => {
    if (!selectedInvestor || !amount || parseFloat(amount) <= 0) {
      alert("Please select an investor and enter a valid amount.");
      return;
    }

    const transactionData = {
      investor_id: selectedInvestor,
      transaction_type: transactionType,
      amount: parseFloat(amount),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/transactions/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Transaction failed");
      }

      const transaction = await response.json();

      // ✅ Fetch Updated Investor Details After Transaction
      const investorResponse = await fetch(`${API_BASE_URL}/investors/${selectedInvestor}`);
      const updatedInvestor = await investorResponse.json();

      // ✅ Ensure Account Balance is Correctly Fetched
      const accountBalance = updatedInvestor?.account_balance || transaction.updated_balance || 0;

      // ✅ Store Transaction Details for Receipt Printing
      setLatestTransaction({
        receiptNumber: Math.floor(100000 + Math.random() * 900000),
        date: new Date().toISOString(),
        investorName: selectedInvestorName,
        transactionType: transactionType,
        amount: amount,
        accountBalance: accountBalance, // ✅ Now correctly retrieved
      });

      setIsSuccessModalOpen(true); // ✅ Show success modal
      refreshInvestors(); // ✅ Refresh investor balances
    } catch (error) {
      console.error("❌ Transaction Error:", error);
      alert("Transaction failed.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Process Transaction</h3>

        <label>Select Investor:</label>
        <select
          value={selectedInvestor}
          onChange={(e) => {
            setSelectedInvestor(e.target.value);
            const investor = investors.find(inv => inv.id === e.target.value);
            setSelectedInvestorName(investor ? investor.name : "");
          }}
        >
          <option value="">-- Select Investor --</option>
          {investors.map((investor) => (
            <option key={investor.id} value={investor.id}>
              {investor.name}
            </option>
          ))}
        </select>

        <label>Transaction Type:</label>
        <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
          <option value="Deposit">Deposit</option>
          <option value="Withdrawal">Withdrawal</option>
        </select>

        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
        />

        <div className="modal-buttons">
          <button className="save-btn" onClick={handleTransaction}>✔ Confirm Transaction</button>
          <button className="close-btn" onClick={onClose}>❌ Close</button>
        </div>
      </div>

      {/* ✅ Show Transaction Success Modal After a Successful Transaction */}
      {isSuccessModalOpen && (
        <TransactionSuccessModal
          transaction={latestTransaction}
          onClose={() => {
            setIsSuccessModalOpen(false);
            onClose(); // Close the main transaction modal
          }}
        />
      )}
    </div>
  );
};

export default TransactionModal;
