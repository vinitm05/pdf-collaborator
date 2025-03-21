import axios from "axios";

const API = axios.create({
  baseURL: "https://pdf-collaborator.onrender.com/api",
});

// Add request interceptor for tokens
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const uploadPDF = (formData, token) =>
  API.post("/pdf/upload", formData, { headers: { Authorization: token } });
export const getUserPDFs = () => API.get("/pdf");
export const sharePDF = (data, token) =>
  API.post("/pdf/share", data, { headers: { Authorization: token } });
export const getSharedPDF = (link) => API.get(`/pdf/shared/${link}`);
export const addComment = (data) => API.post("/comments", data);
export const getComments = (pdfId) => API.get(`/comments/${pdfId}`);
