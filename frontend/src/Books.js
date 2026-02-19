import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Tabs,
  Tab,
  Pagination,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function Books({ isSuperuser }) {
  const [books, setBooks] = useState([]);
  const [myBorrows, setMyBorrows] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);

  const token = localStorage.getItem("token");
  const booksPerPage = 6;

  useEffect(() => {
    fetchBooks();
    fetchMyBorrows();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const fetchMyBorrows = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/my-borrows/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setMyBorrows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching borrows:", error);
    }
  };

  const currentBorrows = myBorrows.filter(
    (b) => b.is_returned === false
  );

  const borrowHistory = myBorrows.filter(
    (b) => b.is_returned === true
  );

  const isBorrowed = (bookId) => {
    return currentBorrows.some((b) => b.book === bookId);
  };

  const borrowBook = async (id) => {
    const res = await fetch(`http://127.0.0.1:8000/api/borrow/${id}/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    alert(data.message || data.error);
    fetchBooks();
    fetchMyBorrows();
  };

  const returnBook = async (id) => {
    const res = await fetch(`http://127.0.0.1:8000/api/return/${id}/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    alert(data.message || data.error);
    fetchBooks();
    fetchMyBorrows();
  };

  const deleteBook = async (id) => {
    if (!window.confirm("Delete this book?")) return;

    const res = await fetch(
      `http://127.0.0.1:8000/api/books/${id}/`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.status === 204) {
      alert("Book deleted");
      fetchBooks();
    }
  };

    const updateBook = async (book) => {
    const token = localStorage.getItem("token");

    const newTitle = prompt("Enter new title:", book.title);
    if (!newTitle || !newTitle.trim()) {
        alert("Title is required.");
        return;
    }

    const newAuthor = prompt("Enter new author:", book.author);
    if (!newAuthor || !newAuthor.trim()) {
        alert("Author is required.");
        return;
    }

    const newCopies = prompt("Enter total copies:", book.total_copies);
    if (!newCopies) {
        alert("Total copies is required.");
        return;
    }

    const copies = parseInt(newCopies);
    if (isNaN(copies) || copies <= 0) {
        alert("Total copies must be a positive number.");
        return;
    }

    try {
        const response = await fetch(
        `http://127.0.0.1:8000/api/books/${book.id}/`,
        {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
            title: newTitle.trim(),
            author: newAuthor.trim(),
            isbn: book.isbn,
            total_copies: copies,
            available_copies: copies,
            }),
        }
        );

        if (response.status === 200) {
        alert("Book updated successfully!");
        fetchBooks();
        } else {
        alert("Update failed. Please provide valid details.");
        }
    } catch (error) {
        console.error("Update error:", error);
        alert("Server error while updating book.");
    }
    };


  // 🔍 SEARCH FILTER
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 PAGINATION
  const paginatedBooks = filteredBooks.slice(
    (page - 1) * booksPerPage,
    page * booksPerPage
  );

  const renderBookCard = (book) => (
    <Grid item xs={12} sm={6} md={4} key={book.id}>
      <Card elevation={0}>
        <CardContent>
          <Typography variant="h6">{book.title}</Typography>
          <Typography color="text.secondary">
            Author: {book.author}
          </Typography>

          <Box mt={1} mb={1}>
            <Chip
              label={`Available: ${book.available_copies}`}
              variant="outlined"
            />
          </Box>

          {/* USER CONTROLS */}
          {!isSuperuser && (
            <>
              {!isBorrowed(book.id) ? (
                <Button
                  variant="contained"
                  onClick={() => borrowBook(book.id)}
                  sx={{ mt: 1 }}
                >
                  Borrow
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => returnBook(book.id)}
                  sx={{ mt: 1 }}
                >
                  Return
                </Button>
              )}
            </>
          )}

          {/* ADMIN CONTROLS */}
          {isSuperuser && (
            <Box mt={2}>
              <Button
                variant="outlined"
                color="warning"
                onClick={() => updateBook(book)}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => deleteBook(book.id)}
              >
                Delete
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box>
      {/* 🔍 SEARCH BAR */}
      <TextField
        fullWidth
        label="Search by Title or Author"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1 }} />,
        }}
        sx={{ mb: 3 }}
      />

      {/* 📑 TABS */}
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="All Books" />
        <Tab label="My Borrowed Books" />
        <Tab label="Borrow History" />
      </Tabs>

      {/* 📚 ALL BOOKS TAB */}
      {tab === 0 && (
        <>
          <Grid container spacing={2}>
            {paginatedBooks.map(renderBookCard)}
          </Grid>

          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={Math.ceil(filteredBooks.length / booksPerPage)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}

      {/* 📖 CURRENT BORROWED TAB */}
      {tab === 1 && (
        <Grid container spacing={2}>
          {currentBorrows.length === 0 ? (
            <Typography>You have no borrowed books.</Typography>
          ) : (
            currentBorrows.map((borrow) => (
              <Grid item xs={12} sm={6} md={4} key={borrow.id}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6">
                      {borrow.book_title}
                    </Typography>
                    <Chip label="Currently Borrowed" color="warning" />
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => returnBook(borrow.book)}
                      >
                        Return Book
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* 📜 HISTORY TAB */}
      {tab === 2 && (
        <Grid container spacing={2}>
          {borrowHistory.length === 0 ? (
            <Typography>No borrow history yet.</Typography>
          ) : (
            borrowHistory.map((borrow) => (
              <Grid item xs={12} sm={6} md={4} key={borrow.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6">
                      {borrow.book_title}
                    </Typography>
                    <Chip label="Returned" color="default" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Box>
  );
}

export default Books;
