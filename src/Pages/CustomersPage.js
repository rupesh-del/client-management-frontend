import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CustomersPage.css"; 
import NewCustomerModal from "../components/NewCustomerModal";

const CustomersPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("https://client-management-backend-8x91.onrender.com/customers");
        if (!response.ok) throw new Error("Failed to fetch customers");
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("❌ Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  // ✅ Delete a customer using API
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://client-management-backend-8x91.onrender.com/customers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete customer");

      setCustomers(customers.filter((customer) => customer.id !== id)); // Remove from UI
    } catch (error) {
      console.error("❌ Error deleting customer:", error);
    }
  };

  const handleEdit = (id) => {
    alert(`Editing customer with ID: ${id}`);
  };

  const handleNewCustomerSave = (newCustomer) => {
    setCustomers([...customers, newCustomer]); // Add new customer to UI
  };

  return (
    <div className="customers-container">
      {/* 🔙 Back to FerryPass Button */}
      <button className="back-btn" onClick={() => navigate("/ferrypass")}>
        ⬅ Back to FerryPass
      </button>

      {/* 🔎 Search Bar & "New Customer" Button */}
      <div className="header">
        <input
          type="text"
          placeholder="Search Customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="new-customer-btn" onClick={() => setIsModalOpen(true)}>
          + New Customer
        </button>
      </div>

      {/* 📋 Customers Table */}
      <div className="customers-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers
              .filter((customer) =>
                customer.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((customer, index) => (  // Ensure unique keys
                <tr key={customer.id || `customer-${index}`}>
                  <td>{customer.name}</td>
                  <td>{customer.contact}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(customer.id)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(customer.id)}>Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* 🆕 New Customer Modal */}
      {isModalOpen && (
        <NewCustomerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleNewCustomerSave}
        />
      )}
    </div>
  );
};

export default CustomersPage;
