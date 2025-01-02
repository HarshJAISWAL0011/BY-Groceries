import React, { useEffect, useState } from 'react'
import CartButton from './CartButton';
import { useNavigate } from 'react-router-dom';
import SearchResultsPage from 'Pages/Search/SearchResultsPage';
import axios from 'axios';
import Cookies from 'js-cookie';
import { baseUrl } from 'Constants';

export default function NavBar({searchQuery, setSearchQuery}) {
  let navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false); 
  const [name, setName] = useState(''); 
  
  useEffect(() => {
    const loadShopDetails = async (cartItemsStored) => {
      try {
        let user = Cookies.get('userToken');
        if (!user) return;
        let data = JSON.parse(user);
        const response = await axios.post(`${baseUrl}user/${data.uid}`);
         setName(response.data.name);
       
      } catch (err) {
        console.error("Error fetching stored cart items:", err);
      }
    };

    const loadDetails = async () => {
      try {
        let user = Cookies.get('userToken');
        if (!user) return;
        let data = JSON.parse(user);

        const response = await axios.post(`${baseUrl}user/${data.uid}`);
        loadShopDetails(response.data.cart_items || {})
      } catch (err) {
        console.error("Error fetching stored cart items:", err);
      }
    };
    loadDetails();
  }, []);

  const handleUserClick = () => {
    setDropdownVisible(prev => !prev);
  };

  const handleLogout = () => {
    setDropdownVisible(false);
    Cookies.remove('userToken');
    navigate('/')  
  };

  const handleHistory = () => {
    setDropdownVisible(false); 
    navigate('/orderhistory') 
  };

  return (
    <div className='flex-col'>
    <div className='flex ps-8 pe-8 space-x-6 pt-3' >
        <img src="/static/logo.jpg" alt="logo" className='h-12 w-40 aspect-auto mt-1' onClick={()=>{navigate("/home")}}/>
        
        <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <div className={`relative min-w-[5%]}`}>
          <img
            src="/static/user.png"
            alt="user"
            className='h-9 w-11 rounded-full mt-1 cursor-pointer hover:opacity-85 mx-auto aspect-square'
            onClick={handleUserClick}
          />

          {dropdownVisible && (
            <div className='absolute right-0 mt-2 p-3 bg-white shadow-lg rounded-lg px-5 py-3'>
              <div className='py-2'>
                <span className='block font-bold whitespace-nowrap'>Hi, {name}</span>
              </div>
              <div className='py-2 hover:bg-gray-50'>
                <span className='block whitespace-nowrap cursor-pointer' onClick={handleHistory}>History</span>
              </div>
              <button
                onClick={handleLogout}
                className='text-red-500 mt-2 w-full text-left hover:bg-gray-50'
              >
                Logout
              </button>
            </div>
          )}
        </div>
     
        <div>
        <CartButton/>
        </div>
       
    </div>
    <div className='bg-gray-50 w-full h-1'></div>
    <div className={`${searchQuery.length > 0 ? 'h-full' : 'hidden'} mt-4`}>
          <SearchResultsPage searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
        </div>
</div>
  )
}


function Search({searchQuery,setSearchQuery}) {
     const [items] = useState([
    ]);
  
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };
  
    const filteredItems = items.filter(item =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    return (
      <div className="w-full">
        
  
        {/* Search Box */}
        <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="border p-3 rounded-xl w-full mb-4"
        />

  
        {/* Display filtered items */}
        <ul>
          {filteredItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };
  

