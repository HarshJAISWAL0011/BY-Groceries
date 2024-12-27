import React, { useState } from 'react';
import { FaShareAlt, FaHeart } from 'react-icons/fa';  // Assuming you're using react-icons
import { useNavigate } from 'react-router-dom';

export default function ShopCard({ id, name, address1, address2, open, close, rating, shop_img }) {
  let navigate = useNavigate();
  const [popupVisible, setPopupVisible] = useState(false);
  const shopLink = `${window.location.origin}/shop/${id}`; // Example link

  const handleShareClick = () => {
    setPopupVisible(true); // Show the popup
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(shopLink); // Copy the link to clipboard
    // alert('Link copied to clipboard!'); // Optionally show an alert or feedback
  };

  return (
    <div className="bg-white shadow-lg rounded-xl flex p-6">
      {/* Left Side: Image */}
      <img
        src={shop_img}
        alt="Shop"
        className="w-32 h-32 object-cover rounded-lg cursor-pointer"
        onClick={() => { navigate(`/shop/${id}`) }}
      />

      {/* Right Side: Shop Details */}
      <div className="p-4 w-full flex flex-col justify-between" >
        {/* Top Content */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 cursor-pointer"  onClick={() => { navigate(`/shop/${id}`) }}>{name}</h2>
          <p className="text-sm text-gray-600 mt-1 cursor-pointer" onClick={() => { navigate(`/shop/${id}`) }}>{address1}</p>
          <p className="text-sm text-gray-600 cursor-pointer"  onClick={() => { navigate(`/shop/${id}`) }}>{address2}</p>
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
