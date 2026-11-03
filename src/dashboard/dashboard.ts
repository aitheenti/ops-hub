import { Component, inject } from '@angular/core';
import { TicketService } from '../app/services/ticket-service';
import { TicketList } from '../features/ticket-list/ticket-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ TicketList],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  title: string = 'OpsHub Dashboard';
  protected ticketService = inject(TicketService);
}
