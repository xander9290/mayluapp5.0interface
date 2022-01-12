import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import AppProvider from "./components/contexts/AppContext";

// import "bootstrap/dist/css/bootstrap.css";
import "bootswatch/dist/darkly/bootstrap.css";
// import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap-icons/font/bootstrap-icons.css";

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
