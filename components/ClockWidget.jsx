'use client';

import React, { useEffect, useState } from 'react';

const FlipClock = () => {
  const [time, setTime] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTime({ hours, minutes, seconds });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center mx-4">
      <TimeUnit value={time.seconds} />
      <span className="text-2xl font-bold  select-none px-1">:</span>
      <TimeUnit value={time.minutes} />
      <span className="text-2xl font-bold  select-none px-1">:</span>
      <TimeUnit value={time.hours} />
    </div>
  );
};

const TimeUnit = ({ value }) => {
  return (
    <div className=" text-white select-none w-16 h-full flex justify-center items-center rounded-lg text-2xl font-bold">
      {value}
    </div>
  );
};

export default function Page() {
  return (
    <div className=" hidden 2xl:flex  select-none  flex-col items-center justify-center h-full">
      <FlipClock />
    </div>
  );
}
