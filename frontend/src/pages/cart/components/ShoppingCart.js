import React, { useState, useEffect } from "react";
import { useCart } from "../../../context/cartContext";
import { Minus, Plus, X } from "lucide-react";
import Discount from "../../../components/icons/Discount";
import Noitems from "./Noitems";
import toast from "react-hot-toast";
import axios from "axios";

const ShoppingCart = ({ onData }) => {
  const [quantity, setQuantity] = useState({});
  const [cart, setCart] = useCart();
  const [discount, setDiscount] = useState(0);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [toggleDiscount, setToggleDiscount] = useState(false);
  const [maxAmount,setMaxAmount] = useState(null)



  const fetchDiscount = async (code) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_PUBLIC_API_URL}/extra/get-discount?code=${code}`
      );
      if (response.data.status) {
        setDiscount(response.data.discount);
        setMaxAmount(response.data.maxAmount)
      }
    } catch (error) {}
  };

  useEffect(() => {
    const disCode = localStorage.getItem("code");
    fetchDiscount(disCode);
  }, []);

  useEffect(() => {
    const updatedQuantity = {};
    cart.forEach((item) => {
      updatedQuantity[item._id] = (updatedQuantity[item._id] || 0) + 1;
    });
    setQuantity(updatedQuantity);
  }, [cart]);

  const increaseQuantity = (item) => {
    const myCart = [...cart, item];
    setCart(myCart);
    localStorage.setItem("cart", JSON.stringify(myCart));
  };

  const decreaseQuantity = (pid) => {
    const myCart = [...cart];
    const index = myCart.findIndex((item) => item._id === pid);
    if (index !== -1) {
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    }
  };

  const removeQuantity = (pid) => {
    const myCart = [...cart];
    const newCart = myCart.filter((item) => item._id !== pid);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const uniqueItems = Object.values(
    cart.reduce((acc, item) => {
      acc[item._id] = item;
      return acc;
    }, {})
  );

  const calculateSubtotal = (pid, price) => {
    const myCart = [...cart];
    const filteredItems = myCart.filter((item) => item._id === pid);
    return filteredItems.length * price;
  };
  
  const handleDiscount = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_PUBLIC_API_URL}/extra/get-discount?code=${code}`
      );
      if (response.data.status) {
        localStorage.setItem("code", code);
        setDiscount(response.data.discount);
        setMaxAmount(response.data.maxAmount)
        setCode("");
        toast.success("Discount Applied Successfully");
        setLoading(false);
        setToggleDiscount(false);
      } else if (!response.data.success) {
        toast.error("Invalid Discount Code");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Invalid Discount Code");
      setLoading(false);
    }
  };

  const subTotal = () => {
    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += item?.price;
    });
    return subtotal;
  };

  const handlePageChange = (e) => {
    e.preventDefault();
    onData("address");
  };


  return (
    <div className="md:mt-10 w-full p-5 md:p-0">
      <div className="flex font-medium justify-between">
        <div>Products</div>
        <div className="gap-9 hidden md:flex">
          <div>Quantity</div>
          <div>Price</div>
          <div>Subtotal</div>
        </div>
      </div>

      <div className="w-full p-2 md:p-3 border-b-2"></div>

      <div className="flex flex-col">
        {uniqueItems && uniqueItems.length > 0 ? (
          uniqueItems?.map((item) => {
            return (
              <div
                key={item?._id}
                className="flex justify-between items-center flex-wrap md:mb-0 mb-5"
              >
                <div className="flex items-center">
                  <img
                    src={`${item?.photo?.keys[0]}`}
                    className="shadow-lg rounded-xl border-gray-200 border object-cover h-[125px] w-[125px] my-7"
                  />
                  <div className="ps-4 flex flex-col gap-3">
                    <div className="text-xl text-medium">{item?.name}</div>

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
                <div className="flex gap-9">
                  <div className="flex border-2 rounded-lg gap-5 items-center px-2 py-1">
                    <button onClick={() => decreaseQuantity(item?._id)}>
                      {" "}
                      <Minus size={15} />
                    </button>
                    {quantity[item?._id] || 1}
                    <button onClick={() => increaseQuantity(item)}>
                      {" "}
                      <Plus size={15} />
                    </button>
                  </div>
                  <div className="font-medium text-xl">₹{item?.price}/-</div>
                  <div className="font-semibold text-xl">
                    ₹{calculateSubtotal(item?._id, item?.price).toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <Noitems />
        )}
        <div className="w-full p-3 border-t-2"></div>
        <div className="flex flex-col w-[90%] ">
          <div>
            <span className="text-xl font-medium">Discount Code</span>
            {toggleDiscount ? (
              <></>
            ) : (
              <span className="ps-4 text-blue-500">
                <button
                  onClick={() => {
                    setToggleDiscount(true);
                  }}
                >
                  click here if you have one?
                </button>
              </span>
            )}
          </div>
          {toggleDiscount ? (
            <div className="max-w-md mt-3 relative">
              <form className="relative">
                <input
                  className="block w-full p-4 pl-12 pr-16 text-sm text-gray-900 border border-gray-400 rounded-2xl"
                  placeholder="Enter Coupen Code"
                  required
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                  }}
                />
                <div className="absolute inset-y-0 left-3 flex items-center">
                  <Discount />
                </div>
                <div className="absolute inset-y-0 right-3 flex items-center">
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
                    <button
                      type="submit"
                      className="p-3"
                      onClick={handleDiscount}
                    >
                      Apply
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="w-full p-3 border-b-2"></div>
        <div className="flex justify-between w-full text-gray-400 font-medium my-3 mt-4">
          Subtotal<span>₹{subTotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between w-full text-gray-400 font-medium my-3">
          Shipping Cost<span>free</span>
        </div>
        {discount > 0 ? (
          <div className="flex justify-between w-full text-gray-400 font-medium my-3">
            <div>
              Discount ({discount}%){" "}
              <button
                className="ps-2"
                onClick={() => {
                  setDiscount(0);
                  localStorage.removeItem("code");
                }}
              >
                x
              </button>
            </div>
            <span>₹{((discount / 100) * subTotal()).maxAmount(maxAmount).toFixed(2)}</span>
          </div>
        ) : (
          <></>
        )}

        <div className="w-full p-3 border-t-2"></div>
        <div className="flex justify-between w-full font-semibold mb-10">
          Total
          <span>
            ₹
            {discount > 0
              ? (subTotal() - (discount/100 * subTotal()).maxAmount(maxAmount)).toFixed(2)
              : subTotal().toFixed(2)}
          </span>
        </div>
        {cart.length < 1 ? (
          <></>
        ) : (
          <button
            className="rounded-lg w-full py-3 text-white mb-[200px] bg-[#FF9900] bg-opacity-[0.6]"
            onClick={(e) => handlePageChange(e)}
          >
            Checkout
          </button>
        )}
      </div>
    </div>
  );
};


export default ShoppingCart;
