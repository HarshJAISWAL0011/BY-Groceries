import axios from 'axios';
import AddressCard from 'Components/AddressCard'
import NavBar from 'Components/NavBar'
import { handleAnonymousUser } from 'FirebaseAuth/Auth.mjs';
import Cookies from 'js-cookie';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

const ItemsDetail = createContext({
  cardDetails: [],
  setCardDetails: null
});

export default function Checkout() {
  const [cardDetails, setCardDetails] = useState([]);
  const [itemLoaded, setItemLoaded] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {

    const loadShopDetails = async (cartItemsStored) => {
      try {
        handleAnonymousUser(navigate)
        let obj = []
        for (const shopId in cartItemsStored) {
          let item = {};
          const response = await axios.post(`http://localhost:3000/stores/${shopId}`);
          const productDetailArray = await axios.post(`http://localhost:3000/products/${response.data['product_id']}`);
          let pDetail = []
          for (let it of productDetailArray.data.items) {
            if (cartItemsStored[shopId][it['product_id']])
              pDetail.push({ ...it, quantity: cartItemsStored[shopId][it['product_id']] });
          }
          item['shopDetails'] = response.data;
          item['productDetails'] = pDetail;
          item['id'] = shopId
          obj.push(item)
        }
        setCardDetails(obj);
      } catch (err) {
        console.error("Error fetching stored cart items:", err);
      }
    };

    const loadCartItems = async () => {
      try {
        let user = Cookies.get('userToken');
        if (!user) return;
        let data = JSON.parse(user);

        const response = await axios.post(`http://localhost:3000/user/${data.uid}`);
        loadShopDetails(response.data.cart_items || {})
      } catch (err) {
        console.error("Error fetching stored cart items:", err);
      } finally {
        setItemLoaded(true);
      }
    };
    loadCartItems();
  }, []);

  async function placeOrder(){
    if (selectedAddress == null) {
      setPopupVisible(true); 
      return;
    }
    let user = Cookies.get('userToken');
    if (!user) return;
    let data = JSON.parse(user);

     await axios.post(`http://localhost:3000/placeorder/${data.uid}`,{
      orderdetails: cardDetails
    });
    navigate('/orderhistory/')
  }
  const closePopup = () => setPopupVisible(false);

  if (!itemLoaded) return <> <p>Loading...</p> </>

  return (
    <ItemsDetail.Provider value={{ cardDetails, setCardDetails }}>
      <div className='w-screen h-screen flex flex-col mb-24'>
      <NavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        { searchQuery.length === 0 ?
            <> 
        <div className='max-h-[30%] pb-6'>
        <AddressCard setSelectedAddress={setSelectedAddress} selectedAddress={ selectedAddress} />
        </div>
        <div className='pl-4 pr-4  w-full'>
          <ShowCartItems />
          <div className='flex justify-center items-center mt-8'>
            <button className='bg-green-600 p-3 pl-6 pr-6 rounded-xl text-white font-bold'
            onClick={()=>{placeOrder()}}>Pay</button>
          </div>
        </div>
        </>
        : ""
        }
         {popupVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg font-semibold mb-4">Please select an address to continue.</p>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={closePopup}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </ItemsDetail.Provider>
  );
}

function ShowCartItems() {
  let { cardDetails } = useContext(ItemsDetail)
  const [total , setTotal] = useState(0);
  useEffect(() => {
    const calculatedTotal = cardDetails.reduce((sum, item) => {
      const productTotal = item.productDetails.reduce(
        (productSum, product) => productSum + product.price * product.quantity,
        0
      );
      return sum + productTotal;
    }, 0);

    setTotal(calculatedTotal);
  }, [cardDetails]);

  return (
    <div className='shadow-sm w-full md:w-[80%] mx-auto mt-5'>
      <h2 className='text-black opacity-90 text-2xl font-subheading ps-10 pb-7 pt-5'>Cart Items</h2>
      {
        cardDetails.map((item) => {
          return (
            <div className='flex flex-col md:flex-row justify-center items-start gap-x-3 w-full'>
              <ShopCard {...item['shopDetails']} />
              <div className='flex-col mb-8 w-full'>
                {
                  item['productDetails'].map((it) => {
                  
                    return <ProductItem {...{ ...it, vendorId: item['id'] }} />;
                  })
                }
              </div>
            </div>
          )
        })
      }
      <div className="flex justify-end mr-10 py-4">
        <h1 className="text-2xl font-semibold">Total: ₹{total}</h1>
      </div>
    </div>
  );
}

