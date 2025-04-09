import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// ⬅️ استيراد AuthProvider
import { AuthProvider } from "./Contexts/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* ⬅️ تغليف التطبيق داخل AuthProvider */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
