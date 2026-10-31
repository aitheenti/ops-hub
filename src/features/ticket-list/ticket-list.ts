import { Component, inject } from '@angular/core';
import { TicketService } from '../../app/services/ticket-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ticket-list.html',
})
export class TicketList {
  protected ticketService = inject(TicketService);
}
