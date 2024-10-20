import { Request, Response } from 'express';
import { EventService } from '../../application/services/eventService';
import { SERVER_MESSAGES, SERVER_STATUS } from '../apiConstants';

const eventService = new EventService();

export const getEvents = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const noQueryParams = Object.keys(req.query).length === 0;
    let events;

    if(noQueryParams) {
      events = await eventService.getEvents();
      res.status(200).json({ data: {events}, error: null });
    } else {
      const { starts_at, ends_at } = req.query;

      if (!starts_at || !ends_at) {
          res.status(400).json({ error: { code: SERVER_STATUS.MISSING_PARAMS, message: SERVER_MESSAGES[SERVER_STATUS.MISSING_PARAMS]}, data: null });
      } else {
        const startAt = new Date(starts_at as string);
        const endAt = new Date(ends_at as string);
    
        events = await eventService.getEvents(startAt, endAt);
        res.status(200).json({ data: {events}, error: null });
      }
    }
  } catch (error) {
    res.status(500).json({ error: { code: SERVER_STATUS.INTERNAL_SERVER_ERROR, message: SERVER_MESSAGES[SERVER_STATUS.INTERNAL_SERVER_ERROR]}, data: null });
  }
};
