import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./Pages/Home";
import InsuranceClients from "./Pages/InsuranceClients";
import Investors from "./Pages/Investors";
import FerryPass from "./Pages/Ferrypass";
import ClientAccount from "./Pages/ClientAccount"; // Import Client Account Page
import RenewalPage from "./Pages/RenewalPage"; // Import RenewalPage
import InvestorAccount from "./Pages/InvestorAccount";
import CustomersPage from "./Pages/CustomersPage";
import VehicleTypesPage from "./Pages/VehicleTypesPage"
import PassengerTypesPage from "./Pages/PassengerTypesPage"
import VehicleNumbers from "./Pages/VehicleNumbers"; // Import the new page

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/insurance" element={<InsuranceClients />} />
        <Route path="/investors" element={<Investors />} />
        <Route path="/ferrypass" element={<FerryPass />} />

        {/* Client Account Route (Handles dynamic clientId parameter) */}
        <Route path="/client-account/:clientId" element={<ClientAccount />} />
        <Route path="/renewal/:renewalId" element={<RenewalPage />} />
        <Route path="/investor/:id" element={<InvestorAccount />} /> {/* ✅ Route for investor account */}
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/vehicle-types" element={<VehicleTypesPage />} />
        <Route path="/passenger-types" element={<PassengerTypesPage />} />
        <Route path="/vehicle-numbers" element={<VehicleNumbers />} />



      </Routes>
    </Router>
  );
};

export default App;
