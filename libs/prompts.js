/**
 * PASO 0: Generador de Semillas de Historia.
 * Identifica eventos, personajes o momentos del lore con alto potencial narrativo.
 * @type {string}
 */
/**
 * PASO 0: Generador de Semillas de Historia (Versión 2 - Consciente del Contexto).
 * Identifica eventos del lore, evitando temas ya tratados para forzar la novedad.
 * @type {string}
 */
export const generateStorySeedsWithContext = `
Tu tarea es actuar como un experto en el lore del siguiente universo: "@@prompt_ambience".

Tu objetivo es generar una lista de 10 a 15 "semillas de historia" **completamente nuevas y que no se parezcan a las que ya se han creado**. Deben ser canónicamente precisas.

Para ayudarte a evitar repeticiones, aquí tienes una lista de temas que ya han sido cubiertos. **NO GENERES SEMILLAS SOBRE ESTOS TEMAS O MUY SIMILARES A ELLOS.** Utiliza esta lista como inspiración para explorar áreas diferentes y menos obvias del lore.

**Historial de temas ya cubiertos (a evitar):**
@@previous_seeds_list

---
**Recordatorio de tu tarea:**
Basándote en tu conocimiento del universo "@@prompt_ambience" y evitando los temas de la lista anterior, genera una lista fresca de semillas de historia. Piensa en personajes secundarios, lugares olvidados, el origen de objetos peculiares, eventos históricos menores o teorías de fans interesantes.

**Universo a procesar:** "@@prompt_ambience"

Responde ÚNICAMENTE con un objeto JSON que contenga una clave "story_seeds", cuyo valor sea un array de strings.
`

/**
 * PASO 1: Director Narrativo
 * Toma una semilla de lore y define cómo convertirla en una escena dramática.
 * @type {string}
 */
export const generateCreativeDirection = `
Basado en el universo general: "@@prompt_ambience".
Y la siguiente semilla de historia del lore: "@@story_seed".

Tu tarea es actuar como un director de cine o teatro. No escribas la historia. Define CÓMO se va a contar esta escena para maximizar su impacto emocional, manteniéndose 100% fiel al lore.

Elige un tono que potencie la semilla de historia.
Tonos posibles: Terror, Fantasía Épica, Melancolía, Misterio, Romance, Aventura, Reflexión Filosófica, Humor Negro, Sátira, Ciencia Ficción, Realismo Mágico.

Genera un objeto JSON con los siguientes campos:
- "chosen_tone": Una descripción del tono emocional de la escena (ej: "Tragedia inminente", "Horror silencioso y opresivo").
- "narrative_perspective": El punto de vista desde el que se contará la historia (ej: "Primera persona de un personaje secundario que lo presencia todo", "Tercera persona limitada, enfocada en los pensamientos y miedos del protagonista").
- "key_dramatic_moment": El latido central de la historia; un momento, una imagen o una línea de diálogo que debe ser el clímax emocional de la escena (ej: "El sonido de una armadura cayendo al suelo cuando el personaje se rinde", "Una sonrisa amarga al recordar una promesa rota").

---
**Ejemplo de inspiración (NO lo copies):**
*   **Universo:** "Dark Souls 2"
*   **Semilla de Historia:** "El último encuentro de un caballero con Lucatiel, justo cuando ella le pide que recuerde su nombre."
*   **JSON de salida posible:**
    {
      "chosen_tone": "Melancolía y desesperación digna",
      "narrative_perspective": "Tercera persona limitada, centrada en los pensamientos confusos de Lucatiel, mientras lucha por aferrarse a su identidad.",
      "key_dramatic_moment": "El silencio que sigue a su petición, donde ella escudriña el rostro del jugador, buscando una confirmación que sabe que nunca será permanente."
    }
---

Ahora, crea una combinación **NUEVA y ORIGINAL** para la semilla de historia proporcionada.

**Universo a procesar:** "@@prompt_ambience"
**Semilla a procesar:** "@@story_seed"

Responde ÚNICAMENTE con el objeto JSON.
`

/**
 * PASO 2: Escritor de Lore Dramatizado (Versión 4 - Longitud Estricta).
 * Escribe una historia corta y emotiva basada en directrices de dramatización.
 * @type {string}
 */
