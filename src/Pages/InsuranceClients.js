import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getClients } from "../api"; // Import API function
import NewClientModal from "../components/NewClientModal";
import "../styles/insuranceClients.css";

const InsuranceClients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Initialize navigation

  const [clients, setClients] = useState([]);

  // Fetch clients from the backend on page load
  useEffect(() => {
    const fetchClients = async () => {
      const data = await getClients();
      setClients(data);
    };
    fetchClients();
  }, []);

  // Function to refresh the table after an update
  const refreshClients = async () => {
    const data = await getClients();
    setClients(data);
  };

  // Function to navigate to the Client Account page
  const handleRowClick = (clientId) => {
    navigate(`/client-account/${clientId}`);
  };

  return (
    <div className="insurance-clients">

      {/* SEARCH BAR & ADD CLIENT BUTTON */}
      <div className="top-bar">
        <input
          type="text"
          placeholder="🔍 Search by Client, Policy Number, or Vehicle Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="new-client-btn" onClick={() => setIsModalOpen(true)}>
          ➕ New Client
        </button>
      </div>

      {isModalOpen && <NewClientModal onClose={() => setIsModalOpen(false)} refreshClients={refreshClients} />}

      {/* SCROLLABLE TABLE CONTAINER */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Premium Paid</th>
              <th>Paid to Apex</th>
              <th>Payment Number</th>
              <th>Vehicle Number</th>
              <th>Policy Number</th>
              <th>Premium</th>
              <th>Insurer</th>
              <th>Date of Next Renewal</th>
              <th>Policy Type</th>
            </tr>
          </thead>
          <tbody>
  {clients
    .filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.policy_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((client, index) => (
      <tr key={index} onClick={() => handleRowClick(client.id)} className="clickable-row">
        <td>{client.name}</td>
        <td>{client.premium_paid}</td>
        <td>{client.paid_to_apex}</td>
        <td>{client.payment_number}</td>
        <td>{client.vehicle_number}</td>
        <td>{client.policy_number}</td>
        <td>{client.premium}</td>
        <td>{client.insurer}</td>
        <td>{client.renewal_date}</td>
        <td>{client.policy_type}</td>
      </tr>
    ))}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default InsuranceClients;