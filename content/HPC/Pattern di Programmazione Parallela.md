>[!quote] Design Pattern
>A design pattern is “a general solution to a recurring engineering problem”.
>A design pattern _is not a ready-made solution_ to a given problem! It is a description of how a certain kind of problem can be solved

## Embarrassingly Parallel
>[!note] Definizione
>È un pattern che si applica quando un problema può essere scomposto in task indipendenti che richiedono comunicazione quasi nulla tra di loro.

Ad Esempio:
- Somma di array
- Calcolo dell'insieme di Mandelbrot
- 3D rendering
- Brute force password cracking

>[!example] Somma di array
>![[Embarrassingly parallel.png]]

### Scatter-Gather
Questo pattern rende esplicito il passaggio in cui, nel [[#Embarrassingly Parallel]],  l'input viene suddiviso (fase _Scatter_) e il momento in cui vengono "ricomposti" i risultati per produrre l'output (fase _Gather_)
![[Scatter-Gather.png]]
### Partizione
Il _dominio di input_ (spazio dei dati input) viene diviso in parti ==disgiunte==  chiamate **partizioni**.
Ogni processore opera su una partizione. 
>[!tip] Questo pattern è utile per applicazione che mostrano _località spaziale_

>[!Example] Prodotto matice-vettore
>Si vuole calcolare $Ax=b$
>- La matrice $A$ è divisa in $P$ blocchi orizzontali (partizioni)
>- Il vettore $x$ deve essere condiviso/replicato su tutti i processori
>Ogni processore moltiplica ogni riga del proprio blocco per la copia del vettore $x$ ottenendo una parte di $b$.
>![[example_partition.png]]

Esistono due tipi di partizionamento:
- **Regolare**: I dati del dominio vengono suddivisi in modo equo tra loro
- **Irregolare**: sono partizioni che non hanno necessariamente la stessa grandezza o forma.

Esistono anche diverse dimensioni (o grana) delle partizioni:
- **Fine-Grained (grana fine)**: ho molte partizioni molto piccole
- **Coarse-Grained (grana grossa)**: ho meno partizioni ma più grandi

>[!warning] Un partizionamento si dice che è regolare o irregolare solo sulla base della ==divisione dei dati==

#### 1-D Partitioning
>[!Note] Partizionamento a blocchi (_block_)
>![[block_partitioning.png]]
>È un partizionamento a grana grossa

^b66a39

>[!note] Partizionamento ciclico (_cyclic_)
>In modo ciclico vado a dividere il dominio.
>![[partizionamento_ciclico.png]]
>È un partizionamento a grana fine.

#### 2-D Block Partitioning
Posso eseguire il [[#^b66a39|block partitioning]] in più modi
![[block_partitioning2D.png]]
#### 2-D Cyclic Partitioning
Anche qui ho più modi per partizionare
![[Cyclic_2D.png]]
Oppure faccio una partizione ciclica sia sulle righe che sulle colonne:
![[cyclic_cyclic.png|400]]

>[!abstract] Irregolare
>Volendo si potrebbe anche eseguire un partizionamento irregolare.
>È un tipo di partizionamento molto comune quando si trattano problemi reali, dato che la nostra realtà non è regolare.
>>[!example] Superficie di un lago approssimata con _mesh triangolare_
>>![[triangular_mesh.png]]

#### Index mapping
Tipicamente gli elementi hanno un _indice globale_ e un _indice locale_.
![[index_mapping.png]]
Assumendo che tutti i blocchi abbiano la stessa lunghezza ($\text{BLKLEN}$) possiamo ricavare l'indice globale tramite la seguente formula:
$$
\large\text{Global\_index}=\text{Local\_index}+\text{Block\_id}\times\text{BLKLEN}
$$
#### Fine-grained vs Coarse-grained
- **Fine-grained**: è solitamente preferibile per avere un migliore bilanciamento del calcolo per distribuire in modo equo i dati ai processori.
  >[!warning] Potrebbe impiegare molta comunicazione se il partizionamento è troppo fine
  
- **Coarse-grained**: Migliora il rapporto computazione/comunicazione perché si evita di creare molto _overhead_ dato da numerose piccole comunicazioni, preferendo un minor numero di scambio di messaggi ma con un maggior numero di dati.
  >[!warning] Potrebbe causare sbilanciamento del carico perché non è detto che in un problema la quantità di lavoro da fare rimanga la stessa ^5c0c71

>[!info] Il partizionamento "ottimo" lo si trova in maniera empirica provando vari tipi di partizionamento
>![[partizionamento_ottimale.png]]

^fc57df

>[!Example] Esempio di sbilanciamento del carico: Insieme di Mandelbrot
>L'insieme di _Mandelbrot_ è un sottoinsieme dell'insieme dei numeri complessi $\mathbb{C}$ ($a+ib$) i cui punti $c$ della sequenza $z_n(c)$ per $n\rightarrow+\infty$ ==non diverge==.
>![[SequenzaMadelbrot.png|400]]
>[Link Desmos](https://www.desmos.com/calculator/acl6xmr9as?lang=it)
>Notiamo che finché rimaniamo all'interno dell'insieme di Mandelbrot la sequenza non diverge, invece uscendo vediamo che la sequenza diverge.
>Come definiamo l'insieme?
>- Se $|z_n(c)|\leq 2$ dopo un certo numero di iterazioni, coloriamo il pixel di nero (l'elemento appartiene all'insieme)
>- Se invece $|z_n(c)| > 2$ il colore dipende dal numero di iterazioni impiegate per trovare il risultato
>
>![Insieme di Mandelbrot - Wikipedia](https://upload.wikimedia.org/wikipedia/commons/2/21/Mandel_zoom_00_mandelbrot_set.jpg)

^6c7a4d

##### Calcolare l'insieme di Mandelbrot
>[!abstract] Codice
>![[Pseudo_mandelbrot.png]]
>- `maxit` è il numero massimo di iterazioni che vogliamo eseguire
>- `x*x + y*y ≤ 2*2` invece di eseguire il modulo con la radice, per risparmiare, eleviamo tutto al quadrato
>In questo codice andiamo a disegnare i punti tramite `plot` ogni volta che viene superato il numero di iterazioni massime oppure se la condizione $|z_n(c)|\leq 2$ non è rispettata.
>In base al numero di iterazioni verrà scelto il colore dei punti.

Decidiamo di parallelizzare il problema dividendo in aree il dominio del problema:
![[mandelbrot_partitioning.png]]
Abbiamo così 3 processori che lavorano parallelamente al problema, però il partizionamento risulta [[#^5c0c71|a grana grossa]] e quindi è ==molto sbilanciato== perché il processore che lavorerà sulla partizione di mezzo avrà molto più lavoro da fare dato che calcolerà molti più punti neri, che sappiamo per certo impiegheranno `maxit` iterazioni.

Così facendo sprechiamo delle risorse perché avrò soltanto un processore che lavora mentre gli altri non stanno eseguendo niente.
![[sync_barrier.png]]

>[!faq] Come bilanciare meglio il carico?
>Ho due opzioni:
>- _Ridurre la grana_: riducendo la grana e applicando un partizionamento ciclico probabilmente ho un bilanciamento migliore. Attenzione però all'overhead causato dalla comunicazione tra processi.
>- _Allocazione dinamica delle task_: utilizzando paradigmi come **master-worker** andiamo ad assegnare una nuova task al primo processo che termina la propria esecuzione.

#### Master-Worker paradigm
Utilizzando un partizionamento a grana fine, assegnamo dinamicamente i sotto problemi ai primi a terminare tra i processi in esecuzione.
![[master-slave.png]]

##### Insieme di Mandelbrot
###### Partizionamento a grana grossa
![[mandelbrot-coarsed.png]]
###### Partizionamento a grana fine e ciclico
![[mandelbrot_cyclic.png]]
###### Partizionamento dinamico Master-Worker
![[mandelbrot_master-slave.png]]

### Stencil
Vogliamo elaborare il contenuto della matrice rimpiazzando ogni cella con un valore calcolato dall'insieme delle celle intorno ad essa.
>[!Example] Questo tipo di pattern viene spesso usato nell'elaborazione di immagini per applicare dei filtri.

>[!note] 2D Stencil
![[2D_Stencil.png]]

>[!note] 3D Stencil
>![[3D_Stencil.png]]

Le computazioni di tipo stencil richiedono quasi sempre _due domini_:
- Un dominio read-only che corrisponde all'input
- Un dominio su cui vanno eseguiti i calcoli che corrisponde all'output

![[Stencil_domains.png]]
#### Celle Fantasma
>[!faq] Come gestiamo le celle che si trovano sui bordi del dominio?
>Si hanno due tipi di approcci:
>- Si cambia la forma dello stencil per le celle in prossimità dei bordi
>- Si aggiunge una **ghost area** che circonda il dominio per poter utilizzare lo stencil anche sui bordi.
>
>![[ghost_area.png|]]

>[!tip] Come definiamo la Ghost Area
>Ipotizziamo che il nostro dominio sia un foglio e di arrotolarlo a forma di ciambella come nell'immagine qui sotto.
>![|800](https://i.sstatic.net/El5pQ.gif)
>Facendo in questo modo creiamo la _Ghost Area_ utilizzando dati già presenti nel nostro dominio: ogni bordo (e angolo) verrà aggiunto all'area opposta in modo da poter eseguire operazioni sui bordi in tranquillità.
>Il risultato sarà una periodicità dei bordi come nella seguente immagine.
>![[fill_ghost_cells.png|500]]
>
>Un altro modo è quello di andare a copiare anche le celle fantasma del relativo bordo ottenendo il seguente risultato.
>![[full_line_ghost_area.png|500]]
>![[full_line_result.png|500]]



>[!success] Processare il nuovo dominio ha una struttura [[#Embarrassingly Parallel]] 
>Questo è un ottimo problema per le architetture a _memoria distribuita_
>>[!faq] Come eseguiamo la partizione?
>>Consideriamo di avere uno [[2D_Stencil.png|stencil a 5 celle]].
>>Dividiamo la matrice in 3 partizioni, una per processore.
>>Dobbiamo gestire la ghost area per i bordi adiacenti tra le 3 parti perché hanno delle celle sovrapposte come nell'immagine seguente.
>>![[overlapping_cells_stencil.png|300]]
>>Prima si ha una sorta di _handshake_ dove le partizioni si "scambiano" le _overlapping cells_ e poi viene definita la ghost area, come già visto, per ogni partizione.
>>![[partitioned_ghost_area.png|400]]

>[!note] Altro metodo
>Possiamo "creare" la ghost area utilizzando il calcolo utilizzato da pacman per poter teletrasportare da un bordo all'altro il personaggio.
>In questo modo non necessitiamo di memoria extra per salvarci tutta la ghost area.
>>[!warning] Attenzione
>>Questo calcolo richiede l'utilizzo dell'operatore `%`  che non è nativamente supportato da alcuni processori, ciò vuol dire che in alcuni casi particolari potrebbe restituire una degradazione delle prestazioni.
>
>>[!fail] Nessun vantaggio
>>Utilizzando le operazioni in modulo (`%`) otteniamo un certo overhead che comporta ad avere una complessità computazionale totale di $\Theta(n^2)$ a confronto con il $\Theta(n)$ dell'inizializzazione della ghost area come visto in precedenza.
>
>>[!success] Conviene inizializzare la ghost area.

### Reduce
La **reduction** è l'applicazione di un operatore associativo binario (somma, massimo minimo, ecc.) agli elementi di un array $[x_0,x_1, ..., x_{n-1}]$
- sum-reduce( $[x_0,x_1, ..., x_{n-1}]$ ) $=x_0+x_1+x_2+...+x_{n-1}$
- min-reduce( $[x_0,x_1, ..., x_{n-1}]$ ) $= \min \{x_1, x_2, ..., x_{n-1}\}$
- $...$

Una riduzione può essere realizzata in ==$O(log_{2}(n))$== passi paralleli.

>[!example] Sum-Reduce
>Possiamo dividere in due l'array e sommare il primo elemento della prima metà con il primo della seconda e così via. 
>![[sum-reduce-1.png]]
>Otterremo un nuovo array di lunghezza $n/2$ su cui eseguire di nuovo il procedimento fino ad avere il risultato della somma totale.
>![[sum-reduce-2.png]]

#### Work Efficiency
Un algoritmo parallelo è detto **work efficient** quando la somma del numero di operazioni dei processi è uguale al numero di operazioni dell'algoritmo seriale ottimo.

Nella _reduction_ la somma delle operazioni è $O(n)$ e quindi è work efficient.
![[work-efficient.png]]

### Scan (Prefix Sum)
Lo **scan**, come per [[#Reduce]], applica un operatore binario associativo per ogni sottoinsieme di un array  $[x_0,x_1, ..., x_{n-1}]$.
Sia $\text{op}$ l'operatore binario associativo
Si ha che
- Lo scan _inclusivo_ opera nel seguente modo 
  $$\large
\begin{aligned}
&\text{inclusive-scan}(\text{op},\ [x_0, x_1,\ \dots,\ x_{n-1}]) = [y_0, y_1, \dots, y_{n-1}] \\
&\text{where} \\
&\quad y_0 = x_0 \\
&\quad y_1 = x_0\ \text{op}\ x_1 \\
&\quad y_2 = x_0\ \text{op}\ x_1\ \text{op}\ x_2 \\
&\quad \dots \\
&\quad y_{n-1} = x_0\ \text{op}\ x_1\ \text{op}\ \dots\ \text{op}\ x_{n-1}
\end{aligned}
$$
- Lo scan _esclusivo_ opera invece così
$$\large
\begin{aligned}
&\text{exclusive-scan}(\text{op},\ [x_0, x_1, \dots, x_{n-1}]) = [y_0, y_1, \dots, y_{n-1}] \\
&\text{where} \\
&\quad y_0 = 0 \\
&\quad y_1 = x_0 \\
&\quad y_2 = x_0\ \text{op}\ x_1 \\
&\quad \dots \\
&\quad y_{n-1} = x_0\ \text{op}\ x_1\ \text{op}\ \dots\ \text{op}\ x_{n-2}
\end{aligned}
$$
>[!note] Il valore di $\large y_{0}$ è inizializzato con il valore neutro dell'operatore 


>[!example] Esempio di somma inclusiva ed esclusiva
>![[inclusive-scan-sum.png]]
>![[exclusive-scan-sum.png]]

>[!note] Implementazione Seriale
>L'implementazione seriale del pattern scan ha complessità pari a $\large\Theta(n)$
>![[Serial-scan.png]]
#### Parallel Exclusive Scan
Con le seguenti procedure di **up-sweep** e **down-sweep** possiamo parallelizzare lo scan pattern.
>[!tip] Work efficiency
>Questa algoritmo è [[#Work Efficiency|work efficient]] perché la quantità di lavoro fatta tra tutte le unità di esecuzione è pari a quella dell'implementazione seriale ottima.

>[!note] Up-sweep
>![[up-sweep.png]]

>[!note] Down-sweep
>>[!info] L'ultima somma viene rimpiazzata con uno zero perché stiamo trattando uno scan esclusivo
>
>![[down-sweep.png]]

##### Line of sight
Vediamo un caso in cui possiamo applicare lo _scan pattern_.

Ipotizziamo di voler installare un'antenna su di un terreno scosceso, dobbiamo quindi far si che sia visibile in linea retta da ogni punto per poter inviare e ricevere segnali.
Considerando il disegno qui sotto partiamo dalla "cima" di sinistra e andiamo verso destra verificando che l'antenna in `h[0]` sia visibile.
>[!note] I primi due punti sono sempre _connessi_

Per verificare che ci sia il segnale confrontiamo ad ogni passo l'angolo che si ha rispetto all'antenna. Se l'angolo attuale è maggiore dell'angolo massimo precedente allora siamo esposti correttamente rispetto l'antenna.

![[line_of_sight_hq 2.gif]]
>[!abstract] Implementazione seriale
>Questa è l'implementazione dell'algoritmo seriale per risolvere il problema _Line of sight_.
>Nei `for`:
>1. Viene calcolato ogni angolo rispetto al punto iniziale.
>   Questa operazione può essere parallelizzata perché ogni operazione è impendente dall'altra
>2. Viene eseguito lo _scan pattern_ con operatore $\max$. Si esegue in parallelo come visto in precedenza
>3. Viene verificata l'esposizione all'antenna di ogni punto. Si può eseguire facilmente in parallelo
>
>![[Line-of-sight-serial.png]]

