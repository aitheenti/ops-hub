import { Component, computed, signal } from '@angular/core';
import { Ticket } from '../components/ticket/ticket';
import { TicketContent } from '../app/models/TicketContent.interface';
import { TicketMock } from '../app/mocks/Ticket.mock';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Ticket],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  title: string = 'OpsHub Dashboard';
  tickets = signal<TicketContent[]>(TicketMock);
  openTicketsList = computed(() => this.tickets().filter((ticket) => ticket.status === 'open'));
  openTickets = computed(() => this.openTicketsList().length);

  resolvedTickets = computed(
    () => this.tickets().filter((ticket) => ticket.status === 'resolved').length,
  );

  hasOpenTickets = computed(() => this.openTickets() > 0);
  workloadStatus = computed(() => {
    const openTickets = this.openTickets();
    if (openTickets === 0) return 'Empty';
    if (openTickets > 7) return 'Busy';
    return 'Normal';
  });

  resolveTicket() {
    const firstOpenTicket = this.tickets().find((ticket) => ticket.status === 'open');
    if (!firstOpenTicket) return;

    this.tickets.update((tickets) =>
      tickets.map((ticket) =>
        ticket.id === firstOpenTicket.id ? { ...ticket, status: 'resolved' } : ticket,
      ),
    );
    console.log('after resovle rtickets', this.tickets());
  }

  addTicket() {
    this.tickets.update((tickets) => [
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
