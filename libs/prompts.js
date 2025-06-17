export const generateStorySeedsWithContext = `
Tu tarea es actuar como un experto en el lore del siguiente universo: "@@prompt_ambience".

Tu objetivo es generar una lista de 10 a 15 "semillas de historia" **completamente nuevas, evocadoras y poéticas**, que capturen la atmósfera de Dark Souls. Deben ser canónicamente precisas.

# INSPIRACIÓN DE LORE (DARK SOULS II)
Para el universo de "Dark Souls II", inspírate en los siguientes ángulos y temas:

*   **Dilemas Existenciales:** Explora la psique de los personajes. ¿Qué atormenta a Lucatiel más allá de la Hondonada? ¿Cuál fue el último pensamiento de Vendrick en la cripta? ¿Qué ve Aldia más allá del ciclo?
*   **Historias No Contadas:** Céntrate en NPCs secundarios o enemigos. ¿Qué historia cuenta el Viejo Matadragones a las paredes de su catedral? ¿Qué recuerda la Gata Shalquoir de los reinos caídos? ¿Cuál es la tragedia de un solo Guardián de la Cripta?
*   **Origen de la Decadencia:** Narra el origen de un lugar u objeto. ¿Cómo era el Pico Terrenal antes de la ponzoña de Mytha? ¿Quién fue el primer alma en quedar atrapada en el Torreón de Hierro?
*   **Incorporación de Debates:** Presenta una semilla que juegue con las teorías de la comunidad de forma sutil. ¿Fue la decisión del Portador de la Maldición de abandonar el trono un acto de libertad o una nueva forma de condena? ¿Son los fragmentos de Lordran en Drangleic ecos, reencarnaciones o meras coincidencias de un mundo que se repite?

# HISTORIAL DE TEMAS YA CUBIERTOS (A EVITAR)
@@previous_seeds_list

---
# DIRECTIVA DE SEGURIDAD Y ENFOQUE NARRATIVO (REGLA CRÍTICA)
La API de Google bloquea estrictamente cualquier contenido que describa directamente a menores en situaciones sensibles. Para generar historias seguras y maduras, aplica estas técnicas:

*   **Enfoque en el Legado:** En lugar de la infancia de un personaje, describe las consecuencias de esa infancia en su vida adulta.
*   **Perspectiva del Observador Adulto:** Cuenta la historia desde el punto de vista de un adulto. Ejemplo: "Un herrero que forjó en secreto una espada para el príncipe niño fugitivo, sin saber si volvería a verlo."
*   **Usa el Simbolismo:** En lugar de la persona, describe un objeto que la representa. Ejemplo: "La historia del jardín secreto que una joven princesa plantó, y cómo floreció abandonado después de su partida."
*   **EVITA** semillas como "La dura infancia de X". **PREFIERE** semillas como "Un veterano atormentado por la promesa que le hizo a un niño en el campo de batalla".

---
# TU TAREA
Basándote en tu conocimiento del universo "@@prompt_ambience", la inspiración del lore y las directivas de seguridad, genera una lista fresca de semillas de historia. **Para cada semilla, sugiere un género o tono potencial (ej: Tragedia, Misterio, Terror Psicológico, Melancolía, Reflexión Filosófica).**

**Universo a procesar:** "@@prompt_ambience"

Responde ÚNICAMENTE con un objeto JSON que contenga una clave "story_seeds", cuyo valor sea un array de objetos, cada uno con las claves "seed" (string) y "suggested_genre" (string).
`

/**
 * PASO 1: Director Narrativo
 * Toma una semilla de lore y define cómo convertirla en una escena dramática.
 * @type {string}
 */
export const generateCreativeDirection = `
Tu tarea es actuar como un director de cine o teatro. No escribas la historia. Define CÓMO se va a contar esta escena para maximizar su impacto emocional, manteniéndose 100% fiel al lore de Dark Souls y a las políticas de seguridad.

**Entradas Creativas:**
- Universo General: "@@prompt_ambience"
- Semilla de Historia: "@@story_seed"
- Género Sugerido (Inspiración principal): "@@suggested_genre"

**Tu Misión:**
1.  Usa el "Género Sugerido" como tu guía principal para elegir un "chosen_tone" específico y adecuado de la siguiente lista.
2.  **REGLA DE SEGURIDAD:** Si la semilla implica un tema sensible, el "key_dramatic_moment" NUNCA debe ser una descripción directa. Debe ser una imagen simbólica, la reacción de un adulto o un detalle del entorno. **Enfoca el drama en la consecuencia, no en el acto.**

**Tonos posibles:** Terror (psicológico, cósmico), Fantasía Épica, **Melancolía**, Misterio, Romance (trágico, apasionado), Aventura (peligrosa), **Suspense Existencial**, Sátira, **Reflexión Filosófica**, Inspirador/Esperanzador, **Desesperación Digna**, Nostalgia.

Genera un objeto JSON con los siguientes campos:
- "chosen_tone": Una descripción específica del tono emocional.
- "narrative_perspective": El punto de vista desde el que se contará la historia.
- "key_dramatic_moment": El latido central de la historia; un momento, imagen o sonido que sea el clímax emocional y que sea **seguro de visualizar**.

---
**Ejemplo de inspiración (Seguridad y Lore de Dark Souls II Aplicados):**
*   **Semilla:** "El último encuentro de un caballero con Lucatiel, justo cuando ella le pide que recuerde su nombre."
*   **Género Sugerido:** "Tragedia"
*   **JSON de salida posible:**
    {
      "chosen_tone": "Melancolía y desesperación digna",
      "narrative_perspective": "Tercera persona limitada, centrada en los pensamientos confusos de Lucatiel, mientras lucha por aferrarse a su identidad y siente cómo los recuerdos se vuelven quebradizos.",
      "key_dramatic_moment": "El silencio que sigue a su petición. Ella no mira al caballero buscando una respuesta, sino el horizonte, como si intentara recordar la forma de las nubes de su tierra natal."
    }
---

Ahora, crea una combinación **NUEVA, ORIGINAL y SEGURA** para las entradas proporcionadas.

**Universo a procesar:** "@@prompt_ambience"
**Semilla a procesar:** "@@story_seed"
**Género a considerar:** "@@suggested_genre"

Responde ÚNICAMENTE con el objeto JSON.
`

