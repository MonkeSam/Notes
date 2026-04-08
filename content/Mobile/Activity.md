È l'unico componente di Android che possiede un'interfaccia utente e rappresenta un _entry point_ per l'applicazione.
>[!note] Android
>Un'activity è implementata come sottoclasse di `{kotlin}Activity`

>[!tip] Dipendenza
>Le activity sono debolmente legate tra di loro e possono interagire l'una con l'altra.

## Mainfest
Si tratta del file `AndroidMaindest.xml` presente in ogni progetto Android e descrive le funzioni essenziali di un'applicazione.
### Dichiarazioni
Cosa deve dichiarare il _manifest_?
- I **componenti** dell'app ([[Android#Activity|Activity]],[[Android#Services|Services]], [[Android#Broadcast receivers|Broadcast Recievers]] e [[Android#Content provider|Content Provider]] )
- Le **autorizzazioni** necessarie all'app per accedere a parti protette del sistema o ad altre app.
- Le **funzionalità** hardware e software richieste dall'app, che influiscono sui dispositivi che possono installare l'app da Google Play
```xml title="Dichiarazione Activity"
<manifest ...>
	<application ...>
		<activity android:name=".MainActivity"/>
		...
	</application>
</mainfest>
```
### Intent filter
Gli _intent filter_ permettono di eseguire un'activity sfruttando richieste sia _explicit_ che _implicit_ e anche essi vanno dichiarati nel manifest.
>[!example] Esempio
>Una richiesta esplicita potrebbe dire al sistema "Avvia l'attività write e-mail nell'app Gmail", mentre una richiesta implicita dice al sistema "Avvia una schermata write e-mail in qualsiasi activity che può svolgere il lavoro".

```xml title="Dichiarazione Intent filter"
<manifest ...>
	<application ...>
		<activity android:name=".MainActivity">
			<intent-filter>
				<action android:name="android.intent.action.SEND" />
				<category android:name="android.intent.category.DEFAULT"/>
				<data android:mimeType="text/plain"/>
			<intent-filter>
		</activity>
	</application>
</mainfest>
```
Impostando
- `{xml}<category>` ad _default_ si consente di ricevere richieste di avvio
- `{xml} <data>` permette di specificare che tipo di dati questa activity può ricevere

>[!example] Esempio di avvio
>```kotlin
>val sendIntent = Intent().apply{
>	action=Intent.ACTION_SEND
>	type="text/plaom"
>	putExtra(Intent.EXTRA_TEXT,textMessage)
>}
>startActivity(sendIntent)
>```

>[!tip] Accesso
>Precedentemente abbiamo dichiarato che la nostra activity può ricevere richieste di invio di dati di tipo testuale, rendendola così _accessibile_. Se non vogliamo renderla disponibile ad altre applicazioni basta non inserire alcun tipo di _intent-filter_.
>>[!tip] Settando `{xml} android:exported="false"` solo la tua app potrà avviare l'activity

### Permission
Se voglio che la mia applicazione possa utilizzare l'activity di un'altra app, devo impostare il campo _permission_ nel seguente modo.
- Nell'app che voglio utilizzare ci deve essere il permesso per la determinata activity che desidero
  ![[permission.png]]
- Nella mia app deve essere presente l'utilizzo della permission
  ![[use_permission.png]]
## Ciclo di vita
La classe activity fornisce una serie di _callback_ che consentono all'attività di sapere che il suo stato è cambiato, cioè se il sistema sta ==creando, arrestando o riprendendo== un'activity oppure se sta distruggendo il processo in cui essa risiede.
![[lifecycle.png|500]]
### onCreate()
L'activity viene creata, vengono assegnate le configurazioni di base e viene definito il layout dell'interfaccia.
```kotlin title="Esempio di creazione di una Activity"
class MainActivity : ComponentActivity(){
	override fun onCreate(savedInstanceState:Bundle?){
		super.onCreate(savedInstanceState)
		setContent{
			Text("Hello, World!")
		}
	}
}
```
__savedInstanceState__ è un oggetto di tipo _Bundle_ che contiene lo stato precedente dell'ultima esecuzione dell'activity.
### onStart()
A questo punto l'activity diventa visibile e quindi è possibile attivare le funzionalità e servizi che devono offrire informazioni all'utente
### onResume()
Viene chiamata poco prima che l'attività inizi a gestire le interazioni con l'utente
### Running
L’attività rimane in stato di _running_ finché non succede qualcosa che distoglie il focus dall'app (chiamata, blocco dello schermo, ecc.) e che chiama _onPause()_.
### onPause()
Quando questa callback è chiamata in teoria l'activity è ancora =={blue}parzialmente visibile==, successivamente viene chiamato [[#onResume()]] se l'utente accede ancora all'attività, se no viene lanciata _onStop()_.
### onStop()
L’attività non è più visibile all'utente ed è seguita da _onDestroy()_ o _onRestart()_
### onDestroy()
Il sistema richiama questa callback prima che un'attività venga distrutta a causa dell'abbandono dell'applicazione da parte dell'utente, oppure se l'interfaccia utente va ricreata da zero (rotazione dello schermo, cambio tema)

