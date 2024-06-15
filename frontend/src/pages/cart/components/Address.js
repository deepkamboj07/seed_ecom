import React, { useState, useEffect } from "react";
import { useCart } from "../../../context/cartContext";
import { ArrowBigLeft, Minus, Plus, StepBack } from "lucide-react";
import Noitems from "./Noitems";
import axios from "axios";
import toast from "react-hot-toast";

const Address = ({ onData }) => {
  const [cart, setCart] = useCart();
  const [quantity, setQuantity] = useState({});

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [landmark, setLandmark] = useState("");
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState();
  const [maxAmount,setMaxAmount] = useState(null)

  const fetchDiscount = async (code) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_PUBLIC_API_URL}/extra/get-discount?code=${code}`
      );
      if (response.data.status) {
        setMaxAmount(response.data.maxAmount)
        setDiscount(response.data.discount);
      }
    } catch (error) {}
  };

  useEffect(() => {
    const updatedQuantity = {};

    const code = localStorage.getItem("code");
    if (code) {
      fetchDiscount(code);
    }

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

  const subTotal = () => {
    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += item?.price;
    });
    return subtotal;
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_PUBLIC_API_URL}/extra/add-user`,
        {
          firstName,
          lastName,
          email,
          phoneNumber,
          address,
          city,
          state,
          postalCode,
          landmark,
        }
      );
      if (response?.data?.success) {
        localStorage.setItem("userId", response?.data?.user);
        const res = await createOrderApi(response?.data?.user);
        if (res.data.success) {
          onData("payment");
        } else {
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error("something went wrong");
    }
  };

  const createOrderApi = async (userId) => {
    try {
      const code = localStorage.getItem("code");
      const products = [];
      const myCart = [...cart];

      myCart.forEach((item) => {
        products.push(item);
      });

      const requestData = {
        productArray: products,
        buyerId: userId,
        amount:
          discount > 0
            ? (subTotal() - ((discount/100) * subTotal()).maxAmount(maxAmount)).toFixed(2)
            : subTotal(),
      };
      if (code) {
        requestData.code = code;
      }

      const res = await axios.post(
        `${process.env.REACT_APP_PUBLIC_API_URL}/order/create-order`,
        requestData
      );
      return res;
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex gap-5 mb-10 bg-gray-100 w-full flex-wrap">
      <form
        className="card rounded-3xl p-5 space-y-10 lg:w-[55%] w-[750px]"
        onSubmit={(e) => {
          handleClick(e);
        }}
      >
        <div className="space-y-3">
          <div className="text-fontmedium text-lg mb-2">Contact Details</div>
          <div className="flex w-full gap-4">
            <div className="w-[50%]">
              <span className="text-sm text-gray-400 ps-1">First Name</span>
              <input
                className="block w-full p-3 bg-gray-200 pr-16 text-sm text-gray-900 border border-gray-300 rounded-lg"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="w-[50%]">
              <span className="text-sm text-gray-400 ps-1">Last Name</span>
              <input
                className="block w-full p-3 bg-gray-200 pr-16 text-sm text-gray-900 border border-gray-300 rounded-lg"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-400 ps-1">Email</span>
            <input
              className="block w-full p-3 bg-gray-200 pr-16 text-sm text-gray-900 border border-gray-300 rounded-lg"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex w-full flex-col">
            <div className="w-full">
              <div>
                <span className="text-sm text-gray-400 ps-1">Phone Number</span>
              </div>
            </div>
            <div className="w-full flex gap-4 justify-between">
              <div className="w-[20%] md:w-[20%]">
                <div className="w-full">
                  <input
                    className="border border-gray-300 bg-gray-200 block w-full p-3 text-sm border rounded-lg"
                    required
                    value={"+91"}
                  />
                </div>
              </div>
              <div className="w-[75%] md:w-[80%]">
                <input
                  type="number"
                  className="border border-gray-300 bg-gray-200 block w-full p-3 text-sm border rounded-lg"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-fontmedium text-lg mb-2">Shipping Details</div>
          <div>
            <span className="text-sm text-gray-400 ps-1">Address</span>
            <input
              className="block w-full p-3 bg-gray-200 pr-16 text-sm text-gray-900 border border-gray-300 rounded-lg"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="flex w-full gap-4">
            <div className="w-[50%]">
              <span className="text-sm text-gray-400 ps-1">City</span>
              <input
                className="block w-full p-3 bg-gray-200 pr-16 text-sm text-gray-900 border border-gray-300 rounded-lg"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="w-[50%]">
              <span className="text-sm text-gray-400 ps-1">State</span>
              <input
                className="block w-full p-3 bg-gray-200 pr-16 text-sm text-gray-900 border border-gray-300 rounded-lg"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </div>
          <div className="flex w-full gap-4">
            <div className="w-[50%]">
              <span className="text-sm text-gray-400 ps-1">Postal Code</span>
              <input
                className="block w-full p-3 bg-gray-200 pr-16 text-sm text-gray-900 border border-gray-300 rounded-lg"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
            <div className="w-[50%]">
              <span className="text-sm text-gray-400 ps-1">Landmark</span>
              <input
                className="block w-full p-3 bg-gray-200 pr-16 text-sm text-gray-900 border border-gray-300 rounded-lg"
                required
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
              />
            </div>
          </div>
          <div className="flex">
            <button
              type="button"
              className="text-gray-500 pe-3"
              onClick={(e) => {
                e.preventDefault();
                onData("shoppingCart");
              }}
            >
              <StepBack />
            </button>

            <button
              type="Submit"
              className="rounded-lg w-[200px] py-3 text-white my-[20px] bg-[#FF9900] bg-opacity-[0.6]"
              disabled={loading}
            >
              {!loading? "Checkout":"Processing..."}
            </button>
          </div>
        </div>
      </form>

      <div className="lg:w-[40%] w-[450px]">
        <div className="p-3 md:p-1 md:py-5 rounded-2xl border-2 my-2 md:my-5">
          <p className="font-medium text-xl ps-5">Order Summary</p>
          {uniqueItems && uniqueItems.length > 0 ? (
            uniqueItems?.map((item) => {
              return (
                <div
                  key={item?._id}
                  className="flex justify-between items-center px-5 py-2"
                >
                  <div className="flex items-center">
                    <img
                      src={`${item?.photo?.keys[0]}`}
                      className="rounded-xl shadow-lg border border-gray-200 object-cover h-[125px] w-[125px] my-7"
                    />
                    <div className="ps-4 flex flex-col gap-3">
                      <div className="text-xl text-medium">{item?.name}</div>

                      <div className="rounded-lg bg-blue-200 text-blue min-w-[100px] w-fit px-2 justify-center item-center flex">
                        {item?.quantity}
                      </div>

                      <div className="flex border-2 rounded-lg gap-5 items-center px-2 py-1 w-fit">
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
                    </div>
                  </div>
                  <div className="flex gap-9">
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
          <div className="flex w-full flex-col items-center">
            <div className="p-2 border-b-2 w-[80%]"></div>
            <div className="px-3 flex justify-between w-full pt-3">
              <div>Shipping</div>
              <div className="font-medium text-[#FF9900]">Free</div>
            </div>
            <div className="p-2 border-b-2 w-[80%]"></div>
            <div className="px-3 flex justify-between w-full pt-3">
              <div>Sub Total</div>
              <div className="font-medium text-black">₹{subTotal().toFixed(2)}</div>
            </div>
            {discount ? (
              <>
                <div className="p-2 border-b-2 w-[80%]"></div>
                <div className="px-3 flex justify-between w-full pt-3">
                  <div>Discount</div>
                  <div className="font-medium text-black">
                    ₹{((discount / 100) * subTotal()).maxAmount(maxAmount).toFixed(2)}
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            <div className="p-2 border-b-2 w-[80%]"></div>
            <div className="px-3 flex justify-between w-full pt-3 font-semibold">
              <div>Total</div>
              <div className="text-black">
                ₹
                {discount > 0
                  ? (subTotal() - (discount/100 * subTotal()).maxAmount(maxAmount)).toFixed(2)
                  : subTotal().toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;
