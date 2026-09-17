import { api } from "./axiosInstance";
import { useSessionStore } from "@/store/session.store";

api.interceptors.request.use((config) => {
  const initData = useSessionStore.getState().initData;
  if (initData) {
    config.headers.initdata = initData;
  }
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
