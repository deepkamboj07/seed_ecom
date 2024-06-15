import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/cartContext";
import { WishlistProvider } from "./context/wishlistContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

Number.prototype.maxAmount = function(maxAmount) {
  return Math.min(this, maxAmount);
};


root.render(
  <BrowserRouter>
    <WishlistProvider>
      <CartProvider>
        <Toaster />
        <App />
      </CartProvider>
    </WishlistProvider>
  </BrowserRouter>
);

reportWebVitals();
