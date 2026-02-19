import React, { useEffect, useState } from "react";

function Books({ refreshTrigger, isSuperuser }) {
  const [books, setBooks] = useState([]);
  const [myBorrows, setMyBorrows] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBooks();
    fetchMyBorrows();
  }, [refreshTrigger]);

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

  // 🔥 Filter only currently borrowed (not returned)
  const currentBorrows = myBorrows.filter(
    (borrow) => borrow.is_returned === false
  );

  const isBorrowed = (bookId) => {
    return currentBorrows.some((borrow) => borrow.book === bookId);
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

  const deleteBook = async (id) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Are you sure you want to delete this book?")) {
        return;
    }

    try {
        const response = await fetch(
        `http://127.0.0.1:8000/api/books/${id}/`,
        {
            method: "DELETE",
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

        if (response.status === 204) {
        alert("Book deleted successfully!");
        fetchBooks();
        } else {
        const data = await response.json();
        alert(data.detail || "Failed to delete book");
        }
    } catch (error) {
        console.error("Delete error:", error);
    }
    };

    const updateBook = async (book) => {
    const token = localStorage.getItem("token");

    const newTitle = prompt("Enter new title:", book.title);
    const newAuthor = prompt("Enter new author:", book.author);
    const newCopies = prompt("Enter total copies:", book.total_copies);

    if (!newTitle || !newAuthor || !newCopies) {
        alert("All fields are required for update.");
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
            title: newTitle,
            author: newAuthor,
            isbn: book.isbn,
            total_copies: parseInt(newCopies),
            available_copies: parseInt(newCopies),
            }),
        }
        );

        if (response.status === 200) {
        alert("Book updated successfully!");
        fetchBooks();
        } else {
        const data = await response.json();
        alert(data.detail || "Update failed");
        }
    } catch (error) {
        console.error("Update error:", error);
    }
    };


  return (
    <div>
      {/* 📚 MY CURRENTLY BORROWED BOOKS SECTION */}
      <h2>📚 My Currently Borrowed Books</h2>

      {currentBorrows.length === 0 ? (
        <p>You have not borrowed any books.</p>
      ) : (
        currentBorrows.map((borrow) => (
          <div
            key={borrow.id}
            style={{
              border: "2px solid orange",
              margin: "10px",
              padding: "10px",
              backgroundColor: "#fff8e1",
            }}
          >
            <h3>{borrow.book_title}</h3>
            <p>Status: Not Returned</p>
            <button
              onClick={() => returnBook(borrow.book)}
              style={{ backgroundColor: "green", color: "white" }}
            >
              Return Book
            </button>
          </div>
        ))
      )}

      <hr />

      {/* 📖 COMPLETE BOOKS LIST */}
      <h2>📖 All Books</h2>

      {books.length === 0 ? (
        <p>No books available.</p>
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

    {/* 🧑 Normal User Controls */}
    {!isSuperuser && (
      <>
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
      </>
    )}

    {/* 👑 ADMIN CONTROLS */}
    {isSuperuser && (
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => updateBook(book)}
          style={{
            marginRight: "10px",
            backgroundColor: "orange",
            color: "white",
          }}
        >
          Edit Book
        </button>

        <button
          onClick={() => deleteBook(book.id)}
          style={{
            backgroundColor: "red",
            color: "white",
          }}
        >
          Delete Book
        </button>
      </div>
    )}
  </div>
))

      )}
    </div>
  );
}

export default Books;
