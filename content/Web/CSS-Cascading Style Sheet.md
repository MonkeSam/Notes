Il **CSS** nasce dall'esigenza di una tecnologia per la resa grafica degli ipertesti e ha lo scopo di separare contenuto e presentazione nelle pagine Web:
- _Html_ serve per definire il ==contenuto== senza fornire indicazioni su come presentarlo
- _CSS_ serve per definire come il contenuto deve essere presentato

>[!note] Vantaggi
>Premette di presentare lo stesso contenuto in diversi modi e anche su diversi dispositivi.
>Inoltre non necessita di scaricare contenuti aggiuntivi, riducendo così il tempo di caricamento

## Utilizzo
Si hanno quattro modi differenti per utilizzare gli stili _css_
- **Inline**: si definisce lo stile del componente all'interno del suo attributo ```{css} style=""```  
- **Header**: Posizionando il tag ```{css} <style>```, che definisce stili che si vogliono applicare alla pagina, all'interno dell'header
- **Import**: importando gli stili da un file esterno utilizzando i tag ```{css} <style>``` o ```{css} <link>``` 

>[!example] Inline
> ```html {6}
> <html>
>   <head>
>        <title>Monsters and Co.</title>
>   </head>
> <body>  
> <header style="color:blue;">
>        <h1>Monsters and Co.</h1>
>      </header>
> <section>
> <p>Monsters and Co. (Monsters, Inc.) &egrave; un film d'animazione della Pixar, del 2001 diretto da Pete Docter, Lee Unkrich e David Silverman.</p>
>        </section>
>   </body>
> </html>
>```


>[!example] Posizionato nel tag style
> ```html {4-6}" 
> <html> 
> <head>
>   <title>Monsters and Co.</title>
>    <style type="text/css">
>       header {color: blue;}
> 	</style>
> </head> 
> 	<body>
> 	    <header>
> 	       <h1>Monsters and Co.</h1>
> 	     </header>
> 	    <section>
> 			<p>Monsters and Co. (Monsters, Inc.) &egrave; un film d'animazione della Pixar, del 2001 diretto da Pete Docter, Lee Unkrich e David Silverman</p>
>        </section>
>   </body>
> </html>
> ```

>[!Example] Import da file esterno
> ```html {4-6}
> <html>
> 	<head>
> 	<title>Monsters and Co.</title>
> 	<style type="text/css"> 
> 		@import url(style.css);
> 	</style>
>   </head>
> 	<body>
> 
> 		<header>  
> 			<h1>Monsters and Co.</h1>
> 	     </header>
> 		<section>
> 			<p>Monsters and Co. (Monsters, Inc.) &egrave; un film d'animazione della Pixar, del 2001 diretto da Pete Docter, Lee Unkrich e David Silverman.</p>
> 		</section> 
> 	</body>
> </html>
> ```

>[!Example] Import da file esterno con link
> ```html icon {5} 
> <html> 
> 	<head>
> 	    <title>Monsters and Co.</title>
> 
> 	    <link type ="text/css" rel  ="stylesheet" href="style.css"/>
> 	</head>
> 	<body>
> 	    <header>
> 			<h1>Monsters and Co.</h1>
> 		</header>
> 	    <section>
> 			<p>Monsters and Co. (Monsters, Inc.) &egrave; un film d'animazione della Pixar, del 2001 diretto da Pete Docter, Lee Unkrich e David Silverman.</p>
> 		</section>
> 	</body>
> </html>
> ```

## Sintassi
Una regola _css_ ha la seguente forma $$\large \text{Selettore} \ \{\ Proprietà:\ Valore;\}$$
### Selettore
Consente di specificare un elemento o un'insieme di elementi dell'albero HTML (header, section, footer,...) al fine di associarvi caratteristiche.
Ci sono diversi tipi di selettori:
- **Selettore Universale (\*)**: fa match con qualsiasi elemento
- **Selettore di tipo**: fa match con gli elementi del tipo selezionato, ad esempio ```{css} body{ font-family: Arial; font-size: 12 pt;}```
- **Selettore di prossimità**: fanno match con elementi che siano discendenti, figli diretti, immediatamente seguenti o fratelli successori di elementi del tipo specificato.
	- _Discendenti_: `spazio`
	- _Figlio_: ```{css} >``` 
	- _Fratello_: `+`
	- _Tutti i fratelli_: `~`
