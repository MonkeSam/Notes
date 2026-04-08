I protocolli utilizzati per il funzionamento di Internet fanno parte dei seguenti livelli dello stack **ISO-OSI**:
## Data Link
Si occupa della connettività locale, tramite protocollo **Ethernet** si interfaccia con i vari dispositivi localmente "vicini" e coinvolge lo strato **IP** solo se necessario.
![[Screenshot 2025-11-10 alle 10.18.44.png]]

## Networking
Si occupa della connettività globale, tramite il protocollo **IP**.
![[Screenshot 2025-11-10 alle 10.38.40.png]]
## Transport
Garantisce il dialogo end-to-end tra applicazioni.
![[Pasted image 20251110104047.png]]

# Protocollo IP
È un protocollo [[Definizioni#Protocollo Connectionless|connectionless]] che trasmette i pacchetti, chiamati **datagrammi**, da sorgente a destinatario identificando host e [[Router|router]] tramite indirizzi di lunghezza fissa.
> [!abstract] Offre un servizio di tipo **Best effort**
> Non sono previsti meccanismi per:
> - Aumentare l’affidabilità del collegamento end-to-end
> - Eseguire il controllo di flusso e della sequenza
## Struttura
È una sequenza di 4 numeri decimali con valori da 0 a 255 (8 bit) separati da punto,
per un totale di **32 bit**.
>[!info] IANA
>La **I**nternet **A**ssigned **N**umbers **A**uthority si occupa di assegnare gli indirizzi IP. 


![What is an IP Address? - GeeksforGeeks](https://media.geeksforgeeks.org/wp-content/uploads/20241217170153436945/IPv4-address-format.webp)
### Formato del pacchetto
![[Pasted image 20251110113527.png]]
#### Significato delle [[Definizioni#PDU (Protocol Data Unit)| PCI]]

- **Version:** Indica il formato dell'intestazione, attualmente la versione in uso è _IPv4_
- **IHL (IP Header Length):** Lunghezza dell'intestazione espressa in parole di 32 bit (lunghezza minima 5)
- **Type of Service:** Indica il tipo di servizio richiesto ed è usato anche come sorta di priorità ^241f45
- **Total Length:** Lunghezza totale del datagram misurata in bytes (max 65535 bytes) ^6b0fc6
- **Identification:** Identificatore del datagram, serve ai frammenti per identificare il datagram a cui appartengono
- **Flag:** ^13cacd
	- _bit 0:_ Sempre a zero
	- _bit 1:_ Don't fragment (DF) ^3dd543
		- DF=0 si può frammentare
		- DF=1 non si può frammentare
	- _bit 2:_ More fragments (MF) ^9c2edb
		- MF=0 ultimo frammento
		- MF=1 frammento intermedio
- **Fragment offset:** Indica qual è la posizione di questo frammento nel datagramma, come distanza in unità di 64 bit dall'inizio ^b520df
- **TTL (Time to live):** È il massimo numero di nodi attraversabile, tipicamente pari a 64 (tal volta a 255). Ad ogni salto ([[I protocolli Internet#^8c8cfc|hop]]) viene diminuito di uno e il nodo che riceve TTL=0 distrugge il datagram ^c5ab81
- **Protocol:** Indica a quale protocollo di livello superiore appartengono i dati del datagramma. ^48cbcc
- **Header checksum:** Controllo dell'errore nel header, viene ricalcolato ad ogni nodo.
- **Source and Destination Address**
- **Options:** Contiene informazioni aggiuntive relative al trasferimento del datagram (percorso, meccanismi di sicurezza, ecc.). È di lunghezza variabile.
- **Padding:** Bit privi di significato aggiunti per fare in modo che l’intestazione sia multipla di 32 bit
##### Fragment offset

^4cbf21

Il datagram IP viene suddiviso virtualmente in _blocchi da 8 byte_.
Per chi trasmette (vale anche per i nodi intermedi) il primo blocco è il numero 0, i blocchi successivi sono numerati sequenzialmente.
![[Pasted image 20251110134525.png]]

### Frammentazione
La **Maximum Transfer Unit (MTU)** è la dimensione massima del frame di livello 2 (Data Link), tipicamente misurata in byte.
La frammentazione di un datagram può essere eseguita da un qualunque nodo di rete dotato di protocollo IP, mentre solo il terminale ricevente può riassemblare i frammenti.
#### Frammentazione multipla
In alcuni casi il datagramma può essere duplicato dalla rete, di conseguenza vari nodi possono frammentare in modo differente lo stesso pacchetto, facendo così ci sono dei frammenti che sono parzialmente sovrapposti.
Grazie all'[[I protocolli Internet#^b520df|offset]] è possibile ricostruire il datagram iniziale.

>[!Example] Esempio di calcolo dell'offset
>![[Pasted image 20251110143742.png]]
> >Il datagram viene inizialmente diviso in due pacchetti da 5 blocchi, poi il pacchetto con offset=0 viene ulteriormente frammentato in 3 pacchetti (2 da 16 byte e uno da 8 byte)
### Riassemblamento
In generale per ricomporre il datagram si utilizza l'[[I protocolli Internet#^b520df|offset]]: si ordinano tutti i segmenti intermedi e quando si arriva all'ultimo segmento ([[I protocolli Internet#^9c2edb|MF]]=0) si controlla di avere la sequenza di offset completa.
#### RFC 791
Prima di tutto vengono passati all'algoritmo dello standard RFC791 i parametri identificativi del datagramma (source, destination, protocol, identification).
 Se il [[I protocolli Internet#Fragment offset|Fragment Offset]]=0  e [[I protocolli Internet#^9c2edb|More Fragment]]=0 allora tutto il datagram è stato ricostruito e può essere consegnato.
 Altrimenti, viene allocata la memoria pari al [[I protocolli Internet#^6b0fc6|TDL]], viene fissato un timeout e il frammento viene memorizzato al punto giusto della sequenza.
 **In sintesi:** L'algoritmo mira a contare il numero di byte ricevuti e controllare che questo numero sia uguale alla dimensione originale del datagram.
#### RFC 815
L'algoritmo utilizza il concetto di _buco (hole)_: in sostanza si ha una lista di "buchi" che vanno riempiti con i frammenti che vengono ricevuti. Per ogni elemento della lista si hanno dei _hole descriptor_ con cui viene tenuta traccia dell'inizio (_hole.first_) e della fine (_hole.last_) di ogni buco.
Ogni frammento quando viene inserito in un buco può portare alla creazione di nuovi buchi che vanno poi aggiunti alla lista. Per esempio se fragment.first (inizio del frammento) è maggiore di hole.first ci sarà un nuovo buco che avrà come inizio hole.first e come fine fragment.first-1.
Confrontando ogni volta l'inizio e la fine dei frammenti con i buchi della lista, eliminandoli una volta riempiti, si otterrà una lista vuota di hole, ciò vuol dire che il datagramma è stato ricostruito e si può passare il pacchetto al livello superiore.

# Instradamento IP
La rete Internet è una grande [[Definizioni#Rete a commutazione di pacchetto|rete a commutazione di pacchetto]] formata alla base dalle **network IP**.
## Network IP
Sono dei sottoinsiemi di Internet contenenti dei nodi terminali chiamati **host**, sono connessi tra di loro tramite calcolatori specializzati chiamati **router** o **gateway**.
Ogni network IP può implementare una tecnologia specifica (Wi-Fi, ADSL, Ethernet, LTE).
All'interno di una network IP i calcolatori sono connessi dalla medesima infrastruttura di rete fisica (livello 1 e 2 ISO-OSI)
### Rete Logica
È la network IP a cui un host appartiene logicamente, cioè tutti i dispositivi che un host riesce a raggiungere.
### Rete fisica
È la rete (tipicamente LAN) a cui un host è fisicamente connesso. Ha capacità di instradamento all'interno di essa e può utilizzare indirizzi locali come gli indirizzi _MAC_.

## Instradamento
Ogni nodo di Internet ha un database di destinazioni possibili a cui inoltrare i pacchetti. 
In base al IP di destinazione e alle informazioni nel database il nodo decide a chi inviare il pacchetto inoltrandolo direttamente al destinatario oppure ad un router o gateway che conosce il percorso per raggiungere l'indirizzo IP di destinazione.
> [!info] Hop
> Il raggiungimento di un destinatario implica uno o più "salti" tra gateway o router, un salto è solitamente chiamato **hop**
> 

^678cfd

### Direct delivery
L'instradamento diretto avviene quando IP sorgente e destinatario si trovano sulla stessa rete e quindi il datagramma non passa da nodi intermedi.
### Indirect delivery
IP sorgente e destinatario non si trovano sulla stessa rete, quindi il datagramma passa ad un router intermedio.

### Routing
È la scelta del percorso che il datagramma deve effettuare per arrivare al destinatario attraversando una sequenza di router.
^8c8cfc
## Semantica dell'indirizzo IP
L'indirizzo IP è logicamente suddiviso in due parti:
- **Network ID:** È il prefisso che identifica la [[I protocolli Internet#Network IP|Network IP]] a cui appartiene un indirizzo. ^bfcb5b
- **Host ID:** È il suffisso dell'IP che identifica un host all'interno di una network IP. ^2ae446

### Netmask
È una **maschera** di 32 bit che viene associata all'indirizzo IP per suddividerlo in [[I protocolli Internet#^bfcb5b|NetID]] e [[I protocolli Internet#^2ae446|Host-ID]] 
>[!Example] Esempio 1
>![[netmask.png]]
>I bit a 1 della netmask identificano la parte del [[I protocolli Internet#^bfcb5b|NetID]]

>[!Example] Esempio 2
>Prendiamo
>- L'indirizzo IP **137.204.191.25** = $10001001.11001100.10111111.00011011$
>- La netmask **255.255.255.192** (a 26 bit) = $11111111.11111111.11111111.11000000$
>Essendo una netmask da 26 bit l'indirizzo è diviso in:
>- **NetID** = $10001001.11001100.10111111.00$
>- **HostID** = $011011$
>Facendo un and bit a bit tra IP e netmask otteniamo: **137.204.191.0/26**

#### Broadcast
Per comunicare contemporaneamente a tutti i calcolatori all'interno della propria rete si utilizza un indirizzo apposito chiamato **indirizzo di broadcast**.
Per la rete dell'esempio precedente l'indirizzo di broadcast sarebbe `137.204.191.63`
perché l'hostID è composto da soli 1 (l'ultimo byte è `00111111`).

## ARP (Address Resolution Protocol)
Il protocollo **ARP** fa parte del terzo livello dello stack ISO-OSI (Network), è utilizzato dai software di basso livello per associare gli indirizzi _MAC_ di una rete LAN agli indirizzi IP.
### Funzionamento
>[!Bug] Comando
>```bash 
>arp -a
>```
#### ARP request
La sorgente manda un messaggio in [[I protocolli Internet#Broadcast|broadcast]] contenente l'indirizzo IP del nodo destinazione.
#### ARP reply
Il proprietario dell'IP risponde al messaggio inviando il proprio indirizzo fisico (MAC).
#### Cache ARP
L'host sorgente associa l'indirizzo IP all'indirizzo MAC ricevuto dal destinatario e lo salva insieme alle altre associazioni in una tabella (**cache  ARP**)

## Route
Il percorso da seguire per raggiungere il destinatario del datagramma è chiamato **route** e viene scelto dai router/gateway consultando la propria **tabella di instradamento**.
### Tabella di Instradamento
I campi (attributi) della tabella sono:
- **Destinazione (D):** Indirizzo IP di destinazione. ^a6aed3
- **Netmask (N):** Maschera di rete. ^0e9515
- **Gateway (G):** Indirizzo IP del gateway a cui consegnare il datagramma, in modo che possa essere instradato al di fuori della propria [[I protocolli Internet#Network IP|Network IP]]. ^7b51b8
- **Interfaccia di rete (IF):** Interfaccia di rete (hardware) utilizzata per consegnare il datagramma (_loopback_ compreso). ^127c00
- **Metrica (M):** Specifica il "costo" di una particolare route.

>[!Example] Esempio di una Tabella di Routing
>![[Pasted image 20251112092828.png]]
#### Table lookup
È il processo di confronto da parte di un nodo dei dati della propria tabella di routing con l'indirizzo di destinazione estratto dall'intestazione del datagram:
Se il percorso
- **Esiste** esegue l'azione di instradamento suggerita dai campi [[I protocolli Internet#^7b51b8|Gateway]] e [[I protocolli Internet#^127c00|Interface]]
- **Non esiste** genera un messaggio di errore notificato all'indirizzo sorgente (_ICMP - Destination Unreachable_)
##### Funzionamento
La ricerca nella tabella avviene confrontando:
- **IP di destinazione** del datagramma
- **D** di ciascuna route
Mettendo in _AND_ l'indirizzo di destinazione e ogni [[I protocolli Internet#^0e9515|netmask]] (partendo dalla netmask più grande) e si controlla che il risultato sia presente tra le [[I protocolli Internet#^a6aed3|destinazioni]] della tabella 

>[!Example] Esempio di lookup
>![[Pasted image 20251112095324.png]]

### Gateway
Il gateway è il nodo che ha il compito di consegnare i datagram perché si "affaccia" su più reti ed è in possesso della [[I protocolli Internet#Tabella di Instradamento|Tabella di routing]] tramite la quale può conoscere i percorsi per raggiungere i destinatari dei datagram.
>[!Tip] Uso
>Nella tabella di routing il campo _gateway_ indica anche il tipo di instradamento di ogni route:
>- **Instradamento diretto**
>	- Windows: Gateway = IP locale
>	- Linux/Unix: Gateway = `0.0.0.0`
>- **Instradamento indiretto**
>	- Gateway = IP del router da contattare

>[!faq] Aggregazione ed eccezioni slide 94
># ??????


# La logica degli indirizzi IP
## Classe delle reti
Nella fase iniziale di Internet furono definite diverse "classi" di network differenziate per dimensione.
Il [[I protocolli Internet#^bfcb5b|Net-ID]] è definito dai primi bit dell'indirizzo in modo che i router potessero riconoscerlo subito.
![[Pasted image 20251112112104.png]]


### Organizzazione degli indirizzi


![[Pasted image 20251112112304.png]] ^df8fbe

Alcuni indirizzi sono **riservati** per scopi specifici:
- `0.0.0.0` Indica l'host corrente senza specificarne l'indirizzo
- `255.255.255.255` è l'indirizzo di broadcast su Internet
- _Host-ID_ tutto a 1 è l'indirizzo di **broadcast** relativo alla rete
- `127.x.y.z`  è l'indirizzo di **loopback** che inoltra i datagram agli strati superiori dell'host corrente
## Sottoreti
Capita spesso, soprattutto in aziende e ambienti con molti dispositivi, che si voglia suddividere una rete in più _sub-network_.
Ciò viene fatto frammentando l'Host-ID in due parti:
- La **subnet-ID** che identifica la sottorete ^8ba8f5
- La restante parte identifica i singoli host all'interno della sottorete
### Subnetting
Si possono costruire sottoreti personalizzando la netmask in **subnetmask**
>[!Example] Università di Bologna
>Possiede una rete di [[I protocolli Internet#^df8fbe|classe B]] (`137.204.0.0`) e divide la rete in sottoreti per differenziare facoltà, dipartimenti, centri di ricerca, ecc.
>Il primo byte dell'Host-ID è utilizzato come [[I protocolli Internet#^8ba8f5|subnet-ID]], quindi dalla classe B si ricavano 254 reti di classe C.
>Quindi **subnetmask** = `255.255.255.0`
>

>[!todo] Comunicazione
>Logicamente le subnet sono reti indipendenti e quindi non possono comunicare tra di loro, ciò vuol dire che è necessario fare uso dei **gateway** se si vuole inviare un datagram da una subnet all'altra.


## CIDR (Classless InterDomain Routing)
Con l'introduzione del **CIDR** l'instradamento diventa più flessibile e scalabile grazie al fatto di
- Avere Net-ID di qualsiasi dimensione 
- Comprendere le Netmask nelle tabelle di routing
- Avere la possibilità di generalizzazione del  subnetting/supernetting potendo definire le reti IP da Net-ID/Netmask
### Supernetting
Il **supernetting** è una tecnica utilizzata per raggruppare più subnet aggiungendo bit alla parte del Host-ID, in questo modo nelle tabelle di routing non si hanno $n$ righe per $n$ subnet.
# Pianificare la numerazione di reti IP
## Esempio 1
Su una grande area urbana si vogliono connettere 3 siti dotati di una rete LAN ciascuno. Gli host sono divisi in:
- **S1,S2:** 50 host
- **S3:** 20 host
Si richiede di progettare una rete di classe C a cui viene assegnato l'indirizzo `196.200.96.0/24` comprensiva della numerazione dei router, definendo le relative netmask.
>[!Example] Architettura dell'infrastruttura
>![[Pasted image 20251114151802.png]]

>[!Success] Soluzione 1
>Possiamo scegliere più soluzioni per dividere gli indirizzi:
>![[Pasted image 20251114152041.png]]
>Dovendo ottenere 4 reti scegliamo la 3° soluzione ottenendo così:
>- **Subnet:** (Indirizzi che identificano la rete)
>	- _S1:_ `196.200.96.0/26`
>	- _S2:_ `196.200.96.64/26`
>	- _S3:_ `196.200.96.128/26`
>	- _M:_ `196.200.96.192/26`
>- **Netmask:** `255.255.255.192 (26 bit)` 
>- **Broadcast:**
>	- _S1:_ `196.200.96.63`
>	- _S2:_ `196.200.96.127`
>	- _S3:_ `196.200.96.191`
>	- _M:_ `196.200.96.255`
>- **Router IP:**
>	- _S1:_ `196.200.96.62`
>	- _S2:_ `196.200.96.126`
>	- _S3:_ `196.200.96.190`
>	- _M:_ Qualunque indirizzo tra `196.200.96.193` e `.254`
>- **IP Host:**
>	- _S1:_ da `196.200.96.1` a `.61`
>	- _S2:_ da `196.200.96.65` a `.125`
>	- _S3:_ da `196.200.96.129` a `.189`
>>[!Caution] Gli indirizzi disponibili sono di meno!
>>Possiamo notare che in S1 gli indirizzi vanno da `.1` a `.61` perché gli indirizzi dobbiamo considerare che dal `.62` al `.64` sono occupati per _router_, _broadcast_ e _identificazione della rete_

 >[!Success] Soluzione 2
 >Scegliendo netmask diverse
 >![[Pasted image 20251114154047.png]]
 >Ottengo
 >![[Pasted image 20251114154119.png]]
# ICMP (Internet Control Message Protocol)
>[!info] Architettura
>È un protocollo di terzo livello (Network)
>![[Pasted image 20251114155335.png|600]]
>---
>Il protocollo ICMP è incapsulato in datagrammi IP, per cui è anche utente IP
>![[Pasted image 20251114162714.png]]



Essendo il protocollo IP un servizio di tipo _best effort_ (non garantisce la corretta consegna dei datagram) interviene il protocollo **ICMP** segnalando errori e malfunzionamenti ma senza eseguire correzioni.
>[!Caution] Attenzione!
>ICMP non rende affidabile il protocollo IP
## Pacchetto ICMP
![[Pasted image 20251114162902.png]]
- **Type:** definisce il tipo di messaggio ICMP (errore o richiesta di informazioni) 
- **Code:** descrizione dell'errore e ulteriori dettagli
- **Checksum:** Controlla i bit errati nel messaggi ICMP
- **Additional Fields (Optional):** dipendono dal tipo di messaggio ICMP
- **Data:** Intestazione e parte dei dati del datagramma che ha generato l'errore
### Tipi di errori
- **Destination Unreachable** _(Type = 3)_  viene generato da un _gateway_ quando la sottorete o l'host non sono raggiungibili, da un _host_ quando si presenta un errore sull'indirizzo dell'entità a livello superiore.
	- _Codici:_
		- 0 = sottorete non raggiungibile
		- 1 = host non raggiungibile
		- 2 = protocollo non disponibile
		- 3 = porta non disponibile
		- 4 = frammentazione necessaria ma [[I protocolli Internet#^3dd543|bit don't fragment]] settato
- **Time Exceeded** _(Type = 11)_ generato da un _router_ quando il [[I protocolli Internet#^c5ab81|TTL]] di un datagram si azzera, da un _host_ quando il timer di attesa dei frammenti da riassemblare si azzera.
- **Source Quench** _(Type = 4)_ i datagrammi arrivano troppo velocemente e l'host non riesce a processarli, la sorgente deve ridurre la velocità di trasmissione _(obsoleto)_
- **Redirect** _(Type = 5)_ generato da un router per indicare all’host sorgente un’altra strada più conveniente per raggiungere l’host destinazione
### Informazioni
- **Echo** _(Type = 8)_
- **Echo Reply** _(Type = 0)_ è utilizzato per determinare lo stato di una rete e dei suoi host (raggiungibilità , tempo di transito nella rete)
	- l'host sorgente invia la richiesta ad un altro host o ad un gateway, la destinazione deve rispondere immediatamente
- **Timestamp Request** _(Type = 13)_
- **Timestamp Reply** _(Type=14)_ quando l'host sorgente invia un datagram include in esso anche un timestamp (_Originate Timestamp_) del momento dell'invio, il destinatario risponde con l'istante in cui viene ricevuta la richiesta (_Receive Timestamp_) e l'istante in cui viene inviata la risposta (_Transmit Timestamp_)
	- Serve per valutare il tempo di transito nella rete, al netto del tempo del processo (_T~Transmit~_ - _T~Receive~_)
- **Address Mask Request** _(Type = 17)_
- **Address Mask Reply** _(Type = 18)_ è utilizzato per nel protocollo **DHCP** per ottenere la subnetmask dopo aver ottenuto il proprio indirizzo IP.
- **Router Solicitation** _(Type = 10)_
- **Router Advertisement** _(Type = 9)_ utilizzato per localizzare i router connessi alla rete
#### Additional Fields
- _Identifier_: identifica l'insieme degli echo appartenenti allo stesso test
- _Sequence Number_: identifica ciascun echo nell'insieme
- _Optional Data_: usato per inserire eventuali dati di verifica

## Applicazioni ICMP
### Ping
```bash
ping DEST
```
Permette di controllare se l'host DEST è raggiungibile o meno dalla sorgente
### Tracert
```bash
tracert DEST
```
Permette di conoscere il percorso seguito dai pacchetti inviati dalla sorgente a DEST
# DHCP (Dynamic Host Configuration Protocol)
Il **DHCP** è un protocollo che permette la configurazione dinamica e automatica di:
- Indirizzi IP
- Netmask
- Broadcast
- Host name
- Default Gateway
- Server DNS
>[!info] Server
>Porta 67 UDP
## Funzionamento
- **DHCPDISCOVER** è il messaggio inviato in modalità broadcast da un host in cerca di un server DHCP
- **DHCPOFFER** è il messaggio inviato in risposta da **i server** in cui viene proposto l'indirizzo IP
- **DHCPREQUEST** è la risposta dell'host in cui accetta la configurazione specificando il server
- **DHCPACK** il server risponde con un ACK