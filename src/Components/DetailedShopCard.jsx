import React, { useState } from "react";
import { FaShareAlt, FaHeart } from "react-icons/fa";

export default function DetailedShopCard({name, address1, address2, open, close, rating, shop_img, id}) {
  const [popupVisible, setPopupVisible] = useState(false);
  const shopLink = `${window.location.origin}/shop/${id}`;

  const handleShareClick = () => {
    setPopupVisible(true); 
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(shopLink);  
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row">
      {/* Left Side: Image */}
      <img
        src={shop_img}
        alt="Shop"
        className="w-full md:w-72 h-72 object-cover rounded-lg mb-6 md:mb-0"
      />

      {/* Right Side: Shop Details */}
      <div className="p-4 w-full flex flex-col justify-between md:min-w-96 pt-6 md:ps-8">
        {/* Top Content */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
          <p className="text-sm text-gray-600 mt-1">{address1}</p>
          <p className="text-sm text-gray-600">{address2}</p>
          <br />
          <p className="text-sm text-gray-600">Opens at: {open}</p>
          <p className="text-sm text-gray-600">Closes at: {close}</p>
        </div>

        {/* Bottom Icons */}
        <div className="flex justify-end space-x-4 mt-2">
          <button
            className="text-blue-500 hover:text-blue-600"
            onClick={handleShareClick}
          >
            <FaShareAlt size={20} />
          </button>
          <button className="text-red-500 hover:text-red-600">
            <FaHeart size={20} />
          </button>
        </div>
      </div>

      {/* Share Popup */}
      {popupVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Share this Shop</h3>
            <div className="flex flex-col">
              <textarea
                readOnly
                value={shopLink}
                className="p-2 border rounded-lg mb-4"
                rows={3}
              />
              <button
                onClick={handleCopyClick}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Copy Link
              </button>
              <button
                onClick={() => setPopupVisible(false)}
                className="mt-4 text-red-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
