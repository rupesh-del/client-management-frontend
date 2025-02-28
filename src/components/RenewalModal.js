import React, { useState, useEffect } from "react";
import "../styles/RenewalModal.css";

const API_BASE_URL = "https://client-management-backend-8x91.onrender.com"; // ✅ Use backend API

const RenewalModal = ({ isOpen, onClose, onSave }) => {
  const [clients, setClients] = useState([]); // ✅ Fetch clients
  const [selectedClient, setSelectedClient] = useState("");
  const [renewalDate, setRenewalDate] = useState("");
  const [nextRenewalDate, setNextRenewalDate] = useState("");
  const [policyDocument, setPolicyDocument] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // ✅ Fetch all clients to populate the dropdown
    const fetchClients = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/clients`);
        if (!response.ok) throw new Error("Failed to fetch clients");

        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const handleFileUpload = async (e) => {
    setPolicyDocument(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedClient || !renewalDate || !nextRenewalDate || !policyDocument) {
      alert("All fields are required!");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", policyDocument);
    formData.append("client_id", selectedClient);
    formData.append("renewal_date", renewalDate);
    formData.append("next_renewal_date", nextRenewalDate);
  
    try {
      setUploading(true);
      console.log("📤 Uploading file to AWS...");
  
      const response = await fetch(`${API_BASE_URL}/renewals`, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      setUploading(false);
  
      if (!response.ok || !data.policy_document) {
        throw new Error(`Failed to upload renewal: ${data.error || "No file URL returned"}`);
      }
  
      console.log("✅ Renewal saved:", data);
      onSave(data);
      onClose();
    } catch (error) {
      console.error("Renewal Upload Error:", error);
      setUploading(false);
      alert("Renewal submission failed. Please check console logs.");
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add Renewal</h3>

        <label>Client:</label>
        <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
          <option value="">Select Client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>

        <label>Date of Renewal:</label>
        <input type="date" value={renewalDate} onChange={(e) => setRenewalDate(e.target.value)} />

        <label>Date of Next Renewal:</label>
        <input type="date" value={nextRenewalDate} onChange={(e) => setNextRenewalDate(e.target.value)} />

        <label>Policy Document:</label>
        <input type="file" onChange={handleFileUpload} />

        <div className="modal-buttons">
          <button className="save-btn" onClick={handleSubmit} disabled={uploading}>
            {uploading ? "Uploading..." : "✔ Save Renewal"}
          </button>
          <button className="close-btn" onClick={onClose} disabled={uploading}>
            ❌ Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenewalModal;
