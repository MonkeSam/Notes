Il **firewall** è un sistema di sicurezza che monitora il traffico in entrata e in uscita dalla rete secondo specifiche regole impostate.
È utilizzato per proteggere una rete da accessi esterni indesiderati e può essere un semplice software che controlla i pacchetti in entrata oppure un'intera macchina dedicata al filtraggio del traffico di rete.
>[!abstract] Configurazione
>In fase di configurazione deve essere decisa la politica di default del firewall:
>- **Default deny**: tutti i servizi non esplicitamente permessi sono negati
>- **Default permit**: tutti i servizi non esplicitamente negati sono permessi
## Packet Filter
Filtra i pacchetti seguendo le politiche stabilite (configurate statisticamente) interponendo un [[Router|router]] tra rete locale e Internet.
Viene configurato il filtro sui datagrammi IP che vengono scartati sulla base di:
- Indirizzo IP sorgente o destinazione
- tipo di servizio a cui il datagram è destinato (porta TCP/UDP)
- Interfaccia di provenienza o destinazione
>[!Example] Disegno Packetfilter
>![[packet-filtering.png]]
>Come si nota i livelli dello stack considerati sono i primi 3

## Stateful Packet Inspection
Tramite la tecnica **Stateful Packet Inspection** il firewall tiene conto anche degli stati dei pacchetti monitorando la loro "vita", ad esempio essendo il TCP un protocollo connection-oriented (cioè la connessione è riconoscibile perché vengono utilizzati degli identificatori) è possibile risalire al comportamento di determinati pacchetti.
Viene anche chiamato _Dynamic Packet Filter_ perché in base al comportamento delle connessioni adatta il proprio filtro.
I dati delle connessioni vengono salvati in apposite tabelle e in caso di protocolli connection-less come l'UDP viene utilizzato un timer per decidere come filtrare tali pacchetti.
>[!Example] Disegno Stateful Packet Inspection
>![[Pasted image 20251117102008.png]]
>Vengono presi in considerazione anche i livelli di trasporto e applicazione

## Application Layer Gateway
Monitora le connessioni analizzando il contenuto dei protocolli applicativi e in base ad essi adatta dinamicamente le specifiche dei filtri.
### Proxy
L'Application Layer Gateway (ALG) è implementato tramite l'utilizzo di un **Proxy server** che si interpone tra Internet e la rete privata creando una Demilitarized Zone (**DMZ**) nella quale si occupa di realizzare per tutti gli host della LAN la comunicazione verso l'esterno, evitando così un flusso diretto di datagram fra Internet e le macchine della rete locale.
#### Application level
Si crea un proxy server dedicato per ogni servizio che si vuole garantire.
#### Circuit Level Gateway
È un proxy server generico in grado di inoltrare le richieste relative a molti servizi.
>[!example] Configurazione di packet filter e proxy server
>![[proxy e packet filter.png]]

