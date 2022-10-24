import type { DataFunctionArgs } from '@remix-run/server-runtime';
import type { Logger } from 'winston';

export interface LoaderFunctionArgs {
  params: DataFunctionArgs['params'];
  context: { logger: Logger };
  request: DataFunctionArgs['request'];
}
