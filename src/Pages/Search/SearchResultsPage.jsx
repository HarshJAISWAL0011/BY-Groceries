import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from 'Components/NavBar';
import { useNavigate } from 'react-router-dom';

export default function SearchResultsPage({searchQuery, setSearchQuery}) {

  const [searchResults, setSearchResults] = useState({ shops: [], products: [] });
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Debouncing the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results when debouncedQuery changes
  useEffect(() => {
    if (!debouncedQuery) {
      setSearchResults({ shops: [], products: [] });
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/search', { 
          params: { query: debouncedQuery },
        });
        console.log(response.data);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery]);

  return (
    <div className="w-screen h-screen flex flex-col">
    
      <div className="p-4 flex flex-col gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div>
              <h2 className="text-xl font-bold">Shops</h2>
              {searchResults.shops.length > 0 ? (
                searchResults.shops.map((shop) => (
                  <div
                    key={shop.id}
                    className="p-4 border border-gray-300 rounded-md mb-2 cursor-pointer"
                    onClick={() => navigate(`/shop/${shop.id}`)}
                  >
                    <h3 className="text-lg font-semibold">{shop.name}</h3>
                    <p className="text-sm text-gray-600">{shop.address1}</p>
                    <p className="text-sm text-gray-600">{shop.address2}</p>
                  </div>
                ))
              ) : (
                <p>No shops found.</p>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">Products</h2>
              {searchResults.products.length > 0 ? (
                searchResults.products.map((product, index) => (
                  <div key={index}>
                    {product.items.map((item) => (
                      <div
                        key={item.item_name}
                        className="p-4 border border-gray-300 rounded-md mb-2 flex items-start gap-4"
                      >
                        <img
                          src={item.img_url}
                          alt={item.item_name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                          <h3 className="text-lg font-semibold">{item.item_name}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <p className="text-sm font-medium text-gray-800">
                            ₹{item.price} - Shop: {product.shopName}
                          </p>
                          <button
                            className="text-blue-500 underline mt-2"
                            onClick={() => navigate(`/shop/${product.shopId}`)}
                          >
                            Visit Shop
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p>No products found.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
