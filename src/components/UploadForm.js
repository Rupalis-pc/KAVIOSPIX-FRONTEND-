import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postData } from "../api/api";

export default function UploadForm() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [tags, setTags] = useState("");
  const [person, setPerson] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image.");

    const formData = new FormData();
    formData.append("file", file);

    if (tags) {
      const tagArray = tags.split(",").map((t) => t.trim());
      tagArray.forEach((tag) => formData.append("tags", tag));
    }

    if (person) formData.append("person", person);

    try {
      setLoading(true);
      await postData(`/albums/${albumId}/images`, formData);
      alert("Image uploaded successfully!");
      navigate(`/albums/${albumId}`); // go back to album page
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "500px" }}>
      <h4 className="mb-3">Upload New Image</h4>
      <form onSubmit={handleSubmit} className="card p-3 shadow-sm">
        <div className="mb-3">
          <label className="form-label fw-bold">Tags</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. sunset, beach"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Person (optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. John Doe"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Select Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate(`/albums/${albumId}`)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </div>
  );
}
