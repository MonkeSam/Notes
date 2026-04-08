É un linguaggio di scripting _interpretato_, originariamente concepito per la programmazione di pagine web _dinamiche_ lato server:
>[!info] PHP
>È un acronimo ricorsivo: **PHP Hypertext Preprocessor**

## Architettura e Sintassi
I _solution stack_ basati su Apache, PHP e MySQL principalmente usati sono:
- **XAMP**
- **LAMP**
- **WAMP**
![[Architettura XAMP.png]]

Il codice PHP va innestato all'interno del codice Html utilizzando i delimitatori `{php} <?php` e `{php} ?>`
```php title:Esempio
<?php //inizio codice php
	echo "Hello world!";
?>
/*commenti multi-linea*/
//commenti su una linea
#commenti in stile bash
```

La sintassi di PHP è di tipo _C-like_, con differenze legate allo scopo specifico del PHP per il web:
- Tipizzazione più debole
- Meno tipi di dati di base
- Vettori di dimensione variabile

```php title:Esempio
<!DOCTYPE html>
<html lang="it">
    <head>
        <title>Esempio</title>
    </head>
    <body>
		<p>
			<?php
				echo "Ciao, sono un micro PHP script!";
			?>
		</p>
	</body>
</html>
```

Questo utilizzo può risultare scomodo perché si può incorrere in ridondanza del codice e se il codice è molto lungo il documento diventa poco leggibile, per questo si possono realizzare file `.php` per poi importare il codice nel file PHP principale utilizzando `{php} require` e `{php} include`
- _require_ produce `Fatal Error`
- _include_ produce `Warning`

>[!warning] N.B.
>Non si può includere il file `.php` in un file `.html` perché non verrebbe iterpretato


## HTTP
### GET
Richiede di processare i dati a una specifica applicazione server.
- Invia dati testuali, aggiungendo alla URL richiesta una query string. I dati, tutti testuali, sono visibili nella URL.
- La query string è separata dalla URL da *?* ed è composta da coppie _nome=valore_ separate tra loro da _&_ (_+_ sostituisce gli spazi)
### POST
Invia i dati da processare una specifica applicazione server.
- Non ha restrizioni su dimensione e tipo di dati che vengono inviati al server. In particolare può inviare anche dati di tipo _multipart/form-data_ incapsulando formati binari
- I dati sono inviati nel body del messaggio HTTP e non sono visibili, quindi è adatto al passaggio di dati riservati, come per esempio una password.

>[!note] Statelessness
>Il server non è tenuto a mantenere informazioni che persistano tra una connessione e la successiva sulla natura, identità e precedenti richieste di un client. Il client è tenuto a ricreare da zero il contesto necessario al server per rispondere.

### Cookie
Sono un _meccanismo di supporto alla gestione delle sessioni_ basato sull'idea che sia il client a mantenere lo stato di precedenti connessioni e che lo comunichi al server se necessario.

>[!Success] Definizione
>Il termine cookie (anche magic cookie) indica un blocco di dati opaco (cioè non interpretabile) lasciato dal server in consegna ad un richiedente per poter ristabilire in seguito il suo diritto alla risorsa richiesta (come il tagliando di una lavanderia).

#### Funzionamento
Alla prima richiesta, il server fornisce la risposta ed un header aggiuntivo, il **cookie**, con dati arbitrari e con specifica di usarlo per ogni richiesta successiva.
Il server associa a questi dati le informazioni sulla transazione e ogni volta che lo user-agent accederà a questo sito, rifornirà i dati opachi del cookie che permettono al server di ri-identificare il richiedente, così si va a creare un profilo specifico.
![[Funzionamento Cookie.png]]
#### Header
I cookies usano _due header_, uno per la risposta, ed uno per le richieste successive:
- **Set-Cookie**: header della risposta, il client può memorizzarlo e rispedirlo alla prossima richiesta
- **Cookie**: header della richiesta. Il client decide se spedirlo sulla base del nome del documento, dell'indirizzo IP del server, e dell'età del cookie
#### Cancellare i cookie
L'utente può cancellare i cookie dal browser per ragioni di:
- _Sicurezza_
- _Privacy_
- _Efficienza_
#### Informazioni
I cookie contengono:
- **Comment**: stringa leggibile di descrizione del cookie
- **Domain**: il dominio per cui il cookie è valido
- **Max-Age**: la durata in secondi del cookie
- **Path**: l'URI per il quale il cookie è valido
- **Secure**: la richiesta che il client contatti il server usando soltanto un meccanismo sicuro per spedirlo
- **Version**: la versione della specifica a cui il cookie aderisce
#### Cookie tecnici e analitici
I cookie **tecnici** sono usati dal gestore del sito per mettere in opera alcune funzioni o rendere più agile la navigazione.
Consentono ad esempio di:
- Autenticarsi per accedere ad aree riservate
- Aggiungere o rimuovere prodotti nel carrello
- Memorizzare alcuni criteri preselezionati come per esempio la lingua

