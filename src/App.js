import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./Pages/Home";
import InsuranceClients from "./Pages/InsuranceClients";
import Investors from "./Pages/Investors";
import FerryPass from "./Pages/Ferrypass";
import ClientAccount from "./Pages/ClientAccount";
import RenewalPage from "./Pages/RenewalPage";
import InvestorAccount from "./Pages/InvestorAccount";
import CustomersPage from "./Pages/CustomersPage";
import VehicleTypesPage from "./Pages/VehicleTypesPage";
import PassengerTypesPage from "./Pages/PassengerTypesPage";
import VehicleNumbers from "./Pages/VehicleNumbers";
import Login from "./components/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("authenticated") === "true"
  );

  useEffect(() => {
    // ✅ Ensure the authentication state updates
    const authStatus = sessionStorage.getItem("authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        {/* ✅ Require login before accessing any route */}
        {!isAuthenticated ? (
          <Route path="*" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/insurance" element={<InsuranceClients />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/ferrypass" element={<FerryPass />} />
            <Route path="/client-account/:clientId" element={<ClientAccount />} />
            <Route path="/renewal/:renewalId" element={<RenewalPage />} />
            <Route path="/investor/:id" element={<InvestorAccount />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/vehicle-types" element={<VehicleTypesPage />} />
            <Route path="/passenger-types" element={<PassengerTypesPage />} />
            <Route path="/vehicle-numbers" element={<VehicleNumbers />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
