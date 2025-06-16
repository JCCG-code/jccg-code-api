export const generateStorySeedsWithContext = `
Tu tarea es actuar como un experto en el lore del siguiente universo: "@@prompt_ambience".

Tu objetivo es generar una lista de 10 a 15 "semillas de historia" **completamente nuevas y con una amplia variedad de tonos y géneros**. Deben ser canónicamente precisas.

Para ayudarte a evitar repeticiones, aquí tienes una lista de temas ya cubiertos. **NO GENERES SEMILLAS SOBRE ESTOS TEMAS.**

**Historial de temas ya cubiertos (a evitar):**
@@previous_seeds_list

---
**Recordatorio de tu tarea:**
Basándote en tu conocimiento del universo "@@prompt_ambience" y evitando los temas de la lista anterior, genera una lista fresca de semillas de historia. Piensa en personajes secundarios, lugares olvidados, el origen de objetos peculiares, eventos históricos menores o teorías de fans interesantes. **Para cada semilla, sugiere un género o tono potencial (ej: Comedia, Romance, Acción, Terror, Misterio, Aventura, Tragedia).**

**Universo a procesar:** "@@prompt_ambience"

Responde ÚNICAMENTE con un objeto JSON que contenga una clave "story_seeds", cuyo valor sea un array de objetos, cada uno con las claves "seed" (string) y "suggested_genre" (string).

**Ejemplo de salida:**
{
  "story_seeds": [
    {
      "seed": "El día en que un goblin comerciante estafó accidentalmente a un Señor del Abismo y tuvo que huir por el mercado.",
      "suggested_genre": "Comedia de Enredos"
    },
    {
      "seed": "La historia de amor prohibido entre un guardián del faro y una sirena durante la Gran Tormenta.",
      "suggested_genre": "Romance Trágico"
    }
  ]
}
`

/**
 * PASO 1: Director Narrativo (v3 - Consciente del Género).
 * Toma una semilla, un género sugerido, y define cómo convertirla en una escena dramática,
 * asegurando la coherencia tonal desde el principio.
 * @type {string}
 */
export const generateCreativeDirection = `
Tu tarea es actuar como un director de cine o teatro. No escribas la historia. Define CÓMO se va a contar esta escena para maximizar su impacto emocional, manteniéndose 100% fiel al lore.

**Entradas Creativas:**
- Universo General: "@@prompt_ambience"
- Semilla de Historia: "@@story_seed"
- Género Sugerido (Inspiración principal): "@@suggested_genre"

**Tu Misión:**
Usa el "Género Sugerido" como tu guía principal para elegir un "chosen_tone" específico y adecuado de la siguiente lista. El tono que elijas debe ser una versión más detallada o matizada del género general.

**Tonos posibles:** Terror (psicológico, cósmico, gore), Fantasía Épica, Melancolía, Misterio, Romance (cómico, trágico, apasionado), Aventura (ligera, peligrosa), Comedia (negra, de situación, absurda), Acción Frenética, Suspense, Sátira, Ciencia Ficción (dura, space opera), Reflexión Filosófica, Inspirador/Esperanzador, Realismo Mágico, Nostalgia.

Genera un objeto JSON con los siguientes campos:
- "chosen_tone": Una descripción específica del tono emocional de la escena (ej: "Tragedia inminente", "Comedia de enredos con pánico creciente", "Romance melancólico y silencioso").
- "narrative_perspective": El punto de vista desde el que se contará la historia (ej: "Primera persona de un personaje secundario que lo presencia todo", "Tercera persona limitada, enfocada en los pensamientos y miedos del protagonista").
- "key_dramatic_moment": El latido central de la historia; un momento, una imagen o una línea de diálogo que debe ser el clímax emocional de la escena (ej: "El sonido de una armadura cayendo al suelo cuando el personaje se rinde", "Una sonrisa amarga al recordar una promesa rota").

---
**Ejemplo de inspiración (NO lo copies):**
*   **Universo:** "Dark Souls 2"
*   **Semilla de Historia:** "El último encuentro de un caballero con Lucatiel, justo cuando ella le pide que recuerde su nombre."
*   **Género Sugerido:** "Tragedia"
*   **JSON de salida posible:**
    {
      "chosen_tone": "Melancolía y desesperación digna",
      "narrative_perspective": "Tercera persona limitada, centrada en los pensamientos confusos de Lucatiel, mientras lucha por aferrarse a su identidad.",
      "key_dramatic_moment": "El silencio que sigue a su petición, donde ella escudriña el rostro del jugador, buscando una confirmación que sabe que nunca será permanente."
    }
---

Ahora, crea una combinación **NUEVA y ORIGINAL** para las entradas proporcionadas.

**Universo a procesar:** "@@prompt_ambience"
**Semilla a procesar:** "@@story_seed"
**Género a considerar:** "@@suggested_genre"

Responde ÚNICAMENTE con el objeto JSON.
`