- **Selettori di attributi**:  fanno match con gli elementi che possiedono l'attributo specificato o che ha un valore particolare
	- ```{css} a[target="value"]``` è usato per selezionare elementi con un attributo con specifico valore
	- ```{css} a[target]``` è usato per selezionare elementi con un specifico attributo
	- ```{css} [attribute]~="value"]``` è usato per selezionare gli elementi con un attributo contenente una parola specifica
- **Selettori di classe**: 
	- ```{css} .class``` si usa solo per le classi, ed è equivalente a ```{css} element[class="class"]```.
	- ```{css} element#class``` identifica gli  elementi il cui attributo di tipo _id_ vale "class".
- **Selettori di pseudo-classi**: ^b73b36
	- ```{css}:link```,```{css}:visited``` = vero se l'elemento è un link non ancora visitato o un link già visitato 
	- ```{css}:hover```,```{css}:active```,```{css}:focus``` = vero se sull'elemento passa sopra il mouse, il mouse è premuto o il controllo è selezionato per accettare input
	- ```{css}:enabled```,```{css}:checked``` = vero se elemento è abilitato o "checked" 
- **Raggruppamento di selettori**: `,` viene utilizzata per raggruppare selettori diversi nello stesso blocco
- **Selettori di pseudo-classi strutturali**:
	- ```{css} first-child``` elemento che è il primo figlio di suo padre
	- ```{css} nth-child(n)``` elemento che è l'n-esimo figlio di suo padre
	- ```{css} nth-last-child(n)``` elemento che è l'n-esimo figlio di suo padre a partire dall'ultimo
	- ```{css} first-of-type``` il primo figlio dell'elemento con un determinato tipo
	- ```{css} nth-of-type(n)```elemento che è l'n-esimo figlio di un determinato tipo 
	- ```{css} only-of-type``` è l'unico figlio di quel tipo 
	- ```{css} empty``` elemento che è vuoto 
- **Selettori di pseudo-elementi**: ^6e289d
	- ```{css} :before```, ```{css} :after``` = vero prima e dopo il contenuto dell'elemento
	- ```{css} :first-line``` = vero per la prima riga dell'elemento
	- ```{css} :first-letter```= vero per la prima lettera di un elemento
- **Selettori di pseudo-elementi:**
	- ```{css} :before```, ```{css} :after``` = vero prima e dopo il contenuto dell'elemento
	- ```{css} :first-line``` = vero per la prima riga dell'elemento
	- ```{css} :first-letter``` = vero per la prima lettera di un elemento
### Valori
I valori utilizzabili nei fogli di stile sono **numeri interi e reali** che possono essere utilizzati per indicare delle **grandezze** affiancandoli alle **unità di misura**:
- _Assolute_: ^c15198
	- **in**: pollici (1in = 2.54 cm)
	- **cm**: centimetri
	- **mm**: millimetri
	- **pt**: punti tipografici ($\frac{1}{72}$ di pollice)
	- **pc**: pica (12pt)
- _Relative_: ^175c03
	- **em**: relativa alla dimensione del font in uso (es: se il font ha corpo 12pt, 1em=12pt, 2em=24pt, ecc.)
	- **px**: relativi al dispositivo di output e alle impostazioni dell'utente

>[!tip] Altri valori che sono utilizzati nei fogli di stile
> - **Percentuali**
> - **URL assoluti o relativi**: ```{css} url(path)```
> - **Stringhe**
> - **Colori**: possono essere specificati in diversi modi:
> 	- Esadecimale: ```{css} #RRGGBB```
> 	- Keyword: `black, silver, white, red, ...`

^29a118

## Conflitti di stile
Applicando degli stili agli elementi possono nascere dei conflitti, ovvero ad uno stesso elemento sono applicate delle regole i cui valori sono in conflitto. 
>[!faq] Come risolvere?
>Per evitare conflitti bisogna sapere quali sono le regole con cui applica gli stili.
>Le dichiarazioni vengono ordinate in base ai seguenti fattori (in ordine decrescente di importanza):
>- **Media**
>- **Importanza di una dichiarazione**
>- **Origine della dichiarazione**
>- **Specificità del selettore**
>- **Ordine delle dichiarazioni**

