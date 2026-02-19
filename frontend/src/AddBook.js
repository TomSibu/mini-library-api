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
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [totalCopies, setTotalCopies] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const handleAddBook = async () => {
    setError("");
    setSuccess("");

    // 🔴 Validation
    if (!title || !author || !isbn || !totalCopies) {
      setError("All fields are required.");
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
          title: title,
          author: author,
          isbn: isbn,
          total_copies: parseInt(totalCopies),
          available_copies: parseInt(totalCopies),
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setSuccess("Book added successfully!");
        setTitle("");
        setAuthor("");
        setIsbn("");
        setTotalCopies("");
      } else {
        setError(data.detail || "Failed to add book.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while adding book.");
    }
  };

  return (
    <Card elevation={4}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          📚 Add New Book (Admin)
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Book Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Author"
              fullWidth
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="ISBN"
              fullWidth
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Total Copies"
              type="number"
              fullWidth
              value={totalCopies}
              onChange={(e) => setTotalCopies(e.target.value)}
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleAddBook}
          >
            Add Book
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AddBook;
