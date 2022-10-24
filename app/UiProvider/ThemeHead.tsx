// Script for setting theme
// How does it work -> https://www.mattstobbs.com/remix-dark-mode/
import { prefersDarkMQ } from './UiProvider';

const clientThemeCode = `
;(() => {
  const isMainPage = window.location.pathname.includes('exchange'); // dark theme is accepted only for main page
  const theme = isMainPage && window.matchMedia(${JSON.stringify(prefersDarkMQ)}).matches
    ? 'dark'
    : 'light';

  const cl = document.documentElement.classList;
  const themeAlreadyApplied = cl.contains('light') || cl.contains('dark');
  if (!themeAlreadyApplied) {
    cl.add(theme);
  }
})();
`;

export function ThemeHead({ ssrTheme }: { ssrTheme: boolean }) {
  return <>{ssrTheme ? null : <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} />}</>;
}
