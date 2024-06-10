import { isolateInsideOfContainer, scopedPreflightStyles } from 'tailwindcss-scoped-preflight';
import form from '@tailwindcss/forms';
import { red } from 'tailwindcss/colors';

export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['objektiv-mk1', 'sans-serif'],
      },
      colors: {
        'error-red': red['600'],
      },
    },
  },
  plugins: [
    scopedPreflightStyles({
      isolationStrategy: isolateInsideOfContainer(['tech-carbon-estimator', '.cdk-overlay-container']),
    }),
    form,
  ],
  prefix: 'tce-',
};
