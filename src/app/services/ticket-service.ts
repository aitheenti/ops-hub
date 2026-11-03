import { computed, inject, Injectable, signal } from '@angular/core';
import { TicketContent } from '../models/TicketContent.interface';
import { TicketMock } from '../mocks/Ticket.mock';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly ticketState = signal<TicketContent[]>(TicketMock);
  readonly tickets = this.ticketState.asReadonly();

  getTicketById(id:string): Observable<TicketContent> {
    return this.http.get<TicketContent>(`/api/tickets/${id}`);
  }
  openTicketsList = computed(() => this.tickets().filter((ticket) => ticket.status === 'open'));
  openTickets = computed(() => this.openTicketsList().length);
  hasOpenTickets = computed(() => this.openTickets() > 0);

  workloadStatus = computed(() => {
    const openTickets = this.openTickets();
    if (openTickets === 0) return 'Empty';
    if (openTickets > 7) return 'Busy';
    return 'Normal';
  });

  resolvedTickets = computed(
    () => this.tickets().filter((ticket) => ticket.status === 'resolved').length,
  );

  public resolveTicket(): void {
    const firstOpenTicket = this.tickets().find((ticket) => ticket.status === 'open');
    if (!firstOpenTicket) return;

    this.ticketState.update((tickets) =>
      tickets.map((ticket) =>
        ticket.id === firstOpenTicket.id ? { ...ticket, status: 'resolved' } : ticket,
      ),
    );
  }

  addTicket(): void {
    this.ticketState.update((tickets) => [
      ...tickets,
      {
        id: crypto.randomUUID(),
        title: 'Reimage Laptop',
        description: 'This is low priority ticket',
        status: 'open',
      },
    ]);
  }
}
