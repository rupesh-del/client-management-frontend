import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <b>RCS ALL RIGHTS RESERVED - {currentYear}</b>
    </footer>
  );
};

const styles = {
  footer: {
    textAlign: "center",
    padding: "10px",
    backgroundColor: "#004d40",
    color: "#fff",
    fontSize: "14px",
    position: "fixed", // ✅ Ensures footer stays at the bottom
    bottom: "0",
    left: "0",
    width: "100%",
  },
};

export default Footer;
