import React from 'react';
import { Clock as ClockIcon } from 'lucide-react';

export const Clock = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <time className="text-2xl font-bold text-indigo-600 dark:text-cyan-300">
        {time.toLocaleTimeString()}
      </time>
      <div className="text-sm text-indigo-500/60 dark:text-cyan-400/60">
        {time.toLocaleDateString()}
      </div>
    </div>
  );
};