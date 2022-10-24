module.exports = {
  content: ['./app/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        12.5: '50px',
        15: '60px',
      },
      screens: {
        xs: '480px',
      },
      borderRadius: {
        '2lg': '0.625rem',
        '2.5xl': '1.25rem',
      },
      fontSize: {
        xss: ['0.625rem', '0.875rem'],
        '4.5xl': ['2.875rem', '3.5rem'],
        '50p': ['3.125rem', '1.2'],
      },
      blur: {
        '2.5xl': '50px',
      },
      width: {
        50: '12.5rem',
      },
      height: {
        50: '12.5rem',
      },
      willChange: {
        right: 'right',
      },
      boxShadow: {
        base: '-5px 5px 60px rgba(0, 0, 0, 0.1)',
        lightBase: '0px 2px 10px rgba(0, 0, 0, 0.05)',
        lightDarkShadow: '0px 2px 10px rgba(255, 255, 255, 0.05)',
        middleDarkShadow: '0px 1px 6px rgba(255, 255, 255, 0.2)',
        darkShadow: '-5px 5px 60px rgba(255, 255, 255, 0.1);',
      },
    },
    colors: {
      transparent: 'transparent',
      green: '#00633A',
      darkGreen: '#004a2c',
      red: '#FF809E',
      darkRed: '#D82423',
      blue: '#0080D0',
      darkBlue: '#2F5CE2',
      yellow: '#FEFC9E',
      actionBlue: '#1268BB;',
      lightBlue: '#2BB6F2',
      orange: '#FB5400',
      lightOrange: '#D44700',
      orangeSecondary: '#FEBB99',
      black: '#000',
      gray: '#A0A0A0',
      graySecondary: '#6F6F6F',
      grayTretiary: '#D5D5D5',
      gray400: '#6E6E6E',
      gray500: '#303030',
      lightGray: '#F2F2F2',
      white: '#FFF',
      lightBlack: '#212121',
      dark: '#0F0F0F',
    },
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
    },
  },
  plugins: [],
};
