'use client';

import { useEffect, useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';
import type { Flight } from '@/types';

interface FlightRowProps {
  flight: Flight;
  index: number;
}

export function FlightRow({ flight, index }: FlightRowProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevStatus, setPrevStatus] = useState(flight.status);

  if (prevStatus !== flight.status) {
    setPrevStatus(flight.status);
    setIsAnimating(true);
  }

  useEffect(() => {
    if (!isAnimating) return;
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [isAnimating]);

  const isCancelled = flight.status === 'Cancelled';
  const isDeparted = flight.status === 'Departed';

  return (
    <div
      className={cn(
        'grid grid-cols-[120px_160px_1fr_80px_60px_60px_140px] items-center gap-2 px-8 py-3 text-sm border-b transition-all duration-300 backdrop-blur',
        index % 2 === 0 ? 'bg-gradient-to-r from-slate-800/20 to-transparent hover:from-slate-800/40 border-cyan-500/10 hover:border-cyan-500/30' : 'bg-gradient-to-r from-slate-700/10 to-transparent hover:from-slate-700/30 border-cyan-500/10 hover:border-cyan-500/30',
        isCancelled && 'opacity-60',
        isDeparted && 'opacity-70'
      )}
      style={{
        animation: `slideIn 0.5s ease-out ${index * 0.05}s both`,
      }}
    >
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes flipX {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          40% { transform: rotateX(180deg) rotateY(45deg); }
          100% { transform: rotateX(0deg) rotateY(0deg); }
        }
        .flip-animating {
          animation: flipX 0.7s cubic-bezier(0.6, 0.04, 0.98, 0.34) !important;
        }
      `}</style>

      <span className="font-bold text-cyan-300 tracking-wider font-mono text-lg transition-all duration-200" style={{
        fontFamily: '"Courier New", monospace',
        textShadow: '0 0 10px rgba(34, 211, 238, 0.3)'
      }}>
        {flight.flightNumber}
      </span>
      
      <span className="text-cyan-200/70 truncate text-xs uppercase tracking-wider" style={{
        fontFamily: '"Courier New", monospace'
      }}>
        {flight.airline}
      </span>
      
      <span
        className={cn(
          'truncate tracking-wide',
          isCancelled ? 'line-through text-cyan-400/40' : 'text-cyan-100'
        )}
        style={{
          fontFamily: '"Courier New", monospace'
        }}
      >
        {flight.destination}
      </span>
      
      <span className="text-center text-cyan-300 font-mono font-bold text-lg transition-all duration-200" style={{
        textShadow: '0 0 8px rgba(34, 211, 238, 0.4)'
      }}>
        {flight.departureTime}
      </span>
      
      <span className="text-center text-cyan-200/60 text-xs font-mono uppercase">
        {flight.terminal}
      </span>
      
      <span className="text-center text-cyan-200/60 text-sm font-mono font-bold">
        {flight.gate}
      </span>

      <div className={cn('flex items-center gap-2', isAnimating && 'flip-animating')}>
        <StatusBadge status={flight.status} />
        {flight.status === 'Delayed' && flight.delayMinutes && (
          <span className="text-orange-400 text-xs font-mono font-bold">+{flight.delayMinutes}m</span>
        )}
      </div>
    </div>
  );
}
