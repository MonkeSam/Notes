La formazione di immagini è dovuto a raggi di luce che entrano in un sistema ottico e colpiscono un _sensore_ (**piano immagine**).
>[!info] In principio erano le camere oscure, da cui deriva il nome _camera_.

Da un foro si vuole far passare la luce per proiettarla sul **piano immagine**. È necessario che il foro abbia le corrette dimensioni per far entrare nella camera la quantità corretta di luce:
- Troppo piccolo $\to$ diffrazione(l'immagine si perde), immagine più a fuoco ma quantità di luce insufficiente
  
  ![[Calibrazione_diffrazione.png|500]]
- Troppo grande $\to$ maggiore luce ma immagine sfocata
  
  ![[Calibrazione_sfocatura.png|500]]

>[!faq] Come si può avere un'immagine a fuoco avendo una quantità di luce sufficiente?

## Lenti
Tramite le _lenti sottili_ si riesce a incanalare la corretta quantità di luce in un foro abbastanza piccolo da avere l'immagine a fuoco.
La lente è formata da i **I fuochi** $F_{r}$ e $F_{l}$, situati a distanza $f$ (_lunghezza focale_) dal centro della lente $O$.
>[!faq] Come si comporta la luce quando incontra la lente?

Ogni raggio che entra nella lente:
- =={green}Parallelamente all'asse ottico== viene deviato verso l'altro fuoco ($\overline{PR}$ viene deviato verso $F_{r}$)
- =={red}Passando per il fuoco== esce parallelamente all'asse ottico ($\overline{PS}$ esce parallelamente dalla lente per andare in $p$)
- =={orange}Passando dal centro della lente $O$== mantiene la propria direzione ($\overline{PO}$ rimane sullo stesso asse)

![[Screenshot 2026-07-13 at 16.34.04.png|]]
### Equazione fondamentale delle lenti sottili
Date le distanze lente-oggetto ($\overline{QO}$)  $\tilde{Z}$  e lente-immagine (_piano immagine_) $\tilde{z}$, si ha
$$
\large \frac{1}{\tilde{Z}}+\frac{1}{\tilde{z}}= \frac{1}{f}
$$
Quindi se un oggetto è posto a distanza $\tilde{Z}$ sull'asse della lente, con distanza focale $f$ ($\overline{F_{l}O}$ o $\overline{F_{r}O}$) e con uno schermo posto a distanza $\tilde{z}$ si formerà l'immagine dell'oggetto.

### Profondità di campo (Depth Of Field)
La profondità di campo è proprio quello spazio fisico in cui la sfocatura è così leggera da risultare invisibile ai nostri occhi (chiamato _circolo di confusione_).
![[Calibrazione_DOF.png]]
La profondità di campo dipende dall'apertura del _diaframma_ della camera:
![[Calibrazione_apertura_diaframma.png]]


## Geometria Proiettiva
Trasformare il mondo reale 3D in un'immagine in 2D non è così banale, perché avvengono trasformazioni radicali (ad esempio Prospettiva, Distanza, Convergenza, Distorsioni di forme e angoli).
![[Calibrazione_3D_to_2D.png|400]]

Quindi ciò che dobbiamo fare è tradurre un punto $P(x,y,z)$ in un punto $(x,y)$.
### Proiezione prospettica
La figura mostra il modello in sezione laterale (lungo il piano $YZ$):
- il centro di proiezione o fuoco della camera coincide con l’origine $O$ degli assi
- il piano immagine o piano di proiezione $\pi$ è perpendicolare all'asse $Z$
- la distanza tra $O$ e $\pi$ è la lunghezza focale $f$

![[Calibrazione_proiezione_prospettica.png]]

>[!tip] Sfruttiamo la similitudine dei triangoli $\overset{\triangle}{OpQ}$ e $\overset{\triangle}{OPR}$ 

Dato che
$$
\large
\overline{pQ}:\overline{PR} = \overline{OQ}:\overline{OR} \rightarrow y:Y = f:Z
$$
Possiamo ottenere
$$
\large
x = f \cdot \frac{X}{Z} \qquad y = f \cdot \frac{Y}{Z}
$$
>[!info] La divisione per  $Z$ è il motivo per cui gli oggetti lontani appaiono piccoli.

### Calibrazione della camera
La camera e ciò che essa inquadra ==non si trovano nello stesso sistema di riferimento==, quindi preso un punto $P_{\text{w}}(X_{\text{w}},Y_{\text{w}},Z_{\text{w}})$ della scena bisogna trasformarlo in un punto $P_{c}(X_{c},Y_{c},Z_{c})$.
Per tradurre i punti va effettuata un trasformazione geometrica tramite:
- =={pink}una matrice di rotazione $R$ (ottenuta a partire da 3 angoli)==
- =={pink}un vettore di traslazione $t$ (3 componenti)==
#### Parametri estrinseci
Il punto $P_{c}$ si ottiene
$$
\large
P_{c}= R \cdot P_{\text{w}} + t
$$

Gli elementi necessari alla trasformazione ($R$ e $t$) sono chiamati =={pink}**parametri estrinseci**==
![[Calibrazione_parametri_estrinseci.png]]

#### Parametri intrinseci
Una volta che le coordinate sono espresse nel sistema di riferimento della camera 
($P_{c}= R \cdot P_{\text{w}}+ t$) si possono applicare le equazioni fondamentali della [[#Proiezione prospettica|proiezione prospettica]] 
$$
\large
x = f \cdot \frac{X}{Z} \qquad y = f \cdot \frac{Y}{Z}
$$
Per determinare esattamente la trasformazione dalla scena all'immagine, sono necessari anche altri parametri, specifici della camera:
- Lunghezza focale $f$ (dipende dall'obiettivo della camera)
- Coordinate del punto principale $(c_x,c_y)$ 
- La relazione tra la dimensione dei pixel e l'unità di misura della scena 3D $(s_x,s_y)$
- ci sarebbero anche i parametri del modello di deformazione: $k_1,k_2,k_3,...$

Questi parametri si chiamano **parametri intrinseci**


Quindi una volta trovate le coordinate in 2D di $p_{c} = (x_{c},y_{c})$ 
$$
\large
\begin{align}
u = \frac{x_{c}}{s_{x}} + c_{x}  \\
v = \frac{y_{c}}{s_{y}} + c_{y}
\end{align}
$$
Trovando così le coordinate dell'immagine
$$
\large p = (u,v)
$$


>[!note] Coordinate omogenee
>In coordinate omogenee, due vettori (punti nello spazio 3D) sono equivalenti se differiscono solo di un fattore si scala:
>$$P=(X,Y,Z)\leftrightarrow \tilde{P}=(X\cdot w,Y\cdot w,Z\cdot w)=(X,Y,Z,1),w\neq 0 $$
>Quindi possiamo tradurre il passaggio dal sistema della scena a quello della camera in una serie di prodotti 
>![[Calibrazione_rototraslazione.png]]
>Invece la proiezione da 3D a 2D
>![[Calibrazione_coordinate_omogenee_proiezione.png]] 

##### Distorsione radiale
Generalmente le [[#Lenti|lenti]] causano una certa distorsione nell'immagine.
La distorsione più comune è quella **radiale**,  che può essere modellata come segue:

Date
- Le coordinate (non distorte) $p_{c} = (x,y)$
- Le coordinate effettive (distorte) $p_{c}' = (x',y')$



$$
\large
\begin{align}
x' = x(1 + k_1r^2 + k_2r^4 + k_3r^6) \\
y' = y(1 + k_1r^2 + k_2r^4 + k_3r^6)
\end{align}
$$

dove
$$
\large
r^2 = x^2+y^2
$$
![[Calibrazione_distorsione.png]]

## Calibrazione

> [!faq] Quindi cosa significa calibrare?
> 

Consiste nel ==determinare i parametri [[#Parametri estrinseci|estrinseci]] ed [[#Parametri intrinseci|intrinseci]]== di una camera
Disponendo di un numero sufficiente di *corrispondenze* fra punti 3D della scena e punti 2D dell'immagine, è possibile stimare i vari parametri.

### Ricerca di punti corrispondenti
Si usa un oggetto di cui le dimensioni sono già note su cui sia facile individuare un insieme di punti $m$.
>[!info] Solitamente si usa una scacchiera
>Perché i vertici interni sono facili da individuare matematicamente con altissima precisione.

>[!tip] Calibrazione
> Da una serie di **$n$ immagini** con posizioni diverse (dell'oggetto o della camera), si ottengono quindi, per ogni immagine, una serie di corrispondenze $<P_w^𝑖, p^i>$ fra coordinate nella scena 3D $P_w^𝑖$ e coordinate 2D $p^i$
> ![[Formazione delle immagini_scacchiera.png]]

>[!example] Recupero dei parametri
>![[Formazione delle immagini_calibrazione.png]]





