// cookie session for themes
// How does it work -> https://www.mattstobbs.com/remix-dark-mode/
import { json, redirect } from '@remix-run/node';
import { type ActionFunction, type LoaderFunction } from '@remix-run/node';

import { getUiSession, isTheme } from '~/UiProvider';

export const action: ActionFunction = async ({ request }) => {
  const uiSession = await getUiSession(request);

  const requestText = await request.text();

  const form = new URLSearchParams(requestText);

  const theme = form.get('theme');

  if (!isTheme(theme)) {
    return json({
      success: false,
      message: `theme value of ${theme} is not a valid theme`,
    });
  }

  uiSession.setTheme(theme);

  return json({ success: true }, { headers: { 'Set-Cookie': await uiSession.commit() } });
};

export const loader: LoaderFunction = () => redirect('/', { status: 404 });
