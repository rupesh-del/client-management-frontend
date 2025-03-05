import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // ✅ Check sessionStorage to see if the user is authenticated
    const authStatus = sessionStorage.getItem("authenticated");

    if (authStatus === "true") {
      setIsAuthenticated(true);
    } else {
      navigate("/login"); // ✅ Redirect only if not authenticated
    }
  }, [navigate]);

  if (!isAuthenticated) return null; // ✅ Prevents rendering blank screen

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <img src="/logo.png" alt="Company Logo" style={styles.companyLogo} />
      </div>

      <div style={styles.textContainer}>
        <h2 style={styles.heading}>Welcome to RCS Management</h2>
        <p>Select a section from the navigation bar.</p>

        {/* ✅ "RCS RECEIVABLES" Button */}
        <a href="https://receivables-frontend.onrender.com" target="_blank" rel="noopener noreferrer">
          <button style={styles.receivablesButton}>RCS RECEIVABLES</button>
        </a>
          {/* ✅ "ADMIN APP" Button */}
  <a href="https://adminappfrontend.onrender.com" target="_blank" rel="noopener noreferrer">
    <button style={styles.adminButton}>ADMIN APP</button>
  </a>

        <Footer />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",
    paddingBottom: "50px",
  },
  logoContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "50%",
  },
  companyLogo: {
    maxWidth: "80%",
    height: "auto",
    objectFit: "contain",
  },
  textContainer: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column", // ✅ Forces buttons to stack vertically
    alignItems: "center", // ✅ Centers buttons horizontally
    gap: "10px", // ✅ Adds space between buttons
  },
  heading: {
    color: "#004d40",
    fontSize: "24px",
    fontWeight: "bold",
  },
  receivablesButton: {
    backgroundColor: "#0a3d2e",
    color: "white",
    border: "none",
    padding: "12px 20px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    width: "200px", // ✅ Keeps buttons same width
  },
  adminButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "12px 20px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    width: "200px", // ✅ Keeps buttons same width
  },
};

export default Home;
