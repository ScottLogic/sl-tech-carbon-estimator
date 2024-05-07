import { Cloud } from '../types/carbon-estimator';
import { estimateIndirectEmissions } from './estimate-indirect-emissions';

describe('estimateIndirectEmissions()', () => {
  const carbonIntensity = 500;

  it('should return no emissions if cloud not used', () => {
    const input: Cloud = {
      noCloudServices: true,
      cloudPercentage: 100,
      monthlyCloudBill: { min: 5000, max: 10000 },
      cloudLocation: 'WORLD',
    };

    const result = estimateIndirectEmissions(input, carbonIntensity);
    expect(result).toEqual({
      cloud: 0,
      saas: 0,
      managed: 0,
    });
  });

  it('should return emissions based on ratio of costs, expanded to a years usage', () => {
    const input: Cloud = {
      noCloudServices: false,
      cloudPercentage: 50,
      monthlyCloudBill: { min: 0, max: 200 },
      cloudLocation: 'WORLD',
    };
    const result = estimateIndirectEmissions(input, carbonIntensity);
    expect(result.cloud).toBeCloseTo(130.13);
    expect(result.saas).toBe(0);
    expect(result.managed).toBe(0);
  });
});
