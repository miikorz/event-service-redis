import axios from 'axios';
import xml2js from 'xml2js';
import { ProviderService } from '../infrastructure/external/providerService';
import { mockSingleEventData, mockSingleEventParsedData, mockEventsData, mockParsedEventsData } from './mocks/providerService.mock';

// Mock dependencies
jest.mock('axios', () => ({
    get: jest.fn()
}));

jest.mock('xml2js', () => ({
    parseStringPromise: jest.fn()
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedXml2js = xml2js as jest.Mocked<typeof xml2js>;

describe('ProviderService', () => {
  let providerService: ProviderService;

  beforeEach(() => {
    providerService = new ProviderService();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  it('should fetch and parse events successfully', async () => {
    // Mock axios and xml2js behavior
    mockedAxios.get.mockResolvedValue({ data: mockSingleEventData });
    mockedXml2js.parseStringPromise.mockResolvedValue(mockSingleEventParsedData);

    const result = await providerService.fetchEvents();

    expect(mockedAxios.get).toHaveBeenCalledWith(process.env.PROVIDER_URL, { headers: { 'Content-Type': 'application/xml' } });
    expect(mockedXml2js.parseStringPromise).toHaveBeenCalledWith(mockSingleEventData, { explicitArray: false, mergeAttrs: true });

    expect(result).toEqual([
      {
        baseEventId: 1,
        sellMode: 'online',
        title: 'Event 1',
        events: [
          {
            id: '100',
            title: 'Event 1',
            start_date: '2023-10-12',
            start_time: '20:00:00',
            end_date: '2023-10-12',
            end_time: '22:00:00',
            min_price: 50,
            max_price: 50
          }
        ]
      }
    ]);
  });

  it('should handle an array of base events correctly', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockEventsData });
    mockedXml2js.parseStringPromise.mockResolvedValue(mockParsedEventsData);

    const result = await providerService.fetchEvents();

    expect(result).toEqual([
      {
        baseEventId: 1,
        sellMode: 'online',
        title: 'Event 1',
        events: [
          {
            id: '100',
            title: 'Event 1',
            start_date: '2023-10-12',
            start_time: '20:00:00',
            end_date: '2023-10-12',
            end_time: '22:00:00',
            min_price: 50,
            max_price: 50
          }
        ]
      },
      {
        baseEventId: 2,
        sellMode: 'offline',
        title: 'Event 2',
        events: [
          {
            id: '101',
            title: 'Event 2',
            start_date: '2023-10-13',
            start_time: '20:00:00',
            end_date: '2023-10-13',
            end_time: '22:00:00',
            min_price: 100,
            max_price: 100
          }
        ]
      }
    ]);
  });

  it('should handle provider errors gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));

    await expect(providerService.fetchEvents()).rejects.toThrow('Network Error');
    expect(mockedAxios.get).toHaveBeenCalled();
  });
});
