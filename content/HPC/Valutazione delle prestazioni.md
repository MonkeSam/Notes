Valutare le prestazioni di un programma parallelo ci serve a capire se l'algoritmo presenta errori o se possiamo applicare degli accorgimenti per guadagnare risorse/tempo in una esecuzione.

Consideriamo di avere un programma seriale che ha
- 12 task
- Ogni task impiega 1s

Abbiamo un tempo totale di esecuzione pari a 12s.
![[12sec.png]]
Parallelizzando il programma in 3 unità di esecuzione ci aspettiamo che il tempo per terminare il programma sia 4s.
![[parallel_tasks.png]]

>[!attention] Finora stiamo supponendo che le task impieghino lo stesso tempo di esecuzione e che siano indipendenti l'una dall'altra.

Se dovessero esserci dipendenze o se il carico dovesse essere sbilanciato otterremo sicuramene uno spreco di risorse.
>[!example] Carico sbilanciato
>I processi P2 e P3 impiegano del tempo senza eseguire perché le loro task sono più brevi
>![[inbalanced_task.png]]

>[!example] Dipendenze
>In questo caso le task hanno delle dipendenze, quindi per l'esecuzione di una task è necessario il termine di un'altra.
>Le dipendenze obbligano spesso i processori a dover aspettare il termine di determinate task.
>In particolare identificando il percorso composto dal maggior numero di task dipendenti (**critical path**) sappiamo che il termine dell'esecuzione non potrà avvenire in un tempo inferiore a quello del _cammino critico_.
>![[dependecy_path.png]]

## Scalabilità
È un concetto con cui si intendono diverse cose:
- Quanto più velocemente posso risolvere un problema con $p$ processi invece che con uno
- Quanto lavoro in più posso fare con $p$ unità di esecuzione in modo da impiegare lo stesso tempo impiegato con $p=1$

## Speedup
Siano
- $\large p$ il numero di unità di esecuzione
- $\large T_{\text{serial}}$ il tempo di esecuzione del programma seriale
- $\large T_{\text{parallel}}(p)$ il tempo di esecuzione del programma parallelo con $p$ unità di esecuzione

Definiamo lo **speedup** come
$$\Large
S(p)=\frac{T_{\text{serial}}}{T_{\text{parallel}}(p)} \approx \frac{T_{\text{parallel}}(1)}{T_{\text{parallel}}(p)}
$$
>[!note] Speedup relativo
>Noi utilizzeremo il secondo rapporto per misurare le prestazioni dei programmi perché non sempre si è in possesso del programma seriale e quindi si esegue il programma parallelo come se fosse seriale.
>La formula che useremo prende il nome di _speedup relativo_.

>[!tip] Speedup ottimale
>Lo speedup ottimale è $S(p)=p$ perché l'upper-bound dello speedup è proprio $p$.
>>[!example] Perché
>>Considerando un programma seriale che termina in 10s, ci aspettiamo che la versione parallela con $p=2$ termini in massimo 5s perché vorrebbe dire dividere perfettamente il lavoro sulle due unità di calcolo.
>
>
>Quindi realisticamente avremo che $S(p)\leq p$

>[!faq] È possibile avere dei casi in cui $\large S(p)>p$ ?
>Si! 
>==Tutto dipende dall'hardware.==
>In alcuni casi le esecuzioni parallele sfruttano al meglio l'hardware della macchina, ottenendo così uno _speedup superlineare_.
>In altri casi è dovuto al hardware eterogeneo: dato che i processori odierni sono formati da core dedicati alle prestazioni e core dedicati al risparmio dell'energia, capita che nel momento di esecuzione del programma parallelo si vadano a sfruttare di più i core dedicati alle prestazioni.

>[!warning] ATTENZIONE!
>Non utilizzare mai il tempo del programma seriale per calcolare lo speedup.
>==Noi lo calcoleremo solo con il tempo del programma parallelo con una sola unità di esecuzione.==

### Speedup Lineare
Definiamo lo **speedup lineare** come $S(p)=p$. Nella pratica è davvero raro si possa ottenere uno speedup di questo tipo perché vorrebbe dire che il programma eseguito è parallelizzabile al 100%, di solito non è così perché spesso si hanno dei passaggi seriali all'interno di un programma.

I passaggi seriali in questione sono ad esempio:
- Dipendenze dei dati
- Bottleneck (es. risorse condivise)
- Startup overhead (configurazione del problema)
- Costi di comunicazione

Definiamo
- $\large\alpha \in [0,1]$ la porzione del programma seriale che _non_ può essere parallelizzata

Di conseguenza $(1-\alpha)$ sarà la porzione parallelizzabile, allora ridefiniamo il tempo di esecuzione parallela come
$$\Large
T_{\text{parallel}}(p)=\alpha T_{\text{serial}}+\frac{(1-\alpha)T_{\text{serial}}}{p}
$$
>[!example] Esempio
>Vediamo come abbiamo sempre un tempo costante dovuto alla porzione non parallelizzabile del programma.
>![[non-parallelo.png|300]]
>![[non-parallelo-1.png|300]]
>![[non-parallelo-2.png|300]]

>[!faq] Qual è lo speedup massimo?

