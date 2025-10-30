import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getData } from "../api/api";
import UploadButton from "../components/UploadButton";
import ImageGrid from "../components/ImageGrid";

export default function AlbumDetail() {
  const { albumId } = useParams();
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const fetchImages = useCallback(async () => {
    try {
      const response = await getData(`/albums/${albumId}/images`);
      setImages(response);
    } catch (error) {
      console.error("Error fetching images", error);
    }
  }, [albumId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Album Images</h3>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/albums")}
          >
            ← Back to Albums
          </button>

          <UploadButton albumId={albumId} onUpload={fetchImages} />
        </div>
      </div>

      <ImageGrid images={images} albumId={albumId} />
    </div>
  );
}