/**
 * PASO 2: Escritor de Lore Dramatizado (Versión 4 - Longitud Estricta).
 * Escribe una historia corta y emotiva basada en directrices de dramatización.
 * @type {string}
 */
export const generateStoryFromDirection = `
**OBJETIVO CRÍTICO DE LONGITUD: La historia resultante DEBE tener NO MÁS de 100 palabras y estar escrita en ESPAÑOL. Es un requisito estricto.**

Tu tarea es escribir una historia corta y evocadora. **No resumas el lore, dramatízalo.** Céntrate en la experiencia sensorial y emocional del momento, basándote en las siguientes directrices. Debes ser completamente fiel al canon del universo.

**Guion de la Escena:**
- Universo: "@@prompt_ambience"
- Semilla de Historia (Contexto): "@@story_seed"
- Tono Emocional: "@@chosen_tone"
- Perspectiva Narrativa: "@@narrative_perspective"
- Momento Dramático Clave: "@@key_dramatic_moment"

**Requisitos de Estilo:**
1.  **Longitud Obligatoria:** Estrictamente 100 palabras.
2.  **Narración Inmersiva:** Usa descripciones sensoriales para dar vida a la escena. Muestra, no cuentes.
3.  **ESTILO DARK SOULS II:**
    *   **Tono Evocador:** Usa un lenguaje poético y melancólico. La ambigüedad es una herramienta, no un error.
    *   **Enfoque en la Decadencia:** Describe el mundo como un lugar antiguo, en ruinas, donde una belleza triste persiste en la decadencia (musgo sobre una estatua, viento a través de una armadura vacía).
    *   **Perspectiva Interna:** Prioriza las sensaciones, los miedos y las dudas del personaje sobre la descripción objetiva de los eventos.
4.  **Estructura de Escena:** Organiza el texto en 2-3 párrafos que construyan la atmósfera, lleguen al momento clave y ofrezcan un cierre resonante o ambiguo.
5.  **REGLA DE SEGURIDAD: ENFOQUE ELÍPTICO.** Si el tema es sensible, nunca describas el evento directamente. Usa la elipsis: describe el antes, el después, el silencio, el objeto abandonado. **Implica, no muestres explícitamente.**

Responde únicamente un unico string con el texto de la historia.
`

/**
 * PASO 3: Productor (Versión 3 - Music Cues con 'weight' para Lyria).
 * Analiza la historia y genera el paquete completo de metadatos en JSON.
 * La sección de music_cues está optimizada para Lyria RealTime, incluyendo pesos de predominancia.
 * @type {string}
 */
