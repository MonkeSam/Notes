Il **web design** è il processo di pianificazione per creare un sito web.
La figura che progetta le pagine web è il **web designer** curando tutta la parte di _UI_, _UX_, ecc.
## Testo
Il testo è il tipo di informazione più facile da rappresentare, la parte più importante è la gestione dei diversi stili _tipografici_, delle dimensioni e dei colori.
### Glifo
È un'entità tipografica che realizza la rappresentazione visiva della forma del carattere. Un carattere può essere rappresentato da molti glifi differenti.
Un insieme di glifi che rappresentano i caratteri di un alfabeto è detto **font**.
### Font

^3a8596

>[!success] Definizione
>È un insieme di glifi caratterizzati da un certo stile grafico o progettati per svolgere una data funzione
#### Caratteristiche
I font sono classificabili secondo diverse caratteristiche:
- _Lunghezza_:
	- **proporzionale**: i glifi hanno lunghezza variabile (es. Arial)
	- **monospace**: i glifi hanno lunghezza fissa (es. Courier New)
- Presenza di _grazie_:
	- **sans serif**: glifi senza grazie
	- **serif**: glifi con grazie
>[!info] Grazie
>Le **grazie** sono allungamenti ortogonali delle estremità di un glifo
#### Famiglia di font
- **Font family** è un insieme di stili diversi di uno stesso carattere
- **Generic family** è un insieme di font family accomunati da caratteristiche simili.
### Interlinea
L'**interlinea** è molto importante per rendere il testo leggibile.
>[!example] Esempi di Interlinea
>![[Interlinea.png]]

>[!tip] Curiosità
>Esistono alcuni add-on per riconoscere i font usati nelle pagine web, per Chrome esiste _WhatFont_

## Colore
I colori possono essere indicati attraverso il loro nome oppure attraverso il loro codice **RGB** in forma esadecimale.
>[!info] RGB Hex
>![[RGB Hex.png]]
>I colori RGB si possono esprimere in esadecimale: ogni coppia di valori rappresenta un colore primario della terna Red-Green-Blue.
>Vengono usate 3 coppie di valori perché il codice RGB assegna ad ogni colore (Rosso,Verde,Blu) una combinazione di 256 numeri (tra 0 e 255).

### Schemi
Esistono buone pratiche anche per la scelta dei colori, in modo da supportare scelte di **schemi di colore** armonici e accessibili.
>[!Note] Color Wheel
>La _color wheel_ (o cerchio cromatico) schematizza i colori per rendere più facile scegliere correttamente i colori da utilizzare.
>![An Easy Intro to Colour Theory](https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/blogs/2147738206/images/36f37de-e28-4862-1e88-5638e1c8816_Colour_Wheel_of_Tinted_Colors.png)

^ea7d35

I tipi di schemi sono:
- **Monocromatici**: fissata la tonalità varia solo saturazione e luminosità
- **Analoghi**: prese due tonalità analoghe (vicine) e si scelgono i colori compresi tra i due
- **Complementare**: colori opposti sulla wheel
- **Complementare triadico**: tre colori equidistanti fra di loro sulla color wheel (120°)
- **Complementare tetradico**: quattro colori, sugli angoli di un rettangolo nella color 

## Mobile first
In questo momento storico il metodo di design che prevale è il **mobile first**.
È un metodo che approccia inizialmente lo sviluppo web per i dispositivi mobili in quanto più complesso.
Questo principio è chiamato _progressive enhancement_, si parte dalla condizione più vincolante e si creano design progressivamente più ricchi solo per i dispositivi in grado si supportarli. Contrario al _graceful degradation_ che cerca implementa un certo grado di _fault tollerance_ per cercare di permettere a tutti i tipi di utenti la stessa esperienza.

## User Experience e Usabilità
### Usabilità
L'**usabilità** nasce negli anni sessanta e viene definita dalla norma ISO 9241 come "Il grado in cui un prodotto può essere usato da particolari utenti per raggiungere certi obiettivi con efficacia, efficienza e soddisfazione in uno specifico contesto d'uso"
#### Ergonomia cognitiva
Si occupa del modo in cui l'utente si costruisce un modello mentale del prodotto che sta utilizzando, creandosi quindi determinate _aspettative sul suo funzionamento_.
Per avere un'alta usabilità il **modello mentale** di chi ha progettato (_design model_) e dell'utente (_user model_) devono cercare di sovrapporsi.
### UX - User Experience
La **UX** nasce con l'avanzare dello sviluppo dell'informatica che inizialmente era limitata solo agli esperti del settore. Descrive la relazione dell'utente di fronte all'interazione con lo strumento (interfaccia) in base a tre dimensioni:
- **pragmatica**: funzionalità e usabilità del sistema
- **estetica/edonistica**: piacevolezza estetica, emotiva e ludica del sistema
- **simbolica**: attributi sociali, forza del brand, identificazione

