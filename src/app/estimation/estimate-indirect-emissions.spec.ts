import { Cloud } from '../carbon-estimator';
import { estimateIndirectEmissions } from './estimate-indirect-emissions';

it('should return no emissions if cloud not used', () => {
  const input: Cloud = {
    noCloudServices: true,
    cloudPercentage: 100,
    monthlyCloudBill: { min: 5000, max: 10000 },
    cloudLocation: 'global',
  };
  const result = estimateIndirectEmissions(input);
  expect(result).toEqual({
    cloud: 0,
    saas: 0,
    managed: 0,
  });
});

it('should return emissions based on ratio of costs', () => {
  const input: Cloud = {
    noCloudServices: false,
    cloudPercentage: 50,
    monthlyCloudBill: { min: 0, max: 200 },
    cloudLocation: 'global',
  };
  const result = estimateIndirectEmissions(input);
  expect(result.cloud).toBeCloseTo(10.733552);
  expect(result.saas).toBe(0);
  expect(result.managed).toBe(0);
});