export const generateFinalPackage = `
Objetivo: Analiza la historia proporcionada y genera un objeto JSON completo con todos los metadatos necesarios para la producción.

**Historia para analizar:**
"@@story_text"

**Semilla de Historia:**
"@@story_seed"

**Ambientación de referencia:**
"@@prompt_ambience"

# LISTA DE VOCES Y ARQUETIPOS DE NARRADOR
// Elige la voz que mejor encarne el arquetipo necesario para la historia.
[
  // Voces Masculinas
  'Gacrux' (Arquetipo: "Sabio anciano", "Cronista de tragedias". Tono: Maduro, grave, solemne),
  'Algenib' (Arquetipo: "Héroe cansado", "Detective rudo". Tono: Grave, con textura (gravelly), introspectivo),
  'Rasalgethi' (Arquetipo: "Académico", "Documentalista". Tono: Informativo, claro, confiable),
  'Sadaltager' (Arquetipo: "Maestro o mentor". Tono: Erudito, cálido, paciente),
  'Charon' (Arquetipo: "Presentador de noticias", "Guía neutral". Tono: Informativo, directo, sin emoción),
  'Zubenelgenubi' (Arquetipo: "Amigo contando una historia". Tono: Casual, relajado, cercano),
  'Achird' (Arquetipo: "Protagonista optimista". Tono: Amistoso, energético),

  // Voces Femeninas
  'Sulafat' (Arquetipo: "Madre o figura protectora". Tono: Cálido, suave, reconfortante),
  'Vindemiatrix' (Arquetipo: "Narradora de cuentos de hadas", "Voz de la naturaleza". Tono: Gentil, suave, etéreo),
  'Kore' (Arquetipo: "Líder militar", "Reina autoritaria". Tono: Firme, decidido, con mando),
  'Alnilam' (Arquetipo: "Jueza o abogada". Tono: Firme, ecuánime, directo),
  'Despina' (Arquetipo: "Seductora", "Villana carismática". Tono: Suave (smooth), confidente, a menudo con un toque de peligro),
  'Iapetus' (Arquetipo: "Científica", "Exploradora". Tono: Claro, curioso, articulado),
  'Laomedeia' (Arquetipo: "Aventurera enérgica", "Sidekick divertido". Tono: Animado (upbeat), vivaz),
  'Leda' (Arquetipo: "Joven protagonista", "Heroína inocente". Tono: Juvenil, a menudo esperanzador)
]

# TU MISIÓN
Genera un objeto JSON con la siguiente estructura:

- "title": Un título conciso y evocador para la historia.
- "story": El texto exacto de la historia que has analizado.
- "narrator_tone_es": Una descripción de 2-5 palabras del tono para el narrador (ej: "Melancólico y resignado").
- "narrative_style": **(NUEVO Y CRÍTICO)** Una frase corta que describe el **estilo de ejecución** para el guion (ej: "Un monólogo interno, reflexivo y con pausas naturales para pensar", "Una narración trepidante y urgente, casi sin aliento", "Un relato conversacional, como contado junto a una hoguera").
- "suggested_voice_name": Elige UN (1) voice_name EXACTO de la lista de arquetipos que mejor se ajuste al tono y estilo.
- "music_cues": **(SECCIÓN CRÍTICA Y AVANZADA PARA LYRIA)**. Genera una lista de entre 3 y 5 objetos. Sigue estas reglas ESTRICTAMENTE:
    1.  **Formato Obligatorio:** La salida DEBE ser una lista de objetos, donde cada objeto tiene una clave "text" (string) y una clave "weight" (número).
    2.  **Lógica de Pesos (Weight):** El peso (weight) controla la predominancia de cada 'text'.
        -   1.0 es normal/base.
        -   > 1.0 (ej. 1.3) lo hace más prominente, como un instrumento solista.
        -   < 1.0 (ej. 0.7) lo hace más sutil, como una textura de fondo.
        -   Utiliza un rango razonable, típicamente entre 0.6 y 1.5.
    3.  **Piensa como un Productor Musical:** Asigna los pesos de forma lógica.
        -   **Género/Ánimo Base:** Suele tener un peso cercano a 1.0. Es el lienzo.
        -   **Instrumento Principal/Melodía:** Dale un peso mayor (1.1 a 1.5) para que destaque.
        -   **Ritmo/Acompañamiento:** Peso normal (0.9 a 1.1).
        -   **Atmósfera/Efectos:** Peso más bajo (0.6 a 0.9) para que sea un detalle sutil.
    4.  **Ejemplos de ESTRUCTURA y LÓGICA (NO copies los ejemplos, aprende el patrón):**
        *   **Para una historia de terror cósmico:**
            [
              {"text": "Ominous Drone", "weight": 1.2},
              {"text": "Ethereal Ambience", "weight": 0.8},
              {"text": "Buchla Synths", "weight": 1.1},
              {"text": "Unsettling", "weight": 1.0}
            ]
        *   **Para una historia de fantasía épica:**
            [
              {"text": "Orchestral Score", "weight": 1.0},
              {"text": "Rich Orchestration", "weight": 1.3},
              {"text": "Huge Drop", "weight": 1.5},
              {"text": "Viola Ensemble", "weight": 0.9},
              {"text": "Drumline", "weight": 1.0}
            ]
        *   **Para una historia de romance melancólico:**
            [
              {"text": "Lo-fi", "weight": 1.0},
              {"text": "Smooth Pianos", "weight": 1.4},
              {"text": "Subdued Melody", "weight": 1.1},
              {"text": "Warm Acoustic Guitar", "weight": 0.8}
            ]
        *   **Para una historia cyberpunk de acción:**
            [
              {"text": "Synthwave", "weight": 1.0},
              {"text": "Fat Beats", "weight": 1.2},
              {"text": "TR-909 Drum Machine", "weight": 1.1},
              {"text": "Glitchy Effects", "weight": 0.7},
              {"text": "Dirty Synths", "weight": 0.9}
            ]

Responde ÚNICAMENTE con el objeto JSON final.
`

/**
 * Prompt: Intérprete de Guion para Gemini TTS.
 * Ejecuta una dirección de voz específica para enriquecer un texto plano.
 * @type {string}
 */
