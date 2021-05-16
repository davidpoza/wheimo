import { Container } from 'typedi';

export default class NotificationService {
  constructor() {
    this.webpush = Container.get('webpush');
    this.db = Container.get('lowdb');
    this.processJob = this.processJob.bind(this);
  }

  async processJob(job, done) {
    // @TODO: Aquí se intentará entregar todas las notificaciones push a sus correspondientes usuarios
    // si tiene éxito la entrega entonces marcamos el job como "succeeded", si no, lo seguimos dejando en waiting.
    // tendrá que haber un scheduler reintentando enviar aquellos job en espera
    // const subscription = leemos de lowdb el subscription que tenga userId indicado en el job
    const { userId } = job.data;

    const existingSubscription  = this.db
      .get('subscriptions')
      .find({ userId })
      .value();
    console.log("SUB ENCONTRADA", existingSubscription)
    if (existingSubscription) {
      delete job.data.userId;
      try {
        await this.webpush.sendNotification(existingSubscription, JSON.stringify(job.data));

      } catch (error) {
        console.log(">>>>>>>>>>>FALLO AL ENVIAR PUSH NOT", error)
      }

    }
    return done(null);
  }


};