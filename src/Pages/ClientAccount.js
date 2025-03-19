import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClientById, updateClient, uploadPolicyDocument, deleteAttachment, deleteClient } from "../api";
import "../styles/clientAccount.css";
import RenewalModal from "../components/RenewalModal";


const API_BASE_URL = "https://client-management-backend-8x91.onrender.com"; // ✅ Replace with actual backend URL

const ClientAccount = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedClient, setUpdatedClient] = useState({});
  const [newAttachment, setNewAttachment] = useState(null);
  const [renewals, setRenewals] = useState([]);


  useEffect(() => {
    const fetchClient = async () => {
      const data = await getClientById(clientId);
      if (data) {
        setClient(data);
        setUpdatedClient(data);
        setRenewals(data.renewals || []);  // Ensure renewals load
      }
    };
    fetchClient();
  }, [clientId]);

  const handleEditChange = (e) => {
    setUpdatedClient({ ...updatedClient, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    console.log("🔄 Preparing update request...");
  
    // Ensure required fields are always included
    const finalUpdate = {
      name: updatedClient.name || client.name,
      policy_number: updatedClient.policy_number || client.policy_number,
      vehicle_number: updatedClient.vehicle_number || client.vehicle_number,
      premium_paid: updatedClient.premium_paid || client.premium_paid,
      paid_to_apex: updatedClient.paid_to_apex || client.paid_to_apex,
      insurer: updatedClient.insurer || client.insurer,
      renewal_date: updatedClient.renewal_date || client.renewal_date,
      additional_attachments: updatedClient.additional_attachments || client.additional_attachments,
    };
  
    console.log("📤 Sending final update:", finalUpdate);
  
    try {
      const response = await updateClient(clientId, finalUpdate);
  
      if (response) {
        console.log("✅ Client successfully updated:", response);
        setClient(response);
        setIsEditing(false);
      } else {
        console.error("❌ Update failed");
      }
    } catch (error) {
      console.error("❌ Error saving client data:", error.response?.data || error);
    }
  };
 
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadedFileUrl = await uploadPolicyDocument(file);
      if (uploadedFileUrl) {
        const updatedAttachments = [...(updatedClient.additionalAttachments || []), uploadedFileUrl];

        setUpdatedClient({ ...updatedClient, additionalAttachments: updatedAttachments });

        await updateClient(clientId, { additionalAttachments: updatedAttachments });

        console.log("✅ Attachment added and database updated:", updatedAttachments);
      }
    }
  };

  const handleDeleteAttachment = async (attachmentUrl) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this attachment?");
    if (!confirmDelete) return;

    await deleteAttachment(attachmentUrl);

    const updatedAttachments = updatedClient.additionalAttachments.filter((url) => url !== attachmentUrl);

    setUpdatedClient({ ...updatedClient, additionalAttachments: updatedAttachments });

    await updateClient(clientId, { additionalAttachments: updatedAttachments });

    console.log("✅ Attachment deleted:", attachmentUrl);
  };

  useEffect(() => {
    const fetchClientAndRenewals = async () => {
      try {
        // Fetch Client Information
        const clientResponse = await fetch(`${API_BASE_URL}/clients/${clientId}`);
        if (!clientResponse.ok) throw new Error("Failed to fetch client data");
        const clientData = await clientResponse.json();
        setClient(clientData);
  
        // Fetch Renewals for this Client
        const renewalResponse = await fetch(`${API_BASE_URL}/clients/${clientId}/renewals`);
        if (!renewalResponse.ok) throw new Error("Failed to fetch renewals");
        const renewalData = await renewalResponse.json();
        setRenewals(renewalData); // ✅ Now storing renewals in state
  
      } catch (error) {
        console.error("Error fetching client or renewals:", error);
      }
    };
  
    fetchClientAndRenewals();
  }, [clientId]);
  


  const handleDeleteClient = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this client? This action cannot be undone.");
    if (!confirmDelete) return;

    await deleteClient(clientId);
    console.log("✅ Client deleted, navigating back to Insurance Clients.");
    navigate("/insurance-clients");
  };

  
// State for the renewal modal and form inputs
const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
const [newRenewal, setNewRenewal] = useState({
  renewal_date: "",
  next_renewal_date: "",
  policy_document: "",
});

// Function to handle file upload
const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const uploadedFileUrl = await uploadPolicyDocument(file);
    setNewRenewal({ ...newRenewal, policy_document: uploadedFileUrl });
  }
};

// Function to save the renewal
const handleSaveRenewal = async () => {
  if (!newRenewal.renewal_date || !newRenewal.next_renewal_date || !newRenewal.policy_document) {
    alert("All fields are required!");
    return;
  }

  const updatedRenewals = [...renewals, { id: Date.now(), ...newRenewal }];
  setRenewals(updatedRenewals);

  // Save renewal to database
  await updateClient(clientId, { renewals: updatedRenewals });

  console.log("✅ Renewal saved:", updatedRenewals);
  setIsRenewalModalOpen(false);
};


