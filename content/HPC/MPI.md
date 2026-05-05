**Message Passing Interface (MPI)** è l'interfaccia che permette lo sviluppo di programmi paralleli tramite _message passing_. È utilizzato principalmente per la programmazione di supercomputer e cluster.

>[!info] SPMD - Single Program Multiple Data
>Lo stesso programma è eseguito da `P` processori, ognuno dei quali sceglie un proprio percorso di esecuzione scelto in base al ID.

Per permettere la comunicazione (message passing) tra processi, in modo che si possa avere sincronia, è necessario far uso di _subroutines_:

**Subrutine** per
- _Comunicazione_
	- a coppie o punto a punto
	- coinvolgere più processi
- _Sincronizzazione_
	- barriere
	- non sono necessari lock perché non si hanno variabili condivise
- _Query_
	- Quanti processori ci sono?
	- Qual è il mio rank (ID) ?
	- Ci sono messaggi in arrivo?
	- ...

>[!help] MPI su Debian/Ubuntu
>È necessario installare `mpi-default-bin` e `mpi-default-dev`, se si vuole anche far uso dei manuali, installare `openmpi-doc`.
>- _Compilazione_: `mpicc`
>- _Esecuzione_: `mpirun`

## Hello World!
>[!example] Codice
>![[MPI_hello_world.png]]
>_Compilazione_: `mpicc -Wall mpi-hello.c -o mpi-hello`
>_Esecuzione_: `mpirun ./mpi-hello`

### Funzioni
MPI ci mette a disposizione alcune funzioni per accedere a determinati dati utili:
- `MPI_Comm_size()` restituisce il numero di processi in esecuzione
- `MPI_Comm_rank()` restituisce l'ID del processo
- `MPI_Init`
- `MPI_Finalize`
- `MPI_Send` invio di dati _bloccante_
- `MPI_Recv` ricezione di dati _bloccante_
- `MPI_Abort` aborto dell'esecuzione

>[!example] Esempio base
>![[MPI_basic_example.png]]

### Concetti base
I processori sono organizzati in _gruppi_. Un gruppo e un context formano un _communicator_.
Il communicator di default è `MPI_COMM_WORLD` che include tutti i processori. ^eb8a40
#### Data types
I dati ricevuti e inviati sono descrivibili dalla tripla (_address_, _count_, _datatype_)

Un tipo di dato MPI è definibile ricorsivamente da:
- tipo predefinito
- array contiguo di MPI datatype
- _strided block_ di MPI datatype
- array indicizzato di MPI datatype
- una struttura arbitraria di MPI datatype

![[MPI_default_datatypes.png|400]]

#### Tags
In alcuni casi il mittente A potrebbe inviare al destinatario B diversi messaggi, per gestire l'ordine di essi si usufruisce dei **tag** che funzionano proprio come degli ID per i messaggi.
B aspetta che venga inviato un messaggio con un determinato tag, mentre gli altri messaggi vengono inseriti in un buffer.
Per ricevere qualsiasi tag si fa uso di _MPI_ANY_TAG_.
#### Invio bloccante
```C
MPI_Send(const void *buf, int count, MPI_Datatype datatype, int dest, int tag, MPI_Comm comm);
```
Il buffer del messaggio è rappresentato da _(buf, count, datatype)_.
- _count_ rappresenta il numero di oggetti inviati
- _dest_ rappresenta il rank del processo destinatario
- _tag_ è l'id del messaggio (noi useremo sempre 0)

>[!info] Return
>Quando viene ritornata la funzione il buffer viene consegnato al sistema, in modo che possa essere riutilizzato.
>>[!attention] Il messaggio potrebbe non essere stato ancora ricevuto da processo destinatario.

