Gli algoritmi di instradamento si pongono come obiettivo principale di scegliere il percorso, da sorgente a destinatario, più veloce che i pacchetti devono prendere.
In realtà la scelta del percorso spesso significa trovare il prossimo [[Router|router]] a cui inviare un pacchetto (scelta del _[[I protocolli Internet#^678cfd|next hop]]_).
Un algoritmo deve essere: ^67528c
- **Semplice**: avere bassa complessità computazionale
- **Robusto**: essere capace di adeguarsi a cambiamenti
- **Stabile**: avere consistenza dei risultati
- **Efficiente**: avere buon uso delle risorse disponibili senza sprechi
Gli algoritmi possono o meno fare uso delle [[I protocolli Internet#Tabella di Instradamento|tabelle di routing]] presenti nei router. 
>[!tip] Dinamicità
>Tutte le metodologie di instradamento dovrebbero adattarsi ad eventuali cambiamenti della topologia di rete.
>Ci sono due comportamenti per effettuare il cambiamento dell'instradamento:
>- **Statico**: I percorsi vengono decisi al momento dell'inizializzazione della rete e cambiano solo se la rete viene inizializzata di nuovo, se cambia la topologia la rete non "reagisce" 
>- **Dinamico**: I percorsi si modificano periodicamente per adattarsi ad eventuali cambi topologici

## Algoritmi senza tabella
### Flooding
Ogni nodo ritrasmette su tutte le porte di uscita ogni pacchetto ricevuto, prima o poi un pacchetto raggiungerà un nodo che conosce il destinatario, il primo pacchetto che arriva è quello che ha fatto la strada più breve.
Non vi è elaborazione per questo algoritmo.
È adatto in situazioni di [[I protocolli Internet#Broadcast|broadcasting]].
>[!fail] Problema
>Nel singolo nodo ogni pacchetto viene copiato tante volte quante sono le interfacce se ritrasmesso sull’interfaccia da cui è arrivato il numero di copie cresce esponenzialmente

>[!success] Soluzioni
>- Un nodo non ritrasmette il pacchetto nella direzione dalla quale è giunto
>- Si associa un _id_ ad ogni pacchetto, se il pacchetto è già stato trasmesso viene ignorato

### Random
Il _next hop_ viene scelto a caso fra quelli possibili. ^4553d5
>[!fail] Problemi
>Non garantisce in tempi certi la consegna dei pacchetti e potrebbe dar luogo a comportamenti instabili come dei _loop_
### Deflection routing (hot potato)
Ogni nodo quando riceve un pacchetto lo ritrasmette sulla linea d'uscita con il minor numero di pacchetti in attesa di essere trasmessi (sulle vie più libere).
È adatto a reti in cui i nodi hanno poca memoria o se si desidera minimizzare il tempo di permanenza dei pacchetti.
>[!fail] Problemi
>- I pacchetti possono arrivare fuori sequenza
>- In alcuni casi i pacchetti potrebbero vagare all'infinito per la rete se il percorso verso la destinazione dovesse essere più occupato rispetto ad altre linee
>	- Bisogna prevedere un meccanismo per limitare la vita dei pacchetti
>- Non tiene conto della destinazione finale del pacchetto

## Algoritmi con tabella
### Store-and-Forward
Il nodo che riceve il pacchetto
1. Verifica l'integrità di esso
2. Estrae le informazioni dall'[[I protocolli Internet#Significato delle Definizioni PDU (Protocol Data Unit) PCI|intestazione]] (indirizzo, priorità, tipo di servizio)
3. Confronta le informazioni con la tabella di routing
4. Il pacchetto viene inserito nella coda relativa all'uscita prescelta
>[!warning] Svantaggio
>Il pacchetto deve arrivare interamente per essere memorizzato e ritrasmesso da ogni nodo, quindi se c'è un ritardo tra due nodi si ha un effetto a catena di ritardi sul resto della rete

#### Shortest path routing
La rete viene rappresentata come un grafo pesato:
- **nodo**: terminali e commutatori (router) 
- **archi**: collegamenti tra router
- **peso** può essere espresso come:
	- numero di nodi attraversati
	- distanza geografica
	- ritardo introdotto dal collegamento
	- inverso della capacità del collegamento
	- costo di un certo instradamento
	- una combinazione dei precedenti
L'implementazione viene fatta tramite l'utilizzo di algoritmi di path finding come _Bellman-Ford_ e _Dijkstra_, il calcolo può essere:
- **Centralizzato**: Un nodo calcola i percorsi per tutti gli altri nodi
- **Distribuito**: Ogni nodo esegue i calcoli per se
	- _Sincrono_: Tutti i nodi eseguono il calcolo nello stesso istante
	- _Asincrono_: I nodi eseguono lo stesso passo dell'algoritmo in momenti diversi
##### Procedimento
Per costruire il grafo della rete i nodi utilizzano uno o più protocolli per scambiarsi le informazioni delle loro tabelle di routing (popolate tramite configurazione statica o [[I protocolli Internet#DHCP (Dynamic Host Configuration Protocol)|DHCP]]) e successivamente applicano gli algoritmi per il calcolo degli _shortest path_
#### Routing Distance Vector
È un algoritmo basato su Bellman-Ford, in versione dinamica e distribuita proposta da Ford-Fulkerson.
Implementa meccanismi di dialogo per far si che ogni nodo possa scoprire i suoi vicini, calcolarne la distanza da se stesso e, ad ogni passo, inviare ai propri vicini un vettore contenente la stima della sua distanza da tutti gli altri nodi della rete.
>[!success] Pro
>È un protocollo semplice e richiede poche risorse

>[!fail] Problemi
>Convergenza lenta, partenza lenta (_cold start_)
>Problemi di stabilità: _conteggio all'infinito_
##### Cold start e tempo di convergenza
Allo start-up ogni nodo conosce solo i nodi vicini immediati, quindi si scambiano i distance vector per popolare le tabelle, questa operazione ha un _tempo di convergenza_ pari a $\theta(V)$.
Se lo stato della rete cambia durante la convergenza si ha un risultato imprevedibile che implica un ritardo nella convergenza.
##### Bouncing effect
Quando si perde il link tra due nodi si può causare il **bouncing effect**:
- Se due nodi si accorgono della perdita del collegamento inizializzano a peso $+\infty$ 
- Se erano già stati inviati dei distance vector si possono creare delle incongruenze temporanee, a volte possono dare luogo a cicli, quindi due nodi si scambiano datagram fino a scadenza del [[I protocolli Internet#^c5ab81|TTL]] o finché la rete non converge di nuovo
##### Count to infinity
![[count to infinity.png]]
$B$ scopre $C$ e segna che ha distanza 1, quindi viene inviato il distance vector ad $A$ che si segna la distanza $AC=2$, nel mentre la connessione $BC$ salta e $B$ si segna $BC=\infty$, $A$ invia il suo distance vector a $B$ e vede che c'è un percorso per arrivare a $C$ quindi $BC=AC+AB=3$. Questo procedimento viene ripetuto all'infinito.
>[!success] Soluzioni
>>[!note] Split horizon
>>È una tecnica usata per risolvere il problema del conteggio all'infinito:
>>Se $A$ instrada i pacchetti verso una destinazione $X$ tramite $B$ non ha senso che $B$ cerchi di raggiungere $X$ tramite $A$, quindi $A$ non renderà nota a $B$ la sua distanza da $X$.
>
>>[!note] Triggered Update
>>Per migliorare i tempi di convergenza si usa il **Trigger Update** che consiste nell'inviare il proprio distance vector qualora si verifichi una modifica della propria tabella di instradamento

^b400eb

>[!warning] Ma non basta...
>Le soluzioni proposte non sono risolutive, sono ancora presenti situazioni problematiche in cui si ha una convergenza troppo lenta o addirittura non si raggiunge una convergenza

#### Routing link state
Questo protocollo fa si che ogni nodo possa essere a conoscenza del grafo della rete scambiando informazioni con i vicini:
- **Hello Packet**: Ogni router "impara" gli indirizzi dei vicini
- **Echo Packet**: Ogni router misura la distanza dai vicini

Ogni router si salva queste informazioni nei **Link State Packet** (**LSP**) e li scambia con i suoi vicini tramite [[Algoritmi di instradamento#Flooding|Flooding]] in modo che poi una volta ricostruito il grafo della rete vi si possa applicare Dijkstra per calcolare i cammini minimi verso ogni altro router.




