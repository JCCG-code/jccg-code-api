# 🎥 Cinematic AI Storytelling Pipeline 🤖

[![Build Status](https://img.shields.io/github/actions/workflow/status/JCCG-Code/jccg-code-api/main.yml?branch=main)](https://github.com/JCCG-Code/jccg-code-api/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-blue.svg)](https://nodejs.org/)
[![Made with Gemini & Imagen](https://img.shields.io/badge/Made%20with-Gemini%20%26%20Imagen-8A2BE2.svg)](https://ai.google.dev/)

Este proyecto es un pipeline de generación de contenido de extremo a extremo, diseñado para transformar una única idea conceptual en una experiencia multimedia completa y cinematográfica. Partiendo de una simple frase, el sistema orquesta una sinfonía de modelos de IA para escribir una historia, generar una narración con voz, componer una banda sonora, crear un storyboard visual y, finalmente, ensamblar todo en un video listo para ser compartido en plataformas como TikTok o Instagram.

---

## ✨ El Producto Final

El resultado de cada ejecución es un video corto y atmosférico, con una narración evocadora, música original y visuales coherentes.

_(Consejo: Graba uno de tus mejores videos, súbelo a YouTube o conviértelo en un GIF y ponlo aquí para un impacto máximo)_

**Ejemplo de Salida:**

[![Ejemplo de Video](https://img.youtube.com/vi/ID_DE_TU_VIDEO/hqdefault.jpg)](https://www.youtube.com/watch?v=ID_DE_TU_VIDEO)
_(Haz clic en la imagen para ver un ejemplo de video generado por el pipeline)_

---

## 核心 Core Features

- **Generación de Historias Dinámicas:** A partir de una "semilla" de lore (ej. "Dark Souls 2"), el sistema genera historias cortas, únicas y canónicamente precisas, asegurando una variedad infinita.
- **Dirección de IA Multi-capa:** Utiliza un enfoque de "cadena de prompts" donde diferentes IAs asumen roles de Director Creativo, Director de Arte y Compositor Musical para definir el tono, el estilo visual y la atmósfera auditiva.
- **Generación Automatizada de Activos:**
  - **Voz:** Sintetiza la narración con el tono y la voz sugeridos.
  - **Música:** Genera una banda sonora original basada en "cues" musicales detallados.
  - **Imágenes:** Crea un "storyboard" visual coherente, generando imágenes en formato 9:16 para cada escena clave.
- **Ensamblaje de Video Cinematográfico:** Utiliza **FFmpeg** de forma programática para ensamblar todos los activos generados (imágenes, voz, música) en un archivo de video `.mp4` final, con transiciones de fundido y una mezcla de audio profesional.
- **Arquitectura Eficiente y Escalable:** Todo el proceso se orquesta en el backend, utilizando almacenamiento temporal local para el procesamiento intermedio y **Google Cloud Storage** únicamente para el almacenamiento del producto final, optimizando la velocidad y los costos.

---

## 🏗️ Arquitectura del Pipeline

El sistema funciona como una cadena de montaje automatizada. Cada paso alimenta al siguiente, asegurando coherencia y calidad en el producto final.

```mermaid
graph TD
    A[💡 Idea Inicial / Semilla] --> B{Paso 1: Dirección Creativa};
    B --> C{Paso 2: Guion y Storyboard};
    C --> D[Paso 3.1: Generar Narración (Voz)];
    C --> E[Paso 3.2: Generar Banda Sonora (Música)];
    C --> F[Paso 3.3: Generar Visuales (Imágenes)];
    subgraph "Generación de Activos (Paralelo)"
        D
        E
        F
    end
    D --> G{Paso 4: Ensamblaje de Video con FFmpeg};
    E --> G;
    F --> G;
    G --> H[🎞️ Video Final (.mp4)];
    H --> I[☁️ Subir a Google Cloud Storage];
    I --> J[🔗 URL Pública];
```

## 🛠️ Stack Tecnológico

- **Backend:** Node.js, Express.js
- **IA - Lenguaje y Lógica:** Google Gemini
- **IA - Generación de Imágenes:** Google Imagen 3
- **IA - Generación de Música:** Google Lyria (o similar)
- **Procesamiento de Video:** FFmpeg
- **Base de Datos:** MongoDB con Mongoose (para gestionar las "semillas de historia")
- **Almacenamiento en la Nube:** Google Cloud Storage (GCS)
- **Despliegue:** Docker, Google Cloud Run (o cualquier entorno de Node.js)

---

## 🚀 Cómo Empezar

Sigue estos pasos para poner en marcha el proyecto en tu entorno local.

### Prerrequisitos

- [Node.js](https://nodejs.org/) (v18.x o superior)
- [FFmpeg](https://ffmpeg.org/download.html) instalado y accesible en el PATH de tu sistema.
- [Docker](https://www.docker.com/products/docker-desktop/) (Opcional, pero recomendado para un despliegue fácil)
- Una cuenta de Google Cloud con un proyecto y un bucket de GCS creados.
- Una clave de API de Google Gemini.

### Instalación

1.  **Clona el repositorio:**

    ```bash
    git clone https://github.com/JCCG-Code/jccg-code-api.git
    cd jccg-code-api
    ```

2.  **Instala las dependencias:**

    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto, basándote en el archivo `.env.example`.

    ```ini
    # .env.example

    # Clave de API de Google para Gemini e Imagen
    GEMINI_API_KEY="AIzaSy..."

    # Nombre de tu bucket en Google Cloud Storage
    GCS_BUCKET_NAME="nombre-de-tu-bucket"

    # URI de conexión a tu base de datos MongoDB
    MONGO_URI="mongodb+srv://..."

    # Modelos de IA (puedes cambiarlos si usas otros)
    GEMINI_MODEL_TEXT="gemini-1.5-flash-latest"
    GEMINI_MODEL_IMAGE="imagen-3.0-generate-002"
    ```

4.  **Autenticación con Google Cloud:**
    Asegúrate de que tu entorno está autenticado para poder interactuar con GCS. La forma más fácil es usando la CLI de gcloud:
    ```bash
    gcloud auth application-default login
    ```

### Ejecutar la Aplicación

- **Para desarrollo:**

  ```bash
  npm run dev
  ```

- **Con Docker (recomendado):**
  Asegúrate de que tu `Dockerfile` esté configurado correctamente.
  ```bash
  docker build -t mi-api-cinematica .
  docker run -p 8080:8080 --env-file .env mi-api-cinematica
  ```

---

## 🛣️ Hoja de Ruta y Futuras Mejoras

Este proyecto tiene un enorme potencial de crecimiento. Aquí hay algunas de las próximas características en las que se está trabajando:

- [x] **Pipeline MVP:** Generación completa de activos y ensamblaje de video.
- [ ] **Sincronización Inteligente:** Implementar la sincronización de escenas basada en el contenido del texto en lugar de la división proporcional.
- [ ] **Subtítulos Automáticos:** Generar y "quemar" subtítulos en el video final para mayor accesibilidad.
- [ ] **Títulos y Créditos:** Añadir pantallas de título y créditos generadas por FFmpeg.
- [ ] **Efectos de Sonido Diegéticos:** Usar IA para generar sonidos ambientales (viento, goteo, pasos) y mezclarlos en el audio.
- [ ] **Animación de Escenas (Imagen-a-Video):** Integrar un modelo como Runway o Pika para convertir cada imagen estática en un clip de video corto.
- [ ] **Exploración de Texto-a-Video:** Preparar el sistema para la integración de modelos de vanguardia como Google Veo o OpenAI Sora.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si tienes ideas para mejorar el pipeline, optimizar los comandos de FFmpeg o integrar nuevos modelos de IA, por favor, abre un "issue" para discutirlo o envía un "pull request".

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