#### Ricezione bloccante
```C
MPI_Recv( void *buf, int count, MPI_Datatype datatype, int source, int tag, MPI_Comm comm, MPI_Status *status );
```
La funzione **MPI_Recv()**  attende un messaggio che faccia match con _source_ e _tag_, dopo la ricezione, un altro buffer può essere usato.
- _source_ è il rank del processore nel [[#^eb8a40|communicator]], oppure si usa _MPI_ANY_SOURCE_ per accettare tutte le sorgenti
- _comm_ rappresenta l'id del communicator
- _tag_ è l'id del messaggio atteso, oppure si usa _MPI_ANY_TAG_ per accettare messaggi con qualsiasi id
- _status_ contiene ulteriori informazioni riguardanti il messaggio, ad esempio la grandezza

>[!example] Esempio di invio e ricezione
>![[MPI_sender_to_reciever.png]]

#### Stato
Con **MPI_Status** si può tenere traccia di alcune informazioni riguardanti il messaggio, rappresentate tramite struct.
Alcune delle informazioni sono:
- `{C} int MPI_SOURCE`
- `{C} int MPI_TAG`
- `{C}int MPI_ERROR`

>[!tip] Con queste informazioni un processore può controllare la provenienza e il tag del messaggio anche se il destinatario utilizza *MPI_ANY_TAG* e *MPI_ANY_SOURCE*

>[!info] MPI_Get_count
>Tramite la funzione **MPI_Get_count** è possibile tenere traccia di quanti elementi sono stati ricevuti.
>```C
>MPI_Recv(buf, BUFLEN, MPI_INT, 0, 0, MPI_COMM_WORLD, &status );
>MPI_Get_count(&status, MPI_INT, &count);
>```
>La variabile `count` conterrà il numero di elementi ricevuti dal processore.

### Concorrenza
Utilizzando _send/recive_ bloccanti, si potrebbe incappare in dei ==deadlock== se non correttamente gestiti.
>[!warning] Deadlock
>![[MPI_deadlock.png]]

>[!faq] Come possiamo risolvere questi problemi di concorrenza?

>[!success] Soluzione
>- Possiamo riordinare le chiamate bloccanti! 
>- Altrimenti utilizziamo chiamate _non bloccanti_ oppure usiamo _MPI_Sendrecv()_, se appropriato.

#### Chiamate non bloccanti
##### Send
```C
int MPI_Isend(const void *start, int count, MPI_Datatype datatype, int dest, int tag, MPI_Comm comm, MPI_Request *req)
```
La funzione è identica a quella [[#Invio bloccante|bloccante]], tranne che
- _req_ contiene un identificatore univoco della richiesta
- la funzione ritorna immediatamente
##### Receive
```C
int MPI_Irecv(void *start, int count, MPI_Datatype datatype, int source, int tag, MPI_Comm comm, MPI_Request *req)
```
La funzione è identica a quella [[#Ricezione bloccante|bloccante]], tranne che
- _req_ è un gestore di richieste con il quale si tiene traccia del completamento della ricezione dei messaggi

>[!warning] Attenzione
>Per utilizzare al meglio il receive non bloccante, bisogna far uso di _MPI_Wait()_ o _MPI_Test()_ per poter determinare il termine dell'operazione

>[!info] N.B.
>È possibile combinare send bloccanti con receive non bloccanti e viceversa.
##### Test
Controlla lo stato di una determinata operazione send o receive non bloccante.
```C
int MPI_Test(MPI_Request *request, int *flag, MPI_Status *status)
```
- _flag_ è impostato a 1 se l'operazione è terminata, a 0 altrimenti

>[!note] Operazioni multiple
>Esistono funzioni come _MPI_Testany_, *MPI_Testall*, *MPI_Testsome* che permettono di verificare il completamento di più operazioni.

##### Wait
Attende finché l'operazione non è terminata.
```C
int MPI_Wait(MPI_Request *request, MPI_Status *status)
```

>[!note] Operazioni multiple
>Come per [[#Test]] esistono
>- *MPI_Waitany*
>- *MPI_Waitall*
>- *MPI_Waitsome*

>[!example] Esempio di async send
>![[MPI_async_send.png]]

##### Abort
Per terminare la computazione, invece di usare `abort()` o `exit()` usiamo _MPI_Abort_ per terminare in modo appropriato TUTTI i processi del communicator indicato.
```C
MPI_Abort(comm, err)
```

>[!warning] Se si indica MPI_COMM_WORLD la funzione ritornerà il codice di errore "err"

>[!example] Esempio del trapezoide
>![[MPI_trap.png]]
>Vogliamo calcolare l'area sottesa del trapezoide
>
>**Approccio Naïve**
>Assegnamo ad ogni processo una parte di area da calcolare e affidiamo la somma dei calcoli parziali ad un processo _master_, che nel nostro caso sarà quello con `rank = 0`
>
>![[MPI_trap_pseudo.png|500]]

## Collective communication
Nella pratica [[#Invio bloccante|send]] e [[#Ricezione bloccante|receive]] non vengo quasi mai usati, perché si preferisce usare il **bulk synchronous pattern**
>[!info] Bulk synchronous pattern
>Consiste semplicemente nell'esecuzione di operazioni locali e la successiva comunicazione dei risultati ad una **<u>vista globale dei processi</u>**

Le _comunicazioni collettive_ vengono eseguite da ogni processore per condividere i propri risultati per poter calcolare i risultati globali.
Inoltre sono più efficienti delle comunicazioni point-to-point.

>[!tip] Essential skill
>Per un programmatore MPI, capire quando è più appropriato utilizzare le collective communication è una skill essenziale.

### Barrier
```C
MPI_Barrier()
```
Esegue una barriera di sincronizzazione in un gruppo: i processi devono aspettare alla barriera il termine di tutti gli altri processi del proprio gruppo.

### Broadcast
Per effettuare una comunicazione [[I protocolli Internet#Broadcast|broadcast]] tra processi, si fa uso di `{C} MPI_Bcast()`
```C
count = 3; 
src = 1; /* broadcast originates from process 1 */ 
MPI_Bcast(buf, count, MPI_INT, src, MPI_COMM_WORLD);
```

![[MPI_broadcast.png]]
### Scatter
Distribuisce i dati tra gli altri processi del gruppo, è come se si eseguissero molteplici send o receive.
```C hl:4
sendcnt = 3; /* how many items are sent to each process */ 
recvcnt = 3; /* how many items are received by each process */ 
src = 1; /* process 1 contains the message to be scattered */
MPI_Scatter(sendbuf, sendcnt, MPI_INT, recvbuf, recvcnt, MPI_INT, src, MPI_COMM_WORLD);
```

![[MPI_scatter.png]]
### Gather
È l'operazione opposta a [[#Scatter|scatter]], unisce i dati dei vari processi nello stesso insieme.
```C hl:4
sendcnt = 3; /* how many items are sent by each process */ 
recvcnt = 3; /* how many items are received from each process */ 
dst = 1; /* message will be gathered at process 1 */ 
MPI_Gather(sendbuf, sendcnt, MPI_INT, recvbuf, recvcnt, MPI_INT, dst, MPI_COMM_WORLD);
```

![[MPI_gather.png]]
#### MPI_Allgather()
Si comporta come [[#Gather|MPI_Gather]] ma, una volta ricomposti i dati dei processi, ridistribuisce il risultato.
```C hl:3
sendcnt = 3; 
recvcnt = 3; 
MPI_Allgather(sendbuf, sendcnt, MPI_INT, recvbuf, recvcnt, MPI_INT, MPI_COMM_WORLD);
```
![[MPI_AllGather.png]]

>[!example] Esempio somma di vettori
>$$\large
>\begin{align}
>x+y= (x_{0},x_{1},\dots,x_{n}) + (y_{0},y_{1},\dots,y_{n}) \\
> = (x_{0}+y_{0},x_{1}+y_{1},\dots,x_{n}+y_{n}) \\
> = (z_{0},z_{1},\dots,z_{n-1})
>\end{align}
>$$
>```C
>void sum( double* x, double* y, double* z, int n ) 
>{ 
>	for (int i=0; i<n; i++){
>		z[i] = x[i] + y[i];
>	}
>}
>```
>![[MPI_parallel_vectorSum.png]]

### Comunicazioni collettive non contigue
Fino ad ora abbiamo visto come lavorano [[#Gather]] e [[#Scatter]]: trattano i dati in modo contiguo, ma in alcuni casi vogliamo poter selezionare solo parti specifiche dei dati su cui lavoriamo.
>[!example] Vediamo come scatter opera con dati contigui
>![[MP_contiguous_scatter.png|500]]
#### MPI_Scatterv()
Sono consentiti gap tra i dati utili, che possono essere di diverse dimensioni e distribuiti a piacimento.
![[MPI_scatterv.png]]

>[!note] Come funziona
>Possiamo indicare le varie dimensioni e il posizionamento dei _"sub-buffer"_:
>- `int *sendcnts` indica il numero di elementi del "sub-buffer"
>- `int *displs` è un padding che viene applicato dalla posizione `0` del buffer. Indicato con il numero di elementi da "saltare"
>- `int recvcnt` rappresenta il numero di elementi che contiene il buffer del processo che riceve i dati
>![[Screenshot 2026-05-05 at 16.50.04.png]]

>[!example] Esempio 
>```C
>int sendbuf[] = {10, 11, 12, 13, 14, 15, 16}; /* at master */
int displs[] = {3, 0, 1}; /* assume P=3 MPI processes */
int sendcnts[] = {3, 1, 4};
int recvbuf[5];
...
MPI_Scatterv(sendbuf, sendcnts, displs, MPI_INT, recvbuf, 5,
MPI_INT, 0, MPI_COMM_WORLD);
>```
>- `sendbuf[]` rappresenta i dati del nostro array
>- `displs[]` assegna ad ogni processo l'indice di partenza dei dati, assumendo che ce ne siano 3
>- `sendcnts[]` assegna il numero di elementi per processo
>- `recvbuf[5]` rappresenta la grandezza del buffer dei destinatari, in questo caso sarà di 5 elementi
>![[MPI_scatterv_example.png]]

#### MPI_Gatherv()
Si comporta esattamente come [[#MPI_Scatterv()]] e ha con gli stessi parametri.
Ciò che cambia è il comportamento che, come già visto è quello di [[#Gather|assemblare i risultati parziali in un unico buffer]]
>[!info] Dalla pagina ufficiale [mpich.org](https://www.mpich.org/static/docs/v4.1/www3/MPI_Gatherv.html)
>![[MPI_gatherv.png]]

