import { renderToString } from 'react-dom/server';
import { RemixServer } from '@remix-run/react';
import type { EntryContext } from '@remix-run/node';
import { ServerStyleSheet } from 'styled-components';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const { matches, routeData } = remixContext;
  const url = new URL(request.url);

  const sheet = new ServerStyleSheet();

  let markup = renderToString(
    sheet.collectStyles(<RemixServer context={remixContext} url={request.url} />)
  );

  const match = matches.find((m) => m.pathname === url.pathname);

  const canonical = match?.route?.id && routeData?.[match.route.id]?.canonical;

  if (canonical) {
    responseHeaders.set('Link', `<${process.env.CANONICAL_URL}/${canonical}>; rel="canonical"`);
  }

  const styles = sheet.getStyleTags();
  markup = markup.replace('__STYLES__', styles);

  responseHeaders.set('Content-Type', 'text/html');

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
