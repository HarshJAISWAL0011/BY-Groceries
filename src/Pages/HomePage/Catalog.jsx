import axios from 'axios';
import CartButton from 'Components/CartButton';
import NavBar from 'Components/NavBar';
import ShopCard from 'Components/ShopCard';
import React, { useEffect, useState } from 'react'

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <div className='w-screen h-screen flex-col'>
      {
    searchQuery.length === 0?       
    <>
    <NavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
   
    <img src="/static/banner.png" alt="banner" className='w-[85%] mx-auto h-52 mt-6 rounded-xl' />
    <div className='w-[85%] mx-auto mt-6 '>
    <ShowItems/>
    </div>
    </>
    :
    <NavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    }
    </div>
  )
}


function ShowItems() {
  const [items, setItems] = useState([]); // State to store fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.post("http://localhost:3000/stores"); 
        console.log(response.data)
        setItems(response.data);  
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data "+err);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 ">
        {items.map((item, index) => (
          <ShopCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
}

 

