import winston from 'winston';
import config from '../config/config.js';
import 'winston-daily-rotate-file';

const transports = [];
if(process.env.NODE_ENV === 'development') {
  transports.push(
    new winston.transports.Console()
  )
} else {
  transports.push(
    new (winston.transports.DailyRotateFile)({
      filename: 'logs/%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  )
}

const LoggerInstance = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
        format: 'DD-MM-YYYY HH:mm:ss'
    }),
    winston.format.printf(info => {
        let ret = {};
        ret.message = info.message || '';
        ret.ip = info.req? utils.getIp(info.req) : '';
        ret.timestamp = info.timestamp || '';
        ret.status = info.status || '';
        ret.level = info.level || '';
        ret.method = info.req? info.req.method : '';
        ret.stack = info.stack? info.stack : '';
        ret.path = info.req? info.req.originalUrl : '';

        return (`[${ret.timestamp}] ${ret.ip} {${ret.level}} ${ret.method}//${ret.status}//${ret.path} - ${ret.message} ${ret.stack}`);
    })
  ),
  transports
});

export default LoggerInstance;