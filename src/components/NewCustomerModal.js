import React, { useState } from "react";
import "../styles/NewCustomerModal.css"; // Ensure this file exists

const NewCustomerModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !contact.trim()) {
      alert("Both fields are required.");
      return;
    }

    setLoading(true); // Show loading state

    const newCustomer = {
      name,
      contact,
    };

    try {
      const response = await fetch("https://client-management-backend-8x91.onrender.com/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add customer.");
      }

      const savedCustomer = await response.json();
      onSave(savedCustomer); // Update frontend with new customer
      setName("");
      setContact("");
      onClose(); // Close modal
    } catch (error) {
      console.error("❌ Error adding customer:", error);
      alert(error.message || "Error adding customer. Please try again.");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Customer</h2>
        <form onSubmit={handleSubmit}>
          <label>Customer Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Contact Number:</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
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

export default NewCustomerModal;
