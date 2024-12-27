import React, { useState } from 'react'
import CartButton from './CartButton';
import { useNavigate } from 'react-router-dom';
import SearchResultsPage from 'Pages/Search/SearchResultsPage';

export default function NavBar({searchQuery, setSearchQuery}) {
  let navigate = useNavigate();
  // const [searchQuery, setSearchQuery] = useState('');
  return (
    <div className='flex-col'>
    <div className='flex ps-8 pe-8 space-x-6 pt-3' >
        <img src="/static/logo.jpg" alt="logo" className='h-12 aspect-auto mt-1' onClick={()=>{navigate("/home")}}/>
        
        <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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
  

