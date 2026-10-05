import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "./chakra-system";
import { AppRoutes } from "./routes/AppRoutes";
import { RealtimeBridge } from "./realtime";
import { PwaUpdateToast } from "./components/layout/pwa/PwaUpdateToast";

export default function App() {
  return (
    <ChakraProvider value={system}>
      <BrowserRouter>
        {/* SSE oqimi — UI chiqarmaydi, sessiya paydo bo'lganda ulanadi. */}
        <RealtimeBridge />
        <AppRoutes />
        {/* Yangi versiya yuklab bo'linganda — user tasdiqlaguncha qo'llanmaydi. */}
        <PwaUpdateToast />
      </BrowserRouter>
    </ChakraProvider>
  );
}
