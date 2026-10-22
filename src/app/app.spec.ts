import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      // The real routes, so clicking the nav links loads the real pages.
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  async function createApp() {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  function navLink(el: HTMLElement, text: string) {
    const links = Array.from(el.querySelectorAll<HTMLAnchorElement>('nav a'));
    return links.find((a) => a.textContent?.trim() === text)!;
  }

  it('should create the app', async () => {
    const { fixture } = await createApp();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the router outlet', async () => {
    const { el } = await createApp();
    expect(el.querySelector('router-outlet')).toBeTruthy();
  });

  it('has Dashboard and Tickets links in the nav', async () => {
    const { el } = await createApp();

    expect(navLink(el, 'Dashboard').getAttribute('href')).toBe('/');
    expect(navLink(el, 'Tickets').getAttribute('href')).toBe('/tickets');
  });

  it('shows the ticket list when the Tickets link is clicked', async () => {
    const { fixture, el } = await createApp();

    navLink(el, 'Tickets').click();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/tickets');
    expect(el.querySelector('app-ticket-list')).toBeTruthy();
    expect(el.querySelector('app-dashboard')).toBeNull();
  });

  it('shows the dashboard again when the Dashboard link is clicked', async () => {
    const { fixture, el } = await createApp();

    navLink(el, 'Tickets').click();
    await fixture.whenStable();
    navLink(el, 'Dashboard').click();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/');
    expect(el.querySelector('app-dashboard')).toBeTruthy();
    expect(el.querySelector('app-ticket-list')).toBeNull();
  });

  it('keeps the nav visible on every page', async () => {
    const { fixture, el } = await createApp();

    navLink(el, 'Tickets').click();
    await fixture.whenStable();

    expect(el.querySelector('nav')).toBeTruthy();
  });
});
