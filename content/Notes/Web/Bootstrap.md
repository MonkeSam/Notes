>[!quote] Wikipedia
>Bootstrap is a free and open-source front-end web framework for designing websites and web applications

>[!faq] Perché usare Bootstrap?
>- Facile da usare e veloce da imparare
>- Ha molti componenti comuni
>- Velocizza lo sviluppo
>- Stile coerente
>- Ampia compatibilità con i browser
>- Framework _responsive_ e _mobile first_
## Installazione
Esistono due modi per utilizzare Bootstrap:
- Si possono scaricare in file in locale per poi aggiungere i riferimenti al progetto
- Si può usare un **Content Delivery Network (CDN)**. I file vengono direttamente linkati nelle pagine senza dover scaricare niente
## Elementi
Gli elementi di Bootstrap si dividono nelle seguenti categorie:
- Layout
- Content
- Forms
- Components
- Helpers e Utilities
### Layout
Componenti ed opzioni legati agli aspetti di gestione dell'impaginazione.
I concetti principali sono:
- Container
- Grid e Column
- Utility class
#### Grid View
Bootstrap mette a disposizione un grid system basato su 12 colonne
![[Bootstrap grid system.png]]

È basato sull'approccio [[Web Design#Mobile first|mobile first]] per cui la visualizzazione di default è quella per mobile. I [[CSS-Cascading Style Sheet#Breakpoint|breakpoint]]  delle [[CSS-Cascading Style Sheet#Media Query|media query]] sono basati sulla larghezza minima.

### Content
Componenti ed opzioni legati ai contenuti come testo, immagini, ecc. comprendono:
- Tipografia
- Immagini
- Tabelle
### Form
Classi per gestire lo stile degli input dei form, la loro impaginazione ed eventuali messaggi per la validazione
### Components
Sono un insieme predefinito di componenti utilizzati nelle pagine web come:
 - Alert
 - Breadcrumb
 - Bottoni
 - Form
 - Paginazione
 - ...
## Critiche a Bootstrap
>[!quote] Bootstrap è pesante
>Vero, ma è possibile selezionare solo i componenti che si vogliono utilizzare, riducendo notevolmente la dimensione dei file da includere

>[!quote] Non segue le best practice
>Infatti infrange una delle regole fondamentali: l'aspetto di presentazione non è più separato dal codice Html.
>L'uso di Bootstrap porta infatti ad usare molti più tag di quelli che si userebbero normalmente, solo per gestire l'aspetto di presentazione

>[!quote] Il look and feel dei siti è molto simile
>Vero, i siti che fanno uso di Bootstrap sembrano tutti uguali!