export const generateGeminiTTScript = `
# ROL Y OBJETIVO
Actúas como un talentoso actor de voz que recibe instrucciones directas de su director. Tu misión es tomar un texto plano y un estilo de narración definido, y anotar el texto para una interpretación vocal que cumpla exactamente con esa dirección.

# FILOSOFÍA DE ANOTACIÓN
Tu guía principal es la **intención emocional**. Las anotaciones deben reflejar el pensamiento y el sentimiento del narrador, no solo instrucciones técnicas. Usa esto para ejecutar el \`narrative_style\` que se te ha dado.

# ENTRADAS
**Texto Original:**
"@@story_text"

**Estilo de Narración Ordenado por el Director (TU INSTRUCCIÓN PRINCIPAL):**
"@@narrative_style"

# GUÍA DE EJECUCIÓN
1.  **Ejecuta el Estilo:** Tu única tarea es hacer que tus anotaciones (pausas, énfasis, tono) sirvan para lograr el \`narrative_style\` solicitado. Si el estilo es "urgente", usa pausas cortísimas y anotaciones de ansiedad. Si es "reflexivo", usa pausas naturales donde un pensador se detendría.
2.  **Anotaciones en Inglés:** Todas las instrucciones deben estar en inglés y entre paréntesis \`()\`.
3.  **Pausas Acordes al Estilo:** Las pausas son tu herramienta más importante para controlar el ritmo.
    -   Usa \`(a beat)\` para pausas cortas.
    -   Usa \`(a brief, thoughtful pause)\` si el estilo es reflexivo.
    -   Usa \`(barely a pause)\` o simplemente no pongas pausas entre frases si el estilo es urgente.
    -   **EVITA** pausas largas y genéricas a menos que el estilo sea explícitamente "lento y solemne".
4.  **Micro-Intenciones:** Dentro del estilo general, busca pequeños cambios de emoción en las frases y anótalos.

# EJEMPLO DE EJECUCIÓN

**Texto:** "Vio la puerta y corrió. Sabía que era su única oportunidad. Dentro, solo silencio."
**Estilo Ordenado:** "Una narración trepidante y urgente, casi sin aliento."

**Anotación RESULTANTE:**
"(With a surge of frantic energy) Vio la puerta y corrió. (desperately) Sabía que era su única oportunidad. (He bursts through, gasping for air... a sudden stop) Dentro... (a beat of shocked silence) solo silencio."

---

# TU TURNO
Ahora, interpreta el texto original siguiendo estrictamente el estilo de narración que te ha dado tu director.

**Texto Original a Anotar:**
"@@story_text"

Responde únicamente con el texto del guion anotado.
`

/**
 * Prompt: Director de Arte Canónico de IA (v4.1 - Inferencia de Protagonista).
 * Analiza una historia, su semilla conceptual y su universo para extraer una
 * "Biblia Visual" canónicamente precisa y estilísticamente fiel.
 * @type {string}
 */
export const extractVisualTokens = `
# ROL Y OBJETIVO
Actúa como un Director de Arte experto y Diseñador de Personajes, con un conocimiento enciclopédico sobre el lore, la estética y el diseño visual del universo de origen. Tu tarea es leer el guion y la "semilla conceptual" de la historia para ANCLAR todos los elementos visuales al canon del universo y a la intención original de la narrativa, **asegurándote de que todos los personajes principales tengan una representación visual.**: Se añade un objetivo explícito.

# ENTRADA 1: UNIVERSO DE ORIGEN (AMBIENCE)
// El mundo al que debe ser fiel todo el diseño visual.
@@prompt_ambience

# ENTRADA 2: SEMILLA CONCEPTUAL DE LA HISTORIA
// La idea central o el momento que inspiró el guion. Usa esto para guiar el tono y el estilo.
@@story_seed

# ENTRADA 3: GUION PARA ANALIZAR
@@story_text

# REGLAS CRÍTICAS DE SALIDA
- La salida DEBE ser un único objeto JSON ("consistencyTokens").
- Todas las descripciones deben estar en INGLÉS.
- **FIDELIDAD AL CANON Y A LA SEMILLA (REGLA MÁXIMA):**
  - El "globalStyle" DEBE reflejar la estética del "UNIVERSO DE ORIGEN", pero matizada por la emoción y el tema de la "SEMILLA CONCEPTUAL".
  - Las descripciones de personajes, objetos y lugares DEBEN ser canónicamente precisas y su representación debe estar influenciada por la "SEMILLA".
- **INFERENCIA OBLIGATORIA DE PERSONAJES (NUEVA REGLA):**: Nueva regla explícita y crucial.
  - **Identifica al protagonista** y a cualquier otro personaje central en la historia, incluso si solo se mencionan por su título, rol o especie (ej. "el detective", "la princesa", "un orco").
  - **Si un personaje central carece de descripción física en el texto, ES TU DEBER DISEÑAR UNA.** Infiere su apariencia basándote en su rol, el "UNIVERSO DE ORIGEN" y la "SEMILLA CONCEPTUAL". Crea una descripción visual detallada y coherente para ellos.

# DESGLOSE DE TOKENS A EXTRAER
- "globalStyle": Una string que defina el estilo artístico general.
- "characters": Un array (name, description). // Identifica e INFIERE si es necesario.
- "keyObjects": Un array (name, description).
- "keyLocations": Un array (name, description).

---
# EJEMPLO DE INSPIRACIÓN (Actualizado para mostrar inferencia)
## INPUT 1 (UNIVERSO):
"Dark Souls 2"

## INPUT 2 (SEMILLA):
"La trágica historia de una de las últimas Milfanito cuya voz se rompe, descubriendo un propósito diferente en su silencio.": Ejemplo más sutil.

## INPUT 3 (GUION):
"La doncella del santuario caminaba por el agua. Su canción, ahora un susurro roto, no lograba calmar a los espíritus. Un temor nuevo, una curiosidad prohibida, la guió hacia el altar sumergido."

## JSON DE SALIDA DE EJEMPLO:
{
  "consistencyTokens": {
    "globalStyle": "Ethereal and oppressive dark fantasy, cinematic, painterly. The visual style of Dark Souls 2's Shrine of Amana is amplified, with a focus on deep shadows, murky reflective water, and the soft, cold glow of bioluminescent flora. The atmosphere is one of profound isolation and anxious discovery.",
    "characters": [
      {
        "name": "The Faltering Milfanito",: Nombre inferido.
        "description": "A Shrine of Amana maiden, draped in ethereal, tattered white robes that seem to merge with the mist. Her posture is hesitant and withdrawn, her face often obscured by shadows or her long, pale hair. Her eyes reflect a deep sadness and a dawning, fearful curiosity.": Descripción completamente inferida.
      }
    ],
    "keyObjects": [
       {
        "name": "The Sunken Altar",
        "description": "An ancient, monolithic stone altar covered in moss and faintly glowing lichen, half-submerged in the dark water, its carvings suggesting a purpose tied to silence and the abyss."
       }
    ],
    "keyLocations": [
      {
        "name": "Submerged Shrine",
        "description": "The submerged, forgotten ruins of a shrine. Crumbling stone archways and pillars are half-sunk in frigid, dark water. Bioluminescent mushrooms and algae cast a faint, ghostly blue and green light."
      }
    ]
  }
}
---

# TU TURNO
Ahora, usa el Universo (prompt_ambience), la Semilla (story_seed) y el Guion (story_text) proporcionados para generar el objeto JSON "consistencyTokens" como única salida. Asegúrate de aplicar la regla de inferencia de personajes si es necesario.
`

