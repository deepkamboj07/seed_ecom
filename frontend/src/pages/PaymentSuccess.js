import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import axios from "axios";
import Check from "../components/icons/Check";
import NavbarSlider from "../components/NavbarSlider";

const PaymentSuccess = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [discount, setDiscount] = useState(0);
  const [date, setDate] = useState();

  const fetchDiscount = async (code) => {
    try {
      if (code) {
        const response = await axios.get(
          `${process.env.REACT_APP_PUBLIC_API_URL}/extra/get-discount?code=${code}`
        );
        if (response.data.status) {
          setDiscount(response.data.discount);
        }
      }
      return;
    } catch (error) {
      return;
    }
  };

  let count = 0;
  useEffect(() => {
    let intervalId;
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const orderIdParam = params.get("id");
        if (orderIdParam) {
          const response = await axios.get(
            `${process.env.REACT_APP_PUBLIC_API_URL}/order/get-success-order?id=${orderIdParam}`
          );
          count = count + 1;
          setDate(response?.data?.order?.transaction);
          setProducts(response?.data?.order?.products);
          fetchDiscount(response?.data?.order?.code);
          if (count >= 5) {
            clearInterval(intervalId);
          }
          if (response.data.success === true) {
            clearInterval(intervalId);
            return;
          }
        }
      } catch (error) {}
    };

    fetchData();
    intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, [location.search]);

  useEffect(() => {
    const createquantity = () => {
      const newquantity = {};
      products.forEach((item) => {
        newquantity[item._id] = (newquantity[item._id] || 0) + 1;
      });
      setQuantities(newquantity);
    };

    if (products?.length > 0) {
      createquantity();
    }
  }, [products]);

  const calculateSubtotal = (id, price) => {
    return quantities[id] * price;
  };

  const subtotal = () => {
    const sum = products?.reduce((acc, item) => {
      acc = acc + item.price;
      return acc;
    }, 0);
    return sum;
  };

  const uniqueItems = products
    ? Object.values(
        products.reduce((acc, item) => {
          acc[item._id] = item;
          return acc;
        }, {})
      )
    : [];

  const dateCalculator = () => {
    const dateObject = new Date(date);
    const formattedDate = dateObject.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    return formattedDate;
  };

  return (
    <>
    <Nav/>
      <NavbarSlider h={5} />
      {products ? (
        <div className="flex flex-col px-[5%] bg-gray-100 w-full">
          <div className="w-full flex items-center flex-col my-5 mt-8">
            <Check />
            <div className="text-2xl font-medium leading-loose">
              Thanks For Your Order!
            </div>
            <div className="text-xs font-normal">
              the order confirmation has been sent to xyz@gmail.com
            </div>
          </div>
          <div className="py-2 w-full border-b-2 border-gray-200"></div>
          <div className="space-y-3 py-5">
            <div>
              <div className="text-xl font-medium leading-loose">
                Transaction Date
              </div>
              <div className="text-xs font-normal">
                {dateCalculator()}
              </div>
            </div>
            {/* <div>
              <div className="text-xl font-medium leading-loose">
                Payment
              </div>
              <div className="text-xs font-normal">
                Mastercard ending with 3457{" "}
              </div>
            </div> */}
            <div>
              <div className="text-xl font-medium leading-loose">
                Shipping Method
              </div>
              <div className="text-xs font-normal">
                Express Delivery(2-3 business days){" "}
              </div>
            </div>
            <button className="text-lg text-[#FF9900] pt-5 underline">
              TRACK ORDER
            </button>
            <div className="py-2 w-full border-b-2 border-gray-200"></div>
          </div>

          <div>
            {Object.values(
              products.reduce((acc, item) => {
                acc[item._id] = item;
                return acc;
              }, {})
            ).length > 0 ? (
              uniqueItems.map((item) => {
                return (
                  <div
                    key={item?._id}
                    className="flex flex-wrap justify-between items-center"
                  >
                    <div className="flex items-center">
                      <img
                        src={`https://d3oj8gzfxhvk43.cloudfront.net/${item?.photo?.keys[0]}`}
                        className="shadow-xl rounded-xl object-cover h-[125px] w-[125px] my-4"
                      />
                      <div className="ps-4 flex flex-col gap-3">
                        <div className="text-xl text-medium">{item?.name}</div>

                        <div className="rounded-lg bg-blue-200 text-blue w-[100px] justify-center item-center flex">
                          {item?.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-9">
                      <div className="flex border-2 rounded-lg gap-5 items-center px-2 py-1">
                        Quantity: {quantities[item?._id] || 1}
                      </div>
                      <div className="font-medium text-xl">
                        ₹{item?.price}/-
                      </div>
                      <div className="font-semibold text-xl">
                        ₹{calculateSubtotal(item?._id, item?.price)}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </div>
          <div className="w-full p-3 border-b-2"></div>
          <div className="flex justify-between w-full text-gray-400 font-medium my-3 mt-4">
            Subtotal<span>₹{subtotal()}</span>
          </div>
          <div className="flex justify-between w-full text-gray-400 font-medium my-3">
            Shipping Cost<span>free</span>
          </div>
          {discount && discount > 0 ? (
            <div className="flex justify-between w-full text-gray-400 font-medium my-3">
              <div>Discount ({discount}%) </div>
              <span>₹{((discount / 100) * subtotal()).toFixed(2)}</span>
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
                ? ((discount / 100) * subtotal()).toFixed(2)
                : subtotal()}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 justify-center items-center h-[600px] w-full">
          <div
            className="Spinner"
            style={{
              border: "4px solid rgba(0, 0, 0, 0.1)",
              borderLeft: "4px solid #3498db",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          Processing Payment...
        </div>
      )}

      <Footer />
    </>
  );
};

export default PaymentSuccess;
