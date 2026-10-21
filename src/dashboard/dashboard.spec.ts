import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboard } from './dashboard';
import { TicketService } from '../app/services/ticket-service';
import { TicketContent } from '../app/models/TicketContent.interface';

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

// A stand-in for TicketService. Its values are plain writable signals, so each
// test can put the dashboard into any state, and its methods are spies, so
// tests can check that the buttons call them.
function createFakeTicketService() {
  return {
    tickets: signal<TicketContent[]>(makeTickets(3, 0)),
    openTickets: signal(3),
    resolvedTickets: signal(0),
    hasOpenTickets: signal(true),
    workloadStatus: signal('Normal'),
    resolveTicket: vi.fn(),
    addTicket: vi.fn(),
  };
}

describe('Dashboard', () => {
  let fixture: ComponentFixture<Dashboard>;
  let el: HTMLElement;
  let fakeService: ReturnType<typeof createFakeTicketService>;

  beforeEach(async () => {
    fakeService = createFakeTicketService();

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      // When Dashboard calls inject(TicketService), give it the fake instead.
      providers: [{ provide: TicketService, useValue: fakeService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  // Re-render the template after changing state, then return the page text.
  async function render() {
    await fixture.whenStable();
    return el.textContent ?? '';
  }

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the title and the counts from the service', async () => {
    fakeService.openTickets.set(4);
    fakeService.resolvedTickets.set(2);
    const text = await render();

    expect(text).toContain('OpsHub Dashboard');
    expect(text).toContain('Open Tickets: 4');
    expect(text).toContain('Resolved Tickets: 2');
  });

  it('shows the workload status from the service', async () => {
    fakeService.workloadStatus.set('Busy');
    const text = await render();

    expect(text).toContain("Today's Workload : Busy");
  });

  it('asks for attention while there are open tickets', async () => {
    const text = await render();

    expect(text).toContain('You have tickets that need attention.');
    expect(text).not.toContain('All Clear!');
  });

  it('shows "All Clear!" when there are no open tickets', async () => {
    fakeService.hasOpenTickets.set(false);
    const text = await render();

    expect(text).toContain('All Clear!');
    expect(text).not.toContain('need attention');
  });

  it('renders one <app-ticket> per ticket', async () => {
    fakeService.tickets.set(makeTickets(2, 3));
    await render();

    expect(el.querySelectorAll('app-ticket').length).toBe(5);
  });

  it('shows the empty message when there are no tickets', async () => {
    fakeService.tickets.set([]);
    const text = await render();

    expect(text).toContain('No open tickets');
    expect(el.querySelectorAll('app-ticket').length).toBe(0);
  });

  it('calls resolveTicket() when the Resolve button is clicked', () => {
    el.querySelectorAll('button')[0].click();

    expect(fakeService.resolveTicket).toHaveBeenCalledTimes(1);
    expect(fakeService.addTicket).not.toHaveBeenCalled();
  });

  it('calls addTicket() when the Add button is clicked', () => {
    el.querySelectorAll('button')[1].click();

    expect(fakeService.addTicket).toHaveBeenCalledTimes(1);
    expect(fakeService.resolveTicket).not.toHaveBeenCalled();
  });
});

// One end-to-end check with the real service, to make sure the pieces work together.
describe('Dashboard with the real TicketService', () => {
  it('updates the page when tickets are resolved and added', async () => {
    await TestBed.configureTestingModule({ imports: [Dashboard] }).compileComponents();
    const fixture = TestBed.createComponent(Dashboard);
    const el: HTMLElement = fixture.nativeElement;
    await fixture.whenStable();

    const [resolveButton, addButton] = Array.from(el.querySelectorAll('button'));

    resolveButton.click();
    addButton.click();
    await fixture.whenStable();

    expect(el.textContent).toContain('Open Tickets: 3');
    expect(el.textContent).toContain('Resolved Tickets: 1');
    expect(el.querySelectorAll('app-ticket').length).toBe(4);
  });
});
