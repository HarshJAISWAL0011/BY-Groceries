import axios from 'axios';
import NavBar from 'Components/NavBar';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { handleAnonymousUser } from 'FirebaseAuth/Auth.mjs';
import { useNavigate } from 'react-router-dom';

export default function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  let navigate = useNavigate();

  useEffect(() => {

    const fetchOrderHistory = async () => {
      try {
        handleAnonymousUser(navigate)
        const userToken = Cookies.get('userToken');
        if (!userToken) return;

        const userData = JSON.parse(userToken);
        console.log('Fetching order history for user:', userData);

        const response = await axios.post(`http://localhost:3000/orders/${userData.uid}`);
        const fetchedData = response.data || [];
        const formattedData = fetchedData.map((group) => ({
          date: group.time._seconds * 1000,
          orders: group.data,
        }));

        console.log('Formatted Order History:', formattedData);
        setOrderHistory(formattedData);
      } catch (err) {
        console.error("Error fetching order history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) return <div className='flex justify-center items-center h-screen'>Loading...</div>;

  return (
    <div className='w-screen h-screen flex flex-col  '>
      <NavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {searchQuery.length == 0?
      <div className='p-4 items-center justify-center flex-col flex'>
        <h1 className='text-2xl font-bold mb-4'>Order History</h1>
        <div className='space-y-6  md:w-[75%]'>
          {orderHistory.length > 0 ? (
            orderHistory.map((orderGroup) => (
              <OrderGroup key={orderGroup.date} {...orderGroup} />
            ))
          ) : (
            <p className='text-gray-600'>No orders found.</p>
          )}
        </div>
      </div>
      :""
        }
    </div>
  );
}

function OrderGroup({ date, orders }) {
  return (
    <div className='bg-gray-100 rounded-lg p-4 shadow'>
      <h2 className='text-lg font-semibold mb-4'>Date: {new Date(date).toLocaleDateString()}</h2>
      <div className='space-y-4'>
        {orders.map((order) => (
          <OrderItem key={order.product_id} {...order} />
        ))}
      </div>
    </div>
  );
}

function OrderItem({ img_url, item_name, price, quantity, description,total,shopId }) {
  let navigate = useNavigate();
  const goToShop=()=> {
    navigate(`/shop/${shopId}`);

  }
  return (
    <div className='flex items-center bg-white rounded-lg p-4 shadow-sm'>
      <img
        src={img_url}
        alt={item_name}
        className='w-20 h-20 object-cover rounded-lg mr-4'
      />
      <div className='flex flex-col flex-grow'>
        <h3 className='text-base font-semibold cursor-pointer' onClick={goToShop}>{item_name}</h3>
        <p className='text-sm text-gray-600'>{description}</p>
        <div className='mt-2'>
          <span className='font-medium'>Quantity:</span> {quantity}
        </div>
      </div>
      <div className='text-right'>
        <p className='text-lg font-bold md:mr-5'>₹{total}</p>
      </div>
    </div>
  );
}
