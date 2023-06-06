import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AdminContextProvider } from "./components/checkAdmin";
import { AuthContextProvider } from "./components/GlobalComponent";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
//component global aqui
ReactDOM.render(
  <GoogleOAuthProvider clientId="393111472473-s3heia0a43i612bsl0jvj7v5j4vsjr8k.apps.googleusercontent.com">
    <AdminContextProvider>
      <AuthContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthContextProvider>
    </AdminContextProvider>   
  </GoogleOAuthProvider>
  ,
  document.getElementById("root")
);
