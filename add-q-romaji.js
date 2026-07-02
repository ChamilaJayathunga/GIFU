const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const kanaToRomaji = {
  'あ':'a','い':'i','う':'u','え':'e','お':'o',
  'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
  'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
  'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
  'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
  'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
  'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
  'や':'ya','ゆ':'yu','よ':'yo',
  'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
  'わ':'wa','を':'wo','ん':'n',
  'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
  'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
  'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
  'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
  'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
  'ゃ':'ya','ゅ':'yu','ょ':'yo','っ':'','ー':'～',
  'ア':'a','イ':'i','ウ':'u','エ':'e','オ':'o',
  'カ':'ka','キ':'ki','ク':'ku','ケ':'ke','コ':'ko',
  'サ':'sa','シ':'shi','ス':'su','セ':'se','ソ':'so',
  'タ':'ta','チ':'chi','ツ':'tsu','テ':'te','ト':'to',
  'ナ':'na','ニ':'ni','ヌ':'nu','ネ':'ne','ノ':'no',
  'ハ':'ha','ヒ':'hi','フ':'fu','ヘ':'he','ホ':'ho',
  'マ':'ma','ミ':'mi','ム':'mu','メ':'me','モ':'mo',
  'ヤ':'ya','ユ':'yu','ヨ':'yo',
  'ラ':'ra','リ':'ri','ル':'ru','レ':'re','ロ':'ro',
  'ワ':'wa','ヲ':'wo','ン':'n',
  'ガ':'ga','ギ':'gi','グ':'gu','ゲ':'ge','ゴ':'go',
  'ザ':'za','ジ':'ji','ズ':'zu','ゼ':'ze','ゾ':'zo',
  'ダ':'da','ヂ':'ji','ヅ':'zu','デ':'de','ド':'do',
  'バ':'ba','ビ':'bi','ブ':'bu','ベ':'be','ボ':'bo',
  'パ':'pa','ピ':'pi','プ':'pu','ペ':'pe','ポ':'po',
  'ャ':'ya','ュ':'yu','ョ':'yo','ッ':'','ー':'～'
};
const sm = { 'ゃ':'a','ゅ':'u','ょ':'o','ャ':'a','ュ':'u','ョ':'o' };

function toRomajiText(text) {
  let r = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch in sm && r.length > 0) {
      r = r.slice(0, -1) + sm[ch];
    } else if ((ch === 'っ' || ch === 'ッ') && i + 1 < text.length && kanaToRomaji[text[i + 1]] && kanaToRomaji[text[i + 1]].length > 0 && kanaToRomaji[text[i + 1]] !== '～') {
      r += kanaToRomaji[text[i + 1]][0];
    } else if (kanaToRomaji[ch] !== undefined) {
      r += kanaToRomaji[ch];
    } else if (/[a-zA-Z0-9]/.test(ch)) {
      r += ch.toLowerCase();
    } else if (ch === ' ') {
      r += ' ';
    } else if (ch === '/') {
      r += ' / ';
    } else {
      r += ch;
    }
  }
  return r;
}

const qRomajiMap = {
  'どんな しごと を していました か。／ しごと の けいけん を おしえて ください。': 'Donna shigoto wo shiteimashita ka? / Shigoto no keiken wo oshiete kudasai.',
  'なぜ にほん で はたらきたい です か。': 'Naze Nihon de hatarakitai desu ka?',
  'あなた の ちょうしょ を おしえて ください。': 'Anata no chousho wo oshiete kudasai.',
  'あなた の たんしょ を おしえて ください。': 'Anata no tansho wo oshiete kudasai.',
  'ぎふけん に ついて なにか しっています か。／ なぜ ぎふ で はたらきたい です か。': 'Gifu-ken ni tsuite nanika shitte imasu ka? / Naze Gifu de hatarakitai desu ka?',
  'えいご は できます か。': 'Eigo wa dekimasu ka?',
  'あなたの しゅみは なんですか。': 'Anata no shumi wa nan desu ka?',
  'シフトきんむ は だいじょうぶ です か。': 'Shifuto kinmu wa daijoubu desu ka?',
  'アレルギー や だんじき は あります か。': 'Arerugii ya danjiki wa arimasu ka?',
  'じてんしゃ に のる こと や あるく こと は だいじょうぶ です か。': 'Jitensha ni noru koto ya aruku koto wa daijoubu desu ka?',
  'いま の しごと を やめる こと に もんだい は ありません か。': 'Ima no shigoto wo yameru koto ni mondai wa arimasen ka?',
  'めんせつ の おわり に：ほんじつはおじかんをいただき、ありがとうございました。': 'Mensetsu no owari ni: Honjitsu wa ojikan wo itadaki, arigatou gozaimashita.',
  'かいしゃ に しつもん したいこと は ありますか。（ぎゃくしつもん）': 'Kaisha ni shitsumon shitai koto wa arimasu ka? (Gyaku shitsumon)',
  'けいたい で ぐーぐるまっぷ を つかう こと が できます か。': 'Keitai de Guuguru Mappu wo tsukau koto ga dekimasu ka?',
  'じこ が あった とき、 なに を しなければ なりませんか。': 'Jiko ga atta toki, nani wo shinakereba narimasen ka?',
  'どくしん です か。／ けっこん して います か。': 'Dokushin desu ka? / Kekkon shite imasu ka?',
  'にほん へ いく こと に ついて かぞく の どうい は あります か。': 'Nihon e iku koto ni tsuite kazoku no doui wa arimasu ka?',
  'にほん で どのくらい はたらきたい です か。': 'Nihon de dono kurai hatarakitai desu ka?',
  'きょうゆう せいかつ は だいじょうぶ です か。': 'Kyouyuu seikatsu wa daijoubu desu ka?'
};

const s = html.indexOf('const questions = [');
const e = html.indexOf('];', s);
const arr = JSON.parse(html.substring(html.indexOf('[', s), e + 1));
const indent = '    ';

let newHtml = html.substring(0, s) + 'const questions = [\n';
arr.forEach((q, i) => {
  const qRomajiRaw = qRomajiMap[q.question] || toRomajiText(q.question);
  const qRomaji = qRomajiRaw.replace(/"/g, '\\"');
  const question = q.question.replace(/"/g, '\\"');
  const answer = q.answer.replace(/"/g, '\\"');
  const romaji = q.romaji.replace(/"/g, '\\"');
  const sinhala = q.sinhala;
  newHtml += indent + '{\n';
  newHtml += indent + '  "label": "' + q.label + '",\n';
  newHtml += indent + '  "question": "' + question + '",\n';
  newHtml += indent + '  "questionRomaji": "' + qRomaji + '",\n';
  newHtml += indent + '  "answer": "' + answer + '",\n';
  newHtml += indent + '  "romaji": "' + romaji + '",\n';
  newHtml += indent + '  "sinhala": "' + sinhala + '"\n';
  newHtml += indent + '}' + (i < arr.length - 1 ? ',' : '') + '\n';
});
newHtml += '];' + html.substring(e + 2);

fs.writeFileSync('index.html', newHtml);
console.log('Done');