return (
  <div className="client-account">
    <h2 className="insurance-heading">Client Account</h2>

    {client ? (
      <div className="client-details">
        <div className="insurance-details-grid">
          
          <div className="detail-box">
            <label>Client Name:</label>
            {isEditing ? (
              <input type="text" name="name" value={updatedClient.name} onChange={handleEditChange} />
            ) : (
              <p>{client.name}</p>
            )}
          </div>

          <div className="detail-box">
            <label>Policy Number:</label>
            {isEditing ? (
              <input type="text" name="policy_number" value={updatedClient.policy_number} onChange={handleEditChange} />
            ) : (
              <p>{client.policy_number}</p>
            )}
          </div>

          <div className="detail-box">
            <label>Vehicle Number:</label>
            {isEditing ? (
              <input type="text" name="vehicle_number" value={updatedClient.vehicle_number} onChange={handleEditChange} />
            ) : (
              <p>{client.vehicle_number}</p>
            )}
          </div>

          <div className="detail-box">
            <label>Premium Paid:</label>
            {isEditing ? (
              <select name="premium_paid" value={updatedClient.premium_paid} onChange={handleEditChange}>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            ) : (
              <p>{client.premium_paid}</p>
            )}
          </div>

          <div className="detail-box">
            <label>Paid to Apex:</label>
            {isEditing ? (
              <select name="paid_to_apex" value={updatedClient.paid_to_apex} onChange={handleEditChange}>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            ) : (
              <p>{client.paid_to_apex}</p>
            )}
          </div>

          <div className="detail-box">
            <label>Payment Number:</label>
            {isEditing ? (
              <input type="text" name="payment_number" value={updatedClient.payment_number} onChange={handleEditChange} />
            ) : (
              <p>{client.payment_number || "N/A"}</p>
            )}
          </div>

          <div className="detail-box">
            <label>Premium:</label>
            {isEditing ? (
              <input type="text" name="premium" value={updatedClient.premium} onChange={handleEditChange} />
            ) : (
              <p>${client.premium || "N/A"}</p>
            )}
          </div>

          <div className="detail-box">
            <label>Insurer:</label>
            {isEditing ? (
              <input type="text" name="insurer" value={updatedClient.insurer} onChange={handleEditChange} />
            ) : (
              <p>{client.insurer}</p>
            )}
          </div>

          <div className="detail-box">
            <label>Policy Type:</label>
            {isEditing ? (
              <select name="policy_type" value={updatedClient.policy_type} onChange={handleEditChange}>
                <option value="Motor">Motor</option>
                <option value="Fire">Fire</option>
                <option value="Life">Life</option>
              </select>
            ) : (
              <p>{client.policy_type || "N/A"}</p>
            )}
          </div>

          <div className="detail-box full-width">
            <label>Date of Next Renewal:</label>
            {isEditing ? (
              <input type="date" name="renewal_date" value={updatedClient.renewal_date} onChange={handleEditChange} />
            ) : (
              <p>{client.renewal_date}</p>
            )}
          </div>

          <div className="detail-box full-width">
            <label>Policy Document:</label>
            {client.policy_document ? (
              <p>
                <a href={client.policy_document} target="_blank" rel="noopener noreferrer">
                  View Policy Document
                </a>
              </p>
            ) : (
              <p>No document uploaded</p>
            )}
          </div>

          <div className="detail-box full-width">
            <label>Additional Attachments:</label>
            {updatedClient.additionalAttachments && updatedClient.additionalAttachments.length > 0 ? (
              <ul>
                {updatedClient.additionalAttachments.map((attachment, index) => (
                  <li key={index}>
                    <a href={attachment} target="_blank" rel="noopener noreferrer">
                      View Attachment {index + 1}
                    </a>
                    <button onClick={() => handleDeleteAttachment(attachment)}>🗑 Delete</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No attachments</p>
            )}
            <input type="file" onChange={handleFileChange} />
          </div>
        </div>

        {/* Edit Confirmation */}
        {isEditing ? (
          <button className="save-button" onClick={handleSaveChanges}>✔ Confirm Changes</button>
        ) : (
          <button className="edit-button" onClick={() => setIsEditing(true)}>✏ Edit Details</button>
        )}

        {/* Delete Client Button */}
        <button className="delete-client-btn" onClick={handleDeleteClient}>🗑 Delete Client</button>

        {/* Renewal Button */}
        <button onClick={() => setIsRenewalModalOpen(true)}>➕ Add Renewal</button>

        <RenewalModal
          isOpen={isRenewalModalOpen}
          onClose={() => setIsRenewalModalOpen(false)}
          onSave={handleSaveRenewal}
          clientId={clientId} // ✅ Pass clientId for backend API
        />

        {/* List of Renewals */}
        <h3>Renewal History</h3>
        {renewals.length > 0 ? (
          <ul>
            {renewals.map((renewal, index) => (
              <li key={index}>
                <p><strong>Renewal Date:</strong> {new Date(renewal.renewal_date).toLocaleDateString()}</p>
                <p><strong>Next Renewal Date:</strong> {new Date(renewal.next_renewal_date).toLocaleDateString()}</p>
                <a href={renewal.policy_document} target="_blank" rel="noopener noreferrer">
                  📄 View Policy Document
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No renewals found.</p>
        )}
      </div>
    ) : (
      <p>Loading client details...</p>
    )}
  </div>
);
};
export default ClientAccount;