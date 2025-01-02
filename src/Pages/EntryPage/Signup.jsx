import { createNewUser } from 'FirebaseAuth/Auth.mjs';
import React, { useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { baseUrl } from 'Constants';

export default function Signup() {
  return (
    <div className="bg-yellow-50 h-screen w-screen flex justify-around">
      <div className="flex-col flex-wrap">
        <img
          src="/static/food.png"
          alt="food"
          className="w-3xl mt-12 ms-12 aspect-3/4"
        />
        <h1 className="text-black text-5xl text-center mt-14 font-title text-opacity-90">
          Order at ease <br /> Pick with peace
        </h1>
      </div>

      <div className="flex justify-center items-center">
        <SignupTabs />
      </div>
    </div>
  );
}

function SignupTabs() {
  const [activeTab, setActiveTab] = useState('customer');


  return (
    <div className="pr-11 pt-11 pb-11 pl-5 bg-white rounded-3xl items-center">
      <div className="ml-14 mr-14 mb-10">
        <div className="w-full min-w-80 flex justify-between mb-9 mt-5">
          <button
            className={`${
              activeTab === 'customer'
                ? 'border-b-2 border-yellow-500 text-yellow-500 font-semibold'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('customer')}
          >
            Customer Signup
          </button>

          <button
            className={`${
              activeTab === 'vendor'
                ? 'border-b-2 border-yellow-500 text-yellow-500 font-semibold'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('vendor')}
          >
            Vendor Signup
          </button>
        </div>

        <div className="mt-6">
          {activeTab === 'vendor' ? <VendorSignup /> : <CustomerSignup />}
        </div>
      </div>
    </div>
  );
}

function VendorSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  
  const setCookie = (token) => {
    Cookies.set("userToken", token, { expires: 7 }); // Cookie expires in 7 days
  };

  // Handle form submission for vendor signup
  const handleSignup = async (event) => {
    event.preventDefault();
  
    if (!email || !password || password !== confirmPassword) {
      setError('Please fill in all fields correctly');
      return;
    }
  
    try {
      const response = await createNewUser(email, password);  // Calls createNewUser
      
      if (!response) {
        const data = await response.json();  
        setError(data.message || 'Signup failed');
        return;
      }


      setCookie(JSON.stringify(response));
      navigate('/home');
    } catch (error) {
      setError('Error connecting to the server');
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSignup}>
      <h2 className="text-xl font-bold text-gray-700">Vendor Signup</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block text-sm text-gray-600 pb-1">Name</label>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Enter your name"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 pb-1">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 pb-1">Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 pb-1">Confirm Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="w-full font-semibold bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
      >
        Signup
      </button>
    </form>
  );
}

function CustomerSignup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
    
  const setCookie = (token) => {
    Cookies.set("userToken", token, { expires: 7 });
  };

  const handleSignup = async (event) => {
    event.preventDefault();
  
    if (!email || !password || password !== confirmPassword) {
      setError('Please fill in all fields correctly');
      return;
    }
  
    try {
      const response = await createNewUser(email, password);
      
      if (!response) {  
        setError('Signup failed');
        return;
      }

      await axios.post(`${baseUrl}userdetails`, {
        id: name,
        name: email
      });

       setCookie(JSON.stringify(response));
       navigate('/home');
    } catch (error) {
      setError('Error connecting to the server'+data);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSignup}>
      <h2 className="text-xl font-bold text-gray-700">Customer Signup</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block text-sm text-gray-600 pb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Enter your name"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 pb-1">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 pb-1">Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 pb-1">Confirm Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="w-full font-semibold bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
      >
        Signup
      </button>
    </form>
  );
}
