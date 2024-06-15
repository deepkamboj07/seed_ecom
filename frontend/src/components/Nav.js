import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CircleUserRound,
  Cross,
  CrossIcon,
  Heart,
  Menu,
  Search,
  Send,
  ShoppingCart,
  X,
} from "lucide-react";
import { useCart } from "../context/cartContext";
import { useWishlist } from "../context/wishlistContext";
import axios from "axios";

const Nav = ({ onData }) => {
  const [cart] = useCart();
  const [wishlist] = useWishlist();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (search.trim() !== "") {
          const response = await axios.get(
            `${process.env.REACT_APP_PUBLIC_API_URL}/products/search?search=${search}`
          );
          setProducts(response.data.products);
          setIsDropdownOpen(true);
        } else {
          setProducts([]);
          setIsDropdownOpen(false);
        }
      } catch (error) {
        console.error("Check your internet connection");
      }
    };
    fetchData();
  }, [search]);

  const handleClick = async (e) => {
    e.preventDefault();
    onData(search);
    setIsDropdownOpen(false);
  };

  const handleClear = async (e) => {
    e.preventDefault();
    setSearch("");
    onData("");
    setIsDropdownOpen(false);
    setProducts([]);
  };

  const handleToggelMenu = (e) => {
    e.preventDefault();
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  return (
    <>
      <nav className="flex font-normal items-center  md:h-[70px] h-[50px] w-auto ">
        <div className="flex items-center justify-center items-center sm:flex w-full">
          <div className="w-full flex justify-between md:w-[80%] h-full items-center">
            <div style={{ width: "20%" }} className="">
              <Link to="/" className="flex justify-center text-black">
                <h2 className=" text-xl font-bold">Seed Ecommerce</h2>
              </Link>
            </div>

            <div style={{ width: "70%" }} className="pe-5">
              <div className="max-w-md mx-auto">
                <form className="relative" onSubmit={(e) => handleClick(e)}>
                  <input
                    className="block w-full p-4 p-4 pr-16 text-sm text-gray-900 border border-gray-400 rounded-2xl md:h-[50px] h-[40px]"
                    placeholder="Search for items"
                    required
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                  />
                  {isDropdownOpen && products.length > 0 && (
                    <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 text-left z-99999999">
                      <div
                        className="py-1 new-class-for-dropdown"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        {products?.map((product) => (
                          <Link
                            className="block flex justify-left px-4 py-2 text-sm w-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 overflow-hidden"
                            role="menuitem"
                            to={`/product?pid=${product._id}`}
                            onClick={() => setSearch("")}
                          >
                            {product.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {search ? (
                    <div className="absolute inset-y-0 right-[50px] flex items-center">
                      <button type="button" onClick={(e) => handleClear(e)}>
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <></>
                  )}

                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <button type="submit">
                      <Search className="h-6 w-6 text-[#FF9900]" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div
            className="text-center flex gap-9 justify-center me-10 hidden md:flex"
            style={{ width: "40%" }}
          >
            <Link to="/cart" className="flex gap-2 relative">
              <ShoppingCart style={{ color: "FF9900" }} size={20} />
              <span className="absolute top-0 end-0 inline-flex items-center py-0.3 px-1.5 rounded-full text-xs font-sm transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                {cart?.length}
              </span>
              Cart
            </Link>
            {/* <Link to="/wishlist" className="flex gap-2 relative">
              <Heart style={{ color: "FF9900" }} size={20} />
              <span className="absolute top-0 end-0 inline-flex items-center py-0.3 px-1.5 rounded-full text-xs font-sm transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                {wishlist?.length}
              </span>
              Wishlist
            </Link> */}
            {/* <Link to="/shop" className="flex gap-2 ">
              <CircleUserRound style={{ color: "FF9900" }} size={20} />
              Account
            </Link> */}
          </div>

          <div
            className="md:hidden flex justify-end pe-5"
            style={{ width: "20%" }}
          >
            <button onClick={handleToggelMenu}>
              <Menu />
            </button>
          </div>
        </div>
      </nav>
      <div className="relative">
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black opacity-50 z-[9998]"></div>
        )}
        {isMenuOpen && (
          <div className="fixed inset-0 flex justify-end z-[9999]">
            <div className={`w-[80%] bg-white flex flex-col menu-container ${isMenuOpen ? "animate-menu-open" : "animate-menu-close"}`}>
              <button className="p-5" onClick={handleToggelMenu}>
                <X className="text-[#FF9900]" />
              </button>
              <div className="w-full flex items-center justify-center">
                <div className="border-t-[1px] w-[90%] flex border-gray-200 p-1"></div>
              </div>
              <Link to="/cart" className="w-full">
                <div className="flex gap-2 relative my-3 w-fit ms-8 p-1">
                  <ShoppingCart style={{ color: "FF9900" }} size={20} />
                  <span className="absolute top-0 end-0 inline-flex items-center py-0.3 px-1.5 rounded-full text-xs font-sm transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                    {cart?.length}
                  </span>
                  Cart
                </div>
              </Link>
              <Link to="/wishlist" className="w-full">
                <div className="flex gap-2 relative my-3 w-fit ms-8 p-1">
                  <Heart style={{ color: "FF9900" }} size={20} />
                  <span className="absolute top-0 end-0 inline-flex items-center py-0.3 px-1.5 rounded-full text-xs font-sm transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                    {wishlist?.length}
                  </span>
                  Wishlist
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Nav;
