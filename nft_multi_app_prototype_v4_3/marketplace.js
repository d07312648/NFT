/* PassMarket：暗号資産（ETH）でNFTを売買できるマーケットプレイス（研究用の疑似取引）
   app.js より先に読み込む。app.js の state・関数は呼び出し時にのみ参照する。 */
const MARKET_STATE_VERSION=1;
const MARKET_FEE_RATE=.025;
const MARKET_MIN_PRICE=.0001;
const MARKET_MAX_PRICE=999;
const TICKET_RESALE_CAP_RATIO=1;
const MARKET_TX_MS=2400;
const TRADE_TRANSFER_MIN_ETH=.001;
const TRADE_TRANSFER_DELAY_MS=7000;
const MARKET_SALE_FAST_SECONDS=12;
const MARKET_SALE_SLOW_SECONDS=45;
const MARKET_INCOMING_OFFER_LIMIT=3;
const MARKET_OFFER_ACCEPT_RATIO=.9;
const MARKET_ACTIVITY_LIMIT=400;
const MARKET_BACKGROUND_MIN_MS=15000;
const MARKET_BACKGROUND_MAX_MS=26000;
const MARKET_TIER_MULT=[1,1.35,2.1,3.6,7.5];
const MARKET_TIER_WEIGHTS=[55,25,12,6,2];
const MARKET_DAY_MS=86400000;
const MARKET_CONDUIT_ADDRESS="0x1E0049783F008A0085193E00003D00CD54003C71";
const MARKET_EXCHANGE_DEPOSIT_ADDRESS="0x4E6F7661C1D2E3F4A5B6C7D8E9F0A1B2C3D4E5F6";
const MARKET_HANDLES=["sakura_collector","tokyo_nft_fan","momo_lover","kaito_nft","haru_collects","neon_drifter","fujiyama_art","ramen_maxi","yuki_gallery","osaka_minter","shibuya_whale","umi_and_sora","kyoto_kura","midori_dao","nagi_records","tsubasa_cards","hikari_pass","rin_pixel","sora_bridge","akari_onchain","ren_ukiyoe","mei_collective","taku_vault","nana_stamp","hina_wave","aoi_frames","riku_moon","kotone_fm"];
const MARKET_CATEGORIES=[["all","すべて"],["ticket","チケット"],["art","アート"],["game","ゲーム"],["music","音楽"],["local","地域・観光"],["membership","会員権"]];
const MARKET_COLLECTIONS=[
  {id:"nova-live",kind:"ticket",ticketId:"nova-live",category:"ticket",name:"NOVA LIVE 2026",creator:"NOVA LIVE 実行委員会",royalty:.05,demand:.97,supply:12000,count:7,verified:true,description:"NOVA LIVE 2026 の公式NFTチケット。公式リセールとして定価を上限に再販でき、売買のたびに販売額の5%が主催者へ還元されます。"},
  {id:"digital-art",kind:"ticket",ticketId:"digital-art",category:"ticket",name:"TOKYO DIGITAL ART NIGHT",creator:"TOKYO DIGITAL ART NIGHT 実行委員会",royalty:.05,demand:.92,supply:3000,count:7,verified:true,description:"TOKYO DIGITAL ART NIGHT の公式NFTチケット。定価を上限とした公式リセールに対応しています。"},
  {id:"skyline-fest",kind:"ticket",ticketId:"skyline-fest",category:"ticket",name:"SKYLINE MUSIC FEST",creator:"SKYLINE MUSIC FEST 事務局",royalty:.05,demand:.95,supply:20000,count:7,verified:true,description:"SKYLINE MUSIC FEST の公式NFTチケット。行けなくなった場合も、定価以内で安全に譲渡できます。"},
  {id:"creator-expo",kind:"ticket",ticketId:"creator-expo",category:"ticket",name:"ANIME CREATOR EXPO",creator:"ANIME CREATOR EXPO 運営事務局",royalty:.05,demand:.9,supply:8000,count:7,verified:true,description:"ANIME CREATOR EXPO の公式NFTチケット。デジタルパンフレットと抽選参加権が付いています。"},
  {id:"light-show",kind:"ticket",ticketId:"light-show",category:"ticket",name:"BAY AREA LIGHT SHOW",creator:"BAY AREA LIGHT SHOW 実行委員会",royalty:.05,demand:.88,supply:5000,count:7,verified:true,description:"BAY AREA LIGHT SHOW の公式NFTチケット。提携施設のクーポンが付いた観光・ナイトイベントのチケットです。"},
  {id:"nexus-future-pass",kind:"ticket",ticketId:"nexus-future-pass",category:"ticket",name:"NEXUS FUTURE PASS",creator:"Nexus Gateway",royalty:.05,floorBase:.033,noCap:true,supply:1000,count:6,verified:true,description:"NFTチケットを3枚購入した人に配布された限定エアドロップNFT。未来体験への特別アクセス権が付いています。"},
  {id:"momo-pixel",kind:"art",style:"pixel",category:"game",name:"MOMO PIXEL FRIENDS",creator:"Studio Momo",royalty:.05,floorBase:.0125,supply:3333,count:12,verified:true,description:"マスコット「モモ」と仲間たちの、3,333体のピクセルアートアバター。耳・目・アクセサリーの組み合わせで、見た目とレア度が1体ずつ異なります。"},
  {id:"neo-tokyo",kind:"art",style:"skyline",category:"art",name:"NEO TOKYO NIGHTS",creator:"Kei Arakawa",royalty:.075,floorBase:.022,supply:1000,count:12,verified:true,description:"夜の東京をテーマにしたジェネラティブアート。時間帯・天気・ランドマークの組み合わせで、1点ずつ異なる街並みが描かれています。"},
  {id:"wave-genesis",kind:"art",style:"wave",category:"art",name:"WAVE GENESIS",creator:"generative.jp",royalty:.05,floorBase:.044,supply:512,count:12,verified:true,description:"コードで描かれた波の抽象画。512点限定のジェネラティブアートコレクションです。"},
  {id:"fuji-views",kind:"art",style:"fuji",category:"art",name:"FUJI 36 VIEWS",creator:"Ukiyo Lab",royalty:.06,floorBase:.018,supply:3600,count:12,verified:false,description:"浮世絵の「富嶽三十六景」をモチーフにした風景アート。季節・時刻・前景の組み合わせで全3,600点が発行されています。"},
  {id:"star-card",kind:"art",style:"card",category:"game",name:"STAR CARD ARENA",creator:"Arena Studio",royalty:.05,floorBase:.0033,supply:50000,count:14,verified:true,tierMult:[1,1.8,4,9,25],description:"デジタルトレーディングカード。N・R・SR・SSR・URの5段階のレアリティがあり、レアなカードほど高値で取引されます。"},
  {id:"furusato-goshuin",kind:"art",style:"goshuin",category:"local",name:"ふるさと御朱印NFT",creator:"ふるさとNFT推進協議会",royalty:.1,floorBase:.0055,supply:8000,count:12,verified:true,description:"全国の観光地を訪れた記念に発行される御朱印NFT。クリエイター収益（10%）は、各地域の観光振興に活用されます。"},
  {id:"sound-drop",kind:"art",style:"record",category:"music",name:"SOUND DROP RECORDS",creator:"Sound Drop",royalty:.08,floorBase:.0083,supply:2400,count:12,verified:false,description:"インディーアーティストの楽曲を、レコードジャケット型のNFTとして販売。限定盤やサイン入りは保有者限定の音源が付いています。"},
  {id:"bay-members",kind:"art",style:"pass",category:"membership",name:"TOKYO BAY MEMBERS PASS",creator:"Tokyo Bay Club",royalty:.05,floorBase:.07,supply:800,count:9,verified:true,tierMult:[1,1.6,2.6,4.2,8],description:"東京ベイエリアの提携施設で使える会員権NFT。ランクに応じて、ラウンジ利用や優先入場などの特典を受けられます。"},
  {"id":"astral-forge","kind":"art","style":"relic","category":"game","name":"ASTRAL FORGE RELICS","creator":"Astral Forge Studio","royalty":0.05,"floorBase":0.0155,"supply":4200,"count":12,"verified":true,"description":"星の鉱石から鍛えられた剣・盾・杖を集める、ファンタジーRPGの装備コレクション。装備の種類、カラーテーマ、エディションの組み合わせで個体を識別します。ゲーム内での装備やプレイヤー間の取引を想定したNFTです。"},
  {"id":"blue-hour","kind":"art","style":"jazz","category":"music","name":"BLUE HOUR SESSIONS","creator":"Blue Hour Records","royalty":0.08,"floorBase":0.0115,"supply":1200,"count":12,"verified":true,"description":"小さなジャズクラブの深夜公演を収録したライブ音源コレクション。ピアノトリオ、カルテット、ソロの各セッションを、レコードとジャケットのアートで表現。保有者向けの未公開テイクや録音ノートを特典とする設定です。"},
  {"id":"echo-atlas","kind":"art","style":"ambient","category":"music","name":"ECHO ATLAS","creator":"Echo Atlas Soundworks","royalty":0.08,"floorBase":0.009,"supply":1800,"count":12,"verified":true,"description":"雨音、潮騒、森の環境音を重ねたアンビエント作品。音の波形をモチーフにしたアートと、音風景ごとのエディションを収集できます。保有者向けの高音質音源と制作日誌を特典とする設定です。"},
  {"id":"setouchi-journal","kind":"art","style":"islands","category":"local","name":"SETOUCHI JOURNAL","creator":"瀬戸内旅の編集室","royalty":0.1,"floorBase":0.006,"supply":3600,"count":12,"verified":true,"description":"尾道・小豆島・直島を巡る旅を、島影と帆船を描いたポストカードとして残すNFT。寄港地や色合いが異なる旅の記録を集められます。売買時のクリエイター収益の10%を地域の文化活動に還元する設定です。"},
  {"id":"ridgeline-passport","kind":"art","style":"trails","category":"local","name":"RIDGELINE PASSPORT","creator":"稜線アーカイブ","royalty":0.1,"floorBase":0.0065,"supply":2400,"count":12,"verified":true,"description":"八ヶ岳、北アルプス、奥多摩の山歩きを記録するデジタル登山パスポート。山並み、登山道、森を重ねた風景画を収集できます。ルートごとの記録や、登山道保全への還元を想定したコレクションです。"},
  {"id":"quiet-chapter","kind":"art","style":"library","category":"membership","name":"QUIET CHAPTER","creator":"Quiet Chapter Library","royalty":0.05,"floorBase":0.048,"supply":600,"count":10,"verified":true,"description":"読書と対話のための書斎ラウンジ会員権。書架と開いた本を描いた会員証に、閲覧室・サロン・アーカイブのプランを用意。プランに応じた席の予約や読書会への参加を想定しています。"},
  {"id":"glasshouse-society","kind":"art","style":"botanical","category":"membership","name":"GLASSHOUSE SOCIETY","creator":"Glasshouse Botanical Club","royalty":0.05,"floorBase":0.041,"supply":900,"count":10,"verified":true,"description":"都市の温室を拠点とする植物好きのための会員権。温室の建築と葉のシルエットを会員証にデザイン。庭園の利用、園芸ワークショップ、会員限定の植物交換会をプラン別の特典として想定しています。"},
  {"id":"fold-form","kind":"art","style":"paperform","category":"art","name":"FOLD / FORM","creator":"Atelier Fold","royalty":0.05,"floorBase":0.017,"supply":768,"count":12,"verified":true,"description":"一枚の紙から生まれる折りの環、階段、回転する面を集めた立体造形シリーズ。紙の重なりと陰影をデジタルで表現し、構成枚数・造形・色の組み合わせで一点ずつ異なる作品を生成します。"},
  {"id":"kintsugi-life","kind":"art","style":"kintsugi","category":"art","name":"KINTSUGI / SECOND LIFE","creator":"継景スタジオ","royalty":0.05,"floorBase":0.027,"supply":540,"count":12,"verified":true,"description":"割れ目を金でつなぐ金継ぎをテーマにしたデジタル陶芸。茶碗・花器・湯呑みに、それぞれ異なる釉薬と継ぎの線が現れます。傷を隠さず、新たな景色として鑑賞する作品群です。"},
  {"id":"apex-orbit","kind":"art","style":"racer","category":"game","name":"APEX ORBIT","creator":"Apex Orbital Works","royalty":0.05,"floorBase":0.014,"supply":4800,"count":12,"verified":true,"description":"無重力のサーキットを駆ける宇宙レース機のNFT。機体の翼型、エンジン構成、カラーリングを組み合わせて収集できます。レースゲーム内での機体選択やプレイヤー間取引を想定したコレクションです。"},
  {"id":"clockwork-tactics","kind":"art","style":"clockchess","category":"game","name":"CLOCKWORK TACTICS","creator":"Clockwork Table Studio","royalty":0.05,"floorBase":0.01,"supply":3600,"count":12,"verified":true,"description":"歯車で動く機械仕掛けのチェス駒。ナイト・ルーク・クイーンの造形に、金属の色と駆動歯車の違いを持たせています。戦略ボードゲームで自分の駒として使用し、交換する設定のNFTです。"},
  {"id":"patch-signals","kind":"art","style":"synth","category":"music","name":"PATCH SIGNALS","creator":"Voltage Room","royalty":0.08,"floorBase":0.0125,"supply":960,"count":12,"verified":true,"description":"モジュラーシンセの配線から生まれる電子音楽のエディション。ノブやパッチケーブルを描いたアートとともに、アシッド、ドローン、変則リズムの作品を収集できます。保有者向けに制作時のパッチ図と別ミックスを提供する設定です。"},
  {"id":"wind-up-melodies","kind":"art","style":"musicbox","category":"music","name":"WIND-UP MELODIES","creator":"小さな音楽機械室","royalty":0.08,"floorBase":0.0095,"supply":1500,"count":12,"verified":true,"description":"手巻きオルゴールのために書かれた短い楽曲集。木箱、金属のシリンダー、浮かぶ音符でワルツや子守歌の世界を描きます。保有者向けに楽曲音源と編曲譜を届ける設定の音楽NFTです。"},
  {"id":"matsuri-archive","kind":"art","style":"festival","category":"local","name":"MATSURI / NIGHT ARCHIVE","creator":"まちの灯編集部","royalty":0.1,"floorBase":0.0052,"supply":4200,"count":12,"verified":true,"description":"祭りの夜に並ぶ提灯と通りの賑わいを残すデジタル紀行。花・月・祭の紋と灯りの色が異なる作品を集められます。祭礼の記録保存と地域の担い手支援への収益還元を想定しています。"},
  {"id":"indigo-routes","kind":"art","style":"indigo","category":"local","name":"INDIGO / CRAFT ROUTES","creator":"藍の道工芸舎","royalty":0.1,"floorBase":0.008,"supply":1800,"count":12,"verified":true,"description":"藍染工房を巡る旅と伝統文様をテーマにしたコレクション。七宝、麻の葉、青海波を、藍の濃淡や型の間隔とともに表現します。工房見学の記録や染め手への収益還元を想定したNFTです。"},
  {"id":"open-bench","kind":"art","style":"maker","category":"membership","name":"OPEN BENCH GUILD","creator":"Open Bench Collective","royalty":0.05,"floorBase":0.033,"supply":720,"count":12,"verified":true,"description":"3Dプリント、電子工作、木工を楽しむ共同工房の会員権。機材を設計図風に描いた会員証に、日中利用・常設会員・講師コミュニティのプランを用意。作業台の予約や講習への参加を想定しています。"},
  {"id":"after-dark","kind":"art","style":"observatory","category":"membership","name":"AFTER DARK OBSERVATORY","creator":"After Dark Astronomy Club","royalty":0.05,"floorBase":0.044,"supply":480,"count":12,"verified":true,"description":"夜空を観察する天文台コミュニティの会員権。北斗七星・カシオペヤ・夏の大三角の星図を会員証に描きます。観望会、天体撮影、深宇宙観測のプランに応じた設備予約や交流会への参加を想定しています。"}
];
const MARKET_COLLECTION_BY_ID=new Map(MARKET_COLLECTIONS.map(c=>[c.id,c]));
const MARKET_CATALOG=(()=>{
  const items=[];
  MARKET_COLLECTIONS.forEach(c=>{
    const r=NftArt.rng(`catalog:${c.id}`),serials=new Set();
    for(let i=0;i<c.count;i++){
      let serial;do{serial=1+Math.floor(r()*c.supply)}while(serials.has(serial));serials.add(serial);
      let tier=0;
      if(c.kind!=="ticket"){
        if(i===0)tier=r()<.45?4:3;
        else if(i===1)tier=2;
        else{let x=r()*100;tier=MARKET_TIER_WEIGHTS.findIndex(w=>(x-=w)<0);if(tier<0)tier=0}
      }
      items.push({id:`${c.id}-${serial}`,collectionId:c.id,serial,tier});
    }
  });
  return items;
})();
const MARKET_CATALOG_BY_ID=new Map(MARKET_CATALOG.map(item=>[item.id,item]));
const TRADE_VIEW_DEFAULTS={tab:"explore",page:null,id:null,category:"all",sort:"recommended",listedOnly:true,collectionSort:"price_asc",collectionListedOnly:false,accountTab:"owned",activityFilter:"all",rankCategory:"all",rankSort:"volume",query:"",visible:24,history:[]};
const MARKET_VERIFIED='<i class="pm-verified" title="公式認証済み" aria-label="公式認証済み">✓</i>';

let marketHeartbeatTimer=null;
let marketTxTimer=null;
let marketModalItemId=null;
let tradeSearchTimer=null;
let tradeChartResizeTimer=null;
let listingDurationDays=7;