>[!info] Differenza tra Usabilità e UX
>**Metafora della strada**: l'usabilità è come una superstrada, è funzionale e semplice ma potrebbe essere considerata "fredda" a livello emotivo, invece la UX è una strada di montagna, potrebbe essere più complessa ma suscita emozioni che spingono a percorrerla comunque nonostante sia piena di tornanti.
>

Lo scopo della UX è centrare il _target_ di utenza a cui si rivolge il progetto, infatti la progettazione UX è basata sul design user-centred.

#### Fasi di sviluppo
##### Personas e Scenarios
- **Personas**:  sono descrizioni degli utenti rappresentativi, in breve sono i tipi di utenti che si pensa siano il target del progetto
- **Scenarios**: descrivono in modo realistico la sequenza di azioni che una persona compie utilizzando un servizio, tipicamente ogni scenario include ciascuna persona
##### Focus group
Sono discussioni riguardo al prodotto fatte insieme a membri dell'utenza target. Si selezionano dei "clienti" dei quali si cercano di capire le esigenze.
##### Mock-Up
È una riproduzione di un oggetto originale ad uso didattico, dimostrativo, scenografico o di comunicazione visiva.
Viene tipicamente usato per farsi una prima idea più su come sviluppare il progetto e per presentarlo a client/futuri utenti.
##### UX prototyping
Si crea un'intera esperienza fittizia in cui l'utente sperimenta l'applicazione nel suo contesto d'uso.
## Accessibilità
>[!quote] Accessibilità
>È la capacità dei sistemi informatici, nelle forme e nei limiti consentiti dalle conoscenze tecnologiche, di erogare servizi e fornire informazioni fruibili, senza discriminazioni, anche da parte di coloro che a causa di disabilità necessitano di tecnologie assistive o configurazioni particolari.

>[!quote] Tecniche assistive
>Sono gli strumenti e le soluzioni tecniche, hardware e software, che permettono alla persona disabile, superando o riducendo le condizioni di svantaggio, di accedere alle informazioni e ai servizi erogati dai sistemi informatici.

### Utenti
Un sito web accessibile dà la possibilità di fruire di un servizio da parte di utenti:
- **Con disabilità** (motorie, sensoriali, cognitive)
- **Che usano tecnologie differenti** per scelta o per ragioni economiche.
#### Disabilità
Definiamo le disabilità come **activity limitation** come definite dall'OMS, le funzioni che limitano l'utilizzo nel nostro campo sono:
- _Visive_:
	- Daltonismo
	- Ipovisione (tool assistivi di ingrandimento)
	- Cecità (accesso attraverso screen reader e/o voice browser)
- _Uditive_ (audio, uso della lingua scritta)
- _Motorie_ (accesso ai sistemi di input standard come tastiera, mouse, touch)
### Tecnologie assistive
- **Output**: Effettuano una conversione dell'informazione, in modo che possa essere percepita da un differente organo di senso
- **Input**: Prevedono una modalità diversa d'interazione:
	- Mouse speciali o strumenti di riconoscimento dei gesti o eyetracking
	- Tastiere speciali o altri sistemi equivalenti ad una tastiera
#### Screen reader
È un'applicazione software, utilizzata prevalentemente da persone non vedenti, che identifica ed interpreta il testo mostrato sullo schermo di un computer, presentandolo tramite sintesi vocale o attraverso display braille.

#### WCAG
Le _Web content Accessibility Guidelines_ sono state emesse dal gruppo WAI (Web Accessibility Initiative).
Struttura:
- **Principi**:
	- percepibile
	- utilizzabile
	- comprensibile
	- robusto
- **Linee guida**: dai 4 principi discendono 12 linee guida che forniscono indicazioni per rendere il contenuto più accessibile. Le linee guida non sono verificabili, ma definiscono il quadro di riferimento e gli obiettivi generali per comprendere i criteri di successo e applicare le tecniche
- **Criteri di successo**: Per ogni linea guida vengono forniti un certo numero di criteri di successo verificabili. I criteri di successo appartengono a tre livelli di conformità **A** (minimo), **AA**, **AAA** (massimo).
##### Livello di conformità
- **Livello A**: per la conformità al livello A, la pagina Web soddisfa tutti i criteri di successo di livello A, oppure è fornita una versione alternativa.
- **Livello AA**: per la conformità al livello AA, la pagina Web soddisfa tutti i criteri di successo di livello A e quelli di livello AA, oppure è fornita una versione alternativa conforme al livello AA.
- **Livello AAA**: per la conformità al livello AAA la pagina Web soddisfa i criteri di successo di livello A e livello AA, oppure è fornita una versione alternativa conforme al livello AAA.

>[!info] Links
>- [web accessibility checker](https://achecks.org/checker/index.php)
>- [markup validator](https://validator.w3.org/)
>- [color contrast checker](http://webaim.org/resources/contrastchecker/)
# IMPORTANTISSIMISSIMO
![[struttura.png]]