Le **risorse** sono file aggiuntivi e contenuti statici utilizzati dal codice (es. bitmap, definizioni di layout, stringhe dell'interfaccia utente, istruzioni di animazioni, ecc.).
Sono importanti per
- separare la presentazione dei dati dalla loro gestione
- gestire specifiche configurazioni del device (lingua, dimensione schermo, ecc.)

La **classe R** permette l'accesso alle risorse del progetto tramite ID, secondo la sintassi: `[<package_name>.]R.<resource_type>.<resource_name>` dove
- `<package_name>` è il nome del package in cui la risorsa è localizzata
- `<resource_type>` è il nome del tipo di risorsa
- `<resource_name>` è il nome del file (senza estensione) oppure il valore che si trova nell'attributo `android:name`dell'elemento XML

> [!example] Accesso alle risorse
> ```kotlin
> // Load a background for the current screen from a drawable resource.
> window.setBackgroundDrawableResource(R.drawable.my_background_image)
> 
> // Set the Activity title by getting a string from the Resources object, because
> //  this method requires a CharSequence rather than a resource ID.
> window.setTitle(resources.getText(R.string.main_title))
> 
> // Load a custom layout for the current screen.
> setContentView(R.layout.main_screen)
> 
> // Set a slide in animation by getting an Animation from the Resources object.
> flipper.setInAnimation(AnimationUtils.loadAnimation(this,
>         R.anim.hyperspace_in))
> 
> // Set the text on a TextView object using a resource ID.
> val msgTextView = findViewById(R.id.msg) as TextView
> msgTextView.setText(R.string.hello_message)
> ```
## Cartelle
Le risorse sono divise nel seguente modo in directory
![[resources_directories.png]]

| Directory   | Resource Type                                                                                                                                                                                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `animator/` | XML files that define Property animations.                                                                                                                                                                                                                                     |
| `anim/`     | XML files that define Tween animations. Property animations can also be saved in this directory, but the `animator/` directory is preferred for property animations to distinguish between the two types.                                                                      |
| `color/`    | XML files that define a state list of colors. See: Color state list resource.                                                                                                                                                                                                  |
| `drawable/` | Bitmap files (PNG, `.9.png`, JPG, or GIF) or XML files compiled into drawable resource subtypes: Bitmap files, Nine-patches (re-sizable bitmaps), State lists, Shapes, Animation drawables, Other drawables. See: Drawable resources.                                          |
| `mipmap/`   | Drawable files for different launcher icon densities. See: Put app icons in mipmap directories.                                                                                                                                                                                |
| `layout/`   | XML files that define a user interface layout. See: Layout resource.                                                                                                                                                                                                           |
| `menu/`     | XML files that define app menus, such as an options menu, context menu, or submenu. See: Menu resource.                                                                                                                                                                        |
| `raw/`      | Arbitrary files to save in their raw form. Open with `Resources.openRawResource()` using `R.raw.filename`. For access to original filenames/hierarchy, use `assets/` instead (read via `AssetManager`).                                                                        |
| `values/`   | XML files with simple values (strings, integers, colors). Each child of `<resources>` defines a single resource. Conventions: `arrays.xml` (Typed arrays), `colors.xml` (Color values), `dimens.xml` (Dimension values), `strings.xml` (String values), `styles.xml` (Styles). |
| `xml/`      | Arbitrary XML files readable at runtime via `Resources.getXML()`. Used for configuration files such as Search configuration.                                                                                                                                                   |
| `font/`     | Font files (TTF, OTF, TTC) or XML files with a `<font-family>` element. See: Add a font as an XML resource.                                                                                                                                                                    |

^09e8fd

>[!warning] Attenzione
>Non ha più senso avere in `res/`:
>- Layout XML e menu (`layout/` e `menu/`): ora si definisce tutto tramite funzioni `{kotlin}@Composable`
>- Stili e Temi XML (`values/themes.xml` o `colors.xml`): il tema dell'app si gestisce tramite l'oggetto _MaterialTheme_
>- Dimensioni (`values/dimens.xml`): in [[Jetpack Compose|Compose]] è prassi comune definire le spaziature direttamente in classi [[Kotlin]] 
>  (es. `{kotlin} object Spacing {val Medium = 14.dp }`)

### Supporto diversi device
Per specificare configurazioni alternative  bisogna creare una cartella in `res/` con il nome:
```
<resources_name>-<qualifier>
```
Dove
- `<resources_name>` sono i nomi delle sottocartelle che abbiamo appena visto
- `<qualifier>` specifica una configurazione


  >[!important] Bisogna separare con `-` se si vuole usare più qualifier
  
  
>[!example] Esempio
>`drawable-en-rUS-land` indica che si applica ai dispositivi con orientamento orizzontale in lingua inglese statuintense .

>[!warning] I qualifier devono essere inseriti  nell'ordine in cui sono disposti nella [[#^09e8fd|tabella]].

## Configurazione
È sempre importante specificare delle _risorse di default_ perché nel caso [[Android]] non dovesse riuscire a trovare il match esatto per il dispositivo l'app crasha.

