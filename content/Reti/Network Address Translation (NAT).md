Il **NAT** è una tecnica di filtraggio di pacchetti IP con mascheramento degli indirizzi e porte (RFC 3022).
In sostanza gli IP della rete locale vengono mascherati dall'indirizzo pubblico del [[Router|router]] rendendo gli host inaccessibili dall'esterno e nascondendo la struttura della rete. È possibile contattare un host dall'esterno solo se il tipo di NAT lo permette. 
Viene incluso uno [[Firewall#Stateful Packet Inspection|Stateful Packet Inspection]] per filtrare i pacchetti.
>[!caution] Criticità
>Modificando solo l'header IP e dei livelli superiori e non il payload in alcuni casi specifici il NAT potrebbe non essere invisibile all'applicazione:
>Protocolli come FTP contengono indirizzi IP e numeri di porta nel payload, FTP utilizza due connessioni parallele:
>- Connessione per l'interazione con il server
>- Connessione  per il trasferimento dei dati da e verso il server


>[!Example] Esempio di mapping degli IP
>![[Pasted image 20251117113221.png]]

## Basic NAT
È il tipo di NAT più semplice (chiamato anche one-to-one translation) nel quale solo l'indirizzo IP e i livelli più alti che lo coinvolgono vengono cambiati.
Viene usato a volte per connettere due reti con indirizzi incompatibili.
## Port forwarding
È un'applicazione del NAT utile per l'accesso agli host di una LAN da una rete esterna (Internet), per fare ciò il router possiede delle porte aperte le cui comunicazioni in entrata sa di dover inoltrare ad una specifica porta di un host, raggiungendo così un eventuale servizio.
>[!Example] Esempio di port forwarding
>![[Pasted image 20251117115636.png]]

