import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Alert,
  Chip,
} from "@mui/material";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        setUsers(data);
      } else {
        setError("Failed to load users.");
      }
    } catch (err) {
      setError("Server error while fetching users.");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/auth/users/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchUsers();
      } else {
        alert("Failed to delete user.");
      }
    } catch (err) {
      alert("Server error while deleting user.");
    }
  };

  return (
    <Card elevation={0} sx={{ border: "1px solid #e5e7eb", mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          User Management (Admin)
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={2}>
          {users.map((user) => (
            <Grid item xs={12} md={6} lg={4} key={user.id}>
              <Card elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
                <CardContent>
                  <Typography variant="h6">
                    {user.first_name || user.username}
                  </Typography>

                  <Typography color="text.secondary">
                    Username: {user.username}
                  </Typography>

                  <Typography color="text.secondary">
                    Email: {user.email}
                  </Typography>

                  <Chip
                    label="Normal User"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />

                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => deleteUser(user.id)}
                  >
                    Remove User
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default AdminUsers;
