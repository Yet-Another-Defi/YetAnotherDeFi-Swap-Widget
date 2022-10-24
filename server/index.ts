import * as Sentry from '@sentry/node';
import path from 'path';
import '@sentry/tracing';
import { createRequestHandler } from '@remix-run/express';
import express from 'express';
import compression from 'compression';
import { createLogger, format, transports } from 'winston';

import { registerSentry, sentryLoadContext } from './sentry-remix-node';

const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp, response_code, request, original_url }) => {
  return JSON.stringify({
    level,
    ...(message && { message }),
    ...(request && { request }),
    ...(original_url && { original_url }),
    ...(response_code && { response_code }),
    timestamp,
  });
});

const logger = createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    myFormat
  ),
  transports: [new transports.Console()],
});

const BUILD_DIR = path.join(process.cwd(), 'build');
const MODE = process.env.NODE_ENV === 'development' ? 'development' : 'production';

function loadBuild() {
  let build = require(BUILD_DIR);

  build = registerSentry(build);
  return build;
}

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.3,
});

const app = express();

app.use('/build', express.static('public/build', { immutable: true, maxAge: '1y' }));

app.use(express.static('public', { maxAge: '1h' }));

app.all(
  '*',
  MODE === 'production'
    ? createRequestHandler({
        build: loadBuild(),
        mode: MODE,
        getLoadContext: sentryLoadContext(logger),
      })
    : async (req, res, next) => {
        try {
          purgeRequireCache(BUILD_DIR);
          return createRequestHandler({
            build: loadBuild(),
            mode: MODE,
            getLoadContext: sentryLoadContext(logger),
          })(req, res, next);
        } catch (err) {
          logger.error(err);
          next(err);
        }
      }
);

app.use(compression());

app.listen(process.env.PORT || 3000, () => {
  logger.info(`App started on ${process.env.PORT || 3000} in ${MODE} mode`);
});

function purgeRequireCache(file: string) {
  let resolved = require.resolve(file);
  for (let key in require.cache) {
    if (key.startsWith(resolved)) {
      delete require.cache[key];
    }
  }
}
