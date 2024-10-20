import { ProviderService } from '../../infrastructure/external/providerService';
import { getAsync, setAsync } from '../../infrastructure/redis/redisClient';
import { Event } from '../../domain/models/Event';

export class EventService {
  private providerService: ProviderService;
  private CACHE_KEY = 'events';

  constructor() {
    this.providerService = new ProviderService();
  }

  async updateEvents(): Promise<void> {
    const baseEvents = await this.providerService.fetchEvents();
    const onlineEvents = baseEvents
      .filter((be) => be.sellMode === 'online')
      .flatMap((be) => be.events);
    await setAsync(this.CACHE_KEY, JSON.stringify(onlineEvents), 60 * 60);
  }

  async getEvents(startAt?: Date, endAt?: Date): Promise<Event[]> {
    // First try to get data from redis (cache)
    let cachedData = await getAsync(this.CACHE_KEY);

    if (!cachedData) {
      // If no data in cache, try to update
      await this.updateEvents();
      cachedData = await getAsync(this.CACHE_KEY);
      if (!cachedData) {
        throw new Error('No events available');
      }
    }

    if (!startAt || !endAt) {
      return JSON.parse(cachedData);
    } 

    const filteredEvents = this.filterEvents(JSON.parse(cachedData), startAt, endAt);

    return filteredEvents;
  }

  private filterEvents(events: Event[], startAt: Date, endAt: Date): Event[] {
    return events.filter((event) => {
      return (
        (new Date(`${event.start_date}T${event.start_time}`) >= startAt && new Date(`${event.start_date}T${event.start_time}`) <= endAt) ||
        (new Date(`${event.end_date}T${event.end_time}`) >= startAt && new Date(`${event.end_date}T${event.end_time}`) <= endAt) ||
        (new Date(`${event.start_date}T${event.start_time}`) <= startAt && new Date(`${event.end_date}T${event.end_time}`) >= endAt)
      );
    });
  }
}
