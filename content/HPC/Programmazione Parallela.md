## Procedimenti
- **Decomporre** il problema in sotto-problemi
- **Distribuire** i sotto-problemi alle unità di esecuzione
- **Risolvere** i sotto-problemi
	- _Cooperazione_ tra unità di esecuzione per risolvere i sotto-problemi
- **Combinare** i risultati parziali

>[!example] Esempio (Moltiplicazione tra matrici)
>![[matmul.png]]
>>[!faq] Domanda
>>Questa operazione avrà complessità $\Theta(n^3)$, possiamo renderla più efficiente con la programmazione parallela?
>
>
>>[!tip] È tutto relativo!
>>L'efficienza dipende soprattutto dall'algoritmo utilizzato, però **attenzione!** La velocità di un programma dipende in gran parte anche dall'hardware, dal linguaggio e dal sistema operativo utilizzati.


## Riordinare i cicli
>[!example] Moltiplicazione tra matrici in C
>![[matmulC.png]]

Partendo da questo codice possiamo notare che la complessità computazionale, _in questo caso_, non cambia per qualsiasi permutazione dell'ordine dei cicli.
![[matmulReordering.png|600]]

>[!warning] Ciò non vale sempre!

### Rappresentazione delle matrici
>[!tip] Row-major order
>In _C_ le matrici sono rappresentate per riga

Grazie all'utilizzo delle _cache_ delle CPU, muovendosi per ogni riga, al processore risulterà molto più facile! Non dovrà "saltare" da un blocco all'altro di memoria perché dispone di _memoria contigua_.
![[row-wise.png]]
>[!example] Differenza di tempo
>![[esempio_row-major.png]]
>**Risultati**
>![[risultatiReorder.png]]
>Siamo passati da $593s$ a $32s$ in C ottenendo uno _Speedup_ di $611.93$ rispetto a Python $$\large\text{Speedup}=\frac{T_{python}}{T_{C_{reordered}}}$$

## Istruzioni SIMD
>[!note] SIMD (Single Instruction Multiple Data)

Le istruzioni _SIMD_, a differenza delle istruzioni classiche, può prendere in input array di dati per poterli elaborare insieme ma utilizzando lo stesso tempo necessario ad una singola operazione "classica".
>[!Abstract] Spiegazione
>Abbiamo l'operazione $a+b=c$, con le istruzioni SIMD possiamo utilizzare due array:
>$$\large[a_0,a_1,a_2,a_3]+[b_0,b_1,b_2,b_3]=[c_0,c_1,c_2,c_3]$$
>Nonostante ci siano molti più elementi su cui operare, il tempo di esecuzione sarà uguale a quello per calcolare $a+b=c$.
>In questo caso possiamo usare array con solo 4 elementi ciascuno perché il nostro processore dispone soltanto di 4 unità di calcolo _ALU_.
>![[SIMD.png]] 


## Parallelismo Multicore
I processori moderni dispongono di molteplici unità di esecuzione indipendenti, talvolta fanno uso anche di _core_ virtuali (Intel HyperThreading), i quali condividono parte delle risorse fisiche rimanendo, ovviamente, meno potenti di un core reale.
==Per sfruttare i core noi utilizziamo **[[OpenMP]]**.==

>[!abstract] Codice
>Chiamando _pragma_ andiamo a specificare in un blocco di codice per il quale si vuole dividere le operazioni per tutti i core in possesso.
>![[pragma.png]]
>In questo esempio vediamo anche delle operazioni SIMD.
>![[openmpResultsw.png]]
>Abbiamo ottenuto un buon risultato riorganizzando i loop, aggiungendo le istruzioni SIMD e sfruttando i core con OpenMP.


## Sum-Reduction
Andiamo a vedere il caso più semplice di programmazione parallela: la somma degli elementi di un array.
>[!tip] Step 0
>Prima di iniziare a programmare bisogna sapere su quale tipo di _architettura parallela_ stiamo lavorando.
>
>Due tipi di architettura:
>- **Memoria condivisa**
>- **Memoria distribuita**

>[!note] Modus Operandi
>Per sviluppare un algoritmo parallelo, partiamo dalla soluzione sequenziale andando via via a renderla parallela.
>>[!info] Non è _sempre_ una buona idea
### Soluzione seriale
```C title="Somma degli elementi di un array di float" 
float seq_sum(const float* v, int n) {
	int i;  
	float sum = 0.0;  
	for (i=0; i<n; i++) {
		sum += v[i]; 
	}
	return sum; 
}
```
#### Versione 1 - Memoria Condivisa
Supponiamo di avere $P$ processori a ognuno dei quali sono assegnati $n/P$ elementi.
>[!Example] Esempio
>$n=15$ e $P=3$
>![[soluzione1sbagliata.png]]

Il seguente codice rappresenta una soluzione al problema della _sum-reduction_ facendo lavorare ogni processore sul proprio blocco di elementi.
>[!Warning] Errore
>Questa soluzione però risulta sbagliata perché la variabile `sum` viene usata contemporaneamente da tutti i processori, creando una _race condition_
 
