È il linguaggio scelto da Google come standard per la programmazione di applicazioni [[Android]].
## Hello World!
Kotlin è definito in _package_.
L'entry point come in Java è la funzione _main_ che può essere anche priva di parametri.
```kotlin title:"println() lo utilizziamo per stampare"
package org.kotlinlang.play

fun main(){
	println("Hello World!")
}
```
## Variabili
**Tipizzazione statica** come Java, quindi si può dichiarare esplicitamente il tipo delle variabili `{kotlin} val a: Int=1` oppure far decidere il tipo al compilatore `{kotlin}val b=3`.
- `{kotlin} val` si usa per le variabili NON riassegnabili
- `{kotlin} var` si usa per le variabili riassegnabili 
- `{kotlin} const` viene utilizzato per motivi di per motivi di performance con variabili di cui si sa il valore a _compile time_ (`{kotlin title:esempio}const val MAX_LOGIN_ATTEMPTS = 3`)
### Stringhe
- Tramite gli _String Templates_ possiamo interpolare variabili ed espressioni direttamente all'interno di una stringa.
- Utilizzando le triple virgolette, è possibile definire una _Multiline String_
```kotlin
val greeting = "Kotliner"
println("Hello $greeting")
println("Hello ${greeting.uppercase()}")
println("""

        Hello
        "$greeting"
        """.trimIndent())
        // rimuove l'indentazione del codice dalle linee della stringa
```
## Funzioni
- La seguente funzione prende in input una stringa e restituisce **Unit**, l'equivalente di `{Java}void` di Java (Si può anche non specificare).
```kotlin
fun printMessage(message: String): Unit {
	println(message)
}
```

- Si possono impostare anche valori di default per i parametri
```kotlin
fun printMessageWithPrefix(message: String, prefix: String = "Info") {
    println("[$prefix] $message")
}
```

>[!tip] Ordine
>L'ordine dei parametri può essere trascurata purché si specifichi per quale parametro si va ad assegnare un determinato valore.
>```kotlin
>fun printMessageWithPrefix(message: String, prefix: String = "Info") {
  >	println("[$prefix] $message")
>}
>
>fun main(){
>	printMessageWithPrefix(prefix = "Log", message = "Hello")
>}
>```

>[!tip] Return
>Il tipo di ritorno può non essere specificato e lasciato decidere dal compilatore.

>[!tip] Inline
>Se il corpo della funzione è composto da una sola istruzione, si può usare l'uguale per scrivere tutto su una riga
>```kotlin
>fun sum(x: Int, y: Int) = x + y
>```

### Extension function
Kotlin permette di estendere classi o interfacce esistenti tramite le **extension**.
```kotlin hl:5
fun Int.pow(exp: Int): Int =  if (exp == 0) 1 else this * pow(exp - 1)

fun main() {

    println(2.pow(3)) // 8
}
```

### Infix function
Le funzioni con un solo parametro possono essere trasformate in _infix functions_.
>[!tip] Una infix function può essere richiamata come un operatore

```kotlin hl:1,5
infix fun Int.pow(exp: Int): Int =  if (exp == 0) 1 else this * pow(exp - 1)

fun main() {

    println(2 pow 3) // 8
}
```

### Operator function
Con la keyword **operator** si possono rendere operatori delle funzioni, quindi potendole invocare con i simboli dei rispettivi operatori.
>[!note] C#
>È come l'_overload_ degli operatori in C#
```kotlin
operator fun Int.times(str: String) = str.repeat(this) 
println(2 * "Bye ") // Bye Bye

operator fun String.get(range: IntRange) = substring(range)  
val str = "Always forgive your enemies; nothing annoys them so much." println(str[0..14]) // Always forgive
```

### Parametri vararg
Un parametro `{kotlin}vararg` permette di passare un numero qualsiasi di argomenti, separandoli con delle virgole e trattandoli come un array all’interno del corpo della funzione.
```kotlin
fun printAll(vararg messages: String) {

    for (m in messages) println(m)
}
printAll("Hello", "Hallo", "Salut", "Hola", "你好")
```
>[!info] Spread oprator
>Tramite lo spread operator `{kotlin}*` è possibile convertire un array in una lista di parametri vararg
>```kotlin
>fun log(vararg entries: String) {
 >	printAll(*entries)
>}
>log("Hello", "Hallo", "Salut", "Hola", "你好")
>```

