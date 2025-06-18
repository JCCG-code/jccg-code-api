# 🏭 Stories Factory 🤖

[![Build Status](https://img.shields.io/github/actions/workflow/status/JCCG-Code/jccg-code-api/main.yml?branch=main)](https://github.com/JCCG-Code/jccg-code-api/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20.x+-blue.svg)](https://nodejs.org/)
[![Orquestado con](https://img.shields.io/badge/Orquestado%20con-n8n-orange.svg)](https://n8n.io/)
[![Contenedorizado con](https://img.shields.io/badge/Contenedorizado%20con-Docker-blue.svg)](https://www.docker.com/)
[![IA por](https://img.shields.io/badge/IA%20por-Google%20Cloud-4285F4.svg)](https://ai.google.dev/)

**Stories Factory** es un pipeline de automatización de extremo a extremo que transforma una simple idea conceptual en una experiencia de video corta y cinematográfica. Orquestado por **n8n** y ejecutado localmente con Docker, el sistema utiliza una suite de modelos de IA de Google Cloud para escribir una historia, generar una narración con voz, componer una banda sonora, y crear un video completo, listo para ser publicado automáticamente en TikTok y YouTube Shorts.

---

## ✨ El Producto Final

Cada ejecución produce un video vertical y atmosférico, con una narración evocadora, música original y visuales coherentes, diseñado para captar la atención en plataformas de video corto.

**Ejemplo de Salida:**

[![El Martillo Mudo](https://i.ytimg.com/vi/gZ2IpyXo0ag/hqdefault.jpg)](https://www.youtube.com/shorts/gZ2IpyXo0ag)
_(Haz clic en la imagen para ver un ejemplo de video generado por el pipeline)_

---

## 核心 Core Features

- **Orquestación de Extremo a Extremo (n8n):** Todo el proceso, desde la creación hasta la publicación, es gestionado por un workflow de n8n, asegurando un flujo de trabajo robusto y automatizado.
- **Generación de Lore y Guion (Gemini):** A partir de una "semilla" de historia almacenada en MongoDB, se generan guiones únicos y narrativas cortas, garantizando una fuente inagotable de contenido original.
- **Creación de Activos Multimedia por IA (Google Cloud):**
  - **Voz:** El guion se convierte en una narración de audio utilizando los modelos Text-to-Speech de **Gemini**.
  - **Música:** Se compone una banda sonora original y atmosférica con **Lyria**.
  - **Imágenes:** Se crea un storyboard visual coherente con **Imagen 3**.
  - **Video:** Los guiones y las imágenes se transforman en clips de video dinámicos con **Veo 2.0**.
- **Ensamblaje y Post-producción (FFmpeg):** Todos los activos generados (clips de video, voz, música) se ensamblan programáticamente en un archivo `.mp4` final, con una mezcla de audio y transiciones de calidad.
- **Publicación Directa en Redes Sociales:** El video final se sube automáticamente a **TikTok** y **YouTube Shorts** a través de sus respectivas APIs.
- **Arquitectura Efímera y Local (Docker):** Todo el entorno se levanta con `docker compose up` y se destruye al finalizar con `docker compose down`, procesando los activos en un bucket temporal de Google Cloud Storage para máxima eficiencia.

---

## 🏗️ Arquitectura del Pipeline

El sistema funciona como una cadena de montaje automatizada, orquestada por n8n. Cada paso alimenta al siguiente para producir el video final y publicarlo.

````mermaid
graph TD
    A[💡 Idea Inicial / Semilla de MongoDB] --> B{Paso 1: Generar Guion con Gemini};
    B --> C{Paso 2: Creación de Activos con IA de Google};
    subgraph "Generación de Activos (Paralelo)"
        C -- Texto --> D[Voz (Gemini TTS)];
        C -- Mood --> E[Música (Lyria)];
        C -- Guion/Escenas --> F[Video (Veo 2.0)];
    end
    D --> G{Paso 3: Ensamblaje Final con FFmpeg};
    E --> G;
    F --> G;
    G --> H[🎞️ Video Final (.mp4)];
    H --> I[🚀 Publicar en TikTok y YouTube];

## 🛠️ Stack Tecnológico

- **Orquestación:** n8n (auto-alojado)
- **Backend:** Node.js, Express.js
- **IA - Lenguaje, Voz, Música y Video:** Google Cloud AI (Gemini, Imagen 3, Veo 2.0, Lyria)
- **Procesamiento de Video:** FFmpeg
- **Base de Datos:** MongoDB (para gestionar `storyseeds` y `jobs`)
- **Almacenamiento Temporal:** Google Cloud Storage (GCS)
- **Entorno de Ejecución:** Docker / Docker Compose

---

## 🚀 Cómo Empezar

El proyecto está diseñado para ejecutarse de forma contenida y automatizada a través de Docker.

### Prerrequisitos

- [Docker](https://www.docker.com/products/docker-desktop/) y Docker Compose instalados.
- Una cuenta de Google Cloud con un proyecto y un bucket de GCS creados.
- Credenciales de API para los servicios de Google Cloud (AI, GCS).
- Una URI de conexión a tu base de datos MongoDB.
- Credenciales de desarrollador para las APIs de TikTok y YouTube.

### Instalación y Ejecución

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/JCCG-Code/jccg-code-api.git
    cd jccg-code-api
    ```

2.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto, basándote en el archivo `.env.example`. Rellena todas las claves de API, URIs y nombres de modelos.

    ```ini
    # .env (ejemplo)
    # Credenciales de Google Cloud
    GCS_BUCKET_NAME="nombre-de-tu-bucket"
    GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/credentials.json"

    # Conexión a MongoDB
    MONGO_URI="mongodb+srv://..."

    # Nombres de los Modelos de IA
    GEMINI_MODEL_TEXT='gemini-2.5-flash-preview-05-20'
    GEMINI_MODEL_VOICE='gemini-2.5-pro-preview-tts'
    GEMINI_MODEL_MUSIC='models/lyria-realtime-exp'
    GEMINI_MODEL_IMAGE='imagen-3.0-generate-002'
    GEMINI_MODEL_VIDEO='veo-2.0-generate-001'

    # Credenciales de n8n y redes sociales...
    ```

3.  **Ejecuta el Pipeline:**
    Con Docker en funcionamiento, simplemente levanta el entorno. Esto construirá las imágenes si es necesario y arrancará los servicios. El workflow de n8n debería iniciarse automáticamente y comenzar el proceso.
    ```bash
    docker compose up --build
    ```

4.  **Ver los Logs:**
    Para seguir el progreso de la generación en tiempo real, abre otra terminal y ejecuta:
    ```bash
    docker compose logs -f
    ```

---

## 🛣️ Hoja de Ruta y Futuras Mejoras

- [x] **Pipeline MVP:** Generación completa de activos, ensamblaje y publicación.
- [ ] **Sincronización Inteligente:** Mejorar la sincronización de la voz con las escenas de video basándose en marcas de tiempo del guion.
- [ ] **Subtítulos Automáticos:** Generar y "quemar" subtítulos en el video final para mayor accesibilidad.
- [ ] **Efectos de Sonido Diegéticos:** Usar IA para generar sonidos ambientales (viento, goteo, pasos) y mezclarlos en el audio.
- [ ] **Interfaz de Gestión:** Crear una pequeña interfaz web para iniciar trabajos, ver el historial y gestionar las "semillas de historia".

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si tienes ideas para mejorar el pipeline, optimizar los prompts o integrar nuevos modelos, por favor, abre un "issue" para discutirlo o envía un "pull request".

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
````
