import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Ferrypass.css";
import NewBookingModal from "../components/NewBookingModal";

const API_BASE_URL = "https://client-management-backend-8x91.onrender.com";


const FerryPass = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]); // Store vehicle types
  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings`);
      setBookings(response.data); // ✅ Updates the booking list
    } catch (error) {
      console.error("❌ Error fetching bookings:", error);
    }
  };
  
  const fetchVehicleTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vehicle-types`);
      setVehicleTypes(response.data); // Store vehicle types in state
    } catch (error) {
      console.error("❌ Error fetching vehicle types:", error);
    }
  };
  

  // Fetch bookings when the component mounts
  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle new booking save
  const handleNewBookingSave = async () => {
    await fetchBookings(); // Refresh table after a new booking is added
  };

  // Fetch both bookings and vehicle types when the component mounts
  useEffect(() => {
    fetchBookings();
    fetchVehicleTypes(); // Fetch vehicle types
  }, []);
  
  // Handle Status Change (Booking)
  const handleBookingStatusChange = async (id, value) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/bookings/${id}/status`, {
        bookingStatus: value, // ✅ Sends only the bookingStatus field
      });
  
      // Update state with the new status
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === id ? { ...booking, booking_status: response.data.booking_status } : booking
        )
      );
    } catch (error) {
      console.error("❌ Error updating booking status:", error);
    }
  };
  
  const handlePaymentStatusChange = async (id, value) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/bookings/${id}/status`, {
        paymentStatus: value, // ✅ Sends only the paymentStatus field
      });
  
      // Update state with the new status
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === id ? { ...booking, payment_status: response.data.payment_status } : booking
        )
      );
    } catch (error) {
      console.error("❌ Error updating payment status:", error);
    }
  };

  const getStatusColor = (status, type) => {
    if (type === "booking") {
      return status === "Confirmed" ? "green" :
             status === "Pending" ? "orange" :
             status === "Cancelled" ? "red" : "black";
    }
    if (type === "payment") {
      return status === "Paid" ? "green" :
             status === "Outstanding" ? "red" : "black";
    }
    return "black";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle missing date
    return new Date(dateString).toISOString().split("T")[0]; // Extract only YYYY-MM-DD
  };
  
  const handleDeleteBooking = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this booking?")) return;
  
    try {
      await axios.delete(`${API_BASE_URL}/bookings/${id}`);
  
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id));
    } catch (error) {
      console.error("❌ Error deleting booking:", error);
      alert("❌ Failed to delete booking. Please try again.");
    }
  };
  

  return (
    <div className="ferry-pass-container">
      {/* 🔎 Search Bar & "New Booking" Button */}
      <div className="header">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <button className="new-booking-btn" onClick={() => setIsModalOpen(true)}>
          + New Booking
        </button>
      </div>

      {/* 🏷️ Navigation Tabs */}
      <div className="nav-tabs">
  <button className="nav-tab" onClick={() => navigate("/customers")}>Customers</button>
  <button className="nav-tab" onClick={() => navigate("/vehicle-types")}>Vehicle Types</button>
  <button className="nav-tab" onClick={() => navigate("/vehicle-numbers")}>Vehicle Numbers</button>
  <button className="nav-tab" onClick={() => navigate("/passenger-types")}>Passenger Types</button>
</div>


      {/* 📋 Main Ferry Pass Table */}
      <div className="ferry-pass-table">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Vehicle Number</th>
              <th>Vehicle Type</th>
              <th>Booking Number</th>
              <th>Booking Status</th>
              <th>Payment Number</th>
              <th>Payment Status</th>
              <th>Passenger Details</th>
              <th>Mode</th>
              <th>Travel Date</th>
              <th>Mandatory Charge</th>
              <th>Admin Charge</th>
              <th>Net Cost</th>
              <th>Date Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings
              .filter((booking) =>
                (booking.customer_name ? booking.customer_name.toLowerCase() : "").includes(
                  searchQuery.toLowerCase()
                )
              )
              .map((booking, index) => (
                <tr key={index}>
                  <td>{booking.customer_name || "Unknown"}</td>
                  <td>{booking.vehicle_number || "N/A"}</td>
                  <td>
  {vehicleTypes.find(v => v.id.toString() === booking.vehicle_type.toString())?.name || "Unknown"}
</td>

                  <td>{booking.booking_number || "N/A"}</td>
                  <td>
          <select
            value={booking.booking_status || "Pending"}
            onChange={(e) => handleBookingStatusChange(booking.id, e.target.value)}
            style={{ color: getStatusColor(booking.booking_status, "booking") }}
          >
            <option value="Confirmed" style={{ color: "green" }}>Confirmed</option>
            <option value="Pending" style={{ color: "orange" }}>Pending</option>
            <option value="Cancelled" style={{ color: "red" }}>Cancelled</option>
          </select>
        </td>
        <td>{booking.payment_number || "N/A"}</td>
        {/* Payment Status with Color */}
        <td>
          <select
            value={booking.payment_status || "Outstanding"}
            onChange={(e) => handlePaymentStatusChange(booking.id, e.target.value)}
            style={{ color: getStatusColor(booking.payment_status, "payment") }}
          >
            <option value="Paid" style={{ color: "green" }}>Paid</option>
            <option value="Outstanding" style={{ color: "red" }}>Outstanding</option>
          </select>
        </td>
                  <td>
                    {Object.entries(booking.passengers || {}).map(([type, count]) => (
                      <span key={type}>{type}: {count} </span>
                    ))}
                  </td>
                  <td>{booking.mode_of_travel || "One Way"}</td>
                  <td>{formatDate(booking.travel_date)}</td>
                  <td>$120</td> {/* Mandatory Charge */}
                  <td>${booking.admin_charge || 0}</td>
                  <td>${booking.net_cost || 0}</td>
                  <td>{booking.created_at ? new Date(booking.created_at).toLocaleDateString() : "N/A"}</td>
                  <td>
                    <button>Edit</button>
                    <td>
  <button 
    onClick={() => handleDeleteBooking(booking.id)} 
    style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}
  >
    Delete
  </button>
</td>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* 🎉 New Booking Modal Integration */}
      {isModalOpen && (
        <NewBookingModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  fetchBookings={fetchBookings} // ✅ Ensures the table updates after booking
/>

      )}
    </div>
  );
};

export default FerryPass;
