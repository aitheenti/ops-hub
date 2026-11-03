import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { ticketResolver } from './resolvers/ticket-resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'tickets',
    loadComponent: () => import('../features/ticket-list/ticket-list').then((m) => m.TicketList),
  },
  {
    path: 'tickets/:id',
    resolve: {
      ticket: ticketResolver
    },
    loadComponent: () =>
      import('../components/ticket-details/ticket-details').then((m) => m.TicketDetails),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../components/login/login')
        .then(m => m.Login),
  },
  {
    path: 'admin',
    loadComponent: () => 
      import('../components/admin/admin').then(m => m.Admin),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '',
  },
];
