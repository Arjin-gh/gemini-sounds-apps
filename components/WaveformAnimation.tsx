
import React from 'react';

const WaveformAnimation: React.FC<{ active: boolean, color: string }> = ({ active, color }) => {
  return (
    <div className="flex items-end justify-center space-x-1 h-6 w-12">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1 rounded-full ${color} transition-all duration-300 ${
            active ? 'animate-bounce' : 'h-1'
          }`}
          style={{
            height: active ? `${20 + Math.random() * 80}%` : '4px',
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s'
          }}
        ></div>
      ))}
    </div>
  );
};

export default WaveformAnimation;
