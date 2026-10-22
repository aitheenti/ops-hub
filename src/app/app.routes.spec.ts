import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from './app.routes';
import { Dashboard } from '../dashboard/dashboard';
import { TicketList } from '../features/ticket-list/ticket-list';
import { TicketDetails } from '../components/ticket-details/ticket-details';

// Checks the route table itself: which URL loads which page.
describe('app routes', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    harness = await RouterTestingHarness.create();
  });

  it('loads the Dashboard at /', async () => {
    const page = await harness.navigateByUrl('/', Dashboard);
    expect(page).toBeInstanceOf(Dashboard);
  });

  it('loads the TicketList at /tickets', async () => {
    const page = await harness.navigateByUrl('/tickets', TicketList);
    expect(page).toBeInstanceOf(TicketList);
  });

  it('loads TicketDetails at /tickets/:id with that id', async () => {
    const page = await harness.navigateByUrl('/tickets/42', TicketDetails);

    expect(page).toBeInstanceOf(TicketDetails);
    expect(page.activatedRoute.snapshot.paramMap.get('id')).toBe('42');
  });

  it('redirects unknown URLs to the Dashboard', async () => {
    const page = await harness.navigateByUrl('/does/not/exist', Dashboard);

    expect(page).toBeInstanceOf(Dashboard);
    expect(TestBed.inject(Router).url).toBe('/');
  });
});
