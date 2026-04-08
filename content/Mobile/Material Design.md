>[!quote] Definizione
>Material è un sistema adattabile di linee guida, componenti e strumenti che supportano le migliori pratiche di progettazione dell'interfaccia utentea

_Material Design_ è un sistema organizzato creato da Google per lo sviluppo di applicazioni [[Android|Android]] che traccia delle linee guida per facilitare la collaborazione tra sviluppatori e designer.


## Layout
[[Jetpack Compose|Compose]] ha elementi basati su Material Design con la dipendenza `androidx.compose.material:material`, con la quale vengono forniti elementi come _Drawer_, _FloatingActionButton_, e _TopAppBar_. 

I componenti Material usano _layout slot-based_, un modello introdotto da Compose per
personalizzare i componenti. Gli slot lasciano uno spazio vuoto nell'interfaccia utente che lo
sviluppatore può riempire a suo piacimento. Ad esempio, questi sono gli slot che si possono
personalizzare in una TopAppBar:

![[layout_slot_based.png|600]]

>[!example] Esempio
>**Scaffold** ci permette di avere già un layout base di Material.
>Fornisce slot per i più comuni componenti, come TopAppBar, BottomAppBar, FloatingActionButton e Drawer.
>![[Scaffold.png|450]]
## Composable

>[!important] Material
>La potenza di Materia Design è che disponiamo di componenti già pronti all'uso con una coerenza visiva e che quindi ci rendono il processo di creazione di un'interfaccia molto più veloce.

### FloatingActionButton
Di seguito vediamo un tipo di utilizzo dei `{kotlin}FloatingActionButton` 

![[floatingActionButton.png]]
### Text
Il componente `{kotlin} Text` ci permette di inserire del testo all'interno delle interfacce e possiamo manipolarlo come meglio preferiamo.
>[!example] Esempi
>![[Text1.png]]
![[Text2.png]]
![[Text3.png]]

### TextField
Con questo componente possiamo creare delle aree di testo dove possiamo inserire delle stringhe.
>[!example] Esempi
>![[TextField.png]]

### Immagini
Il composable `{Kotlin} Image` permette l'inserimento di immagini all'interno dell'interfaccia.
Per caricare un'immagine o una risorsa vettoriale dal disco, utilizzare l'API `{kotlin}painterResource` con il riferimento all'immagine.

![[Image.png]]

### Icone
`{Kotlin} Icon` è un modo comodo per disegnare sullo schermo un'icona di un solo colore che segue le linee guida del Material Design.

![[Icon.png]]

>[!note] [Clicca qui](https://fonts.google.com/icons)  per vedere tutte le icone di Material Design.

## Animation
Esistono diversi tipi di animazione standard e non (es. animazione dello scroll) che però non vedremo ma sarà argomento di approfondimento.

![[Animations.png]]
## Gestures
Ovviamente l'interazione con i dispositivi mobili avviene in modo differente per quello che abbiamo visto finora negli altri corsi. Si ha un'interazione tramite **gesture**:
- Tapping and pressing
- Scrolling
- Dragging
- Swiping
- Multitouch