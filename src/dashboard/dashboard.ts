import { Component, inject } from '@angular/core';
import { Ticket } from '../components/ticket/ticket';
import { TicketService } from '../app/services/ticket-service';
import { RouterLink } from '@angular/router';
import { TicketList } from '../features/ticket-list/ticket-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, TicketList],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  title: string = 'OpsHub Dashboard';
  protected ticketService = inject(TicketService);
}
