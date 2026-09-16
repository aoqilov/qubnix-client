import { axiosInstance } from "./axiosInstance";
import { useSessionStore } from "@/store/session.store";

axiosInstance.interceptors.request.use((config) => {
  const initData = useSessionStore.getState().initData;
  if (initData) {
    config.headers.initdata = initData;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useSessionStore.getState().clearSession();
    }
    return Promise.reject(error);
  },
);
