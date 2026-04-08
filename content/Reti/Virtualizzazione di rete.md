La virtualizzazione delle reti ha lo scopo di realizzare topologie o funzionalità diverse rispetto a quelle native (fisiche) di un'infrastruttura.
Questo serve per venire incontro all'esigenza di modificare facilmente una rete, soprattutto se dislocata su un area geografica molto vasta.
>[!note] Reti "Overlay"
>Generalmente si parla di **reti "overlay"** che sono sovrapposte logicamente rispetto all'infrastruttura fisica.
>![Understanding Underlay and Overlay networks - Cisco Community](https://community.cisco.com/t5/image/serverpage/image-id/104874i734DAC7EAED3CB7D/image-size/large?v=v2&px=999)

### Network IP
La [[I protocolli Internet#Network IP|network IP]] è già una forma di network overlay:
Gli **switch** creano una LAN con un solo dominio di broadcast e ripartiscono gli host in diverse network IP differenziando le politiche di instradamento per ognuna di esse
- **Direct forwarding**: Comunicazione fra host della stessa network IP
- **Indirect forwarding**: Comunicazione tramite gateway fra host di network IP diverse
## GRE Tunnel (RFC 1701)
Il protocollo **GRE (Generic Routing Encapsulation)** permette l'incapsulamento di pacchetti IP utilizzando proprio il protocollo IP
>[!Example] Esempio di incapsulamento
>![[Pasted image 20251121133414.png]]
>In =={red}rosso== il pacchetto incapsulato da trasportare


>[!abstract] Header
>![[Pasted image 20251121133758.png]]
>- **Version**: indica la versione del header
>- **Protocol Type**: indica che tipo di protocollo viene incapsulato nel tunnel
>- **Campi Opzionali**
>	- _Checksum_: Serve per controllare la correttezza dei dati
>	- _Key_: Inserito per autenticare la sorgente del pacchetto incapsulato nel tunnel con qualche metodo di autenticazione (password)
>	- _Sequence Number_: Viene inserito dalla per stabilire la sequenza di invio dei pacchetti sul tunnel in modo che la destinazione possa instradare i pacchetti nell'ordine corretto
>	- _Routing_: Elenco dei router che si vuol fare attraversare al pacchetto (politica di instradamento del tunnel)

>[!example] Esempio di tunneling
>![GRE Tunnel on Cisco IOS Router](https://cdn.networklessons.com/wp-content/uploads/2013/04/three-cisco-routers-with-tunnel.png)
>>[!note] N.B.
>>Una modifica a livello fisico della rete non viene percepito a livello logico

## Virtual Extensible LAN (VXLAN)

La **VXLAN** è una tecnologia che usa le tecniche di incapsulamento per inserire all'interno di datagrammi UDP (livello 4), tramite la porta di destinazione 4789, frammenti Ethernet di livello 2.
Questa tecnologia ha lo scopo di rendere scalabili gli ambienti relativi al cloud computing.
I terminali delle VXLAN sono chiamati **VTEPs (VXLAN Tunnel End Points)** e possono essere porte di switch fisiche o virtuali.
Ogni rete logica è identificata dal VXLAN Network Identifier (**VNID**), avendo così a disposizione 16 milioni di reti.
>[!warning] Dominio Broadcast
>Se si ha un dominio di broadcast unico vengono inviati dati a tutti i calcolatori connessi alla stessa LAN logica, anche su reti IP diverse.
>**Problema**:
>- _Prestazioni_: I pacchetti broadcast limitano le prestazioni perché richiedono risorse della rete
>- _Sicurezza_: I pacchetti broadcast possono essere utilizzati per studiare la topologia di rete e/o tentare attacchi alla sicurezza della rete stessa

## Virtual LAN (VLAN)
Le **VLAN** permettono di segmentare il dominio di broadcast tramite uno switch facendo coincidere le network IP con le VLAN in modo che l'invio di un messaggio in broadcast non raggiunga gli host di un'altra VLAN.
>[!example] Esempio di VLAN
>![[Pasted image 20251121142936.png]]
### Classificazione
- **VLAN statiche (o port-based)**: Le VLAN dipendono dalla porta dello switch a cui è associata. Sono tipicamente le più usate.
- **VLAN dinamiche**: L'appartenenza delle VLAN è relativa all'indirizzo MAC o IP dell'host, cioè non dipende dalla porta dello switch a cui sono collegati.
## IEEE 802.1Q
Il protocollo **IEEE 802.1Q** permette l'utilizzo delle stesse VLAN su switch diversi interconnessi tra loro.
>[!abstract] Header
>![[Pasted image 20251121144322.png]]
>Viene inserito un _tag_ di 4 byte nell'intestazione dell'Ethernet:
>- **Tag Protocol Identifier (TPID)**: Identifica il protocollo (16 bit)
>- **Priority** (3 bit)
>- **CFI**: Identifica il formato del MAC address (1 bit)
>- **Unique LAN Identifier (VID)**: Indica il numero della VLAN da 0 a 4095 (12 bit)

### Porte dello switch
- **Access Mode**: È la modalità per connettere gli host direttamente alle porte associandole ad una sola VLAN
	- tagging del 802.1Q non necessario
- **Trunk Mode**: In questa modalità una porta è in grado di trasmettere informazioni da più VLAN tramite l'uso di _tagging_ per identificare ogni rete virtuale
	- _Untagged_: porta dedicata ad una sola VLAN
	- _Tagged_: trasmette i datagram a più VLAN
### Inter-VLAN routing
>[!warning] Problema
>Per collegare più VLAN ad un router si necessiterebbe di una interfaccia dedicata ad ogni rete virtuale.
#### Router-on-a-Stick
>[!error] Gary
>Il prof è un grande perché è riuscito a spiegare l'argomento senza nominarlo, il miglior professore di Alma Mater Studiorum Università di Bologna

Per riuscire a comunicare tra VLAN e al di fuori della rete locale si utilizza la tecnica chiamata **Router-on-a-Stick**: si utilizza il tagging 802.1Q sull'interfaccia del router in modo che si abbia un unico collegamento con il router tramite il trunking (stick)
>[!Example] Esempio di router-on-a-stick
>![Router-on-a-Stick Inter-VLAN Routing (4.2) > Inter-VLAN Routing | Cisco  Press](https://www.ciscopress.com/content/images/chap4_9780136729358/elementLinks/04fig05.jpg)
>
## Reti private
Aziende e/o enti di dimensioni medio/grandi in genere hanno necessità di interconnettere in maniera sicura sedi sparse sul territorio distati tra loro.
Si usa creare delle linee dedicate (**reti private**) da affittare presso gli operatori per connettere più edifici della stessa azienda o ente.
>[!tip] Obiettivi
>- **Riservatezza**: Le informazioni non sono leggibili da tutti
>- **Autorizzazione**: Definisco il sottoinsieme di coloro che sono in grado di leggere i dati
>- **Autenticazione**: Verifico chi sta leggendo i dati
>- **Paternità**: Garantisce l'origine dei dati
### Virtual Private Network (VPN)
Invece di creare/acquisire nuove infrastrutture per collegare più luoghi si può creare una rete in "overlay" attraverso le reti pubbliche utilizzando le **VPN**.
Tramite l'utilizzo del tunnelling i pacchetti _autenticati_ vengono incapsulati in pacchetti "tradizionali".
#### VPN Roadwarrior
Su una network viene configurato un server VPN e tutti i client si collegano a quel server da un punto qualunque di internet.
>[!fail] Problema
>Se ho molti host co-localizzati il roadwarrior è inefficiente perché $n$ host richiedono $n$ tunnel
>![[Pasted image 20251121161258.png]]

>[!success] Soluzione
>Creando una connessione **Net-to-Net** risolviamo l'eccessivo numero di tunnel
>![[Pasted image 20251121161443.png]]

#### IPSec
Il protocollo **IPSec** garantisce l'autenticazione e la crittografia dei pacchetti attraverso il protocollo IP rimanendo invisibile a livello applicativo.
##### Security Association (SA)
L'IPSec si basa sulla relazione unidirezionale tra mittente e destinatario, definita da:
- **Security Parameter Index (SPI)**
- Indirizzo IP di destinazione
- Security Protocol Identifier
Sono possibili due modalità di SA:
- _Transport Mode_
- _Tunnel Mode_
##### Protocolli
- **IKE (Internet Key Exchange)**: tramite la negoziazione algoritmi e chiavi crittografiche garantisce autenticazione con l'interlocutore
	- _Fase 1 - Negoziazione preliminare_: uno dei due nodi VPN tenta di contattare l'altro, poi si accordano sui parametri di sicurezza da usare in questa fase
	- _Fase 2 - Negoziazione della connessione_: i due nodi della VPN si accordano sui parametri di sicurezza e sulla modalità di comunicazione, si generano e si rinnovano le chiavi crittografiche
- **AH (Authentication Header)**: Autentica i pacchetti trasmessi in VPN garantendo l'integrità, l'autenticità dei dati e l'identità del mittente ^715cc0
	- Campo protocol IP = 51
- **ESP (Encapsulating Security Payload)**: Come [[Virtualizzazione di rete#^715cc0|AH]] ma con più riservatezza delle informazioni tramite crittografia