### Importanza della dichiarazione
È possibile aggiungere ad una dichiarazione la keyword ```{css} !important```, la quale permette di dare la precedenza ad una regola rispetto alle altre, indipendentemente da origine, specificità e ordine delle dichiarazioni.
Questa può essere utilizzata dagli utenti per imporre alcune regole per loro importanti.
>[!Example] Esempio
>```css
>p { font-size: 18pt !important}
>```
### Origine della dichiarazione
Un foglio di stile può avere tre origini differenti (in ordine decrescente di importanza):
- **Author**: L'autore delle pagine fornisce i fogli di stile del documento specifico
- **User**: L'utente può fornire un ulteriore foglio di stile per indicare le regole di proprio piacimento. Tipicamente è una funzione del browser.
- **User Agent**: Il browser definisce le regole di default per gli elementi dei documenti
### Specificità del selettore
La specificità di un selettore è data ad una quadrupla **xywz** dove:
- **x**: $1$ se la dichiarazione è nell'attributo style, $0$ altrimenti
- **y**: numero di _id_ specificati nel selettore
- **w**: numero di classi, attributi e [[#^b73b36|pseudo-classi]] specificati nel selettore
- **z**: numero di elementi e di [[#^6e289d|pseudo-elementi]] specificati nel selettore

>[!info] Parità
>A parità di Media, Importanza e Origine, avrà precedenza la regola con specificità più alta.

>[!example] Esempi
>- `{css} li` $x=0,\ y=0,\ w=0,\ z=1$
>- `{css} nav .menu ul.sec li`  $x=0,\ y=0,\ w=2,\ z=3$
>- `{css} nav ul li:first-line`  $x=0,\ y=0,\ w=0,\ z=4$
>- `{css} nav ul li a[href='/home']`  $x=0,\ y=0,\ w=1,\ z=4$
>- `{css} nav#menu ul.sec li#st a`  $x=1,\ y=2,\ w=1,\ z=4$
>- `{css} style="li a"`  $x=1,\ y=0,\ w=0,\ z=2$

## Box Model
Ogni elemento è definito da una scatola all'interno della quale si trova il contenuto. La visualizzazione di un documento con css avviene identificando lo spazio di visualizzazione di ciascun box presente nella pagina
>[!example] Immagine del box model
>![[Box model.png]]

### Contenuto
È possibile definire le dimensioni del contenuto con le proprietà _width_ e _height_.
È possibile definire anche dei limiti minimi e massimi:
- **Massimo**
	- _max-width_
	- _max-height_
- **Minimo**
	- _min-width_
	- _min-height_

>[!warning] N.B.
>Solitamente si specifica **solo** la larghezza e non l'altezza perché facendo così l'altezza viene determinata dal suo contenuto

#### Dimensioni del contenuto
In caso il contenuto di un elemento necessiti di spazio superiore a quello definito bisogna gestire la situazione di **overflow**, che può essere:
- _visible_: il contenuto eccedente viene mostrato
- _hidden_: il contenuto eccedente viene nascosto
- _scroll_: vengono mostrate le barre di scorrimento per visualizzare il contenuto eccedente
- _auto_: il contenuto eccedente viene mostrato in base alle impostazioni del browser
### Margin
È la parte del box model che permette di impostare lo spazio tra un elemento e gli altri elementi della pagina.
Quattro proprietà singole che possono avere valori in percentuali o numerici con unità di misura:
- `{css} margin-top`
- `{css}margin-right`
- `{css} margin-bottom`
- `{css} margin-left`

>[!note] Calcolo distanza
>Nel caso in cui due elementi siano allineati _orizzontalmente_, la distanza tra i due è data dalla somma dei due margini che "si guardano".
>In caso di allineamento _verticale_ la distanza tra due elementi è data dal valore massimo fra il margine inferiore del primo elemento e quello superiore del secondo, questo fenomeno è chiamato **margin collapsing**.

^851105

### Padding
Permette di impostare lo spazio fra il contenuto e il bordo. Al contrario dei margini, il **padding** ha lo stesso colore di sfondo dell'elemento.
Proprietà singole i cui valori possono essere unità di misura e percentuali:
- `{css} padding-top`
- `{css} padding-right`
- `{css} padding-bottom`
- `{css} padding-left`
### Border
Permette di impostare lo spessore, lo stile e il colore di ognuno dei quattro bordi con le seguenti proprietà:
- `{css} border-position-width`
- `{css} border-position-style`
- `{css} border-position-color`
>[!info] `{css} position` può essere `{css} top`,`{css} right`,`{css} bottom`,`{css} left`.

**Spessore**:
- valore numerico con unità di misura
- keyword (`{css} thin`,`{css} medium`,`{css} thick`,)

**Stile**:
- `{css} none` o`{css} hidden`: nessun bordo
- `{css} solid`: intero
- `{css} dotted`: a puntini
- `{css} dashed`: a trattini
- `{css} double`: doppio
- `{css} groove`,`{css} ridge`,`{css} inset`,`{css} outest`: effetti tridimensionali

**[[#^29a118|Colore]]**

### Dimensioni del Box
La larghezza complessiva dei box è data dalla seguente formula:
```css
margin-left+border-left-width+padding-left+width+padding-right+border-right-width+margin-right
```
Se width non è impostata, viene determinata in automatico dal browser, mentre per l'altezza complessiva della box vale un discorso analogo ma bisogna considerare anche il [[#^851105|margin collapsing]].
## Posizionamento
### Comportamento 1
Posizionamento relativo a `{html} <h1>`,`{html} <h2>`,`{html} <p>`,`{html} <div>`:
- **Larghezza**: viene definita tramite il valore della proprietà `{css} width`se non specificata gli elementi occupando il 100% della larghezza del padre.
- **Altezza**: L'altezza dipende dal contenuto dell'elemento ed è possibile specificarla dando un valore alla proprietà `{css} height`

#### Disposizione
A prescindere dalla larghezza, gli elementi sono disposti _verticalmente_, formando una nuova riga, tali elementi vengono chiamati **elementi di blocco (block)**. ^a0f97a

### Comportamento 2
Posizionamento relativo a `{html} <a>`,`{html} <strong>`,`{html} <em>`,`{html} <span>`:
- **Larghezza**: dipende dal contenuto dell'elemento e non è possibile specificare un valore della proprietà`{css} width`
- **Altezza**: dipende dal contenuto dell'elemento, non è possibile specificare un valore della proprietà `{css} height` ma è possibile specificare l'altezza della linea con `{css} line-height`
#### Disposizione
Gli elementi adiacenti sono disposti _orizzontalmente_ e vengono chiamati **elementi di linea (inline)**. ^2df7c5

### Display
>[!Fail] Problema
>Un problema molto dibattuto è il _perfect centering_ perché spesso si fatica ad ottenterlo.

La proprietà **display** determina il tipo di elemento (e il relativo comportamento). Oltre a _inline_ e _block_, questa proprietà può assumere i seguenti valori:
- _none_: l'elemento non viene visualizzato
- _inline-block_: l'elemento può assumere dimensioni esplicite, ma si disporrà orizzontalmente (come gli elementi inline) e non verticalmente ^50018a
- _list-item_: per fare in modo che un elemento si comporti come un `{html} <li>` 
- _grid_: trasforma un elemento in un grid container
- _flex_: trasforma un elemento in un flex container

>[!info] Altro
>Esistono anche valori per trasformare elementi in parti di una tabella come `{css} table`, `{css} inline-table`, `{css} table-cell`, ecc. ([slide 47](https://virtuale.unibo.it/pluginfile.php/2809957/mod_resource/content/1/7_css_intro.pdf)).
>Ci sono altri valori raramente usati come: `{css} contents`, `{css} run-in`,`{css} marker`,`{css} compact`
#### Layout multicolonna liquido
Un **layout liquido** è un layout la cui grandezza della pagina dipende dalla finestra del browser, adattandosi a tutte le risoluzioni.
Può essere realizzato usando la proprietà display rendendo i contenitori delle **tre** colonne di tipo [[#^50018a|inline-block]] e definendo la larghezza delle colonne in percentuale.
>[!Example] Esempio
>Si vuole realizzare un layout a 3 colonne dove:
>- La colonna di sinistra contenere il menù e deve occupare il 15% della pagina 
>- La colonna a destra è una semplice sidebar e deve occupare il 20% della pagina
>- La colonna centrale contiene un articolo e deve occupare il 65% della pagina

##### Come crearlo?
Le colonne devono essere elementi ibridi [[#^50018a|inline-block]].
Gli elementi [[#^2df7c5|inline]] sono solitamente allineati verso il basso e spesso le colonne sono di altezze diverse, quindi bisogna utilizzare la proprietà `{css} vertical-align` con il valore `{css} top` per specificare la l'allineamento a partire dall'alto.
Le tre colonne devono occupare, tra `{css} width`,`{css} margin` e `{css} padding`,  al massimo il 100% dello spazio, se no l'ultima andrà a capo.
>[!warning] N.B.
>Non ci devono essere spazi nel codice Html tra una sezione e l'altra, altrimenti l'ultima colonna andrà a capo.

Dato che i bordi non possono essere specificati in percentuale, è necessario usare la proprietà `{css} box-sizing` con valore `{css} border-box` per fare in modo che la grandezza del bordo (**non del padding**) sia inclusa nella larghezza. ^cd8383
### Float
Sappiamo che gli elementi [[#^a0f97a|block]] vengono disposti verticalmente, uno sotto l'altro. Tramite **float** possiamo estrarre un elemento dal normale flusso del documento e lo sposta su un lato, a destra o a sinistra (rispetto al suo contenitore).
Gli elementi appartenenti al normale flusso del documento circonderanno gli elementi _floating_ ([Esempio](https://www.w3schools.com/css/tryit.asp?filename=trycss_layout_float))
#### Layout multicolonna liquido
Un altro modo per realizzare un [[#Layout multicolonna liquido|layout multicolonna liquido]] consiste nell'utilizzare la proprietà `{css} float` e definendo la larghezza delle colonne in percentuale.
##### Come crearlo?
Solo le colonne laterali devono essere [[#Float|float]], la colonna centrale deve avere dei margini laterali almeno delle dimensioni delle colonne laterali (maggiore se si vuole avere della distanza dalle colonne).
Le tre colonne devono occupare in totale al massimo 100%, altrimenti ci saranno delle sovrapposizioni.
Abbiamo visto come gli `{html} <h2>` presenti in `{html} <nav>` e `{html} <aside>` non sono soggetti al [[#^851105|margin collapsing]], in quanto con `{css} float` sono fuori dal normale flusso della pagina, al contrario _article_
### Clear
La proprietà **clear** serve a disattivare l'effetto della proprietà [[#Float|float]] sugli elementi che lo seguono, ovvero a impedire che al fianco di un elemento floating compaiano altri elementi.
Quindi la usiamo quando vogliamo isolare un elemento per applicargli _float_.
Valori:
- **none**: float consentito su entrambi i lati
- **left**: impedisce il posizionamento a sinistra
- **right**: impedisce il posizionamento a destra
- **both**: impedisce il posizionamento su entrambi i lati
### Position
La proprietà **position** permette di specificare il posizionamento di un elemento rispetto al flusso del documento.
Valori:
- `{css} static` valore di default, l'elemento è disposto secondo il normale flusso del documento ^3c2cff
- `{css} fixed` usando questo valore il box dell'elemento viene sottratto al normale flusso del documento. Il box non scorre con il resto del documento, ma rimane fisso.
- `{css} relative` l'elemento ==non== viene rimosso dal flusso del documento: a partire dalla posizione che avrebbe occupato è possibile specificare lo spostamento con le proprietà _top_, _right_, _bottom_, _left_ ^f9e5ab
- `{css} absolute` l'elemento viene rimosso dal flusso del documento: il posizionamento avviene rispetto al primo elemento antenato che ha un posizionamento diverso da [[#^3c2cff|static]] (se non esiste viene usata la radice `{html} <html>`). Il posizionamento è specificato sempre attraverso le proprietà valide anche per [[#^f9e5ab|relative]]  ^1f11b0

>[!fail] Attenzione
>[[#^f9e5ab|relative]] e [[#^1f11b0|absolute]] VANNO EVITATI

In caso di elementi sovrapposti è possibile gestire quale elemento deve essere visualizzato "sopra" con la proprietà `{css} z-index`. Verrà visualizzato l'elemento con _z-index_ maggiore andando in sovrapposizione agli elementi con valore inferiore.
>[!note] N.B.
>_z-index_ funziona SOLO con elementi che non abbiano [[#^3c2cff|position=static]]

## Ereditarietà
Per poter essere visualizzato, ogni elemento deve avere uno stile "di base". Un elemento privo di stile non può essere rappresentato.
Lo stile può essere applicato:
- _Direttamente_ con l'attributo `{css} style=""` o con regole
- _Indirettamente_: l'elemento eredita lo stile dal padre

>[!warning] N.B.
>Non tutte le proprietà sono soggette ad ereditarietà:
>- _display_: questa dipende intrinsecamente dall'elemento stesso
>- _background_: è sempre trasparente
>- Proprietà relative al box mode...
>- ...
>
>È impossibile forzare l'ereditarietà usando come valore `{css} inherit`

## Colore 
I valori utilizzabili per i colori sono:
- **Keyword** (`{css} red`,`{css} green`, ...) 
- **Esadecimale** (`{css} #RRGGBB`)
- **Decimale**: `{css} rgb(val, val, val)` dove `{css} val` è un valore tra $0$ e $255$
- **Decimale con trasparenza** `{css} rgba(val, val, val, opa)` dove `{css} opa` è un valore tra $0$ e $1$
	- $0$ indica la trasparenza totale
	- $1$ l'assenza totale di trasparenza
- **Opacity** è una proprietà che può essere usata in combinazione con un colore definito in _rgb_ e che gestisce la trasparenza sia dello sfondo che del testo di un elemento
- **HSL**: acronimo di _Hue_, _Saturation_, _Lightness_, rappresenta uno spazio colorimetrico diverso. Viene specificato come `{css} hsl(h, s, l)`
	- _h_: è un grado di angolazione del cerchio cromatico (da 0 a 360)
	- _s_: indica la saturazione del colore (in percentuale)
	- _l_: indica la luminosità (in percentuale)
- **HSLA**: estensione di HSL che include il canale alpha
## Sfondo
Per modificare lo sfondo degli elementi esistono le seguenti proprietà:
- _background-size_: permette di specificare la dimensione dell'immagine di sfondo
- _background-origin_: permette di posizionare l'immagine di sfondo nel [[#Contenuto|context-box]], nel [[#Padding|padding-box]] oppure nel [[#Border|border-box]]
- _Sfondi con immagini multiple_: è possibile dichiarare più immagini come sfondo. Il risultato è la sovrapposizione di tutte le immagini.
### Gradienti
#### Lineari
- _linear-gradient_: permette di specificare un gradiente lineare come sfondo. `{css} linear-gradient(direction, color-stop1, color-stop2, ...)` dove
	- `{css} direction` è opzionale, di default è dall'alto al basso, altrimenti accetta valori angoli (es: `90deg`) o keyword (es: `{css} to bottom right` )
	- È possibile specificare un numero di colori a piacere
 - _repeating-linear-gradient_: è possibile impostare la ripetizione del gradiente lungo l'elemento per il quale si imposta lo sfondo. `{css} repeating-linear-gradient(direction, colr-stop1, color-stop2, dimension, ...)` ^4334ec
#### Radiali
 - _radial-gradient_: permette di specificare un gradiente radiale come sfondo. `{css} radial-gradient(shape size at position, start-color, ..., last-color)`
	 - `{css} shape`: _ellipse_ (default) o _circle_ 
	 - `{css} size at position`: _closest-side_, _farthest-side_
- _repeating-radial-gradient_: è come [[#^4334ec|repeating-linear-gradient]] ma il gradiente è radiale
## Bordi
- _border-image_: permette di specificare una immagine che viene usata come bordo. 
  `{css title:esempio} div {border-image: url(border.png) 30 30 round;)`
- _border-radius_: permette di specificare bordi arrotondati.
- _box-shadow_: permette di specificare l'ombra del box
- _resize_: permette all'utente di ridimensionare i box
- _box-sizing_: permette di far rientrare le dimensioni di padding e bordi nel computo di _width_ e _height_ ([[#Border|border-box]]). Di default ha valore _content-box_
## Gestione del testo
Esistono diverse proprietà per la gestione del testo che si occupano di:
- **Aspetto dei caratteri**
- **Formattazione del testo**
### Aspetto dei caratteri
Abbiamo già visto che cos'è un [[Web Design#Font|font]], possiamo specificare le seguenti proprietà:
- _[[Web Design#Famiglia di font|font-family]]_: specifica il nome di uno o più font o un font generico
- _font-style_: specifica lo stile (`{css} normal`, `{css} oblique`, `{css} italic`)
- _font-variant_: applica l'effetto maiuscoletto (small-caps), di default `{css} normal`
- _font-weight_: specifica il peso:
	- Valori numerici da 100 a 900
	- Parole chiave: assolute (`{css} normal` e `{css} bold`) e relative (`{css} bolder` e `{css} lighter`)
- _font-size_: specifica la dimensione dei caratteri, espressa come:
	- Dimensione assoluta: pixel, punti o keyword
	- Dimensione relativa: em, ex, percentuale o keyword.
### Formattazione del testo
- _color_:  [[#Colore|colore]] del testo.
- _letter-spacing_: `{css} normal` o valore in pixel
- _line-height_: interlinea espresso in lunghezza o percentuale
- _text-align_: `{css} left`,`{css} right`,`{css} center` o `{css} justify`
- _text-decoration_: `{css} none`,`{css} underline`, `{css} overline` o `{css} line-through`
- _text-direction_: da destra a sinistra o viceversa
- _text-indent_: indentazione della prima riga di testo, espressa come lunghezza o percentuale
- _text-overflow_: permette di specificare il comportamento in caso in cui porzioni di testo fuoriescano dal box che lo contiene.
- _text-shadow_: permette di specificare l'ombreggiatura di un testo come `{css} h-shadow`, `{css} v-shadow`,`{css} blur-radius`,`{css} color`
- _text-transform_: `{css} none`,`{css} capitalize`,`{css} uppercase`,`{css} lowercase`
- _white-space_: specifica come sono gestiti spazi bianchi e andate a capo
	- `{css} normal`: sequenze di spazi bianchi collassati in uno solo, il testo va a capo quando necessario
	- `{css} nowrap`: sequenze di spazi bianchi collassati in uno solo, il testo andrà a capo solo in corrispondenza di un `{html} <br/>`
	- `{css} pre`: sequenze di spazi bianchi saranno mantenute, il testo andrà a capo solo in corrispondenza di un `{html} <br/>` o un _line break_
	- `{css} pre-line`: sequenze di spazi bianchi collassati in uno solo, il testo andrà a capo se necessario o in corrispondenza di un _line break_
	- `{css} pre-wrap`: sequenze di spazi bianchi saranno mantenute, il testo andrà a capo solo in corrispondenza di un `{html} <br/>`
- _word-wrap_: permette di forzare l'andata a capo per le parole molto lunghe che non rispettano i bordi dell'elemento contenitore
- _word-spacing_: normal o valore in pixel
- _vertical-align_: allineamento degli elementi [[#^2df7c5|inline]].
## Liste
- _list-style-position_: specifica la posizione del marker, se dentro al testo (_inside_) o fuori (_outside_)
- _list-style-image_: specifica un'immagine come marker
- _list-style-type_: specifica il tipo di marker. Ne esistono tantissimi sia per `{html} <ul>` che `{html} <ol>`
- _list-style_: proprietà abbreviata
## Filtri per immagini
Con la proprietà `{css} filter` è possibile applicare alle immagini effetti visivi di vario genere.
I valori possibili sono:
- _blur (px)_: consente di applicare una sfocatura
- _brightness (%)_: consente di regolare la luminosità
- _contrast (%)_: consente di regolare il contrasto
- _drop-shadow (hs vs b s c)_: consente di specificare un'ombreggiatura
- _grayscale (%)_: converte l'immagine in bianco e nero
- _hue-rotate (deg)_: applica una rotazione di `deg` gradi della tonalità rispetto al [[Web Design#^ea7d35|cerchio cromatico]]
- _invert (%)_: inverte i colori dell'immagine
- _opacity (%)_: consente di regolare il livello di opacità dell'immagine
- _saturate (%)_: consente di regolare la saturazione dell'immagine
- _sepia (%)_: consente l'immagine in seppia
- _url_: indica l'url di un file XML con un filtro SVG da applicare all'immagine
## @rules (at rules)
Sono regole precedute da una `{css} @` e servono per specificare determinati comportamenti.
Si suddividono in:
- _Regular rules_: `{css} @ [KEYWORD] (RULE)` ad esempio `{css} @charset`o  `{css} @import`
- _Nested rules_: `{css} @ [KEYWORD] { regole css }` 
## Transizioni
Le transizioni sono effetti che permettono di applicare passaggi graduali da uno stile all'altro per un determinato elemento.
Gestibile tramite le seguenti proprietà:
- _transition-property_: proprietà che viene modificata
- _transition-duration_: durata della transizione
- _transition-timing-function_: velocità di esecuzione della transizione
- _transition-delay_: indica quando la transizione inizia

Usando _transition_ è possibile anche specificare più transizioni è possibile anche specificare più transizioni per elementi diversi, basta separarli con `,`

## Animazioni
Con la regola `{css} @keyframe` è possibile definire della animazioni che coinvolge una o più proprietà.
```css title:Sintassi
@keyframes nome{
	selettoreKeyFrame{ ... }
}
```
dove:
- `{css} nome`: sarà il nome della nostra animazione
- `{css} selettoreKeyFrame` è la percentuale dell'animazione. Consistono in valori da 0% a 100% o nelle keyword `{css} from(0%)` e `{css} to(100%)`

Una volta definita una animazione è necessario definire a quale elemento applicarla usando la proprietà _animation_. `{css title:Sintassi} animation: nome durata`.
Le proprietà per le animazioni sono:
- _animation-name_: nome dell'animazione
- _animation-duration_: durata dell'animazione
- _animation-timing-function_: velocità di esecuzione dell'animazione
- _animation-delay_: indica quando l'animazione inizia
- _animation-iteration-count_: indica quante volte deve essere ripetuta l'animazione
- _animation-direction_: indica se l'animazione deve essere eseguita al contrario o no
- _animation-play-state_: indica se e quando l'animazione deve essere eseguita oppure deve essere messa in pausa
- _animation-fill-mode_: indica lo stato finale dell'elemento animato, una volta terminata l'animazione

## Media Query
In un sito web un [[#Layout multicolonna liquido|layout fludio]] non basta perché, nonostante gli elementi si adattino al restringimento della pagina, ci sarà comunque un punto dopo il quale è necessario riorganizzare l'ordine degli elementi, ciò viene fatto con le **media query**.

Le **media query** permettono di applicare (o meno) delle regole css in base al tipo e alle caratteristiche del dispositivo su cui si visualizza la pagina Web specificandole in due modi:
- Direttamente nell'attributo _media_ nel tag link che importa il foglio di stile
  `{html icon} <link rel="stylesheet" media="media-query" href="style.css/">` 
- Con il costrutto `{css} @media` direttamente nel codice css

```css title:Sintassi
@media not|only mediatype and (mediafeature and|or|not mediafeature) { codice css}
```

In pratica viene associata un'espressione ad un insieme di regole css. Se quest'espressione risulta vera, le regolo vengono applicate, altrimenti no.
### Media Type
- **All**: indica tutti i media type per tutti i tipi di dispositivi. È il valore di default.
- **Print**: serve per specificare le stampanti
- **Screen**: serve per specificare uno schermo generico (desktop, tablet, smartphone, ...)
- **Speech**: serve per specificare [[Web Design#Screen reader|screen reader]], dispositivi che utilizzano la sintesi vocale per "leggere" il contenuto della pagina
### Media features
Servono per applicare gli stili in base alle capacità come la grandezza dello schermo, orientamento e risoluzione.
Le più utilizzate sono:
- _width_: indica la larghezza della finestra del browser. Accetta i prefissi _min-_ e _max-_
- _orientation_: indica l'orientamento del dispositivo (_landscape_ o _portrait_)

>[!warning] device-width
>Attenzione ad utilizzare `{css} device-width` al posto di width! Indica la larghezza del dispositivo. Se si ridimensiona la finestra del browser, la larghezza del dispositivo rimane invariata, per questo motivo è preferibile utilizzare `{css} width`

### Breakpoint
I **breakpoint** ci permettono di identificare i punti dopo i quali cambiare la disposizione degli elementi.

I range sono:
- _smartphone_: $< 768$
- _tablet_: $\geq 768$ e $<1024$ 
- _desktop_: $\geq 1024$

>[!Example] Esempi Media Query
>- `{css} @media print { }` le regole sono applicate se il dispositivo è la stampante
>- `{css} @media screen and (min-width: 480px) { }` le regole vengono applicate se il dispositivo di riferimento è uno schermo e la sua dimensione è almeno 480px
>- `{css} @media screen and (max-width: 699px) and (min-width: 520px) { }` le regole vengono applicate se il dispositivo di riferimento è uno schermo con dimensione maggiore a 519px ma minore di 700px
>- `{css} @media only screen and (orientation: landscape) { }` le regole valgono solo se lo schermo del dispositivo è in orizzontale

### Viewport Virtuale
In alcuni casi, i dispositivi con schermo piccolo renderizzano la pagina in una finestra (**viewport**) virtuale più grande dello schermo e poi restringono il risultato della renderizzazione in modo che tutto il contenuto sia visibile.

#### Meta tag viewport
Il **meta tag viewport** viene introdotto per ovviare al problema creato dalla viewport.
```html title:Esempio
<meta name="viewport" content="width=device-width,initial-scale=1.0"
```
Dove:
- _width=device-width_: imposta la larghezza del viewport in modo tale che segua la larghezza del display del device
- _initial-scale=1.0_: imposta il livello di zoom iniziale quando la pagina viene caricata per la prima volta dal browser
>[!example] Organizzazione dei layout
>![[Organizzazione dei layout.png]]

## Responsive Design - Scrolling
L’utente è abituato a fare lo scrolling verticale, sia su PC sia su device mobile, quindi lo scrolling orizzontale invece è **sempre sconsigliato** in termini di user experience!

Regole per evitare lo scrolling orizzontale:
1. Non usare elementi con larghezza prefissata, soprattutto se di grandi dimensioni
2. Non basarsi solo sulla larghezza di un unico [[#Viewport Virtuale|viewport]]. Con viewport di altre dimensioni si potrebbe avere un effetto totalmente differente, soprattutto nel caso di elementi con larghezze espresse in pixel o unità di misura assolute.
3. Usare la media query per offrire layout adeguati e adatti a display di diverse dimensioni
4. Accertarsi che la somma di spazio occupata da elementi [[#^2df7c5|inline]] o [[#^50018a|inline block]] non sia mai superiore al 100%, facendo attenzione anche agli spazi bianchi e alle andate a capo nel codice Html