I cookie **analitici** sono usati dal gestore del sito per raccogliere alcune informazioni in forma aggregata sugli utenti.

>[!warning] Consenso
>I cookie tecnici e analitici non richiedono consenso preventivo degli utenti ma vanno citati nell'informativa estesa.

#### Cookie di profilazione
Sono usati dal gestore del sito per raccogliere dati personali sui visitatori, sulla base dei quali il server costruisce un profilo dell'utente/consumatore che poi viene usato anche per proporre prodotti e servizi.
>[!warning] Consenso
>Sono cookie che necessitano del consenso preventivo da parte dell'utente quindi in questo caso occorrerà mettere sul sito sia l'informativa estesa sia quella breve.

## Variabili
Tutte le variabili iniziano con il carattere _$_
```php
$nome
```
È debolmente tipizzato, non va esplicitato il tipo di variabile perché si occupa PHP di convertire al tipo opportuno
```php title:Esempi
$qualcosa = 3;
$qualcosa = true;
$qualcosa = "ciao";
```
### Tipi di dato
- Boolean
- Integer
- Float
- String
- Array
- Object
- NULL
- Resource
#### String
È possibile definire una stringa in 4 modi:
1. **Single quoted**: variabili non vengono espanse e gli unici caratteri con escape ammessi sono `\`  e `'`
```php title:Esempio
   $stringa = 'string';
```
2. **Double quoted**: variabili vengono espanse, ammesse le più comuni sequenze di escape
```php title:Esempio
$stringa = "string";
```
3. **Heredoc**: si comporta come le double quoted ma senza usarle (quindi il carattere " non deve essere preceduto da `\`).
```php title:Esempio
$stringa = <<<ID
```
4. **Newdoc**: si comporta come le single quoted ma senza usarle, quindi `\` e `'` sono sempre trattati letteralmente
```php title:Esempio
$stringa = <<<'ID'
```
#### Array
Gli array vengono definiti con la funzione **array()**
```php title:Esempio
$esempio = array(1,2,3);
```
In PHP ci sono tre tipi di array:
- Indexed
- Associative
- Multidimensional
##### Indexed
Sono gli array "classici" con indice numerico.
```php title:Esempio
$gelati = array("cornetto","ghiacciolo","ricoperto");
//Equivale a
$gelati[0] = "cornetto";
$gelati[1] = "ghiacciolo";
$gelati[2] = "ricoperto";
```
##### Associative
Array che hanno stringhe come indici.
```php title:Esempio
$age = array("Peter"=>"35", "Ben"=>"37", "Joe"=>"43");
//Equivale a
$age['Peter'] = "35";
$age['Ben'] = "37";
$age['Joe'] = "43";
```
##### Multidimensional
Array che contengono uno o più array.
```php title:Esempio
$age = array(1, array(2,3,5,6), “prova”, array(“ciao”,3, True));
```
#### Object Oriented
PHP consente di definire classi e istanziare oggetti.
Supporta i principali meccanismi dell'_OOP_:
- Proprietà e metodi public/private/protected/static
- Ereditarietà
- Classi astratte
- Interfacce
- Tratti

```php title:Esempio
class Persona {
	private $nome;
	public $cognome;
	
	public function __construct($nome, $cognome) {
		$this->nome = $nome;
		$this->cognome = $cognome;
	}
	public function presentati() {
		echo "Sono ".$this->nome." ".$this->cognome;
	} 
}
```
```php title:Esempio
$gino = new Persona ("Gino", "Pino");
$gino->presentati(); //output: Mi chiamo Gino Pino.

echo $gino->nome; //output: Fatal error (perché è private)
echo $gino->cognome //output: Pino
```
#### Resource
Una risorsa non è un vero e proprio tipo, si tratta di una variabile speciale che ==contiene il riferimento ad una risorsa esterna== e sono create e usate da funzioni speciali

>[!note] Output
In PHP ci sono due modi per ottenere un output:
> - **Echo**: può stampare una o più stringhe e non ha valore di ritorno
> - **Print**: può stampare una sola stringa e restituisce sempre $1$
> 
> Solitamente viene usata `{php} echo` in quanto leggermente più veloce.
> Tramite la funzione `{php} var_dump()` è. possibile stampare il tipo e il contenuto di un'espressione per facilitare il debug.
> ```php title:Esempio
> <?php
> $a = array(1, array("a","b","c"));
> var_dump($a);
> ?>
> 
> //output
> array(2) {
> 	[0]=>int(1)
> 	[1]=> array(3) {
> 		[0]=> string(1) "a"
> 		[1]=> string(1) "b"
> 		[2]=> string(1) "c"
> 	}
> }
> ```
> 
### Variabili Superglobali
Le **variabili superglobali** sono variabili accessibili ovunque.
>[!Example] Esempi
>- `{php} $GLOBALS`: memorizza tutte le variabili globali
>- `{php} $_SERVER`: gestisce informazioni sul server
>- `{php} $_GET`: usato per collezionare dati inviati con metodo [[#GET|GET]]
>- `{php} $_POST`: usato per collezionare dati inviati con metodo [[#POST|POST]]
>- `{php} $_COOKIE`: gestisce i cookie
>- `{php} $_REQUEST`: usato per collezionare dati inviati sia con metodo GET che con metodo POST e i cookie
>- `{php} $_SESSION`: gestisce le sessioni

#### Esempio di richieste
Abbiamo le pagine:
- `esempio_get.html` che contiene un form con un campo di testo e il bottone submit. Una volta compilato il form, vogliamo mandare il testo inserito alla pagina.
- `process_get.php` che leggerà i dati e restituirà una pagina HTML contenente l'informazione inserita

```html title:esempio_get.html
<form action="process_get.php" method="get"> 
	<label for="idsupereroe">Supereroe</label> 
	<input type="text" id="idsupereroe" name="supereroe">
	<input type="submit">
</form>
```
```php title:process_get.php
<p>GET: <?php echo $_GET['supereroe'] ?></p> 
<p>POST: <?php echo $_POST['supereroe'] ?></p>
<p>REQ:<?php echo $_REQUEST['supereroe'] ?></p>
```

>[!tip] Funzionamento
>![[Esempio GET.png]]
>L'**output** sarà:
>``` title:output
>GET: batman
>
>POST: Notice: Undefined index: supereroe in path\process_get.php on line 9
>
>REQ: batman
>```

## Gestione dello stato
Sapendo che il protocollo HTTP è _stateless_ (non distingue le iterazioni per ogni specifica attività) abbiamo bisogno di un metodo che ci permetta di salvare gli stati degli accessi al nostro servizio.
Per fare ciò PHP fornisce:
- _Cookie_
- _Session_

### Cookie
Consente di salvare un'informazione sul browser dell'utente tramite la funzione PHP `{php} setcookie()` specificando nome, valore, validità e percorso.

In questo esempio si vuole salvare in un cookie il numero di volte in cui l'utente ha visitato il sito web.

```php title:Esempio
$nome_cookie = "numero_accessi"; 
if(!isset($_COOKIE[$nome_cookie])) {
	//Cookie non settato, lo inizializzo.
	$valore_cookie = 1;
	setcookie($nome_cookie, $valore_cookie, time() + (60 * 60 * 24 * 30), "/");
} else {
	//Cookie già esistente, aumento il numero di accessi.
	$num_visite = $_COOKIE[$nome_cookie]+1;
	setcookie($nome_cookie, $num_visite, time() + (60 * 60 * 24 * 30), "/");
	echo "Il sito è stato visitato: ".$num_visite." volte!";
}
```
>[!note] N.B.
>È possibile cancellare un cookie impostando un tempo di validità "passato"
>```php
>$nome_cookie = "numero_accessi";
>setcookie($nome_cookie, "", time() - 100, "/");
>```

### Session
A differenza dei cookie, _session_ permette di salvare i dati direttamente sul server.
Nel browser dell'utente viene inserito un ID di sessione all'interno di un cookie (_PHPSESSID_)  in modo che alla successiva interazione HTTP, PHP controllerà automaticamente la presenza dell'ID della sessione.
Se l'ID della sessione è presente il server rende accessibili le informazioni salvandole alla variabile super globale `{php} $_SESSION`
>[!Example] Esempio di session
>![[Esempio Session.png]]

#### Salvare una variabile
- Usando direttamente la variabile superglobale `{php} $_SESSION`: `{php title:Esempio} $_SESSION['name'] = "William";`
- Usando la funzione `{php} session_register()`: 
```php title:Esempio
$name = "William";
session_register("name");
```
#### Rimuovere i dati
- Tramite la funzione `{php} unset()` per rimuovere una singola variabile: `{php title:Esempio} unset($_SESSION['name'])`
- Utilizzando la funzione `{php} session_unset()` per rimuovere **tutte** le variabili
- Con la funzione `{php} session_destroy()` per rimuovere tutte le informazioni della sessione (non solo le variabili) ma **non** il cookie **PHPSESSID** 
  >[!warning] Usare _session_destroy_ con cautela
  >

#### Chiusura della sessione
La _session_ termina alla chiusura del browser, il server capisce il termine di essa  tramite il parametro di configurazione `{php} session.gc_maxlifetime` (nel file `php.ini`), nel quale viene determinato il tempo di vita di una sessione.
Scaduto il tempo limite, la sessione viene ritenuta scaduta e ci sarà un garbage collector che si occuperà di liberare la memoria.
Lato browser il cookie PHPSESSID è impostato per scadere alla chiusura.

## MySQL
PHP 5 e successivi permettono di lavorare con **MySQL** usando:
- ~~MySQL API~~ (deprecated)
- MySQLi API (_i_ sta per improved) 
- PDO (PHP Data Object)

### MySQLi
Mette a disposizione API sia  object-oriented che procedurali (Noi usiamo la versione object-oriented)

```php title:"Esempio apertura/chiusura di connessione"
$servername = "localhost"
$username = "username"
$password = "password"
$sql = "CREATE DATABASE dbname"

//object-oriented
$conn =. new mysqli($servername, $username, $password);
$conn->query($sql) === TRUE;

$conn->close();

//procedural
$conn = mysqli_connect($servername, $username, $password);
mysqli_query($conn, $sql);

mysqli_close(conn);

```
#### Eseguire una query
È possibile eseguire una query SQL di qualsiasi tipo utilizzando il metodo `{php} query()`. 
Ovviamente il risultato sarà diverso in base al tipo di query eseguito:
- _Creazione di database o tabelle_ restituiscono TRUE o FALSE
- _SELECT_ restituiscono dati

##### Prepared Statement
Per motivi di sicurezza è preferibile utilizzare i **prepared statement** al posto delle query classiche.
In questo modo la query viene creata con dei placeholder che vengono valorizzati successivamente
```php title:Esempio
$stmt = $conn->prepare("SELECT * FROM table WHERE columnname = ?");
$stmt->bind_param('s', $variabile);
$stmt->execute();
```
Quando si esegue il binding è necessario specificare il tipo di parametro:
- **i**: interi
- **d**: double
- **s**: stringhe
- **b**: BLOB
#### Creazione Tabelle
In uno degli esempi precedenti abbiamo visto come creare il db.
La creazione del db, così come quella delle tabelle, è buona norma **non** gestirle con PHP ma con strumenti più adatti come MySQL Workbench.

