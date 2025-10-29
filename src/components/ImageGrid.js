import { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaRegStar, FaTrash, FaTag } from "react-icons/fa";

export default function ImageGrid({ images, albumId }) {
  const [imageList, setImageList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [tagFilter, setTagFilter] = useState("");
  const [filteredImages, setFilteredImages] = useState([]);

  useEffect(() => {
    const formatted = images.map((img) => ({
      imageId: img._id,
      imageUrl: img.imageUrl,
      comments: img.comments || [],
      isFavorite: img.isFavorite || false,
      tags: img.tags || [],
    }));
    setImageList(formatted);
    setFavorites(formatted.filter((img) => img.isFavorite));
    setFilteredImages(formatted);
  }, [images]);

  // ⭐ Toggle Favorite
  const toggleFavorite = async (imageId, currentFav) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/albums/${albumId}/images/${imageId}/favorite`,
        { isFavorite: !currentFav },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedList = imageList.map((img) =>
        img.imageId === imageId ? { ...img, isFavorite: !img.isFavorite } : img
      );
      setImageList(updatedList);
      setFavorites(updatedList.filter((img) => img.isFavorite));
      setFilteredImages(updatedList);
    } catch (err) {
      console.error("Favorite update failed:", err);
      alert("Failed to update favorite status");
    }
  };

  // 🗑️ Delete Image
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:4000/albums/${albumId}/images/${imageId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedList = imageList.filter((img) => img.imageId !== imageId);
      setImageList(updatedList);
      setFavorites(updatedList.filter((img) => img.isFavorite));
      setFilteredImages(updatedList);
      alert("🗑️ Image deleted successfully!");
    } catch (err) {
      console.error("Failed to delete image:", err);
      alert("Failed to delete image");
    }
  };

  // 💬 Add Comment
  const handleAddComment = async (imageId, commentText) => {
    if (!commentText.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:4000/albums/${albumId}/images/${imageId}/comments`,
        { comment: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setImageList((prev) =>
        prev.map((img) =>
          img.imageId === imageId
            ? { ...img, comments: res.data.image.comments }
            : img
        )
      );
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to add comment");
    }
  };

  // 🎯 Filter by Tag
  const handleTagSearch = async (e) => {
    e.preventDefault();
    if (!tagFilter.trim()) {
      setFilteredImages(imageList);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:4000/albums/${albumId}/images/search?tags=${tagFilter}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const formatted = res.data.map((img) => ({
        imageId: img._id,
        imageUrl: img.imageUrl,
        comments: img.comments || [],
        isFavorite: img.isFavorite || false,
        tags: img.tags || [],
      }));

      setFilteredImages(formatted);
    } catch (err) {
      console.error("Tag filter failed:", err);
      alert("Failed to fetch images by tag");
    }
  };

  const handleToggleView = () => setShowFavoritesOnly((prev) => !prev);
  const displayList = showFavoritesOnly ? favorites : filteredImages;

  return (
    <div className="mt-3">
      {/* Top Controls */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 className="mb-0">
          {showFavoritesOnly ? "❤️ Favorite Images" : "🖼️ All Images"}
        </h5>
        <div className="d-flex gap-2">
          {/* Tag Search */}
          <form onSubmit={handleTagSearch} className="d-flex">
            <input
              type="text"
              className="form-control form-control-sm me-2"
              placeholder="Search by tag..."
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            />
            <button type="submit" className="btn btn-sm btn-outline-success">
              <FaTag className="me-1" /> Search
            </button>
          </form>

          {/* Show Favorites Toggle */}
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={handleToggleView}
          >
            {showFavoritesOnly ? "Show All" : "Show Favorites"}
          </button>
        </div>
      </div>

      {/* Image Grid */}
      <div className="row">
        {displayList.length > 0 ? (
          displayList.map((img) => (
            <div key={img.imageId} className="col-md-4 mb-4">
              <div className="card shadow-sm position-relative">
                <img
                  src={img.imageUrl}
                  alt={`Image_${img.imageId}`}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />

                {/* ⭐ + 🗑️ */}
                <div className="position-absolute top-0 end-0 m-2 d-flex gap-2">
                  <button
                    className="btn p-1 bg-light rounded-circle"
                    onClick={() => toggleFavorite(img.imageId, img.isFavorite)}
                  >
                    {img.isFavorite ? (
                      <FaStar color="gold" size={20} />
                    ) : (
                      <FaRegStar color="gray" size={20} />
                    )}
                  </button>

                  <button
                    className="btn p-1 bg-light rounded-circle"
                    onClick={() => handleDeleteImage(img.imageId)}
                  >
                    <FaTrash color="red" size={18} />
                  </button>
                </div>

                {/* Comments + Tags */}
                <div className="card-body">
                  <h6>Comments</h6>
                  <ul className="list-unstyled">
                    {img.comments?.length > 0 ? (
                      img.comments.map((c, i) => (
                        <li key={i} className="text-muted small">
                          • {c}
                        </li>
                      ))
                    ) : (
                      <li className="text-muted small">No comments yet.</li>
                    )}
                  </ul>
                  <AddCommentForm
                    onAddComment={(text) => handleAddComment(img.imageId, text)}
                  />

                  {/* Tags moved below comments */}
                  {img.tags?.length > 0 && (
                    <div className="mt-3 border-top pt-2 small text-muted">
                      <strong>Tags:</strong>{" "}
                      {img.tags.map((tag, i) => (
                        <span key={i} className="badge bg-secondary me-1">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted text-center mt-3">
            {showFavoritesOnly
              ? "No favorite images yet."
              : "No images available for this tag."}
          </p>
        )}
      </div>
    </div>
  );
}

function AddCommentForm({ onAddComment }) {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddComment(comment);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex mt-2">
      <input
        type="text"
        className="form-control form-control-sm me-2"
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit" className="btn btn-sm btn-primary">
        Post
      </button>
    </form>
  );
}
