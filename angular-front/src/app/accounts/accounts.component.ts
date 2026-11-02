import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, map, Observable, of, BehaviorSubject, switchMap } from 'rxjs';
import { Account, AccountListState, RequestStatus } from '../model/account.model';
import { LoadingService } from '../services/loading.service';
import { getGatewayUrl } from '../config/api.config';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    FormsModule
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit {
  private http = inject(HttpClient);
  public loadService = inject(LoadingService);

  // Trigger for refreshing
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);

  // Raw state observable
  rawAccountsState$!: Observable<AccountListState>;

  // Filters
  searchTerm = '';
  selectedType = 'ALL';

  // Modal State
  isAddModalOpen = false;
  newAccountBalance = 5000;
  newAccountType = 'CURRENT-ACCOUNT';
  newCustomerId = 1;
  isSubmitting = false;
  modalErrorMessage = '';
  copiedId: string | null = null;

  ngOnInit() {
    this.rawAccountsState$ = this.refreshTrigger$.pipe(
      switchMap(() => {
        const gw = getGatewayUrl();
        return this.http.get<Account[]>(`${gw}/EBANK-SERVICE/accounts`).pipe(
          map(resp => ({
            accounts: resp,
            status: RequestStatus.SUCCESS
          })),
          catchError(err =>
            this.http.get<Account[]>(`${gw}/accounts`).pipe(
              map(resp => ({
                accounts: resp,
                status: RequestStatus.SUCCESS
              })),
              catchError(err2 =>
                of({
                  status: RequestStatus.ERROR,
                  errorMessage: err2.message || err.message || 'Erreur lors de la récupération des comptes bancaires.'
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

  // Filter accounts in-memory for fast and smooth UI experience
  filterAccounts(accounts?: Account[]): Account[] {
    if (!accounts) return [];
    return accounts.filter(acc => {
      const matchesType = this.selectedType === 'ALL' || acc.type === this.selectedType;
      const term = this.searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        acc.id.toLowerCase().includes(term) ||
        String(acc.customerId).includes(term) ||
        (acc.type && acc.type.toLowerCase().includes(term));
      return matchesType && matchesSearch;
    });
  }

  // Summary Metrics calculations
  getTotalBalance(accounts?: Account[]): number {
    if (!accounts) return 0;
    return accounts.reduce((acc, curr) => acc + (curr.balance || 0), 0);
  }

  getCountByType(accounts: Account[] | undefined, type: string): number {
    if (!accounts) return 0;
    return accounts.filter(a => a.type === type).length;
  }

  // Copy UUID
  copyToClipboard(id: string) {
    navigator.clipboard.writeText(id).then(() => {
      this.copiedId = id;
      setTimeout(() => {
        this.copiedId = null;
      }, 2000);
    });
  }

  // Modal Methods
  openAddModal() {
    this.isAddModalOpen = true;
    this.modalErrorMessage = '';
  }

  closeAddModal() {
    this.isAddModalOpen = false;
    this.modalErrorMessage = '';
  }

  createAccount() {
    this.isSubmitting = true;
    this.modalErrorMessage = '';

    const payload = {
      balance: this.newAccountBalance,
      type: this.newAccountType,
      customerId: this.newCustomerId
    };

    const gw = getGatewayUrl();
    this.http.post(`${gw}/EBANK-SERVICE/accounts`, payload).pipe(
      catchError(err =>
        this.http.post(`${gw}/accounts`, payload).pipe(
          catchError(err2 => {
            this.modalErrorMessage = err2.message || err.message || 'Erreur lors de la création.';
            return of(null);
          })
        )
      )
    ).subscribe(result => {
      this.isSubmitting = false;
      if (result) {
        this.closeAddModal();
        this.refresh();
      }
    });
  }

  protected readonly RequestStatus = RequestStatus;
}
