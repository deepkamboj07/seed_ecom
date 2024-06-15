import React from "react";
import { Route, Routes} from "react-router-dom";
import "./index.css";
import Shop from "./pages/shop/Shop";
import Cart from "./pages/cart/Cart";
import SingleProduct from "./pages/singleProduct/SingleProduct";
import PaymentSuccess from "./pages/PaymentSuccess";
import Wishlist from "./pages/wishlist/Wishlist";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Shop/>} />
      <Route path="/cart" element={<Cart/>} />
      <Route path="/product" element={<SingleProduct/>} />
      <Route path="/payment-success" element={<PaymentSuccess/>} />
      <Route path="/wishlist" element={<Wishlist/>} />
    </Routes>
  );
}

export default App;
