import { Component, input } from '@angular/core';
import { TicketContent } from '../../app/models/TicketContent.interface';

@Component({
  selector: 'app-ticket',
  imports: [],
  templateUrl: './ticket.html',
})
export class Ticket {
  content = input.required<TicketContent>();
}
