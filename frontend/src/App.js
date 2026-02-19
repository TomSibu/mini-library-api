import React from "react";
import Login from "./Login";
import Books from "./Books";

function App() {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    window.location.reload();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Library Management System</h1>

      {token ? (
        <>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "10px",
              marginBottom: "20px",
            }}
          >
            Logout
          </button>
          <Books />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
