import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
} from "@mui/material";

function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    setError("");
    setMessage("");

    if (!email || !newPassword) {
      setError("Email and new password are required.");
      return;
    }

    const response = await fetch(
      "http://127.0.0.1:8000/api/auth/forgot-password/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          new_password: newPassword,
        }),
      }
    );

    const data = await response.json();

    if (response.status === 200) {
      setMessage("Password reset successful. You can now login.");
    } else {
      setError(data.error);
    }
  };

  return (
    <Card elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
      <CardContent>
        <Typography variant="h5">Forgot Password</Typography>

        <Stack spacing={2} mt={2}>
          {error && <Alert severity="error">{error}</Alert>}
          {message && <Alert severity="success">{message}</Alert>}

          <TextField
            label="Registered Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Button variant="contained" onClick={handleReset}>
            Reset Password
          </Button>

          <Button variant="outlined" onClick={onBack}>
            Back to Login
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ForgotPassword;
