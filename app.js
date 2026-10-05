(() => {
  'use strict';

  const VERSION = '2.8.1';
  const STORAGE_KEY = 'cryptoConte.v2.state';
  const MARKET_TTL = 4 * 60 * 1000;
  const AUTO_REFRESH_MS = 5 * 60 * 1000;
  const OPPORTUNITY_TTL = 15 * 60 * 1000;
  const MARKET_STALE_MS = 15 * 60 * 1000;
  const API_TIMEOUT_MS = 12000;
  const TRENDING_TTL = 60 * 60 * 1000;
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
    decision: {peaks:{},samples:{}},
    challenge: null,
    challengeArchives: [],
    training: {seenLessons:{},attempts:[]},
    assistant: {time:0,source:'',fresh:false,items:[],log:[],lastStatus:{}},
    ui: {lastView:'home',radarTab:'proposals',trainingTab:'entries',assistantTab:'auto'}
  });

  let state = loadState();

  // RC4.3.4 migration: elimina l'eventuale prezzo PEPE errato salvato dalla
  // RC4.3.3, causato da un omonimo CoinPaprika con lo stesso simbolo.
  const cachedPepe=state.marketCache?.data?.pepe;
  if(cachedPepe?._source==='CoinPaprika' && cachedPepe?.paprika_id && cachedPepe.paprika_id!=='pepe-pepe'){
    state.marketCache.data.pepe={...BASELINE.seedMarket.pepe};
    state.marketCache.time=0;
    try{ localStorage.setItem(STORAGE_KEY,JSON.stringify({...state,version:VERSION})); }catch(_){ }
  }

  let market = {...BASELINE.seedMarket, ...(state.marketCache?.data || {})};
  let currentSheetAsset = null;
  let currentRange = '7d';
  let renderTimer = null;
  let watchSearchTimer = null;
  let marketRefreshInFlight = false;
  let opportunityScanInFlight = false;
  let apiBackoffUntil = 0;
  let lastApiError = '';
  let paprikaCache = {time:0, rows:[]};
  let marketSource = 'cache';
  const sleep = ms => new Promise(r=>setTimeout(r,ms));
  const isMarketStale = () => !state.marketCache?.time || Date.now()-num(state.marketCache.time)>MARKET_STALE_MS;
  const backoffMinutes = () => Math.max(1,Math.ceil((apiBackoffUntil-Date.now())/60000));

  async function cgFetch(url,{optional=false}={}){
    if(Date.now()<apiBackoffUntil){
      const e=new Error('API_BACKOFF'); e.code='BACKOFF';
      if(optional) return null; throw e;
    }
    let lastErr=null;
    for(let attempt=0;attempt<2;attempt++){
      const ctl=new AbortController();
      const timer=setTimeout(()=>ctl.abort(),API_TIMEOUT_MS);
      try{
        const res=await fetch(url,{headers:{accept:'application/json'},cache:'no-store',signal:ctl.signal});
        if(res.status===429){
          const retryHeader=Number(res.headers.get('retry-after')||0);
          const waitSec=Math.max(180,Number.isFinite(retryHeader)?retryHeader:0);
          apiBackoffUntil=Date.now()+waitSec*1000; lastApiError='429';
          const e=new Error('HTTP 429'); e.code=429; throw e;
        }
        if((res.status===500||res.status===502||res.status===503||res.status===504)&&attempt===0){
          lastApiError=String(res.status); await sleep(1200); continue;
        }
        if(!res.ok){ const e=new Error('HTTP '+res.status); e.code=res.status; throw e; }
        lastApiError=''; return res;
      }catch(err){
        lastErr=err;
        if(err?.name==='AbortError') lastApiError='timeout';
        if(err?.code===429||err?.code==='BACKOFF') break;
        if(attempt===0&&navigator.onLine!==false){ await sleep(900); continue; }
      }finally{ clearTimeout(timer); }
    }
    if(optional) return null;
    throw lastErr||new Error('API non disponibile');
  }


  async function paprikaFetch(url){
    const ctl=new AbortController();
    const timer=setTimeout(()=>ctl.abort(),15000);
    try{
      const res=await fetch(url,{headers:{accept:'application/json'},cache:'no-store',signal:ctl.signal});
      if(!res.ok){ const e=new Error('HTTP '+res.status); e.code=res.status; throw e; }
      return res;
    }finally{ clearTimeout(timer); }
  }

  function assetForPaprikaTicker(t){
    const symbol=String(t?.symbol||'').toUpperCase();
    const name=String(t?.name||'').trim().toLowerCase();
    const pool=[...allAssets(),...(state.opportunity?.candidates||[])];

    // RC4.3.4: non associare mai un ticker CoinPaprika solo per simbolo.
    // Simboli come PEPE possono appartenere a più token diversi: un match
    // per simbolo finirebbe per sovrascrivere il prezzo della posizione reale.
    const explicitPaprikaToCg={
      'pepe-pepe':'pepe'
    };
    const explicitId=explicitPaprikaToCg[String(t?.id||'')];
    if(explicitId){
      const explicit=pool.find(a=>a.id===explicitId);
      if(explicit) return explicit;
    }

    const exact=pool.find(a=>
      String(a.symbol||'').toUpperCase()===symbol &&
      String(a.name||'').trim().toLowerCase()===name
    );
    return exact||null;
  }

  function paprikaToMarket(t){
    const q=t?.quotes?.EUR||{};
    const known=assetForPaprikaTicker(t);
    const id=known?.id||`paprika:${t.id}`;
    const old=market?.[id]||state.marketCache?.data?.[id]||{};
    return {
      ...old,
      id,
      paprika_id:t.id,
      symbol:String(t.symbol||'').toLowerCase(),
      name:t.name||known?.name||String(t.symbol||'').toUpperCase(),
      current_price:num(q.price),
      market_cap:num(q.market_cap),
      market_cap_rank:num(t.rank)||null,
      total_volume:num(q.volume_24h),
      price_change_percentage_1h_in_currency:Number.isFinite(Number(q.percent_change_1h))?Number(q.percent_change_1h):null,
      price_change_percentage_24h_in_currency:Number.isFinite(Number(q.percent_change_24h))?Number(q.percent_change_24h):null,
      price_change_percentage_7d_in_currency:Number.isFinite(Number(q.percent_change_7d))?Number(q.percent_change_7d):null,
      price_change_percentage_30d_in_currency:Number.isFinite(Number(q.percent_change_30d))?Number(q.percent_change_30d):null,
      sparkline_in_7d:old.sparkline_in_7d||{price:[]},
      last_updated:t.last_updated||null,
      _source:'CoinPaprika'
    };
  }

  async function getPaprikaUniverse(force=false){
    if(!force && paprikaCache.rows.length && Date.now()-paprikaCache.time<4*60*1000) return paprikaCache.rows;
    const res=await paprikaFetch('https://api.coinpaprika.com/v1/tickers?quotes=EUR');
    const raw=await res.json();
    if(!Array.isArray(raw)||!raw.length) throw new Error('CoinPaprika: risposta vuota');
    const rows=raw.map(paprikaToMarket).filter(x=>x.id&&num(x.current_price)>0);
    paprikaCache={time:Date.now(),rows};
    return rows;
  }

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const esc = v => String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const uid = () => `op-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const num = v => Number.isFinite(Number(v)) ? Number(v) : 0;
  const round = (v,d=8) => Number(Number(v).toFixed(d));

  // RC4.1 hotfix: normalize saved Radar signals only after numeric helpers exist.
  state.opportunity = {...defaultState().opportunity, ...(state.opportunity||{})};
  state.opportunity.signals = normalizeOpportunitySignals(state.opportunity.signals||[]);

  function loadState(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return defaultState();
      const saved = JSON.parse(raw);
      const base = defaultState();
      const merged = {...base,...saved,ui:{...base.ui,...(saved.ui||{})},training:{...base.training,...(saved.training||{}),seenLessons:{...(base.training.seenLessons||{}),...(saved.training?.seenLessons||{})},attempts:Array.isArray(saved.training?.attempts)?saved.training.attempts:[]},assistant:{...base.assistant,...(saved.assistant||{}),items:Array.isArray(saved.assistant?.items)?saved.assistant.items:[],log:Array.isArray(saved.assistant?.log)?saved.assistant.log:[],lastStatus:{...(base.assistant.lastStatus||{}),...(saved.assistant?.lastStatus||{})}},marketCache:saved.marketCache||base.marketCache,opportunity:{...base.opportunity,...(saved.opportunity||{})},decision:{...base.decision,...(saved.decision||{}),peaks:{...(base.decision.peaks||{}),...(saved.decision?.peaks||{})},samples:{...(base.decision.samples||{}),...(saved.decision?.samples||{})}}};
      if(!Array.isArray(saved.watchlistIds)){
        merged.watchlistIds=(saved.watchlist||[]).map(sym=>CATALOG.find(a=>a.symbol===String(sym).toUpperCase())?.id).filter(Boolean);
      }
      if(!Array.isArray(merged.opportunity.candidates)) merged.opportunity.candidates=[];
      if(!Array.isArray(merged.opportunity.signals)) merged.opportunity.signals=[];
      if(!merged.opportunity.prev || typeof merged.opportunity.prev!=='object') merged.opportunity.prev={};
      if(!Array.isArray(merged.challengeArchives)) merged.challengeArchives=[];
      if(merged.challenge && typeof merged.challenge!=='object') merged.challenge=null;
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
    state={...defaultState(),...cp.state,training:{...defaultState().training,...(cp.state.training||{}),seenLessons:{...(cp.state.training?.seenLessons||{})},attempts:Array.isArray(cp.state.training?.attempts)?cp.state.training.attempts:[]},assistant:{...defaultState().assistant,...(cp.state.assistant||{}),items:Array.isArray(cp.state.assistant?.items)?cp.state.assistant.items:[],log:Array.isArray(cp.state.assistant?.log)?cp.state.assistant.log:[],lastStatus:{...(cp.state.assistant?.lastStatus||{})}},opportunity:{...defaultState().opportunity,...(cp.state.opportunity||{})},decision:{...defaultState().decision,...(cp.state.decision||{}),peaks:{...(cp.state.decision?.peaks||{})},samples:{...(cp.state.decision?.samples||{})}}}; saveState(); market={...BASELINE.seedMarket,...(state.marketCache?.data||{})}; renderAll(); refreshMarket(true); toast('Punto sicurezza ripristinato');
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

  function activeBaseline(){
    const c=state?.challenge;
    if(c?.active && c.baseline){
      return {
        positions:(c.baseline.positions||[]).map(p=>({...p})),
        cash:{base:num(c.baseline.cash?.base),test:num(c.baseline.cash?.test)},
        ownDeposits:num(c.baseline.ownDeposits),
        rewardDeposits:num(c.baseline.rewardDeposits),
        withdrawals:num(c.baseline.withdrawals)
      };
    }
    return {
      positions:BASELINE.positions.map(p=>({...p})), cash:{...BASELINE.cash},
      ownDeposits:BASELINE.ownDeposits, rewardDeposits:BASELINE.rewardDeposits, withdrawals:BASELINE.withdrawals
    };
  }
  function activeChallengeName(){ return state.challenge?.active ? state.challenge.name : 'Challenge precedente'; }
  function challengeInitialCapital(snapshot){ return state.challenge?.active ? num(state.challenge.initialCapital) : num(snapshot?.ownDeposits)+num(snapshot?.rewardDeposits); }

  function replay(){
    const baseline=activeBaseline();
    const positions = baseline.positions.map(p=>({...p}));
    const cash = {...baseline.cash};
    let ownDeposits = baseline.ownDeposits;
    let rewardDeposits = baseline.rewardDeposits;
    let withdrawals = baseline.withdrawals;
    const realized = {};
    const realizedByKey = {};
    const soldCost = {};
    const sales = [];
    const closed = [];

    const keyFor=(account,symbol)=>`${account}:${symbol}`;
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
        const qtyBefore=p.qty;
        const sold=Math.min(qty,p.qty);
        const avgAtSale=p.avg;
        const costRemoved=sold*avgAtSale;
        const gross=amount;
        const proceeds=Math.max(0,gross-fee);
        const realizedPnl=proceeds-costRemoved;
        const key=keyFor(account,op.symbol);
        cash[account]+=proceeds;
        realized[op.symbol]=(realized[op.symbol]||0)+realizedPnl;
        realizedByKey[key]=(realizedByKey[key]||0)+realizedPnl;
        soldCost[key]=(soldCost[key]||0)+costRemoved;
        p.qty=round(p.qty-sold,12);
        sales.push({
          opId:op.id,date:op.date,account,symbol:op.symbol,name:p.name,assetId:p.id,
          qtySold:sold,qtyBefore,qtyAfter:Math.max(0,p.qty),avg:avgAtSale,gross,fee,net:proceeds,
          costRemoved,realized:realizedPnl,costAfter:Math.max(0,p.qty)*avgAtSale
        });
        if(p.qty<=1e-12){
          closed.push({symbol:p.symbol,name:p.name,account:p.account,closedAt:op.date,realized:realizedByKey[key]||0});
          p.qty=0;
        }
      }
    });

    return {positions:positions.filter(p=>p.qty>1e-12),cash,ownDeposits,rewardDeposits,withdrawals,realized,realizedByKey,soldCost,sales,closed};
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


  function changeToPastPrice(current,pct){
    if(!Number.isFinite(current)||current<=0||!Number.isFinite(pct)||pct<=-99.9) return null;
    return current/(1+pct/100);
  }
  function localSamplesFor(id,days=7){
    const rows=(state.decision?.samples?.[id]||[]).filter(x=>Number.isFinite(num(x?.price))&&Number.isFinite(num(x?.time)));
    const cutoff=Date.now()-days*86400000;
    return rows.filter(x=>num(x.time)>=cutoff).map(x=>num(x.price));
  }
  function syntheticTrend(m,range='7d'){
    const p=num(m?.current_price);
    if(!p) return [];
    const h=Number(m?.price_change_percentage_1h_in_currency);
    const d=Number(m?.price_change_percentage_24h_in_currency);
    const w=Number(m?.price_change_percentage_7d_in_currency);
    const mo=Number(m?.price_change_percentage_30d_in_currency);
    const points=[];
    const pushPast = pct => { const v=changeToPastPrice(p,pct); if(Number.isFinite(v)) points.push(v); };
    if(range==='30d') pushPast(mo);
    if(range==='30d'||range==='7d') pushPast(w);
    if(range==='30d'||range==='7d'||range==='1d') pushPast(d);
    pushPast(h);
    points.push(p);
    return points.filter(Number.isFinite);
  }
  function trendValuesFor(id,m,range='7d'){
    const spark=(m?.sparkline_in_7d?.price||[]).filter(Number.isFinite);
    if(range==='7d'&&spark.length>=4) return {values:spark,mode:'7d reale'};
    const days=range==='1d'?1:range==='30d'?30:7;
    const local=localSamplesFor(id,days);
    if(local.length>=3) return {values:local,mode:'campionato dall’app'};
    if(range==='since') return {values:[],mode:'in costruzione'};
    return {values:syntheticTrend(m,range),mode:'sintetico'};
  }
  function trendCaption(m,mode){
    const h=m?.price_change_percentage_1h_in_currency,d=m?.price_change_percentage_24h_in_currency,w=m?.price_change_percentage_7d_in_currency;
    const label=mode==='sintetico'?'direzione sintetica':'trend';
    return `${label} · 1h ${fmtPct(h)} · 24h ${fmtPct(d)} · 7g ${fmtPct(w)}`;
  }
  function recordDecisionTracking(){
    state.decision=state.decision||{peaks:{},samples:{}};
    state.decision.peaks=state.decision.peaks||{};
    state.decision.samples=state.decision.samples||{};
    const snap=portfolioSnapshot();
    const now=Date.now();
    let changed=false;

    const liveKeys=new Set();
    snap.positions.forEach(p=>{
      const price=currentPrice(p);
      if(!price) return;
      const key=positionPeakKey(p);
      liveKeys.add(key);
      const pct=positionPnlPct(p);
      const prev=state.decision.peaks[key];
      const avgChanged=prev&&Math.abs(num(prev.avg)-num(p.avg))>Math.max(1e-12,Math.abs(num(p.avg))*0.00001);
      if(!prev||avgChanged){
        state.decision.peaks[key]={peakPct:pct,peakPrice:price,time:now,avg:p.avg};
        changed=true;
      }else if(pct>num(prev.peakPct)+0.0001){
        state.decision.peaks[key]={...prev,peakPct:pct,peakPrice:price,time:now,avg:p.avg};
        changed=true;
      }
    });
    Object.keys(state.decision.peaks).forEach(k=>{
      if(!liveKeys.has(k) && Date.now()-num(state.decision.peaks[k]?.time)>30*86400000){
        delete state.decision.peaks[k]; changed=true;
      }
    });

    const ids=new Set(['bitcoin',...snap.positions.map(p=>p.id),...(state.watchlistIds||[]),...(state.opportunity?.candidates||[]).map(c=>c.id)].filter(Boolean));
    ids.forEach(id=>{
      const m=market[id]||state.marketCache?.data?.[id];
      const price=num(m?.current_price);
      if(!price) return;
      const rows=Array.isArray(state.decision.samples[id])?state.decision.samples[id]:[];
      const last=rows[rows.length-1];
      if(!last||now-num(last.time)>=20*60*1000){
        const fresh=[...rows,{time:now,price}].filter(x=>now-num(x.time)<=8*86400000).slice(-600);
        state.decision.samples[id]=fresh; changed=true;
      }
    });
    if(changed) saveState();
  }
  function positionPeakKey(p){ return `${p.account}:${p.id||p.symbol}:${p.openedAt||''}`; }
  function getPositionPeak(p){
    const pct=positionPnlPct(p),price=currentPrice(p);
    const rec=state.decision?.peaks?.[positionPeakKey(p)];
    const peakPct=rec?Math.max(pct,num(rec.peakPct)):pct;
    return {peakPct,peakPrice:rec?num(rec.peakPrice)||price:price,time:rec?.time||Date.now(),pullback:Math.max(0,peakPct-pct)};
  }
  function mark(v,good,bad){
    if(!Number.isFinite(v)) return 'neutral';
    if(v>=good) return 'good';
    if(v<=bad) return 'bad';
    return 'neutral';
  }
  function decisionChecksHTML(checks){
    return `<div class="decision-checks">${checks.map(c=>`<span class="decision-check ${esc(c.state||'neutral')}">${c.state==='good'?'✓':c.state==='bad'?'✕':'~'} ${esc(c.label)}</span>`).join('')}</div>`;
  }
  function positionDecision(p,m){
    const pct=positionPnlPct(p);
    const h=num(m?.price_change_percentage_1h_in_currency),d=num(m?.price_change_percentage_24h_in_currency),w=num(m?.price_change_percentage_7d_in_currency);
    const btc=market.bitcoin||{};
    const rel=d-num(btc?.price_change_percentage_24h_in_currency);
    const peak=getPositionPeak(p);
    const weakening=h<-.25||d<-.75||rel<-.75;
    let label='MANTIENI',tone='observe',reason='Nessun segnale forte di uscita: continua a monitorare il trend e il prezzo rispetto al tuo carico.';
    if((pct<=-10&&d<=-2&&rel<=-1)||(pct<=-8&&w<=-8&&d<0)){
      label='ATTENZIONE'; tone='stop'; reason='La posizione è in perdita e il movimento resta debole: serve attenzione prima di aumentare l’esposizione.';
    }else if(pct>=8&&((peak.peakPct>=10&&peak.pullback>=4&&weakening)||(pct>=18&&weakening))){
      label='VALUTA PRESA PROFITTO'; tone='warn'; reason=`Il profitto resta positivo, ma hai restituito ${peak.pullback.toFixed(1)} punti dal massimo registrato e almeno un segnale sta rallentando.`;
    }else if(pct>=7&&(peak.pullback>=2.5||weakening)){
      label='CONTROLLA PROFITTO'; tone='prepare'; reason='Sei in profitto, ma momentum, forza relativa o distanza dal massimo meritano un controllo più ravvicinato.';
    }else if(pct>=5){
      label='IN PROFITTO'; tone='ready'; reason='La posizione è in profitto e non emerge ancora un segnale forte di uscita.';
    }
    const checks=[
      {label:`P/L ${fmtPct(pct)}`,state:mark(pct,5,-7)},
      {label:`24h ${fmtPct(d)}`,state:mark(d,1.5,-1.5)},
      {label:`7g ${fmtPct(w)}`,state:mark(w,3,-3)},
      {label:`vs BTC ${fmtPct(rel)}`,state:mark(rel,1,-1)},
      {label:`dal max -${peak.pullback.toFixed(1)} pt`,state:peak.pullback<=1.5?'good':peak.pullback>=4?'bad':'neutral'}
    ];
    return {label,tone,reason,checks,...peak,rel};
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


  function candidateTone(status){ return ({'POSSIBILE INGRESSO':'ready','PREPARATI':'prepare','OSSERVA':'observe','NON INSEGUIRE':'stop','INTERESSANTE':'prepare','CANDIDATO FORTE':'ready','DA OSSERVARE':'observe','NON ENTRARE ORA':'stop','ATTENDI CONFERMA':'prepare','SETUP CONFERMATO':'ready','SCARTA':'stop'})[status]||''; }
  function watchDecision(m,btcOverride=null){
    const btc=btcOverride||market.bitcoin||{};
    const h=num(m?.price_change_percentage_1h_in_currency), d=num(m?.price_change_percentage_24h_in_currency), w=num(m?.price_change_percentage_7d_in_currency);
    const bd=num(btc?.price_change_percentage_24h_in_currency), rel=d-bd;
    const cap=num(m?.market_cap),vol=num(m?.total_volume),volRatio=cap>0?vol/cap:null;
    const tooFast=h>=4.5||d>=12||w>=30||(w>=20&&d>=4);
    let label='OSSERVA',tone='observe',reason='nessun segnale abbastanza pulito: resta in osservazione';
    if(tooFast){
      label='NON INSEGUIRE';tone='stop';reason='movimento già molto esteso: meglio osservare senza rincorrere il prezzo';
    }else if(h>=0.20&&h<=3.5&&d>=1.5&&d<=8&&rel>=1&&w>-8){
      label='POSSIBILE INGRESSO';tone='ready';reason='momentum positivo, forza relativa a BTC e movimento ancora non troppo esteso: merita un approfondimento';
    }else if(d>=0.5&&rel>=0.25&&h>=-.5){
      label='PREPARATI';tone='prepare';reason='sta migliorando rispetto al mercato, ma manca ancora una conferma più netta';
    }else if(d<=-6&&h<0){
      label='OSSERVA';tone='observe';reason='fase debole: seguila senza anticipare un recupero';
    }
    const checks=[
      {label:`Momentum ${fmtPct(d)}`,state:mark(d,1.5,-1.5)},
      {label:`vs BTC ${fmtPct(rel)}`,state:mark(rel,1,-1)},
      {label:`Trend 7g ${fmtPct(w)}`,state:mark(w,3,-3)},
      {label:'Volume',state:volRatio==null?'neutral':volRatio>=.10?'good':volRatio<.03?'bad':'neutral'},
      {label:'Estensione',state:tooFast?'bad':'good'}
    ];
    return {label,tone,reason,checks,rel,tooFast,volRatio};
  }

  function proposalDecision(m){
    const base=watchDecision(m);
    if(base.label==='NON INSEGUIRE') return {...base,label:'NON ENTRARE ORA',tone:'stop',reason:'Il Radar l’ha notata, ma il movimento è già troppo esteso: non serve rincorrere il prezzo.'};
    if(base.label==='POSSIBILE INGRESSO') return {...base,label:'CANDIDATO FORTE',tone:'ready',reason:'Segnali quantitativi forti: vale la pena seguirla in Watchlist e vedere se reggono nelle prossime scansioni.'};
    if(base.label==='PREPARATI') return {...base,label:'DA OSSERVARE',tone:'prepare',reason:'Ci sono segnali interessanti, ma non abbastanza per una conferma: può meritare la Watchlist.'};
    return {...base,label:'DA OSSERVARE',tone:'observe',reason:'Il Radar ha trovato qualcosa da monitorare, ma per ora il quadro non è abbastanza forte.'};
  }

  function updateWatchConfirmation(rows,btc){
    state.decision=state.decision||{peaks:{},samples:{},watchConfirm:{}};
    state.decision.watchConfirm=state.decision.watchConfirm||{};
    const map=new Map((rows||[]).map(x=>[x.id,x]));
    const now=Date.now();
    (state.watchlistIds||[]).forEach(id=>{
      const m=map.get(id)||market[id]||state.marketCache?.data?.[id];
      if(!m||!num(m.current_price)) return;
      const base=watchDecision(m,btc);
      const prev=state.decision.watchConfirm[id]||{};
      const closeEnough=prev.lastTime&&now-num(prev.lastTime)<=OPPORTUNITY_TTL*2.5;
      let streak=0;
      if(base.label==='POSSIBILE INGRESSO') streak=(prev.lastBase==='POSSIBILE INGRESSO'&&closeEnough)?num(prev.streak)+1:1;
      state.decision.watchConfirm[id]={...prev,lastBase:base.label,lastTime:now,streak,reason:base.reason};
    });
  }

  function watchlistDecision(a,m){
    const base=watchDecision(m);
    const btc=market.bitcoin||{};
    const h=num(m?.price_change_percentage_1h_in_currency),d=num(m?.price_change_percentage_24h_in_currency),w=num(m?.price_change_percentage_7d_in_currency);
    const rel=d-num(btc?.price_change_percentage_24h_in_currency);
    const rec=state.decision?.watchConfirm?.[a?.id]||{};
    if(base.label==='NON INSEGUIRE') return {...base,label:'NON ENTRARE ORA',tone:'stop',reason:'La crypto resta interessante da osservare, ma il movimento è già troppo esteso per inseguire il prezzo adesso.'};
    if(d<=-7&&w<=-10&&rel<=-4&&h<0) return {...base,label:'SCARTA',tone:'stop',reason:'Il setup si è deteriorato su più orizzonti e sta facendo peggio di BTC: può uscire dalla lista prioritaria.'};
    if(base.label==='POSSIBILE INGRESSO'){
      if(num(rec.streak)>=2) return {...base,label:'SETUP CONFERMATO',tone:'ready',reason:`I segnali sono rimasti allineati per ${num(rec.streak)} scansioni consecutive. È il candidato da approfondire per primo, senza automatismi.`};
      return {...base,label:'ATTENDI CONFERMA',tone:'prepare',reason:'Il quadro è buono, ma vogliamo almeno un’altra scansione coerente prima di considerarlo confermato.'};
    }
    if(base.label==='PREPARATI') return {...base,label:'ATTENDI CONFERMA',tone:'prepare',reason:'Sta migliorando, ma manca ancora una conferma netta e persistente.'};
    return {...base,label:'OSSERVA',tone:'observe',reason:'Resta in Watchlist, ma al momento non c’è un setup abbastanza pulito da mettere in cima alle priorità.'};
  }
  function humanSignalExplanation(sig){
    const r=String(sig.reasonLatest||sig.reason||'').toLowerCase();
    const parts=[];
    if(r.includes('volume')) parts.push('gli scambi erano insolitamente attivi');
    if(r.includes('accelerazione')) parts.push('il movimento stava accelerando rispetto alla scansione precedente');
    if(r.includes('momentum')) parts.push('il prezzo mostrava momentum positivo nelle 24 ore');
    if(r.includes('forza vs btc')) parts.push('stava facendo meglio di Bitcoin');
    if(r.includes('compressione')) parts.push('era vicina ai massimi dopo una fase relativamente compressa');
    if(r.includes('breakout')) parts.push('stava tentando un breakout');
    if(r.includes('coingecko')) parts.push('stava aumentando l’interesse di mercato');
    if(!parts.length) parts.push('il Radar aveva rilevato una combinazione di segnali da monitorare');
    return `Il segnale è stato salvato perché ${parts.slice(0,3).join(', ')}.`;
  }
  function signalState(sig){
    const done=sig.outcome48;
    const o=done||sig.outcome24;
    if(done){
      const p=num(done.pct);
      if(p>=2) return {label:'SEGNALE POSITIVO',tone:'ready'};
      if(p<=-2) return {label:'SEGNALE FALLITO',tone:'stop'};
      return {label:'QUASI INVARIATO',tone:'observe'};
    }
    if(o){
      const p=num(o.pct);
      if(p>=2) return {label:'IN VERIFICA +',tone:'ready'};
      if(p<=-2) return {label:'IN VERIFICA −',tone:'stop'};
      return {label:'IN VERIFICA',tone:'prepare'};
    }
    const current=sig.latestStatus||sig.status;
    if(['POSSIBILE INGRESSO','PREPARATI','OSSERVA','NON INSEGUIRE'].includes(current)) return {label:current,tone:candidateTone(current)};
    return current==='INTERESSANTE'?{label:'PREPARATI',tone:'prepare'}:{label:'OSSERVA',tone:'observe'};
  }
  function signalOutcomeSentence(o,label){
    if(!o) return `${label}: in attesa`;
    const p=num(o.pct);
    if(p>=2) return `${label}: segnale positivo ${fmtPct(p)}`;
    if(p<=-2) return `${label}: segnale negativo ${fmtPct(p)}`;
    return `${label}: quasi invariato ${fmtPct(p)}`;
  }
  function normalizeOpportunitySignals(list){
    const rows=[...(Array.isArray(list)?list:[])].sort((a,b)=>num(a.time)-num(b.time));
    const activeById=new Map(), completed=[];
    rows.forEach(sig=>{
      if(sig?.outcome48) completed.push(sig);
      else if(sig?.id&&!activeById.has(sig.id)) activeById.set(sig.id,sig);
    });
    return [...completed.slice(-40),...activeById.values()].sort((a,b)=>num(a.time)-num(b.time)).slice(-60);
  }
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
    let detected=null;
    if(overextended&&(d>=8||h>=4.5)) detected='NON INSEGUIRE';
    else if(score>=7&&d>0&&rel24>0) detected='INTERESSANTE';
    else if(score>=4) detected='OSSERVA';
    if(!detected) return null;
    const decision=watchDecision(x);
    const status=detected==='NON INSEGUIRE'?'NON INSEGUIRE':decision.label;
    const reasons=[];
    if(volDelta!=null&&volDelta>=10) reasons.push(`volume in aumento ${fmtPct(volDelta)}`); else if(volRatio>=.18) reasons.push('volume molto attivo');
    if(scanMove!=null&&scanMove>=.30&&scanMove<=3.5) reasons.push(`accelerazione scan ${fmtPct(scanMove)}`);
    if(d>=2&&d<=10) reasons.push(`momentum 24h ${fmtPct(d)}`);
    if(rel24>=1.5) reasons.push(`forza vs BTC ${fmtPct(rel24)}`);
    if(compressed&&nearHigh) reasons.push('compressione vicino ai massimi 24h');
    else if(breakout) reasons.push('tentativo di breakout');
    if(trending) reasons.push('interesse CoinGecko in aumento');
    if(overextended) reasons.unshift('movimento già molto esteso');
    return {...x,symbol:String(x.symbol||'').toUpperCase(),status,tone:candidateTone(status),score,reason:reasons.slice(0,4).join(' · ')||'movimento da osservare',decisionReason:decision.reason,rel24,rel7,volRatio,volDelta,scanMove,range24,nearHigh,breakout,trending};
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
    if(changed){ state.opportunity.signals=normalizeOpportunitySignals(state.opportunity.signals); }
  }
  function recordOpportunitySignals(candidates){
    const now=Date.now(); const signals=normalizeOpportunitySignals(state.opportunity.signals||[]);
    candidates.filter(c=>['POSSIBILE INGRESSO','PREPARATI','OSSERVA','NON INSEGUIRE','INTERESSANTE'].includes(c.status)).forEach(c=>{
      const active=[...signals].reverse().find(s=>s.id===c.id&&!s.outcome48);
      if(active){
        active.latestStatus=c.status; active.reasonLatest=c.reason; active.lastSeen=now; active.seenCount=num(active.seenCount)+1;
        return;
      }
      const last=[...signals].reverse().find(s=>s.id===c.id);
      if(last&&last.outcome48&&now-num(last.outcome48.time)<12*3600000&&last.status===c.status) return;
      signals.push({signalId:`sig-${now}-${c.id}`,id:c.id,symbol:c.symbol,name:c.name,time:now,price:num(c.current_price),status:c.status,latestStatus:c.status,reason:c.reason,reasonLatest:c.reason,lastSeen:now,seenCount:1,outcome24:null,outcome48:null});
    });
    state.opportunity.signals=normalizeOpportunitySignals(signals);
  }
  function signalOutcomeLabel(o,label){
    if(!o) return `<span class="pending">${label}: in attesa</span>`;
    return `<span class="${cls(num(o.pct))}">${label}: ${fmtPct(o.pct)}</span>`;
  }

  function portfolioSnapshot(){
    const r=replay();
    const keyFor=(p)=>`${p.account}:${p.symbol}`;
    const totalPnlFor=p=>(r.realizedByKey[keyFor(p)]||0)+positionPnl(p);
    const totalBasisFor=p=>(r.soldCost[keyFor(p)]||0)+positionCost(p);
    const totalPctFor=p=>{const b=totalBasisFor(p);return b?totalPnlFor(p)/b*100:positionPnlPct(p);};
    const byPerformance=(a,b)=>totalPctFor(b)-totalPctFor(a)||totalPnlFor(b)-totalPnlFor(a)||a.symbol.localeCompare(b.symbol);
    const basePos=r.positions.filter(p=>p.account==='base').sort(byPerformance);
    const testPos=r.positions.filter(p=>p.account==='test').sort(byPerformance);
    const baseValue=basePos.reduce((s,p)=>s+positionValue(p),0)+r.cash.base;
    const testValue=testPos.reduce((s,p)=>s+positionValue(p),0)+r.cash.test;
    const total=baseValue+testValue;
    const result=total+r.withdrawals-r.ownDeposits-r.rewardDeposits;
    return {...r,basePos,testPos,baseValue,testValue,total,result,totalPnlFor,totalBasisFor,totalPctFor};
  }

  function renderHome(){
    const s=portfolioSnapshot();
    const btc=market.bitcoin||BASELINE.seedMarket.bitcoin;
    const rs=radarStatus(btc);
    const pnlClass=s.result>=0?'good':'bad';
    const initial=challengeInitialCapital(s);
    const pct=initial?s.result/initial*100:0;
    const liquid=num(s.cash.base)+num(s.cash.test);
    const posSummary=[...s.positions].sort((a,b)=>s.totalPctFor(b)-s.totalPctFor(a));
    const challengeBanner=!state.challenge?.active?`<div class="challenge-banner"><div><b>Nuova Challenge 150 pronta</b><span>Archivia la situazione attuale e riparti da 150 € senza perdere lo storico.</span></div><button class="chip-btn" data-action="new-challenge">Avvia Challenge 150</button></div>`:'';
    const positionPL=posSummary.length?`<div class="pl-overview"><div class="pl-overview-head"><b>P/L posizioni</b><span>risultato di ogni posizione aperta</span></div><div class="pl-mini-grid">${posSummary.map(p=>{const pl=s.totalPnlFor(p),pp=s.totalPctFor(p);return `<div class="pl-mini"><span>${esc(p.symbol)}</span><b class="${cls(pl)}">${fmtEUR(pl)}</b><small class="${cls(pp)}">${fmtPct(pp)}</small></div>`;}).join('')}</div></div>`:'';
    const testBlock=(s.testPos.length||s.cash.test>0.005)?`<div class="section-title compact-section"><div><h2>Fondo Test</h2><p>Separato dal portafoglio principale</p></div></div><div class="cash-card compact-cash"><div class="cash-row"><div><div class="cash-title">⚡ Fondo Test</div><div class="muted small">liquidità e posizioni sperimentali</div></div><div class="cash-value">${fmtEUR(s.testValue)}</div></div><div class="cash-details"><div class="cash-mini"><span>Liquidità</span><b>${fmtEUR(s.cash.test)}</b></div><div class="cash-mini"><span>Posizioni</span><b>${s.testPos.length}</b></div></div>${s.testPos.length?`<div class="portfolio-grid" style="margin-top:12px">${s.testPos.map(assetCard).join('')}</div>`:''}</div>`:'';
    $('#view-home').innerHTML=`
      ${challengeBanner}
      <div class="summary-grid compact-summary">
        <div class="summary-card"><div class="label">Capitale iniziale</div><div class="big">${fmtEUR(initial)}</div><div class="sub">${state.challenge?.active?esc(activeChallengeName())+' · ':''}liquidità ${fmtEUR(liquid)}</div></div>
        <div class="summary-card ${pnlClass}"><div class="label">Risultato reale</div><div class="big">${fmtEUR(s.result)}</div><div class="sub">${fmtPct(pct)} · valore attuale ${fmtEUR(s.total)}</div></div>
      </div>

      ${positionPL}

      <div class="market-hero home-btc" data-open-asset="BTC">
        <div class="market-hero-top"><div><div class="eyebrow">TERMOMETRO BTC</div><h3>Mercato generale</h3></div><div><div class="market-price">${fmtPrice(num(btc.current_price))}</div><div class="btc-pill-wrap"><span class="status-pill ${rs.tone}">${rs.label}</span></div></div></div>
        <div class="market-strip">
          <div class="metric"><span>1h</span><b class="${cls(num(btc.price_change_percentage_1h_in_currency))}">${fmtPct(btc.price_change_percentage_1h_in_currency)}</b></div>
          <div class="metric"><span>24h</span><b class="${cls(num(btc.price_change_percentage_24h_in_currency))}">${fmtPct(btc.price_change_percentage_24h_in_currency)}</b></div>
          <div class="metric"><span>7g</span><b class="${cls(num(btc.price_change_percentage_7d_in_currency))}">${fmtPct(btc.price_change_percentage_7d_in_currency)}</b></div>
        </div>
      </div>

      <div class="section-title portfolio-title"><div><h2>Portafoglio</h2><p>${fmtEUR(s.baseValue)} · ${s.basePos.length} posizioni · liquidità ${fmtEUR(s.cash.base)} · ordinate per P/L totale %</p></div></div>
      <div class="portfolio-grid">${s.basePos.length?s.basePos.map(assetCard).join(''):'<div class="empty portfolio-empty">Nessuna posizione ancora. Registra il primo acquisto con ＋ Operazione.</div>'}</div>
      ${testBlock}
    `;
  }

  function assetCard(p){
    const s=portfolioSnapshot();
    const m=mktFor(p), value=positionValue(p), pnl=positionPnl(p), pct=positionPnlPct(p), day=m?.price_change_percentage_24h_in_currency;
    const key=`${p.account}:${p.symbol}`, realized=s.realizedByKey[key]||0, soldCost=s.soldCost[key]||0;
    const totalPnl=realized+pnl, totalBasis=soldCost+positionCost(p), totalPct=totalBasis?totalPnl/totalBasis*100:pct;
    const dec=positionDecision(p,m);
    const trend=trendValuesFor(p.id,m,'7d');
    return `<article class="asset-card" data-open-asset="${esc(p.symbol)}">
      <div class="asset-head"><div class="asset-name">${esc(p.symbol)} · ${esc(p.name)}</div><span class="status-pill ${dec.tone}">${esc(dec.label)}</span></div>
      <div class="asset-value">${fmtEUR(value)}</div>
      <div class="asset-pnl ${cls(pnl)}">Latente ${fmtEUR(pnl)} · ${fmtPct(pct)}</div>
      ${soldCost>0?`<div class="asset-total ${cls(totalPnl)}">Totale asset ${fmtEUR(totalPnl)} · ${fmtPct(totalPct)}</div>`:''}
      <div class="asset-meta">24h <span class="${cls(num(day))}">${fmtPct(day)}</span> · prezzo ${fmtPrice(currentPrice(p))}</div>
      <div class="asset-peak">Max challenge ${fmtPct(dec.peakPct)} · dal max −${dec.pullback.toFixed(1)} pt</div>
      <div class="spark">${sparkSVG(trend.values)}</div>
      <div class="tag">tocca per dettagli</div>
    </article>`;
  }

  function renderRadar(){
    const s=portfolioSnapshot();
    const watch=watchAssets();
    const watchedIds=new Set(state.watchlistIds||[]);
    const opp=state.opportunity||defaultState().opportunity;
    const scanTime=opp.time?fmtDate(opp.time):'mai';
    const allSignals=normalizeOpportunitySignals(opp.signals||[]).sort((a,b)=>num(b.time)-num(a.time));
    const activeSignals=allSignals.filter(sig=>!sig.outcome48).slice(0,8);
    const archivedSignals=allSignals.filter(sig=>!!sig.outcome48).slice(0,20);
    const stale=isMarketStale();
    const tab=state.ui?.radarTab==='watchlist'?'watchlist':'proposals';
    const proposals=(opp.candidates||[]).filter(c=>!watchedIds.has(c.id)).slice(0,3);

    const signalCard=sig=>{
      const st=signalState(sig);
      return `<details class="signal-card"><summary class="signal-summary"><div><div class="signal-name">${esc(sig.symbol)} · ${esc(sig.name||'')}</div><div class="signal-meta">${fmtDate(sig.time)} · prezzo ${fmtPrice(num(sig.price))}</div><div class="signal-compact">${esc(signalOutcomeSentence(sig.outcome24,'24h'))} · ${esc(signalOutcomeSentence(sig.outcome48,'48h'))}</div></div><span class="status-pill ${st.tone}">${esc(st.label)}</span></summary><div class="signal-detail"><div class="simple-explain"><b>In parole semplici:</b> ${esc(humanSignalExplanation(sig))}</div><div class="technical-box"><b>Dati tecnici</b><div>${esc(sig.reasonLatest||sig.reason||'Dati in aggiornamento')}</div></div><div class="signal-result">${sig.outcome24?esc(signalOutcomeSentence(sig.outcome24,'Dopo 24h')):'Dopo 24h: in attesa'}<br>${sig.outcome48?esc(signalOutcomeSentence(sig.outcome48,'Dopo 48h')):'Dopo 48h: in attesa'}</div><button class="mini-link" data-open-asset="${esc(sig.symbol)}">Apri dettagli crypto</button></div></details>`;
    };

    const proposalsPanel=`
      <div class="section-title radar-panel-title"><div><h2>Proposte Radar</h2><p>Le trova l’app. Tu decidi se una merita di passare nella Watchlist.</p></div><div class="right"><button class="chip-btn" data-action="scan-opportunities">◎ Scansiona</button></div></div>
      ${stale?`<div class="radar-stale-warning"><b>Dati non aggiornati:</b> i semafori restano sospesi finché non torna la connessione live.</div>`:''}
      <div class="radar-flow"><b>Flusso:</b> Radar trova → tu scegli → Watchlist verifica nel tempo → eventuale setup confermato.</div>
      <div class="opportunity-list">${proposals.length?proposals.map((c,i)=>{
        const dec=proposalDecision(c);
        const shownStatus=stale?'DATI NON AGGIORNATI':dec.label;
        const shownTone=stale?'observe':dec.tone;
        const trend=trendValuesFor(c.id,c,'7d');
        return `<article class="opportunity-card" data-open-asset="${esc(c.symbol)}">
          <div class="radar-top"><div><div class="radar-title">${esc(c.symbol)} · ${esc(c.name)}</div><div class="radar-sub">${i===0?'PROPOSTA PRINCIPALE':'PROPOSTA RADAR'}</div></div><span class="status-pill ${shownTone}">${esc(shownStatus)}</span></div>
          <div class="radar-grid">
            <div class="metric"><span>Prezzo</span><b>${fmtPrice(num(c.current_price))}</b></div>
            <div class="metric"><span>1h</span><b class="${cls(num(c.price_change_percentage_1h_in_currency))}">${fmtPct(c.price_change_percentage_1h_in_currency)}</b></div>
            <div class="metric"><span>24h</span><b class="${cls(num(c.price_change_percentage_24h_in_currency))}">${fmtPct(c.price_change_percentage_24h_in_currency)}</b></div>
            <div class="metric"><span>vs BTC 24h</span><b class="${cls(num(c.rel24))}">${fmtPct(c.rel24)}</b></div>
          </div>
          <div class="spark">${sparkSVG(trend.values)}</div>
          <div class="trend-caption">${esc(trendCaption(c,trend.mode))}</div>
          ${decisionChecksHTML(dec.checks)}
          <div class="radar-reason"><b>Lettura:</b> ${esc(dec.reason)}<br><b>Perché il Radar l’ha trovata:</b> ${esc(c.reason)}</div>
          <div class="opportunity-actions"><button data-watch-candidate="${esc(c.id)}">＋ Segui in Watchlist</button></div>
        </article>`;
      }).join(''):'<div class="empty">Nessuna nuova proposta abbastanza pulita. Le crypto già nella tua Watchlist non vengono duplicate qui.</div>'}</div>
      <details class="signal-hub"><summary>Cosa sarebbe successo? <span>${activeSignals.length} attivi</span></summary><div class="signal-hub-body"><p class="muted small">Verifica didattica dei segnali salvati, senza dover comprare.</p><div class="signal-list">${activeSignals.length?activeSignals.map(signalCard).join(''):'<div class="empty">Nessun segnale attivo.</div>'}</div>${archivedSignals.length?`<details class="signal-archive"><summary>Archivio segnali conclusi <span>${archivedSignals.length}</span></summary><div class="signal-list archive-list">${archivedSignals.map(signalCard).join('')}</div></details>`:''}</div></details>`;

    const watchRank={'SETUP CONFERMATO':5,'ATTENDI CONFERMA':4,'OSSERVA':3,'NON ENTRARE ORA':2,'SCARTA':1};
    const watchRows=watch.map(a=>{
      const m=market[a.id]||state.marketCache?.data?.[a.id]||{};
      const real=watchlistDecision(a,m);
      const st=stale?{...real,label:'DATI NON AGGIORNATI',tone:'observe',reason:'Attendi il ritorno live prima di interpretare il semaforo.'}:real;
      return {a,m,st,trend:trendValuesFor(a.id,m,'7d')};
    }).sort((x,y)=>(watchRank[y.st.label]||0)-(watchRank[x.st.label]||0)||num(y.m.price_change_percentage_24h_in_currency)-num(x.m.price_change_percentage_24h_in_currency));

    const watchPanel=`
      <div class="section-title radar-panel-title"><div><h2>La mia Watchlist</h2><p>Solo le crypto che hai deciso tu di seguire, ordinate per priorità.</p></div><div class="right"><button class="chip-btn" data-action="add-watch">＋ Aggiungi</button></div></div>
      <div class="watch-semaphore-legend"><span class="legend-dot observe"></span>OSSERVA <span class="legend-dot prepare"></span>ATTENDI CONFERMA <span class="legend-dot ready"></span>SETUP CONFERMATO <span class="legend-dot stop"></span>NON ENTRARE ORA / SCARTA</div>
      <div class="watch-help">Il semaforo qui è più severo del Radar: una proposta deve restare coerente nel tempo prima di diventare <b>SETUP CONFERMATO</b>.</div>
      <div class="radar-list">${watchRows.length?watchRows.map(({a,m,st,trend},i)=>`<article class="radar-card" data-open-asset="${esc(a.symbol)}">
          <div class="radar-top"><div><div class="radar-title">${esc(a.symbol)} · ${esc(a.name)}</div><div class="radar-sub">${i===0&&st.label!=='SCARTA'?'PRIORITÀ WATCHLIST':'WATCHLIST'}</div></div><div><span class="status-pill ${st.tone}">${esc(st.label)}</span><button class="watch-remove" data-remove-watch-id="${esc(a.id)}">rimuovi</button></div></div>
          <div class="radar-grid">
            <div class="metric"><span>Prezzo</span><b>${fmtPrice(num(m.current_price))}</b></div>
            <div class="metric"><span>1h</span><b class="${cls(num(m.price_change_percentage_1h_in_currency))}">${fmtPct(m.price_change_percentage_1h_in_currency)}</b></div>
            <div class="metric"><span>24h</span><b class="${cls(num(m.price_change_percentage_24h_in_currency))}">${fmtPct(m.price_change_percentage_24h_in_currency)}</b></div>
            <div class="metric"><span>7g</span><b class="${cls(num(m.price_change_percentage_7d_in_currency))}">${fmtPct(m.price_change_percentage_7d_in_currency)}</b></div>
          </div>
          <div class="spark">${sparkSVG(trend.values)}</div>
          <div class="trend-caption">${esc(trendCaption(m,trend.mode))}</div>
          ${decisionChecksHTML(st.checks||[])}
          <div class="watch-why"><b>${esc(st.label)}:</b> ${esc(st.reason)}</div>
        </article>`).join(''):'<div class="empty">La Watchlist è vuota. Vai su Proposte Radar e scegli solo ciò che vuoi davvero seguire.</div>'}</div>`;

    $('#view-radar').innerHTML=`
      <div class="radar-tabs" role="tablist" aria-label="Sezioni Radar">
        <button class="radar-tab ${tab==='proposals'?'active':''}" data-radar-tab="proposals">Proposte Radar <span>${proposals.length}</span></button>
        <button class="radar-tab ${tab==='watchlist'?'active':''}" data-radar-tab="watchlist">Watchlist <span>${watch.length}</span></button>
      </div>
      ${tab==='proposals'?proposalsPanel:watchPanel}
    `;
  }

  function operationLabel(type){ return ({BUY:'Acquisto',SELL:'Vendita',DEPOSIT_PERSONAL:'Versamento personale',DEPOSIT_REWARD:'Reward / bonus',WITHDRAW:'Prelievo',TRANSFER:'Trasferimento'})[type]||type; }
  function operationAmount(op){
    if(op.type==='BUY') return `−${fmtEUR(num(op.amount)+num(op.fee))}`;
    if(op.type==='SELL') return `+${fmtEUR(num(op.amount)-num(op.fee))}`;
    if(op.type==='WITHDRAW') return `−${fmtEUR(num(op.amount))}`;
    if(op.type==='TRANSFER') return fmtEUR(num(op.amount));
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
      <div class="ops-list">${recent.length?recent.map(op=>opCard(op,false,s)).join(''):'<div class="empty">Nessuna nuova operazione ancora registrata.</div>'}</div>
      <div class="section-title"><div><h2>Storico iniziale</h2><p>Snapshot usato per partire con i conti corretti</p></div></div>
      <div class="ops-list">${[...BASELINE.history].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(op=>opCard(op,true,null)).join('')}</div>
    `;
  }
  function opCard(op,locked=false,snap=null){
    const clsType=op.type==='BUY'?'buy':op.type==='SELL'?'sell':'';
    const symbol=op.symbol?` · ${esc(op.symbol)}`:'';
    const qty=op.qty?`${fmtQty(num(op.qty))} ${esc(op.symbol||'')}`:'';
    const account=op.account==='test'?'Fondo Test':'Base';
    const toAccount=op.toAccount==='test'?'Fondo Test':'Base';
    const title=op.type==='TRANSFER'?`${account} → ${toAccount}`:`${account}${symbol}`;
    const sale=snap&&op.type==='SELL'?(snap.sales||[]).find(x=>x.opId===op.id):null;
    const saleLine=sale?`<div class="op-sale-line">lordo ${fmtEUR(sale.gross)} · commissione ${fmtEUR(sale.fee)} · netto ${fmtEUR(sale.net)} · P/L realizzato <span class="${cls(sale.realized)}">${fmtEUR(sale.realized)}</span></div>`:'';
    return `<article class="op-card">
      <div class="op-top"><div><span class="op-type ${clsType}">${esc(operationLabel(op.type))}</span><div class="op-title" style="margin-top:8px">${title}</div><div class="op-sub">${fmtDate(op.date)}${qty?` · ${qty}`:''}${op.note?` · ${esc(op.note)}`:''}</div>${saleLine}</div><div class="op-amount">${operationAmount(op)}</div></div>
      ${locked?'':`<div class="op-actions"><button data-edit-op="${esc(op.id)}">Modifica</button><button data-delete-op="${esc(op.id)}">Elimina</button></div>`}
    </article>`;
  }


  // RC8.1 · Trading assistito automatico. Usa gli stessi dati già scaricati
  // dall'app: nessun ordine viene eseguito e non vengono fatte chiamate API extra.
  function assistantEntryDecision(a,m){
    const st=watchlistDecision(a,m);
    const checks=st.checks||[];
    const bad=checks.filter(c=>c.state==='bad');
    const volBad=bad.some(c=>String(c.label).toLowerCase().includes('volume'));
    let label=st.label,tone=st.tone,reason=st.reason,priority=35;
    if(st.label==='SETUP CONFERMATO'){
      if(volBad){
        label='ATTENDI VOLUME'; tone='prepare'; priority=72;
        reason='Il setup è confermato nel tempo, ma il volume non sta ancora sostenendo abbastanza il movimento. È il punto da controllare prima di valutare un ingresso.';
      }else if(bad.length){
        label='ATTENDI TRIGGER'; tone='prepare'; priority=68;
        reason='Il setup è confermato, ma almeno un indicatore resta debole. Aspetta che il quadro torni pienamente coerente.';
      }else{
        label='INGRESSO DA VALUTARE'; tone='ready'; priority=90;
        reason='Il setup è rimasto coerente per più scansioni e non ci sono segnali rossi. È un ingresso da valutare, non un ordine automatico.';
      }
    }else if(st.label==='ATTENDI CONFERMA') priority=60;
    else if(st.label==='NON ENTRARE ORA') priority=20;
    else if(st.label==='SCARTA') priority=10;
    else priority=35;
    return {...st,label,tone,reason,priority};
  }

  function assistantPositionDecision(p,m){
    const st=positionDecision(p,m);
    const rank={'ATTENZIONE':96,'VALUTA PRESA PROFITTO':92,'CONTROLLA PROFITTO':76,'IN PROFITTO':55,'MANTIENI':35};
    return {...st,priority:rank[st.label]||30};
  }

  function buildAssistantItems(){
    const snap=portfolioSnapshot();
    const items=[];
    snap.positions.forEach(p=>{
      const m=market[p.id]||state.marketCache?.data?.[p.id]||{};
      if(!num(m.current_price)) return;
      const st=assistantPositionDecision(p,m);
      items.push({key:`position:${p.account}:${p.id||p.symbol}`,type:'position',symbol:p.symbol,name:p.name||p.symbol,account:p.account,label:st.label,tone:st.tone,reason:st.reason,checks:st.checks||[],priority:st.priority,price:num(m.current_price),pnl:positionPnl(p),pct:positionPnlPct(p),peakPct:st.peakPct,pullback:st.pullback});
    });
    watchAssets().forEach(a=>{
      const m=market[a.id]||state.marketCache?.data?.[a.id]||{};
      if(!num(m.current_price)) return;
      const st=assistantEntryDecision(a,m);
      items.push({key:`watch:${a.id}`,type:'watch',symbol:a.symbol,name:a.name,id:a.id,label:st.label,tone:st.tone,reason:st.reason,checks:st.checks||[],priority:st.priority,price:num(m.current_price),h:num(m.price_change_percentage_1h_in_currency),d:num(m.price_change_percentage_24h_in_currency),w:num(m.price_change_percentage_7d_in_currency),rel:num(st.rel)});
    });
    return items.sort((a,b)=>num(b.priority)-num(a.priority)||String(a.symbol).localeCompare(String(b.symbol)));
  }

  function runAutoAnalysis(source='auto',persist=true){
    state.assistant={...defaultState().assistant,...(state.assistant||{}),lastStatus:{...(state.assistant?.lastStatus||{})},log:Array.isArray(state.assistant?.log)?state.assistant.log:[]};
    const fresh=!isMarketStale();
    const now=Date.now();
    const items=buildAssistantItems();
    if(fresh){
      const last={...(state.assistant.lastStatus||{})};
      const log=[...(state.assistant.log||[])];
      items.forEach(it=>{
        const prev=last[it.key];
        if(prev && prev.label!==it.label){
          log.unshift({time:now,key:it.key,type:it.type,symbol:it.symbol,from:prev.label,to:it.label,reason:it.reason,price:it.price});
        }
        last[it.key]={label:it.label,time:now,price:it.price};
      });
      state.assistant.lastStatus=last;
      state.assistant.log=log.slice(0,80);
    }
    state.assistant={...state.assistant,time:now,source,fresh,items};
    if(persist) saveState();
    return items;
  }

  function assistantTime(ts){
    if(!ts) return 'mai';
    return new Intl.DateTimeFormat('it-IT',{hour:'2-digit',minute:'2-digit'}).format(new Date(ts));
  }

  function assistantMeta(it){
    if(it.type==='position') return `P/L ${fmtEUR(it.pnl)} · ${fmtPct(it.pct)}${Number.isFinite(it.pullback)?` · dal max −${num(it.pullback).toFixed(1)} pt`:''}`;
    return `1h ${fmtPct(it.h)} · 24h ${fmtPct(it.d)} · 7g ${fmtPct(it.w)} · vs BTC ${fmtPct(it.rel)}`;
  }

  function assistantItemHTML(it,index=0){
    const kind=it.type==='position'?'POSIZIONE APERTA':'WATCHLIST · POSSIBILE ENTRATA';
    return `<details class="assistant-item ${esc(it.tone||'')}" ${index===0?'open':''}><summary><div><span class="assistant-kind">${kind}</span><b>${esc(it.symbol)} · ${esc(it.name)}</b><small>${esc(assistantMeta(it))}</small></div><span class="status-pill ${esc(it.tone||'')}">${esc(it.label)}</span></summary><div class="assistant-item-body"><p>${esc(it.reason)}</p>${decisionChecksHTML(it.checks||[])}<small>${it.type==='position'?'La lettura serve a gestire la posizione; non vende nulla.':'La lettura serve a decidere cosa approfondire; non compra nulla.'}</small></div></details>`;
  }

  function assistantLogHTML(){
    const rows=(state.assistant?.log||[]).slice(0,20);
    if(!rows.length) return '<div class="training-empty"><b>Nessun cambio di stato ancora.</b><span>Qui compariranno solo i cambi reali dei semafori, senza ripetere la stessa lettura ogni 5 minuti.</span></div>';
    return `<div class="assistant-log-list">${rows.map(x=>`<div class="assistant-log-row"><div><b>${esc(x.symbol)}</b><span>${assistantTime(x.time)}</span></div><p>${esc(x.from)} → <strong>${esc(x.to)}</strong></p></div>`).join('')}</div>`;
  }

  function renderAssistantAuto(){
    const a=state.assistant||defaultState().assistant;
    const items=Array.isArray(a.items)&&a.items.length?a.items:runAutoAnalysis('schermata',false);
    const snap=portfolioSnapshot();
    const fresh=!isMarketStale();
    const positionItems=items.filter(x=>x.type==='position');
    const watchItems=items.filter(x=>x.type==='watch');
    const top=items[0];
    const topText=!fresh?'I dati non sono abbastanza freschi: nessun semaforo va usato finché non torna il live.':top?`${top.symbol}: ${top.label}. ${top.reason}`:'Nessuna posizione o crypto in Watchlist da analizzare.';
    return `<div class="assistant-live ${fresh?'live':'stale'}"><div><span class="assistant-live-dot"></span><b>Auto-lettura ${fresh?'attiva':'in attesa dati'}</b><small>Ogni 5 minuti mentre l’app è aperta · ultima analisi ${assistantTime(a.time)}</small></div><button class="chip-btn" data-action="assistant-refresh">Aggiorna & analizza</button></div>
      <div class="assistant-summary"><div class="lesson-tag">COSA RICHIEDE ATTENZIONE ADESSO</div><p>${esc(topText)}</p><div class="assistant-summary-grid"><span>Liquidità Base <b>${fmtEUR(snap.cash.base)}</b></span><span>Posizioni <b>${positionItems.length}</b></span><span>Watchlist <b>${watchItems.length}</b></span><span>Fonte <b>${esc(marketSource)}</b></span></div></div>
      <div class="assistant-explain"><b>Come lavora:</b> i prezzi vengono letti ogni 5 minuti. L’app ricalcola automaticamente semafori di entrata e gestione posizione con gli stessi criteri usati nel Radar. Il Radar ampio continua a scandagliare il mercato ogni 15 minuti.</div>
      <div class="section-title compact-section"><div><h2>Lettura automatica</h2><p>Prima le situazioni che richiedono più attenzione</p></div></div>
      <div class="assistant-list">${items.length?items.map(assistantItemHTML).join(''):'<div class="training-empty"><b>Niente da analizzare.</b><span>Aggiungi una crypto alla Watchlist o registra una posizione.</span></div>'}</div>
      <details class="assistant-log"><summary>Cambi di stato <span>${(state.assistant?.log||[]).length}</span></summary><div class="assistant-log-body">${assistantLogHTML()}</div></details>
      <div class="assistant-limit"><b>Importante:</b> questa PWA può analizzare ogni 5 minuti mentre è aperta. Android può sospenderla quando è chiusa o in background; quando torni nell’app viene eseguito subito un nuovo controllo. Per un monitoraggio 24/7 a schermo chiuso servirebbe in futuro un servizio esterno/backend.</div>`;
  }


  const TRAINING_LESSONS = [
    {title:'Prezzo medio di carico',text:'È il costo medio delle unità che possiedi. Serve per capire se il prezzo attuale ti sta portando profitto o perdita.'},
    {title:'P/L latente e realizzato',text:'Latente riguarda ciò che possiedi ancora. Realizzato è il risultato già cristallizzato con una vendita.'},
    {title:'Momentum 1h e 24h',text:'Misura quanto il prezzo sta accelerando nel breve. Un momentum positivo aiuta, ma da solo non basta per entrare.'},
    {title:'Trend 7 giorni',text:'Serve a capire la direzione più ampia. Un buon 24h dentro un 7g debole può essere solo un rimbalzo.'},
    {title:'Volume',text:'Un movimento sostenuto da scambi attivi è più credibile di uno con volume debole. Per questo il volume può bloccare una conferma.'},
    {title:'Forza rispetto a BTC',text:'Confronta la crypto con Bitcoin. Se la crypto sale più di BTC, mostra forza relativa; se resta indietro, il segnale è meno convincente.'},
    {title:'Estensione',text:'Una crypto può essere forte ma già troppo salita. In quel caso il rischio è rincorrere il prezzo: NON ENTRARE ORA non significa smettere di seguirla.'},
    {title:'Setup confermato',text:'Nella Watchlist richiede segnali coerenti per più scansioni. È un candidato da approfondire, non un ordine automatico.'},
    {title:'Massimo P/L e ritracciamento',text:'Per una posizione aperta conta non solo il profitto attuale, ma anche quanto ha restituito rispetto al massimo raggiunto durante la challenge.'},
    {title:'Semaforo posizione',text:'MANTIENI, IN PROFITTO, CONTROLLA PROFITTO, VALUTA PRESA PROFITTO e ATTENZIONE combinano P/L, trend, forza vs BTC e ritracciamento.'},
    {title:'Cosa sarebbe successo?',text:'Salva un segnale senza comprare e controlla dopo 24h/48h. Serve per misurare il metodo senza rischiare soldi ogni volta.'}
  ];

  function trainingEntryCandidate(){
    const assets=watchAssets();
    const rank={'SETUP CONFERMATO':5,'ATTENDI CONFERMA':4,'OSSERVA':3,'NON ENTRARE ORA':2,'SCARTA':1};
    const rows=assets.map(a=>{const m=market[a.id]||state.marketCache?.data?.[a.id]||{};return {a,m,st:watchlistDecision(a,m)};})
      .filter(x=>num(x.m.current_price)>0)
      .sort((x,y)=>(rank[y.st.label]||0)-(rank[x.st.label]||0)||num(y.m.price_change_percentage_24h_in_currency)-num(x.m.price_change_percentage_24h_in_currency));
    return rows[0]||null;
  }
  function trainingExitCandidate(){
    const snap=portfolioSnapshot();
    const rank={'ATTENZIONE':6,'VALUTA PRESA PROFITTO':5,'CONTROLLA PROFITTO':4,'IN PROFITTO':3,'MANTIENI':2};
    const rows=snap.positions.map(p=>{const m=market[p.id]||state.marketCache?.data?.[p.id]||{};return {p,m,st:positionDecision(p,m)};})
      .filter(x=>num(x.m.current_price)>0)
      .sort((x,y)=>(rank[y.st.label]||0)-(rank[x.st.label]||0)||Math.abs(positionPnlPct(y.p))-Math.abs(positionPnlPct(x.p)));
    return rows[0]||null;
  }
  function trainingProgress(){
    const attempts=Array.isArray(state.training?.attempts)?state.training.attempts:[];
    const entry=attempts.filter(x=>x.mode==='entry').length;
    const exit=attempts.filter(x=>x.mode==='exit').length;
    const lessons=Object.keys(state.training?.seenLessons||{}).length;
    return {attempts,entry,exit,lessons};
  }
  function trainingOption(label,selected=''){
    return `<button type="button" class="training-choice ${selected===label?'selected':''}" data-training-choice="${esc(label)}">${esc(label)}</button>`;
  }
  function trainingScenarioHTML(mode,{today=false}={}){
    if(mode==='entry'){
      const row=trainingEntryCandidate();
      if(!row) return `<div class="training-empty"><b>Nessun candidato in Watchlist.</b><span>Quando scegli una proposta del Radar e la metti in Watchlist, qui potrai allenarti a interpretarla prima di guardare il semaforo.</span></div>`;
      const {a,m}=row; const btc=market.bitcoin||{}; const rel=num(m.price_change_percentage_24h_in_currency)-num(btc.price_change_percentage_24h_in_currency); const cap=num(m.market_cap),vol=num(m.total_volume),vr=cap>0?vol/cap*100:null;
      return `<article class="training-scenario" data-training-mode="entry" data-training-id="${esc(a.id)}" data-training-symbol="${esc(a.symbol)}">
        <div class="training-scenario-top"><div><div class="lesson-tag">${today?'ALLENAMENTO DI OGGI':'ENTRATA · WATCHLIST'}</div><h3>${esc(a.symbol)} · ${esc(a.name)}</h3></div><span class="training-hidden-verdict">verdetto nascosto</span></div>
        <p class="training-question">Con questi dati, come la leggeresti adesso?</p>
        <div class="training-metrics"><div><span>1h</span><b>${fmtPct(m.price_change_percentage_1h_in_currency)}</b></div><div><span>24h</span><b>${fmtPct(m.price_change_percentage_24h_in_currency)}</b></div><div><span>7g</span><b>${fmtPct(m.price_change_percentage_7d_in_currency)}</b></div><div><span>vs BTC</span><b>${fmtPct(rel)}</b></div><div><span>Volume/cap</span><b>${vr==null?'—':vr.toFixed(1)+'%'}</b></div><div><span>Prezzo</span><b>${fmtPrice(num(m.current_price))}</b></div></div>
        <div class="training-choices">${['OSSERVA','ATTENDI CONFERMA','SETUP CONFERMATO','NON ENTRARE ORA','SCARTA'].map(x=>trainingOption(x)).join('')}</div>
        <button type="button" class="primary-btn training-reveal" data-training-reveal>Mostra lettura</button>
        <div class="training-feedback" hidden></div>
      </article>`;
    }
    const row=trainingExitCandidate();
    if(!row) return `<div class="training-empty"><b>Nessuna posizione aperta.</b><span>Quando registri un acquisto nella challenge, qui potrai allenarti a gestire la posizione.</span></div>`;
    const {p,m,st}=row; const pct=positionPnlPct(p); const peak=getPositionPeak(p); const btc=market.bitcoin||{}; const rel=num(m.price_change_percentage_24h_in_currency)-num(btc.price_change_percentage_24h_in_currency);
    return `<article class="training-scenario" data-training-mode="exit" data-training-id="${esc(p.id||p.symbol)}" data-training-symbol="${esc(p.symbol)}" data-training-account="${esc(p.account)}">
      <div class="training-scenario-top"><div><div class="lesson-tag">${today?'ALLENAMENTO DI OGGI':'USCITA · POSIZIONE'}</div><h3>${esc(p.symbol)} · ${esc(p.name||p.symbol)}</h3></div><span class="training-hidden-verdict">verdetto nascosto</span></div>
      <p class="training-question">La posizione è aperta: cosa faresti guardando solo questi numeri?</p>
      <div class="training-metrics"><div><span>P/L</span><b>${fmtPct(pct)}</b></div><div><span>24h</span><b>${fmtPct(m.price_change_percentage_24h_in_currency)}</b></div><div><span>7g</span><b>${fmtPct(m.price_change_percentage_7d_in_currency)}</b></div><div><span>vs BTC</span><b>${fmtPct(rel)}</b></div><div><span>Max P/L</span><b>${fmtPct(peak.peakPct)}</b></div><div><span>Dal max</span><b>−${peak.pullback.toFixed(1)} pt</b></div></div>
      <div class="training-choices">${['MANTIENI','IN PROFITTO','CONTROLLA PROFITTO','VALUTA PRESA PROFITTO','ATTENZIONE'].map(x=>trainingOption(x)).join('')}</div>
      <button type="button" class="primary-btn training-reveal" data-training-reveal>Mostra lettura</button>
      <div class="training-feedback" hidden></div>
    </article>`;
  }
  function trainingExpected(scenario){
    const mode=scenario.dataset.trainingMode;
    const symbol=scenario.dataset.trainingSymbol;
    if(mode==='entry'){
      const a=assetById(scenario.dataset.trainingId)||assetBySymbol(symbol); if(!a) return null;
      const m=market[a.id]||state.marketCache?.data?.[a.id]||{}; return {st:watchlistDecision(a,m),title:`${a.symbol} · ${a.name}`};
    }
    const snap=portfolioSnapshot();
    const p=snap.positions.find(x=>x.symbol===symbol&&(!scenario.dataset.trainingAccount||x.account===scenario.dataset.trainingAccount)); if(!p) return null;
    const m=market[p.id]||state.marketCache?.data?.[p.id]||{}; return {st:positionDecision(p,m),title:`${p.symbol} · ${p.name||p.symbol}`};
  }
  function trainingFeedbackHTML(selected,expected){
    const st=expected.st; const same=selected===st.label;
    return `<div class="training-feedback-head"><span class="status-pill ${esc(st.tone)}">${esc(st.label)}</span><b>${same?'La tua lettura coincide con l’app':'Confronta la tua lettura con l’app'}</b></div><p><b>Perché:</b> ${esc(st.reason)}</p>${decisionChecksHTML(st.checks||[])}<small>Il semaforo è una lettura dei dati, non una certezza né un ordine di acquisto/vendita.</small>`;
  }
  function trainingHistoryCard(sig){
    const stateSig=signalState(sig); const o=sig.outcome48||sig.outcome24; const p=o?num(o.pct):null;
    let lesson='Il setup è ancora in verifica: aspettiamo il dato reale prima di giudicarlo.';
    if(p!=null&&p>=2) lesson='Il segnale ha avuto seguito. Conta la combinazione dei fattori, non un singolo indicatore.';
    else if(p!=null&&p<=-2) lesson='Il segnale non ha avuto seguito: anche un setup coerente resta una probabilità, non una certezza.';
    else if(p!=null) lesson='Movimento contenuto: un buon setup può anche non partire subito.';
    return `<details class="training-history-card"><summary><div><b>${esc(sig.symbol||sig.id||'Segnale')}</b><span>${fmtDate(new Date(num(sig.time)))}</span></div><span class="status-pill ${esc(stateSig.tone)}">${esc(stateSig.label)}</span></summary><div class="training-history-body"><p><b>Cosa avevamo visto:</b> ${esc(humanSignalExplanation(sig))}</p><p><b>Cosa è successo:</b> ${esc(signalOutcomeSentence(sig.outcome24,'24h'))} · ${esc(signalOutcomeSentence(sig.outcome48,'48h'))}</p><p><b>Lezione:</b> ${esc(lesson)}</p></div></details>`;
  }
  function renderSchool(){
    state.training=state.training||{seenLessons:{},attempts:[]};
    const assistantTab=state.ui?.assistantTab||'auto';
    const progress=trainingProgress();
    const tab=state.ui?.trainingTab||'entries';
    const todayMode=trainingEntryCandidate()?'entry':'exit';
    const signals=[...(state.opportunity?.signals||[])].sort((a,b)=>num(b.time)-num(a.time)).slice(0,12);
    let trainingPanel='';
    if(tab==='basics'){
      trainingPanel=`<div class="training-lessons">${TRAINING_LESSONS.map((l,i)=>`<details class="training-lesson" data-training-lesson="${i}"><summary><span>${state.training.seenLessons?.[i]?'✓':'○'}</span><b>${esc(l.title)}</b></summary><p>${esc(l.text)}</p></details>`).join('')}</div>`;
    }else if(tab==='entries') trainingPanel=trainingScenarioHTML('entry');
    else if(tab==='exits') trainingPanel=trainingScenarioHTML('exit');
    else trainingPanel=`<div class="training-history"><p class="muted small">Segnali reali salvati dal Radar. Qui non si valuta quanto hai guadagnato: si controlla se la lettura iniziale aveva senso.</p>${signals.length?signals.map(trainingHistoryCard).join(''):'<div class="training-empty"><b>Nessun segnale salvato.</b><span>Quando il Radar registra segnali, compariranno qui con il confronto 24h/48h.</span></div>'}</div>`;
    const trainingHTML=`<div class="training-progress"><div><span>Hai già visto</span><b>${progress.lessons} basi · ${progress.entry} entrate · ${progress.exit} uscite</b></div><small>Niente punteggi: conta capire il perché.</small></div>
      ${trainingScenarioHTML(todayMode,{today:true})}
      <div class="training-tabs"><button class="training-tab ${tab==='basics'?'active':''}" data-training-tab="basics">Basi</button><button class="training-tab ${tab==='entries'?'active':''}" data-training-tab="entries">Entrate</button><button class="training-tab ${tab==='exits'?'active':''}" data-training-tab="exits">Uscite</button><button class="training-tab ${tab==='history'?'active':''}" data-training-tab="history">Storico</button></div>
      <div class="training-panel">${trainingPanel}</div>`;
    $('#view-school').innerHTML=`
      <div class="section-title"><div><h2>Assistente</h2><p>Trading assistito automatico + Training sugli stessi segnali</p></div></div>
      <div class="assistant-tabs"><button class="assistant-tab ${assistantTab==='auto'?'active':''}" data-assistant-tab="auto">Auto-analisi</button><button class="assistant-tab ${assistantTab==='training'?'active':''}" data-assistant-tab="training">Training</button></div>
      ${assistantTab==='auto'?renderAssistantAuto():trainingHTML}
    `;
  }

  function challengeArchiveCard(a){
    const pos=(a.positions||[]);
    return `<details class="challenge-archive-card"><summary><div><b>${esc(a.name||'Challenge archiviata')}</b><span>${fmtDate(a.closedAt)}</span></div><div class="${cls(num(a.resultAtClose))}">${fmtEUR(num(a.resultAtClose))}</div></summary><div class="challenge-archive-body"><div class="cash-details"><div class="cash-mini"><span>Capitale entrato</span><b>${fmtEUR(num(a.capitalEntered))}</b></div><div class="cash-mini"><span>Valore alla chiusura</span><b>${fmtEUR(num(a.totalAtClose))}</b></div></div>${pos.length?`<div class="archive-position-list">${pos.map(p=>`<div><span>${esc(p.symbol)}</span><b class="${cls(num(p.totalPnl))}">${fmtEUR(num(p.totalPnl))}</b><small>${fmtPct(num(p.totalPct))}</small></div>`).join('')}</div>`:'<div class="muted small" style="margin-top:10px">Nessuna posizione aperta alla chiusura.</div>'}<div class="muted small" style="margin-top:10px">Archivio in sola lettura · ${a.opsCount||0} operazioni registrate.</div></div></details>`;
  }

  function renderDiary(){
    const s=portfolioSnapshot();
    const notes=[...state.notes].sort((a,b)=>new Date(b.date)-new Date(a.date));
    const realizedEntries=Object.entries(s.realized).filter(([,v])=>Math.abs(v)>0.0001);
    const saleEvents=[...(s.sales||[])].sort((a,b)=>new Date(b.date)-new Date(a.date));
    const archives=[...(state.challengeArchives||[])].sort((a,b)=>new Date(b.closedAt)-new Date(a.closedAt));
    const currentChallenge=state.challenge?.active?`<div class="challenge-current-card"><div><div class="eyebrow">CHALLENGE ATTIVA</div><h3>${esc(state.challenge.name)}</h3><p>dal ${fmtDate(state.challenge.startedAt)} · capitale iniziale ${fmtEUR(num(state.challenge.initialCapital))}</p></div><div class="challenge-current-result"><span>Risultato</span><b class="${cls(s.result)}">${fmtEUR(s.result)}</b></div><button class="chip-btn" data-action="new-challenge">Nuova challenge</button></div>`:`<div class="challenge-current-card legacy"><div><div class="eyebrow">PASSAGGIO CHALLENGE</div><h3>Pronto per Challenge 150</h3><p>Archivia la situazione attuale e riparti con contabilità pulita.</p></div><button class="primary-btn" data-action="new-challenge">Avvia Challenge 150</button></div>`;
    $('#view-diary').innerHTML=`
      <div class="section-title"><div><h2>Challenge</h2><p>La challenge attiva resta separata dallo storico precedente</p></div></div>
      ${currentChallenge}
      ${archives.length?`<div class="section-title compact-section"><div><h2>Archivio challenge</h2><p>Snapshot congelati, non influenzano i conti attuali</p></div></div><div class="challenge-archive-list">${archives.map(challengeArchiveCard).join('')}</div>`:''}

      <div class="section-title"><div><h2>Diario</h2><p>Note, vendite, operazioni e backup dei dati</p></div><div class="right"><button class="chip-btn" data-action="manage-ops">Gestisci operazioni</button><button class="chip-btn" data-action="new-note">＋ Nota</button></div></div>
      <div class="note-list">${notes.length?notes.map(n=>`<article class="note-card"><div class="note-top"><div><div class="op-title">${esc(n.symbol||'Generale')}</div><div class="note-sub">${fmtDate(n.date)}</div></div><button class="watch-remove" data-delete-note="${esc(n.id)}">elimina</button></div><div class="radar-reason">${esc(n.text)}</div></article>`).join(''):'<div class="empty">Nessuna nota ancora. Puoi usarle per ricordare il motivo di una scelta o cosa vuoi controllare.</div>'}</div>

      <div class="section-title"><div><h2>Vendite registrate</h2><p>Incasso, costo ceduto e profitto reale separati</p></div></div>
      <div class="closed-list">${saleEvents.length?saleEvents.map(saleLedgerCard).join(''):'<div class="empty">Nessuna vendita registrata nella challenge attiva.</div>'}</div>

      <div class="section-title"><div><h2>Risultati realizzati</h2><p>Solo profitto/perdita cristallizzato nella challenge attiva</p></div></div>
      <div class="closed-list">${realizedEntries.length?realizedEntries.map(([sym,v])=>`<article class="closed-card"><div class="closed-top"><div><div class="closed-title">${esc(sym)}</div><div class="closed-sub">P/L realizzato cumulato</div></div><div class="${cls(v)}" style="font-size:18px;font-weight:900">${fmtEUR(v)}</div></div></article>`).join(''):'<div class="empty">Nessun profitto o perdita realizzato nella challenge attiva.</div>'}</div>

      <div class="settings-card"><h3>Backup e sicurezza dati</h3><p class="muted small">Prima di una nuova challenge viene creato anche un punto sicurezza locale. L’archivio challenge resta nel backup JSON.</p><div class="settings-actions"><button class="chip-btn" data-action="export">Esporta backup</button><button class="chip-btn" data-action="restore">Importa backup</button><button class="chip-btn" data-action="restore-safety">Ripristina ultimo punto</button></div></div>
      <div class="settings-card"><h3>Contabilità challenge</h3><div class="cash-details"><div class="cash-mini"><span>Capitale iniziale</span><b>${fmtEUR(challengeInitialCapital(s))}</b></div><div class="cash-mini"><span>Liquidità attuale</span><b>${fmtEUR(num(s.cash.base)+num(s.cash.test))}</b></div><div class="cash-mini"><span>Valore totale</span><b>${fmtEUR(s.total)}</b></div><div class="cash-mini"><span>Risultato reale</span><b class="${cls(s.result)}">${fmtEUR(s.result)}</b></div></div></div>
    `;
  }

  function saleLedgerCard(sale){
    const editable=(state.ops||[]).some(op=>op.id===sale.opId);
    return `<article class="closed-card sale-ledger"><div class="closed-top"><div><div class="closed-title">${esc(sale.symbol)} · ${fmtDate(sale.date)}</div><div class="closed-sub">Venduti ${fmtQty(sale.qtySold)} ${esc(sale.symbol)} · residuo ${fmtQty(sale.qtyAfter)}</div></div><div class="${cls(sale.realized)}" style="font-size:17px;font-weight:900">${fmtEUR(sale.realized)}</div></div><div class="sale-ledger-grid"><span>Lordo <b>${fmtEUR(sale.gross)}</b></span><span>Commissione <b>${fmtEUR(sale.fee)}</b></span><span>Netto <b>${fmtEUR(sale.net)}</b></span><span>Costo ceduto <b>${fmtEUR(sale.costRemoved)}</b></span></div>${editable?`<div class="op-actions"><button data-edit-op="${esc(sale.opId)}">Modifica vendita</button></div>`:''}</article>`;
  }


  function renderAll(){
    renderHome(); renderRadar(); renderOps(); renderSchool(); renderDiary();
    bindDynamic();
  }

  function bindDynamic(){
    $$('[data-open-asset]').forEach(el=>el.addEventListener('click',e=>{ if(e.target.closest('[data-remove-watch-id],[data-watch-candidate]')) return; openAsset(el.dataset.openAsset); }));
    $$('[data-action="new-op"]').forEach(b=>b.addEventListener('click',()=>openOpSheet()));
    $$('[data-action="add-watch"]').forEach(b=>b.addEventListener('click',openWatchSheet));
    $$('[data-remove-watch-id]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation(); checkpointState('Modifica watchlist'); state.watchlistIds=(state.watchlistIds||[]).filter(x=>x!==b.dataset.removeWatchId); if(state.decision?.watchConfirm) delete state.decision.watchConfirm[b.dataset.removeWatchId]; saveState(); renderAll(); toast('Rimosso dalla watchlist');}));
    $$('[data-watch-candidate]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation(); addWatchById(b.dataset.watchCandidate); }));
    $$('[data-action="scan-opportunities"]').forEach(b=>b.addEventListener('click',()=>scanOpportunities(true)));
    $$('[data-radar-tab]').forEach(b=>b.addEventListener('click',()=>{state.ui={...(state.ui||{}),radarTab:b.dataset.radarTab};saveState();renderAll();}));
    $$('[data-edit-op]').forEach(b=>b.addEventListener('click',()=>openOpSheet(state.ops.find(o=>o.id===b.dataset.editOp))));
    $$('[data-delete-op]').forEach(b=>b.addEventListener('click',()=>deleteOp(b.dataset.deleteOp)));
    $$('[data-action="manage-ops"]').forEach(b=>b.addEventListener('click',()=>showView('ops')));
    $$('[data-action="new-note"]').forEach(b=>b.addEventListener('click',openNoteSheet));
    $$('[data-delete-note]').forEach(b=>b.addEventListener('click',()=>{checkpointState('Prima di eliminare nota');state.notes=state.notes.filter(n=>n.id!==b.dataset.deleteNote);saveState();renderDiary();bindDynamic();toast('Nota eliminata');}));
    $$('[data-action="export"]').forEach(b=>b.addEventListener('click',exportBackup));
    $$('[data-action="restore"]').forEach(b=>b.addEventListener('click',()=>$('#restoreInput').click()));
    $$('[data-action="restore-safety"]').forEach(b=>b.addEventListener('click',restoreCheckpoint));
    $$('[data-action="new-challenge"]').forEach(b=>b.addEventListener('click',openChallengeSheet));
    $$('[data-action="reset"]').forEach(b=>b.addEventListener('click',resetState));
    $$('[data-assistant-tab]').forEach(b=>b.addEventListener('click',()=>{state.ui={...(state.ui||{}),assistantTab:b.dataset.assistantTab};saveState();renderAll();window.scrollTo({top:0,behavior:'smooth'});}));
    $$('[data-action="assistant-refresh"]').forEach(b=>b.addEventListener('click',async()=>{b.disabled=true;b.textContent='analizzo…';apiBackoffUntil=0;await refreshMarket(true);runAutoAnalysis('manuale',true);renderAll();toast('Auto-analisi aggiornata');}));
    $$('[data-training-tab]').forEach(b=>b.addEventListener('click',()=>{state.ui={...(state.ui||{}),trainingTab:b.dataset.trainingTab};saveState();renderAll();window.scrollTo({top:0,behavior:'smooth'});}));
    $$('.training-scenario').forEach(card=>{
      card.querySelectorAll('[data-training-choice]').forEach(btn=>btn.addEventListener('click',()=>{card.querySelectorAll('[data-training-choice]').forEach(x=>x.classList.toggle('selected',x===btn));card.dataset.selected=btn.dataset.trainingChoice;}));
      const reveal=card.querySelector('[data-training-reveal]');
      if(reveal) reveal.addEventListener('click',()=>{
        const selected=card.dataset.selected;
        if(!selected){toast('Scegli prima la tua lettura');return;}
        const expected=trainingExpected(card); if(!expected){toast('Scenario non più disponibile');return;}
        const feedback=card.querySelector('.training-feedback'); feedback.innerHTML=trainingFeedbackHTML(selected,expected); feedback.hidden=false;
        card.querySelector('.training-hidden-verdict')?.classList.add('revealed');
        if(!card.dataset.revealed){
          state.training=state.training||{seenLessons:{},attempts:[]}; state.training.attempts=Array.isArray(state.training.attempts)?state.training.attempts:[];
          state.training.attempts.push({time:Date.now(),mode:card.dataset.trainingMode,symbol:card.dataset.trainingSymbol,choice:selected,expected:expected.st.label}); state.training.attempts=state.training.attempts.slice(-80); saveState(); card.dataset.revealed='1';
        }
      });
    });
    $$('.training-lesson').forEach(d=>d.addEventListener('toggle',()=>{if(!d.open)return; state.training=state.training||{seenLessons:{},attempts:[]}; state.training.seenLessons=state.training.seenLessons||{}; state.training.seenLessons[d.dataset.trainingLesson]=true; saveState(); const mark=d.querySelector('summary span'); if(mark) mark.textContent='✓';}));
  }

  function showView(name){
    $$('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${name}`));
    $$('.nav-btn[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
    state.ui.lastView=name; saveState(); window.scrollTo({top:0,behavior:'smooth'});
    if(name==='radar') scanOpportunities(false);
    if(name==='school'){
      runAutoAnalysis('apertura',true);
      if(Date.now()-num(state.marketCache?.time)>45000) refreshMarket(true);
    }
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
    const m=market[a.id]||state.marketCache?.data?.[a.id]||{}; const owned=!!pos; const st=owned?positionDecision(pos,m):watchDecision(m);
    const pnl=owned?positionPnl(pos):0,pct=owned?positionPnlPct(pos):0;
    const key=owned?`${pos.account}:${pos.symbol}`:'';
    const realized=owned?(s.realizedByKey[key]||0):0;
    const costSold=owned?(s.soldCost[key]||0):0;
    const totalPnl=owned?realized+pnl:0;
    const totalBasis=owned?costSold+positionCost(pos):0;
    const totalPct=owned&&totalBasis?totalPnl/totalBasis*100:pct;
    const assetSales=owned?(s.sales||[]).filter(x=>x.account===pos.account&&x.symbol===pos.symbol):[];
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
      ${!owned?`<div class="sheet-section"><div class="eyebrow">GUIDA INGRESSO</div><div class="decision-panel ${st.tone}">
        <div class="decision-title"><span class="status-pill ${st.tone}">${esc(st.label)}</span><b>Supporto Radar</b></div>
        <p>${esc(st.reason)}</p>
        ${decisionChecksHTML(st.checks||[])}
        <small>Il semaforo serve a capire cosa approfondire, non è un ordine di acquisto.</small>
      </div></div>`:''}
      ${owned?`<div class="sheet-section"><div class="eyebrow">GUIDA POSIZIONE</div><div class="decision-panel ${st.tone}">
        <div class="decision-title"><span class="status-pill ${st.tone}">${esc(st.label)}</span><b>Supporto decisionale</b></div>
        <p>${esc(st.reason)}</p>
        <div class="decision-peak"><span>Massimo P/L della challenge</span><b>${fmtPct(st.peakPct)}</b><span>Ritracciamento dal massimo</span><b>−${st.pullback.toFixed(1)} pt</b></div>
        ${decisionChecksHTML(st.checks)}
        <small>È una lettura dei dati, non un ordine di vendita. La decisione finale resta tua.</small>
      </div></div><div class="sheet-section"><div class="eyebrow">LA TUA POSIZIONE</div><div class="detail-grid">
        <div class="detail-box"><span>Quantità residua</span><b>${fmtQty(pos.qty)} ${esc(pos.symbol)}</b></div>
        <div class="detail-box"><span>Prezzo medio</span><b>${fmtPrice(pos.avg)}</b></div>
        <div class="detail-box"><span>Costo residuo</span><b>${fmtEUR(positionCost(pos))}</b></div>
        <div class="detail-box"><span>Valore attuale</span><b>${fmtEUR(positionValue(pos))}</b></div>
        <div class="detail-box"><span>P/L latente residuo</span><b class="${cls(pnl)}">${fmtEUR(pnl)}</b></div>
        <div class="detail-box"><span>P/L latente %</span><b class="${cls(pct)}">${fmtPct(pct)}</b></div>
        ${assetSales.length?`<div class="detail-box"><span>P/L realizzato</span><b class="${cls(realized)}">${fmtEUR(realized)}</b></div><div class="detail-box"><span>Risultato totale asset</span><b class="${cls(totalPnl)}">${fmtEUR(totalPnl)} · ${fmtPct(totalPct)}</b></div>`:''}
      </div>${assetSales.length?`<div class="accounting-note"><b>Contabilità chiara:</b> il P/L realizzato riguarda la parte già venduta; il P/L latente riguarda solo ciò che possiedi ancora. Il totale asset è la loro somma, senza contare due volte l’incasso.</div>`:''}<div class="detail-note" style="margin-top:10px">${positionExplanation(pos,m)}</div><div class="position-actions"><button class="chip-btn" data-action="quick-buy">＋ Acquisto</button><button class="chip-btn" data-action="quick-sell">Vendi / simula</button><button class="sell-all-btn" data-action="sell-all">Vendi tutto</button></div></div>`:''}
      <div class="sheet-section"><div class="eyebrow">TREND</div><div class="range-row"><button class="range-btn" data-range="1d">24h</button><button class="range-btn active" data-range="7d">7g</button><button class="range-btn" data-range="30d">30g</button>${owned?'<button class="range-btn" data-range="since">Da acquisto</button>':''}</div><div id="detailChart" class="chart-wrap"><div class="chart-empty">Carico il trend…</div></div></div>
      <div class="sheet-section"><div class="detail-note">${radarReason(m,owned)} Gli indicatori descrivono il movimento del mercato: non eseguono ordini e non modificano Revolut.</div></div>
    `;
    $$('[data-close-sheet]').forEach(b=>b.addEventListener('click',closeSheets));
    $$('#assetSheet [data-range]').forEach(b=>b.addEventListener('click',()=>{currentRange=b.dataset.range; $$('#assetSheet [data-range]').forEach(x=>x.classList.toggle('active',x===b)); loadDetailChart(a,owned?pos:null,currentRange);}));
    const sellBtn=$('#assetSheet [data-action="sell-all"]'); if(sellBtn&&pos) sellBtn.addEventListener('click',()=>quickSellAll(pos));
    const quickSellBtn=$('#assetSheet [data-action="quick-sell"]'); if(quickSellBtn&&pos) quickSellBtn.addEventListener('click',()=>quickSell(pos));
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
      const m=market[a.id]||state.marketCache?.data?.[a.id]||{};
      const fallback=trendValuesFor(a.id,m,range);
      if(fallback.values.length>1) drawChart(box,fallback.values);
      else box.innerHTML='<div class="chart-empty">Trend in costruzione: i dati principali restano utilizzabili.</div>';
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
    updateOpFields(); $('#opHint').textContent=`Quantità completa precompilata. L’importo è una stima live: prima di salvare inserisci lordo, quantità eseguita e commissione esatti mostrati da Revolut.`;
  }
  function quickSell(pos){
    closeSheets(); openOpSheet(); $('#opType').value='SELL'; $('#opAccount').value=pos.account; populateAssetSelect($('#opAsset'),pos.symbol); $('#opQty').value=''; $('#opAmount').value=''; $('#opFee').value='0'; $('#opNote').value=`Vendita parziale ${pos.symbol}`; updateOpFields();
    $('#opHint').textContent=`Simulazione attiva: puoi scrivere prima l’importo lordo che pensi di vendere (es. 3,00 €). Se lasci vuota la quantità, la stima usa il prezzo live; dopo l’esecuzione inserisci la quantità reale prima di salvare.`;
  }
  function quickBuy(pos){
    closeSheets(); openOpSheet(); $('#opType').value='BUY'; $('#opAccount').value=pos.account; populateAssetSelect($('#opAsset'),pos.symbol); $('#opQty').value=''; $('#opAmount').value=''; $('#opFee').value='0'; $('#opNote').value=`Nuovo acquisto ${pos.symbol}`; updateOpFields();
  }

  function replayWithoutOp(editingId){
    if(!editingId) return replay();
    const originalOps=state.ops;
    state.ops=state.ops.filter(x=>x.id!==editingId);
    const snap=replay();
    state.ops=originalOps;
    return snap;
  }

  function updateSalePreview(){
    const box=$('#salePreview'); if(!box) return;
    const type=$('#opType').value;
    const editingId=$('#opId').value||null;

    if(type==='TRANSFER'){
      const pre=replayWithoutOp(editingId);
      const from=$('#opAccount').value;
      const to=$('#opToAccount').value;
      const amount=num($('#opAmount').value);
      const fromName=from==='base'?'Base':'Fondo Test';
      const toName=to==='base'?'Base':'Fondo Test';
      const fromCash=num(pre.cash[from]);
      const toCash=num(pre.cash[to]);
      box.hidden=false;
      if(amount<=0){
        box.innerHTML=`<div class="sale-preview-title">Anteprima trasferimento</div><div class="form-hint">Scegli il conto di partenza e inserisci l’importo. Il trasferimento sposta solo liquidità: non compra né vende crypto.</div>`;
        return;
      }
      const enough=amount<=fromCash+1e-8;
      box.innerHTML=`<div class="sale-preview-title">${esc(fromName)} → ${esc(toName)}</div>
        <div class="sale-preview-grid"><div><span>${esc(fromName)} prima</span><b>${fmtEUR(fromCash)}</b></div><div><span>${esc(fromName)} dopo</span><b class="${enough?'':'neg'}">${fmtEUR(fromCash-amount)}</b></div><div><span>${esc(toName)} prima</span><b>${fmtEUR(toCash)}</b></div><div><span>${esc(toName)} dopo</span><b>${fmtEUR(toCash+amount)}</b></div></div>
        <div class="sale-preview-note">${enough?`Dopo il salvataggio avrai ${fmtEUR(fromCash-amount)} in ${esc(fromName)} e ${fmtEUR(toCash+amount)} in ${esc(toName)}. Nessun capitale viene creato o perso: cambia solo il contenitore della liquidità.`:`Importo superiore alla liquidità disponibile in ${esc(fromName)}.`}</div>`;
      return;
    }

    if(type!=='SELL'){box.hidden=true;box.innerHTML='';return;}
    const symbol=$('#opAsset').value, account=$('#opAccount').value;
    if(!symbol||symbol==='__CUSTOM__'){box.hidden=true;box.innerHTML='';return;}
    const pre=replayWithoutOp(editingId);
    const p=pre.positions.find(x=>x.symbol===symbol&&x.account===account);
    if(!p){box.hidden=false;box.innerHTML='<div class="sale-preview-title">Simulatore vendita</div><div class="form-hint">Nessuna quantità disponibile su questo conto.</div>';return;}
    const gross=num($('#opAmount').value), fee=num($('#opFee').value), typedQty=num($('#opQty').value), price=currentPrice(p);
    const estimated=!typedQty&&gross>0&&price>0;
    const qty=typedQty>0?typedQty:(estimated?gross/price:0);
    if(gross<=0||qty<=0){
      box.hidden=false; box.innerHTML=`<div class="sale-preview-title">Simulatore prima di vendere</div><div class="form-hint">Inserisci almeno l’importo lordo che stai valutando. Con il prezzo live posso stimare la quantità; dopo la vendita inserisci la quantità esatta di Revolut.</div>`; return;
    }
    const sold=Math.min(qty,p.qty), net=Math.max(0,gross-fee), costRemoved=sold*p.avg, realized=net-costRemoved;
    const qtyAfter=Math.max(0,p.qty-sold), costAfter=qtyAfter*p.avg, valueAfter=qtyAfter*price, latentAfter=valueAfter-costAfter;
    const key=`${account}:${symbol}`; const previousRealized=pre.realizedByKey?.[key]||0; const totalAsset=previousRealized+realized+latentAfter;
    box.hidden=false;
    box.innerHTML=`<div class="sale-preview-title">${estimated?'Stima prima di vendere':'Anteprima con quantità inserita'} · ${esc(symbol)}</div>
      <div class="sale-preview-grid"><div><span>Lordo</span><b>${fmtEUR(gross)}</b></div><div><span>Commissione</span><b>${fmtEUR(fee)}</b></div><div><span>Netto</span><b>${fmtEUR(net)}</b></div><div><span>Costo ceduto</span><b>${fmtEUR(costRemoved)}</b></div><div><span>P/L realizzato stimato</span><b class="${cls(realized)}">${fmtEUR(realized)}</b></div><div><span>Quantità residua</span><b>${fmtQty(qtyAfter)} ${esc(symbol)}</b></div><div><span>Costo residuo</span><b>${fmtEUR(costAfter)}</b></div><div><span>Risultato asset stimato</span><b class="${cls(totalAsset)}">${fmtEUR(totalAsset)}</b></div></div>
      <div class="sale-preview-note">${estimated?`Quantità stimata al prezzo live ${fmtPrice(price)}: ${fmtQty(sold)} ${esc(symbol)}. Non salvarla come vendita reale finché non hai la quantità eseguita da Revolut.`:`Incasso netto = lordo − commissione. Il profitto realizzato è solo netto − costo di carico delle unità vendute.`}</div>`;
  }

  function updateOpFields(){
    const type=$('#opType').value, assetMode=['BUY','SELL'].includes(type), transfer=type==='TRANSFER';
    $('#assetFields').hidden=!assetMode; $('#feeLabel').hidden=!assetMode; $('#toAccountLabel').hidden=!transfer;
    $('#customAssetFields').hidden=!assetMode || $('#opAsset').value!=='__CUSTOM__';
    $('#amountLabel').firstChild.textContent=type==='SELL'?'Importo vendita lordo (€) ':type==='BUY'?'Importo acquisto (€) ':transfer?'Importo da trasferire (€) ':'Importo (€) ';
    $('#opQty').required=assetMode; $('#opAsset').required=assetMode;
    if($('#accountLabelText')) $('#accountLabelText').textContent=transfer?'Da':'Conto';
    const snap=portfolioSnapshot(); const acct=$('#opAccount').value; const cash=snap.cash[acct];
    if(transfer){
      const to=acct==='base'?'test':'base';
      $('#opToAccount').value=to;
      $('#opToAccount').disabled=true;
      const opt=$('#opToAccount').selectedOptions?.[0];
      if(opt) opt.textContent=to==='base'?'Portafoglio Base':'Fondo Test';
    }else{
      $('#opToAccount').disabled=false;
    }
    $('#opHint').textContent=type==='SELL'?`Inserisci il lordo della vendita e la commissione separatamente: l’app calcola il netto, il costo di carico ceduto e il profitto realmente realizzato.`:type==='BUY'?`Liquidità ${acct==='base'?'Base':'Test'} disponibile: ${fmtEUR(cash)}. Se Revolut mostra la commissione in crypto, inserisci la quantità NETTA ricevuta e lascia Commissione (€) a 0.`:transfer?`Scegli solo il conto di partenza e l’importo. La destinazione è automatica: ${acct==='base'?'Fondo Test':'Portafoglio Base'}. Nessuna crypto viene selezionata o spostata.`:'Questa operazione aggiorna la contabilità del capitale senza modificare direttamente le posizioni.';
    updateSalePreview();
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
    if(op.type==='TRANSFER'){
      const to=op.toAccount;
      if(!['base','test'].includes(to) || to===account) return 'Il trasferimento deve avvenire tra Base e Fondo Test.';
      if(snap.cash[account]+1e-8<amount) return `Liquidità ${account==='base'?'Base':'Test'} insufficiente per il trasferimento.`;
    }
    return '';
  }

  function saveOperation(e){
    e.preventDefault();
    const type=$('#opType').value;
    const assetMode=['BUY','SELL'].includes(type);
    let symbol='', name='', assetId='';
    if(assetMode){
      symbol=$('#opAsset').value;
      if(symbol==='__CUSTOM__'){
        symbol=$('#customSymbol').value.trim().toUpperCase(); name=$('#customName').value.trim(); assetId=$('#customId').value.trim();
        if(!symbol||!name||!assetId){toast('Completa sigla, nome e CoinGecko ID');return;}
        if(!state.customAssets.some(a=>a.symbol===symbol)) state.customAssets.push({symbol,name,id:assetId});
      }else{
        const a=assetBySymbol(symbol); name=a?.name||symbol; assetId=a?.id||symbol.toLowerCase();
      }
    }
    const id=$('#opId').value||uid();
    const account=$('#opAccount').value;
    const toAccount=type==='TRANSFER'?(account==='base'?'test':'base'):$('#opToAccount').value;
    const op={id,type,account,toAccount,symbol,name,assetId,qty:assetMode?num($('#opQty').value):0,amount:num($('#opAmount').value),fee:assetMode?num($('#opFee').value):0,date:$('#opDate').value,note:$('#opNote').value.trim()};
    const err=validateOp(op,$('#opId').value||null); if(err){toast(err);return;}
    checkpointState($('#opId').value?'Prima di modificare operazione':'Prima di nuova operazione');
    const idx=state.ops.findIndex(o=>o.id===id); if(idx>=0) state.ops[idx]=op; else state.ops.push(op);
    saveState(); closeSheets(); renderAll();
    if(op.type==='SELL'){
      const snap=portfolioSnapshot();
      const sale=(snap.sales||[]).find(x=>x.opId===id);
      if(sale) openSaleSummary(sale,snap);
    }
    refreshMarket(true);
    if(op.type==='TRANSFER'){
      const from=op.account==='base'?'Base':'Fondo Test';
      const to=op.toAccount==='base'?'Base':'Fondo Test';
      toast(`${fmtEUR(op.amount)} trasferiti: ${from} → ${to}`);
    }else{
      toast(idx>=0?'Operazione aggiornata':'Operazione salvata');
    }
  }

  function openSaleSummary(sale,snap=portfolioSnapshot()){
    const body=$('#saleSummaryBody'), sheet=$('#saleSummarySheet'); if(!body||!sheet) return;
    const pos=snap.positions.find(p=>p.symbol===sale.symbol&&p.account===sale.account);
    const key=`${sale.account}:${sale.symbol}`;
    const realizedTotal=snap.realizedByKey?.[key]||sale.realized;
    const latent=pos?positionPnl(pos):0;
    const total=realizedTotal+latent;
    body.innerHTML=`<div class="sale-summary-lead">Hai venduto <b>${fmtQty(sale.qtySold)} ${esc(sale.symbol)}</b> per <b>${fmtEUR(sale.gross)}</b> lordi. Dopo ${fmtEUR(sale.fee)} di commissione hai incassato <b>${fmtEUR(sale.net)}</b>.<br><br>Di questo incasso, <b>${fmtEUR(sale.costRemoved)}</b> corrispondono alla quota di costo/capitale delle unità cedute e <b class="${cls(sale.realized)}">${fmtEUR(sale.realized)}</b> è il P/L realmente realizzato.</div>
      <div class="detail-grid" style="margin-top:14px"><div class="detail-box"><span>Incasso lordo</span><b>${fmtEUR(sale.gross)}</b></div><div class="detail-box"><span>Commissione</span><b>${fmtEUR(sale.fee)}</b></div><div class="detail-box"><span>Incasso netto</span><b>${fmtEUR(sale.net)}</b></div><div class="detail-box"><span>Costo di carico ceduto</span><b>${fmtEUR(sale.costRemoved)}</b></div><div class="detail-box"><span>P/L realizzato vendita</span><b class="${cls(sale.realized)}">${fmtEUR(sale.realized)}</b></div><div class="detail-box"><span>Quantità residua</span><b>${fmtQty(sale.qtyAfter)} ${esc(sale.symbol)}</b></div><div class="detail-box"><span>Costo residuo</span><b>${fmtEUR(sale.costAfter)}</b></div><div class="detail-box"><span>P/L latente residuo</span><b class="${cls(latent)}">${fmtEUR(latent)}</b></div></div>
      <div class="sale-total-box"><span>Risultato complessivo ${esc(sale.symbol)}</span><b class="${cls(total)}">${fmtEUR(total)}</b><small>P/L realizzato cumulato ${fmtEUR(realizedTotal)} + P/L latente residuo ${fmtEUR(latent)}. L’incasso netto non viene sommato di nuovo.</small></div>`;
    openBackdrop(sheet);
    $$('[data-close-sheet]').forEach(b=>b.addEventListener('click',closeSheets));
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
    state.decision=state.decision||{peaks:{},samples:{},watchConfirm:{}}; state.decision.watchConfirm=state.decision.watchConfirm||{};
    if(!state.decision.watchConfirm[a.id]) state.decision.watchConfirm[a.id]={streak:0,lastBase:null,lastTime:0,addedAt:Date.now()};
    state.ui={...(state.ui||{}),radarTab:'watchlist'};
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
    const term=q.trim().toLowerCase();
    const local=allAssets().filter(a=>`${a.symbol} ${a.name} ${a.id}`.toLowerCase().includes(term));
    renderWatchChoices(local);
    if(term.length<2){ $('#watchSearchStatus').textContent='Scrivi almeno 2 caratteri oppure scegli un suggerimento.'; return; }
    $('#watchSearchStatus').textContent='Cerco sul mercato…';
    try{
      const rows=await getPaprikaUniverse(false);
      const remote=rows.filter(x=>`${x.symbol} ${x.name}`.toLowerCase().includes(term)).sort((a,b)=>num(a.market_cap_rank||999999)-num(b.market_cap_rank||999999)).slice(0,14);
      const byId=new Map([...local,...remote].map(a=>[a.id,a]));
      renderWatchChoices([...byId.values()]); $('#watchSearchStatus').textContent=`${byId.size} risultati · scegli la crypto corretta per nome.`;
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

  function openChallengeSheet(){
    const sh=$('#challengeSheet');
    $('#challengeName').value=state.challenge?.active?'Nuova challenge':'Challenge 150';
    $('#challengeCapital').value=state.challenge?.active?String(num(state.challenge.initialCapital)||150):'150';
    $('#challengeDate').value=NOW_ISO_LOCAL();
    openBackdrop(sh);
  }

  function saveChallenge(e){
    e.preventDefault();
    const name=$('#challengeName').value.trim()||'Nuova challenge';
    const capital=num($('#challengeCapital').value);
    const startedAt=$('#challengeDate').value||NOW_ISO_LOCAL();
    if(capital<=0){toast('Inserisci un capitale iniziale valido');return;}
    if(!confirm(`Archiviare la situazione attuale e avviare “${name}” con ${fmtEUR(capital)}?`)) return;
    checkpointState('Prima di nuova challenge');
    const snap=portfolioSnapshot();
    const oldName=state.challenge?.active?state.challenge.name:'Challenge precedente';
    const oldStarted=state.challenge?.active?state.challenge.startedAt:BASELINE.snapshotAt;
    const archive={
      id:`archive-${Date.now()}`,name:oldName,startedAt:oldStarted,closedAt:startedAt,
      capitalEntered:num(snap.ownDeposits)+num(snap.rewardDeposits),totalAtClose:num(snap.total),resultAtClose:num(snap.result),
      positions:snap.positions.map(p=>({symbol:p.symbol,name:p.name,account:p.account,qty:p.qty,avg:p.avg,value:positionValue(p),totalPnl:snap.totalPnlFor(p),totalPct:snap.totalPctFor(p)})),
      realized:{...snap.realized},opsCount:(state.ops||[]).length,ops:(state.ops||[]).map(o=>({...o})),notes:(state.notes||[]).map(n=>({...n}))
    };
    state.challengeArchives=[...(state.challengeArchives||[]),archive].slice(-20);
    state.challenge={id:`challenge-${Date.now()}`,name,startedAt,initialCapital:capital,active:true,baseline:{ownDeposits:capital,rewardDeposits:0,withdrawals:0,cash:{base:capital,test:0},positions:[]}};
    state.ops=[];
    state.notes=[];
    state.decision={peaks:{},samples:{}};
    state.ui={...(state.ui||{}),lastView:'home'};
    saveState();
    closeSheets();
    renderAll();
    showView('home');
    recordDecisionTracking();
    toast(`${name} avviata: ${fmtEUR(capital)} disponibili`);
  }

  function exportBackup(){
    const payload={app:'Crypto Conte',version:VERSION,exportedAt:new Date().toISOString(),state};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a');a.href=url;a.download=`crypto-conte-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async function restoreBackup(file){
    try{ const data=JSON.parse(await file.text()); if(!data?.state?.ops||!Array.isArray(data.state.ops)) throw new Error('Formato non valido'); checkpointState('Prima di importare backup'); state={...defaultState(),...data.state,opportunity:{...defaultState().opportunity,...(data.state.opportunity||{})}}; saveState(); market={...BASELINE.seedMarket,...(state.marketCache?.data||{})}; renderAll();refreshMarket(true);toast('Backup importato'); }catch(_){toast('Backup non valido');}
  }
  function resetState(){
    if(!confirm('Ripristinare la vecchia configurazione iniziale? Usa invece Nuova challenge se vuoi ripartire senza perdere lo storico.')) return;
    checkpointState('Prima del ripristino RC4'); state=defaultState(); saveState();market={...BASELINE.seedMarket};renderAll();refreshMarket(true);toast('Configurazione iniziale ripristinata');
  }

  function wantedIds(){
    const snap=portfolioSnapshot();
    const primary=['bitcoin','ethereum',...snap.positions.map(p=>p.id),...(state.watchlistIds||[]),...(state.opportunity?.candidates||[]).map(c=>c.id)];
    const recentSignals=(state.opportunity?.signals||[]).filter(sig=>Date.now()-num(sig.time)<50*3600000).sort((a,b)=>num(b.time)-num(a.time)).slice(0,20).map(sig=>sig.id);
    return [...new Set([...primary,...recentSignals].filter(Boolean))].slice(0,80);
  }
  async function scanOpportunities(force=false){
    if(opportunityScanInFlight) return false;
    const opp=state.opportunity||defaultState().opportunity;
    if(!force&&Date.now()-num(opp.time)<OPPORTUNITY_TTL){ (opp.candidates||[]).forEach(c=>market[c.id]={...market[c.id],...c}); return true; }
    opportunityScanInFlight=true;
    const btn=$('[data-action="scan-opportunities"]'); if(btn){btn.disabled=true;btn.textContent='scansione…';}
    try{
      // RC4.3.4: Radar CoinPaprika con mapping asset sicuro contro ticker omonimi.
      // Una sola lista mercato alimenta prezzi, volume, momentum e forza vs BTC.
      const rows=await getPaprikaUniverse(force);
      const btc=rows.find(x=>String(x.symbol).toLowerCase()==='btc')||market.bitcoin||{};
      const prev=opp.prev||{};
      const snap=portfolioSnapshot();
      const ownedSymbols=new Set(snap.positions.map(p=>String(p.symbol).toUpperCase()));
      const watchedIds=new Set(state.watchlistIds||[]);
      updateWatchConfirmation(rows,btc);
      const eligible=rows.filter(x=>String(x.symbol).toUpperCase()!=='BTC'&&!ownedSymbols.has(String(x.symbol).toUpperCase())&&!watchedIds.has(x.id)&&!STABLE_SYMBOLS.has(String(x.symbol||'').toUpperCase())&&num(x.current_price)>0&&num(x.total_volume)>=2_000_000&&(num(x.market_cap)>=20_000_000||num(x.total_volume)>=8_000_000));
      const noTrending=new Set();
      const screened=eligible.map(x=>screenOpportunity(x,btc,prev[x.id],noTrending)).sort((a,b)=>b._screenScore-a._screenScore||num(b.total_volume)-num(a.total_volume)).slice(0,42);
      const assessed=screened.map(x=>analyzeOpportunity(x,btc,prev[x.id],noTrending)).filter(Boolean);
      assessed.sort((a,b)=>{const rank={'POSSIBILE INGRESSO':4,PREPARATI:3,INTERESSANTE:3,OSSERVA:2,'NON INSEGUIRE':1};return ((rank[b.status]||0)-(rank[a.status]||0))||(b.score-a.score)||(num(b.total_volume)-num(a.total_volume));});
      const candidates=assessed.slice(0,3);
      const now=Date.now(),nextPrev={};
      rows.slice(0,2000).forEach(x=>nextPrev[x.id]={time:now,volume:num(x.total_volume),price:num(x.current_price)});
      updateSignalOutcomes(rows);
      state.opportunity={...opp,time:now,candidates,prev:nextPrev,trending:[],trendingAt:now,signals:state.opportunity.signals||[]};
      recordOpportunitySignals(candidates);
      candidates.forEach(c=>market[c.id]={...market[c.id],...c});
      recordDecisionTracking(); runAutoAnalysis('radar',false); saveState(); renderAll();
      toast(candidates.length?`Radar aggiornato: ${candidates.length} opportunità`:'Radar: nessun segnale pulito al momento');
      return true;
    }catch(err){
      toast('Radar non disponibile: mantengo gli ultimi dati e riprovo');
      if(isMarketStale()) setDataStatus('error');
      renderAll(); return false;
    } finally {
      opportunityScanInFlight=false;
      const b=$('[data-action="scan-opportunities"]'); if(b){b.disabled=false;b.textContent='◎ Scansiona';}
    }
  }

  async function refreshMarket(force=false){
    if(marketRefreshInFlight) return false;
    const status=$('#dataStatus');
    if(!force && Date.now()-num(state.marketCache?.time)<MARKET_TTL){
      market={...BASELINE.seedMarket,...(state.marketCache.data||{})};
      (state.opportunity?.candidates||[]).forEach(c=>market[c.id]={...market[c.id],...c});
      setDataStatus('cache'); runAutoAnalysis('cache',true); renderAll(); return true;
    }
    marketRefreshInFlight=true;
    status.className='data-status'; status.innerHTML='<span class="dot"></span><span>aggiorno prezzi e trend…</span>';
    try{
      // Prima prova CoinPaprika: keyless e adatta a una PWA statica.
      const rows=await getPaprikaUniverse(force);
      const wanted=new Set(wantedIds());
      const wantedSymbols=new Set();
      portfolioSnapshot().positions.forEach(p=>wantedSymbols.add(String(p.symbol).toUpperCase()));
      watchAssets().forEach(a=>wantedSymbols.add(String(a.symbol).toUpperCase()));
      (state.opportunity?.candidates||[]).forEach(a=>wantedSymbols.add(String(a.symbol).toUpperCase()));
      wantedSymbols.add('BTC'); wantedSymbols.add('ETH');
      const data={...market};
      let matched=0;
      rows.forEach(x=>{
        if(wanted.has(x.id)||wantedSymbols.has(String(x.symbol).toUpperCase())){
          const a=assetForPaprikaTicker(x);
          const targetId=a?.id||x.id;
          data[targetId]={...data[targetId],...x,id:targetId};
          matched++;
        }
      });
      if(!matched) throw new Error('Nessun asset aggiornato');
      market=data;
      updateSignalOutcomes(rows);
      state.marketCache={time:Date.now(),data};
      marketSource='CoinPaprika';
      recordDecisionTracking(); runAutoAnalysis('live',false); saveState(); setDataStatus('live'); renderAll(); return true;
    }catch(paprikaErr){
      // Seconda fonte: CoinGecko. Se il browser la blocca, l'app resta comunque sulla cache.
      try{
        const ids=wantedIds().filter(id=>!String(id).startsWith('paprika:'));
        const url=`https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${encodeURIComponent(ids.join(','))}&order=market_cap_desc&sparkline=true&price_change_percentage=1h,24h,7d,30d&locale=it&precision=full`;
        const res=await cgFetch(url); const arr=await res.json();
        const data={...market}; arr.forEach(x=>data[x.id]=x);
        market=data; updateSignalOutcomes(arr); state.marketCache={time:Date.now(),data}; marketSource='CoinGecko'; recordDecisionTracking(); runAutoAnalysis('live',false); saveState(); setDataStatus('live'); renderAll(); return true;
      }catch(_){
        market={...BASELINE.seedMarket,...(state.marketCache?.data||{})};
        (state.opportunity?.candidates||[]).forEach(c=>market[c.id]={...market[c.id],...c});
        marketSource='cache'; setDataStatus('error'); renderAll(); return false;
      }
    } finally { marketRefreshInFlight=false; }
  }

  function setDataStatus(mode){
    const el=$('#dataStatus'); if(!el)return;
    const t=state.marketCache?.time?new Intl.DateTimeFormat('it-IT',{hour:'2-digit',minute:'2-digit'}).format(new Date(state.marketCache.time)):'baseline';
    if(mode==='live') el.className='data-status live',el.innerHTML=`<span class="dot"></span><span>live · ${marketSource} · auto 5m · aggiornato ${t}</span>`;
    else if(mode==='backoff') el.className='data-status error',el.innerHTML=`<span class="dot"></span><span>API in pausa · cache ${t} · riprovo ~${backoffMinutes()} min</span>`;
    else if(mode==='error') el.className='data-status error',el.innerHTML=`<span class="dot"></span><span>dati non aggiornati · ultimo live ${t}</span>`;
    else el.className='data-status',el.innerHTML=`<span class="dot"></span><span>cache · auto 5m · ${t}</span>`;
  }

  function toast(msg){
    const t=$('#toast'); t.textContent=msg;t.hidden=false;clearTimeout(renderTimer);renderTimer=setTimeout(()=>t.hidden=true,3000);
  }

  function init(){
    recordDecisionTracking();
    runAutoAnalysis('avvio',false);
    renderAll(); showView(state.ui.lastView||'home');
    $$('.nav-btn[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
    $('.nav-main').addEventListener('click',()=>openOpSheet());
    $('#refreshBtn').addEventListener('click',async()=>{apiBackoffUntil=0;const ok=await refreshMarket(true);if(ok)setTimeout(()=>scanOpportunities(false),8000);});
    $('#sheetBackdrop').addEventListener('click',closeSheets); $$('[data-close-sheet]').forEach(b=>b.addEventListener('click',closeSheets));
    $('#opType').addEventListener('change',updateOpFields); $('#opAccount').addEventListener('change',updateOpFields); $('#opAsset').addEventListener('change',updateOpFields); $('#opQty').addEventListener('input',updateSalePreview); $('#opAmount').addEventListener('input',updateSalePreview); $('#opFee').addEventListener('input',updateSalePreview); $('#opForm').addEventListener('submit',saveOperation); $('#noteForm').addEventListener('submit',saveNote); $('#challengeForm').addEventListener('submit',saveChallenge);
    $('#watchSearch').addEventListener('input',e=>{clearTimeout(watchSearchTimer);const q=e.target.value;watchSearchTimer=setTimeout(()=>searchWatch(q),350);});
    $('#restoreInput').addEventListener('change',e=>{const f=e.target.files?.[0];if(f)restoreBackup(f);e.target.value='';});
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){if(Date.now()-num(state.marketCache?.time)>45000)refreshMarket(true);setTimeout(()=>scanOpportunities(false),9000);}});
    window.addEventListener('online',()=>{apiBackoffUntil=0;refreshMarket(true);setTimeout(()=>scanOpportunities(false),9000);});
    setInterval(()=>{if(document.visibilityState==='visible')refreshMarket(true);},AUTO_REFRESH_MS);
    setTimeout(()=>{ if(document.visibilityState==='visible')scanOpportunities(false); setInterval(()=>{if(document.visibilityState==='visible')scanOpportunities(false);},OPPORTUNITY_TTL); },12000);
    if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
    refreshMarket(false);
  }

  document.addEventListener('DOMContentLoaded',init);
})();
