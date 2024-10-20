import { EventService } from '../application/services/eventService';
import { ProviderService } from '../infrastructure/external/providerService';
import { getAsync, setAsync } from '../infrastructure/redis/redisClient';
import { mockEvents } from './mocks/eventService.mock';

jest.mock('../infrastructure/redis/redisClient', () => ({
  getAsync: jest.fn(),
  setAsync: jest.fn()
}));
jest.mock('../infrastructure/external/providerService');

describe('EventService', () => {
  let eventService: EventService;

  const filteredMockEvents = mockEvents.filter(baseEvent => baseEvent.sellMode === 'online').flatMap((baseEvent) => baseEvent.events);
  const cacheKey = 'events';

  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
    eventService = new EventService();
  });

  it('should update and cache online events from the provider', async () => {
    // Mock ProviderService to return base events
    (ProviderService.prototype.fetchEvents as jest.Mock).mockResolvedValue(mockEvents);

    // Mock setAsync to act like it caches data
    (setAsync as jest.Mock).mockResolvedValue('OK');

    await eventService.updateEvents();

    expect(ProviderService.prototype.fetchEvents).toHaveBeenCalled(); // Ensure the provider was called
    expect(setAsync).toHaveBeenCalledWith(
      cacheKey,
      JSON.stringify(filteredMockEvents), // Only online events should be cached
      60 * 60
    );
  });

  it('should return cached events if available in Redis', async () => {
    // Mock Redis to return cached data
    (getAsync as jest.Mock).mockResolvedValue(JSON.stringify(filteredMockEvents));

    const events = await eventService.getEvents();

    expect(getAsync).toHaveBeenCalledWith(cacheKey);
    expect(events).toEqual(filteredMockEvents); // Return cached events
    expect(ProviderService.prototype.fetchEvents).not.toHaveBeenCalled(); // Provider shouldn't be called
  });

  it('should filter events based on the provided date range', async () => {
    // Mock Redis to return cached data
    (getAsync as jest.Mock).mockResolvedValue(JSON.stringify(filteredMockEvents));

    const startAt = new Date('2024-06-01T19:00:00');
    const endAt = new Date('2024-08-01T22:00:00');

    const events = await eventService.getEvents(startAt, endAt);

    expect(events).toHaveLength(1); 
    expect(events[0].id).toBe('1');
  });

    it('should return an empty list of events if there is no event within the provided date range', async () => {
    // Mock Redis to return cached data
    (getAsync as jest.Mock).mockResolvedValue(JSON.stringify(filteredMockEvents));

    const startAt = new Date('2024-01-01T19:00:00');
    const endAt = new Date('2024-02-01T22:00:00');

    const events = await eventService.getEvents(startAt, endAt);

    expect(events).toHaveLength(0); 
    expect(events).toEqual([]);
  });

  it('should return an error if no events are available', async () => {
    // Mock Redis to return null (no cached data)
    (getAsync as jest.Mock).mockResolvedValue(null);

    // Mock ProviderService to return no events
    (ProviderService.prototype.fetchEvents as jest.Mock).mockResolvedValue([]);

    await expect(eventService.getEvents()).rejects.toThrow('No events available');

    expect(getAsync).toHaveBeenCalledWith(cacheKey);
    expect(ProviderService.prototype.fetchEvents).toHaveBeenCalled();
  });
});