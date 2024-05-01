import { isolateInsideOfContainer, scopedPreflightStyles } from 'tailwindcss-scoped-preflight';
import  form  from '@tailwindcss/forms';

export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  plugins: [
    scopedPreflightStyles({
      isolationStrategy: isolateInsideOfContainer('tech-carbon-estimator'),
    }),
    form
],
};
