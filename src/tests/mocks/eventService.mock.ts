import { BaseEvent } from "../../domain/models/Event";

  const mockEvents: BaseEvent[] = [
    {
      sellMode: 'online',
      events: [
        {
          id: '1',
          start_date: '2024-07-31',
          start_time: '20:00:00',
          end_date: '2024-07-31',
          end_time: '21:00:00',
          title: 'Atitle',
          min_price: 10,
          max_price: 20
        },
      ],
      baseEventId: 0,
      title: 'Atitle'
    },
    {
      sellMode: 'offline',
      events: [
        {
          id: '2',
          start_date: '2024-08-01',
          start_time: '20:00:00',
          end_date: '2024-08-01',
          end_time: '21:00:00',
          title: 'Atitle2',
          min_price: 10,
          max_price: 20
        },
      ],
      baseEventId: 0,
      title: 'Atitle2'
    },
  ];

  export { mockEvents };