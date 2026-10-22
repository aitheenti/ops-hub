import { Routes } from '@angular/router';

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
    loadComponent: () =>
      import('../components/ticket-details/ticket-details').then((m) => m.TicketDetails),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
