import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ticket } from './ticket';
import { TicketContent } from '../../app/models/TicketContent.interface';

const openTicket: TicketContent = {
  id: '1',
  title: 'Setup pipelines',
  description: 'This is high priority ticket',
  status: 'open',
};

describe('Ticket', () => {
  let component: Ticket;
  let fixture: ComponentFixture<Ticket>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ticket],
    }).compileComponents();

    fixture = TestBed.createComponent(Ticket);
    component = fixture.componentInstance;
    el = fixture.nativeElement;

    // `content` is a required input, so give it a value before the first render.
    fixture.componentRef.setInput('content', openTicket);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the title, description and status', () => {
    const text = el.textContent ?? '';

    expect(text).toContain('Setup pipelines');
    expect(text).toContain('This is high priority ticket');
    expect(text).toContain('open');
  });

  it('uses the amber background for an open ticket', () => {
    const card = el.querySelector('div')!;

    expect(card.classList).toContain('bg-amber-100');
    expect(card.classList).not.toContain('bg-green-100');
  });

  it('switches to the green background when the ticket is resolved', async () => {
    fixture.componentRef.setInput('content', { ...openTicket, status: 'resolved' });
    await fixture.whenStable();

    const card = el.querySelector('div')!;
    expect(card.classList).toContain('bg-green-100');
    expect(card.classList).not.toContain('bg-amber-100');
  });
});
