>[!faq] Perché ci interessa così tanto ottimizzare i cicli?
>In un programma il 90% dell'esecuzione viene svolta nel 10% del codice: nei cicli.
>>[!tip] Vogliamo capire quando è possibile parallelizzare i cicli per rendere un programma efficiente.

## Dipendenze dei dati
Una dipendenza si ha quando avendo due accessi alla stessa porzione di memoria, almeno uno dei due è un accesso in scrittura.

- **Data-Flow** _or true dependence_: operazioni ==RAW== (Read After Write)![[raw.png]] ^457151
- **Anti dipendenza**: operazioni ==WAR== (Write After Read)![[war.png]]
- **Output dependence**: operazioni ==WAW== (Write After Write)![[waw.png]]
- **Control dependence**: l'esecuzione di un'operazione dipende da un'altra operazione.![[control_dependence.png|500]]

>[!note] Dipendenza
>Definiamo graficamente una dipendenza nel seguente modo.![[graphic_dependence.png]]

## Teorema Fondamentale della Dipendenza
>[!success] Teorema
>Ogni riordinamento delle operazioni che mantiene le dipendenze di un programma, preserva lo scopo del programma.

### Riconoscere le dipendenze
Per riconoscere le dipendenze bisogna fare attenzione a
- Le istruzioni di _scrittura_ che coinvolgono variabili che presentano modifiche nel loop
- Se il valore di una variabile dipende da un'altra variabile la cui assegnazione avviene in una iterazione precedente

>[!example] Nessuna dipendenza
>In questo caso `a[i]` è l'unica variabile che viene assegnata e dipende da `b[i]` e `c[i]` che non subiscono modifiche.
>![[es1_dependence.png]]
>>[!success] Questo Loop è parallelizzabile :)

>[!example] Dipendenza tra iterazioni
>In questo caso abbiamo una dipendenza [[#^457151|RAW]] 
>![[RAW_example.png]]
>>[!fail] Questo Loop non è parallelizzabile :(
>
>>[!warning] In realtà potrebbero esserci altri modi meno intuitivi per rendere il ciclo parallelo.
>>In questo caso stiamo vedendo un chiaro esempio di [[Pattern di Programmazione Parallela#Reduce|reduce]] che abbiamo già visto come parallelizzare.
>>

>[!example] Esempio
>Questo è un esempio più complesso che presenta diverse dipendenze.
>![[dependence_complex.png]]

### Rimuovere le dipendenze
Andiamo a vedere come possiamo rimuovere le dipendenze dei cicli.
#### Looping Aligning
In certi casi è necessario allineare gli indici dei cicli per rimuovere le dipendenze.
![[loop_aligning.png]]
#### Loop Interchange
Cambiando l'ordine degli indici si evita un parallelismo di tipo [[Pattern di Programmazione Parallela#Fine-grained vs Coarse-grained|coarse-grained]].
![[interchange_loop.png]]
Nell'esempio qui sopra vediamo che inizialmente, per come scritto il codice, andiamo ad eseguire in parallelo una colonna per volta, ciò vuol dire che abbiamo un partizionamento a grana fine che può risultare poco efficiente a causa di un eccessivo overhead.
Scambiando l'ordine dei cicli (_non sempre è possibile_) riusciamo a ottenere una grana più grossa del partizionamento diminuendo l'overhead in eccesso.
>[!success] Quindi invece di parallelizzare ogni elemento di una colonna, parallelizziamo le righe della matrice.

#### Dipendenze difficili
Si consideri il seguente esempio
![[diagonal.png]]
>[!warning] Ogni cella dipende da altre tre celle.

Notiamo che la parallelizzazione
- Del _ciclo esterno_ (Righe parallele) mantiene comunque delle dipendenze tra iterazioni.![[inner_parallel.png]]
- Del _ciclo interno_ (`i` rimane fissa), calcolando in parallelo ogni elemento della riga `i` rimangono comunque delle dipendenze tra iterazioni. ![[outer_parallel.png]]

>[!success] Soluzione
>È possibile parallelizzare il loop interno scorrendo la matrice in diagonale!
>![[wavefront-sweep.png|500]]
>In questo modo non ci sono dipendenze con le iterazioni precedenti ma bisogna comunque eseguire una diagonale alla volta.






