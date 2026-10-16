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
  openTickets = signal(3);
  resolvedTickets = signal(0);
  workload = signal('Normal');
  tickets = signal<TicketContent[]>(TicketMock);

  hasOpenTickets = computed(() => this.openTickets() > 0);
  workloadStatus = computed(() => (this.openTickets() > 7 ? 'Busy' : 'Normal'));

  resolveTicket() {
    if (this.openTickets() > 0) {
      this.openTickets.update((count) => Math.max(0, count - 1));
      this.resolvedTickets.update((count) => count + 1);
    }
  }

  addTicket() {
    this.openTickets.update((count) => Math.max(0, count + 1));
  }
}
