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
    <div className="flex justify-center items-center mx-1">
      <TimeUnit value={time.seconds} />
      <span className="text-lg font-bold text-white select-none">:</span>
      <TimeUnit value={time.minutes} />
      <span className="text-lg font-bold text-white select-none">:</span>
      <TimeUnit value={time.hours} />
    </div>
  );
};

const TimeUnit = ({ value }) => {
  return (
    <div className=" text-white select-none w-6 h-full flex justify-center items-center rounded-lg text-lg font-bold">
      {value}
    </div>
  );
};

export default function ClockWidget() {
  return (
    <div className=" hidden 2xl:flex  select-none  flex-col items-center justify-center h-full">
      <FlipClock />
    </div>
  );
}
