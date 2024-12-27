import axios from 'axios';
import CartButton from 'Components/CartButton';
import DetailedShopCard from 'Components/DetailedShopCard';
import NavBar from 'Components/NavBar';
import ProductItem from 'Components/ProductItem';
import Cookies from 'js-cookie';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const IdContext = createContext({id:"",vendorId:"",pre_added_cart_items:new Map()});

export default function Product() {
  const { id } = useParams();
  const [product_id,setProduct_id] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [pre_added_cart_items,setpre_added_cart_items] = useState(new Map());
  const [shopDetail, setShopDetail] = useState({
    name: "",
    address1: "",
    address2: "",
    open: "",
    close: "",
    rating: 0,
    shop_img: "",
  });
  const [isShopDetailLoaded, setShopDetailLoaded] = useState(false);
  const [isCartItemLoaded, setCartItemLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {

        const response = await axios.post(`http://localhost:3000/stores/${id}`);
        setShopDetail(response.data);
        setProduct_id(response.data.product_id);
      } catch (err) {
        console.error("Error fetching shop details:", err);
        setError("Failed to fetch shop details");
      } finally {
        setShopDetailLoaded(true);
      }
    };

    fetchShopDetails();
  }, [id]);

  useEffect(() => {
    const fetchStoredCartItems = async () => {
      try {
        let user = Cookies.get('userToken');
        if(!user) return;
        let data = JSON.parse(user);
        console.log("data",data);
        
        const response = await axios.post(`http://localhost:3000/user/${data.uid}`);
        setpre_added_cart_items(response.data.cart_items[id] || new Map());
      } catch (err) {
        console.error("Error fetching stored cart items:", err);
      }finally { setCartItemLoaded(true) }
    };

    fetchStoredCartItems();
  }, [id]);

  if (!isShopDetailLoaded || !isCartItemLoaded) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <IdContext.Provider value={{id:product_id,vendorId:id,pre_added_cart_items}}>
      <div className="bg-white flex w-screen h-screen flex-col">
        <NavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        {
          searchQuery.length === 0?
        <>
        <div className="mx-auto w-[70%] pl-16 pr-16 pt-6">
          <DetailedShopCard {...shopDetail} />
          <div className='p-6 shadow-xl mb-11 rounded-xl bg-white mt-11'>
          <h2 className="text-black opacity-90 text-2xl font-subheading my-11">Available Products</h2>
          <DisplayProduct />
          </div>
        </div>
        </>
        : ""
        }
      </div>
    </IdContext.Provider>
  );
}

function DisplayProduct() {
  const obj =  useContext(IdContext);
  const {id,vendorId,pre_added_cart_items} =obj
  const [items, setItems] = useState([
    {
      img_url: "",
      item_name: "",
      price: "",
      unit: "",
      description: "",
      product_id: "",
      initialQuantity: 0,
  
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if(id === "") return
        const response = await axios.post(`http://localhost:3000/products/${id}`);
        setItems(response.data.items);
        console.log(response.data.items);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-white shadow-sm w-full mt-11">
    
      {items.map((item, index) => (
        <div key={index}>
       <ProductItem {...{ ...item, vendorId, initialQuantity:(pre_added_cart_items[(item.product_id)] ||0) }} />
          <div className="bg-gray-50 w-full h-1"></div>
        </div>
      ))}
    </div>
  );
}
