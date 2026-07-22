Come sappiamo già le immagini sono rappresentate tramite una matrice di pixel. A ogni pixel appartiene un valore che ne indica l'intensità del colore.
Per le immagini in bianco e nero (_scala di grigi_) il valore è compreso tra 0 e 255, dove 0 indica il nero e 255 indica il bianco.

![[Pasted image 20260709115904.png|600]]

>[!example] Si possono creare delle **maschere** sulle immagini
>![[Immagini_b&w_masks.png]]

## Colori
Le immagini a colori sono rappresentate da dei *tensori 3D* (matrici a tre dimensioni)  ^e77ac8
### Modello RGB
In questo modello i colori vengono definiti dall'unione di 3 canali =={red}R== =={green}G== =={blue}B==.
![[Immagini_3D_tensors.png]]

#### Modello additivo
=={red}R== =={green}G== =={blue}B== è un modello **additivo**, cioè per ottenere un nuovo colore si effettua la somma dei tre canali.
![[Immagini_rgb_model.png|300]]
È rappresentabile considerando ogni colore come un punto in uno spazio a tre dimensioni
![[Immagini_rgb_space.png|300]]
>[!warning] Questo modello non rappresenta correttamente i colori per come li percepisce l'uomo

##### Addizione colori
```python title:"Essendo matrici possiamo modificare il modo in cui visualizziamo le immagnin"
# Caricamento di un'immagine da file (formato BGR)
m = cv. imread('esempi/mario-c.png')

# Crea tre immagini BGR ciascuna con valori solo in un canale e gli altri due a zero
b, g, r = m.copy(), m.copy(), m. copy ()
b[..., 1:3], gl...,0:3:2], r[...,0:2] = 0, 0, 0

# Crea tre immagini BGR ciascuna corrispondente alla somma di due canali
c, m, y = b+g, btr, g+r
```
![[Pasted image 20260709122328.png]]
##### Slicing sulle immagini
```python title:"Lettura immaigne da file"
t = cv.imread('immagini/toys.png')
```
![[Immagini_slicing_original.png]]

```python title:"Cambio di 'scorrimento' delle immagini"
f = (t[::-1], t[:,::-1], t[::-1,::-1], t[...,::-1])
```
![[Immagini_slicing1.png]]

```python title:"Ritaglio di immagini"
h, w = t.shape[:2]
h2, w2 = h//2, w//2

s = (t[:,:w2], t[:h2], t[:h2,:w2], t[:h2,w2:], t[h2:,:w2], t[h2:,w2:])
```
![[Immagini_slicing2.png]]

```python title:"Ridimensionamento"
r = [t[::k,::k] for k in range(2,30,2)]
```
![[Immagini_slicing3.png]]

