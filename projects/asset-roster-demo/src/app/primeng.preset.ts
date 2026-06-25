import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const Noir = definePreset(Aura, {
  components: {
    button: {
      root: {
        borderRadius: '2px',
      },
      colorScheme: {
        light: {
          root: {
            secondary: {
              background: '{gray.200}',
              hoverBackground: '{gray.300}',
              activeBackground: '{gray.400}',
              borderColor: '{gray.200}',
              hoverBorderColor: '{gray.300}',
              activeBorderColor: '{gray.400}',
              color: '{gray.900}',
              hoverColor: '{gray.900}',
              activeColor: '{gray.900}',
              focusRing: {
                color: '{gray.500}',
                shadow: 'none',
              },
            },
            danger: {
              background: '{red.700}',
              hoverBackground: '{red.800}',
              activeBackground: '{red.900}',
              borderColor: '{red.700}',
              hoverBorderColor: '{red.800}',
              activeBorderColor: '{red.900}',
              color: '#ffffff',
              hoverColor: '#ffffff',
              activeColor: '#ffffff',
              focusRing: {
                color: '{red.700}',
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
      50: '{gray.50}',
      100: '{gray.100}',
      200: '{gray.200}',
      300: '{gray.300}',
      400: '{gray.400}',
      500: '{gray.500}',
      600: '{gray.600}',
      700: '{gray.700}',
      800: '{gray.800}',
      900: '{gray.900}',
      950: '{gray.950}',
    },

    accent: {
      950: '#c8a026',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{gray.800}',
          inverseColor: '#ffffff',
          hoverColor: '{gray.900}',
          activeColor: '{gray.950}',
        },
        highlight: {
          background: '{gray.800}',
          focusBackground: '{gray.900}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
        accent: {
          color: '#c8a026',
        },
      },
      dark: {
        primary: {
          color: '{gray.100}',
          inverseColor: '{gray.950}',
          hoverColor: '{gray.200}',
          activeColor: '{gray.300}',
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
