import { isolateInsideOfContainer, scopedPreflightStyles } from 'tailwindcss-scoped-preflight';
import form from '@tailwindcss/forms';

export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['objektiv-mk1', 'sans-serif'],
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