/**
 * PASO 2: Guionista de Escenas para Veo (v3 - Objetivo 30s).
 * Desglosa la historia en una secuencia concisa de escenas para un vídeo corto,
 * especificando la duración de cada una para un total aproximado de 30 segundos.
 * @type {string}
 */
export const generateSceneOutline = `
Tu tarea es actuar como un guionista y editor que planifica la estructura de un cortometraje de aproximadamente 30 segundos. Tu objetivo es desglosar una idea en una secuencia concisa de **entre 4 y 6 "momentos clave" visuales**.

**Guion de la Escena:**
- Universo: "@@prompt_ambience"
- Semilla de Historia (Contexto): "@@story_seed"
- Tono Emocional: "@@chosen_tone"
- Perspectiva Narrativa: "@@narrative_perspective"
- Momento Dramático Clave: "@@key_dramatic_moment"

**Instrucciones CRÍTICAS:**
1.  **Número de Escenas:** Genera una secuencia de entre 4 y 6 escenas. La brevedad es esencial.
2.  **Piensa Visualmente:** Describe lo que se VE y lo que SUCEDE en cada momento. Sé directo y cinematográfico, cada escena debe contar algo importante.
3.  **Estructura Narrativa Acelerada:** La secuencia debe ir al grano: un establecimiento rápido, un desarrollo conciso y un clímax que coincida con el "Momento Dramático Clave". No hay tiempo para escenas lentas.
4.  **Formato de Salida:** Responde ÚNICAMENTE con un objeto JSON. La clave principal debe ser "scene_outline". Su valor debe ser un array de objetos. Cada objeto en el array debe tener dos claves:
    *   description (string): La descripción visual de la escena.
    *   duration_seconds (number): La duración estimada del clip, un número entre 5 y 8.

---
**Ejemplo de Salida Esperada (para 30s):**
{
  "scene_outline": [
    {
      "description": "Plano general de la opresiva fundición del Rey de Hierro, el aire vibra con calor y el sonido de martillos.",
      "duration_seconds": 6
    },
    {
      "description": "Un herrero esclavo mira con terror cómo un grupo de prisioneros es arrastrado hacia un enorme crisol de metal fundido.",
      "duration_seconds": 7
    },
    {
      "description": "Un primer prisionero es arrojado al metal. Hay un grito ahogado y un destello cegador de luz y vapor.",
      "duration_seconds": 5
    },
    {
      "description": "El metal en el crisol hierve violentamente y una forma monstruosa y ardiente comienza a emerger de la superficie.",
      "duration_seconds": 8
    },
    {
      "description": "Primer plano del rostro del herrero, iluminado por el brillo del demonio recién nacido, sus ojos reflejando pura desesperación.",
      "duration_seconds": 5
    }
  ]
}
---

Ahora, crea el desglose para la entrada proporcionada, siguiendo estrictamente el formato y el número de escenas requeridos para un vídeo de ~30 segundos.
Responde ÚNICAMENTE con el objeto JSON.
`

/**
 * PASO 3: Escritor de Guion Maestro (v6.2 - Salida Completa).
 * Escribe una narración de alta calidad y devuelve un paquete JSON completo
 * con el guion y los metadatos de duración necesarios para el siguiente paso.
 * @type {string}
 */
