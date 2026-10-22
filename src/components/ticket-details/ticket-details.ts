import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ticket-details',
  imports: [],
  templateUrl: './ticket-details.html',
})
export class TicketDetails {
  activatedRoute = inject(ActivatedRoute);
}
