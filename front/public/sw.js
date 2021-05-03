/* eslint-disable no-restricted-globals */
self.addEventListener('push', (e) => {
  const data = e.data.json();
  console.log(data);
  console.log('Notification Received');
  self.registration.showNotification(data.title, {
    body: data.message,
  });
});
