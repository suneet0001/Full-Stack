import React from "react";
import { Container, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = jwtDecode(token);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Container style={{ marginTop: 40 }}>

      {/* Header */}
      <Typography variant="h3" gutterBottom align="center">
        {user.role === "admin" ? "👑 Admin Dashboard" : "👤 Student Dashboard"}
      </Typography>

      <Typography align="center" color="textSecondary">
        Welcome, {user.email}
      </Typography>

      {/* Cards */}
      <Grid container spacing={3} style={{ marginTop: 20 }}>

        {/* Books */}
        <Grid item xs={12} md={4}>
          <Card style={{ borderRadius: 15 }}>
            <CardContent>
              <Typography variant="h6">📚 Books</Typography>
              <Typography color="textSecondary">
                Browse and manage books
              </Typography>
              <Button
                fullWidth
                variant="contained"
                style={{ marginTop: 10 }}
                onClick={() => navigate("/books")}
              >
                Go to Books
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Admin Only */}
        {user.role === "admin" && (
          <Grid item xs={12} md={4}>
            <Card style={{ borderRadius: 15 }}>
              <CardContent>
                <Typography variant="h6">⚙️ Admin Panel</Typography>
                <Typography color="textSecondary">
                  Manage system
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  style={{ marginTop: 10 }}
                  onClick={() => navigate("/admin")}
                >
                  Open Panel
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Profile */}
        <Grid item xs={12} md={4}>
          <Card style={{ borderRadius: 15 }}>
            <CardContent>
              <Typography variant="h6">👤 Profile</Typography>
              <Typography>Email: {user.email}</Typography>
              <Typography>Role: {user.role}</Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* Logout */}
      <Button
        variant="contained"
        color="error"
        style={{ marginTop: 30, display: "block", marginLeft: "auto", marginRight: "auto" }}
        onClick={logout}
      >
        Logout
      </Button>

    </Container>
  );
}