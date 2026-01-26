import { useState } from "react";

export default function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login clicked (backend will be added later)");
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>WorkID</h2>
        <p style={styles.subtitle}>Connecting workers and employers</p>

        <div style={styles.roleSwitch}>
          <button style={styles.activeRole}>Worker</button>
          <button style={styles.role}>Employer</button>
        </div>

        <input
          type="text"
          placeholder="Email or Phone Number"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password / OTP"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button style={styles.button}>Continue to WorkID</button>


        <p style={styles.text}>
          Don’t have an account? <span style={styles.link}>Sign up</span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
  },
  card: {
    width: "100%",
    maxWidth: "380px",
    padding: "30px",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#6b7280",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    cursor: "pointer",
  },
  roleSwitch: {
    display: "flex",
    gap: "10px",
    marginBottom: "16px",
  },
  activeRole: {
    flex: 1,
    padding: "8px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },
  role: {
    flex: 1,
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    cursor: "pointer",
  },

  text: {
    marginTop: "16px",
    textAlign: "center",
    fontSize: "14px",
  },
  link: {
    color: "#2563eb",
    cursor: "pointer",
  },
};
