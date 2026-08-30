
const WALLET_ADDRESS = "0x7A4F2C9B6E18D4A1F335B9C8705E1199AB8E93C2";
const SEED_WORDS = ["orbit","harbor","velvet","maple","crystal","planet","silver","echo","canvas","river","gentle","sunset"];
const NETWORK_FEE_ETH = 0.0032;
const PURCHASE_GAS_ETH = 0.0028;
const STORAGE_KEY = "nft-journey-lab-session-v1";
const GAME_STORAGE_KEYS = ["hoshiwatari-momo-best","tokyo-digital-art-night-jump-best","skyline-music-fest-bounce-best-score","anime-creator-expo-tower-best-score","momo-spike-wall-best"];
const TRANSFER_DELAY_MS = 2200;
const PURCHASE_DELAY_MS = 2400;
const ADMISSION_AUTH_TTL_MS = 30000;
const AIRDROP_PURCHASE_THRESHOLD = 3;
const AIRDROP_TICKET_ID = "nexus-future-pass";
const NFT_BENEFIT_PROGRAMS = {
  "nova-live":{
    gameName:"星わたり モモ",challengeTitle:"NOVA LIVE 2026 特典チャレンジ",
    gameSrc:"./experience-game/index.html?v=4.5.3",frameTitle:"星わたり モモ",messageType:"nova-live-game-score",
    benefits:[
      {score:10,title:"グッズ 10%OFFクーポン",short:"10%OFF",code:"NOVA10"},
      {score:30,title:"グッズ 20%OFFクーポン",short:"20%OFF",code:"NOVA20"},
      {score:50,title:"限定グッズプレゼント",short:"限定グッズ",code:null}
    ]
  },
  "digital-art":{
    gameName:"星わたりジャンプ モモ",challengeTitle:"TOKYO DIGITAL ART NIGHT 特典チャレンジ",
    gameSrc:"./digital-art-game/index.html?v=1.0.4",frameTitle:"星わたりジャンプ モモ",messageType:"digital-art-game-score",
    benefits:[
      {score:3000,title:"10%OFFクーポン",short:"10%OFF",code:"TDAN10"},
      {score:5000,title:"20%OFFクーポン",short:"20%OFF",code:"TDAN20"},
      {score:10000,title:"限定グッズプレゼント",short:"限定グッズ",code:null}
    ]
  },
  "skyline-fest":{
    gameName:"星くずバウンド モモ",challengeTitle:"SKYLINE MUSIC FEST 特典チャレンジ",
    gameSrc:"./skyline-game/index.html?v=1.0.5",frameTitle:"星くずバウンド モモ",messageType:"skyline-fest-game-score",
    benefits:[
      {score:10,title:"10%OFFクーポン",short:"10%OFF",code:"SKYLINE10"},
      {score:20,title:"20%OFFクーポン",short:"20%OFF",code:"SKYLINE20"},
      {score:30,title:"限定グッズプレゼント",short:"限定グッズ",code:null}
    ]
  },
  "creator-expo":{
    gameName:"星くずタワー モモ",challengeTitle:"ANIME CREATOR EXPO 特典チャレンジ",
    gameSrc:"./creator-expo-game/index.html?v=1.0.7",frameTitle:"星くずタワー モモ",messageType:"creator-expo-game-score",
    benefits:[
      {score:10,title:"10%OFFクーポン",short:"10%OFF",code:"ACE10"},
      {score:20,title:"20%OFFクーポン",short:"20%OFF",code:"ACE20"},
      {score:30,title:"限定グッズプレゼント",short:"限定グッズ",code:null}
    ]
  },
  "light-show":{
    gameName:"モモのトゲかべタップ",challengeTitle:"BAY AREA LIGHT SHOW 特典チャレンジ",
    gameSrc:"./light-show-game/index.html?v=1.0.2",frameTitle:"モモのトゲかべタップ",messageType:"light-show-game-score",
    benefits:[
      {score:10,title:"10%OFFクーポン",short:"10%OFF",code:"BAYLIGHT10"},
      {score:20,title:"20%OFFクーポン",short:"20%OFF",code:"BAYLIGHT20"},
      {score:30,title:"限定グッズプレゼント",short:"限定グッズ",code:null}
    ]
  }
};

const tickets = [
  {id:"nova-live",title:"NOVA LIVE 2026",category:"音楽ライブ",date:"2026.10.18",venue:"Tokyo Bay Hall",price:0.038,code:"NL",benefit:"限定ライブ映像・デジタルポスター",image:"assets/tickets/nova-live.webp"},
  {id:"digital-art",title:"TOKYO DIGITAL ART NIGHT",category:"デジタルアート",date:"2026.09.12",venue:"Odaiba Art Dock",price:0.021,code:"DA",benefit:"限定アート作品・優先入場",image:"assets/tickets/digital-art.webp"},
  {id:"skyline-fest",title:"SKYLINE MUSIC FEST",category:"音楽フェス",date:"2026.11.03",venue:"Yokohama Harbor Stage",price:0.028,code:"SF",benefit:"出演者ボイス・会場限定特典",image:"assets/tickets/skyline-fest.webp"},
  {id:"creator-expo",title:"ANIME CREATOR EXPO",category:"展示・交流イベント",date:"2026.12.06",venue:"Makuhari Event Hall",price:0.016,code:"AC",benefit:"デジタルパンフレット・抽選参加権",image:"assets/tickets/creator-expo.webp"},
  {id:"light-show",title:"BAY AREA LIGHT SHOW",category:"観光・ナイトイベント",date:"2026.08.29",venue:"Toyosu Seaside Park",price:0.012,code:"BL",benefit:"記念NFT・提携施設クーポン",image:"assets/tickets/light-show.webp"},
  {id:AIRDROP_TICKET_ID,title:"NEXUS FUTURE PASS",category:"エアドロップ限定",date:"SPECIAL ACCESS",venue:"Nexus Gateway",price:0,code:"NX",benefit:"NFTチケット3枚購入者限定・未来体験への特別アクセス",image:"assets/tickets/nexus-future-pass.webp",airdropOnly:true}
];

const markets = {
  BTC:{name:"Bitcoin",price:16482000,change:1.82},
  ETH:{name:"Ethereum",price:542800,change:2.14},
  XRP:{name:"XRP",price:428.4,change:-.63},
  SOL:{name:"Solana",price:27860,change:3.09},
  DOGE:{name:"Dogecoin",price:38.72,change:-1.18}
};

const missions = [
  ["account","取引所アカウントを作成","本人確認を完了する"],
  ["buy","取引所でETHを購入","日本円から暗号資産へ交換"],
  ["wallet","ウォレットを作成","公開鍵を取得する"],
  ["copy","公開鍵をコピー","ウォレットからコピーする"],
  ["send","取引所から送金","公開鍵を貼り付けて送金"],
  ["receive","ウォレットで受取確認","入金の反映を確認する"],
  ["connect","チケットサイトに接続","接続メッセージへ署名"],
  ["purchase","NFTチケットを購入","取引内容を確認・署名"],
  ["admission","入館証を表示する","所有NFTを受付用画面で開く"]
];

function createDefaultState(){
  return {
    participantId:null, startedAt:null, completedAt:null,
    currentApp:"exchange", currentExchangeTab:"exchange-home", currentWalletTab:"wallet-home",
    appSwitchCount:0, helpOpenCount:0, copyCount:0, pasteCount:0, signatureCount:0, validationErrors:0,
    appEnteredAt:null, appTimes:{exchange:0,wallet:0,market:0},
    accountCreated:false, ethPurchased:false, walletCreated:false, seedConfirmed:false, privateKey:null,
    addressCopied:false, addressPasted:false, transferSent:false, transferReceived:false, receiptChecked:false, transferPending:false, transferCompletesAt:null, lastReceivedAmount:0,
    marketConnected:false, connectionSigned:false, selectedTicketId:null,
    purchaseSigned:false, nftOwned:false, ownedNfts:[], pendingPurchaseTicketId:null, purchaseCompletesAt:null, admissionPassViewed:false,
    exchangeYen:100000, exchangeEth:0, walletEth:0, purchasedEth:0, purchaseYen:"",
    buyAgreementChecked:false, ethPriceAtPurchase:null, purchaseHistory:[],
    destinationAddress:"", transferAmount:0,
    activeGameTicketId:null,
    gameProgress:Object.fromEntries(Object.keys(NFT_BENEFIT_PROGRAMS).map(ticketId=>[ticketId,{bestScore:0,lastScore:0,playCount:0,benefitsUnlockedAt:{}}])),
    eventLog:[]
  };
}

function loadSavedState(){
  const defaults=createDefaultState();
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");
    if(!saved?.state||saved.version!==1)return defaults;
    const restored={...defaults,...saved.state};
    restored.appTimes={...defaults.appTimes,...saved.state.appTimes};
    restored.gameProgress=Object.fromEntries(Object.keys(defaults.gameProgress).map(ticketId=>[
      ticketId,
      {...defaults.gameProgress[ticketId],...saved.state.gameProgress?.[ticketId],benefitsUnlockedAt:{...defaults.gameProgress[ticketId].benefitsUnlockedAt,...saved.state.gameProgress?.[ticketId]?.benefitsUnlockedAt}}
    ]));
    restored.ownedNfts=Array.isArray(saved.state.ownedNfts)?saved.state.ownedNfts:[];
    restored.purchaseHistory=Array.isArray(saved.state.purchaseHistory)?saved.state.purchaseHistory:[];
    restored.eventLog=Array.isArray(saved.state.eventLog)?saved.state.eventLog:[];
    if(!["exchange","wallet","market"].includes(restored.currentApp))restored.currentApp="exchange";
    if(!["exchange-home","exchange-buy","exchange-send"].includes(restored.currentExchangeTab))restored.currentExchangeTab="exchange-home";
    if(!["wallet-home","wallet-receive","wallet-nft","wallet-benefits"].includes(restored.currentWalletTab))restored.currentWalletTab="wallet-home";
    if(restored.walletCreated&&!/^0x[0-9a-f]{64}$/i.test(restored.privateKey||""))restored.privateKey=generateDemoPrivateKey();
    if(!restored.walletCreated)restored.privateKey=null;
    if(!restored.walletCreated||!restored.seedConfirmed){restored.marketConnected=false;restored.connectionSigned=false}
    if(!restored.transferReceived)restored.receiptChecked=false;
    restored.appEnteredAt=null;
    restored.activeGameTicketId=null;
    return restored;
  }catch(error){
    console.warn("保存されたセッションを読み込めませんでした。",error);
    return defaults;
  }
}