## Null Safety
Kotlin offre supporto sintattico per la gestione dei tipi _nullable_, in modo da evitare le `{Kotlin}NullPointerException` senza dover ricorrere agli `{Java}Option`.
### Nullable
Non è possibile assegnare il valore `{kotlin} null` se la variabile non è dichiarata come _nullable_
```kotlin
var neverNull: String = "This can't be null"  
var nullable: String? = "You can keep a null here" 
var inferredNonNull = "The compiler assumes non-null"
```
Le variabili _nullable_ vengono gestite a compile time:
>[!fail] Errore 1
>```kotlin
>fun main(){
>	var neverNull: String = "This can't be null" 
>	neverNull = null
>}
>```
>![[null1.png]]

>[!fail] Errore 2
>```kotlin
>var inferredNonNull = "The compiler assumes non-null" 
>inferredNonNull=null
>```
>![[nullable2.png]]

>[!fail] Errore 3
>```kotlin
>fun strLength(notNull: String): Int {
>	return notNull.length
>}
>strLength(neverNull) 
>strLength(nullable)
>```
>![[null3.png]]

>[!success] Come evitare
>- Safe call: `{kotlin}?.` si usa quando si vuole fare una chiamata ad una variabile potenzialmente null `{kotlin title:esempio}val stringa = mionome?.length` 
>- Non-null assertion: `{kotlin}!!` diciamo al compilatore che la variabile è nullable
>- Elvis: `{kotlin}?:` con questo operatore si va a definire un valore di default in caso di NullException `{kotlin} miastringa.length ?:0`
## Equality check
Kotlin utilizza `==` per il confronto strutturale, mentre usa `===` per il confronto referenziale

```Kotlin
val authors = setOf("Shakespeare", "Hemingway", "Twain") 
val writers = setOf("Twain", "Shakespeare", "Hemingway")

println(authors == writers) // true 
println(authors === writers) // false
```
## Flussi di controllo
### When
Al posto dello switch, Kotlin utilizza `{kotlin} when` che è molto più potente e chiaro rispetto ad uno switch perché è utilizzabile sia come _statement_ che come _espressione_:
```kotlin title:Statement
fun whenStatement(obj: Any) {
    when (obj) {
        1 -> println("One")
        "Hello" -> println("Greeting")
        is Long -> println("Long")
        !is String -> println("Not a string")
        else -> println("Unknown")
	} 
}
```

```kotlin title:Espressione
fun whenAssignment(obj: Any): Any {
    val result = when (obj) {
        1 -> "one"
        "Hello" -> 1
        is Long -> false
        else -> 42
	}
    return result
}

```

### for
```kotlin
val cakes = listOf("carrot", "cheese", "chocolate")
for (cake in cakes) {

    println("Yummy, it's a $cake cake!")
}
```
#### Range
I cicli _for_ in Kotlin sono molto flessibili perché dispongono di diversi modi per dichiarare i range del ciclo.
- `{kotlin}x..y`: equivale a tutti i numeri da `x` a `y` (equivale a `{kotlin}for(i=0; i<=3; i++)`)
```kotlin title:esempio
for(i in 0..3) {
	print(i) 
}
```
- `{kotlin} x until y`: prende tutti i numeri da `x` a `y` escluso  (equivale a `{kotlin}for(i=0; i<3; i++)`))
```kotlin title:esempio
for(i in 0 until 3) {
	print(i) 
}
```
- `{kotlin} x..y step z`: prende tutti i numeri da `x` a `y` incrementando ogni volta di `z`
```kotlin title:esempio
for(i in 2..8 step 2) {
	print(i) 
}
```
- `{kotlin} x downTo y` si va da il numero più grande `x` al più piccolo `y`
```kotlin title:esempio
for(i in 3 downTo 0) {
	print(i) 
}
```

>[!tip] Char
>È possibile utilizzare i range anche per i _char_

