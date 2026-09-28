import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "./chakra-system";
import { AppRoutes } from "./routes/AppRoutes";
import { RealtimeBridge } from "./realtime";

export default function App() {
  return (
    <ChakraProvider value={system}>
      <BrowserRouter>
        {/* SSE oqimi — UI chiqarmaydi, sessiya paydo bo'lganda ulanadi. */}
        <RealtimeBridge />
        <AppRoutes />
      </BrowserRouter>
    </ChakraProvider>
  );
}
