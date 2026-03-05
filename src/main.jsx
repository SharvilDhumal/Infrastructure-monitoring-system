import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/variables.css";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import { IssuesProvider } from "./admin_dashboard/context/IssuesContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <IssuesProvider>
          <App />
        </IssuesProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