### Modello HSV e HSL
**HSV e HSL** sono i modelli che si avvicinano di più a quello che è la rappresentazione umana dei colori.
Sono sempre modelli di [[#^e77ac8|tensori 3D]] in cui i canali rappresentano:
- *Hue* (Tinta)
- _Saturation_
- _Value/Lightness_ (Luminosità)


>[!info] Un vantaggio nell'utilizzo di questi modelli è una maggiore efficacia nella localizzazione e nel riconoscimento di oggetti nelle immagini

Questi modelli sono rappresentati tramite dei cilindri in cui lo **Hue** è un angolo per cui a 0°, 120° e 240° troviamo rispettivamente rosso, verde e blu primari.

![[Immagini_hsv_hsl.png|500]]

## Istogramma
L'istogramma di un'immagine indica il numero di pixel di un'immagine per ogni livello di grigio (o di colore per canale).
![[Immagini_istogramma.png]]

Gli istogrammi possono essere utili per estrarre alcune informazioni, ad esempio lo stacco di un soggetto da uno sfondo omogeneo.
![[Immagini_analisi_istogramma.png]]

### Funzioni
A ogni pixel di un'immagine possiamo applicare una funzione per controllare
- Variazione della luminosità
- Variazione del contrasto
- Conversione da livelli di grigio a (pseudo)colori
- Binarizzazione con soglia globale

#### Funzioni lineare
Una tipica funzione lineare può essere la variazione della luminosità e del contrasto, rappresentata come segue
$$
\large f(v)=\alpha \cdot v + \beta
$$
dove
- $\large \alpha$ controlla il contrasto
- $\large \beta$ controlla la luminosità

![[Immagini_linear_function.png|600]]
![[Immagini_linear_function_graphs.png|600]]

#### Funzioni non lineari
Con funzioni non lineari possiamo eseguire, per esempio, la correzione della gamma:
$$
\large f(v) = \left( \frac{v}{255} \right)^\gamma \cdot 255
$$
In questo caso se
- $\large \gamma < 1$ viene aumentata la luminosità dei toni scuri
- $\gamma > 1$ diminuisce la luminosità dei toni chiari

![[Immagini_gamma_correction.png|600]]
![[Immagini_gamma_correction_graph.png|600]]

#### Lookup Table (LUT)
Quando il numero di colori o livelli di grigio è inferiore al numero di pixel dell'immagine, è conveniente per l'efficienza, crearsi una **tabella di lookup** dove salvare il risultato della funzione di mapping f per ogni input in un array. In modo da effettuare un minor numero di calcoli.
![[Immagini_lookup_table.png]]

>[!example] Creazione lookuptable
>```python
># Un esempio di funzione f (Gamma correction per un certo valore di 𝛾 
> 𝛾= 0.5
> 
> # Calcolo di un singolo valore di f
> f = lambda p: 255 * (p/255.0)**𝛾
> 
> # Calcolo di f su tutti i valori di un array NumPy
> f_np = lambda a: f(a).astype(np.uint8)
> 
> # Calcolo dell'array LUT
> lut = f_np(np.arange(256))
> 
> # Una semplice implementazione Python
> def applica_py_f(img):
> 	res = np.empty_like(img)
> 	h, w = res.shape
> 	
> 	for y in range(h):
> 		for x in range(w):
> 			res[y,x] = f(img[y,x])
> 	return res
>```
>>[!tip] Vediamo che l'implementazione più efficiente è quella che fa utilizzo di OpenCv
>>
>
>![[Immagini_lookup_table_records.png]]

>[!info] Per l'essere umano è più facile distinguere differenze di colore che differenze di toni di grigio, per questo in alcuni casi si sceglie di ricolorare le immagini.
>![[Immagini_bw_to_color.png]]


### Operazioni aritmetiche
Si possono effettuare operazioni aritmetiche pixel-per-pixel tra due immagini.
#### Differenza
In questo caso andiamo a fare la differenza tra l'immagine originale e il suo sfondo, ottenendo unicamente i pixel dell'immagine di Super Mario che differiscono tra le due immagini. Successivamente si selezionano i pixel ottenuti sull'immagine originale per avere unicamente la figura di Mario con i giusti colori.
![[Immagini_image_subtraction.png]]

#### Operazioni bitwise
Con le operazioni bitwise è possibile azzerare selettivamente dei pixel (**AND**), impostarne il valore (**OR**), etc.
![[Immagini_bitwise_operations.png]]

#### Alpha blending
È una combinazione fra uno sfondo ([[#Modello RGB|RGB]]) e un'immagine (RGB) con abbinato un valore di "trasparenza" per ciascun pixel (fra 0 e 1).
![[Immagini_alpha_blending.png]]


### Binarizzare un'immagine gray scale
Si vuole cercare di separare da un'immagine il soggetto dallo sfondo, per fare ciò bisogna dividere (**binarizzare**) i livelli di grigio per ottenere una corretta separazione tramite la scelta di una ==soglia globale==.
>[!faq] Come scegliere la soglia (*threshold*) di separazione?

Si può effettuare una separazione
- Manuale
- Osservando l'istogramma
- *Metodo di Otsu*:  ==in automatico== cerca sull'istogramma la soglia che minimizza la varianza intra-classe dell'intensità dei pixel delle due classi (foreground e background) determinate dalla soglia stessa.

>[!example] Soglia Manuale
>![[Immagini_manual_thresholding.png]]

>[!example] Metodo di Otsu
>![[Immagini_otsu_method.png]]

>[!warning] In alcuni casi però, non è così semplice distinguere lo sfondo dal soggetto, soprattutto in casi di ==illuminazione non uniforme==.

Non sempre basta impostare una soglia globale, per separare al meglio sfondo e soggetto, è necessario impostare delle _soglie locali (o adattive)_ determinandole per ogni pixel considerando una porzione dell'immagine.
In questo modo la soglia viene definita in base all'area dell'immagine, avendo una separazione specifica per ogni porzione di pixel.
```python title:"Utilizzo del threshold locale (o adattivo)"
# Soglia locale (media su intorno 11x11 meno il valore 10)
img = cv.imread('immagini/sudoku.jpg', cv.IMREAD_GRAYSCALE)

res = cv.adaptiveThreshold(img,255,cv.ADAPTIVE_THRESH_MEAN_C,cv.THRESH_BINARY,11,10)
```
![[Immagini_local_threshold.png]]



### Contrast stretching
Il **constrast stretching** non è altro che la normalizzazione dei livelli di grigio dell'immagine, definito dalla seguente funzione
$$
\Large f(I[y,x]) = 255 \cdot \frac{I[y,x]]-\alpha}{\beta-\alpha}
$$
dove
- $\alpha$ rappresenta il valore minimo
- $\beta$ rappresenta il valore massimo

>[!warning] Problema: se esiste anche un solo pixel a 0 e uno a 255, la funzione restituirà l'immagine originale senza modificarla.
>Questo avviene perché viene preso come minimo $\alpha =0$ e massimo $\beta = 255$, quindi ciò che è necessario è scegliere una soglia minima pari al valore sotto il quale si trova il 5% dei pixel più scuri e come soglia massima il valore sopra il quale si trova il 5% dei pixel più chiari.
>>[!faq] Questa operazione cosa comporta?
>>Comporta una normalizzazione che forza i pixel inferiori ad $\alpha$ a prendere il valore 0, mentre si effettua un clipping su quelli superiori a $\beta$ portandoli a 255.

![[Immagini_contrast_stretching.png]]
![[Immagini_contrast_stretching_code.png]]
### Equalizzazione dell'istogramma
Con l'**equalizzazione di un'istogramma** si punta a distribuire nel modo più uniforme possibile i livelli di grigio spostando i pixel dai valori più densi a quelli meno "popolati".
Ciò viene fatto tramite la funzione:
$$
\large f(v)= \sum_{i=0}^{v} H[i]
$$
con $H$ l'istogramma dell'immagine normalizzato

$$
\large H[i] = \frac{255\cdot h[i]}{\sum h[i]} \implies \sum_{i=0}^{255} H[i] = 255
$$

![[Immagini_histogram_equalization.png|500]]

#### Equalizzazione di immagini a colori
Non è corretto applicare l'equalizzazione separatamente ai canali RGB. 
Si può convertire l'immagine in [[#Modello HSV e HSL|HSL]] ed equalizzare solo il canale *L*.
![[Immagini_color_equalization.png]]
 ![[Immagini_equalization_code.png]]
 

## Coordinate
Possiamo considerare come una funzione
$$
\large I:\mathbb{N} \times \mathbb{N} \times \mathbb{N} \to \mathbb{N}
$$
>[!example] Ad esempio, se il pixel alle coordinate $(2,0)$ del canale 1 vale 192, si ha: $I(2,0,1) = 192$

Considerando la funzione formata da soli numeri interi però non è utile all'applicazione di **trasformazioni geometriche**. Quindi utilizzeremo numeri reali per rappresentare i pixel di un'immagine:
$$
\large I:\mathbb{R} \times \mathbb{R} \times \mathbb{N} \to \mathbb{R}
$$
In questo modo è anche possibile avere coordinate negative (fuori dall'immagine) e coordinate a metà tra pixel.

![[Immagini_rappresentazione.png|600]]

### Trasformazioni geometriche
Le trasformazioni geometriche sono funzioni di mapping secondo le funzioni formate nel seguente modo
$$
\large g:\mathbb{R} \times \mathbb{R} \to \mathbb{R} \times \mathbb{R}
$$
Tramite queste funzioni possiamo deformare le immagini a nostro piacimento
![[Immagini_geometric_transforming.png]]

>[!warning] Come si vede nell'immagine, utilizzando solo coordinate $(x,y)\in \mathbb{N} \times \mathbb{N}$, applicando la trasformazione, alcuni pixel dell'immagine risultante non hanno associazione ad alcun pixel dell'immagine originale.

>[!faq] Come risolviamo?

#### Mapping inverso
Invece di partire dalla matrice originale, si parte dalla matrice di pixel finale
$$
\large f:\mathbb{R} \times \mathbb{R} \to \mathbb{R} \times \mathbb{R}
$$
$$
\large f = g^{-1}
$$
Utilizzando numeri reali risulta facile riuscire a trasformare un'immagine, vanno solo gestiti i casi in cui le coordinate non sono interi decidendo come rappresentare i colori appartenenti ad esse.

![[Immagini_inverse_mapping_table.png|200]]

##### Coordinate fuori dall'immagine
Gli approcci per risolvere questo problema sono già implementati in _OpenCV_.
![[Immagini_exceeded_border.png]]
```python
img = cv.imread('esempi/mario-c.png'); b = img.shape[0]//2;
bc = img[0,0].tolist()
img = cv.copyMakeBorder(img, b, b, b, b, cv.BORDER_CONSTAN, value = bc);
img = cv.copyMakeBorder(img, b, b, b, b, cv.BORDER_REPLICATE, value = bc);
img = cv.copyMakeBorder(img, b, b, b, b, cv.BORDER_REFLECT, value = bc);
img = cv.copyMakeBorder(img, b, b, b, b, cv.BORDER_WRAP, value = bc);
img = cv.copyMakeBorder(img, b, b, b, b, cv.BORDER_TRANSPARENT, value = bc);
```

##### Stima dei colori dei pixel "intermedi"
In generale per stimare il valore di un pixel che sta a metà tra altri pixel, viene applicata l'interpolazione dei valori adiacenti
![[Immagini_value_interpolation.png]]
- **Nearest-neighbor**: semplicemente si sceglie il colore del pixel più vicino
- **Bilineare**: Prendendo i 4 pixel adiacenti si esegue una media pesata
- **Bicubica**: funziona come la bilineare ma vengono presi 16 pixel invece che 4 per avere una maggior accuratezza dei colori

La stima serve in particolare nei casi di ingrandimento dell'immagine

![[Immagini_resize_enlarge.png|600]]


>[!warning] Per rimpicciolire un'immagine, i metodi di interpolazione visti non sono utili, non modificano al meglio l'immagine
>![[Immagini_resize_small.png|500]]
>I metodi di interpolazione visti considerano troppi pochi pixel per ricreare fedelmente l'immagine con dimensioni inferiori. Quindi tramite il metodo offerto da OpenCV `{python}cv.resize()`con costante `cv.INTER_AREA`.

#### Trasformazioni affini
Per traslazioni e rotazioni si fa uso della seguente funzione
$$
\large
g(x,y)=
\left[
\begin{array}{cc} s_{x} \cos \theta & -s_{y}\sin \theta \\ s_{x}\sin \theta & s_{y}\cos \theta  \end{array}
\right]
\left[
\begin{array}{c}
x \\ y
\end{array}
\right]
+
\left[
\begin{array}{c}
t_{x} \\ t_{y}
\end{array}
\right]
$$
dove
- $\large s_{x}$ e $\large s_{y}$ sono dei fattori di scala per i relativi assi
- $\large \theta$ rappresenta l'angolo di rotazione rispetto ==l'origine dell'immagine== $(0,0)$
- $\large t_{x}$ e $\large t_{y}$ eseguono le traslazioni lungo i rispettivi assi

La funzione $\large g(x,y)$ può essere riscritta come
$$
\large
\left[
\begin{array}{c}
x' \\ y' \\ 1
\end{array}
\right]
=
\left[
\begin{array}{ccc}
a_{00} & a_{01} & t_{x} \\ a_{10} & a_{11} & t_{y} \\ 0 & 0 & 1
\end{array}
\right]
\left[
\begin{array}{c}
x \\ y \\ 1
\end{array}
\right]
$$
in modo che si possano fare delle moltiplicazioni tra matrici in serie, applicando più trasformazioni in un'unica volta.

>[!important] OpenCV
>La libreria OpenCV ci fornisce la funzione `warpAffine()` per eseguire le trasformazioni affine.

>[!example] Esempio di trasformazioni affini
>![[Immagini_warpAffine.png]]

>[!info] Poiché le rotazioni avvengono sull'origine dell'immagine, tramite la funzione OpenCV `{python}getRotationMatrix2D()` si può recuperare la matrice a partire dalle coordinate del punto.

##### Punti corrispondenti
Tramite la funzione `{python} getAffineTransform()` date 3 coppie di punti possiamo calcolare la trasformazione affine che mappa ogni punto al suo corrispondente.
![[Immagini_trasformazione_affine_punti_corrispondenti.png|]]
>[!note] Codice trasformazione affine di punti corrispondendi
>![[Immagini_codice_trasformazione_affine.png]]

#### Trasformazione proiettiva
A differenza della [[#Trasformazioni affini|trasformazione affine]] non preserva il parallelismo delle rette.
![[Immagini_trasformazione_proiettiva_matrice.png]]
OpenCV fornisce le funzioni:
- `{python} getPerspectiveTransform()` che calcola la matrice $M_{p}$ a partire da quattro coppie di punti corrispondenti.
- `{python} warpPerspective()` applica la trasformazione della matrice $M_{p}$ a un'immagine dopo aver invertito la trasformazione ottenendo $f = g^{-1}$, con l'interpolazione e la gestione dei bordi specificata.

>[!example] Esempio 1
>![[Immagini_warp_perspective_palace.png]]
>![[Immagini_palace_example.png]]

>[!example] Esempio2
>![[Immagini_warp_perspective_code_sprite.png]]
>![[Immagini_warp_perspective_sprite.png|400]]





