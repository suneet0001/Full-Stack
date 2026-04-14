import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  Container, Typography, Table, TableHead,
  TableRow, TableCell, TableBody, Button, Paper
} from "@mui/material";

export default function Admin() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/auth/users");
      setUsers(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || "Error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/auth/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.msg || "Error deleting user");
    }
  };

  return (
    <Container style={{ marginTop: 40 }}>
      <Typography variant="h4" gutterBottom align="center">
        👑 Admin Panel - User Management
      </Typography>

      <Paper style={{ padding: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Role</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id}>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>

                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteUser(u._id)}
                  >
                    Delete
                  </Button>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}