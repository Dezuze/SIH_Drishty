import React from 'react';
import { Minus, Plus } from 'lucide-react';
import './QuantityControl.css';

export function QuantityControl({
  value,
  min = 1,
  max = 9999,
  unit = 'kg',
  onChange,
  compact = false
}) {
  const handleDecrease = (e) => {
    e.stopPropagation();
    if (value > min) {
      onChange(Math.max(min, value - 1));
    }
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    if (value < max) {
      onChange(Math.min(max, value + 1));
    }
  };

  return (
    <div className={`quantity-control ${compact ? 'quantity-control-compact' : ''}`}>
      <button
        type="button"
        className="qty-btn qty-btn-minus"
        onClick={handleDecrease}
        disabled={value <= min}
        aria-label="Decrease quantity"
        title={`Minimum order is ${min} ${unit}`}
      >
        <Minus size={compact ? 12 : 14} />
      </button>

      <span className="qty-display">
        <strong>{value}</strong> <span className="qty-unit">{unit}</span>
      </span>

      <button
        type="button"
        className="qty-btn qty-btn-plus"
        onClick={handleIncrease}
        disabled={value >= max}
        aria-label="Increase quantity"
        title={`Maximum available is ${max} ${unit}`}
      >
        <Plus size={compact ? 12 : 14} />
      </button>
    </div>
  );
}

export default QuantityControl;
