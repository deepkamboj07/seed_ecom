import axios from "axios";
import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { StepBack } from "lucide-react";

const Payment = ({ onData }) => {
  const [quantity, setQuantity] = useState({});
  const [products, setProducts] = useState([]);
  const [uniqueItems, setUniqueItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [firstName, setFirstName] = useState("Loading...");
  const [lastName, setLastName] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");
  const [phoneNumber, setPhoneNumber] = useState("Loading...");
  const [address, setAddress] = useState("Loading...");
  const [city, setCity] = useState("Loading...");
  const [state, setState] = useState("Loading...");
  const [postalCode, setPostalCode] = useState("Loading...");
  const [landmark, setLandMark] = useState("Loading...");
  const [orderId, setOrderId] = useState("");
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
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${
            process.env.REACT_APP_PUBLIC_API_URL
          }/order/get-order?id=${localStorage.getItem("userId")}`
        );
        if (response?.data?.success) {
          if (response.data.order[0].code) {
            fetchDiscount(response.data.order[0].code);
          }
          setOrderId(response.data.order[0].orderId);
          const productsArray = response?.data?.order[0]?.products;
          setProducts(productsArray);
          const uniqueItemsArray = Object.values(
            productsArray.reduce((acc, item) => {
              acc[item._id] = item;
              return acc;
            }, {})
          );
          setUniqueItems(uniqueItemsArray);
        }
      } catch (error) {
        toast.error("Something Went Wrong");
      }
    };
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${
            process.env.REACT_APP_PUBLIC_API_URL
          }/extra/get-user?id=${localStorage.getItem("userId")}`
        );

        const user = response?.data?.user;
        setFirstName(user.name.split("-")[0]);
        setLastName(user.name.split("-")[1]);
        setAddress(user.address.address);
        setCity(user.address.city);
        setEmail(user.email);
        setState(user.address.state);
        setLandMark(user.address.landMark);
        setPostalCode(user.address.postalCode);
        setPhoneNumber(user.phone);
      } catch (error) {
        toast.error(error?.response?.data?.msg);
      }
    };

    fetchData();
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const updatedQuantity = {};
    products?.forEach((item) => {
      updatedQuantity[item._id] = (updatedQuantity[item._id] || 0) + 1;
    });
    setQuantity(updatedQuantity);
  }, [products]);

  const calculateSubtotal = (pid, price) => {
    const myCart = [...products];
    const filteredItems = myCart.filter((item) => item._id === pid);
    return filteredItems.length * price;
  };

  const subTotal = () => {
    let subtotal = 0;
    products?.forEach((item) => {
      subtotal += item?.price;
    });
    return subtotal;
  };

  var options = {
    key: "rzp_test_NeqnD1is8CCE6c",
    amount: (subTotal() - ((discount/100) * subTotal()).maxAmount(maxAmount) ).toFixed(2),
    currency: "INR",
    name: `${firstName} ${lastName}`,
    description: "Test Transaction",
    image: "https://example.com/your_logo",
    order_id: orderId,
    handler: function () {
      localStorage.removeItem("cart")
      localStorage.removeItem("code")
      localStorage.removeItem("current");
      window.location.href = `/payment-success?id=${orderId}`;
    },
    allow_rotation: true,
    prefill: {
      name: `${firstName} ${lastName}`,
      email: email,
      contact: phoneNumber,
    },
    notes: {
      address: `${address},${landmark},${city},${state},${postalCode}`,
    },
    theme: {
      color: "#FF9900",
      hide_topbar: false,
    },
  };
  var rzp1 = new window.Razorpay(options);

  const handlePay = async (e) => {
    try {
      rzp1.open();
      e.preventDefault();
    } catch (error) {
      toast.error("Something Went Wrong")
    }
  };

  return (
    <div className="flex gap-5 mb-10 bg-gray-100 w-full flex-wrap">
      <div className="card lg:w-[55%] w-[750px] rounded-3xl p-5 md:space-y-10">
        <div>
          <div className="text-xl">Your Information</div>
          <div className="p-1 border-t-2 mt-2"></div>
          <div className="my-1">
            <div className="text-lg">Contact Details</div>
            <div className="text-gray-600 text-xs">
              <div className="py-2">
                <div className="text-base text-black">Name</div>
                {firstName} {lastName}
              </div>
              <div className="py-2">
                <div className="text-base text-black">Last Name</div>
                {lastName}
              </div>
              <div className="py-2">
                <div className="text-base text-black">Email Address</div>
                {email}
              </div>
              <div className="py-2">
                <div className="text-base text-black">Phone Number</div>
                {phoneNumber}
              </div>
            </div>
          </div>
          <div className="text-xl">Shipping Details</div>
          <div className="p-1 border-t-2 mt-2"></div>
          <div className="my-1">
            <div className="text-lg">Address</div>
            <div className="flex flex-col text-xs my-2 gap-1 text-gray-600">
              <div>{address}</div>
              <div>{landmark}</div>
              <div>
                {city}, {state}
              </div>
              <div>Pincode {postalCode}</div>
            </div>
          </div>
        </div>

        <div className="flex">
          <button
            type="button"
            className="text-gray-500 pe-3"
            onClick={(e) => {
              e.preventDefault();
              onData("address");
            }}
          >
            <StepBack />
          </button>

          <button
            type="button"
            onClick={handlePay}
            className="rounded-lg w-[200px] py-3 text-white my-[20px] bg-[#FF9900] bg-opacity-[0.6]"
            // disabled={loading}
          >
            Pay Now (₹{(subTotal() - ((discount/100) * subTotal()).maxAmount(maxAmount)).toFixed(2)})
          </button>
        </div>
      </div>

      <div className="lg:w-[40%] w-[450px]">
        <div className="p-3 md:p-1 md:py-5 rounded-2xl card border-2 my-2 md:my-5">
          <p className="font-medium text-xl ps-5 me-5">Order Summary</p>
          {uniqueItems && uniqueItems.length > 0 ? (
            uniqueItems?.map((item) => {
              return (
                <div
                  key={item?._id}
                  className="flex justify-between items-center px-5 py-2"
                >
                  <div className="flex items-center">
                    <img
                      src={`https://d3oj8gzfxhvk43.cloudfront.net/${item?.photo?.keys[0]}`}
                      className="rounded-xl shadow-lg border border-gray-200 object-cover h-[125px] w-[125px] my-7"
                    />
                    <div className="ps-4 flex flex-col gap-3">
                      <div className="text-xl text-medium">{item?.name}</div>

                      <div className="rounded-lg bg-blue-200 text-blue min-w-[100px] w-fit px-2 justify-center item-center flex">
                        {item?.quantity}
                      </div>

                      <div className="flex border-2 rounded-lg gap-5 items-center px-2 py-1 w-fit">
                        Quantity: {quantity[item?._id] || 1}
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
            <div className="flex justify-center items-center h-full w-full my-5">
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
            {discount > 0 ? (
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
                ₹{(subTotal() - ((discount / 100 ) * subTotal()).maxAmount(maxAmount)).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
