import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const correctPassword = "rcsadmin"; // ✅ Set your password here

    if (password === correctPassword) {
      sessionStorage.setItem("authenticated", "true");
      setIsAuthenticated(true);
      navigate("/"); // ✅ Redirects to home after successful login
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>RCS Management Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
  },
  heading: {
    color: "green",
    fontSize: "24px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "300px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    textAlign: "center",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#028a0f",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};

export default Login;
