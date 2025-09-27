import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css"; // This should import Tailwind
import App from "@/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
