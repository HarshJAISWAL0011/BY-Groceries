import React from "react";
import { FaShareAlt, FaHeart } from "react-icons/fa";

export default function DetailedShopCard({name, address1, address2, open, close, rating, shop_img}) {
   return (
      <div className=" bg-white shadow-lg rounded-xl flex p-6 ">
        {/* Left Side: Image */}
        <img
          src={shop_img}
          alt="Shop"
          className="w-72 h-72 object-cover rounded-lg"
        />
  
        {/* Right Side: Shop Details */}
        <div className="p-4 w-full flex flex-col justify-between min-w-96 pt-6 ps-8">
          {/* Top Content */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 ">{name}</h2>
            <p className="text-sm text-gray-600 mt-1">{address1}1</p>
            <p className="text-sm text-gray-600">{address2}</p>
            <br />
            <p className="text-sm text-gray-600">Opens at: {open}</p>
            <p className="text-sm text-gray-600">Closes at: {close}</p>

          </div>
  
          {/* Bottom Icons */}
          <div className="flex justify-end space-x-4 mt-2">
            <button className="text-blue-500 hover:text-blue-600">
              <FaShareAlt size={23} />
            </button>
            <button className="text-red-500 hover:text-red-600">
              <FaHeart size={23} />
            </button>
          </div>
        </div>
      </div>
    );
}
