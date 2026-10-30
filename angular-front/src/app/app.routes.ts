import { Routes } from '@angular/router';
import { AccountsComponent } from './accounts/accounts.component';
import { BotUiComponent } from './bot-ui/bot-ui.component';
import { ClientsComponent } from './clients/clients.component';

export const routes: Routes = [
  { path: '', redirectTo: 'accounts', pathMatch: 'full' },
  { path: 'accounts', component: AccountsComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'bot', component: BotUiComponent },
  { path: '**', redirectTo: 'accounts' }
];
