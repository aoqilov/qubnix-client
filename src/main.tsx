import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api-config/queryClient";
import "./api-config/interceptors";
import { enterWay } from "./components/layout/enter-way";
import App from "./App";
import "./styles/globals.css";

// Session holati (Telegram silent-auth yoki web token) shu yerda tayyorlanadi,
// shuning uchun avval enterWay tugashini kutamiz, keyin render qilamiz.
enterWay().finally(() => {
  const root = document.getElementById("root")!;
  createRoot(root).render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
});
