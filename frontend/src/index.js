import React from "react";
import ReactDOM from "react-dom/client"; // Make sure to import from 'react-dom/client' for React 18
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById("root")); // createRoot instead of render
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
