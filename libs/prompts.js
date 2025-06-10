/**
 * PASO 1: Director Creativo (Versión 2 - Anti-Anclaje).
 * Define el tono y el enfoque de la historia ANTES de escribirla para forzar la variedad.
 * Utiliza múltiples ejemplos para evitar el anclaje a un solo estilo.
 * @type {string}
 */
export const generateCreativeDirection = `
Basado en la siguiente ambientación general: "@@prompt_ambience".

Tu tarea es actuar como un director creativo y definir los parámetros para una historia corta única. No escribas la historia todavía.
Tu objetivo es garantizar la máxima variedad en cada ejecución.

Considera el espectro de tonos posibles y elige uno que se sienta fresco e inesperado para la ambientación.
Tonos posibles: Terror, Fantasía Épica, Melancolía, Misterio, Romance, Aventura, Reflexión Filosófica, Humor Negro, Sátira, Ciencia Ficción, Realismo Mágico.

Genera un objeto JSON con los siguientes campos:
- "chosen_tone": Una descripción del tono elegido (ej: "Melancolía existencial", "Terror cósmico lovecraftiano").
- "story_focus": Un concepto o personaje específico en el que se centrará la historia (ej: "La rutina de un bibliotecario en una ciudad fantasma", "El último pensamiento de un soldado").
- "key_element": Un objeto, evento o diálogo central que debe aparecer en la historia (ej: "Un reloj que corre hacia atrás", "Un mapa con una isla que no existe").

---
**Ejemplos de cómo pensar para diferentes ambientaciones (NO los copies, úsalos como inspiración para el patrón de creatividad):**

**Ejemplo 1 de inspiración:**
*   **Ambientación de entrada:** "Un bosque encantado y antiguo"
*   **JSON de salida posible:**
    {
      "chosen_tone": "Melancolía y pérdida",
      "story_focus": "El último árbol consciente del bosque recordando a sus compañeros caídos",
      "key_element": "Una única hoja dorada que nunca cae de sus ramas"
    }

**Ejemplo 2 de inspiración:**
*   **Ambientación de entrada:** "Una estación espacial abandonada"
*   **JSON de salida posible:**
    {
      "chosen_tone": "Terror y aislamiento claustrofóbico",
      "story_focus": "Un único superviviente escuchando un chat de mantenimiento que sigue activo, revelando los últimos momentos de la tripulación",
      "key_element": "El mensaje de audio repetitivo: 'No abras la escotilla 7. No es vacío lo que hay fuera.'"
    }

**Ejemplo 3 de inspiración:**
*   **Ambientación de entrada:** "La cubierta de un barco pirata durante una calma chicha"
*   **JSON de salida posible:**
    {
        "chosen_tone": "Humor negro y paranoia",
        "story_focus": "Dos piratas compitiendo para ver quién cuenta la mentira más grande para no morir de aburrimiento",
        "key_element": "Un loro que de repente dice una verdad incómoda sobre el capitán"
    }
---

Ahora, ignora estos ejemplos específicos y crea una combinación completamente **NUEVA y ORIGINAL** para la ambientación proporcionada.

**Ambientación a procesar:** "@@prompt_ambience"

Responde ÚNICAMENTE con el objeto JSON.
`

/**
 * PASO 2: Escritor (Versión 2 - Longitud Estricta).
 * Escribe la historia con un fuerte énfasis en cumplir con el recuento de palabras.
 * @type {string}
 */
export const generateStoryFromDirection = `
**OBJETIVO CRÍTICO DE LONGITUD: La historia resultante DEBE tener entre 200 y 250 palabras. Este no es un objetivo flexible, es un requisito estricto para el sistema.**

Tu única tarea es escribir una historia narrativa basándote en las siguientes directrices.

**Directrices Creativas:**
- Ambientación: "@@prompt_ambience"
- Tono que debes adoptar: "@@chosen_tone"
- Enfoque de la historia: "@@story_focus"
- Elemento clave que debe aparecer: "@@key_element"

**Requisitos de Estructura y Estilo:**
1.  **Longitud Obligatoria:** La longitud final del texto debe estar estrictamente entre 200 y 250 palabras.
2.  **Ritmo Narrativo:** Usa un lenguaje evocador pero claro, pensado para ser narrado oralmente. El ritmo debe ser fluido.
3.  **Estructura en Párrafos:** Organiza la historia en aproximadamente 3 o 4 párrafos bien definidos. Esto te ayudará a gestionar la longitud y el flujo de la narración.
4.  **Finalización Completa:** Asegúrate de que la historia tenga un final conclusivo dentro del límite de palabras. No la termines abruptamente solo para cumplir el requisito. Planifica la narración para que encaje de forma natural en el espacio asignado.

Responde únicamente con el texto de la historia, asegurándote de que cumple el requisito de longitud.
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