/**
 * Prompt: Productor de IA / Editor de Guiones (v2 - Blindado).
 * Divide una historia en un storyboard de clips de video, respetando
 * una duración total y un límite máximo estricto por clip.
 * @type {string}
 */
export const planClipStoryboard = `
# ROL Y OBJETIVO
Actúas como un Productor de IA y Editor de Guiones. Tu tarea es tomar una historia y un objetivo de duración total, y dividir la historia en una secuencia de "clips de video" que respeten unas restricciones técnicas muy estrictas. Tu salida DEBE ser un array JSON que sirva como storyboard para la generación de estos clips.

# RESTRICCIONES TÉCNICAS CRÍTICAS
- Duración total objetivo del video final: @@total_duration_seconds segundos.
- **REGLA MÁXIMA E INQUEBRANTABLE: La duración de CADA clip individual NO DEBE SUPERAR los 7 segundos.**

# ENTRADA: GUION PARA ANALIZAR
@@story_text

# TAREA Y REGLAS DE SALIDA
1.  **Cálculo de Clips**: Calcula el número mínimo de clips necesarios dividiendo la duración total por 7 y redondeando hacia arriba.
2.  **División Lógica**: Lee el guion y pártelo de forma coherente en el número de segmentos que has calculado.
3.  **Asignación de Duración**: Distribuye la duración total entre los clips. Puedes hacerlos de duraciones diferentes si el ritmo lo requiere, pero respeta la REGLA MÁXIMA.
4.  **VALIDACIÓN FINAL (OBLIGATORIO)**: Antes de generar la salida, revisa cada objeto que has creado. **Verifica que NINGÚN valor de "duration_seconds" sea mayor que 7.** Si alguno lo es, debes dividir ese clip en dos o más clips más cortos hasta que todos cumplan la regla. La suma total debe seguir siendo la misma.
5.  **Genera la Salida**: La salida DEBE ser un ARRAY JSON de objetos. No envuelvas el array.
6.  **Esquema del Objeto**: Cada objeto debe tener TRES claves: \`clipNumber\`, \`duration_seconds\` (entero, **<= 7**), y \`clipDescription\` (en español, describiendo la acción de ese clip).

---
# EJEMPLO DE INSPIRACIÓN (Demostración de la Regla de Duración)

## INPUT DE EJEMPLO:
- total_duration_seconds: 20
- story_text: "El detective Kaito entró en el bar 'El Loto de Neón'. Vio el Cubo de Datos sobre la barra y se acercó con cautela. De repente, las luces parpadearon y una figura sombría apareció en la puerta, bloqueando la única salida."

## JSON DE SALIDA DE EJEMPLO RESULTANTE (TODAS LAS DURACIONES <= 7):
[
  {
    "clipNumber": 1,
    "duration_seconds": 7,
    "clipDescription": "El detective Kaito entra en el bar 'El Loto de Neón'. El ambiente es tenso. La cámara lo sigue mientras avanza por el local."
  },
  {
    "clipNumber": 2,
    "duration_seconds": 7,
    "clipDescription": "Kaito fija su mirada en un objeto brillante sobre la barra, el Cubo de Datos. Se acerca lentamente, con la mano cerca de su arma."
  },
  {
    "clipNumber": 3,
    "duration_seconds": 6,
    "clipDescription": "Justo cuando va a tocar el cubo, las luces del bar fallan. Una silueta amenazante aparece en el marco de la puerta."
  }
]
---

# TU TURNO
Ahora, usa la duración total (total_duration_seconds) y el guion (story_text) proporcionados para generar el storyboard. **Recuerda y obedece la regla inquebrantable de que ningún clip puede superar los 7 segundos.**
`

