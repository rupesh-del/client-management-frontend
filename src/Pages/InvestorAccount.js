import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/investorAccount.css";

const API_BASE_URL = "https://client-management-backend-8x91.onrender.com";

const InvestorAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [investor, setInvestor] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(null);


  useEffect(() => {
    if (!id || id === "undefined") {
      setError("Invalid Investor ID");
      return;
    }
  
    const fetchInvestor = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/investors/${id}`);
        if (!response.ok) throw new Error("Investor not found");
        const data = await response.json();
        setInvestor(data);
      } catch (error) {
        console.error("Error fetching investor details:", error);
        setError(error.message);
      }
    };
  
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/transactions/${id}`);
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
  
        // ✅ Ensure transactions is always an array
        setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
  
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError(error.message);
  
        // ✅ Ensure transactions is an empty array on error
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchInvestor();
    fetchTransactions();
  }, [id]);
  

  // ✅ Compute Totals for Deposits & Withdrawals
  const totalDeposits = transactions
    .filter((txn) => txn.transaction_type === "Deposit")
    .reduce((sum, txn) => sum + parseFloat(txn.amount || 0), 0);

  const totalWithdrawals = transactions
    .filter((txn) => txn.transaction_type === "Withdrawal")
    .reduce((sum, txn) => sum + parseFloat(txn.amount || 0), 0);

  const netTotal = totalDeposits - totalWithdrawals;

  // ✅ Handle Delete Investor
  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${investor?.name}?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/investors/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete investor");

      alert("Investor deleted successfully!");
      navigate("/investors");
    } catch (error) {
      console.error("Error deleting investor:", error);
      setError("Error deleting investor. Please try again.");
    }
  };

  const generateStatement = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
  
    // ✅ Company Information
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text("RCS TOPUP AND BILLING ENTITY", 15, 20);
    doc.setFontSize(10);
    doc.text("22 BELLE PLAINE WAKENAAM", 15, 26);
    doc.text("TEL: 592-662-7987 OR 592-649-1514", 15, 32);
    doc.text("EMAIL: rcs@rcsgy.net", 15, 38);
  
    // ✅ Draw Line Separator
    doc.setLineWidth(0.5);
    doc.line(15, 45, 195, 45);
  
    // ✅ Capital Statement
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("CAPITAL STATEMENT", 15, 55);
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Current Balance: $${parseFloat(investor?.current_balance || 0).toFixed(2)}`, 15, 65);
    doc.text(`Available Balance: $${parseFloat(investor?.account_balance || 0).toFixed(2)}`, 15, 73);
    doc.text(`Date Payable: ${investor?.date_payable || "N/A"}`, 15, 81);
  
    // ✅ Investor Details
    doc.setFontSize(12);
    doc.text("Member:", 150, 55);
    doc.setFontSize(10);
    doc.text(`Name: ${investor?.name}`, 150, 65);
    doc.text(`Investment Term: ${investor?.investment_term}`, 150, 73);
    doc.text(`Date Joined: ${investor?.date_joined || "N/A"}`, 150, 81);
    doc.text(`ROI: ${parseFloat(investor?.roi || 0).toFixed(2)}%`, 150, 89);
  
    // ✅ Total Payable Highlight Section
    doc.setFillColor(204, 0, 0);
    doc.rect(15, 100, 180, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("TOTAL PAYABLE IN THIS STATEMENT", 20, 107);
    doc.text(`$${parseFloat(investor?.account_balance || 0).toFixed(2)}`, 165, 107);
  
    // ✅ Page 2 - Transactions Table
    doc.addPage();
    doc.setTextColor(0);
    doc.setFontSize(16);
    doc.text("Transaction History", 15, 20);
  
    if (transactions.length > 0) {
      // ✅ Calculate Totals
      const totalDeposit = transactions
        .filter(txn => txn.transaction_type === "Deposit")
        .reduce((sum, txn) => sum + parseFloat(txn.amount), 0);
  
      const totalWithdrawal = transactions
        .filter(txn => txn.transaction_type === "Withdrawal")
        .reduce((sum, txn) => sum + parseFloat(txn.amount), 0);
  
      const netTotal = totalDeposit - totalWithdrawal; // ✅ Calculate NET TOTAL
  
      autoTable(doc, {
        startY: 30,
        head: [["Date", "Transaction Type", "Deposit ($)", "Interest ($)", "Withdrawal ($)"]], // ✅ Updated Table Headers
        body: [
          ...transactions.map((txn) => [
            txn.transaction_date.split("T")[0], // ✅ Formats Date Properly (YYYY-MM-DD)
            txn.transaction_type,
            txn.transaction_type === "Deposit" ? `$${parseFloat(txn.amount).toFixed(2)}` : "",
            txn.transaction_type === "Interest" ? `$${parseFloat(txn.amount).toFixed(2)}` : "", // ✅ Include Interest Transactions
            txn.transaction_type === "Withdrawal" ? `$${parseFloat(txn.amount).toFixed(2)}` : "",
          ]),
          // ✅ Add Totals Row
          [
            { content: "Totals:", colSpan: 2, styles: { fontStyle: "bold" } },
            { content: `$${transactions
              .filter(t => t.transaction_type === 'Deposit')
              .reduce((sum, t) => sum + parseFloat(t.amount), 0)
              .toFixed(2)}`, styles: { fontStyle: "bold" } },
      
            { content: `$${transactions
              .filter(t => t.transaction_type === 'Interest')
              .reduce((sum, t) => sum + parseFloat(t.amount), 0)
              .toFixed(2)}`, styles: { fontStyle: "bold" } },
      
            { content: `$${transactions
              .filter(t => t.transaction_type === 'Withdrawal')
              .reduce((sum, t) => sum + parseFloat(t.amount), 0)
              .toFixed(2)}`, styles: { fontStyle: "bold" } },
          ],
          // ✅ Add NET TOTAL Row
          [
            { content: "NET TOTAL:", colSpan: 4, styles: { fontStyle: "bold", textColor: "red" } },
            { content: `$${(
              transactions
                .filter(t => t.transaction_type === 'Deposit')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0) +
              transactions
                .filter(t => t.transaction_type === 'Interest')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0) -
              transactions
                .filter(t => t.transaction_type === 'Withdrawal')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0)
            ).toFixed(2)}`, styles: { fontStyle: "bold", textColor: "red" } },
          ]
        ],
        theme: "grid",
        styles: {
          fontSize: 10,
          halign: "center",
        },
        headStyles: {
          fillColor: "#028a0f",
          textColor: "#ffffff",
          fontSize: 12,
          halign: "center",
        },
        alternateRowStyles: {
          fillColor: "#f2f2f2",
        },
      });
      
  
      // ✅ Save PDF after table renders
      doc.save(`Investor_Statement_${investor?.name}.pdf`);
    } else {
      doc.setFontSize(12);
      doc.text("No transactions available.", 15, 30);
      doc.save(`Investor_Statement_${investor?.name}.pdf`);
    }
  };

  
  
  if (loading) return <div style={{ textAlign: "center" }}>Loading investor details...</div>;

  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center" }}>
        {error} <br />
        <button onClick={() => navigate("/investors")}>🔙 Back to Investors</button>
      </div>
    );
  }

  if (!investor) return <div style={{ textAlign: "center", color: "red" }}>Investor not found</div>;

  return (
    <div className="investor-account">
      <h2>{investor?.name}'s Account</h2>

      <div className="account-details">
        <p><strong>Account Type:</strong> {investor?.account_type}</p>
        <p><strong>Status:</strong> {investor?.status}</p>
        <p><strong>Investment Term:</strong> {investor?.investment_term}</p>
        <p><strong>ROI (%):</strong> {parseFloat(investor?.roi || 0).toFixed(2)}%</p>
        <p><strong>Current Balance:</strong> ${parseFloat(investor?.current_balance || 0).toFixed(2)}</p>
        <p><strong>Account Balance:</strong> ${parseFloat(investor?.account_balance || 0).toFixed(2)}</p>
        <p><strong>Date Joined:</strong> {investor?.date_joined}</p>
        <p><strong>Date Payable:</strong> {investor?.date_payable}</p>
      </div>
{/* TRANSACTIONS TABLE */}
<h3>Transaction History</h3>
<div className="transactions-table-container">
<table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Transaction Type</th>
      <th>Deposit ($)</th>
      <th>Interest ($)</th> {/* ✅ New Column */}
      <th>Withdrawal ($)</th>
    </tr>
  </thead>
  <tbody>
  {transactions.length > 0 ? (
    transactions.map((txn, index) => (
      <tr key={index}>
        <td>{new Date(txn.transaction_date).toLocaleDateString()}</td>
        <td>{txn.transaction_type}</td>
        <td>{txn.transaction_type === 'Deposit' ? `$${parseFloat(txn.amount).toFixed(2)}` : "-"}</td>
        <td>{txn.transaction_type === 'Interest' ? `$${parseFloat(txn.amount).toFixed(2)}` : "-"}</td>
        <td>{txn.transaction_type === 'Withdrawal' ? `$${parseFloat(txn.amount).toFixed(2)}` : "-"}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" style={{ textAlign: "center" }}>No transactions found.</td>
    </tr>
  )}
</tbody>
  {/* ✅ Totals Row */}
  <tfoot>
  <tr className="totals-row">
    <td colSpan="2"><strong>Totals:</strong></td>
    <td><strong>${transactions.filter(t => t.transaction_type === 'Deposit').reduce((sum, t) => sum + parseFloat(t.amount), 0).toFixed(2)}</strong></td>
    <td><strong>${transactions.filter(t => t.transaction_type === 'Interest').reduce((sum, t) => sum + parseFloat(t.amount), 0).toFixed(2)}</strong></td>
    <td><strong>${transactions.filter(t => t.transaction_type === 'Withdrawal').reduce((sum, t) => sum + parseFloat(t.amount), 0).toFixed(2)}</strong></td>
  </tr>
  {/* ✅ New Net Total Row */}
  <tr className="net-total-row">
    <td colSpan="4"><strong>NET TOTAL:</strong></td>
    <td><strong>
      ${(
        transactions.filter(t => t.transaction_type === 'Deposit').reduce((sum, t) => sum + parseFloat(t.amount), 0) +
        transactions.filter(t => t.transaction_type === 'Interest').reduce((sum, t) => sum + parseFloat(t.amount), 0) -
        transactions.filter(t => t.transaction_type === 'Withdrawal').reduce((sum, t) => sum + parseFloat(t.amount), 0)
      ).toFixed(2)}
    </strong></td>
  </tr>
</tfoot>
</table>
</div>


      {/* BUTTONS */}
      <div className="buttons-container">
        <button onClick={() => navigate("/investors")} className="back-btn">🔙 Back to Investors</button>
        <button onClick={generateStatement} className="statement-btn">📄 Generate Statement</button>
        <button onClick={handleDelete} className="delete-btn">🗑 Delete Investor</button>
      </div>
    </div>
  );
};

export default InvestorAccount;
