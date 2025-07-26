import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatFixedComponent } from './components/chat-fixed.component';
import { StatsComponent } from './components/stats.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatFixedComponent, StatsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Exe-Code - Chatbot Inteligente';
}
