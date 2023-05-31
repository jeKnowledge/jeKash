import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AdminContextProvider } from "./components/checkAdmin";
import { AuthContextProvider } from "./components/GlobalComponent";
import { BrowserRouter } from "react-router-dom";
//component global aqui
ReactDOM.render(
  <AdminContextProvider>
    <AuthContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthContextProvider>
  </AdminContextProvider>,
  document.getElementById("root")
);
