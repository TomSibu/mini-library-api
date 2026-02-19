import React, { useEffect, useState } from "react";

function Books() {
  const [books, setBooks] = useState([]);
  const [myBorrows, setMyBorrows] = useState([]);

  useEffect(() => {
    fetchBooks();
    fetchMyBorrows();
  }, []);

  const token = localStorage.getItem("token");

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
      setMyBorrows(data);
    } catch (error) {
      console.error("Error fetching borrows:", error);
    }
  };

  const borrowBook = async (id) => {
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
    alert(data.message || data.error || "Borrow attempted");
    fetchBooks();
    fetchMyBorrows();
  };

  const returnBook = async (id) => {
    const response = await fetch(
      `http://127.0.0.1:8000/api/return/${id}/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    alert(data.message || data.error || "Return attempted");
    fetchBooks();
    fetchMyBorrows();
  };

  const isBorrowed = (bookId) => {
    return myBorrows.some(
      (borrow) => borrow.book === bookId && !borrow.is_returned
    );
  };

  return (
    <div>
      <h2>Books List</h2>

      {books.map((book) => (
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

          {!isBorrowed(book.id) ? (
            <button onClick={() => borrowBook(book.id)}>
              Borrow
            </button>
          ) : (
            <button
              onClick={() => returnBook(book.id)}
              style={{ backgroundColor: "green", color: "white" }}
            >
              Return Book
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Books;
