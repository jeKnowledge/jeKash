import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AdminContextProvider } from "./components/checkAdmin";
import { AuthContextProvider } from "./components/GlobalComponent";
//component global aqui
ReactDOM.render(
  <AdminContextProvider>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </AdminContextProvider>,
  document.getElementById("root")
);
