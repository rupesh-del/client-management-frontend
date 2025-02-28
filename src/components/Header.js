import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const pageTitle = {
    "/": "RCS MANAGEMENT",
    "/insurance": "INSURANCE MANAGEMENT",
    "/investors": "INVESTOR MANAGEMENT",
    "/ferrypass": "FERRYPASS MANAGEMENT",
  };

  const currentTitle = pageTitle[location.pathname] || "RCS MANAGEMENT";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header style={styles.header}>
      {/* Home Button */}
      <div style={styles.leftTitle}>
        <Link to="/" style={styles.homeLink}><b>RCS MANAGEMENT</b></Link>
      </div>

      {/* Navigation Tabs */}
      <nav style={styles.nav}>
        <Link to="/insurance" style={{ ...styles.link, ...(location.pathname === "/insurance" ? styles.activeLink : {}) }}>
          Insurance
        </Link>
        <Link to="/investors" style={{ ...styles.link, ...(location.pathname === "/investors" ? styles.activeLink : {}) }}>
          Investors
        </Link>
        <Link to="/ferrypass" style={{ ...styles.link, ...(location.pathname === "/ferrypass" ? styles.activeLink : {}) }}>
          FerryPass
        </Link>
      </nav>

      {/* Auto-updating Date */}
      <div style={styles.date}>{today}</div>

      {/* Dynamic Page Title */}
      <h1 style={styles.mainTitle}>{currentTitle}</h1>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    backgroundColor: "#004d40",
    color: "#fff",
    position: "relative",
  },
  leftTitle: {
    fontSize: "18px",
  },
  homeLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "18px",
  },
  nav: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "#ffffff", // White text
    textDecoration: "none",
    fontSize: "16px",
    padding: "5px 10px",
    transition: "color 0.3s ease",
  },
  linkHover: {
    color: "#b2dfdb", // Light green on hover
  },
  activeLink: {
    fontWeight: "bold",
    textDecoration: "underline",
    color: "#ffcc00", // Highlight active tab
  },
  date: {
    fontSize: "14px",
  },
  mainTitle: {
    position: "absolute",
    color: "#004d40",  // Dark Green for visibility
    width: "100%",
    textAlign: "center",
    top: "50px",
    fontSize: "20px",
  },
};

export default Header;
