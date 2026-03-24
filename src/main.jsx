import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./app/App.jsx";
import { Providers } from "./app/providers.jsx";

createRoot(document.getElementById("root")).render(
  <Providers>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Providers>
);