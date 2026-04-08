Essendo i dispositivi mobile _resource-constrained_, nonostante con il passare degli anni diventino sempre più potenti, è il sistema operativo ad arbitrare la gestione delle risorse.
È quindi essenziale che l'architettura di un'applicazione definisca i confini tra utente e sistema operativo e le responsabilità appartenenti ad esse.

L'architettura delle applicazioni segue i seguenti principi:
- _Separation of concerns_
- _Drive UI from data models_
- _Single source of truth_
- _Unidirectional Data Flow_

## Principi

### Separation of concerns
Bisogna far si che una [[Activity]] sia fortemente slegata dalla logica. Essa si deve occupare esclusivamente alle interazioni con l'utente tramite la UI.
### Drive UI from data models
I modelli di dati sono indipendenti dall'interfaccia, ciò significa che non sono legati al ciclo di vita dell'interfaccia utente e dei componenti dell'applicazione, ma saranno comunque distrutti quando il sistema operativo deciderà di rimuovere il processo dell'applicazione dalla memoria.
_Modelli persistenti_ sono i modelli di dati che esistono anche se il sistema operativo decide di terminare dei processi o se l'applicazione non è in funzione.
### Single source of truth
Il **SSOT** è il proprietario dei dati e solo lui può modificarli.
I vantaggi sono:
- Centralizzare tutte le modifiche a un particolare tipo di dati in un unico luogo
- Proteggere i dati in modo che altri tipi non possano manometterli
- Rende le modifiche ai dati più tracciabili, in modo da rendere più facile individuare dei bug.

>[!example] Esempio
>In un'app  offline-first, la SSOT è tipicamente un database. In altri casi, può essere
>un ==ViewModel== o addirittura l’UI.

### Unidirectional Data Flow
Lo stato dell'app dipende dagli eventi lanciati dalla UI.
La UI verrà poi modificata in base ai cambiamenti di stato dell'applicazione.
![[Unidirectional_Data_Flow.png|300]]
>[!example] Esempio
>I dati dell'applicazione di solito fluiscono dalle fonti di dati
>all'interfaccia utente. Gli eventi dell'utente, come la pressione di un pulsante,
>passano dall'interfaccia utente all'SSOT, dove i dati dell'applicazione vengono
>modificati ed esposti in un tipo immutabile.

## Architettura
Per i principi appena elencati, ogni applicazione deve avere almeno due livelli:
- **Layer UI** nel quale viene data la visualizzazione a schermo dei dati.
- **Layer dati** il quale si occupa della logica dell'app e di come esporre i dati.
- _Domain Layer (Opzionale)_ è un livello che si interpone tra i precedenti che aiuta il passaggio dei dati tra i layer, rendendo ulteriormente slegati interfaccia e logica.

![[AppLayers.png|400]]
### UI Layer
È suddiviso in:
- **UI elements**: sono gli elementi che compongono la visualizzazione dei dati su schermo. Si costruiscono tramite **~={red}Jetpack Compose=~** (fino a qualche tempo fa si utilizzavano le funzioni Views).
- **State holders**: contengono i dati, li espongono all'interfaccia utente e gestiscono la logica.

![[UI_Layer.png|300]]

