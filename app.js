(() => {
  'use strict';

  const VERSION = '2.3.0';
  const STORAGE_KEY = 'cryptoConte.v2.state';
  const MARKET_TTL = 90 * 1000;
  const AUTO_REFRESH_MS = 150 * 1000;
  const OPPORTUNITY_TTL = 15 * 60 * 1000;
  const SAFETY_KEY = 'cryptoConte.v2.safety';
  const STABLE_SYMBOLS = new Set(['USDT','USDC','DAI','FDUSD','USDE','USDS','PYUSD','TUSD','USDD','FRAX','EURC','EURT','RLUSD']);
  const NOW_ISO_LOCAL = () => {
    const d = new Date();
    const z = n => String(n).padStart(2,'0');
    return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}`;
  };

  const CATALOG = [
    {symbol:'BTC',name:'Bitcoin',id:'bitcoin'},
    {symbol:'ETH',name:'Ethereum',id:'ethereum'},
    {symbol:'SOL',name:'Solana',id:'solana'},
    {symbol:'XRP',name:'XRP',id:'ripple'},
    {symbol:'AVAX',name:'Avalanche',id:'avalanche-2'},
    {symbol:'NEAR',name:'NEAR Protocol',id:'near'},
    {symbol:'PEPE',name:'Pepe',id:'pepe'},
    {symbol:'ADA',name:'Cardano',id:'cardano'},
    {symbol:'LINK',name:'Chainlink',id:'chainlink'},
    {symbol:'DOGE',name:'Dogecoin',id:'dogecoin'},
    {symbol:'DOT',name:'Polkadot',id:'polkadot'},
    {symbol:'SUI',name:'Sui',id:'sui'},
    {symbol:'RENDER',name:'Render',id:'render-token'},
    {symbol:'UNI',name:'Uniswap',id:'uniswap'},
    {symbol:'LTC',name:'Litecoin',id:'litecoin'},
    {symbol:'XLM',name:'Stellar',id:'stellar'},
    {symbol:'APT',name:'Aptos',id:'aptos'},
    {symbol:'ARB',name:'Arbitrum',id:'arbitrum'},
    {symbol:'OP',name:'Optimism',id:'optimism'},
    {symbol:'TON',name:'Toncoin',id:'the-open-network'},
    {symbol:'MEW',name:'cat in a dogs world',id:'cat-in-a-dogs-world'},
    {symbol:'PYTH',name:'Pyth Network',id:'pyth-network'}
  ];

  const BASELINE = {
    snapshotAt: '2026-09-26T13:43:00',
    ownDeposits: 100,
    rewardDeposits: 7.46,
    withdrawals: 0,
    cash: {base: 0, test: 6.99},
    positions: [
      {symbol:'ETH',name:'Ethereum',id:'ethereum',qty:0.00848925,avg:2396.93,account:'base',openedAt:'2026-09-22T22:00:00'},
      {symbol:'SOL',name:'Solana',id:'solana',qty:0.193752,avg:103.220,account:'base',openedAt:'2026-09-22T22:00:00'},
      {symbol:'XRP',name:'XRP',id:'ripple',qty:14.46818,avg:1.3823,account:'base',openedAt:'2026-09-22T22:29:00'},
      {symbol:'AVAX',name:'Avalanche',id:'avalanche-2',qty:1.5637,avg:9.592,account:'base',openedAt:'2026-09-22T22:31:00'},
      {symbol:'NEAR',name:'NEAR Protocol',id:'near',qty:3.99129,avg:3.7581,account:'base',openedAt:'2026-09-22T22:32:00'},
      {symbol:'PEPE',name:'Pepe',id:'pepe',qty:2340030,avg:0.0000042734,account:'base',openedAt:'2026-09-22T22:33:00'}
    ],
    history: [
      {id:'h-sol',date:'2026-09-22T22:00:00',type:'BUY',account:'base',symbol:'SOL',qty:0.193752,amount:20,note:'Posizione iniziale'},
      {id:'h-eth',date:'2026-09-22T22:00:00',type:'BUY',account:'base',symbol:'ETH',qty:0.0083,amount:20,note:'Posizione iniziale'},
      {id:'h-xrp',date:'2026-09-22T22:29:00',type:'BUY',account:'base',symbol:'XRP',qty:14.46818,amount:20,note:'Posizione iniziale'},
      {id:'h-avax',date:'2026-09-22T22:31:00',type:'BUY',account:'base',symbol:'AVAX',qty:1.5637,amount:15,note:'Posizione iniziale'},
      {id:'h-near',date:'2026-09-22T22:32:00',type:'BUY',account:'base',symbol:'NEAR',qty:3.99129,amount:15,note:'Posizione iniziale'},
      {id:'h-pepe',date:'2026-09-22T22:33:00',type:'BUY',account:'base',symbol:'PEPE',qty:2340030,amount:10,note:'Posizione iniziale'},
      {id:'h-reward-eth',date:'2026-09-25T13:30:00',type:'BUY',account:'base',symbol:'ETH',qty:0.0031,amount:7.46,note:'Acquisto con reward quiz'},
      {id:'h-eth-sell',date:'2026-09-26T13:32:00',type:'SELL',account:'base',symbol:'ETH',qty:0.0029,amount:7,fee:0.01,note:'Vendita per creare Fondo Test'},
      {id:'h-transfer',date:'2026-09-26T13:33:00',type:'TRANSFER',account:'base',toAccount:'test',amount:6.99,note:'Fondo Test iniziale'}
    ],
    seedMarket: {
      bitcoin:{id:'bitcoin',symbol:'btc',name:'Bitcoin',current_price:73876,price_change_percentage_1h_in_currency:null,price_change_percentage_24h_in_currency:-0.73,price_change_percentage_7d_in_currency:null,price_change_percentage_30d_in_currency:null,total_volume:null,sparkline_in_7d:{price:[]}},
      ethereum:{id:'ethereum',symbol:'eth',name:'Ethereum',current_price:2360.77,price_change_percentage_1h_in_currency:null,price_change_percentage_24h_in_currency:-1.3,price_change_percentage_7d_in_currency:null,price_change_percentage_30d_in_currency:null,total_volume:null,sparkline_in_7d:{price:[]}},
      solana:{id:'solana',symbol:'sol',name:'Solana',current_price:105.941,price_change_percentage_1h_in_currency:null,price_change_percentage_24h_in_currency:-0.2,price_change_percentage_7d_in_currency:null,price_change_percentage_30d_in_currency:null,total_volume:null,sparkline_in_7d:{price:[]}},
      ripple:{id:'ripple',symbol:'xrp',name:'XRP',current_price:1.36,price_change_percentage_1h_in_currency:null,price_change_percentage_24h_in_currency:-2.3,price_change_percentage_7d_in_currency:null,price_change_percentage_30d_in_currency:null,total_volume:null,sparkline_in_7d:{price:[]}},
      'avalanche-2':{id:'avalanche-2',symbol:'avax',name:'Avalanche',current_price:9.566,price_change_percentage_1h_in_currency:null,price_change_percentage_24h_in_currency:2.6,price_change_percentage_7d_in_currency:null,price_change_percentage_30d_in_currency:null,total_volume:null,sparkline_in_7d:{price:[]}},
      near:{id:'near',symbol:'near',name:'NEAR Protocol',current_price:4.3454,price_change_percentage_1h_in_currency:null,price_change_percentage_24h_in_currency:-1.1,price_change_percentage_7d_in_currency:null,price_change_percentage_30d_in_currency:null,total_volume:null,sparkline_in_7d:{price:[]}},
      pepe:{id:'pepe',symbol:'pepe',name:'Pepe',current_price:0.0000038817,price_change_percentage_1h_in_currency:null,price_change_percentage_24h_in_currency:-3.8,price_change_percentage_7d_in_currency:null,price_change_percentage_30d_in_currency:null,total_volume:null,sparkline_in_7d:{price:[]}}
    }
  };

  const defaultState = () => ({
    version: VERSION,
    watchlist: [],
    watchlistIds: [],
    ops: [],
    notes: [],
    customAssets: [],
    marketCache: {time:0,data:{...BASELINE.seedMarket}},
    opportunity: {time:0,candidates:[],prev:{},signals:[],trending:[]},
    ui: {lastView:'home'}
  });

  let state = loadState();
  let market = {...BASELINE.seedMarket, ...(state.marketCache?.data || {})};
  let currentSheetAsset = null;
  let currentRange = '7d';
  let renderTimer = null;
  let watchSearchTimer = null;
  let marketRefreshInFlight = false;
  let opportunityScanInFlight = false;

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const esc = v => String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const uid = () => `op-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const num = v => Number.isFinite(Number(v)) ? Number(v) : 0;
  const round = (v,d=8) => Number(Number(v).toFixed(d));

  function loadState(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return defaultState();
      const saved = JSON.parse(raw);
      const base = defaultState();
      const merged = {...base,...saved,ui:{...base.ui,...(saved.ui||{})},marketCache:saved.marketCache||base.marketCache,opportunity:{...base.opportunity,...(saved.opportunity||{})}};
      if(!Array.isArray(saved.watchlistIds)){
        merged.watchlistIds=(saved.watchlist||[]).map(sym=>CATALOG.find(a=>a.symbol===String(sym).toUpperCase())?.id).filter(Boolean);
      }
      if(!Array.isArray(merged.opportunity.candidates)) merged.opportunity.candidates=[];
      if(!Array.isArray(merged.opportunity.signals)) merged.opportunity.signals=[];
      if(!merged.opportunity.prev || typeof merged.opportunity.prev!=='object') merged.opportunity.prev={};
      return merged;
    }catch(_){ return defaultState(); }
  }
  function saveState(){ state.version = VERSION; localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function checkpointState(label='Modifica dati'){
    try{ localStorage.setItem(SAFETY_KEY,JSON.stringify({time:Date.now(),label,state:JSON.parse(JSON.stringify(state))})); }catch(_){ }
  }
  function getCheckpoint(){ try{return JSON.parse(localStorage.getItem(SAFETY_KEY)||'null');}catch(_){return null;} }
  function restoreCheckpoint(){
    const cp=getCheckpoint(); if(!cp?.state){toast('Nessun punto sicurezza disponibile');return;}
    if(!confirm(`Ripristinare il punto sicurezza “${cp.label||'salvataggio'}”?`)) return;
    state={...defaultState(),...cp.state,opportunity:{...defaultState().opportunity,...(cp.state.opportunity||{})}}; saveState(); market={...BASELINE.seedMarket,...(state.marketCache?.data||{})}; renderAll(); refreshMarket(true); toast('Punto sicurezza ripristinato');
  }

  function allAssets(){
    const map = new Map();
    [...CATALOG,...BASELINE.positions,...(state.customAssets||[])].forEach(a=>map.set(a.symbol.toUpperCase(),{...a,symbol:a.symbol.toUpperCase()}));
    return [...map.values()];
  }
  function assetBySymbol(symbol){ return allAssets().find(a=>a.symbol===String(symbol).toUpperCase()) || null; }
  function assetById(id){ return allAssets().find(a=>a.id===id) || (state.opportunity?.candidates||[]).find(a=>a.id===id) || null; }
  function watchAssets(){ return (state.watchlistIds||[]).map(assetById).filter(Boolean); }
  function isWatched(a){ return !!a && (state.watchlistIds||[]).includes(a.id); }

  function replay(){
    const positions = BASELINE.positions.map(p=>({...p}));
    const cash = {...BASELINE.cash};
    let ownDeposits = BASELINE.ownDeposits;
    let rewardDeposits = BASELINE.rewardDeposits;
    let withdrawals = BASELINE.withdrawals;
    const realized = {};
    const closed = [];

    const getPos = (symbol,account) => positions.find(p=>p.symbol===symbol && p.account===account && p.qty>1e-15);
    const ensurePos = (symbol,account,meta,date) => {
      let p = getPos(symbol,account);
      if(!p){
        p={symbol,name:meta?.name||symbol,id:meta?.id||symbol.toLowerCase(),qty:0,avg:0,account,openedAt:date};
        positions.push(p);
      }
      return p;
    };

    [...state.ops].sort((a,b)=>new Date(a.date)-new Date(b.date)).forEach(op=>{
      const amount=num(op.amount), fee=num(op.fee), qty=num(op.qty), account=op.account||'base';
      if(op.type==='DEPOSIT_PERSONAL'){
        cash[account]+=amount; ownDeposits+=amount;
      }else if(op.type==='DEPOSIT_REWARD'){
        cash[account]+=amount; rewardDeposits+=amount;
      }else if(op.type==='WITHDRAW'){
        cash[account]-=amount; withdrawals+=amount;
      }else if(op.type==='TRANSFER'){
        const to=op.toAccount|| (account==='base'?'test':'base'); cash[account]-=amount; cash[to]+=amount;
      }else if(op.type==='BUY'){
        const meta=assetBySymbol(op.symbol)||{symbol:op.symbol,name:op.name,id:op.assetId};
        const p=ensurePos(op.symbol,account,meta,op.date);
        const cost=amount+fee;
        cash[account]-=cost;
        const oldCost=p.qty*p.avg;
        p.qty+=qty;
        if(p.qty>0) p.avg=(oldCost+cost)/p.qty;
      }else if(op.type==='SELL'){
        const p=getPos(op.symbol,account);
        if(!p) return;
        const sold=Math.min(qty,p.qty);
        const costRemoved=sold*p.avg;
        const proceeds=amount-fee;
        cash[account]+=proceeds;
        realized[op.symbol]=(realized[op.symbol]||0)+(proceeds-costRemoved);
        p.qty=round(p.qty-sold,12);
        if(p.qty<=1e-12){
          closed.push({symbol:p.symbol,name:p.name,account:p.account,closedAt:op.date,realized:realized[p.symbol]||0});
          p.qty=0;
        }
      }
    });

    return {positions:positions.filter(p=>p.qty>1e-12),cash,ownDeposits,rewardDeposits,withdrawals,realized,closed};
  }

  function mktFor(p){ return market[p.id] || state.marketCache?.data?.[p.id] || BASELINE.seedMarket[p.id] || null; }
  function currentPrice(p){ return num(mktFor(p)?.current_price); }
  function positionValue(p){ return p.qty*currentPrice(p); }
  function positionCost(p){ return p.qty*p.avg; }
  function positionPnl(p){ return positionValue(p)-positionCost(p); }
  function positionPnlPct(p){ const c=positionCost(p); return c ? positionPnl(p)/c*100 : 0; }

  function fmtEUR(v,force=2){
    if(!Number.isFinite(v)) return '—';
    return new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR',minimumFractionDigits:force,maximumFractionDigits:force}).format(v);
  }
  function fmtPrice(v){
    if(!Number.isFinite(v)||v===0) return '—';
    const d=v>=1000?2:v>=1?4:v>=0.01?6:10;
    return `${new Intl.NumberFormat('it-IT',{minimumFractionDigits:Math.min(2,d),maximumFractionDigits:d}).format(v)} €`;
  }
  function fmtPct(v){ return Number.isFinite(v) ? `${v>=0?'+':''}${v.toFixed(2)}%` : '—'; }
  function fmtQty(v){
    if(!Number.isFinite(v)) return '—';
    const d=v>=100000?0:v>=100?2:v>=1?5:8;
    return new Intl.NumberFormat('it-IT',{maximumFractionDigits:d}).format(v);
  }
  function fmtCompact(v){
    if(!Number.isFinite(v)) return '—';
    return new Intl.NumberFormat('it-IT',{notation:'compact',maximumFractionDigits:1}).format(v);
  }
  function fmtDate(v){ try{return new Intl.DateTimeFormat('it-IT',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(v));}catch(_){return v||'';} }
  function cls(v){ return v>0.0001?'positive':v<-.0001?'negative':'neutral'; }

  function sparkSVG(values){
    const a=(values||[]).filter(Number.isFinite);
    if(a.length<2) return '<div class="muted small">Trend 7g in attesa</div>';
    const W=240,H=50,pad=3,min=Math.min(...a),max=Math.max(...a),span=max-min||1;
    const pts=a.map((v,i)=>[pad+(W-pad*2)*(i/(a.length-1)),H-pad-(H-pad*2)*((v-min)/span)]);
    const line=pts.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    const area=`${line} L${pts[pts.length-1][0].toFixed(1)},${H} L${pts[0][0].toFixed(1)},${H} Z`;
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><path class="area" d="${area}"></path><path class="line" d="${line}"></path></svg>`;
  }

  function radarStatus(m){
    const h=num(m?.price_change_percentage_1h_in_currency), d=num(m?.price_change_percentage_24h_in_currency), w=num(m?.price_change_percentage_7d_in_currency);
    if(Math.abs(d)>=8 || Math.abs(w)>=18) return {label:'MOVIMENTO FORTE',tone:'warn'};
    if(d>=3 && w>=5) return {label:'IN ACCELERAZIONE',tone:'good'};
    if(d<=-3 && w<=-5) return {label:'DEBOLE',tone:'bad'};
    if(Math.abs(d)<1.5) return {label:'NEUTRALE',tone:''};
    return {label:d>0?'POSITIVO':'NEGATIVO',tone:d>0?'good':'bad'};
  }
  function radarReason(m,owned){
    const bits=[];
    if(Number.isFinite(m?.price_change_percentage_24h_in_currency)) bits.push(`24h ${fmtPct(m.price_change_percentage_24h_in_currency)}`);
    if(Number.isFinite(m?.price_change_percentage_7d_in_currency)) bits.push(`7g ${fmtPct(m.price_change_percentage_7d_in_currency)}`);
    if(Number.isFinite(m?.total_volume)) bits.push(`volume 24h ${fmtCompact(m.total_volume)} €`);
    return `${owned?'Posizione posseduta':'Watchlist'} · ${bits.length?bits.join(' · '):'dati trend in aggiornamento'}.`;
  }


  function candidateTone(status){ return status==='INTERESSANTE'?'good':status==='NON INSEGUIRE'?'warn':''; }
  function pctChange(from,to){ return from>0&&Number.isFinite(to)?(to/from-1)*100:null; }
  function screenOpportunity(x,btc,prev,trendingIds){
    const h=num(x.price_change_percentage_1h_in_currency),d=num(x.price_change_percentage_24h_in_currency),w=num(x.price_change_percentage_7d_in_currency);
    const bd=num(btc?.price_change_percentage_24h_in_currency),bw=num(btc?.price_change_percentage_7d_in_currency);
    const rel24=d-bd, rel7=w-bw, vol=num(x.total_volume),cap=num(x.market_cap),volRatio=cap>0?vol/cap:0;
    const volDelta=prev?.volume>0?(vol/prev.volume-1)*100:null;
    const scanMove=prev?.price>0?pctChange(prev.price,num(x.current_price)):null;
    const trending=trendingIds.has(x.id);
    let score=0;
    if(volRatio>=.22) score+=3; else if(volRatio>=.10) score+=2; else if(volRatio>=.05) score+=1;
    if(volDelta!=null&&volDelta>=12) score+=3; else if(volDelta!=null&&volDelta>=5) score+=2;
    if(scanMove!=null&&scanMove>=.45&&scanMove<=3.5) score+=2; else if(scanMove!=null&&scanMove>=.15) score+=1;
    if(h>=.30&&h<=4.5) score+=2;
    if(d>=1.5&&d<=12) score+=2; else if(d>0) score+=1;
    if(rel24>=2.5) score+=3; else if(rel24>=1) score+=2;
    if(rel7>=4) score+=1;
    if(trending) score+=2;
    if(d<=-7||rel24<=-5) score-=3;
    return {...x,_screenScore:score,_screenMove:scanMove,_rel24:rel24,_rel7:rel7};
  }

  function analyzeOpportunity(x,btc,prev,trendingIds){
    const h=num(x.price_change_percentage_1h_in_currency),d=num(x.price_change_percentage_24h_in_currency),w=num(x.price_change_percentage_7d_in_currency);
    const bd=num(btc?.price_change_percentage_24h_in_currency),bw=num(btc?.price_change_percentage_7d_in_currency);
    const rel24=d-bd, rel7=w-bw, vol=num(x.total_volume),cap=num(x.market_cap),volRatio=cap>0?vol/cap:0;
    const volDelta=prev?.volume>0?(vol/prev.volume-1)*100:null;
    const scanMove=prev?.price>0?pctChange(prev.price,num(x.current_price)):null;
    const spark=(x.sparkline_in_7d?.price||[]).filter(Number.isFinite), last24=spark.slice(-24), prior24=spark.slice(-48,-24);
    const avg=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0, rangePct=a=>{const av=avg(a);return av?((Math.max(...a)-Math.min(...a))/av*100):99;};
    const range24=last24.length>8?rangePct(last24):99, max24=last24.length?Math.max(...last24):num(x.high_24h), priorHigh=prior24.length?Math.max(...prior24):0;
    const nearHigh=max24>0&&num(x.current_price)>=max24*.985, compressed=range24<=5.5;
    const breakout=priorHigh>0&&num(x.current_price)>priorHigh*1.003&&d>0;
    const trending=trendingIds.has(x.id);
    const overextended=h>=4.5||d>=14||(d>=10&&nearHigh&&!compressed);
    let score=0;
    if(volRatio>=.22) score+=2; else if(volRatio>=.10) score+=1;
    if(volDelta!=null&&volDelta>=12) score+=2; else if(volDelta!=null&&volDelta>=5) score+=1;
    if(scanMove!=null&&scanMove>=.45&&scanMove<=3.5) score+=2; else if(scanMove!=null&&scanMove>=.15) score+=1;
    if(h>=.35&&h<=3.5) score+=1;
    if(d>=2&&d<=10) score+=2; else if(d>0&&d<2) score+=1;
    if(rel24>=2.5) score+=2; else if(rel24>=1) score+=1;
    if(rel7>=4) score+=1;
    if(compressed&&nearHigh) score+=2;
    if(breakout) score+=2;
    if(trending) score+=1;
    if(d<=-5||rel24<=-4) score-=2;
    let status=null;
    if(overextended&&(d>=8||h>=4.5)) status='NON INSEGUIRE';
    else if(score>=7&&d>0&&rel24>0) status='INTERESSANTE';
    else if(score>=4) status='OSSERVA';
    if(!status) return null;
    const reasons=[];
    if(volDelta!=null&&volDelta>=10) reasons.push(`volume in aumento ${fmtPct(volDelta)}`); else if(volRatio>=.18) reasons.push('volume molto attivo');
    if(scanMove!=null&&scanMove>=.30&&scanMove<=3.5) reasons.push(`accelerazione scan ${fmtPct(scanMove)}`);
    if(d>=2&&d<=10) reasons.push(`momentum 24h ${fmtPct(d)}`);
    if(rel24>=1.5) reasons.push(`forza vs BTC ${fmtPct(rel24)}`);
    if(compressed&&nearHigh) reasons.push('compressione vicino ai massimi 24h');
    else if(breakout) reasons.push('tentativo di breakout');
    if(trending) reasons.push('interesse CoinGecko in aumento');
    if(overextended) reasons.unshift('movimento già molto esteso');
    return {...x,symbol:String(x.symbol||'').toUpperCase(),status,tone:candidateTone(status),score,reason:reasons.slice(0,4).join(' · ')||'movimento da osservare',rel24,rel7,volRatio,volDelta,scanMove,range24,nearHigh,breakout,trending};
  }

  function updateSignalOutcomes(rows){
    const map=new Map((rows||[]).map(x=>[x.id,x]));
    const now=Date.now(); let changed=false;
    (state.opportunity.signals||[]).forEach(sig=>{
      const x=map.get(sig.id)||market[sig.id]; if(!x||!num(x.current_price)) return;
      const hours=(now-num(sig.time))/3600000;
      if(hours>=24&&!sig.outcome24){ sig.outcome24={time:now,hours,price:num(x.current_price),pct:pctChange(sig.price,num(x.current_price))}; changed=true; }
      if(hours>=48&&!sig.outcome48){ sig.outcome48={time:now,hours,price:num(x.current_price),pct:pctChange(sig.price,num(x.current_price))}; changed=true; }
    });
    if(changed) state.opportunity.signals=state.opportunity.signals.slice(-30);
  }
  function recordOpportunitySignals(candidates){
    const now=Date.now(); const signals=state.opportunity.signals||[];
    candidates.filter(c=>c.status==='INTERESSANTE'||c.status==='OSSERVA').forEach(c=>{
      const last=[...signals].reverse().find(s=>s.id===c.id);
      if(last&&now-num(last.time)<24*3600000) return;
      signals.push({signalId:`sig-${now}-${c.id}`,id:c.id,symbol:c.symbol,name:c.name,time:now,price:num(c.current_price),status:c.status,reason:c.reason,outcome24:null,outcome48:null});
    });
    state.opportunity.signals=signals.slice(-30);
  }
  function signalOutcomeLabel(o,label){
    if(!o) return `<span class="pending">${label}: in attesa</span>`;
    return `<span class="${cls(num(o.pct))}">${label}: ${fmtPct(o.pct)}</span>`;
  }

  function portfolioSnapshot(){
    const r=replay();
    const byPerformance=(a,b)=>positionPnlPct(b)-positionPnlPct(a)||positionPnl(b)-positionPnl(a)||a.symbol.localeCompare(b.symbol);
    const basePos=r.positions.filter(p=>p.account==='base').sort(byPerformance);
    const testPos=r.positions.filter(p=>p.account==='test').sort(byPerformance);
    const baseValue=basePos.reduce((s,p)=>s+positionValue(p),0)+r.cash.base;
    const testValue=testPos.reduce((s,p)=>s+positionValue(p),0)+r.cash.test;
    const total=baseValue+testValue;
    const result=total+r.withdrawals-r.ownDeposits-r.rewardDeposits;
    return {...r,basePos,testPos,baseValue,testValue,total,result};
  }

  function renderHome(){
    const s=portfolioSnapshot();
    const btc=market.bitcoin||BASELINE.seedMarket.bitcoin;
    const rs=radarStatus(btc);
    const pnlClass=s.result>=0?'good':'bad';
    $('#view-home').innerHTML=`
      <div class="summary-grid">
        <div class="summary-card"><div class="label">Capitale tuo</div><div class="big">${fmtEUR(s.ownDeposits)}</div><div class="sub">versamenti personali netti</div></div>
        <div class="summary-card"><div class="label">Reward / bonus</div><div class="big">${fmtEUR(s.rewardDeposits)}</div><div class="sub">separati dal capitale tuo</div></div>
        <div class="summary-card"><div class="label">Valore totale</div><div class="big">${fmtEUR(s.total)}</div><div class="sub">Base + Fondo Test + liquidità</div></div>
        <div class="summary-card ${pnlClass}"><div class="label">Risultato reale</div><div class="big">${fmtEUR(s.result)}</div><div class="sub">${fmtPct((s.ownDeposits+s.rewardDeposits)?s.result/(s.ownDeposits+s.rewardDeposits)*100:0)} sul capitale entrato</div></div>
      </div>

      <div class="market-hero" data-open-asset="BTC">
        <div class="market-hero-top"><div><div class="eyebrow">RADAR MERCATO · BTC</div><h3>Termometro generale</h3></div><div class="market-price">${fmtPrice(num(btc.current_price))}</div></div>
        <div style="margin-top:9px"><span class="status-pill ${rs.tone}">${rs.label}</span></div>
        <div class="market-strip">
          <div class="metric"><span>1h</span><b class="${cls(num(btc.price_change_percentage_1h_in_currency))}">${fmtPct(btc.price_change_percentage_1h_in_currency)}</b></div>
          <div class="metric"><span>24h</span><b class="${cls(num(btc.price_change_percentage_24h_in_currency))}">${fmtPct(btc.price_change_percentage_24h_in_currency)}</b></div>
          <div class="metric"><span>7g</span><b class="${cls(num(btc.price_change_percentage_7d_in_currency))}">${fmtPct(btc.price_change_percentage_7d_in_currency)}</b></div>
        </div>
        <div class="hero-reason">${radarReason(btc,false)} Tocca per aprire il dettaglio.</div>
      </div>

      <div class="section-title"><div><h2>Portafoglio Base</h2><p>${fmtEUR(s.baseValue)} · ${s.basePos.length} posizioni${s.cash.base?` · liquidità ${fmtEUR(s.cash.base)}`:''} · ordinate per P/L totale %</p></div></div>
      <div class="portfolio-grid">${s.basePos.map(assetCard).join('')}</div>

      <div class="section-title"><div><h2>Fondo Test</h2><p>Separato dal portafoglio Base</p></div><div class="right"><span class="status-pill good">PRONTO</span></div></div>
      <div class="cash-card">
        <div class="cash-row"><div><div class="cash-title">⚡ Fondo Test</div><div class="muted small">operazioni sperimentali registrate a parte</div></div><div class="cash-value">${fmtEUR(s.testValue)}</div></div>
        <div class="cash-details"><div class="cash-mini"><span>Liquidità</span><b>${fmtEUR(s.cash.test)}</b></div><div class="cash-mini"><span>Posizioni aperte</span><b>${s.testPos.length}</b></div></div>
        ${s.testPos.length?`<div class="portfolio-grid" style="margin-top:12px">${s.testPos.map(assetCard).join('')}</div>`:''}
      </div>
    `;
  }

  function assetCard(p){
    const m=mktFor(p), value=positionValue(p), pnl=positionPnl(p), pct=positionPnlPct(p), day=m?.price_change_percentage_24h_in_currency;
    return `<article class="asset-card" data-open-asset="${esc(p.symbol)}">
      <div class="asset-head"><div class="asset-name">${esc(p.symbol)} · ${esc(p.name)}</div><span class="status-pill ${pct>=5?'good':pct<=-5?'bad':''}">${pct>=5?'IN PROFITTO':pct<=-5?'SOTTO CARICO':'IN EQUILIBRIO'}</span></div>
      <div class="asset-value">${fmtEUR(value)}</div>
      <div class="asset-pnl ${cls(pnl)}">${fmtEUR(pnl)} · ${fmtPct(pct)}</div>
      <div class="asset-meta">24h <span class="${cls(num(day))}">${fmtPct(day)}</span> · prezzo ${fmtPrice(currentPrice(p))}</div>
      <div class="spark">${sparkSVG(m?.sparkline_in_7d?.price)}</div>
      <div class="tag">tocca per dettagli</div>
    </article>`;
  }

  function renderRadar(){
    const s=portfolioSnapshot();
    const ownedSymbols=new Set(s.positions.map(p=>p.symbol));
    const base=[assetBySymbol('BTC'),assetBySymbol('ETH'),...s.positions.map(p=>assetBySymbol(p.symbol)||p),...watchAssets()].filter(Boolean);
    const map=new Map(); base.forEach(a=>map.set(a.id||a.symbol,a));
    const items=[...map.values()];
    const opp=state.opportunity||defaultState().opportunity;
    const scanTime=opp.time?fmtDate(opp.time):'mai';
    const signals=[...(opp.signals||[])].sort((a,b)=>b.time-a.time).slice(0,8);
    $('#view-radar').innerHTML=`
      <div class="section-title"><div><h2>Radar Opportunità</h2><p>Scansione automatica del mercato ogni 15 minuti · ultimo scan ${scanTime}</p></div><div class="right"><button class="chip-btn" data-action="scan-opportunities">◎ Scansiona</button></div></div>
      <div class="radar-explain"><b>Cosa cerca:</b> volume e sua accelerazione, momentum, forza rispetto a BTC, compressione/breakout e interesse di mercato. Scansiona un universo ampio per capitalizzazione, volume e Trending, poi mostra pochi candidati per capire <i>perché</i> meritano attenzione, non ordini di acquisto.</div>
      <div class="opportunity-list">${(opp.candidates||[]).length?(opp.candidates||[]).map(c=>{
        const owned=ownedSymbols.has(c.symbol), watched=isWatched(c);
        return `<article class="opportunity-card" data-open-asset="${esc(c.symbol)}">
          <div class="radar-top"><div><div class="radar-title">${esc(c.symbol)} · ${esc(c.name)}</div><div class="radar-sub">${owned?'GIÀ IN PORTAFOGLIO':watched?'GIÀ IN WATCHLIST':'SCANSIONE AUTOMATICA'}</div></div><span class="status-pill ${c.tone||candidateTone(c.status)}">${esc(c.status)}</span></div>
          <div class="radar-grid">
            <div class="metric"><span>Prezzo</span><b>${fmtPrice(num(c.current_price))}</b></div>
            <div class="metric"><span>1h</span><b class="${cls(num(c.price_change_percentage_1h_in_currency))}">${fmtPct(c.price_change_percentage_1h_in_currency)}</b></div>
            <div class="metric"><span>24h</span><b class="${cls(num(c.price_change_percentage_24h_in_currency))}">${fmtPct(c.price_change_percentage_24h_in_currency)}</b></div>
            <div class="metric"><span>vs BTC 24h</span><b class="${cls(num(c.rel24))}">${fmtPct(c.rel24)}</b></div>
          </div>
          <div class="spark">${sparkSVG(c.sparkline_in_7d?.price)}</div>
          <div class="radar-reason"><b>Perché lo sto guardando:</b> ${esc(c.reason)}</div>
          ${!owned&&!watched?`<div class="opportunity-actions"><button data-watch-candidate="${esc(c.id)}">＋ Aggiungi alla watchlist</button></div>`:''}
        </article>`;
      }).join(''):'<div class="empty">Il Radar Opportunità non ha ancora completato una scansione, oppure non trova segnali abbastanza puliti. La scansione parte automaticamente.</div>'}</div>

      <div class="section-title"><div><h2>Cosa sarebbe successo?</h2><p>Segnali salvati senza dover comprare: confronto alla prima rilevazione dopo 24h e 48h</p></div></div>
      <div class="signal-list">${signals.length?signals.map(sig=>`<article class="signal-card" data-open-asset="${esc(sig.symbol)}"><div class="signal-top"><div><b>${esc(sig.symbol)} · ${esc(sig.status)}</b><small>${fmtDate(sig.time)} · prezzo segnale ${fmtPrice(num(sig.price))}</small></div></div><div class="signal-outcomes">${signalOutcomeLabel(sig.outcome24,'24h')} · ${signalOutcomeLabel(sig.outcome48,'48h')}</div><div class="radar-reason">${esc(sig.reason)}</div></article>`).join(''):'<div class="empty">Quando il Radar troverà un candidato OSSERVA o INTERESSANTE, salverà qui prezzo e ora per misurare il metodo senza rischiare denaro.</div>'}</div>

      <div class="section-title"><div><h2>Il tuo Radar</h2><p>BTC/ETH, posizioni e watchlist libera</p></div><div class="right"><button class="chip-btn" data-action="add-watch">＋ Watchlist</button></div></div>
      <div class="radar-list">${items.map(a=>{
        const m=market[a.id]||state.marketCache?.data?.[a.id]||{}; const st=radarStatus(m); const owned=ownedSymbols.has(a.symbol); const watched=isWatched(a);
        return `<article class="radar-card" data-open-asset="${esc(a.symbol)}">
          <div class="radar-top"><div><div class="radar-title">${esc(a.symbol)} · ${esc(a.name)}</div><div class="radar-sub">${owned?'POSIZIONE':a.symbol==='BTC'||a.symbol==='ETH'?'MERCATO GUIDA':'WATCHLIST'}</div></div><div><span class="status-pill ${st.tone}">${st.label}</span>${watched?`<button class="watch-remove" data-remove-watch-id="${esc(a.id)}">rimuovi</button>`:''}</div></div>
          <div class="radar-grid">
            <div class="metric"><span>Prezzo</span><b>${fmtPrice(num(m.current_price))}</b></div>
            <div class="metric"><span>1h</span><b class="${cls(num(m.price_change_percentage_1h_in_currency))}">${fmtPct(m.price_change_percentage_1h_in_currency)}</b></div>
            <div class="metric"><span>24h</span><b class="${cls(num(m.price_change_percentage_24h_in_currency))}">${fmtPct(m.price_change_percentage_24h_in_currency)}</b></div>
            <div class="metric"><span>7g</span><b class="${cls(num(m.price_change_percentage_7d_in_currency))}">${fmtPct(m.price_change_percentage_7d_in_currency)}</b></div>
          </div>
          <div class="spark">${sparkSVG(m?.sparkline_in_7d?.price)}</div>
          <div class="radar-reason">${radarReason(m,owned)}</div>
        </article>`;
      }).join('')}</div>
    `;
  }

  function operationLabel(type){ return ({BUY:'Acquisto',SELL:'Vendita',DEPOSIT_PERSONAL:'Versamento personale',DEPOSIT_REWARD:'Reward / bonus',WITHDRAW:'Prelievo',TRANSFER:'Trasferimento'})[type]||type; }
  function operationAmount(op){
    if(op.type==='BUY') return `−${fmtEUR(num(op.amount)+num(op.fee))}`;
    if(op.type==='SELL') return `+${fmtEUR(num(op.amount)-num(op.fee))}`;
    if(op.type==='WITHDRAW') return `−${fmtEUR(num(op.amount))}`;
    return fmtEUR(num(op.amount));
  }
  function renderOps(){
    const s=portfolioSnapshot();
    const recent=[...state.ops].sort((a,b)=>new Date(b.date)-new Date(a.date));
    $('#view-ops').innerHTML=`
      <div class="section-title"><div><h2>Operazioni</h2><p>Compra, vendi e sposta liquidità senza aggiornare il codice</p></div><div class="right"><button class="primary-btn" data-action="new-op">＋ Nuova</button></div></div>
      <div class="summary-grid">
        <div class="summary-card"><div class="label">Liquidità Base</div><div class="big">${fmtEUR(s.cash.base)}</div><div class="sub">disponibile per nuovi acquisti</div></div>
        <div class="summary-card"><div class="label">Liquidità Test</div><div class="big">${fmtEUR(s.cash.test)}</div><div class="sub">fondo separato</div></div>
      </div>
      <div class="section-title"><div><h2>Da questo aggiornamento</h2><p>Le operazioni qui sotto sono modificabili o eliminabili</p></div></div>
      <div class="ops-list">${recent.length?recent.map(opCard).join(''):'<div class="empty">Nessuna nuova operazione ancora registrata.</div>'}</div>
      <div class="section-title"><div><h2>Storico iniziale</h2><p>Snapshot usato per partire con i conti corretti</p></div></div>
      <div class="ops-list">${[...BASELINE.history].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(op=>opCard(op,true)).join('')}</div>
    `;
  }
  function opCard(op,locked=false){
    const clsType=op.type==='BUY'?'buy':op.type==='SELL'?'sell':'';
    const symbol=op.symbol?` · ${esc(op.symbol)}`:'';
    const qty=op.qty?`${fmtQty(num(op.qty))} ${esc(op.symbol||'')}`:'';
    const account=op.account==='test'?'Fondo Test':'Base';
    return `<article class="op-card">
      <div class="op-top"><div><span class="op-type ${clsType}">${esc(operationLabel(op.type))}</span><div class="op-title" style="margin-top:8px">${account}${symbol}</div><div class="op-sub">${fmtDate(op.date)}${qty?` · ${qty}`:''}${op.note?` · ${esc(op.note)}`:''}</div></div><div class="op-amount">${operationAmount(op)}</div></div>
      ${locked?'':`<div class="op-actions"><button data-edit-op="${esc(op.id)}">Modifica</button><button data-delete-op="${esc(op.id)}">Elimina</button></div>`}
    </article>`;
  }

  const LESSONS = [
    ['Prezzo medio di carico','È il costo medio delle unità che possiedi. Se aggiungi una nuova quantità a un prezzo diverso, l’app ricalcola automaticamente la media.'],
    ['P/L latente e realizzato','Latente significa guadagno o perdita sulla posizione ancora aperta. Realizzato nasce quando vendi una parte o tutta la posizione.'],
    ['24h, 7g e 30g','Sono finestre diverse. Un +4% nelle ultime 24 ore può convivere con un trend settimanale negativo: per questo il Radar mostra più orizzonti.'],
    ['Volume','Il volume indica quanto valore è stato scambiato. Un movimento di prezzo accompagnato da volume elevato è diverso da un movimento con scambi ridotti.'],
    ['Liquidità','Quando vendi una crypto, il denaro torna liquidità nel conto Base o Test. Solo quando registri un nuovo acquisto quella liquidità viene nuovamente investita.'],
    ['Commissioni','Anche pochi centesimi cambiano il risultato reale. Inserirle quando sono note evita di sovrastimare il profitto.'],
    ['Radar, non ordini','Gli stati del Radar descrivono forza e direzione dei movimenti. Non sono ordini automatici di acquisto o vendita: servono per capire dove guardare.'],
    ['Forza relativa vs BTC','Confronta il movimento di una crypto con Bitcoin. Se fa +5% mentre BTC fa +1%, la forza relativa sulle 24h è circa +4 punti percentuali.'],
    ['NON INSEGUIRE','Segnala un movimento già molto esteso. Non significa che la crypto debba scendere: ricorda semplicemente di non confondere una forte corsa già avvenuta con un segnale iniziale.'],
    ['Cosa sarebbe successo?','Salvare un segnale senza comprare permette di confrontare il prezzo dopo 24h e 48h e capire se il metodo sta davvero individuando movimenti interessanti.']
  ];
  function renderSchool(){
    $('#view-school').innerHTML=`
      <div class="section-title"><div><h2>Scuola</h2><p>Concetti pratici collegati a quello che vedi nell’app</p></div></div>
      <div class="lesson-list">${LESSONS.map((l,i)=>`<article class="lesson-card"><div class="lesson-tag">Lezione ${i+1}</div><h3>${esc(l[0])}</h3><p>${esc(l[1])}</p></article>`).join('')}</div>
    `;
  }

  function renderDiary(){
    const s=portfolioSnapshot();
    const notes=[...state.notes].sort((a,b)=>new Date(b.date)-new Date(a.date));
    const realizedEntries=Object.entries(s.realized).filter(([,v])=>Math.abs(v)>0.0001);
    $('#view-diary').innerHTML=`
      <div class="section-title"><div><h2>Diario</h2><p>Note, posizioni chiuse e backup dei dati</p></div><div class="right"><button class="chip-btn" data-action="new-note">＋ Nota</button></div></div>
      <div class="note-list">${notes.length?notes.map(n=>`<article class="note-card"><div class="note-top"><div><div class="op-title">${esc(n.symbol||'Generale')}</div><div class="note-sub">${fmtDate(n.date)}</div></div><button class="watch-remove" data-delete-note="${esc(n.id)}">elimina</button></div><div class="radar-reason">${esc(n.text)}</div></article>`).join(''):'<div class="empty">Nessuna nota ancora. Puoi usarle per ricordare il motivo di una scelta o cosa vuoi controllare.</div>'}</div>

      <div class="section-title"><div><h2>Risultati realizzati</h2><p>Dalle operazioni registrate dopo questo aggiornamento</p></div></div>
      <div class="closed-list">${realizedEntries.length?realizedEntries.map(([sym,v])=>`<article class="closed-card"><div class="closed-top"><div><div class="closed-title">${esc(sym)}</div><div class="closed-sub">P/L realizzato</div></div><div class="${cls(v)}" style="font-size:18px;font-weight:900">${fmtEUR(v)}</div></div></article>`).join(''):'<div class="empty">Nessun profitto o perdita realizzato registrato dalla RC1.</div>'}</div>

      <div class="settings-card"><h3>Backup e sicurezza dati</h3><p class="muted small">I dati manuali restano sul dispositivo. RC3 mantiene anche un punto sicurezza locale prima delle modifiche importanti.</p><div class="settings-actions"><button class="chip-btn" data-action="export">Esporta backup</button><button class="chip-btn" data-action="restore">Importa backup</button><button class="chip-btn" data-action="restore-safety">Ripristina ultimo punto</button><button class="danger-btn" data-action="reset">Ripristina RC3</button></div></div>
      <div class="settings-card"><h3>Contabilità</h3><div class="cash-details"><div class="cash-mini"><span>Capitale personale</span><b>${fmtEUR(s.ownDeposits)}</b></div><div class="cash-mini"><span>Reward accumulati</span><b>${fmtEUR(s.rewardDeposits)}</b></div><div class="cash-mini"><span>Prelievi registrati</span><b>${fmtEUR(s.withdrawals)}</b></div><div class="cash-mini"><span>Risultato reale</span><b class="${cls(s.result)}">${fmtEUR(s.result)}</b></div></div></div>
    `;
  }

  function renderAll(){
    renderHome(); renderRadar(); renderOps(); renderSchool(); renderDiary();
    bindDynamic();
  }

  function bindDynamic(){
    $$('[data-open-asset]').forEach(el=>el.addEventListener('click',e=>{ if(e.target.closest('[data-remove-watch-id],[data-watch-candidate]')) return; openAsset(el.dataset.openAsset); }));
    $$('[data-action="new-op"]').forEach(b=>b.addEventListener('click',()=>openOpSheet()));
    $$('[data-action="add-watch"]').forEach(b=>b.addEventListener('click',openWatchSheet));
    $$('[data-remove-watch-id]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation(); checkpointState('Modifica watchlist'); state.watchlistIds=(state.watchlistIds||[]).filter(x=>x!==b.dataset.removeWatchId); saveState(); renderAll(); toast('Rimosso dalla watchlist');}));
    $$('[data-watch-candidate]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation(); addWatchById(b.dataset.watchCandidate); }));
    $$('[data-action="scan-opportunities"]').forEach(b=>b.addEventListener('click',()=>scanOpportunities(true)));
    $$('[data-edit-op]').forEach(b=>b.addEventListener('click',()=>openOpSheet(state.ops.find(o=>o.id===b.dataset.editOp))));
    $$('[data-delete-op]').forEach(b=>b.addEventListener('click',()=>deleteOp(b.dataset.deleteOp)));
    $$('[data-action="new-note"]').forEach(b=>b.addEventListener('click',openNoteSheet));
    $$('[data-delete-note]').forEach(b=>b.addEventListener('click',()=>{checkpointState('Prima di eliminare nota');state.notes=state.notes.filter(n=>n.id!==b.dataset.deleteNote);saveState();renderDiary();bindDynamic();toast('Nota eliminata');}));
    $$('[data-action="export"]').forEach(b=>b.addEventListener('click',exportBackup));
    $$('[data-action="restore"]').forEach(b=>b.addEventListener('click',()=>$('#restoreInput').click()));
    $$('[data-action="restore-safety"]').forEach(b=>b.addEventListener('click',restoreCheckpoint));
    $$('[data-action="reset"]').forEach(b=>b.addEventListener('click',resetState));
  }

  function showView(name){
    $$('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${name}`));
    $$('.nav-btn[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
    state.ui.lastView=name; saveState(); window.scrollTo({top:0,behavior:'smooth'});
    if(name==='radar') scanOpportunities(false);
  }

  function openBackdrop(sheet){
    $('#sheetBackdrop').hidden=false; sheet.hidden=false; document.body.style.overflow='hidden';
  }
  function closeSheets(){
    $('#sheetBackdrop').hidden=true; $$('.sheet').forEach(s=>s.hidden=true); document.body.style.overflow=''; currentSheetAsset=null;
  }

  function openAsset(symbol){
    const s=portfolioSnapshot();
    const pos=s.positions.find(p=>p.symbol===symbol) || null;
    const meta=assetBySymbol(symbol)||pos||(state.opportunity?.candidates||[]).find(c=>c.symbol===symbol);
    if(!meta) return;
    currentSheetAsset={...meta,...(pos||{})}; currentRange='7d';
    const sheet=$('#assetSheet'); openBackdrop(sheet); renderAssetSheet();
  }

  function renderAssetSheet(){
    const a=currentSheetAsset; if(!a) return;
    const s=portfolioSnapshot(); const pos=s.positions.find(p=>p.symbol===a.symbol && (!a.account||p.account===a.account));
    const m=market[a.id]||state.marketCache?.data?.[a.id]||{}; const owned=!!pos; const st=radarStatus(m);
    const pnl=owned?positionPnl(pos):0,pct=owned?positionPnlPct(pos):0;
    $('#assetSheetBody').innerHTML=`
      <div class="sheet-head"><div><div class="eyebrow">${owned?(pos.account==='test'?'FONDO TEST':'POSIZIONE BASE'):'RADAR'}</div><h2>${esc(a.symbol)} · ${esc(a.name)}</h2></div><button class="ghost-btn" data-close-sheet>Chiudi</button></div>
      <div class="sheet-section">
        <div class="detail-price">${fmtPrice(num(m.current_price))}</div>
        <div style="margin-top:8px"><span class="status-pill ${st.tone}">${st.label}</span></div>
        <div class="detail-grid">
          <div class="detail-box"><span>1h</span><b class="${cls(num(m.price_change_percentage_1h_in_currency))}">${fmtPct(m.price_change_percentage_1h_in_currency)}</b></div>
          <div class="detail-box"><span>24h</span><b class="${cls(num(m.price_change_percentage_24h_in_currency))}">${fmtPct(m.price_change_percentage_24h_in_currency)}</b></div>
          <div class="detail-box"><span>7 giorni</span><b class="${cls(num(m.price_change_percentage_7d_in_currency))}">${fmtPct(m.price_change_percentage_7d_in_currency)}</b></div>
          <div class="detail-box"><span>30 giorni</span><b class="${cls(num(m.price_change_percentage_30d_in_currency))}">${fmtPct(m.price_change_percentage_30d_in_currency)}</b></div>
        </div>
      </div>
      ${owned?`<div class="sheet-section"><div class="eyebrow">LA TUA POSIZIONE</div><div class="detail-grid">
        <div class="detail-box"><span>Quantità</span><b>${fmtQty(pos.qty)} ${esc(pos.symbol)}</b></div>
        <div class="detail-box"><span>Prezzo medio</span><b>${fmtPrice(pos.avg)}</b></div>
        <div class="detail-box"><span>Capitale in carico</span><b>${fmtEUR(positionCost(pos))}</b></div>
        <div class="detail-box"><span>Valore attuale</span><b>${fmtEUR(positionValue(pos))}</b></div>
        <div class="detail-box"><span>P/L latente</span><b class="${cls(pnl)}">${fmtEUR(pnl)}</b></div>
        <div class="detail-box"><span>P/L %</span><b class="${cls(pct)}">${fmtPct(pct)}</b></div>
      </div><div class="detail-note" style="margin-top:10px">${positionExplanation(pos,m)}</div><div class="position-actions"><button class="chip-btn" data-action="quick-buy">＋ Acquisto</button><button class="sell-all-btn" data-action="sell-all">Vendi tutto</button></div></div>`:''}
      <div class="sheet-section"><div class="eyebrow">TREND</div><div class="range-row"><button class="range-btn" data-range="1d">24h</button><button class="range-btn active" data-range="7d">7g</button><button class="range-btn" data-range="30d">30g</button>${owned?'<button class="range-btn" data-range="since">Da acquisto</button>':''}</div><div id="detailChart" class="chart-wrap"><div class="chart-empty">Carico il trend…</div></div></div>
      <div class="sheet-section"><div class="detail-note">${radarReason(m,owned)} Gli indicatori descrivono il movimento del mercato: non eseguono ordini e non modificano Revolut.</div></div>
    `;
    $$('[data-close-sheet]').forEach(b=>b.addEventListener('click',closeSheets));
    $$('#assetSheet [data-range]').forEach(b=>b.addEventListener('click',()=>{currentRange=b.dataset.range; $$('#assetSheet [data-range]').forEach(x=>x.classList.toggle('active',x===b)); loadDetailChart(a,owned?pos:null,currentRange);}));
    const sellBtn=$('#assetSheet [data-action="sell-all"]'); if(sellBtn&&pos) sellBtn.addEventListener('click',()=>quickSellAll(pos));
    const buyBtn=$('#assetSheet [data-action="quick-buy"]'); if(buyBtn&&pos) buyBtn.addEventListener('click',()=>quickBuy(pos));
    loadDetailChart(a,owned?pos:null,'7d');
  }

  function positionExplanation(p,m){
    const pct=positionPnlPct(p), day=num(m?.price_change_percentage_24h_in_currency);
    const part1=pct>=5?`La posizione è sopra il prezzo medio di carico di ${Math.abs(pct).toFixed(2)}%.`:pct<=-5?`La posizione è sotto il prezzo medio di carico di ${Math.abs(pct).toFixed(2)}%.`:`La posizione è vicina al prezzo medio di carico (${fmtPct(pct)}).`;
    const part2=Number.isFinite(day)?` Nelle ultime 24 ore il mercato segna ${fmtPct(day)}.`:'';
    return part1+part2;
  }

  async function loadDetailChart(a,pos,range){
    const box=$('#detailChart'); if(!box) return;
    let days=range==='1d'?1:range==='30d'?30:7;
    if(range==='since'&&pos){ days=Math.max(1,Math.ceil((Date.now()-new Date(pos.openedAt).getTime())/86400000)); days=Math.min(days,365); }
    box.innerHTML='<div class="chart-empty">Carico il trend…</div>';
    try{
      const url=`https://api.coingecko.com/api/v3/coins/${encodeURIComponent(a.id)}/market_chart?vs_currency=eur&days=${days}&precision=full`;
      const res=await fetch(url,{headers:{accept:'application/json'},cache:'no-store'}); if(!res.ok) throw new Error('HTTP '+res.status);
      const data=await res.json(); drawChart(box,(data.prices||[]).map(x=>num(x[1])));
    }catch(_){
      const fallback=(market[a.id]?.sparkline_in_7d?.price||[]).filter(Number.isFinite);
      if(fallback.length>1 && range==='7d') drawChart(box,fallback); else box.innerHTML='<div class="chart-empty">Trend non disponibile in questo momento. I dati principali restano utilizzabili.</div>';
    }
  }
  function drawChart(box,values){
    const a=values.filter(Number.isFinite); if(a.length<2){box.innerHTML='<div class="chart-empty">Dati insufficienti.</div>';return;}
    const W=640,H=190,pad=12,min=Math.min(...a),max=Math.max(...a),span=max-min||1;
    const pts=a.map((v,i)=>[pad+(W-pad*2)*(i/(a.length-1)),H-pad-(H-pad*2)*((v-min)/span)]);
    const line=pts.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    const area=`${line} L${pts[pts.length-1][0].toFixed(1)},${H} L${pts[0][0].toFixed(1)},${H} Z`;
    box.innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path class="chart-area" d="${area}"></path><path class="chart-line" d="${line}"></path></svg><div style="position:absolute;left:12px;top:9px;font-size:10px;color:#8e9bb5">max ${fmtPrice(max)}</div><div style="position:absolute;left:12px;bottom:9px;font-size:10px;color:#8e9bb5">min ${fmtPrice(min)}</div>`;
  }

  function populateAssetSelect(select,selected){
    const assets=allAssets().sort((a,b)=>a.symbol.localeCompare(b.symbol));
    select.innerHTML=assets.map(a=>`<option value="${esc(a.symbol)}" ${selected===a.symbol?'selected':''}>${esc(a.symbol)} · ${esc(a.name)}</option>`).join('')+'<option value="__CUSTOM__">＋ Altra crypto…</option>';
  }

  function openOpSheet(op=null){
    const sh=$('#opSheet'); openBackdrop(sh);
    $('#opSheetTitle').textContent=op?'Modifica operazione':'Nuova operazione';
    $('#opId').value=op?.id||''; $('#opType').value=op?.type||'BUY'; $('#opAccount').value=op?.account||'base';
    populateAssetSelect($('#opAsset'),op?.symbol||'ETH');
    $('#opQty').value=op?.qty??''; $('#opAmount').value=op?.amount??''; $('#opFee').value=op?.fee??0; $('#opDate').value=(op?.date||NOW_ISO_LOCAL()).slice(0,16); $('#opNote').value=op?.note||''; $('#opToAccount').value=op?.toAccount||'test';
    $('#customSymbol').value=''; $('#customName').value=''; $('#customId').value='';
    updateOpFields();
  }

  function quickSellAll(pos){
    closeSheets(); openOpSheet();
    $('#opType').value='SELL'; $('#opAccount').value=pos.account; populateAssetSelect($('#opAsset'),pos.symbol); $('#opQty').value=pos.qty;
    $('#opAmount').value=Math.max(0,positionValue(pos)).toFixed(2); $('#opFee').value='0'; $('#opNote').value=`Vendita totale ${pos.symbol} — sostituire l'importo stimato con quello reale Revolut`;
    updateOpFields(); $('#opHint').textContent=`Quantità completa precompilata. L'importo ${fmtEUR(positionValue(pos))} è una stima live: inserisci l'incasso reale mostrato da Revolut prima di salvare.`;
  }
  function quickBuy(pos){
    closeSheets(); openOpSheet(); $('#opType').value='BUY'; $('#opAccount').value=pos.account; populateAssetSelect($('#opAsset'),pos.symbol); $('#opQty').value=''; $('#opAmount').value=''; $('#opFee').value='0'; $('#opNote').value=`Nuovo acquisto ${pos.symbol}`; updateOpFields();
  }

  function updateOpFields(){
    const type=$('#opType').value, assetMode=['BUY','SELL'].includes(type), transfer=type==='TRANSFER';
    $('#assetFields').hidden=!assetMode; $('#feeLabel').hidden=!assetMode; $('#toAccountLabel').hidden=!transfer;
    $('#customAssetFields').hidden=$('#opAsset').value!=='__CUSTOM__';
    $('#amountLabel').firstChild.textContent=assetMode?'Importo crypto (€) ':transfer?'Importo da trasferire (€) ':'Importo (€) ';
    $('#opQty').required=assetMode; $('#opAsset').required=assetMode;
    const snap=portfolioSnapshot(); const acct=$('#opAccount').value; const cash=snap.cash[acct];
    $('#opHint').textContent=assetMode?`Liquidità ${acct==='base'?'Base':'Test'} disponibile: ${fmtEUR(cash)}. Per un acquisto con nuovi soldi registra prima un versamento.`:transfer?`Il trasferimento sposta solo liquidità tra Base e Test.`:'Questa operazione aggiorna la contabilità del capitale senza modificare direttamente le posizioni.';
    if(transfer) $('#opToAccount').value=acct==='base'?'test':'base';
  }

  function validateOp(op,editingId){
    const testState={...state,ops:state.ops.filter(x=>x.id!==editingId)};
    const old=state; state=testState; const snap=replay(); state=old;
    const account=op.account||'base'; const amount=num(op.amount),fee=num(op.fee),qty=num(op.qty);
    if(amount<=0) return 'Inserisci un importo maggiore di zero.';
    if(['BUY','SELL'].includes(op.type)&&qty<=0) return 'Inserisci una quantità maggiore di zero.';
    if(op.type==='BUY' && snap.cash[account]+1e-8 < amount+fee) return `Liquidità ${account==='base'?'Base':'Test'} insufficiente. Registra prima una vendita, un trasferimento o un versamento.`;
    if(op.type==='SELL'){
      const p=snap.positions.find(p=>p.symbol===op.symbol&&p.account===account);
      if(!p||p.qty+1e-12<qty) return `Quantità ${op.symbol} insufficiente nel ${account==='base'?'Portafoglio Base':'Fondo Test'}.`;
    }
    if(op.type==='WITHDRAW' && snap.cash[account]+1e-8<amount) return 'Liquidità insufficiente per il prelievo.';
    if(op.type==='TRANSFER' && snap.cash[account]+1e-8<amount) return 'Liquidità insufficiente per il trasferimento.';
    return '';
  }

  function saveOperation(e){
    e.preventDefault();
    let symbol=$('#opAsset').value, name='', assetId='';
    if(symbol==='__CUSTOM__'){
      symbol=$('#customSymbol').value.trim().toUpperCase(); name=$('#customName').value.trim(); assetId=$('#customId').value.trim();
      if(!symbol||!name||!assetId){toast('Completa sigla, nome e CoinGecko ID');return;}
      if(!state.customAssets.some(a=>a.symbol===symbol)) state.customAssets.push({symbol,name,id:assetId});
    }else{
      const a=assetBySymbol(symbol); name=a?.name||symbol; assetId=a?.id||symbol.toLowerCase();
    }
    const id=$('#opId').value||uid();
    const op={id,type:$('#opType').value,account:$('#opAccount').value,toAccount:$('#opToAccount').value,symbol,name,assetId,qty:num($('#opQty').value),amount:num($('#opAmount').value),fee:num($('#opFee').value),date:$('#opDate').value,note:$('#opNote').value.trim()};
    const err=validateOp(op,$('#opId').value||null); if(err){toast(err);return;}
    checkpointState($('#opId').value?'Prima di modificare operazione':'Prima di nuova operazione');
    const idx=state.ops.findIndex(o=>o.id===id); if(idx>=0) state.ops[idx]=op; else state.ops.push(op);
    saveState(); closeSheets(); renderAll(); refreshMarket(true); toast(idx>=0?'Operazione aggiornata':'Operazione salvata');
  }

  function deleteOp(id){
    if(!confirm('Eliminare questa operazione? I saldi e le posizioni verranno ricalcolati.')) return;
    checkpointState('Prima di eliminare operazione'); state.ops=state.ops.filter(o=>o.id!==id); saveState(); renderAll(); toast('Operazione eliminata');
  }

  function addWatchAsset(a){
    if(!a?.id||!a?.symbol) return;
    const symbol=String(a.symbol).toUpperCase();
    if(!(state.customAssets||[]).some(x=>x.id===a.id)) state.customAssets.push({symbol,name:a.name||symbol,id:a.id});
    if(!(state.watchlistIds||[]).includes(a.id)){ checkpointState('Modifica watchlist'); state.watchlistIds.push(a.id); }
    saveState(); closeSheets(); renderAll(); refreshMarket(true); toast(`${symbol} aggiunta alla watchlist`);
  }
  function addWatchById(id){
    const a=assetById(id)||(state.opportunity?.candidates||[]).find(x=>x.id===id); if(!a)return; addWatchAsset(a);
  }
  function renderWatchChoices(choices){
    const snap=portfolioSnapshot(),ownedIds=new Set(snap.positions.map(p=>p.id));
    const unique=[]; const seen=new Set();
    (choices||[]).forEach(a=>{if(a?.id&&!seen.has(a.id)){seen.add(a.id);unique.push(a);}});
    $('#watchChoices').innerHTML=unique.length?unique.slice(0,14).map(a=>{const symbol=String(a.symbol||'').toUpperCase(),owned=ownedIds.has(a.id),watched=(state.watchlistIds||[]).includes(a.id);return `<div class="choice"><div><b>${esc(symbol)} · ${esc(a.name)}</b><small>${a.market_cap_rank?`rank #${esc(a.market_cap_rank)} · `:''}${esc(a.id)}</small></div>${owned?'<span class="choice-state">in portafoglio</span>':watched?'<span class="choice-state">già seguita</span>':`<button data-pick-watch-id="${esc(a.id)}" data-pick-watch-symbol="${esc(symbol)}">Aggiungi</button>`}</div>`;}).join(''):'<div class="empty">Nessun risultato.</div>';
    $$('[data-pick-watch-id]').forEach(b=>b.addEventListener('click',()=>{const a=unique.find(x=>x.id===b.dataset.pickWatchId);if(a)addWatchAsset({...a,symbol:String(a.symbol).toUpperCase()});}));
  }
  async function searchWatch(q){
    const local=allAssets().filter(a=>`${a.symbol} ${a.name} ${a.id}`.toLowerCase().includes(q.toLowerCase()));
    renderWatchChoices(local);
    if(q.trim().length<2){ $('#watchSearchStatus').textContent='Scrivi almeno 2 caratteri oppure scegli un suggerimento.'; return; }
    $('#watchSearchStatus').textContent='Cerco su CoinGecko…';
    try{
      const res=await fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(q.trim())}`,{headers:{accept:'application/json'},cache:'no-store'}); if(!res.ok) throw new Error('HTTP '+res.status);
      const data=await res.json(); const remote=(data.coins||[]).slice(0,14).map(x=>({id:x.id,symbol:String(x.symbol||'').toUpperCase(),name:x.name,market_cap_rank:x.market_cap_rank}));
      const byId=new Map([...local,...remote].map(a=>[a.id,a])); renderWatchChoices([...byId.values()]); $('#watchSearchStatus').textContent=`${byId.size} risultati · scegli la crypto corretta per nome.`;
    }catch(_){ $('#watchSearchStatus').textContent='Ricerca online momentaneamente non disponibile: mostro i risultati locali.'; }
  }
  function openWatchSheet(){
    const defaults=['MEW','ADA','SUI','LINK','DOGE','RENDER'].map(assetBySymbol).filter(Boolean);
    $('#watchSearch').value=''; $('#watchSearchStatus').textContent='Cerca per sigla o nome. Non serve conoscere il CoinGecko ID.'; renderWatchChoices(defaults); openBackdrop($('#watchSheet')); setTimeout(()=>$('#watchSearch')?.focus(),150);
  }

  function openNoteSheet(){
    populateAssetSelect($('#noteAsset'),'ETH'); const custom=$('#noteAsset option[value="__CUSTOM__"]'); if(custom) custom.remove();
    $('#noteAsset').insertAdjacentHTML('afterbegin','<option value="">Generale</option>'); $('#noteDate').value=NOW_ISO_LOCAL(); $('#noteText').value=''; openBackdrop($('#noteSheet'));
  }
  function saveNote(e){
    e.preventDefault(); const text=$('#noteText').value.trim(); if(!text)return;
    checkpointState('Prima di nuova nota'); state.notes.push({id:`note-${Date.now()}`,symbol:$('#noteAsset').value,date:$('#noteDate').value,text}); saveState();closeSheets();renderDiary();bindDynamic();toast('Nota salvata');
  }

  function exportBackup(){
    const payload={app:'Crypto Conte',version:VERSION,exportedAt:new Date().toISOString(),state};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a');a.href=url;a.download=`crypto-conte-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async function restoreBackup(file){
    try{ const data=JSON.parse(await file.text()); if(!data?.state?.ops||!Array.isArray(data.state.ops)) throw new Error('Formato non valido'); checkpointState('Prima di importare backup'); state={...defaultState(),...data.state,opportunity:{...defaultState().opportunity,...(data.state.opportunity||{})}}; saveState(); market={...BASELINE.seedMarket,...(state.marketCache?.data||{})}; renderAll();refreshMarket(true);toast('Backup importato'); }catch(_){toast('Backup non valido');}
  }
  function resetState(){
    if(!confirm('Ripristinare i dati iniziali RC3? Le operazioni e note manuali verranno eliminate.')) return;
    checkpointState('Prima del ripristino RC3'); state=defaultState(); saveState();market={...BASELINE.seedMarket};renderAll();refreshMarket(true);toast('RC3 ripristinata');
  }

  function wantedIds(){
    const snap=portfolioSnapshot();
    const ids=new Set(['bitcoin','ethereum',...snap.positions.map(p=>p.id),...(state.watchlistIds||[]),...(state.opportunity?.candidates||[]).map(c=>c.id)]);
    (state.opportunity?.signals||[]).filter(sig=>Date.now()-num(sig.time)<50*3600000).forEach(sig=>ids.add(sig.id));
    return [...ids].filter(Boolean);
  }
  async function scanOpportunities(force=false){
    if(opportunityScanInFlight) return;
    const opp=state.opportunity||defaultState().opportunity;
    if(!force&&Date.now()-num(opp.time)<OPPORTUNITY_TTL){ (opp.candidates||[]).forEach(c=>market[c.id]={...market[c.id],...c}); return; }
    opportunityScanInFlight=true;
    const btn=$('[data-action="scan-opportunities"]'); if(btn){btn.disabled=true;btn.textContent='scansione…';}
    try{
      const common='vs_currency=eur&per_page=250&page=1&sparkline=false&price_change_percentage=1h,24h,7d,30d&locale=it&precision=full';
      const capUrl=`https://api.coingecko.com/api/v3/coins/markets?${common}&order=market_cap_desc`;
      const volumeUrl=`https://api.coingecko.com/api/v3/coins/markets?${common}&order=volume_desc`;
      const trendUrl='https://api.coingecko.com/api/v3/search/trending';
      const [capRes,volRes,tr]=await Promise.all([
        fetch(capUrl,{headers:{accept:'application/json'},cache:'no-store'}),
        fetch(volumeUrl,{headers:{accept:'application/json'},cache:'no-store'}),
        fetch(trendUrl,{headers:{accept:'application/json'},cache:'no-store'})
      ]);
      if(!capRes.ok&&!volRes.ok) throw new Error('Radar discovery non disponibile');
      const capRows=capRes.ok?await capRes.json():[];
      const volRows=volRes.ok?await volRes.json():[];
      let trendingIds=new Set();
      if(tr.ok){ const td=await tr.json(); trendingIds=new Set((td.coins||[]).map(x=>x.item?.id).filter(Boolean)); }

      const universeMap=new Map(); [...capRows,...volRows].forEach(x=>{if(x?.id)universeMap.set(x.id,x);});
      const rows=[...universeMap.values()];
      const btc=universeMap.get('bitcoin')||market.bitcoin||{}; const prev=opp.prev||{};
      const eligible=rows.filter(x=>x.id!=='bitcoin'&&!STABLE_SYMBOLS.has(String(x.symbol||'').toUpperCase())&&num(x.current_price)>0&&num(x.total_volume)>=2_000_000&&(num(x.market_cap)>=20_000_000||num(x.total_volume)>=8_000_000));
      const screened=eligible.map(x=>screenOpportunity(x,btc,prev[x.id],trendingIds)).sort((a,b)=>b._screenScore-a._screenScore||num(b.total_volume)-num(a.total_volume)).slice(0,40);

      const detailIds=new Set(screened.map(x=>x.id));
      [...trendingIds].slice(0,15).forEach(id=>detailIds.add(id));
      const detailUrl=`https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${encodeURIComponent([...detailIds].join(','))}&order=market_cap_desc&sparkline=true&price_change_percentage=1h,24h,7d,30d&locale=it&precision=full`;
      let detailRows=[];
      if(detailIds.size){
        const dr=await fetch(detailUrl,{headers:{accept:'application/json'},cache:'no-store'});
        if(dr.ok) detailRows=await dr.json();
      }
      const detailMap=new Map(detailRows.map(x=>[x.id,x]));
      const candidatePool=[...new Map([...screened.map(x=>[x.id,detailMap.get(x.id)||x]),...detailRows.map(x=>[x.id,x])]).values()];
      const assessed=candidatePool.filter(x=>x.id!=='bitcoin'&&!STABLE_SYMBOLS.has(String(x.symbol||'').toUpperCase())&&num(x.current_price)>0&&num(x.total_volume)>=2_000_000).map(x=>analyzeOpportunity(x,btc,prev[x.id],trendingIds)).filter(Boolean);
      assessed.sort((a,b)=>{const rank={INTERESSANTE:3,OSSERVA:2,'NON INSEGUIRE':1};return (rank[b.status]-rank[a.status])||(b.score-a.score)||(num(b.total_volume)-num(a.total_volume));});
      const candidates=assessed.slice(0,5);
      const now=Date.now(),nextPrev={}; rows.forEach(x=>nextPrev[x.id]={time:now,volume:num(x.total_volume),price:num(x.current_price)}); detailRows.forEach(x=>nextPrev[x.id]={time:now,volume:num(x.total_volume),price:num(x.current_price)});
      updateSignalOutcomes(detailRows.length?detailRows:rows); state.opportunity={...opp,time:now,candidates,prev:nextPrev,trending:[...trendingIds],signals:state.opportunity.signals||[]}; recordOpportunitySignals(candidates);
      candidates.forEach(c=>market[c.id]={...market[c.id],...c}); saveState(); renderAll(); toast(candidates.length?`Radar: ${candidates.length} candidati da osservare`:'Radar: nessun segnale pulito al momento');
    }catch(_){ toast('Radar Opportunità: scansione non disponibile, riproverà automaticamente'); }
    finally{ opportunityScanInFlight=false; const b=$('[data-action="scan-opportunities"]');if(b){b.disabled=false;b.textContent='◎ Scansiona';} }
  }
  async function refreshMarket(force=false){
    if(marketRefreshInFlight) return;
    const status=$('#dataStatus');
    if(!force && Date.now()-num(state.marketCache?.time)<MARKET_TTL){ market={...BASELINE.seedMarket,...(state.marketCache.data||{})}; (state.opportunity?.candidates||[]).forEach(c=>market[c.id]={...market[c.id],...c}); setDataStatus('cache'); renderAll(); scanOpportunities(false); return; }
    marketRefreshInFlight=true; status.className='data-status'; status.innerHTML='<span class="dot"></span><span>aggiorno prezzi e trend…</span>';
    try{
      const ids=wantedIds();
      const url=`https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${encodeURIComponent(ids.join(','))}&order=market_cap_desc&sparkline=true&price_change_percentage=1h,24h,7d,30d&locale=it&precision=full`;
      const res=await fetch(url,{headers:{accept:'application/json'},cache:'no-store'}); if(!res.ok) throw new Error('HTTP '+res.status);
      const arr=await res.json(); const data={...market}; arr.forEach(x=>data[x.id]=x); market=data; updateSignalOutcomes(arr); state.marketCache={time:Date.now(),data}; saveState(); setDataStatus('live'); renderAll(); scanOpportunities(false);
    }catch(err){ market={...BASELINE.seedMarket,...(state.marketCache?.data||{})}; (state.opportunity?.candidates||[]).forEach(c=>market[c.id]={...market[c.id],...c}); setDataStatus('error'); renderAll(); }
    finally{ marketRefreshInFlight=false; }
  }

  function setDataStatus(mode){
    const el=$('#dataStatus'); if(!el)return;
    const t=state.marketCache?.time?new Intl.DateTimeFormat('it-IT',{hour:'2-digit',minute:'2-digit'}).format(new Date(state.marketCache.time)):'baseline';
    if(mode==='live') el.className='data-status live',el.innerHTML=`<span class="dot"></span><span>live · auto 2m30s · aggiornato ${t}</span>`;
    else if(mode==='error') el.className='data-status error',el.innerHTML=`<span class="dot"></span><span>dati cached · ultimo aggiornamento ${t}</span>`;
    else el.className='data-status',el.innerHTML=`<span class="dot"></span><span>cache · auto 2m30s · ${t}</span>`;
  }

  function toast(msg){
    const t=$('#toast'); t.textContent=msg;t.hidden=false;clearTimeout(renderTimer);renderTimer=setTimeout(()=>t.hidden=true,3000);
  }

  function init(){
    renderAll(); showView(state.ui.lastView||'home');
    $$('.nav-btn[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
    $('.nav-main').addEventListener('click',()=>openOpSheet());
    $('#refreshBtn').addEventListener('click',()=>{refreshMarket(true);scanOpportunities(false);});
    $('#sheetBackdrop').addEventListener('click',closeSheets); $$('[data-close-sheet]').forEach(b=>b.addEventListener('click',closeSheets));
    $('#opType').addEventListener('change',updateOpFields); $('#opAccount').addEventListener('change',updateOpFields); $('#opAsset').addEventListener('change',updateOpFields); $('#opForm').addEventListener('submit',saveOperation); $('#noteForm').addEventListener('submit',saveNote);
    $('#watchSearch').addEventListener('input',e=>{clearTimeout(watchSearchTimer);const q=e.target.value;watchSearchTimer=setTimeout(()=>searchWatch(q),350);});
    $('#restoreInput').addEventListener('change',e=>{const f=e.target.files?.[0];if(f)restoreBackup(f);e.target.value='';});
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){if(Date.now()-num(state.marketCache?.time)>45000)refreshMarket(true);scanOpportunities(false);}});
    window.addEventListener('online',()=>{refreshMarket(true);scanOpportunities(false);});
    setInterval(()=>{if(document.visibilityState==='visible')refreshMarket(true);},AUTO_REFRESH_MS);
    setInterval(()=>{if(document.visibilityState==='visible')scanOpportunities(false);},OPPORTUNITY_TTL);
    if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
    refreshMarket(false); scanOpportunities(false);
  }

  document.addEventListener('DOMContentLoaded',init);
})();
