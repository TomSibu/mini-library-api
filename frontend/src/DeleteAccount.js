import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";

function DeleteAccount({ onBackToApp }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    setError("");

    if (!password) {
      setError("Password is required.");
      return;
    }

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
        window.location.reload();
      } else {
        setError(data.error || "Failed to delete account.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while deleting account.");
    }
  };

  return (
    <Card elevation={6} sx={{ border: "2px solid red" }}>
      <CardContent>
        <Typography variant="h4" color="error" gutterBottom>
          ⚠ Delete Account
        </Typography>

        <Alert severity="warning" sx={{ mb: 2 }}>
          This action is permanent. You cannot recover your account after deletion.
          Make sure you have returned all borrowed books.
        </Alert>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Typography variant="body1" gutterBottom>
          Enter your password to confirm account deletion:
        </Typography>

        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mt: 1 }}
        />

        <Box mt={3} display="flex" gap={2}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
          >
            Confirm Delete Account
          </Button>

          <Button
            variant="outlined"
            onClick={onBackToApp}
          >
            Cancel & Go Back
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default DeleteAccount;