/* ---------- 基本ユーティリティ ---------- */
function marketUid(prefix){return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`}
function marketRandom(min,max){return min+Math.random()*(max-min)}
function marketHandle(exclude){let name;do{name=MARKET_HANDLES[Math.floor(Math.random()*MARKET_HANDLES.length)]}while(name===exclude);return name}
function marketGas(kind){return {approve:.0012,buy:PURCHASE_GAS_ETH,accept:.0016,cancel:.0009,transfer:.0006}[kind]||0}
function roundEth(value){return Number((Number(value)||0).toFixed(6))}
function floorEth(value){return Math.floor((Number(value)||0)*1e4)/1e4}
function niceEth(value){const v=Math.max(0,Number(value)||0),step=v<.01?.0001:v<.1?.0005:v<1?.001:.01;return Number((Math.round(v/step)*step).toFixed(4))}
function fmtMarketEth(value){const v=Number(value)||0;return `${v===0||Math.abs(v)>=.001?v.toFixed(4):v.toFixed(6)} ETH`}
function fmtEthCompact(value){const v=Number(value)||0;return `${v>=100?v.toFixed(0):v>=10?v.toFixed(1):v>=1?v.toFixed(2):v.toFixed(3)} ETH`}
function fmtYenApprox(value){return `≈ ${fmtYen((Number(value)||0)*markets.ETH.price)}`}
function toHalfWidthNumber(value){return String(value).replace(/[０-９]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xFEE0)).replace(/[．。]/g,".")}
/* 日本語入力（全角数字・変換中）でも金額を入力できるよう、変換確定後に半角へ整える */
function bindNumericInput(input,sanitize,onChange=null){
  const apply=()=>{const value=sanitize(toHalfWidthNumber(input.value));if(input.value!==value)input.value=value;onChange?.()};
  input.addEventListener("input",event=>{if(!event.isComposing)apply()});
  input.addEventListener("compositionend",apply);
}
function sanitizeEthInput(value){
  let v=toHalfWidthNumber(value).replace(/[^\d.]/g,"");const dot=v.indexOf(".");
  if(dot>=0)v=v.slice(0,dot+1)+v.slice(dot+1).replace(/\./g,"").slice(0,4);
  return v.slice(0,10);
}
function marketRelTime(at){
  const s=Math.max(0,Math.round((Date.now()-Number(at))/1000));
  if(s<10)return "たった今";if(s<60)return `${s}秒前`;
  const m=Math.floor(s/60);if(m<60)return `${m}分前`;
  const h=Math.floor(m/60);if(h<24)return `${h}時間前`;
  return `${Math.floor(h/24)}日前`;
}
function marketContractAddress(collectionId){
  const r=NftArt.rng(`contract:${collectionId}`);
  return `0x${Array.from({length:40},()=>Math.floor(r()*16).toString(16)).join("").toUpperCase()}`;
}
function marketCategoryLabel(category){return MARKET_CATEGORIES.find(([key])=>key===category)?.[1]||category}
function marketCollection(id){return MARKET_COLLECTION_BY_ID.get(id)||null}
function marketTicket(collection){return collection?.ticketId?tickets.find(t=>t.id===collection.ticketId)||null:null}
function marketTicketFaceEth(collection){return collection?.kind==="ticket"&&!collection.noCap?marketTicket(collection).price:null}

/* ---------- 状態 ---------- */
function marketState(){
  if(!state.market||state.market.version!==MARKET_STATE_VERSION)state.market=seedMarketState();
  return state.market;
}
function normalizeMarketState(){
  const m=marketState();
  ["activity","myOffers","ledger","transfers","notifications"].forEach(key=>{if(!Array.isArray(m[key]))m[key]=[]});
  ["items","favorites","approvals"].forEach(key=>{if(!m[key]||typeof m[key]!=="object")m[key]={}});
  m.balance={earned:0,reserved:0,pending:0,transferred:0,gasSpent:0,...m.balance};
  if(!Number.isFinite(m.nextBackgroundAt))m.nextBackgroundAt=Date.now()+MARKET_BACKGROUND_MIN_MS;
  const missing=MARKET_CATALOG.filter(base=>!m.items[base.id]);
  if(missing.length){
    const seeded=seedMarketState(),ids=new Set(missing.map(base=>base.id));
    for(const base of missing)m.items[base.id]=seeded.items[base.id];
    m.activity.push(...seeded.activity.filter(event=>ids.has(event.itemId)));
    m.activity.sort((a,b)=>a.at-b.at);
    m.activity=m.activity.slice(-MARKET_ACTIVITY_LIMIT);
  }
  Object.values(m.items).forEach(rec=>{if(!Array.isArray(rec.offers))rec.offers=[]});
  if(state.tradeConnected&&!walletById(state.tradeWalletId)){state.tradeConnected=false;state.tradeWalletId=null}
}
function tradeView(){
  if(!state.tradeView||typeof state.tradeView!=="object")state.tradeView={...TRADE_VIEW_DEFAULTS,history:[]};
  for(const key of ["category","rankCategory"]){if(["pfp","tcg"].includes(state.tradeView[key]))state.tradeView[key]="game";}
  return state.tradeView;
}
function tradeWallet(){const wallet=walletById(state.tradeWalletId);return state.tradeConnected&&wallet?wallet:null}
function marketRecord(itemId){
  const m=marketState();
  if(!m.items[itemId])m.items[itemId]={owner:null,listing:null,lastSalePrice:null,lastSaleAt:null,favCount:0,views:0,offers:[]};
  return m.items[itemId];
}
function seedMarketState(){
  const nowMs=Date.now(),items={},activity=[];
  MARKET_CATALOG.forEach(base=>{
    const c=marketCollection(base.collectionId),owner=marketHandle();
    const fair=marketFairEthForCatalog(base),capped=c.kind==="ticket"&&!c.noCap;
    const rec={owner,listing:null,lastSalePrice:null,lastSaleAt:null,favCount:Math.round(Math.random()*10+base.tier*Math.random()*16),views:Math.round(18+Math.random()*180+base.tier*40),offers:[]};
    if(Math.random()<.65){
      const at=nowMs-Math.round(marketRandom(.04,7)*MARKET_DAY_MS),price=marketBoundPrice(c,fair*marketRandom(.86,1.12));
      rec.lastSalePrice=price;rec.lastSaleAt=at;
      activity.push({id:marketUid("act"),type:"sale",itemId:base.id,price,from:marketHandle(owner),to:owner,at});
    }
    if(Math.random()<(c.kind==="ticket"?.86:.7)){
      const listedAt=nowMs-Math.round(marketRandom(.01,3)*MARKET_DAY_MS);
      const target=capped?marketTicketFaceEth(c)*marketRandom(.86,1):fair*marketRandom(.98,1.38);
      rec.listing={price:marketBoundPrice(c,target),listedAt,expiresAt:listedAt+[7,14,30][Math.floor(Math.random()*3)]*MARKET_DAY_MS,seller:owner};
      activity.push({id:marketUid("act"),type:"list",itemId:base.id,price:rec.listing.price,from:owner,to:null,at:listedAt});
    }
    items[base.id]=rec;
  });
  activity.sort((a,b)=>a.at-b.at);
  return {version:MARKET_STATE_VERSION,seededAt:nowMs,items,activity,myOffers:[],favorites:{},approvals:{},balance:{earned:0,reserved:0,pending:0,transferred:0,gasSpent:0},ledger:[],transferAddress:null,transfers:[],notifications:[],nextBackgroundAt:nowMs+MARKET_BACKGROUND_MIN_MS};
}
function marketBoundPrice(collection,value){
  const cap=collection.kind==="ticket"&&!collection.noCap?marketTicketFaceEth(collection)*TICKET_RESALE_CAP_RATIO:MARKET_MAX_PRICE;
  return Math.min(cap,Math.max(MARKET_MIN_PRICE,niceEth(value)));
}

/* ---------- アイテム情報 ---------- */
const MARKET_INFO_CACHE=new Map();
function marketItemIdForEntry(entry){return entry?.itemId||`tok-${entry?.tokenId}`}
function myEntryForItem(itemId){return state.ownedNfts.find(entry=>!entry.soldAt&&marketItemIdForEntry(entry)===itemId)||null}
function marketOwnedByMe(itemId){return !!myEntryForItem(itemId)}
function marketItemUsed(itemId){return state.ownedNfts.some(entry=>marketItemIdForEntry(entry)===itemId&&!!entry.admissionUsedAt)}
function marketListingForEntry(entry){const rec=state.market?.items?.[marketItemIdForEntry(entry)];return rec?.listing&&rec.listing.seller==="me"?rec.listing:null}
function marketItemCollectionId(itemId){
  if(!itemId)return null;
  if(itemId.startsWith("tok-")){const tokenId=itemId.slice(4);return state.ownedNfts.find(item=>item.tokenId===tokenId)?.ticketId||null}
  return MARKET_CATALOG_BY_ID.get(itemId)?.collectionId||null;
}
function marketTicketTraits(itemId,acquisition){
  const r=NftArt.rng(`${itemId}#ticket`),used=marketItemUsed(itemId);
  const channel=acquisition==="airdrop"?"エアドロップ":acquisition==="purchase"?"公式販売":["一般販売","一般販売","先行抽選","公式リセール"][Math.floor(r()*4)];
  return [{label:"受付",value:channel,share:null},{label:"ゲート",value:`${"ABCDEF"[Math.floor(r()*6)]}ゲート`,share:17},{label:"入場状況",value:used?"使用済み（記念）":"未使用",share:null}];
}
function marketItemInfo(itemId){
  if(!itemId)return null;
  if(MARKET_INFO_CACHE.has(itemId))return MARKET_INFO_CACHE.get(itemId);
  if(itemId.startsWith("tok-")){
    const tokenId=itemId.slice(4),entry=state.ownedNfts.find(item=>item.tokenId===tokenId);
    const c=marketCollection(entry?.ticketId),t=marketTicket(c);
    if(!entry||!c||!t)return null;
    const serial=Number(tokenId.replace(/\D/g,"").slice(-4))||1;
    return {id:itemId,collection:c,serial,tier:0,tierLabel:"コモン",name:`${t.title} #${String(serial).padStart(4,"0")}`,image:t.image,traits:marketTicketTraits(itemId,entry.acquisitionType),isTicket:true,tokenLabel:tokenId};
  }
  const base=MARKET_CATALOG_BY_ID.get(itemId),c=marketCollection(base?.collectionId);
  if(!base||!c)return null;
  let info;
  if(c.kind==="ticket"){
    const t=marketTicket(c);
    info={id:itemId,collection:c,serial:base.serial,tier:0,tierLabel:"コモン",name:`${t.title} #${String(base.serial).padStart(4,"0")}`,image:t.image,get traits(){return marketTicketTraits(itemId)},isTicket:true,tokenLabel:String(base.serial)};
  }else{
    const art=NftArt.create(c.style,itemId,base.tier,base.serial);
    info={id:itemId,collection:c,serial:base.serial,tier:base.tier,tierLabel:art.tierLabel,name:art.title,get image(){return art.uri()},traits:art.traits,isTicket:false,tokenLabel:String(base.serial)};
  }
  MARKET_INFO_CACHE.set(itemId,info);
  return info;
}
function marketFairEthForCatalog(base){
  const c=marketCollection(base.collectionId);
  if(c.kind==="ticket")return c.noCap?c.floorBase:marketTicketFaceEth(c)*c.demand;
  return c.floorBase*(c.tierMult||MARKET_TIER_MULT)[base.tier];
}
function marketFairEth(itemId){
  const info=marketItemInfo(itemId);if(!info)return 0;
  const c=info.collection,used=marketItemUsed(itemId);
  if(c.kind==="ticket"&&!c.noCap){const face=marketTicketFaceEth(c);return used?face*.3:face*c.demand}
  return (c.floorBase||0)*(c.tierMult||MARKET_TIER_MULT)[info.tier]*(used?.5:1);
}
function marketPriceCap(itemId){
  const c=marketItemInfo(itemId)?.collection;
  return c&&c.kind==="ticket"&&!c.noCap?marketTicketFaceEth(c)*TICKET_RESALE_CAP_RATIO:MARKET_MAX_PRICE;
}
function marketPriceRange(itemId){
  const info=marketItemInfo(itemId),cap=marketPriceCap(itemId);
  if(info?.collection.kind==="ticket"&&!info.collection.noCap){
    const face=marketTicketFaceEth(info.collection);
    if(marketItemUsed(itemId))return {low:niceEth(face*.2),high:niceEth(face*.4),cap,face};
    return {low:niceEth(face*.75),high:Math.min(cap,face),cap,face};
  }
  const fair=marketFairEth(itemId);
  return {low:niceEth(fair*.8),high:niceEth(fair*1.25),cap,face:null};
}
function marketSaleEstimate(itemId,price){
  const {low,high}=marketPriceRange(itemId);
  if(price<low)return {zone:"low",seconds:9};
  if(price<=high){const ratio=high>low?(price-low)/(high-low):0;return {zone:"fair",seconds:Math.round(MARKET_SALE_FAST_SECONDS+ratio*(MARKET_SALE_SLOW_SECONDS-MARKET_SALE_FAST_SECONDS))}}
  return {zone:"high",seconds:null};
}
function marketFees(price,collection){
  const platform=roundEth(price*MARKET_FEE_RATE),royalty=roundEth(price*(collection?.royalty||0));
  return {platform,royalty,net:roundEth(price-platform-royalty)};
}
function allMarketItemIds(){
  const ids=new Set(MARKET_CATALOG.map(item=>item.id));
  Object.keys(marketState().items).forEach(id=>{if(id.startsWith("tok-")&&marketItemInfo(id))ids.add(id)});
  state.ownedNfts.forEach(entry=>{const id=marketItemIdForEntry(entry);if(!entry.soldAt&&marketItemInfo(id))ids.add(id)});
  return [...ids];
}
function collectionItemIds(collectionId){return allMarketItemIds().filter(id=>marketItemCollectionId(id)===collectionId)}
function collectionListings(collectionId){return collectionItemIds(collectionId).map(id=>marketRecord(id).listing).filter(Boolean)}
function collectionFloor(collectionId){const prices=collectionListings(collectionId).map(l=>l.price);return prices.length?Math.min(...prices):null}
function collectionVolume(collectionId,windowMs=7*MARKET_DAY_MS){
  const since=Date.now()-windowMs;
  return marketState().activity.filter(a=>a.type==="sale"&&a.at>=since&&marketItemCollectionId(a.itemId)===collectionId).reduce((sum,a)=>sum+a.price,0);
}
function collectionBasePrice(c){return c.kind==="ticket"&&!c.noCap?marketTicketFaceEth(c)*c.demand:c.floorBase}
function collectionHistory(collectionId){
  const c=marketCollection(collectionId),r=NftArt.rng(`history:${collectionId}`),base=collectionBasePrice(c),cap=c.kind==="ticket"&&!c.noCap?marketTicketFaceEth(c):Infinity;
  let value=base*(.82+r()*.22);const points=[];
  for(let day=29;day>=1;day--){
    value=Math.min(cap,Math.max(base*.55,value*(1+(r()-.48)*.07)+(base-value)*.08));
    points.push({at:Date.now()-day*MARKET_DAY_MS,value:niceEth(value)});
  }
  points.push({at:Date.now(),value:collectionFloor(collectionId)??niceEth(value)});
  return points;
}
function collectionChange(collectionId){
  const points=collectionHistory(collectionId),last=points[points.length-1].value,prev=points[points.length-2].value;
  return prev?(last-prev)/prev:0;
}
function collectionOwners(c){return Math.round(c.supply*(.42+NftArt.rng(`owners:${c.id}`)()*.3))}
function collectionCover(collectionId){
  const c=marketCollection(collectionId);
  if(c.kind==="ticket")return marketTicket(c).image;
  return marketItemInfo(MARKET_CATALOG.find(item=>item.collectionId===collectionId).id).image;
}
function collectionMosaic(collectionId,count=3){
  const c=marketCollection(collectionId);
  if(c.kind==="ticket")return [marketTicket(c).image];
  return MARKET_CATALOG.filter(item=>item.collectionId===collectionId).slice(0,count).map(item=>marketItemInfo(item.id).image);
}

/* ---------- 記録・通知 ---------- */
function pushMarketActivity(event){
  const m=marketState();
  m.activity.push({id:marketUid("act"),at:Date.now(),...event});
  if(m.activity.length>MARKET_ACTIVITY_LIMIT)m.activity.splice(0,m.activity.length-MARKET_ACTIVITY_LIMIT);
}
function pushMarketLedger(entry){
  const m=marketState(),record={id:marketUid("led"),at:Date.now(),status:"done",...entry};
  m.ledger.push(record);return record;
}
function pushMarketNotice(kind,title,body,itemId=null){
  const m=marketState();
  m.notifications.push({id:marketUid("ntf"),kind,title,body,itemId,at:Date.now(),read:false});
  if(m.notifications.length>60)m.notifications.splice(0,m.notifications.length-60);
  updateTradeChrome();
  if(!missionCompletionNoticeActive)showEthSuccess(title,body,4800,"market-notice-toast");
}
function noteNftMinted(entry){
  if(!entry||!state.participantId)return;
  const itemId=marketItemIdForEntry(entry);marketRecord(itemId);
  pushMarketActivity({type:"mint",itemId,price:entry.acquisitionType==="airdrop"?0:marketTicket(marketCollection(entry.ticketId))?.price||0,from:entry.acquisitionType==="airdrop"?"エアドロップ":"MintGate",to:"あなた",mine:true});
}
function spendWalletGas(wallet,kind,title,itemId=null){
  const gas=marketGas(kind),m=marketState();
  wallet.ethBalance=roundEth(wallet.ethBalance-gas);m.balance.gasSpent=roundEth(m.balance.gasSpent+gas);
  pushMarketLedger({type:"gas",title,amount:-gas,walletId:wallet.id,itemId});
  syncLegacyWalletState();
  return gas;
}

/* ---------- エンジン（売却・オファー・送金・他ユーザーの取引） ---------- */
function startMarketEngine(){
  if(!state.participantId)return;
  normalizeMarketState();
  clearInterval(marketHeartbeatTimer);
  marketHeartbeatTimer=setInterval(marketHeartbeat,1000);
  marketHeartbeat();
}
function stopMarketEngine(){clearInterval(marketHeartbeatTimer);clearTimeout(marketTxTimer);marketHeartbeatTimer=null}
function marketHeartbeat(){
  if(!state.participantId||resetInProgress)return;
  const m=marketState(),nowMs=Date.now();
  Object.keys(m.items).forEach(itemId=>{
    const rec=m.items[itemId],listing=rec.listing;
    rec.offers.forEach(offer=>{if(offer.status==="open"&&!offer.mine&&offer.expiresAt<=nowMs)offer.status="expired"});
    if(!listing||listing.seller!=="me")return;
    if(!marketOwnedByMe(itemId)){rec.listing=null;return}
    if(state.marketTx?.itemId===itemId)return;
    if(listing.expiresAt<=nowMs){expireMyListing(itemId);return}
    if(listing.saleAt&&listing.saleAt<=nowMs){completeMyMarketSale(itemId,listing.price,"listing",marketHandle());return}
    if(listing.offerAt&&listing.offerAt<=nowMs)receiveMarketOffer(itemId);
  });
  m.myOffers.filter(offer=>offer.status==="pending"&&offer.resolveAt<=nowMs).forEach(resolveMyOffer);
  m.transfers.filter(t=>t.status==="processing"&&t.completesAt<=nowMs).forEach(completeTradeTransfer);
  if(nowMs>=m.nextBackgroundAt){
    runBackgroundMarketEvent();
    m.nextBackgroundAt=nowMs+Math.round(marketRandom(MARKET_BACKGROUND_MIN_MS,MARKET_BACKGROUND_MAX_MS));
  }
  updateMarketCountdowns();
}
function scheduleMyListing(itemId,price,previous=null){
  const est=marketSaleEstimate(itemId,price),nowMs=Date.now();
  const rec=marketRecord(itemId),openOffer=rec.offers.some(o=>o.status==="open"&&!o.mine);
  const offerCount=previous?.offerCount||0;
  return {
    zone:est.zone,
    saleAt:est.seconds?nowMs+Math.max(5,est.seconds+marketRandom(-4,4))*1000:null,
    offerAt:est.zone==="high"&&!openOffer&&offerCount<MARKET_INCOMING_OFFER_LIMIT?nowMs+marketRandom(25,40)*1000:null,
    offerCount
  };
}
function createMyListing(itemId,price,days){
  const entry=myEntryForItem(itemId),rec=marketRecord(itemId),info=marketItemInfo(itemId);
  if(!entry||!info)return false;
  const nowMs=Date.now();
  rec.owner=null;
  rec.listing={price,listedAt:nowMs,expiresAt:nowMs+days*MARKET_DAY_MS,seller:"me",walletId:entry.ownerWalletId,durationDays:days,...scheduleMyListing(itemId,price)};
  pushMarketActivity({type:"list",itemId,price,from:"あなた",to:null,mine:true});
  log("market_listing_created",{item_id:itemId,token_id:entry.tokenId,wallet_id:entry.ownerWalletId,collection_id:info.collection.id,price_eth:price,zone:rec.listing.zone,expected_sale_seconds:rec.listing.saleAt?Math.round((rec.listing.saleAt-nowMs)/1000):null,duration_days:days,fair_range_eth:marketPriceRange(itemId)});
  return true;
}
function updateMyListing(itemId,price){
  const rec=marketRecord(itemId),listing=rec.listing;
  if(!listing||listing.seller!=="me"||!marketOwnedByMe(itemId))return false;
  const previousPrice=listing.price;
  Object.assign(listing,{price,...scheduleMyListing(itemId,price,listing)});
  pushMarketActivity({type:"price",itemId,price,from:"あなた",to:null,mine:true});
  log("market_listing_updated",{item_id:itemId,previous_price_eth:previousPrice,price_eth:price,zone:listing.zone,expected_sale_seconds:listing.saleAt?Math.round((listing.saleAt-Date.now())/1000):null});
  return true;
}
function cancelMyListing(itemId,reason="cancel"){
  const rec=marketRecord(itemId),listing=rec.listing;
  if(!listing||listing.seller!=="me")return false;
  rec.listing=null;
  rec.offers.forEach(offer=>{if(offer.status==="open"&&!offer.mine)offer.status="closed"});
  pushMarketActivity({type:"cancel",itemId,price:listing.price,from:"あなた",to:null,mine:true});
  log(reason==="expired"?"market_listing_expired":"market_listing_cancelled",{item_id:itemId,price_eth:listing.price,listed_seconds:Math.round((Date.now()-listing.listedAt)/1000)});
  return true;
}
function expireMyListing(itemId){
  if(!cancelMyListing(itemId,"expired"))return;
  pushMarketNotice("expired","出品期間が終了しました",`${marketItemInfo(itemId)?.name||"NFT"} の出品期間が終了しました`,itemId);
  refreshMarketViews();
}
function completeMyMarketSale(itemId,price,via,buyer,offerId=null){
  const entry=myEntryForItem(itemId),info=marketItemInfo(itemId);
  if(!entry||!info)return false;
  const rec=marketRecord(itemId),m=marketState(),fees=marketFees(price,info.collection),listedAt=rec.listing?.listedAt||null;
  const wallet=walletById(entry.ownerWalletId)||activeWallet();
  entry.soldAt=now();entry.soldPriceEth=price;entry.soldTo=buyer;entry.saleNetEth=fees.net;entry.soldVia=via;
  rec.listing=null;rec.owner=buyer;rec.lastSalePrice=price;rec.lastSaleAt=Date.now();
  rec.offers.forEach(offer=>{if(offer.status==="open"&&!offer.mine)offer.status=offer.id===offerId?"accepted":"closed"});
  if(wallet){wallet.ethBalance=roundEth(wallet.ethBalance+fees.net);syncLegacyWalletState()}
  m.balance.earned=roundEth(m.balance.earned+fees.net);
  pushMarketLedger({type:"sale",title:`${info.name} の売上`,amount:fees.net,gross:price,platformFee:fees.platform,royalty:fees.royalty,itemId,walletId:wallet?.id||null});
  pushMarketActivity({type:"sale",itemId,price,from:"あなた",to:buyer,mine:true});
  log("market_nft_sold",{item_id:itemId,token_id:entry.tokenId,collection_id:info.collection.id,price_eth:price,net_eth:fees.net,platform_fee_eth:fees.platform,royalty_eth:fees.royalty,via,buyer,wallet_id:wallet?.id||null,listed_seconds:listedAt?Math.round((Date.now()-listedAt)/1000):null});
  if(activeAdmissionIndex!==null&&state.ownedNfts[activeAdmissionIndex]?.tokenId===entry.tokenId)closeAdmissionPass();
  if(marketModalItemId===itemId)closeModal();
  pushMarketNotice("sold","NFTが売れました",`${info.name} が ${fmtMarketEth(price)} で売れました。${fmtMarketEth(fees.net)} を${wallet?.name||"ウォレット"}に入金しました`,itemId);
  refreshMarketViews();
  return true;
}
function receiveMarketOffer(itemId){
  const rec=marketRecord(itemId),listing=rec.listing,info=marketItemInfo(itemId);
  if(!listing||!info)return;
  const range=marketPriceRange(itemId),amount=Math.min(niceEth(listing.price*.98),niceEth(range.high*marketRandom(.93,1))),from=marketHandle();
  rec.offers.push({id:marketUid("ofr"),from,amount,at:Date.now(),expiresAt:Date.now()+MARKET_DAY_MS,status:"open"});
  listing.offerCount=(listing.offerCount||0)+1;listing.offerAt=null;
  pushMarketActivity({type:"offer",itemId,price:amount,from,to:"あなた",mine:true});
  log("market_offer_received",{item_id:itemId,amount_eth:amount,listing_price_eth:listing.price,from});
  pushMarketNotice("offer","オファーが届きました",`${info.name} に ${fmtMarketEth(amount)} のオファーが届きました`,itemId);
  refreshMarketViews();
}
function declineIncomingOffer(itemId,offerId){
  const rec=marketRecord(itemId),offer=rec.offers.find(o=>o.id===offerId&&o.status==="open");
  if(!offer)return;
  offer.status="declined";
  const listing=rec.listing;
  if(listing?.seller==="me"&&listing.zone==="high"&&(listing.offerCount||0)<MARKET_INCOMING_OFFER_LIMIT)listing.offerAt=Date.now()+marketRandom(35,55)*1000;
  log("market_offer_declined",{item_id:itemId,amount_eth:offer.amount,from:offer.from});
  refreshMarketViews();toast("オファーを辞退しました");
}
function placeMyOffer(itemId,amount,wallet){
  const m=marketState(),rec=marketRecord(itemId),info=marketItemInfo(itemId);
  wallet.ethBalance=roundEth(wallet.ethBalance-amount);m.balance.reserved=roundEth(m.balance.reserved+amount);syncLegacyWalletState();
  const offer={id:marketUid("myo"),itemId,amount,walletId:wallet.id,at:Date.now(),resolveAt:Date.now()+marketRandom(12,24)*1000,status:"pending",listingPrice:rec.listing?.price||null};
  m.myOffers.push(offer);
  rec.offers.push({id:offer.id,from:"あなた",amount,at:offer.at,expiresAt:offer.at+MARKET_DAY_MS,status:"open",mine:true});
  pushMarketLedger({type:"offer_hold",title:`オファー金額を確保（${info.name}）`,amount:-amount,itemId,offerId:offer.id,walletId:wallet.id,status:"hold"});
  pushMarketActivity({type:"offer",itemId,price:amount,from:"あなた",to:rec.owner,mine:true});
  log("market_offer_made",{item_id:itemId,amount_eth:amount,wallet_id:wallet.id,listing_price_eth:offer.listingPrice,floor_eth:collectionFloor(info.collection.id)});
  return offer;
}
function resolveMyOffer(offer){
  const m=marketState(),rec=marketRecord(offer.itemId),info=marketItemInfo(offer.itemId),wallet=walletById(offer.walletId);
  const recOffer=rec.offers.find(o=>o.id===offer.id),holdEntry=m.ledger.find(l=>l.offerId===offer.id&&l.type==="offer_hold");
  const threshold=rec.listing?rec.listing.price*MARKET_OFFER_ACCEPT_RATIO:marketFairEth(offer.itemId)*1.1;
  const accepted=!!wallet&&!!info&&!marketOwnedByMe(offer.itemId)&&offer.amount>=threshold;
  m.balance.reserved=roundEth(Math.max(0,m.balance.reserved-offer.amount));
  offer.status=accepted?"accepted":"declined";offer.resolvedAt=Date.now();
  if(recOffer)recOffer.status=offer.status;
  if(accepted){
    const seller=rec.listing?.seller||rec.owner||marketHandle();
    const entry={tokenId:`PM-${Date.now().toString().slice(-8)}`,itemId:offer.itemId,collectionId:info.collection.id,purchasedAt:now(),acquisitionType:"market_offer",priceEth:offer.amount,sellerName:seller,ownerWalletId:wallet.id,ownerAddress:wallet.address};
    if(info.isTicket)entry.ticketId=info.collection.ticketId;
    state.ownedNfts.push(entry);
    rec.listing=null;rec.owner=null;rec.lastSalePrice=offer.amount;rec.lastSaleAt=Date.now();
    if(holdEntry){holdEntry.status="done";holdEntry.title=`オファー成立（${info.name}）`}
    pushMarketActivity({type:"sale",itemId:offer.itemId,price:offer.amount,from:seller,to:"あなた",mine:true});
    log("market_offer_accepted_by_seller",{item_id:offer.itemId,amount_eth:offer.amount,token_id:entry.tokenId,seller,wallet_id:wallet.id});
    pushMarketNotice("offer_accepted","オファーが承諾されました",`${info.name} を ${fmtMarketEth(offer.amount)} で購入しました。${wallet.name}に追加されています`,offer.itemId);
  }else{
    if(wallet){wallet.ethBalance=roundEth(wallet.ethBalance+offer.amount);syncLegacyWalletState()}
    if(holdEntry)holdEntry.status="released";
    pushMarketLedger({type:"offer_refund",title:`オファー不成立の返還（${info?.name||"NFT"}）`,amount:offer.amount,itemId:offer.itemId,walletId:offer.walletId});
    log("market_offer_declined_by_seller",{item_id:offer.itemId,amount_eth:offer.amount,threshold_eth:roundEth(threshold)});
    pushMarketNotice("offer_declined","オファーは見送られました",`${info?.name||"NFT"} へのオファー（${fmtMarketEth(offer.amount)}）は成立しませんでした。確保していたETHはウォレットに戻りました`,offer.itemId);
  }
  refreshMarketViews();
}
function runBackgroundMarketEvent(){
  const m=marketState(),view=tradeView();
  const busy=new Set([view.page==="item"?view.id:null,state.marketTx?.itemId,marketModalItemId,...m.myOffers.filter(o=>o.status==="pending").map(o=>o.itemId),...Object.keys(m.favorites)]);
  const others=MARKET_CATALOG.map(item=>item.id).filter(id=>!busy.has(id)&&!marketOwnedByMe(id));
  const listed=others.filter(id=>m.items[id]?.listing),unlisted=others.filter(id=>!m.items[id]?.listing);
  if(!others.length)return;
  const ratio=listed.length/others.length,roll=Math.random();
  const pickId=list=>list[Math.floor(Math.random()*list.length)];
  let event=null;
  if(listed.length&&(roll<.5&&ratio>.5||!unlisted.length)){
    const id=pickId(listed),rec=m.items[id],seller=rec.listing.seller,buyer=marketHandle(seller),price=rec.listing.price;
    rec.lastSalePrice=price;rec.lastSaleAt=Date.now();rec.owner=buyer;rec.listing=null;
    event={type:"sale",itemId:id,price,from:seller,to:buyer};
  }else if(unlisted.length&&(roll<.85||ratio<.5)){
    const id=pickId(unlisted),rec=m.items[id],c=marketItemInfo(id).collection;
    const target=c.kind==="ticket"&&!c.noCap?marketTicketFaceEth(c)*marketRandom(.86,1):marketFairEth(id)*marketRandom(1,1.32);
    rec.owner=rec.owner||marketHandle();
    rec.listing={price:marketBoundPrice(c,target),listedAt:Date.now(),expiresAt:Date.now()+14*MARKET_DAY_MS,seller:rec.owner};
    event={type:"list",itemId:id,price:rec.listing.price,from:rec.owner,to:null};
  }else if(listed.length){
    const id=pickId(listed),rec=m.items[id],c=marketItemInfo(id).collection,price=marketBoundPrice(c,rec.listing.price*.95);
    if(price>=rec.listing.price)return;
    rec.listing.price=price;
    event={type:"price",itemId:id,price,from:rec.listing.seller,to:null};
  }
  if(!event)return;
  pushMarketActivity(event);
  updateTradeLiveTicker();
  if(state.currentApp==="trade"&&!view.page&&!view.query&&view.tab==="activity")renderTrade();
}

