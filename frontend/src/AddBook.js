import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Grid,
} from "@mui/material";

function AddBook() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    totalCopies: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.title.trim()) return "Book title is required.";
    if (!form.author.trim()) return "Author name is required.";
    if (!form.isbn.trim()) return "ISBN is required.";
    if (!form.totalCopies) return "Total copies is required.";

    const copies = parseInt(form.totalCopies);
    if (isNaN(copies) || copies <= 0) {
      return "Total copies must be a positive number.";
    }

    if (form.isbn.length < 5) {
      return "ISBN must be at least 5 characters.";
    }

    return null;
  };

  const handleAddBook = async () => {
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          author: form.author.trim(),
          isbn: form.isbn.trim(),
          total_copies: parseInt(form.totalCopies),
          available_copies: parseInt(form.totalCopies),
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setSuccess("Book added successfully!");
        setForm({
          title: "",
          author: "",
          isbn: "",
          totalCopies: "",
        });
      } else if (data.isbn) {
        setError("A book with this ISBN already exists.");
      } else {
        setError("Failed to add book. Please check details.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while adding book.");
    }
  };

  return (
    <Card elevation={0} sx={{ border: "1px solid #e5e7eb", mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Add New Book
        </Typography>

        {error && <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" variant="outlined" sx={{ mb: 2 }}>{success}</Alert>}

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Book Title"
              name="title"
              fullWidth
              required
              value={form.title}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Author"
              name="author"
              fullWidth
              required
              value={form.author}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="ISBN"
              name="isbn"
              fullWidth
              required
              value={form.isbn}
              onChange={handleChange}
              helperText="Must be unique"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Total Copies"
              name="totalCopies"
              type="number"
              fullWidth
              required
              value={form.totalCopies}
              onChange={handleChange}
              inputProps={{ min: 1 }}
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button variant="contained" onClick={handleAddBook}>
            Add Book
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AddBook;
