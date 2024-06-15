import React from "react";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { useWishlist } from "../../context/wishlistContext";
import Noitems from "./components/Noitems";
import { X } from "lucide-react";
import { useCart } from "../../context/cartContext";
import toast from "react-hot-toast"
import NavbarSlider from "../../components/NavbarSlider";

const Wishlist = () => {
  const [wishlist, setWishlist] = useWishlist();
  const [cart, setCart] = useCart();

  const removeQuantity = (id) => {
    const wishlistArray = [...wishlist];
    const itemIndex = wishlistArray.findIndex((item) => item._id === id);
    wishlistArray.splice(itemIndex, 1);
    setWishlist(wishlistArray);
    localStorage.setItem("wishlist", JSON.stringify(wishlistArray));
  };

  const handleCart = (item) => {
    setCart([...cart, item]);
    localStorage.setItem("cart", JSON.stringify([...cart, item]));
    toast.success("Product added to cart")
  };

  return (
    <>
      <Nav />
      <NavbarSlider h={5} />
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="flex-grow">
          <div className="flex items-center flex-col bg-gray-100">
            <div className="flex justify-center mt-5 font-[200px] text-4xl mb-5 md:mb-10 w-full">
              Wishlist
            </div>
            <div className="w-full px-5 md:px-[150px]">
              {wishlist && wishlist.length > 0 ? (
                wishlist.map((item) => {
                  return (
                    <>
                      <div
                        key={item?._id}
                        className="flex-wrap flex justify-between items-center w-full"
                      >
                        <div className="flex items-center">
                          <img
                            src={`https://d3oj8gzfxhvk43.cloudfront.net/${item?.photo?.keys[0]}`}
                            className="shadow-lg border border-gray-200 rounded-xl object-cover h-[125px] w-[125px] my-7"
                          />
                          <div className="ps-4 flex flex-col gap-3">
                            <div className="text-xl text-medium">
                              {item?.name}
                            </div>

                            <div className="rounded-lg bg-blue-200 text-blue min-w-[100px] w-fit px-2 justify-center item-center flex">
                              {item?.quantity}
                            </div>

                            <button
                              onClick={() => removeQuantity(item?._id)}
                              className="flex text-gray-500 active:text-red-400"
                            >
                              <X />
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-3 md:gap-9 items-center justify-center flex-wrap">
                          <div className="font-medium flex items-center justify-center">
                            <button
                              className="w-[130px] mt-4 flex rounded-2xl p-2 items-center text-white justify-center font-medium flex border border-input bg-background ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity- bg-[#FF9900] bg-opacity-[0.6]"
                              
                              onClick={() => {
                                handleCart(item);
                              }}
                            >
                              + Add to Cart
                            </button>
                          </div>
                          <div className="font-medium text-xl flex items-center justify-center">
                            ₹{item?.price}/-
                          </div>
                        </div>
                      </div>
                      <div className="p-2 border-b-2"></div>
                    </>
                  );
                })
              ) : (
                <>
                  <Noitems />
                </>
              )}
            </div>
          </div>
        </div>
        <Footer /> {/* Footer outside flex-grow div */}
      </div>
    </>
  );
};

export default Wishlist;
