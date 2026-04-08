**Intent** non è un [[Android#Sviluppo#App components|componente Android]] perché, come visto, non è un _entry point_ dell'applicazione.
Potremmo dire che è un ==attivatore==, cioè viene utilizzato per attivare 3 componenti di 4:
- _Activities_
- _Servicies_
- _Broadcast receivers_

>[!note] Quindi ci dà la possibilità di inviare un messaggio asincrono ai componenti, descrivendo un'azione.

>[!faq] E il Content Provider?
>I [[Android#Sviluppo#Content provider|Content Provider]] vengono attivati dai **Content Resolver** che si occupano di gestire le transazioni tra il Provider e gli strati superiori, in modo che non sia lui a gestire le richieste direttamente. Ciò viene fatto per motivi di sicurezza.
>
>![[Content_Resolver.png|500]]

>[!note] Intent
>Quindi un **Intent** permette la comunicazioni tra componenti. Lo fa in 3 modi:
>- Avvio di un [[Activity]]
>- Avvio di un [[Android#Services|Service]]
>- Consegna [[Android#Broadcast receivers|Broadcast]]

## Costruttore
```Kotlin title:"Creazione di un Intent"
Intent(Context, Class)
```

Il `Context` è ciò che indica il _package_ in cui ci troviamo, mentre `Class` si riferisce al componente a cui vogliamo comunicare.
## Componenti
### Activity
[[Activity|Come già visto]], un'Activity rappresenta una schermata di un'applicazione.
#### Avvio
L'avvio di un'Activity avviene tramite il comando `{Kotlin} startActivity()`.

>[!example] Nel Composable
>![[startActivity_composable.png]]

>[!example] Nell'Activity
>In questo caso il _context_ è `this` perché stiamo facendo riferimento all'activity corrente.
>![[startActivity_Activity.png]]

>[!info] Return
>Se si vuole ottenere un risultato dal lancio di un'Activity si può utilizzare `{Kotlin}rememberLauncherForActivityResult` .
>>[!example] Esempio
>>![[returnFromActivity.png]]

----
### Service
Il **Service** è un componente in grado di eseguire operazioni di lunga durata in background ([[Android#Sviluppo#Services|come già visto]]).

Esistono 3 tipi di servizi:
1. **Foreground**: esegue un'operazione che è visibile all'utente e continua a funzionare anche quando l'utente non interagisce con l'app.
	- È necessario che essa sia sempre visibile all'utente tramite una qualche notifica (es. Un player musicale che riproduce un brano, un'app di navigazione che ti dà indicazioni mentre l'app è chiusa.)
2. **Background**: esegue un'operazione che non viene direttamente notata dall'utente (es. Sincronizzazione periodica di un database locale con il server, compressione di un file video appena registrato).
3. **Bound**: offre un'interfaccia client-server che consente ai componenti di interagire con il servizio, inviare richieste, ricevere risultati (es. un servizio che traccia la posizione GPS in tempo reale su mappa o aggiornare la barra di avanzamento, cambiare canzone). ^7ab5de
#### Avvio
L'avvio di un Service avviene tramite `{kotlin}startService()`.
```kotlin title:Esempio
startService(Intent(this, HelloService::class.java))
```

Se il servizio è progettato con un'interfaccia client-server ([[#^7ab5de|Bound Service]]), è possibile creare un’associazione al servizio attraverso un altro componente passando un Intent a `{kotlin}bindService()`.

---
### Broadcast Receivers
Un [[I protocolli Internet#Broadcast|Broadcast]] è un messaggio che qualsiasi app può ricevere.
Viene utilizzato in casi come:
- Avvio del sistema
- Messa in carica del dispositivo
- Viene inserita la _modalità aereo_.
#### Invio
Si può inviare un broadcast ad altre app ==passando un Intent== a `{kotlin}sendBroadcast()` o `{kotlin}sendOrderedBroadcast()`.

![[broadcastReceivers.png]]

## Tipi di Intent
Ci sono Intent _impliciti_ ed _espliciti_.
### Espliciti
Gli **Intent Espliciti** specificano quale componente di quale applicazione soddisferà l'intent, specificando un `{Kotlin}ComponentName` completo.

Di solito sono usati per ==avviare un componente di cui si è a conoscenza==, cioè che tipicamente è interno alla nostra applicazione.
>[!example] Esempio
>![[Explicit_Intent.png]]

### Impliciti
Gli **Intent Impliciti** non nominano un componente specifico, ma si ==dichiara un'azione generale da eseguire== che gestirà un componente di un'altra app.
>[!example] Esempio
>Se si desidera mostrare all'utente una posizione su una mappa, è possibile utilizzare un Intent implicito per richiedere che un'altra app mostri la posizione specifica su una mappa.

>[!faq] Quale app viene scelta per eseguire l'azione?
>Dipende quali app sono installate sul dispositivo.

#### Funzionamento



![[Implicit_Intent_lifeCycle.png]]
1. Un'Activity **A** crea l'intent e lo passa a `{kotlin} startActivity()`
2. Il sistema operativo andrà alla ricerca dell'applicazione in grado di eseguire l'azione richiesta, cercando un _Intent Filter_ che corrisponda a quello ricevuto.
3. Una volta trovata la corrispondenza il sistema avvia l'Activity **B** in grado di eseguire l'azione, invocando il metodo `{kotlin} onCreate()` passando l'Intent ricevuto.

 >[!example] Esempio
 >Questa è una tipica schermata che incontra l'utente all'esecuzione di un Intent Implicito.
 >
 >![[Implicit_intent_screenshot.png|250]]
 
 >[!warning] Attenzione
 >Per garantire ==sicurezza== è sempre opportuno utilizzare [[#Espliciti|Intent Espliciti]] per l'avvio di [[#Service]] e non bisogna dichiarare gli _Intent Filter_ per i propri servizi in modo che rimangano protetti.
 
## Building un Intent
Un **Intent** contiene le informazioni che Android usa per determinare =={accent}quale componente avviare==, oltre alle =={green}informazioni che il componente destinatario== utilizza per eseguire correttamente l'azione.
Le informazioni principali sono:
- =={accent}Component name==
- =={green}Action==
- =={green}Data== 
- =={accent}Category==
- Extras
- Flags

### Component name
>[!note] Indica il nome del componente da avviare.
>

Il _Component name_ è l'informazione che rende un intent [[#Espliciti|esplicito]], senza di esso è il sistema a decidere a quale componente avviare.

```kotlin title:"Intent con Component name"
val intent = Intent(ctx, Activity2::class.java)
```
### Action
>[!note] È una stringa che indica l'azione generica da eseguire.

Una _Action_ determina in gran parte la struttura del resto dell'intent, in particolare le eventuali informazioni contenuti nei dati e negli extra.

>[!example] Esempi comuni
>- `{kotlin}ACTION_VIEW`: utilizzata quando si hanno dati che un’activity può mostrare all'utente.
>- `{kotlin}ACTION_SEND`: utilizzata quando si dispone di dati che l'utente può condividere tramite un'altra app, come un'app di posta elettronica o un'app di condivisione social.
>```kotlin
>val sendIntent = Intent().apply { 
>	action = Intent.ACTION_SEND 
>}
>```

>[!tip] Creazione di un Action
>Assicurati di includere il nome del pacchetto dell'app come prefisso:
>```kotlin
>object MyActions {
>	const val ACTION_UPDATE_DATA = "com.example.myapp.ACTION_UPDATE_DATA” 
>}
>```

### Data
>[!note] L'_URI_ (oggetto Uri) che fa riferimento ai dati su cui agire e/o al tipo MIME di tali dati.

Di solito il tipo di dato varia in base alla [[#Action]] dell'intent.
>[!example] Esempio
>Se l'azione è `{Kotlin}ACTION_EDIT,` i dati devono contenere l'URI del documento da modificare.

>[!important] MIME
>È importante specificare i tipi di MIME passati perché non è detto che una [[Activity]] che accetta immagini riesca a gestire anche audio.

>[!example] Esempi
>![[data1.png]]
![[data2.png]]

### Category
>[!note] È una stringa contenente informazioni aggiuntive sul tipo di componente che dovrebbe gestire l'intent. [opzionale]


>[!example] Categorie Comuni
>- `{kotlin}CATEGORY_BROWSABLE`: L’activity di destinazione consente di essere avviata da un browser Web per visualizzare i dati a cui fa riferimento un collegamento, ad esempio un'immagine o un messaggio di posta elettronica.
>- `{kotlin}CATEGORY_LAUNCHER`: L’activity è l’activity iniziale di un task, ed è elencata nel programma di avvio dell'applicazione del sistema.
>
>>[!example] Aggiunta categoria
>>![[addCategory.png]]
### Extras
>[!note] Coppie chiave-valore che contengono informazioni aggiuntive necessarie per eseguire l'azione richiesta.

Inoltre si possono aggiungere ulteriori dati con vari metodi `{kotlin}putExtra()`:
![[putExtra.png]]

>[!tip] Ricorda
>Se devi dichiarare le tue chiavi extra (per Intent che l'app riceve), assicurati di includere il nome del pacchetto dell'app come prefisso, come mostrato nell'esempio seguente:
>```kotlin
>const val EXTRA_GIGAWATTS = "com.example.EXTRA_GIGAWATTS"
>```

### Flags
>[!note] I _Flag_ sono definiti nella classe Intent e funzionano come metadati per l'intent, possono indicare al sistema Android come avviare un'attività e come trattarla dopo il lancio.

![[flags.png]]

## Avvio Activity
>[!example] Intent esplicito
>![[intent_esplicito.png]]

>[!example] Intent implicito
>![[Intent_implicito.png]]
>>[!note] Non è detto che esista un'activity che soddisfi le informazioni passate, quindi usiamo un `try-catch` per evitare errori.
>>Questa tecnica non è granché. Quindi andiamo ad usare `{kotlin}resolveActivity()`

### resolveActivity()
`{kotlin}resolveActivity()` verifica che un'activity riceva l'intent, se ritorna:
- _null_: l'intent non va utilizzato, se possibile bisogna disattivare la funzione che emette l'intent.
- _non-null_: esiste almeno un'activity in grado di gestire l'intent, quindi è sicuro chiamare `{kotlin}startActivity()`

![[resolveActivity.png]]

>[!note] packageManager
>È un gestore di pacchetti con tutte le informazioni di tutte le applicazioni del dispositivo
>>[!warning] package visibility
>>Passare il `{kotlin}packageManager` a `{kotlin}resolveActivity()` è valido fino ad Android 10.
>>Per motivi di sicurezza adesso si vuole utilizzare `<queries>` all'interno del manifest, in modo che le applicazioni esterne possano vedere l'[[#Intent filter|intent filter]].
>>![[queries-Intent_filter.png]]

### startActivity()
Quando viene chiamato `{kotlin}startActivity()`, il sistema esamina tutte le app installate per determinare quali sono in grado di gestire il tipo di intent.
>[!example] Esempio
>Prendiamo come esempio un intent con l'azione `ACTION_SEND` e che trasporta i dati "text / plain".
>Se
>- ==esiste solo un'app== in grado di gestirla, quell'app si apre immediatamente con lo specifico l'intent.
>-  ==più activity accettano l'intent==, il sistema visualizza una finestra di dialogo, in modo che l'utente possa scegliere quale app utilizzare

## Intent filter
Un __Intent filter__ specifica il tipo di Intent ([[#Action]] e [[#Data]]) che un'activity può ricevere.
Va specificato nel _manifest_:
![[intent-filter_manifest.png]]

L'intent filter accetta le informazioni:
- [[#Action]]
- [[#Data]]
- [[#Category]]

>[!example] Manifest con multipli intent-filter
>![[Manifest-Intent-filter.png]]
>```xml title:"Azione MAIN e categoria LAUNCHER"
><intent-filter>
>	<action android:name="android.intent.action.MAIN" />
>	<category android:name="android.intent.category.LAUNCHER" />
</intent-filter>
>```
>Questo Intent filter indica che questa activity è quella che va lanciata all'apertura dell'applicazione.
>>[!info] android:exported
>>`{xml}android:exported="true"` indica se l'activity è lanciabile da altre applicazioni.











