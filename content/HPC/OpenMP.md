**OpenMP** è un modello di programmazione parallela per architetture a ==memoria condivisa==.

>[!Warning] OpenMP _NON_
>- Parallelizza automaticamente
>- Evita race condition
>- Garantisce [[Valutazione delle prestazioni#Speedup|speedup]]
## Modello di esecuzione
Possiamo parallelizzare porzioni di un programma seriale e sincronizzare il termine dei thread.
![[execution_model.png|500]]
**Implicit barrier**: sono dei meccanismi automatici che impiega OpenMP per sincronizzare le unità di esecuzione al termine di una regione parallela.
## Direttive
```C
#pragma omp construct [clause[clause...]]
```
Le direttive `{C} #pragma` sono speciali direttive del pre-processore e si applicano al _blocco strutturato_ successivo ad esse.
>[!important] Un punto di uscita
>È importante che ci sia un solo punto di uscita dal blocco parallelo.
>Ad esempio, i `{C} return` non sono ammessi.

### Parallel
Tramite la direttiva
```C
#pragma omp parallel
```
specifichiamo il blocco strutturato di codice da eseguire in parallelo.

>[!note] Thread
>Possiamo specificare il numero di unità di esecuzione al momento dell'esecuzione passando come parametro il numero di unità desiderato.
>![[NUM_THREADS.png|500]]
>Inoltre ci sono delle funzioni che permettono di:
>- `{C}omp_get_thread_num()` ottenere l'identificativo del thread corrente (_rank_)
>- `{C}omp_get_num_threads()` sapere quanti thread sono in esecuzione
>- `{C} omp_set_num_threads(n)` impostare il numero di thread in esecuzione
>
>>[!warning] Attenzione
>>`{C}omp_get_num_threads()` restituisce il numero dei thread _attivi_, mentre `{C}omp_get_max_threads()` restituisce il numero massimo di thread attivabili.

#### Tempi
Per prendere i tempi di esecuzione di un blocco parallelo, facciamo come segue
![[taking_times.png]]
### Atomic
La direttiva `{C}omp atomic` assicura che solo un thread alla volta abbia accesso alla variabile condivisa.
Gli aggiornamenti della variabile condivisa _devono_ avvenire nella forma **read-update-write**, ad esempio `{C} var += x`.

Qui abbiamo un esempio dell'utilizzo della direttiva atomic. Notiamo in realtà che, in questo caso, l'operazione sarebbe più corretto eseguirla tramite [[Pattern di Programmazione Parallela#Reduce|reduce]] 
![[atomic.png|500]]
### Critical
La direttiva `{C}omp critical` protegge l'accesso a sezioni critiche.
Ogni thread esegue la sezione critica ma solo uno alla volta potranno accedervi.

>[!warning] Attenzione
>`{C}omp critical` e `{C} omp atomic` **non proteggono** da race condition!
>>[!example] Esempio
>>In questo caso il codice non fa ciò che ci aspettiamo
>>![[critical_atomic_warning.png|400]]

### Reduction Clause
La clausola **reduction** ci permette di sfruttare OpenMP per eseguire delle [[Pattern di Programmazione Parallela#Reduce|reduce]] in modo semplicissimo.
```C
#pragma omp parallel reduction(<op>:result)
```
dove al posto di `<op>` possiamo inserire gli operatori _binari associativi_ utilizzabili nella reduction. In aggiunta c'è anche la sottrazione (-).

![[reduction_operators.png|300]]
>[!example] Esempio
>![[omp_reduction.png|500]]

>[!faq] Come funziona?
>Semplicemente, per ogni thread, si esegue una reduce sulla variabile selezionata aggiungendo alla fine il valore iniziale della variabile che è stato impostato prima della reduction.
>Vediamo qui un esempio:
>![[how_reduction_works.png|600]]

### for
La direttiva `{C}omp for` viene utilizzata all'interno di blocchi paralleli.
Tramite questa direttiva il compilatore riesce a parallelizzare il `{C}for` in modo che ad ogni thread venga assegnato una porzione di dati. Le variabili del ciclo sono `{C}private` di default.
In alternativa si può utilizzare la direttiva `{C}omp parallel for` per indicare che si vuole parallelizzare un ciclo.
>[!example] Integrale
>Andiamo a calcolare l'area sottesa da `a` a `b` della funzione `f(x)`.
>In questo caso ad ogni thread viene assegnato un frammento dell'area, in modo che poi vengano sommati i risultati tramite un'operazione di [[Pattern di Programmazione Parallela#Reduce|reduce]].
>```C
>double trap3( double a, double b, int n ) { 
>	double result = 0; 
>	const double h = (b-a)/n; 
>#pragma omp parallel for reduction(+:result) 
>	for ( int i = 0; i<n; i++ ) {
>		result += h*(f(a+i*h) + f(a+(i+1)*h))/2;
>	}
>	return result;
>}
>```
>![[trapezoid.png]]

>[!note] Forme corrette per parallelizzare i cicli
>![[for_legal_form.png]]
>- `index` deve essere un intero o un pointer
>- `start`, `end` e `incr` devono essere di tipo compatibile con `index` e non devono cambiare durante l'esecuzione del ciclo
>- `index` deve essere modificato soltanto dall'espressione di incremento del `{C}for`
#### Dipendenze
Non è corretto utilizzare `{C}parallel for` se sono presenti dipendenze nei dati.
>[!example] Esempio
>Vogliamo parallelizzare il calcolo della seguente sommatoria ma notiamo che `{C}factor` presenta una dipendenza sulle iterazioni precedenti.
>![[omp_for_dependencies.png]]
>>[!success] Soluzione
>>Rendiamo `{C} factor` privata in modo che ogni thread possa calcolare la propria porzione di sommatoria
>>![[omp_for_removed_dependency.png]]

>[!tip] Trucco
>Un trucco **empirico** può essere quello di verificare il funzionamento in parallelo del ciclo iterando nell'ordine opposto.
>
>![[for_trick.png]]

### schedule
```C
schedule(type, chunksize)
```
Può essere di tipo (`type`):
 - _static_: le iterazioni sono assegnate in tipo ciclico ai thread in blocchi di dimensione `chunksize`. Se non viene specificata la grandezza dei blocchi $\large\text{chunksize}=\frac{\text{n\_iteration}}{\text{n\_threads}}$  ^9a8e86
 - _dynamic_ o _guided_: le iterazioni vengono suddivise in blocchi di grandezza `chunksize` (`chunksize = 1` se non specificato). I blocchi sono assegnati secondo il paradigma [[Pattern di Programmazione Parallela#Master-Worker paradigm|master-worker]].
 - _auto_: è il compilatore che sceglie come determinare la schedule
 - _runtime_: serve per specificare `type` e `chunksize` ad ogni avvio del programma impostando la variabile d'ambiente `OMP_SCHEDULE`.

>[!note] Default
>Se **schedule** non viene specificato, è il compilatore a decidere quale tipo utilizzare.
>- GCC dovrebbe utilizzare [[#^9a8e86|static]] di default.
>- LLVM utilizza [[#^9a8e86|static]] di default, senza specificare il `chunksize`

>[!example] Esempio
>![[schedule_example.png]]
#### Dynamic/Guided
La differenza da _static_ è che non si è a conoscenza dell'ordine di esecuzione dei thread, perché il primo a liberarsi viene assegnato ad uno dei blocchi.
- **Guided** ha un comportamento in più che consiste nel diminuire la grandezza dei chunk mano a mano che i blocchi vengono completati
#### Scegliere

| Clausola   | Quando usarlo                                                                                                                                           | Nota                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `static`   | La quantità di lavoro di ogni iterazione è circa la stessa, cioè quando il carico è [[Pattern di Programmazione Parallela#^6c7a4d\|non è sbilanciato]]. | Genera il minor overhead a tempo di esecuzione perché è il più semplice da usare.<br>Lo scheduling è fatto a compile-time |
| `dynamic ` | Essendo non prevedibile l'esecuzione, si utilizza in genere quando il carico è [[Pattern di Programmazione Parallela#^6c7a4d\|sbilanciato]]             | Potrebbe avere un maggiore overhead a runtime                                                                             |
>[!tip] Altrimenti
>A volte invece di utilizzare il tipo dinamico, si opta per l'uso di `static` utilizzando una [[Pattern di Programmazione Parallela#Fine-grained vs Coarse-grained|grana fine]] del chunk.

![[Pattern di Programmazione Parallela#^fc57df]]

### collapse
Si tratta di effettuare un collasso di cicli ==perfettamente annidati==, cioè non sono presenti istruzioni tra di loro.
![[collapse_example.png]]
>[!note] Il parametro passato deve essere un intero minore o uguale al numero di cicli presenti.

#### Collassare i cicli
>[!warning] Il collasso dei cicli può essere effettuato solo dove non sono presenti dipendenze tra iterazioni precedenti.

Considerando le iterazioni come una matrice, possiamo immaginare che `{C}collapse` vada a "srotolare" la matrice in un array, in modo da poter partizionare le iterazioni a diversi thread.
![[how_collapse_works.png]]
>[!warning] Attenzione!
>_collapse_ potrebbe introdurre un overhead considerevole.



## Scope delle variabili
>[!note] Programma seriale
In un programma seriale lo **scope** di una variabile indica la parte del programma in cui tale variabile viene utilizzata.

>[!note] OpenMP
>In OpenMP lo **scope** di una variabile indica l'insieme di thread che possono accedere ad essa.

### Tipi
- `{C}shared(x)` tutti i thread hanno accesso alla variabile `x` (==questo scope è impostato di default==)
- `{C}private(x)` ogni thread ha la propria copia di `x` ma _non è inizializzata_. Le modifiche sulla variabile sono perse una volta usciti dal blocco parallelo.
- `{C}firstprivate(x)` funziona come `{C}private(x)` ma le variabili sono già inizializzate con il valore impostato prima del blocco parallelo ^1c2643
- `{C}default(share)` o `{C}default(none)` indicano il tipo di scope di default. È =={accent}consigliato== utilizzare `{C}default(none)` perché obbliga a specificare quali variabili vanno impostate a shared/private/firstprivate.

>[!example] Array condiviso
>In questo esempio notiamo che bisogna prestare attenzione quando si lavora con i puntatori perché l'array `a[]` viene correttamente copiato in ogni thread, ma `*b` essendo un puntatore, contiene un indirizzo che viene copiato in ogni thread, ciò vuol dire che =={red}ogni unità di esecuzione accede alla stessa area di memoria!==
>![[shared_array.png]]

## Mapping dei thread
In questa sezione ci concentriamo su come vengono assegnati i thread software sui core hardware.

Come già visto, i processori moderni suddividono i propri core in
- **P-Core**: core specifici per le performance
- **E-Core**: core specifici per essere efficienti

Possiamo utilizzare le variabili d'ambiente:
- `{C}OMP_PLACES` definisce la mappatura tra i core e i thread
	- Richiede una lista di valori che specificano quali core devono essere utilizzati, in caso ci fossero più thread che core, si assegnano i thread ciclicamente.
	- Esempi:
		- `{C}OMP_PLACES="0, 1, 2, 3"` 
		- `{C}OMP_PLACES="0:4"` indico il range di core
		- `{C}OMP_PLACES="0:8:2` vuol dire: prendi 8 numeri partendo da 0 separando ogni numero di 2 dal suo predecessore
	- `{C}OMP_DISPLAY_ENV=true` tramite questa variabile d'ambiente, prima dell'esecuzione vengono stampate diverse variabili, tra cui come vengono espansi i thread![[DISPLAY_ENV.png]]
- `{C}OMP_PROC_BIND=true` indica allo scheduler del sistema operativo di non migrare su un core di tipo diverso

>[!example] Esempio
>Andiamo a vedere come si comporta il processore in base al tipo di schedule e al tipo di core utilizzati.
>![[Example_wall-clock_mapping_threads.png]]
>![[Example_speedup_mapping_threads.png]]

>[!example] Odd-Even Transposition Sort
>È una variante del _bubble sort_ e ha complessità di $\Theta(n^2)$.
>Si basa su una serie di passi:
>- Passi pari: confronto gli indici degli elementi pari con il successivo e se non sono in ordine li scambio
>- Passi dispari: faccio lo stesso ma con gli elementi di indice dispari
>
>Il passo viene deciso in base alla fase: se la fase è dispari allora ci sarà un passo dispari, se no sarà pari.
>>[!faq] Come facciamo a sapere quante fasi ci sono?
>>Il numero di fasi sono uguali alla lunghezza del vettore da riordinare.
>>Questo perché ogni elemento può essere scambiato per un massimo di $n$ volte.
>
>>[!example] Esempio di passo pari
>>![[odd_step_example.png]]
>
>È facilmente visibile dal grafico che questo algoritmo è parallelizzabile in modo semplice perché ogni passo opera su coppie di elementi privi di dipendenze.
>![[first_OpenMP_Odd-Even.png]]
>I thread hanno il seguente comportamento
>![[first_odd_even_solution_flow.png|200]]
>
>
>Un'altra soluzione può essere
>![[odd-even_second_solution.png]]
>>[!faq] Perché questa soluzione va bene?
>>Consideriamo il seguente codice
>>
>>![[inner_for_explanation.png]]
>>Vediamo il comportamento è differente: tutti i thread eseguono tutte le iterazioni del ciclo esterno, mentre si spartiscono in modo statico il ciclo interno effettuando una sincronizzazione prima di iterare nuovamente il ciclo più esterno.
>
>Vediamo che non conviene usare la seconda soluzione
>![[odd-eve-test.png]]

^6aa0c8

## Sincronizzazione
- `{C}#pragma omp barrier` è una dichiarazione che introduce una sincronizzazione a barriera nel punto in cui viene dichiarata
- `{C}#pragma omp master` segna un'area del blocco parallelo che viene eseguita esclusivamente dal _thread master_ (`rank = 0`), gli altri thread saltano questa regione
- `{C}#pragma omp single` specifica che il primo thread ad entrare in quella regione è quello che dovrà eseguirla, gli altri thread saltano la regione

>[!note] Barriera implicita
>Successivamente alla direttiva _master_ e _single_ è presente una barriera implicita dove tutti i thread si sincronizzano.

>[!example] Esempio
>![[sync_example.png]]


## Task
Sono delle unità di lavoro composte da
- blocco di codice che deve essere eseguito
- eventuali parametri necessari per istanziare le variabili all'interno del blocco di codice

### pragma omp task
![[omp_task.png]]
#### Data scoping
Lo scoping delle variabili all'interno di task funziona in modo leggermente diverso da quello che abbiamo visto finora.
>[!info] Ogni variabile privata nel blocco `parallel` viene impostata come [[#^1c2643|firstprivate]] all'interno della task.

>[!example] Esempio
>In questo esempio vediamo che le variabili private `b` e `d` vengono impostate a firstprivate nel blocco `omp task`
>
>![[Task_scopes.png|500]]

>[!tip] I task sono comodi per eseguire operazioni in parallelo su liste di puntatori

>[!warning] Bisogna però prestare attenzione agli scope delle variabili quando si itera la lista

>[!example] Liked list
>In questo caso, essendo la lista `shared`, ogni task avrà lo stesso valore
>
>![[wrong_pointer_list.png]]
>>[!success] Versione corretta
>>![[correct_pointer_list.png]]

#### Sincronizzazione
Per sincronizzare i thread o sapere quando tutte le task sono terminate si fa uso di:
- _barriera implicita_: quando termina il blocco `#pragma omp parallel`
- _taskwait_: `{c}#pragma omp taskwait` viene usata per sincronizzare le task, aspettando che tutte le task terminino.

>[!example] Esempio `taskwait`
>![[example_taskwait.png]]










