import React, { useState, useMemo } from 'react';
import CategoryNavigation from '../components/CategoryNavigation';
import ProductGrid from '../components/ProductGrid';
import SeasonalChart from '../components/SeasonalChart';
import { products } from '../data/products';
import './Home.css';

function Home({ onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState("For You");

  const displayedProducts = useMemo(() => {
    if (activeCategory === "For You") {
      // Return a mixed collection
      return products.slice(0, 8);
    }
    if (activeCategory === "Vegetables") {
      return products.filter(p => p.category === "Vegetables");
    }
    if (activeCategory === "Fruits") {
      return products.filter(p => p.category === "Fruits");
    }
    if (activeCategory === "Grains") {
      return products.filter(p => p.category === "Grains");
    }
    if (activeCategory === "Spices") {
      return products.filter(p => p.category === "Spices");
    }
    if (activeCategory === "Organic Products") {
      return products.filter(p => p.organic);
    }
    if (activeCategory === "Dairy Products") {
      return products.filter(p => p.category === "Dairy Products");
    }
    if (activeCategory === "Kerala Specials") {
      return products.filter(p => p.isKeralaSpecial);
    }
    return products;
  }, [activeCategory]);

  return (
    <div className="home-page">
      <CategoryNavigation 
        activeCategory={activeCategory} 
        onSelectCategory={setActiveCategory} 
      />
      
      <main className="container">
        <>
          <h1 className="section-title">{activeCategory}</h1>
          {activeCategory === "For You" && (
            <div style={{ marginBottom: '3rem' }}>
              <SeasonalChart />
            </div>
          )}
          <ProductGrid products={displayedProducts} onAddToCart={onAddToCart} />
        </>
      </main>
    </div>
  );
}

export default Home;
