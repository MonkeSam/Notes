Jetpack Compose è il _toolkit_ moderno consigliato da Android per la creazione di interfacce utente native.
>[!abstract] Codice
>Creo una _Card_ che si espande e si restringe al click.
>![[JetpackCompose_demo.png]]
>

## Come usare compose?
Bisogna aggiungere le dipendenze al file `build.gradle` 
```kotlin title:"Esempio"
dependencies {

    val composeBom = platform("androidx.compose:compose-bom:2026.01.01")
    implementation(composeBom)
    androidTestImplementation(composeBom)

    // Choose one of the following:
    // Material Design 3
    implementation("androidx.compose.material3:material3")
    // or skip Material Design and build directly on top of foundational components
    implementation("androidx.compose.foundation:foundation")
    // or only import the main APIs for the underlying toolkit systems,
    // such as input and measurement/layout
    implementation("androidx.compose.ui:ui")

    // Android Studio Preview support
    implementation("androidx.compose.ui:ui-tooling-preview")
    debugImplementation("androidx.compose.ui:ui-tooling")

    // UI Tests
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-test-manifest")

    // Optional - Add window size utils
    implementation("androidx.compose.material3.adaptive:adaptive")

    // Optional - Integration with activities
    implementation("androidx.activity:activity-compose:1.11.0")
    // Optional - Integration with ViewModels
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.5")
    // Optional - Integration with LiveData
    implementation("androidx.compose.runtime:runtime-livedata")
    // Optional - Integration with RxJava
    implementation("androidx.compose.runtime:runtime-rxjava2")

}
```

## Paradigma dichiarativo
_Compose_ è un framework dichiarativo per l'interfaccia utente.
La tecnica utilizzata funziona rigenerando l'intera interfaccia da zero applicando solo le modifiche necessarie. Questa tecnica viene chiamata **Recomposition**.
>[!faq] Non è costoso questo comportamento?
>Per ridurre questo costo, Compose sceglie in modo intelligente quali parti
>dell'interfaccia utente devono essere ridisegnate in qualsiasi momento.

### Funzioni composable
Possiamo costruire un'interfaccia tramite un insieme di _funzioni composable_ che accettano dati ed emettono elementi dell'interfaccia.
```kotlin
@Composable
fun Greeting(name: String){
	Text("Hello $name")
}
```
All'interno di tali funzioni utilizziamo [[Kotlin]] e quindi abbiamo tutti i vantaggi possibili per creare dinamicamente le interfacce.

#### Recomposition
Non sappiamo in che ordine gli elementi _compose_ vengono ricomposti perché dipende dal sistema operativo.
Quindi è essenziale non modificare oggetti condivisi all'interni di un elemento compose proprio perché non sappiamo qual è l'ordine di esecuzione di ognuno di essi.
>[!example] Esempio di codice sbagliato
>La funzione `Row` e `Column` sono slegate e non sappiamo in che ordine vengono eseguite, quindi è sbagliato stampare la grandezza della lista.
>![[errore_compose.png]]

## State
Lo stato in un'app è qualsiasi valore che può cambiare nel tempo ed è slegato dalla UI.

Essendo _compose_ dichiarativo, l'unico modo per aggiornarlo è richiamare lo stesso composable con nuovi =={red}argomenti==. Questi argomenti rappresentano lo stato dell'interfaccia utente.

