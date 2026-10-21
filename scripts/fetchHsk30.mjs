// scripts/fetchHsk30.js
// Downloads and parses official HSK 3.0 dataset from drkameleon/complete-hsk-vocabulary
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const BASE_URL = 'https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/wordlists/exclusive/new';

// Quick Indonesian dictionary for common English definitions
const commonTranslations = {
  'you': 'kamu; anda',
  'good; well; fine': 'bagus; baik',
  'I; me': 'saya; aku',
  'to be; is; am; are': 'adalah; ya',
  'one; a; an': 'satu',
  'not; no': 'tidak; bukan',
  'at; in; (indicates ongoing action)': 'di; sedang',
  'person; people': 'orang; manusia',
  'to have; there is': 'ada; memiliki',
  'this; these': 'ini',
  'that; those': 'itu',
  'he; him': 'dia (laki-laki)',
  'she; her': 'dia (perempuan)',
  'we; us': 'kami; kita',
  'they; them': 'mereka',
  'to love; to be fond of; to like': 'mencintai; menyukai',
  'interest; hobby': 'hobi; kegemaran',
  'father; dad': 'ayah; bapak',
  'mother; mom': 'ibu; mama',
  'older brother': 'kakak laki-laki',
  'younger brother': 'adik laki-laki',
  'older sister': 'kakak perempuan',
  'younger sister': 'adik perempuan',
  'friend': 'teman; kawan',
  'student': 'siswa; murid; pelajar',
  'teacher': 'guru; pengajar',
  'school': 'sekolah',
  'university': 'universitas',
  'hospital': 'rumah sakit',
  'doctor': 'dokter',
  'nurse': 'perawat',
  'restaurant': 'restoran; rumah makan',
  'shop; store': 'toko',
  'hotel': 'hotel',
  'room': 'kamar; ruangan',
  'home; family': 'rumah; keluarga',
  'company; corporation': 'perusahaan; kantor',
  'station; stop': 'stasiun; halte',
  'airport': 'bandara',
  'water': 'air',
  'tea': 'teh',
  'coffee': 'kopi',
  'milk': 'susu',
  'rice': 'nasi; beras',
  'noodle': 'mie',
  'bread': 'roti',
  'dish; food; vegetable': 'hidangan; sayuran',
  'meat': 'daging',
  'apple': 'apel',
  'banana': 'pisang',
  'fruit': 'buah-buahan',
  'book': 'buku',
  'pen; pencil': 'pena; pensil',
  'computer': 'komputer',
  'cell phone; mobile phone': 'ponsel; handphone',
  'money': 'uang',
  'price': 'harga',
  'time': 'waktu; jam',
  'year': 'tahun',
  'month': 'bulan',
  'day': 'hari; tanggal',
  'today': 'hari ini',
  'tomorrow': 'besok',
  'yesterday': 'kemarin',
  'now': 'sekarang',
  'morning': 'pagi',
  'afternoon': 'sore; siang',
  'evening; night': 'malam',
  'sun': 'matahari',
  'moon': 'bulan',
  'rain': 'hujan',
  'weather': 'cuaca',
  'airplane': 'pesawat terbang',
  'train': 'kereta api',
  'bus': 'bus',
  'car': 'mobil',
  'bicycle': 'sepeda',
  'to eat': 'makan',
  'to drink': 'minum',
  'to sleep': 'tidur',
  'to go': 'pergi',
  'to come': 'datang',
  'to see; to look; to watch': 'melihat; menonton',
  'to listen; to hear': 'mendengar',
  'to speak; to say': 'berbicara; mengatakan',
  'to read': 'membaca',
  'to write': 'menulis',
  'to buy': 'membeli',
  'to sell': 'menjual',
  'to study; to learn': 'belajar',
  'to work': 'bekerja',
  'to walk': 'berjalan',
  'to run': 'berlari',
  'to ask': 'bertanya',
  'to answer': 'menjawab',
  'happy; glad': 'senang; gembira',
  'tired': 'lelah; capek',
  'hungry': 'lapar',
  'busy': 'sibuk',
  'tall; high': 'tinggi',
  'short; low': 'pendek; rendah',
  'big; large': 'besar',
  'small; little': 'kecil',
  'long': 'panjang',
  'short': 'pendek',
  'fast; quick': 'cepat',
  'slow': 'lambat',
  'hot': 'panas',
  'cold': 'dingin',
  'new': 'baru',
  'old': 'lama; tua',
  'easy': 'mudah',
  'difficult': 'sulit; sukar',
  'expensive': 'mahal',
  'cheap': 'murah',
  'beautiful; pretty': 'cantik; indah',
  'red': 'merah',
  'yellow': 'kuning',
  'blue': 'biru',
  'green': 'hijau',
  'black': 'hitam',
  'white': 'putih'
};

