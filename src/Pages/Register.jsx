import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

// Tentukan API Base URL
const API_URL = "http://localhost:4000";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Tambah state untuk loading

  const handleRegister = async (e) => { // Gunakan async
    e.preventDefault();
    setError("");

    // Validasi dasar
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/register", {
        username,
        email,
        password,
      });

      // Berhasil
      navigate("/login");
    } catch (err) {
      console.error("Register Error:", err);

      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="login-title">Register</h2>

        {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}

        <input
          type="text"
          placeholder="Username"
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="sign-in-btn" onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Tombol kembali ke login */}
        <button
          className="sign-in-btn"
          style={{ marginTop: "12px"}}
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}