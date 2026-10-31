import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService } from '../../app/services/ticket-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ticket-details.html',
})
export class TicketDetails {
  private readonly route = inject(ActivatedRoute);
  private ticketService = inject(TicketService);

  readonly ticketId = toSignal(this.route.paramMap.pipe(map((params) => params.get('id'))));
  readonly ticket = computed(() => this.ticketService.tickets().find((ticket) => ticket.id === this.ticketId()));
}
