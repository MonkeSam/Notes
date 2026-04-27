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