function ProductItem({ img_url, item_name, price, unit, description, product_id, vendorId, quantity }) {
  const { cardDetails, setCardDetails } = useContext(ItemsDetail);

  const increaseQuantity = () => {
    const token = Cookies.get("userToken");
          let obj = JSON.parse(token);
          if(!token) return

    const updatedCardDetails = cardDetails.map((doc) => {
      if (doc.id !== vendorId) return doc;
      const updatedProductDetails = doc.productDetails.map((item) => {
        if (item.product_id === product_id) {
          console.log(item.product_id, product_id)
          axios.post(`http://localhost:3000/addtocart`,{
            customerId:obj.uid, product_id, quantity:(quantity+1), vendorId
          });
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      return { ...doc, productDetails: updatedProductDetails };
    });

    setCardDetails(updatedCardDetails);
  }

  const decreaseQuantity = () => {
    const token = Cookies.get("userToken");
    let obj = JSON.parse(token);
    if(!token) return

    if (quantity - 1 === 0) {
      const updatedCardDetails = cardDetails.map((doc) => {
        if (doc.id !== vendorId) return doc;
        const updatedProductDetails = doc.productDetails.filter((it) =>
          it.product_id !== product_id
        );
        axios.post(`http://localhost:3000/addtocart`,{
          customerId:obj.uid, product_id, quantity:0, vendorId
        });

        return {
          ...doc,
          productDetails: updatedProductDetails,
        };
      }).filter((doc) => doc.productDetails.length > 0);
      setCardDetails(updatedCardDetails);
    } else {
      const updatedCardDetails = cardDetails.map((doc) => {
        if (doc.id !== vendorId) return doc;
        const updatedProductDetails = doc.productDetails.map((item) => {
          if (item.product_id === product_id) {
            axios.post(`http://localhost:3000/addtocart`,{
              customerId:obj.uid, product_id, quantity:(quantity-1), vendorId
            });
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        });
        return { ...doc, productDetails: updatedProductDetails };
      });

      setCardDetails(updatedCardDetails);
    }
  };

 
    return (
      <div className="flex items-center w-full bg-white rounded-xl p-4 mb-2 shadow-lg">
        <img
          src={img_url}
          alt="Product"
          className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-lg"
        />
        <div className="flex flex-col sm:flex-row justify-between w-full pl-4">
          <div className="flex flex-col flex-grow">
            <h2 className="text-lg font-semibold text-gray-800 overflow-x-hidden">{item_name}</h2>
            <p className="text-sm text-gray-600 overflow-ellipsis overflow-hidden sm:whitespace-normal">
              {description}
            </p>
          </div>
          <div className="flex flex-col items-end mt-2 md:mt-4 space-y-2 sm:w-[30%]">
            <h2 className="text-black mr-7 mb-7 text-xl font-subheading min-w-11">
              ₹{price * quantity}
            </h2>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={decreaseQuantity}
                className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primaryDark font-bold"
              >
                -
              </button>
              <span className="text-gray-800 font-medium">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primaryDark font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>    
  );
}

function ShopCard({ id, name, address1, address2, open, close, rating, shop_img }) {
  let navigate = useNavigate();
  
  return (
    <div className="bg-white shadow-lg rounded-xl flex p-6 justify-start h-full w-full md:w-[45%] mb-4 overflow-hidden">
      <img
        src={shop_img}
        alt="Shop"
        className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-lg"
      />
      <div className="p-4 w-full flex flex-col justify-between" onClick={() => { navigate(`/shop/${id}`) }}>
        <div>
          {/* Truncate the shop name to 2 lines */}
          <h2 className="text-xl font-semibold text-gray-800  overflow-ellipsis line-clamp-2">
            {name}
          </h2>
          {/* Truncate address1 and address2 to 2 lines */}
          <p className="text-sm text-gray-600 mt-1 overflow-ellipsis line-clamp-2">
            {address1}
          </p>
          <p className="text-sm text-gray-600 overflow-hidden overflow-ellipsis line-clamp-2">
            {address2}
          </p>
        </div>
      </div>
    </div>
  );
}
