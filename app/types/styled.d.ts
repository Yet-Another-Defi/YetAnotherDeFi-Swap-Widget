import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      transparent: string;
      green: string;
      darkGreen: string;
      red: string;
      darkRed: string;
      blue: string;
      darkBlue: string;
      yellow: string;
      actionBlue: string;
      lightBlue: string;
      orange: string;
      lightOrange: string;
      orangeSecondary: string;
      black: string;
      gray: string;
      graySecondary: string;
      grayTretiary: string;
      lightGray: string;
      white: string;
      lightBlack: string;
      dark: string;
    };
  }
}
