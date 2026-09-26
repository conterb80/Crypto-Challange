(() => {
  'use strict';

  const VERSION = '2.1.0';
  const STORAGE_KEY = 'cryptoConte.v2.state';
  const MARKET_TTL = 90 * 1000;
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
    {symbol:'TON',name:'Toncoin',id:'the-open-network'}
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
    ops: [],
    notes: [],
    customAssets: [],
    marketCache: {time:0,data:{...BASELINE.seedMarket}},
    ui: {lastView:'home'}
  });

  let state = loadState();
  let market = {...BASELINE.seedMarket, ...(state.marketCache?.data || {})};
  let currentSheetAsset = null;
  let currentRange = '7d';
  let renderTimer = null;

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
      const s = JSON.parse(raw);
      return {...defaultState(),...s,ui:{...defaultState().ui,...(s.ui||{})},marketCache:s.marketCache||defaultState().marketCache};
    }catch(_){ return defaultState(); }
  }
  function saveState(){ state.version = VERSION; localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

  function allAssets(){
    const map = new Map();
    [...CATALOG,...BASELINE.positions,...(state.customAssets||[])].forEach(a=>map.set(a.symbol.toUpperCase(),{...a,symbol:a.symbol.toUpperCase()}));
    return [...map.values()];
  }
  function assetBySymbol(symbol){ return allAssets().find(a=>a.symbol===String(symbol).toUpperCase()) || null; }

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

  function portfolioSnapshot(){
    const r=replay();
    const basePos=r.positions.filter(p=>p.account==='base');
    const testPos=r.positions.filter(p=>p.account==='test');
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

      <div class="section-title"><div><h2>Portafoglio Base</h2><p>${fmtEUR(s.baseValue)} · ${s.basePos.length} posizioni${s.cash.base?` · liquidità ${fmtEUR(s.cash.base)}`:''}</p></div></div>
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
    const base=[assetBySymbol('BTC'),assetBySymbol('ETH'),...s.positions.map(p=>assetBySymbol(p.symbol)||p),...(state.watchlist||[]).map(assetBySymbol)].filter(Boolean);
    const map=new Map(); base.forEach(a=>map.set(a.symbol,a));
    const items=[...map.values()];
    $('#view-radar').innerHTML=`
      <div class="section-title"><div><h2>Radar Mercato</h2><p>BTC/ETH, tue posizioni e fino a 3 crypto in watchlist</p></div><div class="right"><button class="chip-btn" data-action="add-watch">＋ Watchlist</button></div></div>
      <div class="radar-list">${items.map(a=>{
        const m=market[a.id]||state.marketCache?.data?.[a.id]||{}; const st=radarStatus(m); const owned=ownedSymbols.has(a.symbol); const watched=(state.watchlist||[]).includes(a.symbol);
        return `<article class="radar-card" data-open-asset="${esc(a.symbol)}">
          <div class="radar-top"><div><div class="radar-title">${esc(a.symbol)} · ${esc(a.name)}</div><div class="radar-sub">${owned?'POSIZIONE':a.symbol==='BTC'||a.symbol==='ETH'?'MERCATO GUIDA':'WATCHLIST'}</div></div><div><span class="status-pill ${st.tone}">${st.label}</span>${watched?`<button class="watch-remove" data-remove-watch="${esc(a.symbol)}">rimuovi</button>`:''}</div></div>
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
    ['Radar, non ordini','Gli stati del Radar descrivono forza e direzione dei movimenti. Non sono ordini automatici di acquisto o vendita: servono per capire dove guardare.']
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

      <div class="settings-card"><h3>Backup e sicurezza dati</h3><p class="muted small">I dati manuali restano sul dispositivo. Esporta un backup JSON prima di prove importanti o cambi telefono.</p><div class="settings-actions"><button class="chip-btn" data-action="export">Esporta backup</button><button class="chip-btn" data-action="restore">Importa backup</button><button class="danger-btn" data-action="reset">Ripristina RC1</button></div></div>
      <div class="settings-card"><h3>Contabilità</h3><div class="cash-details"><div class="cash-mini"><span>Capitale personale</span><b>${fmtEUR(s.ownDeposits)}</b></div><div class="cash-mini"><span>Reward accumulati</span><b>${fmtEUR(s.rewardDeposits)}</b></div><div class="cash-mini"><span>Prelievi registrati</span><b>${fmtEUR(s.withdrawals)}</b></div><div class="cash-mini"><span>Risultato reale</span><b class="${cls(s.result)}">${fmtEUR(s.result)}</b></div></div></div>
    `;
  }

  function renderAll(){
    renderHome(); renderRadar(); renderOps(); renderSchool(); renderDiary();
    bindDynamic();
  }

  function bindDynamic(){
    $$('[data-open-asset]').forEach(el=>el.addEventListener('click',e=>{ if(e.target.closest('[data-remove-watch]')) return; openAsset(el.dataset.openAsset); }));
    $$('[data-action="new-op"]').forEach(b=>b.addEventListener('click',()=>openOpSheet()));
    $$('[data-action="add-watch"]').forEach(b=>b.addEventListener('click',openWatchSheet));
    $$('[data-remove-watch]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation(); state.watchlist=state.watchlist.filter(x=>x!==b.dataset.removeWatch); saveState(); renderAll(); toast('Rimosso dal Radar');}));
    $$('[data-edit-op]').forEach(b=>b.addEventListener('click',()=>openOpSheet(state.ops.find(o=>o.id===b.dataset.editOp))));
    $$('[data-delete-op]').forEach(b=>b.addEventListener('click',()=>deleteOp(b.dataset.deleteOp)));
    $$('[data-action="new-note"]').forEach(b=>b.addEventListener('click',openNoteSheet));
    $$('[data-delete-note]').forEach(b=>b.addEventListener('click',()=>{state.notes=state.notes.filter(n=>n.id!==b.dataset.deleteNote);saveState();renderDiary();bindDynamic();toast('Nota eliminata');}));
    $$('[data-action="export"]').forEach(b=>b.addEventListener('click',exportBackup));
    $$('[data-action="restore"]').forEach(b=>b.addEventListener('click',()=>$('#restoreInput').click()));
    $$('[data-action="reset"]').forEach(b=>b.addEventListener('click',resetState));
  }

  function showView(name){
    $$('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${name}`));
    $$('.nav-btn[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
    state.ui.lastView=name; saveState(); window.scrollTo({top:0,behavior:'smooth'});
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
    const meta=assetBySymbol(symbol)||pos;
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
      </div><div class="detail-note" style="margin-top:10px">${positionExplanation(pos,m)}</div></div>`:''}
      <div class="sheet-section"><div class="eyebrow">TREND</div><div class="range-row"><button class="range-btn" data-range="1d">24h</button><button class="range-btn active" data-range="7d">7g</button><button class="range-btn" data-range="30d">30g</button>${owned?'<button class="range-btn" data-range="since">Da acquisto</button>':''}</div><div id="detailChart" class="chart-wrap"><div class="chart-empty">Carico il trend…</div></div></div>
      <div class="sheet-section"><div class="detail-note">${radarReason(m,owned)} Gli indicatori descrivono il movimento del mercato: non eseguono ordini e non modificano Revolut.</div></div>
    `;
    $$('[data-close-sheet]').forEach(b=>b.addEventListener('click',closeSheets));
    $$('#assetSheet [data-range]').forEach(b=>b.addEventListener('click',()=>{currentRange=b.dataset.range; $$('#assetSheet [data-range]').forEach(x=>x.classList.toggle('active',x===b)); loadDetailChart(a,owned?pos:null,currentRange);}));
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
    const idx=state.ops.findIndex(o=>o.id===id); if(idx>=0) state.ops[idx]=op; else state.ops.push(op);
    saveState(); closeSheets(); renderAll(); refreshMarket(true); toast(idx>=0?'Operazione aggiornata':'Operazione salvata');
  }

  function deleteOp(id){
    if(!confirm('Eliminare questa operazione? I saldi e le posizioni verranno ricalcolati.')) return;
    state.ops=state.ops.filter(o=>o.id!==id); saveState(); renderAll(); toast('Operazione eliminata');
  }

  function openWatchSheet(){
    if((state.watchlist||[]).length>=3){toast('Watchlist piena: massimo 3 crypto non possedute');return;}
    const snap=portfolioSnapshot(),owned=new Set(snap.positions.map(p=>p.symbol));
    const choices=allAssets().filter(a=>!owned.has(a.symbol)&&!['BTC','ETH'].includes(a.symbol)&&!state.watchlist.includes(a.symbol));
    $('#watchChoices').innerHTML=choices.map(a=>`<div class="choice"><div><b>${esc(a.symbol)} · ${esc(a.name)}</b><small>${esc(a.id)}</small></div><button data-pick-watch="${esc(a.symbol)}">Aggiungi</button></div>`).join('')||'<div class="empty">Nessuna crypto disponibile.</div>';
    openBackdrop($('#watchSheet'));
    $$('[data-pick-watch]').forEach(b=>b.addEventListener('click',()=>{ if(state.watchlist.length>=3)return; state.watchlist.push(b.dataset.pickWatch);saveState();closeSheets();renderAll();refreshMarket(true);toast(`${b.dataset.pickWatch} aggiunta al Radar`);}));
  }

  function openNoteSheet(){
    populateAssetSelect($('#noteAsset'),'ETH'); const custom=$('#noteAsset option[value="__CUSTOM__"]'); if(custom) custom.remove();
    $('#noteAsset').insertAdjacentHTML('afterbegin','<option value="">Generale</option>'); $('#noteDate').value=NOW_ISO_LOCAL(); $('#noteText').value=''; openBackdrop($('#noteSheet'));
  }
  function saveNote(e){
    e.preventDefault(); const text=$('#noteText').value.trim(); if(!text)return;
    state.notes.push({id:`note-${Date.now()}`,symbol:$('#noteAsset').value,date:$('#noteDate').value,text}); saveState();closeSheets();renderDiary();bindDynamic();toast('Nota salvata');
  }

  function exportBackup(){
    const payload={app:'Crypto Conte',version:VERSION,exportedAt:new Date().toISOString(),state};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a');a.href=url;a.download=`crypto-conte-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async function restoreBackup(file){
    try{ const data=JSON.parse(await file.text()); if(!data?.state?.ops||!Array.isArray(data.state.ops)) throw new Error('Formato non valido'); state={...defaultState(),...data.state}; saveState(); market={...BASELINE.seedMarket,...(state.marketCache?.data||{})}; renderAll();refreshMarket(true);toast('Backup importato'); }catch(_){toast('Backup non valido');}
  }
  function resetState(){
    if(!confirm('Ripristinare i dati iniziali RC1? Le operazioni e note manuali verranno eliminate.')) return;
    state=defaultState(); saveState();market={...BASELINE.seedMarket};renderAll();refreshMarket(true);toast('RC1 ripristinata');
  }

  function wantedIds(){
    const snap=portfolioSnapshot(); const syms=new Set(['BTC','ETH',...snap.positions.map(p=>p.symbol),...(state.watchlist||[])]);
    const ids=[...syms].map(s=>assetBySymbol(s)?.id).filter(Boolean); return [...new Set(ids)];
  }
  async function refreshMarket(force=false){
    const status=$('#dataStatus');
    if(!force && Date.now()-num(state.marketCache?.time)<MARKET_TTL){ market={...BASELINE.seedMarket,...(state.marketCache.data||{})}; setDataStatus('cache'); renderAll(); return; }
    status.className='data-status'; status.innerHTML='<span class="dot"></span><span>aggiorno prezzi e trend…</span>';
    try{
      const ids=wantedIds();
      const url=`https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${encodeURIComponent(ids.join(','))}&order=market_cap_desc&sparkline=true&price_change_percentage=1h,24h,7d,30d&locale=it&precision=full`;
      const res=await fetch(url,{headers:{accept:'application/json'},cache:'no-store'}); if(!res.ok) throw new Error('HTTP '+res.status);
      const arr=await res.json(); const data={...market}; arr.forEach(x=>data[x.id]=x); market=data; state.marketCache={time:Date.now(),data}; saveState(); setDataStatus('live'); renderAll();
    }catch(err){
      market={...BASELINE.seedMarket,...(state.marketCache?.data||{})}; setDataStatus('error'); renderAll();
    }
  }
  function setDataStatus(mode){
    const el=$('#dataStatus'); if(!el)return;
    const t=state.marketCache?.time?new Intl.DateTimeFormat('it-IT',{hour:'2-digit',minute:'2-digit'}).format(new Date(state.marketCache.time)):'baseline';
    if(mode==='live') el.className='data-status live',el.innerHTML=`<span class="dot"></span><span>live · aggiornato ${t}</span>`;
    else if(mode==='error') el.className='data-status error',el.innerHTML=`<span class="dot"></span><span>dati cached · ultimo aggiornamento ${t}</span>`;
    else el.className='data-status',el.innerHTML=`<span class="dot"></span><span>cache · ${t}</span>`;
  }

  function toast(msg){
    const t=$('#toast'); t.textContent=msg;t.hidden=false;clearTimeout(renderTimer);renderTimer=setTimeout(()=>t.hidden=true,3000);
  }

  function init(){
    renderAll(); showView(state.ui.lastView||'home');
    $$('.nav-btn[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
    $('.nav-main').addEventListener('click',()=>openOpSheet());
    $('#refreshBtn').addEventListener('click',()=>refreshMarket(true));
    $('#sheetBackdrop').addEventListener('click',closeSheets); $$('[data-close-sheet]').forEach(b=>b.addEventListener('click',closeSheets));
    $('#opType').addEventListener('change',updateOpFields); $('#opAccount').addEventListener('change',updateOpFields); $('#opAsset').addEventListener('change',updateOpFields); $('#opForm').addEventListener('submit',saveOperation); $('#noteForm').addEventListener('submit',saveNote);
    $('#restoreInput').addEventListener('change',e=>{const f=e.target.files?.[0];if(f)restoreBackup(f);e.target.value='';});
    if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
    refreshMarket(false);
  }

  document.addEventListener('DOMContentLoaded',init);
})();
