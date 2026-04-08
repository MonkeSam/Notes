>[!info] Definizione
>È un sistema operativo per dispositivi mobile.

## Storia
Nel 2003 4 sviluppatori videro l'esigenza del mercato di un sistema operativo adatto ai dispositivi mobili.
Nel 2005 _Google_ si accorge del progetto di questi sviluppatori e acquisisce per 50 milioni di dollari **Android** che era stato costruito su ==kernel linux==, ciò era vantaggioso per Google perché era un sistema già conosciuto e sicuro. 
### Versioning
Inizialmente le versioni venivano identificate con nomi di dolci in ordine alfabetico, fino a che non si accorsero non essere il migliore dei modi per classificare le versioni del software e quindi iniziarono a utilizzare i numeri da Android 10.
![Android Versions List: A Complete Journey From Android 1.0 to 12 (Contd.)](https://www.hestabit.com/blog/wp-content/uploads/2021/12/Android-Versions-1024x536.jpg)

>[!note] Release
>Ogni anno esce una versione nuova di Android intorno ad Agosto/Settembre

- **Android 10**
	- Ha portato un po' di "aria fresca", non solo in termini di nomenclatura, ma anche dal lato accessibilità (inferiore rispetto al competitor _Apple_), privacy, sicurezza e identità visiva.
- **Android 12**
	- Nuova identità visiva, esce _Material 3_. Si aggiunge ancora della privacy in più, in particolare riguardo la localizzazione e gli accessi a microfono e telecamera. 
- **Android 13**
	- Niente di interessante, solo qualche aggiunta a livello privacy.
- **Android 14**
	- Piccole aggiunte di accessibilità e nuove feature minori.
- **Android 16 (Oggi)**
	- Oltre ai soliti miglioramenti, esce _Material 3 Expressive_ che è una versione di mezzo dopo M3.
## Architettura
Ogni app Android vive nella propria _Sandbox_ di sicurezza, protetta dalle seguenti funzionalità di sicurezza Android:
- Android è un sistema Linux multiutente: ==ogni app è un utente diverso==
- A ogni app è assegnato un *ID utente Linux univoco* 
- Ogni processo ha la propria macchina virtuale, quindi il codice viene eseguito separatamente da altre app.
- **Privilegio minimo:** ogni app ha accesso solo ai componenti necessari per svolgere il proprio lavoro e non di più. Questo crea un ambiente molto sicuro in cui un'app non può accedere a parti del sistema per le quali non è autorizzata. Può farlo solo su richiesta.
![[Architettura.png|500]]
### Linux Kernel
#### Vantaggi
- Portabilità (facile da compilare su diverse architetture)
- **Sicurezza**
	- Ogni applicazione è un processo a sé rendendo le risorse protette da altri processi.
- Power Management
- Android Runtime (ART) si basa sul kernel per thread e gestione della memoria
- Produttori costruiti su un kernel affidabile
### Hardware Abstraction Layer (HAL)
Fornisce interfacce standard che espongono la capacità hardware del dispositivo al framework API Java di livello superiore in modo da poter utilizzare sensori i vari (giroscopio, microfono, termometro, ecc.)
Il **vantaggio** principale è che ci permette di rimanere staccati dall'hardware, accedendoci tramite chiamate API.
### Android Runtime (ART)
Ogni applicazione è eseguita nel proprio processo con la propria istanza di _Android Runtime_ _(ART)_.
In sostanza si effettua una virtualizzazione di ogni applicazione per gestire meglio le risorse da parte del sistema operativo.
### Native C/C++ Libraries
Le librerie Android sono costruite tramite C/C++ per essere il più efficienti e leggere possibile, dato che vanno a lavorare con componenti di basso livello come [[Android#Hardware Abstraction Layer (HAL)|HAL]] e [[Android#Android Runtime (ART)|ART]].
### Java API Framework
Sono le funzionalità che andremo a utilizzare perché ci permettono di costruire la nostra applicazione e gestire tutto ciò che il dispositivo ci fornisce.
### System Apps
Le applicazioni di sistema sono in realtà utilissime perché oltre a fornire funzionalità agli utenti possono dare servizi anche agli sviluppatori.
>[!example] Esempio
>Se la tua app desidera recapitare un messaggio SMS, non è necessario creare tale funzionalità da solo: puoi invece invocare qualunque app SMS che sia già installata per inviare un messaggio al destinatario specificato.

## Sviluppo
Le app Android possono essere scritte sia in _Kotlin_ che in Java, noi utilizzeremo Kotlin.
Il vantaggio è che i due linguaggi sono pienamente compatibili e quindi i possessori di vecchie applicazioni in Java non si sono ritrovati a dover riscrivere tutto il codice in Kotlin ma semplicemente modificando/aggiungendo il necessario con Kotlin.
L'ambiente di sviluppo è _Android Studio_ che tramite gli strumenti Android SDK compila il codice insieme alle varie dipendenze restituendo un file _.apk_ che utilizzeremo per installare la nostra applicazione.
### App components
Sono i componenti che permettono di creare un'app in Android, ognuno di essi è un _entry point_ attraverso il quale il sistema o un utente possono accedere all'app:
- __Activities__
- __Servicies__
- __Broadcast receivers__
- __Content providers__
#### Activity
>[!note] Definizione
> Rappresenta una singola schermata con un'interfaccia utente

È l'entry point per l'interazione con l'utente e serve per:
- Tenere traccia di ciò che l'utente ha sullo schermo
- Sapere che i processi utilizzati in precedenza contengono elementi a cui l'utente può tornare, gestendo così le _attività interrotte_
- Fornire un modo per le app di implementare i flussi utente tra loro e per il sistema di coordinare questi flussi (come il classico "share").

#### Services
>[!note] Definizione
>È un entry point generico per mantenere un'app in esecuzione in background.

Un service si differenzia da un [[#Activity|Activity]] perché è un processo privo di interfaccia, cioè che l'utente non può vedere.
Esistono tre tipi di _services_:
- _Foreground:_ l'utente si accorge del termine di un processo (es. la musica).
- _Background:_ l'utente non si accorge del termine di un processo (es. conta passi).
- _Bound services:_ vengono eseguiti perché un'altra app (o il sistema) ha affermato che desidera usufruire del servizio, chiamando `{kotlin} bindService()`. Quindi si vanno a connettere due processi.
#### Broadcast receivers
>[!note] Definizione
È un componente che consente al sistema di inviare eventi all'app al di fuori di un normale flusso utente, consentendo all'app di rispondere agli annunci di trasmissione a livello di sistema.

Permette di inviare messaggi in broadcast ed è tipicamente utilizzato dal sistema operativo.
>[!Example] Ad esempio quando la batteria è scarica

#### Content provider
È un database che si trova a livello di sistema, quindi gestisce un set condiviso di dati dell'app che è possibile archiviare sul file system.
![[ContentProvider.png]]

### Intent
Un `{Kotlin} Intent` è un oggetto di messaggistica che puoi utilizzare per richiedere un'azione da un altro componente dell'app. Si usa per:
- [[#Activity]]
- [[#Services]]
- [[#Broadcast receivers]]

>[!abstract] Intent
>È una sorta di router per passare da un componente all'altro (es. da una schermata all'altra) [credo]

#### Tipi di Intent
Esistono due tipi di Intent:
- **Espliciti:** specificano quale componente di quale applicazione soddisferà l'intent
- **Impliciti:** non specificano un componente specifico, ma dichiarano un'azione generale da eseguire, il che consente a un componente di un'altra app di gestirla.
	- Ad esempio, se vuoi mostrare all'utente una posizione su una mappa, puoi utilizzare un intent implicito per richiedere a un'altra app in grado di farlo di mostrare una posizione specifica su una mappa.
##### Content Resolver
Il `{kotlin} ContentResolver` è l'oggetto che si interfaccia con un [[#Content provider]] come client per poter eseguire operazioni sui dati.