let persistTimer=null;
let resetInProgress=false;
function stateSnapshot(){
  const snapshot=JSON.parse(JSON.stringify(state));
  if(snapshot.participantId&&state.appEnteredAt!==null&&snapshot.appTimes[state.currentApp]!==undefined){
    snapshot.appTimes[state.currentApp]+=Math.max(0,Math.round((performance.now()-state.appEnteredAt)/1000));
  }
  snapshot.appEnteredAt=null;
  snapshot.activeGameTicketId=null;
  return snapshot;
}
function persistState(){
  clearTimeout(persistTimer);persistTimer=null;
  if(resetInProgress||!state.participantId)return;
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify({version:1,savedAt:now(),state:stateSnapshot()}))}
  catch(error){console.warn("セッションを保存できませんでした。",error)}
}
function schedulePersist(){
  clearTimeout(persistTimer);persistTimer=setTimeout(persistState,0);
}
function makePersistent(target,cache=new WeakMap()){
  if(!target||typeof target!=="object")return target;
  if(cache.has(target))return cache.get(target);
  const proxy=new Proxy(target,{
    get(object,key,receiver){return makePersistent(Reflect.get(object,key,receiver),cache)},
    set(object,key,value,receiver){const changed=Reflect.get(object,key,receiver)!==value;const result=Reflect.set(object,key,value,receiver);if(changed)schedulePersist();return result},
    deleteProperty(object,key){const existed=Reflect.has(object,key);const result=Reflect.deleteProperty(object,key);if(existed)schedulePersist();return result}
  });
  cache.set(target,proxy);return proxy;
}
const state = makePersistent(loadSavedState());

let tickerTimer=null;
let transferTimer=null;
let purchaseTimer=null;
let privateKeyVisible=false;
let activeAdmissionIndex=null;
let admissionAuthTimer=null;
let admissionAuthExpiresAt=0;
let admissionAuthNonce="";
let admissionVerifiedTokenId=null;
let chartSeries=[536400,538100,537300,540600,539900,541700,542800];

const $ = id => document.getElementById(id);
const landing=$("landing"),workspace=$("workspace"),appSwitcher=$("appSwitcher");
const exchangeApp=$("exchangeApp"),walletApp=$("walletApp"),marketApp=$("marketApp");
const exchangeContent=$("exchangeContent"),walletContent=$("walletContent"),marketContent=$("marketContent");

function now(){return new Date().toISOString()}
function participantId(){return `P-${Date.now().toString(36).toUpperCase().slice(-6)}`}
function generateDemoPrivateKey(){
  const bytes=new Uint8Array(32);
  if(globalThis.crypto?.getRandomValues)globalThis.crypto.getRandomValues(bytes);
  else for(let index=0;index<bytes.length;index++)bytes[index]=Math.floor(Math.random()*256);
  return `0x${Array.from(bytes,byte=>byte.toString(16).padStart(2,"0")).join("")}`;
}
function log(type,detail={}){state.eventLog.push({timestamp:now(),app:state.currentApp,type,...detail})}
function fmtEth(v){return `${Number(v||0).toFixed(4)} ETH`}
function fmtYen(v){return `¥${Math.round(Number(v||0)).toLocaleString("ja-JP")}`}
function ticket(){return tickets.find(t=>t.id===state.selectedTicketId)||null}
function escapeHtml(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function ownsTicket(ticketId){return state.ownedNfts.some(item=>item.ticketId===ticketId)}
function purchasedNftCount(){return state.ownedNfts.filter(item=>item.acquisitionType!=="airdrop").length}
function airdropTicket(){return tickets.find(item=>item.id===AIRDROP_TICKET_ID)}
function maybeGrantAirdrop(trigger="purchase_threshold"){
  if(purchasedNftCount()<AIRDROP_PURCHASE_THRESHOLD||ownsTicket(AIRDROP_TICKET_ID))return null;
  const grantedAt=now();
  const reward={tokenId:`MG-AIR-${Date.now().toString().slice(-8)}`,ticketId:AIRDROP_TICKET_ID,purchasedAt:grantedAt,acquisitionType:"airdrop",airdropTriggerCount:purchasedNftCount()};
  state.ownedNfts.push(reward);
  log("nft_airdrop_received",{ticket_id:AIRDROP_TICKET_ID,token_id:reward.tokenId,purchased_nft_count:reward.airdropTriggerCount,trigger});
  return reward;
}
function benefitProgram(ticketId){return NFT_BENEFIT_PROGRAMS[ticketId]||null}
function gameProgress(ticketId){return state.gameProgress[ticketId]}
function benefitUnlocked(ticketId,benefit){return gameProgress(ticketId).bestScore>=benefit.score}
function nextBenefit(ticketId){return benefitProgram(ticketId)?.benefits.find(benefit=>!benefitUnlocked(ticketId,benefit))||null}
function fmtScore(value){return Number(value||0).toLocaleString("ja-JP")}
function toast(message){
  const el=$("toast");el.className="toast";el.textContent=message;
  clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.add("hidden"),2100);
}
function showEthSuccess(title,detail){
  const el=$("toast");el.className="toast eth-success-toast";
  el.innerHTML=`<span class="eth-success-toast-icon">✓</span><div><strong>${escapeHtml(title)}</strong><small>${escapeHtml(detail)}</small></div>`;
  clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.add("hidden"),4200);
}
function showEthPurchaseSuccess(received){
  showEthSuccess("ETHの購入が完了しました",`${Number(received).toFixed(6)} ETH を取引所残高に追加しました`);
}
function showEthTransferStarted(amount){
  showEthSuccess("ETHの送金を開始しました",`${Number(amount).toFixed(6)} ETH を Orbit Wallet へ送金しています`);
}
function showEthTransferCompleted(amount){
  showEthSuccess("ETHの送金が完了しました",`${Number(amount).toFixed(6)} ETH が Orbit Wallet に反映されました`);
}
function error(message){state.validationErrors++;log("validation_error",{message});toast(message)}

function showProgressGuide(){
  $("progressGuideBackdrop").classList.remove("hidden");
  $("progressGuideBackdrop").setAttribute("aria-hidden","false");
  $("progressGuideBubble").classList.remove("hidden");
  document.body.classList.add("progress-guide-open");
  log("progress_guide_opened");
  requestAnimationFrame(()=>$("progressGuideStart").focus());
}

function closeProgressGuide(){
  $("progressGuideBackdrop").classList.add("hidden");
  $("progressGuideBackdrop").setAttribute("aria-hidden","true");
  $("progressGuideBubble").classList.add("hidden");
  document.body.classList.remove("progress-guide-open");
  log("progress_guide_completed");
  document.querySelector(`.switcher-item[data-app="${state.currentApp}"]`)?.focus();
}

function start(){
  state.participantId=participantId();state.startedAt=now();state.appEnteredAt=performance.now();
  landing.classList.add("hidden");workspace.classList.remove("hidden");appSwitcher.classList.remove("hidden");
  $("participantText").textContent=`参加者ID：${state.participantId}`;log("experiment_started");
  renderAll();startTicker();window.scrollTo(0,0);showProgressGuide();persistState();
}

function restoreSession(){
  if(!state.participantId)return;
  const restoredAirdrop=maybeGrantAirdrop("session_restore");
  state.appEnteredAt=performance.now();
  landing.classList.add("hidden");workspace.classList.remove("hidden");appSwitcher.classList.remove("hidden");
  $("participantText").textContent=`参加者ID：${state.participantId}`;
  exchangeApp.classList.toggle("hidden",state.currentApp!=="exchange");
  walletApp.classList.toggle("hidden",state.currentApp!=="wallet");
  marketApp.classList.toggle("hidden",state.currentApp!=="market");
  document.querySelectorAll(".switcher-item").forEach(button=>button.classList.toggle("active",button.dataset.app===state.currentApp));
  log("session_restored");renderAll();startTicker();resumePendingOperations();
  if(restoredAirdrop)requestAnimationFrame(()=>showAirdropReward(restoredAirdrop));
}

function stopTicker(){if(tickerTimer){clearInterval(tickerTimer);tickerTimer=null}}
function startTicker(){
  stopTicker();
  tickerTimer=setInterval(()=>{
    Object.values(markets).forEach(m=>{const delta=(Math.random()-.48)*.0035;m.price=Math.max(.01,m.price*(1+delta));m.change+=(Math.random()-.5)*.08});
    chartSeries.push(markets.ETH.price);chartSeries=chartSeries.slice(-18);
    if(state.currentApp==="exchange"&&state.currentExchangeTab==="exchange-buy")updateExchangeBuyDynamic(false);
  },1500);
}

function missionStatus(key){
  const map={
    account:state.accountCreated,buy:state.ethPurchased,wallet:state.walletCreated&&state.seedConfirmed,
    copy:state.addressCopied,send:state.transferSent,receive:state.receiptChecked,
    connect:state.marketConnected&&state.connectionSigned,purchase:state.ownedNfts.length>0,
    admission:state.admissionPassViewed
  };return !!map[key];
}
function nextMissionKey(){return missions.find(([key])=>!missionStatus(key))?.[0]||null}
function progress(){
  const done=missions.filter(([k])=>missionStatus(k)).length;
  return Math.round(done/missions.length*100);
}
function renderMission(){
  const next=nextMissionKey();
  $("missionList").innerHTML=missions.map(([key,title,desc],i)=>{
    const done=missionStatus(key),active=key===next;
    return `<li class="mission-item ${done?"done":active?"active":""}">
      <span class="mission-dot">${done?"✓":i+1}</span><strong>${title}</strong><small>${desc}</small></li>`;
  }).join("");
  const p=progress();$("progressPercent").textContent=`${p}%`;$("progressFill").style.width=`${p}%`;
  $("sideWalletBalance").textContent=fmtEth(state.walletEth);
  $("sideNetworkStatus").innerHTML=state.marketConnected?"<i></i>接続済み":"<i></i>未接続";
  $("sideNetworkStatus").classList.toggle("connected",state.marketConnected);
}

function switchApp(app){
  if(state.currentApp!==app){
    if(state.appEnteredAt!==null)state.appTimes[state.currentApp]+=Math.round((performance.now()-state.appEnteredAt)/1000);
    state.currentApp=app;state.appEnteredAt=performance.now();state.appSwitchCount++;log("app_switched",{to:app});
  }
  exchangeApp.classList.toggle("hidden",app!=="exchange");walletApp.classList.toggle("hidden",app!=="wallet");marketApp.classList.toggle("hidden",app!=="market");
  document.querySelectorAll(".switcher-item").forEach(b=>b.classList.toggle("active",b.dataset.app===app));
  renderAll();window.scrollTo({top:0,behavior:"smooth"});
}
function renderAll(){renderMission();renderExchange();renderWallet();renderMarket()}

