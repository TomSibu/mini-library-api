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
  Grid,
} from "@mui/material";

function Register({ onRegisterSuccess }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.username.trim()) return "Username is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!form.password.trim()) return "Password is required.";

    if (form.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }

    return null; // first_name & last_name are OPTIONAL
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
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
            username: form.username.trim(),
            email: form.email.trim(),
            password: form.password,
            first_name: form.first_name.trim(), // optional
            last_name: form.last_name.trim(),   // optional
          }),
        }
      );

      const data = await response.json();

      if (response.status === 201) {
        setSuccess("Account created successfully! Redirecting to login...");
        setForm({
          username: "",
          email: "",
          password: "",
          first_name: "",
          last_name: "",
        });

        setTimeout(() => {
          onRegisterSuccess();
        }, 1500);
      } else if (data.username) {
        setError("Username already exists.");
      } else if (data.email) {
        setError("Invalid email address.");
      } else {
        setError("Registration failed. Please check details.");
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
          Required: Username, Email, Password | Optional: First & Last Name
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

          {/* Required Fields */}
          <TextField
            label="Username *"
            name="username"
            fullWidth
            required
            value={form.username}
            onChange={handleChange}
          />

          <TextField
            label="Email *"
            type="email"
            name="email"
            fullWidth
            required
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            label="Password *"
            type="password"
            name="password"
            fullWidth
            required
            value={form.password}
            onChange={handleChange}
          />

          {/* Optional Fields */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="First Name (Optional)"
                name="first_name"
                fullWidth
                value={form.first_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Last Name (Optional)"
                name="last_name"
                fullWidth
                value={form.last_name}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

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