>[!tip] Include
>I range possono essere utilizzati anche per verificare che un numero appartenga ad un certo range
>```kotlin title:esempio
>val x = 2
>if (x in 1..5) {
  >  print("x is in range from 1 to 5")
>}
>
>if (x !in 6..10) {
>    print("x is not in range from 6 to 10")
>}
>```
### while e do-while
```kotlin
fun eatACake() = println("Eat a Cake")
fun bakeACake() = println("Bake a Cake")

fun main(args: Array<String>) {
    var cakesEaten = 0
    var cakesBaked = 0
    while (cakesEaten < 5) {
		eatACake()
        cakesEaten ++
    }
    
    do {bakeACake()
        cakesBaked++
    } while (cakesBaked < cakesEaten)
}
```
### Iteratori
È possibile definire iteratori nelle classi implementando l'operatore _iterator_.
```kotlin
class Animal(val name: String)

class Zoo(val animals: List<Animal>) {
    operator fun iterator(): Iterator<Animal> {// 1 
        return animals.iterator()// 2
    }
fun main() {
	val zoo = Zoo(listOf(Animal("zebra"), Animal("lion")))
	for (animal in zoo) { // 3
	    println("Watch out, it's a ${animal.name}")
	}
}
```
1. Definisce un operatore iterator: deve essere chiamato _iterator_ e avere il modificatore _operator_
2. Restituisce l'_iterator_, che deve implementare:
	- `{kotlin} next():Animal`
	- `{kotlin} hasNext():Boolean`
