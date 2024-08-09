import { CostRange } from '../types/carbon-estimator';
import { compareCostRanges } from './cost-range';

describe('compareCostRanges', () => {
  it('should return true when the cost ranges are the same', () => {
    const range1: CostRange = {
      min: 10,
      max: 20,
    };
    const range2: CostRange = {
      min: 10,
      max: 20,
    };

    expect(compareCostRanges(range1, range2)).toBeTrue();
  });

  it('should return false when the cost ranges have different min values', () => {
    const range1: CostRange = {
      min: 5,
      max: 20,
    };
    const range2: CostRange = {
      min: 10,
      max: 20,
    };

    expect(compareCostRanges(range1, range2)).toBeFalse();
  });

  it('should return false when the cost ranges have different max values', () => {
    const range1: CostRange = {
      min: 10,
      max: 20,
    };
    const range2: CostRange = {
      min: 10,
      max: 30,
    };

    expect(compareCostRanges(range1, range2)).toBeFalse();
  });
});
