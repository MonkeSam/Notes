Il protocollo **MPLS** è una tecnica di routing che ha come scopo scomporre in [[#Funzioni|funzioni]] l'instradamento tramite il **Label Switching**

## Label Switching
Il **Label Switching** adotta un modo di trasferimento con commutazione orientata alla connessione basata sul riconoscimento di una _label_ (etichetta) associata al datagramma.
**Label**: è un'entità di lunghezza fissa che non codifica gli indirizzi di rete ed è trasportata dal pacchetto usando parte dell'header di livello 2 (datalink).
### Funzioni
- **Controllo**: si basa sui protocolli di rete convenzionali e meccanismi di associazione delle etichette
- **Instradamento**: si basa su hardware veloce e identificazione basata su etichette dei flussi informativi
## Ingegneria del traffico
Nel _routing "classico"_ la decisione di instradamento è presa solo sulla base dell'indirizzo IP, in questo modo spesso i pacchetti verso una certa destinazione seguono lo stesso percorso stabilito dall'[[Algoritmi di instradamento|algoritmo di routing]].
Possono insorgere casi (es. guasti, congestioni di rete,...) in cui è necessario re-instradare i pacchetti, per questo nasce l'**Ingegneria del traffico**.
Utilizzando indicazioni esplicite su come ripartire i [[#^b16e3f|flussi]] di traffico si possono ottenere dei percorsi di "backup" già pronti all'uso in caso di guasti.

>[!note] Flusso
>Viene definito **flusso (flow)** la sequenza di datagrammi inviati da una particolare sorgente a una destinazione e accumunati da:
>- Stesso instradamento (route)
>- Uniformi richieste di qualità di servizio
>- Insieme delle politiche di gestione richieste nei router (es. priorità)

^b16e3f

## MPLS
Il **MultiProtocol Label Switching** è definito da [IEFT](https://it.wikipedia.org/wiki/Internet_Engineering_Task_Force#:~:text=La%20Internet%20Engineering,di%20protocolli%20Internet.) per implementare il [[#Label Switching]] permettendo l'instradamento multiprotocollo.
>[!note] Forwarding Equivalence Classes (FEC)
>Nel protocollo MPLS una label serve per classificare i pacchetti tramite le **Forwarding Equivalence Classes** in modo da dividere i [[#^b16e3f|flussi]] in base a:
>- Destinazione
>- Classe di traffico
>
>Quindi possiamo dire che le _FEC_ raggruppano pacchetti "simili" per indirizzarli nello stesso percorso dandogli la stessa label, ciò viene fatto in base al campo _next hop_ che caratterizza la FEC.
### LSR - Label Switch Router
È un tipo di router posizionato tipicamente all'interno di una rete MPLS ed è responsabile dello switching delle label, la decisione del percorso viene presa considerando solamente la label.
Ogni **LSR** possiede una tabella detta **Label Forwarding Information Base (LFIB)** contenente: ^aa7623
- Elenco delle label attive
- Interfaccia sulla quale inviare un datagram con una certa label
- Nuova label da associare al datagramma entrante

>[!faq] A cosa serve LFIB?
>Quando un **LSR** riceve un pacchetto rimuove la sua label e la ricerca nella propria **LFIB**, una volta trovata utilizza l'interfaccia e la nuova label da associare al datagram in entrata

^6bb09a

### LER - Label Edge Router 
I **Label Edge Router** fungono da punto di accesso della rete MPLS dall'esterno. Il loro compito è quello di assegnare le label ai pacchetti entranti (_push_) e rimuoverle a quelli uscenti (_pop_).
In caso di _push_:
- Viene determinato la FEC e il next hop
- Se il next hop è un LSR viene determinata la label da aggiungere al pacchetto
- Invia il pacchetto al next hop

>[!warning] Efficienza
>In una rete tradizionale la FEC va valutata ad ogni router verificando il [[I protocolli Internet#Tabella di Instradamento#Table lookup#Funzionamento|longest prefix match]] e si effettua la scelta del next hop. Facendo così si va a rallentare il processo di instradamento, quindi sarebbe preferibile instradare i pacchetti senza valutare la FEC ad ogni hop:
>- Si associa alla FEC una label all'ingresso nella MPLS dal LER
>- I pacchetti con la stessa label vengono instradati nella stessa direzione dagli LSR

### LSP - Label Switched Path
Il **Label Switched Path** semplicemente è l'insieme di router che costituisce il percorso di un pacchetto ed è definito da:
- _Inizio_: [[#LER - Label Edge Router|LER]] esegue il push su un pacchetto in entrata inserendo la label a [[#Label Stacking|livello gerarchico]] $m$
- _"Routing"_: Il pacchetto passa per gli [[#LSR - Label Switch Router|LSR]] che scambiano le label "di provenienza" con quelle presenti nella propria [[#^6bb09a|LFIB]]
- _Fine_: L'ultima scelta ce l'ha un LSR o un LER
	- _LER_: Prende la decisione di instradamento in modo convenzionale senza usare le label e utilizzando l'indirizzo IP
	- _LSR_: Decide l'instradamento sulla base di una label di [[#Label Stacking|livello gerarchico]] $< m$
#### Label Stacking
La gerarchia delle label viene definito tramite l'uso di uno stack anche per fare in modo che rimanga traccia di tutte le FEC.
>[!example] Pacchetto MPLS 
>[![[Pasted image 20251125094315.png]]](https://en.wikipedia.org/wiki/Multiprotocol_Label_Switching#:~:text=MPLS%20packet%20structure)

>[!example] Label Stacking
>Tramite l'uso del Label Stacking notiamo che accomunando i pacchetti tramite FEC si crea una sorta di tunneling che permette la semplificazione dell'instradamento
>**Prima**
>![[Pasted image 20251125095439.png]]
>**Dopo**
>![[Pasted image 20251125095456.png]]

### Label Distribution
Per il mantenimento degli [[#LSP - Label Switched Path|LSP]] si effettua la distribuzione delle label tra LSR, che in generale avviene secondo il seguente procedimento:
- Ad ogni LSP viene associata una label in base alla FEC di appartenenza (_label binding_)
- La label viene concordata con il LSR di provenienza in modo che quello in coda alla LSP riconosca correttamente i pacchetti
- Viene calcolato il nodo (LSR) successivo tramite algoritmi e protocolli di routing tradizionali
- LSR in coda al percorso (LSP) riconosce i pacchetti tramite la label
>[!note] Le label di ingresso e quella di uscita per un LSP non devono essere necessariamente uguali
#### Label Merging
Supponendo che un LSR abbia in entrata multiple label destinate ad una particolare FEC, nonostante le label possano essere differenti, se l'allocazione non dipende dall'interfaccia, allora i pacchetti vengono inviati con la stessa label. Questa tecnica viene chiamata **Label Merging**.
#### TTL - Time To Live
Il [[I protocolli Internet#^c5ab81|TTL]] nelle reti MPLS viene inserito all'interno delle label dato che non può rimanere all'interno dell'header del protocollo IP siccome non viene utilizzato per l'indirizzamento.
Una volta arrivato alla fine del LSP, al pacchetto viene rimossa la label e il TTL viene copiato nell'intestazione del protocollo IP per poter essere utilizzato sulla rete "tradizionale".
