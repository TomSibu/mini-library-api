import React, { useState } from "react";

function AddBook({ onBookAdded }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [totalCopies, setTotalCopies] = useState("");
  const [error, setError] = useState("");

  const handleAddBook = async () => {
    const token = localStorage.getItem("token");

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
        alert("Book added successfully!");
        setTitle("");
        setAuthor("");
        setIsbn("");
        setTotalCopies("");
        setError("");
        onBookAdded(); // refresh books list
      } else {
        setError(data.detail || JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      setError("Error adding book.");
    }
  };

  return (
    <div style={{ border: "2px solid green", padding: "15px", marginBottom: "20px" }}>
      <h2>📚 Add New Book</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="ISBN"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
      />
      <br /><br />

      <input
        type="number"
        placeholder="Total Copies"
        value={totalCopies}
        onChange={(e) => setTotalCopies(e.target.value)}
      />
      <br /><br />

      <button
        onClick={handleAddBook}
        style={{ backgroundColor: "green", color: "white" }}
      >
        Add Book
      </button>
    </div>
  );
}

export default AddBook;
