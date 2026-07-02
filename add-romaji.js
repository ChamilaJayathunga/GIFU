const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

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
  'わ':'wa','を':'wo','ん':'n','が':'ga','ぎ':'gi',
  'ぐ':'gu','げ':'ge','ご':'go','ざ':'za','じ':'ji',
  'ず':'zu','ぜ':'ze','ぞ':'zo','だ':'da','ぢ':'ji',
  'づ':'zu','で':'de','ど':'do','ば':'ba','び':'bi',
  'ぶ':'bu','べ':'be','ぼ':'bo','ぱ':'pa','ぴ':'pi',
  'ぷ':'pu','ぺ':'pe','ぽ':'po','ゃ':'ya','ゅ':'yu',
  'ょ':'yo','っ':'','ー':'～',
  'ア':'a','イ':'i','ウ':'u','エ':'e','オ':'o',
  'カ':'ka','キ':'ki','ク':'ku','ケ':'ke','コ':'ko',
  'サ':'sa','シ':'shi','ス':'su','セ':'se','ソ':'so',
  'タ':'ta','チ':'chi','ツ':'tsu','テ':'te','ト':'to',
  'ナ':'na','ニ':'ni','ヌ':'nu','ネ':'ne','ノ':'no',
  'ハ':'ha','ヒ':'hi','フ':'fu','ヘ':'he','ホ':'ho',
  'マ':'ma','ミ':'mi','ム':'mu','メ':'me','モ':'mo',
  'ヤ':'ya','ユ':'yu','ヨ':'yo',
  'ラ':'ra','リ':'ri','ル':'ru','レ':'re','ロ':'ro',
  'ワ':'wa','ヲ':'wo','ン':'n','ガ':'ga','ギ':'gi',
  'グ':'gu','ゲ':'ge','ゴ':'go','ザ':'za','ジ':'ji',
  'ズ':'zu','ゼ':'ze','ゾ':'zo','ダ':'da','ヂ':'ji',
  'ヅ':'zu','デ':'de','ド':'do','バ':'ba','ビ':'bi',
  'ブ':'bu','ベ':'be','ボ':'bo','パ':'pa','ピ':'pi',
  'プ':'pu','ペ':'pe','ポ':'po','ャ':'ya','ュ':'yu',
  'ョ':'yo','ッ':'','ー':'～'
};

const sm = { 'ゃ':'a','ゅ':'u','ょ':'o','ャ':'a','ュ':'u','ョ':'o' };

function toRomajiText(text) {
  let r = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch in sm && r.length > 0) {
      r = r.slice(0, -1) + sm[ch];
    } else if (ch === 'っ' || ch === 'ッ') {
      if (i + 1 < text.length && kanaToRomaji[text[i+1]]) {
        const nxt = kanaToRomaji[text[i+1]];
        if (nxt && nxt.length > 0 && nxt !== '～') r += nxt[0];
      }
    } else if (kanaToRomaji[ch] !== undefined) {
      r += kanaToRomaji[ch];
    } else if (/[a-zA-Z0-9]/.test(ch)) {
      r += ch.toLowerCase();
    } else if (ch === ' ') {
      r += ' ';
    }
  }
  return r;
}

