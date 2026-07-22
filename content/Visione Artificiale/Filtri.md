Abbiamo già visto in precedenza delle [[Immagini#Funzioni|operazioni su immagini per ogni singolo pixel]]
## Filtri lineari
Sono le operazioni locali più comuni: il valore di ciascun pixel è calcolato come **somma pesata** dei valori dei pixel nell'intorno considerato 
$$
\large
I'[y,x] = \sum_{i,j}{ w_{xy}[i,j]\cdot F[i,j] }
$$
## Filtro
$\large F$ è una matrice $m\times m$ con $m$ dispari chiamata **filtro**, **maschera** o **kernel**. Gli elementi che la compone sono chiamati _coefficienti del filtro_  o _pesi_.
Di solito si fa riferimento ai coefficienti del filtro considerando due assi cartesiani (con l'asse verticale diretto vero il basso) con origine in corrispondenza del centro di $F$
![[Filtri_filtro.png|500]]
La formula per il calcolo del valore di un pixel nell'immagine destinazione può essere quindi scritta come:
$$
\large
I'[y,x]=\sum_{i=-d}^{d}\sum_{j=-d}^{d}F[i,j]\cdot I[y+i,x+j]\quad t.c. \quad d = [\frac{m}{2}]
$$
>[!faq] Come gestire i bordi?
>Per i pixel sul bordo il comportamento è il medesimo per le [[Immagini#Coordinate fuori dall'immagine|trasformazioni geometriche]]
>![[Filtri_out_of_bounds.png]]

>[!warning] Bisogna stare attenti ai valori dei pixel dopo l'applicazione di un filtro
>I valori potrebbero essere
>- $\large> 255$: in questo caso va effettuata una **normalizzazione**
>- negativi: è necessario usare un altro formato per salvare i dati (`int16` o `float32`)

>[!example] Esempi di filtri
>**Filtro Identità**
>![[Filtri_identity.png]]
>
>**Traslazione verso il basso**
>![[Filtri_down_shift.png]]
>
>**Sfocatura** (è presente la normalizzazione)
>![[Filtri_blur.png]]

## Visualizzare immagini con pixel di tipo int o float
Bisogna gestire i casi in cui si hanno valori maggiori di 255 o negativi:
- **Senza valori negativi**:  Si effettua uno "stretch" (dilatazione) lineare. Il valore massimo nell'immagine diventa 255 (bianco), e lo 0 resta nero.$$ \large I'(y, x) = \frac{255}{\max I} \cdot I(y, x)$$
-  **Con valori negativi:** Qui è necessario un **offset**. Il valore 0 viene spostato a 128 (grigio medio). I valori negativi "scendono" verso il nero, quelli positivi "salgono" verso il bianco.
  $$\large I'(y, x) = 128 + \frac{127}{\max(\text{abs}(I))} \cdot I(y, x)$$

## Filtri separabili
Applicare un filtro a un'immagine ha un costo computazionale $\Theta(m^2)$ per ogni pixel, ciò che possiamo fare è trasformare la matrice filtro in prodotto di un vettore colonna per un vettore riga ($F = F_{y} \cdot F_{x}^{\top}$ ). Ottenendo così un costo computazionale di $\Theta(2m)$ per ciascun pixel.

![[Filtri_splitted_filter.png|600]]

## Correlazione e Convoluzione
- **Correlazione**: un filtro viene fatto scorrere su un'immagine e vengono moltiplicati i pesi per i relativi valori dei pixel.
  >[!tip] Indica quanto un filtro assomiglia all'immagine
  
- **Convoluzione**: non è altro che una correlazione per cui si effettua un ribaltamento della matrice su entrambi gli assi $F' = F(-i, -j)$)

>[!faq] Perché questa distinzione?
>La *convoluzione* permette di sfruttare alcune proprietà algebriche:
> - **Commutatività:** $I * F = F * I$. Non importa se pensi all'immagine che scorre sul filtro o viceversa.
> - **Associatività:** $I * (F * G) = (I * F) * G$.  Ovvero che se devi applicare due filtri in sequenza, puoi prima "convolvere" i due filtri tra loro per crearne uno unico e applicare quello all'immagine. Risparmierai moltissimo tempo di calcolo!

>[!warning] Attenzione!
>La _correlazione_ **NON** è associativa. Se applichi due correlazioni in sequenza, il risultato finale non è lo stesso che otterresti combinando i filtri prima.
>>[!example] Esempio
>>![[Filtri_verifica_empirica.png]]

>[!note] OpenCV
>La funzione `cv.filter2D` implementa la *correlazione* per ottenera la *convoluzione* basta ribaltare il filtro con `cv.flip(filtro,-1)`
### Notazione

La _correlazione_ è indicata con $\large \otimes$
$$
\large
I'= I \otimes F
$$
Mentre la *convoluzione* con $\large *$
$$
\large
I' = I * F
$$


## Box filter
È un filtro con tutti i coefficienti impostati a 1, di solito viene normalizzando dividendo per per il numero di elementi (**media mobile**).
Questo filtro restituisce un effetto *blur*: più grande è la matrice e più l'effetto sarà marcato.

![[Filtri_box_filter.png|600]]

>[!note] OpenCV
>In OpenCV è disponibile la funzione `cv.boxFilter`: un'implementazione specifica per questo filtro che è più efficiente di `cv.filter2D` e `cv.sepFilter2D`
>
>>[!info] Blur
>>La funzione `cv.blur` eqivale a chiamare `cv.boxFilter` con `normalize=True`
>
>>[!example] Esempio
>>![[Filtri_example_blur.png]]

>[!warning] Il box filter può produrre artefatti nell'immagine, che possono essere visibili all'aumentare della dimensione del filtro
>![[Filtri_artefacts_boxfilter.png]]

^e7b29b

## Filtro Gaussiano
Dato il [[#^e7b29b|problema del box filter]] ciò che serve per risolverlo è un filtro con pesi che diminuiscono spostandosi dal centro verso l'esterno, la _funzione gaussiana_ è l'ideale!
![[Filtri_gaussian.png]]

Notiamo che la curva gaussiana in 2D può essere ottenuta tramite la moltiplicazione di due curve in 1D. Quindi abbiamo un [[#Filtri separabili|filtro separabile]] facilmente applicabile con OpenCV.

![[Filtri_gaussian_matrid.png|500]]


>[!example] Esempio
>![[Filtri_gaussian_example.png]]


>[!example] Box filter vs Blur
>**Box filter**
>![[Filtri_tbbt_boxfilter.png]]
>
>**Gaussian filter**
>![[Filtri_tbbt_gaussian.png]]

## Sharpening
Il **filtro di sharpening** viene utilizzato per ottenere un risultato opposto a quello dello del _blur_.
### Funzionamento
Si applica all'immagine una convoluzione con un filtro normalizzato $F_{b}$ per eseguire un effetto blur e si sottrae il risultato all'immagine originale.
$$
\large
M = I - I * F_{b}
$$
![[Filtri_sharpening_step1.png|600]]

L'immagine $M$ va poi sommata all'immagine originale, dopo essere stata moltiplicata per un parametro $k$ che controlla l'intensità dell'effetto.
$$
\large
I'= I + k * M
$$
![[Filtri_sharpening_step2.png|600]]


>[!Example] Esempio
>_Originale_
>![[Filtri_sharpening_original.png]]
>
>_Risultato_
>![[Filtri_sharpening_result.png]]


### Derivazione filtro sharpening
>[!warning] Problema
>Tutte queste operazioni costano troppe risorse, dobbiamo quindi costruire un singolo filtro che esegua l'intera operazione di **sharpening**

Definiamo alcune variabili:
- $I$ l'immagine originale
- $F_b$ un filtro di sfocatura (blur)
- $F_{id}$ il filtro identità (con un solo 1 al centro)
- $k$ un coefficiente che controlla l'intensità dello sharpening.

$$\large\begin{aligned} \text{1. Maschera di contrasto (Unsharp Mask):} \quad & M = I - I * F_b \\ & M = I * F_{id} + I * (-F_b) \\ \text{2. Proprietà distributiva:} \quad & M = I * (F_{id} - F_b) \\ & \mathbf{M = I * F_L}, \quad \text{con } F_L = F_{id} - F_b \\ \\ \text{3. Risultato dello sharpening:} \quad & I' = I + k \cdot M \\ & I' = I + k \cdot (I * F_L) \\ \text{4. Proprietà associativa e commutativa:} \quad & I' = I + I * (k \cdot F_L) \\ \text{5. Applicazione finale della distributiva:} \quad & I' = I * F_{id} + I * (k \cdot F_L) \\ & I' = I * (F_{id} + k \cdot F_L) \\ \\ \text{6. Definizione del filtro unico } F_s: \quad & \mathbf{I' = I * F_s} \end{aligned}$$

>[!example] Esempio con $m=3$ e $k=1.5$
>![[Filtri_sharpening_filter_example.png]]

>[!note] OpenCV
> ``` Python
> # Metodo 1: filtro di blur e operazioni aritmetiche fra immagini
> def sharpen(img, gaussian_blur, m, k):
> 	blurred = cv.GaussianBlur(img, (m,m), 0) if gaussian_blur else cv.blur(img, (m,m))
> 	mask = img.astype(np.int16) - blurred
> 	return np.clip(np.round(img.astype(float)+k*mask), 0, 255).astype(np.uint8)
> 	
> # Metodo 2: creazione di un unico filtro che fa tutto
> def create_sharpen_filter(gaussian_blur, m, k):
> 	if gaussian_blur:
> 		g = cv.getGaussianKernel(m, 0); F_b = g.reshape(1,-1)*g
> 	else:
> 		F_b = np.ones((m,m), np.float32)
> 	F_id = np.zeros_like(F_b); F_id[m//2, m//2] = 1
> 	F_b /= F_b.sum() # Normalizza il filtro di blur
> 	return F_id + k*(F_id - F_b)
> 	
> img = cv.imread('esempi/kernel.png', cv.IMREAD_GRAYSCALE)
> f = create_sharpen_filter(False, 5, 2)
> res1 = sharpen(img, False, 5, 2)
> res2 = cv.filter2D(img, -1, f)
> ```

## Bordi
Possiamo considerare i bordi di un soggetto di un'immagine come il cambio rapido della funzione $f$ dove
$$
\large
f: \mathbb{R} \times \mathbb{R} \to \mathbb{R}, \text{ con } f(x,y) = I[y,x]
$$
![[Filtri_borders.png]]
>[!faq] Come trovare i cambi rapidi?

Possiamo sfruttare il [[#Filtro gaussiano|filtro gaussiano]] che, se applicato a una immagine, alla quale viene sottratto il risultato, possiamo ottenere i cambi rapidi di colore (grigio)
![[Filtri_gaussian-1.png]]

### Difference of Gaussians (DoG)
Un'immagine a cui è stata applicata il filtro gaussiano ($I * G_{\sigma}$) avrà ottenuto una riduzione delle alte frequenze.
Se tale risultato lo sottraiamo all'immagine originale ($I - (I * G_{\sigma})$)  otterremo invece le alte frequenze dell'immagine.

Dati due filtri $\large G_{\sigma_{1}}$ e $\large G_{\sigma_{2}}$ la differenza:
$$
\large
(I* G_{\sigma_{1}})- (I*G_{\sigma_{2}})
$$
evidenzia uno specifico range di frequenze dell'immagine.
Con un'opportuna normalizzazione si possono evidenziare i bordi di un determinato spessore.
![[Filtri_Difference_of_Gaussians.png]]

>[!example] Esempi
>![[Filtri_DoG_example.png]]

#### Costruzione della DoG
Prendendo la differenza di gaussiane
$$
\large
(I* G_{\sigma_{1}})- (I*G_{\sigma_{2}})
$$
grazie alla proprietà distributiva $I*(F+G)=(I*F)+(I*G)$
$$
\large
(I* G_{\sigma_{1}})- (I*G_{\sigma_{2}}) = I * (G_{\sigma_{1}-G_{\sigma_{2}}})
$$
possiamo riscriverla come
$$\large I*\text{DoG}_{\sigma_{1},\sigma_{2}} \quad \text{con} \quad \text{DoG}_{\sigma_{1},\sigma_{2}}=G_{\sigma_{1}}-G_{\sigma_{2}}$$
>[!note] Quindi possiamo usare un singolo filtro DoG
>![[Filtri_DoG_graph.png]]

## Derivata
>[!note] Definizione
>La derivata è il limite del rapporto incrementale
>$$\large f'(x)=\lim_{t \to 0}\frac{f(x+t)-f(x)}{t}$$

>[!tip] Usiamo la derivata proprio per trovare i cambi rapidi di frequenza!

Nel nostro contesto non è possibile effettuare il limite perché i valori utilizzati sono **discreti**, quindi è necessario fare una stima della derivata per un valore piccolo di $t$.
Lo facciamo mediante la differenza finita "centrata" (più accurata di altre)
$$
\large
f'(x) \approx \frac{f(x+1)-f(x)}{2}
$$
![[Filtri_derivata_centrata.png]]
### Derivate parziali
>[!tip] L'immagine è una funzione discreta di due variabili

Quindi le derivate parziali di un'immagine saranno 

$$\large \frac{\partial f(x, y)}{\partial x} \approx \frac{f(x + 1, y) - f(x - 1, y)}{2}$$
$$\large \frac{\partial f(x, y)}{\partial y} \approx \frac{f(x, y + 1) - f(x, y - 1)}{2}$$
![[Filtri_derivate_parziali.png|500]]

#### Filtro
Per applicare la derivata a un'immagine, trasformiamo la funzione nella matrice. Dato che si tratta di derivate parziali avremmo due vettori (riga e colonna).
![[Filtri_derivate_parziali_vettori.png]]
Applichiamo i vettori all'immagine nel seguente modo
![[Filtri_apply_derivata_parziale.png]]

##### Problema del rumore
Applicare le derivate parziali a un'immagine crea un'amplificazione del rumore, per ridurlo è necessario applicare un _filtro smooth_.
![[Filtri_riduzione_rumore.png]]

Per fare ciò si applica un filtro di *Smooth* ($S$) prima della *Derivata* ($D$).
Grazie alla proprietà associativa della convoluzione, si crea un unico filtro $F$: $$\large I' = (I * S) * D = I * (S * D)$$quindi
$$\large I'=I*F, \quad con \quad F = S * D$$

>[!info] La direzione di smoothing è **ortogonale** a quella di derivazione

Per trovare un bordo verticale, devi guardare come cambia l'intensità muovendoti da sinistra a destra (lungo l'asse **$x$**).
Applicando lo *smooth in verticale* ($y$), correggeremo dunque il rumore sui bordi verticali.
![[Filtri_smooth_derivata.png]]

## Filtri derivati 3x3
I principali filtri derivati 3x3 sono:
- **Prewitt**
- **Sobel**
- **Schar**
![[Filtri_derivati.png]]

>[!note] OpenCV
> ``` Python
> def derivata(img, t, d):
> 	# è praticamente un dizionario usato come switch (sceglie il metodo in base a t)
> 	s = {'Prewitt': [1,1,1], 'Sobel': [1,2,1], 'Scharr': [3,10,3]}[t]
> 	D = np.float32([-1,0,1])/2
> 	S = np.float32(s)/np.float32(s).sum()
> 	fx, fy = (D, S) if d=='x' else (S, D)
> 	return cv.sepFilter2D(img, cv.CV_32F, fx, fy)
> 	
> img = cv.imread('esempi/cat.jpg', flags=cv.IMREAD_GRAYSCALE)
> res = [(derivata(img,t,d), f'{t} ({d})') # deriviamo l'immagine
> 	for t in ('Prewitt', 'Sobel', 'Scharr') # per ogni metodo
> 		for d in ('x', 'y')] # in entrambe le direzione
> ```
> ![[Filtri_example_3x3.png]]

> [!tip] Esistono già le funzioni più ottimizzate
> - Per applicare i filtri di Sobel e Scharr utilizzare `cv.Sobel()` e `cv.Scharr()`
> - Si possono ottenere i filtri di Sobel e Scharr con `cv.getDerivKernels()`
> - Infine `cv.spatialGradient()` restituisce entrambe le derivate parziali calcolate con i filtri di Sobel non normalizzati
#### Sobel
L'operazione di Sobel non consiste in un singolo filtro, ma in una *coppia di maschere (kernel) 3x3* progettate per stimare le derivate parziali dell'intensità luminosa lungo i due assi dell'immagine:
1. Matrice $F_{x}$: rileva le variazioni in direzione orizzontale. $$\large F_x = \frac{1}{8} \begin{bmatrix} 1 & 0 & -1 \\ 2 & 0 & -2 \\ 1 & 0 & -1 \end{bmatrix}$$
2. Matrice $F_{y}$: rileva le variazioni in direzione verticale. $$\large F_y = \frac{1}{8} \begin{bmatrix} 1 & 2 & 1 \\ 0 & 0 & 0 \\ -1 & -2 & -1 \end{bmatrix}$$​
- *Differenziazione*: calcola la variazione di intensità nella direzione desiderata.
- *Smoothing (sfocatura)*: applica contemporaneamente un filtro di smooth nella direzione ortogonale a quella di derivazione. Questo rende l'operatore molto più ==robusto rispetto al rumore== di fondo dell'immagine rispetto a derivate semplici come quelle di Roberts.

## Gradiente
Il **gradiente** di un'immagine in un punto $(x,y)$ è il vettore che ha per componenti le due derivate parziali:
$$\large\nabla \mathbf{I}[y, x] = \left[ \frac{\partial \mathbf{I}}{\partial x}[y, x], \frac{\partial \mathbf{I}}{\partial y}[y, x] \right]^\top$$
>[!info] Indica la direzione di maggior variazione dell'immagine nel punto $(x,y)$.

![[Filtri_direzione_colore.png]]
### Modulo e orientazione del gradiente
Sia $\nabla = [\nabla_x,\nabla_y]^\top$ il gradiente nel punto $(x,y)$ possiamo trovare
- **Angolo**: $\theta=atan2(\nabla_x,\nabla_y)$
- **Modulo**: $|\nabla|=\sqrt{\nabla_x^2+\nabla_y^2}$

>[!warning] L'angolo è misurato in senso antiorario perché l'asse $y$ è rivolto verso il basso
>![[Filtri_direzione_gradiente.png]]

>[!note] OpenCV
> ```Python
> # trasformiamo in grayscale perchè queste operazioni si fanno sulla luminosità
> img = cv.imread('esempi/cat.jpg', flags=cv.IMREAD_GRAYSCALE)
> img = cv.GaussianBlur(img, (3,3), 0) # si usa un blur per diminuire il rumore
> 
> # Calcolo derivate parziali tramite sobel (derivate secondo x/y)
> dx,dy = cv.Sobel(img,cv.CV_32F,1,0,scale=1/8),
> 		cv.Sobel(img,cv.CV_32F,0,1,scale=1/8)
> 		
> # Calcola il modulo del gradiente in ogni pixel
> mod = cv.magnitude(dx, dy) 
> # Calcola l'angolo del gradiente in ogni pixel 
> # (selezionato in gradi, di norma è radianti)
> ang = cv.phase(dx, dy, angleInDegrees=True) 
> 
> # Disegna e stampa i dati del gradiente in un punto
> x, y = 127, 116
> w, h = 35, 25
> scale, mult = 11, 1/4
> roi = img[y-h//2:y+h//2, x-w//2:x+w//2]
> # roi_large è l'immagine ingrandita dei pixel in roi
> px, py = w//2, h//2
> p1 = (px*scale+scale//2, py*scale+scale//2)
> p2 = (int(round((px+dx[y,x]*mult)*scale)),
> 	  int(round((py+dy[y,x]*mult)*scale)))
> cv.arrowedLine(roi_large, p1, p2, (240,176,0), 3, cv.LINE_AA)
> print(f'Gradiente in ({x},{y}): ∇x={dx[y,x]:.1f}, ∇y={dy[y,x]:.1f}, ' +
> f'𝜃={ang[y,x]:.0f}°, |∇|={mod[y,x]:.2f}')
> ```
> ![[Filtri_example_direzione_gradiente.png|500]]

## Canny edge detector
L'algoritmo proposto da John F. Canny nel 1986 consiste in quattro step:
1. Smooth gaussiano dell’immagine
2. Calcolo del gradiente per ogni pixel
3. Soppressione dei non-massimi in direzione ortogonale al bordo
4. Selezione dei bordi significativi mediante isteresi

![[Filtri_canny_steps.png]]
### Soppressione dei non-massimi in direzione ortogonale al bordo

>[!info] **Obiettivo**: eliminare dall'immagine del modulo del gradiente tutti i pixel in cui il modulo del gradiente non è massimo locale rispetto all'orientazione del gradiente.
>Immaginiamo di vedere una catena montuosa dall'alto, noi dobbiamo selezionare solo la cresta.

![[Filtri_soppressione.png]]

#### Verificare la condizione di massimo locale nell’intorno 3x3:

![[Filtri_calcolo_soppressione.png|500]]
1) Calcoliamo $d$ ovvero lo **spostamento verticale** ed è calcolato come il rapporto tra le componenti del gradiente:$$\large d = \frac{\nabla y[p]}{\nabla x[p]}$$
2) Calcoliamo ora il modulo del gradiente in $p1$ e $p2$ ,ovvero i pixel vicini seguendo l'orientamento del gradiente)

$$\large ||\nabla[p_1]|| \cong d \cdot ||\nabla[p_B]|| + (1 - d) \cdot ||\nabla[p_A]||$$
$$\large ||\nabla[p_2]|| \cong d \cdot ||\nabla[p_F]|| + (1 - d) \cdot ||\nabla[p_E]||$$
	In questo modo usiamo $d$ come peso per i due pixel _reali_


3)  Il pixel $p$ viene mantenuto **solo se** è un massimo locale, ovvero: $$\large ||\nabla[p]|| \geq ||\nabla[p_1]|| \quad \wedge \quad ||\nabla[p]|| \geq ||\nabla[p_2]||$$
#### Selezione dei bordi significativi mediante isteresi
In questo momento quindi abbiamo i bordi evidenziati in base al modulo del gradiente in quei precisi pixel, e possiamo notare come alcuni siano più marcati e altri no.
![[Filtri_isteresi.png|500]]
> [!question] Non basta mettere una soglia?
> **No**, poichè il rumore può portare a dei bordi non voluti

> [!important] Isteresi
> Scegliamo due soglie $T_1$ e $T_2$ con $T_1 < T_2$
> - sono inizialmente considerati validi solo i pixel in cui il modulo del gradiente è superiore a $T_1$
> - i pixel il cui modulo è compreso tra $T_{1}$ e $T_{2}$ sono considerati validi solo se adiacenti a pixel validi

>[!note] OpenCV
> ``` Python
> # Caricamento immagine
> img = cv.imread('filtri/thunderbirds.jpg')
> # Smooth gaussiano con filtro sxs e sigma calcolato da OpenCV
> blurred = cv.GaussianBlur(cv.cvtColor(img, cv.COLOR_BGR2GRAY), (s, s), 0)
> # Algoritmo di Canny con soglie t1 e t2
> edges = cv.Canny(blurred, t1, t2)
> img_e = img.copy()
> img_e[edges!=0] = (0,255,255)
> ```
> ![[Filtri_example_isteresi.png]]





