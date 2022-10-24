import { createCookieSessionStorage } from '@remix-run/node';

import { isTheme } from './UiProvider';
import type { THEME_TYPES } from '~/constants';

const sessionSecret = process.env.COOKIE_SESSION_SECRET ?? 'defaultkey';

if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: 'yad_ui_settings',
    secure: true,
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
  },
});

async function getUiSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get('Cookie'));
  return {
    getTheme: () => {
      const themeValue = session.get('theme');
      return isTheme(themeValue) ? themeValue : null;
    },
    setTheme: (theme: THEME_TYPES) => session.set('theme', theme),
    commit: () => themeStorage.commitSession(session),
  };
}

export { getUiSession };
