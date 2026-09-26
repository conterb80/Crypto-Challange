CRYPTO CONTE — RC3 RADAR INTELLIGENTE
Data build: 26/09/2026
Versione: 2.3.0

OBIETTIVO
Consolidare la RC2 senza aggiungere nuove schermate: rendere il Radar più intelligente, il portafoglio più leggibile a colpo d’occhio e le spiegazioni sotto i trend più chiare.

COMPATIBILITÀ CON RC2
- Stessa chiave localStorage: cryptoConte.v2.state.
- Operazioni, note, watchlist, segnali Radar e Fondo Test restano sullo stesso dominio/GitHub Pages.
- Prima di aggiornare è comunque consigliato: Diario > Esporta backup.

NOVITÀ RC3
1) PORTAFOGLIO ORDINATO PER RENDIMENTO
- Le posizioni Base e Test sono ordinate automaticamente dal P/L totale % migliore al peggiore.
- Il criterio è la percentuale dalla tua entrata, non la sola variazione 24h.
- A parità di %, usa prima il P/L in euro e poi la sigla.

2) SPIEGAZIONI RADAR PIÙ LEGGIBILI
- “Perché lo sto guardando” ha contrasto leggermente maggiore, peso migliore e più interlinea.
- Dimensione quasi invariata per non appesantire le card.

3) RADAR OPPORTUNITÀ PIÙ AMPIO
- Il pulsante Scansiona resta quello già presente e forza una scansione immediata.
- Auto-Radar: stessa scansione ogni 15 minuti mentre l’app è aperta.
- L’ora dell’ultimo scan resta visibile.
- La discovery non è più limitata alle prime 100 crypto per capitalizzazione.
- RC3 combina fino a 250 crypto per capitalizzazione + fino a 250 per volume + Trending CoinGecko, deduplicando i risultati.
- Prima fa uno screening leggero su un universo ampio, poi scarica trend dettagliati solo per i candidati migliori: meno traffico rispetto a caricare grafici completi per centinaia di token.

4) SCORING MIGLIORATO
Il Radar considera:
- rapporto volume/capitalizzazione;
- variazione del volume rispetto allo scan precedente;
- accelerazione del prezzo tra uno scan e il successivo;
- momentum 1h e 24h;
- forza relativa 24h e 7g rispetto a BTC;
- compressione vicino ai massimi e tentativo di breakout;
- presenza nel Trending CoinGecko come indicatore di attenzione del mercato.
Mostra al massimo 5 candidati con OSSERVA / INTERESSANTE / NON INSEGUIRE.

5) MEW E PYTH
- MEW resta nel catalogo rapido.
- PYTH è stato aggiunto al catalogo rapido.
- Il Radar Opportunità può comunque trovarli autonomamente se rientrano nell’universo di capitalizzazione/volume/Trending, senza che siano nella watchlist.

COSA NON CAMBIA
- Nessuna notifica.
- Nessuna nuova schermata.
- Nessun secondo pulsante “Scansione”.
- Operazione rimane il punto unico per acquisti/vendite e creazione di nuove posizioni.
- I catalizzatori/news non vengono inventati: per ora Trending è solo un proxy di attenzione. Una fonte news affidabile potrà essere integrata in futuro.

INSTALLAZIONE
1. RC2: Diario > Esporta backup.
2. Sostituisci tutti i file del repository con quelli del pacchetto RC3.
3. Attendi il deploy GitHub Pages.
4. Apri la pagina in Chrome e premi ↻.
5. Chiudi completamente e riapri la PWA installata.
6. Controlla in alto “SALA CONTROLLO · RC3”.

Il service worker RC3 usa una cache nuova e rimuove le vecchie cache dell’app.
