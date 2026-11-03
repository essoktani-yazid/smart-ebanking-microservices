import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, AsyncPipe } from '@angular/common';
import { HttpClient, HttpDownloadProgressEvent, HttpEventType } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { MarkdownComponent } from 'ngx-markdown';
import { LoadingService } from '../services/loading.service';
import { getGatewayUrl } from '../config/api.config';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  time: Date;
}

@Component({
  selector: 'app-bot-ui',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MarkdownComponent
  ],
  templateUrl: './bot-ui.component.html',
  styleUrl: './bot-ui.component.css'
})
export class BotUiComponent {
  query: string = '';
  http = inject(HttpClient);
  public loadingService = inject(LoadingService);

  response$?: Observable<any>;
  isStreaming: boolean = false;
  currentStreamingResponse: string = '';

  messages: ChatMessage[] = [
    {
      role: 'assistant',
      content: `👋 **Bonjour ! Je suis votre Assistant Bancaire Intelligent.**
      
Je suis propulsé par **Spring AI (Gemini 3.5 Flash-Lite)** et connecté en temps réel aux microservices via le protocole **Model Context Protocol (MCP)**.
      
Vous pouvez me poser des questions comme :
- 📋 *"Donne moi la liste des comptes bancaires"*
- 👤 *"Quelles sont les informations du client 1 ?"*
- 💳 *"Quel est le solde du compte et son type ?"*`,
      time: new Date()
    }
  ];

  suggestedQueries = [
    'Donne moi la liste des comptes bancaires',
    'Quelles sont les informations du client 1 ?',
    'Quel est le solde du compte ?',
    'Quelle est la politique de résilience ?'
  ];

  selectSuggestion(prompt: string) {
    this.query = prompt;
    this.askAgentStream();
  }

  askAgentStream() {
    const userPrompt = this.query.trim();
    if (!userPrompt || this.isStreaming) return;

    // Add user message to history
    this.messages.push({
      role: 'user',
      content: userPrompt,
      time: new Date()
    });

    this.query = '';
    this.isStreaming = true;
    this.currentStreamingResponse = '';

    const gw = getGatewayUrl();
    this.http
      .get(
        `${gw}/EBANK-BOT/chatStream?query=` + encodeURIComponent(userPrompt),
        {
          responseType: 'text',
          observe: 'events',
          reportProgress: true
        }
      )
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.DownloadProgress) {
            const text = (event as HttpDownloadProgressEvent).partialText ?? '';
            this.currentStreamingResponse = text;
          } else if (event.type === HttpEventType.Response) {
            const fullText = (event as any).body ?? this.currentStreamingResponse;
            this.currentStreamingResponse = fullText;
            this.isStreaming = false;

            this.messages.push({
              role: 'assistant',
              content: fullText,
              time: new Date()
            });
            this.currentStreamingResponse = '';
          }
        },
        error: (err) => {
          console.error('Chat stream error:', err);
          this.isStreaming = false;
          this.messages.push({
            role: 'assistant',
            content: `⚠️ Impossible de recevoir la réponse de l'agent IA.\n\n*Détail de l'erreur :* ${err.status === 404 ? 'Service EBANK-BOT introuvable via Gateway (port 8058).' : (err.message || 'Le service est actuellement en cours de démarrage ou la clé Gemini est manquante.')}`,
            time: new Date()
          });
          this.currentStreamingResponse = '';
        }
      });
  }
}
