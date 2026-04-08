Un **ISP** è un'organizzazione che si occupa principalmente della distribuzione dell'accesso ad Internet ma possono anche offrire servizi come:
- _Web hosting_
- Registrazione di _domini_
- Concessioni di rack per server
>[!info] Punto di vista giuridico
>Dal punto di vista giuridico un ISP può essere:
>- Privato con finalità di lucro
>- Privato senza finalità di lucro
>- In forma cooperativa
>- ...

Tipicamente un ISP si registra come [[Router#Autonomous System|Autonomous System]], essi non sono necessariamente vincolate ad aree geografiche e/o confini nazionali.
Una [[Definizioni#Internet region|Internet Region]] è solitamente servita da più ISP e uno stesso ISP può servire più regioni.
## Classificazione
### Tier 1
Un soggetto che possiede un'infrastruttura che copre un'intera [[Definizioni#Internet region|Internet region]] senza dover accedere a servizi a pagamento di altri
- **Nazionale**: Copre una sola Internet region
- **Globale**: Copre più Internet region
### Tier 2
È un ISP che raggiunge l'Internet globale acquistando servizi di interconnessione da uno o più ISP di Tier 1 (anche della stessa regione)
### Tier 3
Un ISP che serve un'area delimitata che per raggiungere l'Internet globale deve acquistare servizi di interconnessione da un ISP di Tier 2.
Può avere interconnessioni dirette (**peering**) con altri ISP Tier 3 che servono la stessa zona o zone limitrofe

![[Pasted image 20251119100847.png]]
>[!info] In Italia
>Il principale ISP Tier 1 è _Telecom Italia Sparkle_

#### Peering
È una interconnessione fra due [[Router#Autonomous System|Autonomous System]] con il fine di scambiarsi traffico e avviene tipicamente tra ISP dello stesso livello.
Questa relazione tra ISP non ha carattere economico.
##### Peering Policy
- **Ristretta**: Devi chiedere di fare peering e la richiesta va approvata
- **Aperta**: Approvata di default
![[Pasted image 20251119102442.png]]
### POP (Point of Presence)
È un'infrastruttura con router e switch che un ISP locale realizza per fornire un servizio a gruppi di utenti co-localizzati (singola città, area industriale, ecc.). 
Il collegamento avviene tramite:
- ADSL
- FTTH
- Collegamenti radio
- FTTC
>[!Example] Esempio di POP
>![[Pasted image 20251119102854.png]]
## Struttura
### Indirizzamento
Un ISP dispone di un sottoinsieme di numero IP da utilizzare per i suoi clienti che hanno [[I protocolli Internet#^bfcb5b|Network ID]]:
- **Unico** se gli IP sono consecutivi
- **Multipli** se gli IP da gestire non sono consecutivi
In base alla dimensione (numero di utenti e distanze geografiche) la rete dell’ISP può essere composta da una o più LAN
### Interconnessione
Connettere due ISP che coprono la stessa zona geografica per scambiarsi traffico:
- **Interconnessione di tutti i POP**
	- Numerosi Collegamenti
	- Complessità di gestione del routing
	- Percorsi di lunghezza minima
- **Interconnessione di uno o pochi POP**
	- Pochi collegamenti
	- Routing semplificato
	- Percorsi potenzialmente più lunghi


>[!Example] Peering diretto tramite due POP
>![[Pasted image 20251119105846.png]]

### Internet Exchange Point (IXP)
Per ottenere connessioni di ISP dal [[Internet Service Provider (ISP)#Tier 3|terzo livello]] al [[Internet Service Provider (ISP)#Tier 1|primo]] bisogna connettere ogni Autonomous System con tutti gli altri.
Alcuni ISP hanno la funzione di Autonomous System di transito creare una grande rete "a stella" tra ISP, essi sono chiamati **Network Service Provider** (**NSP**) e talvolta coincidono con ISP di primo livello.
Per favorire l'interconnessione tra **NSP** e ISP esistono gli **Internet Exchange Point**:
Permette di la connessione diretta tra Autonomous System senza utilizzare reti di terze parti garantendo:
- disponibilità elevata
- sicurezza fisica
- banda garantita
- ...
>[!info] IXP in Italia
>- **MIX** (Milan Internet eXchange)
>	- Milano, Palermo, Catania
>- **NaMeX** (Nautilus Mediterranean eXchange Point)
>	- Roma
>- **TOP-IX** (Torino Piemonte Internet Exchange)
>	- Torino
>- **Tuscany Internet eXchange**
>	- Firenze
>- **PCIX**
>	- Piacenza
