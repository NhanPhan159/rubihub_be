import winston, { createLogger, transports, format } from 'winston';

export const logger = createLogger({
  levels: winston.config.syslog.levels,
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  transports: [
    // Write all logs with level `info` and below to `combined.log`.
    new transports.File({ filename: 'combined.log' }),
    // Write all logs error (and below) to `error.log`.
    new transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

if (process.env.NODE_ENV === 'development') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}
