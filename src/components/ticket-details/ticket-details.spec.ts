import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { TicketDetails } from './ticket-details';

describe('TicketDetails', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    // A tiny router with just the route under test, so we can navigate to a
    // real URL and let Angular fill in ActivatedRoute for us.
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'tickets/:id', component: TicketDetails }])],
    });

    harness = await RouterTestingHarness.create();
  });

  it('should create', async () => {
    const component = await harness.navigateByUrl('/tickets/1', TicketDetails);

    expect(component).toBeTruthy();
  });

  it('receives the id from the URL through ActivatedRoute', async () => {
    const component = await harness.navigateByUrl('/tickets/abc-123', TicketDetails);

    expect(component.activatedRoute.snapshot.paramMap.get('id')).toBe('abc-123');
  });
});
