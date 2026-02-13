
export class AudioService {
  private static ctx: AudioContext | null = null;
  // Use AudioScheduledSourceNode instead of AudioNode because we need to call .stop()
  private static currentSourceNodes: AudioScheduledSourceNode[] = [];
  private static gainNode: GainNode | null = null;
  private static currentSceneId: string | null = null;

  private static getContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  static stop() {
    this.currentSourceNodes.forEach(node => {
      // AudioScheduledSourceNode (like AudioBufferSourceNode and OscillatorNode) supports .stop()
      try { node.stop(); } catch (e) {}
      node.disconnect();
    });
    this.currentSourceNodes = [];
    
    if (this.gainNode) {
      this.gainNode.gain.setTargetAtTime(0, this.getContext().currentTime, 0.2);
    }
    this.currentSceneId = null;
  }

  static play(sceneId: string) {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') ctx.resume();
    
    this.stop();
    this.currentSceneId = sceneId;

    this.gainNode = ctx.createGain();
    this.gainNode.gain.setValueAtTime(0, ctx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 1.5);
    this.gainNode.connect(ctx.destination);

    switch (sceneId) {
      case 'rainforest':
        this.createRainforest();
        break;
      case 'ocean':
        this.createOcean();
        break;
      case 'guqin':
        this.createGuqin();
        break;
      case 'market':
        this.createMarket();
        break;
      default:
        this.createNatureAmbience();
    }
  }

  // Helper to create Pink Noise (more natural than white noise)
  private static createPinkNoiseNode() {
    const ctx = this.getContext();
    const bufferSize = 4 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11; // estimate
      b6 = white * 0.115926;
    }
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  }

  private static createRainforest() {
    const ctx = this.getContext();
    
    // Distant background rain (Pink noise)
    const rain = this.createPinkNoiseNode();
    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.value = 800;
    rain.connect(rainFilter);
    rainFilter.connect(this.gainNode!);
    rain.start();
    this.currentSourceNodes.push(rain);

    // Random bird chirps using oscillators
    const createBird = () => {
      if (this.currentSceneId !== 'rainforest') return;
      
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2000 + Math.random() * 3000, ctx.currentTime);
      
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      osc.connect(g);
      g.connect(this.gainNode!);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      
      setTimeout(createBird, 2000 + Math.random() * 5000);
    };
    createBird();
  }

  private static createOcean() {
    const ctx = this.getContext();
    
    const waves = this.createPinkNoiseNode();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    
    const waveGain = ctx.createGain();
    waveGain.gain.setValueAtTime(0.1, ctx.currentTime);
    
    // Wave LFO
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.15; // slow waves
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.2;
    
    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);
    lfoGain.connect(filter.frequency); // Filter moves with waves
    
    waves.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.gainNode!);
    
    lfo.start();
    waves.start();
    this.currentSourceNodes.push(lfo, waves);
  }

  private static createGuqin() {
    const ctx = this.getContext();
    const notes = [196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00]; // Pentatonic G
    
    const playNote = () => {
      if (this.currentSceneId !== 'guqin') return;
      
      const freq = notes[Math.floor(Math.random() * notes.length)];
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 2);
      
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4);
      
      osc.connect(filter);
      filter.connect(g);
      g.connect(this.gainNode!);
      
      osc.start();
      osc.stop(ctx.currentTime + 4);
      
      setTimeout(playNote, 1500 + Math.random() * 3000);
    };
    playNote();
  }

  private static createMarket() {
    const ctx = this.getContext();
    
    // Low rumble (Market floor)
    const rumble = ctx.createOscillator();
    rumble.type = 'sine';
    rumble.frequency.value = 60;
    const rumG = ctx.createGain();
    rumG.gain.value = 0.05;
    rumble.connect(rumG);
    rumG.connect(this.gainNode!);
    rumble.start();
    this.currentSourceNodes.push(rumble);

    // Filtered noise "voices"
    const createVoice = () => {
      if (this.currentSceneId !== 'market') return;
      const noise = this.createPinkNoiseNode();
      const f = ctx.createBiquadFilter();
      const g = ctx.createGain();
      
      f.type = 'bandpass';
      f.frequency.setValueAtTime(400 + Math.random() * 1000, ctx.currentTime);
      f.Q.value = 5;
      
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.5);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      
      noise.connect(f);
      f.connect(g);
      g.connect(this.gainNode!);
      
      noise.start();
      noise.stop(ctx.currentTime + 1.6);
      
      setTimeout(createVoice, 500 + Math.random() * 1000);
    };
    for(let i=0; i<3; i++) createVoice();
  }

  private static createNatureAmbience() {
    this.createRainforest();
  }

  static isPlaying(id: string) {
    return this.currentSceneId === id;
  }
}
