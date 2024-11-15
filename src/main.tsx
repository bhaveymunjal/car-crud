import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./Utils/UserProvider";
import { Toaster } from "./Components/ui/toaster";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <UserProvider>
        <Toaster />
        <App />
      </UserProvider>
    </Router>
  </React.StrictMode>
);
