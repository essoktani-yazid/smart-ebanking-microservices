import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpDownloadProgressEvent, HttpEventType } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { MarkdownComponent } from 'ngx-markdown';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    MarkdownComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Smart E-Banking';
  public loadingService = inject(LoadingService);
  private http = inject(HttpClient);

  // Assistant Drawer State
  isDrawerOpen = false;
  drawerQuery = '';
  drawerResponse$?: Observable<any>;
  isDrawerStreaming = false;

  quickPrompts = [
    'Donne moi la liste des comptes bancaires',
    'Quelles sont les informations du client 1 ?',
    'Quel est le solde du compte ?'
  ];

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  setQuickPrompt(promptText: string) {
    this.drawerQuery = promptText;
    this.sendDrawerMessage();
  }

  sendDrawerMessage() {
    if (!this.drawerQuery.trim()) return;
    this.isDrawerStreaming = true;

    this.drawerResponse$ = this.http
      .get(
        'http://localhost:9999/EBANK-BOT/chatStream?query=' + encodeURIComponent(this.drawerQuery),
        {
          responseType: 'text',
          observe: 'events',
          reportProgress: true
        }
      )
      .pipe(
        map(event => {
          switch (event.type) {
            case HttpEventType.Sent:
              return { type: 'sent', content: '' };
            case HttpEventType.DownloadProgress:
              return {
                type: 'Response',
                content: (event as HttpDownloadProgressEvent).partialText ?? ''
              };
            case HttpEventType.Response:
              this.isDrawerStreaming = false;
              return {
                type: 'Response',
                content: event.body ?? ''
              };
            default:
              return { type: 'other', content: '' };
          }
        })
      );
  }
}
