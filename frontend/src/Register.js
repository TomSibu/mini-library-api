import React, { useState } from "react";

function Register({ onRegisterSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    // 🔴 Frontend Validation (Compulsory Fields)
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("All fields (Username, Email, Password) are required.");
      return;
    }

    // Optional: password strength check (recommended)
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError(""); // Clear previous error

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await response.json();

      if (response.status === 201) {
        alert("User registered successfully! Please login.");
        onRegisterSuccess(); // Auto return to login
      } else {
        setError(data.detail || JSON.stringify(data));
      }
    } catch (error) {
      console.error("Register error:", error);
      setError("Server error during registration");
    }
  };

  return (
    <div>
      <h2>Register New User</h2>

      {/* 🔴 Error Message Display */}
      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          {error}
        </p>
      )}

      <input
        placeholder="Username (Required)"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br /><br />

      <input
        type="email"
        placeholder="Email (Required)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password (Required)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleRegister}>
        Register
      </button>

      <br /><br />

      {/* Optional Back Button (Professional UX) */}
      <button onClick={onRegisterSuccess}>
        Back to Login
      </button>
    </div>
  );
}

export default Register;