export const generateStoryFromDirection = `
**OBJETIVO CRÍTICO DE LONGITUD: La historia resultante DEBE tener entre 200 y 250 palabras y estar escrita en ESPAÑOL. Es un requisito estricto.**

Tu tarea es escribir una historia corta y evocadora. **No resumas el lore, dramatízalo.** Céntrate en la experiencia sensorial y emocional del momento, basándote en las siguientes directrices. Debes ser completamente fiel al canon del universo.

**Guion de la Escena:**
- Universo: "@@prompt_ambience"
- Semilla de Historia (Contexto): "@@story_seed"
- Tono Emocional: "@@chosen_tone"
- Perspectiva Narrativa: "@@narrative_perspective"
- Momento Dramático Clave: "@@key_dramatic_moment"

**Requisitos de Estilo:**
1.  **Longitud Obligatoria:** Estrictamente entre 200 y 250 palabras.
2.  **Narración Inmersiva:** Usa descripciones sensoriales (sonidos, olores, vistas), pensamientos internos y diálogos para dar vida a la escena. Muestra, no cuentes.
3.  **Fidelidad al Canon:** No inventes ni contradigas hechos establecidos del lore. Usa la creatividad para rellenar los vacíos emocionales y sensoriales, no los fácticos.
4.  **Estructura de Escena:** Organiza el texto en 3-4 párrafos que construyan la atmósfera, presenten el conflicto/emoción, lleguen al momento clave y ofrezcan un cierre resonante.

Responde únicamente con el texto de la historia.
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

**Ambientación de referencia:**
"@@prompt_ambience"

**Lista de Voces de Referencia:**
[Zephyr, Puck, Charon, Kore, Fenrir, Leda, Orus, Aoede, Callirrhoe, Autonoe, Enceladus, Iapetus, Umbriel, Algieba, Despina, Erinome, Algenib, Rasalgethi, Laomedeia, Achernar, Alnilam, Schedar, Gacrux, Pulcherrima, Achird, Zubenelgenubi, Vindemiatrix, Sadachbia, Sadaltager, Sulafat]

Genera un objeto JSON con la siguiente estructura:

- "title": Un título conciso y evocador para la historia.
- "story": El texto exacto de la historia que has analizado.
- "narrator_tone_es": Una descripción de 2-5 palabras del tono para el narrador TTS.
- "suggested_voice_name": Elige UN (1) voice_name EXACTO de la lista de referencia.
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
 * Prompt: Anotador de Guion para Gemini TTS.
 * Enriquece un texto plano con instrucciones de narración en lenguaje natural,
 * preparándolo para el modelo TTS de Gemini.
 * @type {string}
 */
export const generateGeminiTTScript = `
Tu tarea es actuar como un director de voz que prepara un guion para un actor (el modelo TTS de Gemini).
Debes enriquecer el texto original con instrucciones claras y concisas sobre cómo debe ser narrado.

**Texto Original:**
"@@story_text"

**Tono General Deseado:**
"@@narrator_tone_es"

**Instrucción de Ritmo Global (¡NUEVO!):**
La narración general debe tener un ritmo ligeramente más rápido que el de una lectura estándar, buscando un tono conversacional y natural, no una lectura lenta y dramática. Evita pausas excesivamente largas a menos que el momento sea absolutamente crítico.

**Instrucciones de Anotación:**
1.  **Formato de Instrucción:** Las instrucciones deben ser cortas, en inglés... (ej: (Speaking at a slightly faster pace) o (With a natural, flowing pace)).
2.  **Variedad de Instrucciones:** ...
3.  **Pausas:** Usa las pausas con moderación para mantener el flujo. Una instrucción como (Brief pause) es mejor que (Long, dramatic pause) en la mayoría de los casos.
... (el resto del prompt sin cambios) ...

Ahora, transforma el texto original proporcionado en un guion anotado para Gemini TTS, siguiendo todas las instrucciones, especialmente la de mantener un ritmo natural y fluido. Responde únicamente con el texto del guion.
`

/**
 * Prompt: Director de Arte Canónico de IA (v4 - Anclado a la Semilla).
 * Analiza una historia, su semilla conceptual y su universo para extraer una
 * "Biblia Visual" canónicamente precisa y estilísticamente fiel.
 * @type {string}
 */
export const extractVisualTokens = `
# ROL Y OBJETIVO
Actúa como un Director de Arte experto, con un conocimiento enciclopédico sobre el lore, la estética y el diseño visual del universo de origen. Tu tarea es leer el guion y la "semilla conceptual" de la historia para ANCLAR todos los elementos visuales al canon del universo y a la intención original de la narrativa.

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
  - Las descripciones de personajes, objetos y lugares DEBEN ser canónicamente precisas y su representación debe estar influenciada por la "SEMILLA" (ej. si la semilla es sobre una traición, el personaje puede tener una expresión de desconfianza).

# DESGLOSE DE TOKENS A EXTRAER
- "globalStyle": Una string que defina el estilo artístico general.
- "characters": Un array (name, description).
- "keyObjects": Un array (name, description).
- "keyLocations": Un array (name, description).

---
# EJEMPLO DE INSPIRACIÓN
## INPUT 1 (UNIVERSO):
"Dark Souls 2"

## INPUT 2 (SEMILLA):
"La trágica historia de Lucatiel de Mirrah y su lucha contra el olvido y la pérdida de su identidad."

## INPUT 3 (GUION):
"Lucatiel se sentó junto al fuego, su rostro parcialmente oculto por la máscara. Miró al Portador de la Maldición y le rogó que recordara su nombre, un último acto de desafío contra la maldición que la consumía."

## JSON DE SALIDA DE EJEMPLO:
{
  "consistencyTokens": {
    "globalStyle": "melancholic dark fantasy, cinematic, painterly style with heavy use of shadows and soft, dying light. The atmosphere is one of dignified decay and quiet desperation, in the distinct visual style of Dark Souls 2.",
    "characters": [
      {
        "name": "Lucatiel de Mirrah",
        "description": "Lucatiel of Mirrah, a noble swordswoman with a proud posture, wearing her signature ornate, wide-brimmed hat and a steel mask that covers the right side of her face. Her expression is a mix of fatigue and unwavering resolve."
      },
      {
        "name": "Portador de la Maldición",
        "description": "The Bearer of the Curse, a hollowed figure of indeterminate gender, clad in mismatched, worn armor, their face obscured by a helmet, representing the player character."
      }
    ],
    "keyObjects": [],
    "keyLocations": [
      {
        "name": "Hoguera",
        "description": "a bonfire, its weak flames casting long, dancing shadows on the surrounding stone walls, with swirling ash particles in the air."
      }
    ]
  }
}
---

# TU TURNO
Ahora, usa el Universo (prompt_ambience), la Semilla (story_seed) y el Guion (story_text) proporcionados para generar el objeto JSON "consistencyTokens" como única salida.
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
