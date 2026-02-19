import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Stack,
} from "@mui/material";

function Register({ onRegisterSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    // 🔒 Required Field Validation (Compulsory fields)
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("All fields (Username, Email, Password) are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 201) {
        setSuccess("Account created successfully. Please login.");
        setUsername("");
        setEmail("");
        setPassword("");

        // Auto return to login after 1.5 seconds
        setTimeout(() => {
          onRegisterSuccess();
        }, 1500);
      } else {
        // Clean error message (not raw JSON)
        if (data.username) {
          setError("Username already exists.");
        } else if (data.email) {
          setError("Invalid email address.");
        } else {
          setError("Registration failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Register error:", error);
      setError("Server error during registration.");
    }
  };

  return (
    <Card elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create Account
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Register a new library account
        </Typography>

        <Stack spacing={2}>
          {error && (
            <Alert severity="error" variant="outlined">
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" variant="outlined">
              {success}
            </Alert>
          )}

          <TextField
            label="Username"
            placeholder="Enter your username"
            fullWidth
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            label="Email"
            type="email"
            placeholder="Enter your email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            placeholder="Enter your password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Box display="flex" gap={2} mt={1}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleRegister}
            >
              Register
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={onRegisterSuccess}
            >
              Back to Login
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default Register;
