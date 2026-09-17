import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // qubnix_session (HttpOnly) cookie avtomatik yuborilishi/yangilanishi uchun.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
