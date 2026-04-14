import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let role = null;
  if (token) role = jwtDecode(token).role;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography style={{ flexGrow: 1 }}>Library</Typography>

        {token ? (
          <>
            <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
            <Button onClick={() => navigate("/books")}>Books</Button>

            {role === "admin" && (
              <Button onClick={() => navigate("/admin")}>Admin</Button>
            )}

            <Button onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => navigate("/")}>Login</Button>
            <Button onClick={() => navigate("/register")}>Register</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}