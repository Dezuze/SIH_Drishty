import React from 'react';
import { Award } from 'lucide-react';

export function GiTag({ label, code, className = '' }) {
  if (!label) return null;

  return (
    <span 
      className={`gi-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: '#F0B400',
        border: '1px solid #F0A800',
        color: '#05220B',
        padding: '3px 8px',
        borderRadius: '5px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '0.6875rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        lineHeight: 1.2,
        boxShadow: '0 1px 3px rgba(240, 168, 0, 0.25)'
      }}
      title={code ? `Geographical Indication Protected (${code})` : 'Geographical Indication Protected'}
    >
      <Award size={13} color="#05220B" strokeWidth={2.5} />
      <span>{label}</span>
    </span>
  );
}

export default GiTag;
