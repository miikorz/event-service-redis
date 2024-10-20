import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Initial data fetch
import { EventService } from './application/services/eventService';

const eventService = new EventService();

eventService
  .updateEvents()
  .then(() => {
    console.log('Initial events fetched and stored in Redis');
  })
  .catch((err) => {
    console.error('Failed to fetch initial events:', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
