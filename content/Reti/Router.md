Il **Router** è il nodo di commutazione nelle reti IP ed ha il compito di instradare i pacchetti verso la destinazione.
## Classificazione
### SOHO (Small Office and Home)
Router di uso domestico o piccoli uffici con interfaccia LAN con switch con poche porte Fast Ethernet.
### Router di accesso
Sono usati dagli [[Internet Service Provider (ISP)|ISP]] per offrire un servizio di accesso, tipicamente con molte porte di media velocità (50 kbps ~ 10 Mbps)
### Enterprise/Campus
Utilizzato per l'interconnessione tra LAN per organizzazioni di medie dimensioni, solitamente dotato di poche porte ad elevata velocità (Fast o Gigabit)
### Backbone
Usato per reti di trasporto e connessioni _inter-domain_, spesso collegano regioni, paesi o anche continenti. Sono equipaggiati con poche porte a velocità superiore al Gigabit per secondo oltre che sistemi di monitoraggio remoto e di ridondanza per garantire l'affidabilità
## Funzioni del router
### Routing
Scambio di informazioni con altri router, che comprende:
- Elaborazione locale (routing algorithm)
- Popolazione delle [[I protocolli Internet#Tabella di Instradamento|tabelle di routing]]
#### Routing table
La **routing table**, anche chiamata Routing Information Base (RIB), contiene i risultati dei protocolli e degli algoritmi di routing. Ogni tupla della tabella include:
- La route
- Il _next hop_
- La distanza

### Forwarding
Sfruttando il protocollo IP esegue il [[I protocolli Internet#Table lookup|table lookup]] e modifica gli header dei pacchetti.
#### Forwarding table
La **forwarding table**, anche chiamata Forward Information Base (FIB), è costruita sulla base della [[Router#Routing table|routing table]], è utilizzata per inoltrare i datagrammi ed è ottimizzata per avere un table lookup veloce
### Switching
Trasferimento del datagramma da interfaccia di input a quella di output
### Trasmissione
Trasmissione del datagram sul mezzo fisico
## Routing gerarchico
Il routing in Internet è diviso in gerarchie:
- **Autonomous System (AS)** è l'area di routing più grande, possono decidere autonomamente i protocolli e le politiche di routing che intendono ad adottare al loro interno.
- **Routing Area (RA)** è la suddivisione di un Autonomous System e sono connesse tra di loro da _backbone_.  ^29f73b

Il routing gerarchico ha lo scopo di identificare i sottoinsiemi di rete autonomi, per quanto riguarda l'instradamento, e i punti di contatto tra sottoinsiemi. ^ff0617
>[!notes] Protocolli
>- **Interior Gateway Protocol (IGP)** vengono chiamati così i protocolli interni ad un AS
>	- _RIP:_ Routing Information Protocol
>	- _OSPF:_ Open Shortest Path First
>- **Exterior Gateway Protocol (EGP)** il nome che prendono i protocolli di routing che connettono degli Autonomous System
>	- Oltre a EGP c'è anche **BGP (Border Gateway Protocol)**

^e100c3

### Autonomous System

>[!fail] Definizione deprecata
>È un insieme di router gestiti da un'unica amministrazione che utilizza:
>- Un solo protocollo di routing
>- Logica unica per definire le metriche

>[!success] Definizione
>È un insieme di prefissi di rete IP gestito in modo unitario e con una politica di routing ben definita.

Quindi l'Autonomous System può Avere uno o più enti gestori e utilizzare una o più tecnologie ma deve avere una logica unica che garantisce la connettività con il resto del mondo.
>[!tip] Internet Routing Registries (IRR)
>È il database contenente le politiche di routing degli Autonomous System
## Traffico di routing
I router fanno da gateway verso più network e condividono una network per lo scambio di _informazioni di routing_ (ad esempio i distance vector) e del traffico tra le varie network che interconnettono.
Le informazioni di routing però condividono risorse con i dati che gli utenti si scambiano, quindi bisogna minimizzare il traffico di routing per evitare perdita di efficenza della rete.
### Multicast
Il **multicast** permette la riduzione del traffico di routing se la network supporta il punto-multipunto in modo che si raggiungano multipli router in un solo colpo:
- si utilizzano indirizzi _IP multicast_
#### IP Multicast
Gli indirizzi multicast sono:
$$
\text{da}\ 224.0.0.0\ \text{a}\ 239.255.255.255
$$
>[!info] Utilizzi
>I router possono usare diversi protocolli in contemporanea
>- $224.0.0.9$ RIPv2
>- $224.0.0.5$ OSPF All routers
>- $224.0.0.6$ OSPF Designated routers
>- $224.0.0.10$ EIGRP Routers
>- $224.0.0.24$ OSPF TE

##### Internet Group Management Protocol (IGMP)
È un protocollo che ha lo scopo di dichiarare le appartenenze ai gruppi multicast.
Prevede messaggi per:
- Iscriversi ad un gruppo
- Abbandonare un gruppo
- Valutare l'appartenenza ad un gruppo o meno
## Interior Gateway Protocol (IGP)
### RIP (Routing Information Protocol)
È un protocollo di tipo [[Algoritmi di instradamento#Routing Distance Vector|distance vector]], era molto diffuso in passato perché il codice di implementazione era liberamente disponibile. Viene utilizzato praticamente solo su reti TCP/IP.
Utilizza due tipi di messaggi:
- **REQUEST**: serve per chiedere esplicitamente informazioni ai nodi vicini
- **RESPONSE**: serve in generale per inviare i distance vector (Destinazione, Distanza in _hop_)
	- Viene inviato periodicamente come risposta ad una richiesta esplicita o quando cambia un'informazione di routing ([[Algoritmi di instradamento#^b400eb|triggered update]])

#### Struttura del pacchetto
Il pacchetto del protocollo **RIP** è formato da parole di 32 bit e può avere lunghezza variabile fino a 512 byte (max 25 entry)
![Routing Information Protocol (RIP) | TheNetworkSeal.wordpress.com](https://thenetworkseal.wordpress.com/wp-content/uploads/2015/05/ripformat.jpg) ^2062f0
##### Campi del pacchetto
I bit del pacchetto sono molto ridondanti rispetto alla quantità di informazioni da inviare (molti campi fissi tutti a zero: [[Router#^2062f0|All 0s]])
- **Command**: Distingue tra REQUEST e RESPONSE
- **Version**: Versione del protocollo
- **Address Family Identifier**: Indica il tipo di indirizzo di rete utilizzato
- **Network Address**: Identifica la destinazione per la quale viene data la distanza
- **Metrica**: È la distanza dalla destinazione indicata

#### Tabella di routing
Ogni riga della tabella contiene:
- **Destinazione**: Indirizzo IP a 32 bit
- **Distanza** dalla destinazione
	- si conta in [[I protocolli Internet#^678cfd|hop]]
	- La distanza massima ($\infty$) per RIP è pari a 16 per evitare il [[Algoritmi di instradamento#Count to infinity|conteggio all'infinito]]
- **Next Hop**: Il router vicino a cui inviare i datagram per la destinazione
- Contatori
	- **Timeout**: è il tempo dopo il quale se una route non viene aggiornata la sua distanza è posta a $\infty$
	- **Garbage-collection Timer**: è il lasso di tempo dopo il quale una route viene eliminata dalla tabella
##### Aggiornamento
Un nodo riceve un RESPONSE:
- Controlla la correttezza dei dati
- Considera solo i dati con distanza inferiore a $\infty$
- Calcolo:  $d_{ricevuta}=d_{ricevuta}+1$ 
Quando esiste già una entry per quella destinazione se la distanza è minore di quella presente si aggiorna l'entry e si fa ripartire il timeout e si imposta come _next hop_ il nodo da cui proviene la RESPONSE.
Altrimenti si crea una nuova entry con la distanza calcolata e si imposta il nodo che ha mandato il messaggio come _next hop_
#### Problematiche
- Fa uso di [[Algoritmi di instradamento#^b400eb|split horizon e triggered update]]:
	- _split horizon_: il RESPONSE di interfacce diverse possono essere diverse
	- _triggered update_: non è necessario indicare nella RESPONSE tutte le entry della tabella ma solamente quelle appena modificate
- Non supporta il [[I protocolli Internet#CIDR (Classless InterDomain Routing)|CIDR]]
- È un protocollo insicuro perché chiunque trasmetta datagram dalla porta UDP 520 viene considerato come un router autorizzato
>[!example] Mancanza di CIDR
>![[Pasted image 20251119142919.png]]
### RIP v2
Vengono introdotti miglioramenti riguardanti:
- [[I protocolli Internet#Subnetting|Subnetting]]
- [[I protocolli Internet#CIDR (Classless InterDomain Routing)|CIDR]]
- Autenticazione
>[!abstract] Pacchetto
>![[Pasted image 20251119143419.png]]

Nella seconda versione si ottiene:
- Compatibilità verso il basso:
	- La prima versione ignora le entry con i campi riservati diversi da zero
- Possibilità di indicare sottoreti o indirizzamento CIDR
	- Grazie al campo _subnet mask_
- Possibilità di indicare il proprio Autonomous System e di scambiare informazioni con protocolli [[Router#^e100c3|EGP]] tramite i campi _route tag_ e _routing domain_
- Possibilità di specificare un _next hop_ più appropriato
>[!warning] Problematiche
>Rimane non adatto agli Autonomous System grandi e ha problemi di convergenza essendo un distance vector
### Open Shortest Path First (OSPF)
È un protocollo di tipo [[Algoritmi di instradamento#Routing link state|link state]]: invia un **Link State Advertisement (LSA)** a tutti gli altri router. Viene distinto tramite il valore del campo [[I protocolli Internet#^48cbcc|protocol]] dell'intestazione IP (89 per OSPF)
>[!tip] Scopo
>**OSPF** è stato progettato per:
>- Semplificare il routing in reti grandi tramite la suddivisione in aree
>- Gestire intrinsecamente reti punto-punto e punto-multipunto
>- Separare logicamente gli host dai router

#### Aree di routing
Le [[Router#^29f73b|Routing Area (RA)]] si comportano come entità indipendenti perché risultano separate tra loro per quanto riguarda  lo scambio delle informazioni.
##### Classificazione dei router secondo OSPF
- **Internal Router**: Sono collocati all'interno di ciascuna area
- **Area Border Router (ABR)**: Scambiano informazioni con altre aree ^a8f340
- **Backbone Router**: Si interfacciano con la backbone
- **Autonomous System Boundary Router (ASBR)**: Scambiano informazioni con AS usando un protocollo [[Router#^e100c3|EGP]] ^9b4bf2
##### Tipi di route
- **Route intra-area**: Dedicata all'aggiornamento delle informazioni di routing pertinenti all'area
- **Route inter-area**: Dedicata all'aggiornamento delle informazioni di routing di aree diverse da quella considerata
- **Route esterne**: Passano gli aggiornamenti delle informazioni di route provenienti da altri protocolli al di fuori del dominio OSPF e per gli aggiornamenti inoltrati nel dominio OSPF dal [[Router#^9b4bf2|ASBR]]
##### Tipi di aree
 - **Area normale**: accetta tutti i tipi di route
 - **Stub area**: Accetta _route intra_ e _inter area_, tutti i router usano un "default route" verso destinazioni al di fuori dell'AS (Comunicato dall' _[[Router#^a8f340|Area Border Router (ABR)]]_)
	 - I requisiti di memoria dei router sono ridotti
- **Totally stub area**: Vengono propagati solamente route _intra-area_ ed il route "di default"
	- La default route è propagata dal [[Router#^a8f340|ABR]]
- **Not so stubby area**: È una Stub area che importa alcune route esterne:
	- Uno dei router dell'area è connesso a un Autonomous System e diventa un [[Router#^9b4bf2|ASBR]]

>[!example] Aree di routing e Tipologie di router
>![[OSPF aree di routing.png]]
#### Ulteriori caratteristiche
- **Bilanciamento del carico**: Se un router ha più percorsi di uguale lunghezza verso una certa destinazione, il carico viene ripartito equamente su di essi.
- **Autenticazione**: Per garantire maggiore sicurezza nello scambio delle informazioni di routing è prevista autenticazione con password ed uso di crittografia.
- **Routing dipendente dal grado di servizio**: I router scelgono il percorso sul quale instradare un pacchetto instradare un pacchetto sulla base dell'indirizzo e del campo [[I protocolli Internet#^241f45|Type of Service]] dell'intestazione IP, tendono conto che percorsi diversi possono offrire diversi gradi di servizio.
#### Tipologie di rete
OSPF è progettato per operare correttamente con reti:
- _Point-to-Point_
- _Broadcast Multi-Access_
- _Non-Broadcast Multi-Access_
In una rete ad accesso multiplo tutti gli $n$ router connessi alla rete sono di fatto connessi con tutti gli altri:
- Gli archi bidirezionali da inserire nel grafo sono $\dfrac{n(n-1)}{2}+n$ 
	- sono inclusi gli archi per collegare i router alle network
- Il numero totale dei _Link State Advertisement_ da trasmettere è $n(n-1)$
>[!success] Soluzione
>Conviene adottare una topologia a stella equivalente, inserendo un nodo virtuale che rappresenta la rete, avendo così solo $n$ archi bidirezionali
#### Identificazione di router e priorità
- **Router ID**: Ogni router di [[Router#Autonomous System|Autonomous System]] utilizzante OSPF ha un identificativo univoco ^b7b8d0
	- Di default è l'indirizzo più alto tra quelli assegnati alle interfacce del router, altrimenti si può configurare manualmente configurando l'interfaccia di loop-back
- Ad ogni router di un'area si possono associare delle priorità con un valore tra 0 e 255 (8 bit) utilizzate per l'elezione del [[Router#Designated Router (DR)|DR]]
#### Vicinanza e adiacenza tra router
- **Vicini**: sono detti due router connessi alla medesima rete che possono comunicare direttamente (punto-punto, punto-multipunto)
- **Adiacenti**: due router che si scambiano informazioni di routing
>[!tip] Sovrapposizione
>Dei router _vicini_ sono certamente anche _adiacenti_ ma non è detto il contrario perché le informazioni di routing possono essere scambiate tra router non appartenenti alla stessa rete
##### Designated Router (DR)
È un router che viene eletto in una rete ad accesso multiplo:
Il DR fa da tramite per lo scambio di informazioni di routing che può avvenire solo tra router adiacenti, infatti =={red}ogni router della LAN è adiacente al DR==.
In questo modo il DR è l'unico a comunicare le informazioni di routing della LAN al mondo esterno.
Per questioni di affidabilità, in una rete conviene avere anche un **Backup Designated Router (BDR)**, anch'esso adiacente a tutti i router locali
###### Elezione di DR e BDR
Ogni router nella rete ad accesso multiplo:
- Esamina la lista dei suoi vicini
- Elimina dalla lista tutti i router non eleggibili (quelli con priorità nulla $=0$)
- Viene eletto quello con priorità maggiore
	- In caso di "pari merito" si seleziona il [[Router#^b7b8d0|router ID]]
- Il procedimento si ripete escludendo il router appena eletto per eleggere il _BDR_
#### Link State Database
Rappresenta il grafo orientato della rete su cui ogni router calcola lo _shortest path tree_
#### Pacchetto
OSPF invia messaggi utilizzando direttamente il protocollo IP (protocol $=89$) ed è composto da sotto-protocolli:
- **Hello**
- **Exchange**
- **Flooding**
>[!abstract] Header
>![[Pasted image 20251120172402.png|500]]
>Tutti i messaggi hanno intestazione comune:
>- **Version**: indica la versione di OSPF (versione 2)
>- **Type**: indica il tipo di pacchetto
>	- _Hello_
>	- _Database description_
>	- _Link state request_
>	- _Link state update_
>	- _Link state acknowledge_
>- **Packet Length**: numero di byte del pacchetto
>- **Router ID**: indirizzo IP che identifica il router mittente
>- **Area ID**: identifica l'area di appartenenza
>	- `0.0.0.0` è l'area di backbone
>- **Checksum**: calcolata su tutti il pacchetto escludendo gli 8 byte del campo authentication
>- **Authentication**: indica il tipo di autenticazione:
>	- _0_: nessuna autenticazione
>	- _1_: autenticazione semplice (password nel campo)
>	- _2_: autenticazione crittografica (dati nel campo)
>- 

##### Hello protocol (Type = 1)
>[!info] Scopo
>È un protocollo utilizzato per:
>- Controllare l'operatività dei link
>- Scoprire e mantenere relazioni fra vicini
>- [[Router#Elezione di DR e BDR|Eleggere DR e BDR]]

>[!abstract] Campi
>![[Pasted image 20251120174931.png]]
>- **HelloInterval**: Intervallo che indica ogni quanto i pacchetti HELLO vanno inviati per scoprire i propri vicini
>- Lista **Neighbor**: contiene tutti i vicini dai quali è stato ricevuto un pacchetto HELLO non più vecchio del campo **RouterDeadInterval**
>- **Router Priority, Designated Router, Backup Designated Router**: sono utilizzati per l'elezione di DR e BDR
>- **Network Mask**: indica la maschera relativa del router
>- **Options**: indica se si supportano funzionalità opzionali

##### Exchange protocol
Una volta stabilite le adiacenze, router adiacenti devono sincronizzare i rispettivi Link State Database
###### Database Description (Type = 2)
La sincronizzazione asimmetrica avviene stabilendo _master_ e _slave_:
- _Master_ invia una serie di pacchetti Database Description contenenti l'elenco dei LSA del proprio database (LSA, età, router di provenienza. numero di sequenza)
- _Slave_ risponde con l'elenco dei LSA del tuo database e durante lo scambio, ciascun router, confronta le informazioni ottenute con quelle in proprio possesso.
###### Link State Request (Type = 3)
Viene effettuata la richiesta quando i router contengono nel proprio database degli LSA meno recenti rispetto a quelli ricevuti
##### Flooding protocol
###### Link State Update (Type = 4)
A seguito di:
- Un cambiamento nello stato di un collegamento
- Una richiesta (Link State Request)
- Termine del periodo (~30 min)
la diffusione, eseguita in modalità [[Algoritmi di instradamento#Flooding|flooding]] degli LSA a tutti i router della rete avviene tramite l'invio di pacchetti Link State Update.
###### Link State Acknowledgment (Type = 5)
È il protocollo di conferma della ricezione di un Link State Update che ne termina l'invio.
>[!info] Affidabilità
>In questo modo si rende il flooding affidabile

>[!example] Sincronizzazione e aggiornamento
>![[Pasted image 20251120181533.png]]

## Exterior Gateway Protocols (EGP)
>[!info] Definizione
>È la categoria di protocolli utili alla comunicazione tra Autonomous System

Come abbiamo già visto ogni [[Router#Autonomous System|Autonomous System]] ha una propria ***politica di instradamento***:
- Alcuni AS vogliono mantenere una propria indipendenza dagli altri e non vuole subire decisioni di altre entità
- Alcuni non vogliono permettere ad altri AS di instradare il traffico attraverso le loro reti
- In altri casi bisogna operare secondo accordi internazionali
### Exterior Gateway Protocol (EGP)

>[!warning] ATTENZIONE!
>EGP $\neq$ EGP
>Il **protocollo** Exterior Gateway Protocol =={orange}fa parte== della categoria di Exterior Gateway Protocol_s_ 

#### Funzionalità principali
- **Neighbor acquisition**: Verifica se esiste un accordo per diventare vicini
- **Neighbor reachability**: Monitora le connessioni con i vicini
- **Network reachability**: Scambia informazioni sulle reti raggiungibili da ciascun vicino
##### Limiti
- EGP è un protocollo simile a [[Algoritmi di instradamento#Routing Distance Vector|distance vector]]:
	- Le informazioni di scambio sono informazioni di raggiungibilità
	- Non sono specificate regole che definiscono la metrica delle distanze
	- La distanza minima non è il criterio migliore da seguire
- Il protocollo è stato progettato per l'ARPANET, molto differente dalle reti odierne
- Funziona bene per reti ad albero ma non a maglia complessa (con presenza di cicli):
	- Convergenza molto lenta
	- Rischio di instabilità
- Non è implementato nessun meccanismo di sicurezza:
	- Chiunque può essere "creduto" dai router
	- Un guasto ad un router può danneggiare il routing di tutta rete
### Border Gateway Protocol (BGP)
Il **BGP** è stato concepito come successore dell'EGP per risolvere i suoi limiti.
#### Funzionamento
I router si scambiano informazioni con connessioni _TCP sulla porta 179_, esse sono chiamate **sessioni BGP**.
Le sessioni BGP garantiscono comunicazioni affidabili grazie al controllo degli errori assegnato allo stato di trasporto, rendendo così anche più semplice il protocollo.
Tipi di sessioni BGP:
- **eBGP**: sono sessioni instaurate tra router appartenenti ad AS diversi (_sessioni esterne_)
- **iBGP**: sono sessioni instaurate tra router dello stesso AS (_sessioni interne_)
>[!example] Sessioni interne ed esterne
>![[Pasted image 20251121101644.png]]

>[!info] CIDR
>Le informazioni riguardanti la raggiungibilità sono scambiate seguendo lo schema classless [[I protocolli Internet#CIDR (Classless InterDomain Routing)|CIDR]]

#### Path Vector
Il BGP è un protocollo di tipo **Path Vector**: un evoluzione dei [[Algoritmi di instradamento#Routing Distance Vector|Distance Vector]].
Il vettore dei percorsi contiene tutti gli AS da percorrere per arrivare ad una certa destinazione, risolve i problemi dei percorsi ciclici ed è più consono a definire le politiche di routing ==tra AS== rispetto alla semplice distanza.
##### Evitare i cicli 
Quando un [[Router#^9b4bf2|router di bordo]] di un AS riceve un path vector controlla se l'AS a cui appartiene è già elencato nel vettore:
Se
- È presente vuol dire che c'è la possibilità che esista un loop e quel path vector viene scartato
- Non è presente il path vector viene aggiornato con l'indicazione dell'AS di appartenenza e comunicato ai vicini
##### Politiche di routing
- **Export policies**: Vengono comunicati ai vicini solo i path vector relativi alle destinazioni verso le quali si vuole permettere il transito
- **Import policies**: Dato che dal path vector è possibile risalire agli AS da attraversare per raggiungere una destinazione, i percorsi vengono considerati solo se gli Autonomous System da attraversare sono compatibili con le politiche di routing stabilite
>[!Note] N.B.
>- L'approccio basato sul percorso invece della distanza permette ai router di non utilizzare la stessa metrica
>- Per lo scambio di informazioni di routing si ha un maggior consumo di banda
>- Per mantenere le tabelle i router necessitano di più memoria

#### Attributi
A ciascun path vector sono associati degli attributi che ne specificano la natura e ogni attributo può essere:
- **Well-known**: Riconoscibile da tutte le implementazioni di BGP ^56f412
	- _Mandatory_: deve essere presente nel path vector ^3d1201
	- _Discretionary_: può anche non essere indicato
- **Optional**: Può essere riconosciuto da alcuni router
	- _Transitive_: deve essere inoltrato anche se non riconosciuto
	- _Non-transitive_: deve essere ignorato se non riconosciuto
- **Partial**: È un attributo che è stato ritrasmesso senza modifiche perché non è stato riconosciuto (_optional-transitive_). Indica se un determinato path vector è stato riconosciuto o meno da tutti i router attraversati.
>[!info] Codifica degli attributi
>![[Pasted image 20251121105442.png]]
##### Tipi
- **Origin (Code = 1)** è [[Router#^56f412|mandatory]] e può valere:
	- _0 = IGP_: L'informazione è stata ottenuta direttamente dal protocollo di routing interno all'AS della destinazione
	- _1 = EGP_: L'informazione deriva dal protocollo EGP (non funziona in caso di cicli)
		- Questo valore è peggiore di uno di tipo IGP
	- _2 = Incomplete_: Indica che il percorso è stato determinato in altro modo (es. statico) oppure è utilizzato per marcare un percorso di AS nel quale la destinazione non è al momento raggiungibile
- **AS path (Code = 2)** è [[Router#^56f412|mandatory]] ed elenca gli AS da attraversare lungo il percorso verso la destinazione
- **Next hop (Code = 3)** è [[Router#^56f412|mandatory]] e indica l'indirizzo IP del router di bordo dell'AS che deve essere usato come next hop verso la destinazione specificata
#### Formato dei messaggi
Tutti i messaggi hanno la seguente parte comune:
- **Marker**: Campo per possibile schema di autenticazione
- **Length**: Numero di byte del messaggio BGP (_header incluso_)
- **Type**: Assume uno dei seguenti valori:
	- Open
	- Notification
	- Update
	- keepalive
##### Tipi
- **Open**: Primo messaggio trasmesso quando viene attivata una connessione verso un router BGP vicino, contiene:
	- Informazioni di identificazione dell'AS di chi trasmette
	- Durata del timeout per considerare un vicino non più attivo
	- Dati di autenticazione
- **Update**: Contiene il path vector e i relativi attributi
- **Notification**: Messaggio di notifica di errori e/o di chiusura della connessione
- **Keepalive**: Non contiene informazioni aggiuntive, è usato per comunicare ad un router BGP vicino per notificare che il trasmettitore è attivo anche se non sta inviando nuove informazioni.
