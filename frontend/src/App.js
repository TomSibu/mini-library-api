import React from "react";
import Login from "./Login";
import Books from "./Books";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Library Management System</h1>
      <Login />
      <hr />
      <Books />
    </div>
  );
}

export default App;