/* ---------- 取引所への送金 ---------- */
function completeTradeTransfer(transfer){
  const m=marketState();
  transfer.status="completed";transfer.completedAt=Date.now();
  m.balance.pending=roundEth(Math.max(0,m.balance.pending-transfer.amount));m.balance.transferred=roundEth(m.balance.transferred+transfer.amount);
  state.exchangeEth=roundEth((Number(state.exchangeEth)||0)+transfer.amount);
  const ledger=m.ledger.find(l=>l.transferId===transfer.id);if(ledger)ledger.status="done";
  log("market_transfer_to_exchange_completed",{transfer_id:transfer.id,amount_eth:transfer.amount});
  pushMarketNotice("transfer","NOVA Exchangeに着金しました",`${fmtMarketEth(transfer.amount)} が取引所の口座に反映されました。取引所の「売却」で日本円に換えられます`);
  refreshMarketViews({exchange:true});
}

/* ---------- 画面の更新 ---------- */
// 取引所の画面はマーケットの状態を表示しないため、取引所の残高が変わる着金時だけ描き直す（入力中の金額欄を作り直さないため）
function refreshMarketViews({exchange=false}={}){
  if(!state.participantId){updateTradeChrome();return}
  if(exchange)renderAllKeepingExchangeInput();else renderAll({skipExchange:true});
}
function updateTradeChrome(){
  const chip=document.getElementById("tradeWalletChip");
  if(chip){
    const wallet=state.participantId?tradeWallet():null;
    chip.classList.toggle("connected",!!wallet);
    chip.innerHTML=wallet?`<span>${escapeHtml(wallet.name)}</span><strong>${fmtMarketEth(wallet.ethBalance)}</strong>`:`<strong>ウォレットを接続</strong>`;
  }
  const unread=state.market?state.market.notifications.filter(n=>!n.read).length:0,badge=document.getElementById("tradeNoticeCount");
  if(badge){badge.textContent=unread>9?"9+":String(unread);badge.classList.toggle("hidden",!unread)}
}
function updateMarketCountdowns(){
  document.querySelectorAll("[data-offer-countdown]").forEach(el=>{
    const offer=state.market?.myOffers.find(o=>o.id===el.dataset.offerCountdown);
    if(offer?.status==="pending"){const s=Math.max(0,Math.ceil((offer.resolveAt-Date.now())/1000));el.textContent=`出品者の回答待ち（目安：あと約${s}秒）`}
  });
  document.querySelectorAll("[data-transfer-countdown]").forEach(el=>{
    const transfer=state.market?.transfers.find(item=>item.id===el.dataset.transferCountdown);
    if(transfer?.status==="processing"){const s=Math.max(0,Math.ceil((transfer.completesAt-Date.now())/1000));el.textContent=`ネットワーク承認待ち（デモ：あと約${s}秒）`}
  });
}
function updateTradeLiveTicker(){
  const el=document.getElementById("tradeLiveTicker");if(!el)return;
  el.innerHTML=tradeLiveTickerMarkup();
}
function tradeLiveTickerMarkup(){
  const latest=[...marketState().activity].reverse().find(a=>a.type==="sale"||a.type==="list");
  if(!latest)return "";
  const info=marketItemInfo(latest.itemId);if(!info)return "";
  const verb=latest.type==="sale"?"が購入されました":"が出品されました";
  return `<span class="pm-live-dot" aria-hidden="true"></span><b>LIVE</b><span class="pm-live-text"><strong>${escapeHtml(info.name)}</strong>${verb}・${fmtMarketEth(latest.price)}</span><small>${marketRelTime(latest.at)}</small>`;
}

/* ---------- ナビゲーション ---------- */
function setTradeTab(tab){
  const view=tradeView();
  view.tab=tab;view.page=null;view.id=null;view.history=[];view.query="";view.visible=24;
  const search=document.getElementById("tradeSearch");if(search)search.value="";
  log("trade_tab_opened",{tab});
  renderTrade();scrollTradeTop();
}
function tradeNavigate(page,id){
  const view=tradeView();
  view.history.push({page:view.page,id:view.id,tab:view.tab});
  if(view.history.length>12)view.history.splice(0,view.history.length-12);
  view.page=page;view.id=id;view.query="";
  const search=document.getElementById("tradeSearch");if(search)search.value="";
  renderTrade();scrollTradeTop();
}
function tradeBack(){
  const view=tradeView(),previous=view.history.pop();
  if(previous){view.page=previous.page;view.id=previous.id;view.tab=previous.tab||view.tab}else{view.page=null;view.id=null}
  renderTrade();scrollTradeTop();
}
function openTradeItem(itemId){
  if(!marketItemInfo(itemId))return;
  const rec=marketRecord(itemId);if(!marketOwnedByMe(itemId))rec.views=(rec.views||0)+1;
  log("market_item_viewed",{item_id:itemId,listed:!!rec.listing,price_eth:rec.listing?.price||null,mine:marketOwnedByMe(itemId)});
  tradeNavigate("item",itemId);
}
function openTradeCollection(collectionId){
  if(!marketCollection(collectionId))return;
  log("market_collection_viewed",{collection_id:collectionId});
  tradeNavigate("collection",collectionId);
}
function openTradeItemFromApp(itemId){
  const view=tradeView();
  view.tab="account";view.page="item";view.id=itemId;view.history=[{page:null,id:null,tab:"account"}];view.query="";
  closeModal();switchApp("trade");
}
function scrollTradeTop(){
  const app=document.getElementById("tradeApp");if(!app||app.classList.contains("hidden"))return;
  const top=app.getBoundingClientRect().top+window.scrollY-(window.matchMedia("(max-width: 760px)").matches?70:90);
  if(window.scrollY>top)window.scrollTo({top:Math.max(0,top),behavior:"auto"});
}
function toggleMarketFavorite(itemId){
  const m=marketState(),rec=marketRecord(itemId),on=!m.favorites[itemId];
  if(on)m.favorites[itemId]=true;else delete m.favorites[itemId];
  rec.favCount=Math.max(0,(rec.favCount||0)+(on?1:-1));
  log(on?"market_item_favorited":"market_item_unfavorited",{item_id:itemId});
  document.querySelectorAll(`[data-fav="${itemId}"]`).forEach(button=>{button.classList.toggle("on",on);button.setAttribute("aria-pressed",String(on));const count=button.querySelector("b");if(count)count.textContent=rec.favCount});
}

/* ---------- ウォレット接続 ---------- */
function connectTradeWallet(onReady=null,walletId=null){
  if(!state.wallets.length){error("先にOrbit Walletを作成してください");return}
  const current=tradeWallet();
  if(walletId){
    if(current?.id===walletId){onReady?.(current);return}
    openTradeConnectionSignature(walletId,onReady);return;
  }
  if(state.wallets.length>1){openTradeWalletSelector(onReady);return}
  const wallet=state.wallets[0];
  if(current?.id===wallet.id){if(onReady)onReady(wallet);else toast(`${wallet.name}は接続済みです`);return}
  openTradeConnectionSignature(wallet.id,onReady);
}
function requireTradeWallet(onReady,walletId=null){
  const wallet=tradeWallet();
  if(wallet&&(!walletId||wallet.id===walletId)){onReady(wallet);return}
  if(walletId&&wallet)toast(`このNFTを保有している${walletById(walletId)?.name||"ウォレット"}を接続してください`);
  connectTradeWallet(onReady,walletId);
}
function openTradeWalletSelector(onReady=null){
  const current=tradeWallet();
  openModal("SELECT WALLET","接続するウォレットを選択",`
    <p class="wallet-selection-intro">PassMarketで使用するウォレットを選んでください。購入代金の支払い、売上の受け取り、NFTの出品は選択したウォレットで行います。</p>
    <div class="market-wallet-selection">${state.wallets.map(wallet=>`<button class="market-wallet-option ${wallet.id===current?.id?"connected":""}" data-trade-wallet-id="${escapeHtml(wallet.id)}" type="button">
      <span class="market-wallet-option-head"><span class="market-wallet-option-icon">O</span><span><strong>${escapeHtml(wallet.name)}</strong><small>${wallet.id===current?.id?"現在接続中":"接続して署名"}</small></span><b>${fmtEth(wallet.ethBalance)}</b></span>
      <span class="market-wallet-public-label">公開鍵</span><code>${escapeHtml(wallet.address)}</code>
    </button>`).join("")}</div>
    <button id="cancelTradeWalletSelection" class="secondary" style="width:100%;margin-top:14px" type="button">キャンセル</button>`);
  document.querySelectorAll("[data-trade-wallet-id]").forEach(button=>button.onclick=()=>{
    const id=button.dataset.tradeWalletId;
    if(current?.id===id){closeModal();onReady?.(current);return}
    openTradeConnectionSignature(id,onReady);
  });
  $("cancelTradeWalletSelection").onclick=closeModal;
}
function openTradeConnectionSignature(walletId,onReady=null){
  const wallet=walletById(walletId);if(!wallet){error("選択したウォレットを確認できません");return}
  openModal("CONNECT WALLET","Orbit Walletを接続",`
    <div class="signature-card connection-signature-card"><div class="signature-head"><span class="signature-icon">O</span><div><strong>署名リクエスト</strong><small>PassMarketへの接続を確認</small></div></div>
      <div class="signature-details"><p class="hint">この署名はウォレット所有者であることを証明するもので、ガス代（手数料）や資産移動は発生しません。</p>
      <div class="risk-row"><span>選択ウォレット</span><strong>${escapeHtml(wallet.name)} · ${fmtEth(wallet.ethBalance)}</strong></div>
      <div class="signature-message">Welcome to PassMarket.<br><br>Wallet: ${escapeHtml(wallet.address)}<br>Nonce: PM-${Date.now().toString().slice(-6)}<br>Purpose: Sign in to PassMarket</div>
      <div class="risk-row"><span>要求元</span><strong>passmarket.demo</strong></div><div class="risk-row"><span>資産移動</span><strong>なし</strong></div></div></div>
    <label class="check" style="margin-top:14px"><input id="tradeConnectUnderstand" type="checkbox"><span>署名内容と要求元を確認しました。</span></label>
    <div class="button-row" style="margin-top:15px"><button id="signTradeConnect" class="primary" type="button" disabled>メッセージに署名</button><button id="rejectTradeConnect" class="secondary" type="button">拒否</button></div>`);
  $("modal").scrollTop=0;
  $("tradeConnectUnderstand").onchange=event=>{$("signTradeConnect").disabled=!event.target.checked};
  $("rejectTradeConnect").onclick=()=>{log("signature_rejected",{purpose:"passmarket_connect"});closeModal()};
  $("signTradeConnect").onclick=()=>{
    if(!$("tradeConnectUnderstand").checked){error("署名内容を確認してください");return}
    state.signatureCount++;state.tradeConnected=true;state.tradeWalletId=wallet.id;
    log("message_signed",{purpose:"passmarket_connect",wallet_id:wallet.id,address:wallet.address});
    closeModal();renderAll();
    if(onReady)onReady(wallet);else toast(`${wallet.name}をPassMarketに接続しました`);
  };
}

