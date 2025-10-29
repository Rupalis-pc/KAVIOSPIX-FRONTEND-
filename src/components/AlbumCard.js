import { useNavigate } from "react-router-dom";
import { deleteData, getUserIdFromToken, shareAlbum } from "../api/api";

export default function AlbumCard({ album, onEdit }) {
  const navigate = useNavigate();
  const userId = getUserIdFromToken();
  const isOwner = album.ownerId === userId;

  const handleCardClick = (e) => {
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) return;
    navigate(`/albums/${album.albumId}`);
  };

  const handleShare = async () => {
    const email = prompt("Enter email to share with:");
    if (!email) return;

    const result = await shareAlbum(album.albumId, email);
    if (result?.message) {
      alert(`${result.message}`);
    } else {
      alert("Failed to share album.");
    }
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
            onClick={handleShare}
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
