Le prestazioni sono la differenze tra il carico di lavoro da smaltire e il lavoro già eseguito.
>[!warning] ATTENZIONE
>Questa parte di appunti è fatta particolarmente male perché ho compreso talmente tante cose che ora non so neanche come fare le addizioni di numeri ad una cifra.
>Consiglio di tenersi sotto il `PDF` del professore (il migliore) sperando che possa aiutare a comprendere almeno una riga di quello che c'è scritto

## Richieste offerte e smaltite
Sia
- $a(t)$ il numero di richieste _in entrata_ a tempo $t$
- $s(t)$ il numero di richieste _accettate_ a tempo $t$
- $p(t)$ il numero di richieste _soddisfatte_ a tempo $t$

$$
\large k(t)=s(t)-p(t)
$$
>[!example] Sistema di _smaltimento_ richieste e grafico
![[Screenshot 2025-11-27 alle 09.20.26.png]]![[Sistema di elaborazione richieste.png]]

### Frequenza media delle
- **Richieste offerte** $$\large\lambda= \lim_{t\to\infty} \frac{a(t)}{t}$$
- **Richieste smaltite** $$\large\lambda_s= \lim_{t\to\infty} \frac{p(t)}{t}$$
Se il sistema in oggetto non produce lavoro ma lo riceve solamente dall'esterno si ha che $\lambda_s \leq \lambda$
### Richieste perdute
Tutte le richieste vengono accettate dal sistema e prima o poi soddisfatte se
$$
\large \lambda_s = \lambda \Rightarrow s(t)=a(t)
$$
Le richieste che vengono _perdute_ o rifiutate sono indicate con $r(t)$ che se $$\large 
\lambda_s < \lambda\ \text{si ha}\ r(t)=a(t)-s(t)$$
>[!note ] Analogamente
>Posso definire $\large \lambda_p = \lim_{t\to\infty} \frac{r(t)}{t}$ implica $\large\lambda=\lambda_s+\lambda_p$



## Servizio
Il **tempo di servizio** è il tempo impiegato da un pacchetto per raggiungere interamente l'utente in modo da produrre un risultato "utile".
Quindi il _bit-rate_ di un canale non è un'unità di misura sufficiente per misurare le prestazioni di un servizio perché i pacchetti sono divisi in frammenti.
### Tempo di servizio
Il tempo di servizio può essere:
- **Aleatorio**: Si fa riferimento in prima battuta al tempo medio
- **Deterministico**: tempo di servizio costante ed uguale al suo valore medio
#### Tempo medio
Sia
- $L$ la lunghezza del pacchetto in bit
- $C$ è la capacità del canale in bit per secondo (`bit/s`)
Definiamo tempo medio come
$$
\Large \overline{\theta}=\frac{L}{C}
$$
### Frequenza di servizio
L'inverso del tempo medio di servizio viene detto **frequenza media di servizio**.
È legata alla presenza di utenti del sistema perché se nessun utente richiede il servizio la frequenza sarà nulla.
Essa è definita come
$$
\Large \mu=\frac{1}{\overline{\theta}}
$$
Ipotizzando di avere $\large \overline{\theta}=0.5\ \text{s}$  calcoliamo che $\large \mu=2\ \text{pacchetti/s}$ quindi il servizio riesce a gestire al massimo due pacchetti al secondo, cioè $\large \lambda^{\text{max}}_s=\mu$  
### Sistema a coda
L'utente permane nel sistema per un tempo che tiene conto dell'attesa in coda e del tempo di esecuzione del servizio.
#### Tempo medio
Il tempo medio totale speso dal singolo utente nel sistema a coda che è composto da:
- $\large \overline{\theta}$ è il tempo effettivo di servizio.
- $\large T_A$ è il tempo speso in coda, cioè il tempo di attesa prima di ottenere il servizio
Esso è definito come $$
\large \overline{\delta}=\overline{\theta}+T_A
$$
#### Traffico
Il **traffico** è definito come il prodotto fra frequenza di arrivo e tempo medio di permanenza nel sistema
$$
\Large A=\lambda \overline{\delta}
$$
>[!quote] Legge di Little
>Il numero medio di clienti in un sistema è uguale al tasso medio di arrivo moltiplicato per il tempo medio nel sistema.

