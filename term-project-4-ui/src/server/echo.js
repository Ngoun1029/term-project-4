import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Initialize Laravel Echo with Pusher
const echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.REACT_APP_PUSHER_APP_KEY, // Store Pusher key in .env file or use hardcoded values
  cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
  forceTLS: true,
});

export default echo;