#### Legge di Amdahl
Sapendo che lo [[#Speedup Lineare]] è il miglior risultato che possiamo ottenere, andiamo a sostituire nella formula dello speedup il tempo parallelo $\large T_{\text{parallel}}(p)$ trovato in precedenza.
$$\large
S(p) = \frac{T_{\text{serial}}}{T_{\text{parallel}}(p)} = \frac{T_{\text{serial}}}{\alpha T_{\text{serial}} + \dfrac{(1-\alpha)T_{\text{serial}}}{p}} = \frac{1}{\alpha + \dfrac{(1-\alpha)}{p}}

$$
Con la _legge di Amdahl_ andiamo a trovare lo speedup massimo ottenibile:
$$\large
S(p)=\frac{1}{\alpha + \dfrac{(1-\alpha)}{p}}
$$
Per $\large p$ che va a $+\infty$ otterremo che lo speedup è limitato superiormente:
$$\large
S(p)_{\max}=\frac{1}{\alpha}
$$
>[!abstract] Grafico
>Con il seguente grafico possiamo notare che, nonostante si aumentino le unità di esecuzione, si tende a non ottenere miglioramenti.
>![[max-speedup.png]]

>[!note] N.B.
>Nella realtà lo speedup dopo un certo numero di processori tende a peggiorare per colpa della gestione delle risorse da parte del sistema operativo che si ritrova a dover effettuare molte operazioni seriali per la comunicazione tra processi e l'assegnazione dei dati in memoria condivisa.

## Efficienza di scalabilità

### Strong scaling
È l'efficienza misurata all'incremento delle unità di esecuzione $\large p$ mantenendo fissa la dimensione del problema.
_Scopo_: diminuire il tempo totale di esecuzione aumentando il numero di processori $\large p$

La definiamo come
$$\large
E(p)=\frac{S(p)}{p}=\frac{T_{\text{parallel}}(1)}{p\times T_{\text{parallel}}(p)}
$$
#### Grafico
L'andamento di $\large E(p)$ è asintotico per $\large p\rightarrow +\infty$ perché, come abbiamo già visto, per la [[#Legge di Amdahl]] lo speedup tende a $\Large\frac{1}{\alpha}$.
![[strong-scaling.png]]
### Weak scaling
È l'efficienza misurata all'incremento dei processori $\large p$ mantenendo fissa la dimensione del lavoro ==per processo==.
_Scopo_: risolvere problemi sempre più grandi nella stessa quantità di tempo.

La definiamo come
$$\Large
W(p)=\frac{T_{1}}{T_{p}}
$$
Dove
- $\large T_{1}$ indica il tempo di esecuzione con un solo processore
- $\large T_{p}$ indica il tempo di esecuzione con $\large p$ processori

#### Quantità di lavoro
Sia $\large f(n_{p},p)$ la quantità di lavoro svolta da ogni unità di esecuzione.
Con
- $\large n_{p}$ è la dimensione dell'input
- $\large p$ sono i processori

Il nostro obiettivo è far si che la grandezza dell'input non comporti una variazione del tempo di esecuzione in rapporto al numero di processori.
Cioè
$$\large
f(n_{p},p)=\text{costante}
$$
>[!example] Prodotto tra matrici
>Dato $\large n_{p}$ , la quantità di lavoro seriale per eseguire il prodotto di due matrici $\large n_{p} \times n_{p}$ è pari a $O(n_{p})$ 
>La versione OpenMP del programma esegue un lavoro pari a $\large f(n_{p},p)=\frac{n_{p}^3}{p}$ per ogni processore.
>Possiamo calcolare la quantità di lavoro seriale per ogni unità di esecuzione:
>$$\large
>\begin{align}
>\frac{n_{p}^3}{p}= \text{const} \\
>n_{p}=\sqrt[3]{p\times \text{const}} \\
>n_{p}=\sqrt[3]{p} \times \text{const}^{\prime}
>\end{align}
>$$
>Quindi il carico di lavoro di ogni processo $n_{p}$ è proporzionale a $\sqrt[3]{p}$ con una costante $\text{const}^{\prime}$ 

## Misure
>[!note] Strumenti
>- _OpenMP_: `{C}omp_get_wtime()`
>- _MPI_: `{C}MPI_Wtime()`
>- _Soluzione generica_: `{C}clock_gettime()`
>
>>[!error] Soluzione sbagliata: `{C} clock()`

### Valori
>[!important] Non utilizzare troppe cifre decimali nelle misurazioni!

Il sistema operativo introduce piccoli errori dovuti a diversi fattori. Bisogna utilizzare al massimo **3 cifre decimali**.
![[3-digits.png]]

>[!note] N.B.
>Bisogna sempre specificare l'hardware che esegue le misurazioni
>- **CPU**
>	- Tipo di processore
>	- Numero di core
>	- Se utilizza HyperThreading
>	- Frequenza di clock
>	- Quantità di RAM
>	- Sistema Operativo
>	- Compilatore (versione e flag selezionate)
>- **GPU**
>	- Tipo di scheda video
>	- Numero di core
>	- Frequenza di clock
>	- Quantità di VRAM
>	- Compilatore (versione e flag selezionate)

### Graphics good practice
>[!tip] Non usare i grafici quando non necessari!
>Possono bastare le parole a volte. 
>![[unnecessary.png|400]]
>
#### Caption
Ogni figura, grafico o tabella deve avere una _caption_ numerata da cui si riesce ad intuire immediatamente ciò che si sta descrivendo.
#### Origini degli assi
Bisogna sempre includere le origini degli assi per evitare di enfatizzare troppo dati che in realtà risultano piccole.
![[Axis-origin.png]]
#### Nomi
È meglio preferire i nomi ai simboli per indicare i dati in modo che siano comprensibili più facilmente.
![[no-symbols.png]]

#### Dati
I dati vanno mostrati interamente e non solo per le porzioni che ci interessano, perché è importante vedere anche l'andamento.
![[complete-data.png]]
#### Sovrapposizione
Non vanno sovrapposti dati correlati dalle stesse variabili ma che indicano valori differenti.
>[!example] Esempio
>- _Speedup_: è un coefficiente
>- _Wall clock time_: misura in secondi
>
>![[overlapped-data.png|500]]

#### Valori intermedi
Non inventare valori intermedi quando non esistono.
![[intermedi.png]]

