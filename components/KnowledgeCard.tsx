
import React from 'react';
import { Fact, SoundScene, SceneStatus } from '../types';
import WaveformAnimation from './WaveformAnimation';

interface KnowledgeCardProps {
  scene: SoundScene;
  status: SceneStatus;
  imageUrl?: string;
  facts?: Fact[];
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
  isPlaying?: boolean;
  onTogglePlay?: (id: string) => void;
}

const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ 
  scene, 
  status, 
  imageUrl, 
  facts, 
  isFavorited, 
  onToggleFavorite,
  isPlaying,
  onTogglePlay
}) => {
  if (status === SceneStatus.LOADING) {
    return (
      <div className="w-full max-w-lg glass rounded-3xl p-8 flex flex-col items-center justify-center space-y-4 min-h-[500px] animate-pulse">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">正在唤醒{scene.name}的记忆...</p>
      </div>
    );
  }

  if (status === SceneStatus.ERROR) {
    return (
      <div className="w-full max-w-lg glass rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[500px]">
        <div className="text-5xl">⚠️</div>
        <h3 className="text-xl font-bold">连接时空隧道失败</h3>
        <p className="text-slate-500">无法加载此场景的知识，请稍后再试。</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg glass rounded-3xl overflow-hidden shadow-2xl animate-fade-in mb-24 relative">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={scene.name} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full ${scene.color} opacity-20 flex items-center justify-center`}>
            <span className="text-4xl">🎨</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Play/Pause Overlay Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button 
            onClick={() => onTogglePlay?.(scene.id)}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-3xl hover:bg-white/40 transition-all active:scale-95 border border-white/30"
          >
            {isPlaying ? '⏸' : '▶️'}
          </button>
        </div>

        <div className="absolute bottom-4 left-6 text-white pr-16 pointer-events-none">
          <div className="flex items-center space-x-3 mb-1">
            <h2 className="text-3xl font-bold font-chinese tracking-wide">{scene.name}</h2>
            {isPlaying && <WaveformAnimation active={true} color="bg-white" />}
          </div>
          <p className="text-sm font-light opacity-90">{scene.description}</p>
        </div>
        
        {/* Favorite Button */}
        <button 
          onClick={() => onToggleFavorite?.(scene.id)}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 z-10 ${
            isFavorited ? 'bg-white text-rose-500' : 'bg-black/20 text-white backdrop-blur-md'
          }`}
        >
          {isFavorited ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Facts Section */}
      <div className="p-6 md:p-8 space-y-6">
        <h4 className={`text-sm font-bold uppercase tracking-widest ${scene.accent}`}>
          趣味见闻 · Fun Facts
        </h4>
        <div className="space-y-6">
          {facts?.map((item, idx) => (
            <div key={idx} className="flex items-start group">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl mr-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="flex-grow">
                <h5 className="font-bold text-slate-800 text-sm md:text-base mb-1">{item.title}</h5>
                <p className="text-slate-600 text-sm leading-relaxed">{item.fact}</p>
              </div>
            </div>
          ))}
          {!facts && <p className="text-slate-400 text-center italic">暂无资料</p>}
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-8 py-4 bg-slate-100/50 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {isPlaying ? (
             <span className="text-[10px] text-emerald-600 font-bold animate-pulse">正在播放环境音...</span>
          ) : (
             <span className="text-[10px] text-slate-400">点击播放按钮聆听场景</span>
          )}
        </div>
        <button className={`text-xs font-bold ${scene.accent} hover:underline`}>
          分享此刻的静谧
        </button>
      </div>
    </div>
  );
};

export default KnowledgeCard;
