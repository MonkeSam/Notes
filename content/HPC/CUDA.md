**CUDA** _(Compute Unified Device Architecture)_ è un'architettura proprietaria di Nvidia che ha lo scopo di eseguire calcoli paralleli tramite l'uso di GPU (vendute dall'azienda stessa).

>[!faq] Come si fa a programmare su GPU non Nvidia?
>Esiste un'alternativa opensource chiamata **OpenCL** che permette di sviluppare applicazioni parallele per GPU e CPU.
>Purtroppo però OpenCL non raggiunge le stesse prestazioni di CUDA, quindi il suo uso è ancora abbastanza di nicchia ma in lenta crescita.

## Concetti base
CUDA separa CPU e GPU definendo
- _Host_ la CPU e la sua memoria (host memory) ^ecd87c
- _Device_ la GPU e la sua memoria interna (device memory) ^5811bb


![[CUDA_host_device.png|500]]

Questa separazione viene fatta perché viene fatta una distinzione per i programmi, in base al luogo di esecuzione:
- _CPU Program_ (host program) include tutte le operazioni I/O o operazioni che richiedono l'interazione con l'utente
- _GPU Program_ (device program) contiene tutte le istruzioni da eseguire su GPU

### Processing Flow
Il caso tipico in cui *host program* e *device program* interagiscono è
- L'host copia i dati nella memoria globale della GPU (device memory)
- Le funzioni della GPU vengono chiamate dall'host program in modo che venga inizializzato il device program della GPU.
>[!example] Esempio del flow di esecuzione
>![[CUDA_flow1.png|500]]
>![[CUDA_flow2.png|500]]
>![[CUDA_flow3.png|500]]

## GPU
![[CUDA_gpu_anatomy.png]]


Per creare programmi per GPU, bisogna conoscere la struttura logica degli elementi con cui si lavora:
- **Thread**: è l'unità più piccola di lavoro.a
	- Lo scheduling viene fatto su gruppi di 32 thread, chiamato _WARP_
- **Block**: è un pezzo indipendente di lavoro che può essere eseguito in qualsiasi ordine da un _Streaming Processor_. ^6bc6f0
	- È un array in tre dimensioni di thread, contenente fino ad un massimo di 1024 thread nell'ultima versione.
- **Grid**: è un elemento che può essere eseguito dalla GPU ^954031
	- Si compone di array bidimensionali di [[#^6bc6f0|blocchi]].

### Scheduling
CUDA si occupa anche di gestire lo scheduling dei blocchi, riorganizzandone l'ordine. In questo modo lo sviluppatore non si deve preoccupare di come viene gestita la potenza di calcolo.
#### Warp
Un **CUDA Warp** è un gruppo di 32 thread CUDA che vengono eseguiti simultaneamente.
L'hardware raggiunge il massimo della sua efficienza quando i thread eseguono le istruzioni dallo stesso indirizzo del programma. Quando non è così, alcune pipeline di esecuzione rimangono inutilizzate.
>[!info] Accesso
>Se un warp accede ad un blocco contiguo di memoria DRAM, gli accessi di ogni thread vengono unificati in un unico accesso a banda larga.

>[!important] [[Programmazione Parallela#Istruzioni SIMD|SIMD]]
>Un CUDA warp rappresenta la granularità minima dell'esecuzione di una istruzione SIMD.

### Single Instruction Multiple Data (SIMD)
![[CUDA_Warp_SIMD.png|500]]
1. I thread di un warp vengono eseguiti contemporaneamente partendo dallo stesso indirizzo del programma.
2. Ogni thread ha il proprio _program counter_ e _registro di stato_ in modo che possano essere indipendenti nell'esecuzione, creando il comportamento delle [[Architetture Parallele#MIMD|architetture MIMD]].
3. Rami divergenti vengono eseguiti in modo seriale (vedi =={red}XXX== e =={blue}YYY== nell'immagine). I thread che non fanno parte dei rami vengono disabilitati
## Hello World!
![[CUDA_hello_world.png|500]] ^f94935

Si usa lo standard C con il compilatore Nvidia **nvcc** che compila anche quando non è presente [[#^5811bb|device]] code. ^aee30e

_nvcc_ divide il codice sorgente in codice host e codice device:
- ==funzioni device== (es. `mykernel()`) sono processate dal compilatore di Nvidia .
- ==funzioni host== (es. `main()`) sono processate dal compilatore della CPU (`gcc`).

Abbiamo nuovi elementi sintattici:
- **__global__** è una keyword che indica una funzione che viene chiamata dall'[[#^ecd87c|host]] ed eseguita sul [[#^5811bb|device]] e DEVE ritornare `void` (come abbiamo visto nel [[#Processing Flow]]).
- **mykernel()** è una chiamata da codice host a codice device, viene anche chiamata _kernel launch_ 
  >[!important] È ciò che serve per eseguire del codice su GPU

Nell'[[#^f94935|esempio in cima al capitolo]] la funzione `mykenel<<<1,1>>>()` non esegue nulla perché non abbiamo indicato istruzioni dentro `mykernel()`.
>[!example] Vediamo un esempio più concreto
>Ipotizziamo di voler eseguire una somma tra interi per costruire una somma di vettori.
>![[CUDA_vector_sum.png]]
>
>Creiamo la nuova funzione _kernel launch_ `add()`:
>>[!note] Ricorda: verrà chiamata dall'host ed eseguita sul device
>>Quindi `a`, `b` e `c` dovranno essere dei ==puntatori alla memoria del device==.
>>>[!warning] Attenzione
>>>- L'host punterà alla memoria della CPU
>>>- Il device punterà alla memoria della GPU
>>>  
>>>Bisogna quindi allocare la memoria su entrambi gli attori del programma.
>
>![[CUDA_add_example.png]]
>
>Dobbiamo allocare le variabili sulla memoria della GPU. Lo faremo utilizzando le API di CUDA che ci fornisce le funzioni:
>- `cudaMalloc()`
>- `cudaFree()`
>- `cudaMemcpy()`
>  
>  ![[CUDA_addition_example.png]]
### Sincronizzazione
I "kernel launch" sono asincroni, quindi il controllo del programma torna immediatamente alla CPU (host). Per utilizzare i risultati, la CPU deve aspettare che l'elaborazione da parte del device termini su tutti i thread.
- `cudaMemcpy()` blocca la CPU finché la copia non è completa. La copia inizia quando tutte le chiamate CUDA sono terminate.
- `cudaMemcpyAsync()` copia asincrona non bloccante.
- `cudaDeviceSynchronize()` chiamata di sincronizzazione tra CPU (host) e GPU (device): l'host si blocca fino alla terminazione delle chiamate CUDA.
### Parallelizzazione
>[!faq] Come eseguiamo operazioni in parallelo?

#### Blocks

![[CUDA_parallel_call.png|500]]

Invece di eseguire la funzione una sola volta, la eseguiamo N volte in parallelo. In questo modo si può eseguire una somma di vettori:
>[!info] Funzionamento
>Indicando `add<<< N, 1 >>>();` ogni invocazione della funzione si riferisce a un blocco.
>Ogni insieme di blocchi appartiene a una [[#^954031|grid]].
>Si può riferire a un blocco usando il proprio indice _blockIdx.x_.
>![[CUDA_blockIdx.png|600]]
>
>Facendo così si seleziona un thread per blocco per l'esecuzione del codice
>![[CUDA_parallel_addition_on_blocks.png|600]]
>![[CUDA_addition_on_multiple_blocks.png|600]]

#### Threads
Invece di dividere il carico di lavoro su più blocchi, si può far uso di un solo blocco sfruttando i thread che gli appartengono.
>[!info] Funzionamento
>Al posto di selezionare i blocchi, si scelgono i thread su cui eseguire la funzione `add()`
>![[CUDA_addition_threads-1.png|600]]
>
>Per poter utilizzare la parallelizzazione in questo modo dobbiamo andare a modificare la chiamata di `add()`.
>![[CUDA_addition_one_block.png|600]]

#### Threads + Blocks
Ora si vuole sfruttare al massimo l'architettura della GPU, andando a utilizzare più blocchi con più thread.
![[CUDA_multiple_threads_in_mutliple_blocks.png]]

>[!info] Funzionamento
>Combinando l'uso di thread e blocchi, bisogna considerare di star lavorando con delle matrici, quindi l'indicizzazione non è più banale come per l'uso dei singoli blocchi o dei singoli threads su più blocchi.
>>[!example] Esempio
>>Vediamo nel seguente esempio un array di 24 elementi, la cui computazione viene assegnata a 3 blocchi diversi assegnando a ogni thread un elemento del vettore.
>>![[CUDA_threads_blocks_example.png|600]]
>>
>>Avendo $M$ thread il calcolo dell'indice di ogni elemento equivale a $$\large \text{int index} = \text{threadIdx.x} + \text{blockIdx.x} \times M$$
>
>Le API di CUDA danno a disposizione anche un modo per conosce la dimensione dei blocchi (numero di thread) con la variabile _blockDim.x_, per cui l'indice di un elemento si trova $$\large \text{int index} = \text{threadIdx.x} + \text{blockIdx.x} \times \text{blockDim.x}$$
>
>Allora `add()` sarà
>![[CUDA_add_block_threads_index.png|600]]
>
>>[!faq] Come cambia la chiamata nel main?
>
>![[CUDA_add_call_threads_blocks.png|600]]
>
>>[!warning] Non sempre la grandezza del problema (prob size) è multiplo della dimensione dei blocchi (numero di thread)!
>
>Per essere certi che la divisione del problema avvenga per una grandezza arbitraria, si fa in modo che più thread di quelli necessari vengano "scelti" verificando poi successivamente che l'indice degli elementi non sfori il numero della prob. size.
>![[CUDA_arbitrary_size_call.png|600]]
>![[CUDA_arbitrary_size_add.png|600]]
>

#### Thread cooperativi
>[!faq] Perché dividiamo i thread in blocchi? Per ora non abbiamo avuto nessun guadagno nel fare questa distinzione.
>I thread appartenenti allo stesso blocco favoriscono la condivisione di informazioni in modo efficiente e a una sincronizzazione automatica.

##### [[Pattern di Programmazione Parallela#Stencil|1D Stencil]]
Consideriamo di voler applicare lo stencil pattern a un array considerando una ghost area di raggio 3: in questo modo ogni elemento dell'output equivale alla somma di 7 elementi.
![[CUDA_stencil_radius.png]]

>[!tip] Implementazione con i blocchi
>- A ogni thread è assegnata la computazione di un elemento dell'output.
>- Gli elementi di input sono letti numerose volte: con `RADIUS = 3` ogni elemento viene letto 7 volte, considerando un raggio $R$, ogni elemento viene letto $(2R + 1)$ volte.
>
>>[!faq] Come scambiamo questi dati ridondanti tra thread?
>>Considerando il modello della memoria di CUDA.
>>![[CUDA_memory_model.png|500]]
>>Si potrebbe usare:
>>- _Memoria globale_: ha una banda limitata, quindi facendo numerosi accessi si andrebbe a creare un bottleneck.
>>- *Memoria condivisa*: È la memoria condivisa dai thread per ogni blocco, è estremamente veloce, si può considerare come una cache locale a disposizione dell'utente.
>> 
>>>[!note] Si dichiara una variabile in memoria condivisa tramite `__shared__`
>>  
>>>[!warning] La memoria condivisa non è visibile a thread di altri blocchi.
>
>Per assegnare a ogni blocco la propria porzione di array dobbiamo copiare i propri elementi (`blockDim.x`) dalla memoria globale alla memoria condivisa (`temp[]`). La copia viene fatta assegnando a ogni thread del gruppo un elemento della memoria globale, successivamente si calcola l'indice globale (`gindex`) e l'indice locale (`lindex`) di ciascun elemento per thread.
>![[CUDA_shared_memory.png]]
>>[!note] N.B.
>>Ogni blocco avrà come memoria condivisa un array di `blockDim.x + 2 * Radius`
>
>Successivamente, per riempire la ghost area, si usano sempre un thread per elemento
>![[CUDA_ghost_area_assignment.png]]
>>[!fail] Questa versione risulta errata
>>Non si sta considerando che i thread non operano in modo sincrono, quindi quando si va a calcolare il risultato da `temp[]` (array *shared*), c'è la possibilità che i dati nel vettore non siano esatti perché non è detto che tutti i thread abbiano aggiornato correttamente i dati.
>>![[CUDA_unsynched_stencil.png]]
>
>>[!success] Soluzione
>>Per garantire la sincronizzazione tra thread, si usa la funzione *\__syncthreads()*.
>>![[CUDA_stencil_syncthreads.png]]

^063f17

### Timing
Per registrare i tempi di esecuzione di un programma CUDA si può far uso della libreria fornita `hpc.h` ma bisogna fare attenzione perché il _kernel launch_ è asincrono, per cui è necessario chiamare **cudaDeviceSynchronize()** per aspettare il completamento dell'esecuzione del device.
![[CUDA_timing.png]]

### Dichiarazione di funzioni
#### \_\_device\_\_
Con  `__device__` si definisce una funzione che viene eseguita sul device e che può essere chiamata solo dal device.
>[!note] Le funzioni `__device__` possono ritornare un valore.

![[CUDA__device__.png|600]]
##### Variabili
`__device__` può essere applicato anche a delle variabili per allocarle statisticamente direttamente sul device e può essere applicato solo alle variabili globali.
Per copiare i dati da e su variabili `__device__` si usano *cudaMemcpyToSymbol()* / *cudaMemcpyFromSymbol()*.
![[CUDA__device__variables.png|600]]



#### \_\_host\_\_
Indica una funzione che viene eseguita sull'host e che può essere chiamata esclusivamente dal codice host.
>[!tip] Si possono combinare `__host__` e `__device__`
>Facendo ciò, vengono creati due versioni di codice: una che viene eseguita dalla CPU e una che viene eseguita dalla GPU.

![[CUDA__host__.png|600]]

### Errori
CUDA riporta gli errori tramite oggetti di tipo `cudaError_t`.

![[CUDA_error.png]]

>[!tip] Macro utili in hpc.h
>![[CUDA_hpc_utils.png]]
>![[CUDA_safe_call.png]]

## Blocchi a più dimensioni
Per [[#GPU|l'architettura della GPU]], possiamo sfruttare la multidimensionalità per risolvere in parallelo i problemi in modo molto efficiente.
### Prodotto di matrici
È già stato visto come risolvere il [[Architetture Parallele#Prodotto di matrici|prodotto di matrici]] in modo intelligente.
>[!faq] Come si può sfruttare CUDA al meglio per risolvere questo problema?
>

Si può scomporre la matrice risultante in blocchi, in modo da assegnare ogni sottoinsieme della matrice a ciascun blocco di thread.
![[Screenshot 2026-06-08 at 10.09.13.png|500]]
#### Inizializzare i blocchi
Tramite al datatype `dim3` è possibile decidere le dimensioni del blocco di thread o della griglia con cui si vuole eseguire le operazioni.
```C title:Esempio
dim3 blk(3); //definisce un blocco 3x1x1 nella variabile blk
dim3 blk(3, 4); //definisce un blocco 3x4x1 nella variabile blk
dim3 blk(3, 4, 7); //definisce un blocco 3x4x7 nella variabile blk
```

>[!note] Diversi modi di _kernel launch_
>![[CUDA_multidimensional.png]]

>[!example] Prodotto di matrici
>>[!example] Chiamata del kernel
>>![[CUDA_matmul_call.png]]
>
>>[!example] kernel
>>![[CUDA_matmul.png]]
>
>Per ogni blocco di thread si assegna un sottoinsieme della matrice.
>![[CUDA_matmul_assignment.png|600]]

>[!fail] Ridondanza
>Con questo procedimento, andiamo a leggere ogni elemento dalla memoria globale da diversi thread. Possiamo salvarci localmente i dati utili per evitare accessi lenti.

>[!success] È necessario salvare gli elementi utili nella memoria condivisa (`__shared__`)
>Vanno salvati $2 \times \text{BLKDIM} \times n$ elementi  per ogni blocco di thread 
>>[!warning] La dimensione usata potrebbe essere troppo grande per la memoria locale dei thread, bisogna regolare la dimensione dei blocchi in modo tale che la memoria riesca a contenere tutti gli elementi utili.
>
>![[CUDA_matmul_shared_memory.png|400]]
>
>Dividendo così la matrice in $\text{BLKDIM} \times n$ sotto-blocchi per ogni blocco di threads e operando con due blocchi alla volta, dove
>$$\large R = P_{1} \times Q_{1} + P_{2} \times Q_{2} + P_{3} \times Q_{3}$$
>![[CUDA_matmul_blocks.png|400]]
>
>>[!note] Riassumendo
>>Ogni thread esegue il prodotto tra le sotto-matrici di $p$ e $q$ per ogni _finestra_ ($P_{1},\dots,P_{\frac{\text{n}}{\text{BLKDIM}}}$ e $Q_{1},\dots,Q_{\frac{\text{n}}{\text{BLKDIM}}}$)
>>
>>
>>$$\large P_{1} \times Q_{1}$$
>>![[CUDA_matmul_local0.png|400]]
>>---
>>$$\large P_{2} \times Q_{2}$$
>>![[CUDA_matmul_local.png|400]]
>>---
>>$$\large P_{3} \times Q_{3}$$
>>![[CUDA_matmul_local2.png|400]]
>
>Nell'implementazione è necessario sincronizzare i vari thread ogni volta che effettuano operazioni sulla memoria condivisa:
>- La prima sincronizzazione aspetta che tutti i thread abbiano finito di copiare i dati dalla memoria globale a quella condivisa.
>- La seconda sincronizzazione è necessaria poiché, trovandosi all'interno di un ciclo, i thread non progrediscano con la copia di nuovi dati nella memoria condivisa mentre altri stanno ancora eseguendo il calcolo del nuovo elemento.
>
>![[CUDA_matmul_code.png]]

#### Warp
Quando si trattano delle matrici, come in questo caso, i [[#Warp|warp]]  vengono assegnati a ogni riga della matrice
![[CUDA_matrix_warp.png]]
![[CUDA_warp_code.png]]

>[!tip] In caso il blocco dovesse essere più piccolo
>Viene assegnata più di una riga per warp
>
>![[CUDA_smaller_matrix_warp.png]]

### Reduction
Per effettuare un'operazione di [[Pattern di Programmazione Parallela#Reduce|reduce]] possiamo agire nel seguente modo:
- Assegnare porzioni del problema a ogni blocco
- Far eseguire una riduzione parziale a ciascun thread
- Lasciare alla CPU il compito di calcolare la riduzione totale

Prima vediamo alcune idee di soluzioni non ottimali:
>[!Example] Soluzione 0°
>Si suddivide il problema in sotto-problemi assegnando al thread 0 di ogni blocco  l'esecuzione della reduction.
>![[CUDA_reuce_solution0.png]]
>![[CUDA_reduce_code0.png]]

>[!example] Soluzione 1°
>Ora tutti i thread dei blocchi operano una riduzione parziale del vettore
>![[CUDA_reduce_solution1.png]]
>![[CUDA_reduce_code1.png]]

>[!example] Soluzione 2°
>Il vettore in input viene copiato da tutti i blocchi nella propria memoria condivisa, poi i thread cooperano per eseguire un unica riduzione locale, senza lasciare alla CPU il calcolo finale.
>![[CUDA_reduce_solution2.png]]
>![[CUDA_reduce_code2.png]]


## Accesso in memoria
Considerando [[#^063f17|l'architettura della memoria]], la memoria globale può essere acceduta solo con transazioni di
- 32 byte
- 64 byte
- 128 byte

Quindi se, per esempio, si vuole spostare a 4 byte in memoria, verranno spostati almeno 32, 64 o 128 byte di dati a seconda di CUDA.
>[!info] La GPU può unificare gli accessi in memoria di thread dello stesso warp (32 thread)
### Caching
Per far si che i ==bus vengano sfruttati al 100%==, un warp deve richiedere al massimo 4 byte **contigui e consecutivi** per thread ($4\, \text{Byte} \times 32 \, \text{thread} = 128\, \text{Byte}$), in modo che in un'unica transazione si riesca a trasferire tutti i dati. Se _contigui_, anche permutando i dati richiesti l'efficienza rimane massima.
>[!example] Accessi in memoria contigua
>_Dati contigui e consecutivi_
>![[CUDA_alligned_consecutive_memory.png]]
>
>_Dati contigui permutati_
>![[CUDA_alligned_permuted_memory.png]]

---
Quando invece gli accessi NON sono a dati contigui si vanno a perdere delle prestazioni, perché vanno eseguite più transazioni rispetto alla quantità di dati richiesti.
>[!example] Accesso a memoria non contigua
>In questo modo è necessario spostare 256 byte, quindi servono due transazioni da 128, ottenendo un utilizzo del bus del 50%
>![[CUDA_misaligned_memory.png]]
>

>[!note] Se multipli accessi avvengono sugli stessi dati, l'utilizzo dei bus sarà $\Large\frac{n_{\text{bytes}}}{n_{\text{thread}}}$   
>In questo caso con 4 byte richiesti da un warp (32 thread), il bus sarà usato al 3.125%
>![[CUDA_same_memory.png]]

>[!example] Accesso a memoria non contigua e non consecutiva
>Quando le richieste sono su memoria sparsa l'utilizzo dei bus dipende dal numero di blocchi contigui a cui si accede: l'utilizzo viene calcolato con $$\large\frac{128}{N \times 128}$$ dove $N \times 128$ è il numero di blocchi contigui da 128 byte per cui si richiede accesso.
>Il caso peggiore è quello in cui è necessario accedere a tutti i blocchi di memoria.
>![[CUDA_scattered_memory.png]]

>[!faq] Allora come si possono gestire al meglio gli accessi in memoria, soprattutto quando su più blocchi di memoria?




>[!example] Prendiamo in esempio la rotazione di una matrice, che è unicamente un'operazione di spostamento di dati.
>Vediamo che ruotare una matrice è un'operazione su memoria non contigua, perché ogni colonna è distante $n$ blocchi.
>![[CUDA_matrix_rotation.png|600]]
>
>>[!tip] Suddividiamo la matrice in piccoli blocchi e operiamo la rotazione su di essi
>
>Una volta ruotata la partizione della matrice ricomponiamo la matrice finale
>![[CUDA_local_rotation.png|600]]
>
>>[!info] Eseguendo il programma notiamo che l'esecuzione della rotazione locale è nettamente più veloce rispetto a ruotare la matrice dalla memoria globale
>
>>[!tip] È più veloce proprio perché si va a sfruttare la memoria locale dei blocchi di thread, il cui accesso è molto più rapido rispetto alla memoria globale!

## Performance
Per CUDA la [[Valutazione delle prestazioni|valutazione delle prestazioni]] non è la stessa che si applica per [[OpenMP]] e [[MPI]], si fa distinzione nel
- Concetto di [[Valutazione delle prestazioni#Speedup|speedup]]
- Uso delle metriche

### Speedup
Con CUDA non è corretto calcolare lo speedup dividendo il tempo di esecuzione del programma seriale con quello parallelo. Va calcolato il rapporto tra il tempo di esecuzione del programma nella versione OMP e nella versione CUDA.
$$\Large \text{Speedup}= \frac{T_{\text{OpenMP}}}{T_{\text{CUDA}}}$$
>[!warning] È importante che la versione OMP esegua il programma con tutti i core disponibili sulla CPU perché ==con CUDA non si ha il controllo dei core assegnati all'esecuzione del programma==

>[!Bug] Purtroppo CPU e GPU hanno un divario molto importante di potenza di calcolo, quindi è importante che la CPU in uso sia il più possibile vicina alla generazione della GPU.

### Throughput
Il **throughput** è una metrica che indica il numero di operazioni che vengono compiute ogni secondo in base alla grandezza dell'input.
$$\Large \text{Throughput} = \frac{\text{N. di operazioni}}{\text{wall-clock time}}$$
>[!example] Esempio
>Se un algoritmo ha complessità computazionale $\large\Theta(n^2)$, con $n = 1000$, il numero di operazioni sarà $10^6$. Successivamente va misurato il tempo di esecuzione del programma.