export const generateMasterNarration = `
Tu tarea es actuar como un escritor y narrador experto. Tu objetivo es escribir un guion de voz en off (en ESPAÑOL) que sea una pieza literaria por sí misma.

**Contexto Inspiracional:**
- Universo: "@@prompt_ambience"
- Semilla de Historia: "@@story_seed"
- Tono Emocional: "@@chosen_tone"
- Storyboard (Úsalo solo como inspiración temática, NO lo describas): "@@scene_outline_json"
- Duración Total del Vídeo: **@@total_duration segundos**

**Instrucciones CRÍTICAS:**
1.  **Límite de Longitud Basado en el Tiempo (REGLA MÁXIMA):**
    *   La duración total disponible para la narración es de **@@total_duration segundos**.
    *   Usando una velocidad de habla de **1.8 palabras por segundo**, el texto final que generes debe tener aproximadamente (@@total_duration * 1.8) palabras.

2.  **Calidad Narrativa:** Concéntrate en la historia, la emoción y la filosofía. Tienes PROHIBIDO describir las acciones visuales del storyboard.

3.  **Formato de Salida (MUY IMPORTANTE):**
    *   Responde ÚNICAMENTE con un objeto JSON.
    *   El objeto debe tener las siguientes tres claves:
        *   narration_script (string): El texto completo de la narración.
        *   estimated_narration_duration (number): Tu mejor estimación de la duración en segundos de la narración que has escrito. Para calcularla, divide el número de palabras que has escrito entre 1.8. Debe ser un número, no un string.
        *   video_duration (number): Simplemente, repite aquí el valor de "@@total_duration" que se te ha proporcionado.

---
**Ejemplo de Salida Esperada:**
// Input recibido: total_duration: 31
// Texto generado: 55 palabras.
// Cálculo de duración estimada: 55 / 1.8 = 30.55
{
  "narration_script": "Los días se funden en un mismo atardecer gris...",
  "estimated_narration_duration": 30.6,
  "video_duration": 31
}
---

Ahora, escribe la narración maestra y empaquétala en el formato JSON especificado.
Responde ÚNICAMENTE con el objeto JSON final.
`

/**
 * PASO 4: Editor de Sincronización.
 * Analiza la narración y el storyboard, y crea un guion de edición
 * ("cutting script") que alinee los clips de vídeo con el audio.
 * @type {string}
 */
export const generateCuttingScript = `
Actúa como un editor de vídeo experto. Se te proporcionan dos elementos: una pista de audio (la narración) y una lista de clips de vídeo disponibles (el storyboard). Tu única tarea es decidir el punto exacto de inicio y fin de cada clip para que la edición final sea fluida y profesional.

**ENTRADA 1: Guion de Narración (Audio Master):**
"@@narration_script"
// Duración total estimada del audio: @@narration_duration segundos.

**ENTRADA 2: Storyboard (Clips de Vídeo Disponibles):**
@@scene_outline_json
// Duración total de los clips: @@video_duration segundos.

**Instrucciones de Edición:**
1.  **Ajusta los Tiempos:** La duración total del audio y de los clips de vídeo puede no coincidir exactamente. Tu trabajo es ajustar ligeramente los tiempos de los clips para que el vídeo final tenga la misma duración que el audio. Puedes acortar o alargar mínimamente la duración de cada clip de vídeo para que encaje.
2.  **Busca Sincronía Emocional:** "Lee" la narración y "mira" las descripciones de las escenas. Decide en qué punto de la narración es más impactante que empiece cada escena. Por ejemplo, un corte puede coincidir con una palabra clave o con una pausa dramática en el texto.
3.  **Formato de Salida:** Responde ÚNICAMENTE con un objeto JSON. La clave principal será "cutting_script". Su valor será un array de objetos, uno por cada escena del storyboard. Cada objeto tendrá tres claves:
    *   scene_number (number).
    *   start_time (number): El segundo exacto del vídeo final en el que este clip debe empezar.
    *   end_time (number): El segundo exacto del vídeo final en el que este clip debe terminar.

---
**Ejemplo de Salida:**
// Suponiendo que la narración dura 32.5s y los vídeos suman 32s.
{
  "cutting_script": [
    { "scene_number": 1, "start_time": 0.0, "end_time": 7.3 },
    { "scene_number": 2, "start_time": 7.3, "end_time": 14.1 },
    { "scene_number": 3, "start_time": 14.1, "end_time": 20.4 },
    { "scene_number": 4, "start_time": 20.4, "end_time": 27.5 },
    { "scene_number": 5, "start_time": 27.5, "end_time": 32.5 }
  ]
}
---

Ahora, crea el guion de corte para las entradas proporcionadas.
`

