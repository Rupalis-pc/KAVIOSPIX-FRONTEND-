import { useEffect, useState } from "react";
import { getData, postData, putData } from "../api/api";
import AlbumCard from "../components/AlbumCard";

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ name: "", description: "" });
  const [editAlbum, setEditAlbum] = useState(null);

  //users
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  console.log(selectedAlbum);

  // Fetch all albums (owned or shared)
  const fetchAlbums = async () => {
    const data = await getData("/albums");
    if (data) setAlbums(data);
  };

  // Fetch Users
  const fetchUsers = async () => {
    const data = await getData("/users");
    if (data) {
      console.log("Users fetched:", data);
      setUsers(data.filter(d => d.name));
    } else {
      console.log("No users found or error fetching users");
    }
  };

  useEffect(() => {
    fetchAlbums();
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editAlbum) setEditAlbum((prev) => ({ ...prev, [name]: value }));
    else setNewAlbum((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Add Album
  const handleAddAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbum.name.trim()) return alert("Please enter album name!");

    const result = await postData("/albums", newAlbum);

    if (result?.album) {
      setAlbums((prev) => [...prev, result.album]);
      setNewAlbum({ name: "", description: "" });
      setShowModal(false);
    } else {
      alert(result?.message || "Failed to add album");
    }
  };

  // Handle Update Album
  const handleUpdateAlbum = async (e) => {
    e.preventDefault();
    const result = await putData(`/albums/${editAlbum.albumId}`, {
      description: editAlbum.description,
    });

    if (result?.updatedAlbum) {
      setAlbums((prev) =>
        prev.map((a) =>
          a.albumId === editAlbum.albumId ? result.updatedAlbum : a
        )
      );
      setEditAlbum(null);
      setShowModal(false);
    } else {
      alert("Failed to update album");
    }
  };

  const openEditModal = (album) => {
    setEditAlbum(album);
    setShowModal(true);
  };

  const openShareModal = async (album) => {
    await fetchUsers();
    setSelectedAlbum(album);
    setShowShareModal(true);
  };

  const handleShareAlbum = async (e) => {
    e.preventDefault();
    if (!selectedUser) return alert("Please select a user!");

    const result = await postData(`/albums/${selectedAlbum.albumId}/share`, {
      userId: selectedUser,
    });

    if (result?.success) {
      alert("Album shared successfully!");
      setShowShareModal(false);
      setSelectedAlbum(null);
      setSelectedUser("");
    } else {
      alert(result?.message || "Failed to share album");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h3>Your Albums</h3>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Album
        </button>
      </div>

      <div className="row mt-4">
        {albums?.length > 0 ? (
          albums.map((album) => (
            <div key={album.albumId} className="col-md-3 mb-3">
              <AlbumCard
                album={album}
                onEdit={() => openEditModal(album)}
                onShare={() => openShareModal(album)}
              />
            </div>
          ))
        ) : (
          <p className="text-muted mt-4">No albums found.</p>
        )}
      </div>

      {showModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={editAlbum ? handleUpdateAlbum : handleAddAlbum}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editAlbum ? "Edit Album" : "Add New Album"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setEditAlbum(null);
                      setShowModal(false);
                    }}
                  ></button>
                </div>

                <div className="modal-body">
                  {!editAlbum && (
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Album Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Enter album name"
                        value={newAlbum.name}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Description
                    </label>
                    <textarea
                      name="description"
                      className="form-control"
                      placeholder="Enter album description"
                      rows="3"
                      value={
                        editAlbum ? editAlbum.description : newAlbum.description
                      }
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditAlbum(null);
                      setShowModal(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editAlbum ? "Update Album" : "Add Album"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)",
            zIndex: 1055,
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleShareAlbum}>
                <div className="modal-header">
                  <h5 className="modal-title">Share Album</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowShareModal(false);
                      setSelectedAlbum(null);
                      setSelectedUser("");
                    }}
                  ></button>
                </div>

                <div className="modal-body">
                  <label className="form-label fw-semibold">Select User</label>
                  <select
                    className="form-select"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option value="">-- Select a user --</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowShareModal(false);
                      setSelectedAlbum(null);
                      setSelectedUser("");
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Share
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
