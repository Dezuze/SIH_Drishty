import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function VerificationBadge({ type = 'Farmer', size = 'normal', className = '' }) {
  const isCompact = size === 'compact';

  return (
    <div 
      className={`verification-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        backgroundColor: 'rgba(163, 213, 93, 0.22)',
        color: '#1B381E',
        border: '1px solid rgba(163, 213, 93, 0.55)',
        padding: isCompact ? '3px 8px' : '4px 10px',
        borderRadius: '6px',
        fontSize: isCompact ? '0.7rem' : '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        lineHeight: 1,
        boxShadow: '0 1px 2px rgba(27, 56, 30, 0.04)'
      }}
      title="Verified Kerala Agricultural Producer"
    >
      <ShieldCheck size={isCompact ? 13 : 15} color="#1B381E" strokeWidth={2.4} />
      <span>VERIFIED {type.toUpperCase()}</span>
    </div>
  );
}

export default VerificationBadge;
