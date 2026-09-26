const assets=[
 {id:'ethereum',sym:'ETH',name:'Ethereum',initial:20,qty:null},
 {id:'solana',sym:'SOL',name:'Solana',initial:20,qty:null},
 {id:'ripple',sym:'XRP',name:'XRP',initial:20,qty:null},
 {id:'avalanche-2',sym:'AVAX',name:'Avalanche',initial:15,qty:null},
 {id:'near',sym:'NEAR',name:'NEAR',initial:15,qty:3.99129,entry:3.7581},
 {id:'pepe',sym:'PEPE',name:'Pepe',initial:10,qty:null}
];
const terms={Momentum:'Forza e velocità del movimento del prezzo. Forte non significa che continuerà.',Volume:'Quanto viene scambiato. Prezzo e volume che accelerano insieme meritano attenzione.',Breakout:'Superamento di un livello che prima bloccava il prezzo. Va confermato, non inseguito.',Supporto:'Zona dove in passato sono comparsi compratori e la discesa ha rallentato.',Resistenza:'Zona dove il prezzo ha incontrato vendite e fatica a salire.',Spread:'Differenza tra prezzo di acquisto e vendita. È un costo implicito da controllare.',FOMO:'Paura di perdere una salita: spesso porta a comprare dopo che il movimento è già esploso.'};
let saved=JSON.parse(localStorage.getItem('cc-data')||'{}');
if(!saved.diary)saved.diary=[{d:'26/09/2026',t:'Fondo Test creato',x:'Venduti 7,00 € di ETH provenienti dai quiz → 6,99 € liquidi.'}]; if(!saved.watch)saved.watch=[]; save();
function save(){localStorage.setItem('cc-data',JSON.stringify(saved))}
function eur(n){return n.toLocaleString('it-IT',{style:'currency',currency:'EUR'})}
async function refresh(){
 try{let ids=['bitcoin',...assets.map(a=>a.id)].join(',');let r=await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=eur&include_24hr_change=true`);let p=await r.json();
 let bp=p.bitcoin.eur,bc=p.bitcoin.eur_24h_change;document.querySelector('#btcPrice').textContent=eur(bp);document.querySelector('#btcChange').textContent=`24h ${bc>=0?'+':''}${bc.toFixed(2)}%`;document.querySelector('#btcState').textContent=bc>2?'FORTE':bc<-2?'DEBOLE':'NEUTRALE';
 let total=0;document.querySelector('#portfolio').innerHTML=assets.map(a=>{let pr=p[a.id]?.eur||0,ch=p[a.id]?.eur_24h_change||0;let value=a.qty?pr*a.qty:a.initial; if(a.qty==null)value=a.initial; total+=value;let pnl=value-a.initial;return `<div class='coin'><span>${a.sym} · ${a.name}</span><b>${eur(value)}</b><div class='pnl ${pnl>=0?'pos':'neg'}'>${pnl>=0?'+':''}${eur(pnl)} · 24h ${ch>=0?'+':''}${ch.toFixed(1)}%</div><small>Prezzo ${eur(pr)}</small></div>`}).join('');
 document.querySelector('#baseValue').textContent=eur(total);let pp=(total/100-1)*100;document.querySelector('#basePnl').textContent=`${pp>=0?'+':''}${eur(total-100)} · ${pp>=0?'+':''}${pp.toFixed(2)}%`;
 }catch(e){document.querySelector('#basePnl').textContent='Prezzi non disponibili · riprova ↻'}
}
function render(){document.querySelector('#terms').innerHTML=Object.entries(terms).map(([k,v])=>`<div class='term'><b>${k}</b><p>${v}</p></div>`).join('');document.querySelector('#diary').innerHTML=saved.diary.map(x=>`<div class='entry'><b>${x.d} · ${x.t}</b><p>${x.x}</p></div>`).join('');document.querySelector('#watch').innerHTML=saved.watch.map(x=>`<div class='entry'><b>${x}</b><p>Da analizzare con il Radar prima di qualsiasi ingresso.</p></div>`).join('')||'<p>Nessun candidato annotato.</p>'}
document.querySelector('#refresh').onclick=refresh;document.querySelector('#addWatch').onclick=()=>{let x=prompt('Ticker o nome della crypto da osservare');if(x){saved.watch.unshift(x.toUpperCase());save();render()}};document.querySelector('#addDiary').onclick=()=>{let t=prompt('Operazione / evento');if(!t)return;let x=prompt('Nota (importo, motivo, risultato)')||'';saved.diary.unshift({d:new Date().toLocaleDateString('it-IT'),t,x});save();render()};render();refresh();if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
