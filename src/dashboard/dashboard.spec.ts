import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboard } from './dashboard';
import { TicketContent } from '../app/models/TicketContent.interface';

// Small helper so each test can build exactly the tickets it needs.
function makeTickets(open: number, resolved: number): TicketContent[] {
  const tickets: TicketContent[] = [];
  for (let i = 0; i < open; i++) {
    tickets.push({ id: `open-${i}`, title: `Open ${i}`, description: 'desc', status: 'open' });
  }
  for (let i = 0; i < resolved; i++) {
    tickets.push({
      id: `resolved-${i}`,
      title: `Resolved ${i}`,
      description: 'desc',
      status: 'resolved',
    });
  }
  return tickets;
}

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  // Re-render the template after changing state, then return the page text.
  async function render() {
    await fixture.whenStable();
    return el.textContent ?? '';
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('counts', () => {
    it('starts with all mock tickets open and none resolved', () => {
      expect(component.openTickets()).toBe(3);
      expect(component.resolvedTickets()).toBe(0);
      expect(component.hasOpenTickets()).toBe(true);
    });

    it('derives the counts from the tickets list', () => {
      component.tickets.set(makeTickets(2, 5));

      expect(component.openTickets()).toBe(2);
      expect(component.resolvedTickets()).toBe(5);
    });
  });

  describe('workloadStatus', () => {
    it('is "Empty" when there are no open tickets', () => {
      component.tickets.set(makeTickets(0, 3));
      expect(component.workloadStatus()).toBe('Empty');
    });

    it('is "Normal" with 1 to 7 open tickets', () => {
      component.tickets.set(makeTickets(1, 0));
      expect(component.workloadStatus()).toBe('Normal');

      component.tickets.set(makeTickets(7, 0));
      expect(component.workloadStatus()).toBe('Normal');
    });

    it('is "Busy" with more than 8 open tickets', () => {
      component.tickets.set(makeTickets(7, 0));
      expect(component.workloadStatus()).toBe('Normal');
    });
  });

  describe('resolveTicket()', () => {
    it('resolves the first open ticket only', () => {
      component.tickets.set(makeTickets(2, 0));

      component.resolveTicket();

      expect(component.tickets()[0].status).toBe('resolved');
      expect(component.tickets()[1].status).toBe('open');
      expect(component.openTickets()).toBe(1);
      expect(component.resolvedTickets()).toBe(1);
    });

    it('does nothing when there are no open tickets', () => {
      const tickets = makeTickets(0, 2);
      component.tickets.set(tickets);

      component.resolveTicket();

      expect(component.tickets()).toBe(tickets);
    });
  });

  describe('addTicket()', () => {
    it('adds a new open ticket with a unique id', () => {
      const before = component.tickets().length;

      component.addTicket();
      component.addTicket();

      const tickets = component.tickets();
      expect(tickets.length).toBe(before + 2);
      expect(tickets.at(-1)?.status).toBe('open');
      expect(tickets.at(-1)?.id).not.toBe(tickets.at(-2)?.id);
    });
  });

  describe('template', () => {
    it('shows the title and counts', async () => {
      const text = await render();

      expect(text).toContain('OpsHub Dashboard');
      expect(text).toContain('Open Tickets: 3');
      expect(text).toContain('Resolved Tickets: 0');
    });

    it('renders one <app-ticket> per ticket', async () => {
      await render();
      expect(el.querySelectorAll('app-ticket').length).toBe(3);
    });

    it('updates the page when the Resolve button is clicked', async () => {
      const resolveButton = el.querySelectorAll('button')[0];

      resolveButton.click();
      const text = await render();

      expect(text).toContain('Open Tickets: 2');
      expect(text).toContain('Resolved Tickets: 1');
    });

    it('adds a ticket to the page when the Add button is clicked', async () => {
      const addButton = el.querySelectorAll('button')[1];

      addButton.click();
      await render();

      expect(el.querySelectorAll('app-ticket').length).toBe(4);
    });

    it('shows "All Clear!" and "Empty" once every ticket is resolved', async () => {
      component.tickets.set(makeTickets(0, 3));
      const text = await render();

      expect(text).toContain('All Clear!');
      expect(text).toContain('Empty');
    });

    it('shows the empty message when there are no tickets at all', async () => {
      component.tickets.set([]);
      const text = await render();

      expect(text).toContain('No open tickets');
    });
  });
});
