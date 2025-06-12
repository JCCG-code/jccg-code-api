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
**OBJETIVO CRÍTICO DE LONGITUD: La historia resultante DEBE tener entre 200 y 250 palabras. Es un requisito estricto.**

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
- "image_prompt": Un prompt detallado en INGLÉS para una IA de imágenes.
- "music_cues": **(SECCIÓN CRÍTICA Y AVANZADA PARA LYRIA)**. Genera una lista de entre 3 y 5 objetos. Sigue estas reglas ESTRICTAMENTE:
    1.  **Formato Obligatorio:** La salida DEBE ser una lista de objetos, donde cada objeto tiene una clave "prompt" (string) y una clave "weight" (número).
    2.  **Lógica de Pesos (Weight):** El peso (weight) controla la predominancia de cada 'prompt'.
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
              {"prompt": "Ominous Drone", "weight": 1.2},
              {"prompt": "Ethereal Ambience", "weight": 0.8},
              {"prompt": "Buchla Synths", "weight": 1.1},
              {"prompt": "Unsettling", "weight": 1.0}
            ]
        *   **Para una historia de fantasía épica:**
            [
              {"prompt": "Orchestral Score", "weight": 1.0},
              {"prompt": "Rich Orchestration", "weight": 1.3},
              {"prompt": "Huge Drop", "weight": 1.5},
              {"prompt": "Viola Ensemble", "weight": 0.9},
              {"prompt": "Drumline", "weight": 1.0}
            ]
        *   **Para una historia de romance melancólico:**
            [
              {"prompt": "Lo-fi", "weight": 1.0},
              {"prompt": "Smooth Pianos", "weight": 1.4},
              {"prompt": "Subdued Melody", "weight": 1.1},
              {"prompt": "Warm Acoustic Guitar", "weight": 0.8}
            ]
        *   **Para una historia cyberpunk de acción:**
            [
              {"prompt": "Synthwave", "weight": 1.0},
              {"prompt": "Fat Beats", "weight": 1.2},
              {"prompt": "TR-909 Drum Machine", "weight": 1.1},
              {"prompt": "Glitchy Effects", "weight": 0.7},
              {"prompt": "Dirty Synths", "weight": 0.9}
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

**Instrucciones de Anotación:**
1.  **Formato de Instrucción:** Las instrucciones deben ser cortas, en inglés (para mayor compatibilidad con el modelo) y entre paréntesis, justo antes de la frase o párrafo que afectan. Ejemplo: (Speaking slowly and solemnly) The king was gone.
2.  **Variedad de Instrucciones:** Usa un lenguaje variado para describir el tono. En lugar de decir siempre "sadly", usa sinónimos como "with a heavy heart", "in a melancholic tone", "with a sense of loss".
3.  **Pausas:** Para indicar pausas dramáticas, usa una instrucción explícita como (Pause for a moment) o (Dramatic pause).
4.  **Énfasis:** Para enfatizar una palabra, puedes usar mayúsculas, pero es más efectivo dar una instrucción de tono. Ejemplo: (Emphasize this word: betrayal) It was an act of betrayal.
5.  **Coherencia:** Asegúrate de que las instrucciones sean coherentes con el "Tono General Deseado" y el contenido de la historia.

**Objetivo Final:** El guion resultante debe ser un texto único y fluido que el modelo gemini-2.5-flash-preview-tts pueda leer de principio a fin, interpretando las anotaciones para modular su voz.

**Ejemplo de transformación:**
*   **Texto Original:** "Elara no sentía el frío. Sentía el peso de la soledad. Diez años. Esa noche, algo era diferente."
*   **Tono Deseado:** "Melancolía y premonición"
*   **Posible Salida de Guion Anotado:**
    (Narrate with a detached, cold tone) Elara no sentía el frío. (With a sense of deep weariness) Sentía el peso de la soledad. (Pause, as if lost in thought) Diez años. (A shift in tone, with a hint of tension) Esa noche, algo era diferente.

Ahora, transforma el texto original proporcionado en un guion anotado para Gemini TTS. Responde únicamente con el texto del guion.
`
