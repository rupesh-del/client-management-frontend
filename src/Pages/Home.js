import React from "react";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div style={styles.container}>
      <h2>Welcome to RCS Management</h2>
      <p>Select a section from the navigation bar.</p>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
};

export default Home;