function translateToIndonesian(enMeaning) {
  if (!enMeaning) return '';
  const first = enMeaning.split(';')[0].trim().toLowerCase();
  if (commonTranslations[first]) return commonTranslations[first];
  for (const [key, val] of Object.entries(commonTranslations)) {
    if (first.includes(key) || key.includes(first)) return val;
  }
  // Basic morphological simplification
  let simplified = enMeaning
    .replace(/^to\s+/i, '')
    .split(';')[0]
    .trim();
  return simplified;
}

async function run() {
  console.log('Downloading official HSK 3.0 datasets for Levels 1 to 6...');
  const allWords = [];

  // Read existing data from hskMasterData.ts to preserve hand-crafted items
  let existingWordsMap = new Map();
  try {
    const existingFile = fs.readFileSync(path.join(projectRoot, 'src/data/hskMasterData.ts'), 'utf8');
    // Extract existing words
    const regex = /{\s*id:\s*wid\((\d+),\s*(\d+)\)[^}]*hanzi:\s*'([^']+)'[^}]*traditional:\s*'([^']+)'[^}]*pinyin:\s*'([^']+)'[^}]*meaning:\s*'([^']+)'[^}]*meaningId:\s*'([^']+)'/gs;
    let match;
    while ((match = regex.exec(existingFile)) !== null) {
      existingWordsMap.set(match[3], {
        traditional: match[4],
        meaningId: match[7],
      });
    }
    console.log(`Loaded ${existingWordsMap.size} existing curated words.`);
  } catch (err) {
    console.warn('Could not read existing file:', err.message);
  }

  for (let lvl = 1; lvl <= 6; lvl++) {
    const url = `${BASE_URL}/${lvl}.min.json`;
    console.log(`Fetching HSK ${lvl} from ${url}...`);
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Failed to fetch level ${lvl}: ${resp.statusText}`);
    }
    const rawList = await resp.json();
    console.log(`HSK ${lvl}: ${rawList.length} words received.`);

    rawList.forEach((item, idx) => {
      const hanzi = item.s;
      const form = item.f && item.f[0] ? item.f[0] : {};
      const traditional = form.t || hanzi;
      const pinyin = form.i ? form.i.y : '';
      const meaningsArr = form.m || [];
      const meaning = meaningsArr.join('; ') || 'definition';
      const existing = existingWordsMap.get(hanzi);
      const meaningId = existing ? existing.meaningId : translateToIndonesian(meaning);

      // Primary meaning for sentence templates
      const primaryMeaning = meaningsArr[0] || meaning;
      const primaryId = meaningId.split(';')[0].trim();

      const word = {
        id: `hsk${lvl}-${String(idx + 1).padStart(4, '0')}`,
        level: lvl,
        hanzi,
        traditional,
        pinyin,
        meaning,
        meaningId,
        collocations: `常用: ${hanzi}`,
        sentences: [
          {
            zh: `这是“${hanzi}”。`,
            pinyin: `Zhè shì "${pinyin}".`,
            en: `This is "${primaryMeaning}".`,
            id: `Ini adalah "${primaryId}".`
          },
          {
            zh: `我在学“${hanzi}”这个词。`,
            pinyin: `Wǒ zài xué "${pinyin}" zhè ge cí.`,
            en: `I am learning the word "${primaryMeaning}".`,
            id: `Saya sedang mempelajari kata "${primaryId}".`
          }
        ]
      };

      allWords.push(word);
    });
  }

  console.log(`\nTotal words compiled: ${allWords.length}`);

  const outPath = path.join(projectRoot, 'src/data/hsk30Data.json');
  fs.writeFileSync(outPath, JSON.stringify(allWords, null, 2), 'utf8');
  console.log(`Successfully written to ${outPath}`);
}

run().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
