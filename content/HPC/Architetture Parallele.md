## In generale
![[abstract_architecture.png]]
>[!note] Definizione
>Un'architettura parallela a livello astratto si tratta di un insieme di unità di calcolo connesse in un qualche modo tra di loro e con un insieme di memorie.

>[!warning] Architetture
>È importante sapere come sono fatti e organizzati questi tre componenti in una architettura perché il tipo di architettura è fortemente impattante sul modo con cui si va a risolvere un problema.

### Von Nuemann
![[Von_Neumann.png]]
È composta da:
- **Processore** (in grigio):
	- _ALU_: esegue le operazioni aritmetiche e logiche
	- _Registri_:
		- =={blue}Generali==
		- ==Speciali== (Instruction Register, Program Counter, PSW)
	- _Control (CU)_: si occupa di spostare i dati dai registri all'ALU. In generale "orchestrare" il processore.
- **Memoria**: Contiene sia dati che istruzioni.
- **Bus**

>[!faq] Come prevenire il bottleneck nell'architettura di Von Neumann?
>- Usare la cache e i registri di sistema il più possibile
>- Nascondere le latenze degli accessi in memoria usando tecniche di _context switching_ e _multithreading_
>  >[!example] Esempio
>>Se un processo deve aspettare diverso tempo per ottenere i propri dati, è conveniente che durante quell'attesa possa essere eseguito un altro processo i cui dati sono già pronti.
>- Eseguire operazioni in parallelo

#### Caching
>[!note] Divario Memoria/Processore
>![[Divario.png]]

Per risolvere questo divario si ricorre all'utilizzo delle memorie **cache**
>[!note] Gerarchia
>![[Gerarchia.png]]
>Dall'alto verso il basso si passa dalla più veloce e meno capiente a quella più lenta ma più capiente.
>>[!example] Esempio
>>![[Esempio gerarchia.png]]
>>Questa architettura dispone di 8 core che vengono virtualizzati in 16 thread.
>>Ogni core dispone di memorie L2 e L1 che vengono suddivise in:
>>- _L1d_: contenente i dati
>>- _L1i_: contenente le istruzioni
>>
>>In più si ha una memoria _L3_ condivisa tra tutti i core.

>[!faq] Perché le cache migliorano le prestazioni?
>Le cache sfruttano i concetti di **località spaziale e temporale**:
>- _Località Spaziale_: Spesso i dati in memoria si trovano in celle adiacenti, quindi è conveniente caricare in cache le celle RAM vicine a quelle della cella richiesta.
>- _Località Temporale_: È utile caricare in cache i dati perché è molto probabile che ci si voglia accedere ripetutamente per un certo lasso di tempo.

##### Prodotto di matrici
![[matmul.png]]
Considerando il prodotto tra matrici, ci possiamo accorgere che ogni riga (e ogni colonna) vengono letti in totale $n$ volte. Questo ci indica che vi è un _data reuse_.
Sapendo che le matrici in C sono rappresentate [[Programmazione Parallela#Rappresentazione delle matrici|come sequenza di righe]] possiamo renderci conto che mettere le righe in cache è utile.
>[!warning] Accesso
>Fino ad ora stiamo accedendo alla matrice $q$ per colonna! Dobbiamo usare un metodo più efficiente.

>[!success] Ottimizzo
>![[trasposta.png]]
>Per risolvere il problema dell'efficenza moltiplico $p$ per la trasposta di $q$.
>Usando $q^T$ accediamo alle righe, quindi in modo efficiente!
>Questo perché si evitano diversi _cache miss_ che si presentano nel caso si continuasse a fare il prodotto $p\times q$ 

>[!info] Bash
>Per misurare le performance della cache noi utilizziamo `{bash} perf`, ci permette di visualizzare le statistiche delle memorie della cache.

## Hardware Multithreading
Permette alla CPU di eseguire un'altra task quando l'operazione corrente è in _stallo_
### Fine-grained multithreading
Consente di eseguire un context switch a costo zero (overhead = 0), può eseguire gli switch anche su task di breve durata. Tutto ciò viene fatto direttamente dalla CPU, a patto che supporti questa tecnica.
#### Simultaneous multithreading (SMT)
È un'implementazione del *Fine-grained multithreading* con il quale i thread possono utilizzare più core differenti contemporaneamente.
##### HyperThreading
È l'implementazione del SMT da parte di Intel.
Ogni processore è visto dal sistema operativo come due _processori logici_.
Ogni processore logico ha:
- Registri generali
- Registri di controllo
- APIC (Advanced programmable interrupt controller)
- Registri di stato della macchina
>[!info] Funzionamento
>![[HT.png]]

>[!example] Architettura CPU
>Si fa la distinzione tra P-core che dispongono di HyperThreading e consumano più energia e gli E-core che sono privi di HyperThreading e in più hanno meno cache L2 più grandi.
>![[Architettura CPU.png]]
>>[!Example] La mia CPU
>>![[cpu.svg]]
### Coarse-grained multithreading
Il context switch viene eseguito dal sistema operativo (multithreading classico) e viene effettuato solo in caso di thread in attesa di I/O o di operazioni simili.
>[!warning] In questo caso il context switch ha un costo.

## Tassonomia di Flynn
Con questo schema classifichiamo le architetture in base ai _flussi di istruzioni_ (Single/Multiple Instruction Stream) e ai _flussi di dati_ (Single/Multiple Data Stream).
![[Flynn.png]]
- **SISD**: È la tradizionale architettura seriale in cui si ha un solo flusso di dati e un solo flusso di istruzioni
- **MIMD**: Ne fanno parte le architetture multicore o dei super computer che sono interconnessi tra loro
- **SIMD**: È una architettura che permette di lavorare su multipli dati con un singolo flusso di istruzioni ([[Programmazione Parallela#Istruzioni SIMD|esempio di somme con array]])
- **MISD**: Multiple istruzioni su singoli dati (Non è praticamente utilizzata) 
### SISD
![[SISD.png|500]]
### MISD
![[MISD.png]]
### SIMD
Ogni ALU esegue la stessa operazione, decisa dalla Control Unit, su diversi dati.
![[SIMD.png]]
La quantità di dati su cui eseguire la stessa operazione dipende dalla larghezza dei registri SIMD (cioè al numero di ALU che tipicamente sono 4/8/...).

#### SSE (Streaming SIMD Extensions)
Sono un'estensione del instruction set delle CPU x86, aggiungendo la possibilità di lavorare su strutture più grandi.
Introduce 8 nuovi registri da 128-bit.
Mentre le istruzioni SSE 2 possono gestire:
![[SSE2.png]]


### MIMD
![[MIMD.png]]
Si suddividono in:
- **Memoria Condivisa**
- **Memoria Distribuita** ^43cfc6
#### Architettura Ibrida
![[Ibrida.png]]
Nella programmazione parallela odierna si utilizzano architetture miste (_ibride_) rendendo delle architetture MIMD interconnesse tra loro e accelerate da delle _GPU_.