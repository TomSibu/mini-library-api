import React, { useState } from "react";

function DeleteAccount({ onBackToApp }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/delete-account/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        alert("Account deleted successfully.");
        localStorage.removeItem("token");
        window.location.reload(); // Back to login page
      } else {
        setError(data.error || "Account deletion failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while deleting account.");
    }
  };

  return (
    <div>
      <h2>Delete Account</h2>
      <p style={{ color: "red", fontWeight: "bold" }}>
        Warning: This action is permanent!
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="password"
        placeholder="Enter your password to confirm"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button
        onClick={handleDelete}
        style={{ backgroundColor: "red", color: "white" }}
      >
        Confirm Delete Account
      </button>

      <br /><br />

      <button onClick={onBackToApp}>
        Cancel & Go Back
      </button>
    </div>
  );
}

export default DeleteAccount;