![[code_1.png]]
>[!note] OMP
>La direttiva per indicare di eseguire del codice in parallelo per OMP è
>```C
>#pragma omp parallel{}
>```




##### Miglioramento
Andiamo a risolvere il problema della _mutua esclusione_ sulla variabile `sum`.
![[better code_1.png]]
>[!warning] Efficienza
>Eseguendo un _lock_ su ogni elemento ($n$ volte), si va a perdere tutto il vantaggio del parallelizzare il problema, potendo ottenere anche risultati peggiori dell'algoritmo seriale.

>[!note] OMP
>La direttiva per indicare di eseguire del codice atomicamente (in mutua esclusione) è
>```C
>#pragma omp atomic{}
>```


>[!fail] Errore
>Prendendo $P=3$ e $n=17$ otteniamo una partizione _errata_, perché nella suddivisione degli elementi si otterrà che ad ogni processore appartengono $5$ elementi, quindi rimarrebbero $2$ elementi non compresi.
>![[partizione_errata.png]] 

##### Correzione
Con il seguente codice andiamo a risolvere il problema del partizionamento.
![[partizione_corretta.png]]
>[!warning] Ovviamente rimane il problema dell’inefficienza.

#### Versione 2
Per ovviare al problema dell'efficienza, andiamo ad aumentare la _granularità_ del mutex; cioè rendiamo la porzione in mutua esclusione più grande, in modo che i `{C} mutex_lock(&m)` eseguiti non siano più $n$ ma $P$.
Ciò lo facciamo calcolando l'intera somma di ogni partizione per poi sommarle tra di loro, introducendo la _soluzione intermedia_ `{C} my_sum`.
![[partizione_efficiente.png]]
#### Versione 3 - Rimozione del mutex
In questa versione creiamo un array con le somme parziali (`{C} psum[0..P-1]`) eseguite da ogni processore e facciamo fare la somma totale al processore con $\text{id}=0$ .
>[!warning] Sincronizzazione
>Rimane però un problema di sincronizzazione perché non è detto che il processore con $\text{id}=0$ esegua il calcolo totale alla fine.
>![[errore_di_sincronizzazione.png|500]]

![[somme_parziali.png]]
#### Versione 4 - Sincronizzazione
>[!tip] Sincronizzazione
>Possiamo utilizzare una chiamata alla funzione `barrier()` che ha lo scopo di sincronizzare tutti i processori aspettando il termine di ognuno di essi.
>![[barrier.png]]
>>[!note] OMP
>>La direttiva per sincronizzare i processori è
>>```C
>>#pragma omp barrier
>>```
>>Oppure si chiude la regione parallela tornando alla porzione del programma seriale.

#### Soluzione
Il codice della soluzione sarà
```C
#pragma omp parallel for reduction (+:result)
	for(int i=0; i<n; i++){
		result += A[i];
	}
```
- `{C} for`: indichiamo l'operazione da parallelizzare
- `{C}reduction`: indichiamo che viene eseguita una reduction (già implementata in OMP).
- `{C}(+:result)`: indichiamo la variabile della race condition.
#### Versione 5 - Memoria Distribuita
In questo caso ci troviamo a gestire la presenza dell'array in un solo processore, quindi i dati devono essere _distribuiti_ dal processore $0$ agli altri.
>[!note] Codice
>Il processore con `my_id=0` invia i dati agli altri processori e riceve le somme parziali da essi per costruire la somma totale.
>![[sum-reduction-message_passing.png]]

>[!warning] Criticità
>In questa modalità il processore $P_0$ deve aspettare $P-1$ messaggi dagli altri processori, andando a creare così un _bottleneck_.
>![[mp_bottleneck.png]]
>$$
>\large\text{Complessità di } \Theta(P)
>$$

##### Riduzione Parallela
Per abbassare la complessità dell'algoritmo parallelizzo la riduzione, creando delle coppie che sommano tra di loro i valori.
![[parallel_reduction.png]]
$$
\large \text{Complessità di } O(\log_{2}P)
$$
>[!success] Siamo riusciti a rende più efficiente l'algoritmo!

## Task Parallelism vs Data Parallelism
- **Task Parallelism**: Ad ogni processore è assegnato un programma diverso.
- **Data Parallelism**: I processori si dividono i dati ma eseguono la stessa operazione ([[#Sum-Reduction|quello che abbiamo utilizzato]])

>[!example] Esempio
>Abbiamo una tabella contenente le temperature di un luogo ad ogni ora per un anno:
>- Righe: 365 giorni
>- Colonne: 24 ore
>
>Assumiamo che disponiamo di 3 processori
>Vogliamo calcolare la temperatura minima, media e massimo.
>### Data Parallel
>Divido i dati per i tre processori
>![[data_parallel_example.png]]
>### Task Parallel
>Affido ad ogni processore un tipo di task differente
>![[task_parallel_example.png]]

>[!faq] Quale scegliere?
>**Dipende dal problema**: in base alla tipologia del problema si sceglie il tipo di risoluzione più sensata ed efficace.