/* ---------- 署名・トランザクション（Orbit Wallet） ---------- */
function openMarketMessageSignature({title,subtitle,wallet,message,rows,confirmLabel,purpose,onSign,onReject=closeModal}){
  openModal("ORBIT WALLET",title,`
    <div class="signature-card connection-signature-card"><div class="signature-head"><span class="signature-icon">O</span><div><strong>署名リクエスト</strong><small>${escapeHtml(subtitle)}</small></div></div>
      <div class="signature-details"><p class="hint">メッセージへの署名です。この署名だけではガス代（手数料）は発生しません。</p>
      <div class="risk-row"><span>署名ウォレット</span><strong>${escapeHtml(wallet.name)}</strong></div>
      ${rows.map(([label,value])=>`<div class="risk-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}
      <div class="signature-message">${message}</div>
      <div class="risk-row"><span>要求元</span><strong>passmarket.demo</strong></div></div></div>
    <label class="check" style="margin-top:14px"><input id="marketSignUnderstand" type="checkbox"><span>署名内容と要求元を確認しました。</span></label>
    <div class="button-row" style="margin-top:15px"><button id="marketSignConfirm" class="primary" type="button" disabled>${escapeHtml(confirmLabel)}</button><button id="marketSignReject" class="secondary" type="button">拒否</button></div>`);
  $("modal").scrollTop=0;
  $("marketSignUnderstand").onchange=event=>{$("marketSignConfirm").disabled=!event.target.checked};
  $("marketSignReject").onclick=()=>{log("signature_rejected",{purpose});onReject()};
  $("marketSignConfirm").onclick=()=>{
    if(!$("marketSignUnderstand").checked){error("署名内容を確認してください");return}
    state.signatureCount++;log("message_signed",{purpose,wallet_id:wallet.id});
    onSign(wallet);
  };
}
function openMarketTxSignature({title,wallet,operation,rows,gasKind,value=0,warning,purpose,onSign,onReject=closeModal}){
  const gas=marketGas(gasKind),total=roundEth(value+gas),short=wallet.ethBalance<total;
  openModal("ORBIT WALLET",title,`
    <div class="signature-card purchase-signature-card"><div class="signature-head"><span class="signature-icon">O</span><div><strong>コントラクト実行</strong><small>Ethereum Mainnet（疑似）</small></div></div>
    <div class="signature-details"><div class="risk-row"><span>署名ウォレット</span><strong>${escapeHtml(wallet.name)}</strong></div><div class="risk-row"><span>公開鍵</span><strong style="max-width:270px;overflow-wrap:anywhere">${escapeHtml(wallet.address)}</strong></div><div class="risk-row"><span>接続先</span><strong>PassMarket</strong></div><div class="risk-row"><span>操作</span><strong>${escapeHtml(operation)}</strong></div>
      ${rows.map(([label,valueText])=>`<div class="risk-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(valueText)}</strong></div>`).join("")}
      <div class="risk-row"><span>推定ガス代（手数料）</span><strong>${fmtMarketEth(gas)}</strong></div><div class="risk-row"><span>最大支払額</span><strong>${fmtMarketEth(total)}</strong></div><div class="risk-row"><span>ウォレット残高</span><strong>${fmtMarketEth(wallet.ethBalance)}</strong></div></div></div>
    ${short?`<div class="notice danger" style="margin-top:13px">${escapeHtml(wallet.name)}の残高が不足しています。取引所からETHを送金してから、もう一度お試しください。</div>`:`<div class="notice warning" style="margin-top:13px">${escapeHtml(warning)}</div>`}
    <label class="check" style="margin-top:14px"><input id="marketTxUnderstand" type="checkbox" ${short?"disabled":""}><span>送信先、金額、ガス代（手数料）、コントラクトの内容を確認しました。</span></label>
    <div class="button-row" style="margin-top:15px"><button id="marketTxConfirm" class="primary" type="button" disabled>確認して署名</button><button id="marketTxReject" class="secondary" type="button">拒否</button></div>`);
  $("modal").scrollTop=0;
  $("marketTxUnderstand").onchange=event=>{$("marketTxConfirm").disabled=!event.target.checked};
  $("marketTxReject").onclick=()=>{log("signature_rejected",{purpose});onReject()};
  $("marketTxConfirm").onclick=()=>{
    if(!$("marketTxUnderstand").checked){error("トランザクション内容を確認してください");return}
    if(wallet.ethBalance<total){error("ウォレット残高が不足しています");return}
    state.signatureCount++;log("transaction_signed",{purpose,wallet_id:wallet.id,value_eth:value,gas_eth:gas});
    onSign(wallet,gas);
  };
}
function startMarketTx(tx){
  state.marketTx={...tx,completesAt:Date.now()+MARKET_TX_MS};
  showMarketTxPending();scheduleMarketTx(MARKET_TX_MS);
}
function scheduleMarketTx(delay){clearTimeout(marketTxTimer);marketTxTimer=setTimeout(finalizeMarketTx,Math.max(0,delay))}
function showMarketTxPending(){
  openModal("TRANSACTION","トランザクションを送信中",`<div class="transaction-status"><div class="spinner"></div><h3>ネットワーク承認を待っています</h3><p>${escapeHtml(state.marketTx?.label||"取引")}のトランザクションをEthereumネットワークへ送信しました。</p></div>`,false);
}
function finalizeMarketTx(){
  const tx=state.marketTx;if(!tx)return;
  state.marketTx=null;
  log("market_transaction_confirmed",{kind:tx.kind,item_id:tx.itemId||null,wallet_id:tx.walletId});
  if(tx.kind==="approve"){
    const approvals=marketState().approvals;
    if(!approvals[tx.walletId])approvals[tx.walletId]={};
    approvals[tx.walletId][tx.collectionId]=true;
    toast("コレクションの承認が完了しました");
    const wallet=walletById(tx.walletId);
    if(wallet&&myEntryForItem(tx.itemId)&&!marketRecord(tx.itemId).listing)openListingSignature(tx.itemId,tx.price,tx.days,"create",wallet);else closeModal();
  }else if(tx.kind==="cancel"){
    closeModal();
    if(cancelMyListing(tx.itemId))toast("出品を取り消しました");
    refreshMarketViews();
  }else if(tx.kind==="accept"){
    const offer=marketRecord(tx.itemId).offers.find(o=>o.id===tx.offerId&&o.status==="open");
    closeModal();
    if(!offer||!marketOwnedByMe(tx.itemId)){error("このオファーは受け付けを終了しました");refreshMarketViews();return}
    log("market_offer_accepted",{item_id:tx.itemId,amount_eth:offer.amount,from:offer.from});
    const info=marketItemInfo(tx.itemId),fees=marketFees(offer.amount,info.collection),wallet=walletById(tx.walletId);
    completeMyMarketSale(tx.itemId,offer.amount,"offer",offer.from,offer.id);
    openModal("SOLD","売却が完了しました",`<div class="completion-card pm-done"><div class="success-check">✓</div><h2>${fmtMarketEth(fees.net)}</h2><p>${escapeHtml(wallet?.name||"ウォレット")}に入金しました。日本円に換える場合は、取引所へ送金して売却します。</p></div><div class="button-row" style="margin-top:15px"><button id="soldToBalance" class="primary" type="button">売上・送金を見る</button><button id="soldClose" class="secondary" type="button">閉じる</button></div>`);
    $("soldClose").onclick=closeModal;
    $("soldToBalance").onclick=()=>{closeModal();if(state.currentApp!=="trade")switchApp("trade");setTradeTab("balance")};
  }else if(tx.kind==="buy")deliverMarketPurchase(tx);
}

/* ---------- 共通パーツ ---------- */
function tierBadge(info){return info.collection.kind==="ticket"?`<span class="pm-tier ticket">NFT TICKET</span>`:`<span class="pm-tier t${info.tier}">${escapeHtml(info.tierLabel)}</span>`}
function tradeItemCard(itemId){
  const info=marketItemInfo(itemId);if(!info)return "";
  const rec=marketRecord(itemId),mine=marketOwnedByMe(itemId),listing=rec.listing,fav=!!marketState().favorites[itemId];
  const badge=mine?`<span class="pm-own-badge${listing?" listed":""}">${listing?"出品中":"保有中"}</span>`:"";
  return `<article class="pm-card${mine?" mine":""}" data-trade-item="${itemId}" role="button" tabindex="0" aria-label="${escapeHtml(info.name)}の詳細を開く">
    <div class="pm-card-media${info.isTicket?" ticket":""}"><img src="${info.image}" alt="" loading="lazy" decoding="async">${tierBadge(info)}${badge}<button class="pm-fav${fav?" on":""}" data-fav="${itemId}" type="button" aria-pressed="${fav}" aria-label="お気に入り">♥<b>${rec.favCount||0}</b></button></div>
    <div class="pm-card-body"><small>${escapeHtml(info.collection.name)}${info.collection.verified?MARKET_VERIFIED:""}</small><strong>${escapeHtml(info.name)}</strong>
      <div class="pm-card-price">${listing?`<span>価格</span><b>${fmtMarketEth(listing.price)}</b>`:`<span>未出品</span>`}</div>
      <small class="pm-card-last">${rec.lastSalePrice?`最終取引 ${fmtMarketEth(rec.lastSalePrice)}`:"取引履歴なし"}</small></div>
    ${!mine&&listing?`<button class="pm-card-buy" data-trade-action="buy" data-id="${itemId}" type="button">今すぐ購入</button>`:mine&&!listing?`<button class="pm-card-buy sell" data-trade-action="list" data-id="${itemId}" type="button">出品する</button>`:""}
  </article>`;
}
function tradeItemGrid(ids,emptyText="条件に合うアイテムがありません"){
  return ids.length?`<div class="pm-grid">${ids.map(tradeItemCard).join("")}</div>`:`<div class="pm-empty"><span>✦</span><p>${emptyText}</p></div>`;
}
function sortMarketItems(ids,sort){
  const m=marketState(),price=id=>m.items[id]?.listing?.price;
  const listedFirst=(a,b)=>(price(a)?0:1)-(price(b)?0:1);
  const byTier=id=>marketItemInfo(id)?.tier||0;
  const sorters={
    recommended:(a,b)=>listedFirst(a,b)||((m.items[b]?.favCount||0)+byTier(b)*6)-((m.items[a]?.favCount||0)+byTier(a)*6),
    price_asc:(a,b)=>listedFirst(a,b)||(price(a)||0)-(price(b)||0),
    price_desc:(a,b)=>listedFirst(a,b)||(price(b)||0)-(price(a)||0),
    recent:(a,b)=>(m.items[b]?.listing?.listedAt||m.items[b]?.lastSaleAt||0)-(m.items[a]?.listing?.listedAt||m.items[a]?.lastSaleAt||0),
    rarity:(a,b)=>byTier(b)-byTier(a)||listedFirst(a,b)
  };
  return [...ids].sort(sorters[sort]||sorters.recommended);
}
function tradeSortSelect(name,value){
  const options=[["recommended","おすすめ順"],["price_asc","価格の安い順"],["price_desc","価格の高い順"],["recent","新着順"],["rarity","レア度順"]];
  return `<label class="pm-select"><span class="sr-only">並び替え</span><select data-trade-select="${name}">${options.map(([key,label])=>`<option value="${key}" ${key===value?"selected":""}>${label}</option>`).join("")}</select></label>`;
}
function tradeCategoryChips(active,name="category"){
  return `<div class="pm-chips" role="tablist" aria-label="カテゴリ">${MARKET_CATEGORIES.map(([key,label])=>`<button class="pm-chip${key===active?" active":""}" data-trade-chip="${name}" data-value="${key}" type="button" role="tab" aria-selected="${key===active}">${label}</button>`).join("")}</div>`;
}
function tradeCollectionCard(c){
  const floor=collectionFloor(c.id),mosaic=collectionMosaic(c.id);
  return `<article class="pm-collection-card" data-trade-collection="${c.id}" role="button" tabindex="0" aria-label="${escapeHtml(c.name)}を開く">
    <div class="pm-collection-banner${mosaic.length>1?" mosaic":""}">${mosaic.map(src=>`<img src="${src}" alt="" loading="lazy" decoding="async">`).join("")}</div>
    <div class="pm-collection-card-body"><img class="pm-avatar" src="${collectionCover(c.id)}" alt="" loading="lazy"><strong>${escapeHtml(c.name)}${c.verified?MARKET_VERIFIED:""}</strong>
      <dl><div><dt>フロア価格</dt><dd>${floor?fmtMarketEth(floor):"—"}</dd></div><div><dt>7日間の取引額</dt><dd>${fmtEthCompact(collectionVolume(c.id))}</dd></div></dl></div>
  </article>`;
}
function tradeChangeLabel(change){
  const pct=Math.abs(change*100).toFixed(1);
  if(Math.abs(change)<.0005)return `<span class="pm-change flat">±0.0%</span>`;
  return change>0?`<span class="pm-change up">▲ ${pct}%</span>`:`<span class="pm-change down">▼ ${pct}%</span>`;
}
function tradeActivityLabel(type){return {sale:"販売",list:"出品",cancel:"出品取消",price:"価格変更",offer:"オファー",mint:"発行"}[type]||type}
function tradeActivityIcon(type){return {sale:"Ξ",list:"⇡",cancel:"×",price:"↘",offer:"✋",mint:"✦"}[type]||"・"}
function tradeActivityRows(events,{showItem=true}={}){
  if(!events.length)return `<div class="pm-empty compact"><p>まだアクティビティはありません</p></div>`;
  return `<div class="pm-activity${showItem?"":" no-item"}" role="table" aria-label="アクティビティ">
    <div class="pm-activity-row head" role="row"><span role="columnheader">イベント</span>${showItem?'<span role="columnheader">アイテム</span>':""}<span role="columnheader">価格</span><span role="columnheader">送り手</span><span role="columnheader">受け手</span><span role="columnheader">日時</span></div>
    ${events.map(a=>{
      const info=marketItemInfo(a.itemId);
      return `<div class="pm-activity-row${a.mine?" mine":""}" role="row">
        <span class="pm-event ${a.type}" role="cell"><i aria-hidden="true">${tradeActivityIcon(a.type)}</i>${tradeActivityLabel(a.type)}</span>
        ${showItem?`<span class="pm-activity-item" role="cell">${info?`<button data-trade-item="${a.itemId}" type="button"><img src="${info.image}" alt="" loading="lazy"><span>${escapeHtml(info.name)}<small>${escapeHtml(info.collection.name)}</small></span></button>`:"—"}</span>`:""}
        <span class="pm-activity-price" role="cell">${a.price?fmtMarketEth(a.price):"—"}</span>
        <span class="pm-activity-user from${a.from==="あなた"?" me":""}" role="cell"><small>送り手</small>${escapeHtml(a.from||"—")}</span>
        <span class="pm-activity-user to${a.to==="あなた"?" me":""}" role="cell"><small>受け手</small>${escapeHtml(a.to||"—")}</span>
        <span class="pm-activity-time" role="cell">${marketRelTime(a.at)}</span>
      </div>`;
    }).join("")}
  </div>`;
}
function tradeChartBlock(collectionId,title){
  const points=collectionHistory(collectionId),table=points.filter((_,i)=>i%5===4||i===points.length-1);
  return `<section class="pm-panel pm-chart-panel">
    <div class="pm-panel-head"><h2>${title}</h2><span>過去30日</span></div>
    <div class="pm-chart" data-chart="${collectionId}" role="img" aria-label="${escapeHtml(marketCollection(collectionId).name)}の過去30日の価格推移"></div>
    <details class="pm-chart-table"><summary>データを表で見る</summary><table><thead><tr><th>日付</th><th>価格</th></tr></thead><tbody>${table.map(p=>`<tr><td>${new Date(p.at).toLocaleDateString("ja-JP",{month:"numeric",day:"numeric"})}</td><td>${fmtMarketEth(p.value)}</td></tr>`).join("")}</tbody></table></details>
  </section>`;
}
function hydrateTradeCharts(){
  document.querySelectorAll("#tradeContent [data-chart]").forEach(container=>{
    const points=collectionHistory(container.dataset.chart),width=Math.max(260,container.clientWidth),height=190;
    const pad={l:66,r:70,t:16,b:28},values=points.map(p=>p.value);
    let min=Math.min(...values),max=Math.max(...values);
    const span=max-min||max*.1||.001;min=Math.max(0,min-span*.25);max=max+span*.2;
    const raw=(max-min)/3,mag=10**Math.floor(Math.log10(raw)),step=[1,2,2.5,5,10].map(s=>s*mag).find(s=>s>=raw);
    const lo=Math.floor(min/step)*step,hi=Math.ceil(max/step)*step;
    const x=i=>pad.l+i*(width-pad.l-pad.r)/(points.length-1),y=v=>pad.t+(hi-v)/(hi-lo||1)*(height-pad.t-pad.b);
    const line=points.map((p,i)=>`${i?"L":"M"}${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ");
    const ticks=[];for(let v=lo;v<=hi+step/2;v+=step)ticks.push(v);
    const tickLabel=v=>`${Number(v.toFixed(5))} ETH`;
    const last=points[points.length-1],dayLabel=at=>new Date(at).toLocaleDateString("ja-JP",{month:"numeric",day:"numeric"});
    container.innerHTML=`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" aria-hidden="true">
      ${ticks.map(v=>`<line x1="${pad.l}" x2="${width-pad.r}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" class="pm-grid-line"/><text x="${pad.l-8}" y="${(y(v)+4).toFixed(1)}" text-anchor="end" class="pm-axis">${tickLabel(v)}</text>`).join("")}
      <path d="${line} L${x(points.length-1).toFixed(1)} ${y(lo).toFixed(1)} L${pad.l} ${y(lo).toFixed(1)} Z" class="pm-area"/>
      <path d="${line}" class="pm-line"/>
      <text x="${pad.l}" y="${height-8}" class="pm-axis">${dayLabel(points[0].at)}</text><text x="${(pad.l+width-pad.r)/2}" y="${height-8}" text-anchor="middle" class="pm-axis">${dayLabel(points[15].at)}</text><text x="${width-pad.r}" y="${height-8}" text-anchor="end" class="pm-axis">今日</text>
      <circle cx="${x(points.length-1).toFixed(1)}" cy="${y(last.value).toFixed(1)}" r="4.5" class="pm-end-dot"/>
      <text x="${(x(points.length-1)+9).toFixed(1)}" y="${(y(last.value)+4).toFixed(1)}" class="pm-end-label">${fmtEthCompact(last.value)}</text>
      <line class="pm-crosshair" x1="0" x2="0" y1="${pad.t}" y2="${height-pad.b}" visibility="hidden"/>
      <circle class="pm-hover-dot" r="4.5" visibility="hidden"/>
      <rect class="pm-hit" x="${pad.l}" y="0" width="${width-pad.l-pad.r}" height="${height}" fill="transparent"/>
    </svg><div class="pm-tooltip" hidden><strong></strong><span></span></div>`;
    const svgEl=container.querySelector("svg"),tip=container.querySelector(".pm-tooltip"),cross=container.querySelector(".pm-crosshair"),dot=container.querySelector(".pm-hover-dot");
    const move=event=>{
      const rect=svgEl.getBoundingClientRect(),px=event.clientX-rect.left;
      const i=Math.max(0,Math.min(points.length-1,Math.round((px-pad.l)/((width-pad.l-pad.r)/(points.length-1)))));
      const cx=x(i),cy=y(points[i].value);
      cross.setAttribute("x1",cx);cross.setAttribute("x2",cx);cross.setAttribute("visibility","visible");
      dot.setAttribute("cx",cx);dot.setAttribute("cy",cy);dot.setAttribute("visibility","visible");
      tip.hidden=false;tip.querySelector("strong").textContent=fmtMarketEth(points[i].value);tip.querySelector("span").textContent=`${i===points.length-1?"今日（現在のフロア価格）":dayLabel(points[i].at)}・${fmtYenApprox(points[i].value)}`;
      tip.style.left=`${Math.min(width-tip.offsetWidth-4,Math.max(4,cx-tip.offsetWidth/2))}px`;tip.style.top=`${Math.max(0,cy-tip.offsetHeight-12)}px`;
    };
    const leave=()=>{tip.hidden=true;cross.setAttribute("visibility","hidden");dot.setAttribute("visibility","hidden")};
    const hit=container.querySelector(".pm-hit");
    hit.addEventListener("pointermove",move);hit.addEventListener("pointerdown",move);hit.addEventListener("pointerleave",leave);
  });
}

/* ---------- ページ：探す ---------- */
function tradeExplorePage(){
  const view=tradeView(),m=marketState();
  const collections=MARKET_COLLECTIONS.filter(c=>view.category==="all"||c.category===view.category);
  const allIds=allMarketItemIds();
  const listedCount=allIds.filter(id=>m.items[id]?.listing).length;
  const volume=MARKET_COLLECTIONS.reduce((sum,c)=>sum+collectionVolume(c.id),0);
  const artCollections=MARKET_COLLECTIONS.filter(c=>c.kind==="art");
  const spotlight=artCollections[Math.floor(Date.now()/MARKET_DAY_MS)%artCollections.length];
  const spotlightMosaic=MARKET_CATALOG.filter(item=>item.collectionId===spotlight.id).slice(0,4).map(item=>marketItemInfo(item.id).image);
  const trending=[...MARKET_COLLECTIONS].sort((a,b)=>collectionVolume(b.id)-collectionVolume(a.id)).slice(0,8);
  let ids=allIds.filter(id=>{const info=marketItemInfo(id);return info&&(view.category==="all"||info.collection.category===view.category)&&(!view.listedOnly||m.items[id]?.listing)});
  ids=sortMarketItems(ids,view.sort);
  const visible=ids.slice(0,view.visible);
  const spotlightFloor=collectionFloor(spotlight.id);
  return `
    <section class="pm-hero">
      <div class="pm-hero-copy">
        <span class="pm-eyebrow">PASSMARKET · 暗号資産でNFTを売買</span>
        <h1>欲しいNFTを、<br>ETHで売買。</h1>
        <p>NFTチケット、アート、ゲーム、御朱印、会員権まで。Orbit Walletを接続してETHで購入でき、保有するNFTは自分で決めた価格で出品できます。売上はETHでウォレットに直接入金されます。</p>
        <div class="pm-hero-actions"><button class="pm-btn primary" data-trade-action="scroll-items" type="button">NFTを探す</button><button class="pm-btn ghost" data-trade-tab="account" type="button">保有NFTを出品する</button></div>
        <dl class="pm-hero-stats"><div><dt>コレクション</dt><dd>${MARKET_COLLECTIONS.length}</dd></div><div><dt>出品中</dt><dd>${listedCount}</dd></div><div><dt>7日間の取引額</dt><dd>${fmtEthCompact(volume)}</dd></div></dl>
      </div>
      <article class="pm-spotlight" data-trade-collection="${spotlight.id}" role="button" tabindex="0" aria-label="${escapeHtml(spotlight.name)}を開く">
        <div class="pm-spotlight-art">${spotlightMosaic.map(src=>`<img src="${src}" alt="" decoding="async">`).join("")}</div>
        <div class="pm-spotlight-info"><span>今日の注目コレクション</span><strong>${escapeHtml(spotlight.name)}${spotlight.verified?MARKET_VERIFIED:""}</strong><small>by ${escapeHtml(spotlight.creator)}</small><dl><div><dt>フロア価格</dt><dd>${spotlightFloor?fmtMarketEth(spotlightFloor):"—"}</dd></div><div><dt>24時間</dt><dd>${tradeChangeLabel(collectionChange(spotlight.id))}</dd></div></dl></div>
      </article>
    </section>
    <div id="tradeLiveTicker" class="pm-live" aria-live="off">${tradeLiveTickerMarkup()}</div>
    ${tradeCategoryChips(view.category)}
    <section class="pm-section">
      <div class="pm-section-head"><div><span class="kicker">COLLECTIONS</span><h2>注目のコレクション</h2></div></div>
      <div class="pm-collection-row">${collections.map(tradeCollectionCard).join("")||'<div class="pm-empty compact"><p>このカテゴリのコレクションはありません</p></div>'}</div>
    </section>
    <section class="pm-section">
      <div class="pm-section-head"><div><span class="kicker">TRENDING</span><h2>トレンドのコレクション</h2></div><button class="pm-link" data-trade-tab="rankings" type="button">ランキングを見る →</button></div>
      <div class="pm-trend-grid">${trending.map((c,i)=>`<button class="pm-trend-row" data-trade-collection="${c.id}" type="button"><span class="pm-rank">${i+1}</span><img src="${collectionCover(c.id)}" alt="" loading="lazy"><span class="pm-trend-name"><strong>${escapeHtml(c.name)}${c.verified?MARKET_VERIFIED:""}</strong><small>フロア ${collectionFloor(c.id)?fmtMarketEth(collectionFloor(c.id)):"—"}</small></span><span class="pm-trend-value"><strong>${fmtEthCompact(collectionVolume(c.id))}</strong>${tradeChangeLabel(collectionChange(c.id))}</span></button>`).join("")}</div>
    </section>
    <section class="pm-section" id="tradeItemsSection">
      <div class="pm-section-head"><div><span class="kicker">ITEMS</span><h2>${view.listedOnly?"出品中のアイテム":"すべてのアイテム"}</h2></div><div class="pm-controls"><label class="pm-toggle"><input type="checkbox" data-trade-toggle="listedOnly" ${view.listedOnly?"checked":""}><span>出品中のみ</span></label>${tradeSortSelect("sort",view.sort)}</div></div>
      ${tradeItemGrid(visible)}
      ${ids.length>visible.length?`<button class="pm-more" data-trade-action="more" type="button">さらに表示（残り${ids.length-visible.length}件）</button>`:""}
    </section>
    <section class="pm-section">
    <div class="pm-section-head"><div><span class="kicker">HOW IT WORKS</span><h2>PassMarketの使い方</h2></div><button class="pm-link" data-trade-action="guide" type="button">はじめてガイドを見る</button></div>
    <div class="pm-how">
      <div><span>1</span><h3>ウォレットを接続してETHで購入</h3><p>Orbit Walletを接続し、ウォレットのETHで購入します。購入時はトランザクションへの署名とガス代（手数料）が必要です。</p></div>
      <div><span>2</span><h3>自分で価格を決めて出品</h3><p>相場の範囲内の価格なら、数十秒で他のユーザーが購入します。初回のみコレクションの承認（ガス代）が必要です。</p></div>
      <div><span>3</span><h3>売上はETHでウォレットへ</h3><p>手数料を差し引いた売上がETHでウォレットに入金されます。日本円に換えるには、取引所へ送金して売却します。</p></div>
    </div>
    </section>`;
}

