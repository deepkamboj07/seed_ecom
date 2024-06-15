import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import React from "react";

const Footer = () => {
  const date = new Date();
  return (
    <>
      <div className="bg-[#040F05] w-full py-12 sm:px-16 px-6 items-center justify-between">
        <div className="flex lg:gap-20 gap-0 lg:flex-row flex-col sm:justify-between justify-center items-center">
          {/* <div className="flex items-center">
            <img src={require("../images/punch.png")}
               
                className="h-32 w-32 md:h-[200px] md:w-[200px]"
               />
          </div> */}

        <div
            className="text-white sm:flex-grow sm:mt-36 mt-5"
          >
            {/*<div className="mb-8 sm:px-5 px-1">
                <div className=" sm:text-sm text-xs flex flex-wrap sm:justify-between justify-center items-center text-[#FFFFFF]">
                    <div className="sm:block hidden">
                        <h4></h4>
                    </div>
                    <div className="flex sm:flex-row flex-col sm:gap-0 gap-5">
                        <div className=" flex gap-5 mr-20 flex-wrap">
                          <Facebook/>
                          <Linkedin/>
                          <Instagram/>
                        </div>
                        <div className="flex sm:gap-10 gap-2 list-none">
                          <li>Home</li>
                          <li>About</li>
                          <li>Shop</li>
                          <li>Contact Us</li>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" w-full h-[0.1px] bg-white"></div> */}
            {/* <div className=" mt-6 mb-10 sm:px-5 px-1 w-full">
                <div className=" sm:text-sm text-xs flex-wrap flex sm:justify-between justify-center text-[#FFFFFF]">
                    <div className="sm:block hidden">
                        <h4>copyright 	&#169; {date.getFullYear()}</h4>
                    </div>
                    <div className="flex sm:gap-6 gap-4 list-none flex-wrap">
                        <li>Privacy policy</li>
                        <li>Terms and Conditions</li>
                        <li>Cancelation and Refund</li>
                        <li>Shipping and Delivery</li>
                    </div>
                </div>
            </div> */}

            <div className="sm:hidden block text-center text-xs">
                        <h4>copyright 	&#169; {date.getFullYear()}</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
