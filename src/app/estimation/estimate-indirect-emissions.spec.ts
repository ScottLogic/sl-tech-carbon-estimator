import { Cloud } from '../types/carbon-estimator';
import { estimateIndirectEmissions } from './estimate-indirect-emissions';

it('should return no emissions if cloud not used', () => {
  const input: Cloud = {
    noCloudServices: true,
    cloudPercentage: 100,
    monthlyCloudBill: { min: 5000, max: 10000 },
    cloudLocation: 'WORLD',
  };
  const result = estimateIndirectEmissions(input);
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
  const result = estimateIndirectEmissions(input);
  expect(result.cloud).toBeCloseTo(128.78);
  expect(result.saas).toBe(0);
  expect(result.managed).toBe(0);
});
