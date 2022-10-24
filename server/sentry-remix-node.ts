import type { Transaction } from '@sentry/types';
import { Response } from 'express';
import type { Request } from 'express';
import type { ServerBuild } from '@remix-run/node';
import * as Sentry from '@sentry/node';
import { v4 as uuid } from 'uuid';
import type { DataFunctionArgs } from '@remix-run/server-runtime';
import type { Logger } from 'winston';

function isErrorResponse(response: any) {
  return response instanceof Response && response.headers.get('X-Remix-Error') != null;
}

function wrapDataFunc(func: (...args: any[]) => any, routeId: string, method: string) {
  const originalFunction = func;

  return async (...args: DataFunctionArgs[]) => {
    const parentTransaction: Transaction = args[0].context && args[0].context.__sentry_transaction;
    const transaction =
      parentTransaction &&
      parentTransaction.startChild({
        op: `${method}:${routeId}`,
        description: `${method}: ${routeId}`,
      });
    transaction && transaction.setStatus('ok');
    transaction && (transaction.transaction = parentTransaction);

    try {
      return await originalFunction(...args);
    } catch (error) {
      if (isErrorResponse(error)) {
        throw error;
      }

      Sentry.captureException(error, {
        tags: {
          global_id: parentTransaction && parentTransaction.tags['global_id'],
        },
      });
      transaction.setStatus('internal_error');
      throw error;
    } finally {
      transaction && transaction.finish();
    }
  };
}

export function registerSentry(build: ServerBuild) {
  let routes: Record<string, typeof build['routes'][string]> = {};

  for (let [id, route] of Object.entries(build.routes)) {
    let newRoute = { ...route, module: { ...route.module } };

    if (route.module.action) {
      newRoute.module.action = wrapDataFunc(route.module.action, id, 'action');
    }

    if (route.module.loader) {
      newRoute.module.loader = wrapDataFunc(route.module.loader, id, 'loader');
    }

    routes[id] = newRoute;
  }

  return {
    ...build,
    routes,
  };
}

export const sentryLoadContext = (logger: Logger) => (req: Request, res: Response) => {
  const transaction = Sentry.getCurrentHub().startTransaction({
    op: 'request',
    name: `${req.method}: ${req.url}`,
    description: `${req.method}: ${req.url}`,
    metadata: {
      requestPath: req.url,
    },
    tags: {
      global_id: uuid(),
    },
  });
  transaction && transaction.setStatus('internal_error');

  res.once('finish', () => {
    if (transaction) {
      transaction.setHttpStatus(res.statusCode);
      transaction.setTag('http.status_code', res.statusCode);
      transaction.setTag('http.method', req.method);
      transaction.finish();
    }
  });

  return {
    __sentry_transaction: transaction,
    logger,
  };
};
