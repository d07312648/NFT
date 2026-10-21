/* PassMarket のNFTアートを、シード値から毎回同じ見た目のSVGとして生成する（画像ファイル不要） */
const NftArt=(()=>{
  const TIER_SHARE=[55,25,12,6,2];
  const TIER_LABELS=["コモン","アンコモン","レア","エピック","レジェンダリー"];
  const cache=new Map();

  function hash(text){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
  function rng(seed){
    let a=hash(String(seed))||1;
    return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
  }
  const pick=(r,list)=>list[Math.floor(r()*list.length)];
  const between=(r,min,max)=>min+r()*(max-min);
  const round=v=>Math.round(v*10)/10;
  const esc=v=>String(v).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  function shade(hex,amount){
    const n=parseInt(hex.slice(1),16),target=amount<0?0:255,p=Math.abs(amount);
    const mix=c=>Math.round(c+(target-c)*p);
    return `#${[n>>16&255,n>>8&255,n&255].map(c=>mix(c).toString(16).padStart(2,"0")).join("")}`;
  }
  function choose(r,options,tier){
    const pool=options.filter(o=>(o.tier||0)<=tier);
    const special=pool.filter(o=>tier>0&&(o.tier||0)===tier);
    const list=special.length&&r()<.6?special:pool;
    let x=r()*list.reduce((sum,o)=>sum+(o.w||1),0);
    for(const o of list){x-=o.w||1;if(x<=0)return o}
    return list[list.length-1];
  }
  function share(options,option){return Math.max(1,Math.round((option.w||1)/options.reduce((sum,o)=>sum+(o.w||1),0)*100))}
  const svg=(body,viewBox="0 0 400 400",extra="")=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="400" height="400"${extra}>${body}</svg>`;
  const vText=(chars,x,y,step,attrs)=>[...chars].map((c,i)=>`<text x="${x}" y="${y+i*step}" text-anchor="middle" ${attrs}>${esc(c)}</text>`).join("");
  const MINCHO="font-family=\"'Hiragino Mincho ProN','Yu Mincho','YuMincho','Noto Serif JP',serif\"";
  const GOTHIC="font-family=\"'Hiragino Sans','Yu Gothic','Noto Sans JP',Inter,sans-serif\"";

  /* ---------- MOMO PIXEL FRIENDS ---------- */
  function drawPixel(r,t){
    const W=24,grid=Array.from({length:W},()=>Array(W).fill(null));
    const set=(x,y,c)=>{if(x>=0&&y>=0&&x<W&&y<W)grid[y][x]=c};
    const sym=(x,y,c)=>{set(x,y,c);set(W-1-x,y,c)};
    const body=t.body.c,dark=shade(body,-.55),belly=shade(body,.45),inner=shade(body,-.18);
    const silhouette=new Set(),key=(x,y)=>`${x},${y}`;
    const addSym=(x,y)=>{silhouette.add(key(x,y));silhouette.add(key(W-1-x,y))};
    const inBody=(x,y)=>((x-11.5)/8.3)**2+((y-14.5)/7.4)**2<=1;
    for(let y=0;y<W;y++)for(let x=0;x<W;x++)if(inBody(x,y))silhouette.add(key(x,y));
    const ears=t.ears.v,innerEar=[];
    if(ears==="ねこみみ"){[[4,6,6],[5,5,7],[6,5,8],[7,4,8],[8,4,9]].forEach(([y,a,b])=>{for(let x=a;x<=b;x++)addSym(x,y)});innerEar.push([6,6],[6,7],[7,7])}
    if(ears==="うさみみ"){for(let y=1;y<=8;y++)for(let x=7;x<=9;x++)if(!(y===1&&x!==8))addSym(x,y);for(let y=2;y<=7;y++)innerEar.push([8,y])}
    if(ears==="まるみみ"||ears==="ユニコーン"){for(let y=4;y<=10;y++)for(let x=3;x<=10;x++)if((x-6)**2+(y-7)**2<=5.3)addSym(x,y);innerEar.push([6,7])}
    if(ears==="くまみみ"){for(let y=4;y<=11;y++)for(let x=2;x<=10;x++)if((x-5.5)**2+(y-7.5)**2<=6.8)addSym(x,y);innerEar.push([5,7],[6,7],[5,8],[6,8])}
    const bg=t.bg.c;
    for(let y=0;y<W;y++)for(let x=0;x<W;x++){
      if(silhouette.has(key(x,y)))continue;
      if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>silhouette.has(key(x+dx,y+dy))))set(x,y,dark);
    }
    silhouette.forEach(cell=>{const [x,y]=cell.split(",").map(Number);set(x,y,body)});
    for(let y=0;y<W;y++)for(let x=0;x<W;x++)if(inBody(x,y)&&((x-11.5)/4.3)**2+((y-19)/2.5)**2<=1)set(x,y,belly);
    innerEar.forEach(([x,y])=>sym(x,y,ears==="くまみみ"?inner:"#ff9db5"));
    const ink="#2a2238";
    const eyes=t.eyes.v;
    if(eyes==="ぱっちり"||eyes==="きらきら"){
      [[8,12],[9,12],[8,13],[9,13],[14,12],[15,12],[14,13],[15,13]].forEach(([x,y])=>set(x,y,ink));
      set(8,12,"#fff");set(14,12,"#fff");
      if(eyes==="きらきら"){set(9,13,"#fff");set(15,13,"#fff");set(10,11,"#ffe066");set(16,11,"#ffe066")}
    }
    if(eyes==="にこにこ")[[7,13],[8,12],[9,13],[14,13],[15,12],[16,13]].forEach(([x,y])=>set(x,y,ink));
    if(eyes==="ねむねむ")[[7,13],[8,13],[9,13],[14,13],[15,13],[16,13]].forEach(([x,y])=>set(x,y,ink));
    if(eyes==="サングラス"){
      for(let x=6;x<=17;x++)set(x,12,"#1d1d2b");
      [7,8,9,10,13,14,15,16].forEach(x=>set(x,13,"#1d1d2b"));
      set(8,13,"#6c7bd8");set(14,13,"#6c7bd8");
    }
    if(eyes==="ハート")[[7,12],[9,12],[7,13],[8,13],[9,13],[8,14],[14,12],[16,12],[14,13],[15,13],[16,13],[15,14]].forEach(([x,y])=>set(x,y,"#ff4d7a"));
    if(eyes!=="サングラス")[[6,15],[7,15]].forEach(([x,y])=>sym(x,y,"#ff9db5"));
    [[10,15],[11,16],[12,16],[13,15]].forEach(([x,y])=>set(x,y,ink));
    const acc=t.acc.v;
    if(acc==="リボン"){[[15,7],[15,8],[15,9],[16,8],[18,8],[19,7],[19,8],[19,9]].forEach(([x,y])=>set(x,y,"#ff5c8a"));set(17,8,"#d63a6a")}
    if(acc==="ヘッドホン"){
      for(let x=8;x<=15;x++)set(x,4,"#3a3f58");
      [[6,5],[7,5],[5,6],[5,7],[4,8],[4,9],[4,10]].forEach(([x,y])=>sym(x,y,"#3a3f58"));
      for(let y=11;y<=14;y++)for(let x=2;x<=4;x++)sym(x,y,"#5964ff");
    }
    if(acc==="キャップ"){
      for(let x=8;x<=15;x++)set(x,6,"#2f80ed");for(let x=7;x<=16;x++)set(x,7,"#2f80ed");for(let x=6;x<=17;x++)set(x,8,"#2f80ed");
      for(let x=16;x<=20;x++)set(x,9,"#1c5fc4");set(11,5,"#1c5fc4");set(12,5,"#1c5fc4");
    }
    if(acc==="花かんむり"){
      for(let x=5;x<=18;x++)set(x,8,"#4caf50");
      [6,9,12,15,18].forEach((fx,i)=>{const petal=i%2?"#ffffff":"#ff8fb1";set(fx,7,"#ffd54f");set(fx-1,7,petal);set(fx+1,7,petal);set(fx,6,petal)});
    }
    if(acc==="王冠"){
      for(let y=6;y<=7;y++)for(let x=8;x<=15;x++)set(x,y,"#ffc93c");
      [[8,5],[8,4],[11,5],[12,5],[11,4],[12,4],[11,3],[12,3],[15,5],[15,4],[9,5],[14,5]].forEach(([x,y])=>set(x,y,"#ffc93c"));
      set(10,6,"#ff3b6b");set(13,6,"#3b8bff");for(let x=8;x<=15;x++)set(x,7,"#d79b00");
    }
    if(acc==="天使の輪"){for(let x=8;x<=15;x++){set(x,1,"#ffd54f");set(x,3,"#ffd54f")}set(7,2,"#ffd54f");set(16,2,"#ffd54f")}
    if(ears==="ユニコーン")for(let y=1;y<=6;y++){set(11,y,y%2?"#ffd54f":"#ff9db5");set(12,y,y%2?"#ff9db5":"#ffd54f")}
    for(let x=6;x<=17;x++)if(!grid[22][x])set(x,22,shade(bg==="#1b1840"?"#3a3570":bg,-.12));
    let body2=`<rect width="24" height="24" fill="${bg==="#ffd56a"?"url(#g)":bg}"/>`;
    if(bg==="#1b1840")for(let i=0;i<22;i++){const x=Math.floor(r()*W),y=Math.floor(r()*W);if(!grid[y][x])body2+=`<rect x="${x}" y="${y}" width="1" height="1" fill="${r()<.3?"#ffe066":"#fff"}" opacity="${round(between(r,.4,1))}"/>`}
    if(bg==="#ffd56a")for(let i=0;i<10;i++){const x=Math.floor(r()*W),y=Math.floor(r()*W);if(!grid[y][x])body2+=`<rect x="${x}" y="${y}" width="1" height="1" fill="#fff8d6"/>`}
    for(let y=0;y<W;y++){
      let x=0;
      while(x<W){
        const c=grid[y][x];if(!c){x++;continue}
        let end=x;while(end+1<W&&grid[y][end+1]===c)end++;
        body2+=`<rect x="${x}" y="${y}" width="${end-x+1}" height="1" fill="${c}"/>`;x=end+1;
      }
    }
    return svg(`<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1a8"/><stop offset="1" stop-color="#f4b740"/></linearGradient></defs>${body2}`,"0 0 24 24",' shape-rendering="crispEdges"');
  }

  /* ---------- NEO TOKYO NIGHTS ---------- */
  function drawSkyline(r,t){
    const [s1,s2,s3]=t.time.sky,glow=t.time.glow,night=["真夜中","ネオン","オーロラ"].includes(t.time.v);
    let out=`<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s1}"/><stop offset=".6" stop-color="${s2}"/><stop offset="1" stop-color="${s3}"/></linearGradient><linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s3}" stop-opacity=".55"/><stop offset="1" stop-color="#05060f"/></linearGradient><linearGradient id="aur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${glow}" stop-opacity=".0"/><stop offset=".5" stop-color="${glow}" stop-opacity=".55"/><stop offset="1" stop-color="#b388ff" stop-opacity="0"/></linearGradient></defs><rect width="400" height="400" fill="url(#sky)"/>`;
    if(night||t.time.v==="夕暮れ")for(let i=0;i<(night?60:18);i++)out+=`<circle cx="${round(r()*400)}" cy="${round(r()*220)}" r="${round(between(r,.5,1.6))}" fill="#fff" opacity="${round(between(r,.3,.9))}"/>`;
    if(t.time.v==="オーロラ")for(let i=0;i<3;i++){const y=50+i*35;out+=`<path d="M-20 ${y+60} C 80 ${y-10}, 160 ${y+90}, 240 ${y+20} S 380 ${y-20}, 430 ${y+40} L 430 ${y+120} C 300 ${y+60}, 160 ${y+150}, -20 ${y+130} Z" fill="url(#aur)" opacity="${.5-i*.12}"/>`}
    const big=t.landmark.v==="満月";
    out+=`<circle cx="${big?270:305}" cy="${big?130:85}" r="${big?72:24}" fill="${glow}" opacity=".95"/>`;
    if(big)out+=`<circle cx="250" cy="115" r="12" fill="#000" opacity=".06"/><circle cx="292" cy="150" r="17" fill="#000" opacity=".05"/><circle cx="280" cy="98" r="7" fill="#000" opacity=".06"/>`;
    const layer=(base,minH,maxH,fill,windows,opacity=1)=>{
      let x=-12,g="";
      while(x<410){
        const w=between(r,22,52),h=between(r,minH,maxH),top=base-h;
        g+=`<rect x="${round(x)}" y="${round(top)}" width="${round(w)}" height="${round(h+80)}" fill="${fill}" opacity="${opacity}"/>`;
        if(r()<.25)g+=`<rect x="${round(x+w/2-1.5)}" y="${round(top-14)}" width="3" height="14" fill="${fill}" opacity="${opacity}"/>`;
        if(windows)for(let wy=top+8;wy<base-6;wy+=11)for(let wx=x+5;wx<x+w-6;wx+=9)if(r()<windows){
          const lit=t.lights.v==="虹色"?pick(r,["#ff6ad5","#c774e8","#ad8cff","#94d0ff","#7cffcb","#ffd27a"]):pick(r,["#ffd27a","#ffe7a8","#fff4d6"]);
          g+=`<rect x="${round(wx)}" y="${round(wy)}" width="4" height="5" fill="${lit}" opacity="${round(between(r,.65,1))}"/>`;
        }
        x+=w+between(r,-4,6);
      }
      return g;
    };
    out+=layer(330,90,210,night?"#1b2147":"#4b3f72",0,.55);
    if(t.landmark.v==="電波塔")out+=`<g stroke="#ff5a36" stroke-width="4" fill="none"><path d="M120 70 L92 330 M120 70 L148 330"/><path d="M106 150 H134 M100 220 H140 M96 280 H144" stroke="#fff" stroke-width="5"/><path d="M120 40 V70" stroke-width="2"/></g>`;
    if(t.landmark.v==="観覧車"){out+=`<g stroke="#ffd166" stroke-width="2.5" fill="none" opacity=".9"><circle cx="318" cy="218" r="72"/>`;for(let i=0;i<12;i++){const a=i*Math.PI/6;out+=`<path d="M318 218 L ${round(318+72*Math.cos(a))} ${round(218+72*Math.sin(a))}"/><circle cx="${round(318+72*Math.cos(a))}" cy="${round(218+72*Math.sin(a))}" r="4" fill="${pick(r,["#ff6ad5","#7cffcb","#ffd166","#94d0ff"])}" stroke="none"/>`}out+=`<path d="M300 330 L318 218 L336 330"/></g>`}
    if(t.landmark.v==="高層タワー")out+=`<path d="M200 28 L206 120 L212 200 L222 330 H178 L188 200 L194 120 Z" fill="#cfe3ff" opacity=".85"/><rect x="186" y="150" width="28" height="9" rx="3" fill="${glow}"/><rect x="183" y="205" width="34" height="11" rx="4" fill="${glow}"/>`;
    out+=layer(330,60,170,night?"#141834":"#2e2650",night?(t.lights.v==="まばら"?.18:.42):.12);
    out+=layer(345,30,105,night?"#0b0d20":"#1d1736",night?(t.lights.v==="まばら"?.12:.3):.06);
    out+=`<rect y="335" width="400" height="65" fill="url(#sea)"/>`;
    for(let i=0;i<26;i++)out+=`<rect x="${round(r()*390)}" y="${round(between(r,340,395))}" width="${round(between(r,10,36))}" height="1.6" fill="${glow}" opacity="${round(between(r,.15,.45))}"/>`;
    if(t.weather.v==="雨")for(let i=0;i<90;i++){const x=r()*440-20,y=r()*400;out+=`<path d="M${round(x)} ${round(y)} l -6 16" stroke="#cfe0ff" stroke-width="1.2" opacity=".35"/>`}
    if(t.weather.v==="雪")for(let i=0;i<70;i++)out+=`<circle cx="${round(r()*400)}" cy="${round(r()*400)}" r="${round(between(r,1,2.8))}" fill="#fff" opacity="${round(between(r,.5,.95))}"/>`;
    if(t.weather.v==="流星群")for(let i=0;i<6;i++){const x=between(r,40,360),y=between(r,20,160);out+=`<path d="M${round(x)} ${round(y)} l -46 24" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/><circle cx="${round(x)}" cy="${round(y)}" r="2.4" fill="#fff"/>`}
    return svg(out);
  }

  /* ---------- WAVE GENESIS ---------- */
  function drawWave(r,t){
    const c=t.palette.c,amp=t.motion.amp,count=Math.floor(between(r,9,14));
    let out=`<rect width="400" height="400" fill="${c[0]}"/>`;
    const orb=t.orb.v,light=c[c.length-1];
    if(orb==="日の出")out+=`<circle cx="${round(between(r,120,280))}" cy="150" r="62" fill="${c[c.length-2]}"/>`;
    if(orb==="満月")out+=`<circle cx="${round(between(r,110,290))}" cy="120" r="48" fill="${light}" opacity=".95"/>`;
    if(orb==="ふたつの月")out+=`<circle cx="130" cy="110" r="40" fill="${light}"/><circle cx="270" cy="150" r="26" fill="${c[c.length-2]}"/>`;
    for(let i=0;i<count;i++){
      const base=130+i*(270/count),f1=between(r,.012,.03),f2=between(r,.03,.06),p1=r()*6.28,p2=r()*6.28,a=amp*between(r,.6,1.2);
      let d=`M -10 ${round(base)}`;
      for(let x=-10;x<=410;x+=10)d+=` L ${x} ${round(base+a*Math.sin(x*f1+p1)+a*.45*Math.sin(x*f2+p2))}`;
      d+=" L 410 410 L -10 410 Z";
      out+=`<path d="${d}" fill="${c[1+i%(c.length-1)]}" opacity=".93" stroke="#fff" stroke-opacity=".18" stroke-width="1.4"/>`;
    }
    if(t.motion.v==="渦潮"){
      let pts="";for(let a=0;a<Math.PI*10;a+=.18)pts+=`${round(200+(4+a*4.4)*Math.cos(a))},${round(255+(4+a*4.4)*Math.sin(a)*.75)} `;
      out+=`<polyline points="${pts}" fill="none" stroke="${light}" stroke-width="3" opacity=".75"/>`;
    }
    return svg(out);
  }

  /* ---------- FUJI 36 VIEWS ---------- */
  function drawFuji(r,t){
    const season=t.season,time=t.time.v,night=time==="夜";
    const sky=night?["#0d1b2a","#33415c"]:season.sky;
    let out=`<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient><linearGradient id="wt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fb8d8"/><stop offset="1" stop-color="#2d5f8a"/></linearGradient><clipPath id="water"><rect y="300" width="400" height="100"/></clipPath></defs><rect width="400" height="400" fill="url(#sk)"/>`;
    if(time==="夕")out+=`<rect width="400" height="300" fill="#ff7a3d" opacity=".28"/>`;
    if(night)for(let i=0;i<40;i++)out+=`<circle cx="${round(r()*400)}" cy="${round(r()*200)}" r="${round(between(r,.6,1.6))}" fill="#fff" opacity="${round(between(r,.4,.9))}"/>`;
    const sun={朝:[92,128,"#ff6b35"],昼:[312,78,"#fff3b0"],夕:[302,150,"#ff4d00"],夜:[312,78,"#f8f4e3"]}[time];
    out+=`<circle cx="${sun[0]}" cy="${sun[1]}" r="26" fill="${sun[2]}"/>`;
    for(let i=0;i<3;i++){const w=between(r,90,170),h=between(r,9,15),y=between(r,70,220);out+=`<rect x="${round(between(r,-40,320))}" y="${round(y)}" width="${round(w)}" height="${round(h)}" rx="${round(h/2)}" fill="#fff" opacity="${night?.18:.72}"/>`}
    const mountain=t.rock.c,cap=season.v==="冬"?"M163 150 L178 118 L222 118 L240 158 L228 150 L218 170 L206 154 L196 172 L184 152 L172 166 Z":"M178 118 L222 118 L236 148 L225 142 L214 156 L203 144 L193 158 L183 143 L170 152 Z";
    const fujiPath="M40 300 Q140 214 178 118 L222 118 Q260 214 360 300 Z";
    out+=`<path d="${fujiPath}" fill="${night?shade(mountain,-.35):mountain}"/><path d="M200 118 L222 118 Q260 214 360 300 L200 300 Z" fill="#000" opacity=".12"/><path d="${cap}" fill="${t.rock.v==="赤富士"?"#ffe4d6":"#ffffff"}" opacity="${night?.8:1}"/>`;
    const fore=t.fore.v;
    if(fore==="湖"||fore==="鳥居"){
      out+=`<rect y="300" width="400" height="100" fill="url(#wt)"/><g clip-path="url(#water)" opacity=".22"><path d="${fujiPath}" transform="translate(0 600) scale(1 -1)" fill="${mountain}"/></g>`;
      for(let i=0;i<14;i++)out+=`<rect x="${round(r()*380)}" y="${round(between(r,306,396))}" width="${round(between(r,14,50))}" height="1.6" fill="#fff" opacity=".5"/>`;
      if(fore==="鳥居")out+=`<g fill="#d62828"><rect x="286" y="262" width="7" height="88"/><rect x="327" y="262" width="7" height="88"/><path d="M270 256 Q310 248 350 256 L352 266 Q310 258 268 266 Z"/><rect x="278" y="278" width="64" height="6"/></g><rect x="284" y="345" width="54" height="3" fill="#000" opacity=".15"/>`;
    }else if(fore==="大波"){
      out+=`<rect y="292" width="400" height="108" fill="#1d3557"/><path d="M-10 400 L-10 300 C40 214 150 190 196 262 C160 236 116 248 110 292 C150 280 174 322 162 364 L162 400 Z" fill="#2c5d93"/><path d="M-10 330 C40 270 110 262 150 300" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>`;
      for(let i=0;i<12;i++){const a=i/11;out+=`<circle cx="${round(110+a*86+between(r,-4,4))}" cy="${round(256+Math.sin(a*3.1)*-18+between(r,-4,4))}" r="${round(between(r,4,8))}" fill="#fff"/>`}
      out+=`<path d="M190 400 C230 340 300 330 410 350 L410 400 Z" fill="#457b9d"/>`;
    }else{
      out+=`<path d="M-10 400 L-10 318 C80 296 160 330 240 312 C310 298 360 306 410 300 L410 400 Z" fill="${night?shade(season.hill,-.45):season.hill}"/>`;
      if(fore==="松")out+=`<path d="M60 400 C66 350 54 320 78 280 C90 262 104 250 122 246" stroke="#4a3426" stroke-width="9" fill="none" stroke-linecap="round"/><g fill="#1b4332"><ellipse cx="128" cy="244" rx="46" ry="12"/><ellipse cx="88" cy="272" rx="38" ry="10"/><ellipse cx="74" cy="312" rx="30" ry="9"/><ellipse cx="150" cy="226" rx="26" ry="8"/></g>`;
      if(fore==="桜"){
        out+=`<path d="M-10 40 C60 70 110 90 170 150 M80 80 C90 120 120 140 130 170" stroke="#5a3e36" stroke-width="6" fill="none" stroke-linecap="round"/>`;
        for(let i=0;i<34;i++)out+=`<circle cx="${round(between(r,0,180))}" cy="${round(between(r,30,180))}" r="${round(between(r,4,9))}" fill="${pick(r,["#ffafcc","#ffc8dd","#fff0f5"])}" opacity=".95"/>`;
        for(let i=0;i<12;i++){const x=round(between(r,40,380)),y=round(between(r,180,390));out+=`<ellipse cx="${x}" cy="${y}" rx="3.5" ry="2" fill="#ffc8dd" transform="rotate(${Math.round(r()*180)} ${x} ${y})" opacity=".85"/>`}
      }
    }
    const kanji={春:"春",夏:"夏",秋:"秋",冬:"冬"}[season.v];
    out+=`<rect x="8" y="8" width="384" height="384" fill="none" stroke="#3d2b1f" stroke-width="3"/><rect x="22" y="22" width="34" height="104" fill="#f1e3c8" stroke="#3d2b1f" stroke-width="1.5"/>${vText(`富嶽${kanji}`,39,48,26,`font-size="20" fill="#3d2b1f" ${MINCHO}`)}`;
    return svg(out);
  }

  /* ---------- STAR CARD ARENA ---------- */
  const CARD_NAMES=["アルス","ミラ","ゼノ","リオ","カイ","ノア","セラ","ルナ","ヴォルグ","ティア","オルカ","シエル"];
  const CARD_FLAVOR=["夜明けを告げる伝説の守護者","星の海を渡る孤高の戦士","古の契約に眠る力が目覚める","その咆哮は大地を震わせる","静かに燃える誇り高き魂","千年の時を越えて現れた"];
  function drawCard(r,t,tier,serial,title){
    const e=t.element,frames=[["#b7bcc6","#e3e6ec"],["#4f8cff","#9ec5ff"],["#8e5cff","#f0c75e"],["#d99a1e","#fff1b5"],["#ff5f6d","#47e891"]];
    const [f1,f2]=frames[tier];
    const atk=Math.round((900+tier*480+r()*700)/100)*100,def=Math.round((700+tier*420+r()*700)/100)*100;
    let out=`<defs><radialGradient id="glow" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="${e.c}" stop-opacity=".45"/><stop offset="1" stop-color="#11111b" stop-opacity="0"/></radialGradient><linearGradient id="fr" x1="0" y1="0" x2="1" y2="1">${tier===4?'<stop offset="0" stop-color="#ff5f6d"/><stop offset=".3" stop-color="#ffc371"/><stop offset=".55" stop-color="#47e891"/><stop offset=".8" stop-color="#4facfe"/><stop offset="1" stop-color="#a18cd1"/>':`<stop offset="0" stop-color="${f1}"/><stop offset=".5" stop-color="${f2}"/><stop offset="1" stop-color="${f1}"/>`}</linearGradient><radialGradient id="art" cx=".5" cy=".45" r=".7"><stop offset="0" stop-color="${e.c2}"/><stop offset=".55" stop-color="${e.c}"/><stop offset="1" stop-color="#181426"/></radialGradient><linearGradient id="holo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".45" stop-color="#fff" stop-opacity=".0"/><stop offset=".5" stop-color="#fff" stop-opacity=".35"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><clipPath id="win"><rect x="92" y="76" width="216" height="170" rx="6"/></clipPath></defs>`;
    out+=`<rect width="400" height="400" fill="#11111b"/><rect width="400" height="400" fill="url(#glow)"/><rect x="72" y="18" width="256" height="364" rx="16" fill="url(#fr)"/><rect x="84" y="30" width="232" height="340" rx="10" fill="#1c1d2b"/>`;
    out+=`<rect x="92" y="38" width="216" height="30" rx="6" fill="#fff" opacity=".08"/><text x="102" y="59" font-size="15" font-weight="800" fill="#fff" ${GOTHIC}>${esc(title.replace(/\s#.*/,""))}</text><circle cx="292" cy="53" r="11" fill="${e.c}"/><text x="292" y="58" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" ${GOTHIC}>${esc(e.v)}</text>`;
    out+=`<rect x="92" y="76" width="216" height="170" rx="6" fill="url(#art)"/><g clip-path="url(#win)">`;
    const ink="#120e22",eye=e.c2,sp=t.species.v;
    if(sp==="竜")out+=`<path d="M200 168 L112 104 L140 176 L118 190 L178 196 Z M200 168 L288 104 L260 176 L282 190 L222 196 Z" fill="${ink}" opacity=".8"/><ellipse cx="200" cy="200" rx="40" ry="32" fill="${ink}"/><circle cx="200" cy="150" r="24" fill="${ink}"/><path d="M184 132 L176 104 L192 128 Z M216 132 L224 104 L208 128 Z" fill="${ink}"/><path d="M236 214 C270 230 280 250 300 240" stroke="${ink}" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="191" cy="150" r="3.6" fill="${eye}"/><circle cx="209" cy="150" r="3.6" fill="${eye}"/>`;
    if(sp==="狐")out+=`<path d="M232 230 C300 236 310 170 270 150 C290 190 270 214 228 206 Z" fill="${ink}" opacity=".85"/><path d="M200 214 L160 150 L162 104 L188 136 L212 136 L238 104 L240 150 Z" fill="${ink}"/><circle cx="188" cy="160" r="3.6" fill="${eye}"/><circle cx="212" cy="160" r="3.6" fill="${eye}"/><path d="M200 196 L194 186 H206 Z" fill="${eye}" opacity=".7"/>`;
    if(sp==="獅子"){let pts="";for(let i=0;i<32;i++){const a=i*Math.PI/16,rad=i%2?44:62;pts+=`${round(200+rad*Math.cos(a))},${round(160+rad*Math.sin(a))} `}out+=`<polygon points="${pts}" fill="${ink}" opacity=".8"/><circle cx="200" cy="162" r="32" fill="${ink}"/><circle cx="189" cy="156" r="3.6" fill="${eye}"/><circle cx="211" cy="156" r="3.6" fill="${eye}"/><path d="M192 176 Q200 184 208 176" stroke="${eye}" stroke-width="2" fill="none"/>`}
    if(sp==="鳳凰")out+=`<path d="M200 170 C160 120 120 110 96 130 C130 136 150 160 196 186 Z M200 170 C240 120 280 110 304 130 C270 136 250 160 204 186 Z" fill="${ink}" opacity=".85"/><path d="M200 140 C214 160 214 196 200 214 C186 196 186 160 200 140 Z" fill="${ink}"/><path d="M196 214 C180 236 170 246 150 250 M200 214 V250 M204 214 C220 236 230 246 250 250" stroke="${ink}" stroke-width="4" fill="none"/><circle cx="200" cy="156" r="3.4" fill="${eye}"/>`;
    if(sp==="狼")out+=`<circle cx="262" cy="112" r="30" fill="${eye}" opacity=".55"/><path d="M200 222 L158 176 L164 112 L186 146 L214 146 L236 112 L242 176 Z" fill="${ink}"/><path d="M200 222 L184 190 H216 Z" fill="${ink}"/><circle cx="187" cy="168" r="3.6" fill="${eye}"/><circle cx="213" cy="168" r="3.6" fill="${eye}"/>`;
    if(sp==="精霊")out+=`<circle cx="200" cy="160" r="46" fill="#fff" opacity=".18"/><circle cx="200" cy="160" r="28" fill="#fff" opacity=".5"/><circle cx="200" cy="160" r="14" fill="#fff"/><ellipse cx="200" cy="160" rx="74" ry="18" fill="none" stroke="#fff" stroke-width="2" opacity=".6" transform="rotate(-18 200 160)"/><ellipse cx="200" cy="160" rx="66" ry="14" fill="none" stroke="${eye}" stroke-width="2" opacity=".7" transform="rotate(24 200 160)"/>`;
    out+=`</g><rect x="98" y="82" width="${tier>2?46:38}" height="18" rx="9" fill="url(#fr)"/><text x="${tier>2?121:117}" y="95" text-anchor="middle" font-size="10" font-weight="900" fill="#1c1d2b" ${GOTHIC}>${["N","R","SR","SSR","UR"][tier]}</text>`;
    out+=`<rect x="92" y="254" width="216" height="72" rx="6" fill="#fff" opacity=".06"/><text x="102" y="276" font-size="10" font-weight="700" fill="${e.c2}" ${GOTHIC}>${esc(`${e.v}属性・${sp}族`)}</text><text x="102" y="298" font-size="10" fill="#cfd2e0" ${GOTHIC}>${esc(pick(r,CARD_FLAVOR))}</text><text x="102" y="350" font-size="13" font-weight="800" fill="#fff" ${GOTHIC}>ATK ${atk}</text><text x="298" y="350" text-anchor="end" font-size="13" font-weight="800" fill="#fff" ${GOTHIC}>DEF ${def}</text><text x="298" y="366" text-anchor="end" font-size="8" fill="#8b8fa8" ${GOTHIC}>No.${String(serial).padStart(5,"0")}</text>`;
    if(tier>=2)out+=`<rect x="72" y="18" width="256" height="364" rx="16" fill="url(#holo)"/>`;
    if(tier===4)for(let i=0;i<10;i++){const x=between(r,80,320),y=between(r,24,376),s=between(r,3,6);out+=`<path d="M${round(x)} ${round(y-s)} L${round(x+s/3)} ${round(y-s/3)} L${round(x+s)} ${round(y)} L${round(x+s/3)} ${round(y+s/3)} L${round(x)} ${round(y+s)} L${round(x-s/3)} ${round(y+s/3)} L${round(x-s)} ${round(y)} L${round(x-s/3)} ${round(y-s/3)} Z" fill="#fff" opacity=".85"/>`}
    return svg(out);
  }

  /* ---------- ふるさと御朱印NFT ---------- */
  function drawGoshuin(r,t,tier,serial){
    const place=t.place,red=t.seal.v==="金印"?"#b8860b":"#c8102e";
    let out=`<defs><radialGradient id="sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff4d2e"/><stop offset="1" stop-color="#e01e1e"/></radialGradient></defs><rect width="400" height="400" fill="#efe4cc"/>`;
    for(let i=0;i<46;i++){const x=r()*400,y=r()*400;out+=`<path d="M${round(x)} ${round(y)} q ${round(between(r,-12,12))} ${round(between(r,-6,6))} ${round(between(r,-24,24))} ${round(between(r,-4,4))}" stroke="#cdbb96" stroke-width=".8" fill="none" opacity=".55"/>`}
    out+=`<rect x="40" y="22" width="320" height="356" fill="#fbf6ea" stroke="#c9b897" stroke-width="1.5"/>`;
    const season=t.season.v;
    if(season==="桜")for(let i=0;i<18;i++){const x=round(between(r,52,348)),y=round(between(r,34,366));out+=`<ellipse cx="${x}" cy="${y}" rx="6" ry="3.6" fill="#f7a8c4" opacity=".7" transform="rotate(${Math.round(r()*180)} ${x} ${y})"/>`}
    if(season==="紅葉")for(let i=0;i<12;i++){const x=between(r,56,344),y=between(r,40,360),s=between(r,7,12);let pts="";for(let k=0;k<10;k++){const a=k*Math.PI/5-Math.PI/2,rad=k%2?s*.45:s;pts+=`${round(x+rad*Math.cos(a))},${round(y+rad*Math.sin(a))} `}out+=`<polygon points="${pts}" fill="${pick(r,["#e85d04","#d00000","#f48c06"])}" opacity=".6"/>`}
    if(season==="雪")for(let i=0;i<40;i++)out+=`<circle cx="${round(between(r,46,354))}" cy="${round(between(r,28,372))}" r="${round(between(r,1.5,3.5))}" fill="#9ec5e8" opacity=".55"/>`;
    if(season==="初日の出"){for(let i=0;i<16;i++){const a=i*Math.PI/8;out+=`<path d="M200 78 L${round(200+120*Math.cos(a))} ${round(78+120*Math.sin(a))}" stroke="#e9b949" stroke-width="5" opacity=".35"/>`}out+=`<circle cx="200" cy="78" r="38" fill="url(#sun)"/>`}
    if(season==="通常")out+=`<path d="M48 330 Q120 280 180 318 T 352 300 L352 370 L48 370 Z" fill="#d9ccb0" opacity=".4"/>`;
    const cx=200,cy=210,seal=t.seal.v;
    out+=`<g opacity=".86" stroke="${red}" fill="none">`;
    if(seal==="丸印"||seal==="金印")out+=`<circle cx="${cx}" cy="${cy}" r="80" stroke-width="8" fill="${red}" fill-opacity=".07"/><circle cx="${cx}" cy="${cy}" r="66" stroke-width="2"/>`;
    if(seal==="角印")out+=`<rect x="${cx-74}" y="${cy-74}" width="148" height="148" stroke-width="8" fill="${red}" fill-opacity=".07" transform="rotate(-4 ${cx} ${cy})"/><rect x="${cx-62}" y="${cy-62}" width="124" height="124" stroke-width="2" transform="rotate(-4 ${cx} ${cy})"/>`;
    if(seal==="花印"){for(let i=0;i<8;i++){const a=i*Math.PI/4;out+=`<circle cx="${round(cx+52*Math.cos(a))}" cy="${round(cy+52*Math.sin(a))}" r="30" stroke-width="5"/>`}out+=`<circle cx="${cx}" cy="${cy}" r="40" stroke-width="3" fill="${red}" fill-opacity=".08"/>`}
    out+=`</g>`;
    out+=`<g fill="${red}" opacity=".8" font-size="24" font-weight="700" ${MINCHO}><text x="${cx-30}" y="${cy-32}" text-anchor="middle">観</text><text x="${cx+30}" y="${cy-32}" text-anchor="middle">光</text><text x="${cx-30}" y="${cy+52}" text-anchor="middle">記</text><text x="${cx+30}" y="${cy+52}" text-anchor="middle">念</text></g>`;
    for(let i=0;i<20;i++)out+=`<circle cx="${round(cx+between(r,-80,80))}" cy="${round(cy+between(r,-80,80))}" r="${round(between(r,1,3))}" fill="#fbf6ea"/>`;
    out+=vText(place.v,200,172,82,`font-size="74" font-weight="800" fill="#16120e" opacity=".92" ${MINCHO}`);
    out+=vText("奉拝",320,82,30,`font-size="22" fill="#2b2b2b" ${MINCHO}`);
    const months=["一","二","三","四","五","六","七","八","九","十","十一","十二"];
    out+=vText(`令和八年${months[serial%12]}月`,80,82,24,`font-size="17" fill="#2b2b2b" ${MINCHO}`);
    out+=`<rect x="64" y="304" width="36" height="36" fill="${red}" opacity=".85"/><text x="82" y="330" text-anchor="middle" font-size="22" fill="#fbf6ea" ${MINCHO}>印</text><text x="200" y="360" text-anchor="middle" font-size="13" fill="#6b5d4a" ${MINCHO}>${esc(place.pref)}</text>`;
    return svg(out);
  }

  /* ---------- SOUND DROP RECORDS ---------- */
  const RECORD_WORDS=[["MIDNIGHT","SUMMER","NEON","CITY","MOON","SAKURA","TOKYO","OCEAN","VELVET","STAR"],["DRIVE","BREEZE","TAPE","LIGHTS","RADIO","DREAMS","FM","GROOVE","SIGNAL","WAVES"]];
  const RECORD_ARTISTS=["Kotone","HARU & The Night","Studio Mochi","Aoi Hoshino","NIGHT BUS","Sora Tanaka","momo tracks","Ren Ito Trio"];
  function drawRecord(r,t,tier,serial,title){
    const [c0,c1,c2]=t.genre.c,genre=t.genre.v,vinyl=t.vinyl.v,edition=t.edition.v;
    const artist=pick(r,RECORD_ARTISTS);
    const vinylFill={ブラック:"#111",クリア:"#c8dcff",マーブル:"url(#marble)",ゴールド:"url(#gold)"}[vinyl];
    let out=`<defs><radialGradient id="marble" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="${c1}"/><stop offset=".45" stop-color="${c0}"/><stop offset=".7" stop-color="${c2}"/><stop offset="1" stop-color="${c0}"/></radialGradient><linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8a6510"/><stop offset=".5" stop-color="#ffe9a3"/><stop offset="1" stop-color="#a87a14"/></linearGradient><linearGradient id="sl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${genre==="シティポップ"||genre==="アニソン"?c1:c0}"/></linearGradient><clipPath id="sleeve"><rect x="24" y="56" width="280" height="280" rx="6"/></clipPath></defs><rect width="400" height="400" fill="#ecebf3"/><rect width="400" height="400" fill="${c1}" opacity=".12"/>`;
    out+=`<ellipse cx="200" cy="356" rx="170" ry="12" fill="#000" opacity=".08"/><circle cx="304" cy="196" r="128" fill="${vinylFill}" ${vinyl==="クリア"?'opacity=".75"':""}/>`;
    for(let i=1;i<=8;i++)out+=`<circle cx="304" cy="196" r="${44+i*10}" fill="none" stroke="#fff" stroke-opacity=".09"/>`;
    out+=`<circle cx="304" cy="196" r="40" fill="${c1}"/><circle cx="304" cy="196" r="5" fill="#ecebf3"/>`;
    out+=`<rect x="24" y="56" width="280" height="280" rx="6" fill="url(#sl)"/><g clip-path="url(#sleeve)">`;
    if(genre==="シティポップ"){out+=`<circle cx="164" cy="186" r="70" fill="${c2}" opacity=".9"/>`;for(let i=0;i<6;i++)out+=`<rect x="80" y="${200+i*11}" width="170" height="${3+i}" fill="${c1}"/>`;out+=`<rect x="24" y="262" width="280" height="80" fill="${c2}" opacity=".55"/>`}
    if(genre==="ローファイ"){for(let i=0;i<9;i++)out+=`<path d="M${24+i*35} 336 L164 210" stroke="${c1}" stroke-opacity=".35"/>`;for(let i=0;i<5;i++)out+=`<path d="M24 ${230+i*i*5} H304" stroke="${c1}" stroke-opacity=".35"/>`;out+=`<circle cx="230" cy="120" r="28" fill="${c1}" opacity=".85"/>`}
    if(genre==="ジャズ"){for(let i=0;i<7;i++)out+=`<circle cx="70" cy="300" r="${40+i*26}" fill="none" stroke="${c1}" stroke-width="1.5" opacity="${round(.7-i*.08)}"/>`;out+=`<rect x="220" y="80" width="4" height="150" fill="${c1}"/>`}
    if(genre==="アニソン"){for(let i=0;i<16;i++){const x=between(r,34,294),y=between(r,66,240),s=between(r,4,10);out+=`<path d="M${round(x)} ${round(y-s)} L${round(x+s*.3)} ${round(y-s*.3)} L${round(x+s)} ${round(y)} L${round(x+s*.3)} ${round(y+s*.3)} L${round(x)} ${round(y+s)} L${round(x-s*.3)} ${round(y+s*.3)} L${round(x-s)} ${round(y)} L${round(x-s*.3)} ${round(y-s*.3)} Z" fill="#fff" opacity=".85"/>`}for(let y=70;y<330;y+=14)for(let x=30;x<300;x+=14)out+=`<circle cx="${x}" cy="${y}" r="${round(1+(y-70)/120)}" fill="#fff" opacity=".12"/>`}
    if(genre==="EDM")for(let i=0;i<18;i++){const h=between(r,30,170);out+=`<rect x="${36+i*15}" y="${round(250-h)}" width="9" height="${round(h)}" rx="3" fill="${i%2?c1:c2}" opacity=".9"/>`}
    if(genre==="和楽器"){for(let y=70;y<350;y+=22)for(let x=24+(y/22%2)*18;x<320;x+=36)for(let k=3;k>0;k--)out+=`<circle cx="${x}" cy="${y}" r="${k*6}" fill="none" stroke="${c2}" stroke-opacity=".22"/>`;out+=`<circle cx="210" cy="150" r="46" fill="${c1}"/>`}
    const dark=["ローファイ","ジャズ","EDM","和楽器"].includes(genre);
    const fitTitle=title.length*25*.72>248?' textLength="248" lengthAdjust="spacingAndGlyphs"':"";
    out+=`<text x="40" y="300" font-size="25" font-weight="900" letter-spacing="1" fill="${dark?"#fff":"#16121f"}"${fitTitle} ${GOTHIC}>${esc(title)}</text><text x="40" y="320" font-size="12" font-weight="600" fill="${dark?"#fff":"#16121f"}" opacity=".75" ${GOTHIC}>${esc(artist)}</text>`;
    if(edition==="サイン入り"||edition==="1/1 マスター")out+=`<path d="M190 250 c10 -24 22 -24 16 0 s 14 -20 20 -6 s 12 -12 22 -4 q 10 6 26 -8" stroke="#e8e8f0" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    out+=`</g>`;
    if(edition!=="通常盤")out+=`<circle cx="262" cy="94" r="27" fill="${edition==="1/1 マスター"?"url(#gold)":"#ffd23f"}"/><text x="262" y="${edition==="限定盤"?99:98}" text-anchor="middle" font-size="${edition==="限定盤"?14:10}" font-weight="900" fill="#16121f" ${GOTHIC}>${{限定盤:"限定",サイン入り:"SIGNED","1/1 マスター":"1 of 1"}[edition]}</text>`;
    return svg(out);
  }

  /* ---------- TOKYO BAY MEMBERS PASS ---------- */
  function drawPass(r,t,tier,serial){
    const grads=[["#6b3e1f","#c98b52","#8a5228"],["#7f8a96","#e9edf2","#9aa5b1"],["#9c6f12","#ffe38a","#b8860b"],["#9fb0c4","#f8fbff","#c3d0e1"],["#050507","#2a2a35","#0d0d12"]][tier];
    const ink=tier===0?"#fff6ea":tier===4?"#e9c46a":"#1d2433",glowColor=["#c98b52","#c9d3dd","#ffd166","#9be7ff","#e9c46a"][tier];
    let out=`<defs><linearGradient id="card" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${grads[0]}"/><stop offset=".5" stop-color="${grads[1]}"/><stop offset="1" stop-color="${grads[2]}"/></linearGradient><linearGradient id="iri" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff9de2" stop-opacity=".25"/><stop offset=".5" stop-color="#9be7ff" stop-opacity=".25"/><stop offset="1" stop-color="#c3ff9b" stop-opacity=".25"/></linearGradient><linearGradient id="chip" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d4a73c"/><stop offset=".5" stop-color="#fff0b8"/><stop offset="1" stop-color="#b9861d"/></linearGradient><radialGradient id="bgGlow" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="${glowColor}" stop-opacity=".35"/><stop offset="1" stop-color="#0e1320" stop-opacity="0"/></radialGradient><clipPath id="cc"><rect x="38" y="98" width="324" height="204" rx="20"/></clipPath></defs><rect width="400" height="400" fill="#0e1320"/><rect width="400" height="400" fill="url(#bgGlow)"/>`;
    out+=`<rect x="46" y="112" width="324" height="204" rx="20" fill="#000" opacity=".35"/><rect x="38" y="98" width="324" height="204" rx="20" fill="url(#card)"/><g clip-path="url(#cc)">`;
    if(tier===3)out+=`<rect x="38" y="98" width="324" height="204" fill="url(#iri)"/>`;
    const p=t.pattern.v;
    if(p==="ウェーブ")for(let i=0;i<9;i++)out+=`<path d="M30 ${120+i*22} q 40 -16 80 0 t 80 0 t 80 0 t 80 0 t 80 0" fill="none" stroke="${ink}" stroke-opacity=".12" stroke-width="1.4"/>`;
    if(p==="グリッド"){for(let x=38;x<362;x+=18)out+=`<path d="M${x} 98 V302" stroke="${ink}" stroke-opacity=".08"/>`;for(let y=98;y<302;y+=18)out+=`<path d="M38 ${y} H362" stroke="${ink}" stroke-opacity=".08"/>`}
    if(p==="星座"){const pts=Array.from({length:8},()=>[between(r,160,350),between(r,110,290)]);out+=`<polyline points="${pts.map(([x,y])=>`${round(x)},${round(y)}`).join(" ")}" fill="none" stroke="${ink}" stroke-opacity=".3"/>`+pts.map(([x,y])=>`<circle cx="${round(x)}" cy="${round(y)}" r="2.6" fill="${ink}" opacity=".6"/>`).join("")}
    out+=`</g><text x="66" y="140" font-size="12" font-weight="700" letter-spacing="3" fill="${ink}" opacity=".8" ${GOTHIC}>TOKYO BAY</text><text x="66" y="164" font-size="20" font-weight="900" letter-spacing="1" fill="${ink}" ${GOTHIC}>MEMBERS PASS</text><text x="334" y="140" text-anchor="end" font-size="13" font-weight="800" fill="${ink}" ${GOTHIC}>${["BRONZE","SILVER","GOLD","PLATINUM","BLACK"][tier]}</text>`;
    out+=`<rect x="66" y="184" width="46" height="36" rx="6" fill="url(#chip)"/><path d="M66 196 H112 M66 208 H112 M82 184 V220 M96 184 V220" stroke="#8a6510" stroke-opacity=".5"/><circle cx="318" cy="226" r="18" fill="none" stroke="${ink}" stroke-width="2" opacity=".7"/><path d="M306 228 q 6 -8 12 0 t 12 0" fill="none" stroke="${ink}" stroke-width="2" opacity=".7"/>`;
    out+=`<text x="66" y="276" font-size="15" font-weight="700" letter-spacing="2" fill="${ink}" font-family="ui-monospace,Menlo,monospace">No. ${String(serial).padStart(4,"0")}</text><text x="334" y="276" text-anchor="end" font-size="11" font-weight="700" fill="${ink}" opacity=".85" ${GOTHIC}>${esc(t.perk.v)}・${esc(t.area.v)}</text>`;
    return svg(out);
  }

  const STYLES={
    pixel:{draw:drawPixel,title:(r,t,serial)=>`Momo Friend #${serial}`,traits:[
      {key:"bg",label:"背景",options:[{v:"さくら",w:22,c:"#ffd9e6"},{v:"ミント",w:22,c:"#cff3e4"},{v:"そら",w:22,c:"#d4e8ff"},{v:"レモン",w:18,c:"#fff2b8"},{v:"ラベンダー",w:12,c:"#e6dcff"},{v:"ゴールド",w:3,tier:3,c:"#ffd56a"},{v:"コズミック",w:1,tier:4,c:"#1b1840"}]},
      {key:"body",label:"からだ",options:[{v:"もも",w:24,c:"#ffb7c9"},{v:"しろ",w:22,c:"#f8f4ee"},{v:"きなこ",w:20,c:"#ebc993"},{v:"みず",w:16,c:"#a6d6ff"},{v:"わかば",w:12,c:"#ade6a6"},{v:"ゆめいろ",w:5,tier:2,c:"#c9abff"},{v:"こがね",w:1,tier:4,c:"#ffcf40"}]},
      {key:"ears",label:"みみ",options:[{v:"ねこみみ",w:30},{v:"うさみみ",w:25},{v:"まるみみ",w:25},{v:"くまみみ",w:17},{v:"ユニコーン",w:3,tier:3}]},
      {key:"eyes",label:"め",options:[{v:"ぱっちり",w:30},{v:"にこにこ",w:25},{v:"ねむねむ",w:20},{v:"きらきら",w:15},{v:"サングラス",w:8,tier:2},{v:"ハート",w:2,tier:4}]},
      {key:"acc",label:"アクセサリー",options:[{v:"なし",w:35},{v:"リボン",w:22},{v:"ヘッドホン",w:16},{v:"キャップ",w:14},{v:"花かんむり",w:8,tier:2},{v:"王冠",w:4,tier:3},{v:"天使の輪",w:1,tier:4}]}
    ]},
    skyline:{draw:drawSkyline,title:(r,t,serial)=>`Neo Tokyo #${String(serial).padStart(4,"0")}`,traits:[
      {key:"time",label:"時間帯",options:[{v:"夕暮れ",w:28,sky:["#ff9966","#ff5e62","#6a3093"],glow:"#ffd29d"},{v:"真夜中",w:30,sky:["#0f2027","#203a43","#2c5364"],glow:"#cfe8ff"},{v:"夜明け",w:22,sky:["#a1c4fd","#c2e9fb","#fbc2eb"],glow:"#fff6d8"},{v:"ネオン",w:14,tier:2,sky:["#12002e","#3a0ca3","#f72585"],glow:"#4cc9f0"},{v:"オーロラ",w:6,tier:4,sky:["#020b1a","#06283d","#0b3d4f"],glow:"#7cffcb"}]},
      {key:"weather",label:"天気",options:[{v:"晴れ",w:45},{v:"雨",w:27},{v:"雪",w:20},{v:"流星群",w:8,tier:3}]},
      {key:"landmark",label:"ランドマーク",options:[{v:"なし",w:35},{v:"電波塔",w:25},{v:"観覧車",w:20},{v:"高層タワー",w:15,tier:1},{v:"満月",w:5,tier:3}]},
      {key:"lights",label:"窓明かり",options:[{v:"まばら",w:40},{v:"にぎやか",w:45},{v:"虹色",w:15,tier:2}]}
    ]},
    wave:{draw:drawWave,title:(r,t,serial)=>`Wave Genesis #${String(serial).padStart(3,"0")}`,traits:[
      {key:"palette",label:"パレット",options:[{v:"珊瑚礁",w:20,c:["#0f4c5c","#2ec4b6","#ffe3c2","#ffb88c","#ff6f61"]},{v:"抹茶",w:20,c:["#1f3a18","#386641","#6a994e","#a7c957","#f2e8cf"]},{v:"夕凪",w:20,c:["#22223b","#4a4e69","#9a8c98","#c9ada7","#f2e9e4"]},{v:"夜光",w:20,c:["#0b132b","#1c2541","#3a506b","#5bc0be","#6fffe9"]},{v:"桜吹雪",w:12,tier:2,c:["#590d22","#a4133c","#ff4d6d","#ffb3c1","#fff0f3"]},{v:"金箔",w:6,tier:3,c:["#111111","#2b2b2b","#8c6a3c","#d4a95a","#fbe7b2"]},{v:"虹彩",w:2,tier:4,c:["#1a1033","#5f0f40","#e36414","#0f8b8d","#f9c74f","#90be6d"]}]},
      {key:"motion",label:"うねり",options:[{v:"おだやか",w:35,amp:14},{v:"ゆらぎ",w:40,amp:26},{v:"はげしい",w:20,amp:42,tier:1},{v:"渦潮",w:5,amp:30,tier:3}]},
      {key:"orb",label:"天体",options:[{v:"なし",w:45},{v:"日の出",w:30},{v:"満月",w:20},{v:"ふたつの月",w:5,tier:3}]}
    ]},
    fuji:{draw:drawFuji,title:(r,t,serial)=>`富嶽 ${t.season.v}${t.time.v}景 #${serial}`,traits:[
      {key:"season",label:"季節",options:[{v:"春",w:25,sky:["#ffd6e0","#fff1e6"],hill:"#7fb069"},{v:"夏",w:25,sky:["#8ecae6","#e0f4ff"],hill:"#3a7d44"},{v:"秋",w:25,sky:["#ffb38a","#ffe8c7"],hill:"#a3542a"},{v:"冬",w:25,sky:["#b8c6db","#f5f7fa"],hill:"#6b7b8c"}]},
      {key:"time",label:"時刻",options:[{v:"朝",w:35},{v:"昼",w:30},{v:"夕",w:25},{v:"夜",w:10,tier:2}]},
      {key:"fore",label:"前景",options:[{v:"大波",w:24},{v:"湖",w:26},{v:"松",w:24},{v:"桜",w:20},{v:"鳥居",w:6,tier:3}]},
      {key:"rock",label:"山肌",options:[{v:"藍",w:45,c:"#3f5f86"},{v:"群青",w:40,c:"#2c4a7a"},{v:"墨",w:12,tier:2,c:"#3a3f4b"},{v:"赤富士",w:3,tier:4,c:"#b5482f"}]}
    ]},
    card:{draw:drawCard,tierLabels:["N","R","SR","SSR","UR"],title:(r,t,serial)=>`${t.element.pre}${t.species.v}${pick(r,CARD_NAMES)} #${serial}`,traits:[
      {key:"element",label:"属性",options:[{v:"炎",c:"#ff5a36",c2:"#ffb347",pre:"炎"},{v:"氷",c:"#3fa7ff",c2:"#bfe9ff",pre:"氷"},{v:"風",c:"#2ec4b6",c2:"#c4f5e9",pre:"嵐"},{v:"雷",c:"#e0a800",c2:"#fff3a0",pre:"雷"},{v:"光",c:"#ffb703",c2:"#fff8e1",pre:"聖"},{v:"闇",c:"#7b2cbf",c2:"#c77dff",pre:"冥"}]},
      {key:"species",label:"種族",options:[{v:"竜"},{v:"狐"},{v:"獅子"},{v:"鳳凰"},{v:"狼"},{v:"精霊"}]}
    ]},
    goshuin:{draw:drawGoshuin,title:(r,t,serial)=>`${t.place.v} 御朱印 #${String(serial).padStart(4,"0")}`,traits:[
      {key:"place",label:"地域",options:[{v:"函館",pref:"北海道"},{v:"仙台",pref:"宮城県"},{v:"鎌倉",pref:"神奈川県"},{v:"松本",pref:"長野県"},{v:"金沢",pref:"石川県"},{v:"京都",pref:"京都府"},{v:"奈良",pref:"奈良県"},{v:"尾道",pref:"広島県"},{v:"熊本",pref:"熊本県"},{v:"那覇",pref:"沖縄県"}]},
      {key:"seal",label:"印の形",options:[{v:"丸印",w:45},{v:"角印",w:40},{v:"花印",w:12,tier:2},{v:"金印",w:3,tier:3}]},
      {key:"season",label:"季節限定",options:[{v:"通常",w:45},{v:"桜",w:20},{v:"紅葉",w:20},{v:"雪",w:12,tier:2},{v:"初日の出",w:3,tier:4}]}
    ]},
    record:{draw:drawRecord,title:r=>`${pick(r,RECORD_WORDS[0])} ${pick(r,RECORD_WORDS[1])}`,traits:[
      {key:"genre",label:"ジャンル",options:[{v:"シティポップ",c:["#ff7e5f","#feb47b","#2d1b69"]},{v:"ローファイ",c:["#3d2f63","#e69a8d","#1e1b2e"]},{v:"ジャズ",c:["#0b1d3a","#c9a227","#f2e6c9"]},{v:"アニソン",c:["#ff5fa2","#5ecbff","#fff3fb"]},{v:"EDM",c:["#0a0a0a","#39ff14","#00e5ff"]},{v:"和楽器",c:["#1d2951","#c0392b","#f4e9d8"]}]},
      {key:"vinyl",label:"盤の色",options:[{v:"ブラック",w:50},{v:"クリア",w:30},{v:"マーブル",w:15,tier:2},{v:"ゴールド",w:5,tier:3}]},
      {key:"edition",label:"エディション",options:[{v:"通常盤",w:55},{v:"限定盤",w:30,tier:1},{v:"サイン入り",w:12,tier:3},{v:"1/1 マスター",w:3,tier:4}]}
    ]},
    pass:{draw:drawPass,tierLabels:["ブロンズ","シルバー","ゴールド","プラチナ","ブラック"],tierTraitLabel:"ランク",title:(r,t,serial)=>`Members Pass No.${String(serial).padStart(4,"0")}`,traits:[
      {key:"perk",label:"特典",options:[{v:"優先入場",w:30},{v:"ラウンジ利用",w:25},{v:"ドリンク無料",w:25},{v:"駐車場",w:15},{v:"限定イベント招待",w:5,tier:2}]},
      {key:"pattern",label:"デザイン",options:[{v:"ウェーブ",w:40},{v:"グリッド",w:40},{v:"星座",w:20,tier:2}]},
      {key:"area",label:"エリア",options:[{v:"お台場",w:25},{v:"豊洲",w:25},{v:"横浜",w:25},{v:"幕張",w:25}]}
    ]}
  };

  // Collection-specific vector editions: each artwork shares its traits with its metadata.
  const editionPalettes=[{v:"Midnight",c:"#102b3c",a:"#6adbd0",w:35},{v:"Amber",c:"#352336",a:"#efbd79",w:30},{v:"Glacier",c:"#183c53",a:"#aad9ef",w:22},{v:"Rose",c:"#40283b",a:"#f5aab7",w:10,tier:2},{v:"Aurora",c:"#202448",a:"#dbd1ff",w:3,tier:4}];
  function editionCanvas(t,serial,brand,subtitle,body,light=false){
    const ink=light?"#203d3d":"#f5efdf",bg=light?"#eee8d8":t.palette.c,accent=t.palette.a;
    return svg(`<defs><linearGradient id="edition-bg" x2="1" y2="1"><stop stop-color="${bg}"/><stop offset="1" stop-color="${light?'#d9d4be':'#090f20'}"/></linearGradient><linearGradient id="metal" x2="1" y2="1"><stop stop-color="#f8efd1"/><stop offset=".45" stop-color="${accent}"/><stop offset="1" stop-color="#74848d"/></linearGradient><radialGradient id="halo"><stop stop-color="${accent}" stop-opacity=".35"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient></defs><rect width="400" height="400" fill="url(#edition-bg)"/><circle cx="230" cy="180" r="190" fill="url(#halo)"/><rect x="18" y="18" width="364" height="364" rx="2" fill="none" stroke="${ink}" stroke-opacity=".25"/><path d="M32 66H368 M32 337H368" stroke="${ink}" stroke-opacity=".3"/><g fill="${ink}" ${GOTHIC}><text x="33" y="43" font-size="12" font-weight="700" letter-spacing="2">${brand}</text><text x="33" y="57" font-size="7" letter-spacing="2">${subtitle}</text></g>${body}<g fill="${ink}" ${GOTHIC}><text x="33" y="359" font-size="11" font-weight="600">${esc(t.subject.v)}</text><text x="33" y="374" font-size="7" letter-spacing="1.6">${esc(t.palette.v.toUpperCase())} / ${esc(t.finish.v.toUpperCase())}</text><text x="365" y="362" text-anchor="end" font-size="12" font-family="monospace">${String(serial).padStart(4,'0')}</text></g>`);
  }
  function drawRelic(r,t,tier,serial){
    const a=t.palette.a;
    let b=`<ellipse cx="200" cy="299" rx="83" ry="16" fill="#000" opacity=".35"/><g fill="none" stroke="${a}"><circle cx="200" cy="196" r="105" opacity=".25"/><circle cx="200" cy="196" r="91" stroke-dasharray="2 9" opacity=".6"/>`;
    for(let i=0;i<8;i++)b+=`<path transform="rotate(${i*45} 200 196)" d="M200 84v13m-5-8h10"/>`;
    b+='</g>';
    if(t.subject.v==='星晶の剣')b+=`<g transform="rotate(24 200 195)"><path d="M200 88l20 44-12 110h-16l-12-110z" fill="url(#metal)"/><path d="M200 94v145l15-105z" fill="#fff" opacity=".45"/><path d="M157 235q43-21 86 0l-8 14-35-9-35 9z" fill="${a}"/><rect x="191" y="243" width="18" height="48" rx="5" fill="#536071"/><path d="M191 254h18m-18 12h18m-18 12h18" stroke="${a}"/><path d="M200 285l12 13-12 13-12-13z" fill="url(#metal)"/></g>`;
    else if(t.subject.v==='月輪の盾')b+=`<path d="M200 100l76 31-8 88q-12 49-68 78-56-29-68-78l-8-88z" fill="url(#metal)"/><path d="M200 117l59 24-7 73q-10 41-52 65-42-24-52-65l-7-73z" fill="${t.palette.c}"/><circle cx="200" cy="187" r="44" fill="none" stroke="${a}" stroke-width="5"/><path d="M200 140l18 46-18 52-18-52z" fill="url(#metal)"/>`;
    else b+=`<path d="M193 166h14v135h-14z" fill="url(#metal)"/><path d="M200 95l43 56-43 54-43-54z" fill="${a}"/><path d="M200 95v110l43-54z" fill="#fff" opacity=".35"/><path d="M150 138q-12 68 50 83 62-15 50-83" fill="none" stroke="url(#metal)" stroke-width="8"/>`;
    return editionCanvas(t,serial,'ASTRAL FORGE','EQUIPMENT / GENESIS COLLECTION',b);
  }
  function drawJazz(r,t,tier,serial){
    let b=`<circle cx="264" cy="192" r="110" fill="#0b0e15"/><g fill="none" stroke="#f2d6a0" stroke-opacity=".17">`;
    for(let i=0;i<15;i++)b+=`<circle cx="264" cy="192" r="${40+i*4.5}"/>`;
    b+=`</g><circle cx="264" cy="192" r="31" fill="${t.palette.a}"/><circle cx="264" cy="192" r="5" fill="#101724"/><path d="M52 89h175v233H52z" fill="#e5d9bf"/><path d="M52 234L227 109v65L52 299z" fill="${t.palette.c}"/><text x="67" y="122" font-size="30" font-family="serif" fill="#152d39">BLUE</text><text x="67" y="151" font-size="25" font-family="serif" fill="#152d39">HOUR</text><path d="M146 164v89q0 33-28 33-30 0-30-26h18q0 10 12 10 10 0 10-17v-89z" fill="#bc874a"/><path d="M142 169h19v-13h-27" fill="none" stroke="#bc874a" stroke-width="7"/><g fill="#243d46" ${GOTHIC}><text x="67" y="308" font-size="9" letter-spacing="2">LIVE SESSION ${1+Math.floor(r()*9)}</text></g>`;
    return editionCanvas(t,serial,'BLUE HOUR SESSIONS','INDEPENDENT JAZZ / ARCHIVE EDITIONS',b);
  }
  function drawAmbient(r,t,tier,serial){
    let b=`<circle cx="200" cy="194" r="98" fill="none" stroke="${t.palette.a}" stroke-opacity=".3"/>`;
    for(let i=0;i<32;i++){const y=125+i*4.3,amp=20+Math.sin(i/31*Math.PI)*48;b+=`<path d="M48 ${y}C110 ${y-amp} 132 ${y+amp} 200 ${y}S290 ${y-amp} 352 ${y}" fill="none" stroke="${t.palette.a}" stroke-width="1.2" opacity="${.25+i/65}"/>`}
    b+=`<circle cx="200" cy="194" r="37" fill="${t.palette.c}"/><circle cx="200" cy="194" r="29" fill="none" stroke="${t.palette.a}"/><text x="200" y="199" text-anchor="middle" fill="#fff" font-size="11" letter-spacing="3">ECHO</text><text x="200" y="311" text-anchor="middle" fill="${t.palette.a}" font-size="9" letter-spacing="4">FIELD RECORDING / VOL. ${1+Math.floor(r()*9)}</text>`;
    return editionCanvas(t,serial,'ECHO ATLAS','SOUND LANDSCAPES / ARTIST EDITIONS',b);
  }
  function drawIslands(r,t,tier,serial){
    let b=`<path d="M32 80h336v244H32z" fill="#a4c9c5"/><circle cx="290" cy="128" r="25" fill="#fbdfab"/><path d="M32 199q40-80 95-20t105-15 136 16v144H32z" fill="#5c9290"/><path d="M32 241q62-79 130-16t125-9 81 10v98H32z" fill="#296c71"/><path d="M32 279q90-29 171 0t165-8v53H32z" fill="#164b59"/>`;
    for(let i=0;i<22;i++){const x=40+r()*310,y=225+r()*93;b+=`<path d="M${x} ${y}h${8+r()*28}" stroke="#e7eee0" stroke-opacity=".38"/>`}
    b+=`<path d="M199 256h49l-9 11h-30z" fill="#f5e8cc"/><path d="M224 217v38h-23z" fill="#fff6df"/><circle cx="84" cy="123" r="29" fill="#f2e6d1"/><text x="84" y="128" text-anchor="middle" font-size="12" fill="#265557" ${MINCHO}>瀬戸内</text>`;
    return editionCanvas(t,serial,'SETOUCHI JOURNAL','ISLAND HOPPING / TRAVEL ARCHIVE',b,true);
  }
  function drawTrails(r,t,tier,serial){
    let b=`<path d="M32 80h336v244H32z" fill="#c5d4cc"/><circle cx="282" cy="128" r="28" fill="#f7edd2"/><path d="M32 257l80-147 51 86 64-108 141 169v67H32z" fill="#788f8c"/><path d="M82 165l30-55 32 54-31-15zM198 135l29-47 43 52-38-17-12 17z" fill="#f6f3e6"/><path d="M32 290l115-96 66 73 61-77 94 102v32H32z" fill="#355f5b"/><path d="M194 324l42-29-30-21 17-23" fill="none" stroke="#eac688" stroke-width="3"/>`;
    for(let i=0;i<18;i++){const x=37+i*19,y=282+r()*32;b+=`<path d="M${x} ${y-27}l-10 25h20z" fill="#193f3f"/>`}
    b+=`<circle cx="80" cy="124" r="28" fill="#f2ead6"/><path d="M64 134l16-26 16 26z" fill="none" stroke="#315b56" stroke-width="2"/>`;
    return editionCanvas(t,serial,'RIDGELINE PASSPORT','SUMMIT LOG / SEASONAL EXPEDITIONS',b,true);
  }
  function drawLibrary(r,t,tier,serial){
    let b=`<path d="M76 319V195a124 100 0 0 1 248 0v124" fill="#131f25" stroke="${t.palette.a}" stroke-width="2"/>`;
    for(let row=0;row<3;row++){const y=145+row*56;for(let col=0;col<13;col++){const x=92+col*17,h=25+r()*20;b+=`<rect x="${x}" y="${y+45-h}" width="12" height="${h}" rx="1" fill="${[t.palette.a,'#8c7563','#466661'][col%3]}" opacity=".7"/><path d="M${x+3} ${y+48-h}v${h-6}" stroke="#fff" opacity=".2"/>`}b+=`<path d="M87 ${y+46}h226" stroke="${t.palette.a}" opacity=".5"/>`}
    b+=`<path d="M143 306q29-15 57-1 28-14 57 1v17q-29-12-57 0-28-12-57 0z" fill="#e9dbc0"/><path d="M200 305v18" stroke="#84745c"/><circle cx="200" cy="119" r="16" fill="none" stroke="${t.palette.a}"/><text x="200" y="125" text-anchor="middle" fill="${t.palette.a}" font-size="19" font-family="serif">Q</text>`;
    return editionCanvas(t,serial,'QUIET CHAPTER','READING ROOM / MEMBERSHIP EDITION',b);
  }
  function drawBotanical(r,t,tier,serial){
    let b=`<path d="M78 321V167L200 84l122 83v154z" fill="none" stroke="${t.palette.a}" stroke-width="2"/><path d="M200 84v237M78 167h244M139 126v195M261 126v195M78 244h244" stroke="${t.palette.a}" opacity=".5"/>`;
    for(let j=0;j<5;j++){const x=110+j*45,h=90+r()*85;b+=`<path d="M${x} 311q-15-${h/2} 0-${h}" stroke="#b0c6a2" fill="none" stroke-width="2"/>`;for(let i=0;i<4;i++){const y=290-i*26;b+=`<path d="M${x-3} ${y}q-43-5-25-30 27 3 25 30M${x-3} ${y-10}q38-6 29-32-32 3-29 32" fill="${j%2?'#7d9f84':'#b4c3a0'}" opacity=".85"/>`}}
    b+=`<path d="M92 307h216l-9 17H101z" fill="${t.palette.a}"/>`;
    return editionCanvas(t,serial,'GLASSHOUSE SOCIETY','BOTANICAL CLUB / FOUNDING MEMBERS',b);
  }
  const newEditionStyles=[
    ['relic',drawRelic,'Astral Relic','装備',['星晶の剣','月輪の盾','光晶の杖']],
    ['jazz',drawJazz,'Blue Hour','編成',['Piano Trio','Midnight Quartet','Solo Sessions']],
    ['ambient',drawAmbient,'Echo Atlas','音風景',['Rain Garden','Tidal Memory','Forest Signals']],
    ['islands',drawIslands,'瀬戸内の旅','寄港地',['尾道','小豆島','直島']],
    ['trails',drawTrails,'稜線の記録','ルート',['八ヶ岳・森の道','北アルプス・稜線','奥多摩・渓谷']],
    ['library',drawLibrary,'Quiet Chapter','会員プラン',['Reading Room','Salon Access','Archive Circle']],
    ['botanical',drawBotanical,'Glasshouse','会員プラン',['Garden Access','Workshop Circle','Conservatory Club']]
  ];
  for(const [key,draw,title,label,subjects] of newEditionStyles){
    STYLES[key]={draw,title:(r,t,serial)=>`${title} · ${t.subject.v} #${String(serial).padStart(4,'0')}`,traits:[
      {key:'palette',label:'カラーテーマ',options:editionPalettes},
      {key:'subject',label,options:subjects.map(v=>({v}))},
      {key:'finish',label:'エディション',options:[{v:'Original',w:65},{v:'Studio',w:25,tier:1},{v:'Signature',w:8,tier:3},{v:'Archive',w:2,tier:4}]}
    ]};
  }

  // Ten distinct collections, with artwork driven by collection-specific attributes.
  function uniqueEdition(t,serial,brand,body,bg='#101820',ink='#f7eee0'){
    return svg(`<defs><linearGradient id="u-metal" x2="1" y2="1"><stop stop-color="#f9eac0"/><stop offset=".4" stop-color="${t.color.c}"/><stop offset="1" stop-color="#4b6570"/></linearGradient><radialGradient id="u-light"><stop stop-color="${t.color.c}" stop-opacity=".38"/><stop offset="1" stop-color="${bg}" stop-opacity="0"/></radialGradient></defs><rect width="400" height="400" fill="${bg}"/>${body}<g fill="${ink}" ${GOTHIC}><text x="24" y="31" font-size="11" font-weight="700" letter-spacing="1.8">${brand}</text><path d="M24 345H376" stroke="${ink}" opacity=".25"/><text x="24" y="366" font-size="11">${esc(t.motif.v)}</text><text x="24" y="383" font-size="8" letter-spacing="1">${esc(t.color.v)} / ${esc(t.detail.v)}</text><text x="376" y="369" text-anchor="end" font-size="12" font-family="monospace">${String(serial).padStart(4,'0')}</text></g>`);
  }
  function drawPaperSculpture(r,t,tier,serial){
    const a=t.color.c,n=t.detail.n;let b='<ellipse cx="208" cy="301" rx="121" ry="17" fill="#1d2c34" opacity=".13"/>';
    if(t.motif.v==='折りの環'){
      for(let i=0;i<n;i++){const angle=i*360/n;b+=`<g transform="rotate(${angle} 200 196)"><path d="M200 69l49 65-30 72-19-25-20-47z" fill="${i%2?a:shade(a,.28)}"/><path d="M200 69v112l19 25 30-72z" fill="#fff" opacity=".34"/></g>`}
      b+='<circle cx="200" cy="196" r="32" fill="#f3eee4"/>';
    }else if(t.motif.v==='紙の階段'){
      for(let i=0;i<n;i++){const y=290-i*17,x=76+i*10;b+=`<path d="M${x} ${y}l120-34 44 22-120 34z" fill="${shade(a,i/n*.65)}"/><path d="M${x} ${y}v10l44 22v-10z" fill="${shade(a,-.25)}"/><path d="M${x+44} ${y+22}l120-34v10l-120 34z" fill="${a}"/>`}
    }else{
      for(let i=n;i>0;i--){const q=17+i*10;b+=`<rect x="${200-q}" y="${196-q}" width="${q*2}" height="${q*2}" rx="3" transform="rotate(${i*8} 200 196)" fill="${shade(a,(n-i)/n*.7)}" stroke="#fff" stroke-opacity=".4"/>`}
    }
    return uniqueEdition(t,serial,'FOLD / FORM',b,'#f3eee4','#263a42');
  }
  function drawKintsugi(r,t,tier,serial){
    const a=t.color.c,wide=t.motif.v==='茶碗',vase=t.motif.v==='花器';
    const outline=wide?'M94 173Q200 141 306 173L278 253Q263 284 200 287Q137 284 122 253Z':vase?'M166 96Q200 108 234 96L225 151Q301 242 253 288Q200 310 147 288Q99 242 175 151Z':'M132 152Q200 137 268 152L260 276Q200 299 140 276Z';
    let b=`<defs><clipPath id="pot"><path d="${outline}"/></clipPath><linearGradient id="glaze"><stop stop-color="${shade(a,-.5)}"/><stop offset=".4" stop-color="${shade(a,.25)}"/><stop offset=".7" stop-color="${a}"/><stop offset="1" stop-color="${shade(a,-.4)}"/></linearGradient></defs><circle cx="200" cy="190" r="151" fill="url(#u-light)"/><ellipse cx="200" cy="307" rx="114" ry="14" fill="#000" opacity=".35"/><path d="${outline}" fill="url(#glaze)"/><g clip-path="url(#pot)">`;
    for(let i=0;i<140;i++){const x=98+r()*210,y=95+r()*210;b+=`<circle cx="${x}" cy="${y}" r="${.5+r()*1.8}" fill="#fff" opacity=".12"/>`}
    const shift=t.detail.x;b+=`<g transform="translate(${shift} 0)" fill="none" stroke="#e8bc65" stroke-width="3"><path d="M193 93l-15 70 30 29-23 42 24 76"/><path d="M208 192l45-12 46 23M185 234l-40-8-39 31"/></g></g><path d="M${wide?98:vase?167:134} ${wide?173:vase?96:152}q${wide?102:vase?33:66} 19 ${wide?204:vase?66:132} 0" fill="none" stroke="#fae6b9" stroke-opacity=".65" stroke-width="3"/>`;
    return uniqueEdition(t,serial,'KINTSUGI / SECOND LIFE',b,'#242329');
  }
  function drawRacer(r,t,tier,serial){
    let b='<circle cx="200" cy="193" r="148" fill="url(#u-light)"/>';
    for(let i=0;i<38;i++){const x=r()*400,y=55+r()*275;b+=`<path d="M${x} ${y}l-16 12" stroke="#c6dbe9" opacity="${.1+r()*.3}"/>`}
    const wing=t.motif.w;b+=`<g transform="rotate(-27 200 194)"><path d="M181 245l19 83 19-83" fill="${t.color.c}" opacity=".28"/><path d="M190 245l10 65 10-65" fill="#d9ffff"/><path d="M200 79l${wing} 137-20 27-${wing-20}-37-${wing-20} 37-20-27z" fill="url(#u-metal)"/><path d="M200 79l-27 143 27 35 27-35z" fill="#e4e9e7"/><path d="M200 124l-15 65 15 22 15-22z" fill="#143a50" stroke="${t.color.c}" stroke-width="3"/><path d="M${200-wing+12} 213l${wing-40}-43M${200+wing-12} 213l-${wing-40}-43" stroke="${t.color.c}" stroke-width="6"/>`;
    for(let i=0;i<t.detail.n;i++)b+=`<rect x="${187+i*8}" y="225" width="5" height="18" rx="2" fill="#254253"/>`;
    b+='</g><g fill="#b9cbd8" font-family="monospace" font-size="8"><text x="24" y="65">ORBITAL RACING LEAGUE</text><text x="24" y="323">HULL / ENGINE / LIVERY</text></g>';
    return uniqueEdition(t,serial,'APEX ORBIT',b,'#0b1528');
  }
  function drawClockChess(r,t,tier,serial){
    let b='<path d="M35 282l165-50 165 50-165 52z" fill="#253139"/>';
    for(let i=0;i<6;i++)for(let j=0;j<6;j++)if((i+j)%2===0){const x=200+(i-j)*26,y=240+(i+j)*7.5;b+=`<path d="M${x} ${y}l26 7.5-26 7.5-26-7.5z" fill="#73818a" opacity=".45"/>`}
    b+=`<ellipse cx="200" cy="285" rx="60" ry="16" fill="#090d11"/><path d="M152 275h96l-9-16h-78zM169 250h62l-12-80h-38z" fill="url(#u-metal)"/>`;
    if(t.motif.v==='ナイト')b+=`<path d="M175 181l-15-32 27-39 5-32 18 18 26 14 17 35-22 10-17-18-5 44z" fill="url(#u-metal)"/><circle cx="220" cy="123" r="4" fill="#0d202b"/>`;
    else if(t.motif.v==='ルーク')b+=`<path d="M167 172v-57h-8V88h19v15h13V88h18v15h13V88h19v27h-8v57z" fill="url(#u-metal)"/>`;
    else b+=`<path d="M171 170l-12-55 25 17 16-35 16 35 25-17-12 55z" fill="url(#u-metal)"/><circle cx="200" cy="94" r="9" fill="${t.color.c}"/>`;
    b+=`<circle cx="200" cy="208" r="22" fill="#15252d" stroke="${t.color.c}" stroke-width="3"/>`;
    for(let i=0;i<t.detail.n;i++)b+=`<path d="M200 187v8" transform="rotate(${i*360/t.detail.n} 200 208)" stroke="${t.color.c}" stroke-width="3"/>`;
    b+=`<circle cx="200" cy="208" r="8" fill="url(#u-metal)"/>`;
    return uniqueEdition(t,serial,'CLOCKWORK TACTICS',b,'#17242a');
  }
  function drawSynth(r,t,tier,serial){
    let b=`<rect x="31" y="84" width="338" height="220" rx="12" fill="#322c35" stroke="#6c626a" stroke-width="3"/><rect x="42" y="96" width="316" height="196" rx="3" fill="#161b25"/>`;
    for(let col=0;col<4;col++){let x=50+col*77;b+=`<rect x="${x}" y="105" width="69" height="176" rx="2" fill="${col===2?t.color.c:'#d5cfbf'}"/><text x="${x+34}" y="121" text-anchor="middle" font-family="monospace" font-size="8" fill="#202a36">${['OSC','FILTER','ENV','OUTPUT'][col]}</text>`;for(let j=0;j<3;j++){const cy=140+j*39;b+=`<circle cx="${x+34}" cy="${cy}" r="11" fill="#272b34"/><path d="M${x+34} ${cy}v-8" transform="rotate(${r()*220-110} ${x+34} ${cy})" stroke="#f4eee2" stroke-width="2"/>`}for(let j=0;j<2;j++)b+=`<circle cx="${x+19+j*30}" cy="259" r="6" fill="#222" stroke="#777" stroke-width="2"/>`}
    for(let i=0;i<t.detail.n;i++){const x=69+i*30,x2=223+i*24;b+=`<path d="M${x} 259C${x-25} ${320-i*12} ${x2+25} ${321-i*12} ${x2} 259" fill="none" stroke="${[t.color.c,'#e6a35d','#b8d1d7'][i%3]}" stroke-width="5"/>`}
    b+=`<text x="33" y="64" fill="${t.color.c}" font-family="monospace" font-size="9">${esc(t.motif.v.toUpperCase())} / PATCH ARCHIVE</text>`;
    return uniqueEdition(t,serial,'PATCH SIGNALS',b,'#10151f');
  }
  function drawMusicBox(r,t,tier,serial){
    let b=`<circle cx="200" cy="190" r="146" fill="url(#u-light)"/><path d="M83 185l164-48 75 48-165 58z" fill="#b78b65"/><path d="M83 185v83l74 51v-76z" fill="#60453c"/><path d="M157 243l165-58v83l-165 51z" fill="#8a6250"/><path d="M95 184l152-35 58 35-148 48z" fill="#26262d"/><g transform="translate(135 181) rotate(-16)"><rect width="114" height="44" rx="20" fill="url(#u-metal)"/>`;
    for(let i=0;i<18;i++)b+=`<path d="M${5+i*6} 7v30" stroke="#755f41" opacity=".5"/>`;
    for(let i=0;i<25;i++)b+=`<circle cx="${8+r()*98}" cy="${7+r()*30}" r="1.7" fill="#fff3c7"/>`;
    b+=`</g><path d="M321 227h19v21h13" stroke="#d9b779" stroke-width="5" fill="none"/><circle cx="354" cy="248" r="6" fill="${t.color.c}"/>`;
    const count=t.detail.n;for(let i=0;i<count;i++){const x=103+i*40,y=109+Math.sin(i*2)*16;b+=`<g transform="translate(${x} ${y})" fill="${t.color.c}"><ellipse rx="6" ry="4" transform="rotate(-20)"/><path d="M5 0v-23q15 4 9 14v-7l-9-4"/></g>`}
    return uniqueEdition(t,serial,'WIND-UP MELODIES',b,'#2d2630');
  }
  function drawFestival(r,t,tier,serial){
    let b='<rect x="24" y="62" width="352" height="268" fill="#182936"/>';
    for(let i=0;i<35;i++)b+=`<circle cx="${32+r()*336}" cy="${72+r()*230}" r="${1+r()*2}" fill="#edc894" opacity=".35"/>`;
    b+='<path d="M24 90Q200 128 376 90" stroke="#cbb78d" fill="none"/>';
    for(let j=0;j<3;j++){const x=90+j*110,y=j===1?120:143,rad=j===1?47:32;b+=`<path d="M${x} 105v${y-105}" stroke="#d6bd85"/><rect x="${x-rad*.65}" y="${y}" width="${rad*1.3}" height="9" fill="#222129"/><ellipse cx="${x}" cy="${y+57}" rx="${rad}" ry="54" fill="${j===1?t.color.c:'#e9c7a1'}"/>`;for(let i=0;i<7;i++)b+=`<path d="M${x-rad+5} ${y+20+i*12}q${rad-5} 9 ${rad*2-10} 0" stroke="#8e473f" fill="none" opacity=".3"/>`;b+=`<text x="${x}" y="${y+66}" text-anchor="middle" font-size="${j===1?30:23}" fill="#552e33" ${MINCHO}>${t.motif.mark}</text><rect x="${x-rad*.65}" y="${y+108}" width="${rad*1.3}" height="9" fill="#222129"/><path d="M${x} ${y+117}v22" stroke="#cfab6d" stroke-width="3"/>`}
    for(let i=0;i<t.detail.n;i++)b+=`<path d="M${32+i*24} 330v-13l10-9 10 9v13" fill="#0b1520"/>`;
    return uniqueEdition(t,serial,'MATSURI / NIGHT ARCHIVE',b,'#0f1d2b');
  }
  function drawIndigo(r,t,tier,serial){
    let b=`<rect x="42" y="66" width="316" height="263" fill="#d5c7b3"/><path d="M49 73h302v249H49z" fill="${t.color.c}"/>`;
    for(let y=76;y<322;y+=4)b+=`<path d="M49 ${y}h302" stroke="#eee9d8" opacity=".08"/>`;
    b+='<g stroke="#e7eadb" fill="none" stroke-width="1.8" opacity=".85">';
    const step=t.detail.n;
    for(let y=87;y<315;y+=step)for(let x=62;x<344;x+=step){
      if(t.motif.v==='七宝')b+=`<circle cx="${x}" cy="${y}" r="${step*.44}"/>`;
      else if(t.motif.v==='麻の葉')b+=`<path d="M${x-step*.4} ${y}h${step*.8}M${x} ${y-step*.4}v${step*.8}m-${step*.3}-${step*.7}l${step*.6} ${step*.6}m0-${step*.6}l-${step*.6} ${step*.6}"/>`;
      else b+=`<path d="M${x-step*.4} ${y+7}q${step*.4}-${step*.8} ${step*.8} 0m-${step*.65} 0q${step*.25}-${step*.5} ${step*.5} 0"/>`;
    }
    b+='</g><rect x="270" y="273" width="67" height="37" fill="#e9e1ce"/><text x="303" y="297" text-anchor="middle" font-size="16" fill="#263c54" '+MINCHO+'>藍の記憶</text>';
    return uniqueEdition(t,serial,'INDIGO / CRAFT ROUTES',b,'#efe9dd','#24374b');
  }
  function drawMaker(r,t,tier,serial){
    let b='<g stroke="#d2e7de" opacity=".09">';for(let i=45;i<340;i+=20)b+=`<path d="M30 ${i}h340M${i} 53v278"/>`;b+='</g>';
    b+=`<rect x="67" y="82" width="266" height="223" rx="8" fill="none" stroke="${t.color.c}" stroke-width="2" stroke-dasharray="8 4"/><path d="M99 292V106h202v186M99 128h202M116 106v186M284 106v186" stroke="#a6c0c2" stroke-width="7" fill="none"/><path d="M100 271h200" stroke="#a6c0c2" stroke-width="8"/><rect x="177" y="120" width="46" height="27" rx="3" fill="${t.color.c}"/><path d="M194 147h12l-6 17z" fill="#e9d6b1"/>`;
    if(t.motif.v==='3Dプリント')for(let i=0;i<12;i++)b+=`<path d="M${155+i%3*2} ${262-i*7}q45-10 90 0" stroke="${t.color.c}" stroke-width="4" fill="none"/>`;
    else if(t.motif.v==='電子工作')b+=`<rect x="147" y="196" width="106" height="62" rx="4" fill="#284d45" stroke="${t.color.c}"/><rect x="180" y="212" width="35" height="30" fill="#19252a"/>${Array.from({length:5},(_,i)=>`<path d="M${157+i*20} 201v10h10v39" stroke="${t.color.c}" fill="none"/>`).join('')}`;
    else b+=`<path d="M144 258v-60h112v60z" fill="#c3966e"/><path d="M150 209h100m-100 11h100m-100 11h100m-100 11h100" stroke="#866044"/><circle cx="200" cy="227" r="20" fill="none" stroke="#f4d9b4" stroke-width="3"/>`;
    b+=`<text x="82" y="324" fill="${t.color.c}" font-size="9" font-family="monospace">ACCESS : ${esc(t.detail.v.toUpperCase())}</text>`;
    return uniqueEdition(t,serial,'OPEN BENCH GUILD',b,'#17313a');
  }
  function drawObservatory(r,t,tier,serial){
    let b='<circle cx="200" cy="190" r="148" fill="url(#u-light)"/>';
    for(let i=0;i<95;i++)b+=`<circle cx="${25+r()*350}" cy="${50+r()*230}" r="${.4+r()*1.1}" fill="#e8e4d7" opacity="${.3+r()*.7}"/>`;
    const points=t.motif.p;b+=`<polyline points="${points}" fill="none" stroke="${t.color.c}" stroke-width="1.2"/>`;
    for(const pair of points.split(' ')){const [x,y]=pair.split(',');b+=`<circle cx="${x}" cy="${y}" r="3" fill="#fff6db"/><circle cx="${x}" cy="${y}" r="8" fill="none" stroke="${t.color.c}" opacity=".35"/>`}
    b+=`<path d="M63 325v-34h22v-25a70 70 0 0 1 140 0v25h23v34z" fill="#273c51"/><path d="M85 266a70 70 0 0 1 140 0z" fill="url(#u-metal)"/><path d="M155 196q-25 23-25 70" stroke="#102339" stroke-width="12" fill="none"/><path d="M85 285h140" stroke="${t.color.c}"/><path d="M278 325l22-65 24 65M300 260v-16" stroke="#a7b7ca" stroke-width="4"/><g transform="rotate(-32 300 240)"><rect x="265" y="229" width="71" height="21" rx="3" fill="${t.color.c}"/><rect x="330" y="224" width="10" height="31" fill="#e7e2ce"/></g>`;
    return uniqueEdition(t,serial,'AFTER DARK OBSERVATORY',b,'#0b1428');
  }
  const uniqueSpecs=[
    ['paperform',drawPaperSculpture,'Fold Form','造形',[{v:'折りの環'},{v:'紙の階段'},{v:'回転する面'}],'紙の構成',[{v:'8 layers',n:8},{v:'10 layers',n:10},{v:'12 layers',n:12}],[['珊瑚','#c46d55'],['青磁','#4e9292'],['黄土','#b99a50']]],
    ['kintsugi',drawKintsugi,'Second Life','器の形',[{v:'茶碗'},{v:'花器'},{v:'湯呑み'}],'継ぎの線',[{v:'Left seam',x:-20},{v:'Central seam',x:0},{v:'Right seam',x:18}],[['青磁釉','#7bafa6'],['瑠璃釉','#405d9e'],['白釉','#d7d1bb']]],
    ['racer',drawRacer,'Apex Racer','機体',[{v:'Interceptor',w:77},{v:'Delta Wing',w:108},{v:'Arrow',w:55}],'エンジン',[{v:'Twin drive',n:2},{v:'Triple drive',n:3},{v:'Quad drive',n:4}],[['Ion cyan','#67dce6'],['Solar orange','#ef9759'],['Plasma violet','#bba0ef']]],
    ['clockchess',drawClockChess,'Clockwork Piece','駒',[{v:'ナイト'},{v:'ルーク'},{v:'クイーン'}],'歯車',[{v:'8 teeth',n:8},{v:'12 teeth',n:12},{v:'16 teeth',n:16}],[['真鍮','#d6b875'],['白銀','#b7d0d6'],['赤銅','#ca8c73']]],
    ['synth',drawSynth,'Patch Signal','音色',[{v:'Acid sequence'},{v:'Drone study'},{v:'Broken rhythm'}],'パッチ接続',[{v:'2 cables',n:2},{v:'3 cables',n:3},{v:'4 cables',n:4}],[['Signal red','#eb846c'],['Voltage yellow','#e6c768'],['Circuit mint','#8acbb3']]],
    ['musicbox',drawMusicBox,'Wind-up Melody','楽曲',[{v:'星降るワルツ'},{v:'小さな行進曲'},{v:'夜明けの子守歌'}],'譜面',[{v:'3 notes',n:3},{v:'4 notes',n:4},{v:'5 notes',n:5}],[['Champagne','#eac98b'],['Moonlight','#b7d6e8'],['Rose gold','#e9ad9e']]],
    ['festival',drawFestival,'祭りの夜','紋',[{v:'花の紋',mark:'花'},{v:'月の紋',mark:'月'},{v:'祭の紋',mark:'祭'}],'通り',[{v:'路地',n:9},{v:'参道',n:12},{v:'大通り',n:14}],[['朱','#ef9c78'],['山吹','#f0cc70'],['桜','#edb3b1']]],
    ['indigo',drawIndigo,'藍の記憶','文様',[{v:'七宝'},{v:'麻の葉'},{v:'青海波'}],'型の間隔',[{v:'細目',n:24},{v:'中目',n:32},{v:'大柄',n:40}],[['濃藍','#243e65'],['縹','#3d6b8d'],['藍鼠','#526d7e']]],
    ['maker',drawMaker,'Open Bench','工房',[{v:'3Dプリント'},{v:'電子工作'},{v:'木工'}],'利用プラン',[{v:'Day access'},{v:'Resident'},{v:'Mentor circle'}],[['Blueprint','#93c9d4'],['Workshop amber','#e9bb79'],['Circuit green','#9fc7a9']]],
    ['observatory',drawObservatory,'After Dark','星図',[{v:'北斗七星',p:'87,99 129,111 167,104 202,128 233,118 248,88 212,80 202,128'},{v:'カシオペヤ',p:'89,113 128,150 170,94 218,123 259,75'},{v:'夏の大三角',p:'127,83 277,140 202,177 127,83'}],'会員プラン',[{v:'Night observer'},{v:'Astro photo'},{v:'Deep sky circle'}],[['Starlight','#c5c5ea'],['Lunar silver','#b9d5dd'],['Solar brass','#d9b77d']]]
  ];
  for(const [key,draw,title,motifLabel,motifs,detailLabel,details,colors] of uniqueSpecs){
    STYLES[key]={draw,title:(r,t,serial)=>`${title} · ${t.motif.v} #${String(serial).padStart(4,'0')}`,traits:[
      {key:'motif',label:motifLabel,options:motifs},{key:'detail',label:detailLabel,options:details},
      {key:'color',label:'カラー',options:colors.map(([v,c])=>({v,c}))}
    ]};
  }

  function create(style,seed,tier=0,serial=1){
    const cacheKey=`${style}|${seed}|${tier}|${serial}`;
    if(cache.has(cacheKey))return cache.get(cacheKey);
    const def=STYLES[style];if(!def)return null;
    const r=rng(seed),chosen={};
    const traits=def.traits.map(trait=>{const option=choose(r,trait.options,tier);chosen[trait.key]=option;return {label:trait.label,value:option.v,share:share(trait.options,option)}});
    const tierLabel=(def.tierLabels||TIER_LABELS)[tier];
    traits.unshift({label:def.tierTraitLabel||"レアリティ",value:tierLabel,share:TIER_SHARE[tier]});
    const title=def.title(rng(`${seed}#title`),chosen,serial);
    let uri=null;
    const art={traits,title,tierLabel,uri(){
      if(!uri)uri=`data:image/svg+xml;charset=utf-8,${encodeURIComponent(def.draw(rng(`${seed}#draw`),chosen,tier,serial,title))}`;
      return uri;
    }};
    cache.set(cacheKey,art);return art;
  }

  return {create,rng,hash,TIER_LABELS,TIER_SHARE,tierLabels:style=>STYLES[style]?.tierLabels||TIER_LABELS};
})();
