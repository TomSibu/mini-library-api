import React, { useEffect, useState } from "react";

function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("API Response:", data);

      // IMPORTANT FIX: Ensure books is always an array
      if (Array.isArray(data)) {
        setBooks(data);
      } else if (data.results) {
        // If pagination is enabled
        setBooks(data.results);
      } else {
        setBooks([]); // fallback to empty array
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    }
  };

  const borrowBook = async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://127.0.0.1:8000/api/borrow/${id}/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    alert(JSON.stringify(data));
    fetchBooks(); // refresh after borrowing
  };

  return (
    <div>
      <h2>Books List</h2>

      {books.length === 0 ? (
        <p>No books available or not loaded.</p>
      ) : (
        books.map((book) => (
          <div
            key={book.id}
            style={{
              border: "1px solid black",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Available Copies: {book.available_copies}</p>
            <button onClick={() => borrowBook(book.id)}>
              Borrow
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Books;
