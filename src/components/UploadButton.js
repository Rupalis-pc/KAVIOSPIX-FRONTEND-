import { useNavigate } from "react-router-dom";

export default function UploadButton({ albumId }) {
  const navigate = useNavigate();

  return (
    <button
      className="btn btn-outline-success"
      onClick={() => navigate(`/albums/${albumId}/upload`)}
    >
      Upload Image
    </button>
  );
}
