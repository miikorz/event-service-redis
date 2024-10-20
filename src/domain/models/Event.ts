export interface Event {
  id: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  min_price: number;
  max_price: number;
  title: string;
}

export interface BaseEvent {
  baseEventId: number;
  sellMode: string;
  organizerCompanyId?: number;
  title: string;
  events: Event[];
}
