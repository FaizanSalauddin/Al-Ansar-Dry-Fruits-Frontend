import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { LoaderProvider } from "./context/LoaderContext";
import { CartProvider } from "./context/CartContext";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LoaderProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </LoaderProvider>
    </BrowserRouter>
  </React.StrictMode>
);
