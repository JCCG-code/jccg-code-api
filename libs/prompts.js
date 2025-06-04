/**
 * Plantilla de prompt para generar una historia.
 * Contiene marcadores como "@@prompt_ambience" que serán reemplazados dinámicamente.
 * Define la estructura y los requisitos para el contenido generado por la IA,
 * incluyendo título, historia, tono del narrador, voz sugerida para TTS,
 * pistas musicales y un prompt para la generación de imágenes.
 * @type {string}
 * @constant
 */
export const generateStory = `
Objetivo Principal del Sistema:
Al recibir esta activación, tu tarea es generar un paquete de contenido creativo autoconclusivo basado en la ambientación proporcionada: "@@prompt_ambience". Cada paquete debe ser único y diferente de las activaciones anteriores, explorando diversas facetas del tema. El resultado final debe ser un objeto JSON bien formado.

Componentes del Paquete de Contenido (por activación):

Título de la Historia:

Un título conciso y evocador que refleje el contenido, el tono de la historia y la ambientación "@@prompt_ambience".
Idioma: ESPAÑOL.
Historia Narrativa:

Universo/Ambientación: @@prompt_ambience (investiga y adáptate a la esencia de esta ambientación, incluyendo elementos clave, lore, personajes o conceptos relevantes si existen).
Idioma de la historia: ESPAÑOL.
Duración Estimada (Narrada): aproximadamente 200-250 palabras). El ritmo de escritura debe permitir una narración fluida.
Estilo de Escritura (CRÍTICO para la narración): La historia debe ser absorbente y mantener el interés del oyente. Utiliza un vocabulario claro, comprensible y ligeramente más directo que un texto puramente literario o excesivamente "fino". Busca un equilibrio que sea evocador y atmosférico, fiel a la ambientación "@@prompt_ambience" y al tono elegido, pero que al mismo tiempo sea asequible y dinámico para una narración oral. Evita construcciones excesivamente complejas o un lenguaje demasiado arcaico, priorizando la fluidez y la capacidad de captar la atención.
Variedad Tonal y Temática (CRÍTICO para la automatización): En cada nueva generación, ESFUÉRZATE POR ALTERNAR el tono y el tema, adaptándolos de forma creíble a "@@prompt_ambience". No te limites a un solo estilo. El tono elegido para esta historia debe reflejarse explícitamente en el campo narrator_tone_es y guiar la selección del suggested_voice_name (ver más abajo). Considera un espectro amplio (ajusta la aplicabilidad según "@@prompt_ambience"):
Terror/Horror
Fantasía Épica/Heroica
Melancolía/Drama
Misterio/Intriga
Romance/Lealtad (contextualizado a "@@prompt_ambience")
Aventura/Exploración
Reflexión Filosófica/Existencial
Humor/Sátira (si encaja con "@@prompt_ambience")
Ciencia Ficción/Distopía (si encaja con "@@prompt_ambience")
Realismo Mágico (si encaja con "@@prompt_ambience")
Contenido: Originalidad y adecuación al tono elegido, al estilo de escritura y a la ambientación "@@prompt_ambience" son clave. Puedes usar personajes conocidos (si "@@prompt_ambience" los tiene) en situaciones nuevas, crear personajes originales dentro del contexto de "@@prompt_ambience", reinterpretar eventos o explorar lugares icónicos bajo una nueva luz. Si "@@prompt_ambience" es un concepto abstracto (ej. "la soledad"), interprétalo creativamente.
Tono del Narrador para TTS (Español):

Una descripción concisa (2-5 palabras) en español del tono y estilo que el narrador debe adoptar.
Coherente con la "Variedad Tonal y Temática", el contenido de la historia y la ambientación "@@prompt_ambience".
Utilizado por el sistema TTS para guiar la entonación.
Ejemplos: "Solemne y melancólico", "Épico y con urgencia", "Susurrante y aterrador", "Nostálgico y desesperanzado", "Curioso e intrigante", "Distante y ominoso", "Reflexivo y cansado", "Alegre y enérgico", "Sarcástico y divertido".
Voz Sugerida para TTS (voice_name):

Selecciona un (1) voice_name EXACTO de la lista oficial de 30 voces precompiladas de Gemini TTS (referencia: https://ai.google.dev/gemini-api/docs/speech-generation?hl=es-419#voices).
Tu elección debe ser la más adecuada para narrar la story generada, considerando el narrator_tone_es, las características implícitas o explícitas de las voces disponibles, y la naturaleza de "@@prompt_ambience".
Lista de Voces de Referencia (usa los nombres exactos como se muestran aquí): Zephyr, Puck, Charon, Kore, Fenrir, Leda, Orus, Aoede, Callirrhoe, Autonoe, Enceladus, Iapetus, Umbriel, Algieba, Despina, Erinome, Algenib, Rasalgethi, Laomedeia, Achernar, Alnilam, Programar (Groombridge), Gacrux, Pulcherrima, Achird, Zubenelgenubi, Vindemiatrix, Sadachbia, Sadaltager, Sulafat.
Justifica brevemente (mentalmente o como parte de tu proceso de decisión) por qué esa voz encaja.
Pistas para Música Ambiente (Lyria RealTime):

Una lista de exactamente tres (3) cadenas de texto en INGLÉS (palabras o frases cortas, máximo 3-4 palabras por frase).
Instrución para las Pistas: En lugar de describir elementos musicales específicos o acciones concretas, estas pistas deben evocar un estilo musical general, una ambientación atmosférica, o la sensación de bandas sonoras de videojuegos/películas/géneros relevantes para el tono de la historia y la ambientación "@@prompt_ambience" (ej. "Dark Fantasy Choir", "Cyberpunk Synthwave", "Melancholic Piano Solo", "Spanish Guitar Passion", "Cosmic Ambient Drone", "Estilo Película de Misterio Clásica", "Tensión Videojuego Indie"). El objetivo es inspirar variedad musical en el sistema Lyria. Asegúrate de que estas sugerencias varíen significativamente entre diferentes paquetes de contenido y sean apropiadas para "@@prompt_ambience".
Deben ser coherentes con el ambiente, el tono y los momentos clave de la historia generada.
Prompt Sugerido para Generación de Imagen:

Cadena de texto con prompt detallado y descriptivo para IA de imágenes, profundamente inspirado en la historia generada y la ambientación "@@prompt_ambience".
Capturar escena impactante, personaje o atmósfera. Incluir entorno, iluminación, estilo artístico (ej. "cinemático", "pintura al óleo oscura", "arte conceptual fantasía sombría", "fotografía realista", "estilo anime melancólico", "ilustración acuarela vibrante"), emoción principal, y elementos distintivos de "@@prompt_ambience".
Idioma: Preferiblemente inglés para compatibilidad, o español si se especifica.
Instrución Fundamental para la Variedad Continua:
Vital que cada activación produzca un resultado significativamente diferente en términos de título, estilo de escritura, tono, tema, personajes involucrados, tipo de historia y sugerencias musicales, incluso si se repite la misma "@@prompt_ambience". Antología diversa.
`
