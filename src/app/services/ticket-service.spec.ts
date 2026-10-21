import { TestBed } from '@angular/core/testing';

import { TicketService } from './ticket-service';
import { TicketMock } from '../mocks/Ticket.mock';

describe('TicketService', () => {
  let service: TicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketService);
  });

  // The tickets signal is private, so tests reach each state through the
  // public methods, just like real code has to. The service starts with the
  // 3 open tickets from TicketMock.
  function resolve(times: number) {
    for (let i = 0; i < times; i++) service.resolveTicket();
  }

  function add(times: number) {
    for (let i = 0; i < times; i++) service.addTicket();
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('exposes tickets as read-only', () => {
    expect('set' in service.tickets).toBe(false);
    expect('update' in service.tickets).toBe(false);
  });

  describe('counts', () => {
    it('starts with all mock tickets open and none resolved', () => {
      expect(service.tickets().length).toBe(TicketMock.length);
      expect(service.openTickets()).toBe(3);
      expect(service.resolvedTickets()).toBe(0);
      expect(service.hasOpenTickets()).toBe(true);
    });

    it('updates the counts as tickets change', () => {
      add(2);
      resolve(1);

      expect(service.openTickets()).toBe(4);
      expect(service.resolvedTickets()).toBe(1);
    });

    it('has no open tickets once all are resolved', () => {
      resolve(3);

      expect(service.openTickets()).toBe(0);
      expect(service.hasOpenTickets()).toBe(false);
      expect(service.openTicketsList()).toEqual([]);
    });
  });

  describe('workloadStatus', () => {
    it('is "Empty" when there are no open tickets', () => {
      resolve(3);
      expect(service.workloadStatus()).toBe('Empty');
    });

    it('is "Normal" with 1 to 7 open tickets', () => {
      resolve(2); // 1 open
      expect(service.workloadStatus()).toBe('Normal');

      add(6); // 7 open
      expect(service.workloadStatus()).toBe('Normal');
    });

    it('is "Busy" with more than 7 open tickets', () => {
      add(5); // 8 open
      expect(service.workloadStatus()).toBe('Busy');
    });
  });

  describe('resolveTicket()', () => {
    it('resolves the first open ticket only', () => {
      resolve(1);

      const [first, second, third] = service.tickets();
      expect(first.status).toBe('resolved');
      expect(second.status).toBe('open');
      expect(third.status).toBe('open');
    });

    it('moves on to the next open ticket when called again', () => {
      resolve(2);

      expect(service.tickets()[1].status).toBe('resolved');
      expect(service.tickets()[2].status).toBe('open');
    });

    it('does nothing when there are no open tickets', () => {
      resolve(3);
      const before = service.tickets();

      service.resolveTicket();

      expect(service.tickets()).toBe(before);
    });

    it('does not modify the original mock data', () => {
      resolve(3);

      expect(TicketMock.every((ticket) => ticket.status === 'open')).toBe(true);
    });
  });

  describe('addTicket()', () => {
    it('appends a new open ticket', () => {
      service.addTicket();

      const tickets = service.tickets();
      expect(tickets.length).toBe(4);
      expect(tickets.at(-1)?.status).toBe('open');
    });

    it('gives every new ticket a unique id', () => {
      add(3);

      const ids = service.tickets().map((ticket) => ticket.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });
});
