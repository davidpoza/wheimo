/* eslint-disable no-restricted-globals */
self.addEventListener('push', (e) => {
  const data = e.data.json();
  console.log('Notification Received', data);
  self.registration.showNotification(data.title, {
    body: data.content,
  });
});