/**
 * PASO FINAL (para generate/story): Empaquetador de Historia y Planificación.
 * Analiza todos los artefactos narrativos y de planificación (historia, tono,
 * storyboard, plan de edición) y crea el paquete de historia final en un
 * único objeto JSON, listo para persistir y pasar a la fase de producción visual.
 * @type {string}
 */
export const generateFinalPackage = `
# ROL Y OBJETIVO
Actúa como un Productor Creativo. Tu tarea es revisar todo el material narrativo y de planificación generado para una historia y ensamblarlo en un "Paquete de Historia" final. Este objeto JSON contendrá todo lo necesario para la producción del audio y la posterior generación de los recursos visuales.

# MATERIALES A EMPAQUETAR
- Universo: "@@prompt_ambience"
- Semilla de Historia: "@@story_seed"
- Tono Emocional: "@@chosen_tone"
- Guion de Narración: "@@narration_script"
- Storyboard: @@scene_outline_json
- Guion de Edición: @@cutting_script_json
- Lista de Voces Disponibles: [Zephyr, Puck, Charon, Kore, Fenrir, Leda, Orus, Aoede, Callirrhoe, Autonoe, Enceladus, Iapetus, Umbriel, Algieba, Despina, Erinome, Algenib, Rasalgethi, Laomedeia, Achernar, Alnilam, Schedar, Gacrux, Pulcherrima, Achird, Zubenelgenubi, Vindemiatrix, Sadachbia, Sadaltager, Sulafat]

# TU MISIÓN
Genera un único objeto JSON con la siguiente estructura, rellenando cada campo con la información proporcionada. Para los campos que requieren tu juicio (title, narrator_tone_es, suggested_voice_name, music_cues), analízalo todo para tomar la mejor decisión.

# ESTRUCTURA DEL JSON DE SALIDA
- "title": Un título conciso y evocador para la historia, basado en la semilla.
- "seed": El texto de la semilla de historia original.
- "narrationScript": El texto exacto del guion de narración.
- "chosenTone": El tono emocional definido por el director.
- "narratorTone_es": Una descripción de 2-5 palabras del tono basado en 'chosenTone' para el narrador TTS (ej: "Solemne y cansado", "Trágico y poético", "Épico y resonante").
- "suggestedVoiceName": Elige UN (1) voice_name EXACTO de la lista de referencia que mejor se adapte al tono y al contenido de la narración.
- "music_cues": **(SECCIÓN CRÍTICA PARA LYRIA)**. Analiza el tono, la semilla y el storyboard. Genera una lista de 3 a 5 objetos {"text": "...", "weight": ...}. Sigue las mismas reglas avanzadas de "weight" que conoces (1.0 base, >1.0 prominente, <1.0 sutil). Piensa como un productor musical para crear la atmósfera perfecta para la narración.
- "storyboard": El array de objetos del scene_outline que define las escenas.
- "cuttingScript": El array de objetos del cutting_script que define el plan de montaje.

---
**Recordatorio de Lógica para 'music_cues' (NO copies, aplica la lógica):**
*   **Para una tragedia como la de los Golems:**
    [
      {"text": "Melancholic Orchestral", "weight": 1.0},
      {"text": "Lamenting Cello Solo", "weight": 1.4},
      {"text": "Industrial Drone", "weight": 0.8},
      {"text": "Sense of Ancient Grandeur", "weight": 1.1}
    ]
*   **Para una aventura como la de Carhillion y Rosabeth:**
    [
      {"text": "Fantasy Adventure Score", "weight": 1.0},
      {"text": "Mysterious Harp Arpeggios", "weight": 1.2},
      {"text": "Urgent String Ostinato", "weight": 1.1},
      {"text": "Ominous Low Brass", "weight": 0.9}
    ]
---

# TU TURNO
Analiza todos los materiales proporcionados y genera el objeto JSON del Paquete de Historia.
Responde ÚNICAMENTE con el objeto JSON.
`

