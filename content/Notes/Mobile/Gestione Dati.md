[[Android]] offre diversi modi per salvare i dati:
- **App-specific storage**: è uno spazio di archiviazione specifico per l'applicazione. I dati sono accessibili solo dall'app che li gestisce perché sono salvati nella memoria interna dell'app, rendendoli così privati.  ^d7f265
- **Shared storage (media, files)**: questo tipo di archiviazione permette l'accesso ai dati anche da parte di applicazione terze. Ad esempio lo possiamo utilizzare se vogliamo salvare delle foto in galleria tramite la nostra app. ^65c633
- **Preferences**: sono dati rappresentati da ==coppie chiave-valore== e che vengono tipicamente usati per accessi a informazioni in modo rapido. ^b0f1e1
- **Database**: è a tutti gli effetti un database relazionale ==privato==, relativo all'applicazione. ^878404

|                               | Type of content                                              | Access method                                                                                                | Permissions needed                                                                                                                                                                                               | Can other apps access?                                  | Files removed on app uninstall? |
| ----------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------- |
| **App-specific files**        | Files meant for your app's use only                          | Internal: `getFilesDir()` or `getCacheDir()`<br>External: `getExternalFilesDir()` or `getExternalCacheDir()` | Never needed for internal storage. Not needed for external storage on Android 4.4 (API 19) or higher                                                                                                             | No                                                      | Yes                             |
| **Media**                     | Shareable media files (images, audio files, videos)          | `MediaStore` API                                                                                             | `READ_EXTERNAL_STORAGE` for other apps' files on Android 11 (API 30)+<br>`READ_EXTERNAL_STORAGE` or `WRITE_EXTERNAL_STORAGE` on Android 10 (API 29)<br>Required for **all** files on Android 9 (API 28) or lower | Yes, though the other app needs `READ_EXTERNAL_STORAGE` | No                              |
| **Documents and other files** | Other types of shareable content, including downloaded files | Storage Access Framework                                                                                     | None                                                                                                                                                                                                             | Yes, through the system file picker                     | No                              |
| **App preferences**           | Key-value pairs                                              | Jetpack Preferences library                                                                                  | None                                                                                                                                                                                                             | No                                                      | Yes                             |
| **Database**                  | Structured data                                              | Room persistence library                                                                                     | None                                                                                                                                                                                                             | No                                                      | Yes                             |

La memoria può essere:
- **Interna**: Sempre disponibile anche se spesso più piccola di quella esterna
- **Esterna**: Si tratta di memorie rimovibili come schede SD e sono rappresentate dal sistema operativo tramite i percorsi come _/sdcard_

>[!info] preferExternal
>Di default le app vengono salvate nella memoria interna ma se le dimensioni dell'APK sono molto grandi, si può indicare una preferenza nel file [[Activity#Mainfest|manifest]] per installare l'app su memoria esterna
>```xml
><manifest ...
>	android:installLocation="preferExternal">
>...
></manifest>
>```

>[!note] Permessi ed accesso a memorie esterne
>Le autorizzazioni definite da Android:
>- _READ_EXTERNAL_STORAGE_
>- _WRITE_EXTERNAL_STORAGE_
>- _MANAGE_EXTERNAL_STORAGE_ (Da Android 11)
>
>Inizialmente per si utilizzavano READ\_EXTERNAL\_STORAGE e WRITE\_EXTERNAL\_STORAGE per accedere a tutto ciò che non apparteneva alla directory specifica dell'applicazione.
>Nelle versioni più recenti di Android ci si basa sul concetto di _scope_ dove ciò che è importante non è la posizione dei file ma se i file fanno parte dello scope dell'applicazione.
>Android 11 introduce l'autorizzazione MANAGE_EXTERNAL_STORAGE, che fornisce l'accesso in scrittura ai file al di fuori della directory specifica dell'app e di MediaStore.

