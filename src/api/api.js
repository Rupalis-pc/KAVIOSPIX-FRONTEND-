import axios from "axios";

const BASE_URL = "http://localhost:4000"; // backend URL
// export const BASE_URL = "https://kaviospix-backend.vercel.app"; // backend URL

const getToken = () => localStorage.getItem("token");

export const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId;
  } catch {
    return null;
  }
};

export const getData = async (endpoint) => {
  try {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return response.data;
  } catch (error) {
    console.log("GET error", error);
    return null;
  }
};

export const postData = async (endpoint, body) => {
  try {
    const token = getToken();
    

    const response = await axios.post(`${BASE_URL}${endpoint}`, body, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    console.log("POST error", error);
    return null;
  }
};

export const putData = async (endpoint, body) => {
  try {
    const token = getToken();

    const response = await axios.put(`${BASE_URL}${endpoint}`, body, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return response.data;
  } catch (error) {
    console.log("PUT error", error);
    return null;
  }
};

export const deleteData = async (endpoint) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${BASE_URL}${endpoint}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    console.log("DELETE error", error);
    alert("Something went wrong while deleting!");
    return null;
  }
};

export const shareAlbum = async (albumId, email) => {
  return postData(`/albums/${albumId}/share`, { email });
  
};