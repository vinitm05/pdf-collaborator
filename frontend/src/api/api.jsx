import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const uploadPDF = (formData, token) =>
  API.post("/pdf/upload", formData, { headers: { Authorization: token } });
export const getUserPDFs = (token) =>
  API.get("/pdf", { headers: { Authorization: token } });
export const sharePDF = (data, token) =>
  API.post("/pdf/share", data, { headers: { Authorization: token } });
export const getSharedPDF = (link) => API.get(`/pdf/shared/${link}`);
export const addComment = (data, token) =>
  API.post("/comments", data, { headers: { Authorization: token } });
export const getComments = (pdfId) => API.get(`/comments/${pdfId}`);