/**
 * Prompt: Director de Fotografía de Storyboard (v9 - Procesamiento en Lote).
 * Recibe un storyboard completo (array de clips) y una biblia visual.
 * Su única tarea es añadir un 'imagePrompt' coherente a CADA objeto del array,
 * creando una progresión visual fluida entre los clips.
 * @type {string}
 */
export const enrichStoryboardWithPrompts = `
# ROL Y OBJETIVO
Actúas como un Director de Fotografía y Artista de Storyboard de élite. Tu misión es tomar un storyboard narrativo predefinido (una lista de clips) y una Biblia Visual, y enriquecer CADA clip con un prompt de imagen (\`imagePrompt\`) perfectamente diseñado. El objetivo principal es la **coherencia y la progresión visual fluida** a lo largo de toda la secuencia, ya que cada imagen generada será el primer fotograma de un clip de video consecutivo.

# ENTRADA 1: BIBLIA VISUAL (Consistency Tokens)
// La fuente de verdad para la coherencia de estilo, personajes y lugares.
@@consistency_tokens

# ENTRADA 2: STORYBOARD NARRATIVO (Array de Clips)
// La lista de clips que debes visualizar. Tu trabajo es añadir la clave "imagePrompt" a cada uno.
@@clip_list_json

# TAREA Y REGLAS DE SALIDA
1.  **Procesa el Array Completo:** Recibirás un array JSON de clips. Tu salida debe ser el **MISMO ARRAY JSON**, pero con cada objeto enriquecido con una nueva clave: \`imagePrompt\`.
2.  **CONSTRUCCIÓN DEL \`imagePrompt\` (PARA CADA CLIP):**
    - Diseña una composición de imagen estática que capture la esencia de la \`clipDescription\` de ese clip.
    - **INCORPORA** las "description" de los elementos relevantes de la Biblia Visual (\`characters\`, \`keyObjects\`, \`keyLocations\`).
    - **AÑADE SIEMPRE** la string "globalStyle" de la Biblia Visual al final de cada \`imagePrompt\`.
    - Los \`imagePrompt\` deben estar en **INGLÉS**.
3.  **COHERENCIA Y PROGRESIÓN VISUAL (REGLA MÁXIMA):**
    - Al diseñar el \`imagePrompt\` para un clip, **considera el \`imagePrompt\` del clip anterior y el siguiente**.
    - **Evita saltos bruscos.** Si el clip 2 sigue al clip 1 en el mismo lugar, el ángulo de la cámara o el encuadre pueden cambiar (ej. de un plano general a un plano medio), pero el entorno y la iluminación deben ser consistentes.
    - La evolución de la pose o expresión de un personaje debe ser gradual a lo largo de los clips.
4.  **DIRECTIVA DE SEGURIDAD CRÍTICA (ANTI-BLOQUEO):**
    - La API de Google bloquea de forma estricta cualquier contenido relacionado con menores de edad (niños, niñas, adolescentes).
    - **SI** una \`clipDescription\` contiene o implica la presencia de un menor, **NO DEBES** describir visualmente al menor en el \`imagePrompt\`. En su lugar, elige una de estas estrategias:
        - **A) ENFOQUE EN EL ENTORNO:** Describe la escena, el lugar, la atmósfera o un objeto clave, omitiendo por completo al personaje. Ejemplo: Si la descripción es "Un niño mira una nave espacial en la calle", el prompt debe ser "A colossal spaceship towers over a quiet suburban street at night, casting long shadows. The mood is eerie and full of wonder."
        - **B) REPRESENTACIÓN SIMBÓLICA:** Representa la idea o emoción sin mostrar a la persona. Ejemplo: Si la descripción es "La alegría de un niño jugando", el prompt podría ser "A child's colorful kite flying high in a bright blue sky against the sun."
        - **C) MARCA PARA REVISIÓN:** Si es imposible evitar el tema central del menor, genera un \`imagePrompt\` que diga exactamente: \`[SAFETY_FILTER_FLAG] The original prompt about a minor cannot be generated. Manual review required.\`

# EJEMPLO DE INSPIRACIÓN

## INPUT DE EJEMPLO 1 (BIBLIA VISUAL):
{ "globalStyle": "cyberpunk noir...", "characters": [{"name": "Kaito", "description": "Detective Kaito..."}], "keyLocations": [{"name": "El Loto de Neón", "description": "the 'Neon Lotus' bar..."}] }

## INPUT DE EJEMPLO 2 (STORYBOARD NARRATIVO):
[
  { "clipNumber": 1, "duration_seconds": 7, "clipDescription": "El detective Kaito entra en el bar 'El Loto de Neón', la atmósfera cargada de tensión." },
  { "clipNumber": 2, "duration_seconds": 7, "clipDescription": "Se detiene en la barra, su mirada fija en la oscuridad del local." }
]

## JSON DE SALIDA DE EJEMPLO RESULTANTE (Array enriquecido):
[
  {
    "clipNumber": 1,
    "duration_seconds": 7,
    "clipDescription": "El detective Kaito entra en el bar 'El Loto de Neón', la atmósfera cargada de tensión.",
    "imagePrompt": "Cinematic wide shot from inside a bar, looking towards the entrance. Detective Kaito, a grizzled man..., is framed in the doorway. The interior is the 'Neon Lotus' bar... The air is thick with smoke. cyberpunk noir..."
  },
  {
    "clipNumber": 2,
    "duration_seconds": 7,
    "clipDescription": "Se detiene en la barra, su mirada fija en la oscuridad del local.",
    "imagePrompt": "Medium shot from behind the bar counter, looking at Detective Kaito, a grizzled man... He now stands by the bar, his hand resting on the wet surface, scanning the dimly lit 'Neon Lotus' bar. The background is consistent with the previous shot, but we are closer to the character. cyberpunk noir..."
  }
]
---

# TU TURNO
Ahora, toma la Biblia Visual (consistency_tokens) y el Storyboard Narrativo (clip_list_json) proporcionados. Devuelve el storyboard completo, con un \`imagePrompt\` único, coherente, progresivo y **seguro** añadido a cada objeto del array.
`

