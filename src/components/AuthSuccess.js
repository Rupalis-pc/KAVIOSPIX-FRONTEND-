import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // Store token in context & localStorage
      login(token);

      // Redirect to albums
      navigate("/albums");
    } else {
      // If no token, redirect to login
      navigate("/");
    }
  }, [searchParams, login, navigate]);

  return <div>Logging in...</div>; // simple loader
}
