'use client';

import { useEffect, useState } from 'react';

export function LiveClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    function tick() {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setTime(`${hh}:${mm}:${ss}`);
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-3 font-mono text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent" style={{
      fontFamily: '"Courier New", monospace',
      textShadow: '0 0 20px rgba(34, 211, 238, 0.2), 0 0 10px rgba(34, 211, 238, 0.1)'
    }}>
      <span className="text-cyan-400/60 text-xs uppercase tracking-wider font-semibold">UTC</span>
      <span className="font-bold" style={{
        letterSpacing: '0.05em'
      }}>
        {time || '--:--:--'}
      </span>
    </div>
  );
}