Per analogia si definiscono
- $A_0=\lambda \overline{\theta}$ il _traffico offerto_: l'occupazione media di un sistema ideale che serve subito tutti gli utenti senza attesa ^85da12
- $A_s=\lambda_s\overline{\theta}$ è il _traffico smaltito_: l'occupazione media dei servitori del sistema ^2c29b9
- $A_p=\lambda_p\overline{\theta}$ è il _traffico perduto_: occupazione media di un sistema che serve gli utenti che invece sono stati rifiutati
##### Traffico smaltito
^2e9027
$A_s$ (chiamato anche _throughput_) dà una valutazione della capacità di servizio del sistema considerato. La capacità viene raggiunta se i "servitori" sono impegnati al 100%.
Con $m$  servitori si ha che $$0\leq A_s \leq m$$
#### Capacità massima ed efficienza
Poiché il protocollo invia i bit del livello 3 sul canale, la sua capacità massima teorica è la velocità del canale $C$.
Il tempo medio di servizio minimo possibile sarebbe quindi $$\overline{\theta}=\frac{L}{C}=\frac{1}{\mu}$$
Se invece il protocollo richiede maggiore tempo per la completa trasmissione della trama allora $$\overline{\theta}_e=\frac{L}{C_e}>\frac{1}{\mu}$$
>[!note] $\Large C_e$
La capacità effettiva dipende dal protocollo, se le funzionalità richieste o una situazione non ideale richiedono più tempo per ogni [[Definizioni#PDU (Protocol Data Unit)|PDU]] allora parte della capacità risulta inutilizzabile per i dati degli utenti.
##### Efficienza
L'efficienza viene valutata facendo riferimento alla PDU confrontando la quantità di tempo strettamente utilizzato per inviare i soli dati d'utente ([[Definizioni#SDU (Service Data Unit)|SDU]]) e la quantità di tempo utilizzato complessivamente per completare correttamente l'invio della PDU.
Il prodotto fra queste quantità indica proprio l'efficienza $$
\large \eta=\frac{T_u}{T_0}=\frac{\overline{\theta}}{\overline{\theta_e}}$$
#### Coda con singolo servitore
>[!example] Schema
>Ogni collegamento in uscita viene schematizzato come sistema coda singolo servitore.
>Per ipotesi:
>- I pacchetti persi sono trascurabili ($\lambda_s=\lambda$ e $\lambda_p=0$)
>- I pacchetti arrivano casualmente con distribuzione di Poisson $\large \Pr\{k \text{ arrivals during } t\}= P(k,t)= \frac{(\lambda T)^k}{k!} e^{-\lambda T}$
>- La dimensione dei pacchetti è casuale con distribuzione esponenziale uguale per tutti i pacchetti 
>$\large\Pr\{\vartheta \le t\}=F_{\vartheta}(t)=1-e^{-t/\vartheta}$
>
>![[Coda singolo servitore.png]]
>

##### Utilizzazione
Il servitore alterna fasi di lavoro e fasi di pausa a causa dell'arrivo casuale delle richieste, infatti in questo modo si sprecano delle risorse perché si vorrebbe avere il servitore sempre attivo.
>[!success] Definizione
>L'**utilizzazione** è la percentuale di tempo per cui il servitore è impegnato.

In un sistema [[|ergodico]] questa è anche la probabilità di trovare un servitore occupato in un istante qualunque
$$
\large
\rho = \Pr\{\text{Servitore occupato}\} = \Pr\{\text{Pacchetto accodato}\}

$$
>[!quote] Ergodico
>Un sistema ergodico in cui la media nel tempo è uguale alla media calcolata su un insieme di tutti i possibili stati.
>In altre parole è un sistema il cui valore, dopo un determinato tempo di osservazione, converge alla media dei propri valori.


#### Cose a caso (?)
- $\large \rho = \frac{\lambda}{\mu}$   è la grandezza significativa che confronta il ritmo di arrivo con quello di servizio
- $\large \mu=\frac{1}{\overline{\theta}}$ è la grandezza detta _frequenza di servizio_ e ci dice mediamente quanti pacchetti possono essere serviti
- $\large \lambda < \mu$ non devono arrivare più pacchetti di quelli che possono essere serviti
##### Statistica del tempo di servizio
Il traffico nel sistema cambia se cambia la statistica del tempo di servizio
- **Casuale** con distribuzione esponenziale
- **Deterministico** cioè sempre uguale
>[!example] Grafico dei due tipi di distribuzione
>![[statistica del tempo di servizio.png]]
### Classico problema della progettazione di protocolli
Pacchetti di lunghezza predeterminata e tutti uguali migliorano le prestazioni in caso di accodamento, per far si che tutti i dati abbiano la stessa length si utilizza la tecnica di **Padding** aggiungendo dei bit senza significato al pacchetto per "riempirlo".
>[!example] Esempio di padding
>![[Padding.png]]

# LAN-Local Area Network
>[!success] Definizione
>Infrastruttura di telecomunicazioni che consente ad apparati indipendenti (stazioni) di comunicare in un’area limitata attraverso un canale fisico condiviso ad elevata bit rate con bassi tassi di errore
## Parametri caratterizzanti la LAN
- **L**: lunghezza massima della trama ^41772d
- **C**: velocità di trasmissione sul mezzo
- **d**: massima distanza fra due stazioni della LAN
- **v**: velocità di propagazione del segnale
- $\large \theta=$ L/C: tempo di trasmissione di una trama
- d/v: tempo di propagazione di un singolo bit sulla LAN
- Cd/v: massimo numero di bit che possono essere presenti contemporaneamente sulla LAN
## Topologie
>[!Note] Mezzo trasmissivo
>In generale nelle reti moderne le fibre ottiche stanno progressivamente sostituendo il rame ma nelle LAN, avendo dimensioni limitate, prevale ancora il rame.


### Punto-multipunto
>[!example] Bus bidirezionale
>![[Bus bidirezionale.png]]

>[!example] Bus unidirezionale
>![[Bus unidirezionale.png]]

>[!example] Doppio bus
>![[Doppio Bus.png]]

>[!example] Anello
>![[Anello.png]]

Le topologie punto-multipunto condividono lo stesso mezzo di trasmissione dando loro due caratteristiche:
- _Broadcast_: La LAN fornisce in modo nativo la comunicazione da uno a tutti, bisogna però evitare che tutti possano leggere tutti i messaggi introducendo un meccanismo di routing
- _Collisione_: Su un mezzo condiviso c'è possibilità che più utenti inviino informazione contemporaneamente generando delle interferenze che provocano una perdita di informazioni.

>[!info] WAN-Wide Area Network
>Per le WAN vengono preferite tipologie:
>- A stella
>- A maglia estesa o completa
>- Architettura gerarchica
>
>Perché le topologie punto-multipunto non sono adatte per le WAN perché operano su distanze maggiori.
## Accesso al canale di collegamento
I collegamenti possono avvenire con:
- _Canali punto-punto e commutati:_ solo sorgente e destinazione hanno accesso al canale.
- _Canali ad accesso multiplo_: più sorgenti possono accedere al canale contemporaneamente determinando quindi la __collisione__
- _Accesso al canale controllato_: Il canale condiviso viene controllato in modo centralizzato o distribuito per implementare un sistema di **collision avoidance**.

>[!note] Tecniche di accesso multiplo
>![[Tecniche di accesso multiplo.png]]

^163224

### Protocolli Medium Access Control ([MAC](https://it.wikipedia.org/wiki/Media_Access_Control))

#### A Contesa
Sono i protocolli che ammettono collisioni. Prevedono le seguenti procedure:
- **CAP-Channel Access Procedure**: È l'insieme delle procedure che la stazione effettua per realizzare l'accesso al canale ^13405d
- **CRA-Collision Resolution Algorithm**: È l'insieme delle procedure che la stazione effettua per rilevare ed eventualmente recuperare situazioni di collisioni
#### LAN Ideale
La LAN ideale utilizza un [[#^13405d|CAP]] ideale che coordina le stazioni per evitare accessi contemporanei al canale di trasmissione in modo che tutte le trame in arrivo vengano trasmesse con successo, quindi $A_s=A_0$ ([[Prestazioni#^2c29b9|As]] e [[Prestazioni#^85da12|A0]]).
Il tempo di propagazione è nullo, quindi è possibile trasmettere trame una di seguito all'altra utilizzando la LAN al 100%.
![[Screenshot 2025-11-28 alle 14.50.09.png]]
##### Efficienza con Medium Access Control Ideale
Con [[#Protocolli Medium Access Control ([MAC](https //it.wikipedia.org/wiki/Media_Access_Control))|MAC]] il canale di trasmissione non può essere usato al 100% perché una trama tiene impegnata la LAN per $T_0$ e quindi al massimo viene utilizzato per $T$ secondi ogni $T_0$.
>[!tip] Perché???
>La propagazione del messaggio richiede un tempo $T_0$ tale per cui il pacchetto riesca a percorrere il canale da un nodo all'altro, quindi gli utenti della rete non riescono effettivamente ad usare il 100% della rete perché devono aspettare che il pacchetto transiti.
>Quindi la rete viene utilizzata per tempo $T$ ogni $T_0$ secondi.
>_Un ringraziamento speciale a Cristian Di Donato aka Krwistyan_.
>


L'efficienza del MAC è
$$
\large
\eta=\frac{T}{T_0}=\frac{1}{1+a}
\\ \\ \ \text{dove} \ a=Cd/vL
$$
e pone un limite superiore al massimo [[Prestazioni#Traffico smaltito|traffico smaltito]] $A_s$ 
###### Traffico smaltito dalla LAN
- $\large A_0<\frac{1}{1+a}$ : Tutte le trame in arrivo vengono trasmesse
- $\large A_0\geq\frac{1}{1+a}$_ Il MAC non permette la trasmissione di tutte le trame

>[!example] Grafico
>![[Traffico smaltito dalla LAN.png]]

>[!success] Conclusioni
>Quindi $a$ determina le prestazioni della LAN: maggiore è la lunghezza del canale in trame, minore risulta il traffico massimo smaltibile (massimo throughput)
>![[Efficienza LAN.png]] 

## ALOHA
È un _protocollo a contesa_ nato nel 1970 per collegare tra loro le università delle Hawaii
### CAP
Quando un trasmettitore ha una trama da inviare la trasmette senza alcuna verifica preventiva perché la trama viene ritrasmessa dal satellite verso tutte le stazioni, in questo modo il mittente riceve il proprio messaggio avendo così la conferma della corretta trasmissione
### CRA
Se due stazioni trasmettono contemporaneamente i segnali il satellite scarta le trame non correttamente ricevute, in questo modo il mittente non riesce ad avere conferma dell'invio del messaggio e fa partire l'algoritmo di **back-off**
### Prestazioni
Ipotizziamo l'arrivo delle trame alle stazioni secondo un _processo di Poisson_ con frequenza media di arrivo $\lambda$.
Tenendo conto delle ritrasmissioni, il numero medio di pacchetti trasmessi in effetti al satellite nell'unità di tempo è $\large \lambda_r>\lambda$. Le collisioni generano delle correlazioni fra gli arrivi, ma se l'intervallo di back off è abbastanza lungo rispetto a $T$ ($T_b>>T$), anche il traffico verso il satellite si può considerare approssimativamente di Poisson.
#### Traffico offerto e smaltito
**Ipotesi**:
- Trame tutte uguali di lunghezza pari a [[#Parametri caratterizzanti la LAN|L]] e quindi richiedono tempo di trasmissione pari T
##### Traffico offerto dalle applicazioni
$$
A_0=\lambda T
$$
##### Traffico offerto al MAC
$$
G=\lambda_rT
$$

A causa delle collisioni si ha $\lambda_r\leq\lambda$ e il traffico smaltito è pari al traffico offerto che viene trasmesso senza collidere $$
 A_s=GP_0 \ \ P_0 \ \text{è la probabilità che una trama venga trasmessa senza collidere}$$
#### Intervallo di vulnerabilità
L'**intervallo di vulnerabilità** $T_v$ è l'intervallo all'interno del quale una trasmissione può dar luogo a collisione.
Per il protocollo [[#ALOHA|ALOHA]] $\ T_v=2T$ perché la trama considerata inizia a $t_0$ e finisce in $t_0+T$.
Si ha collisione se:
- il primo bit della trama considerata si sovrappone all'ultimo della trama precedente
- il primo bit di una nuova trama si sovrappone all'ultimo della trama considerata
Quindi le trame non possono essere trasmesse per un tempo $T$ prima di $t_0$ e per un tempo $T$ successivo a $t_0$
#### Calcolo Throughput
La probabilità di non avere una trasmissione in $2T$ (prob. di non collisione) è $$\large P_0=e^{-2\lambda_rT}=e^{-2G}$$ Quindi il numero medio di trasmissioni aventi successo (traffico smaltito $A_s$) è pari a $$A_s=Ge^{-2G}$$
Quindi il valore massimo di $A_s$ è $$\large A_s^{\text{max}}=\frac{1}{2e} \approx 0.18 \ \text{per}\ G=0.5$$
##### Throughput ALOHA
$A_s \approx G$ per piccoli valori di G
$A_s \rightarrow 0$ per grandi valori di G
![[ALOHA throughput.png]]
### Slotted ALOHA
Per migliorare l'ALOHA si implementa un sistema _sincrono_ che divide in intervalli (_slot_) di lunghezza T dividendo le trame per essi.
>[!info] Funzionamento
>Prima di iniziare le trasmissioni la stazione deve acquisire il sincronismo, inviando trame di tentativo e rivelando come si posizionano rispetto agli slot.
>Quindi due trame o si sovrappongono completamente o per nulla.
>![[Slotted ALOHA.png|560]]

L'[[#Intervallo di vulnerabilità|intervallo di vulnerabilità]] si riduce a $T$:
- $\large P_0=e^{-G}$
- $\large A_s=Ge^{-G}$
- $\large A_s^{\text{max}}=\frac{1}{e}\cong0.36 \ \text{per} \ G_{\text{max}}=1$  

![[intervallo di vulnerabilità slotted aloha.png|580]]
### Algoritmi di back-off
#### Aloha classico
Viene scelto in modo random (probabilità uniforme) il nuovo istante di trasmissione nell'intervallo $0$ e $T_b$ ($T_b>>T$ per rendere piccola la probabilità di una nuova collisione)
#### Aloha slotted
Si trasmette negli istanti di sincronismo in due modi:
- Prendendo $T_b=n_bT$ e sceglie a caso fra $0$ e $n_b-1$
- Ritrasmettendo nel primo slot utile con probabilità $p_b$ e si passa allo slot successivo con probabilità $1-p_b$; ripetendo l'algoritmo ad ogni slot finché non si trasmette.
### Traffico offerto e smaltito
- In condizioni di equilibrio il traffico offerto al sistema deve essere uguale al traffico smaltito $$A_0=A_s$$
- Per effetto delle fluttuazioni statistiche del traffico su brevi intervalli di tempo risulterà $A_0\neq A_s$. 
	- Se $A_0<A_s^{\text{max}}$ la dinamica naturale del sistema tende a portarsi in equilibrio
	- Se $A_0>A_s^{\text{max}}$ è impossibile raggiungere una situazione di equilibrio, i dati si accumulano nello strato superiore al MAC, in quanto una buona parte di essi non riesce mai ad essere trasmessa.
### Stazioni backlogged e stabilità
Le stazioni _backlogged_ sono le stazioni che subiscono una collisione e non hanno nuovi pacchetti da trasmettere ma un vecchio pacchetto che va ritrasmesso.
Quindi definendo la frequenza media di arrivo delle trame da ciascuna stazione come $\lambda_i$ se la stazione:
- Non è backlogged $\lambda_i=\lambda$
- È backlogged $\lambda_i$ perché non invia nuove trame

Con $k$ stazioni backlogged il traffico offerto vale $$\begin{aligned}
A_0=\lambda T(N-k) \\ N=\text{numero totale di stazioni}
\end{aligned}$$
#### Stabilità
Se:
- $A_0>A_s$ si accumula traffico $\large \Rightarrow$ si hanno collisioni $\large \Rightarrow$ le stazioni backlogged aumentano $\large \Rightarrow$ $A_0$ cala e $k$ cresce.
- $A_0<A_s$ si smaltisce più traffico di quello nuovo in arrivo $\large \Rightarrow$ si trasmettono trame che hanno colliso in precedenza $\large \Rightarrow$ le stazioni backlogged $\large \Rightarrow$ $A_0$ cresce e $k$ cala
##### Controlled Aloha
Per ovviare al problema dell'instabilità si fa crescere il tempo di back-off: alla prima collisione si pone $T_b=T_0$, se la trama ritrasmessa collide di nuovo si pone $T_b=2T_0$ e si continua a raddoppiare ad ogni nuova collisione. Quando la trasmissione ha successo si ritorna a $T_b=T_0$, nel caso dello slotted aloha si può dimezzare $p_b$ ad ogni collisione.
Questo algoritmo si dice _back-off esponenziale_ e si può dimostrare che elimina l'instabilità.
## CSMA-Carrier Sensing Multiple Access
Nasce successivamente al protocollo [[#ALOHA|ALOHA]].
**Carrier Sensing**: ogni stazione che deve trasmettere _rivela_ presenza si segnale sul bus e trasmette solo se è libero, se il bus è occupato si aspetta la fine della trama per: ^87931b
- trasmettere (caso 1 _persistent_)
- far partire l'algoritmo di back-off (caso non persistent)
- trasmettere con probabilità $p$ e far partire l'algoritmo di back-off con probabilità $(1-p)$ (caso $p$ persistent)

A caso del ritardo di propagazione non nullo, una volta iniziata la trasmissione, i dati inviati da una stazione possono collidere con quelli di un'altra. Sul bus non c'è un meccanismo immediato di rilevazione delle collisioni, quindi occorre affidarsi su un sistema di Acknowledgement.
### Intervallo di vulnerabilità
Siano
- $A$ e $Z$ le due stazioni più distanti sul bus
- $\tau$ il tempo di propagazione fra di loro più il tempo necessario per rivelare il segnale
A esegue il [[#CSMA-Carrier Sensing Multiple Access|carrier sensing]] all'istante $t_A$:
- Se $Z$ fa carrier sensing fra $t_A$ e $t_A+\tau$ non rivela attività e può quindi anch'essa iniziare a trasmettere $\large \Rightarrow$ _si ha una collisione_
- Analogamente se $Z$ ha trasmesso fra $t_A$ e $t_A-\tau$ $A$ non rivela segnale da $Z$ e trasmette in $t_A$ $\large \Rightarrow$ _si ha una collisione_

>[!success] L'intervallo di vulnerabilità vale $\large 2\tau$
>

Le prestazioni sono tanto migliori dell'ALOHA quanto più $\large \frac{\tau}{T}<1$ 
### Slotted CSMA
Anche il CSMA ha una versione slotted, in questo caso si ha:
- **Tempo di slot**  $=\tau$.
- **Intervallo di vulnerabilità** $=\tau$ invece che $2\tau$
## CSMA/CD-CSMA Collision Detection
Un miglioramento de [[#CSMA-Carrier Sensing Multiple Access|CSMA]] si ha con il _Collision Detection_, per il quale una stazione è in grado di rilevare l'avvenuta collisione rimanendo in ascolto sul mezzo mentre trasmette.  Tale processo è analogico basato sulla rilevazione di potenza sul canale.
>[!info] In caso di collisione
>Si ferma subito la trasmissione e si invia una particolare sequenza di bit (_sequenza di jamming_) per informare tutte le altre stazioni dell'avvenuta collisione

### Codifica di Manchester
La **codifica di Manchester** utilizza due livelli di tensione:
- $\large 1$ : $-V$ (segnale basso) per mezzo periodo e $+V$ (segnale alto) per l'atro mezzo
- $\large 0$ : $+V$ per mezzo periodo e $-V$ per l'altro mezzo

Permette di prevenire la perdita di sincronizzazione del clock oppure eventuali errori di bit.
>[!success] Pro
>- Una transizione al centro di ogni bit facilita:
>	- L'acquisizione del sincronismo
>	- Il carrier sensing
>	- Il collision detection
>- Sono disponibili simboli ($+V$ o $-V$ consecutivi) per rappresentare "non dati"

>[!fail] Contro
>Per trasmettere a `10 Mb/s` occorre un clock a `20 MHz `

#### Nel CSMA/CD
Il CSMA/CD con codifica di Manchester è stato adottato nella rete Ethernet, standard di mercato per la LAN.
>[!faq] Cosa migliora?
>- Nel CSMA le stazioni continuano la trasmissione dell'intera trama, il canale rimane impegnato inutilmente per un intervallo di tempo all'incirca pari a $T$
>- Nel CSMA/CD al più il canale rimane impegnato inutilmente al più per la somma di un intervallo di vulnerabilità, il tempo necessario a rilevare la collisione più tempo della sequenza di Jamming

## TOKEN RING
Il **Token Ring** è un protocollo [[#^163224|controllato]] in cui non si possono verificare collisioni ed è utilizzata solo nelle topologie ad anello.
È basata sull'utilizzo di un **token** che dà il diritto di trasmissione alle stazioni indicando se la linea è libera o occupata tramite un _token bit_ all'interno di una trama che percorre continuamente la rete.
>[!info] Funzionamento
>Chi è in possesso del token accede al mezzo, la stazione che vuole trasmettere attende che passi un token libero, lo occupa e vi appende le informazioni in coda

### Definizioni
- **T-Tempo di trasmissione**: Tempo necessario per la trasmissione di una trama di lunghezza
- **T~acc~-Tempo di accesso**: Tempo che una stazione deve attendere per vedere un token libero e quindi essere trasmessa
- **T~lat~-Tempo di latenza**: Tempo che impiega un bit a fare un giro completo dell'anello e dipende dalla lunghezza dell'anello e dal ritardo introdotto dalle stazioni
- **THT-Token Holding Time**: Tempo di utilizzo del token per ogni stazione
- **TRT-Token Rotation Time**: Tempo impiegato da un token lasciato libero a tornare libero alla stessa stazione
### Rimozione delle trame
La trama una volta ricevuta deve essere rimossa dall'anello, ci sono due modi per farlo:
- **Modalità parzialmente diffusiva**: la trama viene rimossa dalla _stazione ricevente_ che libera anche il token, prima di ritrasmettere occorre leggere almeno l'indirizzo del destinatario, così facendo non si ha la verifica di corretta trasmissione perché il mittente non riceve una conferma (ACK), a favore della latenza.
- **Modalità diffusiva**: la trama viene rimossa dalla _stazione trasmittente_ e libera il token, la stazione ricevente può appendere un ACK alla trama, ogni stazione può ritrasmettere le trame immediatamente con un ritardo di un solo bit. La _rigenerazione del token_ avviene in tre modalità:
	- _Single frame_: il token viene generato quando la stazione ha ricevuto indietro l'intera trama 
	- _Single token_: viene generato quando la stazione ha ricevuto il token della trama trasmessa
	- _Multiple token_: appena la stazione ha finito di trasmettere la trama viene rigenerato il token

>[!warning] SKIP
>Ho skippato il tempo di accesso, se mi devo imparare quella roba la faccio finita.

### Monitor
In caso di malfunzionamenti di stazioni possono verificarsi situazioni di emergenza, qui interviene un supervisore chiamato **monitor** che può essere scelto tra qualsiasi stazione.
>[!example] Esempio di malfunzionamento
>Un tipico problema è una stazione trasmittente che non rimuove la trama e questa circola indefinitamente nell’anello.
>Per rimuoverla il Monitor dispone di un bit $M$ nel campo token, che è sempre $0$ quando un nuovo token viene generato e viene marcato a $1$ dal monitor ogni volta che questo riceve una trama: se il monitor riceve una trama con $M=1$ la rimuove.
#### Sincronizzazione e ritrasmissione bit per bit
**Sincronismo asservito**: Il sincronismo viene ricavato dal segnale ricevuto e usato per il segnale trasmesso.
Occorre almeno una stazione nell'anello che genera sincronismo e lo ripristina con un buffer elastico, tipicamente compito del [[#Monitor|monitor]].
Per rendere minimo il tempo di latenza il ogni stazione ritrasmette ogni singolo bit appena lo ha ricevuto.
>[!warning] Problema
>Un inconveniente è che le trame devono essere ritrasmesse prima del controllo di correttezza e potrebbero contenere errori.

### Token passing o Token Bus
Usa il concetto di token in una topologia a bus: le stazioni formano un anello logico in cui ognuna ha un predecessore ed un successore. La stazione che possiede il token può usarlo per un [[#^7ce477|THT]]. 
Il passaggio del token avviene inviando al successore una trama apposita.
L'anello logico si forma e si modifica dinamicamente:
- La stazione che vuole uscire dall’anello attende di avere il token e poi lo comunica al predecessore e al successore
- Per l’ingresso nell’anello occorre che una stazione prima di passare il token faccia un polling invitando chi vuole ad entrare, se più stazioni vogliono entrare si apre una fase a contesa

>[!faq] Protocolli a contesa o collision free?
>>[!success] Vantaggi
>>**Contesa**:
>>- Maggior semplicità
>>- Maggior efficienza a basso traffico
>>
>>**Collision free**:
>>- Tempo di consegna di una trama superiormente limitato in modo deterministico
>>- Assenza di problemi di stabilità
>>- Miglior sfruttamento della capacità del canale ed alto traffico
>
>I protocolli collision free sono statti ritenuti migliori per applicazioni con problemi real time, in queste applicazioni il token bus è stato preferito rispetto al token ring, se si capita un malfunzionamento e contemporaneamente il monitor ha un guasto, il token ring si blocca per un tempo imprevedibile.
>Comunque il protocollo standard di mercato è l'Ethernet e gli altri stanno sparendo.

### Tempo di accesso
Con _n_ stazioni si ha TRT$\leq$ n THT
# Progetto IEEE 802
Nel 1980 parte il **Progetto IEEE 802** per tentare di definire degli standard per LAN.
Lo strato 2 viene suddiviso in:
- **LLC Logical Link Control**: È indipendente dal mezzo fisico, dalla topologia e dal protocollo di accesso
- **MAC [[#Protocolli Medium Access Control ([MAC](https //it.wikipedia.org/wiki/Media_Access_Control))|Medium Access Control]]**

![[Livelli IEEE 802.png]]
## Rete Ethernet IEEE 802.3
### Campi del frame
- **Preamble**: Avendo 7 byte a bit alternati permette alle stazioni riceventi di sincronizzarsi con il clock del trasmettitore ^78c68c
- **SFD-Start Frame Delimiter**: Un byte (`10101011`) ha la funzione di flag di inizio frame ^584c95
- **Lunghezza/Tipo**: Per IEEE 802.3 la lunghezza indica quanti byte ci sono nel campo dati, per Ethernet indica il tipo di payload contenuto nel campo dati
- **Dati**: Contiene il payload del livello superiore
- **Pad**: Se il frame (esclusi [[#^78c68c|preamble]] e [[#^584c95|sfd]]) è più corto di 64 byte, con questo campo lo si porta a 64 byte
- **Frame Checking sequence**: Contiene i bit di ridondanza per il codice di controllo dell'errore di tipo polinomiale di grado 32
- **Indirizzi**: Composti da 6 byte, sono cablati nella scheda di rete e sono univoci a livello mondiale; i primi 3 byte individuano il costruttore e gli altri 3 numerano progressivamente le schede.
>[!faq] Inter-Frame Gap (IFG)
>Due frame devono essere separati almeno da un **Inter-Frame Gap**, cioè 96 tempi di bit:
>- 10 Mbps Ethernet $9,6\ ns$ 
>- 100 Mbps Ethernet $960\ ns$ 
>- 1000 Mbps Ethernet $96\ ns$ 

### Collision Domain
>[!info] Definizione
>È l'insieme delle stazioni connesse alla medesima rete Ethernet che possono collidere in trasmissione

Per garantire il corretto funzionamento del [[#CSMA/CD-CSMA Collision Detection|CSMA/CD]] si devono imporre vincoli alla dimensione massima della LAN in funzione della dimensione delle trame e della velocità di trasmissione.
Inoltre il mezzo trasmissivo impone dei vincoli sulle dimensioni dei collegamenti (attenuazione, rumore).
La dimensione fisica del collision domain è conseguenza delle tecnologie adottate per lo strato fisico
### Broadcast Domain
Una trama MAC con `Destination address = ff.ff:ff:ff:ff:ff:ff` viene ricevuta da tutte le interfacce LAN, realizzando così una comunicazione [[I protocolli Internet#Broadcast|broadcast]] dalla sorgente a tutte le destinazioni LAN.
>[!tip] Indirizzo fisico
>L'indirizzo fisico di una macchina è l'indirizzo a livello [[#Protocolli Medium Access Control ([MAC](https //it.wikipedia.org/wiki/Media_Access_Control))|MAC]] della sua schede di rete.
>
## Ethernet classica a 10Mb/s
### 10base5
- **10**: velocità 10 Mb/s con codifica Manchester
- **base**: trasmissione in banda base (senza modulazioni)
- **5**: segmenti fino a 500 metri e cavo coassiale a 50 $\Omega$ 
### 10base2 (thin wire Ethernet)
Altro tipo di cavo utilizzato principalmente come backbone.
### 10baseT
Usa cavi di tipo [[Strato Fisico#UTP-Unshielded Twisted Pair|UTP]] cat. 3.
### 10baseF
Alternativa in fibra di 10baseT.
>[!tip] Storia
>Nel 1992 si necessitava di LAN più veloci quindi il comitato 802.3 si riunì per decidere se semplicemente velocizzare il progetto 802.3 oppure definirne uno nuovo a favore di traffico real-time, voce digitale, ecc.
>Si decise di continuare con il progetto già esistente e chi era a favore della rielaborazione di un nuovo progetto formò il comitato 802.12
### 100baseT4
Collegamento più veloce formato da cavi [[Strato Fisico#UTP-Unshielded Twisted Pair|UTP]] cat. 3(Uno con direzione Hub-stazione e uno opposto).
Ovviamente si ha una =={green}connessione più veloce==
### 100baseTX
Come 100baseT4 ma con cavi di cat. 5.

### 100baseFX
Cavo in fibra multimodale

### IEEE 802.3z
Standard che definisce reti Gigabit
#### 1000baseSX e 1000baseLX
Due alternative in fibra ottica:
- **1000baseSX** multimodale
- **1000baseLX** monomodale o multimodale
#### 1000baseCX
Usa 2 coppie di cavi [[Strato Fisico#STP-Shielded Twisted Pair|STP]].
#### 1000baseT
Utilizza 4 coppie UTP di cat. 5.
>[!warning] Attenzione!
>L'elenco di tipi di Ethernet lo ritengo poco significativo quindi le descrizioni sono molto approssimative.




# Cablaggio
Per il cablaggio bisogna ricorrere all'utilizzo di diversi componenti in un sistema gerarchico che ora vedremo, la struttura di esso è definita dallo standard di mercato _EIA/TIA 668_ o _ISO 11801_.

- **Prese a muro**: Punti di accesso alla LAN per l’utente finale. Localizzate in prossimità delle postazioni di lavoro.
- **Cablaggio orizzontale o di piano**: Cavidotti e cavi che collegano le prese a muro con l’armadio di rete realizzando una topologia a stella.
- **Armadio di rete**: Punto di arrivo del cablaggio orizzontale e contenitore degli apparati attivi della LAN (hub, switch, bridge, router).
- **Cablaggio verticale**: Interconnette più armadi di rete per realizzare una LAN estesa.
# Wireless LAN (Wi-Fi)
Lo standard **IEEE 802.11** definisce il metodo di comunicazione Ethernet ma sfruttando il mezzo radio.

## IEEE 802.11
Si occupa della trasmissione fisica delle trame secondo le specifiche stabilite interagendo con lo strato MAC per segnalare l'attività del canale.
Viene utilizzata la banda **ISM (Industrial, Scientific, Medical)** a 2.4 GHz.
>[!info] Banda ISM
>Essendo l'utilizzo libero, occorre una regolamentazione per evitare abusi per ridurre le interferenze. In Italia il D.M. 28 Maggio 2003 stabilisce le regole nel nostro paese riguardanti l'utilizzo della banda ISM
^5fff59
### Architettura
>[!example] 
>![[Architettura 802.11.png]]

>[!Example] Alternativa peer-to-peer
![[Independent BSS.png|500]]

^7bf77d

>[!example] Extended Service Set (ESS)
>![[Screenshot 2025-12-02 alle 10.04.25.png]]
>Occorre gestire l'associazione delle stazioni agli Access Point.
>Permette la mobilità delle stazioni trasparente agli strati superiore configurando gli Access Point come _bridge_ tra WLAN e LAN, così l'intero ESS è visto come un'unica LAN (unico dominio di broadcast)
#### Problemi ad accesso multiplo al canale
A differenza delle LAN cablate, in cui tutti ricevono quello che viene trasmesso, nelle WLAN ci sono problemi specifici:
- **Stazione nascosta**: Una stazione vuole comunicare con un'altra ma non riesce a comunicare perché il destinatario è occupato
>[!example] stazione nascosta
>![[stazione nascosta.png]]
- **Stazione esposta**: Una stazione vuole comunicare con un altra ma non gli è possibile perché rileva, tramite [[#^87931b|carrier sensing]], un'interferenza generata da un'altra stazione che sta comunicando con qualcuno
>[!example] stazione esposta
>**S2** vuole trasmettere a **R2** ma non riesce perché "sente" la trasmissione di **S1** a **R1**
>![[stazione esposta-1.png]]

>[!warning] Problema
>LA natura _half-duplex_ (trasmissione bidirezionale alternata) delle interfacce WLAN impedisce l'uso del collision detect, rendendo così impossibile usare [[#CSMA/CD-CSMA Collision Detection|CSMA/CD]] come nel 802.3.

>[!Success] Soluzione
>Si usa il **Carrier Sensing Multiple Access** con **Collision Avoidance (CSMA/CA)** in due modalità:
>- **Distributed Coordination Function (DCF)**: l'accesso al canale è gestito in modo distribuito
>- **Point Coordination Function (PCF)**: l'accesso al canale è gestito dall'Access Point
##### DCF
Prima di inviare una trama, il mittente invia al destinatario un **Request To Send (RTS)** in modo che le altre stazioni che lo ricevono sanno che il canale sta per essere occupato e quanto a lungo lo sarà. Se il destinatario è in grado di ricevere risponde con un **Clear To Send (CTS)** (anche le stazioni che vedono il destinatario ma non il mittente si accorgono del canale che sta per essere occupato).
Per ogni trama corretta il ricevitore invia un _ACK_ al mittente, se scade il time-out prima della ricezione di ACK il mittente ritrasmette il frame (Ripetendo RTS).
##### PCF
La gestione dei canali è attribuita al Access Point tramite l'utilizzo del canale a polling: viene trasmesso periodicamente un segnale di **beacon** che permette
- La sincronizzazione delle stazioni
- La rilevazione della presenza dell'AP
- La possibilità di entrare nel processo di polling

Quando una stazione viene attivata, essa scandisce i canali disponibili e cerca i beacon di eventuali AP con cui associarsi (Il beacon mostra l'**SSID** che identifica l'AP).
### Trama MAC 802.11
>[!exemple] Header MAC 802.11
>![[mac-frame-structure.png]]
- **Type**: data, control management
- **Subtype**: RTS,CTS,ACK,...
- **To DS, From DS**: diretto a o proveniente dal sistema di distribuzione
- **MF**: More fragments
- **Retry**: è una ritrasmissione
- **Pwr**: gestione dell'alimentazione delle stazioni (sleep, wake-up)
- **More**: altri frame a seguire
- **W**: dati cifrati con _WEP(?)_
- **Order**: mantenere l'ordine di sequenza dei frame
- **Duration**: durata del frame e del relativo ACK
- **Address 1...4**: indirizzi MAC di mittente, destinatario, Tx e Rx radio (usati secondo le situazioni specifiche)
- **Sequence**: numerazione delle trame in sequenza
- **Checksum**: codice di controllo d'errore
### Indirizzamento
- **[[#Architettura|BSS/ESS]] Uplink**: La stazione comunica con AP.
![[Indirizzamento uplink.png]]
- **[[#Architettura|BSS/ESS]] Downlink**: AP manda il messaggio alla stazione destinataria.
![[indirizzamento downlink.png]]

>[!Note] ESS con Wireless Distribution System
>![[Indirizzamento WDS.png]]
### IEEE 802.11a
Implementa il Wi-Fi a banda larga utilizzando [[#^5fff59|ISM]] a 5 GHz.
Offre una maggiore larghezza di banda ma ha limiti sulla potenza massima trasmessa:
- Copre distanza non troppo grandi.
- Penetra con difficoltà negli oggetti.
### IEEE 802.11b
Implementa il Wi-Fi a banda larga utilizzando [[#^5fff59|ISM]] a 2.4 GHz. facendo uso di **High-Rate DSSS** (???).
Inoltre riesce ad adattare il bit rate alle condizioni del canale tramite il _Dynamic Rate Shifting_.
# Interconnessione di LAN
Per interconnettere le LAN si fa uso di diversi dispositivi:
- **Repeater**
- **Bridge**
- **[[Router|Router]]**
- **[[I protocolli Internet#Gateway|Gateway]]** 
## Repeater
È un apparato attivo che collega 2 o più mezzi di trasmissione operando a livello 1 di ISO/OSI.
Permette l'estensione del mezzo di trasmissione amplificando il segnale _"ripetendo"_ (rigenerando) i bit entranti in modo che siano anche sincronizzati.
Con questo dispositivo è possibile estendere una tipologia LAN.
## Bridge
È un apparato che opera a livello 2 dello stack ISO/OSI e permette di interconnettere LAN di tipo diverso eseguendo
- controlli a livello [[#Protocolli Medium Access Control ([MAC](https //it.wikipedia.org/wiki/Media_Access_Control))|MAC]] 
- conversioni del formato di trama

E permette di separare i [[#Collision Domain|domini di collisione]].
### Learning Bridge
Il **bridge** è in grado di imparare quali stazioni sono connesse ad una porta analizzando il _source address_ dei pacchetti MAC, per poi eseguire un instradamento a livello di trama inviando solo sulla porta di uscita su cui si trova il destinatario di un pacchetto.
### Filtering Bridge
Imparando le associazioni delle stazioni alle varie porte riesce separare il traffico dei diversi domini di collisione.

>[!example] Esempio di Bridge
>![[Esempio di bridge.png]]

## Switch
Uno switch è un dispositivo in una rete di computer che collega insieme altri dispositivi. Più cavi di rete sono collegati a uno switch per abilitare la comunicazione tra diversi dispositivi. Gli switch gestiscono il flusso di dati attraverso una rete trasmettendo un pacchetto di rete ricevuto solo a uno o più dispositivi per i quali il pacchetto è destinato. Ogni dispositivo collegato in rete a uno switch può essere identificato dal suo indirizzo MAC, consentendo allo switch di dirigere il flusso del traffico massimizzando la sicurezza e l'efficienza della rete. (Fonte [Wikipedia](https://it.wikipedia.org/wiki/Switch#:~:text=Uno%20switch%20è,l'efficienza%20della%20rete.))
### HUB
L'HUB è un dispositivo che invia i pacchetti a tutti i dispositivi presenti, il difetto è che tutti i pacchetti al di fuori di quelli per il diretto interessato vanno persi; così facendo si viene a creare un traffico inutile. Nel caso diffuso delle reti Ethernet], esso inoltra i dati in arrivo da una qualsiasi delle sue porte su tutte le altre, cioè in maniera diffusiva (_broadcasting_). (Fonte [Wikipedia](https://it.wikipedia.org/wiki/Hub_(informatica)#:~:text=L'HUB%20è%20un,maniera%20diffusiva%20(broadcasting).))

>[!Success] Conclusioni
>Possiamo allora dire che lo **switch** svolge una funzione simile a quella dell'HUB senza generare traffico inutile e con le capacità di imparare come il [[#Learning Bridge|bridge]] perché associa ad ogni propria porta un host a cui fare il forwarding dei pacchetti.

>[!Warning] N.B.
>Lo switch non esegue instradamento (routing) ma operazioni di _forwarding_ perché opera a livello 2 (Data Link), quindi non guarda gli IP ma lavora sugli indirizzi MAC

