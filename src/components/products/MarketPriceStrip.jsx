import React from 'react';
import { TrendingUp, TrendingDown, Minus, Tag } from 'lucide-react';
import { TODAYS_MARKET_PRICES } from '../../data/productsData';
import './MarketPriceStrip.css';

export function MarketPriceStrip() {
  return (
    <div className="market-price-strip" aria-label="Today's Produce Prices Reference">
      <div className="price-strip-header">
        <Tag size={15} color="#1B381E" />
        <span className="price-strip-title">Today’s Produce Spot Prices:</span>
      </div>

      <div className="price-strip-items">
        {TODAYS_MARKET_PRICES.map((item, idx) => (
          <div key={idx} className="price-item">
            <span className="price-item-crop">{item.crop}</span>
            <span className="price-item-value">₹{item.price} <span className="price-item-unit">/{item.unit}</span></span>
            <span className={`price-item-trend trend-${item.trend}`}>
              {item.trend === 'up' && <TrendingUp size={12} />}
              {item.trend === 'down' && <TrendingDown size={12} />}
              {item.trend === 'neutral' && <Minus size={12} />}
              <span>{item.change}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MarketPriceStrip;
