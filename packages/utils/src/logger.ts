import { pino } from 'pino';

const today = new Date();
const dateTag = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

const transport = pino.transport({
  targets: [
    {
      level: 'info',
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
        singleLine: false,
        customColors: 'info:cyan,warn:yellow,error:red,debug:magenta',
      },
    },
    {
      level: 'debug',
      target: 'pino/file',
      options: {
        destination: `${process.cwd()}/logs/${dateTag}.log`,
        mkdir: true,
      },
    },
  ],
});

const logger = pino({ level: 'debug' }, transport);

export function info(msg: string): void {
  logger.info(msg);
}

export function warn(msg: string): void {
  logger.warn(msg);
}

export function error(msg: string, ex?: Error): void {
  if (ex) logger.error(ex, msg);
  else logger.error(msg);
}

export function debug(msg: string): void {
  logger.debug(msg);
}

export function ok(msg: string): void {
  logger.info(`✓ ${msg}`);
}
