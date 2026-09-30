'use client';

import React, { useState, useEffect } from 'react';

export function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return (
      <div className="hidden md:flex flex-col items-end font-mono text-xs text-slate-500">
        <span className="text-[#00f0ff] font-bold">00:00:00</span>
        <span className="text-[10px] text-slate-500">UTC</span>
      </div>
    );
  }

  const timeString = time.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
  });

  const dateString = `${time.toISOString().slice(0, 10)} UTC`;

  return (
    <div className="hidden md:flex flex-col items-end font-mono text-xs leading-tight">
      <span className="text-[#00f0ff] font-bold tracking-widest text-sm drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
        {timeString}
      </span>
      <span className="text-[10px] text-slate-400 tracking-wider font-semibold">
        {dateString}
      </span>
    </div>
  );
}
