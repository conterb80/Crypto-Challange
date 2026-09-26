CRYPTO CONTE — RC1 SALA CONTROLLO
Data build: 26/09/2026
Versione: 2.1.0

OBIETTIVO
Un unico aggiornamento strutturale: contabilità corretta, dettaglio posizioni, trend, Radar, operazioni manuali, diario e backup. Nessun collegamento o credenziale Revolut.

DATI INIZIALI INSERITI
Capitale personale: 100,00 €
Reward/bonus: 7,46 €
Fondo Test liquido: 6,99 €

Posizioni Base:
ETH  0,00848925   prezzo medio 2.396,93 €
SOL  0,193752     prezzo medio 103,220 €
XRP  14,46818     prezzo medio 1,3823 €
AVAX 1,5637       prezzo medio 9,592 €
NEAR 3,99129      prezzo medio 3,7581 €
PEPE 2.340.030    prezzo medio 0,0000042734 €

FUNZIONI PRINCIPALI
- Home/Sala con Capitale tuo, Reward, Valore totale e Risultato reale.
- Valore Base e Fondo Test separati.
- Prezzi/trend automatici con cache locale e fallback ai dati iniziali.
- Card cliccabili con quantità, prezzo medio, valore, P/L, 1h/24h/7g/30g e grafico.
- Radar: BTC, ETH, posizioni aperte e massimo 3 crypto watchlist.
- + Operazione: acquisto, vendita, versamento personale, reward, prelievo e trasferimento Base/Test.
- Nuove crypto inseribili manualmente con symbol/nome/CoinGecko ID.
- Le operazioni registrate dalla RC1 possono essere modificate o eliminate: saldi e posizioni vengono ricalcolati.
- Diario con note, P/L realizzato da RC1, export/import backup JSON.
- Scuola pratica incorporata.
- PWA installabile e service worker versionato.

IMPORTANTE SUI CONTI
Il "Risultato reale" è:
(valore attuale Base + valore attuale Test + prelievi registrati) - capitale personale versato - reward registrati.
In questo modo un nuovo versamento o un nuovo reward non viene scambiato per profitto.

INSTALLAZIONE/AGGIORNAMENTO
1. Sostituire nel repository i file con quelli di questo pacchetto.
2. Attendere il deploy GitHub Pages.
3. Aprire l'app da Chrome, premere ↻ e poi chiudere/riaprire la PWA.
4. Il service worker RC1 elimina le vecchie cache dell'app.

NOTA DATI
Le modifiche manuali sono salvate nel localStorage del dispositivo. Prima di prove importanti usare Diario > Esporta backup.
