import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, map, Observable, of, BehaviorSubject, switchMap } from 'rxjs';
import { Client, ClientListState, RequestStatus } from '../model/client.model';
import { LoadingService } from '../services/loading.service';
import { getGatewayUrl } from '../config/api.config';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    FormsModule
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {
  private http = inject(HttpClient);
  public loadService = inject(LoadingService);

  private refreshTrigger$ = new BehaviorSubject<void>(undefined);
  rawClientsState$!: Observable<ClientListState>;

  searchTerm = '';

  // Modal State
  isAddModalOpen = false;
  newClientName = '';
  newClientEmail = '';
  isSubmitting = false;
  modalErrorMessage = '';

  ngOnInit() {
    this.rawClientsState$ = this.refreshTrigger$.pipe(
      switchMap(() => {
        const gw = getGatewayUrl();
        return this.http.get<Client[]>(`${gw}/CUSTOMER-SERVICE/customers`).pipe(
          map(resp => ({
            clients: resp,
            status: RequestStatus.SUCCESS
          })),
          catchError(err =>
            this.http.get<Client[]>(`${gw}/customers`).pipe(
              map(resp => ({
                clients: resp,
                status: RequestStatus.SUCCESS
              })),
              catchError(err2 =>
                of({
                  status: RequestStatus.ERROR,
                  errorMessage: err2.message || err.message || 'Erreur lors de la récupération des clients.'
                })
              )
            )
          )
        );
      })
    );
  }

  refresh() {
    this.refreshTrigger$.next();
  }

  filterClients(clients?: Client[]): Client[] {
    if (!clients) return [];
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return clients;
    return clients.filter(c =>
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      String(c.id).includes(term)
    );
  }

  getInitials(name?: string): string {
    if (!name) return 'CL';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  openAddModal() {
    this.isAddModalOpen = true;
    this.modalErrorMessage = '';
  }

  closeAddModal() {
    this.isAddModalOpen = false;
    this.modalErrorMessage = '';
  }

  createClient() {
    if (!this.newClientName.trim() || !this.newClientEmail.trim()) {
      this.modalErrorMessage = 'Veuillez remplir le nom et l’email.';
      return;
    }

    this.isSubmitting = true;
    this.modalErrorMessage = '';

    const payload = {
      name: this.newClientName,
      email: this.newClientEmail
    };

    const gw = getGatewayUrl();
    this.http.post(`${gw}/CUSTOMER-SERVICE/customers`, payload).pipe(
      catchError(err =>
        this.http.post(`${gw}/customers`, payload).pipe(
          catchError(err2 => {
            this.modalErrorMessage = err2.message || err.message || 'Erreur lors de la création.';
            return of(null);
          })
        )
      )
    ).subscribe(result => {
      this.isSubmitting = false;
      if (result) {
        this.newClientName = '';
        this.newClientEmail = '';
        this.closeAddModal();
        this.refresh();
      }
    });
  }

  protected readonly RequestStatus = RequestStatus;
}
