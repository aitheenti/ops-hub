export type TicketStatus = 'resolved' | 'open';
export interface TicketContent {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
}

export interface Tickets {
  tickets: TicketContent[];
}
