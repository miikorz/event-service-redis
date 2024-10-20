import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { BaseEvent, Event } from '../../domain/models/Event';
import dotenv from 'dotenv';
import { formatSpecificDate, getMaxPriceFromZones, getMinPriceFromZones } from './utils';

dotenv.config();

const PROVIDER_URL = process.env.PROVIDER_URL;

export class ProviderService {
  async fetchEvents(): Promise<BaseEvent[]> {
    try {
      const response = await axios.get(PROVIDER_URL, {
        headers: { 'Content-Type': 'application/xml' },
      });
      const result = await parseStringPromise(response.data, {
        explicitArray: false,
        mergeAttrs: true,
      });
      const eventList = result.eventList.output.base_event;
      // Handle single or multiple base_event entries
      const baseEvents = Array.isArray(eventList) ? eventList : [eventList];

      return baseEvents.map((be: any) => ({
        baseEventId: parseInt(be.base_event_id, 10),
        sellMode: be.sell_mode,
        organizerCompanyId: be.organizer_company_id
          ? parseInt(be.organizer_company_id, 10)
          : undefined,
        title: be.title,
        events: Array.isArray(be.event)
          ? be.event.map(() => this.parseEvent(be.event, be.title))
          : [this.parseEvent(be.event, be.title)],
      }));
    } catch (error) {
      console.error('Error fetching events from provider:', error);
      throw error;
    }
  }

  // * Should be a value object?
  private parseEvent(event: any, title: string): Event {
    const startDate = new Date(event.event_start_date);
    const endDate = new Date(event.event_end_date);

    return {
      id: event.event_id,
      title,
      start_date: formatSpecificDate(startDate),
      start_time: new Date(event.event_start_date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      end_date: formatSpecificDate(endDate),
      end_time: new Date(event.event_end_date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      min_price: Array.isArray(event.zone) ? getMinPriceFromZones(event.zone) : parseInt(event.zone.price),
      max_price: Array.isArray(event.zone) ? getMaxPriceFromZones(event.zone) : parseInt(event.zone.price),
    };
  }
}
