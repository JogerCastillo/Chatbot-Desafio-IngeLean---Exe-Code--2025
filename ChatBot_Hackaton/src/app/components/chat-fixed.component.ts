import { Component, OnInit, OnDestroy, AfterViewChecked, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ChatbotService } from '../services/chatbot.service';
import { ChatMessage } from '../models/chat.model';

@Component({
  selector: 'app-chat-fixed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chat-container">
      <div class="chat-header">
        <div class="header-content">
          <div class="company-logo">
            <div class="logo-circle">EC</div>
          </div>
          <div class="header-info">
            <h2>Exe-Code</h2>
            <p>Asistente Virtual - Siempre en línea</p>
          </div>
          <div class="online-indicator">
            <span class="status-dot"></span>
            <span>En línea</span>
          </div>
        </div>
      </div>

      <div class="chat-messages" #messagesContainer>
        <div *ngFor="let message of messages" 
             class="message"
             [ngClass]="{'user-message': message.isUser, 'bot-message': !message.isUser}">
          
          <div class="message-avatar" *ngIf="!message.isUser">
            <div class="bot-avatar">🤖</div>
          </div>
          
          <div class="message-content">
            <div class="message-bubble" 
                 [ngClass]="{'typing': message.isTyping}">
              <p *ngIf="!message.isTyping">{{ message.content }}</p>
              <div class="typing-indicator" *ngIf="message.isTyping">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div class="message-time">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
          
          <div class="message-avatar" *ngIf="message.isUser">
            <div class="user-avatar">👤</div>
          </div>
        </div>
      </div>

      <div class="quick-questions">
        <h4>Preguntas frecuentes:</h4>
        <div class="quick-buttons">
          <button *ngFor="let question of quickQuestions" 
                  (click)="sendQuickQuestion(question)"
                  class="quick-btn"
                  [disabled]="isLoading">
            {{ question }}
          </button>
        </div>
      </div>

      <div class="chat-input">
        <div class="input-container">
          <input 
            type="text" 
            [value]="currentMessage" 
            (input)="updateMessage($event)"
            (keydown.enter)="handleEnterKey($event)"
            placeholder="Escribe tu mensaje aquí..."
            [disabled]="isLoading"
            class="message-input"
            #messageInput>
          <button 
            (click)="sendMessage()" 
            [disabled]="!canSend()"
            class="send-btn"
            [ngClass]="{'enabled': canSend(), 'disabled': !canSend()}">
            <span *ngIf="!isLoading">📨 Enviar</span>
            <span *ngIf="isLoading" class="loading-spinner">⏳ Enviando...</span>
          </button>
        </div>
      </div>

      <div class="chat-footer">
        <p>Built by Exe-Code | Colombia</p>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      max-width: 800px;
      height: 90vh;
      margin: 0 auto;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
    }

    .chat-header {
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      padding: 20px;
      border-bottom: 1px solid rgba(255,255,255,0.2);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .company-logo .logo-circle {
      width: 50px;
      height: 50px;
      background: linear-gradient(45deg, #ff6b6b, #ffa726);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 18px;
    }

    .header-info h2 {
      margin: 0;
      color: white;
      font-size: 22px;
      font-weight: 600;
    }

    .header-info p {
      margin: 5px 0 0 0;
      color: rgba(255,255,255,0.8);
      font-size: 14px;
    }

    .online-indicator {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(255,255,255,0.9);
      font-size: 14px;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      background: #4ade80;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .message {
      display: flex;
      align-items: flex-end;
      gap: 10px;
      animation: slideIn 0.3s ease-out;
    }

    .user-message {
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
    }

    .bot-avatar, .user-avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .bot-avatar {
      background: linear-gradient(135deg, #667eea, #764ba2);
    }

    .user-avatar {
      background: linear-gradient(135deg, #ffeaa7, #fab1a0);
    }

    .message-content {
      max-width: 70%;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .user-message .message-content {
      align-items: flex-end;
    }

    .message-bubble {
      padding: 15px 20px;
      border-radius: 20px;
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .user-message .message-bubble {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .message-bubble p {
      margin: 0;
      line-height: 1.4;
    }

    .message-time {
      font-size: 12px;
      color: rgba(255,255,255,0.7);
      padding: 0 10px;
    }

    .typing-indicator {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    .typing-indicator span {
      width: 8px;
      height: 8px;
      background: #667eea;
      border-radius: 50%;
      animation: typing 1.4s infinite ease-in-out;
    }

    .typing-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .typing-indicator span:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typing {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-10px);
      }
    }

    .quick-questions {
      padding: 20px;
      border-top: 1px solid rgba(255,255,255,0.2);
    }

    .quick-questions h4 {
      color: rgba(255,255,255,0.9);
      margin: 0 0 15px 0;
      font-size: 16px;
      font-weight: 500;
    }

    .quick-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .quick-btn {
      padding: 8px 15px;
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 20px;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      backdrop-filter: blur(10px);
    }

    .quick-btn:hover:not(:disabled) {
      background: rgba(255,255,255,0.3);
      transform: translateY(-2px);
    }

    .quick-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .chat-input {
      padding: 20px;
      border-top: 1px solid rgba(255,255,255,0.2);
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
    }

    .input-container {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .message-input {
      flex: 1;
      padding: 15px 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 25px;
      background: rgba(255,255,255,0.9);
      color: #333;
      font-size: 16px;
      outline: none;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .message-input:focus {
      border-color: rgba(255,255,255,0.6);
      box-shadow: 0 0 20px rgba(255,255,255,0.2);
    }

    .message-input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .send-btn {
      padding: 15px 25px;
      border: none;
      border-radius: 25px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 120px;
      backdrop-filter: blur(10px);
    }

    .send-btn.enabled {
      background: linear-gradient(135deg, #4ade80, #22c55e);
      color: white;
      box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
    }

    .send-btn.enabled:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
    }

    .send-btn.disabled {
      background: rgba(255,255,255,0.3);
      color: rgba(255,255,255,0.7);
      cursor: not-allowed;
    }

    .loading-spinner {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .chat-footer {
      background: rgba(0,0,0,0.2);
      padding: 10px;
      text-align: center;
    }

    .chat-footer p {
      margin: 0;
      color: rgba(255,255,255,0.8);
      font-size: 12px;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Scrollbar personalizado */
    .chat-messages::-webkit-scrollbar {
      width: 6px;
    }

    .chat-messages::-webkit-scrollbar-track {
      background: rgba(255,255,255,0.1);
      border-radius: 3px;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.3);
      border-radius: 3px;
    }

    .chat-messages::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.5);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .chat-container {
        height: 100vh;
        border-radius: 0;
        max-width: 100%;
      }
      
      .quick-buttons {
        flex-direction: column;
      }
      
      .quick-btn {
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class ChatFixedComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  currentMessage: string = '';
  isLoading: boolean = false;
  private subscription: Subscription = new Subscription();

  quickQuestions: string[] = [
    "¿Qué servicios ofrecen?",
    "¿Dónde están ubicados?",
    "¿Desarrollan software personalizado?",
    "¿Ofrecen automatización industrial?",
    "¿Cómo los contacto?"
  ];

  constructor(
    private chatbotService: ChatbotService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.chatbotService.messages$.subscribe(messages => {
        this.messages = messages;
        this.cdr.detectChanges();
        this.scrollToBottom();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  updateMessage(event: any): void {
    this.currentMessage = event.target.value;
    this.cdr.detectChanges();
  }

  handleEnterKey(event: Event): void {
    event.preventDefault();
    this.sendMessage();
  }

  canSend(): boolean {
    return !this.isLoading && this.currentMessage.trim().length > 0;
  }

  async sendMessage(): Promise<void> {
    if (!this.canSend()) {
      return;
    }

    this.isLoading = true;
    const message = this.currentMessage.trim();
    this.currentMessage = '';
    this.cdr.detectChanges();

    try {
      await this.chatbotService.sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  sendQuickQuestion(question: string): void {
    this.currentMessage = question;
    this.cdr.detectChanges();
    this.sendMessage();
  }

  formatTime(timestamp: Date): string {
    return new Intl.DateTimeFormat('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      // Silently handle scroll error
    }
  }
}
