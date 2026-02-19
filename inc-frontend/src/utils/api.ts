import axios from "axios";

// Get API URL from environment variable
// Fallback for development: http://localhost:5000/api
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
