import React, { useState, useEffect } from "react";
import Login from "./Login";
import Books from "./Books";
import DeleteAccount from "./DeleteAccount";
import AddBook from "./AddBook";
import { jwtDecode } from "jwt-decode";
import AdminUsers from "./AdminUsers";


// MUI Components
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Chip,
} from "@mui/material";

function App() {
  const token = localStorage.getItem("token");
  const [showDeletePage, setShowDeletePage] = useState(false);
  const [username, setUsername] = useState("");
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || "User");
        setIsSuperuser(decoded.is_superuser || false);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // 🔐 Not Logged In → Show Login Page
  if (!token) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Library Management System
        </Typography>
        <Login />
      </Container>
    );
  }

  // 🗑️ Delete Account Page
  if (showDeletePage) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <DeleteAccount onBackToApp={() => setShowDeletePage(false)} />
      </Container>
    );
  }

  return (
    <>
      {/* 🔝 TOP NAVBAR */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            📚 Library Management System
          </Typography>

          <Chip
            label={`Welcome, ${username}`}
            variant="outlined"
            sx={{ mr: 2 }}
          />

          <Chip
            label={isSuperuser ? "Admin" : "User"}
            variant="outlined"
            sx={{ mr: 2 }}
          />

          {!isSuperuser && (
            <Button
              variant="contained"
              onClick={() => setShowDeletePage(true)}
              sx={{ mr: 2 }}
            >
              Delete Account
            </Button>
          )}

          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* 📦 MAIN CONTENT */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* 👑 Admin Add Book Panel */}
        {isSuperuser && (
          <Box mb={4}>
            <AddBook />
            {isSuperuser && (
              <AdminUsers />
            )}
          </Box>
        )}

        {/* 📚 Books + My Borrows */}
        <Books isSuperuser={isSuperuser} />
      </Container>
    </>
  );
}

export default App;
