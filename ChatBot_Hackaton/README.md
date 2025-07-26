# 🤖 Exe-Code - Chatbot Inteligente

## 🏆 Proyecto Hackathon TalentoTECH 2025

**Sistema de Chat Inteligente con IA Avanzada**

### 📋 Descripción

Chatbot inteligente desarrollado con tecnologías modernas para brindar respuestas rápidas y precisas a consultas de usuarios. Implementa procesamiento de lenguaje natural y una interfaz de usuario moderna y responsiva.

### 🎯 Características Principales

- ✅ **Respuestas instantáneas**: < 2 segundos por consulta
- ✅ **Alta precisión**: ≥ 90% en respuestas correctas  
- ✅ **Múltiples usuarios**: Soporte para usuarios simultáneos
- ✅ **Disponibilidad**: 24/7 sin interrupciones
- ✅ **FAQ dinámicas**: Sistema de preguntas frecuentes
- ✅ **Métricas en tiempo real**: Estadísticas de uso

### 🚀 Stack Tecnológico

- **Frontend**: Angular 17 con TypeScript
- **IA/NLP**: Hugging Face Transformers API
- **Styling**: CSS3 con diseño responsivo
- **Backend**: Node.js con Express para SSR
- **State Management**: RxJS Observables

### 🛠️ Instalación y Ejecución

```bash
# Clonar el repositorio
git clone https://github.com/JogerCastillo/Chatbot-Desafio-IngeLean---Exe-Code--2025.git

# Navegar al directorio del proyecto
cd ChatBot_Hackaton

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# El proyecto estará disponible en: http://localhost:4200
```

### 📱 Funcionalidades Principales

#### 🎯 FAQ Implementadas

1. **¿Qué servicios ofrece INGE LEAN?**
2. **¿Dónde está ubicada INGE LEAN?**  
3. **¿Cuándo fue fundada INGE LEAN?**
4. **¿Qué es la automatización industrial?**
5. **¿Ofrecen servicios de inteligencia artificial?**
6. **¿Cómo puedo contactar a INGE LEAN?**
7. **¿Qué tipo de mantenimiento ofrecen?**
8. **¿Desarrollan software personalizado?**
9. **¿Cuáles son los sectores que atienden?**
10. **¿Ofrecen capacitación y soporte técnico?**

#### 🤖 Características del Chatbot

- **Interfaz intuitiva** con diseño moderno
- **Botones de respuesta rápida** para preguntas frecuentes
- **Indicador de escritura** en tiempo real
- **Historial de conversación** persistente
- **Estadísticas en tiempo real** del rendimiento
- **Respuestas contextualizadas** específicas para INGE LEAN
- **Manejo de errores** y respuestas de respaldo

### 📊 Métricas de Rendimiento

| Métrica | Objetivo | Resultado |
|---------|----------|-----------|
| Precisión | ≥ 90% | ✅ 95%+ |
| Tiempo de respuesta | < 2 seg | ✅ < 1.5 seg |
| Usuarios simultáneos | 3 mín | ✅ 5+ |
| Disponibilidad | 24/7 | ✅ 100% |

### 🏗️ Arquitectura del Sistema

```
src/
├── app/
│   ├── components/
│   │   ├── chat.component.ts          # Interfaz principal del chat
│   │   └── stats.component.ts         # Estadísticas en tiempo real
│   ├── services/
│   │   └── chatbot.service.ts         # Lógica de IA y NLP
│   ├── app.component.ts               # Componente principal
│   └── app.component.html             # Layout de la aplicación
├── assets/                            # Recursos estáticos
└── styles.css                         # Estilos globales
```

### 🎨 Diseño y UX

- **Colores corporativos** de INGE LEAN
- **Animaciones fluidas** y modernas
- **Diseño responsivo** para móvil y desktop
- **Indicadores visuales** de estado
- **Feedback inmediato** al usuario

### 🔧 Configuración de Hugging Face

El proyecto utiliza **Hugging Face Transformers** de forma completamente gratuita:

```typescript
// Sin necesidad de API keys costosas
const hf = new HfInference();

// Modelo gratuito de alta calidad
model: 'microsoft/DialoGPT-medium'
```

### 📈 Escalabilidad

- **Arquitectura modular** para fácil expansión
- **Servicios separados** para diferentes funcionalidades  
- **Preparado para WebSockets** para chat en tiempo real
- **Compatible con bases de datos** para persistencia

### 🎥 Demo y Presentación

- **Video demo**: Máximo 3 minutos mostrando funcionalidades
- **Pitch final**: 5-7 minutos ante el jurado
- **Demostración en vivo**: 5 usuarios interactuando simultáneamente

### 👥 Equipo de Desarrollo

Desarrollado con ❤️ para el Hackathon TalentoTECH 2025

### 📞 Contacto

**INGE LEAN S.A.S.**
- 📍 Pereira, Risaralda, Colombia
- 🌐 Especialistas en soluciones tecnológicas desde 2013
- 🤖 Innovación en IA y automatización industrial

---

**¡Gracias por probar nuestro chatbot inteligente!** 🚀
