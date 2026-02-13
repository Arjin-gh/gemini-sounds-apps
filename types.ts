
export interface Fact {
  title: string;
  fact: string;
  icon: string;
}

export interface SoundScene {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  imagePrompt: string;
  factPrompt: string;
  color: string;
  accent: string;
}

export interface CardData {
  imageUrl: string;
  facts: Fact[];
}

export enum SceneStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error'
}

export enum AppTab {
  DISCOVERY = 'discovery',
  FAVORITES = 'favorites',
  PROFILE = 'profile'
}
