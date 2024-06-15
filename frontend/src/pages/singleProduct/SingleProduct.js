import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import axios from "axios";
import toast from "react-hot-toast";
import Images from "./components/Images";
import { ArrowBigLeft, CarTaxiFront, Minus, Plus, StepBack } from "lucide-react";
import { useCart } from "../../context/cartContext";
import NavbarSlider from "../../components/NavbarSlider";

const SingleProduct = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pid = searchParams.get("pid");
  const [product, setProduct] = useState();
  const [cart, setCart] = useCart();

  const naviagte = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!pid) return;
        const response = await axios.get(
          `${process.env.REACT_APP_PUBLIC_API_URL}/products/get-single-product?pid=${pid}`
        );
        setProduct(response.data.product);
      } catch (error) {
        toast.error("Internet Connection Lost");
      }
    };
    fetchData();
  }, [pid]);

  const countProducts = () => {
    const myCart = [...cart];
    const newCart = myCart.filter((item) => item._id === pid);
    return newCart.length;
  };

  const handleCart = async (product) => {
    const myCart = [...cart];
    myCart.push(product);
    localStorage.setItem("cart", JSON.stringify(myCart));
    setCart(myCart);
    toast.success("Product Added to Cart");
  };

  const handleIncrease = (e, product) => {
    e.preventDefault();
    const myCart = [...cart];
    myCart.push(product);
    localStorage.setItem("cart", JSON.stringify(myCart));
    setCart(myCart);
  };

  const handleDecrease = (e) => {
    e.preventDefault();
    const myCart = [...cart];
    const index = myCart.findIndex((item) => item._id === pid);
    if (index !== -1) {
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    }
  };


  const handleRedirect = (e)=>{
    e.preventDefault()
    naviagte("/")
  }

  return (
    <>
      <div className="flex flex-col w-full">
        <Nav />
        <NavbarSlider h={5} />
        <div className="flex w-full justify-center items-center bg-gray-100 md:space-x-0 flex-wrap pt-4 md:pt-10">
          <button className="hidden md:flex pb-20 text-gray-700" onClick={handleRedirect}>
            <StepBack size={30}/>
          </button>
          <div className="w-[700px] flex justify-center items-center p-5 md:p-10">
            <Images photos={product?.photo?.keys} />
          </div>
          <div className="w-[500px] md:w-[500px] ps-0 p-10 md:px-0 justify-center items-center ps-5">
            <p className="text-2xl font-medium justify-between w-full flex mb-3 items-center">
              {product?.name}
              <div className="font-semibold text-[#FF9900] font-medium text-lg">
              ₹{product?.price}/-
              </div>
            </p>
            <div className="w-fit rounded-lg p-1 text-blue bg-blue-200 text-sm px-3">
              {product?.quantity}
            </div>
            <div className="mt-5 flex-wrap">{product?.description}</div>
            <p className="font-semibold text-[#FF9900] font-medium text-2xl pt-10">
              {" "}
              FREE SHIPPING
            </p>
            <div className="flex flex-wrap w-full mt-10 md:mt-[150px] gap-10">
              <button
                onClick={() => {
                  handleCart(product);
                }}
                className="w-fit px-2 rounded-lg py-2 text-white w-[60%] ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-[#FF9900] bg-opacity-[0.6]"
              >
                + Add To Cart
              </button>
              <div className="flex border-2 rounded-lg gap-5 items-center px-2 py-1">
                <button
                  onClick={(e) => {
                    handleDecrease(e);
                  }}
                >
                  {" "}
                  <Minus size={15} />
                </button>
                {countProducts()}
                <button
                  onClick={(e) => {
                    handleIncrease(e, product);
                  }}
                >
                  {" "}
                  <Plus size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default SingleProduct;
