import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // qubnix_session (HttpOnly) cookie avtomatik yuborilishi/yangilanishi uchun.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    // VITE_API_URL hozircha ngrok tunnel — bu header bo'lmasa ngrok
    // brauzer so'roviga JSON o'rniga o'zining ogohlantirish HTML sahifasini
    // qaytaradi.
    "ngrok-skip-browser-warning": "1",
  },
});
