import { api } from "./axiosInstance";
import { useSessionStore } from "@/store/session.store";
import i18n from "@/i18n";

api.interceptors.request.use((config) => {
  const initData = useSessionStore.getState().initData;
  if (initData) {
    config.headers.initdata = initData;
  }
  // Backend xabarlarni (validatsiya, xatolar) foydalanuvchi tilida qaytara olishi uchun:
  // "ru" | "uz" | "uz-Cyrl". CORS-safelisted sarlavha — preflight qo'shmaydi.
  config.headers["Accept-Language"] = i18n.language;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useSessionStore.getState().clearSession();
    }
    return Promise.reject(error);
  },
);
