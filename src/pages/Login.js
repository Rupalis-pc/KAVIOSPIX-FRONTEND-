import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      login(token);
      navigate("/albums");
    }
  }, [searchParams, login, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/auth/google";
    // window.location.href = `${BASE_URL}/auth/google`;
  };

  return (
    <div className="d-flex flex-column align-items-center mt-5">
      <h2>Welcome to PhotoVault</h2>
      <button className="btn btn-primary mt-3" onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
    </div>
  );
}
