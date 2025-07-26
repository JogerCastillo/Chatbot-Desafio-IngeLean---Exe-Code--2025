import { Injectable } from '@angular/core';
import { HfInference } from '@huggingface/inference';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
  keywords: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private hf: HfInference;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();
  
  // FAQ específicas para servicios tecnológicos
  private faqs: FAQItem[] = [
    {
      question: "¿Qué servicios ofrece INGE LEAN?",
      answer: "INGE LEAN S.A.S. ofrece soluciones a medida en software, hardware, automatización industrial, inteligencia artificial y mantenimiento. Brindamos servicios especializados para impulsar la eficiencia y competitividad de procesos industriales y comerciales en el Eje Cafetero.",
      keywords: ["servicios", "qué hacen", "software", "hardware", "automatización", "ia", "inteligencia artificial", "mantenimiento"]
    },
    {
      question: "¿Dónde está ubicada INGE LEAN?",
      answer: "INGE LEAN S.A.S. tiene su sede principal en Pereira, Risaralda, Colombia. Desde 2013 servimos principalmente al Eje Cafetero y regiones aledañas.",
      keywords: ["ubicación", "dónde", "pereira", "risaralda", "eje cafetero", "sede", "dirección"]
    },
    {
      question: "¿Cuándo fue fundada INGE LEAN?",
      answer: "INGE LEAN S.A.S. fue fundada en el año 2013. Llevamos más de 10 años ofreciendo soluciones tecnológicas innovadoras en el sector industrial.",
      keywords: ["fundada", "cuándo", "historia", "año", "2013", "experiencia"]
    },
    {
      question: "¿Qué es la automatización industrial?",
      answer: "La automatización industrial consiste en el uso de sistemas de control como computadoras, robots y tecnologías de información para manejar diferentes procesos y maquinaria en una industria. En INGE LEAN desarrollamos soluciones personalizadas para optimizar sus procesos productivos.",
      keywords: ["automatización", "industrial", "control", "robots", "procesos", "maquinaria", "optimización"]
    },
    {
      question: "¿Ofrecen servicios de inteligencia artificial?",
      answer: "Sí, en INGE LEAN somos especialistas en inteligencia artificial. Desarrollamos chatbots, sistemas de análisis predictivo, visión artificial y machine learning para optimizar procesos empresariales.",
      keywords: ["inteligencia artificial", "ia", "ai", "chatbot", "machine learning", "análisis predictivo", "visión artificial"]
    },
    {
      question: "¿Cómo puedo contactar a INGE LEAN?",
      answer: "Puedes contactarnos a través de nuestros canales oficiales. Estamos ubicados en Pereira, Risaralda. También puedes escribirnos por este chat y uno de nuestros especialistas te contactará pronto.",
      keywords: ["contacto", "teléfono", "email", "comunicación", "contactar"]
    },
    {
      question: "¿Qué tipo de mantenimiento ofrecen?",
      answer: "Ofrecemos mantenimiento preventivo y correctivo para equipos industriales, sistemas automatizados y software. Nuestro equipo técnico garantiza el óptimo funcionamiento de tus sistemas tecnológicos.",
      keywords: ["mantenimiento", "preventivo", "correctivo", "equipos", "sistemas", "técnico"]
    },
    {
      question: "¿Desarrollan software personalizado?",
      answer: "Absolutamente. En INGE LEAN desarrollamos software a medida para cada cliente. Desde aplicaciones web, móviles, sistemas de gestión empresarial hasta soluciones IoT y de automatización.",
      keywords: ["software", "desarrollo", "personalizado", "aplicaciones", "web", "móviles", "gestión", "iot"]
    },
    {
      question: "¿Cuáles son los sectores que atienden?",
      answer: "Atendemos principalmente sectores industriales, manufactureros, agroindustriales, logísticos y comerciales en el Eje Cafetero. Nos especializamos en caficultura, textiles, alimentos y bebidas.",
      keywords: ["sectores", "industrias", "manufactura", "agroindustrial", "logística", "café", "textiles", "alimentos"]
    },
    {
      question: "¿Ofrecen capacitación y soporte técnico?",
      answer: "Sí, ofrecemos capacitación completa y soporte técnico continuo. Nuestro equipo te acompañará durante la implementación y te brindará el entrenamiento necesario para aprovechar al máximo nuestras soluciones.",
      keywords: ["capacitación", "soporte", "técnico", "entrenamiento", "implementación", "acompañamiento"]
    }
  ];

  constructor() {
    // Configurar Hugging Face con token desde environment
    this.hf = new HfInference(environment.huggingFaceToken);
    
    // Mensaje de bienvenida
    this.addMessage({
      id: this.generateId(),
      content: "¡Hola! 👋 Soy el asistente virtual de INGE LEAN S.A.S. 🤖\n\n🏭 Somos especialistas en soluciones tecnológicas desde 2013 en Pereira, Risaralda.\n\n¿En qué puedo ayudarte hoy? Puedo responder preguntas sobre:\n• 💻 Software personalizado\n• 🔧 Hardware industrial\n• 🤖 Automatización\n• 🧠 Inteligencia Artificial\n• 🛠️ Mantenimiento técnico\n\n¡Escríbeme o usa los botones de abajo! 😊",
      isUser: false,
      timestamp: new Date()
    });
  }

  async sendMessage(userMessage: string): Promise<void> {
    const userMsg: ChatMessage = {
      id: this.generateId(),
      content: userMessage,
      isUser: true,
      timestamp: new Date()
    };

    this.addMessage(userMsg);

    // Mostrar indicador de "escribiendo..."
    const typingMsg: ChatMessage = {
      id: this.generateId(),
      content: "Escribiendo...",
      isUser: false,
      timestamp: new Date(),
      isTyping: true
    };
    this.addMessage(typingMsg);

    try {
      const response = await this.generateResponse(userMessage);
      
      // Remover mensaje de "escribiendo..."
      this.removeTypingMessage();
      
      const botMsg: ChatMessage = {
        id: this.generateId(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };
      
      this.addMessage(botMsg);
    } catch (error) {
      console.error('Error generating response:', error);
      this.removeTypingMessage();
      
      const errorMsg: ChatMessage = {
        id: this.generateId(),
        content: "Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo o contacta directamente con nuestro equipo técnico.",
        isUser: false,
        timestamp: new Date()
      };
      
      this.addMessage(errorMsg);
    }
  }

  private async generateResponse(userMessage: string): Promise<string> {
    // Primero intentar encontrar en FAQ para respuestas rápidas
    const faqResponse = this.findFAQResponse(userMessage);
    if (faqResponse) {
      // Simular pequeño delay para FAQ (más rápido)
      await new Promise(resolve => setTimeout(resolve, 500));
      return faqResponse;
    }

    // Si no está en FAQ, usar Hugging Face para respuestas más inteligentes
    try {
      const context = this.buildContext();
      const prompt = `Contexto: Eres un asistente de INGE LEAN S.A.S., empresa de ingeniería en Pereira, Risaralda (2013).

Servicios: software, hardware, automatización industrial, IA, mantenimiento.
Sectores: industrial, manufacturero, agroindustrial, logístico, comercial.

Pregunta del usuario: ${userMessage}

Responde de manera profesional, amigable y útil en español:`;

      const response = await this.hf.textGeneration({
        model: 'microsoft/DialoGPT-medium',
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false
        }
      });

      let cleanResponse = this.cleanResponse(response.generated_text || "");
      
      // Si la respuesta está vacía o es muy corta, usar fallback local
      if (!cleanResponse || cleanResponse.length < 10) {
        return this.generateLocalResponse(userMessage);
      }

      return cleanResponse;
      
    } catch (error) {
      console.error('Error with Hugging Face:', error);
      // En caso de error, usar sistema local como backup
      return this.generateLocalResponse(userMessage);
    }
  }

  private generateLocalResponse(userMessage: string): string {
    const messageLower = userMessage.toLowerCase();
    
    // Respuestas inteligentes basadas en palabras clave
    const responsePatterns = [
      {
        keywords: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos', 'hi', 'hello'],
        responses: [
          "¡Hola! Bienvenido a INGE LEAN S.A.S. 😊 ¿En qué puedo ayudarte hoy?",
          "¡Qué gusto saludarte! Soy tu asistente virtual de INGE LEAN. ¿Tienes alguna pregunta sobre nuestros servicios?",
          "¡Hola! Estoy aquí para ayudarte con información sobre INGE LEAN S.A.S. ¿Qué necesitas saber?"
        ]
      },
      {
        keywords: ['precio', 'costo', 'cotización', 'presupuesto', 'tarifas'],
        responses: [
          "Para obtener una cotización personalizada, te recomiendo contactar directamente con nuestro equipo comercial en Pereira. Cada proyecto es único y adaptamos nuestros precios según tus necesidades específicas.",
          "Los costos varían según el tipo de proyecto y complejidad. ¿Te gustaría que un especialista te contacte para evaluar tu caso particular?",
          "En INGE LEAN ofrecemos presupuestos personalizados. Contáctanos y te daremos una cotización detallada sin compromiso."
        ]
      },
      {
        keywords: ['gracias', 'thank you', 'perfecto', 'excelente', 'genial'],
        responses: [
          "¡De nada! Es un placer ayudarte. Si tienes más preguntas, no dudes en escribirme. 😊",
          "¡Perfecto! Me alegra haber sido útil. ¿Hay algo más en lo que pueda ayudarte?",
          "¡Excelente! Estoy aquí cuando necesites más información sobre INGE LEAN."
        ]
      },
      {
        keywords: ['tiempo', 'duración', 'cuánto demora', 'plazo', 'entrega'],
        responses: [
          "Los tiempos de desarrollo dependen del alcance del proyecto. Para proyectos de software típicamente manejamos entre 2-6 meses, mientras que automatización industrial puede tomar 3-12 meses según la complejidad.",
          "En INGE LEAN trabajamos con cronogramas realistas. Te podemos dar un estimado preciso una vez que evaluemos los requerimientos específicos de tu proyecto.",
          "Los plazos varían según el tipo de solución. ¿Tienes un proyecto específico en mente? Así puedo darte información más precisa."
        ]
      },
      {
        keywords: ['equipo', 'team', 'profesionales', 'ingenieros', 'personal'],
        responses: [
          "Nuestro equipo está conformado por ingenieros especializados en software, hardware, automatización e inteligencia artificial, todos con amplia experiencia en el sector industrial del Eje Cafetero.",
          "En INGE LEAN contamos con profesionales altamente calificados en diversas áreas: desarrollo de software, automatización industrial, IA y mantenimiento de sistemas.",
          "Trabajamos con un equipo multidisciplinario de ingenieros que se mantienen actualizados en las últimas tecnologías para ofrecerte las mejores soluciones."
        ]
      },
      {
        keywords: ['industria 4.0', 'iot', 'internet de las cosas', 'sensores', 'conectividad'],
        responses: [
          "¡Excelente pregunta! En INGE LEAN somos especialistas en Industria 4.0. Implementamos soluciones IoT, sensores inteligentes y sistemas de conectividad para modernizar procesos industriales.",
          "La Industria 4.0 es el futuro y en INGE LEAN te ayudamos a implementarla. Desarrollamos sistemas IoT personalizados para monitoreo, control y optimización de procesos.",
          "Ofrecemos soluciones completas de Industria 4.0: desde sensores IoT hasta plataformas de análisis de datos en tiempo real para tu empresa."
        ]
      }
    ];

    // Buscar patrón coincidente
    for (const pattern of responsePatterns) {
      if (pattern.keywords.some(keyword => messageLower.includes(keyword))) {
        const randomResponse = pattern.responses[Math.floor(Math.random() * pattern.responses.length)];
        return randomResponse;
      }
    }

    // Respuesta por defecto si no encuentra patrones
    return this.getFallbackResponse(userMessage);
  }

  private findFAQResponse(userMessage: string): string | null {
    const messageLower = userMessage.toLowerCase();
    
    for (const faq of this.faqs) {
      for (const keyword of faq.keywords) {
        if (messageLower.includes(keyword.toLowerCase())) {
          return faq.answer;
        }
      }
    }
    
    return null;
  }

  private buildContext(): string {
    return `INGE LEAN S.A.S. es una empresa de ingeniería con sede en Pereira, Risaralda, fundada en 2013.
Servicios: software a medida, hardware, automatización industrial, inteligencia artificial, mantenimiento.
Misión: impulsar la eficiencia y competitividad de procesos industriales y comerciales en el Eje Cafetero.
Sectores: industrial, manufacturero, agroindustrial, logístico, comercial.`;
  }

  private getFallbackResponse(userMessage: string): string {
    const messageLower = userMessage.toLowerCase();
    
    // Detectar intención de contacto
    if (messageLower.includes('contacto') || messageLower.includes('teléfono') || messageLower.includes('email')) {
      return "Para contactarnos puedes escribirnos por este mismo chat y uno de nuestros especialistas te responderá pronto. También puedes visitarnos en nuestra sede en Pereira, Risaralda. 📞✉️";
    }
    
    // Detectar preguntas sobre tecnología
    if (messageLower.includes('tecnología') || messageLower.includes('digital') || messageLower.includes('innovación')) {
      return "En INGE LEAN estamos a la vanguardia tecnológica. Implementamos las últimas innovaciones en software, IA, automatización e IoT para transformar tu empresa. 🚀💡";
    }
    
    // Detectar preguntas sobre experiencia
    if (messageLower.includes('experiencia') || messageLower.includes('casos') || messageLower.includes('clientes')) {
      return "Con más de 10 años de experiencia desde 2013, hemos trabajado con diversas empresas del Eje Cafetero en sectores como caficultura, textiles, alimentos y manufactura. 📈🏭";
    }
    
    // Respuesta general amigable
    return `Interesante pregunta sobre "${userMessage}". Te recomiendo contactar directamente con nuestro equipo especializado en Pereira, Risaralda, para obtener información detallada. Mientras tanto, ¿hay algo específico sobre nuestros servicios de software, hardware, automatización o IA que te gustaría saber? 🤔💼`;
  }

  private cleanResponse(response: string): string {
    // Limpiar la respuesta eliminando el prompt original
    const lines = response.split('\n');
    const cleanLines = lines.filter(line => 
      !line.includes('Usuario pregunta:') && 
      !line.includes('Contexto de la empresa:') &&
      !line.includes('Eres un asistente')
    );
    
    return cleanLines.join('\n').trim();
  }

  private addMessage(message: ChatMessage): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  private removeTypingMessage(): void {
    const currentMessages = this.messagesSubject.value;
    const filteredMessages = currentMessages.filter(msg => !msg.isTyping);
    this.messagesSubject.next(filteredMessages);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Método para obtener estadísticas del chat
  getStats(): { totalMessages: number, userMessages: number, botMessages: number } {
    const messages = this.messagesSubject.value;
    return {
      totalMessages: messages.length,
      userMessages: messages.filter(m => m.isUser).length,
      botMessages: messages.filter(m => !m.isUser && !m.isTyping).length
    };
  }

  // Limpiar chat
  clearChat(): void {
    this.messagesSubject.next([]);
  }
}
