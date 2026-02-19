import React, { useState } from "react";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import { Link } from "@mui/material";


import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);


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
        window.location.reload();
      } else {
        alert("Login Failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

    // Show Register Page
    if (showRegister) {
    return (
        <Register onRegisterSuccess={() => setShowRegister(false)} />
    );
    }

    // Show Forgot Password Page
    if (showForgotPassword) {
    return (
        <ForgotPassword onBack={() => setShowForgotPassword(false)} />
    );
    }


  return (
    <Card elevation={4}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
          />
          
            <Link
            component="button"
            variant="body2"
            underline="hover"
            sx={{ alignSelf: "flex-end", color: "text.secondary" }}
            onClick={() => setShowForgotPassword(true)}
            >
            Forgot Password?
            </Link>

          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
          >
            Login
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setShowRegister(true)}
          >
            Create New Account
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Login;
