// components/RoleRoute.js
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

export default function RoleRoute({ children, role }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />;

const decoded = jwtDecode(token);

  return decoded.role === role ? children : <Navigate to="/dashboard" />;
}