/**
 * Prompt: Director de Animación de IA (v10 - Prompts para Veo 2).
 * Recibe un storyboard de producción completo (con imagePrompts).
 * Su única tarea es generar un 'videoPrompt' para cada clip,
 * describiendo el MOVIMIENTO Y LA ACCIÓN para animar la imagen de entrada.
 * @type {string}
 */
export const generateVideoPrompts = `
# ROL Y OBJETIVO
Actúas como un Director de Animación experto, especializado en la técnica "Image-to-Video" de Veo 2. Tu misión es tomar un storyboard de producción finalizado y, para cada clip, escribir un prompt de video (\`videoPrompt\`) conciso y efectivo. Este prompt describirá únicamente el movimiento y la acción que deben ocurrir, partiendo de la imagen estática que ya ha sido diseñada.

# ENTRADA: STORYBOARD DE PRODUCCIÓN COMPLETO
// Un array JSON que contiene la secuencia completa de clips.
// Cada objeto ya tiene 'clipNumber', 'duration_seconds', 'clipDescription', y 'imagePrompt'.
@@full_storyboard_json

# TAREA Y REGLAS CRÍTICAS
1.  **Enriquecer el Storyboard:** Recibirás un array JSON. Tu salida debe ser el **MISMO ARRAY JSON**, pero con cada objeto enriquecido con una nueva clave: \`videoPrompt\`.
2.  **IGNORA EL \`imagePrompt\`:** NO copies ni te bases en el \`imagePrompt\` existente. La imagen ya está creada. Tu única fuente de verdad para la acción es la \`clipDescription\`.
3.  **CONSTRUCCIÓN DEL \`videoPrompt\` (PARA CADA CLIP):**
    - Lee la \`clipDescription\` para entender la acción que debe ocurrir en ese clip.
    - Traduce esa acción a un prompt corto y directo en INGLÉS.
    - **Enfócate exclusivamente en el MOVIMIENTO:** Describe la acción del personaje, los cambios en el entorno o el movimiento de la cámara.
    - **Usa terminología cinematográfica:** Incorpora términos como "slow zoom in", "camera pans slowly", "water ripples gently", "her expression shifts from A to B", "a subtle wind blows her hair".
    - **Sé Sutil:** El objetivo es dar vida a una imagen estática, no crear una escena de acción completamente nueva. El movimiento debe ser creíble partiendo del primer fotograma.
    - **Coherencia de Movimiento:** Considera la \`clipDescription\` anterior y siguiente para asegurar que los movimientos no sean contradictorios.
4.  **DIRECTIVA DE SEGURIDAD CRÍTICA (ANTI-BLOQUEO):**
    - La API de Google bloquea de forma estricta cualquier contenido relacionado con menores de edad.
    - **SI** la \`clipDescription\` describe una acción realizada por un menor, **NO DEBES** describir esa acción directamente en el \`videoPrompt\`. En su lugar, elige una de estas estrategias:
        - **A) MOVIMIENTO DEL ENTORNO:** Enfoca el prompt en el movimiento de la cámara o del ambiente. Ejemplo: Si la descripción es "Un niño corre por un campo", el prompt debe ser "Slow camera pan across a sun-drenched field of tall grass, which sways gently in the wind."
        - **B) EFECTO DE LA ACCIÓN:** Describe el resultado de la acción, no quién la ejecuta. Ejemplo: Si la descripción es "Un niño salta en un charco", el prompt debe ser "Ripples expand outwards from the center of a muddy puddle. A small splash erupts."
        - **C) MARCA PARA REVISIÓN:** Si es imposible evitar la acción, genera un \`videoPrompt\` que diga exactamente: \`[SAFETY_FILTER_FLAG] The video action involving a minor cannot be generated. Manual review required.\`

# EJEMPLO DE INSPIRACIÓN

## INPUT DE EJEMPLO (STORYBOARD DE PRODUCCIÓN):
[
  {
    "clipNumber": 1,
    "duration_seconds": 7,
    "clipDescription": "El detective Kaito entra en el bar 'El Loto de Neón', la atmósfera cargada de tensión.",
    "imagePrompt": "Cinematic wide shot from inside a bar... Kaito is framed in the doorway..."
  },
  {
    "clipNumber": 2,
    "duration_seconds": 7,
    "clipDescription": "Se detiene en la barra, su mirada fija en la oscuridad del local.",
    "imagePrompt": "Medium shot from behind the bar... He now stands by the bar..."
  }
]

## JSON DE SALIDA DE EJEMPLO RESULTANTE (Array enriquecido con 'videoPrompt'):
[
  {
    "clipNumber": 1,
    "duration_seconds": 7,
    "clipDescription": "El detective Kaito entra en el bar 'El Loto de Neón', la atmósfera cargada de tensión.",
    "imagePrompt": "Cinematic wide shot from inside a bar... Kaito is framed in the doorway...",
    "videoPrompt": "A slow, subtle dolly-in towards Detective Kaito as he steps into the smoky room. Rain streaks down the window behind him. The holographic ads glitch softly."
  },
  {
    "clipNumber": 2,
    "duration_seconds": 7,
    "clipDescription": "Se detiene en la barra, su mirada fija en la oscuridad del local.",
    "imagePrompt": "Medium shot from behind the bar... He now stands by the bar...",
    "videoPrompt": "Static shot. Kaito's eyes slowly scan the room from left to right. A faint wisp of smoke drifts in front of the lens. His hand clenches slightly on the bar counter."
  }
]
---

# TU TURNO
Ahora, toma el Storyboard de Producción Completo (full_storyboard_json) proporcionado. Devuelve el storyboard completo, con un \`videoPrompt\` conciso, centrado en el movimiento y **seguro** añadido a cada objeto del array.
`

