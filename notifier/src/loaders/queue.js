import Queue from 'bee-queue';
import webpush from 'web-push';
import Config from '../config/config.js';

const notificationsQueue = new Queue(Config.notificationsQueue, {
  redis: {
    host: 'redis',
  },
});
notificationsQueue.process(function (job, done) {
  console.log(`>>>>>>>>>>>>>>Notifier procesando ${job.id}`);

  // @TODO: Aquí se intentará entregar todas las notificaciones push a sus correspondientes usuarios
  // si tiene éxito la entrega entonces marcamos el job como "succeeded", si no, lo seguimos dejando en waiting.
  // tendrá que haber un scheduler reintentando enviar aquellos job en espera
  // const subscription = leemos de lowdb el subscription que tenga userId indicado en el job
  // webpush.sendNotification(subscription, { datos del job });
  return done(null);
});

export default notificationsQueue;
