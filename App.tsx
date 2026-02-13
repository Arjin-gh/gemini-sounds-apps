
import React, { useState, useEffect, useCallback } from 'react';
import { SCENES } from './constants';
import { SoundScene, SceneStatus, CardData, AppTab } from './types';
import { GeminiService } from './services/geminiService';
import { AudioService } from './services/audioService';
import SceneCard from './components/SceneCard';
import KnowledgeCard from './components/KnowledgeCard';
import BottomNav from './components/BottomNav';
// Fix: Added missing import for WaveformAnimation
import WaveformAnimation from './components/WaveformAnimation';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DISCOVERY);
  const [activeScene, setActiveScene] = useState<SoundScene>(SCENES[0]);
  const [status, setStatus] = useState<SceneStatus>(SceneStatus.IDLE);
  const [playingSceneId, setPlayingSceneId] = useState<string | null>(null);
  const [cache, setCache] = useState<Record<string, CardData>>({});
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('soundscape_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('soundscape_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist Favorites
  useEffect(() => {
    localStorage.setItem('soundscape_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Persist History
  useEffect(() => {
    localStorage.setItem('soundscape_history', JSON.stringify(history));
  }, [history]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const togglePlay = (id: string) => {
    if (playingSceneId === id) {
      AudioService.stop();
      setPlayingSceneId(null);
    } else {
      AudioService.play(id);
      setPlayingSceneId(id);
    }
  };

  const loadSceneData = useCallback(async (scene: SoundScene) => {
    // Return if already cached
    if (cache[scene.id]) {
      setStatus(SceneStatus.READY);
      return;
    }

    setStatus(SceneStatus.LOADING);
    try {
      const [facts, imageUrl] = await Promise.all([
        GeminiService.generateFacts(scene.factPrompt),
        GeminiService.generateImage(scene.imagePrompt)
      ]);

      const newData = { facts, imageUrl };
      setCache(prev => ({ ...prev, [scene.id]: newData }));
      setStatus(SceneStatus.READY);
      
      // Add to history
      setHistory(prev => {
        const filtered = prev.filter(hid => hid !== scene.id);
        return [scene.id, ...filtered].slice(0, 10);
      });
    } catch (error) {
      console.error("Error loading scene data:", error);
      setStatus(SceneStatus.ERROR);
    }
  }, [cache]);

  useEffect(() => {
    if (activeTab === AppTab.DISCOVERY) {
      loadSceneData(activeScene);
    }
  }, [activeScene.id, activeTab, loadSceneData]);

  const handleSceneSelect = (scene: SoundScene) => {
    if (status === SceneStatus.LOADING) return;
    setActiveScene(scene);
    // Auto-stop if switching and something was playing (optional UX choice)
    // if (playingSceneId) { AudioService.stop(); setPlayingSceneId(null); }
  };

  const renderDiscovery = () => {
    const currentData = cache[activeScene.id];
    return (
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-4xl mb-12">
          <div className="flex flex-nowrap overflow-x-auto pb-4 gap-4 px-2 no-scrollbar justify-start md:justify-center">
            {SCENES.map((scene) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                isActive={activeScene.id === scene.id}
                onClick={() => handleSceneSelect(scene)}
              />
            ))}
          </div>
        </div>
        <KnowledgeCard 
          scene={activeScene}
          status={status}
          imageUrl={currentData?.imageUrl}
          facts={currentData?.facts}
          isFavorited={favorites.includes(activeScene.id)}
          onToggleFavorite={toggleFavorite}
          isPlaying={playingSceneId === activeScene.id}
          onTogglePlay={togglePlay}
        />
      </div>
    );
  };

  const renderFavorites = () => {
    const favoritedScenes = SCENES.filter(s => favorites.includes(s.id));
    
    if (favoritedScenes.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <span className="text-6xl mb-4 opacity-30">💝</span>
          <p>暂无收藏，快去发现新声景吧</p>
          <button 
            onClick={() => setActiveTab(AppTab.DISCOVERY)}
            className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-full text-sm"
          >
            去发现
          </button>
        </div>
      );
    }

    return (
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 pb-24 px-4">
        {favoritedScenes.map(scene => (
          <div key={scene.id} className="glass rounded-2xl overflow-hidden shadow-md flex h-32 animate-fade-in relative">
            <div className={`w-32 flex-shrink-0 ${scene.color} flex items-center justify-center text-4xl overflow-hidden`}>
              {cache[scene.id]?.imageUrl ? (
                <img src={cache[scene.id].imageUrl} className="w-full h-full object-cover" />
              ) : '🎵'}
              {/* Mini Play Button for list view */}
              <button 
                onClick={() => togglePlay(scene.id)}
                className="absolute left-10 w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center border border-white/20"
              >
                {playingSceneId === scene.id ? '⏸' : '▶️'}
              </button>
            </div>
            <div className="p-4 flex flex-col justify-between flex-grow">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-800">{scene.name}</h3>
                  {playingSceneId === scene.id && <WaveformAnimation active={true} color={scene.accent.replace('text', 'bg')} />}
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{scene.description}</p>
              </div>
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => { setActiveScene(scene); setActiveTab(AppTab.DISCOVERY); }}
                  className={`text-xs font-bold ${scene.accent}`}
                >
                  查看详情
                </button>
                <button onClick={() => toggleFavorite(scene.id)} className="text-rose-500">❤️</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderProfile = () => {
    return (
      <div className="w-full max-w-lg space-y-8 animate-fade-in pb-24 px-4">
        {/* Profile Card */}
        <div className="glass rounded-3xl p-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-tr from-slate-200 to-slate-400 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-inner">
            👤
          </div>
          <h2 className="text-2xl font-bold text-slate-800">探索者</h2>
          <p className="text-slate-500 text-sm italic">“在大自然的低语中寻找宁静”</p>
        </div>

        {/* Listen History */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">最近听过 · History</h3>
          <div className="bg-white/50 rounded-2xl divide-y divide-slate-100 overflow-hidden border border-slate-100">
            {history.length > 0 ? history.map(hid => {
              const scene = SCENES.find(s => s.id === hid);
              return scene ? (
                <div key={hid} className="p-4 flex items-center hover:bg-white/80 transition-colors cursor-pointer" onClick={() => { setActiveScene(scene); setActiveTab(AppTab.DISCOVERY); }}>
                  <span className="mr-3 text-xl opacity-80">{scene.id === 'rainforest' ? '🌿' : scene.id === 'ocean' ? '🌊' : scene.id === 'guqin' ? '🎵' : '🏮'}</span>
                  <div className="flex-grow">
                    <p className="font-medium text-slate-800 text-sm">{scene.name}</p>
                    <p className="text-[10px] text-slate-400">已解锁完整图谱</p>
                  </div>
                  <span className="text-xs text-slate-300">刚刚</span>
                </div>
              ) : null;
            }) : (
              <p className="p-8 text-center text-slate-400 text-sm">还没有探索记录哦</p>
            )}
          </div>
        </div>

        {/* Settings Placeholder */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">系统设置 · Settings</h3>
          <div className="glass rounded-2xl overflow-hidden divide-y divide-slate-100">
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm text-slate-700">高保真音频模式</span>
              <div className="w-10 h-5 bg-emerald-500 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm text-slate-700">离线下载历史</span>
              <span className="text-xs text-slate-400">12.4 MB</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-10 transition-colors duration-1000 overflow-y-auto bg-slate-50">
      {/* Dynamic Background Blur */}
      <div className={`fixed inset-0 -z-10 opacity-10 blur-3xl transition-colors duration-1000 ${activeScene.color}`}></div>

      {/* Header */}
      <header className="text-center mb-8 md:mb-12 animate-fade-in w-full">
        <h1 className="text-4xl md:text-5xl font-chinese tracking-wider text-slate-800 mb-2">
          {activeTab === AppTab.DISCOVERY ? '声景寻迹' : activeTab === AppTab.FAVORITES ? '灵感收藏' : '个人空间'}
        </h1>
        <p className="text-slate-500 font-light tracking-widest text-xs md:text-sm uppercase">
          {activeTab === AppTab.DISCOVERY ? 'Soundscape Odyssey' : activeTab === AppTab.FAVORITES ? 'Curated Favorites' : 'Personal Sanctuary'}
        </p>
      </header>

      {/* Main View Port */}
      <main className="w-full flex justify-center pb-20">
        {activeTab === AppTab.DISCOVERY && renderDiscovery()}
        {activeTab === AppTab.FAVORITES && renderFavorites()}
        {activeTab === AppTab.PROFILE && renderProfile()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
