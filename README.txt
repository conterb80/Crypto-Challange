CRYPTO CONTE — RC2 RADAR & LIVE
Data build: 26/09/2026
Versione: 2.2.0

OBIETTIVO
Mantenere la base RC1 già approvata e aggiungere solo funzioni utili all'uso reale: aggiornamento automatico, watchlist libera, Radar Opportunità, verifica dei segnali 24/48h, operazioni rapide e maggiore protezione dei dati.

COMPATIBILITÀ CON RC1
- La chiave localStorage resta la stessa: cryptoConte.v2.state.
- Operazioni, note, watchlist e dati già inseriti nella RC1 vengono mantenuti sullo stesso dominio/GitHub Pages.
- La vecchia watchlist RC1 viene migrata automaticamente dal simbolo al CoinGecko ID.
- Prima di sostituire i file è comunque consigliato: Diario > Esporta backup.

NOVITÀ RC2
1) LIVE AUTOMATICO
- Prezzi/trend si aggiornano automaticamente ogni 2 minuti e 30 secondi mentre l'app è visibile.
- Al ritorno dall'app in background viene richiesto un aggiornamento se i dati hanno più di 45 secondi.
- Il pulsante ↻ rimane disponibile per il refresh manuale.
- Lo stato in alto mostra l'ora dell'ultimo aggiornamento.

2) WATCHLIST LIBERA
- Non c'è più la lista chiusa da massimo 3 crypto.
- Radar > + Watchlist apre una ricerca per sigla o nome.
- La ricerca usa CoinGecko e quindi non serve conoscere il CoinGecko ID.
- MEW / cat in a dogs world è già presente tra i suggerimenti rapidi.
- Le posizioni possedute sono già nel Radar e non vanno aggiunte alla watchlist.

3) RADAR OPPORTUNITÀ AUTOMATICO
- Scansione automatica circa ogni 15 minuti delle prime 100 crypto per capitalizzazione, filtrando liquidità minima e stablecoin.
- Analizza:
  * attività/variazione dei volumi;
  * momentum 1h e 24h;
  * forza relativa 24h/7g rispetto a BTC;
  * compressione vicino ai massimi e tentativi di breakout;
  * presenza nella sezione Trending di CoinGecko.
- Mostra al massimo 5 candidati con stati:
  * OSSERVA
  * INTERESSANTE
  * NON INSEGUIRE
- Ogni candidato spiega "Perché lo sto guardando".
- Gli stati sono indicatori descrittivi, non ordini automatici di acquisto/vendita.

4) COSA SAREBBE SUCCESSO?
- Quando il Radar genera OSSERVA o INTERESSANTE, salva prezzo e ora del segnale.
- Alla prima apertura/lettura utile dopo 24h e 48h registra la variazione dal prezzo segnalato.
- Serve per valutare il metodo senza dover comprare ogni candidato.
- Nota: se l'app resta chiusa, la rilevazione viene fatta alla prima occasione dopo la soglia, non necessariamente al minuto esatto delle 24/48h.

5) OPERAZIONI RAPIDE
- Nel dettaglio di una posizione compaiono:
  * + Acquisto
  * Vendi tutto
- "Vendi tutto" precompila l'intera quantità e una stima del valore live.
- Prima di salvare va sostituito l'importo stimato con l'incasso reale mostrato da Revolut.

6) SICUREZZA DATI
- Resta export/import del backup JSON.
- RC2 crea inoltre un punto sicurezza locale prima di operazioni/modifiche importanti.
- Diario > Ripristina ultimo punto consente di tornare all'ultimo checkpoint disponibile.

7) SCUOLA
Aggiunte mini spiegazioni pratiche su forza relativa vs BTC, NON INSEGUIRE e verifica 24/48h dei segnali.

DATI INIZIALI DI RIFERIMENTO
Capitale personale: 100,00 €
Reward/bonus: 7,46 €
Fondo Test liquido iniziale: 6,99 €

Posizioni Base iniziali:
ETH  0,00848925   prezzo medio 2.396,93 €
SOL  0,193752     prezzo medio 103,220 €
XRP  14,46818     prezzo medio 1,3823 €
AVAX 1,5637       prezzo medio 9,592 €
NEAR 3,99129      prezzo medio 3,7581 €
PEPE 2.340.030    prezzo medio 0,0000042734 €

NOTA SUI CATALIZZATORI/NEWS
RC2 non inventa né deduce notizie. Usa dati di mercato CoinGecko e il segnale Trending come indicatore di attenzione. Una vera integrazione news/catalizzatori potrà essere aggiunta in futuro solo con una fonte affidabile dedicata.

INSTALLAZIONE/AGGIORNAMENTO
1. Nella RC1, se hai già registrato operazioni, fai Diario > Esporta backup.
2. Sostituisci nel repository tutti i file con quelli di questo pacchetto RC2.
3. Attendi il deploy GitHub Pages.
4. Apri l'app da Chrome e premi ↻.
5. Chiudi completamente e riapri la PWA installata.
6. Controlla che compaia "SALA CONTROLLO · RC2".

Il service worker RC2 usa una cache nuova e rimuove le vecchie cache dell'app.
