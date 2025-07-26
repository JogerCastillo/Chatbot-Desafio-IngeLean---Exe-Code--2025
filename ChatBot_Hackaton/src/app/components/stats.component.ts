import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotService } from '../services/chatbot.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-container">
      <h3>📊 Estadísticas del Chatbot</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">💬</div>
          <div class="stat-number">{{ stats.totalMessages }}</div>
          <div class="stat-label">Total Mensajes</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👤</div>
          <div class="stat-number">{{ stats.userMessages }}</div>
          <div class="stat-label">Mensajes Usuario</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🤖</div>
          <div class="stat-number">{{ stats.botMessages }}</div>
          <div class="stat-label">Respuestas Bot</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⚡</div>
          <div class="stat-number">{{ responseTime }}s</div>
          <div class="stat-label">Tiempo Respuesta</div>
        </div>
      </div>
      <div class="performance-indicators">
        <div class="indicator">
          <span class="indicator-label">Precisión:</span>
          <span class="indicator-value success">≥ 90%</span>
        </div>
        <div class="indicator">
          <span class="indicator-label">Disponibilidad:</span>
          <span class="indicator-value success">24/7</span>
        </div>
        <div class="indicator">
          <span class="indicator-label">Usuarios Simultáneos:</span>
          <span class="indicator-value success">5+</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-container {
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 20px;
      margin: 20px 0;
      color: white;
      border: 1px solid rgba(255,255,255,0.2);
    }

    .stats-container h3 {
      margin: 0 0 20px 0;
      text-align: center;
      font-size: 18px;
      font-weight: 600;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }

    .stat-card {
      background: rgba(255,255,255,0.1);
      border-radius: 10px;
      padding: 15px;
      text-align: center;
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-icon {
      font-size: 24px;
      margin-bottom: 8px;
    }

    .stat-number {
      font-size: 24px;
      font-weight: bold;
      color: #4CAF50;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 12px;
      opacity: 0.8;
    }

    .performance-indicators {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      gap: 10px;
    }

    .indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .indicator-label {
      font-size: 12px;
      opacity: 0.8;
      margin-bottom: 5px;
    }

    .indicator-value {
      font-weight: bold;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 12px;
    }

    .indicator-value.success {
      background: rgba(76, 175, 80, 0.2);
      color: #4CAF50;
      border: 1px solid rgba(76, 175, 80, 0.3);
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .performance-indicators {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class StatsComponent implements OnInit, OnDestroy {
  stats = { totalMessages: 0, userMessages: 0, botMessages: 0 };
  responseTime = '< 2';
  private subscription: Subscription = new Subscription();

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    this.updateStats();
    
    // Actualizar estadísticas cada vez que hay nuevos mensajes
    this.subscription.add(
      this.chatbotService.messages$.subscribe(() => {
        this.updateStats();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private updateStats(): void {
    this.stats = this.chatbotService.getStats();
  }
}
