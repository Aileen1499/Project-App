// src/engine/batchStoryEngine.ts
// Batching and Connected Story Learning Engine for Hanzigo

import { getWordsByLevels, type HskWord } from '../data/hskMasterData';

export interface WordBatch {
  id: string;
  level: number;
  batchNumber: number;
  totalBatches: number;
  title: string;
  words: HskWord[];
  story: BatchStory;
}

export interface BatchStory {
  titleZh: string;
  titlePinyin: string;
  titleId: string;
  paragraphs: {
    zh: string;
    pinyin: string;
    id: string;
  }[];
}

const BATCH_PROGRESS_KEY = 'hanzigo-batch-progress';

export function getCompletedBatches(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(BATCH_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveBatchCompleted(batchId: string): void {
  try {
    const data = getCompletedBatches();
    data[batchId] = true;
    localStorage.setItem(BATCH_PROGRESS_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save batch progress:', e);
  }
}

// Generates a flowing connected story that incorporates the batch words
function generateStoryForWords(words: HskWord[], level: number, batchNumber: number): BatchStory {
  const wordHanzis = words.map(w => w.hanzi);
  
  // Create thematic story sentences using the target words in context
  const primarySentences = words.map(w => {
    if (w.sentences && w.sentences[0]) {
      return w.sentences[0];
    }
    return {
      zh: `在日常生活中，我们经常用到“${w.hanzi}”。`,
      pinyin: `Zài rìcháng shēnghuó zhōng, wǒmen jīngcháng yòng dào "${w.pinyin}".`,
      en: `In daily life, we often use "${w.meaning}".`,
      id: `Dalam kehidupan sehari-hari, kita sering menggunakan "${w.meaningId || w.meaning}".`
    };
  });

  // Combine words into a multi-part flowing narrative
  const part1Words = words.slice(0, Math.ceil(words.length / 2));
  const part2Words = words.slice(Math.ceil(words.length / 2));

  const p1Zh = part1Words.map(w => {
    const s = w.sentences && w.sentences[0] ? w.sentences[0].zh : `${w.hanzi}很有用。`;
    return s;
  }).join(' ');

  const p1Pinyin = part1Words.map(w => {
    const s = w.sentences && w.sentences[0] ? w.sentences[0].pinyin : `${w.pinyin} hěn yǒu yòng.`;
    return s;
  }).join(' ');

  const p1Id = part1Words.map(w => {
    const s = w.sentences && w.sentences[0] ? w.sentences[0].id : `${w.meaningId || w.meaning} sangat berguna.`;
    return s;
  }).join(' ');

  const p2Zh = part2Words.map(w => {
    const s = w.sentences && w.sentences[1] ? w.sentences[1].zh : (w.sentences && w.sentences[0] ? w.sentences[0].zh : `我们学习${w.hanzi}。`);
    return s;
  }).join(' ');

  const p2Pinyin = part2Words.map(w => {
    const s = w.sentences && w.sentences[1] ? w.sentences[1].pinyin : (w.sentences && w.sentences[0] ? w.sentences[0].pinyin : `Wǒmen xuéxí ${w.pinyin}.`);
    return s;
  }).join(' ');

  const p2Id = part2Words.map(w => {
    const s = w.sentences && w.sentences[1] ? w.sentences[1].id : (w.sentences && w.sentences[0] ? w.sentences[0].id : `Kita mempelajari ${w.meaningId || w.meaning}.`);
    return s;
  }).join(' ');

  const titlesByLevel: Record<number, string[]> = {
    1: ['Langkah Pertama', 'Aktivitas Harian', 'Keluarga & Teman', 'Di Sekolah', 'Makanan & Minuman'],
    2: ['Perjalanan & Transportasi', 'Belanja & Waktu', 'Kesehatan & Cuaca', 'Hobi & Hiburan', 'Tempat & Arah'],
    3: ['Rencana & Masa Depan', 'Pekerjaan & Karir', 'Lingkungan & Gaya Hidup', 'Perasaan & Emosi', 'Pengalaman Seru'],
    4: ['Hubungan Sosial', 'Dunia Kerja & Bisnis', 'Ilmu Pengetahuan & Teknologi', 'Pandangan Hidup & Karakter', 'Seni & Budaya'],
    5: ['Dunia Profesional', 'Psikologi & Pemikiran', 'Masyarakat Modern', 'Kritik & Analisis', 'Kebijaksanaan Hidup'],
    6: ['Sastra & Idiom', 'Filsafat Mendalam', 'Retorika Bahasa', 'Wawasan Global', 'Tingkat Mahir Terpadu']
  };

  const levelTitles = titlesByLevel[level] || ['Kumpulan Kosakata'];
  const titleId = levelTitles[(batchNumber - 1) % levelTitles.length] + ` (Bagian ${Math.floor((batchNumber - 1) / levelTitles.length) + 1})`;
  const titleZh = `HSK ${level} 故事 • 第 ${batchNumber} 单元`;
  const titlePinyin = `HSK ${level} Gùshi • Dì ${batchNumber} Dānyuán`;

  return {
    titleZh,
    titlePinyin,
    titleId,
    paragraphs: [
      { zh: p1Zh, pinyin: p1Pinyin, id: p1Id },
      { zh: p2Zh, pinyin: p2Pinyin, id: p2Id }
    ]
  };
}

export function getBatchesForLevel(level: number, batchSize = 10): WordBatch[] {
  const words = getWordsByLevels([level]);
  const totalBatches = Math.ceil(words.length / batchSize);
  const batches: WordBatch[] = [];

  for (let i = 0; i < totalBatches; i++) {
    const batchWords = words.slice(i * batchSize, (i + 1) * batchSize);
    const batchNumber = i + 1;
    const batchId = `b-lvl${level}-${batchNumber}`;
    const story = generateStoryForWords(batchWords, level, batchNumber);

    batches.push({
      id: batchId,
      level,
      batchNumber,
      totalBatches,
      title: `Unit ${batchNumber}: ${story.titleId}`,
      words: batchWords,
      story
    });
  }

  return batches;
}
