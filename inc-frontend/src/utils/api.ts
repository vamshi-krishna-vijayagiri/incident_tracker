import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://192.168.1.178:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
