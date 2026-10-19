import { TicketContent } from '../models/TicketContent.interface';

export const TicketMock: TicketContent[] = [
  {
    id: '1',
    title: 'Setup pipelines',
    description: 'This is high priority ticket',
    status: 'open',
  },
  {
    id: '2',
    title: 'Resolve user permissions',
    description: 'This is medium priority ticket',
    status: 'open',
  },
  {
    id: '3',
    title: 'Reimage Laptop',
    description: 'This is low priority ticket',
    status: 'open',
  },
];
