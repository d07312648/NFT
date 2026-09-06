
const WALLET_ADDRESS = "0x7A4F2C9B6E18D4A1F335B9C8705E1199AB8E93C2";
const SEED_WORD_BANK = [
  "orbit","harbor","velvet","maple","crystal","planet","silver","echo","canvas","river","gentle","sunset",
  "nebula","anchor","lunar","copper","meadow","prism","aurora","drift","summit","flame","willow","comet",
  "forest","marble","cobalt","breeze","lantern","ocean","amber","feather","valley","coral","thunder","olive",
  "galaxy","bridge","pearl","canyon","violet","island","meteor","cedar","horizon","frost","clover","dawn"
];
const NETWORK_FEE_ETH = 0.0032;
const PURCHASE_GAS_ETH = 0.0028;
const STORAGE_KEY = "nft-journey-lab-session-v1";
const GAME_STORAGE_KEYS = ["hoshiwatari-momo-best","tokyo-digital-art-night-jump-best","skyline-music-fest-bounce-best-score","anime-creator-expo-tower-best-score","momo-spike-wall-best"];
const TRANSFER_DELAY_MS = 2200;
const PURCHASE_DELAY_MS = 2400;
const WALLET_CREATION_NOTICE_MS = 2600;
const MISSION_COMPLETION_NOTICE_MS = 3600;
const ADMISSION_AUTH_TTL_MS = 30000;
const AIRDROP_PURCHASE_THRESHOLD = 3;
const AIRDROP_TICKET_ID = "nexus-future-pass";
const MAX_WALLETS = 5;
const WALLET_SECURITY_GUIDE_STEPS = [
  {tab:"wallet-home",targets:[".wallet-overview-title",".wallet-balance"],label:"1 / 4 · ウォレット",title:"ウォレットが作成されました",description:"実際のウォレットアプリでは、ウォレットを無制限に作成できます。\nこのサイト内では、体験用として最大5個まで作成できるようにしています。",action:"次へ"},
  {tab:"wallet-receive",target:".address-box",label:"2 / 4 · 公開鍵",title:"公開鍵は、暗号資産の受取先を伝えるアドレスです",description:"取引所から暗号資産を送るとき、この公開鍵を送金先へ貼り付けます。\n公開鍵は、暗号資産を受け取るために相手へ共有できます。",action:"次へ"},
  {tab:"wallet-receive",target:".seed-phrase-display",reveal:"seed",label:"3 / 4 · シードフレーズ",title:"ウォレットを復旧するための12単語です",description:"端末の紛失や故障時に、ウォレットを復旧できます。\n実際のウォレットでは、表示する際にパスワードの入力を求められます。\nこの12単語を知る人はウォレットを復旧できるため、第三者には共有しないでください。\nスクリーンショットではなく、紙に手書きして安全な場所に保管することをおすすめします。",action:"次へ"},
  {tab:"wallet-receive",target:".private-key-display",reveal:"private",label:"4 / 4 · 秘密鍵",title:"資産を操作するための最も重要な情報です",description:"秘密鍵を知る人は、ウォレット内の資産を操作できます。\n実際のウォレットでは、表示する際にパスワードの入力を求められます。\n絶対に第三者へ共有しないでください。\nスクリーンショットではなく、紙に手書きして安全な場所に保管することをおすすめします。",action:"閉じる"}
];
const NFT_OWNERSHIP_GUIDE_STEPS = [
  {
    label:"1 / 2 · 購入完了",title:"NFTチケットがウォレットに追加されました",
    body:"<p>ハイライトされているカードが、今回初めて購入したNFTです。この体験では疑似的にウォレットへ追加しています。カードを押すと、入館証や保有者向け特典を確認できます。</p>",action:"NFTの説明へ進む"
  },
  {
    label:"ポイント 1 / 4 · 所有の記録",title:"NFTは1点ずつ識別して所有者を確認できます",
    body:"<p>実際のNFTでは、コントラクトアドレスとトークンIDの組み合わせで資産を識別し、ブロックチェーン上の所有者を確認できます。</p><p>この仕組みは、チケットの真正性確認や偽造対策、入場管理にも活用できます。</p>",action:"次へ"
  },
  {
    label:"ポイント 2 / 4 · 運営元・地域のメリット",title:"保有者との関係を継続し、再訪や地域経済への波及につなげられます",
    body:"<ul><li><strong>保有者との継続的な関係</strong><span>所有者を確認できるため、保有者限定イベント、コミュニティ参加、追加配布、限定商品の販売などを継続して案内できます。訪問後もNFTが地域との関係を示す形で残り、接点をつくりやすくなります。</span></li><li><strong>二次流通（転売）からの還元</strong><span>一般的なCtoC（メルカリなど）では、売買手数料が商品の開発元へ還元されません。NFTでは、対応する販売サービスを通じて二次流通の売上の一部を運営元へ還元する仕組みを設定でき、地方自治体などの継続的な財源確保につながる可能性があります。</span></li><li><strong>第三者による特典の付与</strong><span>NFTの保有情報はブロックチェーン上で確認できるため、第三者も対象のNFTを保有するウォレットを判別できます。例えば、イベント付近の飲食店がクーポン自体をNFT（クーポンNFT）として対象ウォレットへ配布できます。これにより、イベントとその参加者だけでなく、周辺店舗を含む地域経済への波及が期待できます。</span></li></ul>",action:"次へ"
  },
  {
    label:"ポイント 3 / 4 · 保有者のメリット",title:"チケットをまとめて保存し、転売対策にも活用できます",
    body:"<ul><li><strong>1つのウォレットで保存</strong><span>異なるライブやイベントのNFTチケットを1つのウォレットで保存できます。来場記録と連携したNFTは、イベント終了後も参加の証明や思い出として確認できます。</span></li><li><strong>保有者限定の体験や特典</strong><span>NFTの保有を証明することで、保有者限定イベント、デジタルコンテンツ、コミュニティ、クーポンなどを利用できる場合があります。</span></li><li><strong>SBTによる転売防止</strong><span>運営元がSBT（ソウルバウンドトークン）という形態のNFTを発行すると、転売を不可能にすることができ、本当に欲しい人だけが購入することができます。</span></li></ul>",action:"次へ"
  },
  {
    label:"ポイント 4 / 4 · 安全に利用するために",title:"公開情報と偽サイトに注意してください",
    body:"<p>NFTの保有状況や取引履歴は公開される場合があります。特典を装う偽サイトでは署名や承認をしないでください。</p><p>紹介したメリットは、NFTの設計、保存方法、対応サービス、運営方針によって異なります。</p>",action:"閉じる"
  }
];
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
  ["buy","取引所で暗号資産を購入","日本円から暗号資産へ交換"],
  ["wallet","ウォレットを作成","公開鍵を取得する"],
  ["copy","公開鍵をコピー","ウォレットからコピーする"],
  ["send","取引所から送金","公開鍵を貼り付けて送金"],
  ["receive","ウォレットで受取確認","入金の反映を確認する"],
  ["connect","チケットサイトに接続","接続メッセージへ署名"],
  ["purchase","NFTチケットを購入","取引内容を確認・署名"],
  ["admission","入館証を表示する","受付で入館処理を完了する"]
];

const missionHints = {
  account:{service:"NOVA Exchange",summary:"最初に暗号資産取引所の疑似口座を開設します。実在する個人情報は必要ありません。",steps:["画面上部の「取引所」を開きます。","ホーム画面の「口座開設を開始」を押します。","架空の登録情報を確認し、「本人確認を完了する」を押します。"],tip:"入力済みのデモ情報をそのまま使用できます。",app:"exchange",tab:"exchange-home",action:"取引所を開く"},
  buy:{service:"NOVA Exchange",summary:"日本円残高を使い、ウォレットへの送金に必要なETHを購入します。",steps:["取引所上部の「購入」タブを開きます。","購入する日本円の金額を1,000円以上で入力します。","価格変動と手数料の確認にチェックを入れ、「ETHを購入する」を押します。"],tip:"NFTチケット代と送金・購入手数料の分も含め、少し多めに購入すると進めやすくなります。",app:"exchange",tab:"exchange-buy",action:"ETH購入画面を開く"},
  wallet:{service:"Orbit Wallet",summary:"暗号資産とNFTを受け取るためのウォレットを作成します。",steps:["画面上部の「ウォレット」を開きます。","「ウォレットを作成」を押して復旧用フレーズを確認します。","指定された単語を選び、注意事項にチェックを入れて作成を完了します。"],tip:"秘密鍵と復旧用フレーズは研究用の架空データです。",app:"wallet",tab:"wallet-home",action:"ウォレットを開く"},
  copy:{service:"Orbit Wallet",summary:"取引所の送金先として使用するウォレットの公開鍵をコピーします。",steps:["ウォレット上部の「受け取る」タブを開きます。","表示された公開鍵の下にある「公開鍵をコピー」を押します。","コピー済みと表示されたら、取引所の送金画面へ進みます。"],tip:"公開鍵は共有可能ですが、秘密鍵は第三者へ共有しないでください。",app:"wallet",tab:"wallet-receive",action:"受取画面を開く"},
  send:{service:"NOVA Exchange",summary:"コピーした公開鍵を貼り付け、取引所からOrbit WalletへETHを送ります。",steps:["取引所上部の「送金」タブを開きます。","送金先欄へ、ウォレットでコピーした公開鍵を貼り付けます。","送金額と手数料を確認し、注意事項にチェックを入れて送金を確定します。"],tip:"公開鍵は手入力せず、コピー・貼り付けを使うと間違いを防げます。",app:"exchange",tab:"exchange-send",action:"ETH送金画面を開く"},
  receive:{service:"Orbit Wallet",summary:"取引所から送ったETHがウォレット残高へ反映されたことを確認します。",steps:["送金後、数秒間ネットワーク確認が完了するのを待ちます。","画面上部の「ウォレット」を開きます。","ウォレットの「資産」画面を開くと、受取確認が進捗へ反映されます。"],tip:"まだ反映されない場合は「受け取る」画面の「残高を再確認」も利用できます。",app:"wallet",tab:"wallet-home",action:"ウォレットの資産を開く"},
  connect:{service:"MintGate",summary:"NFTチケットサイトへOrbit Walletを接続し、ウォレット所有者であることを証明します。",steps:["画面上部の「チケットサイト」を開きます。","右上の「ウォレットを接続」を押します。","要求元と署名内容を確認してチェックを入れ、「メッセージに署名」を押します。"],tip:"この接続署名ではETHの送金や手数料は発生しません。",app:"market",tab:null,action:"チケットサイトを開く"},
  purchase:{service:"MintGate",summary:"購入したいNFTチケットを選び、ウォレットで取引内容へ署名します。",steps:["チケットサイトで希望するNFTの「購入する」を押します。","NFT価格、ガス代（手数料）、ウォレット残高を確認して「ウォレットで確認」を押します。","トランザクション内容を確認してチェックを入れ、「確認して署名」を押します。"],tip:"残高不足の場合は、価格の低いチケットを選ぶかETHを追加送金してください。",app:"market",tab:null,action:"NFTチケットを選ぶ"},
  admission:{service:"Orbit Wallet",summary:"購入したNFTチケットの入館証を表示し、ウォレット認証から受付での入館処理まで完了します。",steps:["ウォレット上部の「NFT」タブを開き、保有NFTから入館するチケットをタップします。","「入館証を表示する」を押し、「ウォレットで入館認証」へ進みます。","認証内容を確認してチェックを入れ、「メッセージに署名」を押します。","6桁のLIVE認証コードが表示されている30秒以内に、「受付で入館処理を完了する」を押します。"],tip:"進捗へ反映されるのは、入館証を開いた時点ではなく、受付での入館処理を完了した時点です。コードの有効期限が切れた場合は、もう一度ウォレット認証を行ってください。",app:"wallet",tab:"wallet-nft",action:"保有NFTを開く"}
};

