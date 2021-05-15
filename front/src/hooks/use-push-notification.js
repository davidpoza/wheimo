import { useState, useEffect } from 'react';
import Config from '../utils/config';

export default function usePushNotifications(token) {
  const [userSubscription, setUserSubscription] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  function isPushNotificationSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }

  function registerServiceWorker() {
    return navigator.serviceWorker.register('./sw.js');
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async function createSubscription() {
    const sw = await navigator.serviceWorker.ready;
    return sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(Config.PUBLIC_VAPID_KEY),
    });
  }

  async function getExistingSubscription() {
    const sw = await navigator.serviceWorker.ready;
    return sw.pushManager.getSubscription();
  }

  const sendSubscription = (sub) => {
    (async () => {
      setLoading(true);
      setError(false);
      try {
        await fetch(`${Config.NOTIFIER_HOST}/subscription?auth=${token}`, {
          method: 'POST',
          body: JSON.stringify(sub),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err);
      }
    })();
  };

  const pushNotificationSupported = isPushNotificationSupported();

  useEffect(() => {
    (async () => {
      if (pushNotificationSupported) {
        setLoading(true);
        setError(false);
        try {
          await registerServiceWorker();
          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      }
    })();
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    (async () => {
      let sub = await getExistingSubscription();
      if (!sub) {
        sub = await createSubscription();
      }
      sendSubscription(sub);
      setUserSubscription(sub);
      setLoading(false);
    })();
  }, []);

  return {
    userSubscription,
    sendSubscription,
    error,
    loading,
  };
}
