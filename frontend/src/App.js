import React, { useState, useEffect } from "react";
import Login from "./Login";
import Books from "./Books";
import DeleteAccount from "./DeleteAccount";
import { jwtDecode } from "jwt-decode";
import AddBook from "./AddBook";


function App() {
  const token = localStorage.getItem("token");
  const [showDeletePage, setShowDeletePage] = useState(false);
  const [username, setUsername] = useState("");
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // 👤 Extract user details from JWT
        setUsername(decoded.username || "User");
        setIsSuperuser(decoded.is_superuser || false);

        console.log("Decoded Token:", decoded); // Debug (optional)
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    window.location.reload();
  };

  // If not logged in → show login
  if (!token) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Library Management System</h1>
        <Login />
      </div>
    );
  }

  // Delete Account Page
  if (showDeletePage) {
    return (
      <div style={{ padding: "20px" }}>
        <DeleteAccount onBackToApp={() => setShowDeletePage(false)} />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Library Management System</h1>

      {/* 👤 USER HEADER */}
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "8px",
        }}
      >
        <strong>
          Welcome, {username} 👋 {isSuperuser ? "(Admin)" : "(User)"}
        </strong>
      </div>

      {/* 🔓 ACTION BUTTONS */}
      <button
        onClick={handleLogout}
        style={{ marginRight: "10px" }}
      >
        Logout
      </button>

      {/* 🔴 ONLY SHOW FOR NORMAL USERS (NOT SUPERUSERS) */}
      {!isSuperuser && (
        <button
          onClick={() => setShowDeletePage(true)}
          style={{ backgroundColor: "red", color: "white" }}
        >
          Delete My Account
        </button>
      )}

      <hr />

    {/* 📚 ADMIN ONLY: Add Book Panel */}
    {isSuperuser && (
      <AddBook onBookAdded={() => window.location.reload()} />
    )}

    <Books isSuperuser={isSuperuser} />


    </div>
  );
}

export default App;
