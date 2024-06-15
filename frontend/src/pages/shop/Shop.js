import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import axios from "axios";
import toast from "react-hot-toast";
import Pagination from "./components/pagination";
import { Ban, ChevronDown, Cross, Heart, Plus } from "lucide-react";
import { useCart } from "../../context/cartContext";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, message, Space, Tooltip } from "antd";
import Noitems from "./components/Noitems";
import { Prices } from "./components/Prices";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/wishlistContext";
import NavbarSlider from "../../components/NavbarSlider";

const Shop = () => {
  const [wishlist, setWishlist] = useWishlist();
  const [itemData, setItemData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [cart, setCart] = useCart();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [priceRange, setPriceRange] = useState({});
  const [search, setSearch] = useState();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_PUBLIC_API_URL}/category/get-category`
        );
        setCategories(response?.data?.category);
      } catch (error) {
        toast.error("Internet Connection Lost");
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${
            process.env.REACT_APP_PUBLIC_API_URL
          }/products/get-product?page=${page}&limit=8${
            selectedCategory._id ? `&category=${selectedCategory?._id}` : ""
          }${priceRange?._id ? `&priceRange=${priceRange?.range}` : ""}${
            search?.length > 0 ? `&search=${search}` : ""
          }`
        );
        setItemData(response.data.products);
        setTotalPages(response.data.totalPages);
        if (response.data.success) {
          setLoading(false);
        }
      } catch (error) {
        toast.error("Internet Connection Lost");
      }
    };
    fetchCategories();
    fetchProducts();
  }, [page, selectedCategory, priceRange, search]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
    setLoading(true);
  };

  const handleCart = (item) => {
    setCart([...cart, item]);
    localStorage.setItem("cart", JSON.stringify([...cart, item]));
    toast.success("Product Added to Cart");
  };

  const handleChildData = async (childData) => {
    setSearch(childData);
  };

  const toggleWishlist = async (item) => {
    const wishlistArray = [...wishlist];
    const index = wishlistArray.findIndex(
      (wishlistItem) => wishlistItem._id === item._id
    );

    if (index === -1) {
      wishlistArray.push(item);
      localStorage.setItem("wishlist", JSON.stringify(wishlistArray));
      setWishlist(wishlistArray);
      toast.success("Item Added to Wishlist");
    } else {
      wishlistArray.splice(index, 1);
      localStorage.setItem("wishlist", JSON.stringify(wishlistArray));
      setWishlist(wishlistArray);
      toast.success("Item Removed from Wishlist");
    }
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  return (
    <>
      <Nav onData={handleChildData} />
      <NavbarSlider h={5} />
      <div className="m-0 p-0 h-auto w-auto ">
        
        <div style={{ position: "relative" }}>
          <div className="bg-gray-100">
            <img
              style={imageStyle}
              src={require("../../images/seed.jpg")}
              alt="Background"
              className="relative"
            />
            <img
              style={{ ...imageStyle, position: "absolute", top: 0, left: 0 }}
              src={require("../../images/garden.png")}
              alt="Foreground"
              className="absolute"
            />
            <div
              style={{
                ...imageStyle,
                position: "absolute",
                top: "40%",
                left: 0,
                width: "100%", // Ensure text takes full width
                textAlign: "center", // Center align text
              }}
            >
              <div
                className="font-medium text-white"
                style={{ fontSize: "6vw", marginBottom: "2vw" }}
              >
                Seed Ecommerce
              </div>
              <div
                className="font-medium text-white"
                style={{ fontSize: "2vw" }}
              >
                Lorem Ipsum is simply dummy text of the printing and
                <br /> typesetting industry. Lorem Ipsum
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col items-center bg-gray-100"
          style={{ alignItems: "center" }}
        >
          <h1 className="text-2xl md:text-4xl font-medium pt-10 pb-9 w-fit">
            <div className="px-4 mb-2">Our Products</div>
            <div>
              <NavbarSlider h={3} />
            </div>
          </h1>

          <div className="mb-10 md:flex w-full px-10 space-y-5 md:space-y-0">
            <div className="flex-col flex flex-1 gap-1 md:items-center text-gray-500 w-auto">
              <span className="ps-2 md:ps-0">Categories</span>
              <Dropdown
                className="flex items-center text-base md:w-[200px] py-[22px] px-5 font-poppins my-custom-dropdown"
                overlay={
                  <Menu>
                    {categories.map((category) => (
                      <Menu.Item
                        key={category._id}
                        onClick={() => setSelectedCategory(category)}
                      >
                        <span>{category.name}</span>
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <Button className="px-4 py-2 flex items-center">
                  {selectedCategory.name ? (
                    <div className="flex items-center justify-between w-full">
                      <div>{selectedCategory.name}</div>{" "}
                      <button
                        onClick={() => setSelectedCategory("")}
                        className="transform rotate-45"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex w-full justify-between items-center">
                      <div>Select Category</div>
                      <div>
                        <ChevronDown size={15} />
                      </div>
                    </div>
                  )}
                </Button>
              </Dropdown>
            </div>

            <div className="flex-1 flex flex-col gap-1 md:items-center text-gray-500">
              <span className="ps-2 md:ps-0">Price Range</span>
              <Dropdown
                className="flex items-center text-base md:w-[200px] py-[22px] px-5 font-poppins my-custom-dropdown"
                overlay={
                  <Menu>
                    {Prices.map((item) => (
                      <Menu.Item
                        key={item._id}
                        onClick={() => setPriceRange(item)}
                      >
                        <span>{item?.name}</span>
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <Button className="px-4 py-2 flex items-center">
                  {priceRange.name ? (
                    <div className="flex items-center justify-between w-full">
                      <div>{priceRange.name}</div>{" "}
                      <button
                        onClick={() => setPriceRange("")}
                        className="transform rotate-45"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex w-full justify-between items-center">
                      <div>Select Price Range</div>
                      <div>
                        <ChevronDown size={15} />
                      </div>
                    </div>
                  )}
                </Button>
              </Dropdown>
            </div>
          </div>
          <div></div>

          <div className="flex flex-wrap gap-10 w-[90%] items-center justify-center mb-[50px]">
            {itemData.length === 0 ? (
              <Noitems />
            ) : (
              itemData.map((item) => (
                <div className="card flex flex-col items-center justify-center shadow-2xl rounded-2xl w-[300px] p-4">
                  <div className="w-full h-[250px]">
                    {loading ? (
                      <div className="flex justify-center items-center h-full w-full">
                        <div
                          className="Spinner"
                          style={{
                            border: "4px solid rgba(0, 0, 0, 0.1)",
                            borderLeft: "4px solid #3498db",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            animation: "spin 1s linear infinite",
                          }}
                        ></div>
                      </div>
                    ) : (
                      <img
                        src={`${item?.photo?.keys[0]}`}
                        className="rounded-xl w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <Link
                    to={`/product?pid=${item?._id}`}
                    className="font-medium text-lg p-2"
                  >
                    {item?.name}
                  </Link>
                  <div className="flex justify-between w-full p-3 align-center m-0">
                    <div className="text-[#FF9900] font-semibold text-lg m-0">
                      ₹{item?.price}/-
                    </div>
                    {/* <button
                      onClick={() => toggleWishlist(item)}
                      className="me-2"
                    >
                      <Heart
                        strokeWidth={1.5}
                        color={"#FF9900"}
                        fill={
                          wishlist.findIndex(
                            (wishlistItem) => wishlistItem._id === item._id
                          ) !== -1
                            ? "#FF9900"
                            : "none"
                        }
                      />
                    </button> */}
                  </div>
                  <div className="w-full flex m-0 p-0 ps-2">
                    <div className="w-auto rounded-lg p-1 text-[#FF9900] bg-opacity-[0.2] bg-[#FF9900] text-sm px-3 m-0">
                      {item?.quantity}
                    </div>
                  </div>
                  <button
                    className="mt-4 rounded-2xl p-2 w-full items-center justify-center font-medium flex border border-input bg-background ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-[#CC7A00] text-[#FF9900]"
                    onClick={() => {
                      handleCart(item);
                    }}
                  >
                    + Add to Cart
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="flex">
            {itemData.length !== 0 ? (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="py-[40px] h-auto bg-white md:flex justify-center gap-[150px] items-center bg-opacity-[0.1] bg-[#FF9900]">
          <div className="felx flex-col items-center justify-center px-5">
            <p className="text-4xl font-medium">Hybrid Vegitable seeds</p>
            <p className="p-5" style={{ color: "#004AAD" }}>
              Made For Your Farms
            </p>
            <ul className="gap-y-2">
              <li className="flex gap-2 items-center">
                <Ban size={20} style={{ color: "FF9900" }} />
                Lorem Ipsum is simply dummy text of the printing
              </li>
              <li className="flex gap-2 items-center">
                <Ban size={20} style={{ color: "FF9900" }} />
                Lorem Ipsum is simply dummy text of the printing
              </li>
              <li className="flex gap-2 items-center">
                <Ban size={20} style={{ color: "FF9900" }} />
                Lorem Ipsum is simply dummy text of the printing
              </li>
              <li className="flex gap-2 items-center">
                <Ban size={20} style={{ color: "FF9900" }} />
                Lorem Ipsum is simply dummy text of the printing
              </li>
            </ul>
            <button className="py-5">Know More {">"}</button>
          </div>
          <div className="items-center justify-center px-5">
            <img className="w-auto" src={require("../../images/seeds.png")} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Shop;
