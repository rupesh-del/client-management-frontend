import React, { useState } from "react";
import { addClient, uploadPolicyDocument } from "../api"; // Import API functions
import "../styles/NewClientModal.css"; // Ensure this file exists

const NewClientModal = ({ onClose, refreshClients }) => {
  const [clientData, setClientData] = useState({
    name: "",
    policyNumber: "",
    vehicleNumber: "",
    premiumPaid: "No",
    paidToApex: "No",
    paymentNumber: "",
    premium: "",
    insurer: "",
    renewalDate: "",
    policyType: "Motor",
    policyDocument: null, // Stores uploaded file URL from AWS S3
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const uploadedFileUrl = await uploadPolicyDocument(file); // Upload to AWS S3
      setIsUploading(false);
      setClientData({ ...clientData, policyDocument: uploadedFileUrl }); // Store S3 URL in state
    }
  };

  const handleSubmit = async () => {
    await addClient(clientData); // Save client details in PostgreSQL
    refreshClients(); // Refresh client list after adding
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add New Client</h2>

        {/* FORM GRID */}
        <div className="modal-form">
          <div>
            <label>Client Name:</label>
            <input type="text" name="name" onChange={handleChange} />
          </div>

          <div>
            <label>Policy Number:</label>
            <input type="text" name="policyNumber" onChange={handleChange} />
          </div>

          <div>
            <label>Vehicle Number:</label>
            <input type="text" name="vehicleNumber" onChange={handleChange} />
          </div>

          <div>
            <label>Premium Paid:</label>
            <select name="premiumPaid" onChange={handleChange}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div>
            <label>Paid to Apex:</label>
            <select name="paidToApex" onChange={handleChange}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div>
            <label>Payment Number:</label>
            <input type="text" name="paymentNumber" onChange={handleChange} />
          </div>

          <div>
            <label>Premium:</label>
            <input type="text" name="premium" onChange={handleChange} />
          </div>

          <div>
            <label>Insurer:</label>
            <input type="text" name="insurer" onChange={handleChange} />
          </div>

          <div>
            <label>Date of Next Renewal:</label>
            <input type="date" name="renewalDate" onChange={handleChange} />
          </div>

          <div>
            <label>Policy Type:</label>
            <select name="policyType" onChange={handleChange}>
              <option value="Motor">Motor</option>
              <option value="Fire">Fire</option>
              <option value="Life">Life</option>
            </select>
          </div>

          {/* UPDATED: Policy Document Upload to AWS */}
          <div className="file-upload">
            <label>Policy Document:</label>
            <input type="file" name="policyDocument" onChange={handleFileChange} />
            {isUploading ? <p className="uploading">Uploading...</p> : null}
            {clientData.policyDocument && (
              <p className="file-name">📄 <a href={clientData.policyDocument} target="_blank" rel="noopener noreferrer">View Document</a></p>
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="modal-buttons">
          <button onClick={handleSubmit} disabled={isUploading}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NewClientModal;
