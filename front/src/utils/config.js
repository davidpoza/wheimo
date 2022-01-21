const config = {
  API_HOST: process.env.REACT_APP_API_HOST || 'http://localhost:3001',
  APP_HOST: process.env.REACT_APP_URL || 'http://localhost:3000',
  NOTIFIER_HOST: process.env.REACT_APP_NOTIFIER_HOST || 'http://localhost:3002',
  PUBLIC_VAPID_KEY: process.env.REACT_APP_PUBLIC_VAPID_KEY,
  LOCALSTORAGE_KEY: 'wheimo_redux_store',
};
export default config;
