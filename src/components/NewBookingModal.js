import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/NewBookingModal.css";

const API_BASE_URL = "https://client-management-backend-8x91.onrender.com";

const NewBookingModal = ({ isOpen, onClose }) => {
  const [customers, setCustomers] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [passengerTypes, setPassengerTypes] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [newCustomer, setNewCustomer] = useState({ name: "", contact: "" });
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [bookingNumber, setBookingNumber] = useState("");
  const [paymentNumber, setPaymentNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [passengerCounts, setPassengerCounts] = useState({});
  const [mode, setMode] = useState("One Way");
  const [travelDate, setTravelDate] = useState("");
  const [adminCharge, setAdminCharge] = useState(false);
  const [netCost, setNetCost] = useState(120); // Starts with mandatory charge

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      fetchVehicleTypes();
      fetchPassengerTypes();
    }
  }, [isOpen]);

  // Fetch Customers
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error("❌ Error fetching customers:", error);
    }
  };

  // Fetch Vehicle Types
  const fetchVehicleTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vehicle-types`);
      setVehicleTypes(response.data);
    } catch (error) {
      console.error("❌ Error fetching vehicle types:", error);
    }
  };

  const fetchPassengerTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/passenger-types`);
      console.log("✅ Passenger Types Response:", response.data); // Debugging
      setPassengerTypes(response.data);
    } catch (error) {
      console.error("❌ Error fetching passenger types:", error);
    }
  };
  
  

  // Handle Customer Selection
  const handleCustomerChange = (e) => {
    const value = e.target.value;
    setSelectedCustomer(value);
    const customerExists = customers.some((customer) => customer.name === value);
    setShowAddCustomer(!customerExists);
  };

  // Add New Customer
  const addCustomer = async () => {
    if (!newCustomer.name || !newCustomer.contact) {
      alert("Name and contact are required");
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/customers`, newCustomer);
      setCustomers([...customers, response.data]);
      setSelectedCustomer(newCustomer.name);
      setShowAddCustomer(false);
      setNewCustomer({ name: "", contact: "" });
    } catch (error) {
      console.error("❌ Error adding customer:", error);
    }
  };

  // Handle Passenger Count Change
  const handlePassengerCountChange = (type, count) => {
    setPassengerCounts((prev) => ({
      ...prev,
      [type]: count,
    }));
  };

  // Calculate Net Cost
  useEffect(() => {
    const vehicleCost = vehicleTypes.find((v) => v.id === Number(selectedVehicleType))?.cost || 0;
    
    const passengerCost = Object.entries(passengerCounts).reduce((total, [type, count]) => {
      const passengerType = passengerTypes.find((p) => p.name === type);
      return total + (passengerType ? Number(passengerType.cost) * count : 0); // ✅ Convert cost to a number
    }, 0);
  
    const baseCost = Number(vehicleCost) + Number(passengerCost); // ✅ Ensure proper number conversion
    const tripMultiplier = mode === "One Way" ? 1 : 2;
    const mandatoryCharge = 120;
    const adminChargeValue = adminCharge ? 120 : 0;
  
    const totalCost = (baseCost * tripMultiplier) + mandatoryCharge + adminChargeValue;
    
    setNetCost(totalCost.toFixed(2)); // ✅ Fix floating point precision
  }, [selectedVehicleType, passengerCounts, mode, adminCharge]);
  
  

  // Submit Booking
  const handleSubmit = async () => {
    const bookingData = {
      customer: selectedCustomer,
      bookingNumber,
      paymentNumber,
      vehicleNumber,
      vehicleType: selectedVehicleType,
      passengers: passengerCounts,
      mode,
      travelDate,
      adminCharge: adminCharge ? 120 : 0,
      netCost,
    };

    try {
      await axios.post(`${API_BASE_URL}/bookings`, bookingData);

    // ✅ Store the vehicle number and type in "vehicle_numbers" table
    await axios.post(`${API_BASE_URL}/vehicle-numbers`, {
      vehicleNumber,
      vehicleType: selectedVehicleType,
    });
    
      alert("Booking successfully created!");
      onClose();
    } catch (error) {
      console.error("❌ Error submitting booking:", error);
      alert("Failed to create booking");
    }
  };

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>New Booking</h2>
        <div className="modal-body">

          {/* Customer Lookup */}
          <div className="form-group">
            <label>Customer</label>
            <select value={selectedCustomer} onChange={handleCustomerChange}>
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.name}>{customer.name}</option>
              ))}
            </select>
          </div>

          {/* Booking Details */}
          <input type="text" placeholder="Booking Number" value={bookingNumber} onChange={(e) => setBookingNumber(e.target.value)} />
          <input type="text" placeholder="Payment Number" value={paymentNumber} onChange={(e) => setPaymentNumber(e.target.value)} />
          <input type="text" placeholder="Vehicle Number" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} />


            {/*Vehicle Type Selection*/}
          <div className="form-group">
  <label>Vehicle Type</label>
  <select value={selectedVehicleType} onChange={(e) => setSelectedVehicleType(e.target.value)}>
    <option value="">Select Vehicle Type</option>
    {vehicleTypes.length > 0 ? (
      vehicleTypes.map((vehicle) => (
        <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>
      ))
    ) : (
      <option disabled>No Vehicle Types Available</option>
    )}
  </select>
</div>
{/*Passenger Type Selection*/}
<div className="form-group">
  <label>Passengers</label>
  {passengerTypes.length > 0 ? (
  passengerTypes.map((passenger) => (
    <div key={passenger.id} className="passenger-row">
      <span>{passenger.name}</span> {/* Fix: Use name instead of type */}
      <button 
        className="counter-btn" 
        onClick={() => handlePassengerCountChange(passenger.name, Math.max(0, (passengerCounts[passenger.name] || 0) - 1))}
      >
        -
      </button>
      <span>{passengerCounts[passenger.name] || 0}</span>
      <button 
        className="counter-btn" 
        onClick={() => handlePassengerCountChange(passenger.name, (passengerCounts[passenger.name] || 0) + 1)}
      >
        +
      </button>
    </div>
  ))
  ) : (
    <p>No Passenger Types Available</p>
  )}
</div>
{/*Travel Date Selector */}
<div className="form-group">
  <label>Travel Date</label>
  <input 
    type="date" 
    value={travelDate} 
    onChange={(e) => setTravelDate(e.target.value)} 
  />
</div>
{/*Admin Charge */}
<div className="form-group">
  <input 
    type="checkbox" 
    checked={adminCharge} 
    onChange={() => setAdminCharge(!adminCharge)} 
  />
  <label> Include Admin Charge ($120) </label>
</div>

          {/* Mode Selection */}
          <div className="form-group">
  <label>Mode of Travel</label>
  <select value={mode} onChange={(e) => setMode(e.target.value)}>
    <option value="One Way">One Way</option>
    <option value="Round Trip">Round Trip</option>
  </select>
</div>
          {/* Net Cost */}
          <h3>Net Cost: ${netCost}</h3>

          {/* Submit & Cancel */}
          <button onClick={handleSubmit} className="submit-btn">Submit</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  ) : null;
};

export default NewBookingModal;
