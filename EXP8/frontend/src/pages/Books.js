import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { jwtDecode } from "jwt-decode";
import {
  Container, Typography, Grid, Card, CardContent,
  Button, TextField, Chip
} from "@mui/material";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", author: "" });

  const token = localStorage.getItem("token");
  const user = jwtDecode(token);

  const fetchBooks = async () => {
    const res = await axios.get("/api/books");
    setBooks(res.data);
  };

  useEffect(() => { fetchBooks(); }, []);

  const addBook = async () => {
    await axios.post("/api/books", newBook);
    setNewBook({ title: "", author: "" });
    fetchBooks();
  };

  const deleteBook = async (id) => {
    await axios.delete(`/api/books/${id}`);
    fetchBooks();
  };

  const borrowBook = async (id) => {
    await axios.post(`/api/books/borrow/${id}`);
    fetchBooks();
  };

  const returnBook = async (id) => {
    await axios.post(`/api/books/return/${id}`);
    fetchBooks();
  };

  return (
    <Container style={{ marginTop: 40 }}>
      <Typography variant="h4" gutterBottom>
        📚 Library Books
      </Typography>

      {/* Admin Add Book */}
      {user.role === "admin" && (
        <Card style={{ padding: 20, marginBottom: 30 }}>
          <Typography variant="h6">Add New Book</Typography>

          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          />

          <TextField
            label="Author"
            fullWidth
            margin="normal"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          />

          <Button variant="contained" onClick={addBook}>
            Add Book
          </Button>
        </Card>
      )}

      <Grid container spacing={3}>
        {books.map((b) => (
          <Grid item xs={12} md={4} key={b._id}>
            <Card style={{ borderRadius: 15 }}>
              <CardContent>

                <Typography variant="h6">{b.title}</Typography>
                <Typography color="textSecondary">{b.author}</Typography>

                {/* Status */}
                <Chip
                  label={b.available ? "Available" : "Borrowed"}
                  color={b.available ? "success" : "error"}
                  style={{ marginTop: 10 }}
                />

                {/* USER */}
                {user.role === "user" && (
                  <>
                    {b.available && (
                      <Button
                        fullWidth
                        variant="contained"
                        style={{ marginTop: 10 }}
                        onClick={() => borrowBook(b._id)}
                      >
                        Borrow
                      </Button>
                    )}

                    {!b.available && b.borrowedBy?._id === user.id && (
                      <Button
                        fullWidth
                        variant="outlined"
                        color="warning"
                        style={{ marginTop: 10 }}
                        onClick={() => returnBook(b._id)}
                      >
                        Return
                      </Button>
                    )}
                  </>
                )}

                {/* ADMIN */}
                {user.role === "admin" && (
                  <>
                    <Typography style={{ marginTop: 10 }}>
                      Borrowed By: {b.borrowedBy?.email || "None"}
                    </Typography>

                    <Button
                      fullWidth
                      color="error"
                      onClick={() => deleteBook(b._id)}
                    >
                      Delete
                    </Button>
                  </>
                )}

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}