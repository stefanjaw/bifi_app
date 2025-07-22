import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

console.log('Prime AURA Preset', Aura);

export const Noir = definePreset(Aura, {
  components: {
    button: {
      colorScheme: {
        light: {
          root: {
            secondary: {
              background: '{indigo.600}',
              hoverBackground: '{indigo.700}',
              activeBackground: '{indigo.800}',
              borderColor: '{indigo.600}',
              hoverBorderColor: '{indigo.700}',
              activeBorderColor: '{indigo.800}',
              color: '#ffffff',
              hoverColor: '#ffffff',
              activeColor: '#ffffff',
              focusRing: {
                color: '{indigo.600}',
                shadow: 'none',
              },
            },
          },
        },
      },
    },
  },
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },

    accent: {
      950: '#c8a026',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{blue.600}', // más suave que 700 u 800
          inverseColor: '#ffffff',
          hoverColor: '{blue.700}',
          activeColor: '{blue.800}',
        },
        highlight: {
          background: '{blue.600}',
          focusBackground: '{blue.700}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
        accent: {
          color: '#c8a026',
        },
      },
      dark: {
        primary: {
          color: '{blue.100}',
          inverseColor: '{blue.950}',
          hoverColor: '{blue.200}',
          activeColor: '{blue.300}',
        },
        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
      },
    },
  },
});

console.log('');
