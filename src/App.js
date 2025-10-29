import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Albums from "./pages/Albums";
import AlbumDetail from "./pages/AlbumDetail";
import AuthSuccess from "./components/AuthSuccess";
import UploadForm from "./components/UploadForm";

function App() {
  const { token, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route
          path="/"
          element={token ? <Navigate to="/albums" /> : <Login />}
        />
        <Route
          path="/albums"
          element={token ? <Albums /> : <Navigate to="/" />}
        />
        <Route
          path="/albums/:albumId"
          element={token ? <AlbumDetail /> : <Navigate to="/" />}
        />
        <Route path="/albums/:albumId/upload" element={<UploadForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
