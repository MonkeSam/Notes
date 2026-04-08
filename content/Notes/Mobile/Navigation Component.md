Con _navigazione_ intendiamo alle interazioni che consentono agli utenti di spostarsi tra i diversi contenuti dell'app.
La gestione della navigazione viene fatta da il **Navigation component** di [[Jetpack Compose|Android Jetpack]] seguendo una serie di ==principi di navigazione ben definiti==

## Principi di navigazione

### Destinazione di partenza fissa
Ogni app ha una destinazione iniziale **fissa**. Altro non è che la prima schermata che l'utente vede quando avvia l'app dal launcher ed è anche l'ultima ad essere visualizzata, prima di uscire, dopo aver premuto il pulsante indietro.
![[start_destination.png]]
### Stato di navigazione
Quando l'app viene avviata per la prima volta, viene creata una nuova [[Activity|activity]] e l'app visualizza la [[#Destinazione di partenza fissa|destinazione iniziale]], essa diventa la destinazione di base de **back stack**.

>[!note] Back stack
>Non è altro che la sequenza di pagine che sono state percorse dall'utente. 
>Vengono rappresentate tramite uno stack:
>- _top_ dello stack è la schermata corrente  e le destinazioni precedenti rappresentano la cronologia delle schermate in cui l'utente ha fatto accesso.
>- le _operazioni_ di modifica del back stack interagiscono sempre in cima allo stack:
>	- ==nuova schermata==: spingendo una nuova destinazione in cima allo stack
>	- estraendo la destinazione più in alto dallo stack

^710aa5

![[back_stack.png]]

### Back e Up
Sono i pulsanti che permettono di ripercorrere il [[#^710aa5|back stack]] per tornare alla schermata precedente, entrambi ==si comportano allo stesso modo==.

Di seguito Up e Back
![[Up_up.png|400]]


- **Up**: si trova nella parte superiore, nella barra dell'app.
- **Back**: fa parte dell'interfaccia del sistema e si trova in basso.

>[!faq] Qual è la differenza allora?
>_Back_ è l'unico che può chiudere l'applicazione!
>Se ci si trova nella base dello stack e si esegue un click su Up, non si chiuderà l'app.

### Deep linking
Il **deep linking** è un collegamento o URL che porta direttamente a una destinazione specifica all'interno di un app. Quando viene creato, qualsiasi back stack esistente viene rimosso e sostituito con il back stack collegato in modo diretto.
Quindi ==viene simulata la navigazione== manuale per poter sfruttare al meglio il back stack.
![[deep_link.png]]
![[Manual_link.png]]

### Benefici
Il Navigation component offre una serie di benefici:
- _Animazioni e transizioni_
- _[[#Deep linking]]_
- _Pattern di UI_: supporta pattern come i navigation drawer e la bottom navigation con un lavoro aggiuntivo minimo
- _Type safety_: include il supporto per il passaggio di dati tra destinazioni con type safety
- _Supporto ViewModel_: consente di estendere un ViewModel  a un grafico di navigazione per condividere i dati relativi all'interfaccia utente tra le destinazioni del grafico
- _[[#Back e Up]]_ 

## Componente
È possibile navigare tra [[Jetpack Compose|composable]] sfruttando l'infrastruttura e le funzioni del Navigation component.
>[!note] Concetti chiave
>![[concetti_chiave_Navigation.png]]

>[!tip] Setup
>Per supportare _Navigation_, definire le dipendenze nel file `build.gradle.kts` nel modulo dell'applicazione.
>![[setup_navigation.png]]

### Getting started
**NavController** è l'API centrale del componente Navigation.
- Tiene traccia del _Navigation graph_, delle schermate dell'applicazione e dello stato di ciascuna schermata per la gestione del [[#Stato di navigazione|back stack]]

Utilizzando il metodo `{kotlin}rememberNavController()` è possibile creare un `{kotlin}NavController`:

```kotlin title:"Creazione NavController"
val navController = rememberNavController()
```

>[!note] N.B.
>Il NavController si deve trovare si deve trovare abbastanza in alto nella gerarchia dei composable in modo che tutti i componenti possano accedervi.
>Facendo così avremmo una _single source of truth_ perché solo un solo composable sarà in possesso del reale stato della navigazione. Ciò segue i principi [state hoisting](https://developer.android.com/develop/ui/compose/state#state-hoisting)
>
>![[state_hoisting.png|300]]

#### NavHost
Ogni NavController deve essere associato ad un **NavHost**.
Il **NavHost** collega il NavController con un grafo di navigazione che specifica le destinazioni composable tra quali navigare.
Per ogni destinazione è associato un percorso (che deve essere unico) chiamato **route**.

>[!example] Creazione NavHost
>I Composable rappresentano rotte serializabili.
>![[NavHost.png]]
### Navigazione
#### Serializzazione
>[!tip] Setup
>Per installare le dipendenze che permettono la serializzazione, va modificato il file `build.gradle.kts` aggiungendo:
>- Nel blocco _dependencies_ ![[serializable_dependencies.png]]
>- Nel blocco _plugins_ ![[serialization_plugins.png]]
>- Nel blocco `[plugins]` del file `libs.versions.toml` ![[toml_serialization.png]]



Ogni destinazione è identificata da un oggetto marcato come `{kotlin}@Serializable`, che può essere passato al NavController per navigare verso la schermata corrispondente.
Per un miglior livello di organizzazione e safety è consigliabile definire un elenco di rotte in una `{kotlin}sealed interface` o `{kotlin}sealed class`

![[sealed_interface.png]]

#### Creazione del grafo
Creiamo il grafo di navigazione specificando per ogni composable la propria destinazione.
![[navgraph_creation.png]]

Alla funzione `{kotlin}NavGraph()` passiamo il controller creato nel seguente modo
```kotlin
val navController = rememberNavController()
```

>[!warning] Nota: remember
>Una funzione `{kotlin}@Composable` viene eseguita ogni volta che i suoi parametri vengono modificati, per questo è preferibile non effettuare computazioni costose all'interno dei composable.
>Infatti tramite la funzione _remember_ permettiamo al composable di eseguire la computazione del suo valore solo durante la prima composition.
>```kotlin title:"Eseguita solo una volta"
>val value = remember { someExpensiveFunctionReturningAValue() }
>```

#### Utilizzo del NavController
Utilizziamo il NavController per navigare attraverso i composable.
```kotlin
@Serializable 
object FriendsList
..
navController.navigate(route = FriendsList)
```

>[!example] Esempio
>Di seguito vediamo un esempio di utilizzo del NavController verificando la presenza di destinazioni precedenti nel [[#Stato di navigazione|back stack]] per decidere se attivare o meno il bottone "Go Back".
![[previousBackStackEntry.png]]

##### Modifica del back stack
Navigando andiamo a modificare il back stack aggiungendo o rimuovendo le destinazioni in cima allo stack.
>[!note] popUpTo
>La funzione `{kotlin}popUpTo()` permette la modifica del back stack rimuovendo  tutte le destinazioni successive a quella definita.

>[!note] Salvataggio dello stato
>Impostando i parametri `{kotlin}saveState = true` e `{kotlin} restoreState = true` permettiamo di mantenere lo stato di una destinazione al momento della rimozione dal back stack, in modo da non perdere i dati qualora l'utente voglia ritornare su quella destinazione.
>![[destination_saveState.png]]

##### UDF
Secondo il principio [[App Architecture#Unidirectional Data Flow|UDF]] non è consigliabile passare il riferimento del NavController al composable in modo che possa chiamare direttamente `{kotlin}navigate()`.
Bisognerebbe esporre la funzione del composable per poter passare il comportamento del NavController.
![[UDF_behaviour.png]]

##### Passaggio di argomenti
Navigation Compose supporta anche il passaggio di argomenti tra destinazioni composable.
```kotlin
@Serializable 
data class Profile(val name: String)
```

È necessario estrarre gli argomenti da _NavBackStackEntry_ disponibili nella lambda della funzione composable
![[navbackstackentry.png]]

Per passare l'argomento alla destinazione, bisogna aggiungerlo alla rotta quando si effettua la chiamata di `{kotlin}navigate()`
![[navigate_args.png]]