const romajiMap = {
  "スリランカ の ホテル で レセプション として はたらいていました。いま も おなじ しごと を つづけて います。ホテル の なまえ は クイーンズホテル です。キャンディ に あります。": "Suriranka no hoteru de resepushon toshite hatarai te imashita. Ima mo onaji shigoto wo tsuzukete imasu. Hoteru no namae wa Kuiinzu hoteru desu. Kyandi ni arimasu.",
  "わたし は ちいさい ころ から、にほん に いく の が ゆめ でした。にほん の ぶんか や、すばらしい おもてなし の サービス に きょうみ が あります。おきゃくさま に よろこんで いただける ような サービス の ぎじゅつ を まなびたい と おもいます。その ため に にほん を えらびました。": "Watashi wa chiisai koro kara, Nihon ni iku no ga yume deshita. Nihon no bunka ya, subarashii omotenashi no saabisu ni kyoumi ga arimasu. Okyakusama ni yorokonde itadakeru youna saabisu no gijutsu wo manabitai to omoimasu. Sono tame ni Nihon wo erabimashita.",
  "わたし の ちょうしょ は せきにんかん が ある ところ です。まかせた しごと を さいご まで やりとげます。あと あたらしい こと を はやく まなべます。（たとえば、ホテル の システム や マナー を はやく おぼえられます。）いぜん クイーンズホテル で レセプション の しごと を したとき むずかしい もんだい が おきて も あわてずに れいせいに たいおうし かいけつ する ことが できました。この ちょうしょ を いかして にほん で も せきにん を もって はたらきたい です。": "Watashi no chousho wa sekininkan ga aru tokoro desu. Makaseta shigoto wo saigo made yaritogemasu. Ato atarashii koto wo hayaku manabemasu. (Tatoeba, hoteru no shisutemu ya manaa wo hayaku oboeraremasu.) Izen Kuiinzu hoteru de resepushon no shigoto wo shita toki muzukashii mondai ga okite mo awatezu ni reisei ni taiou shi kaiketsu suru koto ga dekimashita. Kono chousho wo ikashite Nihon de mo sekinin wo motte hatarakitai desu.",
  "わたし の たんしょ は しごと に しゅうちゅう しすぎる ところ です。いま は じかん の バランス を いしき しながら しごと を するように こころがけて います。ひとつ ひとつ の しごと を きにしすぎて じかん が かかる こと が ある から です。": "Watashi no tansho wa shigoto ni shuuchuu shisugiru tokoro desu. Ima wa jikan no baransu wo ishiki shinagara shigoto wo suru youni kokorogakete imasu. Hitotsu hitotsu no shigoto wo kini shisugite jikan ga kakaru koto ga aru kara desu.",
  "ぎふけん は、しぜん が とても うつくしい と ききました。とくに、しらかわごう の ふるい、にほん の いえ を みて みたい です。そして、ぎふ の ひと は とても やさしい と ききました から、ぎふ で はたらきたい です。": "Gifu-ken wa, shizen ga totemo utsukushii to kikimashita. Tokuni, Shirakawago no furui, Nihon no ie wo mite mitai desu. Soshite, Gifu no hito wa totemo yasashii to kikimashita kara, Gifu de hatarakitai desu.",
  "はい、えいご は はなす こと が できます。びじねす かいわ や、ホテル の しごと で の かいわ も だいじょうぶ です。": "Hai, eigo wa hanasu koto ga dekimasu. Bijinesu kaiwa ya, hoteru no shigoto de no kaiwa mo daijoubu desu.",
  "わたし の しゅみ は あたらしい てくのろじー を まなぶ こと と、えーあい を つかって ビデオ や がぞう を つくる こと です。": "Watashi no shumi wa atarashii tekunorojii wo manabu koto to, eiai wo tsukatte bideo ya gazou wo tsukuru koto desu.",
  "はい、やきん や シフト きんむ は まったく もんだい ありません。だいじょうぶ です。": "Hai, yakin ya shifuto kinmu wa mattaku mondai arimasen. Daijoubu desu.",
  "いいえ、たべもの の アレルギー は ありません。だんじき も しません ので、しごと に えいきょう は ありません。": "Iie, tabemono no arerugii wa arimasen. Danjiki mo shimasen node, shigoto ni eikyou wa arimasen.",
  "はい、まいにち、じてんしゃ に のる こと も、ながい きょり を あるく こと も だいじょうぶ です。": "Hai, mainichi, jitensha ni noru koto mo, nagai kyori wo aruku koto mo daijoubu desu.",
  "はい、まったく もんだい ありません。すでに ホテル には「にほん で はたらく ため に やめる」と つたえて あります。": "Hai, mattaku mondai arimasen. Sude ni hoteru ni wa \"Nihon de hataraku tame ni yameru\" to tsutaete arimasu.",
  "ほんじつはおじかんをいただき、ありがとうございました。": "Honjitsu wa ojikan wo itadaki, arigatou gozaimashita.",
  "はい、ホテルの しごとを はじめる まえに なにか じゅんびして おくことは ありますか。": "Hai, hoteru no shigoto wo hajimeru mae ni, nanika junbi shite oku koto wa arimasu ka?",
  "はい、できます。いつも すまーとほん で ぐーぐるまっぷ や なびげーしょん を つかって います。": "Hai, dekimasu. Itsumo sumaatohon de Guuguru Mappu ya nabigeeshon wo tsukatte imasu.",
  "まず けいさつ に れんらく します。そのあと かいしゃ に れんらく します。けがにん が いれば きゅうきゅうしゃ を よびます。": "Mazu keisatsu ni renraku shimasu. Sonoato kaisha ni renraku shimasu. Keganin ga ireba kyuukyuusha wo yobimasu.",
  "いいえ、けっこん して いません。どくしん です。": "Iie, kekkon shite imasen. Dokushin desu.",
  "はい、かぞく は みんな さんせい して いて、おうえん して くれて います。": "Hai, kazoku wa minna sansei shite ite, ouen shite kurete imasu.",
  "できれば じゅうごねん いじょう、ながく はたらきたい と おもって おります。にほん の せいかつ や しごと に なれて、ずっと がんばります。": "Dekireba juugonen ijou, nagaku hatarakitai to omotte orimasu. Nihon no seikatsu ya shigoto ni narete, zutto ganbarimasu.",
  "はい、まったく もんだい ありません。だいじょうぶ です。": "Hai, mattaku mondai arimasen. Daijoubu desu."
};

// Add romaji field to each question
html = html.replace(/(const questions = \[[\s\S]*?\];)/, (match) => {
  return match.replace(/"answer":\s*"([^"]+)"/g, (_, answer) => {
    const romaji = romajiMap[answer] || toRomajiText(answer);
    return `"answer": "${answer}",\n    "romaji": "${romaji}"`;
  });
});

fs.writeFileSync('index.html', html);
console.log('Done! Added romaji fields.');