/* ---------- ページ：コレクション ---------- */
function tradeCollectionPage(collectionId){
  const c=marketCollection(collectionId);if(!c)return tradeMissingPage();
  const view=tradeView(),m=marketState(),floor=collectionFloor(c.id),ids=collectionItemIds(c.id);
  const listedCount=ids.filter(id=>m.items[id]?.listing).length;
  let shown=ids.filter(id=>!view.collectionListedOnly||m.items[id]?.listing);
  shown=sortMarketItems(shown,view.collectionSort);
  const face=marketTicketFaceEth(c),mosaic=collectionMosaic(c.id,4);
  const events=[...m.activity].reverse().filter(a=>marketItemCollectionId(a.itemId)===c.id).slice(0,8);
  return `
    <button class="pm-back" data-trade-action="back" type="button">← 戻る</button>
    <section class="pm-collection-hero">
      <div class="pm-collection-banner large${mosaic.length>1?" mosaic":""}">${mosaic.map(src=>`<img src="${src}" alt="" decoding="async">`).join("")}</div>
      <div class="pm-collection-head"><img class="pm-avatar large" src="${collectionCover(c.id)}" alt=""><div><span class="pm-category-pill">${marketCategoryLabel(c.category)}</span><h1>${escapeHtml(c.name)}${c.verified?MARKET_VERIFIED:""}</h1><p>by <strong>${escapeHtml(c.creator)}</strong></p></div></div>
      <p class="pm-desc">${escapeHtml(c.description)}</p>
      <dl class="pm-stats">
        <div><dt>フロア価格</dt><dd>${floor?fmtMarketEth(floor):"—"}</dd></div>
        <div><dt>24時間の変動</dt><dd>${tradeChangeLabel(collectionChange(c.id))}</dd></div>
        <div><dt>7日間の取引額</dt><dd>${fmtEthCompact(collectionVolume(c.id))}</dd></div>
        <div><dt>発行数</dt><dd>${c.supply.toLocaleString("ja-JP")}</dd></div>
        <div><dt>保有者</dt><dd>${collectionOwners(c).toLocaleString("ja-JP")}</dd></div>
        <div><dt>出品中</dt><dd>${listedCount}件</dd></div>
        <div><dt>クリエイター収益</dt><dd>${(c.royalty*100).toFixed(1).replace(/\.0$/,"")}%</dd></div>
      </dl>
      ${face?`<div class="pm-note ticket"><b>公式リセール</b><span>主催者の設定により、定価（${fmtMarketEth(face)}）を超える価格では出品できません。NFTのスマートコントラクトで転売価格の上限を管理しています。</span></div>`:""}
      ${c.category==="local"?`<div class="pm-note local"><b>地域への還元</b><span>売買が成立するたびに、販売額の${Math.round(c.royalty*100)}%がクリエイター収益として地域の観光振興に還元されます。</span></div>`:""}
    </section>
    ${tradeChartBlock(c.id,"フロア価格の推移")}
    <section class="pm-section">
      <div class="pm-section-head"><div><span class="kicker">ITEMS</span><h2>アイテム <small>${shown.length}件</small></h2></div><div class="pm-controls"><label class="pm-toggle"><input type="checkbox" data-trade-toggle="collectionListedOnly" ${view.collectionListedOnly?"checked":""}><span>出品中のみ</span></label>${tradeSortSelect("collectionSort",view.collectionSort)}</div></div>
      ${tradeItemGrid(shown)}
    </section>
    <section class="pm-section"><div class="pm-section-head"><div><span class="kicker">ACTIVITY</span><h2>最近のアクティビティ</h2></div></div>${tradeActivityRows(events)}</section>`;
}

/* ---------- ページ：アイテム ---------- */
function tradeItemPage(itemId){
  const info=marketItemInfo(itemId);if(!info)return tradeMissingPage();
  const c=info.collection,m=marketState(),rec=marketRecord(itemId),entry=myEntryForItem(itemId),mine=!!entry,listing=rec.listing;
  const fav=!!m.favorites[itemId],floor=collectionFloor(c.id),range=marketPriceRange(itemId);
  const myPending=m.myOffers.find(o=>o.itemId===itemId&&o.status==="pending");
  const lastSold=[...state.ownedNfts].reverse().find(e=>e.soldAt&&marketItemIdForEntry(e)===itemId);
  const ownerWallet=mine?walletById(entry.ownerWalletId):null;
  const owner=mine?`あなた（${ownerWallet?.name||"Orbit Wallet"}）`:rec.owner||"—";
  let priceBox;
  if(mine&&listing){
    const zoneNote={low:"相場より安い価格で出品中です。",fair:"売れやすい価格で出品中です。",high:`相場より高い価格です。${fmtMarketEth(range.low)}〜${fmtMarketEth(range.high)}に変更すると売れやすくなります。`}[listing.zone]||"";
    priceBox=`<span class="pm-price-label">あなたの出品価格</span><strong class="pm-price">${fmtMarketEth(listing.price)}</strong><span class="pm-price-yen">${fmtYenApprox(listing.price)}</span>
      <p class="pm-price-sub">${zoneNote}出品期限：${new Date(listing.expiresAt).toLocaleDateString("ja-JP")}</p>
      <div class="pm-price-actions"><button class="pm-btn primary" data-trade-action="edit" data-id="${itemId}" type="button">価格を変更</button><button class="pm-btn ghost" data-trade-action="cancel" data-id="${itemId}" type="button">出品を取り消す</button></div>`;
  }else if(mine){
    priceBox=`<span class="pm-price-label">あなたが保有しています</span><strong class="pm-price small">売れやすい価格帯 ${fmtMarketEth(range.low)}〜${fmtMarketEth(range.high)}</strong>
      <p class="pm-price-sub">${floor?`フロア価格 ${fmtMarketEth(floor)}・`:""}${rec.lastSalePrice?`最終取引 ${fmtMarketEth(rec.lastSalePrice)}`:"取引履歴はまだありません"}</p>
      ${range.face?`<p class="pm-price-sub">公式リセールの上限価格：${fmtMarketEth(range.cap)}（定価）</p>`:""}
      <div class="pm-price-actions"><button class="pm-btn primary" data-trade-action="list" data-id="${itemId}" type="button">出品する</button>${info.isTicket?`<button class="pm-btn ghost" data-trade-action="open-wallet" data-id="${itemId}" type="button">Orbit Walletで開く</button>`:""}</div>`;
  }else if(listing){
    priceBox=`<span class="pm-price-label">現在の価格</span><strong class="pm-price">${fmtMarketEth(listing.price)}</strong><span class="pm-price-yen">${fmtYenApprox(listing.price)}</span>
      <p class="pm-price-sub">出品者 ${escapeHtml(listing.seller)}・出品期限 ${new Date(listing.expiresAt).toLocaleDateString("ja-JP")}</p>
      ${myPending?`<div class="pm-status pending"><span class="pm-pulse" aria-hidden="true"></span><span data-offer-countdown="${myPending.id}">出品者の回答待ち</span></div>`:""}
      <div class="pm-price-actions"><button class="pm-btn primary" data-trade-action="buy" data-id="${itemId}" type="button">今すぐ購入</button><button class="pm-btn ghost" data-trade-action="offer" data-id="${itemId}" type="button" ${myPending?"disabled":""}>オファーを出す</button></div>
      <p class="pm-pay-methods"><span>ETH（Orbit Wallet）</span><span>ガス代 約${fmtMarketEth(marketGas("buy"))}</span></p>`;
  }else{
    priceBox=`<span class="pm-price-label">現在は出品されていません</span><strong class="pm-price small">${rec.lastSalePrice?`最終取引 ${fmtMarketEth(rec.lastSalePrice)}`:"取引履歴なし"}</strong>
      ${lastSold?`<p class="pm-price-sub">あなたが ${fmtMarketEth(lastSold.soldPriceEth)} で売却しました（${new Date(lastSold.soldAt).toLocaleString("ja-JP")}）</p>`:`<p class="pm-price-sub">保有者にオファーを送って、購入を打診できます。</p>`}
      ${myPending?`<div class="pm-status pending"><span class="pm-pulse" aria-hidden="true"></span><span data-offer-countdown="${myPending.id}">出品者の回答待ち</span></div>`:""}
      <div class="pm-price-actions"><button class="pm-btn primary" data-trade-action="offer" data-id="${itemId}" type="button" ${myPending?"disabled":""}>オファーを出す</button></div>`;
  }
  const offers=[...rec.offers].reverse().filter(o=>o.status==="open"||o.mine).slice(0,8);
  const events=[...m.activity].reverse().filter(a=>a.itemId===itemId).slice(0,10);
  const contract=marketContractAddress(c.id);
  return `
    <button class="pm-back" data-trade-action="back" type="button">← 戻る</button>
    <div class="pm-item-layout">
      <div class="pm-item-media${info.isTicket?" ticket":""}"><img src="${info.image}" alt="${escapeHtml(info.name)}">${tierBadge(info)}<button class="pm-fav large${fav?" on":""}" data-fav="${itemId}" type="button" aria-pressed="${fav}" aria-label="お気に入り">♥<b>${rec.favCount||0}</b></button></div>
      <div class="pm-item-main">
        <button class="pm-item-collection" data-trade-collection="${c.id}" type="button">${escapeHtml(c.name)}${c.verified?MARKET_VERIFIED:""}</button>
        <h1>${escapeHtml(info.name)}</h1>
        <div class="pm-item-meta"><span>所有者 <b class="${mine?"me":""}">${escapeHtml(owner)}</b></span><span>👁 ${rec.views||0}回表示</span><span>♥ ${rec.favCount||0}</span></div>
        <section class="pm-price-box">${priceBox}</section>
        <section class="pm-panel"><div class="pm-panel-head"><h2>オファー</h2><span>${offers.length}件</span></div>
          ${offers.length?`<div class="pm-offers">${offers.map(o=>`<div class="pm-offer-row ${o.status}"><span><strong>${fmtMarketEth(o.amount)}</strong><small>${floor?`フロア比 ${Math.round((o.amount/floor-1)*100)>=0?"+":""}${Math.round((o.amount/floor-1)*100)}%`:""}</small></span><span>${escapeHtml(o.from)}<small>${marketRelTime(o.at)}</small></span><span>${mine&&!o.mine&&o.status==="open"?`<button class="pm-mini solid" data-trade-action="accept-offer" data-id="${itemId}" data-offer="${o.id}" type="button">承諾</button><button class="pm-mini" data-trade-action="decline-offer" data-id="${itemId}" data-offer="${o.id}" type="button">辞退</button>`:`<em>${{open:"受付中",accepted:"成立",declined:"不成立",closed:"終了",expired:"期限切れ"}[o.status]||""}</em>`}</span></div>`).join("")}</div>`:`<p class="pm-muted">まだオファーはありません</p>`}
        </section>
      </div>
    </div>
    ${tradeChartBlock(c.id,"価格推移（コレクションのフロア価格）")}
    <div class="pm-item-lower">
      <section class="pm-panel"><div class="pm-panel-head"><h2>特性</h2><span>${info.traits.length}件</span></div><div class="pm-traits">${info.traits.map(t=>`<div><span>${escapeHtml(t.label)}</span><strong>${escapeHtml(t.value)}</strong>${t.share?`<small>保有率 ${t.share}%</small>`:""}</div>`).join("")}</div></section>
      <section class="pm-panel"><div class="pm-panel-head"><h2>詳細</h2></div><dl class="pm-details">
        <div><dt>コントラクト</dt><dd>${contract.slice(0,8)}…${contract.slice(-4)}</dd></div>
        <div><dt>トークンID</dt><dd>${escapeHtml(info.tokenLabel)}</dd></div>
        <div><dt>トークン規格</dt><dd>ERC-721</dd></div>
        <div><dt>チェーン</dt><dd>Ethereum（疑似）</dd></div>
        <div><dt>クリエイター</dt><dd>${escapeHtml(c.creator)}</dd></div>
        <div><dt>クリエイター収益</dt><dd>${(c.royalty*100).toFixed(1).replace(/\.0$/,"")}%</dd></div>
        <div><dt>マーケット手数料</dt><dd>${(MARKET_FEE_RATE*100).toFixed(1)}%</dd></div>
      </dl><p class="pm-muted">${escapeHtml(c.description)}</p></section>
    </div>
    <section class="pm-section"><div class="pm-section-head"><div><span class="kicker">ITEM ACTIVITY</span><h2>このアイテムのアクティビティ</h2></div></div>${tradeActivityRows(events,{showItem:false})}</section>`;
}
function tradeMissingPage(){return `<button class="pm-back" data-trade-action="back" type="button">← 戻る</button><div class="pm-empty"><span>?</span><p>このページは表示できません</p></div>`}

/* ---------- ページ：ランキング ---------- */
function tradeRankingsPage(){
  const view=tradeView();
  const sorters={volume:c=>collectionVolume(c.id),floor:c=>collectionFloor(c.id)||0,change:c=>collectionChange(c.id)};
  const rows=MARKET_COLLECTIONS.filter(c=>view.rankCategory==="all"||c.category===view.rankCategory).sort((a,b)=>sorters[view.rankSort](b)-sorters[view.rankSort](a));
  return `
    <div class="dashboard-title"><div><span class="kicker">RANKINGS</span><h1>コレクションランキング</h1><p>取引額・フロア価格・価格変動でコレクションを比較できます。</p></div></div>
    ${tradeCategoryChips(view.rankCategory,"rankCategory")}
    <div class="pm-rank-controls"><span>並び替え</span>${[["volume","7日間の取引額"],["floor","フロア価格"],["change","24時間の変動"]].map(([key,label])=>`<button class="pm-chip small${view.rankSort===key?" active":""}" data-trade-chip="rankSort" data-value="${key}" type="button">${label}</button>`).join("")}</div>
    <div class="pm-rank-table" role="table" aria-label="コレクションランキング">
      <div class="pm-rank-row head" role="row"><span role="columnheader">#</span><span role="columnheader">コレクション</span><span role="columnheader">フロア価格</span><span role="columnheader">24時間</span><span role="columnheader">7日間の取引額</span><span role="columnheader">出品中</span><span role="columnheader">保有者</span></div>
      ${rows.map((c,i)=>`<button class="pm-rank-row" data-trade-collection="${c.id}" type="button" role="row"><span class="pm-rank" role="cell">${i+1}</span><span class="pm-rank-name" role="cell"><img src="${collectionCover(c.id)}" alt="" loading="lazy"><span><strong>${escapeHtml(c.name)}${c.verified?MARKET_VERIFIED:""}</strong><small>${marketCategoryLabel(c.category)}</small></span></span><span role="cell"><small>フロア</small>${collectionFloor(c.id)?fmtMarketEth(collectionFloor(c.id)):"—"}</span><span role="cell"><small>24時間</small>${tradeChangeLabel(collectionChange(c.id))}</span><span role="cell"><small>7日間</small>${fmtEthCompact(collectionVolume(c.id))}</span><span role="cell"><small>出品中</small>${collectionListings(c.id).length}</span><span role="cell"><small>保有者</small>${collectionOwners(c).toLocaleString("ja-JP")}</span></button>`).join("")}
    </div>`;
}

/* ---------- ページ：アクティビティ ---------- */
function tradeActivityPage(){
  const view=tradeView(),filters=[["all","すべて"],["sale","販売"],["list","出品"],["offer","オファー"],["mine","自分の取引"]];
  const events=[...marketState().activity].reverse().filter(a=>view.activityFilter==="all"||(view.activityFilter==="mine"?a.mine:a.type===view.activityFilter)).slice(0,60);
  return `
    <div class="dashboard-title"><div><span class="kicker">ACTIVITY</span><h1>マーケットのアクティビティ</h1><p>PassMarket全体の販売・出品・オファーをリアルタイムで表示します。</p></div><span class="pm-live-badge"><i aria-hidden="true"></i>LIVE</span></div>
    <div class="pm-chips">${filters.map(([key,label])=>`<button class="pm-chip${view.activityFilter===key?" active":""}" data-trade-chip="activityFilter" data-value="${key}" type="button">${label}</button>`).join("")}</div>
    ${tradeActivityRows(events)}`;
}

/* ---------- ページ：マイページ ---------- */
function tradeConnectPrompt(text){
  if(!state.wallets.length)return `<div class="pm-empty large"><span>O</span><h2>Orbit Walletがまだありません</h2><p>PassMarketで売買するには、ウォレットを作成し、取引所から送金したETHが必要です。</p><button class="pm-btn primary" data-trade-action="open-wallet-app" type="button">ウォレットを作成する</button></div>`;
  return `<div class="pm-empty large"><span>O</span><h2>ウォレットを接続してください</h2><p>${text}</p><button class="pm-btn primary" data-trade-action="connect" type="button">ウォレットを接続</button></div>`;
}
function tradeAccountPage(){
  const view=tradeView(),wallet=tradeWallet(),m=marketState();
  if(!wallet)return tradeConnectPrompt("Orbit Walletを接続すると、保有しているNFTの出品や、出品中・オファー・取引履歴の確認ができます。接続時にはメッセージへの署名が必要です。");
  const entries=myMarketEntries(wallet.id);
  const ownedIds=entries.map(({owned})=>marketItemIdForEntry(owned)).filter(id=>marketItemInfo(id));
  const listedIds=ownedIds.filter(id=>marketRecord(id).listing);
  const soldEntries=state.ownedNfts.filter(e=>e.soldAt&&e.ownerWalletId===wallet.id);
  const earned=m.ledger.filter(l=>l.type==="sale"&&l.walletId===wallet.id).reduce((sum,l)=>sum+l.amount,0);
  const incoming=ownedIds.flatMap(id=>marketRecord(id).offers.filter(o=>!o.mine&&o.status==="open").map(o=>({...o,itemId:id})));
  const favIds=Object.keys(m.favorites).filter(id=>marketItemInfo(id));
  const tabs=[["owned","保有アイテム",ownedIds.length],["listed","出品中",listedIds.length],["offers","オファー",incoming.length+m.myOffers.filter(o=>o.status==="pending").length],["favorites","お気に入り",favIds.length],["history","取引履歴",null]];
  let body="";
  if(view.accountTab==="owned")body=ownedIds.length?`<div class="notice info pm-inline-note">保有しているNFTは、自分で価格を決めて出品できます。相場の範囲内なら数十秒で売れ、売上はETHで${escapeHtml(wallet.name)}に入金されます。</div>${tradeItemGrid(ownedIds)}`:`<div class="pm-empty"><span>✦</span><p>${escapeHtml(wallet.name)}が保有しているNFTはありません。MintGateやPassMarketでNFTを購入すると表示されます。</p></div>`;
  if(view.accountTab==="listed")body=listedIds.length?`<div class="pm-listing-list">${listedIds.map(id=>{const info=marketItemInfo(id),l=marketRecord(id).listing;return `<div class="pm-listing-row"><button class="pm-listing-item" data-trade-item="${id}" type="button"><img src="${info.image}" alt=""><span><strong>${escapeHtml(info.name)}</strong><small>${escapeHtml(info.collection.name)}</small></span></button><span class="pm-listing-price">${fmtMarketEth(l.price)}</span><span class="pm-listing-actions"><button class="pm-mini" data-trade-action="edit" data-id="${id}" type="button">価格を変更</button><button class="pm-mini" data-trade-action="cancel" data-id="${id}" type="button">取り消す</button></span></div>`}).join("")}</div>`:`<div class="pm-empty"><span>⇡</span><p>出品中のNFTはありません。「保有アイテム」から出品できます。</p></div>`;
  if(view.accountTab==="offers"){
    const mine=[...m.myOffers].reverse().slice(0,20);
    body=`<section class="pm-panel"><div class="pm-panel-head"><h2>届いたオファー</h2><span>${incoming.length}件</span></div>${incoming.length?`<div class="pm-offers">${incoming.map(o=>{const info=marketItemInfo(o.itemId);return `<div class="pm-offer-row open"><span><strong>${fmtMarketEth(o.amount)}</strong><small>${escapeHtml(info.name)}</small></span><span>${escapeHtml(o.from)}<small>${marketRelTime(o.at)}</small></span><span><button class="pm-mini solid" data-trade-action="accept-offer" data-id="${o.itemId}" data-offer="${o.id}" type="button">承諾</button><button class="pm-mini" data-trade-action="decline-offer" data-id="${o.itemId}" data-offer="${o.id}" type="button">辞退</button></span></div>`}).join("")}</div>`:`<p class="pm-muted">届いているオファーはありません。相場より高い価格で出品すると、購入希望者からオファーが届くことがあります。</p>`}</section>
      <section class="pm-panel"><div class="pm-panel-head"><h2>送ったオファー</h2><span>${mine.length}件</span></div>${mine.length?`<div class="pm-offers">${mine.map(o=>{const info=marketItemInfo(o.itemId);return `<div class="pm-offer-row ${o.status}"><span><strong>${fmtMarketEth(o.amount)}</strong><small>${escapeHtml(info?.name||"—")}</small></span><span>${o.status==="pending"?`<small data-offer-countdown="${o.id}">出品者の回答待ち</small>`:`<small>${marketRelTime(o.resolvedAt||o.at)}</small>`}</span><span><em>${{pending:"回答待ち",accepted:"成立",declined:"不成立"}[o.status]}</em></span></div>`}).join("")}</div>`:`<p class="pm-muted">送ったオファーはありません。気になるアイテムのページから、ウォレットのETHを使ってオファーを送れます。</p>`}</section>`;
  }
  if(view.accountTab==="favorites")body=tradeItemGrid(favIds,"お気に入りに登録したアイテムはありません。アイテムの ♥ を押すと登録できます");
  if(view.accountTab==="history")body=tradeActivityRows([...m.activity].reverse().filter(a=>a.mine).slice(0,40));
  return `
    <section class="pm-profile">
      <div class="pm-profile-avatar" aria-hidden="true">${escapeHtml(wallet.address.slice(2,4))}</div>
      <div class="pm-profile-copy"><span class="kicker">MY PAGE</span><h1>${escapeHtml(wallet.name)}</h1><p>Orbit Wallet · ${escapeHtml(shortWalletAddress(wallet.address))} · 残高 ${fmtMarketEth(wallet.ethBalance)}</p></div>
      <dl class="pm-profile-stats"><div><dt>保有</dt><dd>${ownedIds.length}</dd></div><div><dt>出品中</dt><dd>${listedIds.length}</dd></div><div><dt>売却</dt><dd>${soldEntries.length}</dd></div><div><dt>累計売上</dt><dd>${fmtMarketEth(earned)}</dd></div></dl>
    </section>
    <div class="pm-subtabs" role="tablist">${tabs.map(([key,label,count])=>`<button class="${view.accountTab===key?"active":""}" data-trade-chip="accountTab" data-value="${key}" type="button" role="tab" aria-selected="${view.accountTab===key}">${label}${count!==null?`<b>${count}</b>`:""}</button>`).join("")}</div>
    ${body}`;
}
function myMarketEntries(walletId){
  return state.ownedNfts.map((owned,index)=>({owned,index})).filter(({owned})=>!owned.soldAt&&nftOwnerWalletId(owned)===walletId);
}

