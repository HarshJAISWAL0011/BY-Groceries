import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Login from './Pages/EntryPage/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Catalog from 'Pages/HomePage/Catalog';
import Product from 'Pages/HomePage/Product';
import Checkout from 'Pages/HomePage/Checkout';
import Signup from 'Pages/EntryPage/Signup';
import SearchResultsPage from 'Pages/Search/SearchResultsPage';
import OrderHistory from 'Pages/Orders/OrderHistory';

const root = ReactDOM.createRoot(document.getElementById('root'));
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Catalog />} />
        <Route path="/shop/:id" element={<Product />} />
        <Route path="/cart" element={<Checkout />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
      </Routes>
 
  </BrowserRouter>
);

reportWebVitals();
