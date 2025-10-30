import { useNavigate } from "react-router-dom";
import { deleteData, getUserIdFromToken } from "../api/api";

export default function AlbumCard({ album, onEdit, onShare }) {
  const navigate = useNavigate();
  const userId = getUserIdFromToken();
  const isOwner = album.ownerId === userId;

  const handleCardClick = (e) => {
    // Prevent navigation if clicking a button inside the card
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) return;
    navigate(`/albums/${album.albumId}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this album?")) {
      const result = await deleteData(`/albums/${album.albumId}`);
      if (result?.message) window.location.reload();
    }
  };

  return (
    <div
      className="card shadow-sm p-3 hover-shadow-sm"
      style={{ cursor: "pointer", transition: "0.2s" }}
      onClick={handleCardClick}
    >
      <h5>{album.name}</h5>
      <p className="text-muted">{album.description || "No description"}</p>

      {isOwner && (
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-sm btn-outline-primary" onClick={onEdit}>
            Edit
          </button>

          <button
            className="btn btn-sm btn-outline-success"
            onClick={() => onShare(album)}
          >
            Share
          </button>

          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