/* ---------- ページ：売上・送金 ---------- */
function tradeBalancePage(){
  const m=marketState(),b=m.balance,wallet=tradeWallet();
  if(!wallet)return `<div class="dashboard-title"><div><span class="kicker">PROCEEDS</span><h1>売上・送金</h1><p>NFTの売上は、手数料を差し引いたETHがウォレットに直接入金されます。</p></div></div>${tradeConnectPrompt("売上を確認・送金するには、売上を受け取るOrbit Walletを接続してください。")}`;
  const ledger=[...m.ledger].reverse().slice(0,40);
  const lastSale=[...m.ledger].reverse().find(l=>l.type==="sale");
  const statusLabel={done:"完了",processing:"ネットワーク承認待ち",hold:"確保中",released:"返還済み"};
  const address=m.transferAddress;
  return `
    <div class="dashboard-title"><div><span class="kicker">PROCEEDS</span><h1>売上・送金</h1><p>NFTの売上は、手数料を差し引いたETHがウォレットに直接入金されます。日本円に換える場合は、取引所へ送金して売却します。</p></div></div>
    <section class="pm-balance-grid">
      <div class="pm-balance-card"><span>${escapeHtml(wallet.name)}の残高（接続中）</span><strong>${fmtMarketEth(wallet.ethBalance)}</strong><span class="pm-balance-yen">${fmtYenApprox(wallet.ethBalance)}</span><dl><div><dt>累計売上</dt><dd>${fmtMarketEth(b.earned)}</dd></div><div><dt>オファーで確保中</dt><dd>${fmtMarketEth(b.reserved)}</dd></div><div><dt>送金中</dt><dd>${fmtMarketEth(b.pending)}</dd></div></dl>
        <div class="pm-balance-actions"><button class="pm-btn light" data-trade-action="withdraw" type="button">取引所へ送金する</button><button class="pm-btn outline-light" data-trade-tab="account" type="button">NFTを出品する</button></div></div>
      <div class="pm-bank-card"><div class="pm-panel-head"><h2>送金先アドレス</h2>${address?`<button class="pm-link" data-trade-action="bank" type="button">変更</button>`:""}</div>
        ${address?`<div class="pm-bank"><span class="pm-bank-icon" aria-hidden="true">E</span><div><strong>NOVA Exchange（ETH入金アドレス）</strong><small>${escapeHtml(shortWalletAddress(address))}</small><small>ネットワーク：Ethereum</small></div></div>`:`<p class="pm-muted">送金するには、NOVA ExchangeのETH入金アドレスを登録してください。</p><button class="pm-btn primary" data-trade-action="bank" type="button">送金先アドレスを登録する</button>`}
        ${address&&state.exchangeEth>0?`<button class="pm-btn ghost pm-sell-link" data-trade-action="exchange-sell" type="button">取引所のETH ${fmtMarketEth(state.exchangeEth)} を売却する →</button>`:""}
        <ul class="pm-fee-list"><li><span>ネットワーク手数料（ガス代）</span><b>約${fmtMarketEth(marketGas("transfer"))}</b></li><li><span>最低送金額</span><b>${fmtMarketEth(TRADE_TRANSFER_MIN_ETH)}</b></li><li><span>着金までの目安</span><b>数分〜（混雑状況による）</b></li></ul>
      </div>
    </section>
    ${lastSale?`<section class="pm-panel pm-breakdown"><div class="pm-panel-head"><h2>直近の売上の内訳</h2><span>${escapeHtml(lastSale.title)}</span></div><div class="summary"><div class="summary-row"><span>販売価格（購入者の支払額）</span><strong>${fmtMarketEth(lastSale.gross)}</strong></div><div class="summary-row"><span>マーケット手数料（${(MARKET_FEE_RATE*100).toFixed(1)}%）</span><strong>−${fmtMarketEth(lastSale.platformFee)}</strong></div><div class="summary-row"><span>クリエイター収益（主催者・制作者へ還元）</span><strong>−${fmtMarketEth(lastSale.royalty)}</strong></div><div class="summary-row total"><span>ウォレットへの入金額</span><strong>${fmtMarketEth(lastSale.amount)}</strong></div></div></section>`:""}
    <section class="pm-panel"><div class="pm-panel-head"><h2>ETHの入出金履歴</h2><span>${ledger.length}件</span></div>
      ${ledger.length?`<div class="pm-ledger">${ledger.map(l=>`<div class="pm-ledger-row ${l.amount>=0?"plus":"minus"}"><span class="pm-ledger-icon" aria-hidden="true">${{sale:"Ξ",purchase:"⇣",transfer:"⇢",offer_hold:"✋",offer_refund:"↺",gas:"⛽"}[l.type]||"・"}</span><span class="pm-ledger-title"><strong>${escapeHtml(l.title)}</strong><small>${new Date(l.at).toLocaleString("ja-JP")}${l.walletId?`・${escapeHtml(walletById(l.walletId)?.name||"")}`:""}${l.type==="transfer"?`・ガス代 ${fmtMarketEth(l.gas)}`:""}</small></span><span class="pm-ledger-amount">${l.amount>=0?"+":"−"}${fmtMarketEth(Math.abs(l.amount))}<small ${l.transferId&&l.status==="processing"?`data-transfer-countdown="${l.transferId}"`:""}>${statusLabel[l.status]||""}</small></span></div>`).join("")}</div>`:`<p class="pm-muted">まだ履歴はありません。NFTが売れると、ここに売上が表示されます。</p>`}
    </section>
    <div class="prototype-strip">研究用の疑似処理です。実際のブロックチェーン通信や送金は行いません。</div>`;
}

/* ---------- ページ：検索 ---------- */
function tradeSearchPage(){
  const q=tradeView().query.trim().toLowerCase();
  const collections=MARKET_COLLECTIONS.filter(c=>[c.name,c.creator,marketCategoryLabel(c.category)].some(v=>v.toLowerCase().includes(q)));
  const ids=sortMarketItems(allMarketItemIds().filter(id=>{const info=marketItemInfo(id);return info&&[info.name,info.collection.name,...info.traits.map(t=>t.value)].some(v=>String(v).toLowerCase().includes(q))}),"recommended").slice(0,48);
  return `
    <div class="dashboard-title"><div><span class="kicker">SEARCH</span><h1>「${escapeHtml(tradeView().query.trim())}」の検索結果</h1><p>コレクション ${collections.length}件・アイテム ${ids.length}件</p></div><button class="pm-link" data-trade-action="clear-search" type="button">検索をクリア ×</button></div>
    ${collections.length?`<section class="pm-section"><div class="pm-section-head"><h2>コレクション</h2></div><div class="pm-collection-row">${collections.map(tradeCollectionCard).join("")}</div></section>`:""}
    <section class="pm-section"><div class="pm-section-head"><h2>アイテム</h2></div>${tradeItemGrid(ids,"一致するアイテムが見つかりませんでした")}</section>`;
}

/* ---------- はじめてガイド（マーケットを初めて開いたとき） ---------- */
const TRADE_GUIDE_STEPS=[
  {target:".pm-hero",mobileTarget:".pm-hero-copy",label:"二次流通",title:"NFTはマーケットプレイスで売買できます",description:"運営元が二次流通（転売）を認めている場合、購入したNFTをマーケットプレイスで売買できます。"},
  {target:null,wide:true,label:"運営への還元",title:"公認の二次流通では、運営にも手数料が入ります",description:"転売が公式に認められた形で行えます。メルカリなどの従来のCtoCサービスとは違い、売買が成立すると、その手数料の一部が運営側に入ります。このマーケットでも、販売額の一部が「クリエイター収益」として運営元・制作元に還元され、継続的な財源の確保に繋がります。",
    image:{src:"./assets/guide/resale-fee-diagram.png",alt:"従来のサービスでは売買の手数料がマーケットプレイスのみに入るのに対し、NFTの二次流通ではマーケットプレイスと製作元・運営の両方に手数料が入ることを示す図"}},
  {target:".pm-collection-row",label:"使用後も残る価値",title:"使用後のNFTチケットも取引されることがあります",description:"NFTチケットの場合、アートとしての価値がある、長期的な特典が付いている、サインが入っているといった付加価値があれば、イベントで使用した後も売買される可能性があります。"},
  {target:"#tradeLiveTicker",label:"NFTだからできること",title:"所有者と取引履歴を記録できるNFTだからこそ",description:"使用後も価値が残り、取引が続くことは、通常の電子チケットでは難しいことです。所有者や取引履歴を記録し、本物であること（真正性）を証明できるNFTだからこそ実現できる仕組みです。"},
  {target:".pm-chips",label:"さまざまなジャンル",title:"NFTチケット以外にも、さまざまなNFTがあります",description:"マーケットには、NFTチケットのほかにも、アート、ゲーム、観光の記念品など、さまざまなジャンルのNFTが出品されています。例えば、NFTゲームでは、獲得したキャラクターやアイテムがNFTとなり、外部ウォレットに移してマーケットで他のユーザーと売買できます。取引には暗号資産や日本円などが使われます。レア度が高く高個体なものほど価格が高くなるといったように、資産性を持つようになります。"},
  {target:".pm-hero-actions",label:"体験してみましょう",title:"実際に売買を体験してみましょう",description:"ぜひ、ウォレットにある購入済みのチケットを売却したり、マーケットでNFTを購入したりして、NFTの売買を体験してみてください。"}
];
let tradeGuideStep=0;
let tradeGuideTarget=null;
let tradeGuideScheduled=false;
function tradeGuideOpen(){const guide=document.getElementById("tradeGuide");return !!guide&&!guide.classList.contains("hidden")}
function maybeStartTradeGuide(){
  const view=tradeView();
  if(state.tradeGuideCompleted||tradeGuideScheduled||tradeGuideOpen()||state.currentApp!=="trade"||view.page||view.query.trim()||view.tab!=="explore")return;
  tradeGuideScheduled=true;
  // 先に達成した手順の通知を表示し終えてから、マーケットのガイドを開く。
  if(missionCompletionNoticeActive||missionCompletionNoticeQueue.length||progressGuideOpen()){
    setTimeout(()=>{tradeGuideScheduled=false;maybeStartTradeGuide()},250);
    return;
  }
  requestAnimationFrame(()=>{tradeGuideScheduled=false;if(!state.tradeGuideCompleted&&state.currentApp==="trade")startTradeGuide()});
}
function startTradeGuide(replay=false){
  if(tradeGuideOpen()||!$("modal").classList.contains("hidden")||progressGuideOpen()||positionedGuideOpen())return;
  const view=tradeView();
  if(view.page||view.query.trim()||view.tab!=="explore")setTradeTab("explore");
  tradeGuideStep=0;
  document.documentElement.classList.add("trade-guide-open");document.body.classList.add("trade-guide-open");
  $("tradeGuideBackdrop").classList.remove("hidden");$("tradeGuideBackdrop").setAttribute("aria-hidden","false");
  $("tradeGuide").classList.remove("hidden");
  log("trade_guide_started",{replay});
  startGuideGeometryMonitor();
  renderTradeGuideStep();
}
function tradeGuideSelector(step){
  if(!step.target)return null;
  return `#tradeContent ${window.matchMedia("(max-width: 760px)").matches&&step.mobileTarget?step.mobileTarget:step.target}`;
}
function tradeGuideStepTarget(step){const selector=tradeGuideSelector(step);return selector?document.querySelector(selector):null}
function setTradeGuideTarget(target){
  tradeGuideTarget?.classList.remove("wallet-guide-highlight","pm-guide-highlight");
  tradeGuideTarget=target||null;
  tradeGuideTarget?.classList.add("wallet-guide-highlight","pm-guide-highlight");
}
function renderTradeGuideStep(){
  const step=TRADE_GUIDE_STEPS[tradeGuideStep],last=tradeGuideStep===TRADE_GUIDE_STEPS.length-1;
  setTradeGuideTarget(tradeGuideStepTarget(step));
  $("tradeGuide").classList.toggle("trade-guide-wide",!!step.wide);
  const figure=$("tradeGuideFigure");
  figure.classList.toggle("hidden",!step.image);
  if(step.image&&figure.getAttribute("src")!==step.image.src){figure.onload=positionTradeGuide;figure.src=step.image.src}
  figure.alt=step.image?.alt||"";
  $("tradeGuideLabel").textContent=`${tradeGuideStep+1} / ${TRADE_GUIDE_STEPS.length} · ${step.label}`;
  $("tradeGuideTitle").textContent=step.title;
  $("tradeGuideDescription").textContent=step.description;
  $("tradeGuideDots").innerHTML=TRADE_GUIDE_STEPS.map((_,index)=>`<i class="${index<tradeGuideStep?"done":index===tradeGuideStep?"active":""}"></i>`).join("");
  $("tradeGuideNext").innerHTML=last?'はじめる <span aria-hidden="true">✓</span>':'次へ <span aria-hidden="true">→</span>';
  $("tradeGuide").scrollTop=0;
  log("trade_guide_step_viewed",{step:tradeGuideStep+1,topic:step.label});
  const placeGuide=()=>{if(tradeGuideOpen()&&TRADE_GUIDE_STEPS[tradeGuideStep]===step){keepTradeGuideTargetInView();positionTradeGuide()}};
  requestAnimationFrame(()=>{
    if(!tradeGuideOpen())return;
    placeGuide();
    $("tradeGuideNext").focus({preventScroll:true});
    whenScrollSettles(placeGuide);
  });
}
function refreshTradeGuideTarget(){
  if(!tradeGuideOpen())return;
  const target=tradeGuideStepTarget(TRADE_GUIDE_STEPS[tradeGuideStep]);
  if(target!==tradeGuideTarget)setTradeGuideTarget(target);
  positionTradeGuide();
}
function keepTradeGuideTargetInView(){
  if(!tradeGuideTarget?.isConnected)return;
  const mobile=window.matchMedia("(max-width: 760px)").matches,rect=tradeGuideTarget.getBoundingClientRect();
  const top=mobile?84:110,bottom=window.innerHeight-(mobile?$("tradeGuide").offsetHeight+28:16);
  if(rect.top<top||rect.bottom>bottom)window.scrollTo({top:Math.max(0,rect.top+window.scrollY-top),behavior:"auto"});
}
function positionTradeGuide(){
  if(!tradeGuideOpen())return;
  const bubble=$("tradeGuide");
  ["top","right","bottom","left"].forEach(side=>bubble.style.removeProperty(side));
  if(window.matchMedia("(max-width: 760px)").matches)return;
  if(!tradeGuideTarget?.isConnected){
    bubble.style.left=`${Math.max(16,(window.innerWidth-bubble.offsetWidth)/2)}px`;bubble.style.top=`${Math.max(16,(window.innerHeight-bubble.offsetHeight)/2)}px`;bubble.style.right="auto";
    return;
  }
  const r=tradeGuideTarget.getBoundingClientRect(),margin=16,gap=18,width=bubble.offsetWidth,height=bubble.offsetHeight,W=window.innerWidth,H=window.innerHeight;
  const clampX=x=>Math.min(W-width-margin,Math.max(margin,x)),clampY=y=>Math.min(H-height-margin,Math.max(margin,y));
  let left,top;
  if(r.right+gap+width<=W-margin){left=r.right+gap;top=clampY(r.top+(r.height-height)/2)}
  else if(r.left-gap-width>=margin){left=r.left-gap-width;top=clampY(r.top+(r.height-height)/2)}
  else if(r.bottom+gap+height<=H-margin){top=r.bottom+gap;left=clampX(r.left)}
  else if(r.top-gap-height>=margin){top=r.top-gap-height;left=clampX(r.left)}
  else{top=H-height-margin;left=W-width-margin}
  bubble.style.left=`${left}px`;bubble.style.top=`${top}px`;bubble.style.right="auto";
}
function advanceTradeGuide(){
  if(!tradeGuideOpen())return;
  if(tradeGuideStep>=TRADE_GUIDE_STEPS.length-1){closeTradeGuide();return}
  tradeGuideStep++;renderTradeGuideStep();
}
function closeTradeGuide(){
  if(!tradeGuideOpen())return;
  setTradeGuideTarget(null);
  $("tradeGuideBackdrop").classList.add("hidden");$("tradeGuideBackdrop").setAttribute("aria-hidden","true");
  $("tradeGuide").classList.add("hidden");
  document.documentElement.classList.remove("trade-guide-open");document.body.classList.remove("trade-guide-open");
  state.tradeGuideCompleted=true;
  log("trade_guide_completed",{step:tradeGuideStep+1});
  renderMission();
  persistState();
  scheduleMissionCompletionNoticeResume();
}

/* ---------- 描画とイベント ---------- */
function renderTrade(){
  updateTradeChrome();
  const content=document.getElementById("tradeContent");
  if(!content||!state.participantId||state.currentApp!=="trade")return;
  const view=tradeView();
  document.querySelectorAll("#tradeTabs button").forEach(button=>button.classList.toggle("active",!view.query.trim()&&button.dataset.tradeTab===view.tab));
  let html;
  if(view.query.trim())html=tradeSearchPage();
  else if(view.page==="item")html=tradeItemPage(view.id);
  else if(view.page==="collection")html=tradeCollectionPage(view.id);
  else html=({explore:tradeExplorePage,rankings:tradeRankingsPage,activity:tradeActivityPage,account:tradeAccountPage,balance:tradeBalancePage}[view.tab]||tradeExplorePage)();
  content.innerHTML=html;
  hydrateTradeCharts();
  if(tradeGuideOpen())refreshTradeGuideTarget();else maybeStartTradeGuide();
}
function handleTradeClick(event){
  const target=event.target;
  const fav=target.closest("[data-fav]");if(fav){event.stopPropagation();toggleMarketFavorite(fav.dataset.fav);return}
  const tab=target.closest("[data-trade-tab]");if(tab){setTradeTab(tab.dataset.tradeTab);return}
  const chip=target.closest("[data-trade-chip]");
  if(chip){const view=tradeView();view[chip.dataset.tradeChip]=chip.dataset.value;if(chip.dataset.tradeChip==="category")view.visible=24;renderTrade();return}
  const action=target.closest("[data-trade-action]");
  if(action){event.stopPropagation();runTradeAction(action.dataset.tradeAction,action.dataset.id,action.dataset.offer);return}
  const collection=target.closest("[data-trade-collection]");if(collection){openTradeCollection(collection.dataset.tradeCollection);return}
  const item=target.closest("[data-trade-item]");if(item){openTradeItem(item.dataset.tradeItem)}
}
function runTradeAction(action,itemId,offerId){
  if(action==="back")tradeBack();
  else if(action==="buy")openMarketCheckout(itemId);
  else if(action==="offer")openMakeOfferModal(itemId);
  else if(action==="list")openListingModal(itemId,"create");
  else if(action==="edit")openListingModal(itemId,"edit");
  else if(action==="cancel")openCancelListingModal(itemId);
  else if(action==="accept-offer")openAcceptOfferModal(itemId,offerId);
  else if(action==="decline-offer")declineIncomingOffer(itemId,offerId);
  else if(action==="withdraw")openTradeTransferModal();
  else if(action==="bank")openTransferAddressModal();
  else if(action==="connect")connectTradeWallet();
  else if(action==="exchange-sell")openExchangeSell();
  else if(action==="open-wallet-app"){state.currentWalletTab="wallet-home";switchApp("wallet")}
  else if(action==="more"){tradeView().visible+=24;renderTrade()}
  else if(action==="guide")startTradeGuide(true);
  else if(action==="scroll-items")document.getElementById("tradeItemsSection")?.scrollIntoView({behavior:"smooth",block:"start"});
  else if(action==="clear-search"){tradeView().query="";const search=document.getElementById("tradeSearch");if(search)search.value="";renderTrade()}
  else if(action==="open-wallet"){
    const entryIndex=state.ownedNfts.findIndex(e=>!e.soldAt&&marketItemIdForEntry(e)===itemId);
    if(entryIndex<0)return;
    const owner=state.ownedNfts[entryIndex].ownerWalletId;
    if(walletById(owner)){state.activeWalletId=owner;syncLegacyWalletState()}
    state.currentWalletTab="wallet-nft";switchApp("wallet");requestAnimationFrame(()=>openOwnedNftDetail(entryIndex));
  }
}
function handleTradeChange(event){
  const view=tradeView(),select=event.target.closest("[data-trade-select]"),toggle=event.target.closest("[data-trade-toggle]");
  if(select){view[select.dataset.tradeSelect]=select.value;renderTrade()}
  if(toggle){view[toggle.dataset.tradeToggle]=toggle.checked;view.visible=24;renderTrade()}
}
function handleTradeKeydown(event){
  if(event.key!=="Enter"&&event.key!==" ")return;
  const card=event.target.closest("[data-trade-item],[data-trade-collection]");
  if(!card||card!==event.target||card.tagName==="BUTTON")return;
  event.preventDefault();
  if(card.dataset.tradeItem)openTradeItem(card.dataset.tradeItem);else openTradeCollection(card.dataset.tradeCollection);
}
function handleTradeSearch(event){
  clearTimeout(tradeSearchTimer);
  tradeSearchTimer=setTimeout(()=>{
    const view=tradeView();view.query=event.target.value;
    if(view.query.trim()){view.page=null;view.id=null;log("market_search",{query:view.query.trim()})}
    renderTrade();
  },300);
}
function openTradeNotifications(){
  const m=marketState(),items=[...m.notifications].reverse();
  items.forEach(n=>{n.read=true});updateTradeChrome();
  log("market_notifications_opened",{count:items.length});
  openModal("NOTIFICATIONS","お知らせ",items.length?`<div class="pm-notices">${items.map(n=>`<button class="pm-notice ${n.kind}" ${n.itemId&&marketItemInfo(n.itemId)?`data-notice-item="${n.itemId}"`:n.kind==="transfer"?'data-notice-exchange="1"':'data-notice-balance="1"'} type="button"><span aria-hidden="true">${{sold:"Ξ",offer:"✋",offer_accepted:"✓",offer_declined:"↺",transfer:"⇢",expired:"⏱"}[n.kind]||"・"}</span><span><strong>${escapeHtml(n.title)}</strong><small>${escapeHtml(n.body)}</small><em>${marketRelTime(n.at)}</em></span></button>`).join("")}</div>`:`<div class="pm-empty compact"><p>お知らせはまだありません。NFTが売れたり、オファーが届いたりするとここに表示されます。</p></div>`);
  document.querySelectorAll("[data-notice-item]").forEach(button=>button.onclick=()=>{closeModal();if(state.currentApp!=="trade")switchApp("trade");const view=tradeView();view.query="";openTradeItem(button.dataset.noticeItem)});
  document.querySelectorAll("[data-notice-balance]").forEach(button=>button.onclick=()=>{closeModal();if(state.currentApp!=="trade")switchApp("trade");setTradeTab("balance")});
  document.querySelectorAll("[data-notice-exchange]").forEach(button=>button.onclick=()=>{closeModal();openExchangeSell()});
}
function openExchangeSell(){log("passmarket_exchange_sell_opened");state.currentExchangeTab="exchange-sell";switchApp("exchange")}
function onMarketModalClosed(){marketModalItemId=null}
function marketModalItemHeader(info){
  return `<div class="pm-modal-item"><img src="${info.image}" alt=""><div><small>${escapeHtml(info.collection.name)}</small><strong>${escapeHtml(info.name)}</strong><span>${info.isTicket?"NFTチケット":escapeHtml(info.tierLabel)}・トークンID ${escapeHtml(info.tokenLabel)}</span></div></div>`;
}

