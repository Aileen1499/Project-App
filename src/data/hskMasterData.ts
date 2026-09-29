// ─────────────────────────────────────────────
// hskMasterData.ts — Universal HSK 1-6 Dataset
// ─────────────────────────────────────────────

export interface HskSentence {
  zh: string;
  pinyin: string;
  en: string;
  id: string; // Indonesian
}

export interface HskWord {
  id: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  hanzi: string;
  traditional: string;
  pinyin: string;
  meaning: string;
  meaningId: string; // Indonesian
  components?: string;
  collocations: string;
  nuances?: string;
  sentences: [HskSentence, HskSentence];
}

// Unique ID generator based on level + index
const wid = (level: number, idx: number) => `hsk${level}-${String(idx).padStart(3, '0')}`;

export const hskMasterData: HskWord[] = [
  // ═══════════════════════════════════════════
  //  HSK 1 — Foundational (40 words)
  // ═══════════════════════════════════════════
  {
    id: wid(1, 1), level: 1, hanzi: '你', traditional: '你', pinyin: 'nǐ',
    meaning: 'you', meaningId: 'kamu',
    collocations: '你好 (nǐ hǎo) — hello; 你们 (nǐmen) — you all',
    sentences: [
      { zh: '你叫什么名字？', pinyin: 'Nǐ jiào shénme míngzi?', en: 'What is your name?', id: 'Siapa namamu?' },
      { zh: '你是学生吗？', pinyin: 'Nǐ shì xuéshēng ma?', en: 'Are you a student?', id: 'Apakah kamu seorang siswa?' }
    ]
  },
  {
    id: wid(1, 2), level: 1, hanzi: '好', traditional: '好', pinyin: 'hǎo',
    meaning: 'good; well; fine', meaningId: 'baik; bagus',
    collocations: '好吃 (hǎochī) — delicious; 好看 (hǎokàn) — good-looking',
    sentences: [
      { zh: '今天天气很好。', pinyin: 'Jīntiān tiānqì hěn hǎo.', en: 'The weather is very nice today.', id: 'Cuaca hari ini sangat bagus.' },
      { zh: '你好！很高兴认识你。', pinyin: 'Nǐ hǎo! Hěn gāoxìng rènshì nǐ.', en: 'Hello! Nice to meet you.', id: 'Halo! Senang berkenalan denganmu.' }
    ]
  },
  {
    id: wid(1, 3), level: 1, hanzi: '我', traditional: '我', pinyin: 'wǒ',
    meaning: 'I; me', meaningId: 'saya; aku',
    collocations: '我们 (wǒmen) — we; 我的 (wǒ de) — my/mine',
    sentences: [
      { zh: '我是中国人。', pinyin: 'Wǒ shì Zhōngguó rén.', en: 'I am Chinese.', id: 'Saya orang Tiongkok.' },
      { zh: '我喜欢喝茶。', pinyin: 'Wǒ xǐhuān hē chá.', en: 'I like drinking tea.', id: 'Saya suka minum teh.' }
    ]
  },
  {
    id: wid(1, 4), level: 1, hanzi: '是', traditional: '是', pinyin: 'shì',
    meaning: 'to be; is; am; are', meaningId: 'adalah',
    collocations: '是的 (shì de) — yes; 不是 (bú shì) — no / is not',
    sentences: [
      { zh: '他是我的老师。', pinyin: 'Tā shì wǒ de lǎoshī.', en: 'He is my teacher.', id: 'Dia adalah guru saya.' },
      { zh: '这是什么？', pinyin: 'Zhè shì shénme?', en: 'What is this?', id: 'Ini apa?' }
    ]
  },
  {
    id: wid(1, 5), level: 1, hanzi: '一', traditional: '一', pinyin: 'yī',
    meaning: 'one; a; an', meaningId: 'satu',
    collocations: '一个 (yí gè) — one (general); 第一 (dì yī) — first',
    sentences: [
      { zh: '我有一个哥哥。', pinyin: 'Wǒ yǒu yí gè gēge.', en: 'I have one older brother.', id: 'Saya punya satu kakak laki-laki.' },
      { zh: '请给我一杯水。', pinyin: 'Qǐng gěi wǒ yì bēi shuǐ.', en: 'Please give me a glass of water.', id: 'Tolong beri saya segelas air.' }
    ]
  },
  {
    id: wid(1, 6), level: 1, hanzi: '不', traditional: '不', pinyin: 'bù',
    meaning: 'not; no', meaningId: 'tidak; bukan',
    collocations: '不好 (bù hǎo) — not good; 不是 (bú shì) — not be',
    sentences: [
      { zh: '我不喝咖啡。', pinyin: 'Wǒ bù hē kāfēi.', en: "I don't drink coffee.", id: 'Saya tidak minum kopi.' },
      { zh: '他不是医生。', pinyin: 'Tā bú shì yīshēng.', en: 'He is not a doctor.', id: 'Dia bukan dokter.' }
    ]
  },
  {
    id: wid(1, 7), level: 1, hanzi: '在', traditional: '在', pinyin: 'zài',
    meaning: 'at; in; (indicates ongoing action)', meaningId: 'di; sedang',
    collocations: '在家 (zài jiā) — at home; 在哪儿 (zài nǎr) — where',
    sentences: [
      { zh: '他在学校。', pinyin: 'Tā zài xuéxiào.', en: 'He is at school.', id: 'Dia ada di sekolah.' },
      { zh: '你在做什么？', pinyin: 'Nǐ zài zuò shénme?', en: 'What are you doing?', id: 'Kamu sedang apa?' }
    ]
  },
  {
    id: wid(1, 8), level: 1, hanzi: '人', traditional: '人', pinyin: 'rén',
    meaning: 'person; people', meaningId: 'orang; manusia',
    collocations: '中国人 (Zhōngguó rén) — Chinese person; 大人 (dàrén) — adult',
    sentences: [
      { zh: '那个人是谁？', pinyin: 'Nàge rén shì shéi?', en: 'Who is that person?', id: 'Orang itu siapa?' },
      { zh: '这里有很多人。', pinyin: 'Zhèlǐ yǒu hěn duō rén.', en: 'There are many people here.', id: 'Di sini ada banyak orang.' }
    ]
  },
  {
    id: wid(1, 9), level: 1, hanzi: '大', traditional: '大', pinyin: 'dà',
    meaning: 'big; large; great', meaningId: 'besar',
    collocations: '大学 (dàxué) — university; 大家 (dàjiā) — everyone',
    sentences: [
      { zh: '这个苹果很大。', pinyin: 'Zhège píngguǒ hěn dà.', en: 'This apple is very big.', id: 'Apel ini sangat besar.' },
      { zh: '北京是一个大城市。', pinyin: 'Běijīng shì yí gè dà chéngshì.', en: 'Beijing is a big city.', id: 'Beijing adalah kota besar.' }
    ]
  },
  {
    id: wid(1, 10), level: 1, hanzi: '学', traditional: '學', pinyin: 'xué',
    meaning: 'to learn; to study', meaningId: 'belajar',
    collocations: '学习 (xuéxí) — to study; 学生 (xuéshēng) — student',
    sentences: [
      { zh: '我在学中文。', pinyin: 'Wǒ zài xué Zhōngwén.', en: 'I am learning Chinese.', id: 'Saya sedang belajar bahasa Mandarin.' },
      { zh: '他学得很快。', pinyin: 'Tā xué de hěn kuài.', en: 'He learns very fast.', id: 'Dia belajar dengan sangat cepat.' }
    ]
  },
  {
    id: wid(1, 11), level: 1, hanzi: '会', traditional: '會', pinyin: 'huì',
    meaning: 'can; will; meeting', meaningId: 'bisa; akan',
    collocations: '会说 (huì shuō) — can speak; 开会 (kāi huì) — to have a meeting',
    sentences: [
      { zh: '你会说英语吗？', pinyin: 'Nǐ huì shuō Yīngyǔ ma?', en: 'Can you speak English?', id: 'Apakah kamu bisa berbicara bahasa Inggris?' },
      { zh: '明天会下雨。', pinyin: 'Míngtiān huì xià yǔ.', en: 'It will rain tomorrow.', id: 'Besok akan hujan.' }
    ]
  },
  {
    id: wid(1, 12), level: 1, hanzi: '想', traditional: '想', pinyin: 'xiǎng',
    meaning: 'to want; to think; to miss', meaningId: 'ingin; berpikir; rindu',
    collocations: '想要 (xiǎng yào) — to want; 想念 (xiǎngniàn) — to miss',
    sentences: [
      { zh: '我想去中国。', pinyin: 'Wǒ xiǎng qù Zhōngguó.', en: 'I want to go to China.', id: 'Saya ingin pergi ke Tiongkok.' },
      { zh: '你想吃什么？', pinyin: 'Nǐ xiǎng chī shénme?', en: 'What do you want to eat?', id: 'Kamu mau makan apa?' }
    ]
  },
  {
    id: wid(1, 13), level: 1, hanzi: '吃', traditional: '吃', pinyin: 'chī',
    meaning: 'to eat', meaningId: 'makan',
    collocations: '吃饭 (chī fàn) — to eat (a meal); 好吃 (hǎo chī) — delicious',
    sentences: [
      { zh: '我们去吃饭吧！', pinyin: 'Wǒmen qù chī fàn ba!', en: "Let's go eat!", id: 'Ayo kita pergi makan!' },
      { zh: '这个菜很好吃。', pinyin: 'Zhège cài hěn hǎochī.', en: 'This dish is delicious.', id: 'Hidangan ini sangat enak.' }
    ]
  },
  {
    id: wid(1, 14), level: 1, hanzi: '喝', traditional: '喝', pinyin: 'hē',
    meaning: 'to drink', meaningId: 'minum',
    collocations: '喝水 (hē shuǐ) — drink water; 喝茶 (hē chá) — drink tea',
    sentences: [
      { zh: '你想喝什么？', pinyin: 'Nǐ xiǎng hē shénme?', en: 'What would you like to drink?', id: 'Kamu mau minum apa?' },
      { zh: '我每天喝很多水。', pinyin: 'Wǒ měi tiān hē hěn duō shuǐ.', en: 'I drink a lot of water every day.', id: 'Saya minum banyak air setiap hari.' }
    ]
  },
  {
    id: wid(1, 15), level: 1, hanzi: '看', traditional: '看', pinyin: 'kàn',
    meaning: 'to look; to see; to watch; to read', meaningId: 'melihat; menonton; membaca',
    collocations: '看书 (kàn shū) — read a book; 看见 (kànjiàn) — to see',
    sentences: [
      { zh: '我在看书。', pinyin: 'Wǒ zài kàn shū.', en: 'I am reading a book.', id: 'Saya sedang membaca buku.' },
      { zh: '我们一起看电影吧。', pinyin: 'Wǒmen yìqǐ kàn diànyǐng ba.', en: "Let's watch a movie together.", id: 'Ayo kita nonton film bersama.' }
    ]
  },
  {
    id: wid(1, 16), level: 1, hanzi: '说', traditional: '說', pinyin: 'shuō',
    meaning: 'to speak; to say', meaningId: 'berbicara; berkata',
    collocations: '说话 (shuō huà) — to talk; 说中文 (shuō Zhōngwén) — speak Chinese',
    sentences: [
      { zh: '请你再说一次。', pinyin: 'Qǐng nǐ zài shuō yí cì.', en: 'Please say it again.', id: 'Tolong katakan sekali lagi.' },
      { zh: '他说得很好。', pinyin: 'Tā shuō de hěn hǎo.', en: 'He speaks very well.', id: 'Dia berbicara dengan sangat baik.' }
    ]
  },
  {
    id: wid(1, 17), level: 1, hanzi: '听', traditional: '聽', pinyin: 'tīng',
    meaning: 'to listen; to hear', meaningId: 'mendengar; mendengarkan',
    collocations: '听说 (tīng shuō) — to hear (that); 好听 (hǎo tīng) — pleasant to listen to',
    sentences: [
      { zh: '请听我说。', pinyin: 'Qǐng tīng wǒ shuō.', en: 'Please listen to me.', id: 'Tolong dengarkan saya.' },
      { zh: '这首歌很好听。', pinyin: 'Zhè shǒu gē hěn hǎotīng.', en: 'This song sounds beautiful.', id: 'Lagu ini sangat merdu.' }
    ]
  },
  {
    id: wid(1, 18), level: 1, hanzi: '写', traditional: '寫', pinyin: 'xiě',
    meaning: 'to write', meaningId: 'menulis',
    collocations: '写字 (xiě zì) — to write characters; 写信 (xiě xìn) — to write a letter',
    sentences: [
      { zh: '请你写你的名字。', pinyin: 'Qǐng nǐ xiě nǐ de míngzi.', en: 'Please write your name.', id: 'Tolong tulis namamu.' },
      { zh: '我喜欢写汉字。', pinyin: 'Wǒ xǐhuān xiě hànzì.', en: 'I like writing Chinese characters.', id: 'Saya suka menulis aksara Tionghoa.' }
    ]
  },
  {
    id: wid(1, 19), level: 1, hanzi: '读', traditional: '讀', pinyin: 'dú',
    meaning: 'to read (aloud)', meaningId: 'membaca (dengan suara)',
    collocations: '读书 (dú shū) — to study; 阅读 (yuèdú) — reading',
    sentences: [
      { zh: '请大声读这个字。', pinyin: 'Qǐng dà shēng dú zhège zì.', en: 'Please read this character aloud.', id: 'Tolong baca huruf ini dengan suara keras.' },
      { zh: '我每天读中文。', pinyin: 'Wǒ měi tiān dú Zhōngwén.', en: 'I read Chinese every day.', id: 'Saya membaca bahasa Mandarin setiap hari.' }
    ]
  },
  {
    id: wid(1, 20), level: 1, hanzi: '天', traditional: '天', pinyin: 'tiān',
    meaning: 'day; sky; heaven', meaningId: 'hari; langit',
    collocations: '今天 (jīntiān) — today; 天气 (tiānqì) — weather',
    sentences: [
      { zh: '今天星期几？', pinyin: 'Jīntiān xīngqī jǐ?', en: 'What day is today?', id: 'Hari ini hari apa?' },
      { zh: '天很蓝。', pinyin: 'Tiān hěn lán.', en: 'The sky is very blue.', id: 'Langitnya sangat biru.' }
    ]
  },

  // ═══════════════════════════════════════════
  //  HSK 2 — Elementary (20 words)
  // ═══════════════════════════════════════════
  {
    id: wid(2, 1), level: 2, hanzi: '因为', traditional: '因為', pinyin: 'yīnwèi',
    meaning: 'because', meaningId: 'karena',
    collocations: '因为…所以… (yīnwèi…suǒyǐ…) — because…therefore…',
    sentences: [
      { zh: '因为下雨，所以我没去。', pinyin: 'Yīnwèi xià yǔ, suǒyǐ wǒ méi qù.', en: "Because it rained, I didn't go.", id: 'Karena hujan, saya tidak pergi.' },
      { zh: '他很累，因为工作太多了。', pinyin: 'Tā hěn lèi, yīnwèi gōngzuò tài duō le.', en: 'He is very tired because he has too much work.', id: 'Dia sangat lelah karena pekerjaannya terlalu banyak.' }
    ]
  },
  {
    id: wid(2, 2), level: 2, hanzi: '但是', traditional: '但是', pinyin: 'dànshì',
    meaning: 'but; however', meaningId: 'tetapi; namun',
    collocations: '虽然…但是… (suīrán…dànshì…) — although…but…',
    sentences: [
      { zh: '我很想去，但是没有时间。', pinyin: 'Wǒ hěn xiǎng qù, dànshì méiyǒu shíjiān.', en: 'I really want to go, but I have no time.', id: 'Saya sangat ingin pergi, tetapi tidak punya waktu.' },
      { zh: '这个菜好看，但是不好吃。', pinyin: 'Zhège cài hǎokàn, dànshì bù hǎochī.', en: 'This dish looks nice, but it is not delicious.', id: 'Hidangan ini terlihat bagus, tetapi tidak enak.' }
    ]
  },
  {
    id: wid(2, 3), level: 2, hanzi: '已经', traditional: '已經', pinyin: 'yǐjīng',
    meaning: 'already', meaningId: 'sudah',
    collocations: '已经到了 (yǐjīng dào le) — already arrived; 已经很晚了 (yǐjīng hěn wǎn le) — already very late',
    sentences: [
      { zh: '我已经吃饭了。', pinyin: 'Wǒ yǐjīng chī fàn le.', en: 'I have already eaten.', id: 'Saya sudah makan.' },
      { zh: '他已经回家了。', pinyin: 'Tā yǐjīng huí jiā le.', en: 'He has already gone home.', id: 'Dia sudah pulang ke rumah.' }
    ]
  },
  {
    id: wid(2, 4), level: 2, hanzi: '可以', traditional: '可以', pinyin: 'kěyǐ',
    meaning: 'can; may; allowed to', meaningId: 'boleh; bisa',
    collocations: '可以吗？(kěyǐ ma?) — may I?; 不可以 (bù kěyǐ) — not allowed',
    sentences: [
      { zh: '我可以坐这里吗？', pinyin: 'Wǒ kěyǐ zuò zhèlǐ ma?', en: 'May I sit here?', id: 'Bolehkah saya duduk di sini?' },
      { zh: '这里不可以吸烟。', pinyin: 'Zhèlǐ bù kěyǐ xī yān.', en: 'Smoking is not allowed here.', id: 'Di sini tidak boleh merokok.' }
    ]
  },
  {
    id: wid(2, 5), level: 2, hanzi: '快', traditional: '快', pinyin: 'kuài',
    meaning: 'fast; quick; soon', meaningId: 'cepat; segera',
    collocations: '快乐 (kuàilè) — happy; 快要 (kuài yào) — about to',
    sentences: [
      { zh: '他跑得很快。', pinyin: 'Tā pǎo de hěn kuài.', en: 'He runs very fast.', id: 'Dia berlari sangat cepat.' },
      { zh: '快来！', pinyin: 'Kuài lái!', en: 'Come quickly!', id: 'Cepat datang!' }
    ]
  },
  {
    id: wid(2, 6), level: 2, hanzi: '慢', traditional: '慢', pinyin: 'màn',
    meaning: 'slow', meaningId: 'lambat; pelan',
    collocations: '慢慢 (màn man) — slowly; 慢走 (màn zǒu) — take care (farewell)',
    sentences: [
      { zh: '请你说慢一点。', pinyin: 'Qǐng nǐ shuō màn yìdiǎn.', en: 'Please speak more slowly.', id: 'Tolong bicara lebih pelan.' },
      { zh: '慢慢来，不着急。', pinyin: 'Màn man lái, bù zháojí.', en: "Take your time, no rush.", id: 'Pelan-pelan saja, tidak usah terburu-buru.' }
    ]
  },
  {
    id: wid(2, 7), level: 2, hanzi: '准备', traditional: '準備', pinyin: 'zhǔnbèi',
    meaning: 'to prepare; to plan', meaningId: 'mempersiapkan; bersiap',
    collocations: '准备好了 (zhǔnbèi hǎo le) — ready; 准备考试 (zhǔnbèi kǎoshì) — prepare for exam',
    sentences: [
      { zh: '你准备好了吗？', pinyin: 'Nǐ zhǔnbèi hǎo le ma?', en: 'Are you ready?', id: 'Apakah kamu sudah siap?' },
      { zh: '我在准备明天的考试。', pinyin: 'Wǒ zài zhǔnbèi míngtiān de kǎoshì.', en: "I am preparing for tomorrow's exam.", id: 'Saya sedang mempersiapkan ujian besok.' }
    ]
  },
  {
    id: wid(2, 8), level: 2, hanzi: '帮助', traditional: '幫助', pinyin: 'bāngzhù',
    meaning: 'to help; help', meaningId: 'membantu; bantuan',
    collocations: '帮助别人 (bāngzhù biérén) — help others; 互相帮助 (hùxiāng bāngzhù) — help each other',
    sentences: [
      { zh: '谢谢你的帮助！', pinyin: 'Xièxie nǐ de bāngzhù!', en: 'Thank you for your help!', id: 'Terima kasih atas bantuanmu!' },
      { zh: '我可以帮助你吗？', pinyin: 'Wǒ kěyǐ bāngzhù nǐ ma?', en: 'Can I help you?', id: 'Bisakah saya membantu kamu?' }
    ]
  },
  {
    id: wid(2, 9), level: 2, hanzi: '知道', traditional: '知道', pinyin: 'zhīdào',
    meaning: 'to know', meaningId: 'tahu; mengetahui',
    collocations: '不知道 (bù zhīdào) — don\'t know; 知道了 (zhīdào le) — understood',
    sentences: [
      { zh: '你知道他在哪里吗？', pinyin: 'Nǐ zhīdào tā zài nǎlǐ ma?', en: 'Do you know where he is?', id: 'Apakah kamu tahu dia di mana?' },
      { zh: '我不知道怎么做。', pinyin: 'Wǒ bù zhīdào zěnme zuò.', en: "I don't know how to do it.", id: 'Saya tidak tahu bagaimana melakukannya.' }
    ]
  },
  {
    id: wid(2, 10), level: 2, hanzi: '觉得', traditional: '覺得', pinyin: 'juéde',
    meaning: 'to feel; to think', meaningId: 'merasa; berpikir',
    collocations: '我觉得 (wǒ juéde) — I think; 觉得不错 (juéde búcuò) — feel it\'s quite good',
    sentences: [
      { zh: '你觉得怎么样？', pinyin: 'Nǐ juéde zěnmeyàng?', en: 'What do you think?', id: 'Menurutmu bagaimana?' },
      { zh: '我觉得这个很有意思。', pinyin: 'Wǒ juéde zhège hěn yǒu yìsi.', en: 'I think this is very interesting.', id: 'Menurutku ini sangat menarik.' }
    ]
  },

  // ═══════════════════════════════════════════
  //  HSK 3 — Intermediate (20 words)
  // ═══════════════════════════════════════════
  {
    id: wid(3, 1), level: 3, hanzi: '环境', traditional: '環境', pinyin: 'huánjìng',
    meaning: 'environment; surroundings', meaningId: 'lingkungan',
    collocations: '环境保护 (huánjìng bǎohù) — environmental protection; 学习环境 (xuéxí huánjìng) — learning environment',
    sentences: [
      { zh: '这里的环境很好。', pinyin: 'Zhèlǐ de huánjìng hěn hǎo.', en: 'The environment here is great.', id: 'Lingkungan di sini sangat bagus.' },
      { zh: '我们应该保护环境。', pinyin: 'Wǒmen yīnggāi bǎohù huánjìng.', en: 'We should protect the environment.', id: 'Kita harus melindungi lingkungan.' }
    ]
  },
  {
    id: wid(3, 2), level: 3, hanzi: '经历', traditional: '經歷', pinyin: 'jīnglì',
    meaning: 'experience; to go through', meaningId: 'pengalaman; mengalami',
    collocations: '工作经历 (gōngzuò jīnglì) — work experience; 经历困难 (jīnglì kùnnán) — go through difficulties',
    sentences: [
      { zh: '这是一次难忘的经历。', pinyin: 'Zhè shì yí cì nánwàng de jīnglì.', en: 'This is an unforgettable experience.', id: 'Ini adalah pengalaman yang tak terlupakan.' },
      { zh: '他经历了很多困难。', pinyin: 'Tā jīnglì le hěn duō kùnnán.', en: 'He went through many difficulties.', id: 'Dia mengalami banyak kesulitan.' }
    ]
  },
  {
    id: wid(3, 3), level: 3, hanzi: '关系', traditional: '關係', pinyin: 'guānxi',
    meaning: 'relationship; connection', meaningId: 'hubungan; koneksi',
    collocations: '没关系 (méi guānxi) — it doesn\'t matter; 人际关系 (rénjì guānxi) — interpersonal relationship',
    sentences: [
      { zh: '他们的关系很好。', pinyin: 'Tāmen de guānxi hěn hǎo.', en: 'Their relationship is very good.', id: 'Hubungan mereka sangat baik.' },
      { zh: '没关系，不要担心。', pinyin: 'Méi guānxi, bú yào dānxīn.', en: "It doesn't matter, don't worry.", id: 'Tidak apa-apa, jangan khawatir.' }
    ]
  },
  {
    id: wid(3, 4), level: 3, hanzi: '决定', traditional: '決定', pinyin: 'juédìng',
    meaning: 'to decide; decision', meaningId: 'memutuskan; keputusan',
    collocations: '做决定 (zuò juédìng) — make a decision; 决定权 (juédìng quán) — decision-making power',
    sentences: [
      { zh: '我决定明年去留学。', pinyin: 'Wǒ juédìng míngnián qù liúxué.', en: 'I decided to study abroad next year.', id: 'Saya memutuskan untuk belajar ke luar negeri tahun depan.' },
      { zh: '你决定好了吗？', pinyin: 'Nǐ juédìng hǎo le ma?', en: 'Have you made your decision?', id: 'Sudahkah kamu membuat keputusan?' }
    ]
  },
  {
    id: wid(3, 5), level: 3, hanzi: '其实', traditional: '其實', pinyin: 'qíshí',
    meaning: 'actually; in fact', meaningId: 'sebenarnya; pada kenyataannya',
    collocations: '其实不然 (qíshí bùrán) — actually not so; 其实很简单 (qíshí hěn jiǎndān) — actually very simple',
    sentences: [
      { zh: '其实我不太喜欢这个。', pinyin: 'Qíshí wǒ bú tài xǐhuān zhège.', en: "Actually, I don't really like this.", id: 'Sebenarnya saya tidak terlalu suka ini.' },
      { zh: '中文其实不难学。', pinyin: 'Zhōngwén qíshí bù nán xué.', en: 'Chinese is actually not hard to learn.', id: 'Bahasa Mandarin sebenarnya tidak sulit dipelajari.' }
    ]
  },
  {
    id: wid(3, 6), level: 3, hanzi: '影响', traditional: '影響', pinyin: 'yǐngxiǎng',
    meaning: 'to influence; influence', meaningId: 'mempengaruhi; pengaruh',
    collocations: '受影响 (shòu yǐngxiǎng) — to be influenced; 坏影响 (huài yǐngxiǎng) — bad influence',
    sentences: [
      { zh: '天气影响了我的心情。', pinyin: 'Tiānqì yǐngxiǎng le wǒ de xīnqíng.', en: 'The weather affected my mood.', id: 'Cuaca mempengaruhi suasana hati saya.' },
      { zh: '他对我的影响很大。', pinyin: 'Tā duì wǒ de yǐngxiǎng hěn dà.', en: 'He had a great influence on me.', id: 'Dia memberikan pengaruh yang besar pada saya.' }
    ]
  },
  {
    id: wid(3, 7), level: 3, hanzi: '需要', traditional: '需要', pinyin: 'xūyào',
    meaning: 'to need; needs', meaningId: 'membutuhkan; kebutuhan',
    collocations: '需要时间 (xūyào shíjiān) — need time; 需要帮助 (xūyào bāngzhù) — need help',
    sentences: [
      { zh: '你需要帮助吗？', pinyin: 'Nǐ xūyào bāngzhù ma?', en: 'Do you need help?', id: 'Apakah kamu butuh bantuan?' },
      { zh: '学中文需要很多练习。', pinyin: 'Xué Zhōngwén xūyào hěn duō liànxí.', en: 'Learning Chinese requires a lot of practice.', id: 'Belajar bahasa Mandarin membutuhkan banyak latihan.' }
    ]
  },
  {
    id: wid(3, 8), level: 3, hanzi: '努力', traditional: '努力', pinyin: 'nǔlì',
    meaning: 'to work hard; effort', meaningId: 'berusaha; bekerja keras',
    collocations: '努力学习 (nǔlì xuéxí) — study hard; 很努力 (hěn nǔlì) — very hardworking',
    sentences: [
      { zh: '他学习非常努力。', pinyin: 'Tā xuéxí fēicháng nǔlì.', en: 'He studies very hard.', id: 'Dia belajar dengan sangat giat.' },
      { zh: '只要你努力，就能成功。', pinyin: 'Zhǐyào nǐ nǔlì, jiù néng chénggōng.', en: 'As long as you work hard, you can succeed.', id: 'Selama kamu berusaha, kamu bisa berhasil.' }
    ]
  },
  {
    id: wid(3, 9), level: 3, hanzi: '解决', traditional: '解決', pinyin: 'jiějué',
    meaning: 'to solve; to resolve', meaningId: 'menyelesaikan; memecahkan',
    collocations: '解决问题 (jiějué wèntí) — solve a problem; 解决方法 (jiějué fāngfǎ) — solution',
    sentences: [
      { zh: '这个问题已经解决了。', pinyin: 'Zhège wèntí yǐjīng jiějué le.', en: 'This problem has been solved.', id: 'Masalah ini sudah diselesaikan.' },
      { zh: '我们一起想办法解决吧。', pinyin: 'Wǒmen yìqǐ xiǎng bànfǎ jiějué ba.', en: "Let's think of a way to solve this together.", id: 'Ayo kita cari cara menyelesaikannya bersama.' }
    ]
  },
  {
    id: wid(3, 10), level: 3, hanzi: '提高', traditional: '提高', pinyin: 'tígāo',
    meaning: 'to improve; to raise', meaningId: 'meningkatkan; menaikkan',
    collocations: '提高水平 (tígāo shuǐpíng) — improve level; 提高效率 (tígāo xiàolǜ) — increase efficiency',
    sentences: [
      { zh: '我想提高我的中文水平。', pinyin: 'Wǒ xiǎng tígāo wǒ de Zhōngwén shuǐpíng.', en: 'I want to improve my Chinese level.', id: 'Saya ingin meningkatkan kemampuan bahasa Mandarin saya.' },
      { zh: '多练习可以提高口语。', pinyin: 'Duō liànxí kěyǐ tígāo kǒuyǔ.', en: 'More practice can improve spoken language.', id: 'Banyak latihan bisa meningkatkan kemampuan berbicara.' }
    ]
  },

  // ═══════════════════════════════════════════
  //  HSK 4 — Upper-Intermediate (15 words)
  // ═══════════════════════════════════════════
  {
    id: wid(4, 1), level: 4, hanzi: '竞争', traditional: '競爭', pinyin: 'jìngzhēng',
    meaning: 'to compete; competition', meaningId: 'bersaing; persaingan',
    components: '竞 (jìng: compete) + 争 (zhēng: fight for)',
    collocations: '竞争对手 (jìngzhēng duìshǒu) — competitor; 市场竞争 (shìchǎng jìngzhēng) — market competition',
    nuances: 'Differs from 比赛 (bǐsài) which is more about a specific match/game, while 竞争 is broader ongoing competition.',
    sentences: [
      { zh: '现在的就业竞争很激烈。', pinyin: 'Xiànzài de jiùyè jìngzhēng hěn jīliè.', en: 'Job competition nowadays is very fierce.', id: 'Persaingan kerja saat ini sangat ketat.' },
      { zh: '他不怕竞争。', pinyin: 'Tā bú pà jìngzhēng.', en: 'He is not afraid of competition.', id: 'Dia tidak takut persaingan.' }
    ]
  },
  {
    id: wid(4, 2), level: 4, hanzi: '积累', traditional: '積累', pinyin: 'jīlěi',
    meaning: 'to accumulate; accumulation', meaningId: 'mengakumulasi; penumpukan',
    components: '积 (jī: to pile up) + 累 (lěi: to accumulate)',
    collocations: '积累经验 (jīlěi jīngyàn) — accumulate experience; 积累知识 (jīlěi zhīshi) — accumulate knowledge',
    nuances: 'Emphasizes gradual buildup over time, vs 收集 (shōují) which means to collect.',
    sentences: [
      { zh: '成功需要长时间的积累。', pinyin: 'Chénggōng xūyào cháng shíjiān de jīlěi.', en: 'Success requires long-term accumulation.', id: 'Kesuksesan membutuhkan akumulasi jangka panjang.' },
      { zh: '他积累了很多工作经验。', pinyin: 'Tā jīlěi le hěn duō gōngzuò jīngyàn.', en: 'He accumulated a lot of work experience.', id: 'Dia mengumpulkan banyak pengalaman kerja.' }
    ]
  },
  {
    id: wid(4, 3), level: 4, hanzi: '尊重', traditional: '尊重', pinyin: 'zūnzhòng',
    meaning: 'to respect; respect', meaningId: 'menghormati; penghargaan',
    components: '尊 (zūn: honor) + 重 (zhòng: heavy, important)',
    collocations: '互相尊重 (hùxiāng zūnzhòng) — mutual respect; 尊重别人 (zūnzhòng biérén) — respect others',
    nuances: 'More formal than 尊敬 (zūnjìng), which conveys deeper reverence. 尊重 is used for equal or general respect.',
    sentences: [
      { zh: '我们应该尊重每一个人。', pinyin: 'Wǒmen yīnggāi zūnzhòng měi yí gè rén.', en: 'We should respect everyone.', id: 'Kita harus menghormati setiap orang.' },
      { zh: '请尊重别人的意见。', pinyin: 'Qǐng zūnzhòng biérén de yìjiàn.', en: "Please respect others' opinions.", id: 'Tolong hargai pendapat orang lain.' }
    ]
  },
  {
    id: wid(4, 4), level: 4, hanzi: '效率', traditional: '效率', pinyin: 'xiàolǜ',
    meaning: 'efficiency', meaningId: 'efisiensi',
    components: '效 (xiào: effect) + 率 (lǜ: rate)',
    collocations: '工作效率 (gōngzuò xiàolǜ) — work efficiency; 提高效率 (tígāo xiàolǜ) — improve efficiency',
    sentences: [
      { zh: '早上学习效率最高。', pinyin: 'Zǎoshang xuéxí xiàolǜ zuì gāo.', en: 'Study efficiency is highest in the morning.', id: 'Efisiensi belajar paling tinggi di pagi hari.' },
      { zh: '他做事效率很高。', pinyin: 'Tā zuò shì xiàolǜ hěn gāo.', en: 'He does things very efficiently.', id: 'Dia melakukan sesuatu dengan sangat efisien.' }
    ]
  },
  {
    id: wid(4, 5), level: 4, hanzi: '联系', traditional: '聯繫', pinyin: 'liánxì',
    meaning: 'to contact; connection', meaningId: 'menghubungi; koneksi',
    components: '联 (lián: connect) + 系 (xì: tie, relate)',
    collocations: '保持联系 (bǎochí liánxì) — keep in touch; 联系方式 (liánxì fāngshì) — contact information',
    nuances: 'Used for actively reaching out, different from 关系 (guānxi) which describes an existing relationship state.',
    sentences: [
      { zh: '请跟我保持联系。', pinyin: 'Qǐng gēn wǒ bǎochí liánxì.', en: 'Please keep in touch with me.', id: 'Tolong tetap hubungi saya.' },
      { zh: '我联系不上他。', pinyin: 'Wǒ liánxì bú shàng tā.', en: "I can't reach him.", id: 'Saya tidak bisa menghubunginya.' }
    ]
  },

  // ═══════════════════════════════════════════
  //  HSK 5 — Advanced (15 words)
  // ═══════════════════════════════════════════
  {
    id: wid(5, 1), level: 5, hanzi: '频繁', traditional: '頻繁', pinyin: 'pínfán',
    meaning: 'frequent; frequently', meaningId: 'sering; frekuen',
    components: '频 (pín: frequency) + 繁 (fán: complicated, numerous)',
    collocations: '频繁出现 (pínfán chūxiàn) — appear frequently; 交往频繁 (jiāowǎng pínfán) — frequent contact',
    nuances: '常常 (chángcháng) is casual; 频繁 (pínfán) is more formal and implies high frequency, often with a negative connotation.',
    sentences: [
      { zh: '最近他频繁出差。', pinyin: 'Zuìjìn tā pínfán chūchāi.', en: 'He has been traveling for work frequently recently.', id: 'Akhir-akhir ini dia sering perjalanan dinas.' },
      { zh: '这个地区地震频繁。', pinyin: 'Zhège dìqū dìzhèn pínfán.', en: 'Earthquakes are frequent in this area.', id: 'Gempa bumi sering terjadi di daerah ini.' }
    ]
  },
  {
    id: wid(5, 2), level: 5, hanzi: '沟通', traditional: '溝通', pinyin: 'gōutōng',
    meaning: 'to communicate; communication', meaningId: 'berkomunikasi; komunikasi',
    components: '沟 (gōu: ditch/channel) + 通 (tōng: to pass through)',
    collocations: '沟通障碍 (gōutōng zhàng\'ài) — communication barrier; 有效沟通 (yǒuxiào gōutōng) — effective communication',
    nuances: 'More formal than 交流 (jiāoliú). 沟通 emphasizes reaching mutual understanding; 交流 emphasizes exchange of information.',
    sentences: [
      { zh: '学习语言是为了更好地沟通。', pinyin: 'Xuéxí yǔyán shì wèile gèng hǎo de gōutōng.', en: 'Learning a language is for better communication.', id: 'Belajar bahasa adalah untuk berkomunikasi lebih baik.' },
      { zh: '我们需要更多的沟通。', pinyin: 'Wǒmen xūyào gèng duō de gōutōng.', en: 'We need more communication.', id: 'Kita butuh lebih banyak komunikasi.' }
    ]
  },
  {
    id: wid(5, 3), level: 5, hanzi: '妥协', traditional: '妥協', pinyin: 'tuǒxié',
    meaning: 'to compromise; compromise', meaningId: 'berkompromi; kompromi',
    components: '妥 (tuǒ: proper, settled) + 协 (xié: cooperate, assist)',
    collocations: '做出妥协 (zuòchū tuǒxié) — make a compromise; 互相妥协 (hùxiāng tuǒxié) — mutual compromise',
    nuances: 'Can have negative connotation (giving up principles) or positive (finding middle ground), depending on context.',
    sentences: [
      { zh: '在这件事上，双方都需要妥协。', pinyin: 'Zài zhè jiàn shì shàng, shuāngfāng dōu xūyào tuǒxié.', en: 'Both sides need to compromise on this matter.', id: 'Dalam hal ini, kedua belah pihak perlu berkompromi.' },
      { zh: '他从不轻易妥协。', pinyin: 'Tā cóng bù qīngyì tuǒxié.', en: 'He never compromises easily.', id: 'Dia tidak pernah mudah berkompromi.' }
    ]
  },
  {
    id: wid(5, 4), level: 5, hanzi: '思维', traditional: '思維', pinyin: 'sīwéi',
    meaning: 'thinking; thought; mentality', meaningId: 'pemikiran; pola pikir',
    components: '思 (sī: think) + 维 (wéi: to maintain, dimension)',
    collocations: '思维方式 (sīwéi fāngshì) — way of thinking; 逻辑思维 (luójí sīwéi) — logical thinking',
    nuances: 'Abstract cognitive process, vs 想法 (xiǎngfǎ) which means a specific idea/opinion.',
    sentences: [
      { zh: '学习新语言可以改变思维方式。', pinyin: 'Xuéxí xīn yǔyán kěyǐ gǎibiàn sīwéi fāngshì.', en: 'Learning a new language can change your way of thinking.', id: 'Belajar bahasa baru bisa mengubah cara berpikir.' },
      { zh: '他的思维很清晰。', pinyin: 'Tā de sīwéi hěn qīngxī.', en: 'His thinking is very clear.', id: 'Pola pikirnya sangat jernih.' }
    ]
  },
  {
    id: wid(5, 5), level: 5, hanzi: '依赖', traditional: '依賴', pinyin: 'yīlài',
    meaning: 'to rely on; dependence', meaningId: 'bergantung; ketergantungan',
    components: '依 (yī: according to, lean on) + 赖 (lài: rely on)',
    collocations: '依赖性 (yīlài xìng) — dependency; 过度依赖 (guòdù yīlài) — over-reliance',
    nuances: 'Usually has a slightly negative nuance (over-dependence). 依靠 (yīkào) is more neutral, meaning to rely on for support.',
    sentences: [
      { zh: '不要太依赖别人。', pinyin: 'Bú yào tài yīlài biérén.', en: "Don't rely on others too much.", id: 'Jangan terlalu bergantung pada orang lain.' },
      { zh: '现代人很依赖手机。', pinyin: 'Xiàndài rén hěn yīlài shǒujī.', en: 'Modern people are very dependent on phones.', id: 'Orang modern sangat bergantung pada ponsel.' }
    ]
  },

  // ═══════════════════════════════════════════
  //  HSK 6 — Mastery (15 words)
  // ═══════════════════════════════════════════
  {
    id: wid(6, 1), level: 6, hanzi: '潜移默化', traditional: '潛移默化', pinyin: 'qiányí mòhuà',
    meaning: 'to influence subtly; subtle transformation', meaningId: 'mempengaruhi secara halus; transformasi tak terasa',
    components: '潜 (qián: hidden) + 移 (yí: move) + 默 (mò: silent) + 化 (huà: change)',
    collocations: '潜移默化的影响 — subtle influence; 潜移默化地改变 — change imperceptibly',
    nuances: 'A 成语 (chéngyǔ, idiom). Describes gradual, imperceptible influence, often positive. Used in formal or literary Chinese.',
    sentences: [
      { zh: '父母的行为对孩子有潜移默化的影响。', pinyin: 'Fùmǔ de xíngwéi duì háizi yǒu qiányí mòhuà de yǐngxiǎng.', en: "Parents' behavior has a subtle influence on children.", id: 'Perilaku orang tua memiliki pengaruh yang halus terhadap anak-anak.' },
      { zh: '文化是在潜移默化中传播的。', pinyin: 'Wénhuà shì zài qiányí mòhuà zhōng chuánbō de.', en: 'Culture spreads through subtle, imperceptible influence.', id: 'Budaya menyebar melalui pengaruh halus yang tak terasa.' }
    ]
  },
  {
    id: wid(6, 2), level: 6, hanzi: '根深蒂固', traditional: '根深蒂固', pinyin: 'gēnshēn dìgù',
    meaning: 'deep-rooted; ingrained', meaningId: 'mengakar dalam; sudah tertanam kuat',
    components: '根 (gēn: root) + 深 (shēn: deep) + 蒂 (dì: stem/base) + 固 (gù: firm)',
    collocations: '根深蒂固的观念 — deep-rooted concept; 根深蒂固的偏见 — ingrained prejudice',
    nuances: 'A 成语 that describes beliefs or habits so deeply established they are very hard to change. Can be neutral or negative.',
    sentences: [
      { zh: '这种观念在社会中已经根深蒂固。', pinyin: 'Zhè zhǒng guānniàn zài shèhuì zhōng yǐjīng gēnshēn dìgù.', en: 'This concept has become deeply rooted in society.', id: 'Konsep ini sudah mengakar dalam di masyarakat.' },
      { zh: '要改变根深蒂固的习惯很难。', pinyin: 'Yào gǎibiàn gēnshēn dìgù de xíguàn hěn nán.', en: 'It is very difficult to change deeply ingrained habits.', id: 'Sangat sulit mengubah kebiasaan yang sudah mengakar kuat.' }
    ]
  },
  {
    id: wid(6, 3), level: 6, hanzi: '循序渐进', traditional: '循序漸進', pinyin: 'xúnxù jiànjìn',
    meaning: 'to proceed step by step; gradual progress', meaningId: 'melangkah secara bertahap; kemajuan bertahap',
    components: '循 (xún: follow) + 序 (xù: order) + 渐 (jiàn: gradually) + 进 (jìn: advance)',
    collocations: '循序渐进地学习 — study step by step; 循序渐进的方法 — gradual approach',
    nuances: 'This 成语 emphasizes proper, orderly progression. Positive connotation, used to advise patience and systematic learning.',
    sentences: [
      { zh: '学语言要循序渐进，不能急于求成。', pinyin: 'Xué yǔyán yào xúnxù jiànjìn, bù néng jí yú qiú chéng.', en: 'Language learning should be gradual; you cannot rush for results.', id: 'Belajar bahasa harus bertahap, tidak bisa terburu-buru mengejar hasil.' },
      { zh: '老师建议我们循序渐进地练习。', pinyin: 'Lǎoshī jiànyì wǒmen xúnxù jiànjìn de liànxí.', en: 'The teacher suggested we practice step by step.', id: 'Guru menyarankan kita berlatih secara bertahap.' }
    ]
  },
  {
    id: wid(6, 4), level: 6, hanzi: '鞠躬尽瘁', traditional: '鞠躬盡瘁', pinyin: 'jūgōng jìncuì',
    meaning: 'to devote oneself wholeheartedly (until death)', meaningId: 'mengabdikan diri sepenuh hati',
    components: '鞠 (jū: bow) + 躬 (gōng: body) + 尽 (jìn: exhaust) + 瘁 (cuì: overworked)',
    collocations: '鞠躬尽瘁，死而后已 — devote until death (full version)',
    nuances: 'Literary/formal 成语 from Zhuge Liang\'s 出师表. Describes ultimate dedication to a cause or duty. Very formal and elevated register.',
    sentences: [
      { zh: '他为教育事业鞠躬尽瘁。', pinyin: 'Tā wèi jiàoyù shìyè jūgōng jìncuì.', en: 'He devoted himself wholeheartedly to the cause of education.', id: 'Dia mengabdikan dirinya sepenuhnya untuk dunia pendidikan.' },
      { zh: '这位领导为国家鞠躬尽瘁。', pinyin: 'Zhè wèi lǐngdǎo wèi guójiā jūgōng jìncuì.', en: 'This leader devoted himself wholeheartedly to the country.', id: 'Pemimpin ini mengabdikan dirinya sepenuhnya untuk negara.' }
    ]
  },
  {
    id: wid(6, 5), level: 6, hanzi: '瞻仰', traditional: '瞻仰', pinyin: 'zhānyǎng',
    meaning: 'to look up to with reverence; to pay respects', meaningId: 'menjunjung tinggi; memandang dengan hormat',
    components: '瞻 (zhān: to gaze) + 仰 (yǎng: to look up)',
    collocations: '瞻仰遗容 (zhānyǎng yíróng) — pay last respects; 瞻仰故居 (zhānyǎng gùjū) — visit a former residence in tribute',
    nuances: 'Very formal. Used for paying respects to the deceased, monuments, or historical figures. Not used casually.',
    sentences: [
      { zh: '每年都有很多人去瞻仰烈士纪念碑。', pinyin: 'Měi nián dōu yǒu hěn duō rén qù zhānyǎng lièshì jìniànbēi.', en: 'Every year many people go to pay tribute at the martyrs\' monument.', id: 'Setiap tahun banyak orang pergi menghormati tugu pahlawan.' },
      { zh: '我们去瞻仰了鲁迅先生的故居。', pinyin: 'Wǒmen qù zhānyǎng le Lǔ Xùn xiānshēng de gùjū.', en: "We went to visit Mr. Lu Xun's former residence in tribute.", id: 'Kami pergi mengunjungi bekas kediaman Tuan Lu Xun untuk penghormatan.' }
    ]
  },
  {
    id: wid(6, 6), level: 6, hanzi: '推陈出新', traditional: '推陳出新', pinyin: 'tuīchén chūxīn',
    meaning: 'to innovate; bring forth the new by discarding the old', meaningId: 'berinovasi; mengeluarkan yang baru dengan membuang yang lama',
    components: '推 (tuī: push) + 陈 (chén: old, stale) + 出 (chū: come out) + 新 (xīn: new)',
    collocations: '不断推陈出新 — keep innovating; 推陈出新的产品 — innovative products',
    nuances: 'Positive connotation. Emphasizes building on tradition while creating something new. Common in business and cultural contexts.',
    sentences: [
      { zh: '科技公司需要不断推陈出新。', pinyin: 'Kējì gōngsī xūyào búduàn tuīchén chūxīn.', en: 'Tech companies need to constantly innovate.', id: 'Perusahaan teknologi perlu terus berinovasi.' },
      { zh: '传统文化也要推陈出新。', pinyin: 'Chuántǒng wénhuà yě yào tuīchén chūxīn.', en: 'Traditional culture also needs innovation.', id: 'Budaya tradisional juga perlu berinovasi.' }
    ]
  },
  {
    id: wid(6, 7), level: 6, hanzi: '坚韧不拔', traditional: '堅韌不拔', pinyin: 'jiānrèn bùbá',
    meaning: 'firm and indomitable; unyielding perseverance', meaningId: 'tangguh dan tak tergoyahkan; kegigihan yang tak kenal menyerah',
    components: '坚 (jiān: firm) + 韧 (rèn: tenacious) + 不 (bù: not) + 拔 (bá: pull out)',
    collocations: '坚韧不拔的意志 — indomitable will; 坚韧不拔的精神 — persevering spirit',
    nuances: 'A highly positive 成语 describing someone who never gives up despite extreme difficulty. Used for commendation.',
    sentences: [
      { zh: '她用坚韧不拔的精神克服了一切困难。', pinyin: 'Tā yòng jiānrèn bùbá de jīngshén kèfú le yíqiè kùnnán.', en: 'She overcame all difficulties with an indomitable spirit.', id: 'Dia mengatasi semua kesulitan dengan semangat pantang menyerah.' },
      { zh: '成功的人都有坚韧不拔的毅力。', pinyin: 'Chénggōng de rén dōu yǒu jiānrèn bùbá de yìlì.', en: 'Successful people all have unyielding perseverance.', id: 'Orang-orang sukses semua memiliki kegigihan yang tak kenal menyerah.' }
    ]
  },
  {
    id: wid(6, 8), level: 6, hanzi: '斟酌', traditional: '斟酌', pinyin: 'zhēnzhuó',
    meaning: 'to deliberate; to consider carefully', meaningId: 'mempertimbangkan dengan cermat; mempertimbangkan',
    components: '斟 (zhēn: to pour, to examine) + 酌 (zhuó: to deliberate, to pour wine)',
    collocations: '斟酌用词 (zhēnzhuó yòngcí) — choose words carefully; 反复斟酌 (fǎnfù zhēnzhuó) — deliberate repeatedly',
    nuances: 'Formal. Used for careful consideration of wording, decisions, or plans. More refined than simply 考虑 (kǎolǜ).',
    sentences: [
      { zh: '这篇文章的每个词都经过仔细斟酌。', pinyin: 'Zhè piān wénzhāng de měi gè cí dōu jīngguò zǐxì zhēnzhuó.', en: 'Every word in this article was carefully deliberated.', id: 'Setiap kata dalam artikel ini telah dipertimbangkan dengan cermat.' },
      { zh: '这件事我还需要再斟酌一下。', pinyin: 'Zhè jiàn shì wǒ hái xūyào zài zhēnzhuó yíxià.', en: 'I still need to deliberate on this matter a bit more.', id: 'Saya masih perlu mempertimbangkan hal ini lebih lanjut.' }
    ]
  },
];

/**
 * Utility: Get all words for a specific HSK level or set of levels.
 */
export function getWordsByLevels(levels: number[]): HskWord[] {
  return hskMasterData.filter(w => levels.includes(w.level));
}

/**
 * Utility: Get a random word from specific levels.
 */
export function getRandomWord(levels: number[]): HskWord {
  const pool = getWordsByLevels(levels);
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * HSK Level metadata
 */
export const HSK_LEVELS = [
  { level: 1, name: 'HSK 1', label: 'Beginner', color: '#22c55e', words: 150 },
  { level: 2, name: 'HSK 2', label: 'Elementary', color: '#3b82f6', words: 150 },
  { level: 3, name: 'HSK 3', label: 'Intermediate', color: '#f59e0b', words: 300 },
  { level: 4, name: 'HSK 4', label: 'Upper-Intermediate', color: '#ef4444', words: 600 },
  { level: 5, name: 'HSK 5', label: 'Advanced', color: '#8b5cf6', words: 1300 },
  { level: 6, name: 'HSK 6', label: 'Mastery', color: '#d97706', words: 2500 },
] as const;
