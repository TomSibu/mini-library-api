import React, { useState } from "react";
import Register from "./Register";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.access) {
        localStorage.setItem("token", data.access);
        alert("Login Successful!");
        window.location.reload();
      } else {
        alert("Login Failed: " + (data.detail || "Invalid credentials"));
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error during login");
    }
  };

  // 👇 If user clicks register, show register page
  if (showRegister) {
    return (
      <Register
        onRegisterSuccess={() => setShowRegister(false)}
      />
    );
  }

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>

      <br /><br />

      <button
        onClick={() => setShowRegister(true)}
        style={{ backgroundColor: "green", color: "white" }}
      >
        Create New Account
      </button>
    </div>
  );
}

export default Login;
