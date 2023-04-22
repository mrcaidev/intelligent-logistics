import "@unocss/reset/tailwind.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "virtual:uno.css";
import { App } from "./app";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