function renderExchange(){
  document.querySelectorAll("#exchangeTabs button").forEach(b=>b.classList.toggle("active",b.dataset.tab===state.currentExchangeTab));
  if(state.currentExchangeTab==="exchange-home")renderExchangeHome();
  if(state.currentExchangeTab==="exchange-buy")renderExchangeBuy();
  if(state.currentExchangeTab==="exchange-send")renderExchangeSend();
}
function renderExchangeHome(){
  exchangeContent.innerHTML=`
    <div class="dashboard-title"><div><span class="kicker">NOVA EXCHANGE</span><h1>資産を管理する</h1><p>暗号資産を購入し、外部ウォレットへ送金できます。</p></div>
    <span class="task-callout">${state.accountCreated?"本人確認済み":"最初にアカウント作成が必要です"}</span></div>
    <div class="balance-grid">
      <div class="balance-card"><small>TOTAL BALANCE</small><strong>${fmtYen(state.exchangeYen+state.exchangeEth*markets.ETH.price)}</strong><span>日本円 ${fmtYen(state.exchangeYen)} ／ ETH ${fmtEth(state.exchangeEth)}</span></div>
      <div class="action-card"><h3>${state.accountCreated?"取引を開始できます":"アカウントを開設"}</h3><p>${state.accountCreated?"ETHを購入してウォレットへの送金準備を進めてください。":"メールアドレス登録と疑似本人確認を行います。"}</p>
      <button id="accountButton" class="primary" type="button">${state.accountCreated?"ETHを購入する":"口座開設を開始"}</button></div>
    </div>
    <div class="price-board">
      ${Object.entries(markets).map(([sym,m])=>`<div class="price-row"><div class="asset-name"><span class="coin ${sym==="ETH"?"eth":""}">${sym[0]}</span><div><strong>${sym}</strong><small>${m.name}</small></div></div><span class="price">${fmtYen(m.price)}</span><span class="change ${m.change>=0?"up":"down"}">${m.change>=0?"+":""}${m.change.toFixed(2)}%</span></div>`).join("")}
    </div>`;
  $("accountButton").onclick=()=>state.accountCreated?setExchangeTab("exchange-buy"):openAccountModal();
}
function openAccountModal(){
  openModal("ACCOUNT SETUP","取引所アカウントを作成",`
    <div class="notice warning">実在する個人情報は入力しないでください。架空の情報で進められます。</div>
    <div class="form-grid" style="margin-top:16px">
      <div class="field full"><label>メールアドレス</label><input id="mEmail" class="input" value="demo@example.com"></div>
      <div class="field"><label>パスワード</label><input id="mPass" type="password" class="input" value="Demo1234!"></div>
      <div class="field"><label>確認用パスワード</label><input id="mPass2" type="password" class="input" value="Demo1234!"></div>
      <div class="field"><label>姓</label><input id="mFamily" class="input" value="デモ"></div>
      <div class="field"><label>名</label><input id="mGiven" class="input" value="太郎"></div>
      <div class="field full"><label>本人確認書類</label><select id="mId" class="select"><option>運転免許証（架空）</option><option>パスポート（架空）</option></select></div>
    </div>
    <label class="check" style="margin-top:15px"><input id="mAgree" type="checkbox"><span>暗号資産の価格変動リスクと疑似利用規約を確認しました。</span></label>
    <div class="button-row" style="margin-top:17px"><button id="completeAccount" class="primary" type="button">本人確認を完了する</button></div>`);
  $("completeAccount").onclick=()=>{
    const email=$("mEmail").value.trim(),password=$("mPass").value,passwordConfirmation=$("mPass2").value;
    const familyName=$("mFamily").value.trim(),givenName=$("mGiven").value.trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){error("正しい形式のメールアドレスを入力してください");return}
    if(!familyName||!givenName){error("姓と名を入力してください");return}
    if(password.length<8){error("パスワードは8文字以上で入力してください");return}
    if(password!==passwordConfirmation){error("パスワードと確認用パスワードが一致しません");return}
    if(!$("mAgree").checked){error("利用規約とリスク説明を確認してください");return}
    state.accountCreated=true;log("exchange_account_created");closeModal();toast("本人確認が完了しました");renderAll();
  };
}
function setExchangeTab(tab){
  if(tab==="exchange-buy"&&!state.accountCreated){error("先に口座開設を完了してください");return}
  if(tab==="exchange-send"&&!state.walletCreated){error("先にウォレットを作成してください");return}
  state.currentExchangeTab=tab;renderExchange();
}
function chartSvg(){
  const min=Math.min(...chartSeries),max=Math.max(...chartSeries),range=Math.max(1,max-min);
  const pts=chartSeries.map((v,i)=>`${(i/(chartSeries.length-1))*100},${92-((v-min)/range)*74}`).join(" ");
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline fill="none" stroke="#1769ff" stroke-width="2" points="${pts}"/><polygon fill="rgba(23,105,255,.08)" points="0,100 ${pts} 100,100"/></svg>`;
}
function getPurchaseYenAmount(){
  const parsed=Number(String(state.purchaseYen??"").replace(/,/g,""));
  return Number.isFinite(parsed)&&parsed>=0?parsed:0;
}
function getBuyQuote(){
  const amount=getPurchaseYenAmount();
  const fee=Math.round(amount*.015);
  const eth=markets.ETH.price>0?amount/markets.ETH.price:0;
  return {amount,fee,eth,total:amount+fee};
}
function updateExchangeBuyDynamic(updateInput=false){
  const input=$("buyYen");
  if(!input)return;
  const q=getBuyQuote();
  if(updateInput)input.value=String(state.purchaseYen??"");
  const priceEl=$("liveEthPrice"),changeEl=$("liveEthChange"),chartEl=$("liveEthChart");
  if(priceEl)priceEl.textContent=fmtYen(markets.ETH.price);
  if(changeEl){changeEl.textContent=`${markets.ETH.change>=0?"+":""}${markets.ETH.change.toFixed(2)}%`;changeEl.className=`change ${markets.ETH.change>=0?"up":"down"}`;}
  if(chartEl)chartEl.innerHTML=chartSvg();
  if($("quoteAmount"))$("quoteAmount").textContent=fmtYen(q.amount);
  if($("quoteFee"))$("quoteFee").textContent=fmtYen(q.fee);
  if($("quoteEth"))$("quoteEth").textContent=`${q.eth.toFixed(6)} ETH`;
  if($("quoteTotal"))$("quoteTotal").textContent=fmtYen(q.total);
  if($("buyBalance"))$("buyBalance").textContent=`日本円残高 ${fmtYen(state.exchangeYen)}`;
}
function renderExchangeBuy(){
  const q=getBuyQuote();
  exchangeContent.innerHTML=`
    <div class="dashboard-title"><div><span class="kicker">BUY CRYPTO</span><h1>ETHを購入</h1><p>価格は研究用にリアルタイム風に変動します。</p></div><span id="buyBalance" class="task-callout">日本円残高 ${fmtYen(state.exchangeYen)}</span></div>
    <div class="buy-layout">
      <div class="trade-card">
        <div class="rate-head"><div><small>ETH / JPY</small><br><strong id="liveEthPrice">${fmtYen(markets.ETH.price)}</strong></div><span id="liveEthChange" class="change ${markets.ETH.change>=0?"up":"down"}">${markets.ETH.change>=0?"+":""}${markets.ETH.change.toFixed(2)}%</span></div>
        <div id="liveEthChart" class="sparkline">${chartSvg()}</div>
        <div class="quick-amounts">${[25000,50000,80000,95000].map(v=>`<button data-yen="${v}" type="button">${fmtYen(v)}</button>`).join("")}</div>
        <div class="amount-box"><input id="buyYen" class="input" type="text" inputmode="numeric" autocomplete="off" value="${escapeHtml(state.purchaseYen)}" placeholder="購入金額を入力"><span>JPY</span></div>
        <p class="hint" style="margin:8px 0 0">数字を自由に入力できます。空欄にしてから入力し直すこともできます。</p>
      </div>
      <div class="trade-card">
        <h3>購入内容</h3><p class="hint">注文時点の価格で受取数量が確定します。</p>
        <div class="quote-box"><div><span>購入金額</span><strong id="quoteAmount">${fmtYen(q.amount)}</strong></div><div><span>販売所手数料</span><strong id="quoteFee">${fmtYen(q.fee)}</strong></div><div><span>受取予定</span><strong id="quoteEth">${q.eth.toFixed(6)} ETH</strong></div><div><span>支払合計</span><strong id="quoteTotal">${fmtYen(q.total)}</strong></div></div>
        <label class="check" style="margin-top:15px"><input id="buyAgree" type="checkbox" ${state.buyAgreementChecked?"checked":""}><span>価格変動と手数料を確認しました。</span></label>
        <button id="buyEthButton" class="primary" style="width:100%;margin-top:15px" type="button">${state.ethPurchased?"ETHを追加購入する":"ETHを購入する"}</button>
        ${state.purchaseHistory.length?`<div class="notice success" style="margin-top:12px">累計購入：${fmtEth(state.purchasedEth)}（${state.purchaseHistory.length}回）<br>日本円残高：${fmtYen(state.exchangeYen)}</div>`:""}
      </div>
    </div>`;
  document.querySelectorAll("[data-yen]").forEach(b=>b.onclick=()=>{state.purchaseYen=b.dataset.yen;updateExchangeBuyDynamic(true)});
  const buyInput=$("buyYen");
  buyInput.oninput=e=>{
    const digits=e.target.value.replace(/[^0-9]/g,"");
    if(e.target.value!==digits)e.target.value=digits;
    state.purchaseYen=digits;
    updateExchangeBuyDynamic(false);
  };
  $("buyAgree").onchange=e=>{state.buyAgreementChecked=e.target.checked;log("buy_agreement_changed",{checked:e.target.checked})};
  $("buyEthButton").onclick=()=>{
    const quote=getBuyQuote();
    if(!state.buyAgreementChecked){error("価格変動と手数料を確認してください");return}
    if(quote.amount<1000){error("1,000円以上を入力してください");return}
    if(quote.total>state.exchangeYen){error("日本円残高が不足しています");return}
    state.ethPriceAtPurchase=markets.ETH.price;
    const received=quote.amount/state.ethPriceAtPurchase;
    state.purchasedEth+=received;state.exchangeEth+=received;state.exchangeYen-=quote.total;state.ethPurchased=true;
    state.purchaseHistory.push({timestamp:now(),yen:quote.amount,fee_yen:quote.fee,eth:received,rate:state.ethPriceAtPurchase});
    state.buyAgreementChecked=false;
    log("eth_purchased",{yen:quote.amount,fee_yen:quote.fee,eth:received,rate:state.ethPriceAtPurchase,purchase_number:state.purchaseHistory.length});
    showEthPurchaseSuccess(received);renderAll();
  };
}
function renderExchangeSend(){
  const max=Math.max(0,state.exchangeEth-NETWORK_FEE_ETH);
  const amount=state.transferAmount||max;
  exchangeContent.innerHTML=`
    <div class="dashboard-title"><div><span class="kicker">SEND ETH</span><h1>外部ウォレットへ送金</h1><p>Orbit Walletでコピーした公開鍵を貼り付けます。</p></div><span class="task-callout">送金可能 ${fmtEth(max)}</span></div>
    <div class="panel">
      ${!state.addressCopied?`<div class="notice warning">先にOrbit Walletの「受け取る」で公開鍵をコピーしてください。</div>`:""}
      <div class="form-grid" style="margin-top:${state.addressCopied?0:16}px">
        <div class="field full"><label>送金先の公開鍵（ウォレットアドレス）</label><input id="destinationAddress" class="input" placeholder="Orbit Walletからコピーして貼り付け" value="${escapeHtml(state.destinationAddress)}">
          <span id="pasteIndicator" class="paste-status ${state.addressPasted&&state.destinationAddress===WALLET_ADDRESS?"ok":""}"><i></i>${state.addressPasted?"貼り付け操作を検出しました":"Ctrl/Cmd + V で貼り付けてください"}</span></div>
        <div class="field"><label>送金額</label><input id="transferAmount" class="input" type="number" step="0.0001" value="${Number(amount).toFixed(6)}"></div>
        <div class="field"><label>ネットワーク</label><select class="select" disabled><option>Ethereum Mainnet（疑似）</option></select></div>
      </div>
      <div class="summary" style="margin-top:16px"><div class="summary-row"><span>送金額</span><strong id="sendAmountSummary">${fmtEth(amount)}</strong></div><div class="summary-row"><span>ネットワーク手数料</span><strong>${fmtEth(NETWORK_FEE_ETH)}</strong></div><div class="summary-row"><span>取引所残高</span><strong>${fmtEth(state.exchangeEth)}</strong></div></div>
      <label class="check" style="margin-top:15px"><input id="sendAgree" type="checkbox" ${state.transferPending?"disabled":""}><span>公開鍵を確認しました。暗号資産は誤ったアドレスへ送ると取り戻せないことを理解しました。</span></label>
      <div class="button-row" style="margin-top:16px"><button id="reviewSend" class="primary" type="button" ${state.transferPending||max<=0?"disabled":""}>${state.transferPending?"送金処理中":"送金内容を確認"}</button><button id="openWalletReceive" class="secondary" type="button">ウォレットの受取画面を開く</button></div>
      ${state.transferPending?`<div class="notice info" style="margin-top:13px">送金リクエストを処理しています。Orbit Walletで着金を確認してください。</div>`:state.transferSent?`<div class="notice success" style="margin-top:13px">前回の送金は完了しています。残高があれば続けて送金できます。</div>`:""}
    </div>`;
  const dest=$("destinationAddress");
  dest.oninput=e=>{state.destinationAddress=e.target.value};
  dest.onpaste=e=>{state.pasteCount++;state.addressPasted=true;setTimeout(()=>{state.destinationAddress=dest.value;renderExchangeSend()},0);log("wallet_address_pasted")};
  $("transferAmount").oninput=e=>{state.transferAmount=e.target.value;$("sendAmountSummary").textContent=e.target.value===""?"—":fmtEth(Number(e.target.value))};
  $("openWalletReceive").onclick=()=>{switchApp("wallet");state.currentWalletTab="wallet-receive";renderWallet()};
  $("reviewSend").onclick=()=>{
    const rawAmount=$("transferAmount").value.trim(),sendAmount=Number(rawAmount);
    if(!state.addressCopied){error("ウォレットで公開鍵をコピーしてください");return}
    if(!state.addressPasted){error("コピーした公開鍵を貼り付けてください");return}
    if(state.destinationAddress.trim()!==WALLET_ADDRESS){error("送金先アドレスがOrbit Walletの公開鍵と一致しません");return}
    if(!$("sendAgree").checked){error("送金リスクの確認が必要です");return}
    if(rawAmount===""||!Number.isFinite(sendAmount)||sendAmount<=0){error("0より大きい送金額を入力してください");return}
    if(sendAmount+NETWORK_FEE_ETH>state.exchangeEth){error("送金額と手数料の合計が取引所残高を超えています");return}
    openSendReview(sendAmount);
  };
}
function openSendReview(sendAmount){
  openModal("WITHDRAWAL REVIEW","ETH送金を確定",`
    <div class="summary"><div class="summary-row"><span>送金先</span><strong style="max-width:280px;overflow-wrap:anywhere">${WALLET_ADDRESS}</strong></div><div class="summary-row"><span>送金額</span><strong>${fmtEth(sendAmount)}</strong></div><div class="summary-row"><span>手数料</span><strong>${fmtEth(NETWORK_FEE_ETH)}</strong></div><div class="summary-row"><span>受取予定</span><strong>${fmtEth(sendAmount)}</strong></div></div>
    <div class="notice danger" style="margin-top:14px">ブロックチェーン上の送金は原則として取り消せません。</div>
    <div class="button-row" style="margin-top:16px"><button id="confirmSend" class="danger-btn" type="button">このアドレスへ送金する</button><button id="cancelSend" class="secondary" type="button">戻る</button></div>`);
  $("cancelSend").onclick=closeModal;
  $("confirmSend").onclick=()=>{
    state.transferAmount=sendAmount;state.exchangeEth-=sendAmount+NETWORK_FEE_ETH;state.transferSent=true;state.transferPending=true;
    state.transferCompletesAt=Date.now()+TRANSFER_DELAY_MS;
    log("eth_transfer_sent",{destination:WALLET_ADDRESS,amount:sendAmount,fee:NETWORK_FEE_ETH});
    closeModal();showEthTransferStarted(sendAmount);renderAll();
    scheduleTransferCompletion(TRANSFER_DELAY_MS);
  };
}

function completeTransfer(){
  if(!state.transferPending)return;
  const sendAmount=Number(state.transferAmount)||0;
  state.transferReceived=true;state.transferPending=false;state.transferCompletesAt=null;state.lastReceivedAmount=sendAmount;state.walletEth+=sendAmount;state.transferAmount=0;
  log("eth_transfer_confirmed",{amount:sendAmount});renderAll();showEthTransferCompleted(sendAmount);
}
function scheduleTransferCompletion(delay){
  clearTimeout(transferTimer);transferTimer=setTimeout(completeTransfer,Math.max(0,delay));
}

function renderWallet(){
  privateKeyVisible=false;
  document.querySelectorAll("#walletTabs button").forEach(b=>b.classList.toggle("active",b.dataset.tab===state.currentWalletTab));
  if(!state.walletCreated){renderWalletCreate();return}
  if(state.currentWalletTab==="wallet-home")renderWalletHome();
  if(state.currentWalletTab==="wallet-receive")renderWalletReceive();
  if(state.currentWalletTab==="wallet-nft")renderWalletNft();
  if(state.currentWalletTab==="wallet-benefits")renderWalletBenefits();
}
function renderWalletCreate(){
  walletContent.innerHTML=`
    <div class="dashboard-title"><div><span class="kicker">WELCOME TO ORBIT</span><h1>新しいウォレットを作成</h1><p>暗号資産とNFTを自分で管理するためのウォレットです。</p></div><span class="task-callout">秘密鍵は利用者自身で管理</span></div>
    <div class="balance-grid">
      <div class="action-card"><h3>新規ウォレット</h3><p>新しい公開鍵、秘密鍵、復旧用フレーズを疑似生成します。</p><button id="createWallet" class="primary" type="button">ウォレットを作成</button></div>
      <div class="notice warning">このデモで表示される復旧用フレーズは架空です。実在するフレーズを入力・保存しないでください。</div>
    </div>`;
  $("createWallet").onclick=()=>openSeedModal();
}
function openSeedModal(){
  openModal("SECRET RECOVERY PHRASE","復旧用フレーズを保存",`
    <div class="notice warning">実際のウォレットでは、この単語列を失うと資産を復旧できません。第三者に共有してはいけません。</div>
    <div class="seed-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px">
      ${SEED_WORDS.map((w,i)=>`<div style="padding:10px;border:1px solid #e3e6ed;border-radius:10px;font:10px monospace"><span style="color:#a0a5b0;margin-right:6px">${i+1}</span>${w}</div>`).join("")}
    </div>
    <div class="form-grid" style="margin-top:15px"><div class="field"><label>3番目の単語</label><select id="seed3" class="select"><option value="">選択</option><option>velvet</option><option>maple</option><option>planet</option></select></div><div class="field"><label>9番目の単語</label><select id="seed9" class="select"><option value="">選択</option><option>canvas</option><option>river</option><option>sunset</option></select></div></div>
    <label class="check" style="margin-top:14px"><input id="seedAgree" type="checkbox"><span>復旧用フレーズの重要性を理解しました。</span></label>
    <button id="finishWallet" class="primary" style="width:100%;margin-top:15px" type="button">ウォレット作成を完了</button>`);
  $("finishWallet").onclick=()=>{
    if($("seed3").value!=="velvet"||$("seed9").value!=="canvas"){error("指定された単語を確認してください");return}
    if(!$("seedAgree").checked){error("復旧用フレーズの確認が必要です");return}
    state.privateKey=generateDemoPrivateKey();state.walletCreated=true;state.seedConfirmed=true;log("wallet_created",{address:WALLET_ADDRESS});closeModal();toast("Orbit Walletと秘密鍵を作成しました");renderAll();
    state.currentWalletTab="wallet-receive";renderWallet();
  };
}
function renderWalletHome(){
  if(state.currentApp==="wallet"&&state.transferReceived&&!state.transferPending&&!state.receiptChecked){
    state.receiptChecked=true;log("wallet_receipt_checked",{amount:state.lastReceivedAmount,source:"assets_opened"});renderMission();
  }
  walletContent.innerHTML=`
    <div class="dashboard-title"><div><span class="kicker">PORTFOLIO</span><h1>ウォレット</h1><p>${WALLET_ADDRESS.slice(0,10)}...${WALLET_ADDRESS.slice(-6)}</p></div><span class="task-callout">${state.transferPending?"入金確認中":"Ethereum Mainnet"}</span></div>
    <div class="balance-grid"><div class="balance-card wallet-balance"><small>TOTAL BALANCE</small><strong>${fmtEth(state.walletEth)}</strong><span>${fmtYen(state.walletEth*markets.ETH.price)}</span></div>
      <div class="action-card"><h3>${state.transferReceived?"チケット購入の準備完了":"ETHを受け取る"}</h3><p>${state.transferReceived?"MintGateでウォレットを接続してください。":"公開鍵をコピーし、取引所の送金先へ貼り付けます。"}</p><button id="walletPrimary" class="primary" type="button">${state.transferReceived?"MintGateを開く":"受取用アドレスを表示"}</button></div></div>
    ${state.transferPending?`<div class="notice info" style="margin-top:16px">ネットワーク確認中です。通常は複数の承認を待って残高へ反映されます。</div>`:""}
    <div class="wallet-assets"><div class="asset-row"><div class="asset-row-left"><span class="asset-icon">Ξ</span><div><strong>Ethereum</strong><small>ETH</small></div></div><div class="asset-value"><strong>${fmtEth(state.walletEth)}</strong><small>${fmtYen(state.walletEth*markets.ETH.price)}</small></div></div></div>
    ${privateKeyPanel()}`;
  $("walletPrimary").onclick=()=>state.transferReceived?switchApp("market"):(state.currentWalletTab="wallet-receive",renderWallet());
  bindPrivateKeyPanel();
}
function renderWalletReceive(){
  walletContent.innerHTML=`
    <div class="dashboard-title"><div><span class="kicker">RECEIVE</span><h1>ETHを受け取る</h1><p>以下の公開鍵を取引所の送金先に貼り付けてください。</p></div><span class="task-callout">ネットワーク：Ethereum</span></div>
    <div class="panel">
      <div class="address-box"><span class="field-title">あなたの公開鍵（ウォレットアドレス）</span><code id="publicAddress">${WALLET_ADDRESS}</code><button id="copyAddress" class="copy-button" type="button">${state.addressCopied?"コピー済み":"公開鍵をコピー"}</button></div>
      <div class="notice warning" style="margin-top:13px">送金元と送金先で、必ず同じネットワークを選択してください。</div>
      <div class="button-row" style="margin-top:15px"><button id="goExchangeSend" class="primary" type="button" ${!state.addressCopied?"disabled":""}>取引所の送金画面へ</button><button id="checkWallet" class="secondary" type="button">${state.receiptChecked?"入金確認済み":"残高を再確認"}</button></div>
      ${state.transferPending?`<div class="notice info" style="margin-top:13px">取引所からの送金を確認中です…</div>`:""}
      ${state.transferReceived&&!state.transferPending?`<div class="notice success" style="margin-top:13px">${fmtEth(state.lastReceivedAmount)} の入金が確認されました。</div>`:""}
    </div>
    ${privateKeyPanel()}`;
  $("copyAddress").onclick=copyWalletAddress;
  $("goExchangeSend").onclick=()=>{switchApp("exchange");state.currentExchangeTab="exchange-send";renderExchange()};
  $("checkWallet").onclick=()=>{
    if(state.transferPending){toast("まだネットワーク確認中です");return}
    if(!state.transferReceived){toast("まだ入金はありません");return}
    if(!state.receiptChecked){state.receiptChecked=true;log("wallet_receipt_checked",{amount:state.lastReceivedAmount})}
    renderAll();toast("入金を確認しました");
  };
  bindPrivateKeyPanel();
}

function maskedPrivateKey(){return `0x${"•".repeat(64)}`}
function privateKeyPanel(){
  const visible=privateKeyVisible;
  return `<section class="private-key-vault">
    <div class="private-key-heading"><div><span class="kicker">SECURITY</span><h2>秘密鍵</h2></div><span>研究用疑似データ</span></div>
    <div id="privateKeyDisplay" class="private-key-display ${visible?"visible":"masked"}"><code id="privateKeyValue" aria-label="${visible?"秘密鍵を表示中":"秘密鍵は非表示"}">${visible?escapeHtml(state.privateKey):maskedPrivateKey()}</code></div>
    <button id="togglePrivateKey" class="private-key-toggle" type="button" aria-pressed="${visible}">${visible?"秘密鍵を隠す":"秘密鍵を表示する"}</button>
    <p>実際の秘密鍵は第三者に共有せず、画面の録画やスクリーンショットにも残さないでください。</p>
  </section>`;
}
function bindPrivateKeyPanel(){
  const button=$("togglePrivateKey");if(!button)return;
  button.onclick=()=>{
    privateKeyVisible=!privateKeyVisible;
    const display=$("privateKeyDisplay"),value=$("privateKeyValue");
    display.classList.toggle("visible",privateKeyVisible);display.classList.toggle("masked",!privateKeyVisible);
    value.textContent=privateKeyVisible?state.privateKey:maskedPrivateKey();
    value.setAttribute("aria-label",privateKeyVisible?"秘密鍵を表示中":"秘密鍵は非表示");
    button.textContent=privateKeyVisible?"秘密鍵を隠す":"秘密鍵を表示する";button.setAttribute("aria-pressed",String(privateKeyVisible));
    log(privateKeyVisible?"private_key_revealed":"private_key_hidden");
  };
}
async function copyWalletAddress(){
  let copied=false;
  try{await navigator.clipboard.writeText(WALLET_ADDRESS);copied=true}catch(e){
    const ta=document.createElement("textarea");ta.value=WALLET_ADDRESS;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();
    try{copied=document.execCommand("copy")}catch(_){copied=false}ta.remove();
  }
  state.copyCount++;log("wallet_address_copy_attempted",{clipboard_success:copied});
  if(!copied){error("公開鍵をコピーできませんでした。ブラウザのクリップボード許可を確認してください");renderWallet();return}
  state.addressCopied=true;log("wallet_address_copied");toast("公開鍵をコピーしました。取引所で貼り付けてください");renderAll();
}
function renderWalletNft(){
  if(state.ownedNfts.length){
    walletContent.innerHTML=`
      <div class="dashboard-title"><div><span class="kicker">COLLECTIBLES</span><h1>保有NFT</h1><p>購入したNFTチケットが表示されます。</p></div><span class="task-callout">${state.ownedNfts.length} NFT</span></div>
      <div class="notice info nft-tap-guide">保有NFTをタップすると、受付で提示する入館証や利用できる特典を確認できます。</div>
      <div class="ticket-grid">${state.ownedNfts.map((owned,index)=>ticketCard(tickets.find(t=>t.id===owned.ticketId),false,true,index+1,index)).join("")}</div>`;
    document.querySelectorAll("[data-owned-index]").forEach(card=>{
      card.onclick=()=>openOwnedNftDetail(Number(card.dataset.ownedIndex));
      card.onkeydown=event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();openOwnedNftDetail(Number(card.dataset.ownedIndex))}};
    });
  }else{
    walletContent.innerHTML=`<div class="dashboard-title"><div><span class="kicker">COLLECTIBLES</span><h1>保有NFT</h1><p>現在、保有しているNFTはありません。</p></div></div><div class="notice info" style="margin-top:18px">MintGateでNFTチケットを購入すると、ここに表示されます。</div>`;
  }
}

function benefitCards(ticketId,compact=false){
  const progress=gameProgress(ticketId);
  return benefitProgram(ticketId).benefits.map(benefit=>{
    const unlocked=benefitUnlocked(ticketId,benefit);
    const detail=benefit.code?`クーポンコード <code>${benefit.code}</code>`:"受取方法は後日ウォレットへお知らせ";
    return `<article class="benefit-card ${unlocked?"unlocked":"locked"}">
      <div class="benefit-score"><span>SCORE</span><strong>${fmtScore(benefit.score)}</strong></div>
      <div class="benefit-copy"><span class="benefit-status">${unlocked?"✓ 獲得済み":`あと ${fmtScore(Math.max(0,benefit.score-progress.bestScore))} 点`}</span><h3>${benefit.title}</h3>${!compact?`<p>${unlocked?detail:`スコア ${fmtScore(benefit.score)} でアンロック`}</p>`:""}</div>
    </article>`;
  }).join("");
}

function renderWalletBenefits(){
  const ownedProgramIds=Object.keys(NFT_BENEFIT_PROGRAMS).filter(ownsTicket);
  const unlockedTotal=ownedProgramIds.reduce((sum,ticketId)=>sum+benefitProgram(ticketId).benefits.filter(benefit=>benefitUnlocked(ticketId,benefit)).length,0);
  const benefitTotal=ownedProgramIds.reduce((sum,ticketId)=>sum+benefitProgram(ticketId).benefits.length,0);
  walletContent.innerHTML=`
    <div class="dashboard-title"><div><span class="kicker">HOLDER BENEFITS</span><h1>NFT特典</h1><p>保有NFTに追加された特典を確認できます。</p></div><span class="task-callout">${ownedProgramIds.length?`${unlockedTotal} / ${benefitTotal} 獲得`:`対象NFT未保有`}</span></div>
    ${ownedProgramIds.length?ownedProgramIds.map(ticketId=>{
      const t=tickets.find(item=>item.id===ticketId),program=benefitProgram(ticketId),progress=gameProgress(ticketId),next=nextBenefit(ticketId);
      return `<section class="benefit-program-block"><div class="benefit-hero">
        <div><span class="benefit-live-label">${t.title} · DYNAMIC BENEFITS</span><h2>購入後も、NFTに新しい体験と特典が追加されます。</h2><p>「${program.gameName}」のベストスコアに応じて、段階的に特典を獲得できます。</p><button class="benefit-play-button" data-benefit-game="${ticketId}" type="button">ゲームを開始する <span>→</span></button></div>
        <div class="best-score-orb"><span>BEST SCORE</span><strong>${fmtScore(progress.bestScore)}</strong><small>${next?`次は ${fmtScore(next.score)} 点`:`すべて獲得済み`}</small></div>
      </div>
      <div class="benefit-section-head"><div><span class="kicker">YOUR REWARDS</span><h2>${t.title} の特典</h2></div><span>最終プレイスコア ${fmtScore(progress.lastScore)}</span></div>
      <div class="benefit-grid">${benefitCards(ticketId)}</div></section>`;
    }).join(""):`<div class="empty-benefit-state"><span>✦</span><h2>対象NFTを保有すると特典が表示されます</h2><p>NOVA LIVE 2026、TOKYO DIGITAL ART NIGHT、SKYLINE MUSIC FEST、ANIME CREATOR EXPO、または BAY AREA LIGHT SHOW の購入後、ゲームをプレイしてスコアに応じたホルダー特典を獲得できます。</p></div>`}`;
  document.querySelectorAll("[data-benefit-game]").forEach(button=>button.onclick=()=>openGameExperience(button.dataset.benefitGame));
}

function openOwnedNftDetail(index){
  const owned=state.ownedNfts[index];
  const t=tickets.find(item=>item.id===owned?.ticketId);
  if(!owned||!t)return;
  log("owned_nft_opened",{ticket_id:t.id,token_id:owned.tokenId});
  const program=benefitProgram(t.id);
  const progress=program?gameProgress(t.id):null;
  openModal("OWNED NFT",t.title,`
    <div class="owned-detail-visual"><img src="${t.image}" alt=""><div><span>${t.category}</span><strong>${t.date}</strong></div></div>
    <div class="summary owned-token-summary"><div class="summary-row"><span>トークンID</span><strong>${owned.tokenId}</strong></div><div class="summary-row"><span>会場</span><strong>${t.venue}</strong></div><div class="summary-row"><span>${owned.acquisitionType==="airdrop"?"獲得日時":"購入日時"}</span><strong>${new Date(owned.purchasedAt).toLocaleString("ja-JP")}</strong></div>${owned.acquisitionType==="airdrop"?`<div class="summary-row"><span>獲得方法</span><strong>3枚購入エアドロップ</strong></div>`:""}</div>
    <section class="admission-entry-callout"><div><span>EVENT ENTRY</span><h3>ウォレット署名型LIVE入館証</h3><p>NFTチケット保有と秘密鍵の所持を短時間の署名認証で証明します。</p></div><button id="openAdmissionPass" type="button">入館証を表示する <b>→</b></button></section>
    ${program?`<section class="dynamic-benefit-callout"><span class="dynamic-pill">新しい特典が追加されました</span><h3>ゲームをプレイすることで追加の特典を獲得できます</h3><p>ベストスコア：<strong>${fmtScore(progress.bestScore)}</strong></p><div class="benefit-mini-list">${benefitCards(t.id,true)}</div><button id="nftStartGame" class="benefit-play-button" type="button">${program.gameName}を開始する <span>→</span></button><button id="openBenefitsPage" class="benefit-text-button" type="button">すべての特典を確認する</button></section>`:`<div class="notice info" style="margin-top:14px">現在利用できる特典：${t.benefit}</div>`}`);
  $("openAdmissionPass").onclick=()=>openAdmissionPass(index);
  if(program){
    $("nftStartGame").onclick=()=>openGameExperience(t.id);
    $("openBenefitsPage").onclick=()=>{closeModal();state.currentWalletTab="wallet-benefits";renderWallet()};
  }
}

function generateAdmissionNonce(){
  const bytes=new Uint8Array(8);
  if(globalThis.crypto?.getRandomValues)globalThis.crypto.getRandomValues(bytes);
  else for(let index=0;index<bytes.length;index++)bytes[index]=Math.floor(Math.random()*256);
  return Array.from(bytes,byte=>byte.toString(16).padStart(2,"0")).join("").toUpperCase();
}

function admissionLiveCode(value){
  let hash=2166136261;
  for(const character of String(value)){hash^=character.charCodeAt(0);hash=Math.imul(hash,16777619)}
  const digits=String(hash>>>0).padStart(10,"0").slice(-6);
  return `${digits.slice(0,3)} ${digits.slice(3)}`;
}

function currentAdmissionOwned(){
  return activeAdmissionIndex===null?null:state.ownedNfts[activeAdmissionIndex]||null;
}

function closeAdmissionSignatureSheet(){
  $("admissionSignatureSheet").classList.add("hidden");
  $("admissionSignatureSheet").setAttribute("aria-hidden","true");
  $("admissionSignatureBackdrop").classList.add("hidden");
  $("admissionSignatureBackdrop").setAttribute("aria-hidden","true");
}

function cancelAdmissionAuthentication(){
  closeAdmissionSignatureSheet();
  if(!admissionVerifiedTokenId){admissionAuthNonce="";renderAdmissionAuthState()}
}

function resetAdmissionLiveAuth(){
  clearInterval(admissionAuthTimer);admissionAuthTimer=null;
  admissionAuthExpiresAt=0;admissionAuthNonce="";admissionVerifiedTokenId=null;
  closeAdmissionSignatureSheet();
}

function setAdmissionProofCheck(id,verified){
  $(id).classList.toggle("verified",verified);
}

function renderAdmissionAuthState(){
  const owned=currentAdmissionOwned();
  if(!owned)return;
  const used=!!owned.admissionUsedAt;
  const live=!used&&admissionVerifiedTokenId===owned.tokenId&&Date.now()<admissionAuthExpiresAt;
  const expired=!used&&!live&&!!admissionAuthNonce;
  const phase=used?"used":live?"verified":expired?"expired":"pending";
  const status=$("admissionValidStatus"),proof=$("admissionLiveProof");
  status.className=`admission-valid-status ${phase}`;proof.className=`admission-live-proof ${phase}`;
  $("admissionStatusLabel").textContent=used?"CHECK-IN COMPLETED":live?"LIVE WALLET PROOF":expired?"AUTH EXPIRED":"WALLET AUTH REQUIRED";
  $("admissionStatusText").textContent=used?"入館処理済み":live?"入館可能":expired?"期限切れ":"未認証";
  $("admissionInstruction").textContent=used?"このNFTチケットは入館処理済みです":live?"動いているLIVE認証画面を受付スタッフに提示してください":expired?"認証の有効期限が切れました。もう一度署名してください":"ウォレット署名を行い、NFTチケットの現在の保有者であることを証明してください";
  $("admissionLiveLabel").textContent=used?"CHECKED IN":live?"LIVE WALLET PROOF":expired?"PROOF EXPIRED":"LIVE WALLET PROOF";
  $("admissionLiveCode").textContent=used?"USED":expired?"EXPIRED":"—— ——";
  $("admissionLiveCountdown").textContent=used?new Date(owned.admissionUsedAt).toLocaleString("ja-JP"):expired?"再認証が必要です":"ウォレット署名が必要です";
  setAdmissionProofCheck("admissionOwnershipCheck",true);
  setAdmissionProofCheck("admissionSignatureCheck",live||used);
  setAdmissionProofCheck("admissionExpiryCheck",live||used);
  $("admissionVerifyButton").classList.toggle("hidden",live||used);
  $("admissionVerifyButton").innerHTML=expired?'ウォレットで再認証 <span>→</span>':'ウォレットで入館認証 <span>→</span>';
  $("admissionCheckInButton").classList.toggle("hidden",!live);
  if(live)updateAdmissionLiveAuth();
}

function updateAdmissionLiveAuth(){
  const owned=currentAdmissionOwned();
  if(!owned||admissionVerifiedTokenId!==owned.tokenId)return;
  const remaining=admissionAuthExpiresAt-Date.now();
  if(remaining<=0){
    clearInterval(admissionAuthTimer);admissionAuthTimer=null;admissionVerifiedTokenId=null;
    log("admission_auth_expired",{ticket_id:owned.ticketId,token_id:owned.tokenId});renderAdmissionAuthState();return;
  }
  const seconds=Math.ceil(remaining/1000),slot=Math.floor(Date.now()/3000);
  $("admissionLiveCode").textContent=admissionLiveCode(`${admissionAuthNonce}:${slot}`);
  $("admissionLiveCountdown").textContent=`有効期限まで ${seconds}秒`;
  $("admissionLiveProof").style.setProperty("--live-phase",String(slot%6));
}

function beginAdmissionAuthentication(){
  const owned=currentAdmissionOwned();
  if(!owned)return;
  if(owned.admissionUsedAt){error("このNFTチケットは入館処理済みです");return}
  admissionAuthNonce=generateAdmissionNonce();
  $("admissionSignatureToken").textContent=owned.tokenId;
  $("admissionSignatureNonce").textContent=admissionAuthNonce;
  $("admissionSignatureAgree").checked=false;
  $("admissionSignatureBackdrop").classList.remove("hidden");
  $("admissionSignatureBackdrop").setAttribute("aria-hidden","false");
  $("admissionSignatureSheet").classList.remove("hidden");
  $("admissionSignatureSheet").setAttribute("aria-hidden","false");
  log("admission_signature_requested",{ticket_id:owned.ticketId,token_id:owned.tokenId,nonce:admissionAuthNonce});
  requestAnimationFrame(()=>$('admissionSignatureAgree').focus());
}

function confirmAdmissionSignature(){
  const owned=currentAdmissionOwned();
  if(!owned){closeAdmissionSignatureSheet();return}
  if(!$("admissionSignatureAgree").checked){error("入館認証の内容を確認してください");return}
  state.signatureCount++;admissionVerifiedTokenId=owned.tokenId;admissionAuthExpiresAt=Date.now()+ADMISSION_AUTH_TTL_MS;
  log("admission_signature_verified",{ticket_id:owned.ticketId,token_id:owned.tokenId,nonce:admissionAuthNonce,expires_at:new Date(admissionAuthExpiresAt).toISOString()});
  closeAdmissionSignatureSheet();renderAdmissionAuthState();
  clearInterval(admissionAuthTimer);admissionAuthTimer=setInterval(updateAdmissionLiveAuth,250);
  toast("ウォレット署名を確認しました。30秒間有効です");
}

function completeAdmissionCheckIn(){
  const owned=currentAdmissionOwned();
  if(!owned||admissionVerifiedTokenId!==owned.tokenId||Date.now()>=admissionAuthExpiresAt){error("有効なLIVE認証が必要です");renderAdmissionAuthState();return}
  if(!window.confirm("このNFTチケットを入館処理済みにします。処理後は再利用できません。よろしいですか？"))return;
  owned.admissionUsedAt=now();
  log("admission_check_in_completed",{ticket_id:owned.ticketId,token_id:owned.tokenId,used_at:owned.admissionUsedAt});
  clearInterval(admissionAuthTimer);admissionAuthTimer=null;admissionVerifiedTokenId=null;
  renderAdmissionAuthState();toast("入館処理が完了しました");
}

function openAdmissionPass(index){
  const owned=state.ownedNfts[index],t=tickets.find(item=>item.id===owned?.ticketId);
  if(!owned||!t){error("入館証を表示できません");return}
  resetAdmissionLiveAuth();activeAdmissionIndex=index;closeModal();
  $("admissionEventImage").src=t.image;$("admissionEventImage").alt=`${t.title} のチケットビジュアル`;
  $("admissionEventCategory").textContent=t.category.toUpperCase();
  $("admissionPassTitle").textContent=`${t.title} 入館証`;
  $("admissionEventDate").textContent=t.date;
  $("admissionEventTitle").textContent=t.title;
  $("admissionEventVenue").textContent=t.venue;
  $("admissionTokenId").textContent=owned.tokenId;
  $("admissionOwner").textContent=`${WALLET_ADDRESS.slice(0,10)}...${WALLET_ADDRESS.slice(-6)}`;
  $("admissionIssuedAt").textContent=new Date(owned.purchasedAt).toLocaleString("ja-JP");
  $("admissionPass").classList.remove("hidden");document.body.classList.add("admission-pass-open");
  renderAdmissionAuthState();
  state.admissionPassViewed=true;renderMission();
  log("admission_pass_opened",{ticket_id:t.id,token_id:owned.tokenId});
  requestAnimationFrame(()=>$("admissionPassClose").focus());
}

function closeAdmissionPass(){
  if($("admissionPass").classList.contains("hidden"))return;
  resetAdmissionLiveAuth();
  $("admissionPass").classList.add("hidden");document.body.classList.remove("admission-pass-open");
  log("admission_pass_closed");
  const previousIndex=activeAdmissionIndex;activeAdmissionIndex=null;
  document.querySelector(`[data-owned-index="${previousIndex}"]`)?.focus();
}

function updateGameOverlay(){
  const ticketId=state.activeGameTicketId,program=benefitProgram(ticketId),progress=gameProgress(ticketId);
  if(!program||!progress)return;
  $("gameBestScore").textContent=fmtScore(progress.bestScore);
  $("gameBenefitList").innerHTML=program.benefits.map(benefit=>`<li class="${benefitUnlocked(ticketId,benefit)?"unlocked":""}"><span>${benefitUnlocked(ticketId,benefit)?"✓":fmtScore(benefit.score)}</span><div><strong>${benefit.title}</strong><small>${benefitUnlocked(ticketId,benefit)?"獲得済み":`SCORE ${fmtScore(benefit.score)}`}</small></div></li>`).join("");
  const next=nextBenefit(ticketId);
  $("gameNextReward").textContent=next?`次の特典まであと ${fmtScore(Math.max(0,next.score-progress.bestScore))} 点`:`全ての特典を獲得しました！`;
}

function gameFullscreenElement(){
  return document.fullscreenElement||document.webkitFullscreenElement||null;
}
function collapseGameBrowserUi(){
  const nudge=()=>window.scrollTo(0,Math.max(1,window.scrollY+1));
  nudge();
  window.setTimeout(nudge,250);
}
function enterGameFullscreen(){
  const mobileViewport=window.matchMedia("(pointer: coarse)").matches||window.innerWidth<=760;
  if(!mobileViewport||navigator.standalone===true||gameFullscreenElement())return;
  const overlay=$("gameExperience");
  const standardRequest=overlay.requestFullscreen;
  const prefixedRequest=overlay.webkitRequestFullscreen||overlay.webkitRequestFullScreen;
  if(!standardRequest&&!prefixedRequest){collapseGameBrowserUi();return}
  try{
    const request=standardRequest?standardRequest.call(overlay,{navigationUI:"hide"}):prefixedRequest.call(overlay);
    Promise.resolve(request).catch(collapseGameBrowserUi);
  }catch(_error){collapseGameBrowserUi()}
}
function exitGameFullscreen(){
  const overlay=$("gameExperience"),fullscreen=gameFullscreenElement();
  if(!fullscreen||!(fullscreen===overlay||overlay.contains(fullscreen)))return;
  const exit=document.exitFullscreen||document.webkitExitFullscreen||document.webkitCancelFullScreen;
  if(!exit)return;
  try{Promise.resolve(exit.call(document)).catch(()=>{})}catch(_error){}
}

function openGameExperience(ticketId){
  const program=benefitProgram(ticketId),t=tickets.find(item=>item.id===ticketId);
  if(!program||!t)return;
  if(!ownsTicket(ticketId)){error(`このゲームは${t.title}の保有者限定です`);return}
  closeModal();
  state.activeGameTicketId=ticketId;
  const progress=gameProgress(ticketId);progress.playCount++;
  $("gameExperienceTitle").textContent=program.challengeTitle;
  const frame=$("gameFrame");frame.title=program.frameTitle;
  if(frame.dataset.ticketId!==ticketId){
    const separator=program.gameSrc.includes("?")?"&":"?";
    frame.src=`${program.gameSrc}${separator}run=${Date.now()}-${progress.playCount}`;
    frame.dataset.ticketId=ticketId;
  }
  log("benefit_game_opened",{ticket_id:ticketId,play_count:progress.playCount});
  updateGameOverlay();
  $("gameExperience").classList.remove("hidden");
  enterGameFullscreen();
  document.body.classList.add("game-open");
}
function closeGameExperience(){
  const ticketId=state.activeGameTicketId,progress=ticketId?gameProgress(ticketId):null;
  exitGameFullscreen();
  $("gameExperience").classList.add("hidden");document.body.classList.remove("game-open");
  if(progress)log("benefit_game_closed",{ticket_id:ticketId,last_score:progress.lastScore,best_score:progress.bestScore});
  state.activeGameTicketId=null;
  const frame=$("gameFrame");
  frame.src="about:blank";
  delete frame.dataset.ticketId;
  renderWallet();
}

function renderMarket(){
  const walletReady=state.walletCreated&&state.seedConfirmed;
  $("marketWalletButton").textContent=state.marketConnected?"0x7A4F...93C2":walletReady?"ウォレットを接続":"ウォレット作成が必要";
  $("marketWalletButton").disabled=!walletReady&&!state.marketConnected;
  $("marketWalletButton").classList.toggle("connected",state.marketConnected);
  const ownedCount=state.ownedNfts.length;
  const purchaseCount=purchasedNftCount(),rewardOwned=ownsTicket(AIRDROP_TICKET_ID),airdropRemaining=Math.max(0,AIRDROP_PURCHASE_THRESHOLD-purchaseCount);
  marketContent.innerHTML=`
    ${ownedCount?`<div class="completion-card"><div class="success-check">✓</div><h2>${ownedCount}枚のNFTチケットを保有しています</h2><p>購入後も残高があれば、別のチケットや同じチケットを続けて購入できます。</p><div class="button-row" style="justify-content:center;margin-top:15px"><button id="openOwnedNft" class="primary" type="button">ウォレットでNFTを見る</button><button id="downloadResult" class="secondary" type="button">結果をJSONで保存</button></div></div>`:""}
    <div class="dashboard-title" style="margin-top:${ownedCount?22:0}px"><div><span class="kicker">EXPLORE TICKETS</span><h1>NFTチケットを探す</h1><p>ウォレット残高を使用して何度でも購入できます。</p></div><span class="task-callout">${state.marketConnected?`残高 ${fmtEth(state.walletEth)}`:"購入前にウォレット接続が必要"}</span></div>
    <section class="airdrop-market-banner ${rewardOwned?"unlocked":""}"><div><span>${rewardOwned?"AIRDROP RECEIVED":"LIMITED AIRDROP"}</span><h2>${rewardOwned?"NEXUS FUTURE PASSを獲得しました":"NFTチケットを3枚購入して限定NFTを獲得"}</h2><p>${rewardOwned?"限定NFTはOrbit Walletの保有NFTから確認できます。":`同じチケットを複数購入しても対象です。現在${purchaseCount}枚購入済み、あと${airdropRemaining}枚。`}</p></div><div class="airdrop-mini-art"><img src="${airdropTicket().image}" alt="" aria-hidden="true"></div></section>
    ${!state.marketConnected?`<div class="notice warning" style="margin-top:17px">${walletReady?`右上の「ウォレットを接続」からOrbit Walletを接続してください。接続時にメッセージ署名が求められます。`:`Orbit Walletを作成すると、このチケットサイトに接続できます。先にウォレット画面で作成を完了してください。`}</div>`:""}
    <div class="ticket-grid">${tickets.filter(t=>!t.airdropOnly).map(t=>ticketCard(t,true,false)).join("")}</div>`;
  if($("openOwnedNft"))$("openOwnedNft").onclick=()=>{switchApp("wallet");state.currentWalletTab="wallet-nft";renderWallet()};
  if($("downloadResult"))$("downloadResult").onclick=downloadResult;
  document.querySelectorAll("[data-select-ticket]").forEach(b=>b.onclick=()=>{
    if(!walletReady){error("先にOrbit Walletを作成してください");return}
    if(!state.marketConnected){error("先にウォレットを接続してください");return}
    state.selectedTicketId=b.dataset.selectTicket;log("ticket_selected",{ticket_id:state.selectedTicketId});renderMarket();openPurchaseModal();
  });
}
function ticketCard(t,selectable,owned,holdingNumber=null,ownedIndex=null){
  if(!t)return"";
  const count=state.ownedNfts.filter(item=>item.ticketId===t.id).length;
  const actionLabel=count?"もう一度購入":"購入する";
  return `<article class="ticket-card ${owned?"owned-ticket-card":""} ${t.airdropOnly?"airdrop-ticket-card":""} ${state.selectedTicketId===t.id?"selected":""}" ${owned?`data-owned-index="${ownedIndex}" role="button" tabindex="0" aria-label="${t.title}の詳細と特典を開く"`:""}>
    <div class="ticket-art"><img src="${t.image}" alt="" aria-hidden="true" loading="lazy" decoding="async"><span>${t.category.toUpperCase()}</span><span>${t.date}</span></div>
    <div class="ticket-info"><h3>${t.title}</h3><p>${t.venue}<br>${t.benefit}</p><div class="ticket-price"><strong>${t.airdropOnly?"AIRDROP":`${t.price.toFixed(3)} ETH`}</strong>${selectable?`<button data-select-ticket="${t.id}" type="button">${actionLabel}</button>`:owned?`<span class="notice success" style="padding:6px 8px">${t.airdropOnly?"限定特典":`保有 #${holdingNumber}`}</span>`:""}</div>${owned&&benefitProgram(t.id)?`<div class="added-benefit-badge"><span>✦</span> ゲーム特典を確認 <b>→</b></div>`:""}${selectable&&count?`<p style="margin-top:8px;color:#0a7b55;font-weight:800">現在 ${count}枚保有</p>`:""}</div></article>`;
}

function showAirdropReward(reward){
  const t=airdropTicket();if(!t||!reward)return;
  openModal("SPECIAL AIRDROP","限定NFTチケットを獲得",`
    <div class="airdrop-reward-visual"><img src="${t.image}" alt="${t.title}の近未来的なチケットビジュアル"><div><span>3 TICKET REWARD</span><h3>${t.title}</h3></div></div>
    <div class="airdrop-reward-copy"><span>✓ AIRDROP COMPLETED</span><h3>NFTチケット3枚購入特典</h3><p>同じチケットを含む合計3枚の購入を達成したため、新しい限定NFTチケットをOrbit Walletへ自動で追加しました。</p></div>
    <div class="summary"><div class="summary-row"><span>トークンID</span><strong>${reward.tokenId}</strong></div><div class="summary-row"><span>価格</span><strong>無料エアドロップ</strong></div></div>
    <button id="viewAirdropReward" class="primary" style="width:100%;margin-top:15px" type="button">ウォレットで確認する</button>`);
  $("viewAirdropReward").onclick=()=>{closeModal();switchApp("wallet");state.currentWalletTab="wallet-nft";renderWallet()};
}
function connectMarketWallet(){
  if(!state.walletCreated||!state.seedConfirmed){error("先にOrbit Walletを作成してください");return}
  if(state.marketConnected){toast("Orbit Walletは接続済みです");return}
  openModal("CONNECT WALLET","Orbit Walletを接続",`
    <div class="signature-card"><div class="signature-head"><span class="signature-icon">O</span><div><strong>署名リクエスト</strong><small>MintGateへの接続を確認</small></div></div>
      <div class="signature-details"><p class="hint">この署名はウォレット所有者であることを証明するもので、ガス代や資産移動は発生しません。</p>
      <div class="signature-message">Welcome to MintGate.<br><br>Wallet: ${WALLET_ADDRESS}<br>Nonce: MG-${Date.now().toString().slice(-6)}<br>Purpose: Sign in to MintGate</div>
      <div class="risk-row"><span>要求元</span><strong>mintgate.demo</strong></div><div class="risk-row"><span>資産移動</span><strong>なし</strong></div></div></div>
    <label class="check" style="margin-top:14px"><input id="connectUnderstand" type="checkbox"><span>署名内容と要求元を確認しました。</span></label>
    <div class="button-row" style="margin-top:15px"><button id="signConnect" class="primary" type="button">メッセージに署名</button><button id="rejectConnect" class="secondary" type="button">拒否</button></div>`);
  $("rejectConnect").onclick=()=>{log("signature_rejected",{purpose:"connect"});closeModal()};
  $("signConnect").onclick=()=>{
    if(!$("connectUnderstand").checked){error("署名内容を確認してください");return}
    state.signatureCount++;state.connectionSigned=true;state.marketConnected=true;log("message_signed",{purpose:"market_connect"});closeModal();toast("MintGateに接続しました");renderAll();
  };
}
function openPurchaseModal(){
  const t=ticket();if(!t)return;
  const total=t.price+PURCHASE_GAS_ETH;
  openModal("CHECKOUT","NFTチケットを購入",`
    <div class="summary"><div class="summary-row"><span>商品</span><strong>${t.title}</strong></div><div class="summary-row"><span>NFT価格</span><strong>${fmtEth(t.price)}</strong></div><div class="summary-row"><span>推定ガス代</span><strong>${fmtEth(PURCHASE_GAS_ETH)}</strong></div><div class="summary-row"><span>支払合計</span><strong>${fmtEth(total)}</strong></div><div class="summary-row"><span>ウォレット残高</span><strong>${fmtEth(state.walletEth)}</strong></div></div>
    ${state.walletEth<total?`<div class="notice danger" style="margin-top:13px">残高が不足しています。別のチケットを選択するか、追加でETHを送金してください。</div>`:`<div class="notice info" style="margin-top:13px">次にOrbit Walletで購入トランザクションを確認・署名します。</div>`}
    <div class="button-row" style="margin-top:15px"><button id="continuePurchase" class="primary" type="button" ${state.walletEth<total?"disabled":""}>ウォレットで確認</button><button id="cancelPurchase" class="secondary" type="button">キャンセル</button></div>`);
  $("cancelPurchase").onclick=closeModal;
  $("continuePurchase").onclick=()=>openTransactionSignature();
}
function openTransactionSignature(){
  const t=ticket();const total=t.price+PURCHASE_GAS_ETH;
  openModal("ORBIT WALLET","トランザクションを確認",`
    <div class="signature-card"><div class="signature-head"><span class="signature-icon">O</span><div><strong>コントラクト実行</strong><small>Ethereum Mainnet（疑似）</small></div></div>
    <div class="signature-details"><div class="risk-row"><span>接続先</span><strong>MintGate</strong></div><div class="risk-row"><span>操作</span><strong>NFTチケット購入</strong></div><div class="risk-row"><span>コントラクト</span><strong>0x91D2...44AF</strong></div><div class="risk-row"><span>NFT価格</span><strong>${fmtEth(t.price)}</strong></div><div class="risk-row"><span>推定ガス代</span><strong>${fmtEth(PURCHASE_GAS_ETH)}</strong></div><div class="risk-row"><span>最大支払額</span><strong>${fmtEth(total)}</strong></div></div></div>
    <div class="notice warning" style="margin-top:13px">署名すると、ブロックチェーンへ購入トランザクションが送信されます。内容を確認してください。</div>
    <label class="check" style="margin-top:14px"><input id="txUnderstand" type="checkbox"><span>送信先、金額、ガス代、コントラクトの内容を確認しました。</span></label>
    <div class="button-row" style="margin-top:15px"><button id="signTransaction" class="primary" type="button">確認して署名</button><button id="rejectTransaction" class="secondary" type="button">拒否</button></div>`);
  $("rejectTransaction").onclick=()=>{log("signature_rejected",{purpose:"purchase"});closeModal()};
  $("signTransaction").onclick=()=>{
    if(!$("txUnderstand").checked){error("トランザクション内容を確認してください");return}
    state.signatureCount++;state.purchaseSigned=true;state.walletEth-=total;log("transaction_signed",{ticket_id:t.id,total_eth:total});
    openTransactionPending();
  };
}
function openTransactionPending(){
  state.pendingPurchaseTicketId=state.selectedTicketId;
  state.purchaseCompletesAt=Date.now()+PURCHASE_DELAY_MS;
  showTransactionPending();schedulePurchaseCompletion(PURCHASE_DELAY_MS);
}
function showTransactionPending(){
  openModal("TRANSACTION","購入処理を送信中",`<div class="transaction-status"><div class="spinner"></div><h3>ネットワーク承認を待っています</h3><p>署名済みトランザクションをEthereumネットワークへ送信しました。</p></div>`,false);
}
function completePurchase(){
  const purchasedTicketId=state.pendingPurchaseTicketId;
  if(!purchasedTicketId)return;
  state.ownedNfts.push({tokenId:`MG-${Date.now().toString().slice(-8)}`,ticketId:purchasedTicketId,purchasedAt:now(),acquisitionType:"purchase"});
  state.nftOwned=true;if(!state.completedAt)state.completedAt=now();
  log("nft_purchase_confirmed",{ticket_id:purchasedTicketId,owned_count:state.ownedNfts.length});
  const airdropReward=maybeGrantAirdrop();
  state.pendingPurchaseTicketId=null;state.purchaseCompletesAt=null;closeModal();renderAll();
  if(airdropReward)showAirdropReward(airdropReward);else toast("NFTチケットの購入が完了しました。続けて購入できます");
}
function schedulePurchaseCompletion(delay){
  clearTimeout(purchaseTimer);purchaseTimer=setTimeout(completePurchase,Math.max(0,delay));
}
function resumePendingOperations(){
  if(state.transferPending){
    const remaining=(Number(state.transferCompletesAt)||Date.now()+TRANSFER_DELAY_MS)-Date.now();
    scheduleTransferCompletion(remaining);
  }
  if(state.pendingPurchaseTicketId){
    const remaining=(Number(state.purchaseCompletesAt)||Date.now()+PURCHASE_DELAY_MS)-Date.now();
    if(remaining>0)showTransactionPending();
    schedulePurchaseCompletion(remaining);
  }
}
function openResetConfirmation(){
  openModal("RESET PROGRESS","進捗をリセットしますか？",`
    <div class="notice danger">この参加者の進捗、残高、保有NFT、ゲームスコア、操作ログがすべて削除されます。この操作は取り消せません。</div>
    <div class="button-row" style="margin-top:16px"><button id="confirmProgressReset" class="danger-btn" type="button">すべて削除してリセット</button><button id="cancelProgressReset" class="secondary" type="button">キャンセル</button></div>`);
  $("cancelProgressReset").onclick=closeModal;
  $("confirmProgressReset").onclick=resetProgress;
}
function resetProgress(){
  resetInProgress=true;
  clearTimeout(persistTimer);clearTimeout(transferTimer);clearTimeout(purchaseTimer);stopTicker();
  try{
    localStorage.removeItem(STORAGE_KEY);
    GAME_STORAGE_KEYS.forEach(key=>localStorage.removeItem(key));
  }catch(error){console.warn("保存された進捗を削除できませんでした。",error)}
  location.reload();
}
function renderMarketComplete(){
  const t=ticket();
  const totalSec=Math.max(1,Math.round((new Date(state.completedAt)-new Date(state.startedAt))/1000));
  marketContent.innerHTML=`
    <div class="completion-card"><div class="success-check">✓</div><h2>NFTチケットを購入しました</h2><p>${t.title} がOrbit Walletへ追加されました。これは研究用の疑似取引です。</p></div>
    <div class="result-grid"><div class="result-card"><span>所要時間</span><strong>${formatDuration(totalSec)}</strong></div><div class="result-card"><span>サービス切替</span><strong>${state.appSwitchCount}回</strong></div><div class="result-card"><span>コピー・貼付</span><strong>${state.copyCount+state.pasteCount}回</strong></div><div class="result-card"><span>署名</span><strong>${state.signatureCount}回</strong></div></div>
    <div class="button-row" style="justify-content:center;margin-top:18px"><button id="openOwnedNft" class="primary" type="button">ウォレットでNFTを見る</button><button id="downloadResult" class="secondary" type="button">結果をJSONで保存</button></div>`;
  $("openOwnedNft").onclick=()=>{switchApp("wallet");state.currentWalletTab="wallet-nft";renderWallet()};
  $("downloadResult").onclick=downloadResult;
}

function openModal(kicker,title,body,closable=true){
  $("modalKicker").textContent=kicker;$("modalTitle").textContent=title;$("modalBody").innerHTML=body;
  $("modal").classList.remove("hidden");$("modalBackdrop").classList.remove("hidden");
  $("modalClose").classList.toggle("hidden",!closable);$("modalBackdrop").onclick=closable?closeModal:null;
}
function closeModal(){$("modal").classList.add("hidden");$("modalBackdrop").classList.add("hidden")}
function formatDuration(s){const m=Math.floor(s/60),r=s%60;return m?`${m}分${r}秒`:`${r}秒`}
function benefitResult(ticketId){
  const program=benefitProgram(ticketId),progress=gameProgress(ticketId);
  return {game_play_count:progress.playCount,last_score:progress.lastScore,best_score:progress.bestScore,
    unlocked:program.benefits.filter(benefit=>benefitUnlocked(ticketId,benefit)).map(benefit=>({score:benefit.score,title:benefit.title,code:benefit.code,unlocked_at:progress.benefitsUnlockedAt[benefit.score]}))};
}
function resultData(){
  if(state.appEnteredAt!==null){state.appTimes[state.currentApp]+=Math.round((performance.now()-state.appEnteredAt)/1000);state.appEnteredAt=performance.now()}
  return {participant_id:state.participantId,condition:"multi_service_traditional_nft_flow",started_at:state.startedAt,completed_at:state.completedAt,
    completion_time_seconds:state.completedAt?Math.round((new Date(state.completedAt)-new Date(state.startedAt))/1000):null,
    app_switch_count:state.appSwitchCount,help_open_count:state.helpOpenCount,copy_count:state.copyCount,paste_count:state.pasteCount,
    signature_count:state.signatureCount,validation_error_count:state.validationErrors,app_times_seconds:state.appTimes,
    exchange:{yen_balance:state.exchangeYen,eth_purchased_total:state.purchasedEth,last_rate_at_purchase:state.ethPriceAtPurchase,eth_remaining:state.exchangeEth,purchase_history:state.purchaseHistory},
    wallet:{address:WALLET_ADDRESS,eth_balance:state.walletEth,transfer_amount:state.transferAmount,transfer_received:state.transferReceived,receipt_checked:state.receiptChecked,owned_nfts:state.ownedNfts,
      nova_live_benefits:benefitResult("nova-live"),digital_art_benefits:benefitResult("digital-art"),skyline_fest_benefits:benefitResult("skyline-fest"),anime_creator_expo_benefits:benefitResult("creator-expo"),bay_area_light_show_benefits:benefitResult("light-show")},
    marketplace:{connected:state.marketConnected,selected_ticket:state.selectedTicketId,purchase_signed:state.purchaseSigned,nft_owned:state.ownedNfts.length>0,nft_count:state.ownedNfts.length,purchased_nft_count:purchasedNftCount(),purchases:state.ownedNfts,admission_pass_viewed:state.admissionPassViewed,
      airdrop:{threshold:AIRDROP_PURCHASE_THRESHOLD,received:ownsTicket(AIRDROP_TICKET_ID),ticket_id:AIRDROP_TICKET_ID}},
    event_log:state.eventLog};
}
function downloadResult(){
  const blob=new Blob([JSON.stringify(resultData(),null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`${state.participantId}_multi_service_flow.json`;a.click();URL.revokeObjectURL(url);
}

$("startButton").onclick=start;
$("progressGuideStart").onclick=closeProgressGuide;
$("homeButton").onclick=()=>{if(workspace.classList.contains("hidden"))return;window.scrollTo({top:0,behavior:"smooth"})};
document.querySelectorAll(".switcher-item").forEach(b=>b.onclick=()=>switchApp(b.dataset.app));
document.querySelectorAll("#exchangeTabs button").forEach(b=>b.onclick=()=>setExchangeTab(b.dataset.tab));
document.querySelectorAll("#walletTabs button").forEach(b=>b.onclick=()=>{
  const tab=b.dataset.tab;if((tab==="wallet-nft"||tab==="wallet-benefits")&&!state.walletCreated){error("先にウォレットを作成してください");return}
  state.currentWalletTab=tab;renderWallet();
});
$("marketWalletButton").onclick=connectMarketWallet;
$("modalClose").onclick=closeModal;
$("helpButton").onclick=()=>{state.helpOpenCount++;log("help_opened");$("helpBackdrop").classList.remove("hidden");$("helpDrawer").classList.add("open");$("helpDrawer").setAttribute("aria-hidden","false")};
function closeHelp(){$("helpBackdrop").classList.add("hidden");$("helpDrawer").classList.remove("open");$("helpDrawer").setAttribute("aria-hidden","true")}
$("helpClose").onclick=closeHelp;$("helpBackdrop").onclick=closeHelp;
$("admissionPassClose").onclick=closeAdmissionPass;
$("admissionVerifyButton").onclick=beginAdmissionAuthentication;
$("admissionCheckInButton").onclick=completeAdmissionCheckIn;
$("admissionSignatureConfirm").onclick=confirmAdmissionSignature;
$("admissionSignatureCancel").onclick=cancelAdmissionAuthentication;
$("admissionSignatureBackdrop").onclick=cancelAdmissionAuthentication;
$("gameClose").onclick=closeGameExperience;
$("resetProgressButton").onclick=openResetConfirmation;
window.addEventListener("pagehide",persistState);
window.addEventListener("message",event=>{
  const ticketId=state.activeGameTicketId,program=benefitProgram(ticketId);
  if(event.source!==$("gameFrame").contentWindow||!program||event.data?.type!==program.messageType)return;
  const score=Math.max(0,Math.floor(Number(event.data.score)||0));
  const progress=gameProgress(ticketId),previousBest=progress.bestScore;
  progress.lastScore=score;progress.bestScore=Math.max(progress.bestScore,score);
  program.benefits.forEach(benefit=>{
    if(previousBest<benefit.score&&progress.bestScore>=benefit.score){
      progress.benefitsUnlockedAt[benefit.score]=now();
      log("nft_benefit_unlocked",{ticket_id:ticketId,score:benefit.score,benefit:benefit.title,code:benefit.code});
    }
  });
  if(event.data.final)log("benefit_game_finished",{ticket_id:ticketId,score,best_score:progress.bestScore});
  updateGameOverlay();
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!$("admissionSignatureSheet").classList.contains("hidden"))cancelAdmissionAuthentication();else if(!$("admissionPass").classList.contains("hidden"))closeAdmissionPass();else if(!$("gameExperience").classList.contains("hidden"))closeGameExperience();else{closeModal();closeHelp()}}});
restoreSession();
