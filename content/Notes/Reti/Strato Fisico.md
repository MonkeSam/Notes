>[!info] Legge di Edholm
>La legge di Edholm è analoga alla legge di Moore per i microprocessori: ci dice che circa ogni 18 mesi la banda a disposizione dell'utente raddoppia a costo costante
>![🔮 The cheat codes of technological progress](https://substackcdn.com/image/fetch/$s_!_C_4!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F33fc46e9-c1bd-4a17-8b65-a952ae2eea88_5586x3604.png)

## Mezzi trasmissivi in rame
### Attenuazione
Qualunque mezzo trasmissivo degrada il segnale elettro magnetico mentre questo si sposta, il degrado del segnale viene misurato tramite l'**Attenuazione**. Viene misurata la perdita di potenza di segnale in `dB/Km`.

$$
A_{dB}=10\log_{10} \left (\frac{P_T}{P_R} \right)=\alpha \sqrt{f_{MHz}L}
$$
 La formula qui sopra ci indica che la crescita dell'attenuazione è esponenziale rispetto la lunghezza del collegamento e con la radice della frequenza del segnale.
 $\Rightarrow$ È molto difficile portare lontano segnali ad alta frequenza.
### Twisted Pair
#### Categorie
*   **Cat 1:** (TIA/EIA-568-B). Usato per la Rete telefonica generale, ISDN e per i citofoni.
*   **Cat 3:** (TIA/EIA-568-B). Usata per reti con frequenze fino a 16 MHz, molto diffusa per le reti Ethernet a 10 Mb/s.
*   **Cat 5** (non riconosciuta). Usata per reti con frequenze fino a 100 MHz; come ad esempio ethernet a 100 Mb/s.
*   **Cat 5e** (TIA/EIA-568-B). Usata per reti con frequenze fino a 200 MHz, come ad esempio fast ethernet e gigabit ethernet.
*   **Cat 6** (TIA/EIA-568-B). Usata per reti con frequenza minima per certificazione 250 MHz.
*   **Cat 6a** (TIA/EIA-568-B). Usata per reti con frequenze fino a 500 MHz.
*   **Cat 7** (ISO/IEC 11801 Class F), nome informale. Lo standard specifica 4 STP all'interno di un unico cavo. Concepito per trasmissioni sino a 600 MHz.
*   **Cat 7a** (ISO/IEC 11801). Usata per reti con frequenze fino a 1 GHz.
>[!info] Categoria/Velocità
>| Categoria | Velocità (Mb/s) |
| :-------: | :-------------: |
|     1     |        2        |
|     2     |        4        |
|     3     |       10        |
|     4     |       16        |
|     5     |       100       |
|    5e     |      1000       |
|     6     |      10000      |




#### Tipologie di cavi 
>[!example] Come sono fatti i cavi
>![[Twisted Pair.png]]
##### STP-Shielded Twisted Pair
Nel cavo ogni coppia è avvolta in un conduttore che fa da schermo che deve essere messo a massa.
>[!success] Pro
>Minor attenuazione e bassa sensibilità alle interferenze

>[!fail] Contro
>Questo tipo di cavo ha un costo maggiore

##### UTP-Unshielded Twisted Pair
I cavi non presentano schermatura.
>[!success] Pro
>Costo del cavo basso

>[!fail] Contro
> Alta attenuazione e alta sensibilità a interferenze magnetiche

##### FTP-Foiled Twisted Pair
Un unico foglio conduttivo intorno alle coppie funge da schermo per le interferenze.
È più costoso di un cavo [[#UTP-Unshielded Twisted Pair|UTP]] e meno di uno di tipo [[#STP-Shielded Twisted Pair|STP]] ma avendo un solo strato di schermatura ha una resistenza alle interferenze inferiore ai cavi STP

#### Cavi coassiali
Sono i cavi tipicamente utilizzati per le linee telefoniche.
>[!example] Sezione di un cavo coassiale
>![[Cavo Coassiale.png]]
>- **D**: diametro cavità conduttore esterno
>	- più è grande e più i costi e le prestazioni sono alti
>- **d**: diametro conduttore interno

## Mezzi trasmissivi radio
I **mezzi radio** sono naturalmente broadcast per la loro diffusione e, non avendo vincoli fisici, sono adatti alla mobilità.
>[!fail] Problemi
>- Lo spettro è uno solo
>- [[#Attenuazione|Attenuazione]]:
>	- Cresce con la distanza secondo la legge polinomiale
>	- Cresce con il quadrato della frequenza, quindi antenne con frequenza maggiore sono efficienti

>[!info] Propagazione delle onde elettromagnetiche
>- $<3\ \text{MHz}$: visibilità diretta o onda a terra
>- $>3\ \text{MHz}\ \text{e} <30\ \text{MHz}$: propagazione nella ionosfera
>- $>30\ \text{MHz}$: solo visibilità diretta (ponti radio)

---
>[!warning] Ho saltato la storia delle comunicazioni radio
>Se la chiede è la fine 💀
---
#### Servizi su comunicazioni radio
- Trasmissioni punto-multipunto (_broadcast_)
- Mobilità
- Limitazione delle risorse (spettro radio finito)
Per questo vengono utilizzati per:
- Diffusione _radiofonica_ e _televisiva_
- Sistemi _radiomobili_: il segnale è confinato in un'area limitata
>[!note] Grande distanza
>- Propagazione ionosferica
>- Radiocomunicazione via satellite (_Sputnik_ 1957)
>- Satelliti TLC (telecomunicazione)
>	- Satelliti geostazionari
>	- Evoluzione '90
>		- **GPS** (Global Position System)
>		- **DBS** (Diffusione diretta da satellite)
>		- Accesso ad internet tramite satellite
>	- **MEO**: Medium-Earth Orbit
>	- **LEO**: Low-Earth Orbit

#### Sistemi cellulari
È un nuovo modo di usare i radiocollegamenti: utilizzando delle celle a bassa potenza in modo che celle non adiacenti possano utilizzare le stesse frequenze senza sovrapporsi. Vengono utilizzati gruppi di celle chiamati _cell clusters_.
Per la comunicazione sono necessari terminali molto sofisticati in grado di:
- Selezionare i canali e eseguire le segnalazioni
- _Hand-over_ (mobilità fra celle)
- _Roaming_ (mobilità fra operatori)
## Fibra ottica
È un metodo di trasmissione che avviene tramite un filamento di vetro o plastica molto sottile e a densità differenziata.
![[Cavo Fibra.png]]
>[!warning] Attenuazione
>Nonostante il vetro rifletta la luce, una piccola parte viene comunque assorbita e quindi il segnale viene attenuato.

### Funzionamento
Il _Core_ ha un indice di rifrazione più grande del _Cladding_, i raggi di luce che colpiscono la discontinuità ad un angolo inferiore a quello critico sono riflessi completamente.
>[!info] Tipi di fibre ottiche
>![[Tipi di fibre ottiche.png]]
>- **Multimodale**: permette di trasmettere più lunghezze d'onda contemporaneamente ma per distanze minori perché ha problemi di dispersione avendo un Core più grande
>- **Monomodale**: trasmette una sola lunghezza d'onda ma ad alta velocità e per lunghe distanze

I sistemi tradizionali utilizzano una tecnica detta **On/Off Keying (OOK)** per cui una sorgente di luce (laser o led) genera impulsi luminosi che si propagano per grandi distanze e possono essere generati ad altissima velocità. Un _rivelatore_ (fotodiodo) riceve gli impulsi.

>[!tip] Il paradosso della fibra ottica
>In generale nella tecnologia un aumento di prestazioni implica un aumento di costo, la fibra ottica invece aumenta notevolmente le prestazioni intaccando minimamente il costo

>[!warning] Problemi
>Rispetto ai cavi in rame la fibra ottica è più difficile da giuntare perché si ha come parte critica la fase di allineamento.
>Esistono due tipi di giunti:
>- **Stabili**
>- **Temporanei**

#### Giunto stabile
I cavi vengono inizialmente allineati e tramite un flash elettrico che fonde il materiale (vetro, plastica) in modo che si uniscano e si ricavi un unico cavo.
>[!example] Giuntura stabile
>![[Giuntura Stabile.png]]

#### Nel mondo reale
Nelle vere reti di telecomunicazioni la fibra ottica viene usata per collegamenti a lunga distanza nel seguente modo:
- Cavi in rame coprono distanze di ~10km
- La fibra viene utilizzata per coprire distanze maggiori
### Amplificazione
A causa della perdita di segnale su grandi distanze della fibra ottica si interviene con delle tecniche di amplificazione degli impulsi luminosi in modo da mantenere il segnale.
#### EDFA - Amplificazione in fibra drogata all'erbio
Per amplificare il segnale si utilizza principalmente l'amplificatore **EDFA** che tramite l'aggiunta del metallo _"erbio"_ riesce a rendere di più.
##### WDM - Wavelength Division Multiplexing
È il tipo di multiplexing usato per le fibre ottiche, è praticamente identico al [[#^482d89|FDM]], semplicemente la divisione dei canali non avviene tramite frequenze ma per lunghezze d'onda (cioè i colori).


>[!info] FDM-Frequency Division Multiplexing
>[È una tecnica di multiplexing per la quale la banda di un canale trasmissivo viene suddivisa in sottocanali ognuno costituito da una banda di frequenza e separato da un altro grazie ad un piccolo intervallo di guardia.](https://it.wikipedia.org/wiki/Frequency_Division_Multiplexing#:~:text=In%20telecomunicazioni%20la,intervallo%20di%20guardia.)

^482d89

###### Dispositivi
- **AWG (Arrayed Waveguide Gratings)** è un componente ottico passivo utilizzato per instradare lunghezze d'onda fisse. [Viene tipicamente usato per eseguire de-multiplexing perché è in grado di fare multiplexing in un singolo cavo in fibra](https://en.wikipedia.org/wiki/Arrayed_waveguide_grating#:~:text=T-,hese%20devices%20are%20capable%20of%20multiplexing%20many%20wavelengths%20into%20a%20single%20optical%20fiber,-%2C%20thereby)
- **ROADM (Reconfigurable optical add-drop multiplexer)** è un sistema di rete attivo e programmabile che utilizza componenti, inclusi potenzialmente gli AWG, per gestire le lunghezze d'onda in modo dinamico e remoto.
- **MEM** (in realtà si chiama [Microoptoelectromechanical systems (MOEMS)](https://en.wikipedia.org/wiki/Microoptoelectromechanical_systems#:~:text=Microoptoelectromechanical%20systems%20(MOEMS))) è un dispositivo piccolissimo che ha il compito di deviare la luce.
### Aree
Il territorio viene suddiviso in aree in base alle potenzialità di investimento da parte degli [[Internet Service Provider (ISP)|operatori]]
- **Bianche**: Non sono previsti investimenti
- **Grigie**: Previsti investimenti da un solo operatore
- **Nere**: Più di un operatore prevede investimenti
### Rete di accesso
Vengono classificate in base alla localizzazione dell'interfaccia elettro/ottica (EOI)
- **FTTE**: Fiber To The Exchange
- **FTTCab**: Fiber To The Cabinet
- **FTTC**: Fiber To The Curb
- **FTTB**: Fiber To The Building
- **FTTH**: Fiber To The Home