function createDefaultState(){
  return {
    participantId:null, startedAt:null, completedAt:null, completionProgressGuideCompleted:false,
    currentApp:"exchange", currentExchangeTab:"exchange-home", currentWalletTab:"wallet-home",
    appSwitchCount:0, helpOpenCount:0, copyCount:0, pasteCount:0, signatureCount:0, validationErrors:0,
    appEnteredAt:null, appTimes:{exchange:0,wallet:0,market:0},
    accountCreated:false, accountBalanceGuideCompleted:false, ethPurchased:false, walletCreated:false, seedConfirmed:false, privateKey:null,
    wallets:[], activeWalletId:null, connectedWalletId:null, copiedWalletId:null,
    walletSecurityGuideCompleted:false, nftOwnershipGuideCompleted:false, firstPurchasedNftTokenId:null, airdropGuideCompleted:false, admissionResaleGuideShown:false,
    addressCopied:false, addressPasted:false, transferSent:false, transferReceived:false, receiptChecked:false, walletReceiptGuideCompleted:false, transferPending:false, transferCompletesAt:null, transferDestinationWalletId:null, lastReceivedAmount:0, lastReceivedWalletId:null,
    marketConnected:false, connectionSigned:false, selectedTicketId:null,
    purchaseSigned:false, nftOwned:false, ownedNfts:[], pendingPurchaseTicketId:null, pendingPurchaseWalletId:null, purchaseCompletesAt:null, admissionPassViewed:false,
    exchangeYen:100000, exchangeEth:0, walletEth:0, purchasedEth:0, purchaseYen:"",
    buyAgreementChecked:false, ethPriceAtPurchase:null, purchaseHistory:[],
    destinationAddress:"", transferAmount:"",
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
    if(typeof saved.state.accountBalanceGuideCompleted!=="boolean")restored.accountBalanceGuideCompleted=!!saved.state.accountCreated;
    if(typeof saved.state.walletReceiptGuideCompleted!=="boolean")restored.walletReceiptGuideCompleted=!!saved.state.receiptChecked;
    if(typeof saved.state.walletSecurityGuideCompleted!=="boolean")restored.walletSecurityGuideCompleted=!!saved.state.walletCreated;
    const savedWallets=Array.isArray(saved.state.wallets)?saved.state.wallets:[];
    restored.wallets=savedWallets.map((wallet,index)=>({
      id:String(wallet.id||`wallet-${index+1}`),
      name:String(wallet.name||`ウォレット ${index+1}`),
      address:/^0x[0-9a-f]{40}$/i.test(wallet.address||"")?wallet.address:generateDemoWalletAddress(),
      privateKey:/^0x[0-9a-f]{64}$/i.test(wallet.privateKey||"")?wallet.privateKey:generateDemoPrivateKey(),
      ethBalance:Math.max(0,Number(wallet.ethBalance)||0),
      createdAt:wallet.createdAt||restored.startedAt||now(),
      seedPhrase:Array.isArray(wallet.seedPhrase)&&wallet.seedPhrase.length===12?wallet.seedPhrase.map(String):seedWordsForWallet(index+1)
    }));
    if(!restored.wallets.length&&restored.walletCreated){
      restored.wallets.push({id:"wallet-1",name:"ウォレット 1",address:WALLET_ADDRESS,privateKey:/^0x[0-9a-f]{64}$/i.test(restored.privateKey||"")?restored.privateKey:generateDemoPrivateKey(),ethBalance:Math.max(0,Number(restored.walletEth)||0),createdAt:restored.startedAt||now(),seedPhrase:seedWordsForWallet(1)});
    }
    restored.walletCreated=restored.wallets.length>0;
    restored.seedConfirmed=restored.wallets.length>0;
    if(!restored.wallets.some(wallet=>wallet.id===restored.activeWalletId))restored.activeWalletId=restored.wallets[0]?.id||null;
    const activeRestoredWallet=restored.wallets.find(wallet=>wallet.id===restored.activeWalletId)||null;
    restored.privateKey=activeRestoredWallet?.privateKey||null;
    restored.walletEth=activeRestoredWallet?.ethBalance||0;
    if(restored.addressCopied&&!restored.wallets.some(wallet=>wallet.id===restored.copiedWalletId))restored.copiedWalletId=activeRestoredWallet?.id||null;
    if(restored.transferPending&&!restored.wallets.some(wallet=>wallet.id===restored.transferDestinationWalletId)){
      restored.transferDestinationWalletId=restored.wallets.find(wallet=>wallet.address.toLowerCase()===String(restored.destinationAddress||"").toLowerCase())?.id||activeRestoredWallet?.id||null;
    }
    if(restored.transferReceived&&!restored.wallets.some(wallet=>wallet.id===restored.lastReceivedWalletId))restored.lastReceivedWalletId=activeRestoredWallet?.id||null;
    if(restored.marketConnected&&!restored.wallets.some(wallet=>wallet.id===restored.connectedWalletId))restored.connectedWalletId=restored.wallets[0]?.id||null;
    if(!restored.walletCreated||!restored.seedConfirmed||!restored.connectedWalletId){restored.marketConnected=false;restored.connectionSigned=false;restored.connectedWalletId=null}
    const fallbackOwner=restored.wallets[0]||null;
    restored.ownedNfts=restored.ownedNfts.map(item=>{
      const owner=restored.wallets.find(wallet=>wallet.id===item.ownerWalletId)||fallbackOwner;
      return {...item,ownerWalletId:owner?.id||null,ownerAddress:item.ownerAddress||owner?.address||null};
    });
    const restoredPurchases=restored.ownedNfts.filter(item=>item.acquisitionType!=="airdrop");
    if(!restoredPurchases.some(item=>item.tokenId===restored.firstPurchasedNftTokenId))restored.firstPurchasedNftTokenId=restoredPurchases[0]?.tokenId||null;
    if(typeof saved.state.nftOwnershipGuideCompleted!=="boolean")restored.nftOwnershipGuideCompleted=false;
    if(typeof saved.state.admissionResaleGuideShown!=="boolean")restored.admissionResaleGuideShown=restored.ownedNfts.some(item=>!!item.admissionUsedAt);
    if(restored.pendingPurchaseTicketId&&!restored.wallets.some(wallet=>wallet.id===restored.pendingPurchaseWalletId))restored.pendingPurchaseWalletId=restored.connectedWalletId||activeRestoredWallet?.id||null;
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
const missionCompletionAnnounced=new Set(missions.filter(([key])=>missionStatus(key)).map(([key])=>key));

let tickerTimer=null;
let transferTimer=null;
let purchaseTimer=null;
let missionCompletionNoticeTimer=null;
let missionCompletionNoticeActive=false;
let missionCompletionNoticeCurrent=null;
const missionCompletionNoticeQueue=[];
let completionProgressGuideTimer=null;
let progressGuideMode="intro";
let privateKeyVisible=false;
let seedPhraseVisible=false;
let walletSecurityGuideStep=0;
let walletSecurityGuideTarget=null;
let walletSecurityGuideTargets=[];
let walletSecurityGuideInitialScroll={x:0,y:0};
let nftOwnershipGuideStep=0;
let nftOwnershipGuideTarget=null;
let nftOwnershipGuideScheduled=false;
let nftOwnershipGuideMode="purchase";
let exchangeBalanceGuideTarget=null;
let exchangeBalanceGuideInitialScroll={x:0,y:0};
let exchangeBalanceGuideMode="account";
let signatureGuideTarget=null;
let signatureGuideWalletId=null;
let signatureGuideMode=null;
let guidePositionRefreshFrame=null;
let guidePositionRefreshPasses=0;
let guideGeometryMonitorFrame=null;
let guideGeometryKey="";
let mobileGuideTouchY=null;
let activeAdmissionIndex=null;
let admissionAuthTimer=null;
let admissionAuthExpiresAt=0;
let admissionAuthNonce="";
let admissionVerifiedTokenId=null;
let admissionResaleGuideTarget=null;
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
function generateDemoWalletAddress(){
  const bytes=new Uint8Array(20);
  if(globalThis.crypto?.getRandomValues)globalThis.crypto.getRandomValues(bytes);
  else for(let index=0;index<bytes.length;index++)bytes[index]=Math.floor(Math.random()*256);
  return `0x${Array.from(bytes,byte=>byte.toString(16).padStart(2,"0")).join("").toUpperCase()}`;
}
function seedWordsForWallet(walletNumber){
  const start=((Math.max(1,Number(walletNumber)||1)-1)*12)%SEED_WORD_BANK.length;
  return Array.from({length:12},(_,index)=>SEED_WORD_BANK[(start+index)%SEED_WORD_BANK.length]);
}
function log(type,detail={}){state.eventLog.push({timestamp:now(),app:state.currentApp,type,...detail})}
function fmtEth(v){return `${Number(v||0).toFixed(4)} ETH`}
function fmtYen(v){return `¥${Math.round(Number(v||0)).toLocaleString("ja-JP")}`}
function ticket(){return tickets.find(t=>t.id===state.selectedTicketId)||null}
function escapeHtml(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function walletById(walletId){return state.wallets.find(wallet=>wallet.id===walletId)||null}
function walletByAddress(address){
  const normalized=String(address||"").trim().toLowerCase();
  return state.wallets.find(wallet=>wallet.address.toLowerCase()===normalized)||null;
}
function activeWallet(){return walletById(state.activeWalletId)||state.wallets[0]||null}
function connectedWallet(){return state.marketConnected?walletById(state.connectedWalletId):null}
function shortWalletAddress(address){return address?`${address.slice(0,10)}...${address.slice(-6)}`:"—"}
function syncLegacyWalletState(){
  const wallet=activeWallet();
  state.walletCreated=state.wallets.length>0;state.seedConfirmed=state.wallets.length>0;
  state.privateKey=wallet?.privateKey||null;state.walletEth=wallet?.ethBalance||0;
}
function nftOwnerWalletId(item){return item?.ownerWalletId||state.wallets[0]?.id||null}
function ownedNftsForWallet(walletId){return state.ownedNfts.filter(item=>nftOwnerWalletId(item)===walletId)}
function ownsTicket(ticketId,walletId=null){return state.ownedNfts.some(item=>item.ticketId===ticketId&&(!walletId||nftOwnerWalletId(item)===walletId))}
function purchasedNftCount(){return state.ownedNfts.filter(item=>item.acquisitionType!=="airdrop").length}
function airdropTicket(){return tickets.find(item=>item.id===AIRDROP_TICKET_ID)}
function maybeGrantAirdrop(trigger="purchase_threshold",ownerWalletId=null){
  if(purchasedNftCount()<AIRDROP_PURCHASE_THRESHOLD||ownsTicket(AIRDROP_TICKET_ID))return null;
  const owner=walletById(ownerWalletId)||connectedWallet()||activeWallet();
  const grantedAt=now();
  const reward={tokenId:`MG-AIR-${Date.now().toString().slice(-8)}`,ticketId:AIRDROP_TICKET_ID,purchasedAt:grantedAt,acquisitionType:"airdrop",airdropTriggerCount:purchasedNftCount(),ownerWalletId:owner?.id||null,ownerAddress:owner?.address||null};
  state.ownedNfts.push(reward);
  log("nft_airdrop_received",{ticket_id:AIRDROP_TICKET_ID,token_id:reward.tokenId,purchased_nft_count:reward.airdropTriggerCount,wallet_id:owner?.id||null,trigger});
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
function showEthSuccess(title,detail,duration=4200,extraClass=""){
  const el=$("toast");el.className=`toast eth-success-toast${extraClass?` ${extraClass}`:""}`;
  el.style.setProperty("--success-toast-duration",`${duration}ms`);
  el.innerHTML=`<span class="eth-success-toast-icon">✓</span><div><strong>${escapeHtml(title)}</strong><small>${escapeHtml(detail)}</small></div>`;
  clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.add("hidden"),duration);
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
function showWalletCreationSuccess(wallet){
  showEthSuccess("ウォレットの作成が完了しました",`${wallet.name}の公開鍵・シードフレーズ・秘密鍵を生成しました`,WALLET_CREATION_NOTICE_MS,"wallet-creation-success-toast");
}
function error(message){state.validationErrors++;log("validation_error",{message});toast(message)}

function positionedGuideOpen(){return exchangeBalanceGuideOpen()||walletSecurityGuideOpen()||nftOwnershipGuideOpen()||signatureGuideOpen()||admissionResaleGuideOpen()}
function guideTargetGeometryKey(){
  const viewport=window.visualViewport;
  const values=[window.innerWidth,window.innerHeight,viewport?.width||0,viewport?.height||0,viewport?.offsetLeft||0,viewport?.offsetTop||0,viewport?.scale||1];
  const targets=[];
  if(exchangeBalanceGuideOpen()&&exchangeBalanceGuideTarget?.isConnected)targets.push(exchangeBalanceGuideTarget);
  if(walletSecurityGuideOpen())targets.push(...walletSecurityGuideTargets.filter(target=>target?.isConnected));
  if(nftOwnershipGuideOpen()&&nftOwnershipGuideTarget?.isConnected)targets.push(nftOwnershipGuideTarget);
  if(signatureGuideOpen()&&signatureGuideTarget?.isConnected)targets.push(signatureGuideTarget);
  if(admissionResaleGuideOpen()&&admissionResaleGuideTarget?.isConnected)targets.push(admissionResaleGuideTarget);
  targets.forEach(target=>{const rect=target.getBoundingClientRect();values.push(rect.left,rect.top,rect.right,rect.bottom)});
  return values.map(value=>Math.round(value*100)/100).join("|");
}
function refreshOpenGuidePositions(){
  if(exchangeBalanceGuideOpen())positionExchangeBalanceGuide();
  if(walletSecurityGuideOpen())positionWalletSecurityGuide();
  if(nftOwnershipGuideOpen())positionNftOwnershipGuide();
  if(signatureGuideOpen())positionSignatureGuide();
  if(admissionResaleGuideOpen())positionAdmissionResaleGuide();
}
function scheduleGuidePositionRefresh(passes=3){
  if(!positionedGuideOpen())return;
  guidePositionRefreshPasses=Math.max(guidePositionRefreshPasses,passes);
  if(guidePositionRefreshFrame!==null)return;
  const refresh=()=>{
    guidePositionRefreshFrame=null;
    if(!positionedGuideOpen()){guidePositionRefreshPasses=0;return}
    refreshOpenGuidePositions();
    guidePositionRefreshPasses--;
    if(guidePositionRefreshPasses>0)guidePositionRefreshFrame=requestAnimationFrame(refresh);
  };
  guidePositionRefreshFrame=requestAnimationFrame(refresh);
}
function startGuideGeometryMonitor(){
  suspendMobileMissionCompletionNotice();
  if(guideGeometryMonitorFrame!==null)return;
  guideGeometryKey="";
  const monitor=()=>{
    guideGeometryMonitorFrame=null;
    if(!positionedGuideOpen()){guideGeometryKey="";return}
    const nextKey=guideTargetGeometryKey();
    if(nextKey!==guideGeometryKey){guideGeometryKey=nextKey;scheduleGuidePositionRefresh(3)}
    guideGeometryMonitorFrame=requestAnimationFrame(monitor);
  };
  guideGeometryMonitorFrame=requestAnimationFrame(monitor);
}

function exchangeBalanceGuideOpen(){return !$("exchangeBalanceGuide").classList.contains("hidden")}
function startExchangeBalanceGuide(mode="account"){
  const isPurchaseGuide=mode==="purchase";
  const isWalletReceiptGuide=mode==="wallet-receipt";
  if((!isWalletReceiptGuide&&!state.accountCreated)||(!isPurchaseGuide&&!isWalletReceiptGuide&&state.accountBalanceGuideCompleted)||(isPurchaseGuide&&!state.ethPurchased)||(isWalletReceiptGuide&&(!state.receiptChecked||state.walletReceiptGuideCompleted))||exchangeBalanceGuideOpen())return;
  exchangeBalanceGuideMode=isWalletReceiptGuide?"wallet-receipt":isPurchaseGuide?"purchase":"account";
  const targetApp=isWalletReceiptGuide?"wallet":"exchange";
  if(state.currentApp!==targetApp)switchApp(targetApp);
  if(isWalletReceiptGuide){
    if(state.currentWalletTab!=="wallet-home"){state.currentWalletTab="wallet-home";renderWallet()}
  }else if(state.currentExchangeTab!=="exchange-home"){state.currentExchangeTab="exchange-home";renderExchange()}
  exchangeBalanceGuideTarget=document.querySelector(isWalletReceiptGuide?"#walletContent .wallet-balance":"#exchangeContent .exchange-balance");
  if(!exchangeBalanceGuideTarget)return;
  window.scrollTo({left:window.scrollX,top:window.scrollY,behavior:"auto"});
  exchangeBalanceGuideInitialScroll={x:window.scrollX,y:window.scrollY};
  document.documentElement.classList.add("exchange-balance-guide-open");
  document.body.classList.add("exchange-balance-guide-open");
  exchangeBalanceGuideTarget.classList.add("wallet-guide-highlight");
  $("exchangeBalanceGuide").classList.toggle("wallet-receipt-guide",isWalletReceiptGuide);
  $("exchangeBalanceGuideLabel").textContent=isWalletReceiptGuide?"GUIDE · 受取確認":isPurchaseGuide?"GUIDE · イーサリアム":"GUIDE · 取引所口座";
  $("exchangeBalanceGuideTitle").textContent=isWalletReceiptGuide?"ウォレットへの反映を確認しました":isPurchaseGuide?"イーサリアムを購入できました":"今回は10万円の疑似残高を用意しました";
  $("exchangeBalanceGuideDescription").textContent=isWalletReceiptGuide
    ?"暗号資産取引所からイーサリアムの送金が完了し、ウォレットへ反映されました。\n実際はウォレットに反映されるのに数分かかる場合があります。"
    :isPurchaseGuide?"暗号資産はビットコインが有名ですが、NFTの購入にはイーサリアムがよく使われます。\n暗号資産は株と同じように価格が変動しますので、ご注意ください。"
    :"本来は銀行口座を連携させて、日本円を取引所の口座に入金する必要があります。";
  $("exchangeBalanceGuideBackdrop").classList.remove("hidden");
  $("exchangeBalanceGuideBackdrop").setAttribute("aria-hidden","false");
  $("exchangeBalanceGuide").classList.remove("hidden");
  startGuideGeometryMonitor();scheduleGuidePositionRefresh(4);
  log("exchange_balance_guide_opened",{guide:exchangeBalanceGuideMode,yen_balance:state.exchangeYen,eth_balance:state.exchangeEth});
  requestAnimationFrame(()=>{
    if(!exchangeBalanceGuideOpen())return;
    for(let attempt=0;attempt<3;attempt++){
      positionExchangeBalanceGuide();
      if(!keepExchangeBalanceGuideTargetInView())break;
    }
    positionExchangeBalanceGuide();
    $("exchangeBalanceGuideClose").focus({preventScroll:true});
  });
}
function positionExchangeBalanceGuide(){
  if(!exchangeBalanceGuideOpen()||!exchangeBalanceGuideTarget?.isConnected)return;
  const targetRect=exchangeBalanceGuideTarget.getBoundingClientRect(),bubble=$("exchangeBalanceGuide");
  bubble.style.removeProperty("top");bubble.style.removeProperty("right");bubble.style.removeProperty("bottom");bubble.style.removeProperty("left");
  const viewportMargin=12,margin=16,bubbleWidth=bubble.offsetWidth,bubbleHeight=bubble.offsetHeight;
  const notice=$("toast"),noticeVisible=notice.classList.contains("eth-success-toast")&&!notice.classList.contains("hidden");
  const noticeBottom=noticeVisible?notice.getBoundingClientRect().bottom+12:viewportMargin;
  const minTop=Math.max(viewportMargin,noticeBottom),maxTop=Math.max(minTop,window.innerHeight-bubbleHeight-viewportMargin);
  if(window.matchMedia("(max-width: 760px)").matches){
    const canUseBelow=targetRect.bottom+margin+bubbleHeight<=window.innerHeight-viewportMargin;
    const canUseAbove=targetRect.top-margin-bubbleHeight>=minTop;
    let top;
    if(canUseBelow)top=targetRect.bottom+margin;
    else if(canUseAbove)top=targetRect.top-bubbleHeight-margin;
    else top=window.innerHeight-targetRect.bottom>=targetRect.top-minTop?targetRect.bottom+margin:targetRect.top-bubbleHeight-margin;
    bubble.style.top=`${Math.min(maxTop,Math.max(minTop,top))}px`;
    bubble.style.right=`max(12px,env(safe-area-inset-right))`;
    bubble.style.bottom="auto";
    bubble.style.left=`max(12px,env(safe-area-inset-left))`;
    return;
  }
  const canUseRight=targetRect.right+margin+bubbleWidth<=window.innerWidth-viewportMargin;
  const canUseLeft=targetRect.left-margin-bubbleWidth>=viewportMargin;
  let left,top;
  if(canUseRight||canUseLeft){
    left=canUseRight?targetRect.right+margin:targetRect.left-bubbleWidth-margin;
    top=targetRect.top+(targetRect.height-bubbleHeight)/2;
  }else{
    left=Math.min(window.innerWidth-bubbleWidth-viewportMargin,Math.max(viewportMargin,targetRect.left+(targetRect.width-bubbleWidth)/2));
    top=targetRect.bottom+margin+bubbleHeight<=window.innerHeight-viewportMargin?targetRect.bottom+margin:targetRect.top-bubbleHeight-margin;
  }
  bubble.style.left=`${left}px`;bubble.style.top=`${Math.min(maxTop,Math.max(minTop,top))}px`;
}
function keepExchangeBalanceGuideTargetInView(){
  if(!exchangeBalanceGuideOpen()||!exchangeBalanceGuideTarget?.isConnected)return false;
  const targetRect=exchangeBalanceGuideTarget.getBoundingClientRect(),bubbleRect=$("exchangeBalanceGuide").getBoundingClientRect();
  const viewportTop=12,viewportBottom=window.innerHeight-12;
  let delta=0;
  if(targetRect.height>viewportBottom-viewportTop)delta=targetRect.top-viewportTop;
  else if(targetRect.top<viewportTop)delta=targetRect.top-viewportTop;
  else if(targetRect.bottom>viewportBottom)delta=targetRect.bottom-viewportBottom;
  if(Math.abs(delta)>=1){window.scrollBy({top:delta,behavior:"auto"});return true}
  const overlaps=targetRect.right>bubbleRect.left&&targetRect.left<bubbleRect.right&&targetRect.bottom>bubbleRect.top&&targetRect.top<bubbleRect.bottom;
  if(!overlaps)return false;
  const margin=14;
  delta=(bubbleRect.top+bubbleRect.bottom)/2<(targetRect.top+targetRect.bottom)/2
    ?targetRect.top-(bubbleRect.bottom+margin)
    :targetRect.bottom-(bubbleRect.top-margin);
  if(Math.abs(delta)<1)return false;
  window.scrollBy({top:delta,behavior:"auto"});return true;
}
function closeExchangeBalanceGuide(){
  if(!exchangeBalanceGuideOpen())return;
  exchangeBalanceGuideTarget?.classList.remove("wallet-guide-highlight");exchangeBalanceGuideTarget=null;
  $("exchangeBalanceGuideBackdrop").classList.add("hidden");$("exchangeBalanceGuideBackdrop").setAttribute("aria-hidden","true");
  $("exchangeBalanceGuide").classList.add("hidden");document.body.classList.remove("exchange-balance-guide-open");
  document.documentElement.classList.remove("exchange-balance-guide-open");
  window.scrollTo({left:exchangeBalanceGuideInitialScroll.x,top:exchangeBalanceGuideInitialScroll.y,behavior:"auto"});
  if(exchangeBalanceGuideMode==="account")state.accountBalanceGuideCompleted=true;
  if(exchangeBalanceGuideMode==="wallet-receipt")state.walletReceiptGuideCompleted=true;
  log("exchange_balance_guide_completed",{guide:exchangeBalanceGuideMode});
  (exchangeBalanceGuideMode==="wallet-receipt"?$("walletPrimary"):$("accountButton"))?.focus({preventScroll:true});
  $("exchangeBalanceGuide").classList.remove("wallet-receipt-guide");
  if(state.wallets.length&&!state.walletSecurityGuideCompleted)requestAnimationFrame(startWalletSecurityGuide);
  scheduleMissionCompletionNoticeResume();
}

function configureProgressGuide(mode){
  const completion=mode==="completion",bubble=$("progressGuideBubble");
  bubble.classList.toggle("progress-guide-completion",completion);
  $("progressGuideLabel").textContent=completion?"COMPLETE":"GUIDE";
  $("progressGuideTitle").textContent=completion?"すべての進捗を達成しました":"進捗フローを確認";
  $("progressGuideDescription").textContent=completion?"ここまで体験していただき、ありがとうございました。":"進捗フローを参考にNFTチケットを獲得してください。";
  $("progressGuideNote").textContent=completion?"「条件に応じて特典を付与する仕組み」を再現するため、各NFTチケットにゲームを用意しています。よろしければ、ゲームを楽しみながらNFTチケットを集めてみてください。":"※進捗フローの1から順番に進めなくてもチケットを獲得できるので、自由に体験してみてください。";
  $("progressGuideScrollNote").classList.toggle("hidden",completion);
  $("progressGuideHintNote").innerHTML=completion?'<span aria-hidden="true">✓</span>最後に、アンケートへのご回答をお願いいたします。':'<span aria-hidden="true">?</span>操作に困ったら、各進捗の「？」をタップすると操作のヒントを見ることができます。';
  $("progressGuideStart").innerHTML=completion?'閉じる <span aria-hidden="true">✓</span>':'閉じる <span aria-hidden="true">→</span>';
}

function showProgressGuide(mode="intro"){
  if(progressGuideOpen())return;
  progressGuideMode=mode;configureProgressGuide(mode);
  $("progressGuideBackdrop").classList.remove("hidden");
  $("progressGuideBackdrop").setAttribute("aria-hidden","false");
  $("progressGuideBubble").classList.remove("hidden");
  $("progressGuideBubble").setAttribute("aria-hidden","false");
  document.body.classList.add("progress-guide-open");
  document.body.classList.toggle("progress-guide-completion-open",mode==="completion");
  suspendMobileMissionCompletionNotice();
  log(mode==="completion"?"completion_progress_guide_opened":"progress_guide_opened");
  requestAnimationFrame(()=>$("progressGuideStart").focus({preventScroll:true}));
}

function closeProgressGuide(){
  if(!progressGuideOpen())return;
  const completion=progressGuideMode==="completion";
  $("progressGuideBackdrop").classList.add("hidden");
  $("progressGuideBackdrop").setAttribute("aria-hidden","true");
  $("progressGuideBubble").classList.add("hidden");
  $("progressGuideBubble").setAttribute("aria-hidden","true");
  document.body.classList.remove("progress-guide-open");
  document.body.classList.remove("progress-guide-completion-open");
  if(completion)state.completionProgressGuideCompleted=true;
  log(completion?"completion_progress_guide_closed":"progress_guide_completed");
  document.querySelector(`.switcher-item[data-app="${state.currentApp}"]`)?.focus();
  scheduleMissionCompletionNoticeResume();
}

function showCompletionProgressGuide(){
  completionProgressGuideTimer=null;
  if(progress()!==100||state.completionProgressGuideCompleted||progressGuideOpen())return;
  if(positionedGuideOpen()||!$("admissionPass").classList.contains("hidden"))return;
  document.querySelector(".mission-panel")?.scrollTo({top:0,behavior:"auto"});
  window.scrollTo({top:0,behavior:"auto"});
  showProgressGuide("completion");
}

function scheduleCompletionProgressGuide(delay=450){
  clearTimeout(completionProgressGuideTimer);
  completionProgressGuideTimer=setTimeout(showCompletionProgressGuide,delay);
}

function progressGuideOpen(){return !$("progressGuideBubble").classList.contains("hidden")}
function walletSecurityGuideOpen(){return !$("walletSecurityGuide").classList.contains("hidden")}
function nftOwnershipGuideOpen(){return !$("nftOwnershipGuide").classList.contains("hidden")}
function signatureGuideOpen(){return !$("signatureGuide").classList.contains("hidden")}
function admissionResaleGuideOpen(){return !$("admissionResaleGuide").classList.contains("hidden")}
function recordMobileGuideTouchStart(event){
  if(window.matchMedia("(max-width: 760px)").matches&&(progressGuideOpen()||walletSecurityGuideOpen()||nftOwnershipGuideOpen()||exchangeBalanceGuideOpen()||signatureGuideOpen()||admissionResaleGuideOpen()))mobileGuideTouchY=event.touches[0]?.clientY??null;
}
function preventMobileGuideViewportScroll(event){
  if(!window.matchMedia("(max-width: 760px)").matches||(!progressGuideOpen()&&!walletSecurityGuideOpen()&&!nftOwnershipGuideOpen()&&!exchangeBalanceGuideOpen()&&!signatureGuideOpen()&&!admissionResaleGuideOpen()))return;
  const element=event.target?.nodeType===Node.ELEMENT_NODE?event.target:event.target?.parentElement;
  if(progressGuideOpen()&&element?.closest("#missionList"))return;
  const activeGuideSelector=progressGuideOpen()?"#progressGuideBubble":walletSecurityGuideOpen()?"#walletSecurityGuide":nftOwnershipGuideOpen()?"#nftOwnershipGuide":exchangeBalanceGuideOpen()?"#exchangeBalanceGuide":signatureGuideOpen()?"#signatureGuide":"#admissionResaleGuide";
  const scrollableBubble=nftOwnershipGuideOpen()&&element?.closest("#nftOwnershipGuideBody")||admissionResaleGuideOpen()&&element?.closest(".admission-resale-guide-content")||element?.closest(activeGuideSelector);
  if(scrollableBubble&&scrollableBubble.scrollHeight>scrollableBubble.clientHeight){
    const maxScrollTop=scrollableBubble.scrollHeight-scrollableBubble.clientHeight;
    if(event.type==="wheel"){
      if((event.deltaY<0&&scrollableBubble.scrollTop>0)||(event.deltaY>0&&scrollableBubble.scrollTop<maxScrollTop-1))return;
    }else{
      const currentY=event.touches[0]?.clientY??mobileGuideTouchY,deltaY=currentY-mobileGuideTouchY;
      mobileGuideTouchY=currentY;
      if((deltaY>0&&scrollableBubble.scrollTop>0)||(deltaY<0&&scrollableBubble.scrollTop<maxScrollTop-1))return;
    }
  }
  event.preventDefault();
}
function startWalletSecurityGuide(){
  if(!state.wallets.length||state.walletSecurityGuideCompleted)return;
  if(state.currentApp!=="wallet")switchApp("wallet");
  state.currentWalletTab="wallet-home";renderWallet();
  document.documentElement.classList.add("wallet-security-guide-open");
  window.scrollTo({left:window.scrollX,top:window.scrollY,behavior:"auto"});
  walletSecurityGuideInitialScroll={x:window.scrollX,y:window.scrollY};
  walletSecurityGuideStep=0;
  $("walletSecurityGuideBackdrop").classList.remove("hidden");
  $("walletSecurityGuideBackdrop").setAttribute("aria-hidden","false");
  $("walletSecurityGuide").classList.remove("hidden");
  document.body.classList.add("wallet-security-guide-open");
  startGuideGeometryMonitor();scheduleGuidePositionRefresh(4);
  log("wallet_security_guide_started",{wallet_id:activeWallet()?.id||null});
  renderWalletSecurityGuideStep();
}
function renderWalletSecurityGuideStep(){
  const step=WALLET_SECURITY_GUIDE_STEPS[walletSecurityGuideStep];if(!step)return;
  $("walletSecurityGuide").classList.toggle("wallet-overview-guide",walletSecurityGuideStep===0);
  walletSecurityGuideTargets.forEach(target=>target.classList.remove("wallet-guide-highlight"));walletSecurityGuideTargets=[];walletSecurityGuideTarget=null;
  if(state.currentWalletTab!==step.tab){state.currentWalletTab=step.tab;renderWallet()}
  setSeedPhraseVisibility(step.reveal==="seed");
  setPrivateKeyVisibility(step.reveal==="private");
  const selectors=step.targets||[step.target];
  walletSecurityGuideTargets=selectors.map(selector=>document.querySelector(`#walletContent ${selector}`)).filter(Boolean);
  walletSecurityGuideTarget=walletSecurityGuideTargets[0]||null;
  if(!walletSecurityGuideTargets.length){closeWalletSecurityGuide();return}
  walletSecurityGuideTargets.forEach(target=>target.classList.add("wallet-guide-highlight"));
  $("walletSecurityGuideLabel").textContent=step.label;
  $("walletSecurityGuideTitle").textContent=step.title;
  $("walletSecurityGuideDescription").textContent=step.description;
  $("walletSecurityGuideNext").innerHTML=`${step.action}<span aria-hidden="true">${walletSecurityGuideStep===WALLET_SECURITY_GUIDE_STEPS.length-1?"✓":"→"}</span>`;
  $("walletSecurityGuideNext").setAttribute("aria-label",step.action);
  log("wallet_security_guide_step_viewed",{step:walletSecurityGuideStep+1,target:selectors.join(",")});
  requestAnimationFrame(()=>{
    if(!walletSecurityGuideOpen())return;
    for(let attempt=0;attempt<3;attempt++){
      positionWalletSecurityGuide();
      if(!keepWalletSecurityGuideTargetInView())break;
    }
    positionWalletSecurityGuide();
    $("walletSecurityGuideNext").focus({preventScroll:true});
  });
}
function walletSecurityGuideTargetRect(){
  const rects=walletSecurityGuideTargets.filter(target=>target.isConnected).map(target=>target.getBoundingClientRect());
  if(!rects.length)return null;
  const left=Math.min(...rects.map(rect=>rect.left)),top=Math.min(...rects.map(rect=>rect.top));
  const right=Math.max(...rects.map(rect=>rect.right)),bottom=Math.max(...rects.map(rect=>rect.bottom));
  return {left,top,right,bottom,width:right-left,height:bottom-top};
}
function positionWalletSecurityGuide(){
  const targetRect=walletSecurityGuideTargetRect();if(!walletSecurityGuideOpen()||!targetRect)return;
  const bubble=$("walletSecurityGuide");
  bubble.style.removeProperty("top");bubble.style.removeProperty("right");bubble.style.removeProperty("bottom");bubble.style.removeProperty("left");
  if(window.matchMedia("(max-width: 760px)").matches){
    const viewportMargin=12,margin=14,bubbleHeight=bubble.offsetHeight;
    const creationNotice=$("toast"),creationNoticeVisible=creationNotice.classList.contains("wallet-creation-success-toast")&&!creationNotice.classList.contains("hidden");
    const noticeBottom=creationNoticeVisible?creationNotice.offsetTop+creationNotice.offsetHeight+12:viewportMargin;
    const minTop=Math.max(viewportMargin,noticeBottom),maxTop=Math.max(minTop,window.innerHeight-bubbleHeight-viewportMargin);
    const canUseBelow=targetRect.bottom+margin+bubbleHeight<=window.innerHeight-viewportMargin;
    const canUseAbove=targetRect.top-margin-bubbleHeight>=viewportMargin;
    let top;
    if(canUseBelow)top=targetRect.bottom+margin;
    else if(canUseAbove)top=targetRect.top-bubbleHeight-margin;
    else{
      const spaceBelow=window.innerHeight-targetRect.bottom,spaceAbove=targetRect.top;
      top=spaceBelow>=spaceAbove?targetRect.bottom+margin:targetRect.top-bubbleHeight-margin;
    }
    bubble.style.top=`${Math.min(maxTop,Math.max(minTop,top))}px`;bubble.style.bottom="auto";
    return;
  }
  const margin=16,bubbleWidth=Math.min(380,window.innerWidth-32),bubbleHeight=bubble.offsetHeight;
  const creationNotice=$("toast"),creationNoticeVisible=creationNotice.classList.contains("wallet-creation-success-toast")&&!creationNotice.classList.contains("hidden");
  const minTop=creationNoticeVisible?creationNotice.offsetTop+creationNotice.offsetHeight+12:16,maxTop=Math.max(minTop,window.innerHeight-bubbleHeight-16);
  const canUseRight=targetRect.right+margin+bubbleWidth<=window.innerWidth-16;
  const canUseLeft=targetRect.left-margin-bubbleWidth>=16;
  let left,top;
  if(canUseRight||canUseLeft){
    left=canUseRight?targetRect.right+margin:targetRect.left-bubbleWidth-margin;
    top=Math.min(maxTop,Math.max(minTop,targetRect.top+(targetRect.height-bubbleHeight)/2));
  }else{
    left=Math.min(window.innerWidth-bubbleWidth-16,Math.max(16,targetRect.left+(targetRect.width-bubbleWidth)/2));
    const canUseBelow=targetRect.bottom+margin+bubbleHeight<=window.innerHeight-16;
    top=canUseBelow?targetRect.bottom+margin:targetRect.top-bubbleHeight-margin;
    top=Math.min(maxTop,Math.max(minTop,top));
  }
  bubble.style.left=`${left}px`;bubble.style.top=`${top}px`;
}
function keepWalletSecurityGuideTargetInView(){
  const targetRect=walletSecurityGuideTargetRect();if(!walletSecurityGuideOpen()||!targetRect)return false;
  const bubbleRect=$("walletSecurityGuide").getBoundingClientRect();
  const viewportTop=12,viewportBottom=window.innerHeight-12;
  let delta=0;
  if(targetRect.height>viewportBottom-viewportTop)delta=targetRect.top-viewportTop;
  else if(targetRect.top<viewportTop)delta=targetRect.top-viewportTop;
  else if(targetRect.bottom>viewportBottom)delta=targetRect.bottom-viewportBottom;
  if(Math.abs(delta)>=1){window.scrollBy({top:delta,behavior:"auto"});return true}
  const horizontallyOverlapping=targetRect.right>bubbleRect.left&&targetRect.left<bubbleRect.right;
  const verticallyOverlapping=targetRect.bottom>bubbleRect.top&&targetRect.top<bubbleRect.bottom;
  if(!horizontallyOverlapping||!verticallyOverlapping)return false;
  const margin=14;
  if((bubbleRect.top+bubbleRect.bottom)/2<(targetRect.top+targetRect.bottom)/2){
    delta=targetRect.top-(bubbleRect.bottom+margin);
  }else{
    delta=targetRect.bottom-(bubbleRect.top-margin);
  }
  if(Math.abs(delta)<1)return false;
  window.scrollBy({top:delta,behavior:"auto"});return true;
}
function advanceWalletSecurityGuide(){
  if(!walletSecurityGuideOpen())return;
  if(walletSecurityGuideStep>=WALLET_SECURITY_GUIDE_STEPS.length-1){closeWalletSecurityGuide();return}
  if(walletSecurityGuideStep===0){
    const creationNotice=$("toast");
    if(creationNotice.classList.contains("wallet-creation-success-toast")){clearTimeout(toast.t);creationNotice.classList.add("hidden")}
  }
  walletSecurityGuideStep++;renderWalletSecurityGuideStep();
}
function closeWalletSecurityGuide(){
  setSeedPhraseVisibility(false);setPrivateKeyVisibility(false);
  walletSecurityGuideTargets.forEach(target=>target.classList.remove("wallet-guide-highlight"));walletSecurityGuideTargets=[];walletSecurityGuideTarget=null;
  $("walletSecurityGuideBackdrop").classList.add("hidden");$("walletSecurityGuideBackdrop").setAttribute("aria-hidden","true");
  $("walletSecurityGuide").classList.add("hidden");$("walletSecurityGuide").classList.remove("wallet-overview-guide");document.body.classList.remove("wallet-security-guide-open");
  window.scrollTo({left:walletSecurityGuideInitialScroll.x,top:walletSecurityGuideInitialScroll.y,behavior:"auto"});
  document.documentElement.classList.remove("wallet-security-guide-open");
  state.walletSecurityGuideCompleted=true;log("wallet_security_guide_completed",{wallet_id:activeWallet()?.id||null});
  $("copyAddress")?.focus({preventScroll:true});
  scheduleMissionCompletionNoticeResume();
}

function firstPurchasedNftEntry(){
  let index=state.ownedNfts.findIndex(item=>item.tokenId===state.firstPurchasedNftTokenId&&item.acquisitionType!=="airdrop");
  if(index<0){
    index=state.ownedNfts.findIndex(item=>item.acquisitionType!=="airdrop");
    state.firstPurchasedNftTokenId=index>=0?state.ownedNfts[index].tokenId:null;
  }
  return index<0?null:{owned:state.ownedNfts[index],index};
}
function airdroppedNftEntry(){
  const index=state.ownedNfts.findIndex(item=>item.acquisitionType==="airdrop"&&item.ticketId===AIRDROP_TICKET_ID);
  return index<0?null:{owned:state.ownedNfts[index],index};
}
function maybeStartAirdropGuide(){
  if(nftOwnershipGuideScheduled||nftOwnershipGuideOpen()||state.airdropGuideCompleted||state.currentApp!=="wallet"||state.currentWalletTab!=="wallet-nft")return false;
  const entry=airdroppedNftEntry(),wallet=activeWallet();
  if(!entry||!wallet||nftOwnerWalletId(entry.owned)!==wallet.id)return false;
  nftOwnershipGuideScheduled=true;
  requestAnimationFrame(()=>{nftOwnershipGuideScheduled=false;startAirdropGuide()});
  return true;
}
function startAirdropGuide(){
  if(state.airdropGuideCompleted||state.currentApp!=="wallet"||state.currentWalletTab!=="wallet-nft"||exchangeBalanceGuideOpen()||walletSecurityGuideOpen()||nftOwnershipGuideOpen()||signatureGuideOpen())return;
  const entry=airdroppedNftEntry(),wallet=activeWallet();
  if(!entry||!wallet||nftOwnerWalletId(entry.owned)!==wallet.id)return;
  const ticketInfo=tickets.find(item=>item.id===entry.owned.ticketId);
  nftOwnershipGuideTarget=document.querySelector(`#walletContent [data-owned-index="${entry.index}"]`);
  if(!nftOwnershipGuideTarget)return;
  nftOwnershipGuideMode="airdrop";nftOwnershipGuideStep=0;
  nftOwnershipGuideTarget.classList.add("wallet-guide-highlight","nft-purchase-guide-highlight","nft-airdrop-guide-highlight");
  document.documentElement.classList.add("nft-ownership-guide-open");document.body.classList.add("nft-ownership-guide-open","nft-airdrop-guide-open");
  $("nftOwnershipGuideBackdrop").classList.remove("hidden");$("nftOwnershipGuideBackdrop").setAttribute("aria-hidden","false");
  $("nftOwnershipGuide").classList.remove("hidden","nft-ownership-guide-detail");$("nftOwnershipGuide").classList.add("nft-airdrop-guide");
  $("nftOwnershipGuideLabel").textContent="GUIDE · AIRDROP";
  $("nftOwnershipGuideTitle").textContent="条件達成の特典としてNFTが届きました";
  $("nftOwnershipGuideTicket").textContent=ticketInfo?.title||"エアドロップされたNFT";
  $("nftOwnershipGuideToken").textContent=`トークンID ${entry.owned.tokenId}`;
  $("nftOwnershipGuideBody").innerHTML="<p>NFTでは、特定の条件を満たしたユーザーに対して、運営者がNFTを無料で配布することがあります。この配布方法を「エアドロップ」と呼びます。</p><p>今回は、NFTチケットを合計3枚購入した特典として、限定NFTがこのウォレットに自動で配布されました。</p>";
  $("nftOwnershipGuideNext").innerHTML='閉じる <span aria-hidden="true">✓</span>';$("nftOwnershipGuideNext").setAttribute("aria-label","閉じる");
  startGuideGeometryMonitor();scheduleGuidePositionRefresh(4);
  log("airdrop_guide_started",{wallet_id:wallet.id,token_id:entry.owned.tokenId,ticket_id:entry.owned.ticketId});
  requestAnimationFrame(()=>{
    if(!nftOwnershipGuideOpen()||nftOwnershipGuideMode!=="airdrop")return;
    for(let attempt=0;attempt<3;attempt++){
      positionNftOwnershipGuide();
      if(!keepNftOwnershipGuideTargetInView())break;
    }
    positionNftOwnershipGuide();$("nftOwnershipGuideBody").scrollTop=0;$("nftOwnershipGuideNext").focus({preventScroll:true});
  });
}
function maybeStartNftOwnershipGuide(){
  if(nftOwnershipGuideScheduled||nftOwnershipGuideOpen()||state.nftOwnershipGuideCompleted||state.currentApp!=="wallet"||state.currentWalletTab!=="wallet-nft")return;
  const entry=firstPurchasedNftEntry(),wallet=activeWallet();
  if(!entry||!wallet||nftOwnerWalletId(entry.owned)!==wallet.id)return;
  nftOwnershipGuideScheduled=true;
  requestAnimationFrame(()=>{nftOwnershipGuideScheduled=false;startNftOwnershipGuide()});
}
function startNftOwnershipGuide(){
  if(state.nftOwnershipGuideCompleted||state.currentApp!=="wallet"||state.currentWalletTab!=="wallet-nft"||exchangeBalanceGuideOpen()||walletSecurityGuideOpen()||signatureGuideOpen())return;
  const entry=firstPurchasedNftEntry(),wallet=activeWallet();
  if(!entry||!wallet||nftOwnerWalletId(entry.owned)!==wallet.id)return;
  nftOwnershipGuideTarget=document.querySelector(`#walletContent [data-owned-index="${entry.index}"]`);
  if(!nftOwnershipGuideTarget)return;
  nftOwnershipGuideMode="purchase";
  $("nftOwnershipGuide").classList.remove("nft-airdrop-guide");
  nftOwnershipGuideTarget.classList.add("wallet-guide-highlight","nft-purchase-guide-highlight");
  nftOwnershipGuideStep=0;
  document.documentElement.classList.add("nft-ownership-guide-open");document.body.classList.add("nft-ownership-guide-open");
  $("nftOwnershipGuideBackdrop").classList.remove("hidden");$("nftOwnershipGuideBackdrop").setAttribute("aria-hidden","false");
  $("nftOwnershipGuide").classList.remove("hidden");
  startGuideGeometryMonitor();scheduleGuidePositionRefresh(4);
  log("nft_ownership_guide_started",{wallet_id:wallet.id,token_id:entry.owned.tokenId,ticket_id:entry.owned.ticketId});
  renderNftOwnershipGuideStep();
}
function renderNftOwnershipGuideStep(){
  const isOverview=nftOwnershipGuideStep>0;
  const step=NFT_OWNERSHIP_GUIDE_STEPS[0],entry=firstPurchasedNftEntry();
  if(!step||!entry||(!isOverview&&!nftOwnershipGuideTarget?.isConnected)){closeNftOwnershipGuide(false);return}
  const ticketInfo=tickets.find(item=>item.id===entry.owned.ticketId);
  $("nftOwnershipGuide").classList.toggle("nft-ownership-guide-detail",isOverview);
  if(isOverview)nftOwnershipGuideTarget?.classList.remove("wallet-guide-highlight","nft-purchase-guide-highlight");
  else nftOwnershipGuideTarget?.classList.add("wallet-guide-highlight","nft-purchase-guide-highlight");
  $("nftOwnershipGuideLabel").textContent=isOverview?`NFT GUIDE · ${NFT_OWNERSHIP_GUIDE_STEPS.length-1}つのポイント`:step.label;
  $("nftOwnershipGuideTitle").textContent=isOverview?"NFTの特徴と注意点":step.title;
  $("nftOwnershipGuideTicket").textContent=ticketInfo?.title||"購入したNFT";$("nftOwnershipGuideToken").textContent=`トークンID ${entry.owned.tokenId}`;
  $("nftOwnershipGuideBody").innerHTML=isOverview?NFT_OWNERSHIP_GUIDE_STEPS.slice(1).map(item=>`<section class="nft-ownership-guide-section"><span class="nft-ownership-guide-section-label">${item.label}</span><h3>${item.title}</h3>${item.body}</section>`).join(""):step.body;
  const action=isOverview?"閉じる":step.action;
  $("nftOwnershipGuideNext").innerHTML=`${action}<span aria-hidden="true">${isOverview?"✓":"→"}</span>`;
  $("nftOwnershipGuideNext").setAttribute("aria-label",action);
  log("nft_ownership_guide_step_viewed",{step:isOverview?2:1,sections:isOverview?NFT_OWNERSHIP_GUIDE_STEPS.length-1:1,token_id:entry.owned.tokenId});
  requestAnimationFrame(()=>{
    if(!nftOwnershipGuideOpen())return;
    if(!isOverview){
      for(let attempt=0;attempt<3;attempt++){
        positionNftOwnershipGuide();
        if(!keepNftOwnershipGuideTargetInView())break;
      }
    }
    positionNftOwnershipGuide();
    $("nftOwnershipGuideBody").scrollTop=0;
    $("nftOwnershipGuideNext").focus({preventScroll:true});
  });
}
function positionNftOwnershipGuide(){
  if(!nftOwnershipGuideOpen())return;
  const bubble=$("nftOwnershipGuide");
  bubble.style.removeProperty("top");bubble.style.removeProperty("right");bubble.style.removeProperty("bottom");bubble.style.removeProperty("left");
  if(nftOwnershipGuideStep>0)return;
  if(!nftOwnershipGuideTarget?.isConnected)return;
  const targetRect=nftOwnershipGuideTarget.getBoundingClientRect();
  if(window.matchMedia("(max-width: 760px)").matches){
    const viewportMargin=10,gap=12,bubbleHeight=bubble.offsetHeight,maxTop=Math.max(viewportMargin,window.innerHeight-bubbleHeight-viewportMargin);
    const canUseBelow=targetRect.bottom+gap+bubbleHeight<=window.innerHeight-viewportMargin;
    const canUseAbove=targetRect.top-gap-bubbleHeight>=viewportMargin;
    let top;
    if(canUseBelow)top=targetRect.bottom+gap;
    else if(canUseAbove)top=targetRect.top-bubbleHeight-gap;
    else top=window.innerHeight-targetRect.bottom>=targetRect.top?targetRect.bottom+gap:targetRect.top-bubbleHeight-gap;
    bubble.style.top=`${Math.min(maxTop,Math.max(viewportMargin,top))}px`;bubble.style.bottom="auto";
    return;
  }
  const viewportMargin=16,gap=18,bubbleWidth=bubble.offsetWidth,bubbleHeight=bubble.offsetHeight,maxTop=Math.max(viewportMargin,window.innerHeight-bubbleHeight-viewportMargin);
  const canUseRight=targetRect.right+gap+bubbleWidth<=window.innerWidth-viewportMargin;
  const canUseLeft=targetRect.left-gap-bubbleWidth>=viewportMargin;
  let left,top;
  if(canUseRight||canUseLeft){
    left=canUseRight?targetRect.right+gap:targetRect.left-bubbleWidth-gap;
    top=Math.min(maxTop,Math.max(viewportMargin,targetRect.top+(targetRect.height-bubbleHeight)/2));
  }else{
    left=Math.min(window.innerWidth-bubbleWidth-viewportMargin,Math.max(viewportMargin,targetRect.left+(targetRect.width-bubbleWidth)/2));
    const canUseBelow=targetRect.bottom+gap+bubbleHeight<=window.innerHeight-viewportMargin;
    top=canUseBelow?targetRect.bottom+gap:targetRect.top-bubbleHeight-gap;
    top=Math.min(maxTop,Math.max(viewportMargin,top));
  }
  bubble.style.left=`${left}px`;bubble.style.top=`${top}px`;
}
function keepNftOwnershipGuideTargetInView(){
  if(!nftOwnershipGuideOpen()||nftOwnershipGuideStep>0||!nftOwnershipGuideTarget?.isConnected)return false;
  const targetRect=nftOwnershipGuideTarget.getBoundingClientRect(),bubbleRect=$("nftOwnershipGuide").getBoundingClientRect();
  const mobile=window.matchMedia("(max-width: 760px)").matches;
  const viewportTop=mobile?18:24,viewportBottom=window.innerHeight-(mobile?22:28);
  let delta=0;
  if(nftOwnershipGuideMode==="airdrop"){
    const groupTop=Math.min(targetRect.top,bubbleRect.top),groupBottom=Math.max(targetRect.bottom,bubbleRect.bottom);
    const groupHeight=groupBottom-groupTop,availableHeight=viewportBottom-viewportTop;
    if(groupHeight<=availableHeight){
      delta=(groupTop+groupBottom)/2-(viewportTop+viewportBottom)/2;
      if(Math.abs(delta)>=1){
        const previousScrollY=window.scrollY;window.scrollBy({top:delta,behavior:"auto"});
        if(Math.abs(window.scrollY-previousScrollY)>=1)return true;
      }
    }
  }
  if(targetRect.height>viewportBottom-viewportTop)delta=targetRect.top-viewportTop;
  else if(targetRect.top<viewportTop)delta=targetRect.top-viewportTop;
  else if(targetRect.bottom>viewportBottom)delta=targetRect.bottom-viewportBottom;
  if(Math.abs(delta)>=1){
    const previousScrollY=window.scrollY;window.scrollBy({top:delta,behavior:"auto"});
    if(Math.abs(window.scrollY-previousScrollY)>=1)return true;
  }
  const overlaps=targetRect.right>bubbleRect.left&&targetRect.left<bubbleRect.right&&targetRect.bottom>bubbleRect.top&&targetRect.top<bubbleRect.bottom;
  if(!overlaps)return false;
  const gap=12;
  delta=(bubbleRect.top+bubbleRect.bottom)/2<(targetRect.top+targetRect.bottom)/2?targetRect.top-(bubbleRect.bottom+gap):targetRect.bottom-(bubbleRect.top-gap);
  if(Math.abs(delta)<1)return false;
  const previousScrollY=window.scrollY;window.scrollBy({top:delta,behavior:"auto"});
  return Math.abs(window.scrollY-previousScrollY)>=1;
}
function advanceNftOwnershipGuide(){
  if(!nftOwnershipGuideOpen())return;
  if(nftOwnershipGuideMode==="airdrop"){closeNftOwnershipGuide();return}
  if(nftOwnershipGuideStep>0){closeNftOwnershipGuide();return}
  nftOwnershipGuideStep=1;renderNftOwnershipGuideStep();
}
function closeNftOwnershipGuide(focusTarget=true){
  if(!nftOwnershipGuideOpen())return;
  const target=nftOwnershipGuideTarget,closedMode=nftOwnershipGuideMode;
  target?.classList.remove("wallet-guide-highlight","nft-purchase-guide-highlight","nft-airdrop-guide-highlight");
  $("nftOwnershipGuideBackdrop").classList.add("hidden");$("nftOwnershipGuideBackdrop").setAttribute("aria-hidden","true");
  $("nftOwnershipGuide").classList.add("hidden");$("nftOwnershipGuide").classList.remove("nft-ownership-guide-detail","nft-airdrop-guide");
  document.documentElement.classList.remove("nft-ownership-guide-open");document.body.classList.remove("nft-ownership-guide-open","nft-airdrop-guide-open");
  if(closedMode==="airdrop"){
    const entry=airdroppedNftEntry();state.airdropGuideCompleted=true;
    log("airdrop_guide_completed",{token_id:entry?.owned.tokenId||null,wallet_id:entry?nftOwnerWalletId(entry.owned):null});
  }else{
    state.nftOwnershipGuideCompleted=true;
    log("nft_ownership_guide_completed",{step:nftOwnershipGuideStep+1,token_id:state.firstPurchasedNftTokenId});
  }
  nftOwnershipGuideTarget=null;nftOwnershipGuideMode="purchase";
  if(focusTarget)requestAnimationFrame(()=>target?.focus({preventScroll:true}));
  if(closedMode==="airdrop")requestAnimationFrame(maybeStartNftOwnershipGuide);
  scheduleMissionCompletionNoticeResume();
}

function openTransactionExplanationGuide({mode,walletId,targetSelector,label,title,subjectLabel,subjectValue,description,warningPrefix,riskWarning,warningSuffix}){
  signatureGuideTarget?.classList.remove("transaction-guide-highlight");
  signatureGuideTarget=document.querySelector(targetSelector);
  if(!signatureGuideTarget)return;
  signatureGuideTarget.classList.add("transaction-guide-highlight");
  signatureGuideMode=mode;signatureGuideWalletId=walletId;
  $("signatureGuideLabel").textContent=label;$("signatureGuideTitle").textContent=title;
  $("signatureGuideSubjectLabel").textContent=subjectLabel;$("signatureGuideWalletName").textContent=subjectValue;
  $("signatureGuideDescription").textContent=description;$("signatureGuideWarningPrefix").textContent=warningPrefix;
  $("signatureGuideRiskWarning").textContent=riskWarning;$("signatureGuideWarningSuffix").textContent=warningSuffix;
  document.documentElement.classList.add("signature-guide-open");document.body.classList.add("signature-guide-open");
  $("signatureGuideOverlay").classList.remove("hidden");$("signatureGuideOverlay").setAttribute("aria-hidden","false");
  $("signatureGuide").classList.remove("hidden");
  startGuideGeometryMonitor();scheduleGuidePositionRefresh(4);
  log("transaction_explanation_guide_opened",{guide:mode,wallet_id:walletId});
  requestAnimationFrame(()=>{
    if(!signatureGuideOpen())return;
    positionSignatureGuide();
    $("signatureGuideClose").focus({preventScroll:true});
  });
}
function startSignatureGuide(walletId){
  const wallet=walletById(walletId);if(!wallet)return;
  openTransactionExplanationGuide({
    mode:"signature",walletId:wallet.id,targetSelector:"#modalBody .connection-signature-card",label:"GUIDE · 署名",title:"NFTで使われる「署名」とは？",
    subjectLabel:"今回署名するウォレット",subjectValue:`${wallet.name}（${shortWalletAddress(wallet.address)}）`,
    description:"NFTマーケットプレイスへのウォレットの接続時やNFTの取引を実行する際に、署名を求められます。NFTの文脈で使われる「署名」とは、秘密鍵を使って「この操作を自分が承認した」ことを証明する手続きです。秘密鍵そのものが相手に渡ることはありません。",
    warningPrefix:"署名内容によってはNFTや暗号資産の移動が許可されるため、",riskWarning:"悪意のあるサイトに署名すると資産を盗まれる可能性があります。",
    warningSuffix:"必ず要求元・操作内容・金額・資産移動の有無を確認してください。今回の接続署名では、資産移動もガス代（手数料）も発生しません。"
  });
}
function startContractGuide(walletId){
  if(state.purchaseSigned||purchasedNftCount()>0)return;
  const wallet=walletById(walletId);if(!wallet)return;
  openTransactionExplanationGuide({
    mode:"contract",walletId:wallet.id,targetSelector:"#modalBody .purchase-signature-card",label:"GUIDE · コントラクト",title:"NFT取引で使われる「コントラクト」とは？",
    subjectLabel:"今回実行するコントラクト",subjectValue:"MintGate NFT販売（0x91D2...44AF）",
    description:"NFTの文脈で使われる「コントラクト（スマートコントラクト）」とは、ブロックチェーン上で動くプログラムです。あらかじめ定められた条件に従って、代金の支払いやNFTの発行・移動などを自動で実行します。",
    warningPrefix:"一度実行された取引は原則として取り消せません。",riskWarning:"悪意のあるコントラクトを承認すると、NFTや暗号資産を盗まれる可能性があります。",
    warningSuffix:"必ず要求元・操作内容・コントラクトアドレス・最大支払額を確認してください。今回の疑似取引では、表示中のNFTチケット購入のみを実行します。"
  });
}
function positionSignatureGuide(){
  if(!signatureGuideOpen()||!signatureGuideTarget?.isConnected)return;
  const targetRect=signatureGuideTarget.getBoundingClientRect(),bubble=$("signatureGuide");
  const mobile=window.matchMedia("(max-width: 760px)").matches,viewportMargin=mobile?10:16,gap=mobile?13:20;
  bubble.style.removeProperty("top");bubble.style.removeProperty("right");bubble.style.removeProperty("bottom");bubble.style.removeProperty("left");bubble.style.removeProperty("width");bubble.style.removeProperty("max-height");
  const availableLeft=targetRect.left-gap-viewportMargin,availableRight=window.innerWidth-targetRect.right-gap-viewportMargin;
  const stacked=mobile||Math.max(availableLeft,availableRight)<300;
  if(stacked){
    if(mobile){
      bubble.style.left=`max(${viewportMargin}px,env(safe-area-inset-left))`;
      bubble.style.right=`max(${viewportMargin}px,env(safe-area-inset-right))`;
    }else{
      const stackedWidth=Math.min(390,window.innerWidth-viewportMargin*2);
      bubble.style.width=`${stackedWidth}px`;
      bubble.style.left=`${Math.min(window.innerWidth-stackedWidth-viewportMargin,Math.max(viewportMargin,targetRect.left+(targetRect.width-stackedWidth)/2))}px`;
    }
    const naturalHeight=mobile?Math.min(bubble.scrollHeight,window.innerHeight-viewportMargin*2):bubble.offsetHeight;
    const spaceBelow=window.innerHeight-targetRect.bottom-gap-viewportMargin,spaceAbove=targetRect.top-gap-viewportMargin;
    if(mobile&&Math.max(spaceBelow,spaceAbove)<naturalHeight){
      bubble.style.maxHeight=`${naturalHeight}px`;
      bubble.style.top=`${Math.max(viewportMargin,window.innerHeight-viewportMargin-naturalHeight)}px`;
      return;
    }
    if(spaceBelow>=naturalHeight||spaceBelow>=spaceAbove){
      bubble.style.maxHeight=`${Math.max(72,spaceBelow)}px`;bubble.style.top=`${targetRect.bottom+gap}px`;
    }else{
      bubble.style.maxHeight=`${Math.max(72,spaceAbove)}px`;bubble.style.top=`${Math.max(viewportMargin,targetRect.top-gap-Math.min(naturalHeight,Math.max(72,spaceAbove)))}px`;
    }
    return;
  }
  const availableSideWidth=Math.max(availableLeft,availableRight);
  if(availableSideWidth>=300)bubble.style.width=`${Math.min(390,Math.floor(availableSideWidth))}px`;
  const bubbleWidth=bubble.offsetWidth,bubbleHeight=bubble.offsetHeight;
  const clampLeft=value=>Math.min(window.innerWidth-bubbleWidth-viewportMargin,Math.max(viewportMargin,value));
  const clampTop=value=>Math.min(window.innerHeight-bubbleHeight-viewportMargin,Math.max(viewportMargin,value));
  const candidates=[
    {fits:targetRect.left-gap-bubbleWidth>=viewportMargin,left:targetRect.left-gap-bubbleWidth,top:targetRect.top+(targetRect.height-bubbleHeight)/2},
    {fits:targetRect.right+gap+bubbleWidth<=window.innerWidth-viewportMargin,left:targetRect.right+gap,top:targetRect.top+(targetRect.height-bubbleHeight)/2},
    {fits:targetRect.bottom+gap+bubbleHeight<=window.innerHeight-viewportMargin,left:targetRect.left+(targetRect.width-bubbleWidth)/2,top:targetRect.bottom+gap},
    {fits:targetRect.top-gap-bubbleHeight>=viewportMargin,left:targetRect.left+(targetRect.width-bubbleWidth)/2,top:targetRect.top-gap-bubbleHeight}
  ];
  const chosen=candidates.find(candidate=>candidate.fits)||candidates.sort((a,b)=>Math.abs(clampTop(a.top)-a.top)-Math.abs(clampTop(b.top)-b.top))[0];
  bubble.style.left=`${clampLeft(chosen.left)}px`;bubble.style.top=`${clampTop(chosen.top)}px`;
}
function closeSignatureGuide(focusSignature=true){
  if(!signatureGuideOpen())return;
  const focusId=signatureGuideMode==="contract"?"txUnderstand":"connectUnderstand";
  $("signatureGuideOverlay").classList.add("hidden");$("signatureGuideOverlay").setAttribute("aria-hidden","true");
  $("signatureGuide").classList.add("hidden");signatureGuideTarget?.classList.remove("transaction-guide-highlight");
  document.documentElement.classList.remove("signature-guide-open");document.body.classList.remove("signature-guide-open");
  log("transaction_explanation_guide_closed",{guide:signatureGuideMode,wallet_id:signatureGuideWalletId});
  signatureGuideTarget=null;signatureGuideWalletId=null;signatureGuideMode=null;
  if(focusSignature)requestAnimationFrame(()=>$(focusId)?.focus({preventScroll:true}));
  scheduleMissionCompletionNoticeResume();
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
  if(state.accountCreated&&!state.accountBalanceGuideCompleted)requestAnimationFrame(startExchangeBalanceGuide);
  else if(state.receiptChecked&&!state.walletReceiptGuideCompleted)requestAnimationFrame(()=>startExchangeBalanceGuide("wallet-receipt"));
  else if(state.wallets.length&&!state.walletSecurityGuideCompleted)requestAnimationFrame(startWalletSecurityGuide);
  if(progress()===100&&!state.completionProgressGuideCompleted)requestAnimationFrame(()=>scheduleCompletionProgressGuide(120));
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
    admission:state.ownedNfts.some(item=>!!item.admissionUsedAt)
  };return !!map[key];
}
function nextMissionKey(){return missions.find(([key])=>!missionStatus(key))?.[0]||null}
function progress(){
  const done=missions.filter(([k])=>missionStatus(k)).length;
  return Math.round(done/missions.length*100);
}
function mobileInstructionalGuideOpen(){
  return window.matchMedia("(max-width: 760px)").matches&&(progressGuideOpen()||positionedGuideOpen());
}
function suspendMobileMissionCompletionNotice(){
  if(!window.matchMedia("(max-width: 760px)").matches||!missionCompletionNoticeActive||!missionCompletionNoticeCurrent)return;
  clearTimeout(missionCompletionNoticeTimer);clearTimeout(toast.t);
  missionCompletionNoticeQueue.unshift(missionCompletionNoticeCurrent);
  missionCompletionNoticeCurrent=null;missionCompletionNoticeActive=false;
  const notice=$("toast");
  if(notice.classList.contains("mission-completion-success-toast"))notice.classList.add("hidden");
}
function scheduleMissionCompletionNoticeResume(){
  setTimeout(()=>{
    if(!mobileInstructionalGuideOpen())showNextMissionCompletionNotice();
    if(progress()===100&&!state.completionProgressGuideCompleted&&!positionedGuideOpen()&&$("admissionPass").classList.contains("hidden"))scheduleCompletionProgressGuide();
  },80);
}
function showNextMissionCompletionNotice(){
  if(missionCompletionNoticeActive||!missionCompletionNoticeQueue.length||mobileInstructionalGuideOpen())return;
  const notice=missionCompletionNoticeQueue.shift();
  const [key,title,index]=notice;
  missionCompletionNoticeCurrent=notice;
  missionCompletionNoticeActive=true;
  const extraClass=`mission-completion-success-toast${key==="wallet"?" wallet-creation-success-toast":""}`;
  showEthSuccess(`進捗${index+1}を達成しました`,`「${title}」が完了しました`,MISSION_COMPLETION_NOTICE_MS,extraClass);
  log("mission_completion_notice_shown",{mission:key,step:index+1});
  clearTimeout(missionCompletionNoticeTimer);
  missionCompletionNoticeTimer=setTimeout(()=>{
    missionCompletionNoticeActive=false;missionCompletionNoticeCurrent=null;
    showNextMissionCompletionNotice();
  },MISSION_COMPLETION_NOTICE_MS+120);
}
function notifyNewlyCompletedMissions(){
  let completedNow=false;
  missions.forEach(([key,title],index)=>{
    if(!missionStatus(key)||missionCompletionAnnounced.has(key))return;
    missionCompletionAnnounced.add(key);
    missionCompletionNoticeQueue.push([key,title,index]);
    completedNow=true;
  });
  showNextMissionCompletionNotice();
  if(completedNow&&progress()===100&&!state.completionProgressGuideCompleted)scheduleCompletionProgressGuide();
}
function renderMission(){
  const next=nextMissionKey();
  $("missionList").innerHTML=missions.map(([key,title,desc],i)=>{
    const done=missionStatus(key),active=key===next;
    return `<li class="mission-item ${done?"done":active?"active":""}">
      <span class="mission-dot">${done?"✓":i+1}</span><span class="mission-copy"><strong>${title}</strong><small>${desc}</small></span>
      <button class="mission-hint-button" data-mission-hint="${key}" type="button" aria-label="${title}の操作ヒントを表示">?</button></li>`;
  }).join("");
  document.querySelectorAll("[data-mission-hint]").forEach(button=>button.onclick=()=>openMissionHint(button.dataset.missionHint));
  const p=progress();$("progressPercent").textContent=`${p}%`;$("progressFill").style.width=`${p}%`;
  $("sideWalletBalance").textContent=fmtEth(activeWallet()?.ethBalance||0);
  const marketWallet=connectedWallet();
  $("sideNetworkStatus").innerHTML=marketWallet?`<i></i>${escapeHtml(marketWallet.name)} 接続済み`:"<i></i>未接続";
  $("sideNetworkStatus").classList.toggle("connected",state.marketConnected);
  notifyNewlyCompletedMissions();
}

function resolveMissionHintTarget(key){
  const hint=missionHints[key];if(!hint)return null;
  if(key==="buy"&&!state.accountCreated)return {app:"exchange",tab:"exchange-home",action:"先に口座開設画面を開く"};
  if(key==="send"&&!state.walletCreated)return {app:"wallet",tab:"wallet-home",action:"先にウォレットを作成する"};
  if(key==="admission"&&!state.ownedNfts.length)return {app:"market",tab:null,action:"先にNFTチケットを購入する"};
  return {app:hint.app,tab:hint.tab,action:hint.action};
}

function openMissionHint(key){
  const hint=missionHints[key],mission=missions.find(([missionKey])=>missionKey===key);if(!hint||!mission)return;
  const done=missionStatus(key),target=resolveMissionHintTarget(key);
  log("mission_hint_opened",{mission:key,completed:done});
  openModal("操作ヒント",mission[1],`
    <div class="mission-hint-summary"><span class="mission-hint-service">${escapeHtml(hint.service)}</span><span class="mission-hint-state ${done?"done":""}">${done?"✓ 完了済み":"操作を確認"}</span><p>${escapeHtml(hint.summary)}</p></div>
    <ol class="mission-hint-steps">${hint.steps.map((step,index)=>`<li><span>${index+1}</span><p>${escapeHtml(step)}</p></li>`).join("")}</ol>
    <div class="mission-hint-tip"><span>TIP</span><p>${escapeHtml(hint.tip)}</p></div>
    <button id="missionHintGo" class="mission-hint-go ${target.app}" type="button">${escapeHtml(target.action)} <span>→</span></button>`);
  $("missionHintGo").onclick=()=>goToMissionHintTarget(key);
}

function goToMissionHintTarget(key){
  const target=resolveMissionHintTarget(key);if(!target)return;
  closeModal();
  if(target.app==="exchange"&&target.tab)state.currentExchangeTab=target.tab;
  if(target.app==="wallet"&&target.tab)state.currentWalletTab=target.tab;
  log("mission_hint_navigation",{mission:key,to_app:target.app,to_tab:target.tab});
  switchApp(target.app);
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
    <div class="balance-grid${state.accountCreated?"":" account-pending"}">
      ${state.accountCreated?`<div class="balance-card exchange-balance"><small>TOTAL BALANCE</small><strong>${fmtYen(state.exchangeYen+state.exchangeEth*markets.ETH.price)}</strong><span>日本円 ${fmtYen(state.exchangeYen)} ／ ${fmtEth(state.exchangeEth)}</span></div>`:""}
      <div class="action-card"><h3>${state.accountCreated?"取引を開始できます":"アカウントを開設"}</h3><p>${state.accountCreated?"イーサリアム(ETH)を購入してウォレットへの送金準備を進めてください。":"メールアドレス登録と疑似本人確認を行います。"}</p>
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
    <div class="button-row" style="margin-top:17px"><button id="completeAccount" class="primary" type="button">本人確認を完了する</button></div>`);
  $("completeAccount").onclick=()=>{
    const email=$("mEmail").value.trim(),password=$("mPass").value,passwordConfirmation=$("mPass2").value;
    const familyName=$("mFamily").value.trim(),givenName=$("mGiven").value.trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){error("正しい形式のメールアドレスを入力してください");return}
    if(!familyName||!givenName){error("姓と名を入力してください");return}
    if(password.length<8){error("パスワードは8文字以上で入力してください");return}
    if(password!==passwordConfirmation){error("パスワードと確認用パスワードが一致しません");return}
    state.accountCreated=true;log("exchange_account_created");closeModal();renderAll();requestAnimationFrame(startExchangeBalanceGuide);
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
        <div class="rate-head"><div><small>ETH / JPY（１イーサリアムの価格）</small><br><strong id="liveEthPrice">${fmtYen(markets.ETH.price)}</strong></div><span id="liveEthChange" class="change ${markets.ETH.change>=0?"up":"down"}">${markets.ETH.change>=0?"+":""}${markets.ETH.change.toFixed(2)}%</span></div>
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
    const completesMission=!missionStatus("buy");
    state.ethPriceAtPurchase=markets.ETH.price;
    const received=quote.amount/state.ethPriceAtPurchase;
    state.purchasedEth+=received;state.exchangeEth+=received;state.exchangeYen-=quote.total;state.ethPurchased=true;
    state.purchaseHistory.push({timestamp:now(),yen:quote.amount,fee_yen:quote.fee,eth:received,rate:state.ethPriceAtPurchase});
    state.buyAgreementChecked=false;
    log("eth_purchased",{yen:quote.amount,fee_yen:quote.fee,eth:received,rate:state.ethPriceAtPurchase,purchase_number:state.purchaseHistory.length});
    if(!completesMission)showEthPurchaseSuccess(received);
    state.currentExchangeTab="exchange-home";renderAll();requestAnimationFrame(()=>startExchangeBalanceGuide("purchase"));
  };
}
function renderExchangeSend(){
  const max=Math.max(0,state.exchangeEth-NETWORK_FEE_ETH);
  const amount=state.transferAmount===0?"":state.transferAmount;
  const destinationWallet=walletByAddress(state.destinationAddress);
  const pastedCopiedWallet=destinationWallet&&destinationWallet.id===state.copiedWalletId;
  exchangeContent.innerHTML=`
    <div class="dashboard-title"><div><span class="kicker">SEND ETH</span><h1>外部ウォレットへ送金</h1><p>Orbit Walletでコピーした公開鍵を貼り付けます。</p></div></div>
    <div class="panel">
      ${!state.addressCopied?`<div class="notice warning">先にOrbit Walletの「受け取る」で公開鍵をコピーしてください。</div>`:""}
      <div class="form-grid" style="margin-top:${state.addressCopied?0:16}px">
        <div class="field full"><label>送金先の公開鍵（ウォレットアドレス）</label><input id="destinationAddress" class="input" placeholder="Orbit Walletからコピーして貼り付け" value="${escapeHtml(state.destinationAddress)}">
          <span id="pasteIndicator" class="paste-status ${state.addressPasted&&pastedCopiedWallet?"ok":""}"><i></i>${state.addressPasted?(pastedCopiedWallet?`${escapeHtml(destinationWallet.name)}のコピー済み公開鍵を検出しました`:"コピーした公開鍵と一致しません"):"Ctrl/Cmd + V で貼り付けてください"}</span></div>
        <div class="field"><div class="send-amount-label-row"><label for="transferAmount">送金額</label><span class="send-available-callout">送金可能 ${fmtEth(max)}</span></div><input id="transferAmount" class="input" type="number" step="0.0001" placeholder="送金額を入力" value="${amount===""?"":Number(amount).toFixed(6)}"></div>
        <div class="field send-network-field"><label for="transferNetwork">ネットワーク</label><select id="transferNetwork" class="select" disabled><option>Ethereum Mainnet（疑似）</option></select></div>
      </div>
      <div class="summary" style="margin-top:16px"><div class="summary-row"><span>送金額</span><strong id="sendAmountSummary">${amount===""?"—":fmtEth(Number(amount))}</strong></div><div class="summary-row"><span>ネットワーク手数料</span><strong>${fmtEth(NETWORK_FEE_ETH)}</strong></div><div class="summary-row"><span>取引所残高</span><strong>${fmtEth(state.exchangeEth)}</strong></div></div>
      <label class="check" style="margin-top:15px"><input id="sendAgree" type="checkbox" ${state.transferPending?"disabled":""}><span>公開鍵を確認しました。暗号資産は誤ったアドレスへ送ると基本的に取り戻せません。</span></label>
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
    const targetWallet=walletByAddress(state.destinationAddress);
    if(!targetWallet){error("送金先アドレスが作成済みのOrbit Walletの公開鍵と一致しません");return}
    if(targetWallet.id!==state.copiedWalletId){error("最後にコピーしたウォレットの公開鍵を貼り付けてください");return}
    if(!$("sendAgree").checked){error("送金リスクの確認が必要です");return}
    if(rawAmount===""||!Number.isFinite(sendAmount)||sendAmount<=0){error("0より大きい送金額を入力してください");return}
    if(sendAmount+NETWORK_FEE_ETH>state.exchangeEth){error("送金額と手数料の合計が取引所残高を超えています");return}
    openSendReview(sendAmount,targetWallet);
  };
}
function openSendReview(sendAmount,targetWallet){
  openModal("WITHDRAWAL REVIEW","ETH送金を確定",`
    <div class="summary"><div class="summary-row"><span>送金先</span><strong>${escapeHtml(targetWallet.name)}</strong></div><div class="summary-row"><span>公開鍵</span><strong style="max-width:280px;overflow-wrap:anywhere">${escapeHtml(targetWallet.address)}</strong></div><div class="summary-row"><span>送金額</span><strong>${fmtEth(sendAmount)}</strong></div><div class="summary-row"><span>手数料</span><strong>${fmtEth(NETWORK_FEE_ETH)}</strong></div><div class="summary-row"><span>受取予定</span><strong>${fmtEth(sendAmount)}</strong></div></div>
    <div class="notice danger" style="margin-top:14px">ブロックチェーン上の送金は原則として取り消せません。</div>
    <div class="button-row" style="margin-top:16px"><button id="confirmSend" class="danger-btn" type="button">このアドレスへ送金する</button><button id="cancelSend" class="secondary" type="button">戻る</button></div>`);
  $("cancelSend").onclick=closeModal;
  $("confirmSend").onclick=()=>{
    const completesMission=!missionStatus("send");
    state.transferAmount=sendAmount;state.exchangeEth-=sendAmount+NETWORK_FEE_ETH;state.transferSent=true;state.transferPending=true;state.transferDestinationWalletId=targetWallet.id;state.receiptChecked=false;
    state.transferCompletesAt=Date.now()+TRANSFER_DELAY_MS;
    log("eth_transfer_sent",{destination:targetWallet.address,wallet_id:targetWallet.id,amount:sendAmount,fee:NETWORK_FEE_ETH});
    closeModal();if(!completesMission)showEthTransferStarted(sendAmount);renderAll();
    scheduleTransferCompletion(TRANSFER_DELAY_MS);
  };
}

function completeTransfer(){
  if(!state.transferPending)return;
  const sendAmount=Number(state.transferAmount)||0;
  const targetWallet=walletById(state.transferDestinationWalletId)||walletByAddress(state.destinationAddress)||activeWallet();
  if(!targetWallet){state.transferPending=false;state.transferCompletesAt=null;error("送金先ウォレットを確認できませんでした");return}
  targetWallet.ethBalance+=sendAmount;
  state.transferReceived=true;state.transferPending=false;state.transferCompletesAt=null;state.lastReceivedAmount=sendAmount;state.lastReceivedWalletId=targetWallet.id;state.transferAmount="";state.transferDestinationWalletId=null;
  syncLegacyWalletState();
  log("eth_transfer_confirmed",{amount:sendAmount,wallet_id:targetWallet.id,destination:targetWallet.address});showEthTransferCompleted(sendAmount);renderAll();
}
function scheduleTransferCompletion(delay){
  clearTimeout(transferTimer);transferTimer=setTimeout(completeTransfer,Math.max(0,delay));
}

function walletManagerPanel(){
  const current=activeWallet(),atWalletLimit=state.wallets.length>=MAX_WALLETS;
  return `<section class="wallet-manager-panel" aria-label="ウォレット一覧">
    <div class="wallet-manager-heading"><div><span class="kicker">YOUR WALLETS</span><h2>ウォレットを選択</h2><p>資産・公開鍵・保有NFTはウォレットごとに管理されます。</p></div><button id="addWalletButton" class="wallet-add-button" type="button" ${atWalletLimit?"disabled":""}><span>${atWalletLimit?"✓":"＋"}</span> ${atWalletLimit?`最大${MAX_WALLETS}個まで作成済み`:"新規作成"}</button></div>
    <div class="wallet-account-list">${state.wallets.map(wallet=>`<button class="wallet-account-card ${wallet.id===current?.id?"active":""}" data-wallet-switch="${escapeHtml(wallet.id)}" type="button" aria-pressed="${wallet.id===current?.id}">
      <span class="wallet-account-icon">O</span><span class="wallet-account-copy"><strong>${escapeHtml(wallet.name)}</strong><code>${escapeHtml(shortWalletAddress(wallet.address))}</code></span><span class="wallet-account-balance">${fmtEth(wallet.ethBalance)}</span>
    </button>`).join("")}</div>
  </section>`;
}
function bindWalletManager(){
  document.querySelectorAll("[data-wallet-switch]").forEach(button=>button.onclick=()=>{
    const wallet=walletById(button.dataset.walletSwitch);if(!wallet||wallet.id===state.activeWalletId)return;
    state.activeWalletId=wallet.id;privateKeyVisible=false;syncLegacyWalletState();
    log("active_wallet_changed",{wallet_id:wallet.id,address:wallet.address});renderAll();
  });
  if($("addWalletButton"))$("addWalletButton").onclick=openSeedModal;
}
function renderWallet(){
  privateKeyVisible=false;seedPhraseVisible=false;
  const pendingAirdrop=!state.airdropGuideCompleted?airdroppedNftEntry():null;
  if(state.currentApp==="wallet"&&pendingAirdrop)state.currentWalletTab="wallet-nft";
  document.querySelectorAll("#walletTabs button").forEach(b=>b.classList.toggle("active",b.dataset.tab===state.currentWalletTab));
  if(!state.wallets.length){renderWalletCreate();return}
  if(!activeWallet()){state.activeWalletId=state.wallets[0].id;syncLegacyWalletState()}
  if(state.currentWalletTab==="wallet-nft"){
    const guideEntry=pendingAirdrop||(!state.nftOwnershipGuideCompleted?firstPurchasedNftEntry():null);
    const guideWallet=guideEntry?walletById(nftOwnerWalletId(guideEntry.owned)):null;
    if(guideWallet&&guideWallet.id!==state.activeWalletId){state.activeWalletId=guideWallet.id;syncLegacyWalletState()}
  }
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
  if(state.wallets.length>=MAX_WALLETS){toast(`このサイト内で作成できるウォレットは最大${MAX_WALLETS}個です`);return}
  const walletNumber=state.wallets.length+1;
  const seedWords=seedWordsForWallet(walletNumber);
  const seed3Options=[seedWords[3],seedWords[2],seedWords[5]];
  const seed9Options=[seedWords[6],seedWords[10],seedWords[8]];
  openModal("SECRET RECOVERY PHRASE",`${walletNumber}個目のウォレットを作成`,`
    <div class="notice warning">実際のウォレットでは、この単語列を失うと資産を復旧できません。第三者に共有してはいけません。</div>
    <div class="seed-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px">
      ${seedWords.map((w,i)=>`<div style="padding:10px;border:1px solid #e3e6ed;border-radius:10px;font:10px monospace"><span style="color:#a0a5b0;margin-right:6px">${i+1}</span>${w}</div>`).join("")}
    </div>
    <div class="form-grid" style="margin-top:15px"><div class="field"><label>3番目の単語</label><select id="seed3" class="select"><option value="" selected disabled hidden>選択してください</option>${seed3Options.map(word=>`<option>${word}</option>`).join("")}</select></div><div class="field"><label>9番目の単語</label><select id="seed9" class="select"><option value="" selected disabled hidden>選択してください</option>${seed9Options.map(word=>`<option>${word}</option>`).join("")}</select></div></div>
    <button id="finishWallet" class="primary" style="width:100%;margin-top:15px" type="button">ウォレット作成を完了</button>`);
  $("finishWallet").onclick=()=>{
    if(state.wallets.length>=MAX_WALLETS){closeModal();toast(`このサイト内で作成できるウォレットは最大${MAX_WALLETS}個です`);return}
    if($("seed3").value!==seedWords[2]||$("seed9").value!==seedWords[8]){error("指定された単語を確認してください");return}
    let address=state.wallets.length?generateDemoWalletAddress():WALLET_ADDRESS;
    while(walletByAddress(address))address=generateDemoWalletAddress();
    const completesMission=!missionStatus("wallet");
    const wallet={id:`wallet-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,name:`ウォレット ${walletNumber}`,address,privateKey:generateDemoPrivateKey(),ethBalance:0,createdAt:now(),seedPhrase:seedWords};
    state.wallets.push(wallet);state.activeWalletId=wallet.id;syncLegacyWalletState();
    log("wallet_created",{wallet_id:wallet.id,wallet_number:walletNumber,address:wallet.address});closeModal();if(!completesMission)showWalletCreationSuccess(wallet);renderAll();
    state.currentWalletTab="wallet-receive";renderWallet();
    if(walletNumber===1&&!state.walletSecurityGuideCompleted)requestAnimationFrame(startWalletSecurityGuide);
  };
}
function renderWalletHome(){
  const wallet=activeWallet();if(!wallet){renderWalletCreate();return}
  const receivingHere=state.lastReceivedWalletId===wallet.id;
  const pendingHere=state.transferPending&&state.transferDestinationWalletId===wallet.id;
  let receiptCompletedNow=false;
  if(state.currentApp==="wallet"&&receivingHere&&state.transferReceived&&!state.transferPending&&!state.receiptChecked){
    state.receiptChecked=true;receiptCompletedNow=true;log("wallet_receipt_checked",{amount:state.lastReceivedAmount,wallet_id:wallet.id,source:"assets_opened"});renderMission();
  }
  walletContent.innerHTML=`
    ${walletManagerPanel()}
    <div class="dashboard-title wallet-overview-title"><div><span class="kicker">PORTFOLIO</span><h1>${escapeHtml(wallet.name)}</h1><p>${escapeHtml(shortWalletAddress(wallet.address))}</p></div><span class="task-callout">${pendingHere?"入金確認中":"Ethereum Mainnet"}</span></div>
    <div class="balance-grid"><div class="balance-card wallet-balance"><small>TOTAL BALANCE</small><strong>${fmtEth(wallet.ethBalance)}</strong><span>${fmtYen(wallet.ethBalance*markets.ETH.price)}</span></div>
      <div class="action-card"><h3>${wallet.ethBalance>0?"チケット購入の準備完了":"ETHを受け取る"}</h3><p>${wallet.ethBalance>0?"MintGateでこのウォレットを接続できます。":"公開鍵をコピーし、取引所の送金先へ貼り付けます。"}</p><button id="walletPrimary" class="primary" type="button">${wallet.ethBalance>0?"MintGateを開く":"受取用アドレスを表示"}</button></div></div>
    ${pendingHere?`<div class="notice info" style="margin-top:16px">ネットワーク確認中です。通常は複数の承認を待って残高へ反映されます。</div>`:""}
    <div class="wallet-assets"><div class="asset-row"><div class="asset-row-left"><span class="asset-icon">Ξ</span><div><strong>Ethereum</strong><small>ETH</small></div></div><div class="asset-value"><strong>${fmtEth(wallet.ethBalance)}</strong><small>${fmtYen(wallet.ethBalance*markets.ETH.price)}</small></div></div></div>
    ${privateKeyPanel()}`;
  $("walletPrimary").onclick=()=>wallet.ethBalance>0?switchApp("market"):(state.currentWalletTab="wallet-receive",renderWallet());
  bindWalletManager();bindPrivateKeyPanel();
  if(receiptCompletedNow&&!state.walletReceiptGuideCompleted)requestAnimationFrame(()=>startExchangeBalanceGuide("wallet-receipt"));
}
function renderWalletReceive(){
  const wallet=activeWallet();if(!wallet){renderWalletCreate();return}
  const copiedHere=state.addressCopied&&state.copiedWalletId===wallet.id;
  const receivingHere=state.transferReceived&&state.lastReceivedWalletId===wallet.id;
  const pendingHere=state.transferPending&&state.transferDestinationWalletId===wallet.id;
  walletContent.innerHTML=`
    ${walletManagerPanel()}
    <div class="dashboard-title"><div><span class="kicker">RECEIVE</span><h1>${escapeHtml(wallet.name)}でETHを受け取る</h1><p>以下の公開鍵を取引所の送金先に貼り付けてください。</p></div><span class="task-callout">ネットワーク：Ethereum</span></div>
    <div class="panel">
      <div class="address-box"><span class="field-title">あなたの公開鍵（ウォレットアドレス）</span><code id="publicAddress">${escapeHtml(wallet.address)}</code><button id="copyAddress" class="copy-button" type="button">${copiedHere?"コピー済み":"公開鍵をコピー"}</button></div>
      <div class="notice warning" style="margin-top:13px">送金元と送金先で、必ず同じネットワークを選択してください。</div>
      <div class="button-row" style="margin-top:15px"><button id="goExchangeSend" class="primary" type="button" ${!copiedHere?"disabled":""}>取引所の送金画面へ</button><button id="checkWallet" class="secondary" type="button">${receivingHere&&state.receiptChecked?"入金確認済み":"残高を再確認"}</button></div>
      ${pendingHere?`<div class="notice info" style="margin-top:13px">取引所からの送金を確認中です…</div>`:""}
      ${receivingHere&&!state.transferPending?`<div class="notice success" style="margin-top:13px">${fmtEth(state.lastReceivedAmount)} の入金が確認されました。</div>`:""}
    </div>
    ${privateKeyPanel()}`;
  $("copyAddress").onclick=copyWalletAddress;
  $("goExchangeSend").onclick=()=>{switchApp("exchange");state.currentExchangeTab="exchange-send";renderExchange()};
  $("checkWallet").onclick=()=>{
    if(pendingHere){toast("まだネットワーク確認中です");return}
    if(!receivingHere){toast("このウォレットへの入金はまだありません");return}
    state.currentWalletTab="wallet-home";renderWallet();
  };
  bindWalletManager();bindPrivateKeyPanel();
}

function maskedPrivateKey(){return `0x${"•".repeat(64)}`}
function privateKeyPanel(){
  const wallet=activeWallet();
  const visible=privateKeyVisible;
  return `<section class="private-key-vault">
    <div class="seed-phrase-vault">
      <div class="private-key-heading"><div><span class="kicker">RECOVERY</span><h2>シードフレーズ</h2></div><span>12単語・研究用疑似データ</span></div>
      <div id="seedPhraseDisplay" class="seed-phrase-display ${seedPhraseVisible?"visible":"masked"}" aria-label="${seedPhraseVisible?"シードフレーズを表示中":"シードフレーズは非表示"}">${seedPhraseWords(wallet,seedPhraseVisible)}</div>
      <button id="toggleSeedPhrase" class="private-key-toggle seed-phrase-toggle" type="button" aria-pressed="${seedPhraseVisible}">${seedPhraseVisible?"シードフレーズを隠す":"シードフレーズを表示する"}</button>
      <p>シードフレーズはウォレットを復旧できる重要な情報です。秘密鍵と同様に第三者へ共有しないでください。</p>
    </div>
    <div class="private-key-section">
      <div class="private-key-heading"><div><span class="kicker">SECURITY</span><h2>秘密鍵</h2></div><span>研究用疑似データ</span></div>
      <div id="privateKeyDisplay" class="private-key-display ${visible?"visible":"masked"}"><code id="privateKeyValue" aria-label="${visible?"秘密鍵を表示中":"秘密鍵は非表示"}">${visible?escapeHtml(wallet?.privateKey):maskedPrivateKey()}</code></div>
      <button id="togglePrivateKey" class="private-key-toggle" type="button" aria-pressed="${visible}">${visible?"秘密鍵を隠す":"秘密鍵を表示する"}</button>
      <p>実際の秘密鍵は第三者に共有せず、画面の録画やスクリーンショットにも残さないでください。</p>
    </div>
  </section>`;
}
function seedPhraseWords(wallet,visible){
  const words=Array.isArray(wallet?.seedPhrase)&&wallet.seedPhrase.length===12?wallet.seedPhrase:seedWordsForWallet(Math.max(1,state.wallets.findIndex(item=>item.id===wallet?.id)+1));
  return words.map((word,index)=>`<span><i>${index+1}</i><b>${visible?escapeHtml(word):"••••••"}</b></span>`).join("");
}
function setPrivateKeyVisibility(visible){
  const wallet=activeWallet();privateKeyVisible=!!visible;
  const display=$("privateKeyDisplay"),value=$("privateKeyValue"),button=$("togglePrivateKey");
  if(!wallet||!display||!value||!button)return;
  display.classList.toggle("visible",privateKeyVisible);display.classList.toggle("masked",!privateKeyVisible);
  value.textContent=privateKeyVisible?wallet.privateKey:maskedPrivateKey();
  value.setAttribute("aria-label",privateKeyVisible?"秘密鍵を表示中":"秘密鍵は非表示");
  button.textContent=privateKeyVisible?"秘密鍵を隠す":"秘密鍵を表示する";button.setAttribute("aria-pressed",String(privateKeyVisible));
}
function setSeedPhraseVisibility(visible){
  const wallet=activeWallet();seedPhraseVisible=!!visible;
  const display=$("seedPhraseDisplay"),button=$("toggleSeedPhrase");
  if(!wallet||!display||!button)return;
  display.classList.toggle("visible",seedPhraseVisible);display.classList.toggle("masked",!seedPhraseVisible);
  display.innerHTML=seedPhraseWords(wallet,seedPhraseVisible);
  display.setAttribute("aria-label",seedPhraseVisible?"シードフレーズを表示中":"シードフレーズは非表示");
  button.textContent=seedPhraseVisible?"シードフレーズを隠す":"シードフレーズを表示する";button.setAttribute("aria-pressed",String(seedPhraseVisible));
}
function bindPrivateKeyPanel(){
  const button=$("togglePrivateKey");if(!button)return;
  button.onclick=()=>{
    setPrivateKeyVisibility(!privateKeyVisible);
    log(privateKeyVisible?"private_key_revealed":"private_key_hidden");
  };
  const seedButton=$("toggleSeedPhrase");if(!seedButton)return;
  seedButton.onclick=()=>{
    const wallet=activeWallet();if(!wallet)return;
    setSeedPhraseVisibility(!seedPhraseVisible);
    log(seedPhraseVisible?"seed_phrase_revealed":"seed_phrase_hidden",{wallet_id:wallet.id});
  };
}
async function copyWalletAddress(){
  const wallet=activeWallet();if(!wallet){error("先にウォレットを作成してください");return}
  let copied=false;
  try{await navigator.clipboard.writeText(wallet.address);copied=true}catch(e){
    const ta=document.createElement("textarea");ta.value=wallet.address;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();
    try{copied=document.execCommand("copy")}catch(_){copied=false}ta.remove();
  }
  state.copyCount++;log("wallet_address_copy_attempted",{clipboard_success:copied,wallet_id:wallet.id,address:wallet.address});
  if(!copied){error("公開鍵をコピーできませんでした。ブラウザのクリップボード許可を確認してください");renderWallet();return}
  const completesMission=!missionStatus("copy");
  state.addressCopied=true;state.copiedWalletId=wallet.id;log("wallet_address_copied",{wallet_id:wallet.id,address:wallet.address});renderAll();if(!completesMission)toast(`${wallet.name}の公開鍵をコピーしました`);
}
function renderWalletNft(){
  const wallet=activeWallet();if(!wallet){renderWalletCreate();return}
  const ownedEntries=state.ownedNfts.map((owned,index)=>({owned,index})).filter(entry=>nftOwnerWalletId(entry.owned)===wallet.id);
  if(ownedEntries.length){
    walletContent.innerHTML=`
      ${walletManagerPanel()}
      <div class="dashboard-title"><div><span class="kicker">COLLECTIBLES</span><h1>${escapeHtml(wallet.name)}の保有NFT</h1><p>このウォレットで購入・受領したNFTチケットが表示されます。</p></div><span class="task-callout">${ownedEntries.length} NFT</span></div>
      <div class="notice info nft-tap-guide">保有NFTをタップすると、受付で提示する入館証や利用できる特典を確認できます。</div>
      <div class="ticket-grid">${ownedEntries.map(({owned,index},position)=>ticketCard(tickets.find(t=>t.id===owned.ticketId),false,true,position+1,index)).join("")}</div>`;
    document.querySelectorAll("[data-owned-index]").forEach(card=>{
      card.onclick=()=>openOwnedNftDetail(Number(card.dataset.ownedIndex));
      card.onkeydown=event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();openOwnedNftDetail(Number(card.dataset.ownedIndex))}};
    });
  }else{
    walletContent.innerHTML=`${walletManagerPanel()}<div class="dashboard-title"><div><span class="kicker">COLLECTIBLES</span><h1>${escapeHtml(wallet.name)}の保有NFT</h1><p>現在、このウォレットが保有しているNFTはありません。</p></div></div><div class="notice info" style="margin-top:18px">MintGateでこのウォレットを接続してNFTチケットを購入すると、ここに表示されます。</div>`;
  }
  bindWalletManager();
  if(!maybeStartAirdropGuide())maybeStartNftOwnershipGuide();
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
  const wallet=activeWallet();if(!wallet){renderWalletCreate();return}
  const ownedProgramIds=Object.keys(NFT_BENEFIT_PROGRAMS).filter(ticketId=>ownsTicket(ticketId,wallet.id));
  const unlockedTotal=ownedProgramIds.reduce((sum,ticketId)=>sum+benefitProgram(ticketId).benefits.filter(benefit=>benefitUnlocked(ticketId,benefit)).length,0);
  const benefitTotal=ownedProgramIds.reduce((sum,ticketId)=>sum+benefitProgram(ticketId).benefits.length,0);
  walletContent.innerHTML=`
    ${walletManagerPanel()}
    <div class="dashboard-title"><div><span class="kicker">HOLDER BENEFITS</span><h1>${escapeHtml(wallet.name)}のNFT特典</h1><p>このウォレットの保有NFTに追加された特典を確認できます。</p></div><span class="task-callout">${ownedProgramIds.length?`${unlockedTotal} / ${benefitTotal} 獲得`:`対象NFT未保有`}</span></div>
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
  bindWalletManager();
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
    <div class="summary owned-token-summary"><div class="summary-row"><span>トークンID</span><strong>${owned.tokenId}</strong></div><div class="summary-row"><span>所有ウォレット</span><strong>${escapeHtml(walletById(nftOwnerWalletId(owned))?.name||"Orbit Wallet")}</strong></div><div class="summary-row"><span>会場</span><strong>${t.venue}</strong></div><div class="summary-row"><span>${owned.acquisitionType==="airdrop"?"獲得日時":"購入日時"}</span><strong>${new Date(owned.purchasedAt).toLocaleString("ja-JP")}</strong></div>${owned.acquisitionType==="airdrop"?`<div class="summary-row"><span>獲得方法</span><strong>3枚購入エアドロップ</strong></div>`:""}</div>
    <section class="admission-entry-callout"><div><span>EVENT ENTRY</span><h3>ウォレット署名型LIVE入館証</h3><p>NFTチケット保有と秘密鍵の所持を短時間の署名認証で証明します。</p></div><button id="openAdmissionPass" type="button">入館証を表示する <b>→</b></button></section>
    ${program?`<section class="dynamic-benefit-callout"><span class="dynamic-pill">新しい特典が追加されました</span><h3>ゲームをプレイすることで追加の特典を獲得できます</h3><p>ベストスコア：<strong>${fmtScore(progress.bestScore)}</strong></p><div class="benefit-mini-list">${benefitCards(t.id,true)}</div><button id="nftStartGame" class="benefit-play-button" type="button">${program.gameName}を開始する <span>→</span></button><button id="openBenefitsPage" class="benefit-text-button" type="button">すべての特典を確認する</button></section>`:`<div class="notice info" style="margin-top:14px">現在利用できる特典：${t.benefit}</div>`}`);
  $("openAdmissionPass").onclick=()=>openAdmissionPass(index);
  if(program){
    $("nftStartGame").onclick=()=>openGameExperience(t.id);
    $("openBenefitsPage").onclick=()=>{closeModal();state.currentWalletTab="wallet-benefits";renderWallet()};
  }
}

function positionAdmissionResaleGuide(){
  if(!admissionResaleGuideOpen()||!admissionResaleGuideTarget?.isConnected)return;
  const targetRect=admissionResaleGuideTarget.getBoundingClientRect(),bubble=$("admissionResaleGuide");
  const mobile=window.matchMedia("(max-width: 760px)").matches,viewportMargin=mobile?10:16,gap=mobile?12:18;
  bubble.style.removeProperty("top");bubble.style.removeProperty("right");bubble.style.removeProperty("bottom");bubble.style.removeProperty("left");bubble.style.removeProperty("width");bubble.style.removeProperty("max-height");
  const availableLeft=targetRect.left-gap-viewportMargin,availableRight=window.innerWidth-targetRect.right-gap-viewportMargin;
  const stacked=mobile||Math.max(availableLeft,availableRight)<300;
  if(stacked){
    if(mobile){
      bubble.style.left=`max(${viewportMargin}px,env(safe-area-inset-left))`;
      bubble.style.right=`max(${viewportMargin}px,env(safe-area-inset-right))`;
    }else{
      const stackedWidth=Math.min(400,window.innerWidth-viewportMargin*2);
      bubble.style.width=`${stackedWidth}px`;
      bubble.style.left=`${Math.min(window.innerWidth-stackedWidth-viewportMargin,Math.max(viewportMargin,targetRect.left+(targetRect.width-stackedWidth)/2))}px`;
    }
    const naturalHeight=bubble.offsetHeight,spaceBelow=window.innerHeight-targetRect.bottom-gap-viewportMargin,spaceAbove=targetRect.top-gap-viewportMargin,heightLimit=mobile?245:Infinity;
    if(spaceBelow>=naturalHeight||spaceBelow>=spaceAbove){
      bubble.style.maxHeight=`${Math.max(96,Math.min(spaceBelow,heightLimit))}px`;bubble.style.top=`${targetRect.bottom+gap}px`;
    }else{
      const availableHeight=Math.max(96,Math.min(spaceAbove,heightLimit));
      bubble.style.maxHeight=`${availableHeight}px`;bubble.style.top=`${Math.max(viewportMargin,targetRect.top-gap-Math.min(naturalHeight,availableHeight))}px`;
    }
    return;
  }
  const availableSideWidth=Math.max(availableLeft,availableRight);
  bubble.style.width=`${Math.min(400,Math.floor(availableSideWidth))}px`;
  const bubbleWidth=bubble.offsetWidth,bubbleHeight=bubble.offsetHeight;
  const left=availableRight>=availableLeft?targetRect.right+gap:targetRect.left-gap-bubbleWidth;
  bubble.style.left=`${Math.min(window.innerWidth-bubbleWidth-viewportMargin,Math.max(viewportMargin,left))}px`;
  bubble.style.top=`${Math.min(window.innerHeight-bubbleHeight-viewportMargin,Math.max(viewportMargin,targetRect.top+(targetRect.height-bubbleHeight)/2))}px`;
}

function keepAdmissionResaleGuideTargetInView(){
  if(!admissionResaleGuideOpen()||!admissionResaleGuideTarget?.isConnected)return false;
  const rect=admissionResaleGuideTarget.getBoundingClientRect(),mobile=window.matchMedia("(max-width: 760px)").matches;
  const viewportTop=(mobile?64:72)+10,viewportBottom=window.innerHeight-10;
  let delta=0;
  if(rect.height>viewportBottom-viewportTop)delta=rect.top-viewportTop;
  else if(rect.top<viewportTop)delta=rect.top-viewportTop;
  else if(rect.bottom>viewportBottom)delta=rect.bottom-viewportBottom;
  if(Math.abs(delta)<1)return false;
  $("admissionPass").scrollBy({top:delta,behavior:"auto"});return true;
}

function hideAdmissionResaleGuide(){
  admissionResaleGuideTarget?.classList.remove("wallet-guide-highlight","admission-resale-guide-highlight");
  $("admissionResaleGuideBackdrop").classList.add("hidden");$("admissionResaleGuideBackdrop").setAttribute("aria-hidden","true");
  $("admissionResaleGuide").classList.add("hidden");$("admissionResaleGuide").setAttribute("aria-hidden","true");
  document.documentElement.classList.remove("admission-resale-guide-open");document.body.classList.remove("admission-resale-guide-open");
  admissionResaleGuideTarget=null;
}

function resumeAdmissionLiveAuth(){
  const owned=currentAdmissionOwned();
  if(!owned||admissionVerifiedTokenId!==owned.tokenId)return;
  admissionAuthExpiresAt=Date.now()+ADMISSION_AUTH_TTL_MS;
  renderAdmissionAuthState();
  clearInterval(admissionAuthTimer);admissionAuthTimer=setInterval(updateAdmissionLiveAuth,250);
  toast("ウォレット署名を確認しました。30秒間有効です");
  requestAnimationFrame(()=>$("admissionCheckInButton").focus({preventScroll:true}));
}

function startAdmissionResaleGuide(){
  const mobile=window.matchMedia("(max-width: 760px)").matches;
  if(admissionResaleGuideOpen()||(mobile&&state.admissionResaleGuideShown))return false;
  admissionResaleGuideTarget=$("admissionLiveScreen");
  if(!admissionResaleGuideTarget)return false;
  if(mobile)state.admissionResaleGuideShown=true;
  admissionResaleGuideTarget.classList.add("wallet-guide-highlight","admission-resale-guide-highlight");
  document.documentElement.classList.add("admission-resale-guide-open");document.body.classList.add("admission-resale-guide-open");
  $("admissionResaleGuideBackdrop").classList.remove("hidden");$("admissionResaleGuideBackdrop").setAttribute("aria-hidden","false");
  $("admissionResaleGuide").classList.remove("hidden");$("admissionResaleGuide").setAttribute("aria-hidden","false");
  startGuideGeometryMonitor();scheduleGuidePositionRefresh(5);
  log("admission_resale_guide_opened",{token_id:currentAdmissionOwned()?.tokenId||null});
  requestAnimationFrame(()=>{
    if(!admissionResaleGuideOpen())return;
    for(let attempt=0;attempt<3;attempt++){
      positionAdmissionResaleGuide();
      if(!keepAdmissionResaleGuideTargetInView())break;
    }
    positionAdmissionResaleGuide();$("admissionResaleGuideClose").focus({preventScroll:true});
  });
  return true;
}

function closeAdmissionResaleGuide(){
  if(!admissionResaleGuideOpen())return;
  const tokenId=currentAdmissionOwned()?.tokenId||null;
  hideAdmissionResaleGuide();
  log("admission_resale_guide_closed",{token_id:tokenId});
  resumeAdmissionLiveAuth();
  scheduleMissionCompletionNoticeResume();
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
  if(admissionResaleGuideOpen())hideAdmissionResaleGuide();
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
  $("admissionPass").classList.toggle("checkin-ready",live);
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
  const seconds=Math.ceil(remaining/1000),slot=Math.floor((ADMISSION_AUTH_TTL_MS-remaining)/3000);
  $("admissionLiveCode").textContent=admissionLiveCode(admissionAuthNonce);
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
  clearInterval(admissionAuthTimer);admissionAuthTimer=null;
  if(!startAdmissionResaleGuide())resumeAdmissionLiveAuth();
}

function completeAdmissionCheckIn(){
  const owned=currentAdmissionOwned();
  if(!owned||admissionVerifiedTokenId!==owned.tokenId||Date.now()>=admissionAuthExpiresAt){error("有効なLIVE認証が必要です");renderAdmissionAuthState();return}
  if(!window.confirm("このNFTチケットを入館処理済みにします。処理後は再利用できません。よろしいですか？"))return;
  const completesMission=!missionStatus("admission");
  owned.admissionUsedAt=now();
  log("admission_check_in_completed",{ticket_id:owned.ticketId,token_id:owned.tokenId,used_at:owned.admissionUsedAt});
  clearInterval(admissionAuthTimer);admissionAuthTimer=null;admissionVerifiedTokenId=null;
  renderAdmissionAuthState();renderMission();
  if(completesMission&&progress()===100)scheduleCompletionProgressGuide();
  else if(!completesMission)toast("入館処理が完了しました");
}

function openAdmissionPass(index){
  const owned=state.ownedNfts[index],t=tickets.find(item=>item.id===owned?.ticketId);
  if(!owned||!t){error("入館証を表示できません");return}
  const ownerWallet=walletById(nftOwnerWalletId(owned));
  resetAdmissionLiveAuth();activeAdmissionIndex=index;closeModal();
  $("admissionEventImage").src=t.image;$("admissionEventImage").alt=`${t.title} のチケットビジュアル`;
  $("admissionEventCategory").textContent=t.category.toUpperCase();
  $("admissionPassTitle").textContent=`${t.title} 入館証`;
  $("admissionEventDate").textContent=t.date;
  $("admissionEventTitle").textContent=t.title;
  $("admissionEventVenue").textContent=t.venue;
  $("admissionTokenId").textContent=owned.tokenId;
  $("admissionOwner").textContent=shortWalletAddress(owned.ownerAddress||ownerWallet?.address);
  $("admissionIssuedAt").textContent=new Date(owned.purchasedAt).toLocaleString("ja-JP");
  $("admissionPass").classList.remove("hidden");document.body.classList.add("admission-pass-open");
  renderAdmissionAuthState();
  state.admissionPassViewed=true;renderMission();
  log("admission_pass_opened",{ticket_id:t.id,token_id:owned.tokenId,wallet_id:ownerWallet?.id||null});
  requestAnimationFrame(()=>$("admissionPassClose").focus());
}

function closeAdmissionPass(){
  if($("admissionPass").classList.contains("hidden"))return;
  resetAdmissionLiveAuth();
  $("admissionPass").classList.add("hidden");document.body.classList.remove("admission-pass-open");
  log("admission_pass_closed");
  const previousIndex=activeAdmissionIndex;activeAdmissionIndex=null;
  document.querySelector(`[data-owned-index="${previousIndex}"]`)?.focus();
  if(progress()===100&&!state.completionProgressGuideCompleted)scheduleCompletionProgressGuide();
  scheduleMissionCompletionNoticeResume();
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
  if(!ownsTicket(ticketId,activeWallet()?.id)){error(`このゲームは${t.title}の保有者限定です`);return}
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
  const walletReady=state.wallets.length>0;
  let connected=connectedWallet();
  if(state.marketConnected&&!connected){state.marketConnected=false;state.connectionSigned=false;state.connectedWalletId=null;connected=null}
  $("marketWalletButton").textContent=connected?shortWalletAddress(connected.address):walletReady?"ウォレットを接続":"ウォレット作成が必要";
  $("marketWalletButton").disabled=!walletReady;
  $("marketWalletButton").classList.toggle("connected",!!connected);
  $("marketWalletButton").title=connected?`${connected.name}を接続中。押すと接続先を変更できます`:"";
  const ownedCount=connected?ownedNftsForWallet(connected.id).length:0;
  const purchaseCount=purchasedNftCount(),rewardOwned=ownsTicket(AIRDROP_TICKET_ID),airdropRemaining=Math.max(0,AIRDROP_PURCHASE_THRESHOLD-purchaseCount);
  marketContent.innerHTML=`
    ${ownedCount?`<div class="completion-card"><div class="success-check">✓</div><h2>${escapeHtml(connected.name)}で${ownedCount}枚のNFTチケットを保有しています</h2><p>購入後も残高があれば、別のチケットや同じチケットを続けて購入できます。</p><div class="button-row" style="justify-content:center;margin-top:15px"><button id="openOwnedNft" class="primary" type="button">ウォレットでNFTを見る</button><button id="downloadResult" class="secondary" type="button">結果をJSONで保存</button></div></div>`:""}
    <div class="dashboard-title" style="margin-top:${ownedCount?22:0}px"><div><span class="kicker">EXPLORE TICKETS</span><h1>NFTチケットを探す</h1><p>${connected?`${escapeHtml(connected.name)}を接続中です。`:"接続するウォレットを選んで購入できます。"}</p></div><span class="task-callout">${connected?`残高 ${fmtEth(connected.ethBalance)}`:"購入前にウォレット接続が必要"}</span></div>
    <section class="airdrop-market-banner ${rewardOwned?"unlocked":""}"><div><span>${rewardOwned?"AIRDROP RECEIVED":"LIMITED AIRDROP"}</span><h2>${rewardOwned?"NEXUS FUTURE PASSを獲得しました":"NFTチケットを3枚購入して限定NFTを獲得"}</h2><p>${rewardOwned?"限定NFTはOrbit Walletの保有NFTから確認できます。":`同じチケットを複数購入しても対象です。現在${purchaseCount}枚購入済み、あと${airdropRemaining}枚。`}</p></div><div class="airdrop-mini-art"><img src="${airdropTicket().image}" alt="" aria-hidden="true"></div></section>
    ${!connected?`<div class="notice warning" style="margin-top:17px">${walletReady?`右上の「ウォレットを接続」から使用するOrbit Walletを選択してください。接続時にメッセージ署名が求められます。`:`Orbit Walletを作成すると、このチケットサイトに接続できます。先にウォレット画面で作成を完了してください。`}</div>`:""}
    <div class="ticket-grid">${tickets.filter(t=>!t.airdropOnly).map(t=>ticketCard(t,true,false)).join("")}</div>`;
  if($("openOwnedNft"))$("openOwnedNft").onclick=()=>{state.activeWalletId=connected.id;syncLegacyWalletState();switchApp("wallet");state.currentWalletTab="wallet-nft";renderWallet()};
  if($("downloadResult"))$("downloadResult").onclick=downloadResult;
  document.querySelectorAll("[data-select-ticket]").forEach(b=>b.onclick=()=>{
    if(!walletReady){error("先にOrbit Walletを作成してください");return}
    if(!connectedWallet()){error("先にウォレットを接続してください");return}
    state.selectedTicketId=b.dataset.selectTicket;log("ticket_selected",{ticket_id:state.selectedTicketId});renderMarket();openPurchaseModal();
  });
}
function ticketCard(t,selectable,owned,holdingNumber=null,ownedIndex=null){
  if(!t)return"";
  const marketWallet=connectedWallet();
  const count=state.ownedNfts.filter(item=>item.ticketId===t.id&&(!selectable||(marketWallet&&nftOwnerWalletId(item)===marketWallet.id))).length;
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
  $("viewAirdropReward").onclick=()=>{closeModal();if(walletById(reward.ownerWalletId)){state.activeWalletId=reward.ownerWalletId;syncLegacyWalletState()}switchApp("wallet");state.currentWalletTab="wallet-nft";renderWallet()};
}
function connectMarketWallet(){
  if(!state.wallets.length){error("先にOrbit Walletを作成してください");return}
  if(state.wallets.length>1){openMarketWalletSelector();return}
  const wallet=state.wallets[0];
  if(state.marketConnected&&state.connectedWalletId===wallet.id){toast(`${wallet.name}は接続済みです`);return}
  openMarketConnectionSignature(wallet.id);
}
function openMarketWalletSelector(){
  const current=connectedWallet();
  openModal("SELECT WALLET","接続するウォレットを選択",`
    <p class="wallet-selection-intro">MintGateで購入に使用するウォレットを選んでください。購入代金とNFTは選択したウォレットに反映されます。</p>
    <div class="market-wallet-selection">${state.wallets.map(wallet=>`<button class="market-wallet-option ${wallet.id===current?.id?"connected":""}" data-market-wallet-id="${escapeHtml(wallet.id)}" type="button">
      <span class="market-wallet-option-head"><span class="market-wallet-option-icon">O</span><span><strong>${escapeHtml(wallet.name)}</strong><small>${wallet.id===current?.id?"現在接続中":"接続して署名"}</small></span><b>${fmtEth(wallet.ethBalance)}</b></span>
      <span class="market-wallet-public-label">公開鍵</span><code>${escapeHtml(wallet.address)}</code>
    </button>`).join("")}</div>
    <button id="cancelWalletSelection" class="secondary" style="width:100%;margin-top:14px" type="button">キャンセル</button>`);
  document.querySelectorAll("[data-market-wallet-id]").forEach(button=>button.onclick=()=>openMarketConnectionSignature(button.dataset.marketWalletId));
  $("cancelWalletSelection").onclick=closeModal;
}
function openMarketConnectionSignature(walletId){
  const wallet=walletById(walletId);if(!wallet){error("選択したウォレットを確認できません");return}
  openModal("CONNECT WALLET","Orbit Walletを接続",`
    <div class="signature-card connection-signature-card"><div class="signature-head"><span class="signature-icon">O</span><div><strong>署名リクエスト</strong><small>MintGateへの接続を確認</small></div></div>
      <div class="signature-details"><p class="hint">この署名はウォレット所有者であることを証明するもので、ガス代（手数料）や資産移動は発生しません。</p>
      <div class="risk-row"><span>選択ウォレット</span><strong>${escapeHtml(wallet.name)} · ${fmtEth(wallet.ethBalance)}</strong></div>
      <div class="signature-message">Welcome to MintGate.<br><br>Wallet: ${escapeHtml(wallet.address)}<br>Nonce: MG-${Date.now().toString().slice(-6)}<br>Purpose: Sign in to MintGate</div>
      <div class="risk-row"><span>要求元</span><strong>mintgate.demo</strong></div><div class="risk-row"><span>資産移動</span><strong>なし</strong></div></div></div>
    <label class="check" style="margin-top:14px"><input id="connectUnderstand" type="checkbox"><span>署名内容と要求元を確認しました。</span></label>
    <div class="button-row" style="margin-top:15px"><button id="signConnect" class="primary" type="button">メッセージに署名</button><button id="rejectConnect" class="secondary" type="button">拒否</button></div>`);
  $("modal").scrollTop=0;startSignatureGuide(wallet.id);
  $("rejectConnect").onclick=()=>{log("signature_rejected",{purpose:"connect"});closeModal()};
  $("signConnect").onclick=()=>{
    if(!$("connectUnderstand").checked){error("署名内容を確認してください");return}
    const completesMission=!missionStatus("connect");
    state.signatureCount++;state.connectionSigned=true;state.marketConnected=true;state.connectedWalletId=wallet.id;
    log("message_signed",{purpose:"market_connect",wallet_id:wallet.id,address:wallet.address});closeModal();renderAll();if(!completesMission)toast(`${wallet.name}をMintGateに接続しました`);
  };
}
function openPurchaseModal(){
  const t=ticket(),wallet=connectedWallet();if(!t)return;
  if(!wallet){error("接続中のウォレットを確認できません");renderMarket();return}
  const total=t.price+PURCHASE_GAS_ETH;
  openModal("CHECKOUT","NFTチケットを購入",`
    <div class="summary"><div class="summary-row"><span>商品</span><strong>${t.title}</strong></div><div class="summary-row"><span>支払い元</span><strong>${escapeHtml(wallet.name)}</strong></div><div class="summary-row"><span>NFT価格</span><strong>${fmtEth(t.price)}</strong></div><div class="summary-row"><span>推定ガス代（手数料）</span><strong>${fmtEth(PURCHASE_GAS_ETH)}</strong></div><div class="summary-row"><span>支払合計</span><strong>${fmtEth(total)}</strong></div><div class="summary-row"><span>ウォレット残高</span><strong>${fmtEth(wallet.ethBalance)}</strong></div></div>
    ${wallet.ethBalance<total?`<div class="notice danger" style="margin-top:13px">${escapeHtml(wallet.name)}の残高が不足しています。別のウォレットを接続するか、ETHを追加送金してください。</div>`:`<div class="notice info" style="margin-top:13px">次に${escapeHtml(wallet.name)}で購入トランザクションを確認・署名します。</div>`}
    <div class="button-row" style="margin-top:15px"><button id="continuePurchase" class="primary" type="button" ${wallet.ethBalance<total?"disabled":""}>ウォレットで確認</button><button id="cancelPurchase" class="secondary" type="button">キャンセル</button></div>`);
  $("cancelPurchase").onclick=closeModal;
  $("continuePurchase").onclick=()=>openTransactionSignature();
}
function openTransactionSignature(){
  const t=ticket(),wallet=connectedWallet();if(!t||!wallet){error("接続中のウォレットを確認できません");closeModal();return}const total=t.price+PURCHASE_GAS_ETH;
  openModal("ORBIT WALLET","トランザクションを確認",`
    <div class="signature-card purchase-signature-card"><div class="signature-head"><span class="signature-icon">O</span><div><strong>コントラクト実行</strong><small>Ethereum Mainnet（疑似）</small></div></div>
    <div class="signature-details"><div class="risk-row"><span>署名ウォレット</span><strong>${escapeHtml(wallet.name)}</strong></div><div class="risk-row"><span>公開鍵</span><strong style="max-width:270px;overflow-wrap:anywhere">${escapeHtml(wallet.address)}</strong></div><div class="risk-row"><span>接続先</span><strong>MintGate</strong></div><div class="risk-row"><span>操作</span><strong>NFTチケット購入</strong></div><div class="risk-row"><span>コントラクト</span><strong>0x91D2...44AF</strong></div><div class="risk-row"><span>NFT価格</span><strong>${fmtEth(t.price)}</strong></div><div class="risk-row"><span>推定ガス代（手数料）</span><strong>${fmtEth(PURCHASE_GAS_ETH)}</strong></div><div class="risk-row"><span>最大支払額</span><strong>${fmtEth(total)}</strong></div></div></div>
    <div class="notice warning" style="margin-top:13px">署名すると、ブロックチェーンへ購入トランザクションが送信されます。内容を確認してください。</div>
    <label class="check" style="margin-top:14px"><input id="txUnderstand" type="checkbox"><span>送信先、金額、ガス代（手数料）、コントラクトの内容を確認しました。</span></label>
    <div class="button-row" style="margin-top:15px"><button id="signTransaction" class="primary" type="button">確認して署名</button><button id="rejectTransaction" class="secondary" type="button">拒否</button></div>`);
  $("modal").scrollTop=0;startContractGuide(wallet.id);
  $("rejectTransaction").onclick=()=>{log("signature_rejected",{purpose:"purchase"});closeModal()};
  $("signTransaction").onclick=()=>{
    if(!$("txUnderstand").checked){error("トランザクション内容を確認してください");return}
    if(wallet.ethBalance<total){error("ウォレット残高が不足しています");closeModal();renderMarket();return}
    state.signatureCount++;state.purchaseSigned=true;wallet.ethBalance-=total;state.pendingPurchaseWalletId=wallet.id;syncLegacyWalletState();log("transaction_signed",{ticket_id:t.id,total_eth:total,wallet_id:wallet.id,address:wallet.address});
    openTransactionPending();
  };
}
function openTransactionPending(){
  state.pendingPurchaseTicketId=state.selectedTicketId;
  if(!state.pendingPurchaseWalletId)state.pendingPurchaseWalletId=connectedWallet()?.id||null;
  state.purchaseCompletesAt=Date.now()+PURCHASE_DELAY_MS;
  showTransactionPending();schedulePurchaseCompletion(PURCHASE_DELAY_MS);
}
function showTransactionPending(){
  openModal("TRANSACTION","購入処理を送信中",`<div class="transaction-status"><div class="spinner"></div><h3>ネットワーク承認を待っています</h3><p>署名済みトランザクションをEthereumネットワークへ送信しました。</p></div>`,false);
}
function completePurchase(){
  const purchasedTicketId=state.pendingPurchaseTicketId,purchaseWallet=walletById(state.pendingPurchaseWalletId)||connectedWallet();
  if(!purchasedTicketId)return;
  if(!purchaseWallet){state.pendingPurchaseTicketId=null;state.pendingPurchaseWalletId=null;state.purchaseCompletesAt=null;closeModal();error("購入先ウォレットを確認できませんでした");return}
  const completesMission=!missionStatus("purchase");
  const purchasedNft={tokenId:`MG-${Date.now().toString().slice(-8)}`,ticketId:purchasedTicketId,purchasedAt:now(),acquisitionType:"purchase",ownerWalletId:purchaseWallet.id,ownerAddress:purchaseWallet.address};
  state.ownedNfts.push(purchasedNft);
  if(!state.firstPurchasedNftTokenId)state.firstPurchasedNftTokenId=purchasedNft.tokenId;
  state.nftOwned=true;if(!state.completedAt)state.completedAt=now();
  log("nft_purchase_confirmed",{ticket_id:purchasedTicketId,owned_count:state.ownedNfts.length,wallet_id:purchaseWallet.id,address:purchaseWallet.address});
  const airdropReward=maybeGrantAirdrop("purchase_threshold",purchaseWallet.id);
  state.pendingPurchaseTicketId=null;state.pendingPurchaseWalletId=null;state.purchaseCompletesAt=null;closeModal();renderAll();
  if(airdropReward)showAirdropReward(airdropReward);else if(!completesMission)toast(`${purchaseWallet.name}にNFTチケットを追加しました`);
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
  clearTimeout(persistTimer);clearTimeout(transferTimer);clearTimeout(purchaseTimer);clearTimeout(completionProgressGuideTimer);stopTicker();
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
function closeModal(){closeSignatureGuide(false);$("modal").classList.add("hidden");$("modalBackdrop").classList.add("hidden")}
function formatDuration(s){const m=Math.floor(s/60),r=s%60;return m?`${m}分${r}秒`:`${r}秒`}
function benefitResult(ticketId){
  const program=benefitProgram(ticketId),progress=gameProgress(ticketId);
  return {game_play_count:progress.playCount,last_score:progress.lastScore,best_score:progress.bestScore,
    unlocked:program.benefits.filter(benefit=>benefitUnlocked(ticketId,benefit)).map(benefit=>({score:benefit.score,title:benefit.title,code:benefit.code,unlocked_at:progress.benefitsUnlockedAt[benefit.score]}))};
}
function resultData(){
  if(state.appEnteredAt!==null){state.appTimes[state.currentApp]+=Math.round((performance.now()-state.appEnteredAt)/1000);state.appEnteredAt=performance.now()}
  const currentWallet=activeWallet(),marketWallet=connectedWallet();
  return {participant_id:state.participantId,condition:"multi_service_traditional_nft_flow",started_at:state.startedAt,completed_at:state.completedAt,
    completion_time_seconds:state.completedAt?Math.round((new Date(state.completedAt)-new Date(state.startedAt))/1000):null,
    app_switch_count:state.appSwitchCount,help_open_count:state.helpOpenCount,copy_count:state.copyCount,paste_count:state.pasteCount,
    signature_count:state.signatureCount,validation_error_count:state.validationErrors,app_times_seconds:state.appTimes,
    exchange:{yen_balance:state.exchangeYen,eth_purchased_total:state.purchasedEth,last_rate_at_purchase:state.ethPriceAtPurchase,eth_remaining:state.exchangeEth,purchase_history:state.purchaseHistory},
    wallet:{active_wallet_id:currentWallet?.id||null,address:currentWallet?.address||null,eth_balance:currentWallet?.ethBalance||0,wallet_count:state.wallets.length,wallets:state.wallets.map(wallet=>({id:wallet.id,name:wallet.name,address:wallet.address,eth_balance:wallet.ethBalance,created_at:wallet.createdAt,owned_nfts:ownedNftsForWallet(wallet.id)})),transfer_amount:state.transferAmount,transfer_received:state.transferReceived,receipt_checked:state.receiptChecked,owned_nfts:state.ownedNfts,
      nova_live_benefits:benefitResult("nova-live"),digital_art_benefits:benefitResult("digital-art"),skyline_fest_benefits:benefitResult("skyline-fest"),anime_creator_expo_benefits:benefitResult("creator-expo"),bay_area_light_show_benefits:benefitResult("light-show")},
    marketplace:{connected:state.marketConnected,connected_wallet_id:marketWallet?.id||null,connected_wallet_address:marketWallet?.address||null,connected_wallet_eth_balance:marketWallet?.ethBalance||null,selected_ticket:state.selectedTicketId,purchase_signed:state.purchaseSigned,nft_owned:state.ownedNfts.length>0,nft_count:state.ownedNfts.length,purchased_nft_count:purchasedNftCount(),purchases:state.ownedNfts,admission_pass_viewed:state.admissionPassViewed,
      airdrop:{threshold:AIRDROP_PURCHASE_THRESHOLD,received:ownsTicket(AIRDROP_TICKET_ID),ticket_id:AIRDROP_TICKET_ID}},
    event_log:state.eventLog};
}
function downloadResult(){
  const blob=new Blob([JSON.stringify(resultData(),null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`${state.participantId}_multi_service_flow.json`;a.click();URL.revokeObjectURL(url);
}

$("startButton").onclick=start;
$("progressGuideStart").onclick=closeProgressGuide;
$("exchangeBalanceGuideClose").onclick=closeExchangeBalanceGuide;
$("walletSecurityGuideNext").onclick=advanceWalletSecurityGuide;
$("nftOwnershipGuideNext").onclick=advanceNftOwnershipGuide;
$("signatureGuideClose").onclick=closeSignatureGuide;
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
$("admissionResaleGuideClose").onclick=closeAdmissionResaleGuide;
$("gameClose").onclick=closeGameExperience;
$("resetProgressButton").onclick=openResetConfirmation;
window.addEventListener("pagehide",persistState);
window.addEventListener("resize",()=>{
  if(exchangeBalanceGuideOpen())requestAnimationFrame(()=>{positionExchangeBalanceGuide();keepExchangeBalanceGuideTargetInView();positionExchangeBalanceGuide()});
  if(walletSecurityGuideOpen())requestAnimationFrame(()=>{positionWalletSecurityGuide();keepWalletSecurityGuideTargetInView();positionWalletSecurityGuide()});
  if(nftOwnershipGuideOpen())requestAnimationFrame(()=>{positionNftOwnershipGuide();keepNftOwnershipGuideTargetInView();positionNftOwnershipGuide()});
  if(signatureGuideOpen())requestAnimationFrame(positionSignatureGuide);
  if(admissionResaleGuideOpen())requestAnimationFrame(()=>{positionAdmissionResaleGuide();keepAdmissionResaleGuideTargetInView();positionAdmissionResaleGuide()});
  scheduleGuidePositionRefresh(6);
});
window.addEventListener("scroll",()=>{
  if(exchangeBalanceGuideOpen())requestAnimationFrame(positionExchangeBalanceGuide);
  if(walletSecurityGuideOpen())requestAnimationFrame(positionWalletSecurityGuide);
  if(nftOwnershipGuideOpen())requestAnimationFrame(positionNftOwnershipGuide);
  if(signatureGuideOpen())requestAnimationFrame(positionSignatureGuide);
  if(admissionResaleGuideOpen())requestAnimationFrame(positionAdmissionResaleGuide);
  scheduleGuidePositionRefresh(2);
},{passive:true});
if(window.visualViewport){
  window.visualViewport.addEventListener("resize",()=>scheduleGuidePositionRefresh(6),{passive:true});
  window.visualViewport.addEventListener("scroll",()=>scheduleGuidePositionRefresh(3),{passive:true});
}
document.addEventListener("touchmove",preventMobileGuideViewportScroll,{passive:false});
document.addEventListener("touchstart",recordMobileGuideTouchStart,{passive:true});
window.addEventListener("wheel",preventMobileGuideViewportScroll,{passive:false});
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
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(admissionResaleGuideOpen())closeAdmissionResaleGuide();else if(signatureGuideOpen())closeSignatureGuide();else if(nftOwnershipGuideOpen())closeNftOwnershipGuide();else if(progressGuideOpen())closeProgressGuide();else if(!$("admissionSignatureSheet").classList.contains("hidden"))cancelAdmissionAuthentication();else if(!$("admissionPass").classList.contains("hidden"))closeAdmissionPass();else if(!$("gameExperience").classList.contains("hidden"))closeGameExperience();else{closeModal();closeHelp()}}});
restoreSession();
