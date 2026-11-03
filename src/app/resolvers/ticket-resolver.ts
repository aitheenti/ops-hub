import { ResolveFn } from '@angular/router';
import { TicketContent } from '../models/TicketContent.interface';
import { inject } from '@angular/core';
import { TicketService } from '../services/ticket-service';
import { catchError, of } from 'rxjs';

export const ticketResolver: ResolveFn<TicketContent | undefined> = (route) => {
  const ticketService = inject(TicketService);
  const ticketId = route.paramMap.get('id');

  if(!ticketId) return undefined;

  return ticketService.getTicketById(ticketId).pipe(catchError(() => of(undefined)));
};
