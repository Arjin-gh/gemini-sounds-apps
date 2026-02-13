
import { SoundScene } from './types';

export const SCENES: SoundScene[] = [
  {
    id: 'rainforest',
    name: '热带雨林',
    nameEn: 'Tropical Rainforest',
    description: '身处郁郁葱葱的亚马逊，聆听鸟鸣与午后的阵雨。',
    imagePrompt: 'A breathtakingly lush tropical rainforest during a light afternoon rain, cinematic lighting, hyper-realistic, 4k, vibrant green canopy, distant exotic birds flying.',
    factPrompt: 'Provide 4 fascinating and self-contained facts about tropical rainforest soundscapes and biodiversity in Chinese.',
    color: 'bg-emerald-500',
    accent: 'text-emerald-700'
  },
  {
    id: 'ocean',
    name: '蔚蓝海浪',
    nameEn: 'Deep Ocean Waves',
    description: '海浪拍打沙滩，感受咸湿的海风与深海的静谧。',
    imagePrompt: 'Wide angle view of crystal clear blue ocean waves crashing onto a white sand beach at sunset, warm golden glow, ultra-detailed water droplets, serene atmosphere.',
    factPrompt: 'Provide 4 fascinating and self-contained facts about ocean acoustics and marine biology in Chinese.',
    color: 'bg-blue-500',
    accent: 'text-blue-700'
  },
  {
    id: 'guqin',
    name: '高山流水',
    nameEn: 'Guqin Melodies',
    description: '古琴悠扬，在云雾缭绕的山间体验中国古代文人的雅兴。',
    imagePrompt: 'A traditional Chinese scene with a Guqin (zither) on a stone table in a misty bamboo forest, ancient ink wash painting style mixed with realism, peaceful zen atmosphere.',
    factPrompt: 'Provide 4 fascinating and self-contained facts about the history and philosophy of Guqin music in Chinese.',
    color: 'bg-amber-600',
    accent: 'text-amber-800'
  },
  {
    id: 'market',
    name: '古代集市',
    nameEn: 'Ancient Marketplace',
    description: '穿越回繁华的汴京，置身于吆喝声与市井烟火气中。',
    imagePrompt: 'A bustling ancient Chinese marketplace at night during the Song Dynasty, lanterns glowing, wooden stalls, people in traditional attire, vibrant street life, high detail.',
    factPrompt: 'Provide 4 fascinating and self-contained facts about the sounds and daily life in ancient Chinese marketplaces in Chinese.',
    color: 'bg-rose-500',
    accent: 'text-rose-700'
  }
];
