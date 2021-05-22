import Queue from 'bee-queue';
import Config from '../config/config.js';
import NotificationService from '../services/notification.js';

export default class QueueLoader {
  constructor() {
    this.notificationsQueue = new Queue(Config.notificationsQueue, {
      redis: {
        host: 'redis',
      },
    });
    const notificationService = new NotificationService();
    this.notificationsQueue.process(notificationService.processJob);
  }
};