/* ---------- 出品 ---------- */
function marketNeedsApproval(walletId,collectionId){return !marketState().approvals?.[walletId]?.[collectionId]}
function openListingModal(itemId,mode="create"){
  const entry=myEntryForItem(itemId),info=marketItemInfo(itemId);
  if(!entry||!info){error("このNFTは保有していません");return}
  requireTradeWallet(wallet=>renderListingForm(itemId,mode,wallet),entry.ownerWalletId);
}
function renderListingForm(itemId,mode,wallet){
  const info=marketItemInfo(itemId),rec=marketRecord(itemId);
  if(!myEntryForItem(itemId)||!info){error("このNFTは保有していません");return}
  if(mode==="edit"&&!rec.listing)mode="create";
  if(mode==="create"&&rec.listing)mode="edit";
  const range=marketPriceRange(itemId),floor=collectionFloor(info.collection.id);
  const suggested=mode==="edit"?rec.listing.price:Math.min(range.cap,niceEth((range.low+range.high)/2));
  const needsApproval=mode==="create"&&marketNeedsApproval(wallet.id,info.collection.id);
  listingDurationDays=rec.listing?.durationDays||7;
  log("market_listing_form_opened",{item_id:itemId,mode,wallet_id:wallet.id,needs_approval:needsApproval,fair_range_eth:range});
  openModal(mode==="edit"?"EDIT LISTING":"LIST FOR SALE",mode==="edit"?"出品価格を変更":"マーケットに出品",`
    ${marketModalItemHeader(info)}
    <div class="pm-market-ref">
      <div class="main"><span>売れやすい価格帯</span><strong>${fmtMarketEth(range.low)} 〜 ${fmtMarketEth(range.high)}</strong></div>
      <div><span>フロア価格</span><strong>${floor?fmtMarketEth(floor):"—"}</strong></div>
      <div><span>最終取引</span><strong>${rec.lastSalePrice?fmtMarketEth(rec.lastSalePrice):"—"}</strong></div>
    </div>
    ${range.face?`<div class="pm-note ticket compact"><b>公式リセール</b><span>主催者の設定により、定価（${fmtMarketEth(range.cap)}）を超える価格では出品できません。</span></div>`:""}
    <label class="pm-field-label" for="listingPrice">出品価格</label>
    <div class="amount-box pm-price-input"><input id="listingPrice" class="input" inputmode="decimal" autocomplete="off" value="${suggested}" aria-describedby="listingEstimate"><span>ETH</span></div>
    <p class="pm-input-yen" id="listingYen"></p>
    <div class="pm-quick-prices">
      <button type="button" data-listing-quick="${range.low}">相場の下限</button>
      <button type="button" data-listing-quick="${Math.min(range.cap,niceEth((range.low+range.high)/2))}">相場の中央</button>
      <button type="button" data-listing-quick="${range.high}">相場の上限</button>
      ${floor?`<button type="button" data-listing-quick="${Math.min(range.cap,floor)}">フロアに合わせる</button>`:""}
    </div>
    <div class="pm-gauge" aria-hidden="true"><div class="pm-gauge-track"><i class="low" id="listingZoneLow"></i><i class="fair" id="listingZoneFair"></i><i class="high" id="listingZoneHigh"></i></div><b id="listingGaugeMarker"></b><div class="pm-gauge-labels"><span>安い</span><span>売れやすい</span><span>${range.face?"上限超え":"高い"}</span></div></div>
    <p id="listingEstimate" class="pm-estimate" role="status"></p>
    ${mode==="create"?`<div class="pm-field-label">出品期間</div><div class="pm-duration" role="radiogroup" aria-label="出品期間">${[[1,"1日"],[3,"3日"],[7,"7日"],[30,"1か月"]].map(([days,label])=>`<button type="button" role="radio" data-listing-days="${days}" aria-checked="${days===listingDurationDays}" class="${days===listingDurationDays?"active":""}">${label}</button>`).join("")}</div>`:""}
    <div class="summary pm-fee-summary" id="listingFees"></div>
    ${needsApproval?`<div class="notice warning pm-approval-note"><strong>初回のみ：コレクションの承認が必要です</strong><br>${escapeHtml(info.collection.name)}を${escapeHtml(wallet.name)}から初めて出品するため、PassMarketにNFTの移動を許可する承認トランザクション（ガス代 約${fmtMarketEth(marketGas("approve"))}）に署名します。その後、出品内容へ署名します（ガス代なし）。</div>`:`<div class="notice info pm-approval-note">出品は出品内容へのメッセージ署名だけで完了します（ガス代なし）。</div>`}
    <label class="check pm-low-confirm hidden" id="listingLowConfirmWrap"><input id="listingLowConfirm" type="checkbox"><span>相場より安い価格で出品することを確認しました</span></label>
    <button id="submitListing" class="primary pm-modal-primary" type="button">${needsApproval?"承認と署名に進む":mode==="edit"?"ウォレットで署名して価格を変更":"ウォレットで署名して出品する"}</button>
    <div class="prototype-strip payment-prototype-strip">研究用の疑似取引です。売れやすい価格帯で出品すると、数十秒で他のユーザーが購入します。</div>`);
  marketModalItemId=itemId;
  const input=$("listingPrice");
  bindNumericInput(input,sanitizeEthInput,()=>updateListingPreview(itemId));
  document.querySelectorAll("[data-listing-quick]").forEach(button=>button.onclick=()=>{input.value=button.dataset.listingQuick;updateListingPreview(itemId);log("market_listing_quick_price",{item_id:itemId,price_eth:Number(button.dataset.listingQuick),label:button.textContent})});
  document.querySelectorAll("[data-listing-days]").forEach(button=>button.onclick=()=>{listingDurationDays=Number(button.dataset.listingDays);document.querySelectorAll("[data-listing-days]").forEach(b=>{b.classList.toggle("active",b===button);b.setAttribute("aria-checked",String(b===button))})});
  $("listingLowConfirm").onchange=()=>updateListingPreview(itemId);
  $("submitListing").onclick=()=>submitListing(itemId,mode,wallet);
  updateListingPreview(itemId);
}
function listingInputPrice(){return Number(Number($("listingPrice")?.value||0).toFixed(4))||0}
function listingValidation(itemId,price){
  const cap=marketPriceCap(itemId);
  if(price<MARKET_MIN_PRICE)return `${fmtMarketEth(MARKET_MIN_PRICE)}以上の金額を入力してください`;
  if(price>cap+1e-9)return cap<MARKET_MAX_PRICE?`主催者の設定により、定価（${fmtMarketEth(cap)}）を超える価格では出品できません`:`${MARKET_MAX_PRICE} ETH以下の金額を入力してください`;
  return null;
}
function updateListingPreview(itemId){
  const info=marketItemInfo(itemId);if(!info||!$("listingEstimate"))return;
  const price=listingInputPrice(),range=marketPriceRange(itemId),invalid=listingValidation(itemId,price);
  const min=Math.max(0,range.low*.5),max=range.face?range.cap*1.12:range.high*1.6,pos=v=>Math.max(0,Math.min(100,(v-min)/(max-min)*100));
  $("listingZoneLow").style.width=`${pos(range.low)}%`;$("listingZoneFair").style.width=`${pos(range.high)-pos(range.low)}%`;$("listingZoneHigh").style.width=`${100-pos(range.high)}%`;
  $("listingGaugeMarker").style.left=`${pos(price)}%`;$("listingGaugeMarker").classList.toggle("hidden",!price);
  $("listingYen").textContent=price?`${fmtYenApprox(price)}（現在のETH価格で換算）`:"";
  const est=marketSaleEstimate(itemId,price),estimate=$("listingEstimate");
  let text,tone;
  if(invalid){text=invalid;tone="error"}
  else if(est.zone==="low"){text=`相場より安い価格です。約10秒以内に売れる見込みです。`;tone="low"}
  else if(est.zone==="fair"){text=`売れやすい価格です。約${Math.max(5,est.seconds-5)}〜${est.seconds+5}秒で売れる見込みです。`;tone="fair"}
  else {text="相場より高いため、すぐには売れにくい価格です。購入希望者からオファーが届くことがあります。";tone="high"}
  estimate.textContent=text;estimate.className=`pm-estimate ${tone}`;
  const fees=marketFees(price,info.collection);
  $("listingFees").innerHTML=`<div class="summary-row"><span>販売価格</span><strong>${price?fmtMarketEth(price):"—"}</strong></div><div class="summary-row"><span>マーケット手数料（${(MARKET_FEE_RATE*100).toFixed(1)}%）</span><strong>−${fmtMarketEth(fees.platform)}</strong></div><div class="summary-row"><span>クリエイター収益（${(info.collection.royalty*100).toFixed(1).replace(/\.0$/,"")}%）</span><strong>−${fmtMarketEth(fees.royalty)}</strong></div><div class="summary-row total"><span>受取予定額（ウォレットへ）</span><strong>${price?fmtMarketEth(fees.net):"—"}</strong></div>`;
  const lowWrap=$("listingLowConfirmWrap"),needsConfirm=!invalid&&est.zone==="low";
  lowWrap.classList.toggle("hidden",!needsConfirm);
  $("submitListing").disabled=!!invalid||(needsConfirm&&!$("listingLowConfirm").checked);
}
function submitListing(itemId,mode,wallet){
  const price=listingInputPrice(),invalid=listingValidation(itemId,price);
  if(invalid){error(invalid);return}
  if(!myEntryForItem(itemId)){error("このNFTは保有していません");closeModal();return}
  const info=marketItemInfo(itemId),days=listingDurationDays;
  if(mode==="create"&&marketNeedsApproval(wallet.id,info.collection.id)){
    openMarketTxSignature({title:"コレクションの承認",wallet,operation:"コレクションの承認（setApprovalForAll）",purpose:"passmarket_collection_approval",gasKind:"approve",
      rows:[["対象コレクション",info.collection.name],["承認先","PassMarket Conduit"],["承認先アドレス",`${MARKET_CONDUIT_ADDRESS.slice(0,8)}…${MARKET_CONDUIT_ADDRESS.slice(-4)}`],["送金額","0 ETH"]],
      warning:"承認すると、PassMarketがこのコレクションのNFTを移動できるようになります（売買が成立したときのみ）。悪意のあるサイトで承認するとNFTを盗まれる可能性があるため、承認先を必ず確認してください。",
      onSign:signer=>{spendWalletGas(signer,"approve",`コレクションの承認（${info.collection.name}）`,itemId);startMarketTx({kind:"approve",label:"コレクションの承認",walletId:signer.id,collectionId:info.collection.id,itemId,price,days})},
      onReject:()=>renderListingForm(itemId,mode,wallet)});
    return;
  }
  openListingSignature(itemId,price,days,mode,wallet);
}
function openListingSignature(itemId,price,days,mode,wallet){
  const info=marketItemInfo(itemId),fees=marketFees(price,info.collection);
  const expiry=new Date(Date.now()+days*MARKET_DAY_MS).toLocaleDateString("ja-JP");
  openMarketMessageSignature({title:mode==="edit"?"価格変更への署名":"出品内容への署名",subtitle:"PassMarketへの出品注文（EIP-712）",wallet,purpose:mode==="edit"?"passmarket_listing_update":"passmarket_listing",confirmLabel:mode==="edit"?"署名して価格を変更":"署名して出品",
    rows:[["出品するNFT",info.name],["出品価格",fmtMarketEth(price)],["受取予定額",fmtMarketEth(fees.net)],...(mode==="create"?[["出品期限",expiry]]:[]),["資産移動","売買が成立したときのみ"],["ガス代","なし"]],
    message:`PassMarket Order<br><br>Offerer: ${escapeHtml(wallet.address)}<br>Token: ${escapeHtml(info.collection.name)} #${escapeHtml(info.tokenLabel)}<br>Price: ${price} ETH<br>Conduit: ${MARKET_CONDUIT_ADDRESS.slice(0,10)}…`,
    onSign:()=>{
      const ok=mode==="edit"?updateMyListing(itemId,price):createMyListing(itemId,price,days);
      if(!ok){closeModal();error("このNFTはすでに売却済みか、出品状態が変わりました");refreshMarketViews();return}
      renderAll();showListingDone(itemId,mode);
    },
    onReject:()=>renderListingForm(itemId,mode,wallet)});
  marketModalItemId=itemId;
}
function showListingDone(itemId,mode){
  const info=marketItemInfo(itemId),listing=marketRecord(itemId).listing;
  if(!info||!listing){closeModal();return}
  openModal("LISTED",mode==="edit"?"価格を変更しました":"出品が完了しました",`
    <div class="completion-card pm-done"><div class="success-check">✓</div><h2>${fmtMarketEth(listing.price)}</h2><p>${escapeHtml(info.name)} を PassMarket に出品しました。</p></div>
    <p class="pm-muted center">売れると通知が届き、売上がETHでウォレットに入金されます。この画面を閉じても取引は続きます。</p>
    <div class="button-row"><button id="listingDoneView" class="primary" type="button">アイテムページを見る</button><button id="listingDoneClose" class="secondary" type="button">閉じる</button></div>`);
  marketModalItemId=itemId;
  $("listingDoneClose").onclick=closeModal;
  $("listingDoneView").onclick=()=>openTradeItemFromApp(itemId);
}
function openCancelListingModal(itemId){
  const info=marketItemInfo(itemId),listing=marketRecord(itemId).listing,entry=myEntryForItem(itemId);
  if(!info||!listing||listing.seller!=="me"||!entry)return;
  requireTradeWallet(wallet=>{
    openModal("CANCEL LISTING","出品を取り消しますか？",`${marketModalItemHeader(info)}
      <div class="summary" style="margin-top:14px"><div class="summary-row"><span>現在の出品価格</span><strong>${fmtMarketEth(listing.price)}</strong></div><div class="summary-row"><span>取り消しのガス代（手数料）</span><strong>約${fmtMarketEth(marketGas("cancel"))}</strong></div></div>
      <p class="pm-muted">出品の取り消しはブロックチェーン上の取引として記録されるため、ガス代がかかります。届いているオファーも終了します。</p>
      <div class="button-row"><button id="confirmCancelListing" class="danger-btn" type="button">ウォレットで取り消す</button><button id="keepListing" class="secondary" type="button">出品を続ける</button></div>`);
    marketModalItemId=itemId;
    $("keepListing").onclick=closeModal;
    $("confirmCancelListing").onclick=()=>openMarketTxSignature({title:"出品の取り消し",wallet,operation:"出品注文の取り消し（cancel）",purpose:"passmarket_listing_cancel",gasKind:"cancel",
      rows:[["対象NFT",info.name],["出品価格",fmtMarketEth(listing.price)],["送金額","0 ETH"]],
      warning:"署名すると、出品注文を無効にするトランザクションが送信されます。",
      onSign:signer=>{spendWalletGas(signer,"cancel",`出品の取り消し（${info.name}）`,itemId);startMarketTx({kind:"cancel",label:"出品の取り消し",walletId:signer.id,itemId})}});
  },entry.ownerWalletId);
}
function openAcceptOfferModal(itemId,offerId){
  const info=marketItemInfo(itemId),offer=marketRecord(itemId).offers.find(o=>o.id===offerId&&o.status==="open"),entry=myEntryForItem(itemId);
  if(!info||!offer||!entry){error("このオファーは受け付けを終了しました");refreshMarketViews();return}
  requireTradeWallet(wallet=>{
    const fees=marketFees(offer.amount,info.collection);
    openModal("ACCEPT OFFER","オファーを承諾しますか？",`${marketModalItemHeader(info)}
      <div class="summary" style="margin-top:14px"><div class="summary-row"><span>オファー金額（${escapeHtml(offer.from)}）</span><strong>${fmtMarketEth(offer.amount)}</strong></div><div class="summary-row"><span>マーケット手数料</span><strong>−${fmtMarketEth(fees.platform)}</strong></div><div class="summary-row"><span>クリエイター収益</span><strong>−${fmtMarketEth(fees.royalty)}</strong></div><div class="summary-row total"><span>受取額（ウォレットへ）</span><strong>${fmtMarketEth(fees.net)}</strong></div><div class="summary-row"><span>承諾のガス代（あなたが負担）</span><strong>約${fmtMarketEth(marketGas("accept"))}</strong></div></div>
      <p class="pm-muted">承諾するとNFTは購入者のウォレットへ移動し、出品も終了します。オファーの承諾はトランザクションとして送信されるため、ガス代がかかります。</p>
      <div class="button-row"><button id="confirmAcceptOffer" class="primary" type="button">ウォレットで承諾する</button><button id="cancelAcceptOffer" class="secondary" type="button">戻る</button></div>`);
    marketModalItemId=itemId;
    $("cancelAcceptOffer").onclick=closeModal;
    $("confirmAcceptOffer").onclick=()=>openMarketTxSignature({title:"オファーの承諾",wallet,operation:"オファーの承諾（fulfillOrder）",purpose:"passmarket_offer_accept",gasKind:"accept",
      rows:[["売却するNFT",info.name],["購入者",offer.from],["受取額",fmtMarketEth(fees.net)],["送金額","0 ETH"]],
      warning:"署名すると、NFTが購入者へ移動し、代金があなたのウォレットへ送られます。",
      onSign:signer=>{spendWalletGas(signer,"accept",`オファーの承諾（${info.name}）`,itemId);startMarketTx({kind:"accept",label:"オファーの承諾",walletId:signer.id,itemId,offerId})}});
  },entry.ownerWalletId);
}

/* ---------- オファーを出す ---------- */
function openMakeOfferModal(itemId){
  const info=marketItemInfo(itemId);if(!info)return;
  if(marketOwnedByMe(itemId)){error("自分が保有しているNFTにはオファーできません");return}
  const m=marketState();
  if(m.myOffers.some(o=>o.itemId===itemId&&o.status==="pending")){error("このアイテムには回答待ちのオファーがあります");return}
  requireTradeWallet(wallet=>{
    const rec=marketRecord(itemId),floor=collectionFloor(info.collection.id),listing=rec.listing,balance=wallet.ethBalance;
    const max=listing?Math.min(balance,listing.price-.0001):balance;
    const suggestions=[listing?niceEth(listing.price*.9):null,floor?niceEth(floor*.95):null,niceEth(marketFairEth(itemId))].filter(v=>v&&v>=MARKET_MIN_PRICE&&v<=max);
    openModal("MAKE OFFER","オファーを出す",`${marketModalItemHeader(info)}
      <div class="pm-market-ref"><div class="main"><span>${listing?"出品価格":"最終取引"}</span><strong>${listing?fmtMarketEth(listing.price):rec.lastSalePrice?fmtMarketEth(rec.lastSalePrice):"—"}</strong></div><div><span>フロア価格</span><strong>${floor?fmtMarketEth(floor):"—"}</strong></div><div><span>${escapeHtml(wallet.name)}の残高</span><strong>${fmtMarketEth(balance)}</strong></div></div>
      <label class="pm-field-label" for="offerAmount">オファー金額</label>
      <div class="amount-box pm-price-input"><input id="offerAmount" class="input" inputmode="decimal" autocomplete="off" value="${suggestions[0]||""}"><span>ETH</span></div>
      ${suggestions.length?`<div class="pm-quick-prices">${[...new Set(suggestions)].map(v=>`<button type="button" data-offer-quick="${v}">${fmtMarketEth(v)}</button>`).join("")}</div>`:""}
      <p class="pm-estimate fair">${listing?`出品価格の${Math.round(MARKET_OFFER_ACCEPT_RATIO*100)}%以上のオファーは承諾されやすくなります。`:"相場より高めのオファーほど、保有者に承諾されやすくなります。"}</p>
      <div class="notice info">オファー金額はウォレットのETHから一時的に確保され、不成立の場合はウォレットに戻ります（実際のマーケットプレイスではWETHを使用します）。オファーへの署名にガス代はかかりません。</div>
      <button id="submitOffer" class="primary pm-modal-primary" type="button">ウォレットで署名してオファーを送る</button>`);
    marketModalItemId=itemId;
    const input=$("offerAmount");
    bindNumericInput(input,sanitizeEthInput);
    document.querySelectorAll("[data-offer-quick]").forEach(button=>button.onclick=()=>{input.value=button.dataset.offerQuick});
    $("submitOffer").onclick=()=>{
      const amount=Number(Number(input.value||0).toFixed(4)),current=marketRecord(itemId).listing;
      if(amount<MARKET_MIN_PRICE){error(`${fmtMarketEth(MARKET_MIN_PRICE)}以上の金額を入力してください`);return}
      if(amount>wallet.ethBalance){error("ウォレット残高が不足しています");return}
      if(current&&amount>=current.price){error("出品価格以上の場合は「今すぐ購入」をご利用ください");return}
      openMarketMessageSignature({title:"オファーへの署名",subtitle:"PassMarketへのオファー注文（EIP-712）",wallet,purpose:"passmarket_offer",confirmLabel:"署名してオファーを送る",
        rows:[["対象NFT",info.name],["オファー金額",fmtMarketEth(amount)],["有効期限","24時間"],["資産移動","承諾されたときのみ"],["ガス代","なし"]],
        message:`PassMarket Offer<br><br>Offerer: ${escapeHtml(wallet.address)}<br>Token: ${escapeHtml(info.collection.name)} #${escapeHtml(info.tokenLabel)}<br>Amount: ${amount} ETH`,
        onSign:signer=>{
          if(amount>signer.ethBalance||marketOwnedByMe(itemId)){closeModal();error("オファーを送れませんでした");return}
          const offer=placeMyOffer(itemId,amount,signer);renderAll();
          openModal("OFFER SENT","オファーを送りました",`<div class="completion-card pm-done"><div class="success-check">✓</div><h2>${fmtMarketEth(amount)}</h2><p>${escapeHtml(info.name)} の保有者にオファーを送りました。</p></div><div class="pm-status pending block"><span class="pm-pulse" aria-hidden="true"></span><span data-offer-countdown="${offer.id}">出品者の回答待ち</span></div><div class="button-row" style="margin-top:14px"><button id="offerDone" class="secondary" type="button">閉じる</button></div>`);
          $("offerDone").onclick=closeModal;updateMarketCountdowns();
        }});
    };
  });
}