## Permessi di accesso
- **Lettura e scrittura** sui file specifici dell'app non richiedono permessi
- **Lettura** a file di altre app richiede l'accesso tramite il permesso `READ_EXTERNAL_STORAGE`
- **Scrittura** su file di altre app tramite il consenso diretto dell'utente (eccezione fatta per la galleria e app a cui la scrittura è consentita da chiunque)
- **Nessuna lettura e scrittura** è consentita a directory esterne all'app

## App-specific Storage
>[!note] Definizione
>![[#^d7f265]]


- **Internal storage**: I file vengono archiviati in modo persistente o per scopi di caching, l'accesso non è consentito dall'esterno e da Android 10 le directory sono crittografate
- **External storage**: Il comportamento è lo stesso della memoria interna, l'unica differenza è che i file vengono salvati su memorie esterne al dispositivo.
  Se si vuole lasciare l'accesso ai file anche ad altre app, va specificato.

>[!warning] Uninstall
>Quando l'applicazione viene disinstallata, i file salvati nel [[#App-specific storage]] vengono rimossi.
>Quindi nei casi si voglia poter accedere a dati salvati dall'app anche dopo la rimozione, è necessario fare uso del [[#^65c633|shared storage]].

### Internal storage
Due tipi di salvataggi:
- _Persistente_ tramite la directory `filesDir`
- _Cache_ tramite la directory `cacheDir`

>[!warning] Spazio
>Solitamente lo spazio riservato è piccolo perché ovviamente sul dispositivo coesistono molteplici applicazioni, quindi ==la coperta è corta!==

#### File Persistenti
Per accedere e memorizzare i file persistenti si può usare `File` API.
```kotlin title=Esempio
val file = File(context.filesDir, filename)
```
Oppure si può usare un `FileOutputStream`.
```kotlin title="Esempio di codice per scrivere del testo in un file"
val filename = "myfile" 
val fileContents = "Hello world!" 
context.openFileOutput(filename, Context.MODE_PRIVATE).use {
	it.write(fileContents.toByteArray())
 }
```

```kotlin title="Accedere ad un file tramite stream"
context.openFileInput(filename).bufferedReader().useLines { 
lines -> 
	lines.fold("") { some, text -> "$some\n$text" } 
}
```

Si può ottenere un array contenente i nomi di tutti i file nella directory `filesDir` chiamando `{kotlin}fileList()`
```kotlin
var files: Array = context.fileList()
```

Si possono creare sotto directory
```kotlin
context.getDir(dirName, Context.MODE_PRIVATE)
```

#### File di cache
Questi file non devono contenere informazioni sensibili perché il loro scopo principale è quello di avere una memoria veloce per effettuare accessi frequenti.
Come ogni file nel [[#App-specific storage]] alla rimozione dell'app ==viene eliminato==.

Creare un file di cache
```kotlin
File.createTempFile(filename, null, context.cacheDir)
```

L'app accede a un file in questa directory utilizzando la proprietà `cacheDir` di un oggetto `context` e l'API File:
```kotlin
val cacheFile = File(context.cacheDir, filename)
```

>[!warning] Attenzione
>Quando il dispositivo ha poco spazio di archiviazione interno, Android può eliminare questi file di cache per recuperare spazio. Quindi è sempre meglio controllare l'esistenza dei file di cache prima di leggerli.

Cancellare la cache
```kotlin
cacheFile.delete()
```
oppure
```kotlin
context.deleteFile(cacheFileName)
```

### External storage
Ciò che succede nella memoria esterna è identico a quello che succede in quella [[#Internal storage|interna]].
Le directory sono:
- _Persistenti_: `externalFilesDir`
- _Cache_: `externalCacheDir`

![[controllo_memoria_esterna.png]]
![[selezione_della_memoria_esterna.png]]

L'accesso a file persistenti e di cache è identico a quello per la memoria interna ma con la differenza delle directory che sono quelle `External`.

>[!info] File multimediali
>Come già detto, per alcuni tipi di file, come quelli multimediali, è necessario che rimangano disponibili anche dopo la rimozione dell'app.
>Per questo nella memoria esterna si creano directory apposite per il salvataggio di file multimediali.
>![[external_media.png]]

## Shared Storage
È il tipo di memoria specifico per i file multimediali.
>[!note] Definizione
>![[#^65c633]]

Android fornisce le API per la gestione della condivisione dei seguenti dati:
- _Contenuti multimediali_
- _Documenti e altri file_
- _Dataset_: tutti i tipi di file solitamente utilizzati per l'allenamento di modelli I.A.
### Media
Questi file persistono anche dopo l'eliminazione dell'app che li ha creati.

Ogni tipo di media è salvato sul volume fisico e indicizzato tramite _media store_.
L'interazione con il media store avviene tramite [[Android#Content Resolver|ContentResolver]] recuperandolo dal _context_ dell'app.

I vari file sono classificati in base al loro tipo e alla directory in cui vengono salvati:
- _Images_
- _Videos_
- _Audio files_
- _Dowloaded files_

>[!important] Permessi
>Prima di eseguire operazioni sui file multimediali, bisogna assicurarsi che l’app abbia dichiarato le autorizzazioni necessarie per accedere a questi file.
>>[!warning] Versione
>>Se la tua app usa l'archiviazione con ambito (scoped storage), dovrebbe richiedere le autorizzazioni relative all'archiviazione solo per i dispositivi che eseguono Android 9 (livello API 28) o inferiore.
>>Ciò si può fare modificando il manidest:
>>```xml
>><uses-permission 
>>	android:name="android.permission.WRITE_EXTERNAL_STORAGE"
>>	android:maxSdkVersion="28" />
>>```

## Preferences: DataStore
>[!note] Definizione
>![[#^b0f1e1]]

Android ha sviluppato **DataStore** per sostituire _SharedPreferences_.
Implementazioni:
- _Proto DataStore_: memorizza oggetti tipizzati
- _Preferences DataStore_: memorizza coppie chiave-valore. 
  I dati vengono archiviati in modo:
	- Asincrono
	- Coerente e transazionale

>[!note] Regole
>- Esiste _una sola istanza_ di DataStore per applicazione.
>- Il tipo di DataStore deve essere _immutabile_
>- Non mescolare gli utilizzi di `SingleProcessDataStore` e `MultiProcessDataStore`, se si vuole accedere con più processi è sempre meglio utilizzare solo `MultiProcessDataStore`

>[!info] Setup
>![[Setup_datastore.png]]

### Chiave-Valore
Tramite le classi `{kotlin}DataStore` e `{kotlin}Preferences` possiamo rendere persistenti le coppie chiave-valore su disco.

```kotlin title="Creazione di un Preferences DataStore"
// At the top level of your kotlin file:
val Context.dataStore: DataStore by preferencesDataStore(name = "settings")
```

```kotlin title="Lettura da un Preferences DataStore"
val EXAMPLE_COUNTER = intPreferencesKey("example_counter") 
val exampleCounterFlow: Flow = context.dataStore.data
	.map { preferences ->
		// No type safety.
		preferences[EXAMPLE_COUNTER] ?: 0 
	}
```

```kotlin title="Scrittura su un Preferences DataStore"
suspend fun incrementCounter() { 
	context.dataStore.edit { settings ->
			val currentCounterValue = settings[EXAMPLE_COUNTER] ?: 0
				settings[EXAMPLE_COUNTER] = currentCounterValue + 1 
				} 
			}
```

## Database
>[!note] Definizione
>![[#^878404]]

`Room` è un oggetto che ci permette di fare uso di database offrendo uno strato di astrazione su SQLite per consentire un accesso fluido al database sfruttando la piena potenza di SQLite.

>[!quote] Approfondiremo meglio poi.

# View Model
La classe `{kotlin}ViewModel` è uno _state holder_ della UI, cioè si occupa di mantenere lo stato della view.
Ad ogni aggiornamento, `{kotlin}ViewModel` mantiene gli elementi che non vengono distrutti e ricreati in modo da essere più efficiente.
In sostanza slega l'interfaccia dai dati, facendo da tramite, gestendo al meglio l'aggiornamento di essi.

L'architettura abbiamo visto che è formata come segue
![[App Architecture#UI Layer]]

>[!success] Pro
>La `ViewModel`
>- Consente di mantenere lo stato dell'interfaccia
>- Fornisce accesso alla business logic

## Persistenza
`{kotlin}ViewModel` non fa altro che del caching, salva lo stato dell'interfaccia in modo che gli aggiornamenti dei dati rappresentati e la rappresentazione di essi avvenga in modo più efficiente e con la minor dipendenza possibile.

Passando al `{kotlin}ViewModel` un'interfaccia `{kotlin}ViewModelStoreOwner` (può essere un grafo di navigazione, una destinazione di [[Navigation Component#Componente|Navigation]], di un'[[Activity]]).
### Lifecycle di un ViewModel
La vita del `{kotlin}ViewModel` è strettamente legata a quella del suo `{kotlin}ViewModelStoreOwner`.

Solitamente si richiede un ViewModel la prima volta che il sistema chiama il metodo onCreate() di un oggetto Activity. Il sistema può chiamare onCreate() più volte durante la vita di un’activity, ad esempio quando viene ruotato lo schermo di un dispositivo. ==ViewModel esiste da quando si richiede per la prima volta un ViewModel== fino al completamento e alla distruzione dell’activity.

![[lifecycle_viewmodel.png|500]]
## Utilizzo
Utilizzando [[Jetpack Compose]] dobbiamo tener conto che non è possibile definire l'ambito di `ViewModel` per un composable perché non è un `ViewModelStoreOwner`.

Quindi possiamo
- Utilizzare un'activity per ogni schermata, così da avere un `ViewModel` per ogni screen.
- Posizionare i `ViewModel` il più vicino possibile alle destinazioni di navigazione per utilizzare [[Navigation Component|Compose Navigation]] perché definendo l'ambito di un ViewModel per destinazioni di navigazione, grafici di navigazione, attività e fragment.

### Aggiungere un ViewModel
In `build.gradle (Module: app o Unscramble)` nel blocco delle dipendenze e aggiungere la seguente dipendenza per ViewModel.
```kotlin
implementation "androidx.lifecycle:lifecycle-viewmodel-compose:2.10.0”
```

Creare una classe ed estenderla con ViewModel
```kotlin
import androidx.lifecycle.ViewModel 

class MyClassViewModel : ViewModel() { 
}
```
Nel package dell'interfaccia utente, aggiungi una classe modello per l'interfaccia utente di stato denominata MyClassUiState
```kotlin
Data class MyClassUiState( 
	val currentValue: String = "" 
)
```

## State Flow
**StateFlow** è un data holder observable flow che emette gli aggiornamenti di stato correnti e nuovi.
Tramite la proprietà `value` possiamo reperire il valore dello stato corrente.
>[!note] Aggiornamento
>Per aggiornare lo stato bisogna assegnare un nuovo valore a `value` della classe `MutableStateFlow`.

Uno StateFlow può essere esposto da MyClasseUiState in modo che i componenti Composable possano ascoltare gli aggiornamenti dello stato dell'interfaccia utente e fare in modo che lo stato dello schermo sopravviva alle modifiche della configurazione.

>[!example] Esempio
>```kotlin
>import kotlinx.coroutines.flow.MutableStateFlow
>// MyClass UI state 
>private val _uiState = MutableStateFlow(MyClassUiState()) 
>// Backing property to avoid state updates from other classes 
>val uiState: StateFlow
>```

>[!note] Architettura ViewModel
>![[ViewModel_Architecture.png]]

## Repository
La classe `{kotlin}Repository` astrae l'accesso a più sorgenti di dati (data source).
=={accent}Non fa parte delle librerie di Architecture Component==, ma è consigliabile utilizzarla per una maggior separazione del codice dall'architettura.
_Repository_ fornisce una API pulita per l'accesso ai dati al resto dell'applicazione.

![[repository.png|600]]

