import React, { useState, useEffect } from "react";
import Nav from "../../components/Nav";
import ShoppingCart from "./components/ShoppingCart";
import Address from "./components/Address";
import Payment from "./components/Payment";
import Footer from "../../components/Footer";
import NavbarSlider from "../../components/NavbarSlider";

const Cart = () => {
  const [activeTab, setActiveTab] = useState("shoppingCart");

  const handleChildData = async (childData) => {
    setActiveTab(childData);
    localStorage.setItem("current",childData)
  };

  useEffect(() => {
    const storedTab = localStorage.getItem("current");
    console.log("Stored tab:", storedTab);
    if (storedTab) {
      console.log(1)
      setActiveTab(storedTab);
    }
  }, [activeTab]);

  return (
    <>
      <Nav />
      <NavbarSlider h={5} />
      <div className="flex items-center flex-col bg-gray-100">
        <div className="flex justify-center mt-5 font-[200px] text-4xl md:mb-10">
          {activeTab === "shoppingCart" ? "Cart" : <></>}
          {activeTab === "address" ? "Address" : <></>}
          {activeTab === "payment" ? "Payment" : <></>}
        </div>
        <div className="md:mb-5 flex items-center justify-center w-full gap-3 md:gap-10 px-5 md:px-[10%]">
          <div
            className={`font-semibold flex-1 flex items-center justify-center border-b-2 py-5 ${
              activeTab === "shoppingCart"
                ? "border-[#FF9900] text-[#FF9900]"
                : "text-gray-500"
            }`}
          >
            Cart
          </div>
          <div
            className={`font-semibold flex-1 flex items-center justify-center border-b-2 py-5 ${
              activeTab === "address"
                ? "border-[#FF9900] text-[#FF9900]"
                : "text-gray-500"
            }`}
          >
            Address
          </div>
          <div
            className={`font-semibold flex-1 flex items-center justify-center border-b-2 py-5 ${
              activeTab === "payment"
                ? "border-[#FF9900] text-[#FF9900]"
                : "text-gray-500"
            }`}
          >
            Payment
          </div>
        </div>
        <div className="flex justify-center w-[100%] md:w-[80%]">
          {activeTab === "shoppingCart" && (
            <ShoppingCart onData={handleChildData} />
          )}
          {activeTab === "address" && <Address onData={handleChildData} />}
          {activeTab === "payment" && <Payment onData={handleChildData} />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