/* ---------- 取引所への送金 ---------- */
function openTransferAddressModal(afterSave=null){
  if(!state.accountCreated){
    openModal("SEND TO EXCHANGE","取引所の口座が必要です",`<div class="notice warning">ETHを日本円に換えるには、NOVA Exchangeの口座が必要です。先に取引所で口座開設を完了してください。</div><div class="button-row" style="margin-top:14px"><button id="transferOpenExchange" class="primary" type="button">取引所を開く</button><button id="transferAddressClose" class="secondary" type="button">閉じる</button></div>`);
    $("transferAddressClose").onclick=closeModal;
    $("transferOpenExchange").onclick=()=>{closeModal();state.currentExchangeTab="exchange-home";switchApp("exchange")};
    return;
  }
  const current=marketState().transferAddress||MARKET_EXCHANGE_DEPOSIT_ADDRESS;
  openModal("DEPOSIT ADDRESS","送金先アドレスの登録",`
    <p class="wallet-selection-intro">NOVA ExchangeのETH入金アドレスを登録します。暗号資産は誤ったアドレスへ送ると基本的に取り戻せません。</p>
    <div class="form-grid payment-form">
      <div class="field full"><label for="transferAddress">NOVA Exchange の ETH 入金アドレス</label><input id="transferAddress" class="input" autocomplete="off" spellcheck="false" value="${escapeHtml(current)}"></div>
      <div class="field full"><label for="transferNetworkSelect">ネットワーク</label><select id="transferNetworkSelect" class="select" disabled><option>Ethereum Mainnet（疑似）</option></select></div>
    </div>
    <div class="prototype-strip payment-prototype-strip">研究用の入金アドレスが入力されています。実在するアドレスは入力しないでください。</div>
    <div class="button-row" style="margin-top:14px"><button id="saveTransferAddress" class="primary" type="button">このアドレスを登録する</button><button id="cancelTransferAddress" class="secondary" type="button">キャンセル</button></div>`);
  $("cancelTransferAddress").onclick=closeModal;
  $("saveTransferAddress").onclick=()=>{
    const address=$("transferAddress").value.trim();
    if(!/^0x[0-9a-fA-F]{40}$/.test(address)){error("0xから始まる42文字のアドレスを入力してください");return}
    if(walletByAddress(address)){error("Orbit Walletではなく、取引所の入金アドレスを入力してください");return}
    marketState().transferAddress=address;
    log("market_transfer_address_registered",{address_matches_exchange:address.toLowerCase()===MARKET_EXCHANGE_DEPOSIT_ADDRESS.toLowerCase()});
    if(afterSave){afterSave();return}
    closeModal();refreshMarketViews();toast("送金先アドレスを登録しました");
  };
}
function openTradeTransferModal(){
  const m=marketState();
  if(!state.accountCreated||!m.transferAddress){openTransferAddressModal(openTradeTransferModal);return}
  requireTradeWallet(wallet=>{
    const gas=marketGas("transfer"),max=Math.max(0,floorEth(wallet.ethBalance-gas));
    if(max<TRADE_TRANSFER_MIN_ETH){
      openModal("SEND TO EXCHANGE","送金できる残高がありません",`<div class="notice warning">送金は ${fmtMarketEth(TRADE_TRANSFER_MIN_ETH)} 以上（ガス代を除く）から行えます。${escapeHtml(wallet.name)}の残高は ${fmtMarketEth(wallet.ethBalance)} です。</div><p class="pm-muted">保有しているNFTを出品して売却すると、売上のETHがウォレットに入金されます。</p><div class="button-row"><button id="transferToAccount" class="primary" type="button">NFTを出品する</button><button id="transferClose" class="secondary" type="button">閉じる</button></div>`);
      $("transferClose").onclick=closeModal;
      $("transferToAccount").onclick=()=>{closeModal();if(state.currentApp!=="trade")switchApp("trade");setTradeTab("account")};
      return;
    }
    openModal("SEND TO EXCHANGE","取引所へ送金",`
      <div class="pm-bank compact"><span class="pm-bank-icon" aria-hidden="true">E</span><div><strong>NOVA Exchange（ETH入金アドレス）</strong><small>${escapeHtml(shortWalletAddress(m.transferAddress))}・Ethereum</small></div><button id="transferChangeAddress" class="pm-link" type="button">変更</button></div>
      <div class="pm-market-ref"><div class="main"><span>${escapeHtml(wallet.name)}から送金可能</span><strong>${fmtMarketEth(max)}</strong></div></div>
      <label class="pm-field-label" for="transferAmountInput">送金額</label>
      <div class="amount-box pm-price-input"><input id="transferAmountInput" class="input" inputmode="decimal" autocomplete="off" value="${max}"><span>ETH</span></div>
      <p class="pm-input-yen" id="transferYen"></p>
      <div class="pm-quick-prices"><button type="button" data-transfer-quick="${max}">全額</button>${[.5,.25].map(rate=>floorEth(max*rate)).filter(v=>v>=TRADE_TRANSFER_MIN_ETH).map(v=>`<button type="button" data-transfer-quick="${v}">${fmtMarketEth(v)}</button>`).join("")}</div>
      <div class="summary pm-fee-summary" id="transferSummary"></div>
      <p class="pm-muted">送金後、取引所でETHを売却すると日本円に換えられます。ブロックチェーン上の送金は原則として取り消せません。</p>
      <button id="submitTransfer" class="primary pm-modal-primary" type="button">ウォレットで送金内容を確認</button>`);
    const input=$("transferAmountInput");
    const update=()=>{
      const amount=Number(Number(input.value||0).toFixed(4)),ok=amount>=TRADE_TRANSFER_MIN_ETH&&amount+gas<=wallet.ethBalance+1e-9;
      $("transferYen").textContent=amount?fmtYenApprox(amount):"";
      $("transferSummary").innerHTML=`<div class="summary-row"><span>送金額</span><strong>${fmtMarketEth(amount)}</strong></div><div class="summary-row"><span>ネットワーク手数料（ガス代）</span><strong>約${fmtMarketEth(gas)}</strong></div><div class="summary-row total"><span>取引所への着金額</span><strong>${ok?fmtMarketEth(amount):"—"}</strong></div>`;
      $("submitTransfer").disabled=!ok;
    };
    bindNumericInput(input,sanitizeEthInput,update);
    document.querySelectorAll("[data-transfer-quick]").forEach(button=>button.onclick=()=>{input.value=button.dataset.transferQuick;update()});
    $("transferChangeAddress").onclick=()=>openTransferAddressModal(openTradeTransferModal);
    $("submitTransfer").onclick=()=>{
      const amount=Number(Number(input.value||0).toFixed(4));
      if(amount<TRADE_TRANSFER_MIN_ETH){error(`${fmtMarketEth(TRADE_TRANSFER_MIN_ETH)}以上の金額を入力してください`);return}
      openMarketTxSignature({title:"ETHの送金",wallet,operation:"ETHの送金（NOVA Exchangeへ）",purpose:"passmarket_transfer_to_exchange",gasKind:"transfer",value:amount,
        rows:[["送金先",`NOVA Exchange ${shortWalletAddress(m.transferAddress)}`],["送金額",fmtMarketEth(amount)]],
        warning:"送金先アドレスを確認してください。誤ったアドレスへ送ると取り戻せません。",
        onSign:signer=>{
          const transfer={id:marketUid("trf"),amount,gas,walletId:signer.id,address:m.transferAddress,at:Date.now(),completesAt:Date.now()+TRADE_TRANSFER_DELAY_MS,status:"processing"};
          signer.ethBalance=roundEth(signer.ethBalance-amount-gas);syncLegacyWalletState();
          m.balance.pending=roundEth(m.balance.pending+amount);m.balance.gasSpent=roundEth(m.balance.gasSpent+gas);
          m.transfers.push(transfer);
          pushMarketLedger({type:"transfer",title:"NOVA Exchangeへ送金",amount:-roundEth(amount+gas),gas,transferId:transfer.id,walletId:signer.id,status:"processing"});
          log("market_transfer_to_exchange_sent",{transfer_id:transfer.id,amount_eth:amount,gas_eth:gas,wallet_id:signer.id});
          renderAll();
          openModal("SEND TO EXCHANGE","送金を送信しました",`<div class="completion-card pm-done"><div class="success-check">✓</div><h2>${fmtMarketEth(amount)}</h2><p>NOVA Exchange へ送金しています。着金すると通知されます。</p></div><div class="pm-status fair block"><span class="pm-pulse" aria-hidden="true"></span><span data-transfer-countdown="${transfer.id}">ネットワーク承認待ち</span></div><p class="pm-muted center">着金後、取引所の「売却」でETHを日本円に換えられます。</p><div class="button-row" style="margin-top:14px"><button id="transferDone" class="secondary" type="button">閉じる</button></div>`);
          $("transferDone").onclick=closeModal;updateMarketCountdowns();
        }});
    };
    update();
  });
}

/* ---------- 購入（ETH） ---------- */
function openMarketCheckout(itemId){
  const info=marketItemInfo(itemId),rec=marketRecord(itemId);
  if(!info||!rec.listing||marketOwnedByMe(itemId)){error("このアイテムは現在購入できません");refreshMarketViews();return}
  if(state.marketTx||state.pendingPurchaseTicketId){error("処理中の取引があります。完了までお待ちください");return}
  requireTradeWallet(wallet=>{
    const listing=marketRecord(itemId).listing;
    if(!listing){error("このアイテムは現在購入できません");refreshMarketViews();return}
    const price=listing.price,gas=marketGas("buy"),total=roundEth(price+gas),short=wallet.ethBalance<total;
    log("market_checkout_opened",{item_id:itemId,price_eth:price,seller:listing.seller,wallet_id:wallet.id});
    openModal("CHECKOUT","NFTを購入",`
      ${marketModalItemHeader(info)}
      <div class="summary" style="margin-top:14px"><div class="summary-row"><span>出品者</span><strong>${escapeHtml(listing.seller)}</strong></div><div class="summary-row"><span>支払い元</span><strong>${escapeHtml(wallet.name)}</strong></div><div class="summary-row"><span>NFT価格</span><strong>${fmtMarketEth(price)}</strong></div><div class="summary-row"><span>推定ガス代（手数料）</span><strong>${fmtMarketEth(gas)}</strong></div><div class="summary-row total"><span>支払合計</span><strong>${fmtMarketEth(total)}</strong></div><div class="summary-row"><span>ウォレット残高</span><strong>${fmtMarketEth(wallet.ethBalance)}</strong></div></div>
      <p class="pm-input-yen">支払合計 ${fmtYenApprox(total)}（現在のETH価格で換算）</p>
      ${short?`<div class="notice danger" style="margin-top:13px">${escapeHtml(wallet.name)}の残高が不足しています。別のウォレットを接続するか、取引所からETHを送金してください。</div>`:`<div class="notice info" style="margin-top:13px">次に${escapeHtml(wallet.name)}で購入トランザクションを確認・署名します。</div>`}
      <div class="button-row" style="margin-top:15px"><button id="continueMarketPurchase" class="primary" type="button" ${short?"disabled":""}>ウォレットで確認</button><button id="cancelMarketPurchase" class="secondary" type="button">キャンセル</button></div>`);
    marketModalItemId=itemId;
    $("cancelMarketPurchase").onclick=closeModal;
    $("continueMarketPurchase").onclick=()=>openMarketTxSignature({title:"トランザクションを確認",wallet,operation:"NFTの購入（fulfillOrder）",purpose:"passmarket_purchase",gasKind:"buy",value:price,
      rows:[["購入するNFT",info.name],["出品者",listing.seller],["コントラクト",`${marketContractAddress(info.collection.id).slice(0,6)}…${marketContractAddress(info.collection.id).slice(-4)}`],["NFT価格",fmtMarketEth(price)]],
      warning:"署名すると、ブロックチェーンへ購入トランザクションが送信されます。内容を確認してください。",
      onSign:(signer,gasPaid)=>{
        const current=marketRecord(itemId).listing;
        if(!current||current.price!==price||marketOwnedByMe(itemId)){closeModal();error("この出品は購入できなくなりました");refreshMarketViews();return}
        signer.ethBalance=roundEth(signer.ethBalance-price-gasPaid);syncLegacyWalletState();
        marketState().balance.gasSpent=roundEth(marketState().balance.gasSpent+gasPaid);
        pushMarketLedger({type:"purchase",title:`${info.name} を購入（ガス代 ${fmtMarketEth(gasPaid)} を含む）`,amount:-roundEth(price+gasPaid),itemId,walletId:signer.id});
        startMarketTx({kind:"buy",label:"NFTの購入",walletId:signer.id,itemId,price,gas:gasPaid,seller:current.seller});
      }});
  });
}
function deliverMarketPurchase(tx){
  const info=marketItemInfo(tx.itemId),rec=marketRecord(tx.itemId),wallet=walletById(tx.walletId);
  if(!info||!wallet){closeModal();error("NFTを受け取れませんでした");return}
  const entry={tokenId:`PM-${Date.now().toString().slice(-8)}`,itemId:tx.itemId,collectionId:info.collection.id,purchasedAt:now(),acquisitionType:"market_purchase",priceEth:tx.price,gasEth:tx.gas,sellerName:tx.seller,ownerWalletId:wallet.id,ownerAddress:wallet.address};
  if(info.isTicket)entry.ticketId=info.collection.ticketId;
  state.ownedNfts.push(entry);
  rec.listing=null;rec.owner=null;rec.lastSalePrice=tx.price;rec.lastSaleAt=Date.now();
  rec.offers.forEach(o=>{if(o.status==="open"&&!o.mine)o.status="closed"});
  const m=marketState();
  m.myOffers.filter(o=>o.itemId===tx.itemId&&o.status==="pending").forEach(o=>{
    o.status="declined";o.resolvedAt=Date.now();m.balance.reserved=roundEth(Math.max(0,m.balance.reserved-o.amount));
    const offerWallet=walletById(o.walletId);if(offerWallet)offerWallet.ethBalance=roundEth(offerWallet.ethBalance+o.amount);
    pushMarketLedger({type:"offer_refund",title:`オファーの取り消し（${info.name}）`,amount:o.amount,itemId:tx.itemId,walletId:o.walletId});
  });
  syncLegacyWalletState();
  pushMarketActivity({type:"sale",itemId:tx.itemId,price:tx.price,from:tx.seller,to:"あなた",mine:true});
  log("market_nft_purchased",{item_id:tx.itemId,token_id:entry.tokenId,collection_id:info.collection.id,price_eth:tx.price,gas_eth:tx.gas,seller:tx.seller,wallet_id:wallet.id});
  closeModal();renderAll();
  openModal("PURCHASED","NFTを購入しました",`
    <div class="pm-purchased"><img src="${info.image}" alt=""><div><span>✓ ${escapeHtml(wallet.name)}に追加しました</span><h3>${escapeHtml(info.name)}</h3><small>${escapeHtml(info.collection.name)}</small></div></div>
    <div class="summary" style="margin-top:14px"><div class="summary-row"><span>NFT価格</span><strong>${fmtMarketEth(tx.price)}</strong></div><div class="summary-row"><span>ガス代（手数料）</span><strong>${fmtMarketEth(tx.gas)}</strong></div><div class="summary-row"><span>トークンID</span><strong>${entry.tokenId}</strong></div></div>
    <div class="button-row" style="margin-top:15px"><button id="purchasedToWallet" class="primary" type="button">ウォレットで確認する</button><button id="purchasedToItem" class="secondary" type="button">アイテムページを見る</button></div>`);
  $("purchasedToWallet").onclick=()=>{closeModal();state.activeWalletId=wallet.id;syncLegacyWalletState();state.currentWalletTab="wallet-nft";switchApp("wallet")};
  $("purchasedToItem").onclick=()=>{closeModal();if(state.currentApp!=="trade")switchApp("trade");const view=tradeView();if(view.page!=="item"||view.id!==tx.itemId)openTradeItem(tx.itemId);else renderTrade()};
}
function resumeMarketOperations(){
  const tx=state.marketTx;
  if(tx){
    const remaining=(Number(tx.completesAt)||Date.now())-Date.now();
    if(remaining>0)showMarketTxPending();
    scheduleMarketTx(remaining);
  }
  startMarketEngine();
}

/* ---------- Orbit Wallet 連携 ---------- */
function walletMarketCallout(entry){
  const itemId=marketItemIdForEntry(entry),listing=marketListingForEntry(entry),range=marketPriceRange(itemId);
  return `<section class="pm-wallet-callout${listing?" listed":""}"><div><span>PASSMARKET</span><h3>${listing?`${fmtMarketEth(listing.price)} で出品中`:"このNFTをマーケットで売る"}</h3>${listing?"":`<p>売れやすい価格帯：${fmtMarketEth(range.low)}〜${fmtMarketEth(range.high)}。売上はETHでこのウォレットに入金されます。</p>`}</div><button id="walletMarketAction" type="button">${listing?"出品を管理する":"出品する"} <b>→</b></button></section>`;
}
function bindWalletMarketCallout(entry){
  const itemId=marketItemIdForEntry(entry),button=$("walletMarketAction");if(!button)return;
  marketModalItemId=itemId;
  button.onclick=()=>marketListingForEntry(entry)?openTradeItemFromApp(itemId):openListingModal(itemId,"create");
}
function walletCollectibleCard(entry,index){
  const info=marketItemInfo(marketItemIdForEntry(entry));if(!info)return "";
  const listing=marketListingForEntry(entry);
  return `<article class="ticket-card owned-ticket-card collectible-card" data-owned-index="${index}" role="button" tabindex="0" aria-label="${escapeHtml(info.name)}の詳細を開く">
    <div class="ticket-art collectible-art"><img src="${info.image}" alt="" aria-hidden="true" loading="lazy" decoding="async"><span>${escapeHtml(info.collection.name)}</span><span>${escapeHtml(info.tierLabel)}</span></div>
    <div class="ticket-info"><h3>${escapeHtml(info.name)}</h3><p>${escapeHtml(marketCategoryLabel(info.collection.category))}・${escapeHtml(info.collection.creator)}<br>${entry.acquisitionType==="market_offer"?"オファーで取得":"PassMarketで購入"}・${fmtMarketEth(entry.priceEth||0)}</p>
      ${listing?`<div class="wallet-listing-badge"><span>PassMarketで出品中</span><b>${fmtMarketEth(listing.price)}</b></div>`:`<div class="added-benefit-badge collectible-badge"><span>✦</span> 詳細・出品 <b>→</b></div>`}</div></article>`;
}
function openWalletCollectibleDetail(index){
  const owned=state.ownedNfts[index],info=marketItemInfo(marketItemIdForEntry(owned));
  if(!owned||!info)return;
  log("owned_nft_opened",{item_id:info.id,token_id:owned.tokenId,collection_id:info.collection.id});
  openModal("OWNED NFT",info.name,`
    <div class="pm-owned-visual"><img src="${info.image}" alt="${escapeHtml(info.name)}"></div>
    <div class="summary owned-token-summary"><div class="summary-row"><span>コレクション</span><strong>${escapeHtml(info.collection.name)}</strong></div><div class="summary-row"><span>トークンID</span><strong>${escapeHtml(owned.tokenId)}</strong></div><div class="summary-row"><span>所有ウォレット</span><strong>${escapeHtml(walletById(nftOwnerWalletId(owned))?.name||"Orbit Wallet")}</strong></div><div class="summary-row"><span>取得方法</span><strong>${owned.acquisitionType==="market_offer"?"オファーが成立":"PassMarketで購入"}（${escapeHtml(owned.sellerName||"—")}から）</strong></div><div class="summary-row"><span>取得価格</span><strong>${fmtMarketEth(owned.priceEth||0)}</strong></div><div class="summary-row"><span>取得日時</span><strong>${new Date(owned.purchasedAt).toLocaleString("ja-JP")}</strong></div></div>
    <div class="pm-traits compact">${info.traits.map(t=>`<div><span>${escapeHtml(t.label)}</span><strong>${escapeHtml(t.value)}</strong>${t.share?`<small>保有率 ${t.share}%</small>`:""}</div>`).join("")}</div>
    ${walletMarketCallout(owned)}`);
  bindWalletMarketCallout(owned);
}
function marketResultData(){
  const m=state.market;
  if(!m)return null;
  return {connected:!!state.tradeConnected,connected_wallet_id:state.tradeWalletId,balance:m.balance,transfer_address_registered:!!m.transferAddress,approvals:m.approvals,
    sold_nfts:state.ownedNfts.filter(e=>e.soldAt).map(e=>({token_id:e.tokenId,item_id:marketItemIdForEntry(e),wallet_id:e.ownerWalletId,sold_at:e.soldAt,price_eth:e.soldPriceEth,net_eth:e.saleNetEth,via:e.soldVia,buyer:e.soldTo})),
    market_purchases:state.ownedNfts.filter(e=>e.acquisitionType==="market_purchase"||e.acquisitionType==="market_offer"),
    active_listings:Object.entries(m.items).filter(([,rec])=>rec.listing?.seller==="me").map(([id,rec])=>({item_id:id,price_eth:rec.listing.price,zone:rec.listing.zone,listed_at:new Date(rec.listing.listedAt).toISOString()})),
    offers_made:m.myOffers,transfers_to_exchange:m.transfers,ledger:m.ledger,favorites:Object.keys(m.favorites),
    my_activity:m.activity.filter(a=>a.mine)};
}

/* ---------- 初期化（DOMイベント） ---------- */
(()=>{
  const content=document.getElementById("tradeContent");
  if(content){content.addEventListener("click",handleTradeClick);content.addEventListener("change",handleTradeChange);content.addEventListener("keydown",handleTradeKeydown)}
  document.querySelectorAll("#tradeTabs button").forEach(button=>button.addEventListener("click",()=>setTradeTab(button.dataset.tradeTab)));
  document.getElementById("tradeSearch")?.addEventListener("input",handleTradeSearch);
  document.getElementById("tradeWalletChip")?.addEventListener("click",()=>connectTradeWallet());
  document.getElementById("tradeNoticeButton")?.addEventListener("click",openTradeNotifications);
  document.getElementById("tradeGuideNext")?.addEventListener("click",advanceTradeGuide);
  window.addEventListener("resize",()=>{clearTimeout(tradeChartResizeTimer);tradeChartResizeTimer=setTimeout(()=>{if(state.currentApp==="trade")hydrateTradeCharts()},150)});
})();
