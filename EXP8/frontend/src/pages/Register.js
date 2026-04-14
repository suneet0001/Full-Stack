import React from "react";
import { useForm } from "react-hook-form";
import axios from "../api/axios";
import {
  TextField, Button, Container, Typography, Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post("/api/auth/register", data);
      alert("Registered successfully");
      navigate("/");
    } catch (err) {
  console.log(err.response?.data);
  alert(err.response?.data?.msg || "Error registering");
}
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} style={{ padding: 30, marginTop: 100 }}>
        <Typography variant="h4" align="center">Register</Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField label="Email" fullWidth margin="normal" {...register("email")} />
          <TextField label="Password" type="password" fullWidth margin="normal" {...register("password")} />

          <TextField
            label="Role (admin/user)"
            fullWidth
            margin="normal"
            {...register("role")}
          />

          <Button fullWidth variant="contained" type="submit">
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
}