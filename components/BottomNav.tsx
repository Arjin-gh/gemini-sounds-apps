
import React from 'react';
import { AppTab } from '../types';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: AppTab.DISCOVERY, label: '发现', icon: '✨' },
    { id: AppTab.FAVORITES, label: '收藏', icon: '💖' },
    { id: AppTab.PROFILE, label: '我的', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 px-6 py-3 flex justify-around items-center z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
            activeTab === tab.id ? 'scale-110 text-slate-900' : 'text-slate-400 grayscale opacity-70'
          }`}
        >
          <span className="text-2xl">{tab.icon}</span>
          <span className={`text-[10px] font-bold uppercase tracking-tighter ${activeTab === tab.id ? 'opacity-100' : 'opacity-60'}`}>
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