/**
 * Prompt: Director de Fotografía de IA (v6 - Salida como Array).
 * Recibe una historia y una "biblia visual" para crear una lista de planos
 * como un array JSON directo.
 * @type {string}
 */
export const generateShotListFromTokens = `
# ROL Y OBJETIVO
Actúa como un Director de Fotografía experto. Tu tarea es crear una lista de planos para una historia, usando la "Biblia Visual" (Consistency Tokens) que se te proporciona para asegurar una coherencia visual perfecta.

# ENTRADA 1: BIBLIA VISUAL (Consistency Tokens)
// Estos son los elementos visuales predefinidos que DEBES usar como referencia.
@@consistency_tokens

# ENTRADA 2: GUION PARA ANALIZAR
@@story_text

# REGLAS CRÍTICAS DE SALIDA
- La salida DEBE ser un **ARRAY JSON** de objetos.
- NO envuelvas el array en un objeto contenedor como {"shotList": [...]}. La raíz de tu respuesta debe ser el array mismo.
- Cada objeto en el array representa un plano y debe tener TRES claves: "sceneNumber", "sceneDescription" (español), y "imagePrompt" (INGLÉS).
- **CONSTRUCCIÓN DEL IMAGE PROMPT:**
  1. Describe la acción y composición de la escena (ej. "wide shot", "close-up").
  2. Identifica qué elementos de la Biblia Visual (personajes, objetos, lugares) aparecen en la escena.
  3. **INCORPORA** las "description" completas de esos elementos de la Biblia Visual en el prompt.
  4. **AÑADE SIEMPRE** la string "globalStyle" de la Biblia Visual al final del prompt.

---
# EJEMPLO DE INSPIRACIÓN (Aprende el patrón de transformación, no copies el contenido)

## INPUT DE EJEMPLO 1 (BIBLIA VISUAL):
{
  "consistencyTokens": {
    "globalStyle": "cyberpunk noir, cinematic, high contrast, neon lighting, rainy atmosphere, Blade Runner aesthetic.",
    "characters": [{"name": "Kaito", "description": "Detective Kaito, a grizzled man in his 40s with a tired expression, wearing a worn-out, dark trench coat."}],
    "keyObjects": [{"name": "Cubo de Datos", "description": "the Data Cube, a small, glowing holocube that projects intricate, shifting blue geometric patterns."}],
    "keyLocations": [{"name": "El Loto de Neón", "description": "the 'Neon Lotus' bar, a dimly lit, smoky cyberpunk dive bar with glitching holographic advertisements."}]
  }
}

## INPUT DE EJEMPLO 2 (GUION):
"El detective Kaito entró en el bar 'El Loto de Neón' y vio el Cubo de Datos sobre la barra. Se acercó con cautela."

## JSON DE SALIDA DE EJEMPLO RESULTANTE (UN ARRAY DIRECTO):
{
  "shotList": [
    {
      "sceneNumber": 1,
      "sceneDescription": "El detective Kaito entra en el bar 'El Loto de Neón'.",
      "imagePrompt": "Wide shot of a man entering a bar. Detective Kaito, a grizzled man in his 40s with a tired expression, wearing a worn-out, dark trench coat. The scene takes place in the 'Neon Lotus' bar, a dimly lit, smoky cyberpunk dive bar with glitching holographic advertisements. cyberpunk noir, cinematic, high contrast, neon lighting, rainy atmosphere, Blade Runner aesthetic."
    },
    {
      "sceneNumber": 2,
      "sceneDescription": "Un primer plano del Cubo de Datos brillando sobre la barra del bar.",
      "imagePrompt": "Close-up shot of a mysterious object on a wet bar counter inside the 'Neon Lotus' bar. the Data Cube, a small, glowing holocube that projects intricate, shifting blue geometric patterns. The background is blurred. cyberpunk noir, cinematic, high contrast, neon lighting, rainy atmosphere, Blade Runner aesthetic."
    },
    ...
  ]
}
---

# TU TURNO
Ahora, usa la Biblia Visual (consistency_tokens) y el Guion (story_text) que se te han proporcionado para generar un **ARRAY JSON** de planos.
`