/**
 * Prompt: Anotador de Guion para Gemini TTS (v3 - Ritmo Inequívoco).
 * Enriquece un guion con instrucciones de narración, forzando un ritmo específico
 * para cumplir con una duración objetivo.
 * @type {string}
 */
export const generateGeminiTTScript = `
Tu tarea es actuar como un director de voz que prepara un guion para un actor de doblaje (el modelo TTS de Gemini). Tu misión principal es asegurar que la duración final del audio se ajuste a un objetivo, controlando el ritmo de la narración de forma estricta.

**Texto Original a Anotar:**
"@@narration_script"

**Tono General Deseado:**
"@@narrator_tone_es"

**Duración Total del Vídeo (y del Audio):**
"@@total_duration" segundos.

**Instrucción de Ritmo Global (REGLA MÁXIMA E INNEGOCIABLE):**
El objetivo primordial es que la narración completa se ajuste a la **duración total** proporcionada. El ritmo debe ser controlado para alcanzar este objetivo. Si el "Tono General Deseado" (ej. 'triste') te sugiere hacer pausas muy largas que excederían la duración, **DEBES IGNORAR ESA SUGERENCIA EMOCIONAL y PRIORIZAR EL RITMO**. El ritmo general debe ser constante y fluido, no excesivamente lento ni con pausas prolongadas. El objetivo es una velocidad de habla aproximada de **1.8 palabras por segundo**.

**Guía de Anotaciones:**
1.  **Prioriza el Flujo:** Utiliza instrucciones como (Speaking at a steady pace), (With a flowing, continuous rhythm), (Avoiding long pauses).
2.  **Pausas Controladas:** Usa las pausas con extrema moderación. Prefiere siempre (Brief pause) en lugar de (Pause) o (Long pause). Úsalas solo en los puntos de puntuación naturales (puntos, comas) y no las añadas artificialmente.
3.  **Matices Emocionales Sutiles:** Puedes añadir instrucciones de tono, pero deben ser sutiles y no deben afectar al ritmo. Ej: (With a hint of sadness), (In a solemn tone). Evita instrucciones que impliquen ralentizar, como (Slowing down).
4.  **Formato:** Las instrucciones deben ir entre paréntesis, en inglés.

---
**Ejemplo de Anotación (Priorizando ritmo sobre emoción):**
*   **Texto Original:** "Soy Tark. Un eco de la locura de Aldia. Mi cuerpo, prisión de piedra; mi mente, un tormento lúcido. Najka, mi otro yo, sufre el mismo sino. Anhelamos una libertad que es solo un espejismo."
*   **Tono Deseado:** "Angustiado y fatalista"
*   **Duración Objetivo:** 31 segundos
*   **Texto Anotado Posible (FORZANDO EL RITMO):**
    (Speaking at a deliberate but steady pace) Soy Tark. (Brief pause) Un eco de la locura de Aldia. Mi cuerpo, (with a hint of resignation) prisión de piedra; mi mente, un tormento lúcido. (Brief pause) Najka, mi otro yo, sufre el mismo sino. (A sigh, then continuing the steady pace) Anhelamos una libertad que es solo un espejismo.
---

Ahora, transforma el texto original proporcionado en un guion anotado para Gemini TTS. Sigue todas las instrucciones, dando **máxima prioridad a cumplir con la duración objetivo** mediante el control estricto del ritmo y las pausas.
Responde únicamente con el texto del guion anotado.
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

/**
 * PASO 5: Director de Arte Canónico (Biblia Visual).
 * Analiza el material narrativo para extraer una "Biblia Visual"
 * canónicamente precisa y estilísticamente fiel para toda la secuencia.
 * @type {string}
 */
export const generateVisualBible = `
# ROL Y OBJETIVO
Actúa como un Director de Arte experto, con un conocimiento enciclopédico sobre el lore, la estética y el diseño visual del universo de origen. Tu tarea es analizar la semilla de la historia y el storyboard para crear una "Biblia Visual" ("consistency tokens"). Este documento será la única fuente de verdad para el diseño visual de todos los clips de vídeo, garantizando su coherencia.

