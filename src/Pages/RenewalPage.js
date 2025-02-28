import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const RenewalPage = ({ renewals, setRenewals }) => {
  const { renewalId } = useParams();
  const navigate = useNavigate();

  const renewal = renewals.find((r) => r.id === parseInt(renewalId));

  if (!renewal) {
    return <p>Renewal not found!</p>;
  }

  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this renewal?");
    if (!confirmDelete) return;

    const updatedRenewals = renewals.filter((r) => r.id !== parseInt(renewalId));
    setRenewals(updatedRenewals);
    navigate(-1);
  };

  return (
    <div>
      <h2>Renewal Details</h2>
      <p><strong>Renewal Date:</strong> {renewal.renewal_date}</p>
      <p><strong>Next Renewal Date:</strong> {renewal.next_renewal_date}</p>
      <p><strong>Policy Document:</strong></p>
      <a href={renewal.policy_document} target="_blank" rel="noopener noreferrer">📄 View Document</a>

      <button onClick={handleDelete} style={{ backgroundColor: "red" }}>🗑 Delete Renewal</button>
    </div>
  );
};

export default RenewalPage;