import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService } from '../../app/services/ticket-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TicketContent } from '../../app/models/TicketContent.interface';

@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ticket-details.html',
})
export class TicketDetails {
  private readonly route = inject(ActivatedRoute);

  readonly ticket = toSignal(this.route.data.pipe(map(data => data['ticket'] as TicketContent | undefined)),
    { initialValue: undefined})
}