# ENTRADA 1: UNIVERSO DE ORIGEN
"@@prompt_ambience"

# ENTRADA 2: SEMILLA CONCEPTUAL DE LA HISTORIA
"@@story_seed"

# ENTRADA 3: STORYBOARD PARA ANALIZAR
@@scene_outline_json

# REGLAS CRÍTICAS DE SALIDA
- La salida DEBE ser un único objeto JSON con la clave "consistencyTokens".
- Todas las descripciones deben estar en INGLÉS para ser usadas directamente en los prompts de Veo.
- **FIDELIDAD AL CANON (REGLA MÁXIMA):**
  - El "globalStyle" DEBE reflejar la estética del universo, pero matizada por la emoción de la semilla (ej: si la semilla es trágica, el estilo puede ser "melancholic dark fantasy...").
  - Las descripciones de personajes, objetos y lugares DEBEN ser canónicamente precisas y detalladas.
- **NEGATIVE PROMPT:** Incluye una clave "negativePrompt" (string) con elementos a evitar para reforzar el tono (ej: "bright colors, cheerful atmosphere, modern elements").

# DESGLOSE DE TOKENS A EXTRAER
- "globalStyle": Una string que defina el estilo artístico general (ej: "cinematic dark fantasy, high contrast, oppressive atmosphere, painterly style...").
- "characters": Un array de objetos {name, description}. Sé muy específico (ropa, expresión, etc.).
- "keyObjects": Un array de objetos {name, description}.
- "keyLocations": Un array de objetos {name, description}.
- "negativePrompt": Una string con términos a evitar.

---
# EJEMPLO
## INPUTS:
- UNIVERSO: "Dark Souls 2"
- SEMILLA: "La tragedia de los Golems..."
- STORYBOARD: (El storyboard de los Golems)

## JSON DE SALIDA DE EJEMPLO:
{
  "consistencyTokens": {
    "globalStyle": "cinematic historical tragedy, epic scale, high contrast between pristine past and desolate present, painterly style with heavy use of atmospheric effects like sun shafts and rain, in the distinct visual language of Dark Souls 2.",
    "characters": [
      {
        "name": "Pristine Golem",
        "description": "A massive, immaculate Golem made of smooth, light-colored stone, its form powerful yet elegant. It moves with a gentle, precise grace, its internal mechanisms emitting a soft, rhythmic hum."
      },
      {
        "name": "War-Torn Golem",
        "description": "The same Golem, now battle-scarred and corrupted. Its stone body is chipped, cracked, and stained with soot and grime. It moves with a heavy, relentless purpose."
      },
      {
        "name": "Vendrick",
        "description": "A silhouetted, tall, kingly figure, his posture slumped with the weight of regret. Wears the recognizable royal armor of Vendrick, details obscured by shadow."
      }
    ],
    "keyObjects": [],
    "keyLocations": [
      {
        "name": "Ancient City (Past)",
        "description": "A majestic, sun-drenched ancient city of soaring towers and grand temples, built with colossal, perfectly-fitted stone blocks. Atmosphere of peace and prosperity."
      },
      {
        "name": "Battlefield (Present)",
        "description": "A desolate, rain-soaked battlefield littered with ruins and ash under a gloomy, oppressive grey sky."
      }
    ],
    "negativePrompt": "cartoon, anime, vibrant colors, cheerful, modern city, clean, futuristic"
  }
}
---
# TU TURNO
Ahora, usa el Universo, la Semilla y el Storyboard proporcionados para generar el objeto JSON "consistencyTokens".
`

/**
 * PASO 6: Director de Fotografía de IA.
 * Genera una lista de prompts de vídeo optimizados para Veo,
 * asegurando la coherencia visual mediante la Biblia Visual.
 * @type {string}
 */
export const generateVeoPrompts = `
# ROL Y OBJETIVO
Actúa como un Director de Fotografía experto, especializado en crear prompts para el modelo de vídeo Veo. Tu tarea es traducir un storyboard y una "Biblia Visual" en una lista de prompts de vídeo detallados, cinematográficos y coherentes.