3. Cicla sugli animali nello zoo con l'iterator definito
## Ternaries
Kotlin non offre alcun operatore ternario ma `{kotlin} if` può essere usato come espressione.
```kotlin
fun max(a: Int, b: Int) = if (a > b) a else b
```
Ed è più potente di un operatore ternario:
```kotlin
fun sign(n: Int) =
    if (n > 0) "+"
	else if (n < 0) "-"
	else "0"
```
Anche se in molti casi è preferibile utilizzare [[#When]] 
```kotlin
fun sign(n: Int) = when {
    n > 0 -> "+"
	n < 0 -> "-"
	else -> "0"
}
```
## Classi
>[!note] Definizione
>Costruttore implicito di default creato automaticamente da Kotlin
>```kotlin
>class Customer
>```
>Il costruttore implicito assegna i valori direttamente alle variabili dichiarate.
>```kotlin
>class Contact(val id: Int, var email: String)
>```
### Ereditarietà
Molto simile a Java.
>[!note] Differenze da Java
>Tutte le classi di Kotlin sono già dichiarate `{Java} final`, se vogliamo renderle pubbliche bisogna dichiararle `{kotlin} open`.

>[!example] Esempio
>```kotlin
>open class Dog {
>    open fun sayHello() {
>        println("wow wow!")
>    }
>}
>
>class Yorkshire : Dog() {
>    override fun sayHello() {
>        println("wif wif!")
>    }
>}
>
>fun main() {
>    val dog: Dog = Yorkshire()
>    dog.sayHello()
>}

> [!tip] Super
> È possibile passare il parametro alla superclasse (`7.`)
> ```kotlin
> open class Tiger(val origin: String) { fun sayHello() {
> 
> println("A tiger from $origin says: grrhhh!") }
> 
> }
> 
> class SiberianTiger : Tiger("Siberia")
> 
> fun main() {  
> val tiger: Tiger = SiberianTiger() tiger.sayHello()
> 
> }
> ```
> 
> È anche possibile passare gli argomenti del costruttore alla superclasse (`6.`)
>
>```kotlin
>open class Lion(val name: String, val origin: String) { fun sayHello() {
>println("$name, the lion from $origin says: graoh!") }
>
>}  
>class Asiatic(name: String)
>	: Lion(name = name, origin = "India")
>
>fun main() {  
>	val lion: Lion = Asiatic("Rufo") lion.sayHello()
>}
>

### Special classes
#### Data classes
Le _data classes_ semplificano la creazione di classi utilizzate per modellare dati implementando di default i metodi:
- `{kotlin}equals()` e `{kotlin}hashCode()`
- `{kotlin}toString()`, nella forma "`{kotlin}User(name=Jhon, age=42)`"
- `{kotlin}componentN()` per il destructuring
- `{kotlin}copy()`

>[!warning] Il costruttore deve avere almeno un parametro

>[!note] Dichiarazione
>`{kotlin}data class User(val id: Int, val username: String)`

>[!tip] Per escludere una proprietà dalle implementazioni generate, dichiararla all'interno del corpo della classe
>```kotlin
>data class Person(val name: String) {
>    var age: Int = 0
>}
>```

#### Enum classes
Sono utilizzate per modellare tipi che rappresentano un _set finito_ di valori distinti.
```kotlin
enum class State {
	IDLE, RUNNING, FINISHED
}
fun main() {
    val state = State.RUNNING
    val message = when (state) {

}
```
Anche gli _enum_ possono accettare parametri in ingresso.
```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),

    GREEN(0x00FF00),
    BLUE(0x0000FF),
    YELLOW(0xFFFF00);

    fun containsRed() = (this.rgb and 0xFF0000 != 0)
}

fun main() {
    val red = Color.RED
    println(red)
    println(red.containsRed())
    println(Color.BLUE.containsRed())
    println(Color.YELLOW.containsRed()) // true

}
```
#### Sealed classes
Sono delle classi _abstract_ e possono avere delle sottoclassi ==solo all'interno dello stesso package in cui è dichiarata.==
```kotlin wrap
sealed class Mammal(val name: String)  
class Cat(val catName: String) : Mammal(catName)
class Human(val humanName: String, val job: String) : Mammal(humanName)

fun greetMammal(mammal: Mammal): String {
	when (mammal) {
		is Human ->  return "Hello ${mammal.name}; You're working as a ${mammal.job}"
		is Cat -> return "Hello ${mammal.name}" 
	}
}  
fun main() = println(greetMammal(Cat("Snowy")))
```
>[!note] La differenza degli enum è che non si ha un set finito di valori

### Properties
Kotlin offre varie funzionalità per la definizione delle proprietà di una classe.
- `{Kotlin title="Proprietà semplice"} var height: Int = 2` 
- `{Kotlin title="Proprietà read-only con getter"} val area get() = this.side * this.side`
```kotlin title="Proprietà con setter privato"
class Counter {
    var count: Int = 0
	    private set
    fun inc() = count++
    fun dec() = count--
}
```
```kotlin title="Proprietà con backing field"
var rating: Int? = null
    get() {
        if (field == 5) {
			println("This is an amazing book!") 
		}
		return field
    }
    set(value) {
		if (value != null && value !in 1..5) {
			throw IllegalArgumentException() 
		}
		field = value
    }
```

#### Delegate
Kotlin supporta il pattern _delegate_ con la keyword `{kotlin} by`.
>[!example] Esempio
>Supponiamo di voler creare una proprietà lazy, che non viene inizializzata alla creazione di un oggetto, ma solo al primo accesso alla proprietà stessa
```kotlin title:"implementazione proprietà lazy"
class LazyProperty(val initializer: () -> Int) { 
	var value: Int? = null  
	val lazy: Int
		get() {  
			if (value == null) value = initializer()
			
			     return value!!
			}
		}
}
```
```kotlin title:"implementazione con delegati"
class MyLazy<T>(val initializer: () -> T) {  
var instance: T? = null  
operator fun getValue(thisRef: Any?, prop: KProperty<*>): T {
	if (instance == null) instance = initializer()
        return instance!!
    }
}
class LazyProperty(val initializer: () -> Int) {
	val lazyValue by MyLazy(initializer) 
}
```

>[!note] Le proprietà _lazy_ sono già implementate in Kotlin tramite al funzione `{kotlin} lazy`

#### Object keyword
Identifica un tipo di dato con una singola implementazione, similmente al pattern _singleton_, garantisce che venga creata una sola istanza di una certa classe, anche se più thread tentano di crearla.
```kotlin title:"object expression"
fun rentPrice(standardDays: Int, festivityDays: Int, specialDays: Int): Unit{ 
	val dayRates = object {
		var standard: Int = 30 * standardDays 
		var festivity: Int = 50 * festivityDays 
		var special: Int = 100 * specialDays
	}
	val total = dayRates.standard + dayRates.festivity + dayRates.special
	print("Total price: $$total")
}
fun main() {
    rentPrice(10, 2, 1)
}
```
>[!example] Nell'esempio precedente l'object viene creato a riga 11.

```kotlin title:"object declaration"
object DoAuth {
	fun takeParams(username: String, password:String){
		println("input Auth parameters = $username:$password")
	}
}

fun main(){
	DoAuth.takeParams("foo", "qwerty")
}
```

##### Companion Object
È il sostituto dei membri statici di Java.
È possibile richiamare i membri del _companion object_ utilizzando il nome della classe.
```kotlin title:"dichiarazione del companion object"
class BigBen {
    companion object Bonger {

        fun getBongs(nTimes: Int) {
            for (i in 1 .. nTimes) {
                print("BONG ")
            }
		} 
	}
}
```

```kotlin title:"utilizzo del companion object"
fun main() {
    BigBen.getBongs(12)
}
```

## Higher-order functions
È una funzione che accetta un'altra funzione come parametro e/o restituisce una funzione.
```kotlin
fun calculate(x: Int, y: Int, operation: (Int, Int) -> Int): Int {

    return operation(x, y)
}
fun sum(x: Int, y: Int) = x + y
fun main() {  
	val sumResult = calculate(4, 5, ::sum)  
	val mulResult = calculate(4, 5) { a, b -> a * b } 
	println("sumResult $sumResult, mulResult $mulResult")
}
```
### Lambda
Sono funzioni dichiarabili come variabili.
```kotlin
val upperCase1: (String) -> String = { str: String -> str.uppercase() } 
val upperCase2: (String) -> String = { str -> str.uppercase() }  
val upperCase3 = { str: String -> str.uppercase() }  
// val upperCase4 = { str -> str.uppercase() } è errata perché non è riconosciuto il tipo di str

val upperCase5: (String) -> String = { it.uppercase() }

val upperCase6: (String) -> String = String::uppercase

println(upperCase1("hello"))
println(upperCase2("hello"))
println(upperCase3("hello"))
println(upperCase5("hello"))
println(upperCase6("hello"))
```

#### Trailing Lambda
Se una lambda è l’ultimo parametro di una funzione, allora è possible piazzarla ==fuori dalle parentesi.==
>[!info] Il return è implicito
```kotlin
someList.getOrElse(1) {
    println("Missing item")
	42
}
```
Inoltre, se la lambda è l’unico parametro, è possibile omettere interamente le parentesi.
```kotlin
 someList.filter { it < 0 }
```

## Collections
### List
È una collezione ordinata di elementi
- _List_: read-only
- _MutableList_: read-write

```kotlin
val systemUsers: MutableList<Int> = mutableListOf(1, 2, 3) 
val sudoers: List<Int> = systemUsers
```
### Set
Collezione non ordinata di elementi senza duplicati:
- _Set_: read-only
- _MutableSet_: read-write
```kotlin
val openIssues: MutableSet<String> = mutableSetOf("uniqueDescr1", "uniqueDescr2", "uniqueDescr3")
```
### Map
Collezione di coppie chiave-valore.
- _Map_: read-only
- _MutableMap_: read-write

```kotlin
val EZPassAccounts: MutableMap<Int, Int> =
    mutableMapOf(1 to 100, 2 to 100, 3 to 100)
```

>[!note] Tramite `{kotlin} to` (che è una [[#Infix function]]) andiamo a creare il record della nostra mappa

### Collection methods
#### filter
Restituisce una collezione filtrata per ogni elemento che rispetta la condizione della funzione [[#Lambda]].
```kotlin
val negatives = numbers.filter { it < 0 }
```
#### map
Mappa tutti gli elementi in base alla definizione della lambda.
```kotlin
val doubled = numbers.map { x -> x * 2 }
```
#### count
Restituisce il numero di elementi che rispettano la condizione della funzione lambda
```kotlin
val evenCount = numbers.count { it % 2 == 0 }
```
#### getOrElse
È un metodo per avere un accesso sicuro, tramite indice o chiave, all'elemento della collezione: se l'elemento esiste viene ritornato normalmente, altrimenti viene eseguita la funzione lambda specificata.
```kotlin title:"esempio con lista"
val list = listOf(0, 10, 20)
println(list.getOrElse(1) { 42 })
```

```kotlin title="esempio con mappa"
val map = mutableMapOf("x" to 3)
println(map.getOrElse("x") { 1 })
```

#### Altro
Esistono altri metodi come _any_, _all_, _none_, _find_, _first_, _last_, _sorted_, ecc.
>[!info] Rimangono comunque molto simili a Java.

### Sequence
Sono il corrispettivo delle _stream_ di Java per eseguire funzioni in modo lazy su una collezione.
```kotlin
fun findMostExpensiveProductBy(customer: Customer): Product? = 
	customer
        .orders
        .asSequence()
        .filter { it.isDelivered }
        .flatMap { it.products }
        .maxByOrNull { it.price }
```

## Scope function
### let
Viene utilizzata per _scoping_ e _null-checks_
Quando viene chiamata su un oggetto esegue il blocco di codice dato e restituisce il risultato della sua ultima espressione.
```kotlin
fun printNonNull(str: String?) {
    println("Printing \"$str\":")

    str?.let {
        print("\t")
        customPrint(it)
		println() 
	}
}
printNonNull(null)
printNonNull("my string")
```
### run
È uguale a [[#let]] solo che accediamo all'oggetto tramite `{kotlin}this`.
```kotlin
fun getNullableLength(ns: String?) { 
	println("for \"$ns\":")  
	ns?.run {
		println("\tis empty? " + isEmpty())
        println("\tlength = $length")
        length
	}   
}

getNullableLength(null) 
getNullableLength("") 
getNullableLength("some string with Kotlin")
```

### with
Ci permette di accedere ai parametri in maniera concisa omettendo il nome dell'istanza
```kotlin
class Configuration(var host: String, var port: Int)
fun main() {
	val configuration = Configuration(host = "127.0.0.1", port = 9000) 
	with(configuration) {println("$host:$port")}
    // instead of:
	println("${configuration.host}:${configuration.port}")
}
```

### apply
Esegue un lambda su un oggetto e restituisce l'oggetto stesso.
>[!info] Possiamo referenziare l'oggetto tramite `{kotlin}this` (implicito).

```kotlin
data class Person(var name: String, var age: Int = 0, var about: String = "")

fun main() {  
	val jake = Person("Jake")  
	val stringDescription = jake.apply {
		age=30
        about = "Android developer"
    }.toString()
	println(stringDescription)
}
```
`{kotlin} apply`  è utile quando vogliamo fare delle inizializzazioni un po' complesse.

### also
Funziona come apply, ma all’interno della funzione l'oggetto è referenziato con `{kotlin} it`, quindi è più facile passarlo come parametro.
È utile per incorporare azioni aggiuntive, come logging, all'interno di una catena di chiamate a funzione.
```kotlin
data class Person(var name: String, var age: Int = 0, var about: String = "") 
fun writeCreationLog(p: Person) {
	println("A new person ${p.name} was created.")
}

fun main() {  
val jake = Person("Jake", 30, "Android developer")
	.also {
		writeCreationLog(it)
	}
}
```


## Error Handling
>[!important] I meccanismi di gestione degli errori offerti da Kotlin sono essenzialmente gli stessi di Java
>**Con un’importante differenza**: Kotlin non supporta le checked exceptions (clausola throws nella signature dei metodi Java).

## Generics
Sono praticamente identici a Java
![[generics.png]]

## Naming conventions

- I nomi dei package vanno interamente in minuscolo e senza underscore 
  `{kotlin} package org.kotlinlang.play`
- I nomi delle classi e degli object usano il _PascalCase_ 
  `{kotlin} open class DeclarationProcessor { /*...*/ }`
- I nomi di funzioni, proprietà, variabili locali e oggetti mutabili usano il _camelCase_ 
  `{kotlin} fun processDeclarations() { /*...*/ }`
  `{kotlin} var declarationCount = 1`
- I valori degli enum sono accettabili sia in _PascalCase_ che in _SCREAMING_SNAKE_CASE_
  `{kotlin title:PascalCase}enum class State { Running, Finished }`
  `{kotlin title:SCREAMING_SNAKE_CASE} enum class State { RUNNING, FINISHED }`
- I nomi delle costanti usano lo _SCREAMING_SNAKE_CASE_
  `{kotlin} const val MAX_COUNT = 8`
- I nomi delle proprietà che contengono riferimenti a oggetti ==singleton== possono usare lo stesso stile di denominazione delle dichiarazioni degli oggetti
  `{kotlin}val PersonComparator: Comparator<Person> = /*...*/`
- Se una classe ha due proprietà concettualmente uguali, ma una fa parte di un'_API pubblica_ e l'altra è un _dettaglio di implementazione_, allora è bene prefissare la proprietà privata, detta anche backing property, con un *underscore*
  ```kotlin
  class C {  
	private val _elementList = mutableListOf<Element>()
    val elementList: List<Element>
         get() = _elementList
}
  ```
  