import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import axios from "axios";
import Cookies from "js-cookie";
import { baseUrl } from "Constants";

export default function AddressCard({ selectedAddress ,setSelectedAddress}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
 
  const [addresses, setAddresses] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    addressLine1: "",
    addressLine2: "",
    phone: "",
  });

  useEffect(()=>{
    const getAddress = async function(){
      let user = Cookies.get('userToken');
      if(!user) return;
      let data = JSON.parse(user);
       const response = await axios.get(`${baseUrl}address/${data.uid}`);
        let val = response.data.addresses || [];
        setAddresses(val);
    }
    getAddress();
  },[])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    setAddresses([...addresses, formData]);
    setFormData({ name: "", age: "", addressLine1: "", addressLine2: "", phone: "" });
    setIsPopupOpen(false);
     let user = Cookies.get('userToken');
     if(!user) return;
     let data = JSON.parse(user);
    axios.post(`${baseUrl}address`,{
      addresses: [...addresses,formData],
      id: data.uid
    });
  };

  return (
    <div className="w-screen h-screen flex flex-col ">
 
      {/* Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-96 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Add Address</h2>
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="text"
                name="addressLine1"
                placeholder="Address Line 1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="text"
                name="addressLine2"
                placeholder="Address Line 2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone No."
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                onClick={() => setIsPopupOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address List */}
       
      <div className="w-screen flex overflow-x-auto mt-6 space-x-4 px-4 pb-6">
        {
        addresses.map((address, index) => (
           <div
            key={index}
            className= {`min-w-[250px]
                ${selectedAddress  === index? " border-s-orange-400 border-4": ""} 
                shadow-md rounded-lg p-4 bg-white`} onClick={()=>{
                    setSelectedAddress(index)
             }}
          >
            <h3 className="font-semibold text-lg">{address.name}</h3>
            <p className="text-sm text-gray-600">Age: {address.age}</p>
            <p className="text-sm text-gray-600">{address.addressLine1}</p>
            <p className="text-sm text-gray-600">{address.addressLine2}</p>
            <p className="text-sm text-gray-600">Phone: {address.phone}</p>
          </div>
        ))
        }

         <div className="w-80 h-40 bg-white shadow-md rounded-lg flex items-center justify-center">
        <button
          className="text-blue-500 font-semibold text-lg"
          onClick={() => setIsPopupOpen(true)}
        >
          Add Address
        </button>
      </div>

      </div>
    </div>
  );
}