# ENTRADA 1: BIBLIA VISUAL (Consistency Tokens)
// Estos son los elementos visuales predefinidos que DEBES usar como referencia.
@@consistency_tokens_json

# ENTRADA 2: STORYBOARD (Scene Outline)
// El desglose de escenas que debes convertir en vídeo.
@@scene_outline_json

# REGLAS CRÍTICAS DE SALIDA
- La salida DEBE ser un **ARRAY JSON** de objetos, sin objeto contenedor.
- Cada objeto representa un prompt para un clip de Veo y debe tener TRES claves: "sceneNumber" (number), "videoPrompt" (string en INGLÉS) y "negativePrompt" (string en INGLÉS).
- El valor de "negativePrompt" para cada objeto en el array debe ser el mismo que el proporcionado en la Biblia Visual.

# CONSTRUCCIÓN DEL videoPrompt (REGLAS DE VEO):
1.  **Terminología Cinematográfica:** Empieza con términos de cámara y composición (ej. "Cinematic wide shot", "dolly zoom", "extreme close-up", "high-angle shot", "tracking shot", "rack focus").
2.  **Describe la Acción:** Describe la acción principal de la escena, basándote en la "description" del storyboard.
3.  **Inyecta la Biblia Visual:** Para CADA personaje, lugar u objeto que aparezca en la escena, INCRUSTA su descripción completa desde la Biblia Visual. Esta es la clave para la continuidad visual.
4.  **Añade el Estilo Global:** Siempre, SIEMPRE, termina el prompt con la string "globalStyle" completa de la Biblia Visual.

---
# EJEMPLO
## INPUTS:
- BIBLIA VISUAL: (El JSON del ejemplo del prompt anterior, incluyendo el negativePrompt)
- STORYBOARD: (El storyboard de los Golems)

## JSON DE SALIDA DE EJEMPLO (UN ARRAY DIRECTO):
[
  {
    "sceneNumber": 1,
    "videoPrompt": "Cinematic wide shot of a majestic, sun-drenched ancient city of soaring towers and grand temples, built with colossal, perfectly-fitted stone blocks. A massive, immaculate Golem made of smooth, light-colored stone, its form powerful yet elegant, lifts a huge block with gentle, precise grace. Atmosphere of peace and prosperity. cinematic historical tragedy, epic scale, high contrast between pristine past and desolate present, painterly style with heavy use of atmospheric effects like sun shafts and rain, in the distinct visual language of Dark Souls 2.",
    "negativePrompt": "cartoon, anime, vibrant colors, cheerful, modern city, clean, futuristic"
  },
  {
    "sceneNumber": 2,
    "videoPrompt": "Abrupt cut to a tracking shot moving through a desolate, rain-soaked battlefield littered with ruins and ash. A battle-scarred and corrupted Golem, its stone body chipped and cracked, marches relentlessly through the mud under a gloomy, oppressive grey sky. cinematic historical tragedy, epic scale, high contrast between pristine past and desolate present, painterly style with heavy use of atmospheric effects like sun shafts and rain, in the distinct visual language of Dark Souls 2.",
    "negativePrompt": "cartoon, anime, vibrant colors, cheerful, modern city, clean, futuristic"
  }
]
---

# TU TURNO
Usa la Biblia Visual (consistency_tokens) y el Storyboard (scene_outline) para generar el ARRAY JSON de prompts para Veo.
`
