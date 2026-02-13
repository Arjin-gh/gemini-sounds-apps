
import React from 'react';
import { SoundScene } from '../types';

interface SceneCardProps {
  scene: SoundScene;
  isActive: boolean;
  onClick: () => void;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 min-w-[140px] h-32 md:h-40 ${
        isActive 
          ? 'scale-105 shadow-xl ring-2 ring-white/50 ring-offset-2 ring-offset-slate-100' 
          : 'opacity-70 hover:opacity-100'
      } ${scene.color} text-white`}
    >
      <span className="text-3xl mb-2 opacity-90">
        {scene.id === 'rainforest' && '🌿'}
        {scene.id === 'ocean' && '🌊'}
        {scene.id === 'guqin' && '🎵'}
        {scene.id === 'market' && '🏮'}
      </span>
      <span className="font-bold text-lg">{scene.name}</span>
      <span className="text-xs font-light opacity-80 mt-1">{scene.nameEn}</span>
      
      {isActive && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-slate-900 rounded-full animate-ping"></div>
        </div>
      )}
    </button>
  );
};

export default SceneCard;
