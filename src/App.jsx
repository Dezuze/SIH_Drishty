import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Vendors from './pages/Vendors';
import Products from './pages/Products';

function App() {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = (_item, qty = 1) => {
    setCartCount(prev => prev + (typeof qty === 'number' && qty > 0 ? qty : 1));
  };

  return (
    <BrowserRouter>
      <Header cartCount={cartCount} />
      <Routes>
        <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
        <Route path="/products" element={<Products onAddToCart={handleAddToCart} />} />
        <Route path="/produce-market" element={<Products onAddToCart={handleAddToCart} />} />
        <Route path="/search" element={<SearchResults onAddToCart={handleAddToCart} />} />
        <Route path="/vendors" element={<Vendors onAddToCart={handleAddToCart} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