![[args_compose_state.png|600]]
## Ciclo di vita dei composable
Una **composition** può essere prodotta solo da una composizione iniziale e aggiornata tramite [[#Recomposition|ricomposizione]] 
![[ciclodivita_composable.png|600]]

>[!note] Ogni composable deve essere identificato univocamente
>In modo tale che [[Android]] sia in grado di sapere chi deve andare a ricomporre e chi può "mantenere in cache" per essere più rapido nella composizione.

>[!example] Esempio di composizione
>![[composition_example.png]]

### Comportamento
Considerando il seguente codice
![[example_composition_code.png|500]]
Abbiamo una colonna di film e all'aggiunta di un nuovo elemento in lista dobbiamo eseguire una ricomposizione.
![[movie_compose_example.png]]
L'elemento viene aggiunto in coda preservando ciò che era già presente.
>[!warning] L'aggiunta di un elemento è un caso particolare!
>Abbiamo detto che l'ordine non viene mai rispettato perché i composable sono indipendenti

Se invece di un'aggiunta in coda eseguiamo un'aggiunta in testa/al centro, una rimozione o uno shuffle otterremo come risultato una [[#Recomposition|ricomposizione]] di tutti gli elementi.
![[movie_recompose_all.png]]
>[!success] Risolviamo questo problema
>Semplicemente basta aggiungere un _id_ ad ogni Movie per evitare ricomposizioni inutili.

## Fasi di Compose
La composizione è suddivisa in 3 step:
1. **Composition**: quale interfaccia utente mostrare.
2. **Layout**: dove posizionare l'interfaccia utente
	- È suddivisa nei passaggi _misurazione_ e _posizionamento_
3. **Disegno**: come viene eseguito il rendering

![[compose_phases.png]]
>[!example] Esempio senza layout
>Non avendo specificato il layout i text si sovrappongono.
>![[layout_err_example.png]]
### Layout
Esistono diversi tipi di Layout
![[Layout.png|600]]
#### Column
Posiziona gli elementi verticalmente nell’interfaccia.
![[Column_layout.png|]]

#### Row
Posiziona gli elementi orizzontalmente
![[layout_row.png]]

#### Box
Posiziona gli elementi uno sopra l’altro
![[layout_box.png]]
#### Alignment
È possibile dare un allineamento verticale o orizzontale all’interno di questi layout.
![[Alignment.png]]

#### Modificatori
Per modificare un composable è possibile utilizzare i _modificatori_ che consentono di:
- Cambiarne le dimensioni, il layout, il comportamento e l'aspetto
- Aggiungere informazioni, come label di accessibilità
- Elaborare l'input dell'utente
- Aggiungere interazioni, come rendere un elemento cliccabile, scrollabile, trascinabile o zoomabile.

>[!example] Esempi di modificatori
>![[modifier_example.png]]
>![[modifiers2_example.png]]

>[!Info] I modificatori hanno un ordine
>Un po' come css l'ordine dei modificatori ha forte impatto sul risultato che si vuole ottenere.
>![[modifiers_order.png]]

Esistono diversi **tipi** di modificatori:
- Fill
- Padding
- Offset
- MatchParentSize

>[!note] È possibile creare dei modificatori riutilizzabili
>![[reuse_modifiers.png|500]]

#### Modello di Layout
I composable vengono disposti nel seguente modo: i genitori si misurano prima dei figli, ma vengono dimensionati e posizionati dopo i figli. Se lo vedessimo come un albero, si parte ad esplorare dalla radice e si va verso i figli e si posizionano prima i nodi foglia per poi risalire piano piano.
![[Layout_model.png]]

#### Responsive Layout
Utilizzando `{kotlin} BoxWithConstraints` possiamo progettare il layout sfruttando i vincoli provenienti dal genitore.
![[boxwithconstraints.png]]
#### Liste
Se l'utilizzo di una lista non richiede _scrolling_, si può usare `{kotlin}Column` o `{Kotlin}Row`, iterando sull'elemento.

![[List.png|500]]

>[!note] Modificatore
>Utilizzando il modificatore `{Kotlin}verticalScroll()` si può rendere la lista scrollabile

##### Lazy
Per liste contenenti un elevato numero di elementi, per motivi di prestazioni, si fa utilizzo di `{Kotlin} LazyColumn` o `{Kotlin} LazyRow`, rispettivamente per una lista scrollabile in verticale e per una lista scrollabile in orizzontale.

![[LazyList.png|500]]

Lo stesso vale anche per le griglie con `{Kotlin} LazyVerticalGrid` e `{Kotlin} LazyHorizontalGrid` che permettono la visualizzazione degli elementi tramite una griglia.
Si può specificare la dimensione delle colonne della griglia tramite l'attributo columns.
Se si usa `{Kotlin}GridCells.Fixed()` basta inserire il numero di colonne desiderate.

#### Paging
La libreria **Paging** consente di supportare grandi liste di elementi, caricando e
visualizzando piccole porzioni quando necessario.


