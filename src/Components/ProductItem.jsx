import axios from 'axios';
import { baseUrl } from 'Constants';
import Cookies from 'js-cookie';
import React, { useState } from 'react'

export default function ProductItem({img_url,item_name,price, unit, description, product_id,vendorId,initialQuantity}) {
    const [quantity, setQuantity] = useState(initialQuantity);

    const increaseQuantity = () =>{ 
      setQuantity((quantity)=>{
      const token = Cookies.get("userToken");
      let obj = JSON.parse(token);
      if(!token) return
      axios.post(`${baseUrl}addtocart`,{
          customerId:obj.uid, product_id, quantity:(quantity+1), vendorId
        });
      return quantity+1
    }
  )};
    const decreaseQuantity = () =>{ 
      setQuantity((quantity)=>{
      const token = Cookies.get("userToken");
      let obj = JSON.parse(token);
   
      axios.post(`${baseUrl}addtocart`,{
          customerId:obj.uid, product_id, quantity:(Math.max(0,quantity-1)), vendorId
        });
      return Math.max(0,quantity-1)
    }
  )};

  
    return (
      <div className="flex items-center w-full bg-white rounded-lg p-4 mb-2">
        {/* Left: Image */}
        <img
          src={img_url}
          alt="Product"
          className="w-32 h-32 object-cover rounded-lg"
        />
  
        {/* Right: Product Details */}
        <div className="flex flex-col justify-between w-full pl-4">
          {/* Product Name and Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{item_name}</h2>
            <p className="text-sm text-gray-600">{description}</p>
            <p className="text-xl text-gray-600 font-bold mt-4">₹{price}</p>
          </div>
          
  
          {/* Bottom: Quantity Controls */}
          <div className="flex justify-end items-center space-x-4 mt-4">
            <button
              onClick={decreaseQuantity}
              className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primaryDark font-bold"
            >
              -
            </button>
            <span className="text-gray-800 font-medium">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primaryDark font-bold"
            >
              +
            </button>
          </div>
         
        </div>
      </div>
    );
}
