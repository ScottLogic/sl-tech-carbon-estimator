import { CostRange } from '../types/carbon-estimator';

export const compareCostRanges = (r1: CostRange, r2: CostRange) => {
  return r1.min === r2.min && r1.max === r2.max;
};
