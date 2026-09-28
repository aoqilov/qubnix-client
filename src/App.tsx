import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "./chakra-system";
import { AppRoutes } from "./routes/AppRoutes";
import { RealtimeBridge } from "./realtime";

export default function App() {
  return (
    <ChakraProvider value={system}>
      {/* SSE oqimi — UI chiqarmaydi, sessiya paydo bo'lganda ulanadi. */}
      <RealtimeBridge />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ChakraProvider>
  );
}
